import Shift from "../models/ShiftModel.js";
import Pic from "../models/PicModel.js";

//ini shift 
export const getShift = async (req, res) => {
  try {
    const response = await Shift.findAll({
      where: { flag: 1 },
    });

    res.status(200).json(response);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getShiftById = async (req, res) => {
  try {
    const shiftId = req.params.id;
    const shift = await Shift.findOne({
      where: { id: shiftId, flag: 1 },
    });

    if (!shift) {
      return res.status(404).json({ message: "Shift not found" });
    }

    const response = await Shift.findOne({
      where: {
        id: shiftId,
        flag: 1,
      },
    });
    res.status(200).json(response);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const createShift = async (req, res) => {
  try {
    const ShiftCode = await Shift.findOne({
      where: { ShiftCode: req.body.ShiftCode, flag: 1 },
    });

    if (ShiftCode) {
      return res.status(400).json({ message: "Plant Code already exist" });
    }

    await Shift.create(req.body);
    res.status(201).json({ message: "Shift Created" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateShift = async (req, res) => {
  try {
    const shiftId = req.params.id;

    const shift = await Shift.findOne({
      where: { id: shiftId, flag: 1 },
    });

    if (!shift) {
      return res.status(404).json({ message: "Shift not found" });
    }

    await Shift.update(req.body, {
      where: {
        id: shiftId,
        flag: 1,
      },
    });
    res.status(200).json({ message: "Shift Updated" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteShift = async (req, res) => {
  try {
    const shiftId = req.params.id;

    const shift = await Shift.findOne({
      where: { id: shiftId, flag: 1 },
    });
    if (!shift) {
      return res.status(404).json({ message: "Shift not found" });
    }

    await Shift.update(
      { flag: 0 },
      {
        where: { id: shiftId, flag: 1 },
      }
    );

    res.status(200).json({ message: "Shift deleted" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};


//ini PIC
export const getPic = async (req, res) => {
  try {
    const response = await Pic.findAll({
      where: { flag: 1 },
    });

    res.status(200).json(response);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getPicById = async (req, res) => {
  try {
    const picId = req.params.id;
    const pic = await Pic.findOne({
      where: { id: picId, flag: 1 },
    });

    if (!pic) {
      return res.status(404).json({ message: "PIC not found" });
    }

    const response = await Pic.findOne({
      where: {
        id: picId,
        flag: 1,
      },
    });
    res.status(200).json(response);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const createPic = async (req, res) => {
  try {
    const PicName = await Pic.findOne({
      where: { PicName: req.body.PicName, flag: 1 },
    });

    if (PicName) {
      return res.status(400).json({ message: "PIC Name already exist" });
    }

    await Pic.create(req.body);
    res.status(201).json({ message: "PIC Created" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updatePic = async (req, res) => {
  try {
    const picId = req.params.id;

    const pic = await Pic.findOne({
      where: { id: picId, flag: 1 },
    });

    if (!pic) {
      return res.status(404).json({ message: "PIC not found" });
    }

    await Pic.update(req.body, {
      where: {
        id: picId,
        flag: 1,
      },
    });
    res.status(200).json({ message: "PIC Updated" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deletePic = async (req, res) => {
  try {
    const picId = req.params.id;

    const pic = await Pic.findOne({
      where: { id: picId, flag: 1 },
    });
    if (!pic) {
      return res.status(404).json({ message: "PIC not found" });
    }

    await Pic.update(
      { flag: 0 },
      {
        where: { id: picId, flag: 1 },
      }
    );

    res.status(200).json({ message: "PIC deleted" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
