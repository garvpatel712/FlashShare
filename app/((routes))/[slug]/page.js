"use client";
import ChatBox from "../../../components/ChatBox";
import UploadViewer from "../../../components/UploadViewer";
import Navbar from "../../../components/Navbar";
import { Spinner } from "@nextui-org/spinner";
import NextImage from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { base } from "@uploadcare/upload-client";
import axios from "axios";
import imageCompression from "browser-image-compression";
import debounce from "lodash/debounce";
import toast, { Toaster } from "react-hot-toast";
import TurndownService from "turndown";
import { CircularProgress } from "@nextui-org/progress";
import { TTL_SECONDS } from '../../../lib/constants';

const updateImageStorage = async (uuid, store) => {
  try {
    const response = await fetch(`https://api.uploadcare.com/files/${uuid}/storage/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Uploadcare.Simple ${process.env.NEXT_PUBLIC_UPLOADCARE_KEY}:${process.env.UPLOADCARE_SECRET_KEY}`,
      },
      body: JSON.stringify({ store })
    });
    
    if (!response.ok) {
      throw new Error(`Failed to update storage: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error updating image storage:', error);
    throw error;
  }
};

const Page = () => {
  const [uploads, setUploads] = useState([]);
  const [chatData, setChatData] = useState([]);
  const [textAreaValue, setTextAreaValue] = useState("");
  const { slug } = useParams();
  const [ID, setID] = useState(slug);
  const [isUploading, setIsUploading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [chatSettings, setChatSettings] = useState({ isPermanent: false });

useEffect(() => {
  const handleResize = () => {
    setIsMobile(window.innerWidth <= 1280); // Adjust the width as per your requirement
  };

  window.addEventListener('resize', handleResize);
  handleResize(); // Call it initially to set the initial value

  return () => {
    window.removeEventListener('resize', handleResize);
  };
}, []);

  const fetchChatHistory = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axios.post("/api/fetch", { chatID: ID });
      if (response.status === 200 && response.data.success) {
        setChatData(response.data.data.chatHistory || []);
        setChatSettings({
          isPermanent: response.data.data.chat.isPermanent
        });
        setIsLoading(false);
        
        // Show appropriate toast based on chat status
        const chat = response.data.data.chat;
        if (chat.isPermanent) {
          toast.success(
            'This chat is permanently stored 🔒', 
            {
              duration: 4000,
              icon: '💾'
            }
          );
        } else {
          const expiresAt = new Date(chat.updatedAt).getTime() + (TTL_SECONDS * 1000);
          const remainingTime = expiresAt - Date.now();
          const remainingHours = Math.floor(remainingTime / (1000 * 60 * 60));
          const remainingMinutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
          
          if (remainingTime <= 0) {
            toast.error(
              'Chat will expire soon!', 
              {
                duration: 4000,
                icon: '⚠️'
              }
            );
          } else {
            const timeMessage = remainingHours > 0 
              ? `${remainingHours}h ${remainingMinutes}m`
              : `${remainingMinutes}m`;
              
            toast.success(
              `Chat expires in ${timeMessage}`, 
              {
                duration: 4000,
                icon: '⏳'
              }
            );
          }
        }
      } else {
        setIsLoading(false);
        toast.error(response.data.error || "Error fetching chat history");
      }
    } catch (error) {
      setIsLoading(false);
      toast.error("Error fetching chat history");
    }
  }, [ID]);

  const updateChatHistory = useCallback(
    debounce(async (chatHistory) => {
      try {
        const response = await axios.post("/api/update", {
          chatID: ID,
          chatHistory,
        });
        
        if (response.status === 200 && response.data.success) {
          // Update local state immediately
          setChatData(chatHistory);
          toast.success("Saved successfully", {
            duration: 2000,
            icon: '✅'
          });
        } else {
          console.error(
            "Server error when updating chat history:",
            response.data.error
          );
          toast.error("Failed to save changes");
          // Refresh chat data from server on error
          fetchChatHistory();
        }
      } catch (error) {
        console.error("Network error when updating chat history:", error);
        toast.error("Failed to save changes");
        // Refresh chat data from server on error
        fetchChatHistory();
      }
    }, 300),
    [ID, setChatData, fetchChatHistory]
  );

  useEffect(() => {
    const newSlug = decodeURIComponent(slug)
      .replace(/\s+/g, "-")
      .replace(/[^a-zA-Z0-9\-]/g, "");

    if (newSlug !== slug) {
      window.location.replace("/" + newSlug);
      setID(newSlug);
    } else {
      fetchChatHistory();
    }
  }, [fetchChatHistory, slug]);

  const fileUploadClickHandler = useCallback(() => {
    try {
      const fileInput = document.createElement("input");
      fileInput.type = "file";
      fileInput.accept = "image/*";
      fileInput.multiple = true;
      fileInput.click();
      fileInput.addEventListener("change", async (e) => {
        try {
          const files = e.target.files;
          if (files.length > 0) {
            const newUploads = Array.from(files).map((file) => {
              try {
                if (file.type.startsWith("image/")) {
                  if (file.size > 10485760) {
                    toast.error("Image files larger than 10MB are not allowed");
                    return null;
                  }
                  const newUpload = {
                    id: new Date().getTime().toString(),
                    type: file.type.split("/")[0],
                    name: file.name,
                    file: file,
                  };
                  newUpload.url = URL.createObjectURL(file);
                  return newUpload;
                } else {
                  toast.error("Only image files are allowed");
                  return null;
                }
              } catch (error) {
                console.error("Error processing file:", error);
                toast.error("Error processing file");
                return null;
              }
            });
            setUploads((prevUploads) => [
              ...prevUploads,
              ...newUploads.filter(Boolean),
            ]);
          }
        } catch (error) {
          console.error("Error in file input change event:", error);
          toast.error("Error in file input change event");
        }
      });
    } catch (error) {
      console.error("Error in file upload click handler:", error);
      toast.error("Error in file upload click handler");
    }
  }, []);

  const insertClickHandler = useCallback(async () => {
    try {
      setIsUploading(true);
      const message = textAreaValue;
      if (message.length === 0 && uploads.length === 0) {
        toast.error("Please enter a message or upload an image");
        setIsUploading(false);
        return;
      }

      toast.loading("Uploading chat...");
      const chatUploads = await Promise.all(
        uploads.map(async (upload) => {
          try {
            if (upload.type === "image") {
              console.log("Compressing image:", upload.name);
              const file = upload.file instanceof Blob ? upload.file : dataURItoBlob(upload.file);
              const compressedFile = await imageCompression(file, {
                maxSizeMB: 1,
                maxWidthOrHeight: 1920,
              });

              console.log("Uploading image:", upload.name);
              const result = await base(compressedFile, {
                publicKey: process.env.NEXT_PUBLIC_UPLOADCARE_KEY,
                store: true,
                metadata: {
                  subsystem: "uploader",
                  chatID: ID,
                },
              });
              const fileId = Object.values(result)[0];
              return {
                id: fileId,
                type: upload.type,
                name: upload.name,
                url: `https://ucarecdn.com/${fileId}/${upload.name}`,
                uuid: fileId // Store the UUID for future reference
              };
            }
            return upload;
          } catch (error) {
            console.error("Error processing upload:", error);
            toast.error("Error processing upload");
            return null;
          }
        })
      );
      toast.dismiss();

      const newChat = {
        message,
        uploads: chatUploads.filter(Boolean),
      };
      
      const newData = [...chatData, newChat];
      await updateChatHistory(newData);
      
      setTextAreaValue("");
      setUploads([]);
      setIsUploading(false);
    } catch (error) {
      console.error("Error in insert handler:", error);
      toast.error("Failed to send message");
      setIsUploading(false);
    }
  }, [chatData, textAreaValue, uploads, updateChatHistory, ID]);

  const textPasteHandler = useCallback((e) => {
    try {
      e.preventDefault();
      const clipboardData = e.clipboardData || window.clipboardData;
      const htmlContent = clipboardData.getData('text/html');
      const plainText = clipboardData.getData('text/plain');

      // Check if the text comes from a code editor (VSCode, etc.)
      const isFromCodeEditor = (text) => {
        // Common code editor indicators in HTML content
        if (htmlContent) {
          return htmlContent.includes('class="code"') || 
                 htmlContent.includes('class="editor"') ||
                 htmlContent.includes('vscode') ||
                 htmlContent.includes('monaco-editor') ||
                 htmlContent.includes('ace_editor') ||
                 htmlContent.includes('highlight-');
        }
        return false;
      };

      // If content is from a code editor, treat it as code regardless of content
      if (isFromCodeEditor(plainText)) {
        const language = detectLanguage(plainText);
        const formattedText = `\`\`\`${language}\n${plainText.trim()}\n\`\`\`\n`;
        
        const textArea = e.target;
        const start = textArea.selectionStart;
        const end = textArea.selectionEnd;
        const text = textArea.value;
        const before = text.substring(0, start);
        const after = text.substring(end);

        setTextAreaValue(before + formattedText + after);
        return;
      }

      // If HTML content exists and not from code editor, proceed with HTML handling
      if (htmlContent && !isFromCodeEditor(plainText)) {
        const turndownService = new TurndownService({
          headingStyle: 'atx',
          codeBlockStyle: 'fenced',
          emDelimiter: '_'
        });
        
        // Configure turndown to handle code blocks better
        turndownService.addRule('codeBlocks', {
          filter: ['pre'],
          replacement: function(content, node) {
            const language = node.getAttribute('class')?.replace('language-', '') || '';
            return `\n\`\`\`${language}\n${content}\n\`\`\`\n`;
          }
        });

        // Don't wrap code blocks that are already markdown
        turndownService.addRule('preserveMarkdownCodeBlocks', {
          filter: function(node, options) {
            return node.textContent.startsWith('```') && node.textContent.includes('\n');
          },
          replacement: function(content) {
            return content;
          }
        });

        let markdown = turndownService.turndown(htmlContent);
        
        // Insert the markdown at cursor position
        const textArea = e.target;
        const start = textArea.selectionStart;
        const end = textArea.selectionEnd;
        const text = textArea.value;
        const before = text.substring(0, start);
        const after = text.substring(end);

        setTextAreaValue(before + markdown + after);
        
        // Update cursor position
        const newCursorPos = start + markdown.length;
        setTimeout(() => {
          textArea.selectionStart = newCursorPos;
          textArea.selectionEnd = newCursorPos;
        }, 0);
        
        return;
      }

      // If no HTML content or not from code editor, proceed with existing code detection
      const isCode = (text) => {
        const codePatterns = [
          /^(const|let|var|function|class|import|export|if|for|while)/m,
          /[{};]/,
          /\b(public|private|protected)\b/,
          /^\s*(def|class|module|require|import)\b/m,
          /[<>{}()[\]]/,
          /^import\s+.*\s+from\s+['"].*['"];?$/m,
          /^export\s+/m,
          /=>\s*{/,
          /\bfunction\s*\w*\s*\(/,
          /\bconst\s+\w+\s*=\s*\(/,
          // Additional patterns for better code detection
          /^\s*[a-zA-Z_$][a-zA-Z0-9_$]*\s*\([^)]*\)\s*{/m, // Function declarations
          /^\s*@\w+/m,  // Decorators
          /^\s*#include/m,  // C/C++ includes
          /^\s*package\s+\w+/m,  // Java/Kotlin packages
          /^\s*using\s+\w+/m,  // C# using statements
          /^\s*#pragma/m,  // Preprocessor directives
          /^\s*\/\/ .*/m,  // Single-line comments
          /^\s*\/\* .*\*\//m,  // Multi-line comments
          /^\s*<!--.*-->/m,  // HTML comments
          /^\s*\* @\w+/m,  // JSDoc comments
          /^\s*[a-zA-Z_$][a-zA-Z0-9_$]*:\s*function/m, // Object method definitions
          /=>\s*[^{]/m,  // Arrow functions without blocks
          /\$\{.*\}/,  // Template literals
          /\b(?:true|false|null|undefined|NaN)\b/,  // Common programming literals
          /[+\-*/%]=(?!=)/,  // Assignment operators
          /===?|!==?|<=|>=|[<>]/,  // Comparison operators
          /&&|\|\||\?\?/,  // Logical operators
          /\b(?:return|break|continue|throw)\b/,  // Control flow keywords
          /\b(?:try|catch|finally)\b/,  // Exception handling
          /\b(?:async|await)\b/,  // Async/await keywords
          /^\s*[#@][a-zA-Z]\w*/m  // Decorators/attributes
        ];
        return codePatterns.some(pattern => pattern.test(text));
      };

      // Enhanced language detection with better JSON handling
      const detectLanguage = (text) => {
        // Try to parse as JSON first
        try {
          JSON.parse(text);
          // If it parses successfully and has typical JSON structure
          if ((text.startsWith('{') && text.endsWith('}')) || 
              (text.startsWith('[') && text.endsWith(']'))) {
            return 'json';
          }
        } catch (e) {
          // Not valid JSON, continue with other checks
        }

        // Check for file extensions in comments or strings
        const fileExtMatch = text.match(/\.(jsx?|tsx?|py|java|php|html|css|scss|json|xml|yaml|md|sql|sh|bash|zsh|rs|go|rb|kt|swift)$/m);
        if (fileExtMatch) {
          const ext = fileExtMatch[1].toLowerCase();
          // Map extensions to languages
          const extensionMap = {
            'js': 'javascript',
            'jsx': 'jsx',
            'ts': 'typescript',
            'tsx': 'tsx',
            'py': 'python',
            'java': 'java',
            'php': 'php',
            'html': 'html',
            'css': 'css',
            'scss': 'scss',
            'json': 'json',
            'xml': 'xml',
            'yaml': 'yaml',
            'yml': 'yaml',
            'md': 'markdown',
            'sql': 'sql',
            'sh': 'bash',
            'bash': 'bash',
            'zsh': 'bash',
            'rs': 'rust',
            'go': 'go',
            'rb': 'ruby',
            'kt': 'kotlin',
            'swift': 'swift'
          };
          return extensionMap[ext] || 'javascript';
        }

        // Check for specific language patterns
        if (text.includes('<?php')) return 'php';
        if (text.includes('<?xml')) return 'xml';
        if (text.match(/^(SELECT|INSERT|UPDATE|DELETE|CREATE|DROP|ALTER)\s/i)) return 'sql';
        if (text.match(/^#!/)) return 'bash';
        if (text.match(/^(package\s+main|import\s+"|func\s+\w+)/)) return 'go';
        if (text.match(/^(use\s+strict|use\s+warnings)/)) return 'perl';
        if (text.match(/^(public\s+class|private\s+class)/)) return 'java';
        if (text.match(/^(def\s+|class\s+\w+:)/)) return 'python';
        
        // React/JSX specific patterns
        if (
          (/<[A-Z][A-Za-z0-9]*/.test(text) && /\/>/.test(text)) ||
          (/import\s+.*\s+from\s+['"]react['"]/.test(text)) ||
          (/className=/.test(text) && /<\//.test(text)) ||
          (/useEffect|useState|useCallback|useMemo/.test(text)) ||
          (/props\./.test(text) && /=>/.test(text))
        ) {
          return 'jsx';
        }

        // CSS specific patterns
        if (text.match(/{[\s\S]*}/) && text.match(/:\s*[#\w-]+;/)) return 'css';
        
        // HTML specific patterns
        if (text.match(/<\/?[a-z][\s\S]*>/i) && !text.includes('className=')) return 'html';

        // Default to javascript if no specific pattern is matched
        return 'javascript';
      };

      // Format the pasted text
      let formattedText = '';
      if (isCode(plainText)) {
        const language = detectLanguage(plainText);
        const lines = plainText.split('\n');
        const minIndent = lines
          .filter(line => line.trim())
          .reduce((min, line) => {
            const indent = line.match(/^\s*/)[0].length;
            return indent < min ? indent : min;
          }, Infinity);
        
        const normalizedText = lines
          .map(line => line.slice(minIndent))
          .join('\n')
          .trim();

        formattedText = `\`\`\`${language}\n${normalizedText}\n\`\`\`\n`;
      } else {
        formattedText = plainText;
      }

      // Insert the formatted text at cursor position
      const textArea = e.target;
      const start = textArea.selectionStart;
      const end = textArea.selectionEnd;
      const text = textArea.value;
      const before = text.substring(0, start);
      const after = text.substring(end);

      setTextAreaValue(before + formattedText + after);
      
      // Update cursor position after paste
      const newCursorPos = start + formattedText.length;
      setTimeout(() => {
        textArea.selectionStart = newCursorPos;
        textArea.selectionEnd = newCursorPos;
      }, 0);

    } catch (error) {
      console.error("Error in text paste handler:", error);
      toast.error("Error handling paste");
      return true;
    }
  }, []);

  const imagePasteHandler = useCallback(
    (e) => {
      try {
        const items = (e.clipboardData || e.originalEvent.clipboardData).items;
        const newUploads = [...uploads];

        for (let i = 0; i < items.length; i++) {
          try {
            if (items[i].type.indexOf("image") !== -1) {
              const blob = items[i].getAsFile();
              const reader = new FileReader();
              const itemType = items[i].type;
              reader.onloadend = function () {
                try {
                  const base64data = reader.result;
                  if (uploads.some((upload) => upload.file === base64data)) {
                    toast.error("This image has already been uploaded");
                    return;
                  }
                  const extension = itemType.split("/")[1];
                  const newUpload = {
                    id: new Date().getTime().toString(),
                    type: "image",
                    name: `image_${new Date().getTime()}.${extension}`,
                    file: base64data,
                    url: URL.createObjectURL(blob),
                  };
                  newUploads.push(newUpload);
                  setUploads(newUploads);
                } catch (error) {
                  console.error("Error in reader onloadend:", error);
                  toast.error("Error in reader onloadend");
                }
              };
              reader.readAsDataURL(blob);
            }
          } catch (error) {
            console.error("Error processing item:", error);
            toast.error("Error processing item");
          }
        }
      } catch (error) {
        console.error("Error in image paste handler:", error);
        toast.error("Error while pasting image");
      }
    },
    [uploads]
  );

  const pasteHandler = useCallback(
    (e) => {
      try {
        e.preventDefault();
        const items = (e.clipboardData || e.originalEvent.clipboardData).items;
        
        // Check if there's an image in the clipboard
        const hasImage = Array.from(items).some(item => item.type.indexOf("image") !== -1);
        
        // Only process text if there's no image
        if (!hasImage) {
          textPasteHandler(e);
        }
        
        imagePasteHandler(e);
      } catch (error) {
        console.error("Error in paste handler:", error);
        toast.error("Error while pasting content");
      }
    },
    [textPasteHandler, imagePasteHandler]
  );

  const dataURItoBlob = useCallback((dataURI) => {
    try {
      const byteString = atob(dataURI.split(",")[1]);
      const mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);

      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }

      return new Blob([ab], { type: mimeString });
    } catch (error) {
      console.error("Error in data URI to blob conversion:", error);
      toast.error("Error in data URI to blob conversion");
      return null;
    }
  }, []);

  return (
    <>
      <Navbar
        chatID={ID}
        isPermanent={chatSettings.isPermanent}
        onSettingsChange={fetchChatHistory}
      />
      <Toaster 
        position="top-center"
        toastOptions={{
          style: {
            background: '#18181b',
            color: '#ffffff',
            border: '1px solid #27272a'
          }
        }}
      />
      <div className="w-full h-full flex justify-center items-end relative pt-16">
        <div className="h-full lg:w-[70%] w-[96%] flex flex-col justify-start items-center">
          <div className="w-full overflow-hidden py-3 flex-1 h-full">
            {isLoading ? (
              // Skeleton loading state
              <div className="w-full h-full flex flex-col gap-4 p-4">
                <div className="w-3/4 h-24 bg-[#27272a]/50 animate-pulse rounded-md"></div>
                <div className="w-2/4 h-24 bg-[#27272a]/50 animate-pulse rounded-md"></div>
                <div className="w-3/4 h-24 bg-[#27272a]/50 animate-pulse rounded-md"></div>
              </div>
            ) : (
              <ChatBox chatData={chatData} />
            )}
          </div>
          <div
            className={`Input-Area ${
              isUploading
                ? "pointer-events-none cursor-not-allowed"
                : "pointer-events-auto"
            } w-full flex justify-center items-center mb-5 max-h-fit relative`}
          >
            <div
              className={`absolute top-0 translate-y-[-100%] left-0 bg-[#09090b] w-full sm:w-[60%] md:w-[40%] aspect-video pb-3 ${
                uploads.length === 0 ? "hidden" : "block"
              }`}
            >
              <div
                id="uploads"
                className="uploads w-full h-full bg-transparant border-[1px] border-[#fafafa]/15 rounded-md overflow-hidden"
              >
                <UploadViewer uploads={uploads} setUploads={setUploads} />
              </div>
            </div>
            <button
              onClick={fileUploadClickHandler}
              className="file-upload-button group bg-transparent border-[1px] duration-200 hover:border-[#fafafa] border-[#fafafa]/15 rounded-md h-full aspect-square mr-2 flex justify-center items-center"
            >
              <div className="relative w-[50%] aspect-square flex justify-center items-center">
                {isUploading ? (
                  <Spinner size="sm" color="current" />
                ) : (
                  <NextImage
                    src="/Upload.svg"
                    fill={true}
                    alt="send"
                    className="object-cover w-full h-full duration-200 opacity-50 group-hover:opacity-100"
                  />
                )}
              </div>
            </button>
            <textarea
              value={textAreaValue}
              onChange={(e) => setTextAreaValue(e.target.value)}
              onPaste={pasteHandler}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  if (isMobile) {
                    // On mobile devices, create a new line
                    e.preventDefault();
                    setTextAreaValue((prevValue) => prevValue + '\n');
                  } else if (!e.shiftKey) {
                    // On desktop devices, send the message if Shift is not pressed
                    e.preventDefault();
                    insertClickHandler();
                  }
                }
              }}
              className="whitespace-pre-wrap text-area-input w-[90%] h-[50px] md:h-[70px] placeholder:text-sm md:placeholder:text-base placeholder:text-[#fafafa]/30 placeholder:font-light bg-transparent resize-none border px-3 pt-3 rounded-md focus:outline-none focus:border-[#fafafa]/70 border-[#fafafa]/15"
              placeholder="Type your message here"
            ></textarea>
            <button
              onClick={insertClickHandler}
              disabled={isUploading}
              className="insert-button aspect-square md:aspect-video flex justify-center items-center h-full hover:bg-yellow-300 bg-yellow-400 text-black text-lg font-medium tracking-wide rounded-md ml-2"
            >
              <div className="relative h-[50%] aspect-square flex justify-center items-center">
                {isUploading ? (
                  <Spinner size="sm" color="current" />
                ) : (
                  <NextImage
                    src="/Send.svg"
                    fill={true}
                    alt="send"
                    className="object-cover w-full h-full"
                  />
                )}
              </div>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
