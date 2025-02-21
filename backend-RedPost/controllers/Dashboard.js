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
        createdAt: {
          [Op.between]: [startDate, endDate], // ✅ Filter berdasarkan rentang tanggal
        },
      },
    });

    // Total SOH (distinct MaterialNo dari InputRedPost yang join ke StockData)
    const totalSoh = await InputRedPost.count({
      include: [
        {
          model: StockData,
          attributes: [],
          required: true, // Inner join dengan StockData
          where: { soh: { [Op.gt]: 0 } }, // Filter soh > 0
        },
      ],
      where: {
        createdAt: {
          [Op.between]: [startDate, endDate], // ✅ Filter berdasarkan rentang tanggal
        },
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
    // 🔹 Total StockData berdasarkan MaterialNo dalam rentang tanggal
    const stockData = await StockData.findAll({
      attributes: [
        'MaterialNo',
        [Sequelize.fn('SUM', Sequelize.col('soh')), 'totalSoh']
      ],
      where: {
        soh: { [Op.gt]: 0 },
        createdAt: { [Op.between]: [startDate, endDate] } // ✅ Gunakan Op.between untuk range
      },
      group: ['MaterialNo']
    });

    // 🔹 Total InputRedPost berdasarkan MaterialNo dalam rentang tanggal
    const inputRedPostCounts = await InputRedPost.findAll({
      attributes: [
        'MaterialNo',
        [Sequelize.fn('COUNT', Sequelize.col('id')), 'redPostCount']
      ],
      where: {
        createdAt: { [Op.between]: [startDate, endDate] } // ✅ Rentang tanggal
      },
      group: ['MaterialNo']
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
        [Sequelize.literal("CONVERT(DATE, createdAt)"), 'date'], // 🔹 Tetap gunakan CONVERT(DATE)
        [Sequelize.fn('COUNT', Sequelize.col('MaterialNo')), 'materialCount'],
      ],
      where: {
        createdAt: { [Op.between]: [startDate, endDate] } // ✅ Gunakan Op.between untuk range
      },
      group: [Sequelize.literal("CONVERT(DATE, createdAt)")]
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
        createdAt: {
          [Sequelize.Op.between]: [startDate, endDate], // Filter berdasarkan range tanggal
        },
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
        'MaterialNo',
        'ShiftId',
        [Sequelize.fn('COUNT', Sequelize.col('ShiftId')), 'shiftCount'],
      ],
      where: {
        createdAt: {
          [Sequelize.Op.between]: [new Date(startDate), new Date(endDate)]
        }
      },
      group: ['MaterialNo', 'ShiftId'],
    });

    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching bar shift graph data:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

