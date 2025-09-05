-- CreateTable
CREATE TABLE "public"."roadmaps" (
    "id" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "totalLevels" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "roadmaps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."levels" (
    "id" TEXT NOT NULL,
    "roadmap_id" TEXT NOT NULL,
    "level_number" INTEGER NOT NULL,
    "level_title" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "difficulty" TEXT NOT NULL,
    "xp_reward" INTEGER NOT NULL,
    "text_content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "levels_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."assignments" (
    "id" TEXT NOT NULL,
    "level_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "sample_input" TEXT,
    "sample_output" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "assignments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."mini_bosses" (
    "id" TEXT NOT NULL,
    "level_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "requirements" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "mini_bosses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."big_bosses" (
    "id" TEXT NOT NULL,
    "level_id" TEXT NOT NULL,
    "appears_every" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "requirements" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "big_bosses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."user_roadmaps" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "roadmap_id" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_roadmaps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."user_progress" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "level_id" TEXT NOT NULL,
    "is_completed" BOOLEAN NOT NULL DEFAULT false,
    "completed_at" TIMESTAMP(3),
    "xp_earned" INTEGER NOT NULL DEFAULT 0,
    "total_xp" INTEGER NOT NULL DEFAULT 0,
    "code_submitted" TEXT,
    "feedback" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_progress_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "roadmaps_language_key" ON "public"."roadmaps"("language");

-- CreateIndex
CREATE UNIQUE INDEX "levels_roadmap_id_level_number_key" ON "public"."levels"("roadmap_id", "level_number");

-- CreateIndex
CREATE UNIQUE INDEX "mini_bosses_level_id_key" ON "public"."mini_bosses"("level_id");

-- CreateIndex
CREATE UNIQUE INDEX "big_bosses_level_id_key" ON "public"."big_bosses"("level_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_roadmaps_user_id_roadmap_id_key" ON "public"."user_roadmaps"("user_id", "roadmap_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_progress_user_id_level_id_key" ON "public"."user_progress"("user_id", "level_id");

-- AddForeignKey
ALTER TABLE "public"."levels" ADD CONSTRAINT "levels_roadmap_id_fkey" FOREIGN KEY ("roadmap_id") REFERENCES "public"."roadmaps"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."assignments" ADD CONSTRAINT "assignments_level_id_fkey" FOREIGN KEY ("level_id") REFERENCES "public"."levels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."mini_bosses" ADD CONSTRAINT "mini_bosses_level_id_fkey" FOREIGN KEY ("level_id") REFERENCES "public"."levels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."big_bosses" ADD CONSTRAINT "big_bosses_level_id_fkey" FOREIGN KEY ("level_id") REFERENCES "public"."levels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."user_roadmaps" ADD CONSTRAINT "user_roadmaps_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."user_roadmaps" ADD CONSTRAINT "user_roadmaps_roadmap_id_fkey" FOREIGN KEY ("roadmap_id") REFERENCES "public"."roadmaps"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."user_progress" ADD CONSTRAINT "user_progress_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."user_progress" ADD CONSTRAINT "user_progress_level_id_fkey" FOREIGN KEY ("level_id") REFERENCES "public"."levels"("id") ON DELETE CASCADE ON UPDATE CASCADE;
