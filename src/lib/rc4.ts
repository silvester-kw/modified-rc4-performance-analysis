// function initializeSBox(key: string): number[] {
//   const sBox: number[] = [];
//   const keyLength = key.length;
//   const s: number[] = Array.from(Array(256).keys());

//   let j = 0;
//   for (let i = 0; i < 256; i++) {
//     j = (j + s[i] + key.charCodeAt(i % keyLength)) % 256;
//     [s[i], s[j]] = [s[j], s[i]];
//   }

//   return s;
// }

function initializeSBox(key: string): number[] {
  const sBox: number[] = Array.from(Array(256).keys());
  const keyLength = key.length;
  let j = 0;

  for (let i = 0; i < 256; i++) {
    j = (j + sBox[i] + key.charCodeAt(i % keyLength)) % 256;
    [sBox[i], sBox[j]] = [sBox[j], sBox[i]];
  }

  return sBox;
}

function generateByteModified(sBox: number[], key: string, i: number, j: number): [number, number, number] {
  i = (i + 1) % 256;
  j = (j + sBox[i]) % 256;
  [sBox[i], sBox[j]] = [sBox[j], sBox[i]];
  const t = (sBox[i] + sBox[j]) % 256;
  const pseudoRandomByte = sBox[t];
  return [pseudoRandomByte, i, j];
}

function generateStream(key: string, messageLength: number): number[] {
  const sBox = initializeSBox(key);
  let i = 0;
  let j = 0;
  const stream: number[] = [];

  for (let k = 0; k < messageLength; k++) {
    i = (i + 1) % 256;
    j = (j + sBox[i]) % 256;
    [sBox[i], sBox[j]] = [sBox[j], sBox[i]];
    const t = (sBox[i] + sBox[j]) % 256;
    const pseudoRandomByte = sBox[t];
    stream.push(pseudoRandomByte);
  }

  return stream;
}

export function rc4EncryptDecrypt(message: string, key: string): string {
  const stream = generateStream(key, message.length);
  let encryptedMessage = "";

  for (let i = 0; i < message.length; i++) {
    const encryptedByte = message.charCodeAt(i) ^ stream[i];
    encryptedMessage += String.fromCharCode(encryptedByte);
  }

  return encryptedMessage;
}

export function rc4EncryptDecryptFile(fileData: Uint8Array, key: string): Uint8Array {
  const sBox = initializeSBox(key);
  const resultData = new Uint8Array(fileData.length);
  let i = 0;
  let j = 0;

  for (let k = 0; k < fileData.length; k++) {
    const [pseudoRandomByte, newI, newJ] = generateByteModified(sBox, key, i, j);
    i = newI;
    j = newJ;
    resultData[k] = fileData[k] ^ pseudoRandomByte;
  }

  return resultData;
}

// Example usage:
const message = "Hello";
const key = "ABCDE";

const encrypted = rc4EncryptDecrypt(message, key);
console.log("Encrypted:", encrypted);

const decrypted = rc4EncryptDecrypt(encrypted, key);
console.log("Decrypted:", decrypted);
