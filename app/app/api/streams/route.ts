import { prisma } from "@/app/lib/db";
import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
const youtubesearchapi = require("youtube-search-api");

// Regex from your original code
var yt_regex =
  /^(?:(?:https?:)?\/\/)?(?:www\.)?(?:m\.)?(?:youtu(?:be)?\.com\/(?:v\/|embed\/|watch(?:\/|\?v=))|youtu\.be\/)((?:\w|-){11})(?:\S+)?$/;

export async function POST(req: NextRequest) {
  try {
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

    const existingUser = await prisma.user.findUnique({
      where: {
        email: session.user?.email || "", // Handle potential null email
      },
    });

    if (!existingUser) {
      return NextResponse.json(
        { message: "User not found in database" },
        { status: 403 }
      );
    }

    const body = await req.json();

    const validatedData = z
      .object({
        url: z.string().url("Invalid URL format"),
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

    const urlString = validatedData.data.url;
    const isYtUrl = urlString.match(yt_regex);

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

    let extractedId: string;
    try {
      const urlObj = new URL(urlString);
      if (urlObj.hostname.includes("youtu.be")) {
        extractedId = urlObj.pathname.slice(1);
      } else if (
        urlObj.hostname.includes("youtube.com")
      ) {
        if (urlObj.pathname.includes("/watch")) {
          extractedId = urlObj.searchParams.get("v") || "";
        } else if (urlObj.pathname.includes("/embed/")) {
          extractedId = urlObj.pathname.split("/embed/")[1]?.split(/[?&#]/)[0];
        } else if (urlObj.pathname.includes("/v/")) {
          extractedId = urlObj.pathname.split("/v/")[1]?.split(/[?&#]/)[0];
        } else {
          const match = urlString.match(yt_regex);
          extractedId = match ? match[1] : "";
        }
      } else {
        const match = urlString.match(yt_regex);
        extractedId = match ? match[1] : "";
      }

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
      console.log("YouTube API Raw Video Details Response:", JSON.stringify(videoDetails, null, 2));

      if (!videoDetails || !videoDetails.title) {
        console.warn("YouTube API returned no title or malformed response.");
        return NextResponse.json(
          {
            message: "Could not retrieve video details from YouTube API (missing title).",
          },
          {
            status: 404,
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
          status: 502,
        }
      );
    }

    let smallImg = "https://t4.ftcdn.net/jpg/01/77/43/63/360_F_177436300_PN50VtrZbrdxSAMKIgbbOIU90ZSCn8y3.jpg"; // Default fallback
    let bigImg = "https://t4.ftcdn.net/jpg/01/77/43/63/360_F_177436300_PN50VtrZbrdxSAMKIgbbOIU90ZSCn8y3.jpg"; // Default fallback

    // Try to get thumbnails from the API response
    const apiThumbnails = videoDetails.thumbnail?.thumbnails;

    if (Array.isArray(apiThumbnails) && apiThumbnails.length > 0) {
      // Sort thumbnails by width in ascending order
      apiThumbnails.sort((a: { width: number }, b: { width: number }) => a.width - b.width);

      // Take the largest for bigImg
      bigImg = apiThumbnails[apiThumbnails.length - 1].url;

      // Take the second largest for smallImg, or largest if only one
      smallImg = apiThumbnails.length > 1
        ? apiThumbnails[apiThumbnails.length - 2].url
        : bigImg; // Use the largest if there's only one thumbnail
    } else {
      // If API did not return thumbnails, construct generic YouTube thumbnail URLs
      console.warn("YouTube API did not return specific thumbnail array. Constructing generic URLs.");
      smallImg = `https://img.youtube.com/vi/${extractedId}/mqdefault.jpg`; // Medium quality default
      bigImg = `https://img.youtube.com/vi/${extractedId}/maxresdefault.jpg`; // Max resolution default (might not exist for all videos)
      // Fallback for maxresdefault if it doesn't exist
      // Note: You might need to make an actual HEAD request to check if maxresdefault.jpg exists
      // For simplicity here, we'll just use it and assume browsers will handle a broken image.
      // A more robust solution would involve trying hqdefault.jpg, sddefault.jpg, etc.
    }


    const streamData = {
      userId: existingUser.id,
      url: urlString,
      type: "Youtube" as const,
      extractedId: extractedId,
      title: videoDetails.title ?? "Can't find Video",
      smallImg: smallImg,
      bigImg: bigImg,
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