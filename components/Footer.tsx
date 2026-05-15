"use client";

import { Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="py-6 border-t border-[#1e3a5f]/50 bg-[#050b18]">
      <div className="max-w-6xl mx-auto px-6 sm:px-10 text-center">
        <p className="text-slate-600 text-sm flex items-center justify-center gap-1.5">
          Made with <Heart size={13} className="text-red-500 fill-red-500" /> by Joshua D. Abad
        </p>
      </div>
    </footer>
  );
}
