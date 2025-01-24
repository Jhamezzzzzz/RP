import express from "express";
import uploadFile from "../middleware/UploadMiddleware.js";
import {getStockData,uploadStockData} from "../controllers/StockData.js";

const router = express.Router();
//Ini Shift
router.get("/stockData", getStockData);
router.post(
    "/upload-stockData", 
    uploadFile.single("file"),
    uploadStockData);

export default router;