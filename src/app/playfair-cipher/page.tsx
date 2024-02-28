"use client";

import React from "react";
import { useState, ChangeEvent } from "react";
import { FiDownload } from "react-icons/fi";
import { BiChevronDown } from "react-icons/bi";
import ShareLink from "../../components/ShareLink";

export default function VigenereCipher() {
  // Inisiasi state
  const [inputType, setinputType] = useState<string | null>("text");
  const [isTypeOpen, setTypeOpen] = useState(false);
  const [key, setKey] = useState<string>("");
  const [plainText, setPlainText] = useState<string>("");
  const [cipherText, setCipherText] = useState<string>("");
  const [cipherTextBase64, setCipherTextBase64] = useState<string>("");
  // State untuk file
  const [file, setFile] = useState<File | null>(null);

  // Menghandle dropdown tipe input
  const handleTypeSelect = (option: string) => {
    setinputType(option);
    setTypeOpen(false);
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

  const createPlayfairMatrix = (key: any) => {
    const alphabet = "ABCDEFGHIKLMNOPQRSTUVWXYZ";
    let matrix: string[][] = Array.from({ length: 5 }, () => Array(5).fill(""));
    let keyWithoutDuplicates = key
      .toUpperCase()
      .replace(/J/g, "I")
      .replace(/[^A-Z]/g, "");
    keyWithoutDuplicates = keyWithoutDuplicates
      .split("")
      .filter((char: string, index: Number, array: String) => array.indexOf(char) === index)
      .join("");
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

  function insertCharAt(str: any, char: any, position: any) {
    // Bagian awal string sebelum posisi yang ditentukan
    let firstPart = str.substring(0, position);
    // Bagian akhir string setelah posisi yang ditentukan
    let secondPart = str.substring(position);
    // Gabungkan kedua bagian dengan karakter yang disisipkan di antaranya
    let newStr = firstPart + char + secondPart;
    return newStr;
  }

  // Menghandle perubahan file input
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];

    if (selectedFile && selectedFile.type === "text/plain") {
      const reader = new FileReader();

      reader.onload = (event) => {
        const fileContent = event.target?.result as string;
        setPlainText(fileContent);
      };

      reader.readAsText(selectedFile);
      setFile(selectedFile);
    } else {
      alert("Please select a valid .txt file");
      setPlainText("");
    }
  };

  const encryptPlayfairCipher = () => {
    let preparePlainText = plainText
      .toUpperCase()
      .replace(/J/g, "I")
      .replace(/[^A-Z]/g, "");
    const matrix = createPlayfairMatrix(key);
    let ciphertext = "";

    for (let i = 0; i < preparePlainText.length; i += 2) {
      const char1 = preparePlainText[i];
      let char2 = i + 1 < preparePlainText.length ? preparePlainText[i + 1] : "X";

      if (char1 === char2) {
        char2 = "X";
        preparePlainText = insertCharAt(preparePlainText, char2, i + 1);
        char2 = preparePlainText[i + 1];
      }

      //console.log(char1 + char2);
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
    setCipherTextBase64(Buffer.from(ciphertext).toString("base64"));
    //console.log(matrix)
  };

  const decryptPlayfairCipher = () => {
    let ciphertext = plainText.toUpperCase().replace(/[^A-Z]/g, "");
    let plaintext = "";
    // Buat matriks Playfair Cipher berdasarkan kunci
    let matrix = createPlayfairMatrix(key);
    //console.log(ciphertext)
    for (let i = 0; i < ciphertext.length; i += 2) {
      const char1 = ciphertext[i];
      let char2 = i + 1 < ciphertext.length ? ciphertext[i + 1] : "X";

      if (char1 === char2) {
        char2 = "X";
        ciphertext = insertCharAt(ciphertext, char2, i + 1);
        char2 = ciphertext[i + 1];
      }

      let decryptedChar1, decryptedChar2;
      //console.log(char1,char2);
      // Temukan posisi kedua huruf dalam matriks
      const [row1, col1] = findCharInMatrix(matrix, char1);
      const [row2, col2] = findCharInMatrix(matrix, char2);

      if (row1 === row2) {
        // Jika kedua huruf berada pada baris yang sama, geser ke kiri
        decryptedChar1 = matrix[row1][(col1 - 1 + 5) % 5];
        decryptedChar2 = matrix[row2][(col2 - 1 + 5) % 5];
      } else if (col1 === col2) {
        // Jika kedua huruf berada pada kolom yang sama, geser ke atas
        decryptedChar1 = matrix[(row1 - 1 + 5) % 5][col1];
        decryptedChar2 = matrix[(row2 - 1 + 5) % 5][col2];
      } else {
        // Jika kedua huruf tidak berada pada baris atau kolom yang sama
        decryptedChar1 = matrix[row1][col2];
        decryptedChar2 = matrix[row2][col1];
      }

      plaintext += decryptedChar1 + decryptedChar2;
    }

    setCipherText(plaintext);
    setCipherTextBase64(Buffer.from(plaintext).toString("base64"));
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
              <div className="w-[200px]">Key (26 alphabets)</div>
              <div className="w-full">
                <label htmlFor="key"></label>
                <input type="text" id="key" value={key} onChange={handleKeyChange} className="px-2 py-2 whitespace-pre-wrap border-black border-2 rounded-lg w-full" placeholder="Type key here..." />
              </div>
            </div>
            {inputType == "text" && (
              <div className="flex">
                <div className="w-[150px]"></div>
                <button onClick={encryptPlayfairCipher} className="p-2 bg-white text-black outline outline-3 outline-black rounded-lg hover:bg-black hover:text-white focus:bg-black focus:text-white">
                  Encrypt Text
                </button>
                <button onClick={decryptPlayfairCipher} className="ml-4 p-2 bg-white text-black outline outline-3 outline-black rounded-lg hover:bg-black hover:text-white">
                  Decrypt Text
                </button>
              </div>
            )}

            {inputType == "file" && (
              <div className="flex">
                <div className="w-[150px]"></div>
                <button onClick={encryptPlayfairCipher} className="p-2 bg-white text-black outline outline-3 outline-black rounded-lg hover:bg-black hover:text-white focus:bg-black focus:text-white">
                  Encrypt File
                </button>
                <button onClick={decryptPlayfairCipher} className="ml-4 p-2 bg-white text-black outline outline-3 outline-black rounded-lg hover:bg-black hover:text-white focus:bg-black focus:text-white">
                  Decrypt File
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="p-4 border-b-4 border-black bg-[#666AC1]">
          <div className="font-mono md:text-md lg:text-xl tracking-tighter font-semibold">18221049 Silvester Kresna W. P. P.</div>
          <div className="font-mono md:text-md lg:text-xl tracking-tighter font-semibold">18221080 Fakhri Putra Mahardika.</div>
        </div>
        <div className="flex items-center justify-center pt-4 px-4 md:text-5xl lg:text-7xl font-reggae">Vigenere</div>
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
        <div className="h-[50%] outline outline-4 object-center object-none bg-red-200">
          <img
            src="/nopal.jpg" //
            alt="Description of your image"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}
