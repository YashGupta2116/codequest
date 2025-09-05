"use server";

import { prisma } from "@/lib/prisma";

/**
 * Saves a GenAI generated roadmap to the database
 * @param {Object} roadmapData - The roadmap data from GenAI
 * @param {string} userId - The user ID who owns this roadmap
 * @returns {Promise<Object>} The saved roadmap with levels
 */
export async function saveRoadmap(roadmapData, userId) {
  if (!roadmapData || !userId) {
    throw new Error("roadmapData and userId are required");
  }

  const { language, levels, code_feedback } = roadmapData;
  console.log("💾 saveRoadmap called with:", {
    language,
    levelsCount: levels?.length,
    userId,
  });

  try {
    // Ensure user exists first
    let defaultUser = await prisma.user.findFirst({
      where: { id: userId },
    });

    if (!defaultUser) {
      defaultUser = await prisma.user.create({
        data: {
          id: userId,
          fullName: "Default User",
          username: "default-user",
          email: "default@example.com",
          role: "user",
        },
      });
      console.log("✅ Created default user:", userId);
    }

    // Create or update the roadmap
    let roadmap = await prisma.roadmap.findFirst({
      where: { language },
    });

    if (roadmap) {
      roadmap = await prisma.roadmap.update({
        where: { id: roadmap.id },
        data: {
          title: `Learn ${language}`,
          totalLevels: levels.length,
          updatedAt: new Date(),
        },
      });
    } else {
      roadmap = await prisma.roadmap.create({
        data: {
          language,
          title: `Learn ${language}`,
          totalLevels: levels.length,
        },
      });
    }

    // Create user-roadmap relationship
    let userRoadmap = await prisma.userRoadmap.findFirst({
      where: {
        userId,
        roadmapId: roadmap.id,
      },
    });

    if (userRoadmap) {
      await prisma.userRoadmap.update({
        where: { id: userRoadmap.id },
        data: {
          isActive: true,
          updatedAt: new Date(),
        },
      });
    } else {
      await prisma.userRoadmap.create({
        data: {
          userId,
          roadmapId: roadmap.id,
          isActive: true,
        },
      });
    }

    // Delete existing levels and related data for this roadmap
    await prisma.userProgress.deleteMany({
      where: {
        level: {
          roadmapId: roadmap.id,
        },
      },
    });

    await prisma.assignment.deleteMany({
      where: {
        level: {
          roadmapId: roadmap.id,
        },
      },
    });

    await prisma.miniBoss.deleteMany({
      where: {
        level: {
          roadmapId: roadmap.id,
        },
      },
    });

    await prisma.bigBoss.deleteMany({
      where: {
        level: {
          roadmapId: roadmap.id,
        },
      },
    });

    await prisma.level.deleteMany({
      where: {
        roadmapId: roadmap.id,
      },
    });

    // Create levels and related data one by one to avoid transaction timeout
    const createdLevels = [];

    for (const levelData of levels) {
      console.log(
        `Creating level ${levelData.level_number}: ${levelData.level_title}`
      );

      const level = await prisma.level.create({
        data: {
          roadmapId: roadmap.id,
          levelNumber: levelData.level_number,
          levelTitle: levelData.level_title,
          topic: levelData.topic,
          difficulty: levelData.difficulty,
          xpReward: levelData.xp_reward,
          textContent: levelData.text_content,
        },
      });

      // Create assignments
      if (levelData.assignments && levelData.assignments.length > 0) {
        for (const assignment of levelData.assignments) {
          await prisma.assignment.create({
            data: {
              levelId: level.id,
              title: assignment.title,
              description: assignment.description,
              sampleInput: assignment.sample_input,
              sampleOutput: assignment.sample_output,
            },
          });
        }
      }

      // Create mini boss
      if (levelData.mini_boss) {
        await prisma.miniBoss.create({
          data: {
            levelId: level.id,
            title: levelData.mini_boss.title,
            description: levelData.mini_boss.description,
            requirements: levelData.mini_boss.requirements,
          },
        });
      }

      // Create big boss (appears every 5th level)
      if (levelData.big_boss_level) {
        await prisma.bigBoss.create({
          data: {
            levelId: level.id,
            appearsEvery: levelData.big_boss_level.appears_every || 5,
            title: levelData.big_boss_level.title,
            description: levelData.big_boss_level.description,
            requirements: levelData.big_boss_level.requirements,
          },
        });
      }

      createdLevels.push(level);
    }

    console.log(`✅ Successfully created ${createdLevels.length} levels`);

    return {
      roadmap,
      levels: createdLevels,
      totalLevels: levels.length,
    };
  } catch (error) {
    console.error("Error saving roadmap:", error);
    throw new Error("Failed to save roadmap to database");
  }
}

