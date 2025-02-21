import { Sequelize } from "sequelize";
import db from "../utils/Database.js";


const { DataTypes } = Sequelize;

const StockData = db.define(
  "StockData",
  {
    plant: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    SlocCd: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    materialNo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
     description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    addresRack: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    soh: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    uom: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    flag: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
  },
  {
    freezeTableName: true,
  }
);
export default StockData;
