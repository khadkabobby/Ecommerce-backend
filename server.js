import express from "express";
import colors from "colors";
import dotenv from "dotenv";
import morgan from "morgan";
import connectDb from "./config/db.js";
import authRoutes from "./routes/authRoute.js";
import categoryRoutes from "./routes/categoryRoute.js";
import productRoutes from "./routes/productRoute.js";
import cors from "cors";

//configure env
dotenv.config();

//connect database
connectDb();

//rest object
const app = express();

//middlewares
app.use(
  cors({
    origin: "https://bobcom.netlify.app", // Replace with your React app's URL
    credentials: true, // If you need to include cookies in the request
  })
);
// app.use(
//   cors({
//     origin: "http://localhost:5173", // Replace with your React app's URL
//     credentials: true, // If you need to include cookies in the request
//   })
// );
app.use(express.json());
app.use(morgan("dev"));

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/category", categoryRoutes);
app.use("/api/v1/product", productRoutes);

//rest api
app.get("/", (req, res) => {
  res.send(`<h1>Hello developers! I am coming to compete with you</h1>`);
});

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(
    `Server is running at http://localhost:${port} sucessfully`.bgCyan.white
  );
});
