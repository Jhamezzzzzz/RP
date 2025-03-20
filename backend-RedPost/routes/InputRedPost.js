import express from "express";
import uploadFile from "../middleware/UploadMiddleware.js";
import {getInputRedPost,getInputRedPostById,createInputRedPost,updateInputRedPost,deleteInputRedPost,uploadInputData} from "../controllers/InputRedPost.js";

const router = express.Router();
//Ini Shift
router.get("/inputRedPost", getInputRedPost);
router.get("/inputRedPost/:id", getInputRedPostById);
router.post("/inputRedPost", createInputRedPost);
router.put("/inputRedPost/:id", updateInputRedPost);
router.post("/upload-inputRedPost",
    uploadFile.single("file"),
    uploadInputData);

router.get("/inputRedPost-delete/:id", deleteInputRedPost);


export default router;