"use client";

import React from "react";
import { useState, ChangeEvent } from "react";

const EncryptDecryptFileInput = {
  encrypt: (fileData: Uint8Array, key: string): Uint8Array => {
    const encryptedData = new Uint8Array(fileData.length);

    for (let i = 0; i < fileData.length; i++) {
      encryptedData[i] = fileData[i] ^ key.charCodeAt(i % key.length);
    }

    return encryptedData;
  },

  decrypt: (fileData: Uint8Array, key: string): Uint8Array => {
    return EncryptDecryptFileInput.encrypt(fileData, key);
  },
};

export default function ExtendedVigenereCipher() {
  // Inisiasi state
  const [inputType, setinputType] = useState<string | null>("text");
  const [isTypeOpen, setTypeOpen] = useState(false);
  const [key, setKey] = useState<string>("");
  const [plainText, setPlainText] = useState<string>("");
  const [cipherText, setCipherText] = useState<string>("");
  // State untuk file
  const [file, setFile] = useState<File | null>(null);
  const [encryptedFile, setEncryptedFile] = useState<Blob | null>(null);
  const [decryptedFile, setDecryptedFile] = useState<Blob | null>(null);

  // Menghandle dropdown tipe input
  const handleTypeSelect = (option: string) => {
    setinputType(option);
    setTypeOpen(false);
    setCipherText("");
    setPlainText("");
    setFile(null);
    setEncryptedFile(null);
    setDecryptedFile(null);
  };

  // Menghandle perubahan key pada form input
  const handleKeyChange = (e: ChangeEvent<HTMLInputElement>) => {
    setKey(e.target.value);
  };

  // Menghandle perubahan plain text pada form input
  const handlePlainTextChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPlainText(e.target.value);
  };

  // Algoritma enkripsi untuk form input plain text
  const encryptPlainText = () => {
    if (!plainText || !key) {
      alert("Please input plain text and enter a key."); // Jika plain text atau key kosong
      return;
    }
    let ciphertext = "";
    for (let i = 0; i < plainText.length; i++) {
      const char = plainText.charAt(i);
      const keyChar = key[i % key.length];

      const encryptedCharCode = (char.charCodeAt(0) + keyChar.charCodeAt(0)) % 256;
      const encryptedChar = String.fromCharCode(encryptedCharCode);

      ciphertext += encryptedChar;
    }

    setCipherText(ciphertext);
  };

  // Algoritma dekripsi untuk form input plain text
  const decryptPlainText = () => {
    if (!plainText || !key) {
      alert("Please input plain text and enter a key."); // Jika plain text atau key kosong
      return;
    }
    let ciphertext = "";
    for (let i = 0; i < plainText.length; i++) {
      const char = plainText.charAt(i);
      const keyChar = key[i % key.length];

      const decryptedCharCode = (char.charCodeAt(0) - keyChar.charCodeAt(0) + 256) % 256;
      const decryptedChar = String.fromCharCode(decryptedCharCode);

      ciphertext += decryptedChar;
    }

    setCipherText(ciphertext);
  };

  // Menghandle perubahan file input
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files && event.target.files[0];
    setFile(selectedFile || null);
  };

  // Enkripsi file input
  const encryptFile = () => {
    if (!file || !key) {
      alert("Please select a file and enter a key."); // Jika file atau key kosong
      return;
    }

    const fileReader = new FileReader();

    fileReader.onload = (e: ProgressEvent<FileReader>) => {
      const fileData = new Uint8Array(e.target?.result as ArrayBuffer);
      const encryptedData = EncryptDecryptFileInput.encrypt(fileData, key);

      const encryptedBlob = new Blob([new Uint8Array(encryptedData)], { type: file.type });
      setEncryptedFile(encryptedBlob);
      setDecryptedFile(null);
    };

    fileReader.readAsArrayBuffer(file);
  };

  // Dekripsi file input
  const decryptFile = () => {
    if (!file || !key) {
      alert("Please select a file and enter a key.");
      return;
    }

    const fileReader = new FileReader();

    fileReader.onload = (e: ProgressEvent<FileReader>) => {
      const fileData = new Uint8Array(e.target?.result as ArrayBuffer);
      const decryptedData = EncryptDecryptFileInput.decrypt(fileData, key);

      const decryptedBlob = new Blob([new Uint8Array(decryptedData)], { type: file.type });
      setDecryptedFile(decryptedBlob);
      setEncryptedFile(null);
    };

    fileReader.readAsArrayBuffer(file);
  };

  // Program utama
  return (
    <div>
      <h1 className="font-bold text-xl mb-8">Extended Vigenere Cipher</h1>
      <div className="space-y-2 w-full">
        <div className="flex">
          <div className="w-[150px]">Input Type</div>
          <div className="relative">
            <button onClick={() => setTypeOpen(!isTypeOpen)} className="bg-blue-200 p-2 rounded-md">
              {inputType || "Select an option"}
            </button>
            {isTypeOpen && (
              <div className="absolute mt-2 w-40 bg-white border border-gray-300 rounded-md shadow-md">
                <div key={"text"} onClick={() => handleTypeSelect("text")} className="cursor-pointer p-2 hover:bg-gray-100">
                  text
                </div>
                <div key={"file"} onClick={() => handleTypeSelect("file")} className="cursor-pointer p-2 hover:bg-gray-100">
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
        {inputType == "file" && (
          <div className="flex">
            <div className="w-[150px]">Plain Text</div>
            <input type="file" onChange={handleFileChange} />
          </div>
        )}
        <div className="flex w-full">
          <div className="w-[150px]">Key (256 ascii key)</div>
          <div>
            <label htmlFor="key"></label>
            <input type="text" id="key" value={key} onChange={handleKeyChange} className="border-2 border-blue-200 rounded-md w-full " />
          </div>
        </div>
        {inputType == "text" && (
          <div className="flex">
            <div className="w-[150px]"></div>
            <button onClick={encryptPlainText} className="p-2 bg-blue-200 rounded-lg hover:bg-blue-400">
              Encrypt
            </button>
            <button onClick={decryptPlainText} className="ml-2 p-2 bg-blue-200 rounded-lg hover:bg-blue-400 ">
              Decrypt
            </button>
          </div>
        )}
        {cipherText != "" && (
          <div className="flex">
            <div className="w-[150px]">Cipher Text</div>
            <div className="w-full">{cipherText}</div>
          </div>
        )}

        {inputType == "file" && (
          <div>
            <div className="flex">
              <div className="w-[150px]"></div>
              <button onClick={encryptFile} className="p-2 bg-blue-200 rounded-lg hover:bg-blue-400">
                Encrypt File
              </button>
              <button onClick={decryptFile} className="ml-2 p-2 bg-blue-200 rounded-lg hover:bg-blue-400">
                Decrypt File
              </button>
            </div>
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
