"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

/**
 * Get specific level data with all related content
 * @param {string} language - The programming language (e.g., "Python", "JavaScript")
 * @param {number} levelNumber - The level number to fetch
 * @returns {Promise<Object|null>} The level with all related data
 */
export async function getLevelData(language, levelNumber) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error("User not authenticated");
    }

    // First get the roadmap
    const roadmap = await prisma.roadmap.findFirst({
      where: { language },
      select: { id: true, title: true, description: true }
    });

    if (!roadmap) {
      throw new Error("Roadmap not found");
    }

    // Get the specific level with all related data
    const level = await prisma.level.findFirst({
      where: {
        roadmapId: roadmap.id,
        levelNumber: parseInt(levelNumber)
      },
      include: {
        assignments: {
          orderBy: { createdAt: "asc" }
        },
        miniBoss: true,
        bigBoss: true,
        userProgress: {
          where: { userId: session.user.id }
        },
        roadmap: {
          select: {
            language: true,
            title: true,
            description: true
          }
        }
      }
    });

    if (!level) {
      throw new Error("Level not found");
    }

    // Get user's total XP
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { totalXp: true }
    });

    // Get adjacent levels for navigation
    const previousLevel = await prisma.level.findFirst({
      where: {
        roadmapId: roadmap.id,
        levelNumber: parseInt(levelNumber) - 1
      },
      select: {
        levelNumber: true,
        levelTitle: true
      }
    });

    const nextLevel = await prisma.level.findFirst({
      where: {
        roadmapId: roadmap.id,
        levelNumber: parseInt(levelNumber) + 1
      },
      select: {
        levelNumber: true,
        levelTitle: true
      }
    });

    const userProgress = level.userProgress[0];

    return {
      ...level,
      userProgress: userProgress || null,
      isCompleted: userProgress?.isCompleted || false,
      xpEarned: userProgress?.xpEarned || 0,
      userTotalXp: user?.totalXp || 0,
      previousLevel,
      nextLevel,
      roadmapInfo: {
        language: level.roadmap.language,
        title: level.roadmap.title,
        description: level.roadmap.description
      }
    };
  } catch (error) {
    console.error("Error fetching level data:", error);
    throw new Error("Failed to fetch level data");
  }
}

/**
 * Update user progress for a level
 * @param {string} levelId - The level ID
 * @param {Object} progressData - Progress data to update
 * @returns {Promise<Object>} Updated progress
 */
export async function updateLevelProgress(levelId, progressData) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error("User not authenticated");
    }

    const { isCompleted, codeSubmitted, xpEarned } = progressData;

    // Update or create user progress
    const progress = await prisma.userProgress.upsert({
      where: {
        userId_levelId: {
          userId: session.user.id,
          levelId: levelId
        }
      },
      update: {
        isCompleted: isCompleted || false,
        completedAt: isCompleted ? new Date() : null,
        codeSubmitted: codeSubmitted || null,
        xpEarned: xpEarned || 0
      },
      create: {
        userId: session.user.id,
        levelId: levelId,
        isCompleted: isCompleted || false,
        completedAt: isCompleted ? new Date() : null,
        codeSubmitted: codeSubmitted || null,
        xpEarned: xpEarned || 0
      }
    });

    // Update user's total XP if level is completed
    if (isCompleted && xpEarned > 0) {
      await prisma.user.update({
        where: { id: session.user.id },
        data: {
          totalXp: {
            increment: xpEarned
          }
        }
      });
    }

    return progress;
  } catch (error) {
    console.error("Error updating level progress:", error);
    throw new Error("Failed to update progress");
  }
}
