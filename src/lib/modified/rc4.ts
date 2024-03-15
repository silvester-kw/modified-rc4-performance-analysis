function initializeSBoxModified(key: string): number[] {
    const sBox: number[] = [];
    const keyLength = key.length;
    const s: number[] = Array.from(Array(256).keys());
    key = vigenereEncrypt(key,key)
    let j = 0;
    for (let i = 0; i < 256; i++) {
        const modifier = vigenereEncrypt(key.charAt((i % key.length)),key).charCodeAt(0);
        j = (j + s[i] + key.charCodeAt(i % keyLength) + modifier) % 256;
        [s[i], s[j]] = [s[j], s[i]];
    }

    return s;
}
function vigenereEncrypt(message: string, key: string): string {
    let encryptedMessage = '';
    for (let i = 0; i < message.length; i++) {
        const messageCharCode = message.charCodeAt(i);
        const keyCharCode = key.charCodeAt(i % key.length);
        const encryptedCharCode = (messageCharCode + keyCharCode) % 256;
        encryptedMessage += String.fromCharCode(encryptedCharCode);
    }
    return encryptedMessage;
}

function generateStreamModified(key: string, messageLength: number): number[] {
    const sBox = initializeSBoxModified(key);
    let i = 0;
    let j = 0;
    const stream: number[] = [];

    for (let k = 0; k < messageLength; k++) {
        i = (i + 1) % 256;
        j = (j + sBox[i]) % 256;
        [sBox[i], sBox[j]] = [sBox[j], sBox[i]];
        const streamModifier = vigenereEncrypt(key.charAt((i % key.length)),key).charCodeAt(0);
        const t = (sBox[i] + sBox[j] + streamModifier) % 256;
        const pseudoRandomByte = sBox[t];
        stream.push(pseudoRandomByte);
    }

    return stream;
}

export function rc4EncryptModified(message: string, key: string): string {
    const stream = generateStreamModified(key, message.length);
    let encryptedMessage = '';

    for (let i = 0; i < message.length; i++) {
        const encryptedByte = message.charCodeAt(i) ^ stream[i];
        encryptedMessage += String.fromCharCode(encryptedByte);
    }

    return encryptedMessage;
}

/* function rc4DecryptModified(encryptedMessage: string, key: string): string {
    const stream = generateStream(key, encryptedMessage.length);
    let decryptedMessage = '';

    for (let i = 0; i < encryptedMessage.length; i++) {
        const decryptedByte = encryptedMessage.charCodeAt(i) ^ stream[i];
        decryptedMessage += String.fromCharCode(decryptedByte);
    }

    return decryptedMessage;
} */

// Example usage:
const Amessage = "never gonna give you up";
const Akey = "never gonna let you down";

const Aencrypted = rc4EncryptModified(Amessage, Akey);
console.log("Encrypted:", Aencrypted);

const Adecrypted = rc4EncryptModified(Aencrypted, Akey);
console.log("Decrypted:", Adecrypted);
