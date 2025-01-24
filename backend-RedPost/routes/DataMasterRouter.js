import express from "express";
import { getShift, getShiftById, createShift, updateShift, deleteShift, getPic,getPicById,createPic,updatePic,deletePic} from "../controllers/DataMaster.js";

const router = express.Router();
//Ini Shift
router.get("/shift", getShift);
router.get("/shift/:id", getShiftById);
router.post("/shift", createShift);
router.put("/shift/:id", updateShift);
router.get("/shift-delete/:id", deleteShift);

router.get("/pic", getPic);
router.get("/pic/:id", getPicById);
router.post("/pic", createPic);
router.put("/pic/:id", updatePic);
router.get("/pic-delete/:id", deletePic);

export default router;