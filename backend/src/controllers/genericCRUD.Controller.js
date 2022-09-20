const db = require("../config/database");
const checkToken = require("./checkToken");

//ler estrutura de uma tabela
async function funcTableStructure(table) {
  const sql = `
        SELECT a.attname AS coluna,
        format_type(t.oid, null) as tipo_de_dado
        FROM pg_catalog.pg_attribute a
        JOIN pg_catalog.pg_class cl ON (a.attrelid = cl.oid AND cl.relkind = 'r')
        JOIN pg_type t ON (a.atttypid = t.oid )
        where a.attnum > 0 and
        cl.relname = '${table}'`;

  const { rows } = await db.query(sql);
  return rows;
}

exports.get = async (req, res, next) => {
  let result = await checkToken.checkToken(
    req.query.id_usuario,
    req.query.token
  );
  if (!result.result) {
    res.status(200).send({
      message: result.message,
    });
    return;
  }

  // verific consistenct of parameters
  if (!req.query.table) {
    res.status(200).send({
      message: `don't have the table`,
    });
    return;
  }

  var table = req.query.table.trim();
  var sql = `select * from ${table} `;
  if (req.query.id) {
    sql = sql + ` where id in (${req.query.id})`;
  } else if (req.query.filter) {
    sql = sql + ` where ${req.query.filter}`;
  }
  // sql = sql + ` order by nome asc `

  // console.log("sql ", sql);

  const { rows } = await db.query(sql);
  // console.log(rows);

  res.status(200).send({
    message: `List with ${rows.length} rows of ${table}  `,
    body: {
      rows,
    },
  });
};

exports.post = async (req, res) => {
  let result = await checkToken.checkToken(
    req.query.id_usuario,
    req.query.token
  );
  if (!result.result) {
    res.status(200).send({
      message: result.message,
    });
    return;
  }
  // console.log(1, req.query);
  if (!req.query.table) {
    res.status(200).send({
      message: `don't have the table`,
    });
    return;
  }

  // console.log(2, req.body);

  var table = req.query.table.trim();
  var tableStructure = await funcTableStructure(table); // ler a estrutura da tabela
  var columns = [];
  var values = [];
  var type = "";
  console.log(1, req.body);
  for (var [key, value] of Object.entries(req.body)) {
    columns.push(key);
    type = tableStructure.find((element) => element.coluna == key);
    type = type.tipo_de_dado;
    console.log("type: ", type, key, value);
    // console.log('value: ', value);
    if (value === "") {
      values.push("null");
    } else if (type.trim().substring(0, 1) == "c") {
      values.push(`'${value}'`);
    } else if (type.substring(0, 1) == "d") {
      values.push(` date( '${value}' ) `);
    } else if (type.trim().substring(0, 1) == "t") {
      values.push(` to_timestamp('${value}','DD-MM-YYYY HH24:MI:SS') `);
    } else if (type.trim().substring(0, 1) == "j") {
      values.push(`'${value}'`);
    } else {
      values.push(value);
    }
  }

  sql = `INSERT into ${table} ( ${columns} ) values ( ${values} ) RETURNING * `;
  // console.log(3, sql);

  const { rows } = await db.query(sql);

  res.status(200).send({
    message: `${table} added successfully!`,
    body: {
      rows,
    },
  });
};

exports.put = async (req, res, next) => {
  let result = await checkToken.checkToken(
    req.query.id_usuario,
    req.query.token
  );
  if (!result.result) {
    res.status(200).send({
      message: result.message,
    });
    return;
  }
  // verific consistenct of parameters
  if (!req.query.id && !req.query.filter) {
    res.status(200).send({
      message: `don't have the filter`,
    });
    return;
  }

  if (!req.query.table) {
    res.status(200).send({
      message: `don't have the table`,
    });
    return;
  }

  var table = req.query.table.trim();
  var tableStructure = await funcTableStructure(table); // ler a estrutura da tabela
  var values = [];
  var type = "";
  for (var [key, value] of Object.entries(req.body)) {
    type = tableStructure.find((element) => element.coluna == key);
    console.log("type ", type);
    type = type.tipo_de_dado;
    if (value === "" || value == null) {
      values.push(`${key} = null`);
    } else if (type.trim().substring(0, 1) == "c") {
      values.push(`${key} =  '${value}'`);
    } else if (type.substring(0, 1) == "d") {
      values.push(` ${key} =  date( '${value}' ) `);
    } else if (type.trim().substring(0, 1) == "t") {
      values.push(
        ` ${key} =  to_timestamp('${value}','DD-MM-YYYY HH24:MI:SS') `
      );
    } else if (type.trim().substring(0, 1) == "j") {
      values.push(`${key} =  '${value}'`);
    } else {
      values.push(`${key} =  ${value}`);
    }
  }

  sql = `update ${table}  set  ${values} `;

  if (req.query.id) {
    sql = sql + ` where id in (${req.query.id})`;
  } else if (req.query.filter) {
    sql = sql + ` where ${req.query.filter}`;
  }

  sql = sql + ` RETURNING * `;

  console.log("sql: ", sql);
  const { rows } = await db.query(sql);

  res.status(200).send({
    message: `table record ${table} changed with filtero ${req.query.filter} with successfully!`,
    body: {
      rows,
    },
  });
};

exports.delete = async (req, res, next) => {
  let result = await checkToken.checkToken(
    req.query.id_usuario,
    req.query.token
  );
  if (!result.result) {
    res.status(200).send({
      message: result.message,
    });
    return;
  }

  // verific consistenct of parameters
  if (!req.query.id && !req.query.filter) {
    res.status(200).send({
      message: `don't have the filter`,
    });
    return;
  }

  if (!req.query.table) {
    res.status(200).send({
      message: `don't have the table`,
    });
    return;
  }

  var table = req.query.table.trim();

  sql = `delete from ${table}  `;

  if (req.query.id) {
    sql = sql + ` where id in (${req.query.id})`;
  } else if (req.query.filter) {
    sql = sql + ` where ${req.query.filter}`;
  }

  console.log("sql: ", sql);
  const { rows } = await db.query(sql);

  res.status(200).send({
    message: ` The registr of ${table} with filter ${req.query.filter} have been deleted with successfully!`,
  });
};

exports.executaSQL = async (req, res, next) => {
  console.log(req.body);
  let result = await checkToken.checkToken(
    req.query.id_usuario,
    req.query.token
  );
  if (!result.result) {
    res.status(401).send({
      error: result.message,
    });
    return;
  }

  var sql = `${req.body.sql}`;

  console.log("sql: ", sql);

  const { rows } = await db.query(sql);

  res.status(200).send({
    message: `List with ${rows.length} rows `,
    body: {
      table: rows,
    },
  });
};
