function initializeSBox(key) {
    var _a;
    var sBox = [];
    var keyLength = key.length;
    var s = Array.from(Array(256).keys());
    var j = 0;
    for (var i = 0; i < 256; i++) {
        j = (j + s[i] + key.charCodeAt(i % keyLength)) % 256;
        _a = [s[j], s[i]], s[i] = _a[0], s[j] = _a[1];
    }
    return s;
}
function generateStream(key, messageLength) {
    var _a;
    var sBox = initializeSBox(key);
    var i = 0;
    var j = 0;
    var stream = [];
    for (var k = 0; k < messageLength; k++) {
        i = (i + 1) % 256;
        j = (j + sBox[i]) % 256;
        _a = [sBox[j], sBox[i]], sBox[i] = _a[0], sBox[j] = _a[1];
        var t = (sBox[i] + sBox[j]) % 256;
        var pseudoRandomByte = sBox[t];
        stream.push(pseudoRandomByte);
    }
    return stream;
}
function rc4Encrypt(message, key) {
    var stream = generateStream(key, message.length);
    var encryptedMessage = '';
    for (var i = 0; i < message.length; i++) {
        var encryptedByte = message.charCodeAt(i) ^ stream[i];
        encryptedMessage += String.fromCharCode(encryptedByte);
    }
    return encryptedMessage;
}
// Example usage:
var message = "Hello";
var key = "ABCDE";
var encrypted = rc4Encrypt(message, key);
console.log("Encrypted:", encrypted);
var decrypted = rc4Encrypt(encrypted, key);
console.log("Decrypted:", decrypted);
