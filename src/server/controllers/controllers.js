const pg = require("pg");
const path = require("path");
const PATH = path.join(__dirname, "../../");
const fs = require("fs");
const {
  allTypesCreator,
  queriesCreator,
  mutationCreator,
  typeDefsReturner,
  returnResolvers,
  queryResolver,
  mutationResolver
} = require("../functions/typesCreator");

const db = {};
let tables = {};
let foreignTables = {};
let requiredTables = {};
let uri;
let client;

//CONNECT
db.connect = (req, res) => {
  uri = req.body.url;

  client = new pg.Client(uri);
  client.connect(err => {
    if (err) return console.log("Could not connect to postgres ", err);
  });
  res.json(uri);
};

//GET DATA
db.getTables = (req, res, next) => {
  tables = {};
  console.log("Wiped tables Object");
  foreignTables = {};
  console.log("Wiped foreignTables Object");
    
  client = new pg.Client(uri);
  client.connect(err => {
    if (err) return console.log("Could not connect to postgres ", err);
  });
  client.query(
    "SELECT*FROM pg_catalog.pg_tables WHERE schemaname = 'public' AND tablename NOT LIKE 'spatial_ref_sys'",
    (err, result) => {
      if (err) throw new Error("Error querying database");
      result.rows.map(table => (tables[table.tablename] = {}));
      next();
    }
  );
};

db.getFields = (req, res, next) => {
  Object.keys(tables).map((element, index) => {
    client.query(
      `SELECT column_name, data_type FROM information_schema.columns WHERE table_name = '${element}'`,
      (err, result) => {
        if (err) reject(err);

        tables[element] = result.rows.reduce((acc, curr) => {
          acc[curr.column_name] = curr.data_type;
          return acc;
        }, {});
        if (index === Object.keys(tables).length - 1) {
          next();
        }
      }
    );
  });
};

db.filterAssociations = async (req, res) => {
  let filteredResults = await new Promise((resolve, reject) => {
    client.query(
      "SELECT tc.table_schema, tc.constraint_name, tc.table_name, kcu.column_name, ccu.table_name AS foreign_table_name, ccu.column_name AS foreign_column_name FROM information_schema.table_constraints tc JOIN information_schema.key_column_usage kcu ON tc.constraint_name = kcu.constraint_name JOIN information_schema.constraint_column_usage ccu ON ccu.constraint_name = tc.constraint_name WHERE constraint_type = 'FOREIGN KEY';",
      (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result.rows);
        }
      }
    );
  });
  await filteredResults.map(el => {
    foreignTables[el.table_name] = el.foreign_table_name;
  });
  let primaryKeys = await new Promise((resolve, reject) => {
    client.query(
      "SELECT c.table_name, c.column_name FROM information_schema.table_constraints tc JOIN information_schema.constraint_column_usage AS ccu USING (constraint_schema, constraint_name) JOIN information_schema.columns AS c ON c.table_schema = tc.constraint_schema AND tc.table_name = c.table_name AND ccu.column_name = c.column_name where constraint_type = 'PRIMARY KEY';",
      (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result.rows);
        }
      }
    );
  });
  client.end();
  let filter = {};
  let filteredKeys = await primaryKeys.map(el => {
    filter[el.table_name] = el.column_name;
  });

  tables.primaryKeys = filter;
  tables.foreignTables = foreignTables;

  // tables.requiredTables = requiredTables;

  let queries = queriesCreator(tables);
  let mutations = mutationCreator(tables);
  let types = allTypesCreator(tables);
  let frontEndVersion = typeDefsReturner(queries, mutations, types);
  let queryResolvers = queryResolver(tables);
  let mutationResolvers = mutationResolver(tables);
  let resolvers = returnResolvers(queryResolvers, mutationResolvers);

  let allFiles = {
    frontEnd: frontEndVersion,
    resolvers: resolvers
  };
  
  res.end(JSON.stringify(allFiles));
};
module.exports = db;
