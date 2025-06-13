const express = require("express");
const cors = require("cors");
require("dotenv").config();
require("./db/conn");
const path = require("path");

const userRouter = require("./routes/userRoutes");
const doctorRouter = require("./routes/doctorRoutes");
const appointRouter = require("./routes/appointRoutes");
const notificationRouter = require("./routes/notificationRouter");
const symptomRouter = require("./routes/symptomRoutes"); // ✅

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// ✅ API routes
app.use("/api/user", userRouter);
app.use("/api/doctor", doctorRouter);
app.use("/api/appointment", appointRouter);
app.use("/api/notification", notificationRouter);
app.use("/api/symptom-assessment", symptomRouter); // ✅ Make sure this is ABOVE static route!

// ✅ Static build (AFTER API routes)
app.use(express.static(path.join(__dirname, "./client/build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./client/build/index.html"));
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
