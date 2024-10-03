import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function ImageGenerator() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [generatedImage, setGeneratedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [description, setDescription] = useState('');

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
    </div>
  );
}

export default ImageGenerator;