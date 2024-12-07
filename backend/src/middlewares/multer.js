import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from 'url';

// Define __dirname manually
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
    destination: function (req, file, cb){
        const uploadDir = path.join(__dirname, "..", "public");

        if(!fs.existsSync(uploadDir)){
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        cb(null, uploadDir);
    },
    filename: function(req, file, cb){
        const filePath = `${Date.now()}-${file.originalname}`;
        cb(null, filePath);
    }
});

const upload = multer({ storage: storage });
export { upload };
