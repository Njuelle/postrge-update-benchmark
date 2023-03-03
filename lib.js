const randomString = () => (Math.random() + 1).toString(36).substring(2);

const buildInsertsQuery = (numberOfInserts) => {
  const inserts = [];

  for (let i = 0; i < numberOfInserts; i++) {
    inserts.push(
      `INSERT INTO foobar (id, foo, bar, baz) VALUES (${i}, '${randomString()}', '${randomString()}', '${randomString()}')`
    );
  }

  return inserts.join(";");
};

const buildManyUpdateQueries = (numberOfUpdates) => {
  const updates = [];
  for (let i = 0; i < numberOfUpdates; i++) {
    updates.push(
      `UPDATE foobar SET foo = '${randomString()}', bar = '${randomString()}', baz = '${randomString()}' WHERE id = ${i}`
    );
  }

  return updates.join(";");
};

const buildOneUpdateQuery = (numberOfUpdates) => {
  const whenClause = [];
  const ids = [];

  for (let i = 0; i < numberOfUpdates; i++) {
    whenClause.push(`WHEN id = ${i} THEN '${randomString()}'`);
    ids.push(i);
  }

  return `
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
};

module.exports = {
  buildInsertsQuery,
  buildManyUpdateQueries,
  buildOneUpdateQuery,
};
