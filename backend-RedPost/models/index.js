import db from "../utils/Database.js";

// master berdiri sendiri
import Pic from "./PicModel.js";
import Shift from "./ShiftModel.js";
import StockData from "./StockDataModel.js";
import InputRedPost from "./InputModel.js";




(async () => {
  try {
     //logMasterAssociations();
    //await db.sync();
     //await db.sync({ force: true });
     //await StockData.sync({ force: true });
    // await db.sync({ alter: true });
    console.log("Database synced successfully.");
  } catch (error) {
    console.error("Unable to sync the database:", error);
  }
})();
