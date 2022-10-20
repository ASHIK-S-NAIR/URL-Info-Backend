const express = require("express")
const app = express();
const cors = require("cors");
require("dotenv").config();

app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 8000;

app.get("/", (req, res) => {
    res.send("Projet initialized");
})

app.listen(PORT, () => {
    console.log(`Server is running on PORT: ${PORT}`);
})