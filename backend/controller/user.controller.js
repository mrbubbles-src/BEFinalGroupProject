require("dotenv").config();
const {
    createUser,
    authenticateUser,
    updateUser,
    adminDeleteUser,
    userDeleteSelf,
    showReadlist,
} = require("../model/user.model");
const { createSecurityToken } = require("../lib/security/token");

const secretTokenPW = process.env.TOKEN_SECRET;

async function httpCreateUser(req, res, next) {
    try {
        const userData = req.body;
        const newUser = await createUser(userData);
        res.json(newUser);
    } catch (error) {
        next(error);
    }
}
async function httpAuthenticateUser(req, res, next) {
    try {
        const { username, password } = req.body;
        const user = await authenticateUser(username, password);
        if (!user) {
            const error = new Error("Falsches Passwort oder Benutzername");
            error.statusCode = 400;
            throw error;
        }
        const securityToken = await createSecurityToken(
            {
                _id: user._id,
                username: user.username,
                password: user.password,
                role: user.role,
            },
            secretTokenPW
        );
        res.json({ user, securityToken });
    } catch (error) {
        next(error);
    }
}

async function httpUpdateUser(req, res, next) {
    try {
        const { userID: id } = req;
        const updatedUser = await updateUser(id, req.body);
        res.json(updatedUser);
    } catch (error) {
        next(error);
    }
}

async function httpUserDeleteSelf(req, res, next) {
    try {
        const { userID: id } = req;
        console.log(id);
        await userDeleteSelf(id);
        res.status(200).json({ message: "Benutzer gelöscht" });
    } catch (error) {
        next(error);
    }
}
async function httpAdminDeleteUser(req, res, next) {
    try {
        const { id } = req.params;
        await adminDeleteUser(id);
        res.status(200).json({ message: "Benutzer gelöscht" });
    } catch (error) {
        return next(error);
    }
}

async function httpShowReadList(req, res, next) {
    try {
        const { userID: _userID } = req;
        const readList = await showReadlist(_userID);
        res.status(200).json(readList);
    } catch (error) {
        next(error);
    }
}
module.exports = {
    httpCreateUser,
    httpAuthenticateUser,
    httpUpdateUser,
    httpUserDeleteSelf,
    httpAdminDeleteUser,
    httpShowReadList,
};
