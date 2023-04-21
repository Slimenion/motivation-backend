import jwt from 'jsonwebtoken'
import {SECRET_KEY_JWT} from "../constants.js";

export default function (req, res, next) {
    if (req.method === "OPTIONS") {
        next();
    }

    try {
        const token = req.headers.authorization.split(' ')[1];

        if (!token) {
            return res.status(403).json({message: "Пользователь не авторизован"})
        }

        const decodedData = jwt.verify(token, SECRET_KEY_JWT);
        req.user = decodedData;
        next();
    } catch (e) {
        console.log(e);
        return res.status(403).json({message: "Пользователь не авторизован"})
    }
}