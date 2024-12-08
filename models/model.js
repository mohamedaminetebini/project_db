const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
    nom: {
        type: String,
        required: true,
    },
    prenom: {
        type: String,
        required: true,
    },
    anciennete: {
        type: Number,
        required:false,
    },
    adresse: {
        numero: { type: Number, required: false },
        rue: { type: String, required: false },
        codepostal: { type: Number, required: false },
        ville: { type: String, required: false },
    },
    tel: {
        type: Number,
        required: false,
    },
    prime: {
        type: Number,
        required: false,
    },
});

const Employee = mongoose.model("Employee", employeeSchema);

module.exports = Employee;