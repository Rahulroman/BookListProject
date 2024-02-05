const express = require("express");
const bcrypt = require("bcrypt");
const app = express();
const jwt = require("jsonwebtoken");
const PORT = 3100;

const users = [
  {
    username: "John Doe",
    email: "john@abc.com",
    passwordHash:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.hxhfQ7L7Nnyrr13YSty35KrWp4hm40lchUWbcAwRFiY", //Hash of 'mYpass876$'
  },
];

//Authorization: Basic BASE64_ENCODED_USERNAME_PASSWORD

const w_secret = "i_am_kumar";

const basicAuth = (req, res, next) => {
  debugger;
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).send("Unauthorized");
    return;
  }

  const token = authHeader.split(" ")[1];
  const result = jwt.verify(token, w_secret);

  console.log(result);

  const user = users.find((u) => u.username === result.name);
  console.log(user);
  if (!user) {
    res.status(401).send("Unathorized");
    return;
  }
  next();
};

app.all("/userdata/:id", (req, res, next) => {
  // res.send(req.params);
  console.log("heloo");
  next();
});

app.get("/userdata/:id", (req, res) => {
  res.send(req.params);
});

app.get("/user/:id", (req, res) => {
  res.send(req.params);
});
app.get("/use+r?/:id", (req, res) => {
  res.send(req.params);
});

app.get("/ab?c/:id", (req, res) => {
  res.send(req.params);
});

app.get("/abcde*/:id", (req, res) => {
  res.send(req.params);
});

app.get(/z{3}|x{3}/, (req, res) => {
  res.send({ mess: "regex" });
});

app.get("/userdata/:id/phone/:phoneid", (req, res) => {
  res.send(req.params);
});

app.post("/login", (req, res) => {
  const user = users.find((u) => u.username === req.body.username);
  console.log(user);
  if (!user || !bcrypt.compareSync(req.body.password, user.passwordHash)) {
    res.status(401).send({ error: "Unathorized" });
    return;
  }
  jwtPayload = {
    name: user.username,
    email: user.email,
  };
  const TOKEN = jwt.sign(jwtPayload, w_secret, {
    expiresIn: "1h",
  });
  res.status(200).json({ token: TOKEN });
});

app.get("/userdata", basicAuth, (req, res) => {
  res.send("You have access");
});

app.listen(PORT, function () {
  console.log(`Server is runing on ${PORT}.`);
});
