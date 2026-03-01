import multer from "multer";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const isImage = file.mimetype.startsWith("image/");
    cb(null, isImage);
  },
});

export default upload;
