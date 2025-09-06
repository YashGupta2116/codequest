"use client";

import { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { validateCodeWithGemini } from "@/actions/validateCodeWithGemini";
import Toaster from "./Toaster";

const LANGS = [
  {
    id: 63,
    label: "javascript",
    monaco: "javascript",
    template: `// JavaScript Code
console.log("Hello World!");

// Write your code here
function greet(name) {
    return \`Hello, \${name}!\`;
}

console.log(greet("Developer"));`,
  },
  {
    id: 71,
    label: "python",
    monaco: "python",
    template: `# Python Code
print("Hello World!")

# Write your code here
def greet(name):
    return f"Hello, {name}!"

print(greet("Developer"))`,
  },
  {
    id: 62,
    label: "java",
    monaco: "java",
    template: `// Java Code
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello World!");
        
        // Write your code here
        String name = "Developer";
        System.out.println(greet(name));
    }
    
    public static String greet(String name) {
        return "Hello, " + name + "!";
    }
}`,
  },
  {
    id: 54,
    label: "c++",
    monaco: "cpp",
    template: `// C++ Code
#include <iostream>
using namespace std;

string greet(string name) {
    return "Hello, " + name + "!";
}

int main() {
    cout << "Hello World!" << endl;
    cout << greet("Developer") << endl;
    return 0;
}`,
  },
  {
    id: 50,
    label: "c",
    monaco: "c",
    template: `// C Code
#include <stdio.h>

char* greet(char name[]) {
    static char result[50];
    sprintf(result, "Hello, %s!", name);
    return result;
}

int main() {
    printf("Hello World!\\n");
    printf("%s\\n", greet("Developer"));
    return 0;
}`,
  },
  {
    id: 68,
    label: "php",
    monaco: "php",
    template: `<?php
// PHP Code
echo "Hello World!\\n";

// Write your code here
function greet($name) {
    return "Hello, " . $name . "!";
}

echo greet("Developer");
?>`,
  },
  {
    id: 73,
    label: "rust",
    monaco: "rust",
    template: `// Rust Code
fn greet(name: &str) -> String {
    format!("Hello, {}!", name)
}

fn main() {
    println!("Hello World!");
    println!("{}", greet("Developer"));
}`,
  },
  {
    id: 60,
    label: "go",
    monaco: "go",
    template: `// Go Code
package main
import "fmt"

func greet(name string) string {
    return "Hello, " + name + "!"
}

func main() {
    fmt.Println("Hello World!")
    fmt.Println(greet("Developer"))
}`,
  },
];

export default function CodeRunner({
  course,
  assignment,
  levelTitle,
  onValidationResult,
}) {
  const title = course;

  // Function to get language from course title
  const getLanguageFromTitle = (courseTitle) => {
    const title = courseTitle?.toLowerCase() || "";

    if (title.includes("javascript") || title.includes("js")) {
      return LANGS.find((l) => l.label === "javascript");
    } else if (title.includes("python")) {
      return LANGS.find((l) => l.label === "python");
    } else if (title.includes("java")) {
      return LANGS.find((l) => l.label === "java");
    } else if (title.includes("c++") || title.includes("cpp")) {
      return LANGS.find((l) => l.label === "c++");
    } else if (title.includes("c ")) {
      return LANGS.find((l) => l.label === "c");
    } else if (title.includes("php")) {
      return LANGS.find((l) => l.label === "php");
    } else if (title.includes("rust")) {
      return LANGS.find((l) => l.label === "rust");
    } else if (title.includes("go")) {
      return LANGS.find((l) => l.label === "go");
    }
    return LANGS[0]; // default to JavaScript
  };

  const [lang, setLang] = useState(
    () => getLanguageFromTitle(title) || LANGS[0]
  );
  const [code, setCode] = useState(lang?.template || LANGS[0].template);
  const [stdin, setStdin] = useState("");
  const [output, setOutput] = useState("Run code to see output...");
  const [running, setRunning] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [toasterMessage, setToasterMessage] = useState("");
  const [toasterType, setToasterType] = useState("success");

  // Update language when course title changes
  useEffect(() => {
    const newLang = getLanguageFromTitle(title);
    setLang(newLang);
    setCode(newLang.template);
    setOutput("Run code to see output...");
    setStdin("");
    setToasterMessage("");
  }, [title]);

  // Validate code with Gemini
  const validateCode = async () => {
    if (!code.trim()) {
      setToasterMessage("Please write some code before submitting!");
      setToasterType("error");
      return;
    }

    if (!assignment) {
      setToasterMessage("No assignment selected for validation");
      setToasterType("error");
      return;
    }

    setIsValidating(true);

    try {
      console.log(
        "🔍 Validating code with Gemini for assignment:",
        assignment.title
      );

      const result = await validateCodeWithGemini(
        code,
        lang.label,
        assignment,
        levelTitle
      );

      // Show toaster based on result
      if (result.success) {
        setToasterMessage(result.message);
        setToasterType("success");
      } else {
        setToasterMessage(
          result.message + (result.hint ? ` 💡 ${result.hint}` : "")
        );
        setToasterType("error");
      }

      // Call parent callback if provided
      if (onValidationResult) {
        onValidationResult({
          ...result,
          code: code,
        });
      }
    } catch (error) {
      console.error("❌ Validation error:", error);
      setToasterMessage("Failed to validate code. Please try again.");
      setToasterType("error");
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <div className="w-full h-full mx-auto p-4">
      {/* Controls */}
      <div className="flex justify-between mb-3">
        <button
          onClick={validateCode}
          disabled={isValidating || !assignment}
          className={`rounded-xl px-4 py-2 font-medium ${
            isValidating || !assignment
              ? "bg-neutral-700"
              : "bg-blue-600 hover:bg-blue-700"
          } text-white shadow text-sm`}
        >
          {isValidating ? "Validating..." : "Submit ✓"}
        </button>
      </div>

      {/* Editor */}
      <div className="rounded-xl overflow-hidden ring-1 ring-neutral-800 mb-3">
        <Editor
          height="300px"
          defaultLanguage={lang.monaco}
          language={lang.monaco}
          value={code}
          theme="vs-dark"
          onChange={(v) => setCode(v || "")}
          options={{
            fontFamily: "JetBrains Mono, Consolas, monospace",
            fontSize: 14,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            automaticLayout: true,
          }}
        />
      </div>

      {/* Toaster */}
      <Toaster
        message={toasterMessage}
        type={toasterType}
        onClose={() => setToasterMessage("")}
      />

      {/* Stdin & Terminal */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Input */}
        <div className="flex flex-col">
          <label className="text-sm text-neutral-400 mb-1">Input (stdin)</label>
          <textarea
            className="rounded-xl bg-neutral-900 text-white p-3 border border-neutral-800 min-h-[120px]"
            placeholder="Type input data here..."
            value={stdin}
            onChange={(e) => setStdin(e.target.value)}
          />
        </div>

        {/* Output */}
        <div className="flex flex-col">
          <label className="text-sm text-neutral-400 mb-1">Terminal</label>
          <pre className="rounded-xl bg-black text-neutral-100 p-3 border border-neutral-800 min-h-[120px] whitespace-pre-wrap">
            {output}
          </pre>
        </div>
      </div>
    </div>
  );
}
