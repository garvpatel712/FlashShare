import React, { useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { nightOwl } from "react-syntax-highlighter/dist/esm/styles/prism";
import CopyToClipboard from "react-copy-to-clipboard";
import { GoCopy } from "react-icons/go";
import { GoDownload } from "react-icons/go";
import toast from "react-hot-toast";
import Image from 'next/image';

const customStyle = {
  width: "100%",
  overflowX: "auto",
  whiteSpace: "pre-wrap",
  wordWrap: "break-word",
  fontSize: "1rem",
  lineHeight: "1.5rem",
  backgroundColor: "transparent",
};

const components = {
  code({ node, inline, className, children, ...props }) {
    const match = /language-(\w+)/.exec(className || "");
    return !inline && match ? (
      <div className="relative w-full bg-[#1515156e] rounded-md border border-[#fafafa]/10 overflow-hidden my-4">
        <div className="w-full flex justify-between items-center py-2 px-4 border-b border-[#fafafa]/10">
          <p className="text-sm text-[#fafafa]/70 font-mono">{match[1]}</p>
          <CopyToClipboard
            className="hover:bg-[#fafafa]/5 p-2 rounded-md transition-colors"
            onCopy={() => toast.success("Copied to Clipboard")}
            text={String(children).replace(/\n$/, "")}
          >
            <button>
              <GoCopy className="text-[#fafafa]/50 hover:text-[#fafafa]/80" />
            </button>
          </CopyToClipboard>
        </div>
        <div className="w-full px-2">
          <SyntaxHighlighter
            className="code-block font-mono"
            showLineNumbers={true}
            language={match[1]}
            style={nightOwl}
            customStyle={customStyle}
            PreTag="div"
            {...props}
          >
            {String(children).replace(/\n$/, "")}
          </SyntaxHighlighter>
        </div>
      </div>
    ) : (
      <code className="px-2 py-1 bg-blue-300/[0.08] text-[#fafafa]/90 rounded-md font-mono border border-blue-300/20" {...props}>
        {children}
      </code>
    );
  },
  h1: ({ node, ...props }) => (
    <h1 className="text-4xl font-normal text-[#fafafa] mt-8 mb-6 tracking-tight leading-tight" {...props} />
  ),
  h2: ({ node, ...props }) => (
    <h2 className="text-3xl font-normal text-[#fafafa] mt-7 mb-5 tracking-tight leading-tight" {...props} />
  ),
  h3: ({ node, ...props }) => (
    <h3 className="text-2xl font-normal text-[#fafafa] mt-6 mb-4 tracking-tight leading-snug" {...props} />
  ),
  h4: ({ node, ...props }) => (
    <h4 className="text-xl font-normal text-[#fafafa] mt-5 mb-3 leading-snug" {...props} />
  ),
  h5: ({ node, ...props }) => (
    <h5 className="text-lg font-normal text-[#fafafa] mt-4 mb-2 leading-snug" {...props} />
  ),
  h6: ({ node, ...props }) => (
    <h6 className="text-base font-normal text-[#fafafa] mt-4 mb-2 leading-normal" {...props} />
  ),
  p: ({ node, ...props }) => (
    <p className="text-[1rem] leading-[1.8] tracking-[0.01em] text-[#fafafa]/90 my-4 font-light" {...props} />
  ),
  ul: ({ node, ordered, ...props }) => (
    <ul className="list-disc list-outside space-y-2 my-6 ml-6 text-[#fafafa]/90 marker:text-[#fafafa]/40" {...props} />
  ),
  ol: ({ node, ordered, ...props }) => (
    <ol className="list-decimal list-outside space-y-2 my-6 ml-6 text-[#fafafa]/90 marker:text-[#fafafa]/40" {...props} />
  ),
  li: ({ node, children, ...props }) => (
    <li className="leading-[1.8] pl-2 text-[1rem] font-light" {...props}>
      {children}
    </li>
  ),
  blockquote: ({ node, ...props }) => (
    <blockquote className="border-l-4 border-indigo-300/30 bg-indigo-300/[0.07] pl-6 py-4 my-6 italic text-[#fafafa]/85 text-[1rem] leading-[1.8] font-light rounded-r-md" {...props} />
  ),
  a: ({ node, ...props }) => (
    <a className="text-blue-400 hover:text-blue-300 border-b border-blue-400/30 hover:border-blue-300 transition-colors duration-200" {...props} />
  ),
  table: ({ node, ...props }) => (
    <div className="my-6 w-full overflow-x-auto">
      <table className="min-w-full border border-[#fafafa]/10 rounded-lg" {...props} />
    </div>
  ),
  thead: ({ node, ...props }) => (
    <thead className="bg-[#fafafa]/[0.05] border-b border-[#fafafa]/10" {...props} />
  ),
  th: ({ node, ...props }) => (
    <th className="px-6 py-4 text-left text-sm font-medium text-[#fafafa] tracking-wide border border-[#fafafa]/10" {...props} />
  ),
  td: ({ node, ...props }) => (
    <td className="px-6 py-4 text-[#fafafa]/80 text-sm font-light border border-[#fafafa]/10" {...props} />
  ),
  tbody: ({ node, ...props }) => (
    <tbody className="divide-y divide-[#fafafa]/10" {...props} />
  ),
  tr: ({ node, ...props }) => (
    <tr className="hover:bg-[#fafafa]/[0.02] transition-colors" {...props} />
  ),
  hr: ({ node, ...props }) => (
    <hr className="my-8 border-t border-[#fafafa]/10 w-full" {...props} />
  ),
  strong: ({ node, ...props }) => (
    <strong className="font-normal text-[#fafafa]" {...props} />
  ),
  em: ({ node, ...props }) => (
    <em className="italic text-[#fafafa]/80 font-light" {...props} />
  ),
  kbd: ({ node, ...props }) => (
    <kbd className="px-2 py-1.5 text-sm font-mono bg-[#fafafa]/10 text-[#fafafa]/90 rounded-md border border-[#fafafa]/20 shadow-[inset_0_-1px_0_1px_rgba(250,250,250,0.1)] mx-1" {...props} />
  ),
  mark: ({ node, ...props }) => (
    <mark className="bg-yellow-500/20 text-[#fafafa] px-1 rounded-sm" {...props} />
  ),
  del: ({ node, ...props }) => (
    <del className="bg-red-500/10 text-[#fafafa]/60 px-1 rounded-sm" {...props} />
  ),
};

const downloadFile = async (url, name) => {
  try {
    // Fetch the image data
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.blob();

    // Create an object URL for the image data
    const objectUrl = window.URL.createObjectURL(data);

    // Create a link and simulate a click to download the image
    const link = document.createElement("a");
    link.href = objectUrl;
    link.download = name;
    document.body.appendChild(link);
    link.click();

    // Clean up
    document.body.removeChild(link);
    window.URL.revokeObjectURL(objectUrl);

    toast.success("File Downloaded");
  } catch (error) {
    console.error("An error occurred while downloading the file:", error);
    toast.error("An error occurred while downloading the file.");
  }
};
const ChatBox = ({ chatData = [] }) => {
  // Add ref for the chat container
  const chatContainerRef = useRef(null);

  // Scroll to bottom whenever chatData changes
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [chatData]);

  // Add null check for chatData
  if (!Array.isArray(chatData)) {
    return null; // or return a loading state/error message
  }

  return (
    <div 
      ref={chatContainerRef}
      className="bg-transparent min-h-full flex flex-col gap-y-10 justify-start items-center chat-history w-full px-3 py-2 overflow-x-hidden overflow-y-auto h-[200px]"
    >
      {chatData.map((chat, index) => (
        <div
          key={index}
          className="flex flex-col justify-start items-start w-full"
        >
          <div className="flex flex-col justify-center items-start w-full">
            <ReactMarkdown
              className="w-full"
              remarkPlugins={[remarkGfm]}
              components={components}
            >
              {chat?.message || ''}
            </ReactMarkdown>
          </div>
          {Array.isArray(chat?.uploads) && chat.uploads.length > 0 && (
            <div className="flex flex-wrap flex-row justify-start items-start mt-2">
              {chat.uploads.map((upload, index) => (
                <div key={upload?.id || index} className="mr-2 mb-2">
                  {upload?.type === "image" ? (
                    <div className="relative min-w-fit min-h-fit group">
                      <div
                        key={upload.id}
                        onClick={() => upload?.url && downloadFile(upload.url, upload?.name || 'image')}
                        className="absolute m-1 p-2 bg-[#151515] rounded-md right-0 bottom-0 md:opacity-0 opacity-100 group-hover:opacity-100 hover:cursor-pointer"
                      >
                        <GoDownload size={22} />
                      </div>
                      <Image
                        src={upload?.url || ''}
                        alt={upload?.name || 'image'}
                        width={200}
                        height={200}
                        className="h-[200px] aspect-auto rounded-md object-cover"
                      />
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ChatBox;
