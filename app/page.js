"use client";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Home() {
  const [customID, setCustomID] = useState("");
  const router = useRouter();

  const handleJoin = (e) => {
    e.preventDefault();
    if (customID.trim()) {
      router.push(`/${customID.trim()}`);
    }
  };

  return (
    <main className="min-h-screen bg-[#09090b] text-white">
      <div className="max-w-3xl mx-auto p-4 md:p-8 space-y-16">
        {/* Hero Section */}
        <section className="py-16 md:py-24 space-y-8 text-center">
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-neutral-200 to-neutral-400 bg-clip-text text-transparent">
            FlashShare
          </h1>
          <p className="text-lg md:text-xl text-neutral-400 max-w-xl mx-auto">
            Secure code sharing platform designed for college computer labs
          </p>
          <form onSubmit={handleJoin} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input
              type="text"
              placeholder="Enter chat ID"
              value={customID}
              onChange={(e) => setCustomID(e.target.value)}
              className="bg-neutral-800/50 border-neutral-700 text-neutral-200 placeholder:text-neutral-500"
            />
            <Button 
              type="submit" 
              className="bg-neutral-200 text-neutral-900 hover:bg-neutral-300 transition-all"
            >
              Join Chat
            </Button>
          </form>
        </section>

        {/* Problem Statement */}
        <section className="space-y-6">
          <h2 className="text-2xl font-medium text-neutral-200">The Problem</h2>
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-neutral-900/50 border border-red-500/10">
              <h3 className="text-xl font-medium text-neutral-200 mb-2">🔒 Limited Access</h3>
              <p className="text-neutral-400">College lab computers often restrict access to personal email and cloud services, making it difficult to save and share code.</p>
            </div>
            <div className="p-4 rounded-lg bg-neutral-900/50 border border-red-500/10">
              <h3 className="text-xl font-medium text-neutral-200 mb-2">📸 Documentation Needs</h3>
              <p className="text-neutral-400">Students need to save code snippets and program outputs for assignments and future reference.</p>
            </div>
            <div className="p-4 rounded-lg bg-neutral-900/50 border border-red-500/10">
              <h3 className="text-xl font-medium text-neutral-200 mb-2">⚠️ Security Risks</h3>
              <p className="text-neutral-400">Using personal accounts on lab computers poses security risks if students forget to log out.</p>
            </div>
          </div>
        </section>

        {/* Solution Features */}
        <section className="space-y-6">
          <h2 className="text-2xl font-medium text-neutral-200">Our Solution</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-neutral-900/50 border border-neutral-800">
              <h3 className="text-xl font-medium text-neutral-200">⚡ No Login Required</h3>
              <p className="text-neutral-400">Create and share content instantly with just a chat ID.</p>
            </div>
            <div className="p-4 rounded-lg bg-neutral-900/50 border border-neutral-800">
              <h3 className="text-xl font-medium text-neutral-200">🔄 Auto-Cleanup</h3>
              <p className="text-neutral-400">Content auto-deletes after 24 hours for security.</p>
            </div>
            <div className="p-4 rounded-lg bg-neutral-900/50 border border-neutral-800">
              <h3 className="text-xl font-medium text-neutral-200">📝 Rich Formatting</h3>
              <p className="text-neutral-400">Markdown support with code syntax highlighting.</p>
            </div>
            <div className="p-4 rounded-lg bg-neutral-900/50 border border-neutral-800">
              <h3 className="text-xl font-medium text-neutral-200">📱 Universal Access</h3>
              <p className="text-neutral-400">Access from any device without installation.</p>
            </div>
          </div>
        </section>

        {/* Usage Guide */}
        <section className="space-y-6">
          <h2 className="text-2xl font-medium text-neutral-200">How It Works</h2>
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-neutral-900/50">
              <ol className="list-decimal list-inside space-y-4 text-neutral-400">
                <li className="text-neutral-200">
                  <span>Enter any chat ID</span>
                  <p className="ml-5 mt-1 text-sm text-neutral-400">Choose a simple ID you can share with classmates</p>
                </li>
                <li className="text-neutral-200">
                  <span>Share code and outputs</span>
                  <p className="ml-5 mt-1 text-sm text-neutral-400">Paste code, upload screenshots, or write notes with Markdown</p>
                </li>
                <li className="text-neutral-200">
                  <span>Access anywhere</span>
                  <p className="ml-5 mt-1 text-sm text-neutral-400">Use the same chat ID on your personal device to access content</p>
                </li>
              </ol>
            </div>
          </div>
        </section>

        {/* Detailed Documentation */}
        <section className="space-y-8 border-t border-neutral-800 pt-8">
          <h2 className="text-2xl font-medium text-neutral-200">Complete Guide</h2>
          
          {/* Getting Started */}
          <div className="space-y-4">
            <h3 className="text-xl font-medium text-neutral-300">🚀 Getting Started</h3>
            <div className="space-y-2 bg-neutral-900/50 p-4 rounded-lg">
              <p className="text-neutral-400">
                Welcome to FlashShare! Here's how to get started in 3 simple steps:
              </p>
              <ol className="list-decimal list-inside space-y-3 text-neutral-400 mt-4">
                <li>
                  <span className="text-neutral-200">Choose a Chat ID</span>
                  <p className="ml-5 mt-1">Pick something memorable like your lab batch number (e.g., "lab12") or project name</p>
                </li>
                <li>
                  <span className="text-neutral-200">Share with Classmates</span>
                  <p className="ml-5 mt-1">Copy the URL or tell them the Chat ID - that's all they need to join</p>
                </li>
                <li>
                  <span className="text-neutral-200">Start Collaborating</span>
                  <p className="ml-5 mt-1">Share code, paste screenshots, or write notes - everything syncs in real-time</p>
                </li>
              </ol>
            </div>
          </div>

          {/* Markdown Guide */}
          <div className="space-y-4">
            <h3 className="text-xl font-medium text-neutral-300">📝 Text Formatting</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="bg-neutral-900/50 p-4 rounded-lg">
                  <h4 className="text-lg font-medium text-neutral-300 mb-3">Basic Syntax</h4>
                  <div className="space-y-2 text-sm">
                    <div className="grid grid-cols-2 gap-2">
                      <code className="text-neutral-400"># Heading 1</code>
                      <p className="text-neutral-500">Largest heading</p>
                      
                      <code className="text-neutral-400">## Heading 2</code>
                      <p className="text-neutral-500">Second heading</p>
                      
                      <code className="text-neutral-400">**Bold text**</code>
                      <p className="text-neutral-500">Makes text bold</p>
                      
                      <code className="text-neutral-400">*Italic text*</code>
                      <p className="text-neutral-500">Makes text italic</p>
                      
                      <code className="text-neutral-400">~~Strikethrough~~</code>
                      <p className="text-neutral-500">Strikes through text</p>
                    </div>
                  </div>
                </div>

                <div className="bg-neutral-900/50 p-4 rounded-lg">
                  <h4 className="text-lg font-medium text-neutral-300 mb-3">Lists & Links</h4>
                  <div className="space-y-2 text-sm">
                    <div className="grid grid-cols-2 gap-2">
                      <code className="text-neutral-400">- Bullet point</code>
                      <p className="text-neutral-500">Creates bullet list</p>
                      
                      <code className="text-neutral-400">1. Numbered item</code>
                      <p className="text-neutral-500">Creates numbered list</p>
                      
                      <code className="text-neutral-400">[Link text](URL)</code>
                      <p className="text-neutral-500">Creates clickable link</p>
                      
                      <code className="text-neutral-400">{`>`} Quote text</code>
                      <p className="text-neutral-500">Creates blockquote</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-neutral-900/50 p-4 rounded-lg">
                  <h4 className="text-lg font-medium text-neutral-300 mb-3">Code Formatting</h4>
                  <div className="space-y-3">
                    <div>
                      <p className="text-neutral-400 mb-2">Inline Code:</p>
                      <code className="text-sm bg-neutral-800/50 px-2 py-1 rounded">Use \`code\` for inline</code>
                    </div>
                    <div>
                      <p className="text-neutral-400 mb-2">Code Blocks:</p>
                      <pre className="text-sm bg-neutral-800/50 p-2 rounded">
{`\`\`\`javascript
// Your code here
function example() {
  return "Hello!";
}
\`\`\``}
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Image Upload Guide */}
          <div className="space-y-4">
            <h3 className="text-xl font-medium text-neutral-300">🖼️ Working with Images</h3>
            <div className="bg-neutral-900/50 p-4 rounded-lg">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-lg font-medium text-neutral-300 mb-3">Upload Methods</h4>
                  <ul className="space-y-2 text-neutral-400">
                    <li className="flex items-start gap-2">
                      <span className="text-yellow-400">→</span>
                      <span><strong>Drag & Drop:</strong> Simply drag any image into the chat area</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-yellow-400">→</span>
                      <span><strong>Paste:</strong> Copy an image and press Ctrl/Cmd + V</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-yellow-400">→</span>
                      <span><strong>Upload Button:</strong> Click the image icon to select files</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-lg font-medium text-neutral-300 mb-3">Supported Features</h4>
                  <ul className="space-y-2 text-neutral-400">
                    <li className="flex items-start gap-2">
                      <span className="text-yellow-400">→</span>
                      <span>Automatic image compression</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-yellow-400">→</span>
                      <span>PNG, JPG, GIF support</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-yellow-400">→</span>
                      <span>Preview before sending</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Pro Tips */}
          <div className="space-y-4">
            <h3 className="text-xl font-medium text-neutral-300">💡 Pro Tips</h3>
            <div className="bg-neutral-900/50 p-4 rounded-lg">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-lg font-medium text-neutral-300 mb-3">Keyboard Shortcuts</h4>
                  <ul className="space-y-2 text-neutral-400">
                    <li className="flex items-center gap-2">
                      <kbd className="px-2 py-1 bg-neutral-800 rounded text-sm">Enter</kbd>
                      <span>Send message</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <kbd className="px-2 py-1 bg-neutral-800 rounded text-sm">Shift + Enter</kbd>
                      <span>New line</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <kbd className="px-2 py-1 bg-neutral-800 rounded text-sm">Ctrl/Cmd + V</kbd>
                      <span>Paste content</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-lg font-medium text-neutral-300 mb-3">Best Practices</h4>
                  <ul className="space-y-2 text-neutral-400">
                    <li className="flex items-start gap-2">
                      <span className="text-yellow-400">→</span>
                      <span>Use descriptive chat IDs for easy sharing</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-yellow-400">→</span>
                      <span>Save important content before 24h expiry</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-yellow-400">→</span>
                      <span>Request permanent status for important chats</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center text-neutral-500 py-8 border-t border-neutral-800">
          <p className="text-sm">
            Made with ❤️ by Garv patel, shlok patel, jigar prajapati.
          </p>
        </footer>
      </div>
    </main>
  );
}
