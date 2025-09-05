import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const streamSchema = z.object({
  creatorId: z.string(),
  url: z.string,
});

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
  } catch (error) {
    return NextResponse.json(
      {
        message: "Error while adding a stream",
      },
      {
        status: 411,
      }
    );
  }
}
