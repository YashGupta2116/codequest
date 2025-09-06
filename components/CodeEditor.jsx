"use client";

import React, { useState, useEffect } from "react";
import { FaPlay, FaCheck, FaTimes, FaCopy, FaUndo } from "react-icons/fa";

const CodeEditor = ({
  language = "python",
  initialCode = "",
  onCodeChange,
  onSubmit,
  isSubmitting = false,
  testResults = null,
  challenge = null,
}) => {
  const [code, setCode] = useState(initialCode);
  const [showTestResults, setShowTestResults] = useState(false);

  useEffect(() => {
    setCode(initialCode);
  }, [initialCode]);

  useEffect(() => {
    if (testResults) {
      setShowTestResults(true);
    }
  }, [testResults]);

  const handleCodeChange = (newCode) => {
    setCode(newCode);
    if (onCodeChange) {
      onCodeChange(newCode);
    }
  };

  const getLanguageTemplate = () => {
    switch (language.toLowerCase()) {
      case "python":
        return `def solution():
    # Your code here
    pass

# Test your solution
if __name__ == "__main__":
    result = solution()
    print(result)`;
      case "cpp":
        return `#include <iostream>
using namespace std;

int main() {
    // Your code here
    
    return 0;
}`;
      case "java":
        return `public class Solution {
    public static void main(String[] args) {
        // Your code here
    }
}`;
      default:
        return `// Your code here`;
    }
  };

  const resetCode = () => {
    const template = getLanguageTemplate();
    handleCodeChange(template);
  };

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
    } catch (err) {
      console.error("Failed to copy code:", err);
    }
  };

  const getLanguageDisplayName = () => {
    switch (language.toLowerCase()) {
      case "python":
        return "Python";
      case "cpp":
        return "C++";
      case "java":
        return "Java";
      default:
        return language;
    }
  };

  return (
    <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 shadow-xl">
      {/* Editor Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-700/50">
        <div className="flex items-center space-x-3">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span className="text-sm text-slate-400 ml-2">
            {getLanguageDisplayName()} Editor
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={copyCode}
            className="p-2 text-slate-400 hover:text-slate-300 transition-colors"
            title="Copy Code"
          >
            <FaCopy className="text-sm" />
          </button>
          <button
            onClick={resetCode}
            className="p-2 text-slate-400 hover:text-slate-300 transition-colors"
            title="Reset Code"
          >
            <FaUndo className="text-sm" />
          </button>
        </div>
      </div>

      {/* Code Editor */}
      <div className="relative">
        <textarea
          value={code}
          onChange={(e) => handleCodeChange(e.target.value)}
          className="w-full h-96 bg-slate-900/80 text-slate-100 p-4 font-mono text-sm resize-none focus:outline-none border-none"
          placeholder={`Enter your ${getLanguageDisplayName()} solution here...`}
          spellCheck={false}
        />

        {/* Line Numbers */}
        <div className="absolute left-0 top-0 bottom-0 w-12 bg-slate-800/50 text-slate-500 text-xs font-mono p-4 pt-4 pointer-events-none">
          {code.split("\n").map((_, index) => (
            <div key={index} className="leading-6">
              {index + 1}
            </div>
          ))}
        </div>
      </div>

      {/* Test Results */}
      {testResults && showTestResults && (
        <div className="border-t border-slate-700/50 p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-lg font-semibold flex items-center space-x-2">
              {testResults.success ? (
                <>
                  <FaCheck className="text-green-400" />
                  <span className="text-green-400">Solution Accepted!</span>
                </>
              ) : (
                <>
                  <FaTimes className="text-red-400" />
                  <span className="text-red-400">Solution Needs Work</span>
                </>
              )}
            </h4>
            <button
              onClick={() => setShowTestResults(false)}
              className="text-slate-400 hover:text-slate-300"
            >
              <FaTimes />
            </button>
          </div>

          <div className="bg-slate-800/50 rounded-lg p-3 mb-3">
            <p className="text-slate-200 mb-2">{testResults.message}</p>
            {testResults.hint && (
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded p-2">
                <p className="text-yellow-300 text-sm">
                  <strong>Hint:</strong> {testResults.hint}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Submit Button */}
      <div className="flex items-center justify-between p-4 border-t border-slate-700/50">
        <div className="text-sm text-slate-400">
          {challenge && (
            <span>
              XP Reward:{" "}
              <span className="text-yellow-400 font-semibold">
                {challenge.xpReward}
              </span>
            </span>
          )}
        </div>

        <button
          onClick={() => onSubmit(code)}
          disabled={isSubmitting || !code.trim()}
          className={`px-6 py-2 rounded-lg font-semibold transition-all duration-200 flex items-center space-x-2 ${
            isSubmitting || !code.trim()
              ? "bg-gray-600 cursor-not-allowed opacity-50"
              : "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 transform hover:scale-105"
          }`}
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              <span>Submitting...</span>
            </>
          ) : (
            <>
              <FaPlay />
              <span>Submit Solution</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default CodeEditor;
