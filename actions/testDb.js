"use server";

import { prisma } from "@/lib/prisma";

export async function testDatabase() {
  try {
    console.log("🧪 Testing database connection...");

    // Test basic connection
    const userCount = await prisma.user.count();
    console.log("✅ Database connected! User count:", userCount);

    // Test roadmap table
    const roadmapCount = await prisma.roadmap.count();
    console.log("✅ Roadmap count:", roadmapCount);

    return {
      success: true,
      userCount,
      roadmapCount,
      message: "Database connection successful",
    };
  } catch (error) {
    console.error("❌ Database test failed:", error);
    return {
      success: false,
      error: error.message,
      message: "Database connection failed",
    };
  }
}
