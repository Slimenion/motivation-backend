import sqlite from 'sqlite3';
// import pkg from 'pg';
// const { Client } = pkg;


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
                this.database.all(`SELECT * FROM tasks WHERE login = '${login}';`, (err, rows) => {
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

            this.database.run(`INSERT INTO tasks(login, task, sub_task, deadline)
                                 VALUES(
                                 '${login}',
                                 '${task}',
                                 '${sub_task}',
                                 '${deadline}'
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
}

export const db = new Database('./sqlite-db/database.sqlite-db');
