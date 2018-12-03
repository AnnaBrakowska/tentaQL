const express = require("express");
const app = express();
const PORT = process.env.PORT || "8080";
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoController = require("./controllers/controllerMongo");
const db = require("./controllers/controllers");
const mysqlController = require("./controllers/controllerMySQL");
app.use(bodyParser.json());
app.use(cors());

if (process.env.NODE_ENV === "production") {
  app.use(express.static("dist"));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "dist", "build", index.html));
  });
}

// Test Route
app.get("/", (req, res) => {
  res.end("Hello TentaQL");
});

// Postgres Controller Routes
app.post("/db", db.connect);
app.get("/db/all", db.getTables, db.getFields, db.filterAssociations);

app.get(
  "/db/all",
  (req, res, next) => {
    db.getTables(req, res)
      .then(() => next())
      .catch(err => res.json(err));
  },
  (req, res, next) => {
    db.getFields(req, res)
      .then(() => next())
      .catch(err => res.json(err));
  },
  (req, res) => {
    db.filterAssociations(req, res)
      .then(response => {
        console.log("RESPONSE, ", response);
        res.end(JSON.stringify(response));
      })
      .catch(err => res.json(err));
  }
);

app.get("/db/mongo", mongoController.getDatabase);
//`mysql://root:test@localhost/tentaql`
// MySQL Controller Route
app.get("/db/mysql", mysqlController.getDatabase);

// Start the Server
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

module.exports = server;
