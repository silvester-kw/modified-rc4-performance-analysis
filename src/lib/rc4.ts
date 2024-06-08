function initializeSBox(key: string): number[] {
  const sBox: number[] = [];
  const keyLength = key.length;
  const s: number[] = Array.from(Array(256).keys());

  let j = 0;
  for (let i = 0; i < 256; i++) {
    j = (j + s[i] + key.charCodeAt(i % keyLength)) % 256;
    [s[i], s[j]] = [s[j], s[i]];
  }

  return s;
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

// Example usage:
const message = "Hello";
const key = "ABCDE";

const encrypted = rc4EncryptDecrypt(message, key);
console.log("Encrypted:", encrypted);

const decrypted = rc4EncryptDecrypt(encrypted, key);
console.log("Decrypted:", decrypted);
