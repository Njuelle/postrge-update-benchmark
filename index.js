const { insertFakeData, runManyUpdates, runOneUpdate } = require("./lib");
const { Client } = require("pg");

const { numberOfInserts, numberOfUpdates } = require("minimist")(
  process.argv.slice(2)
);

async function main() {
  if (!numberOfInserts || typeof numberOfInserts !== "number") {
    console.log("❌ Wrong or missing --numberOfInserts arg");
    return;
  }

  if (!numberOfUpdates || typeof numberOfUpdates !== "number") {
    console.log("❌ Wrong or missing --numberOfUpdates arg");
    return;
  }

  if (numberOfUpdates > numberOfInserts) {
    console.log("❌ The number of update is higher than the number of insert.");
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

  await insertFakeData(client, numberOfInserts);

  console.log(`✔️ ${numberOfInserts} rows inserted.`);

  console.log("⌛ Running many updates queries...");
  console.time(`✔️ ${numberOfUpdates} updates with many queries in`);

  await runManyUpdates(client, numberOfUpdates);

  console.timeEnd(`✔️ ${numberOfUpdates} updates with many queries in`);

  console.log("⌛ Running with one update query...");
  console.time(`✔️ ${numberOfUpdates} updates with one query in`);

  await runOneUpdate(client, numberOfUpdates);

  console.timeEnd(`✔️ ${numberOfUpdates} updates with one query in`);

  await client.end();
}

main();
