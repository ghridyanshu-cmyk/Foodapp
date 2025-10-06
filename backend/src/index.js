import dotenv from "dotenv";
dotenv.config({
    path: './.env'
})
import app from './app.js';

import connectDB from "./db/index.js";
connectDB()
    

    

    .then(() => {
        
            
            console.log(`Server is runnnig at port :${process.env.PORT}`)
        
    })

    .catch((err) => {
        console.log("MongoDb connection failed !!", err)
    })
    export default app;

