const express = require("express");
const dotenv = require("dotenv").config();
const errorHandler = require("./middleware/errorHandler");
const connectDb = require("./config/dbConnection");

connectDb();
const app = express();

const port = process.env.PORT|| 5000;

const contactRoute = require("./routes/contactRoutes");
const userRoute = require("./routes/userRoutes");

app.use(express.json())
app.use("/api/contacts", contactRoute);
app.use("/api/users", userRoute);
app.use(errorHandler);

app.listen(port, () =>{
    console.log(`Server is running on ${port}`)
});

//run server -> npm run dev
// install dotenv
// install express-async-handler // to be used as try catch 
// install bcrypt for hashing password
// install jwt