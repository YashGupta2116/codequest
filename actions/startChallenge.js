"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

/**
 * Starts a challenge for a user (creates UserChallenge record)
 * @param {string} challengeId - The challenge ID
 * @returns {Promise<Object>} UserChallenge record
 */
export async function startChallenge(challengeId) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return {
        success: false,
        message: "Authentication required",
      };
    }

    console.log("🚀 Starting challenge:", challengeId);

    // Check if user already has this challenge
    const existingChallenge = await prisma.userChallenge.findUnique({
      where: {
        userId_challengeId: {
          userId: session.user.id,
          challengeId: challengeId,
        },
      },
      include: {
        challenge: true,
      },
    });

    if (existingChallenge) {
      return {
        success: true,
        userChallenge: existingChallenge,
        isExisting: true,
      };
    }

    // Create new user challenge
    const userChallenge = await prisma.userChallenge.create({
      data: {
        userId: session.user.id,
        challengeId: challengeId,
        status: "started",
      },
      include: {
        challenge: true,
      },
    });

    console.log("✅ Challenge started for user:", session.user.id);

    return {
      success: true,
      userChallenge: userChallenge,
      isExisting: false,
    };
  } catch (error) {
    console.error("❌ startChallenge - Error:", error);
    return {
      success: false,
      message: "Failed to start challenge",
      error: error.message,
    };
  }
}
