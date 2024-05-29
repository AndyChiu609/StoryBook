import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import HTMLFlipBook from 'react-pageflip';
import './ReadBook.css';

const ReadBook = () => {
  const { title } = useParams();
  const [book, setBook] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [commenter, setCommenter] = useState('');

  useEffect(() => {
    axios.get('http://localhost:5000/books')
      .then(response => {
        const bookData = response.data.find(b => b.title === title);
        setBook(bookData);
      })
      .catch(error => {
        console.error('Error fetching book:', error);
      });

    axios.get('http://localhost:5000/comments')
      .then(response => {
        const bookComments = response.data.filter(c => c.bookTitle === title);
        setComments(bookComments);
      })
      .catch(error => {
        console.error('Error fetching comments:', error);
      });
  }, [title]);

  const handleAddComment = () => {
    const commentData = {
      bookTitle: title,
      commenter: commenter || '匿名',
      comment: newComment,
      timestamp: new Date().toISOString(),
    };

    axios.post('http://localhost:5000/add-comment', commentData)
      .then(response => {
        setComments(prevComments => [...prevComments, commentData]);
        setNewComment('');
        setCommenter('');
      })
      .catch(error => {
        console.error('Error adding comment:', error);
      });
  };

  if (!book) {
    return <div>Loading...</div>;
  }

  return (
    <div className="read-book">
      <h1>{book.title}</h1>
      <HTMLFlipBook width={400} height={400} className="flip-book">
        {book.images.map((image, index) => (
          <div key={index} className="page">
            <img src={`http://localhost:5000${image.src}`} alt={`page ${index + 1}`} className="page-image" />
            <div className={`page-number ${index % 2 === 0 ? 'left' : 'right'}`}>
              第 {index + 1} 頁
            </div>
          </div>
        ))}
      </HTMLFlipBook>
      <div className="comments-section">
        <h2>留言區</h2>
        <div className="comments">
          {comments.map((comment, index) => (
            <div key={index} className="comment">
              <strong>{comment.commenter}:</strong>
              <p>{comment.comment}</p>
              <small>{new Date(comment.timestamp).toLocaleString()}</small>
            </div>
          ))}
        </div>
        <div className="comment-input">
          <input
            type="text"
            value={commenter}
            onChange={(e) => setCommenter(e.target.value)}
            placeholder="你的名字 (選填)"
          />
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="留下你的留言"
          />
          <button onClick={handleAddComment}>送出留言</button>
        </div>
      </div>
      <Link to="/">
        <button className="back-button">回到主頁</button>
      </Link>
    </div>
  );
};

export default ReadBook;
