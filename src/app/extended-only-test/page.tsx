"use client";
import React, { useState } from "react";

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

const FileEncryptor: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [key, setKey] = useState<string>("");
  const [encryptedFile, setEncryptedFile] = useState<Blob | null>(null);
  const [decryptedFile, setDecryptedFile] = useState<Blob | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files && event.target.files[0];
    setFile(selectedFile || null);
  };

  const handleKeyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setKey(event.target.value);
  };

  const encryptFile = () => {
    if (!file || !key) {
      alert("Please select a file and enter a key.");
      return;
    }

    const fileReader = new FileReader();

    fileReader.onload = (e: ProgressEvent<FileReader>) => {
      const fileData = new Uint8Array(e.target?.result as ArrayBuffer);
      const encryptedData = EncryptDecryptFileInput.encrypt(fileData, key);

      const encryptedBlob = new Blob([new Uint8Array(encryptedData)], { type: file.type });
      setEncryptedFile(encryptedBlob);
    };

    fileReader.readAsArrayBuffer(file);
  };

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
    };

    fileReader.readAsArrayBuffer(file);
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <br />
      <input type="text" placeholder="Enter key" value={key} onChange={handleKeyChange} />
      <br />
      <button onClick={encryptFile}>Encrypt File</button>
      <button onClick={decryptFile}>Decrypt File</button>

      {encryptedFile && (
        <a href={URL.createObjectURL(encryptedFile)} download={`${file?.name?.replace(/\.[^/.]+$/, "") || "encrypted"}_encrypted.${file?.name?.split(".").pop()}`}>
          Download Encrypted File
        </a>
      )}

      {decryptedFile && (
        <a href={URL.createObjectURL(decryptedFile)} download={`${file?.name?.replace(/\.[^/.]+$/, "") || "decrypted"}_decrypted.${file?.name?.split(".").pop()}`}>
          Download Decrypted File
        </a>
      )}
    </div>
  );
};

export default FileEncryptor;
