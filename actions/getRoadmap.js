"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

/**
 * Get roadmap for a specific language (for current user)
 * @param {string} language - The programming language (e.g., "Python", "JavaScript")
 * @returns {Promise<Object|null>} The roadmap with user progress
 */
export async function getRoadmapByLanguage(language) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error("User not authenticated");
    }

    const roadmap = await prisma.roadmap.findFirst({
      where: { language },
      include: {
        levels: {
          include: {
            assignments: true,
            miniBoss: true,
            bigBoss: true,
            userProgress: {
              where: { userId: session.user.id },
            },
          },
          orderBy: { levelNumber: "asc" },
        },
        userRoadmaps: {
          where: { userId: session.user.id },
        },
      },
    });

    if (!roadmap) {
      return null;
    }

    // Get user's total XP
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { totalXp: true },
    });

    return {
      ...roadmap,
      userTotalXp: user?.totalXp || 0,
    };
  } catch (error) {
    console.error("Error fetching roadmap by language:", error);
    throw new Error("Failed to fetch roadmap");
  }
}

/**
 * Get all roadmaps for the current user
 * @returns {Promise<Array>} Array of roadmaps with progress
 */
export async function getAllUserRoadmaps() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error("User not authenticated");
    }

    const roadmaps = await prisma.roadmap.findMany({
      include: {
        levels: {
          include: {
            userProgress: {
              where: { userId: session.user.id },
            },
          },
          orderBy: { levelNumber: "asc" },
        },
        userRoadmaps: {
          where: { userId: session.user.id },
        },
      },
    });

    // Filter only roadmaps that the user has started
    const userRoadmaps = roadmaps.filter(
      (roadmap) => roadmap.userRoadmaps.length > 0
    );

    // Get user's total XP
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { totalXp: true },
    });

    return userRoadmaps.map((roadmap) => ({
      ...roadmap,
      userTotalXp: user?.totalXp || 0,
      completedLevels: roadmap.levels.filter(
        (level) => level.userProgress[0]?.isCompleted
      ).length,
      totalLevels: roadmap.levels.length,
    }));
  } catch (error) {
    console.error("Error fetching all user roadmaps:", error);
    throw new Error("Failed to fetch user roadmaps");
  }
}

/**
 * Get roadmap statistics for the current user
 * @returns {Promise<Object>} User's learning statistics
 */
export async function getRoadmapStats() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error("User not authenticated");
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { totalXp: true },
    });

    const roadmaps = await prisma.roadmap.findMany({
      include: {
        levels: {
          include: {
            userProgress: {
              where: { userId: session.user.id },
            },
          },
        },
        userRoadmaps: {
          where: { userId: session.user.id },
        },
      },
    });

    const userRoadmaps = roadmaps.filter(
      (roadmap) => roadmap.userRoadmaps.length > 0
    );

    const totalLevels = userRoadmaps.reduce(
      (sum, roadmap) => sum + roadmap.levels.length,
      0
    );

    const completedLevels = userRoadmaps.reduce(
      (sum, roadmap) =>
        sum +
        roadmap.levels.filter((level) => level.userProgress[0]?.isCompleted)
          .length,
      0
    );

    return {
      totalXp: user?.totalXp || 0,
      totalRoadmaps: userRoadmaps.length,
      totalLevels,
      completedLevels,
      progressPercentage:
        totalLevels > 0 ? Math.round((completedLevels / totalLevels) * 100) : 0,
      languages: userRoadmaps.map((roadmap) => roadmap.language),
    };
  } catch (error) {
    console.error("Error fetching roadmap stats:", error);
    throw new Error("Failed to fetch roadmap statistics");
  }
}
