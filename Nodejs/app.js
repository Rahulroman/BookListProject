const express = require("express");
const { Pool } = require("pg");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = 3100;

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

app.use(bodyParser.json());
app.use(cors());

function generateToken(user) {
  return jwt.sign(user, "your-256-bit-secret", { expiresIn: "1h" });
}

const createBookTable = async () => {
  const Book_Table_Query = `CREATE TABLE IF NOT EXISTS Rahul_Books(title VARCHAR(100),author VARCHAR(100))`;
  try {
    const res = await pool.query(Book_Table_Query);
    console.log("Books Table created sucessfully..");
  } catch (err) {
    console.log("Error for table creation : ", err);
  }
};

const createLoginTable = async () => {
  const Login_Table_Query = `CREATE TABLE IF NOT EXISTS Rahul_LoginDetails(id SERIAL PRIMARY KEY, name VARCHAR(50), email VARCHAR(50),username VARCHAR(200),password VARCHAR(2000))`;
  try {
    const res = await pool.query(Login_Table_Query);
    console.log("Login Details Table created sucessfully..");
  } catch (err) {
    console.log("Error for table creation : ", err);
  }
};

app.post("/register", async (req, res) => {
  const { name, email, username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await pool.query(
      "INSERT INTO Rahul_LoginDetails(name,email,username,password) VALUES($1, $2, $3, $4)",
      [name, email, username, hashedPassword]
    );
    res.json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error register user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    console.log(username, password);

    const result = await pool.query(
      "SELECT * FROM Rahul_LoginDetails WHERE username = $1",
      [username]
    );

    if (result.rows.length === 0) {
      res.status(401).send("Invalid credentials");
      return;
    }

    const user = result.rows[0];
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      res.status(401).send("Invalid credentials");
      return;
    }

    const token = generateToken({ username: user.username });
    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

function authenticateToken(req, res, next) {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).send("Access denied");
  }
  const encToken = token.split(" ")[1];
  jwt.verify(encToken, "your-256-bit-secret", (err, user) => {
    if (err) {
      console.log("Invalid", err);
      return res.status(403).send("Invalid token");
    }
    req.user = user;
    next();
  });
}

app.post("/addBooks", authenticateToken, async (req, res) => {
  try {
    const { title, author } = req.body;
    await pool.query(
      "INSERT INTO Rahul_Books (title, author) VALUES ($1, $2)",
      [title, author]
    );

    res.status(201).send("Book added successfully!");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/booksList", authenticateToken, async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM Rahul_Books");
    const books = result.rows;
    res.json(books);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/userList", authenticateToken, async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM Rahul_LoginDetails");
    const books = result.rows;
    res.json(books);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(PORT, function () {
  console.log(`Server is runing on ${PORT}.`);
});

const main = async () => {
  //   await createLoginTable();
  //   await createBookTable();
  //getAllTableData();
};

main();
