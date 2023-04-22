import sqlite from 'sqlite3';
import jwt from "jsonwebtoken";
import {SECRET_KEY_JWT} from "./constants.js";
import bcrypt from "bcrypt";

function generateAccessToken(login, role) {
    const payload = {
        login,
        role,
    }

    return jwt.sign(payload, SECRET_KEY_JWT, {expiresIn: '24h'})
}


class Database {
    database

    constructor(dbPath) {
        this.dbPath = dbPath;
    }

    async connect() {
        this.database = new sqlite.Database(this.dbPath, (err) => {
            if (err) {
                console.log('Could not connect to database', err)
            } else {
                console.log('Connected to database')
            }
        });
    }

    async selectAllStudents() {
        const response = new Promise((resolve, reject) => {
                this.database.all('SELECT * FROM students;', (err, rows) => {
                    if (err) {
                        console.log('Error running sql');
                        console.log(err);
                        reject(err)
                    } else {
                        resolve(rows)
                    }
                })
            }
        )
        return await response;
    }

    async selectTasksForStudent({ login }) {
        const response = new Promise((resolve, reject) => {
                this.database.all(`SELECT tasks.task, tasks.id, tasks.login, tasks.sub_task, tasks.deadline, topics.topic_title FROM tasks,topics WHERE tasks.login = '${login}' AND tasks.id_topic_task = topics.id;`, (err, rows) => {
                    if (err) {
                        console.log('Error running sql');
                        console.log(err);
                        reject(err)
                    } else {
                        resolve(rows)
                    }
                })
            }
        )
        return await response;
    }

