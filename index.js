const express = require("express");
const cors = require("cors");
const monk = require("monk");
const Filter = require("bad-words");
const rateLimit = require("express-rate-limit");

const app = express();

// connect to the mongodb on my localmachine to a database called bowow
const db = monk(process.env.MONGO_URI || "localhost/bowow");
// barks is a collection inside of our database
const barks = db.get("barks");
const filter = new Filter();

app.use(cors());
app.use(express.json());

app.use(express.static("./public"));

app.get("/", (req, res) => {
  res.json({
    message: "BARK! 🐶🐕",
  });
});

app.get("/barks", (req, res) => {
  barks.find().then((barks) => {
    res.json(barks);
  });
});

function isValidBark(bark) {
  return (
    bark.name &&
    bark.name.toString().trim() !== "" &&
    bark.content &&
    bark.content.toString().trim() !== ""
  );
}

app.use(
  rateLimit({
    // 1 request every 30 seconds
    windowMs: 30 * 1000,
    max: 1,
  })
);

app.post("/barks", (req, res) => {
  if (isValidBark(req.body)) {
    // insert into db...
    const bark = {
      name: filter.clean(req.body.name.toString()),
      content: filter.clean(req.body.content.toString()),
      created: new Date(),
    };

    // console.log(bark);
    barks.insert(bark).then((createdBark) => {
      res.json(createdBark);
    });
  } else {
    res.status(422);
    res.json({
      message: "Enter a name and a bark.",
    });
  }
});

app.listen(process.env.PORT || 5000);

// app.listen(5000, () => {
//   console.log("Listening on http://localhost:5000");
// });
