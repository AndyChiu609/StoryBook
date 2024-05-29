import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link, Button, Typography, Box, TextField } from "@mui/material";

const AddBook = () => {
  const [images, setImages] = useState([]);
  const [title, setTitle] = useState("");
  const navigate = useNavigate();

  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.forEach((file) => {
      const formData = new FormData();
      formData.append("file", file);

      axios
        .post("http://localhost:5000/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          setImages((prevImages) => [
            ...prevImages,
            { src: response.data.filePath, name: file.name },
          ]);
        })
        .catch((error) => {
          console.error("Error uploading file:", error);
        });
    });
  }, []);

  const saveBook = () => {
    const bookData = {
      title,
      images,
    };

    axios
      .post("http://localhost:5000/save-book", bookData)
      .then((response) => {
        console.log(response.data.message);
        navigate("/");
      })
      .catch((error) => {
        console.error("Error saving book data:", error);
      });
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <Box
      className="add-book"
      display="flex"
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
    >
      <Typography variant="h4" color="white" gutterBottom mt={4}>
        新增繪本
      </Typography>
      <Box bgcolor="white" padding={2} borderRadius={2}>
        <TextField
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="輸入繪本標題"
          className="title-input"
          sx={{ width: "70%" }}
        />

        <Box
          {...getRootProps()}
          className="dropzone"
          display="flex"
          justifyContent="center"
          alignItems="center"
          sx={{
            border: "2px dashed #cccccc",
            padding: "20px",
            cursor: "pointer",
            margin: "20px",
            width: 600,
            height: 200,
          }}
        >
          <input {...getInputProps()} />
          {isDragActive ? (
            <Typography color="grey">拖放文件到這裡...</Typography>
          ) : (
            <Typography color="grey">拖放文件到這裡，或點擊選擇文件</Typography>
          )}
        </Box>
      </Box>
      <Box className="preview" mb={2}>
        {images.map((image, index) => (
          <Box key={index} className="image-container">
            <img
              src={`http://localhost:5000${image.src}`}
              alt={`preview ${index}`}
            />
            <Typography variant="h6" color="white">
              {image.name}
            </Typography>
          </Box>
        ))}
      </Box>
      <Box>
        <Button
          variant="contained"
          onClick={saveBook}
          className="save-button"
          sx={{ mr: 2 }}
        >
          儲存
        </Button>
        <Link href="/">
          <Button variant="contained" className="back-button">
            回到主頁
          </Button>
        </Link>
      </Box>
    </Box>
  );
};

export default AddBook;
