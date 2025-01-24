import Sequelize from "sequelize";
import StockData from "../models/StockDataModel.js";
import InputRedPost from "../models/InputModel.js";
import Shift from "../models/ShiftModel.js";

const { Op } = Sequelize;

// Controller untuk Dashboard API
export const getCardData = async (req, res) => {
  const { date } = req.query; // Date parameter
  try {
    // Total RedPost
    const totalRedPost = await InputRedPost.count({
      where: Sequelize.where(
        Sequelize.literal("CONVERT(DATE, [InputRedPost].[createdAt])"),
        date
      ),
    });

    // Total SOH (distinct MaterialNo from InputRedPost joined with StockData)
    const totalSoh = await InputRedPost.count({
      include: [
        {
          model: StockData,
          attributes: [], // Avoid fetching extra data
          required: true, // Perform an inner join
          where: { soh: { [Op.gt]: 0 } }, // Filter soh > 0
        },
      ],
      where: Sequelize.where(
        Sequelize.literal("CONVERT(DATE, [InputRedPost].[createdAt])"),
        date
      ),
    });

    res.status(200).json({ totalRedPost, totalSoh });

  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

  
export const getCombinationGraph = async (req, res) => {
  const { date } = req.query;
  try {
    const stockData = await StockData.findAll({
      attributes: ['MaterialNo', [Sequelize.fn('SUM', Sequelize.col('soh')), 'totalSoh']],
      where: {
        soh: { [Op.gt]: 0 },
        [Op.and]: Sequelize.where(
      Sequelize.literal("CONVERT(DATE, [StockData].[createdAt])"),
          date
        ),
      },
      group: ['MaterialNo'],
    });

    const inputRedPostCounts = await InputRedPost.findAll({
      attributes: ['MaterialNo', [Sequelize.fn('COUNT', Sequelize.col('id')), 'redPostCount']],
      where: Sequelize.where(
        Sequelize.literal("CONVERT(DATE, [InputRedPost].[createdAt])"),
        date
      ),
      group: ['MaterialNo'],
    });

    res.status(200).json({ stockData, inputRedPostCounts });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getLineGraph = async (req, res) => {
  try {
    const data = await InputRedPost.findAll({
      attributes: [
        [Sequelize.literal("CONVERT(DATE, [createdAt])"), 'date'],
        [Sequelize.fn('COUNT', Sequelize.col('MaterialNo')), 'materialCount'],
      ],
      where: {
        createdAt: {
          [Op.between]: [
            Sequelize.literal("DATEADD(DAY, -14, GETDATE())"),
            Sequelize.literal('GETDATE()'),
          ],
        },
      },
      group: [Sequelize.literal("CONVERT(DATE, [createdAt])")],
    });

    res.status(200).json(data);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getDoughnutChart = async (req, res) => {
  const { date } = req.query;
  try {
    const data = await InputRedPost.findAll({
      attributes: [
        'ShiftId',
        [Sequelize.fn('COUNT', Sequelize.col('ShiftId')), 'count'],
      ],
      where: Sequelize.where(
        Sequelize.literal("CONVERT(DATE, [createdAt])"),
        date
      ),
      group: ['ShiftId'],
    });

    res.status(200).json(data);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getBarShiftGraph = async (req, res) => {
  const { date } = req.query;
  try {
    const data = await InputRedPost.findAll({
      attributes: [
        'MaterialNo',
        'ShiftId',
        [Sequelize.fn('COUNT', Sequelize.col('ShiftId')), 'shiftCount'],
      ],
      where: Sequelize.where(
        Sequelize.literal("CONVERT(DATE, [createdAt])"),
        date
      ),
      group: ['MaterialNo', 'ShiftId'],
    });

    res.status(200).json(data);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
