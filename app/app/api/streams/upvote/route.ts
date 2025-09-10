import { prisma } from "@/app/lib/db";
import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

const upvoteSchema = z.object({
  streamId: z.string(),
});

export async function POST(req: NextRequest) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json(
      {
        message: `unauthenticated`,
      },
      {
        status: 403,
      }
    );
  }

  const user = await prisma.user.findFirst({
    where: {
      id: session.user.id,
    },
  });

  if (!user)
    return NextResponse.json(
      { message: `user does not exist` },
      { status: 403 }
    );

  try {
    const validatedData = upvoteSchema.safeParse(await req.json());

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
    // Check if user already upvoted this stream
    const existingUpvote = await prisma.upvote.findUnique({
      where: {
        userId_streamId: {
          userId: user.id,
          streamId: validatedData.data.streamId,
        },
      },
    });

    if (existingUpvote) {
      return NextResponse.json({ message: "Already upvoted" }, { status: 400 });
    }

    await prisma.upvote.create({
      data: {
        userId: user.id,
        streamId: validatedData.data.streamId,
      },
    });

    return NextResponse.json(
      { message: "Upvoted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error while upvoting:", error);
    return NextResponse.json(
      {
        message: `Error while upvoting`,
      },
      {
        status: 500,
      }
    );
  }
}
