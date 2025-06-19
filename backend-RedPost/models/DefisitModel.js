import { Sequelize } from "sequelize";
import db from "../utils/Database.js";
import Shift from "./ShiftModel.js";  
import Pic from "./PicModel.js";  

const { DataTypes } = Sequelize;

const InputDefisit = db.define(
  "InputDefisit",
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
     Uom: {
      type: DataTypes.STRING,
      allowNull: true,
    },
      QtyReq: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      QtyUpdate: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      RemainQty: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      DefPic: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    //   Soh: {
    //     type: DataTypes.INTEGER,
    //     allowNull: false,
    //   },
      Section: {
        type: DataTypes.STRING,
        allowNull: true,
      },
       CostCenter: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      NoGI: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      OrderDate: {
        type: DataTypes.DATEONLY,
        allowNull: true,
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
//Asosiasi
Shift.hasMany(InputDefisit, { foreignKey: "ShiftId" });
InputDefisit.belongsTo(Shift, { foreignKey: "ShiftId" });

Pic.hasMany(InputDefisit, { foreignKey: "PicId" });
InputDefisit.belongsTo(Pic, { foreignKey: "PicId" });

// StockData.hasMany(InputRedPost, { foreignKey: "StockDataId" });
// InputRedPost.belongsTo(StockData, { foreignKey: "StockDataId" });


export default InputDefisit;


