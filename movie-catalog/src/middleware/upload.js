// src/middleware/upload.js
import multer from "multer";
import multerS3 from "multer-s3";
import s3Client from "../config/s3.js";
import AppError from "../utils/AppError.js";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

const upload = multer({
  storage: multerS3({
    s3: s3Client,
    bucket: process.env.AWS_S3_BUCKET_NAME,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: (req, file, cb) => {
      const ext = file.originalname.split(".").pop();
      const filename = `posters/${Date.now()}-${Math.round(Math.random() * 1e9)}.${ext}`;
      cb(null, filename);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (!ALLOWED_TYPES.includes(file.mimetype)) {
      return cb(new AppError("Only JPEG, PNG, or WEBP images are allowed", 400));
    }
    cb(null, true);
  },
});

export default upload;