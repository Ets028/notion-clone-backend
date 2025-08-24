/*
  Warnings:

  - The `content` column on the `Note` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "public"."Priority" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- AlterTable
ALTER TABLE "public"."Note" ADD COLUMN     "dueDate" TIMESTAMP(3),
ADD COLUMN     "priority" "public"."Priority",
DROP COLUMN "content",
ADD COLUMN     "content" JSONB;
