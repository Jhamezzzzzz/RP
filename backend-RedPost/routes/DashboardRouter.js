import express from "express";
import { getCardData, getCombinationGraph, getLineGraph, getDoughnutChart, getBarShiftGraph} from "../controllers/Dashboard.js";

const router = express.Router();
//Ini Shift
router.get("/card-data", getCardData);
router.get("/comb-graph", getCombinationGraph);
router.get("/line-graph", getLineGraph);
router.get("/doughnut-graph", getDoughnutChart);
router.get("/bar-shift-graph", getBarShiftGraph);

export default router;