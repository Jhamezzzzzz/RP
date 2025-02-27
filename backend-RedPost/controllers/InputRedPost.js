import db from "../utils/Database.js";
import InputRedPost from "../models/InputModel.js";
import Excel from "exceljs";
import StockData from "../models/StockDataModel.js";
import Shift from "../models/ShiftModel.js";  

const BATCH_SIZE = 1000; // Sesuaikan dengan kebutuhan
//ini RedPost
export const getInputRedPost = async (req, res) => {
  try {
    const response = await InputRedPost.findAll({
      where: { flag: 1 },
      include:[
        {
          model: StockData,
          required: false,
          attributes: ['soh']
        }
      ]
    });

    res.status(200).json(response);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getInputRedPostById = async (req, res) => {
  try {
    const inputRedPostId = req.params.id;
    const inputRedPost = await InputRedPost.findOne({
      where: { id: inputRedPostId, flag: 1 },
    });

    if (!inputRedPost) {
      return res.status(404).json({ message: "Input Red Post not found" });
    }

    const response = await InputRedPost.findOne({
      where: {
        id: inputRedPostId,
        flag: 1,
      },
    });
    res.status(200).json(response);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

//Untuk  Input Date
export const createInputRedPost = async (req, res) => {
  try {
    console.log('req.body.InputDate:', req.body.InputDate);

    // Cek apakah StockData dengan ID yang diberikan ada di database
    const stockData = await StockData.findOne({
      where: { id: req.body.StockDataId },
    });

    if (!stockData) {
      return res.status(404).json({ message: "StockData not found" });
    }

    // Membuat data baru di tabel InputRedPost
    const newPost = await InputRedPost.create(req.body);

    // Mengembalikan respons dengan data yang baru dibuat
    res.status(201).json(newPost);
  } catch (error) {
    console.error("Error creating InputRedPost:", error.message);
    res.status(500).json({ message: error.message });
  }
};


export const updateInputRedPost = async (req, res) => {
  try {
    const inputRedPostId = req.params.id; // Ambil ID dari parameter URL

    // Gunakan inputRedPostId, bukan inputDateId
    const inputRedPost = await InputRedPost.findOne({
      where: { id: inputRedPostId, flag: 1 }, // Perbaikan di sini
    });

    if (!inputRedPost) {
      return res.status(404).json({ message: "InputRedPost not found" });
    }

    await InputRedPost.update(req.body, {
      where: {
        id: inputRedPostId, // Pastikan ini menggunakan inputRedPostId yang benar
        flag: 1,
      },
    });

    res.status(200).json({ message: "InputRedPost Updated" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const deleteInputRedPost = async (req, res) => {
  try {
    const inputRedPostId = req.params.id;

    const inputRedPost = await InputRedPost.findOne({
      where: { id: inputRedPostId, flag: 1 },
    });
    if (!inputRedPost) {
      return res.status(404).json({ message: "InputRedPost not found" });
    }

    await InputRedPost.update(
      { flag: 0 },
      {
        where: { id: inputRedPostId, flag: 1 },
      }
    );

    res.status(200).json({ message: "InputRedPost deleted" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const uploadInputData = async (req, res) => {
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
      if (rowNumber > 1) { // Lewati baris pertama jika itu header
        rows.push(row.values);
      }
    });

    console.log(`Total rows to process: ${rows.length}`);
    if (rows.length > 10000) {
      return res.status(400).send({ message: "Batch size exceeds the limit! Max 10000 rows data." });
    }

    mainTransaction = await db.transaction();

    const inputData = [];

    for (const row of rows) {
      // Ambil data dari Excel berdasarkan urutan kolom
      const InputDate = row[1]; 
      const MaterialNo = row[2];
      const Pic = row[3];
      const ShiftName = row[4]; // Nama shift dari Excel
      const Description = row[5];
      const Address = row[6];
      const Mrp = row[7];
      const CardNo = row[8];
      const QtyReq = row[9] || 0; // Default 0 jika kosong
      const Soh = row[10] || 0; // Default 0 jika kosong

      if (!InputDate || !MaterialNo || !Pic || !ShiftName || !Description || !Address || !Mrp || !CardNo) {
        console.warn(`Skipping row with missing required data: ${JSON.stringify(row)}`);
        continue; // Lewati baris jika ada data yang kosong
      }

      // Cari ShiftId berdasarkan ShiftName
      const shift = await Shift.findOne({ where: { name: ShiftName } });
      const ShiftId = shift ? shift.id : null;

      inputData.push({
        InputDate,
        MaterialNo,
        Description,
        Address,
        Mrp,
        CardNo,
        QtyReq,
        Pic,
        Soh,
        ShiftId,
        flag: 1, // Default flag
      });

      if (inputData.length === BATCH_SIZE) {
        await InputRedPost.bulkCreate(inputData, { transaction: mainTransaction });
        inputData.length = 0; // Reset array setelah batch disimpan
      }
    }

    if (inputData.length > 0) {
      await InputRedPost.bulkCreate(inputData, { transaction: mainTransaction });
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

