"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

/**
 * Fetches the total XP of the current authenticated user
 * @returns {Promise<number>} The total XP of the user
 */
export async function getTotalXp() {
  try {
    // Get current user session
    const session = await auth();

    if (!session?.user?.id) {
      throw new Error("User not authenticated");
    }

    console.log("🔍 getTotalXp - Fetching XP for user:", session.user.id);

    // Fetch user's total XP from database
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { totalXp: true },
    });

    if (!user) {
      throw new Error("User not found");
    }

    console.log("✅ getTotalXp - User total XP:", user.totalXp);
    return user.totalXp;
  } catch (error) {
    console.error("❌ getTotalXp - Error:", error);
    throw new Error(`Failed to fetch total XP: ${error.message}`);
  }
}

/**
 * Fetches the total XP of a specific user by user ID
 * @param {string} userId - The user ID to fetch XP for
 * @returns {Promise<number>} The total XP of the specified user
 */
export async function getTotalXpByUserId(userId) {
  if (!userId || typeof userId !== "string") {
    throw new Error("userId is required and must be a string");
  }

  try {
    console.log("🔍 getTotalXpByUserId - Fetching XP for user:", userId);

    // Fetch user's total XP from database
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { totalXp: true },
    });

    if (!user) {
      throw new Error("User not found");
    }

    console.log("✅ getTotalXpByUserId - User total XP:", user.totalXp);
    return user.totalXp;
  } catch (error) {
    console.error("❌ getTotalXpByUserId - Error:", error);
    throw new Error(`Failed to fetch total XP: ${error.message}`);
  }
}

/**
 * Updates the total XP of a user
 * @param {string} userId - The user ID to update XP for
 * @param {number} xpToAdd - The XP amount to add to the user's total
 * @returns {Promise<number>} The updated total XP
 */
export async function updateUserTotalXp(userId, xpToAdd) {
  if (!userId || typeof userId !== "string") {
    throw new Error("userId is required and must be a string");
  }

  if (typeof xpToAdd !== "number" || xpToAdd < 0) {
    throw new Error("xpToAdd must be a non-negative number");
  }

  try {
    console.log(
      "🔍 updateUserTotalXp - Updating XP for user:",
      userId,
      "Adding:",
      xpToAdd
    );

    // Update user's total XP
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        totalXp: {
          increment: xpToAdd,
        },
      },
      select: { totalXp: true },
    });

    console.log(
      "✅ updateUserTotalXp - Updated total XP:",
      updatedUser.totalXp
    );
    return updatedUser.totalXp;
  } catch (error) {
    console.error("❌ updateUserTotalXp - Error:", error);
    throw new Error(`Failed to update total XP: ${error.message}`);
  }
}
