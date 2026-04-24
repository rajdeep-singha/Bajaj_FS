const express = require("express");
const cors = require("cors");
const { processData } = require("./processor");

const app = express();
app.use(cors());
app.use(express.json());

const USER_ID = "fullname_ddmmyyyy";  
const EMAIL_ID = "you@college.edu";    
const COLLEGE_ROLL = "21XX0000";       

app.get("/", (req, res) => {
  res.json({
    status: "BFHL server is running",
    endpoints: ["POST /bfhl", "POST /api/bfhl"],
  });
});

function handleBfhl(req, res) {
  const { data } = req.body;

  if (!Array.isArray(data)) {
    return res.status(400).json({ error: "data must be an array of strings" });
  }

  const result = processData(data);

  return res.status(200).json({
    user_id: USER_ID,
    email_id: EMAIL_ID,
    college_roll_number: COLLEGE_ROLL,
    ...result,
  });
}

app.post("/bfhl", handleBfhl);
app.post("/api/bfhl", handleBfhl);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));