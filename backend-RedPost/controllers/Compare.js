import Sequelize from "sequelize";
import InputDefisit from "../models/DefisitModel.js";
import InputRedPost from "../models/InputModel.js";
import CompareMaterial from "../models/CompareModel.js";

const { Op } = Sequelize;

export const getCompare = async (req, res) => {
    let { startDate, endDate } = req.query;
  
    // Jika startDate atau endDate kosong, ambil semua data tanpa filter tanggal
    const dateFilter = startDate && endDate ? { InputDate: { [Op.between]: [startDate, endDate] } } : {};
  
    try {
      // 1️⃣ Ambil semua MaterialNo unik dari InputRedPost
      const uniqueMaterialsRedPost = await InputRedPost.findAll({
          attributes: [
              [Sequelize.fn("DISTINCT", Sequelize.col("MaterialNo")), "MaterialNo"],
              "Description", 
              "Uom",
              "Address"
          ],
          where: {
              ...dateFilter, 
              flag: 1,
          },
          raw: true,
      });
  
      // 2️⃣ Ambil semua MaterialNo unik dari InputDefisit
      const uniqueMaterialsDefisit = await InputDefisit.findAll({
          attributes: [
              [Sequelize.fn("DISTINCT", Sequelize.col("MaterialNo")), "MaterialNo"],
              "Description", 
              "Address"
          ],
          where: {
              ...dateFilter, 
              flag: 1,
          },
          raw: true,
      });
  
      // 3️⃣ Gabungkan MaterialNo dari InputRedPost & InputDefisit (tanpa duplikat)
      const materialNos = [
          ...new Set([
              ...uniqueMaterialsRedPost.map(item => item.MaterialNo),
              ...uniqueMaterialsDefisit.map(item => item.MaterialNo)
          ])
      ];
  
      // 4️⃣ Hitung jumlah SOH di InputRedPost
      const sohCounts = await InputRedPost.findAll({
          attributes: [
              "MaterialNo",
              [Sequelize.fn("COUNT", Sequelize.col("MaterialNo")), "sohCount"]
          ],
          where: {
              MaterialNo: { [Op.in]: materialNos },
              ...dateFilter, 
              flag: 1,
          },
          group: ["MaterialNo"],
          raw: true,
      });
  
      // 5️⃣ Hitung jumlah Defisit di InputDefisit
      const defisitCounts = await InputDefisit.findAll({
          attributes: [
              "MaterialNo",
              [Sequelize.fn("COUNT", Sequelize.col("MaterialNo")), "defisitCount"]
          ],
          where: {
              MaterialNo: { [Op.in]: materialNos },
              ...dateFilter, 
              flag: 1,
          },
          group: ["MaterialNo"],
          raw: true,
      });
  
      // 6️⃣ Ambil InputDate terakhir dari InputDefisit untuk setiap MaterialNo
      const lastInputDates = await InputDefisit.findAll({
          attributes: [
              "MaterialNo",
              [Sequelize.fn("MAX", Sequelize.col("InputDate")), "lastInputDate"] // ✅ Ambil tanggal terakhir
          ],
          where: {
              MaterialNo: { [Op.in]: materialNos },
              ...dateFilter, 
              flag: 1,
          },
          group: ["MaterialNo"],
          raw: true,
      });
  
      // 7️⃣ Gabungkan semua data menjadi satu response
      const responseData = materialNos.map(material => {
          const sohEntry = sohCounts.find(item => item.MaterialNo === material);
          const defisitEntry = defisitCounts.find(item => item.MaterialNo === material);
          const lastInputDateEntry = lastInputDates.find(item => item.MaterialNo === material);
          
          // Cek data dari InputRedPost dulu, jika tidak ada cari di InputDefisit
          const materialInfo = 
              uniqueMaterialsRedPost.find(item => item.MaterialNo === material) || 
              uniqueMaterialsDefisit.find(item => item.MaterialNo === material);
  
          return {
              MaterialNo: material,
              Description: materialInfo ? materialInfo.Description : "", 
              Uom: materialInfo ? materialInfo.Uom : "", 
              Address: materialInfo ? materialInfo.Address : "", 
              Soh: sohEntry ? sohEntry.sohCount : 0, 
              Defisit: defisitEntry ? defisitEntry.defisitCount : 0, 
              InputDate: lastInputDateEntry ? lastInputDateEntry.lastInputDate : null // ✅ Gunakan InputDate terakhir
          };
      });
  
      res.status(200).json(responseData);
  
  } catch (error) {
      console.error("Error fetching compare data:", error);
      res.status(500).json({ message: "Internal server error" });
  }
  };
  
  

export const updateCompare = async (req, res) => {
    try {
      const compareMaterialId = req.params.id; // Ambil ID dari parameter URL
  
      // Gunakan inputRedPostId, bukan inputDateId
      const compareMaterial = await CompareMaterial.findOne({
        where: { id: compareMaterialId, flag: 1 }, // Perbaikan di sini
      });
  
      if (!compareMaterial) {
        return res.status(404).json({ message: "updateCompare not found" });
      }
  
      await CompareMaterial.update(req.body, {
        where: {
          id: compareMaterialId, // Pastikan ini menggunakan inputRedPostId yang benar
          flag: 1,
        },
      });
  
      res.status(200).json({ message: "updateCompare Updated" });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  


