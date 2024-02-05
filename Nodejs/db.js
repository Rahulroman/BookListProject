const { Pool } = require("pg");

const pool = new Pool({
  user: "hkclass",
  host: "ls-82a7e1e73dbc6b891561175a6721b93bcc976ec0.cjwakx4kq2ub.ap-south-1.rds.amazonaws.com",
  database: "Hktraning",
  password: "hk@123",
  port: 5432,
  ssl: {
    rejectUnauthorized: false,
  },
});

const test = async () => {
  const res = await pool.query("select * from demotable");
  console.log("Result", res.rows);
};

const create = async (tblName) => {
  const queryText = `CREATE TABLE IF NOT EXISTs demotable (
        id SERIAL PRIMARY KEY,
        name  varchar(100),
        email varchar(100) 
        )`;
  const res = await pool.query(queryText);
};

const getUsers = async () => {
  try {
    const res = await pool.query("select * from demotable");
    console.log("Users:", res.rows);
  } catch (err) {
    console.error("Error fetching users:", err);
  }
};

const addUser = async (name, email) => {
  try {
    const res = await pool.query(
      "insert into demotable(name ,email) values ($1 , $2) returning *",
      [name, email]
    );
    console.log("New User :", res.rows);
  } catch (err) {
    console.log("Error adding user:", err);
  }
};

const main = async () => {
  await create();
  await addUser("Rahul", "Rahul@55");
  await getUsers();
};

main();
