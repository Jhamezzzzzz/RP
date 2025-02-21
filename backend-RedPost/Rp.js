import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
// import https from "https";
// import fs from "fs";
// import path from "path";
import "./models/index.js";
import DashboardRouter from "./routes/DashboardRouter.js";
import dataMasterRouter from "./routes/DataMasterRouter.js";
import inputRedPost from "./routes/InputRedPost.js";
import stockData from "./routes/StockData.js";
// import { verifyToken } from "./middleware/VerifyToken.js";

dotenv.config();
const app = express();
const port = process.env.PORT || 5001;
const host = process.env.DB_SERVER || "localhost";

// Middleware
app.use(
  cors({
    // credentials: true,
    origin: [
      "http://localhost:3005",
      "https://redpost-warehouse.web.app",
    ],
  })
);
app.use(cookieParser());
app.use(express.json());

// app.use(verifyToken);

// Master data router
app.use("/api", DashboardRouter);
app.use("/api", dataMasterRouter);
app.use("/api", inputRedPost);
app.use("/api", stockData);


// // Membuat server HTTPS
// https.createServer(credentials, app).listen(port, () => {
//   console.log(`Server running at https://${host}:${port}`);
// });

// Membuat server HTTP
app.listen(port, () => {
  console.log(`Server running at http://${host}:${port}`);
});