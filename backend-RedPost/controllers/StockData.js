import { Op } from "sequelize";
import db from "../utils/Database.js";
import StockData from "../models/StockDataModel.js";
import readXlsxFile from "read-excel-file";
//import xlsx from 'xlsx'; // Import xlsx package
import * as XLSX from "xlsx";
import Excel from "exceljs";


const BATCH_SIZE = 1000; // Set batch size sesuai kebutuhan
//ini RedPost
export const getStockData = async (req, res) => {
  try {
    // Dapatkan parameter page dari query, jika tidak ada default 1
    const page = parseInt(req.query.page, 10) || 1;
    const limit = 1000; // Default 15 data per halaman
    const offset = (page - 1) * limit; // Hitung offset
    const search = req.query.search;
    
    // Ambil data dengan pagination
    const { count, rows } = await StockData.findAndCountAll({
      where: { 
        [Op.or]: [
          { materialNo: { [Op.like]: `%${search}%` } },
          { description: { [Op.like]: `%${search}%` } },
        ],
        flag: 1 },
      offset,
      limit,
      order: [["id", "ASC"]], // Urutkan berdasarkan kolom "id" secara ascending
    });

    const totalPages = Math.ceil(count / limit); // Hitung total halaman

    res.status(200).json({
      data: rows,
      currentPage: page,
      totalPages,
      totalItems: count,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
 
//SOH by MaterialNo
export const getSohByMaterialNo = async (req, res) => {
  try {
    const { materialNo } = req.query; // Ambil parameter MaterialNo dari query

    // Validasi jika materialNo tidak diberikan
    if (!materialNo) {
      return res.status(400).json({ message: "MaterialNo is required" });
    }

    // Query untuk mendapatkan total soh berdasarkan MaterialNo
    const stockData = await StockData.findOne({
      attributes: ["id","materialNo", "soh"],
      where: { materialNo: materialNo, flag: 1 }, // Hanya data dengan flag aktif
    });

    // Jika tidak ditemukan
    if (!stockData) {
      return res.status(404).json({ message: "MaterialNo not found" });
    }

    res.status(200).json(stockData);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};


const validateHeader = (header) => {
  // Validasi header sesuai dengan kolom yang diharapkan
  const expectedHeader = ["Plant Cd", "Sloc Cd", "Material No", "Description", "Rack Cd", "SOH", "UoM"];


  return expectedHeader.every((col, index) => header[index] === col);
};

export const uploadStockData = async (req, res) => {
  if (!req.file) {
    return res.status(400).send({ message: "Please upload an Excel file!" });
  }

  let mainTransaction;

  try {
    const buffer = req.file.buffer;
    const workbook = new Excel.Workbook();
    await workbook.xlsx.load(buffer);

    const worksheet = workbook.getWorksheet(1); // Ambil sheet pertama
    const rows = [];
    worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
      if (rowNumber >= 4) { // Data dimulai dari baris ke-4
        rows.push(row.values);
      }
    });

    console.log(`Total rows: ${rows.length}`);
    if (rows.length > 15000) {
      return res.status(400).send({ message: "Batch size exceeds the limit! Max 15000 rows data." });
    }

    const header = rows[0]; // Baris pertama dianggap header
    // if (!validateHeader(header)) {
    //   return res.status(400).send({ message: "Invalid header!" });
    // }

    mainTransaction = await db.transaction();

    const stockData = [];
    await StockData.destroy({ where: {}, transaction: mainTransaction });

    for (const row of rows) {
      const materialNo = row[3];
      if (
        !row[1] || !row[2] || !row[3] || !row[4] || !row[5] 
      ) {
        throw new Error(`Invalid data in row with Material No: ${materialNo}`);
      }

      stockData.push({
        plant: row[1],
        SlocCd: row[2],
        materialNo: row[3],
        description: row[4],
        addresRack: row[5],
        soh: row[6],
        uom: row[7],
      });

      if (stockData.length === BATCH_SIZE) {
        await StockData.bulkCreate(stockData, { transaction: mainTransaction });
        stockData.length = 0; // Reset array setelah batch disimpan
      }
    }

    if (stockData.length > 0) {
      await StockData.bulkCreate(stockData, { transaction: mainTransaction });
    }

    await mainTransaction.commit();

    res.status(200).send({
      message: `Uploaded the file successfully: ${req.file.originalname}`,
    });
  } catch (error) {
    if (mainTransaction) await mainTransaction.rollback();

    console.error("File processing error:", error);
    res.status(500).send({
      message: `Could not process the file: ${req.file?.originalname}. ${error.message}`,
    });
  }
};