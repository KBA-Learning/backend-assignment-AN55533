import jwt from "jsonwebtoken";
const adminCheck = (req, res, next) => {
    if (req.Role == "admin") {
        next();
    }
    else {
        res.status(403).json({ msg: "You are not allowed" })
    }
}

export default adminCheck;
