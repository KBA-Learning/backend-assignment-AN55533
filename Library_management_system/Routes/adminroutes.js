import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import authenticate  from '../Middleware/auth.js';
import dotenv from 'dotenv';
import adminCheck from '../Middleware/adminauth.js';


dotenv.config();
const adminRoute = Router();
const user = new Map();
const books = new Map();

adminRoute.get('/', (req, res) => {
    res.send("Hello World");
})
//  function userLogin(){}
adminRoute.post('/signup', async (req, res) => {
    try {
        const { FirstName, LastName, UserName, Password, UserRole } = req.body;
        console.log(FirstName);
        if (user.get(UserName)) {
            res.status(400).send("Username already exist");
        }
        else {
            const newPassword = await bcrypt.hash(Password, 10);
            console.log(newPassword);
            user.set(UserName, { FirstName, LastName, Password: newPassword, UserRole });
            res.status(201).send("Signed-up successfully")
            console.log(user.get(UserName));
        }
    }


    catch {
        res.status(500).send("Internal Server error");
    }  

})


adminRoute.post('/login', async (req, res) => {
    try {
        const { UserName, Password } = req.body;
        const result = user.get(UserName);
        if (!result) {
            res.status(400).send("Enter a valid username");
        }
        else {
            console.log(result.Password);
            const valid = await bcrypt.compare(Password, result.Password);
            console.log(valid);
            if (valid) {
                const token = jwt.sign({ UserName: UserName, UserRole: result.UserRole }, process.env.SecretKey, { expiresIn: '1h' });
                console.log(token);
                res.cookie('authToken1', token,
                    {
                        httpOnly: true
                    });
                res.status(200).json({ message: "Logged in successfully" });
            }
            else {

                res.status(401).send("Unauthorized access");

            }
        }

    }
    catch {
        res.status(500).send("Internal Server Error")
    }
})
adminRoute.post("/addbooks", authenticate, adminCheck,(req, res) => {

    try {

        const { title, author, genre, description, Price } = req.body;
        if (books.get(title)) {
            res.status(400).json({ msg: "book details already exist" });
        }
        else {
            books.set(title, { author, genre, description, Price });
            
            res.status(201).json({ msg: `${title} stored successfully` })
            console.log(books.get(title));

        }
    }
    catch {
        res.status(500).send("Internal Server error");
    }

})

adminRoute.get('/getbooks/:title', (req, res) => {
    const Title = req.params.title
    console.log(Title);
    if (books.get(Title)) {
        console.log(books.get(Title));
        res.status(200).json("view bookdetails ")
    } else {
        res.status(400).json({ message: 'book not available' })
    }

})
adminRoute.put('/updatebooks', authenticate, adminCheck, (req, res) => {

    if (req.Role == 'admin') {
        const { title, author, genre, description, Price } = req.body;
        if (books.get(title)) {
            books.set(title, { author, genre, description, Price });
            console.log(books.get(title));
            res.status(201).json({ msg: `${title} updated successfully` })

        }
        else {
            res.status(400).json({ msg: "books name already updated" });

        }


    }
})
adminRoute.delete("/deletebooks/:title", authenticate, adminCheck, (req, res) => {
    const title = req.params.title;
    if (books.get(title)) {
        console.log(`${title} books deleted successfully`);
        res.status(201).json({ msg: `${title}  book deleted successfully` })

    } else {
        console.log("no books details found");
    }

})
export { adminRoute };


