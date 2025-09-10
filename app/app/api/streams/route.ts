import { prisma } from "@/app/lib/db";
import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
const youtubesearchapi = require("youtube-search-api");

var yt_regex =
  /^(?:(?:https?:)?\/\/)?(?:www\.)?(?:m\.)?(?:youtu(?:be)?\.com\/(?:v\/|embed\/|watch(?:\/|\?v=))|youtu\.be\/)((?:\w|-){11})(?:\S+)?$/;

const StreamSchema = z.object({
  creatorId: z.string(),
  url: z.string(),
});

export async function POST(req: NextRequest) {
  try {
    // Get authenticated user
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          message: "Unauthorized - Please sign in",
        },
        {
          status: 401,
        }
      );
    }

    console.log("Authenticated user ID:", session.user.id);

    // verify user exists in database
    if (!session.user.email) {
      return NextResponse.json(
        { message: `unauthenticated` },
        { status: 401 }
      );
    }
    const existingUser = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
    });

    if (!existingUser) {
      return NextResponse.json(
        { message: "User not found in database" },
        { status: 403 }
      );
    }

    const body = await req.json();
    console.log("Request body:", body);

    // Validate URL only, we'll use the authenticated user's ID
    const validatedData = z
      .object({
        url: z.string().url("Invalid URL format"), // Add URL validation here
      })
      .safeParse(body);

    if (!validatedData.success) {
      return NextResponse.json(
        {
          message: "Validation error",
          errors: validatedData.error.issues,
        },
        {
          status: 400,
        }
      );
    }

    const isYtUrl = validatedData.data.url.match(yt_regex);

    if (!isYtUrl) {
      return NextResponse.json(
        {
          message: "Provided URL is not a valid YouTube URL",
        },
        {
          status: 411,
        }
      );
    }

    // Extract YouTube video ID from URL
    let extractedId: string;
    console.log("Extracting ID from URL:", validatedData.data.url);

    try {
      const url = new URL(validatedData.data.url);
      if (url.hostname === "youtu.be") {
        extractedId = url.pathname.slice(1);
      } else if (
        url.hostname === "www.youtube.com" ||
        url.hostname === "youtube.com" ||
        url.hostname === "m.youtube.com"
      ) {
        if (url.pathname.includes("/watch")) {
          extractedId = url.searchParams.get("v") || "";
        } else if (url.pathname.includes("/embed/")) {
          extractedId = url.pathname.split("/embed/")[1]?.split(/[?&#]/)[0];
        } else if (url.pathname.includes("/v/")) {
          extractedId = url.pathname.split("/v/")[1]?.split(/[?&#]/)[0];
        } else {
          // Fallback to regex for other youtube.com patterns
          const match = validatedData.data.url.match(yt_regex);
          extractedId = match ? match[1] : "";
        }
      } else {
        // Fallback to regex if none of the above specific cases match
        const match = validatedData.data.url.match(yt_regex);
        extractedId = match ? match[1] : "";
      }

      console.log("Extracted ID:", extractedId);

      if (!extractedId) {
        throw new Error("Could not extract video ID");
      }
    } catch (error) {
      console.error("Error extracting video ID:", error);
      return NextResponse.json(
        {
          message: "Could not extract video ID from URL",
        },
        {
          status: 400,
        }
      );
    }

    let videoDetails;
    try {
      videoDetails = await youtubesearchapi.GetVideoDetails(extractedId);
      console.log("YouTube Video Details:", videoDetails);

      if (!videoDetails || !videoDetails.title) {
        console.warn("YouTube API returned no title or malformed response.");
        return NextResponse.json(
          {
            message: "Could not retrieve video details from YouTube API.",
          },
          {
            status: 404, // Not Found, or 424 Failed Dependency
          }
        );
      }
    } catch (apiError) {
      console.error("Error fetching video details from YouTube API:", apiError);
      return NextResponse.json(
        {
          message: "Failed to fetch video details from YouTube API.",
          error: apiError instanceof Error ? apiError.message : String(apiError),
        },
        {
          status: 502, // Bad Gateway or 500
        }
      );
    }

    // Now, safely access 'thumbnail'
    let thumbnails = videoDetails.thumbnail?.thumbnails || [];

    // Ensure thumbnails is an array before sorting
    if (!Array.isArray(thumbnails) || thumbnails.length === 0) {
      console.warn("No thumbnails found for the video. Using default images.");
      // Provide default fallbacks if no thumbnails are available
      thumbnails = [
        {
          url: "https://t4.ftcdn.net/jpg/01/77/43/63/360_F_177436300_PN50VtrZbrdxSAMKIgbbOIU90ZSCn8y3.jpg",
          width: 360,
          height: 202,
        },
      ];
    } else {
      thumbnails.sort((a: { width: number }, b: { width: number }) =>
        a.width < b.width ? -1 : 1
      );
    }

    // Create stream in database
    const streamData = {
      userId: existingUser.id, // Use DB user id to satisfy FK
      url: validatedData.data.url,
      type: "Youtube" as const,
      extractedId: extractedId,
      title: videoDetails.title ?? "Can't find Video Title",
      smallImg:
        thumbnails.length > 1
          ? thumbnails[thumbnails.length - 2].url // Second largest
          : thumbnails[0].url, // Fallback to largest if only one
      bigImg: thumbnails[thumbnails.length - 1].url, // Largest
    };

    console.log("Stream data to be created:", streamData);

    const stream = await prisma.stream.create({
      data: streamData,
    });

    return NextResponse.json(
      {
        message: "Stream added successfully",
        extractedId: extractedId,
        id: stream.id,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("General error in POST /api/streams:", error);
    return NextResponse.json(
      {
        message: "An unexpected error occurred while processing the stream.",
        error: error instanceof Error ? error.message : String(error),
      },
      {
        status: 500,
      }
    );
  }
}

export async function GET(req: NextRequest) {
  const creatorId = req.nextUrl.searchParams.get("creatorId");

  if (!creatorId) {
    return NextResponse.json(
      { message: `Missing creatorId parameter` },
      { status: 400 }
    );
  }
  const streams = await prisma.stream.findMany({
    where: {
      userId: creatorId,
    },
  });

  return NextResponse.json({
    streams,
  });
}