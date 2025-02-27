import express from "express";
import {getInputRedPost,getInputRedPostById,createInputRedPost,updateInputRedPost,deleteInputRedPost,uploadInputRedPost} from "../controllers/InputRedPost.js";

const router = express.Router();
//Ini Shift
router.get("/inputRedPost", getInputRedPost);
router.get("/inputRedPost/:id", getInputRedPostById);
router.post("/inputRedPost", createInputRedPost);
router.put("/inputRedPost/:id", updateInputRedPost);
router.post("/inputRedPost", uploadInputRedPost);
router.get("/inputRedPost-delete/:id", deleteInputRedPost);


export default router;