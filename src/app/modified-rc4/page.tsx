"use client";

import React, { useState, ChangeEvent } from "react";
import { FiDownload } from "react-icons/fi";
import { BiChevronDown } from "react-icons/bi";
import ShareLink from "../../components/ShareLink";
import { rc4EncryptDecryptModified, rc4EncryptDecryptFileModified } from "@/lib/modified/rc4";
import ByteDistributionChart from "@/components/ByteDistributionChart";

const countByteDistribution = (data: Uint8Array): number[] => {
  const distribution = Array(256).fill(0);
  data.forEach((byte) => {
    distribution[byte]++;
  });
  return distribution;
};

const calculateSecrecy = (key: string, cipher: Uint8Array): number => {
  const keyBytes = new TextEncoder().encode(key);
  const countedKey = countByteDistribution(keyBytes);
  const countedCipher = countByteDistribution(cipher);

  let entropy = 0;
  let secrecy = 0;

  for (let i = 0; i < 256; i++) {
    const p_k = countedKey[i] / keyBytes.length;
    const p_c = countedCipher[i] / cipher.length;

    if (p_k > 0) {
      entropy += p_k * Math.log2(p_k);
      secrecy += -p_c * entropy;
    }
  }

  // Log intermediate steps to debug
  console.log("Key Distribution: ", countedKey);
  console.log("Cipher Distribution: ", countedCipher);
  console.log("Calculated Entropy (should be negative): ", entropy); // Entropy is usually negative
  console.log("Calculated Secrecy: ", secrecy);

  return secrecy;
};

const calculateEntropy = (data: Uint8Array): number => {
  const frequency: { [key: string]: number } = {};
  for (let i = 0; i < data.length; i++) {
    const char = data[i];
    frequency[char] = (frequency[char] || 0) + 1;
  }

  const dataSize = data.length;
  let entropy = 0;
  for (const char in frequency) {
    const p = frequency[char] / dataSize;
    entropy -= p * Math.log2(p);
  }

  return entropy;
};

const EncryptDecryptFileInput = {
  encrypt: (fileData: Uint8Array, key: string): Uint8Array => {
    // const encryptedData = new Uint8Array(fileData.length);

    const encryptedData = rc4EncryptDecryptFileModified(fileData, key);
    // for (let i = 0; i < fileData.length; i++) {
    //   encryptedData[i] = (fileData[i] + key.charCodeAt(i % key.length)) % 256;
    // }

    return encryptedData;
  },

  decrypt: (fileData: Uint8Array, key: string): Uint8Array => {
    const decryptedData = rc4EncryptDecryptFileModified(fileData, key);

    return decryptedData;
  },
};

