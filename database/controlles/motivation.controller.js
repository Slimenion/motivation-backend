import { db } from "../index.js";
import {decodeMobileCode} from "../../utils/decodeMobileCode.js";
import {getMotivationGroup} from "../../utils/getMotivationGroup.js";
import {generateCodeMobile} from "../../utils/generateCodeMobile.js";

export const getAllStudents = async (req, res) => {
    try {
        const students = await db.selectAllStudents();
        res.json(students);
    } catch (err) {
        console.log(err);
        res.status(500).json({message: 'Неудалось получить студентов'});
    }
}

export const setStudent = async (req, res) => {
    try {
        const {fullname, gender, faculty, group, subGroup, emotionGroup,motivationProfile} = req.body;
        const mp = await db.insertValuesMotivationProfile(motivationProfile);
        const codeNeroset = generateCodeMobile({...motivationProfile, emotionGroup});
        const motivationGroup = getMotivationGroup(codeNeroset);
        db.insertValuesStudent(fullname,gender,faculty,group,subGroup,emotionGroup,motivationGroup,mp);
        res.json({message: 'Студент создан'});
    } catch (err) {
        res.status(500).json({message: 'Неудалось создать студентов'})
    }
}

export const setStudentMobile = async (req, res) => {
    try {
        console.log(req.body);
        const {fullname,gender,faculty,groupFaculty,subGroupFaculty,emotionalGroup, motivationProfile} = decodeMobileCode(req.body.code);
        const mp = await db.insertValuesMotivationProfile(motivationProfile);
        console.log(mp)
        const motivationGroup = getMotivationGroup(req.body.code);
        db.insertValuesStudent(fullname,gender,faculty,groupFaculty,subGroupFaculty,emotionalGroup,motivationGroup,mp.id);
        res.json({message: 'Студент создан'});
    } catch (err) {
        res.status(500).json({message: 'Неудалось создать студентов'})
    }
}

export const setMotivationProfile = async (req, res) => {

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

export async function getUserToken(req, res) {
    try {
        const token = await db.getUserToken(req.body);
        res.json({token});
    } catch (err) {
        res.status(500).json({message: 'Не удалось вернуть студентов'})
    }
}

export async function getUserRole(req, res) {
    try {
        const role = await db.getUserRole(req.body);
        res.json({role});
    } catch(err) {
        res.status(500).json({message: 'Не удалось получить роль пользователя'})
    }
}

export async function  getTopics(req, res) {
    try {
        const topics = await db.getTopics(req.body);
        res.json({topics});
    } catch(err) {
        res.status(500).json({message: 'Не удалось получить темы'})
    }
}

export async function setTopic(req, res) {
    try {
        await db.setTopic(req.body);
        res.json({message: 'Тема записана'});
    } catch(err) {
        res.status(500).json({message: 'Не удалось получить темы'})
    }
}