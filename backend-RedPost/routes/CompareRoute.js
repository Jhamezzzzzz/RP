import express from "express";
import { getCompare,updateCompare } from "../controllers/Compare.js";

const router = express.Router();
//Ini Shift
router.get("/compare", getCompare);
router.put("/update-compare/:id", updateCompare);


export default router;