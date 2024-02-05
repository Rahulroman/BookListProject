import React, { useState } from "react";
import axios from "axios";
import "../Pages/Login.css";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Container, Typography } from "@mui/material";

const signInData = {
  name: "",
  email: "",
  username: "",
  password: "",
};

const logInData = {
  username: "",
  password: "",
};

function App() {
  const [signin, setSignIn] = useState(signInData);
  const [login, setLogIn] = useState(logInData);
  const [isLogin, setIsLogin] = useState(true);
  const history = useNavigate();

  const handleSubmit = async (e) => {
    try {
      if (isLogin) {
        if (!login || !login.username || !login.password) {
          alert("Please provide both username and password for login.");
          return;
        }

        const response1 = await axios.post(
          "http://localhost:3100/login",
          login
        );
        localStorage.setItem("jwt", response1.data.token);
        console.log(response1.data);
        history("/books");
      } else {
        if (!signin || !signin.username || !signin.password || !signin.email) {
          alert(
            "Please provide name, email, username and password for registration."
          );
          return;
        }

        const response2 = await axios.post(
          "http://localhost:3100/register",
          signin
        );
        alert(response2.data.message);
        setIsLogin(!isLogin);
        console.log(response2.data);
      }
    } catch (error) {
      console.error("There was an error!", error);
    }
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  const handleChangeSignin = (event) => {
    setSignIn({ ...signin, [event.target.name]: event.target.value });
  };

  const handleChangeLogin = (event) => {
    setLogIn({ ...login, [event.target.name]: event.target.value });
  };

  return (
    <div>
      <div className="formContainer">
        <h2>{isLogin ? "Login Form" : "Signup Form"}</h2>
        <form>
          {isLogin ? (
            <>
              <TextField
                label="username"
                type="username"
                name="username"
                value={login.username}
                onChange={handleChangeLogin}
                fullWidth
                margin="normal"
                required
              />
              <br />

              <TextField
                label="Password"
                type="password"
                name="password"
                value={login.password}
                onChange={handleChangeLogin}
                fullWidth
                margin="normal"
                required
              />
              <br />
            </>
          ) : (
            <>
              <TextField
                label="Name"
                name="name"
                value={signin.name}
                onChange={handleChangeSignin}
                fullWidth
                margin="normal"
                required
              />
              <br />

              <TextField
                label="email"
                name="email"
                value={signin.email}
                onChange={handleChangeSignin}
                margin="normal"
              />
              <br />

              <TextField
                label="username"
                name="username"
                value={signin.username}
                onChange={handleChangeSignin}
                fullWidth
                margin="normal"
                required
              />
              <br />

              <TextField
                label="Password"
                name="password"
                value={signin.password}
                onChange={handleChangeSignin}
                fullWidth
                margin="normal"
                required
              />
              <br />
            </>
          )}

          <button type="button" onClick={handleSubmit} className="button">
            {isLogin ? "Login" : "Signup"}
          </button>
        </form>
        <p>
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <button type="button" onClick={toggleForm} className="toggleButton">
            {isLogin ? "Signup" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
}

export default App;
