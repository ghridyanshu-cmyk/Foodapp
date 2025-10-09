import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const absolutePath = path.join(process.cwd(), "public", "temp");
        cb(null, absolutePath);
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
}); 

const upload = multer({ storage: storage });

export default upload;