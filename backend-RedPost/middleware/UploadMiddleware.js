import multer from "multer";
import path from "path";

// Filter untuk memastikan file yang diunggah adalah file Excel dengan ekstensi .xlsx
const excelFilter = (req, file, cb) => {
  const extname = path.extname(file.originalname).toLowerCase();

  if (extname === ".xlsx") {
    cb(null, true);
  } else {
    cb(new Error("Please upload only .xlsx Excel file."), false);
  }
};

// Konfigurasi multer untuk menyimpan file ke dalam buffer
const storage = multer.memoryStorage();

const uploadFile = multer({
  storage: storage,
  fileFilter: excelFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // Maksimal ukuran file 10 MB
});


export default uploadFile;
