import { Sequelize } from "sequelize";
import db from "../utils/Database.js";


const { DataTypes } = Sequelize;

const Shift = db.define(
  "Shift",
  {
    ShiftCode: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ShiftName: {
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
export default Shift;
