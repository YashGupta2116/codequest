"use server";

import { genAI } from "@/lib/genAI";

/**
 * Validates user code using Gemini AI based on assignment context
 * @param {string} code - The user's code
 * @param {string} language - Programming language
 * @param {Object} assignment - Assignment object with title, description, sample input/output
 * @param {string} levelTitle - Level title for context
 * @returns {Promise<Object>} Validation result with success boolean and hint
 */
export async function validateCodeWithGemini(
  code,
  language,
  assignment,
  levelTitle
) {
  // Basic validation - check if code is empty
  if (!code || !code.trim()) {
    return {
      success: false,
      message: "Please write some code before submitting!",
      hint: "Start by writing some basic code to solve the assignment.",
    };
  }

  if (!assignment) {
    return {
      success: false,
      message: "No assignment selected for validation",
      hint: "Please select an assignment to work on.",
    };
  }

  try {
    console.log(
      "🔍 validateCodeWithGemini - Validating code for assignment:",
      assignment.title
    );

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `You are a coding mentor evaluating student code. 

ASSIGNMENT CONTEXT:
- Level: ${levelTitle}
- Assignment Title: ${assignment.title}
- Assignment Description: ${assignment.description}
- Programming Language: ${language}
${assignment.sampleInput ? `- Sample Input: ${assignment.sampleInput}` : ""}
${
  assignment.sampleOutput ? `- Expected Output: ${assignment.sampleOutput}` : ""
}

STUDENT CODE:
\`\`\`${language}
${code}
\`\`\`

EVALUATION CRITERIA:
1. Does the code solve the assignment problem?
2. Is the code syntactically correct?
3. Does it produce the expected output (if specified)?
4. Is the code appropriate for the assignment level?

RESPONSE FORMAT (JSON only):
{
  "success": true/false,
  "message": "Brief feedback message",
  "hint": "Helpful hint for improvement (only if success is false)"
}

IMPORTANT:
- Return ONLY valid JSON
- If success is true, don't provide a hint
- If success is false, provide a helpful hint
- Be encouraging but honest
- Focus on the specific assignment requirements`;

    const generationConfig = {
      temperature: 0.3,
      maxOutputTokens: 500,
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

    try {
      const validationResult = JSON.parse(raw);
      console.log("✅ Gemini validation result:", validationResult);
      return validationResult;
    } catch (parseError) {
      // Fallback if JSON parsing fails
      console.error("❌ Failed to parse Gemini response:", parseError);
      return {
        success: false,
        message: "Code evaluation failed. Please try again.",
        hint: "Make sure your code is syntactically correct and addresses the assignment requirements.",
      };
    }
  } catch (error) {
    console.error("❌ validateCodeWithGemini - Error:", error);
    return {
      success: false,
      message: "Failed to validate code. Please try again.",
      hint: "Check your code for syntax errors and make sure it addresses the assignment.",
    };
  }
}
