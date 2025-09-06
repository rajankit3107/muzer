/*
  Warnings:

  - You are about to drop the column `bigimg` on the `Stream` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Stream" DROP COLUMN "bigimg",
ADD COLUMN     "bigImg" TEXT NOT NULL DEFAULT '';
