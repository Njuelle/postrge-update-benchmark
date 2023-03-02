const { insertFakeData, runManyUpdates, runOneUpdate } = require("./lib");
const { Client } = require("pg");

const { numberOfInsert, numberOfUpdate } = require("minimist")(
  process.argv.slice(2)
);

async function main() {
  if (numberOfUpdate > numberOfInsert) {
    console.log("❌ Number of update is higher than the number of insert.");
    return;
  }

  const client = new Client({
    user: "postgres",
    password: "postgres",
    database: "test_db",
  });

  await client.connect();
  await client.query("TRUNCATE TABLE  foobar;");

  console.log("⌛ Start inserting fake data...");

  await insertFakeData(client, numberOfInsert);

  console.log(`✔️ ${numberOfInsert} rows inserted.`);

  console.log("⌛ Running many updates queries...");
  console.time(`✔️ ${numberOfUpdate} updates with many queries in`);

  await runManyUpdates(client, numberOfUpdate);

  console.timeEnd(`✔️ ${numberOfUpdate} updates with many queries in`);

  console.log("⌛ Running with one update query...");
  console.time(`✔️ ${numberOfUpdate} updates with one query in`);

  await runOneUpdate(client, numberOfUpdate);

  console.timeEnd(`✔️ ${numberOfUpdate} updates with one query in`);

  await client.end();
}

main();