export default function RC4() {
  // Inisiasi state
  const [inputType, setinputType] = useState<string | null>("file");
  const [isTypeOpen, setTypeOpen] = useState(false);
  const [key, setKey] = useState<string>("");
  const [plainText, setPlainText] = useState<string>("");
  const [cipherText, setCipherText] = useState<string>("");
  const [cipherTextBase64, setCipherTextBase64] = useState<string>("");
  const [code, setCode] = useState<string>("ci");
  const [encryptionTime, setEncryptionTime] = useState<number | null>(null);
  const [decryptionTime, setDecryptionTime] = useState<number | null>(null);
  // State untuk file
  const [file, setFile] = useState<File | null>(null);
  const [encryptedFile, setEncryptedFile] = useState<Blob | null>(null);
  const [decryptedFile, setDecryptedFile] = useState<Blob | null>(null);
  // State untuk secrecy test
  const [textEntropy, setTextEntropy] = useState<number | null>(null);
  const [fileEntropy, setFileEntropy] = useState<number | null>(null);
  const [textSecrecy, setTextSecrecy] = useState<number | null>(null);
  const [fileSecrecy, setFileSecrecy] = useState<number | null>(null);
  const [encryptedData, setEncryptedData] = useState<Uint8Array | null>(null);

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
    const start = performance.now();
    let ciphertext = rc4EncryptDecryptModified(plainText, key);
    const end = performance.now();

    setCode("ci");
    setCipherText(ciphertext);
    setCipherTextBase64(Buffer.from(ciphertext).toString("base64"));
    setEncryptionTime(end - start);

    // Calculate entropy
    const cipherBytes = new Uint8Array(Buffer.from(ciphertext));
    const entropy = calculateEntropy(cipherBytes);
    setTextEntropy(entropy);

    // Calculate secrecy
    const secrecy = calculateSecrecy(key, cipherBytes);
    setTextSecrecy(secrecy);
  };

  // Algoritma dekripsi untuk form input plain text
  const decryptPlainText = () => {
    if (!plainText || !key) {
      alert("Please input plain text and enter a key."); // Jika plain text atau key kosong
      return;
    }
    const start = performance.now();
    let ciphertext = rc4EncryptDecryptModified(plainText, key);
    const end = performance.now();

    setCode("deci");
    setCipherText(ciphertext);
    setCipherTextBase64(Buffer.from(ciphertext).toString("base64"));
    setDecryptionTime(end - start);

    // Calculate entropy
    const cipherBytes = new Uint8Array(Buffer.from(ciphertext));
    const entropy = calculateEntropy(cipherBytes);
    setTextEntropy(entropy);

    // Calculate secrecy
    const secrecy = calculateSecrecy(key, cipherBytes);
    setTextSecrecy(secrecy);
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
      const start = performance.now();
      const encryptedData = EncryptDecryptFileInput.encrypt(fileData, key);
      setEncryptedData(encryptedData);
      const end = performance.now();

      const encryptedBlob = new Blob([new Uint8Array(encryptedData)], { type: file.type });
      setEncryptedFile(encryptedBlob);
      setDecryptedFile(null);

      setEncryptionTime(end - start);

      const entropy = calculateEntropy(encryptedData);
      setFileEntropy(entropy);

      const secrecy = calculateSecrecy(key, encryptedData);
      setFileSecrecy(secrecy);
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
      const start = performance.now();
      const decryptedData = EncryptDecryptFileInput.decrypt(fileData, key);
      const end = performance.now();

      const decryptedBlob = new Blob([new Uint8Array(decryptedData)], { type: file.type });
      setDecryptedFile(decryptedBlob);
      setEncryptedFile(null);
      setDecryptionTime(end - start);

      const entropy = calculateEntropy(decryptedData);
      setFileEntropy(entropy);

      const secrecy = calculateSecrecy(key, decryptedData);
      setFileSecrecy(secrecy);
    };

    fileReader.readAsArrayBuffer(file);
  };

  // Program utama
  return (
    <div className="flex h-[100%]">
      <div className="w-[45%] font-mono font-medium border-black border-y-4 border-l-4 border-r-2 h-full">
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
          <div className="font-mono md:text-md lg:text-xl tracking-tighter font-semibold">My Contact: silvesterkresna@gmail.com</div>
        </div>
        <div className="flex items-center justify-center py-4 px-4 md:text-7xl lg:text-7xl font-reggae align-center">Modified</div>
        <div className="flex items-center justify-center py-4 px-4 md:text-7xl lg:text-7xl font-reggae align-center">RC 4</div>
      </div>
      <div className="w-[55%] border-black border-r-4 border-l-2 border-y-4">
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
              {encryptionTime && (
                <div className="mt-4">
                  <div className="font-semibold">Encryption Time:</div>
                  <div className="w-[auto] bg-slate-200 rounded">{encryptionTime.toFixed(2)} ms</div>
                </div>
              )}
              {decryptionTime && (
                <div className="mt-4">
                  <div className="font-semibold">Decryption Time:</div>
                  <div className="w-[auto] bg-slate-200 rounded">{decryptionTime.toFixed(2)} ms</div>
                </div>
              )}
              {textEntropy && (
                <div className="mt-4">
                  <div className="font-semibold">Entropy (Secrecy Test):</div>
                  <div className="w-[auto] bg-slate-200 rounded">{textEntropy.toFixed(2)} bits</div>
                </div>
              )}
              {textSecrecy && (
                <div className="mt-4">
                  <div className="font-semibold">Secrecy:</div>
                  <div className="w-[auto] bg-slate-200 rounded">{textSecrecy.toFixed(2)} bits</div>
                </div>
              )}
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
              {encryptionTime && (
                <div className="mt-4">
                  <div className="font-semibold">Encryption Time:</div>
                  <div className="w-[auto] bg-slate-200 rounded">{encryptionTime.toFixed(2)} ms</div>
                </div>
              )}
              {fileEntropy && (
                <div className="mt-4">
                  <div className="font-semibold">Entropy (Secrecy Test):</div>
                  <div className="w-[auto] bg-slate-200 rounded">{fileEntropy.toFixed(2)} bits</div>
                </div>
              )}
              <div className="my-12">
                <ByteDistributionChart data={encryptedData} />
              </div>
              <div className="h-[200px]"></div>
              {/* {fileSecrecy && (
                <div className="mt-4">
                  <div className="font-semibold">Secrecy:</div>
                  <div className="w-[auto] bg-slate-200 rounded">{fileSecrecy.toFixed(2)} bits</div>
                </div>
              )} */}
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
              {decryptionTime && (
                <div className="mt-4">
                  <div className="font-semibold">Decryption Time:</div>
                  <div className="w-[auto] bg-slate-200 rounded">{decryptionTime.toFixed(2)} ms</div>
                </div>
              )}
              {/* {fileEntropy && (
                <div className="mt-4">
                  <div className="font-semibold">Entropy (Secrecy Test):</div>
                  <div className="w-[auto] bg-slate-200 rounded">{fileEntropy.toFixed(2)} bits</div>
                </div>
              )} */}
              {/* {fileSecrecy && (
                <div className="mt-4">
                  <div className="font-semibold">Secrecy:</div>
                  <div className="w-[auto] bg-slate-200 rounded">{fileSecrecy.toFixed(2)} bits</div>
                </div>
              )} */}
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
