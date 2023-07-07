const express = require("express");
const route = express.Router();

const { 
    getContacts,  
    getContact, 
    createContact, 
    updateContact, 
    deleteContact 
} = require("../controller/contactController");
const validateToken = require("../middleware/vallidateTokenHandler");

route.use(validateToken)
route.route("/").get(getContacts).post(createContact);
route.route("/:id").get(getContact).put(updateContact).delete(deleteContact);


module.exports = route;