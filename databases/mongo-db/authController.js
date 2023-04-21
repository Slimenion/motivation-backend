import User from './models/User.js'
import Role from './models/Role.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';
import { SECRET_KEY_JWT } from "./constants.js";

function generateAccessToken(id, role) {
    const payload = {
        id,
        role,
    }

    return jwt.sign(payload, SECRET_KEY_JWT, {expiresIn: '24h'})
}

class authController {
    async registration(req, res) {
        const userRole = await Role.findOne({value: 'student'})
        for (let i = 1 ; i< 66; i++) {
            const user = new User({
                username: 's' + i,
                password: bcrypt.hashSync('1234', 7),
                role: userRole.value,
            })
            await user.save()
        }

        return res.json('Пользователь записан')
    }

    async login(req, res) {
        const {username, password} = req.body;
        const user = await User.findOne({username})
        if (!user) {
            return res.status(400).json({message: `Пользователь ${username} не найден`});
        }

        const validPassword = bcrypt.compareSync(password, user.password);
        if (!validPassword) {
            return res.status(400).json({message: `Введен не верный пароль`})
        }

        const token = generateAccessToken(user._id, user.role);
        return res.json({token});
    }

    async getUserRole(req, res){
        try {
            const token = req.headers.authorization.split(' ')[1];

            if (!token) {
                return res.status(403).json({message: "Пользователь не авторизован"})
            }

            const {role: userRole} = jwt.verify(token, SECRET_KEY_JWT);

            return res.json({role: userRole})
        } catch (e) {
            console.log(e);
            return res.status(403).json({message: "Пользователь не авторизован"})
        }
    }
}

export default new authController();