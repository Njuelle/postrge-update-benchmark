const randomString = () => (Math.random() + 1).toString(36).substring(2);

const insertFakeData = async (client, numberOfInserts) => {
  for (let i = 0; i < numberOfInserts; i++) {
    await client.query(
      "INSERT INTO foobar (id, foo, bar, baz) VALUES ($1, $2, $3, $4)",
      [i, randomString(), randomString(), randomString()]
    );
  }
};

const runManyUpdates = async (client, numberOfUpdates) => {
  for (let i = 0; i < numberOfUpdates; i++) {
    await client.query(
      "UPDATE foobar SET foo = $1, bar = $2, baz = $3 WHERE id = $4",
      [randomString(), randomString(), randomString(), i]
    );
  }
};

const runOneUpdate = async (client, numberOfUpdates) => {
  const whenClause = [];
  const ids = [];

  for (let i = 0; i < numberOfUpdates; i++) {
    whenClause.push(`WHEN id = ${i} THEN '${randomString()}'`);
    ids.push(i);
  }

  const query = `
    UPDATE foobar
    SET foo =
      CASE
          ${whenClause.join(" ")}
      END,
    bar =
      CASE
          ${whenClause.join(" ")}
      END,
    baz =
      CASE
          ${whenClause.join(" ")}
      END
    WHERE id IN (${ids.join(",")});
  `;

  await client.query(query);
};

module.exports = {
  insertFakeData,
  runManyUpdates,
  runOneUpdate,
};
