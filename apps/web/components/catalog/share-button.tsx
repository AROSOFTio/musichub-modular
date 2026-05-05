"use client";

import { useState } from "react";
import { Share2, Link as LinkIcon, Twitter } from "lucide-react";

export function ShareButton({ songUrl, title }: { songUrl: string; title: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const fullUrl = typeof window !== "undefined" ? `${window.location.origin}${songUrl}` : songUrl;

  const handleCopy = () => {
    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative">
      <button onClick={() => setIsOpen(!isOpen)} className="button-secondary">
        <Share2 className="h-4 w-4" />
        Share
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-48 rounded-2xl border border-borderSoft bg-white p-2 shadow-xl z-10">
          <button
            onClick={handleCopy}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
          >
            <LinkIcon className="h-4 w-4" />
            {copied ? "Copied!" : "Copy Link"}
          </button>
          
          <a
            href={`https://twitter.com/intent/tweet?text=Listening to ${encodeURIComponent(title)}&url=${encodeURIComponent(fullUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
          >
            <Twitter className="h-4 w-4" />
            Share on X
          </a>

          <a
            href={`https://wa.me/?text=Check out this song: ${encodeURIComponent(fullUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
          >
            <Share2 className="h-4 w-4 text-green-500" />
            Share on WhatsApp
          </a>
        </div>
      )}
    </div>
  );
}
