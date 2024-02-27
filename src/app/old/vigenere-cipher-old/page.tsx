"use client";

import React from "react";
import { useState, ChangeEvent, useEffect } from "react";

export default function VigenereCipher() {
  const [inputType, setinputType] = useState<string | null>("text");
  const [isTypeOpen, setTypeOpen] = useState(false);
  const [key, setKey] = useState<string>("");
  const [plainText, setPlainText] = useState<string>("");
  const [cipherText, setCipherText] = useState<string>("");

  const handleOptionClick = (option: string) => {
    setinputType(option);
    setTypeOpen(false);
  };

  const handleKeyChange = (e: ChangeEvent<HTMLInputElement>) => {
    setKey(e.target.value);
  };
  const handlePlainTextChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPlainText(e.target.value);
  };

  const encrypt = () => {
    if (!plainText || !key) {
      alert("Please input plain text and enter a key."); // Jika plain text atau key kosong
      return;
    }
    let ciphertext = "";
    for (let i = 0; i < plainText.length; i++) {
      const char = plainText.charAt(i);
      const isUpperCase = char === char.toUpperCase();

      if (char.match(/[A-Z]/i)) {
        const plainTextCharCode = char.toUpperCase().charCodeAt(0) - "A".charCodeAt(0);
        const keyCharCode = key[i % key.length].toUpperCase().charCodeAt(0) - "A".charCodeAt(0);
        const encryptedCharCode = (plainTextCharCode + keyCharCode) % 26;
        const encryptedChar = String.fromCharCode(encryptedCharCode + "A".charCodeAt(0));

        ciphertext += isUpperCase ? encryptedChar : encryptedChar.toLowerCase();
      } else {
        ciphertext += char;
      }
    }

    setCipherText(ciphertext);
  };

  const decrypt = () => {
    let ciphertext = "";
    if (!plainText || !key) {
      alert("Please input plain text and enter a key."); // Jika plain text atau key kosong
      return;
    }
    for (let i = 0; i < plainText.length; i++) {
      const char = plainText.charAt(i);
      const isUpperCase = char === char.toUpperCase();

      if (char.match(/[A-Z]/i)) {
        const plainTextCharCode = char.toUpperCase().charCodeAt(0) - "A".charCodeAt(0);
        const keyCharCode = key[i % key.length].toUpperCase().charCodeAt(0) - "A".charCodeAt(0);
        const decryptedCharCode = (plainTextCharCode - keyCharCode + 26) % 26;
        const decryptedChar = String.fromCharCode(decryptedCharCode + "A".charCodeAt(0));

        ciphertext += isUpperCase ? decryptedChar : decryptedChar.toLowerCase();
      } else {
        ciphertext += char;
      }
    }

    setCipherText(ciphertext);
  };

  return (
    <div>
      <h1 className="font-bold text-xl mb-8">Vigenere Cipher</h1>
      <div className="space-y-2 w-full">
        <div className="flex">
          <div className="w-[150px]">Input Type</div>
          <div className="relative">
            <button onClick={() => setTypeOpen(!isTypeOpen)} className="bg-blue-200 p-2 rounded-md">
              {inputType || "Select an option"}
            </button>
            {isTypeOpen && (
              <div className="absolute mt-2 w-40 bg-white border border-gray-300 rounded-md shadow-md">
                <div key={"text"} onClick={() => handleOptionClick("text")} className="cursor-pointer p-2 hover:bg-gray-100">
                  text
                </div>
                <div key={"file"} onClick={() => handleOptionClick("file")} className="cursor-pointer p-2 hover:bg-gray-100">
                  file
                </div>
              </div>
            )}
          </div>
        </div>
        {inputType == "text" && (
          <div className="flex">
            <div className="w-[150px]">Plain Text</div>
            <div>
              <label htmlFor="plainText"></label>
              <input type="text" id="plainText" value={plainText} onChange={handlePlainTextChange} className="border-2 border-blue-200 rounded-md w-full " />
            </div>
          </div>
        )}
        <div className="flex w-full">
          <div className="w-[150px]">Key (26 alfabet)</div>
          <div>
            <label htmlFor="key"></label>
            <input type="text" id="key" value={key} onChange={handleKeyChange} className="border-2 border-blue-200 rounded-md w-full " />
          </div>
        </div>
        <div className="flex">
          <div className="w-[150px]"></div>
          <button onClick={encrypt} className="p-2 bg-blue-200 rounded-lg hover:bg-blue-400">
            Encrypt
          </button>
          <button onClick={decrypt} className="ml-2 p-2 bg-blue-200 rounded-lg hover:bg-blue-400 ">
            Decrypt
          </button>
        </div>
        {cipherText != "" && (
          <div className="flex">
            <div className="w-[150px]">Cipher Text</div>
            <div className="w-full">{cipherText}</div>
          </div>
        )}
        <div className="h-[200px]"></div>
        <div className="font-semibold text-lg">NANTI DIHAPUS</div>
        <div>plaintext: {plainText}</div>
        <div>key: {key}</div>
        <div>ciphertext: {cipherText}</div>
      </div>
    </div>
  );
}
