import { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('idle');
  const [downloadUrl, setDownloadUrl] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files) setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;
    setStatus('uploading');
    const formData = new FormData();
    formData.append('file', file);

    try {
      // 👇 PASTE YOUR RENDER URL HERE (No trailing slash)
      const BACKEND_URL = 'https://YOUR-RENDER-URL.onrender.com'; 
      
      const response = await axios.post(`${BACKEND_URL}/convert/office-to-pdf`, formData, {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      setDownloadUrl(url);
      setStatus('done');
    } catch (error) {
      console.error(error);
      setStatus('error');
    }
  };

  return (
    <div className="container">
      <h1>📄 Smart PDF Converter</h1>
      <div className="upload-box">
        <input type="file" onChange={handleFileChange} accept=".docx,.pptx" />
        <button onClick={handleUpload} disabled={!file || status === 'uploading'}>
          {status === 'uploading' ? 'Converting...' : 'Convert to PDF'}
        </button>
      </div>
      {status === 'done' && (
        <a href={downloadUrl} download={`converted-${file.name}.pdf`} className="download-btn">
          Download PDF
        </a>
      )}
    </div>
  );
}

export default App;