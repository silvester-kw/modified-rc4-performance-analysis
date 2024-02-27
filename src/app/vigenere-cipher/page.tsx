"use client";

import React from "react";
import { useState, ChangeEvent, useEffect } from "react";

export default function VigenereCipher() {
  const [inputType, setinputType] = useState<string | null>("text");
  const [isTypeOpen, setTypeOpen] = useState(false);
  const [key, setKey] = useState<string>("");
  const [plainText, setPlainText] = useState<string>("");
  const [cipherText, setCipherText] = useState<string>("");

  const [file, setFile] = useState<File | null>(null);
  const [encryptedFile, setEncryptedFile] = useState<Blob | null>(null);
  const [decryptedFile, setDecryptedFile] = useState<Blob | null>(null);

  const handleTypeSelect = (option: string) => {
    setinputType(option);
    setTypeOpen(false);
  };

  const handleKeyChange = (e: ChangeEvent<HTMLInputElement>) => {
    setKey(e.target.value);
  };
  const handlePlainTextChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPlainText(e.target.value);
  };

  const encryptPlainText = () => {
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

  const decryptPlainText = () => {
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

  const handleFileChange = () => {};
  const encryptFile = () => {};
  const decryptFile = () => {};

  return (
    <div className="flex h-[100%]">
      <div className="w-[45%] font-mono font-medium border-black border-4 h-full">
        <div className="p-4 h-[60%] border-b-4 border-black">
          <div className="space-y-2 w-full">
            <div className="flex items-center">
              <div className="w-[147px]">Input Type</div>
              <div className="relative">
                <button onClick={() => setTypeOpen(!isTypeOpen)} className="w-[100px] bg-black text-white p-2 rounded-md hover:font-extrabold hover:text-lg">
                  {inputType || "Select an option"} ↓
                </button>
                {isTypeOpen && (
                  <div className="absolute mt-1 w-40 bg-white border-2 border-black rounded-md shadow-md">
                    <div key={"text"} onClick={() => handleTypeSelect("text")} className="cursor-pointer p-2 hover:bg-gray-100 ">
                      <div>text</div>
                    </div>
                    <div key={"file"} onClick={() => handleTypeSelect("file")} className="cursor-pointer p-2 hover:bg-gray-100">
                      file
                    </div>
                  </div>
                )}
              </div>
              <div className="font-regular text-sm ml-2">Select file or text from dropdown</div>
            </div>
            {inputType == "text" && (
              <div className="flex">
                <div className="w-[200px]">Plain Text</div>
                <div className="w-full">
                  <label htmlFor="plainText"></label>
                  <input type="text" id="plainText" value={plainText} onChange={handlePlainTextChange} className=" px-2 py-2 whitespace-pre-wrap border-black border-2 rounded-lg w-full" placeholder="Type plain text here..." />
                </div>
              </div>
            )}
            {inputType == "file" && (
              <div className="flex">
                <div className="w-[147px]">File Upload</div>
                <input type="file" onChange={handleFileChange} />
              </div>
            )}
            <div className="flex w-full">
              <div className="w-[200px]">Key (26 alphabet)</div>
              <div className="w-full">
                <label htmlFor="key"></label>
                <input type="text" id="key" value={key} onChange={handleKeyChange} className="px-2 py-2 whitespace-pre-wrap border-black border-2 rounded-lg w-full" placeholder="Type key here..." />
              </div>
            </div>
            {inputType == "text" && (
              <div className="flex">
                <div className="w-[150px]"></div>
                <button onClick={encryptPlainText} className="p-2 bg-white text-black outline outline-3 outline-black rounded-lg hover:bg-black hover:text-white focus:bg-black focus:text-white">
                  Encrypt Text
                </button>
                <button onClick={decryptPlainText} className="ml-4 p-2 bg-white text-black outline outline-3 outline-black rounded-lg hover:bg-black hover:text-white">
                  Decrypt Text
                </button>
              </div>
            )}

            {inputType == "file" && (
              <div className="flex">
                <div className="w-[150px]"></div>
                <button onClick={encryptFile} className="p-2 bg-white text-black outline outline-3 outline-black rounded-lg hover:bg-black hover:text-white focus:bg-black focus:text-white">
                  Encrypt File
                </button>
                <button onClick={decryptFile} className="ml-4 p-2 bg-white text-black outline outline-3 outline-black rounded-lg hover:bg-black hover:text-white focus:bg-black focus:text-white">
                  Decrypt File
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="p-4 border-b-4 border-black">
          <div className="font-mono md:text-md lg:text-xl tracking-tighter font-semibold">18221049 Silvester Kresna W. P. P.</div>
          <div className="font-mono md:text-md lg:text-xl tracking-tighter font-semibold">18221080 Fakhri Putra Mahardika.</div>
        </div>
        <div className="flex items-center justify-center pt-4 px-4 md:text-5xl lg:text-7xl font-reggae">Vigenere</div>
        <div className="flex items-center justify-center pb-4 px-4 md:text-7xl lg:text-9xl font-reggae">Cipher</div>
      </div>
      <div className="w-[55%] border-black border-r-4 border-y-4">
        <div className="h-[50%] font-mono border-b-4 border-black font-medium p-4">
          {cipherText != "" && (
            <div className="w-full">
              <div className="w-[150px]">Cipher Text:</div>
              <div className="w-[auto] bg-slate-200 rounded">{cipherText}</div>
            </div>
          )}
          {encryptedFile && (
            <div className="flex">
              <div className="w-[150px]">Encrypted File</div>
              <a className="underline text-blue-500" href={URL.createObjectURL(encryptedFile)} download={`${file?.name?.replace(/\.[^/.]+$/, "") || "encrypted"}_encrypted.${file?.name?.split(".").pop()}`}>
                Download Encrypted File
              </a>
            </div>
          )}

          {decryptedFile && (
            <div className="flex">
              <div className="w-[150px]">Decrypted File</div>
              <a className="underline text-blue-500" href={URL.createObjectURL(decryptedFile)} download={`${file?.name?.replace(/\.[^/.]+$/, "") || "decrypted"}_decrypted.${file?.name?.split(".").pop()}`}>
                Download Decrypted File
              </a>
            </div>
          )}
        </div>
        <div className="h-[50%]  black object-center object-none bg-red-200">
          <img
            src="/kazuha.jpg" //
            alt="Description of your image"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}
