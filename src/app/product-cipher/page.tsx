"use client";

import React from "react";
import { useState, ChangeEvent } from "react";
import { FiDownload } from "react-icons/fi";
import { BiChevronDown } from "react-icons/bi";
import ShareLink from "../../components/ShareLink";

export default function AffineCipher() {
  // Inisiasi state
  const [inputType, setinputType] = useState<string | null>("text");
  const [isTypeOpen, setTypeOpen] = useState(false);
  const [keyA, setKeyA] = useState<string>("");
  const [keyB, setKeyB] = useState<string>("");
  const [plainText, setPlainText] = useState<string>("");
  const [cipherText, setCipherText] = useState<string>("");
  const [cipherTextBase64, setCipherTextBase64] = useState<string>("");

  // State untuk file
  const [file, setFile] = useState<File | null>(null);

  const handleTypeSelect = (option: string) => {
    setinputType(option);
    setTypeOpen(false);
    setPlainText("");
  };

  const handleKeyAChange = (e: ChangeEvent<HTMLInputElement>) => {
    setKeyA(e.target.value);
  };
  const handleKeyBChange = (e: ChangeEvent<HTMLInputElement>) => {
    setKeyB(e.target.value);
  };
  const handlePlainTextChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPlainText(e.target.value);
  };
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];

    if (selectedFile && selectedFile.type === "text/plain") {
      const reader = new FileReader();

      reader.onload = (event) => {
        const fileContent = event.target?.result as string;
        setPlainText(fileContent);
        setFile(selectedFile);
      };

      reader.readAsText(selectedFile);
    } else {
      alert("Please select a valid .txt file");
      setPlainText("");
      setFile(null);
    }
  };
  const encrypt = () => {
    let withoutSpace = plainText.replace(/\s+/g, "");
    let ciphertext = "";
    for (let i = 0; i < withoutSpace.length; i++) {
      const char = withoutSpace.charAt(i);
      const isUpperCase = char === char.toUpperCase();

      if (char.match(/[A-Z]/i)) {
        const plainTextCharCode = char.toUpperCase().charCodeAt(0) - "A".charCodeAt(0);
        const keyCharCode = keyA[i % keyA.length].toUpperCase().charCodeAt(0) - "A".charCodeAt(0) || 0;
        const encryptedCharCode = (plainTextCharCode + keyCharCode) % 26;
        const encryptedChar = String.fromCharCode(encryptedCharCode + "A".charCodeAt(0));

        ciphertext += isUpperCase ? encryptedChar : encryptedChar.toLowerCase();
      } else {
        ciphertext += char;
      }
    }
    withoutSpace = ciphertext.replace(/\s+/g, "");

    const numRows = Math.ceil(withoutSpace.length / Number(keyB));

    if (Number(keyB) !== 0) {
      let secondCiphertext = "";
      while (withoutSpace.length % Number(keyB) !== 0) {
        withoutSpace += "x";
      }
      for (let col = 0; col < Number(keyB); col++) {
        for (let row = 0; row < numRows; row++) {
          secondCiphertext += withoutSpace[row * Number(keyB) + col];
          //secondCiphertext += transpositionMatrix[row][col];
        }
      }
      setCipherText(secondCiphertext.toUpperCase());
      setCipherTextBase64(Buffer.from(secondCiphertext).toString("base64"));
    } else {
      setCipherText(withoutSpace.toUpperCase());
      setCipherTextBase64(Buffer.from(withoutSpace).toString("base64"));
    }
  };

  const decrypt = () => {
    let withoutSpace = plainText.replace(/\s+/g, "");

    const numRows = Math.ceil(withoutSpace.length / Number(keyB));

    let firstDeciphertext = "";

    for (let col = 0; col < numRows; col++) {
      for (let row = 0; row < Number(keyB); row++) {
        firstDeciphertext += withoutSpace[row * numRows + col];
        //secondCiphertext += transpositionMatrix[row][col];
      }
    }

    //let ciphertext = "";

    const convertedPlainText = firstDeciphertext;
    const convertedKey = keyA.replace(/\s+/g, "").toUpperCase();

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

    setCipherText(decryptedText.toUpperCase());
    setCipherTextBase64(Buffer.from(decryptedText).toString("base64"));
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
              <div>
                <div className="flex">
                  <div className="w-[147px]">File (.txt)</div>
                  <input type="file" onChange={handleFileChange} />
                </div>
                {plainText != "" && (
                  <div className="flex items-center mt-2">
                    <div className="w-[200px]">Plain Text</div>
                    <div className="w-full border-black border-2 rounded-lg p-2">{plainText}</div>
                  </div>
                )}
              </div>
            )}
            <div className="flex w-full">
              <div className="w-[200px]">Key A (26 alphabet)</div>
              <div className="w-full">
                <label htmlFor="keyA"></label>
                <input type="text" id="keyA" value={keyA} onChange={handleKeyAChange} className="px-2 py-2 whitespace-pre-wrap border-black border-2 rounded-lg w-full" placeholder="Type key here..." />
              </div>
            </div>
            <div className="flex w-full">
              <div className="w-[200px]">Key B (number)</div>
              <div className="w-full">
                <label htmlFor="keyB"></label>
                <input type="text" id="keyB" value={keyB} onChange={handleKeyBChange} className="px-2 py-2 whitespace-pre-wrap border-black border-2 rounded-lg w-full" placeholder="Type key here..." />
              </div>
            </div>
            {inputType == "text" && (
              <div className="flex">
                <div className="w-[150px]"></div>
                <button onClick={encrypt} className="p-2 bg-white text-black outline outline-3 outline-black rounded-lg hover:bg-black hover:text-white focus:bg-black focus:text-white">
                  Encrypt Text
                </button>
                <button onClick={decrypt} className="ml-4 p-2 bg-white text-black outline outline-3 outline-black rounded-lg hover:bg-black hover:text-white">
                  Decrypt Text
                </button>
              </div>
            )}

            {inputType == "file" && (
              <div className="flex">
                <div className="w-[150px]"></div>
                <button onClick={encrypt} className="p-2 bg-white text-black outline outline-3 outline-black rounded-lg hover:bg-black hover:text-white focus:bg-black focus:text-white">
                  Encrypt File
                </button>
                <button onClick={decrypt} className="ml-4 p-2 bg-white text-black outline outline-3 outline-black rounded-lg hover:bg-black hover:text-white focus:bg-black focus:text-white">
                  Decrypt File
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="p-4 border-b-4 border-black bg-[#F5DDB1]">
          <div className="font-mono md:text-md lg:text-xl tracking-tighter font-semibold">18221049 Silvester Kresna W. P. P.</div>
          <div className="font-mono md:text-md lg:text-xl tracking-tighter font-semibold">18221080 Fakhri Putra Mahardika.</div>
        </div>
        <div className="flex items-center justify-center pt-4 px-4 md:text-5xl lg:text-7xl font-reggae">Product</div>
        <div className="flex items-center justify-center pb-4 px-4 md:text-7xl lg:text-9xl font-reggae">Cipher</div>
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
                <a className="bg-black text-white p-2 rounded-lg flex items-center" href={`data:text/plain;charset=utf-8,${encodeURIComponent(cipherText)}`} download={`cipher_text.txt`}>
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
        </div>
        <div className="h-[50%] outline outline-4 border-black black object-center object-none bg-red-200">
          <img
            src="/zhongli.jpg" //
            alt="Description of your image"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}
