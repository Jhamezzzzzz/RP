import db from "../utils/Database.js";
import InputDefisit from "../models/DefisitModel.js";
// import Excel from "exceljs";
import Pic from "../models/PicModel.js"
import StockData from "../models/StockDataModel.js";
import Shift from "../models/ShiftModel.js";  

// const BATCH_SIZE = 1000;
//ini RedPost
export const getInputDefisit = async (req, res) => {
  try {
    const response = await InputDefisit.findAll({
      where: { flag: 1 },
      order: [['createdAt', 'DESC']] // Menambahkan sorting berdasarkan createdAt secara descending
    });

    res.status(200).json(response);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const getTotalInputDefisit = async (req, res) => {
  try {
    const { date } = req.query; // Ambil parameter date dari query

    // Filter hanya jika date diberikan
    const dateFilter = date ? { InputDate: date } : {};

    // Hitung total defisit dengan filter flag = 1, dan filter tanggal jika ada
    const totalDefisit = await InputDefisit.count({
      where: {
        ...dateFilter, 
        flag: 1, // ✅ Pastikan hanya mengambil data dengan flag = 1
      },
    });

    res.status(200).json({ totalDefisit });

  } catch (error) {
    console.error("Error fetching total defisit:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};




export const getInputDefisitById = async (req, res) => {
  try {
    const InputDefisitId = req.params.id;
    const InputDefisit = await InputDefisit.findOne({
      where: { id: InputDefisitId, flag: 1 },
    });

    if (!InputDefisit) {
      return res.status(404).json({ message: "Input Defisit not found" });
    }

    const response = await InputDefisit.findOne({
      where: {
        id: InputDefisitId,
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
export const createInputDefisit = async (req, res) => {
  try {
    console.log('req.body.InputDate:', req.body.InputDate);

    // Membuat data baru di tabel InputDefisit
    const newPost = await InputDefisit.create(req.body);

    // Mengembalikan respons dengan data yang baru dibuat
    res.status(201).json(newPost);
  } catch (error) {
    console.error("Error creating InputDefisit:", error.message);
    res.status(500).json({ message: error.message });
  }
};


export const updateInputDefisit = async (req, res) => {
  try {
    const InputDefisitId = req.params.id; // Ambil ID dari parameter URL

    // Ganti nama variabel untuk menghindari konflik
    const foundDefisit = await InputDefisit.findOne({
      where: { id: InputDefisitId, flag: 1 },
    });

    if (!foundDefisit) {
      return res.status(404).json({ message: "InputDefisit not found" });
    }

    await InputDefisit.update(req.body, {
      where: { id: InputDefisitId, flag: 1 },
    });

    res.status(200).json({ message: "InputDefisit Updated" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};



export const deleteInputDefisit = async (req, res) => {
  try {
    const InputDefisitId = req.params.id;

    // Ganti nama variabel hasil pencarian, misalnya foundDefisit
    const foundDefisit = await InputDefisit.findOne({
      where: { id: InputDefisitId, flag: 1 },
    });

    if (!foundDefisit) {
      return res.status(404).json({ message: "InputDefisit not found" });
    }

    await InputDefisit.update(
      { flag: 0 },
      {
        where: { id: InputDefisitId, flag: 1 },
      }
    );

    res.status(200).json({ message: "InputDefisit deleted" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};


// export const uploadInputData = async (req, res) => {
//   let transaction;

//   try {
//     if (!req.file) {
//       return res.status(400).send({ message: "Please upload an Excel file!" });
//     }

//     const buffer = req.file.buffer;
//     const workbook = new Excel.Workbook();
//     await workbook.xlsx.load(buffer);

//     const worksheet = workbook.getWorksheet(1);
//     const rows = [];

//     worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
//       if (rowNumber > 1) {
//         rows.push(row.values.slice(1));
//       }
//     });

//     console.log(`Total rows to process: ${rows.length}`);
//     if (rows.length > 10000) {
//       return res.status(400).send({ message: "Batch size exceeds the limit! Max 10000 rows data." });
//     }

//     transaction = await db.transaction(); // Start transaction
//     console.log("Transaction started");

//     const inputData = [];
//     const validationErrors = [];

//     for (const [index, row] of rows.entries()) {
//       // Mapping kolom sesuai dengan Excel terbaru
//       const InputDate = new Date(row[0]);
//       const ShiftName = row[1] || null;
//       const MaterialNo = row[2] || null;
//       const Description = row[3] || null;
//       const PicName = row[4] || null;
//       const Address = row[5] || null;
//       const Mrp = row[6] || null;
//       const CardNo = String(row[7]) || null;
//       const Uom = row[8] || null;
//       const QtyReq = row[9] || 0;
//       const Soh = row[10] || 0;
//       const SohEditDate = row[11] ? new Date(row[11]) : null;
//       const PlanDelivery = row[12] || null;
//       const Remark = row[13] || null;
//       const flag = row[14] || 1;
//       const StockDataId = row[15] || null;

//       // Validasi Data
//       if (String(InputDate) === 'Invalid Date') {
//         validationErrors.push({ error: `Invalid Date on row ${index+1}` });
//         continue;
//       }
//       if (!MaterialNo) {
//         validationErrors.push({ error: `Invalid Material No on row ${index+1}` });
//         continue;
//       }
//       if (!PicName) {
//         validationErrors.push({ error: `Invalid PIC on row ${index+1}` });
//         continue;
//       }
//       if (!ShiftName) {
//         validationErrors.push({ error: `Invalid Shift Name on row ${index+1}` });
//         continue;
//       }
//       if (!Description) {
//         validationErrors.push({ error: `Invalid Description on row ${index+1}` });
//         continue;
//       }
//       if (!Address) {
//         validationErrors.push({ error: `Invalid Address on row ${index+1}` });
//         continue;
//       }
//       if (!Mrp) {
//         validationErrors.push({ error: `Invalid MRP on row ${index+1}` });
//         continue;
//       }
//       if (!CardNo) {
//         validationErrors.push({ error: `Invalid Card No on row ${index+1}` });
//         continue;
//       }
//       if (!QtyReq) {
//         validationErrors.push({ error: `Invalid QtyReq on row ${index+1}` });
//         continue;
//       }

//       const pic = await Pic.findOne({ where: { PicName } }); // Gunakan PicName yang berasal dari Excel
//       if (!pic) {
//         console.warn(`Skipping row because PicId is undefined: ${PicName}`);
//         validationErrors.push({ error: `PicId not found for PIC: ${PicName}` });
//         continue;
//       }

//       const shift = await Shift.findOne({ where: { ShiftName: ShiftName } });
//       if (!shift) {
//         console.warn(`Skipping row because ShiftId is undefined: ${ShiftName}`);
//         validationErrors.push({ error: `ShiftId not found for ShiftName: ${ShiftName}` });
//         continue;
//       }

//       // Cari ShiftId berdasarkan ShiftName
//       const ShiftId = shift ? shift.id : null;
//       const PicId = pic ? pic.id : null;
//       if (!PicId) {
//         validationErrors.push({ error: `Invalid PIC Name on row ${index + 1}: ${PicName}` });
//         continue;
//       }

//       inputData.push({
//         InputDate: new Date(InputDate).toLocaleDateString('en-CA'),
//         MaterialNo,
//         Description,
//         Address,
//         Mrp,
//         CardNo,
//         Uom,
//         QtyReq,
//         Soh,
//         StockAct,
//         PlanDelivery,
//         OrderPic: null,
//         Remark,
//         Section,
//         OrderDate: new Date(OrderDate).toLocaleDateString('en-CA'),
//         SohEditDate: SohEditDate ? new Date(SohEditDate).toLocaleDateString('en-CA') : null,
//         SohEdit,
//         Remaining,
//         flag,
//         PicId,
//         ShiftId,
//         StockDataId,
//       });
//     }

//     console.log(`Creating ${inputData.length} data...`);
//     const responseBulk = await InputRedPost.bulkCreate(inputData, { transaction });
//     console.log("createdInputs:", responseBulk);

//     if (transaction) {
//       console.log("Committing transaction...");
//       await transaction.commit();
//       transaction = null; // Prevent rollback on success
//     }

//     res.status(200).send({
//       message: `Uploaded the file successfully: ${req.file.originalname}`,
//       errors: validationErrors.length > 0 ? validationErrors : "",
//     });
//   } catch (error) {
//     console.error("Error:", error);
//     if (transaction) {
//       console.log("Rolling back transaction...");
//       await transaction.rollback();
//     } else {
//       console.log("No active transaction to rollback.");
//     }
//     res.status(500).send({
//       message: `Could not process the file: ${req.file?.originalname}. ${error.message}`,
//     });
//   }
// };


