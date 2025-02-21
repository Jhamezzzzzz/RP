import express from "express";
import uploadFile from "../middleware/UploadMiddleware.js";
import {getStockData,getSohByMaterialNo,uploadStockData} from "../controllers/StockData.js";

const router = express.Router();
//Ini Shift
router.get("/stockData", getStockData);
router.get("/sohData", getSohByMaterialNo);
router.post(
    "/uploadStockData", 
    uploadFile.single("file"),
    uploadStockData);

export default router;