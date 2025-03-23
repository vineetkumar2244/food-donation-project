const express = require("express");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/authRoutes");
const cors = require("cors");

const app = express();

const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());
app.use("/api/auth", authRoutes);

app.use(express.json());




app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
