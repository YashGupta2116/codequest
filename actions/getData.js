"use server";

import { genAI } from "@/lib/genAI";
import { saveRoadmap } from "./saveRoadmap";
import { auth } from "@/auth";

/**
 * Fetches a gamified learning roadmap for a given programming language
 * from the Generative AI model using a strict JSON output format.
 * Also saves the roadmap to the database if user is authenticated.
 *
 * @param {string} language - The target programming language (e.g., "JavaScript").
 * @returns {Promise<any>} Parsed JSON object containing the roadmap and feedback schema.
 */
export default async function getData(language) {
  if (!language || typeof language !== "string") {
    throw new Error("language is required and must be a string");
  }

  console.log("🔍 getData - Language:", language);

  // Get current user session
  const session = await auth();
  console.log("🔍 getData - Session:", session?.user?.id || "No user session");

  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const prompt = `You are an AI coding mentor that teaches ${language} through a gamified roadmap.

CRITICAL REQUIREMENT: You MUST generate EXACTLY 15 levels. No more, no less. This is mandatory.

Each level must include:
- level_number (1-15)
- level_title (fun, game-like name)
- topic (focus concepts for this level)
- difficulty (Easy/Medium/Hard)
- xp_reward (50-200 XP)
- text_content (short explanations with examples)
- assignments (2-3 coding assignments per level)
- mini_boss (challenge at end of each level)
- big_boss_level (only for levels 5, 10, 15)

Level progression should be:
1-3: Beginner (Variables, Data Types, Basic Syntax)
4-6: Intermediate (Functions, Loops, Conditionals)
7-9: Advanced (OOP, Data Structures, Algorithms)
10-12: Expert (Advanced Concepts, Libraries, Frameworks)
13-15: Master (Complex Projects, Best Practices, Architecture)

Output Format (JSON only):
{
  "language": "${language}",
  "levels": [
    {
      "level_number": 1,
      "level_title": "The ${language} Initiate",
      "topic": "Introduction to ${language} and Basic Data Types",
      "difficulty": "Easy",
      "xp_reward": 50,
      "text_content": "Welcome, initiate! ${language} is a powerful language. Let's start with the basics...",
      "assignments": [
        {
          "title": "Hello World",
          "description": "Create your first ${language} program",
          "sample_input": "none",
          "sample_output": "Hello, World!"
        }
      ],
      "mini_boss": {
        "title": "First Challenge",
        "description": "Complete all basic exercises",
        "requirements": ["Print hello world", "Use variables"]
      },
      "big_boss_level": null
    },
    {
      "level_number": 2,
      "level_title": "Variable Mastery",
      "topic": "Variables and Data Types",
      "difficulty": "Easy",
      "xp_reward": 75,
      "text_content": "Learn about variables and different data types...",
      "assignments": [
        {
          "title": "Variable Practice",
          "description": "Create and use different variable types",
          "sample_input": "none",
          "sample_output": "Variables created successfully"
        }
      ],
      "mini_boss": {
        "title": "Variable Challenge",
        "description": "Master all variable types",
        "requirements": ["Create integers", "Create strings", "Create booleans"]
      },
      "big_boss_level": null
    }
    // ... continue for all 15 levels
  ],
  "code_feedback": {
    "correctness": "Check your code against the requirements",
    "hints": ["Read the problem statement carefully", "Test your code with sample inputs"],
    "improvements": ["Write clean, readable code", "Add comments where necessary"]
  }
}

IMPORTANT: 
- Generate EXACTLY 15 levels
- Each level must have unique content
- Progress from beginner to master level
- Include big_boss_level only for levels 5, 10, and 15
- Respond with valid JSON only, no backticks or commentary`;

  const generationConfig = {
    temperature: 0.6,
    maxOutputTokens: 8192,
    responseMimeType: "application/json",
  };

  const result = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig,
  });
  const text = result.response?.text?.();

  // Fallback if SDK returns the text directly on response
  const raw =
    typeof text === "string"
      ? text
      : String(
          result.response?.candidates?.[0]?.content?.parts?.[0]?.text ?? ""
        );

  if (!raw) {
    throw new Error("Empty response from model");
  }

  try {
    const roadmapData = JSON.parse(raw);
    console.log("🎯 Generated roadmap data:", roadmapData);
    console.log(
      "📊 Number of levels generated:",
      roadmapData.levels?.length || 0
    );

    // Save to database if user is authenticated
    if (session?.user?.id) {
      try {
        console.log("💾 Saving roadmap to database for user:", session.user.id);
        await saveRoadmap(roadmapData, session.user.id);
        console.log("✅ Roadmap saved successfully!");
      } catch (dbError) {
        console.error("❌ Failed to save roadmap to database:", dbError);
        // Don't throw here - we still want to return the roadmap data
      }
    } else {
      console.log("⚠️ No user session - not saving to database");
    }

    return roadmapData;
  } catch (err) {
    // Try to salvage JSON if model added stray characters
    const trimmed = raw
      .trim()
      .replace(/^```(json)?/i, "")
      .replace(/```$/i, "");

    const roadmapData = JSON.parse(trimmed);
    console.log(
      "📊 Number of levels generated (fallback):",
      roadmapData.levels?.length || 0
    );

    // Save to database if user is authenticated
    if (session?.user?.id) {
      try {
        console.log(
          "💾 Saving roadmap to database (fallback) for user:",
          session.user.id
        );
        await saveRoadmap(roadmapData, session.user.id);
        console.log("✅ Roadmap saved successfully!");
      } catch (dbError) {
        console.error("❌ Failed to save roadmap to database:", dbError);
        // Don't throw here - we still want to return the roadmap data
      }
    } else {
      console.log("⚠️ No user session - not saving to database (fallback)");
    }

    return roadmapData;
  }
}
