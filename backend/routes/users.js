const express = require("express");
const {
    httpCreateUser,
    httpAuthenticateUser,
    httpAdminGetAllUsers,
    httpUpdateUser,
    httpAdminDeleteUser,
    httpUserDeleteSelf,
    httpShowReadList,
} = require("../controller/user.controller");

const { httpDeleteBookFromReadlist } = require("../controller/book.controller");

const { userValidationRules } = require("../lib/inputValidation/userRules");

const { validateInputs } = require("../middleware/inputValidation");

const {
    authenticateToken,
    adminCheck,
} = require("../middleware/userValidation");

const router = express.Router();

router.get("/", authenticateToken, function (req, res, next) {
    res.send("Welcome to the bookt server");
});

router.post(
    "/signup",
    validateInputs(userValidationRules.signup),
    httpCreateUser
);
router.post(
    "/login",
    validateInputs(userValidationRules.login),
    httpAuthenticateUser
);

router.put("/updateUser", authenticateToken, httpUpdateUser);

router.delete("/userDeleteSelf", authenticateToken, httpUserDeleteSelf);

router.get("/getReadlist", authenticateToken, httpShowReadList);

router.delete(
    "/deleteBookFromReadlist/:bookID",
    authenticateToken,
    httpDeleteBookFromReadlist
);

router.get(
    "/adminGetAllUsers",
    authenticateToken,
    adminCheck,
    httpAdminGetAllUsers
);

router.delete(
    "/adminDeleteUser/:id",
    authenticateToken,
    adminCheck,
    httpAdminDeleteUser
);

module.exports = router;
