import InputRedPost from "../models/InputModel.js";
import StockData from "../models/StockDataModel.js";

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


