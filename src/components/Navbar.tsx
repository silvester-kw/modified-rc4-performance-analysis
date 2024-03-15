import Link from "next/link";
import React from "react";

export default function Navbar() {
  return (
    <div className="flex mb-4 container font-mono py-4 text-lg">
      <ul className="flex w-full justify-between font-medium">
        <Link href="/modified-rc4">
          <li className="hover:font-bold bg-red-800 hover:bg-red-950 text-white rounded px-3">Mod. RC4</li>
        </Link>
        <Link href="/vigenere-cipher">
          <li className="hover:font-bold">Vigenere Cipher</li>
        </Link>
        <Link href="/extended-vigenere-cipher">
          <li className="hover:font-bold">Extended Vigenere Cipher</li>
        </Link>
        <Link href="/playfair-cipher">
          <li className="hover:font-bold">Playfair Cipher</li>
        </Link>
        <Link href="/product-cipher">
          <li className="hover:font-bold">Product Cipher</li>
        </Link>
        <Link href="/autokey-vigenere-cipher">
          <li className="hover:font-bold">Autokey Vigenere Cipher</li>
        </Link>
        <Link href="/affine-cipher">
          <li className="hover:font-bold">Affine Cipher</li>
        </Link>
      </ul>
    </div>
  );
}
