import CryptoJS from 'crypto-js';
export default function generateSignature(secret, message) {
    return CryptoJS.HmacSHA256(message, secret).toString(CryptoJS.enc.Hex);
  }