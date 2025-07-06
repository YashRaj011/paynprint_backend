const express = require("express");

const app = express();
const PORT = 8000;

app.use(express.json());

app.get("/getPriceForFile", (req, res) => {
    const { file } = req.query;
    if (file.length === 0) {
        return res.status(400).send("Pages Not Available");
    } else {
        const price = "50.00"; // Replace with actual logic to calculate price

        return res.status(200).send({ price });
    }
    res.send("Hello from Price Information!");
});

app.get("/printDoc", (req, res) => {
    res.send("Hello from Print Document!");
    
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
