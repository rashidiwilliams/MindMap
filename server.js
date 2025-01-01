const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Replace with your MongoDB connection string
mongoose.connect(
  "mongodb+srv://rashidiwilliams:<db_password>@cluster0.i9mm9.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

const EntrySchema = new mongoose.Schema({
  section: String,
  date: String,
  content: String,
});

const Entry = mongoose.model("Entry", EntrySchema);

app.post("/save", async (req, res) => {
  const entry = new Entry(req.body);
  await entry.save();
  res.send({ message: "Data saved!" });
});

app.get("/entries", async (req, res) => {
  const entries = await Entry.find();
  res.send(entries);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
