import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";
import Typography from "@mui/material/Typography";
import "../Pages/Login.css";

const Bookdata = {
  title: "",
  author: "",
};

const BookPage = () => {
  const history = useNavigate();
  const [bookData, setBookData] = useState(Bookdata);
  const [bookList, setBookList] = useState("");
  const token = localStorage.getItem("jwt");

  const cardStyle = {
    width: "750px",
    height: "750px",
    //background: "linear-gradient(135deg, #ffffff, #f0f0f0)", // Light gradient background
    boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.2)", // Slight shadow
    borderRadius: "15px", // Rounded corners
    color: "#080808", // Black text color
  };

  const containerStyle = {
    display: "flex",
    flexDirection: "row",
    gap: "50px",
    padding: "20px",
    justifyContent: "center",
    alignItems: "center",
  };

  const buttonStyle = {
    margin: "10px",
    color: "#080808", // White text color
  };

  const handleBookAdd = async (e) => {
    if (
      !bookData ||
      Object.values(bookData).some((value) => value === null || value === "")
    ) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3100/addBooks",
        bookData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(response.data);
    } catch (error) {
      console.error("There was an error!", error);
    }
  };

  const handleGetBook = async (e) => {
    try {
      const response = await axios.get("http://localhost:3100/booksList", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBookList(response.data);
    } catch (error) {
      console.error("There was an error!", error);
    }
  };

  const handleLogout = () => {
    history("/");
  };

  const handleChangeLogin = (event) => {
    setBookData({ ...bookData, [event.target.name]: event.target.value });
  };

  const columns = [
    { field: "title", headerName: "Title", flex: 1 },
    { field: "author", headerName: "Author", flex: 1 },
  ];

  const getRowId = (row) => row.title;

  return (
    <div style={containerStyle} className="containerStyle">
      <Card style={cardStyle}>
        <AppBar
          position="static"
          style={{ background: "linear-gradient(135deg, #2196f3, #21cbf3)" }}
        >
          {/* <Toolbar style={{ justifyContent: "flex-end" }}>
            <IconButton color="inherit" onClick={handleLogout}>
              <ExitToAppIcon />
            </IconButton>
          </Toolbar> */}
        </AppBar>
        <CardContent>
          <div style={{ textAlign: "center" }}>
            <TextField
              label="Enter Book Name"
              variant="outlined"
              name="title"
              value={bookData.name}
              onChange={handleChangeLogin}
              fullWidth
              margin="normal"
              color="primary"
            />

            <TextField
              label="Enter Author Name"
              variant="outlined"
              name="author"
              value={bookData.author}
              onChange={handleChangeLogin}
              fullWidth
              margin="normal"
              color="primary"
            />

            <Button
              variant="contained"
              color="primary"
              style={buttonStyle}
              onClick={handleBookAdd}
            >
              Add Book
            </Button>

            <Button
              variant="contained"
              color="secondary"
              style={buttonStyle}
              onClick={handleGetBook}
            >
              Get Book List
            </Button>
          </div>
        </CardContent>

        <CardContent>
          <Typography
            variant="h4"
            style={{ marginBottom: "20px", textAlign: "center" }}
          >
            <strong>Books List</strong>
          </Typography>
          <div style={{ height: 400, width: "100%", color: "black" }}>
            <DataGrid
              rows={bookList}
              columns={columns}
              pageSize={10}
              getRowId={getRowId}
              components={{
                NoRowsOverlay: () => (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      height: "100%",
                    }}
                  >
                    No books found
                  </div>
                ),
              }}
              style={{ color: "black" }}
              headerClassName="custom-header"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BookPage;
