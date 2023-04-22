import express from "express";
import { db } from "./database/index.js";
import cors from "cors";
import motivationRouter from "./database/routers/motivation.router.js";

const app = express();

db.connect();

app.use(express.json());
app.use(cors());
app.use('/motivation', motivationRouter);

app.listen( 4444, async(err) => {
    if (err) {
        return console.log(err);
    }

    console.log('Server OK');
});