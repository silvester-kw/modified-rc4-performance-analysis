import Link from "next/link";
import React from "react";

export default function Navbar() {
  return (
    <div className="flex mb-4 container font-mono py-4 text-lg">
      <ul className="flex w-full justify-center space-x-8 font-medium">
        <Link href="/modified-rc4">
          <li className="hover:font-bold bg-red-800 hover:bg-red-950 text-white rounded px-3 border-4 border-red-800">Modified RC4</li>
        </Link>
        <Link href="/rc4">
          <li className="hover:font-bold border-4 rounded px-3 border-red-800">RC 4</li>
        </Link>
      </ul>
    </div>
  );
}
