import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './AddBook.css';

const AddBook = () => {
  const [images, setImages] = useState([]);
  const [title, setTitle] = useState('');
  const navigate = useNavigate();

  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.forEach((file) => {
      const formData = new FormData();
      formData.append('file', file);

      axios.post('http://localhost:5000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(response => {
        setImages(prevImages => [...prevImages, { src: response.data.filePath, name: file.name }]);
      }).catch(error => {
        console.error('Error uploading file:', error);
      });
    });
  }, []);

  const saveBook = () => {
    const bookData = {
      title,
      images,
    };

    axios.post('http://localhost:5000/save-book', bookData)
      .then(response => {
        console.log(response.data.message);
        navigate('/');
      }).catch(error => {
        console.error('Error saving book data:', error);
      });
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div className="add-book">
      <h1>新增繪本</h1>
      <input 
        type="text" 
        value={title} 
        onChange={(e) => setTitle(e.target.value)} 
        placeholder="輸入繪本標題"
        className="title-input"
      />
      <div {...getRootProps()} className="dropzone">
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>拖放文件到這裡...</p>
        ) : (
          <p>拖放文件到這裡，或點擊選擇文件</p>
        )}
      </div>
      <div className="preview">
        {images.map((image, index) => (
          <div key={index} className="image-container">
            <img src={`http://localhost:5000${image.src}`} alt={`preview ${index}`} />
            <p>{image.name}</p>
          </div>
        ))}
      </div>
      <button onClick={saveBook} className="save-button">儲存</button>
      <Link to="/">
        <button className="back-button">回到主頁</button>
      </Link>
    </div>
  );
};

export default AddBook;
