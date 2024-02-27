"use client";

import React from "react";
import { useState, ChangeEvent } from "react";

export default function PlaifairCipher() {
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

  const createPlayfairMatrix = (key: any) => {
    const alphabet = "ABCDEFGHIKLMNOPQRSTUVWXYZ";
    let matrix: string[][] = Array.from({ length: 5 }, () => Array(5).fill(""));
    let keyWithoutDuplicates = key.toUpperCase().replace(/J/g, "I");
    keyWithoutDuplicates += alphabet.replace(new RegExp(`[${keyWithoutDuplicates}]`, "g"), "");

    let index = 0;
    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 5; j++) {
        matrix[i][j] = keyWithoutDuplicates[index];
        index++;
      }
    }

    return matrix;
  };

  const findCharInMatrix = (matrix: any, char: any) => {
    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 5; j++) {
        if (matrix[i][j] === char) {
          return [i, j];
        }
      }
    }
    return [-1, -1];
  };

  const encrypt = () => {
    const preparePlainText = plainText
      .toUpperCase()
      .replace(/J/g, "I")
      .replace(/[^A-Z]/g, "");
    const matrix = createPlayfairMatrix(key);
    let ciphertext = "";

    for (let i = 0; i < preparePlainText.length; i += 2) {
      const char1 = preparePlainText[i];
      const char2 = i + 1 < preparePlainText.length ? preparePlainText[i + 1] : "X";

      const [row1, col1] = findCharInMatrix(matrix, char1);
      const [row2, col2] = findCharInMatrix(matrix, char2);

      let encryptedChar1, encryptedChar2;

      if (row1 === row2) {
        encryptedChar1 = matrix[row1][(col1 + 1) % 5];
        encryptedChar2 = matrix[row2][(col2 + 1) % 5];
      } else if (col1 === col2) {
        encryptedChar1 = matrix[(row1 + 1) % 5][col1];
        encryptedChar2 = matrix[(row2 + 1) % 5][col2];
      } else {
        encryptedChar1 = matrix[row1][col2];
        encryptedChar2 = matrix[row2][col1];
      }

      ciphertext += encryptedChar1 + encryptedChar2;
    }
    setCipherText(ciphertext);
  };

  return (
    <div>
      <h1 className="font-bold text-xl mb-8">Playfair Cipher</h1>
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
          <button onClick={encrypt} className="ml-2 p-2 bg-blue-200 rounded-lg hover:bg-blue-400 ">
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
