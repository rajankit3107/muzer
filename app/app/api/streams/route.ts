import { prisma } from "@/app/lib/db";
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
    const body = await req.json();
    const validatedData = StreamSchema.safeParse(body);

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
          message: "wrong url format",
        },
        {
          status: 411,
        }
      );
    }

    // Extract YouTube video ID from URL
    let extractedId: string;
    if (validatedData.data.url.includes("youtu.be/")) {
      extractedId = validatedData.data.url.split("youtu.be/")[1];
    } else {
      extractedId = validatedData.data.url.split("?v=")[1];
    }

    const res = await youtubesearchapi.GetVideoDetails(extractedId);
    console.log(res.title);

    const thumbnails = res.thumbnail.thumbnails;
    thumbnails.sort((a: { width: number }, b: { width: number }) =>
      a.width < b.width ? -1 : 1
    );

    // Create stream in database
    const streamData = {
      userId: validatedData.data.creatorId,
      url: validatedData.data.url,
      type: "Youtube" as const,
      extractedId: extractedId,
      title: res.title ?? "Can't find Video",
      smallImg:
        (thumbnails.length > 1
          ? thumbnails[thumbnails.length - 2].url
          : thumbnails[thumbnails.length - 1].url) ??
        "https://t4.ftcdn.net/jpg/01/77/43/63/360_F_177436300_PN50VtrZbrdxSAMKIgbbOIU90ZSCn8y3.jpg",

      bigImg:
        thumbnails[thumbnails.length - 1].url ??
        "https://t4.ftcdn.net/jpg/01/77/43/63/360_F_177436300_PN50VtrZbrdxSAMKIgbbOIU90ZSCn8y3.jpg",
    };

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
    console.log(error);
    return NextResponse.json(
      {
        message: "Error while processing stream",
      },
      {
        status: 500,
      }
    );
  }
}

export async function GET(req: NextRequest) {
  const creatorId = req.nextUrl.searchParams.get("creatorId");

  if (!creatorId)
    return NextResponse.json(
      { message: `streamer does not exist` },
      { status: 403 }
    );
  const streams = await prisma.stream.findMany({
    where: {
      userId: creatorId,
    },
  });

  return NextResponse.json({
    streams,
  });
}
