const express = require("express");
const Employee = require("../models/model");
const { default: mongoose } = require("mongoose");
const router = express.Router();


router.post("/add-employee", async (req, res) => {
    try {
        const { nom, prenom, anciennete, numero, rue, codepostal, ville, tel, prime } = req.body;

        const newEmployee = new Employee({
            nom,
            prenom,
            anciennete,
            adresse: { numero, rue, codepostal, ville },
            tel,
            prime,
        });

        await newEmployee.save();
        res.redirect("/");
    } catch (error) {
        console.error("Error adding employee:", error);
        res.status(500).send("Server Error");
    }
});




router.get("/get-employees", async (req, res) => {
    try {
        const employees = await Employee.find();
        res.json(employees);
    } catch (error) {
        console.error("Error fetching employees:", error);
        res.status(500).send("Server Error");
    }
});

// MapReduce
router.post("/mapreduce", async (req, res) => {
    try {
        const { groupByField, aggregateField } = req.body;
        if (!groupByField || !aggregateField) {
            return res.status(400).send("Both 'groupByField' and 'aggregateField' are required");
        }


      /*  async function runMapReduce() {
            const mapFunction = function () {
                emit(this.city, this.prime);
            };
        
            const reduceFunction = function (key, values) {
                return Array.sum(values);
            };
        
            const results = await Employee.collection.mapReduce(mapFunction, reduceFunction, {
                out: { inline: 1 },
            });
        
            console.log(results);
        }
 
        runMapReduce();       */
        const pipeline = [
            {
                $group: {
                    _id: `$${groupByField}`,
                    total: { $sum: `$${aggregateField}` },
                },
            },
        ];
        const results = await mongoose.connection.db.collection("employees").aggregate(pipeline).toArray();

        res.status(200).json(results);
    } catch (error) {
        console.error("Error performing aggregation:", error);
        res.status(500).send("Error performing aggregation");
    }
});

// Delete an employee
router.post("/delete-employee", async (req, res) => {
    try {
        const employeeId = req.body.employeeId;
        await Employee.findOneAndDelete({ nom: employeeId });
        res.redirect("/");
    } catch (error) {
        console.error("Error deleting employee:", error);
        res.status(500).send("Server Error");
    }
});





router.get("/top-employees", async (req, res) => {
    try {
        const employees = await Employee.find().sort({ prime: -1 }).limit(5);
        res.json(employees);
    } catch (error) {
        console.error("Error fetching top employees:", error);
        res.status(500).send("Server Error");
    }
});

router.get("/stats", async (req, res) => {
    try {
        const totalEmployees = await Employee.countDocuments();
        const avgPrime = await Employee.aggregate([
            { $group: { _id: null, avgPrime: { $avg: "$prime" } } },
        ]);

        res.json({
            totalEmployees,
            avgPrime: avgPrime[0]?.avgPrime || 0,
        });
    } catch (error) {
        console.error("Error fetching stats:", error);
        res.status(500).send("Server Error");
    }
});


router.get("/filter-by-tenure", async (req, res) => {
    try {
        const { minTenure } = req.query;
        const employees = await Employee.find({
            anciennete: { $gte: parseInt(minTenure, 10) || 0 },
        });
        res.json(employees);
    } catch (error) {
        console.error("Error filtering employees:", error);
        res.status(500).send("Server Error");
    }
});

module.exports = router;
