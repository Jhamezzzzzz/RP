import InputRedPost from "../models/InputModel.js";

//ini RedPost
export const getInputRedPost = async (req, res) => {
  try {
    const response = await InputRedPost.findAll({
      where: { flag: 1 },
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
    console.log('req.body.InputDate', req.body.InputDate)
    const InputDate = await InputRedPost.findOne({
      where: { InputDate: req.body.InputDate, flag: 1 },
    });

  

    if (InputDate) {
      return res.status(400).json({ message: "InputRedPost already exist" });
    }

    await InputRedPost.create(req.body);
    res.status(201).json({ message: "InputRedPost Created" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateInputRedPost = async (req, res) => {
  try {
    const inputRedPostId = req.params.id;x``

    const inputRedPost = await InputRedPost.findOne({
      where: { id: inputDateId, flag: 1 },
    });

    if (!inputRedPost) {
      return res.status(404).json({ message: "InputRedPost not found" });
    }

    await InputRedPost.update(req.body, {
      where: {
        id: inputRedPostId,
        flag: 1,
      },
    });
    res.status(200).json({ message: "inputRedPost Updated" });
  } catch (error) {
    console.log(error.message);
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


