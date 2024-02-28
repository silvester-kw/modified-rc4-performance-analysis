"use client";

import React from "react";
import { useState, ChangeEvent, useEffect } from "react";
import ShareLink from "../../components/ShareLink";

export default function ProductCipher() {
  const [inputType, setinputType] = useState<string | null>("text");
  const [isTypeOpen, setTypeOpen] = useState(false);
  const [key, setKey] = useState<string>("");
  const [key2, setKey2] = useState<string>("");
  const [plainText, setPlainText] = useState<string>("");
  const [cipherText, setCipherText] = useState<string>("");

  const handleOptionClick = (option: string) => {
    setinputType(option);
    setTypeOpen(false);
  };

  const handleKeyChange = (e: ChangeEvent<HTMLInputElement>) => {
    setKey(e.target.value);
  };
  const handleKey2Change = (e: ChangeEvent<HTMLInputElement>) => {
    setKey2(e.target.value);
  };
  const handlePlainTextChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPlainText(e.target.value);
  };

  const encrypt = () => {
    let withoutSpace = plainText.replace(/\s+/g, "");
    let ciphertext = "";
    for (let i = 0; i < withoutSpace.length; i++) {
      const char = withoutSpace.charAt(i);
      const isUpperCase = char === char.toUpperCase();

      if (char.match(/[A-Z]/i)) {
        const plainTextCharCode = char.toUpperCase().charCodeAt(0) - "A".charCodeAt(0);
        const keyCharCode = key[i % key.length].toUpperCase().charCodeAt(0) - "A".charCodeAt(0) || 0;
        const encryptedCharCode = (plainTextCharCode + keyCharCode) % 26;
        const encryptedChar = String.fromCharCode(encryptedCharCode + "A".charCodeAt(0));

        ciphertext += isUpperCase ? encryptedChar : encryptedChar.toLowerCase();
      } else {
        ciphertext += char;
      }
    }
    withoutSpace = ciphertext.replace(/\s+/g, "");

    const numRows = Math.ceil(withoutSpace.length / Number(key2));

    if (Number(key2) !== 0) {
      let secondCiphertext = "";
      while (withoutSpace.length % Number(key2) !== 0) {
        withoutSpace += "x";
      }
      for (let col = 0; col < Number(key2); col++) {
        for (let row = 0; row < numRows; row++) {
          secondCiphertext += withoutSpace[row * Number(key2) + col];
          //secondCiphertext += transpositionMatrix[row][col];
        }
      }
      setCipherText(secondCiphertext);
    } else {
      setCipherText(withoutSpace);
    }
  };

  const decrypt = () => {
    let withoutSpace = plainText.replace(/\s+/g, "");

    const numRows = Math.ceil(withoutSpace.length / Number(key2));

    let firstDeciphertext = "";

    for (let col = 0; col < numRows; col++) {
      for (let row = 0; row < Number(key2); row++) {
        firstDeciphertext += withoutSpace[row * numRows + col];
        //secondCiphertext += transpositionMatrix[row][col];
      }
    }

    //let ciphertext = "";

    const convertedPlainText = firstDeciphertext;
    const convertedKey = key.replace(/\s+/g, "").toUpperCase();

    let decryptedText = "";
    for (let i = 0; i < convertedPlainText.length; i++) {
      const char = convertedPlainText.charAt(i);
      if (char.match(/[A-Z]/i)) {
        const plainTextCharCode = char.toUpperCase().charCodeAt(0) - "A".charCodeAt(0);
        const keyCharCode = convertedKey[i % convertedKey.length].toUpperCase().charCodeAt(0) - "A".charCodeAt(0);
        const decryptedCharCode = (plainTextCharCode - keyCharCode + 26) % 26;
        const decryptedChar = String.fromCharCode(decryptedCharCode + "A".charCodeAt(0));

        decryptedText += decryptedChar.toLowerCase();
      }
    }

    setCipherText(decryptedText);
  };

  return (
    <div>
      <h1 className="font-bold text-xl mb-8">Product Cipher</h1>
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
        <div className="flex w-full">
          <div className="w-[150px]">Key2 (angka)</div>
          <div>
            <label htmlFor="key2"></label>
            <input type="text" id="key2" value={key2} onChange={handleKey2Change} className="border-2 border-blue-200 rounded-md w-full " />
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
        <div>key2: {key2}</div>
        <div>ciphertext: {cipherText}</div>
      </div>
    </div>
  );
}
