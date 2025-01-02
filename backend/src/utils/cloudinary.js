import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET_KEY,
})

const uploadOnCloudinary = async(filePath, folderName) => {
    try {
        if(!filePath) throw new Error("Please select file to upload");

        const response = await cloudinary.uploader.upload(filePath, {
            folder: folderName,
            resource_type: "auto"
        })

        fs.unlinkSync(filePath);
        return response;
    } catch (error) {
        console.log('failed to upload on cloudinary', error)
        fs.unlinkSync(filePath);
        return null;
    }
}

const deletefromCloudinary = async(imgId, resourceType) => {
    try {
        const response = cloudinary.uploader.destroy(imgId, {
            resource_type: resourceType
        });
        
        return resourceType
    } catch (error) {
        console.log(`error while deleting file from cloudinary: ${error}`)
        return null
    }
}
export { uploadOnCloudinary, deletefromCloudinary };