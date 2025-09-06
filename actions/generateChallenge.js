"use server";

import { genAI } from "@/lib/genAI";

/**
 * Generates a coding challenge using Gemini AI based on user preferences
 * @param {string} language - Programming language (python, cpp, java)
 * @param {string} difficulty - Difficulty level (beginner, intermediate, advanced, expert, all)
 * @param {string} customPrompt - Optional custom challenge request
 * @returns {Promise<Object>} Generated challenge with title, description, and test cases
 */
export async function generateChallenge(
  language,
  difficulty,
  customPrompt = ""
) {
  try {
    console.log("🎯 generateChallenge - Generating challenge for:", {
      language,
      difficulty,
      customPrompt,
    });

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // Map difficulty levels to more descriptive terms
    const difficultyMap = {
      beginner:
        "Beginner level - basic concepts, simple algorithms, easy to understand",
      intermediate:
        "Intermediate level - moderate complexity, requires some algorithmic thinking",
      advanced:
        "Advanced level - complex algorithms, data structures, challenging problems",
      expert:
        "Expert level - very challenging, requires deep understanding and optimization",
      all: "Mixed difficulty - a good balance of easy to challenging problems",
    };

    const languageMap = {
      python: "Python programming language",
      cpp: "C++ programming language",
      java: "Java programming language",
    };

    const prompt = `You are an expert coding challenge generator. Create an engaging, well-structured coding challenge.

REQUIREMENTS:
- Programming Language: ${languageMap[language] || language}
- Difficulty Level: ${difficultyMap[difficulty] || difficulty}
${customPrompt ? `- Custom Request: ${customPrompt}` : ""}

CHALLENGE STRUCTURE:
Create a coding challenge that includes:
1. An engaging title (max 50 characters)
2. A clear problem description (2-3 paragraphs)
3. Input/Output specifications
4. At least 2 test cases with expected outputs
5. Constraints and hints
6. Estimated completion time and XP reward

RESPONSE FORMAT (JSON only):
{
  "title": "Challenge Title",
  "description": "Detailed problem description with context and requirements",
  "inputFormat": "Description of input format",
  "outputFormat": "Description of output format", 
  "testCases": [
    {
      "input": "sample input 1",
      "expectedOutput": "expected output 1",
      "explanation": "brief explanation of this test case"
    },
    {
      "input": "sample input 2", 
      "expectedOutput": "expected output 2",
      "explanation": "brief explanation of this test case"
    }
  ],
  "constraints": "Any constraints or limitations",
  "hints": ["hint 1", "hint 2"],
  "estimatedTime": "15-30 minutes",
  "xpReward": 150,
  "difficulty": "${difficulty}",
  "language": "${language}"
}

IMPORTANT:
- Return ONLY valid JSON, no markdown formatting, no code blocks
- Do not include any text before or after the JSON
- Make the challenge engaging and educational
- Ensure test cases are clear and cover edge cases
- Provide helpful hints without giving away the solution
- Set appropriate XP reward based on difficulty (50-500 range)
- Make the challenge practical and relevant to real-world programming
- The response must be parseable as JSON directly`;

    const generationConfig = {
      temperature: 0.7,
      maxOutputTokens: 2000,
      responseMimeType: "application/json",
    };

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig,
    });

    const text = result.response?.text?.();
    const raw =
      typeof text === "string"
        ? text
        : String(
            result.response?.candidates?.[0]?.content?.parts?.[0]?.text ?? ""
          );

    if (!raw) {
      throw new Error("Empty response from Gemini");
    }

    console.log("🔍 Raw Gemini response:", raw);

    try {
      // Clean up the response - remove any markdown formatting or extra text
      let cleanedResponse = raw.trim();

      // Remove markdown code blocks if present
      if (cleanedResponse.startsWith("```json")) {
        cleanedResponse = cleanedResponse
          .replace(/^```json\s*/, "")
          .replace(/\s*```$/, "");
      } else if (cleanedResponse.startsWith("```")) {
        cleanedResponse = cleanedResponse
          .replace(/^```\s*/, "")
          .replace(/\s*```$/, "");
      }

      // Find the first { and last } to extract just the JSON
      const firstBrace = cleanedResponse.indexOf("{");
      const lastBrace = cleanedResponse.lastIndexOf("}");

      if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
        cleanedResponse = cleanedResponse.substring(firstBrace, lastBrace + 1);
      }

      console.log("🧹 Cleaned response:", cleanedResponse);

      const challenge = JSON.parse(cleanedResponse);
      console.log("✅ Generated challenge:", challenge);
      return {
        success: true,
        challenge: challenge,
      };
    } catch (parseError) {
      console.error("❌ Failed to parse Gemini response:", parseError);
      console.error("❌ Raw response that failed to parse:", raw);
      return {
        success: false,
        message: "Failed to generate challenge. Please try again.",
        error: parseError.message,
      };
    }
  } catch (error) {
    console.error("❌ generateChallenge - Error:", error);
    return {
      success: false,
      message: "Failed to generate challenge. Please try again.",
      error: error.message,
    };
  }
}
