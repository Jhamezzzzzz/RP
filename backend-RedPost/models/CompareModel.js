import { Sequelize } from "sequelize";
import db from "../utils/Database.js";

const { DataTypes } = Sequelize;

const CompareMaterial = db.define(
  "CompareMaterial",
  {
    InputDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    
    MaterialNo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Mrp: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    CardNo: {
      type: DataTypes.STRING,
      allowNull: false,
     },
     Section: {
        type: DataTypes.STRING,
        allowNull: true,
      },
     Uom: {
      type: DataTypes.STRING,
      allowNull: true,
    },
      Soh: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      Defisit: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      Pic: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      Shfit: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      Remark: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    //   OrderDate: {
    //     type: DataTypes.DATEONLY,
    //     allowNull: true,
    //   },
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
// //Asosiasi
// Shift.hasMany(InputDefisit, { foreignKey: "ShiftId" });
// InputDefisit.belongsTo(Shift, { foreignKey: "ShiftId" });

// Pic.hasMany(InputDefisit, { foreignKey: "PicId" });
// InputDefisit.belongsTo(Pic, { foreignKey: "PicId" });

// // StockData.hasMany(InputRedPost, { foreignKey: "StockDataId" });
// // InputRedPost.belongsTo(StockData, { foreignKey: "StockDataId" });


export default CompareMaterial;


