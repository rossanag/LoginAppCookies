import User from "../model/User";
import { userSchema } from "../schemas/user";
import { generateHash } from "../Utils/utils";


const handleNewUser = async (req, res, user) => {
    
    //console.log('Datos del usuario ', req.body)
    try {

        const duplicate = await User.findOne({ email: user.userInfo.email });
        if (duplicate) {
            console.log('Usuario duplicado ', duplicate);
            return res.status(409).json({ error: 'User already exists' });
        }

        let hashRefreshToken = undefined;
        try {
            hashRefreshToken = await generateHash(user.userInfo.refreshToken);
        }
        catch (err) {
            return res.status(500).json({ error: 'Please, log again' });
        }

        let userDB = undefined;
        if (user.userInfo.authMode === 'google') {
            userDB = await User.create({     
                "name": user.userInfo.name,       
                "email": user.userInfo.email,
                "picture": user.userInfo.picture,
                "authMode": 'google',
                "refreshToken": hashRefreshToken
            });            
        } else {

            let hashedPasword = undefined;
            try {
                hashedPasword = await generateHash(user.userInfo.password);
            }
            catch (err) {
                return res.status(500).json({ error: 'Please, log again' });
            }
            userDB = await User.create({
                "name": user.userInfo.name,
                "email": user.userInfo.email,
                "password": hashedPasword,
                "authMode": 'local',
                "refreshToken": hashRefreshToken
            });
        }

            

        console.log('Usuario creado ', user)
        res.status(201).json(userDB);

    } catch (error) {
        console.log('Error al crear usuario ', error)
        res.status(500).json({ error: error.message });
    }
}

export default handleNewUser;