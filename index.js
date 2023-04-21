import express from "express";
import mongoose from 'mongoose';
import { db } from "./sqlite-sqlite-db/index.js";
import cors from "cors";
import motivationRouter from "./databases/sqlite-db/routers/motivation.router.js";
import authRouter from './databases/mongo-db/authRouter.js'

const app = express();

db.connect();

app.use(express.json());
app.use(cors());
app.use('/auth', authRouter);
app.use('/motivation', motivationRouter);

app.listen( 4444, async(err) => {
    await mongoose.connect(`mongodb+srv://mbobrovskij2020:lkTGokVk25ihog68@motivationlogindatabase.tygreii.mongodb.net/?retryWrites=true&w=majority`);

    if (err) {
        return console.log(err);
    }
    console.log('Server OK');
});