/**
 * Gets a user's roadmap progress
 * @param {string} userId - The user ID
 * @param {string} language - The programming language
 * @returns {Promise<Object>} The roadmap with user progress
 */
export async function getUserRoadmap(userId, language) {
  if (!userId || !language) {
    throw new Error("userId and language are required");
  }

  try {
    // Ensure user exists
    let existingUser = await prisma.user.findFirst({
      where: { id: userId },
    });

    if (!existingUser) {
      existingUser = await prisma.user.create({
        data: {
          id: userId,
          fullName: "Default User",
          username: "default-user",
          email: "default@example.com",
          role: "user",
        },
      });
      console.log("✅ Created default user for getUserRoadmap:", userId);
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
              where: { userId },
            },
          },
          orderBy: { levelNumber: "asc" },
        },
        userRoadmaps: {
          where: { userId },
        },
      },
    });

    if (!roadmap) {
      return null;
    }

    // Get user's total XP from User model
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { totalXp: true },
    });

    return {
      ...roadmap,
      userTotalXp: user?.totalXp || 0,
    };
  } catch (error) {
    console.error("Error fetching user roadmap:", error);
    throw new Error("Failed to fetch user roadmap");
  }
}

/**
 * Updates user progress for a specific level
 * @param {string} userId - The user ID
 * @param {string} levelId - The level ID
 * @param {Object} progressData - Progress data including code and feedback
 * @returns {Promise<Object>} Updated progress record
 */
export async function updateUserProgress(userId, levelId, progressData) {
  if (!userId || !levelId) {
    throw new Error("userId and levelId are required");
  }

  const { codeSubmitted, feedback, isCompleted = false } = progressData;

  try {
    // Ensure user exists
    let progressUser = await prisma.user.findFirst({
      where: { id: userId },
    });

    if (!progressUser) {
      progressUser = await prisma.user.create({
        data: {
          id: userId,
          fullName: "Default User",
          username: "default-user",
          email: "default@example.com",
          role: "user",
        },
      });
      console.log("✅ Created default user for progress:", userId);
    }

    const level = await prisma.level.findUnique({
      where: { id: levelId },
      select: { xpReward: true },
    });

    if (!level) {
      throw new Error("Level not found");
    }

    let progress = await prisma.userProgress.findFirst({
      where: {
        userId,
        levelId,
      },
    });

    if (progress) {
      progress = await prisma.userProgress.update({
        where: { id: progress.id },
        data: {
          codeSubmitted,
          feedback,
          isCompleted,
          completedAt: isCompleted ? new Date() : null,
          xpEarned: isCompleted ? level.xpReward : 0,
          updatedAt: new Date(),
        },
      });
    } else {
      progress = await prisma.userProgress.create({
        data: {
          userId,
          levelId,
          codeSubmitted,
          feedback,
          isCompleted,
          completedAt: isCompleted ? new Date() : null,
          xpEarned: isCompleted ? level.xpReward : 0,
        },
      });
    }

    // Update user's total XP if level is completed
    if (isCompleted) {
      await prisma.user.update({
        where: { id: userId },
        data: {
          totalXp: {
            increment: level.xpReward,
          },
        },
      });
    }

    return progress;
  } catch (error) {
    console.error("Error updating user progress:", error);
    throw new Error("Failed to update user progress");
  }
}
