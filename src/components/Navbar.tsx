import Link from "next/link";
import React from "react";

export default function Navbar() {
  return (
    <div className="flex mb-4 justify-between font-mono  py-2 px-5">
      <Link href="/">
        <h1 className="font-bold">Classic Cryptography</h1>
      </Link>
      <Link href="/design-baru">
        <div className="hover:font-semibold">Design Baru</div>
      </Link>
      <ul className="flex space-x-6 font-medium">
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
