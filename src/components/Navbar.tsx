import Link from "next/link";
import React from "react";

export default function Navbar() {
  return (
    <div className="flex mb-4 container font-mono py-4 text-lg">
      <ul className="flex w-full justify-between font-medium">
        <Link href="/vigenere-cipher">
          <li className="hover:font-bold">Vigenere Cipher</li>
        </Link>
        <Link href="/extended-vigenere-cipher">
          <li className="hover:font-bold">Extended Vigenere Cipher</li>
        </Link>
        <Link href="/playfair-cipher">
          <li className="hover:font-bold">Playfair Cipher</li>
        </Link>
        <Link href="/new-product-cipher">
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
