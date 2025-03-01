import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRoute from "./routes/userRoute.js";
import orderRoute from "./routes/orderRoute.js";
import fuelRoute from "./routes/fuelStationRoute.js";
import paymentRoute from "./routes/paymentRoute.js";
//import quantityRoute from "./routes/quantityRoute.js"
import { dbconnect } from "./database/dbconnection.js";

const app=express();
app.use(cors());
app.use(express.json());
dotenv.config();
dbconnect();
app.use(cors({
    origin: 'https://re-fuel.vercel.app' // Allow requests from this origin
  }));
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
    // Allow requests only from 'https://re-fuel.vercel.app'
    res.setHeader('Access-Control-Allow-Origin', 'https://re-fuel.vercel.app');
    next();
});

app.use('/user',userRoute);
app.use('/order',orderRoute);
app.use('/fuel',fuelRoute);
app.use('/payment',paymentRoute);

//app.use('/quantity', quantityRoute)

const PORT=process.env.PORT || 5000;

app.listen(PORT, (req, res) => {
    console.log(`Server started on port:${PORT}`)
})


