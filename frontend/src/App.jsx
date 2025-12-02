import { useState } from 'react';
import axios from 'axios';
import './App.css';

// --- Icons ---
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

const StepIcon1 = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="step-icon">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
  </svg>
);

const StepIcon2 = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="step-icon">
    <path d="M20 6L9 17l-5-5"/>
  </svg>
);

const StepIcon3 = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="step-icon">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>
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
      <nav className="navbar">
        <div className="brand">
          <LogoIcon />
          <span>EFN Pdf Converter</span>
        </div>
      </nav>

      <div className="hero">
        <div className="main-card">
          
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <ConvertIcon />
          </div>
          
          <h1>EFN Pdf Converter</h1>
          <p className="description">
            The easiest way to convert your documents to PDF format.
            <br/>We support <strong>Word (.docx)</strong> and <strong>PowerPoint (.pptx)</strong> files.
          </p>

          {/* --- ACTION AREA --- */}
          <div className="action-wrapper">
            
            {/* 1. FILE SELECTOR (This one has the hidden input) */}
            {status === 'idle' || status === 'error' ? (
              <>
                <div className="file-select-container">
                  <input 
                    type="file" 
                    className="hidden-input"
                    onChange={handleFileChange} 
                    accept=".docx,.pptx,.doc,.ppt" 
                  />
                  <button className={`btn-upload ${file ? 'btn-secondary' : ''}`}>
                    {!file ? (
                      <>
                        <UploadIcon /> Select Document
                      </>
                    ) : (
                      <span>📄 Change File</span>
                    )}
                  </button>
                </div>

                {/* 2. CONVERT BUTTON (Completely separate now!) */}
                {file && (
                  <div className="convert-button-container">
                    <div style={{marginBottom: '10px', fontWeight: '600', color: '#333'}}>
                      Selected: {file.name}
                    </div>
                    <button 
                      onClick={handleUpload} 
                      className="btn-upload btn-start"
                    >
                      Convert to PDF ➜
                    </button>
                  </div>
                )}
              </>
            ) : null}

            {/* Loading State */}
            {status === 'uploading' && (
               <button className="btn-upload" disabled>
                 <div className="loader"></div> Converting...
               </button>
            )}
          </div>

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

      <div className="steps-section">
        <div className="steps-grid">
          <div className="step">
            <StepIcon1 />
            <h3>Upload your file</h3>
            <p>Select the Word or PowerPoint document you wish to convert from your computer.</p>
          </div>
          <div className="step">
            <StepIcon2 />
            <h3>Automatic Conversion</h3>
            <p>Our tool will automatically scan and convert your file to PDF format instantly.</p>
          </div>
          <div className="step">
            <StepIcon3 />
            <h3>Download PDF</h3>
            <p>Your new PDF document will be ready to download immediately after processing.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;