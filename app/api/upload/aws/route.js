import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import sharp from 'sharp';

const s3Client = new S3Client({
	region: process.env.AWS_REGION,
	credentials: {
		accessKeyId: process.env.AWS_ACCESS_KEY_ID,
		secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
	}
});


async function uploadFileToS3(file, fileName) {
	const fileBuffer = file;
	console.log(fileName);

	const params = {
		// Bucket: process.env.AWS_S3_BUCKET_NAME,
		Bucket: 'byscript-bucket',
		Key: `${fileName}`,
		Body: fileBuffer,
		ContentType: "image/jpg"
	}

	const command = new PutObjectCommand(params);
	await s3Client.send(command);
	return {fileName, url : `https://byscript-bucket.s3.ap-southeast-2.amazonaws.com/${fileName}`};
};

export async function POST(request) {
	try {

		const formData = await request.formData();
		const file = formData.get("file");
        // return NextResponse.json( {file});
		if(!file) {
			return NextResponse.json( { error: "File is required."}, { status: 400 } );
		} 
		const buffer = Buffer.from(await file.arrayBuffer());

		// Use sharp to compress and convert the image
		const compressedImageBuffer = await sharp(buffer)
			.webp({ quality: 80 })  // Set the quality to 0.6 (60%)
			.toBuffer();

		const fileName = file.name.replace(/\.[^/.]+$/, "") + ".webp";  // Replace extension with .webp
		const { fileName: uploadedFileName, url } = await uploadFileToS3(compressedImageBuffer, fileName);
		// const {fileName, url} = await uploadFileToS3(buffer, file.name);

		return NextResponse.json({ success: true, fileName, uploadedFileName, url});
	} catch (error) {
		console.log(error, 'error gan');
		return NextResponse.json({ error :error.message, data: Object.keys(error.response) });
	}
}