-- AlterTable
ALTER TABLE "public"."Stream" ADD COLUMN     "bigimg" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "smallImg" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "title" TEXT NOT NULL DEFAULT '';
