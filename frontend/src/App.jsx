import { useState } from 'react';
import axios from 'axios';
import './App.css';

// --- Icons (Clean SVGs) ---
const LogoIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="brand-icon">
    <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zM6 20V4h7v5h5v11H6z"/>
  </svg>
);

const ConvertIcon = () => (
  <svg className="main-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
  </svg>
);

const UploadIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
  </svg>
);

const DownloadIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
  </svg>
);

function App() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('idle');
  const [downloadUrl, setDownloadUrl] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setStatus('idle');
      setDownloadUrl(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setStatus('uploading');
    const formData = new FormData();
    formData.append('file', file);

    try {
      // LIVE Backend
      const BACKEND_URL = 'https://convertor-serm.onrender.com'; 
      
      const response = await axios.post(`${BACKEND_URL}/convert/office-to-pdf`, formData, {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      setDownloadUrl(url);
      setStatus('success');
    } catch (error) {
      console.error(error);
      setStatus('error');
    }
  };

  return (
    <div className="app">
      
      {/* 1. Navbar */}
      <nav className="navbar">
        <div className="brand">
          <LogoIcon />
          <span>EFN Pdf Converter</span>
        </div>
      </nav>

      {/* 2. Hero Section */}
      <div className="hero">
        <div className="converter-box">
          
          <ConvertIcon />
          
          <h1>EFN Pdf Converter</h1>
          
          <p className="description">
            The easiest way to convert your documents to PDF format.
            <br/>We support <strong>Microsoft Word (.docx)</strong> and <strong>PowerPoint (.pptx)</strong> files.
          </p>

          {/* Initial State & Upload Button */}
          {(status === 'idle' || status === 'error') && (
            <div className="upload-container">
              <input 
                type="file" 
                className="hidden-input"
                onChange={handleFileChange} 
                accept=".docx,.pptx,.doc,.ppt" 
              />
              
              {/* Show 'Select' or 'Selected + Convert' */}
              {!file ? (
                <button className="btn-upload">
                  <UploadIcon /> Select a File
                </button>
              ) : (
                <div style={{display: 'flex', flexDirection: 'column', gap: '15px'}}>
                  <button className="btn-upload" style={{backgroundColor: '#333'}}>
                    📄 {file.name}
                  </button>
                  <button 
                    className="btn-upload"
                    onClick={handleUpload}
                  >
                    Convert to PDF ➜
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Loading State */}
          {status === 'uploading' && (
             <div className="upload-container">
                <button className="btn-upload" disabled>
                  <div className="loader"></div> Converting...
                </button>
                <p style={{fontSize: '14px', color: '#888', marginTop: '15px'}}>
                  Please wait, this may take a moment...
                </p>
             </div>
          )}

          {/* Success State */}
          {status === 'success' && (
            <div className="success-area">
              <div className="success-title">✅ Conversion Completed!</div>
              <a href={downloadUrl} download={`converted-${file.name}.pdf`} className="btn-download">
                <DownloadIcon /> Download PDF
              </a>
              <br/>
              <button className="btn-reset" onClick={() => { setFile(null); setStatus('idle'); }}>
                Convert another file
              </button>
            </div>
          )}

          {status === 'error' && (
            <p style={{color: '#e5322d', marginTop: '20px', fontWeight: 600}}>
              ❌ Error converting file. Please try again.
            </p>
          )}

        </div>
      </div>

      {/* 3. How-to Footer */}
      <div className="steps-section">
        <h2>How to Convert to PDF</h2>
        <div className="steps-grid">
          <div className="step">
            <div className="step-number">1</div>
            <h3>Upload</h3>
            <p>Choose a Word or PowerPoint file from your computer to upload.</p>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <h3>Convert</h3>
            <p>Our tool automatically processes your file and converts it to high-quality PDF.</p>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <h3>Download</h3>
            <p>Download your new PDF file instantly to your device.</p>
          </div>
        </div>
      </div>

    </div>
  );
}

export default App;