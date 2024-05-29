import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import './ImageUploader.css';

const ImageUploader = () => {
  const [images, setImages] = useState([]);

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

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div className="image-uploader">
      <div {...getRootProps()} className="dropzone">
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>拖放文件到這裡...</p>
        ) : (
          <p>拖放文件到這裡，或點擊選擇文件</p>
        )}
      </div>
      <div className="uploads-folder">
        <h2>uploads 資料夾</h2>
        <div className="preview">
          {images.map((image, index) => (
            <div key={index} className="image-container">
              <img src={`http://localhost:5000${image.src}`} alt={`preview ${index}`} />
              <p>{image.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ImageUploader;
