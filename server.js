import dotenv from "dotenv";
import cors from "cors";
import conectarDB from './config/db.js';
import express from "express";
import auth from "./routes/auth.js";
import postRoutes from "./routes/postRoutes.js";

const app = express();
app.use(express.json());

dotenv.config();

conectarDB();

//configurar cors
const whitelist = [process.env.FRONTEND_URL];

const corsOptions = {
  origin: function(origin, callback) {
    if(whitelist.includes(origin)) {
      //Puede consultar la API
      callback(null, true);
    } else {
      //No esta Permitido
      callback(new Error("Error de Cors"));
    }
  }
};

app.use(cors(corsOptions));;

//Routing
app.use("/", auth); 
app.use('/post', postRoutes);

const PORT = 4000;
const servidor = app.listen(PORT, () => {
  console.log(`Server started ${PORT}`);
});