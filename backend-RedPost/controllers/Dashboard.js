import Sequelize from "sequelize";
import StockData from "../models/StockDataModel.js";
import InputRedPost from "../models/InputModel.js";
import Shift from "../models/ShiftModel.js";

const { Op } = Sequelize;

// Controller untuk Dashboard API
export const getCardData = async (req, res) => {
  const { startDate, endDate } = req.query; // Ambil startDate dan endDate dari query

  if (!startDate || !endDate) {
    return res.status(400).json({ message: "Start date and end date are required" });
  }

  try {
    // Total RedPost dalam range tanggal
    const totalRedPost = await InputRedPost.count({
      where: {
        InputDate: {  [Op.between]: [startDate, endDate] },
        flag: 1, // ? Hanya data dengan flag 
      },
    });

    // Total SOH (distinct MaterialNo dari InputRedPost yang join ke StockData)
    const totalSoh = await InputRedPost.count({
      distinct: true, // ✅ Pastikan hanya menghitung unique MaterialNo
      col: 'MaterialNo', // ✅ Hitung MaterialNo yang unik
     
      where: {
        InputDate: {  [Op.between]: [startDate, endDate] },
         Soh: { [Op.gt]: 0 }, // ✅ Filter berdasarkan InputDate
        flag: 1, // ? Hanya data dengan flag 
      },
    });

    res.status(200).json({ totalRedPost, totalSoh });

  } catch (error) {
    console.error("Error fetching card data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

  
export const getCombinationGraph = async (req, res) => {
  const { startDate, endDate } = req.query; // Ambil startDate & endDate dari query

  try {
    // ?? Total StockData berdasarkan MaterialNo dalam rentang tanggal
    const stockData = await StockData.findAll({
      attributes: [
        'MaterialNo',
        [Sequelize.fn('SUM', Sequelize.col('soh')), 'totalSoh']
      ],
      where: {
        soh: { [Op.gt]: 0 },
        createdAt: { [Op.between]: [startDate, endDate] }, // ? Gunakan Op.between untuk range
        flag: 1, // ? Hanya data dengan flag 
      },
      group: ['MaterialNo']
    });

    // ?? Total InputRedPost berdasarkan MaterialNo dalam rentang tanggal
    const inputRedPostCounts = await InputRedPost.findAll({
      attributes: [
        'Description',
        [Sequelize.fn('COUNT', Sequelize.col('id')), 'redPostCount']
      ],
      where: {
        InputDate: {  [Op.between]: [startDate, endDate] },
        flag: 1, // ? Hanya data dengan flag // ? Rentang tanggal
      },
      group: ['Description']
    });

    res.status(200).json({ stockData, inputRedPostCounts });

  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getLineGraph = async (req, res) => {
  const { startDate, endDate } = req.query; // Ambil startDate & endDate dari query

  try {
    const data = await InputRedPost.findAll({
      attributes: [
        'InputDate', // ✅ Gunakan InputDate untuk pengelompokan
        [Sequelize.fn('COUNT', Sequelize.col('MaterialNo')), 'materialCount'],
      ],
      where: {
        InputDate: { [Op.between]: [startDate, endDate] }, // ✅ Filter berdasarkan InputDate
        flag: 1, // ? Hanya data dengan flag
      },
      group: ['InputDate'], // ✅ Grouping berdasarkan InputDate
      order: [['InputDate', 'ASC']], // 🔹 Urutkan berdasarkan tanggal ASC
    });

    res.status(200).json(data);

  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};



export const getDoughnutChart = async (req, res) => {
  const { startDate, endDate } = req.query;
  try {
    const data = await InputRedPost.findAll({
      attributes: [
        'ShiftId',
        [Sequelize.fn('COUNT', Sequelize.col('ShiftId')), 'count'],
      ],
      where: {
        InputDate: { [Op.between]: [startDate, endDate] }, // ✅ Filter berdasarkan InputDate
        flag: 1, // ? Hanya data dengan flag 
      },
      group: ['ShiftId'],
    });

    res.status(200).json(data);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getBarShiftGraph = async (req, res) => {
  const { startDate, endDate } = req.query;

  try {
    if (!startDate || !endDate) {
      return res.status(400).json({ message: "Start date and end date are required" });
    }

    const data = await InputRedPost.findAll({
      attributes: [
        'Description',
        'ShiftId',
        [Sequelize.fn('COUNT', Sequelize.col('ShiftId')), 'shiftCount'],
      ],
      where: {
        createdAt: {
          [Sequelize.Op.between]: [new Date(startDate), new Date(endDate)]
        },
        flag: 1, // ? Hanya data dengan flag 
      },
      group: ['Description', 'ShiftId'],
    });

    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching bar shift graph data:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

