import { prisma } from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
const yt_regex = new RegExp(
  "^https?://(www.)?(youtube.com/watch?v=|youtu.be/)[a-zA-Z0-9_-]{11}$"
);

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

    const isYtUrl = yt_regex.test(validatedData.data.url);

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

    // Create stream in database
    const streamData = {
      userId: validatedData.data.creatorId,
      url: validatedData.data.url,
      type: "Youtube" as const,
      extractedId: extractedId,
    };

    await prisma.stream.create({
      data: streamData,
    });

    return NextResponse.json(
      {
        message: "Stream added successfully",
        extractedId: extractedId,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
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
