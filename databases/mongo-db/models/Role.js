import {Schema, model} from "mongoose";

const Role = new Schema({
    value: {type: String, unique: true, default: "student"}
})

export default model('Role', Role);