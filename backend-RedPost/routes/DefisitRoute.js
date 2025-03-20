import express from "express";
import {getInputDefisit,getTotalInputDefisit,getInputDefisitById,createInputDefisit,updateInputDefisit,deleteInputDefisit} from "../controllers/InputDefisit.js";

const router = express.Router();
//Ini Shift
router.get("/inputDefisit", getInputDefisit);
router.get("/total-inputDefisit", getTotalInputDefisit);
router.get("/inputDefisit/:id", getInputDefisitById);
router.post("/inputDefisit", createInputDefisit);
router.put("/inputDefisit/:id", updateInputDefisit);
// router.post("/inputDefisit", uploadInputData);
router.get("/inputDefisit-delete/:id", deleteInputDefisit);


export default router;  