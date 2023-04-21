import Router from "express";
import {
    getAllStudents,
    createStudent,
    createMotivationProfile,
    createStudentMobile, setTask, getTasks, getStudentsWithTasks, getMotivationProfileByLogin
} from "../controlles/motivation.controller.js";

const motivationRouter = new Router();

motivationRouter.get('/students', getAllStudents);
motivationRouter.post('/students/', createStudent);
motivationRouter.post('/students/mobile', createStudentMobile);
motivationRouter.post('/profile',createMotivationProfile);
motivationRouter.post('/set-task', setTask);
motivationRouter.post('/get-tasks', getTasks);
motivationRouter.get('/get-students-with-tasks', getStudentsWithTasks);
motivationRouter.post('/get-motivation-profile-by-login', getMotivationProfileByLogin);


export default motivationRouter;
