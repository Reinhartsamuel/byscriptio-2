"use client";

import { ParallaxScroll } from './ui/ParallaxScroll';

export function ImageGallery() {
  return <ParallaxScroll images={images} />;
}

const images = [
   "https://byscript-bucket.s3.ap-southeast-2.amazonaws.com/abibayu.webp",
  "https://byscript-bucket.s3.ap-southeast-2.amazonaws.com/azmi.webp",
  "https://byscript-bucket.s3.ap-southeast-2.amazonaws.com/carneyy.webp",
  "https://byscript-bucket.s3.ap-southeast-2.amazonaws.com/fikrimaulana.webp",
  "https://byscript-bucket.s3.ap-southeast-2.amazonaws.com/jaystevan.webp",
  "https://byscript-bucket.s3.ap-southeast-2.amazonaws.com/mustafa2.webp",
  "https://byscript-bucket.s3.ap-southeast-2.amazonaws.com/giovaniputra.webp",
  "https://firebasestorage.googleapis.com/v0/b/saudagar-staging.appspot.com/o/transfer-receipt%2FKrTqD6lD4yQtTW0SyKe2pFTUFbx2%2FWhatsApp%20Image%202024-07-03%20at%2016.47.07%20(1).jpeg?alt=media&token=adc17bb9-b5fd-4164-ad9a-ffc1f5a4b731",
  "https://i.ibb.co.com/X7kP5mR/gmeet.jpg",
  "https://firebasestorage.googleapis.com/v0/b/saudagar-staging.appspot.com/o/transfer-receipt%2FKrTqD6lD4yQtTW0SyKe2pFTUFbx2%2FWhatsApp%20Image%202024-07-03%20at%2016.47.07%20(1).jpeg?alt=media&token=adc17bb9-b5fd-4164-ad9a-ffc1f5a4b731"
];
