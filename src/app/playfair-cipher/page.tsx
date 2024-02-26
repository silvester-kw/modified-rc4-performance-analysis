import React, { useState } from "react";

const ExtendedVigenereCipher = {
  encrypt: (fileData: Uint8Array, key: string): Uint8Array => {
    const encryptedData = new Uint8Array(fileData.length);

    for (let i = 0; i < fileData.length; i++) {
      encryptedData[i] = fileData[i] ^ key.charCodeAt(i % key.length);
    }

    return encryptedData;
  },
};

const FileEncryptor: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [key, setKey] = useState<string>("");
  const [encryptedFile, setEncryptedFile] = useState<Blob | null>(null);

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
      const encryptedData = ExtendedVigenereCipher.encrypt(fileData, key);

      const encryptedBlob = new Blob([new Uint8Array(encryptedData)], { type: file.type });
      setEncryptedFile(encryptedBlob);
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

      {encryptedFile && (
        <a href={URL.createObjectURL(encryptedFile)} download={`${file?.name || "encrypted"}_file`}>
          Download Encrypted File
        </a>
      )}
    </div>
  );
};

export default FileEncryptor;
