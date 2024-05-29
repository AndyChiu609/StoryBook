const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const fs = require('fs');
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.post('/upload', upload.single('file'), (req, res) => {
  res.json({ filePath: `/uploads/${req.file.filename}` });
});

app.post('/save-book', (req, res) => {
  const bookData = req.body;
  fs.readFile('books.json', 'utf8', (err, data) => {
    if (err) {
      if (err.code === 'ENOENT') {
        fs.writeFile('books.json', JSON.stringify([bookData], null, 2), (writeErr) => {
          if (writeErr) {
            console.error(writeErr);
            return res.status(500).send('Error saving book data');
          }
          return res.json({ message: 'Book saved successfully' });
        });
      } else {
        console.error(err);
        return res.status(500).send('Error reading books file');
      }
    } else {
      try {
        const books = data ? JSON.parse(data) : [];
        books.push(bookData);
        fs.writeFile('books.json', JSON.stringify(books, null, 2), (writeErr) => {
          if (writeErr) {
            console.error(writeErr);
            return res.status(500).send('Error saving book data');
          }
          res.json({ message: 'Book saved successfully' });
        });
      } catch (parseErr) {
        console.error(parseErr);
        return res.status(500).send('Error parsing books file');
      }
    }
  });
});

app.get('/books', (req, res) => {
  fs.readFile('books.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error reading books file');
    }
    try {
      const books = JSON.parse(data);
      res.json(books);
    } catch (parseErr) {
      console.error(parseErr);
      res.status(500).send('Error parsing books file');
    }
  });
});

app.post('/add-comment', (req, res) => {
  const commentData = req.body;
  fs.readFile('comments.json', 'utf8', (err, data) => {
    if (err) {
      if (err.code === 'ENOENT') {
        fs.writeFile('comments.json', JSON.stringify([commentData], null, 2), (writeErr) => {
          if (writeErr) {
            console.error(writeErr);
            return res.status(500).send('Error saving comment data');
          }
          return res.json({ message: 'Comment added successfully' });
        });
      } else {
        console.error(err);
        return res.status(500).send('Error reading comments file');
      }
    } else {
      try {
        const comments = data ? JSON.parse(data) : [];
        comments.push(commentData);
        fs.writeFile('comments.json', JSON.stringify(comments, null, 2), (writeErr) => {
          if (writeErr) {
            console.error(writeErr);
            return res.status(500).send('Error saving comment data');
          }
          res.json({ message: 'Comment added successfully' });
        });
      } catch (parseErr) {
        console.error(parseErr);
        return res.status(500).send('Error parsing comments file');
      }
    }
  });
});

app.get('/comments', (req, res) => {
  fs.readFile('comments.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error reading comments file');
    }
    try {
      const comments = JSON.parse(data);
      res.json(comments);
    } catch (parseErr) {
      console.error(parseErr);
      res.status(500).send('Error parsing comments file');
    }
  });
});

app.delete('/delete-book', (req, res) => {
  const { title } = req.body;
  fs.readFile('books.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error reading books file');
    }
    let books = JSON.parse(data);
    books = books.filter(book => book.title !== title);
    fs.writeFile('books.json', JSON.stringify(books, null, 2), (writeErr) => {
      if (writeErr) {
        console.error(writeErr);
        return res.status(500).send('Error saving books file');
      }
      fs.readFile('comments.json', 'utf8', (commentErr, commentData) => {
        if (commentErr) {
          console.error(commentErr);
          return res.status(500).send('Error reading comments file');
        }
        let comments = JSON.parse(commentData);
        comments = comments.filter(comment => comment.bookTitle !== title);
        fs.writeFile('comments.json', JSON.stringify(comments, null, 2), (commentWriteErr) => {
          if (commentWriteErr) {
            console.error(commentWriteErr);
            return res.status(500).send('Error saving comments file');
          }
          res.json({ message: 'Book and comments deleted successfully' });
        });
      });
    });
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
