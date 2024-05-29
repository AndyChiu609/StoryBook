import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import HTMLFlipBook from "react-pageflip";
import { Box, Typography, TextField, Button, Link } from "@mui/material";

const ReadBook = () => {
  const { title } = useParams();
  const [book, setBook] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [commenter, setCommenter] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:5000/books")
      .then((response) => {
        const bookData = response.data.find((b) => b.title === title);
        setBook(bookData);
      })
      .catch((error) => {
        console.error("Error fetching book:", error);
      });

    axios
      .get("http://localhost:5000/comments")
      .then((response) => {
        const bookComments = response.data.filter((c) => c.bookTitle === title);
        setComments(bookComments);
      })
      .catch((error) => {
        console.error("Error fetching comments:", error);
      });
  }, [title]);

  const handleAddComment = () => {
    const commentData = {
      bookTitle: title,
      commenter: commenter || "匿名",
      comment: newComment,
      timestamp: new Date().toISOString(),
    };

    axios
      .post("http://localhost:5000/add-comment", commentData)
      .then((response) => {
        setComments((prevComments) => [...prevComments, commentData]);
        setNewComment("");
        setCommenter("");
      })
      .catch((error) => {
        console.error("Error adding comment:", error);
      });
  };

  if (!book) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Box
        className="read-book"
        display="flex"
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
      >
        <Typography variant="h4" color="white" margin={4}>
          {book.title}
        </Typography>
        <HTMLFlipBook width={400} height={400} className="flip-book">
          {book.images.map((image, index) => (
            <div key={index} className="page">
              <img
                src={`http://localhost:5000${image.src}`}
                alt={`page ${index + 1}`}
                className="page-image"
              />
              <div
                className={`page-number ${index % 2 === 0 ? "left" : "right"}`}
              >
                第 {index + 1} 頁
              </div>
            </div>
          ))}
        </HTMLFlipBook>
      </Box>
      <Box
        className="comments-section"
        display="flex"
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
        mb={5}
      >
        <Box className="comments" mb={2}>
          {comments.map((comment, index) => (
            <Box
              key={index}
              bgcolor={"white"}
              borderRadius={2}
              padding={2}
              className="comment"
              sx={{ minWidth: 600 }}
              display="flex"
              align-items="flex-start"
            >
              <strong>{comment.commenter}:</strong>
              <Typography mr={2}>{comment.comment}</Typography>
              <Typography>
                {new Date(comment.timestamp).toLocaleString()}
              </Typography>
            </Box>
          ))}
        </Box>
        <Box
          bgcolor={"white"}
          borderRadius={2}
          padding={2}
          display="flex"
          justifyContent="center"
          alignItems="center"
          flexDirection="column"
        >
          <TextField
            variant="filled"
            type="text"
            value={commenter}
            onChange={(e) => setCommenter(e.target.value)}
            placeholder="你的名字 (選填)"
            sx={{ mb: 2, minWidth: 500 }}
          />
          <TextField
            variant="filled"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="留下你的留言"
            sx={{ mb: 2, minWidth: 500 }}
          />
          <Button
            variant="contained"
            onClick={handleAddComment}
            sx={{ minWidth: 500 }}
          >
            送出留言
          </Button>
        </Box>
      </Box>
      <Link href="/">
        <Button variant="contained" className="back-button">
          回到主頁
        </Button>
      </Link>
    </>
  );
};

export default ReadBook;
