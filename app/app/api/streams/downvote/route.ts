import { prisma } from "@/app/lib/db";
import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

const downvoteSchema = z.object({
  streamId: z.string(),
});

export async function POST(req: NextRequest) {
  const session = await auth();

  if (!session?.user?.email) {
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
      email: session.user.email,
    },
  });

  if (!user)
    return NextResponse.json(
      { message: `user does not exist` },
      { status: 403 }
    );

  try {
    const validatedData = downvoteSchema.safeParse(await req.json());

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

    // Check if user has upvoted this stream
    const existingUpvote = await prisma.upvote.findUnique({
      where: {
        userId_streamId: {
          userId: user.id,
          streamId: validatedData.data.streamId,
        },
      },
    });

    if (existingUpvote) {
      // Remove the upvote (downvote removes upvote)
      await prisma.upvote.delete({
        where: {
          userId_streamId: {
            userId: user.id,
            streamId: validatedData.data.streamId,
          },
        },
      });
    }

    return NextResponse.json(
      { message: "Downvoted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: `Error while downvoting`,
      },
      {
        status: 500,
      }
    );
  }
}
