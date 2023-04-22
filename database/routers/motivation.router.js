import Router from "express";
import {
    getAllStudents,
    setStudent,
    setMotivationProfile,
    setStudentMobile,
    setTask,
    getTasks,
    getStudentsWithTasks,
    getMotivationProfileByLogin,
    getUserToken,
    getUserRole,
    getTopics,
    setTopic
} from "../controlles/motivation.controller.js";

const motivationRouter = new Router();

motivationRouter.get('/students', getAllStudents);
motivationRouter.post('/students/', setStudent);
motivationRouter.post('/students/mobile', setStudentMobile);
motivationRouter.post('/profile',setMotivationProfile);
motivationRouter.post('/set-task', setTask);
motivationRouter.post('/get-tasks', getTasks);
motivationRouter.get('/get-students-with-tasks', getStudentsWithTasks);
motivationRouter.post('/get-motivation-profile-by-login', getMotivationProfileByLogin);
motivationRouter.post('/login', getUserToken);
motivationRouter.post('/user-role', getUserRole);
motivationRouter.post('/set-topic', setTopic);
motivationRouter.get('/get-topics', getTopics);



export default motivationRouter;
