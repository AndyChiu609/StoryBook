import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Home.css';

const Home = () => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = () => {
    axios.get('http://localhost:5000/books')
      .then(response => {
        setBooks(response.data);
      })
      .catch(error => {
        console.error('Error fetching books:', error);
      });
  };

  const handleDeleteBook = (title) => {
    axios.delete('http://localhost:5000/delete-book', { data: { title } })
      .then(response => {
        console.log(response.data.message);
        fetchBooks();
      })
      .catch(error => {
        console.error('Error deleting book:', error);
      });
  };

  return (
    <div className="home">
      <h1>繪本列表</h1>
      <div className="books">
        {books.map(book => (
          <div key={book.title} className="book-card">
            <Link to={`/read-book/${book.title}`}>
              <img src={`http://localhost:5000${book.images[0].src}`} alt={book.title} />
              <h3>{book.title}</h3>
            </Link>
            <button onClick={() => handleDeleteBook(book.title)} className="delete-button">刪除</button>
          </div>
        ))}
      </div>
      <Link to="/add-book">
        <button>新增繪本</button>
      </Link>
    </div>
  );
};

export default Home;
