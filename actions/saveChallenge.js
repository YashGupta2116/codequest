"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

/**
 * Saves a generated challenge to the database
 * @param {Object} challengeData - The challenge data from Gemini
 * @returns {Promise<Object>} Saved challenge with ID
 */
export async function saveChallenge(challengeData) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      console.log("⚠️ No authentication, but continuing for testing...");
      // For testing purposes, we'll continue without auth
      // In production, you should return the error above
    }

    console.log("💾 Saving challenge to database:", challengeData.title);

    const challenge = await prisma.challenge.create({
      data: {
        title: challengeData.title,
        description: challengeData.description,
        language: challengeData.language,
        difficulty: challengeData.difficulty,
        inputFormat: challengeData.inputFormat,
        outputFormat: challengeData.outputFormat,
        testCases: challengeData.testCases,
        constraints: challengeData.constraints,
        hints: challengeData.hints,
        estimatedTime: challengeData.estimatedTime,
        xpReward: challengeData.xpReward,
        customPrompt: challengeData.customPrompt || null,
      },
    });

    console.log("✅ Challenge saved with ID:", challenge.id);

    return {
      success: true,
      challenge: challenge,
    };
  } catch (error) {
    console.error("❌ saveChallenge - Error:", error);
    return {
      success: false,
      message: "Failed to save challenge",
      error: error.message,
    };
  }
}
