import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function ImageGenerator() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [generatedImage, setGeneratedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [description, setDescription] = useState('');
  const [error, setError] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);

    if (file) {
      const url = URL.createObjectURL(file);
      setUploadedImage(url);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setDescription('');
    setError(null);
    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      const response = await axios.post('https://gen.enfection.com/generate-image', formData, {
        responseType: 'arraybuffer',
      });

      const blob = new Blob([response.data], { type: 'image/png' });
      const url = URL.createObjectURL(blob);
      setGeneratedImage(url);

      // For demonstration purposes, we're setting a placeholder description
      // In a real scenario, you might want to get this from the server
      setDescription("Image generated based on the uploaded image's description.");
    } catch (error) {
      console.error('Error generating image:', error);
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        setError(`Server error: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
      } else if (error.request) {
        // The request was made but no response was received
        setError('No response received from server. Please try again.');
      } else {
        // Something happened in setting up the request that triggered an Error
        setError(`Error: ${error.message}`);
      }
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

      {uploadedImage && (
        <div className="imageContainer">
          <h2>Uploaded Image</h2>
          <img src={uploadedImage} alt="Uploaded" className="image" />
        </div>
      )}

      {generatedImage && (
        <div className="imageContainer">
          <h2>Generated Image</h2>
          <img src={generatedImage} alt="Generated" className="image" />
          {description && <p className="description">{description}</p>}
        </div>
      )}

      {error && (
        <div className="errorContainer">
          <h2>Error</h2>
          <p className="error">{error}</p>
        </div>
      )}
    </div>
  );
}

export default ImageGenerator;