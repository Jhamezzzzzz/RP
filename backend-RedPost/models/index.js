import db from "../utils/Database.js";
import InputDefisit from "./DefisitModel.js";
// master berdiri sendiri
import Pic from "./PicModel.js";
import Shift from "./ShiftModel.js";
import StockData from "./StockDataModel.js";
import InputRedPost from "./InputModel.js";
import DefisitCompare from "./CompareModel.js";




(async () => {
  try {
     //logMasterAssociations();
    //await db.sync();
    //  await .sync({ force: true });
    //  await .sync({ force: true });
    // await InputDefisit.sync({ alter: true });
    console.log("Database synced successfully.");
  } catch (error) {
    console.error("Unable to sync the database:", error);
  }
})();
