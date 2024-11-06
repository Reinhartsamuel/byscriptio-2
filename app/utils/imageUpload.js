import imageCompression from 'browser-image-compression';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { storage } from '../config/firebase';
import moment from 'moment';

const convertToWebP = (file) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;

      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            const webpFile = new File(
              [blob],
              file.name.replace(/\.[^/.]+$/, '') + '.webp',
              {
                type: 'image/webp',
                lastModified: Date.now(),
              }
            );
            resolve(webpFile);
          } else {
            reject(new Error('Blob conversion failed'));
          }
        },
        'image/webp',
        0.8
      ); // 0.8 is the quality factor
    };
    img.onerror = (error) => reject(error);
  });
};
export const uploadFileCompressed = async (file) => {
  try {
    // Step 1: Compress the image
    const options = {
      maxSizeMB: 1, // Maximum size in MB
      maxWidthOrHeight: 800, // Maximum width or height
      useWebWorker: true,
    };

    const compressedFile = await imageCompression(file, options);

    // Step 2: Convert to WebP format
    const webpFile = await convertToWebP(compressedFile);

    // Step 3: Upload to Firebase Storage
    const storageRef = ref(
      storage,
      `transfer-receipt/${moment().unix()}-${webpFile.name}`
    );
    const res = await uploadBytes(storageRef, webpFile);
    console.log('File uploaded successfully:', webpFile.name);
    console.log('File uploaded reesssss:', res);
    const downloadURL = await getDownloadURL(storageRef);
    console.log(downloadURL, 'downloadURL');

    return { url: downloadURL };
  } catch (error) {
    console.error('Error uploading file:', error);
    return { error: error.message };
  }
};
