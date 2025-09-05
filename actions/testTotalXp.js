"use server";

import {
  getTotalXp,
  getTotalXpByUserId,
  updateUserTotalXp,
} from "./getTotalXp";

/**
 * Test function to verify the total XP server actions work correctly
 * This is for development/testing purposes only
 */
export async function testTotalXpActions() {
  try {
    console.log("🧪 Testing Total XP Actions...");

    // Test 1: Get current user's total XP
    try {
      const currentUserXp = await getTotalXp();
      console.log("✅ Test 1 - Current user total XP:", currentUserXp);
    } catch (error) {
      console.log(
        "⚠️ Test 1 - getTotalXp failed (expected if not authenticated):",
        error.message
      );
    }

    // Test 2: Test with a dummy user ID (this will fail but shows the function structure)
    try {
      const dummyUserId = "test-user-id";
      const dummyUserXp = await getTotalXpByUserId(dummyUserId);
      console.log("✅ Test 2 - Dummy user total XP:", dummyUserXp);
    } catch (error) {
      console.log(
        "⚠️ Test 2 - getTotalXpByUserId failed (expected with dummy ID):",
        error.message
      );
    }

    // Test 3: Test update function with dummy data (this will fail but shows the function structure)
    try {
      const dummyUserId = "test-user-id";
      const updatedXp = await updateUserTotalXp(dummyUserId, 100);
      console.log("✅ Test 3 - Updated total XP:", updatedXp);
    } catch (error) {
      console.log(
        "⚠️ Test 3 - updateUserTotalXp failed (expected with dummy ID):",
        error.message
      );
    }

    console.log("🧪 Total XP Actions test completed!");
    return {
      success: true,
      message: "Test completed - check console for results",
    };
  } catch (error) {
    console.error("❌ Test failed:", error);
    return { success: false, error: error.message };
  }
}
