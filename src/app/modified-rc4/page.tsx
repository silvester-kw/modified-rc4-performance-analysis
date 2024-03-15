"use client";

import React from "react";
import { useState, ChangeEvent } from "react";
import { FiDownload } from "react-icons/fi";
import { BiChevronDown } from "react-icons/bi";
import ShareLink from "../../components/ShareLink";
import { rc4EncryptModified } from "@/lib/modified/rc4";

const EncryptDecryptFileInput = {
  encrypt: (fileData: Uint8Array, key: string): Uint8Array => {
    const encryptedData = new Uint8Array(fileData.length);

    for (let i = 0; i < fileData.length; i++) {
      encryptedData[i] = (fileData[i] + key.charCodeAt(i % key.length)) % 256;
    }

    return encryptedData;
  },

  decrypt: (fileData: Uint8Array, key: string): Uint8Array => {
    const decryptedData = new Uint8Array(fileData.length);

    for (let i = 0; i < fileData.length; i++) {
      decryptedData[i] = (fileData[i] - key.charCodeAt(i % key.length)) % 256;
    }

    return decryptedData;
  },
};

export default function ExtendedVigenereCipher() {
  // Inisiasi state
  const [inputType, setinputType] = useState<string | null>("text");
  const [isTypeOpen, setTypeOpen] = useState(false);
  const [key, setKey] = useState<string>("");
  const [plainText, setPlainText] = useState<string>("");
  const [cipherText, setCipherText] = useState<string>("");
  const [cipherTextBase64, setCipherTextBase64] = useState<string>("");
  const [code, setCode] = useState<string>("ci");
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
    setPlainText("");
    setKey("");
    setCipherText("");
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
    let ciphertext = rc4EncryptModified(plainText, key);

    setCode("ci");
    setCipherText(ciphertext);
    setCipherTextBase64(Buffer.from(ciphertext).toString("base64"));
  };

  // Algoritma dekripsi untuk form input plain text
  const decryptPlainText = () => {
    if (!plainText || !key) {
      alert("Please input plain text and enter a key."); // Jika plain text atau key kosong
      return;
    }
    let ciphertext = rc4EncryptModified(plainText, key);

    setCode("deci");
    setCipherText(ciphertext);
    setCipherTextBase64(Buffer.from(ciphertext).toString("base64"));
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
    <div className="flex h-[100%]">
      <div className="w-[45%] font-mono font-medium border-black border-4 h-full">
        <div className="p-4 h-[60%] border-b-4 border-black">
          <div className="space-y-2 w-full">
            <div className="flex items-center">
              <div className="w-[147px]">Input Type</div>
              <div className="relative">
                <button onClick={() => setTypeOpen(!isTypeOpen)} className="flex justify-around items-center w-[100px] bg-black text-white p-2 rounded-md hover:font-extrabold hover:text-lg">
                  {inputType || "Select an option"} <BiChevronDown />
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
              <div className="w-[200px]">Key (256 ascii key)</div>
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
        <div className="p-4 border-b-4 border-black bg-[#c3c3c3]">
          <div className="font-mono md:text-md lg:text-xl tracking-tighter font-semibold">18221049 Silvester Kresna W. P. P.</div>
          <div className="font-mono md:text-md lg:text-xl tracking-tighter font-semibold">18221080 Fakhri Putra Mahardika.</div>
        </div>
        <div className="flex items-center justify-center pt-4 px-4 md:text-3xl lg:text-5xl font-reggae">Modified</div>
        <div className="flex items-center justify-center pb-4 px-4 md:text-7xl lg:text-9xl font-reggae">Rivest Cipher 4</div>
      </div>
      <div className="w-[55%] border-black border-r-4 border-y-4">
        <div className="h-[50%] font-mono border-b-4 border-black font-medium p-4">
          {cipherText && (
            <div>
              <div className="w-full">
                <div className="flex justify-between">
                  <div className="w-[150px]">Cipher Text:</div>
                  <ShareLink link={cipherText} />
                </div>
                <div className="w-[auto] bg-slate-200 rounded">{cipherText}</div>
              </div>

              <div className="mt-4 flex">
                <a className="bg-black text-white p-2 rounded-lg flex items-center" href={`data:text/plain;charset=utf-8,${encodeURIComponent(cipherText)}`} download={`${code}pher_text.txt`}>
                  <FiDownload className="mr-2" />
                  Download Text File
                </a>
              </div>

              <div className="w-full mt-4">
                <div className="flex justify-between">
                  <div className="">Cipher Text (Base64):</div>
                  <ShareLink link={cipherTextBase64} />
                </div>
                <div className="w-[auto] bg-slate-200 rounded">{cipherTextBase64}</div>
              </div>
            </div>
          )}
          {encryptedFile && (
            <div className="space-y-4">
              <div className="">Encrypted File</div>
              <a
                className="bg-black text-white p-2 rounded-lg flex justify-center items-center w-[300px]"
                href={URL.createObjectURL(encryptedFile)}
                download={`${file?.name?.replace(/\.[^/.]+$/, "") || "encrypted"}_encrypted.${file?.name?.split(".").pop()}`}
              >
                <FiDownload className="mr-2" />
                Download Encrypted File
              </a>
            </div>
          )}

          {decryptedFile && (
            <div className="space-y-4">
              <div className="">Decrypted File</div>
              <a
                className="bg-black text-white p-2 rounded-lg flex justify-center items-center w-[300px]"
                href={URL.createObjectURL(decryptedFile)}
                download={`${file?.name?.replace(/\.[^/.]+$/, "") || "decrypted"}_decrypted.${file?.name?.split(".").pop()}`}
              >
                <FiDownload className="mr-2" />
                Download Decrypted File
              </a>
            </div>
          )}
        </div>
        <div className="h-[50%] outline outline-4 black object-center object-none bg-red-200">
          <img
            src="/arle.png" //
            alt="Description of your image"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}
