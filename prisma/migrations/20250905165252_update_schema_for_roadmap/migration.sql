/*
  Warnings:

  - You are about to drop the column `total_xp` on the `user_progress` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "public"."roadmaps_language_key";

-- AlterTable
ALTER TABLE "public"."user_progress" DROP COLUMN "total_xp";

-- AlterTable
ALTER TABLE "public"."users" ADD COLUMN     "totalXp" INTEGER NOT NULL DEFAULT 0;
