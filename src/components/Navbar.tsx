import Link from "next/link";
import React from "react";

export default function Navbar() {
  return (
    <div className="flex mb-4 container font-mono py-4 text-lg">
      <ul className="flex w-full justify-around font-medium">
        <Link href="/vigenere-cipher">
          <li className="hover:font-semibold">Vigenere Cipher</li>
        </Link>
        <Link href="/extended-vigenere-cipher">
          <li className="hover:font-semibold">Extended Vigenere Cipher</li>
        </Link>
        <Link href="/playfair-cipher">
          <li className="hover:font-semibold">Playfair Cipher</li>
        </Link>
        <Link href="/product-cipher">
          <li className="hover:font-semibold">Product Cipher</li>
        </Link>
      </ul>
    </div>
  );
}
