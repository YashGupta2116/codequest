/*
  Warnings:

  - A unique constraint covering the columns `[language]` on the table `roadmaps` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "roadmaps_language_key" ON "public"."roadmaps"("language");