    insertValuesStudent(
        fullname,
        gender,
        faculty,
        group_faculty,
        sub_group_faculty,
        id_emotional_group,
        id_motivation_group,
        id_motivation_profile
    ) {
        try {
            this.database.run(`INSERT INTO students(fullname, gender, faculty, group_faculty, sub_group_faculty, 
                                id_emotional_group, id_motivation_group, id_motivation_profile)
                                 VALUES(
                                 '${fullname}',
                                 '${gender}',
                                 '${faculty}',
                                 '${group_faculty}',             
                                 '${sub_group_faculty}',
                                 '${id_emotional_group}',
                                 '${id_motivation_group}',
                                 '${id_motivation_profile}'
                                 );`);
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async insertTask({
                   task,
                   sub_task,
                   deadline,
                    id_topic_task,
               }) {
        try {
            let lastTaskLogin = await new Promise((resolve, reject) => {
                    this.database.all('SELECT login FROM tasks ORDER BY id DESC LIMIT 1;', (err, rows) => {
                        if (err) {
                            console.log('Error running sql');
                            console.log(err);
                            reject(err)
                        } else {
                            resolve(rows)
                        }
                    })
                }
            )

            let login;
            if (lastTaskLogin.length !== 0) {

                lastTaskLogin = lastTaskLogin[0].login;
                lastTaskLogin = +lastTaskLogin.split('s')[1];

                let quantityOfStudents = await new Promise((resolve, reject) => {
                        this.database.all('SELECT id FROM students ORDER BY id DESC LIMIT 1;', (err, rows) => {
                            if (err) {
                                console.log('Error running sql');
                                console.log(err);
                                reject(err)
                            } else {
                                resolve(rows)
                            }
                        })
                    }
                )
                quantityOfStudents = quantityOfStudents[0].id;
                console.log(lastTaskLogin);
                console.log(quantityOfStudents);

                while (!(lastTaskLogin < quantityOfStudents)) {
                    lastTaskLogin -= quantityOfStudents;
                }

                login = `s${lastTaskLogin + 1}`
            } else {
                login = 's1';
            }

            this.database.run(`INSERT INTO tasks(login, task, sub_task, deadline, id_topic_task)
                                 VALUES(
                                 '${login}',
                                 '${task}',
                                 '${sub_task}',
                                 '${deadline}',
                                '${id_topic_task}'
                                 );`);
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async getStudentsWithTasks() {
        let lastTaskLogin = await new Promise((resolve, reject) => {
                    this.database.all('SELECT tasks.login, students.fullname FROM tasks, students WHERE students.login = tasks.login;', (err, rows) => {
                        if (err) {
                            console.log('Error running sql');
                            console.log(err);
                            reject(err)
                        } else {
                            resolve(rows)
                        }
                    })
                }
            )
        return lastTaskLogin;
    }

    async insertValuesMotivationProfile(
        {
            overall,
            overallDorm,
            overallTeaching,
            dreamDorm,
            realDorm,
            dreamTeaching,
            realTeaching,
        }
    ) {
        let response;

        try {
            this.database.run(`INSERT INTO motivation_profile(overall_mp, overall_dorm_mp, overall_teaching_mp, 
                                dream_dorm_mp, real_dorm_mp,dream_teaching_mp, real_teaching_mp) 
                                VALUES('${overall}',
                                '${overallDorm}',
                                '${overallTeaching}',
                                '${dreamDorm}',
                                '${realDorm}',
                                '${dreamTeaching}',
                                '${realTeaching}'
                                 );`);

            response = new Promise((resolve, reject) => {
                    this.database.get('SELECT MAX(id) as id from motivation_profile;', (err, rows) => {
                        if (err) {
                            console.log('Error running sql');
                            console.log(err);
                            reject(err)
                        } else {
                            resolve(rows)
                        }
                    })
                }
            )
        } catch (error) {
            throw new Error(error.message);
        }

        return await response;
    }

    async getMotivationProfileByLogin(login) {
        let motivationProfile = await new Promise((resolve, reject) => {
                    this.database.all(`SELECT id_motivation_group as id_motivation_profile FROM students WHERE students.login = '${login}';`, (err, rows) => {
                        if (err) {
                            console.log('Error running sql');
                            console.log(err);
                            reject(err)
                        } else {
                            resolve(rows)
                        }
                    })
                }
            )
        return motivationProfile;
    }

    insert_values_emotional(emotionals = []) {
        emotionals.forEach((element) => {
            this.database.run(`INSERT INTO emotional(emotional_group_name)
                                VALUES(${element});`);
        });
    }

    async getUserToken({login, password}) {
        try {
            const getUserByLogin = await new Promise((resolve, reject) => {
                    this.database.all(`SELECT * FROM users WHERE login = '${login}';`, (err, rows) => {
                        if (err) {
                            console.log('Error running sql');
                            console.log(err);
                            reject(err)
                        } else {
                            resolve(rows)
                        }
                    })
                }
            )

            if (getUserByLogin.length !== 1) {
                throw new Error('Нет такого пользователя')
            }

            const user = getUserByLogin[0];

            const isValidPassword = bcrypt.compareSync(password, user.password);

            if(!isValidPassword) {
                throw new Error('Не верный пароль')
            }

            const token = generateAccessToken(user.login, user.role);
            return token;
        } catch (exception) {
            console.log(exception);
        }
    }

    async getUserRole({token}) {
        try {
            const {role: userRole} = jwt.verify(token, SECRET_KEY_JWT);

            return userRole;
        } catch (exception) {
            console.log(exception);
        }
    }

    async getTopics() {
        try {
            const topics = await new Promise((resolve, reject) => {
                    this.database.all(`SELECT * FROM topics`, (err, rows) => {
                        if (err) {
                            console.log('Error running sql');
                            console.log(err);
                            reject(err)
                        } else {
                            resolve(rows)
                        }
                    })
                }
            )

            return topics;
        } catch (exception) {
            console.log(exception);
        }
    }

    async setTopic({topic_title}) {
        try {
            this.database.run(`INSERT INTO topics(topic_title)
                                 VALUES(
                                 '${topic_title}'
                                 );`);
        } catch (exception) {
            console.log(exception);
        }
    }
}

export const db = new Database('./database/database.db');
