"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { validateCodeWithGemini } from "./validateCodeWithGemini";

/**
 * Submits a solution for a challenge and validates it
 * @param {string} userChallengeId - The user challenge ID
 * @param {string} code - The user's code solution
 * @returns {Promise<Object>} Validation result and updated challenge status
 */
export async function submitChallenge(userChallengeId, code) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return {
        success: false,
        message: "Authentication required",
      };
    }

    console.log("📝 Submitting challenge solution:", userChallengeId);

    // Get the user challenge with challenge details
    const userChallenge = await prisma.userChallenge.findUnique({
      where: {
        id: userChallengeId,
        userId: session.user.id,
      },
      include: {
        challenge: true,
      },
    });

    if (!userChallenge) {
      return {
        success: false,
        message: "Challenge not found",
      };
    }

    if (userChallenge.status === "completed") {
      return {
        success: false,
        message: "Challenge already completed",
      };
    }

    // Validate the code using Gemini
    const validationResult = await validateCodeWithGemini(
      code,
      userChallenge.challenge.language,
      {
        title: userChallenge.challenge.title,
        description: userChallenge.challenge.description,
        sampleInput: userChallenge.challenge.testCases[0]?.input || "",
        sampleOutput:
          userChallenge.challenge.testCases[0]?.expectedOutput || "",
      },
      userChallenge.challenge.title
    );

    // Update user challenge with solution and results
    const updatedUserChallenge = await prisma.userChallenge.update({
      where: {
        id: userChallengeId,
      },
      data: {
        codeSolution: code,
        testResults: validationResult,
        status: validationResult.success ? "completed" : "started",
        xpEarned: validationResult.success
          ? userChallenge.challenge.xpReward
          : 0,
        completedAt: validationResult.success ? new Date() : null,
      },
    });

    // Update user's total XP if challenge was completed
    if (validationResult.success) {
      await prisma.user.update({
        where: {
          id: session.user.id,
        },
        data: {
          totalXp: {
            increment: userChallenge.challenge.xpReward,
          },
        },
      });

      console.log(
        "🎉 Challenge completed! XP earned:",
        userChallenge.challenge.xpReward
      );
    }

    return {
      success: true,
      validationResult: validationResult,
      userChallenge: updatedUserChallenge,
      xpEarned: validationResult.success ? userChallenge.challenge.xpReward : 0,
    };
  } catch (error) {
    console.error("❌ submitChallenge - Error:", error);
    return {
      success: false,
      message: "Failed to submit challenge",
      error: error.message,
    };
  }
}
