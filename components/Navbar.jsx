"use client";
import React from 'react';
import AdminControls from './AdminControls';
import Link from 'next/link';

const Navbar = ({ chatID, isPermanent, onSettingsChange }) => {
  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-[#09090b] border-b border-[#fafafa]/10 z-50">
      <div className="h-full max-w-7xl mx-auto px-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <span className="text-xl font-semibold text-[#fafafa]">FlashShare</span>
          {chatID && (
            <>
              <span className="text-[#fafafa]/50">/</span>
              <span className="text-[#fafafa]/80 font-light">{chatID}</span>
            </>
          )}
        </Link>
        {chatID && (
          <div className="flex items-center gap-2">
            <AdminControls 
              chatID={chatID}
              isPermanent={isPermanent}
              onSettingsChange={onSettingsChange}
            />
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;