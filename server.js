import { app } from "./app.js";
import dotenv from "dotenv";
import connectDB from "./db/connectDB.js";

dotenv.config({
  path: "./.env",
});

const PORT = process.env.PORT || 3000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server Is Running On PORT: ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(`Failed To Start The Server: ${error}`);
  });
