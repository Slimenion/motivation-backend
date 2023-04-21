import { db } from "../sqlite-sqlite-db/index.js";
import {decodeMobileCode} from "../../../utils/decodeMobileCode.js";
import {nerosetAnswer} from "../../../neroset/index.js";
import {generateCodeMobile} from "../../../utils/generateCodeMobile.js";

export const getAllStudents = async (req, res) => {
    try {
        const students = await db.selectAllStudents();
        res.json(students);
    } catch (err) {
        console.log(err);
        res.status(500).json({message: 'Неудалось получить студентов'});
    }
}

export const createStudent = async (req, res) => {
    try {
        const {fullname, gender, faculty, group, subGroup, emotionGroup,motivationProfile} = req.body;
        const mp = await db.insertValuesMotivationProfile(motivationProfile);
        const codeNeroset = generateCodeMobile({...motivationProfile, emotionGroup});
        const motivationGroup = nerosetAnswer(codeNeroset);
        db.insertValuesStudent(fullname,gender,faculty,group,subGroup,emotionGroup,motivationGroup,mp);
        res.json({message: 'Студент создан'});
    } catch (err) {
        res.status(500).json({message: 'Неудалось создать студентов'})
    }
}

export const createStudentMobile = async (req, res) => {
    try {
        console.log(req.body);
        const {fullname,gender,faculty,groupFaculty,subGroupFaculty,emotionalGroup, motivationProfile} = decodeMobileCode(req.body.code);
        const mp = await db.insertValuesMotivationProfile(motivationProfile);
        console.log(mp)
        const motivationGroup = nerosetAnswer(req.body.code);
        db.insertValuesStudent(fullname,gender,faculty,groupFaculty,subGroupFaculty,emotionalGroup,motivationGroup,mp.id);
        res.json({message: 'Студент создан'});
    } catch (err) {
        res.status(500).json({message: 'Неудалось создать студентов'})
    }
}

export const createMotivationProfile = async (req, res) => {

    try {
        await db.insertValuesMotivationProfile(req.body);
        res.json({message: 'Профиль создан'});
    } catch (err) {
        res.status(500).json({message: 'Не удалосб создать профиль'})
    }
}

export async function setTask(req, res) {
    try {
        await db.insertTask(req.body);
        res.json({message: 'Задача записана'});
    } catch (err) {
        res.status(500).json({message: 'Не удалось записать задачу'})
    }
}

export async function getTasks(req, res) {
    try {
        const tasks = await db.selectTasksForStudent(req.body);
        res.json(tasks);
    } catch (err) {
        res.status(500).json({message: 'Не удалось вернуть задачи'})
    }
}

export async function getStudentsWithTasks(req, res) {
    try {
        const students = await db.getStudentsWithTasks();
        res.json(students);
    } catch (err) {
        res.status(500).json({message: 'Не удалось вернуть студентов'})
    }
}

export async function getMotivationProfileByLogin(req, res) {
    try {
        const students = await db.getMotivationProfileByLogin(req.body.login);
        res.json(students);
    } catch (err) {
        res.status(500).json({message: 'Не удалось вернуть студентов'})
    }
}