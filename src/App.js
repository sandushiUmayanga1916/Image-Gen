import React, { useState } from 'react';
import axios from 'axios';
import './App.css';  

function ImageGenerator() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [generatedImage, setGeneratedImage] = useState(null);
  const [loading, setLoading] = useState(false);

  // Handle file selection
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);

    if (file) {
      const url = URL.createObjectURL(file);
      setUploadedImage(url);
    }
  };

  // Handle form submission and send file to the server
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      const response = await axios.post('http://localhost:4001/generate-image', formData, {
        responseType: 'arraybuffer',
      });

      // Convert the binary response to a Blob
      const blob = new Blob([response.data], { type: 'image/png' });
      const url = URL.createObjectURL(blob);
      setGeneratedImage(url); // Set the generated image URL
    } catch (error) {
      console.error('Error generating image:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1 className="header">Upload an Image</h1>
      <form onSubmit={handleSubmit} className="form">
        <input type="file" onChange={handleFileChange} className="input" />
        <button type="submit" disabled={!selectedFile || loading} className="button">
          {loading ? 'Generating...' : 'Generate Image'}
        </button>
      </form>

      {/* Display uploaded image */}
      {uploadedImage && (
        <div className="imageContainer">
          <h2>Uploaded Image</h2>
          <img src={uploadedImage} alt="Uploaded" className="image" />
        </div>
      )}

      {/* Display generated image */}
      {generatedImage && (
        <div className="imageContainer">
          <h2>Generated Image Based on Description</h2>
          <img src={generatedImage} alt="Generated Image" className="image" />
        </div>
      )}
    </div>
  );
}

export default ImageGenerator;
