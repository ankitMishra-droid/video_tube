import dotenv from "dotenv";
import connectDB from "./config/db.js";
import { app } from "./app.js";

dotenv.config({
  path: "./.env",
});

connectDB()
  .then(() => {
    console.log("MongoDB connection established.");
    app.get("/", (req, res) => {
      res.end("Hello World")
    })
    app.listen(process.env.PORT, () => {
      console.log(`⚙️ Server is running at port : ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.error(`MONGODB connection failed !!!, ${error}`);
  });
