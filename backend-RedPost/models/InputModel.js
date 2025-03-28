import { Sequelize } from "sequelize";
import db from "../utils/Database.js";
import Shift from "./ShiftModel.js";  
import Pic from "./PicModel.js";  
import StockData from "./StockDataModel.js"; 

const { DataTypes } = Sequelize;

const InputRedPost = db.define(
  "InputRedPost",
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
      OrderPic: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      Soh: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      Section: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      Remark: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      OrderDate: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      SohEditDate: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      SohEdit: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },  
      Remaining: {
        type: DataTypes.INTEGER,
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
Shift.hasMany(InputRedPost, { foreignKey: "ShiftId" });
InputRedPost.belongsTo(Shift, { foreignKey: "ShiftId" });

Pic.hasMany(InputRedPost, { foreignKey: "PicId" });
InputRedPost.belongsTo(Pic, { foreignKey: "PicId" });

StockData.hasMany(InputRedPost, { foreignKey: "StockDataId" });
InputRedPost.belongsTo(StockData, { foreignKey: "StockDataId" });


export default InputRedPost;


