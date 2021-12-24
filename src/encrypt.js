var CryptoJS = require("crypto-js");

function aesEncrypt(str, key) {
  return CryptoJS.AES.encrypt(str,key).toString();
}
function aesDecrypt(data, key) {
  var bytes  = CryptoJS.AES.decrypt(data, key);
  var originalText = bytes.toString(CryptoJS.enc.Utf8);
  return originalText
}
module.exports = {aesEncrypt,aesDecrypt}