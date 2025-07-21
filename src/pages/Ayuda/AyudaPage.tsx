import { useState, useEffect } from 'react';
import { PageHeader } from '../../components';
import { FaFilePdf, FaDownload, } from 'react-icons/fa';
import { Viewer, Worker } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import './AyudaPage.css';

export const AyudaPage = () => {
  const [activePdf, setActivePdf] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const pdfs = [
    {
      title: "Guía de uso de Digitalia Hispánica",
      file: "/guia_de_uso_digitalia_hispanica.pdf",
      downloadName: "manual-usuario-biblioteca.pdf"
    },
    {
      title: "Guía de Acceso a Pearson Higher Education",
      file: "/Guia_acceso_PHE.pdf",
      downloadName: "guia-rapida-biblioteca.pdf"
    }
  ];

  return (
    <>
      <PageHeader>Ayuda</PageHeader>
      <div className="ayuda-container">
        <div className="pdf-viewer-container">
          <div className="pdf-header">
            <h2>{pdfs[activePdf].title}</h2>
            <a
              href={pdfs[activePdf].file}
              download={pdfs[activePdf].downloadName}
              className="download-btn"
            >
              <FaDownload /> <span className="btn-text">Descargar</span>
            </a>
          </div>

          <div className="pdf-thumbnails">
            {pdfs.map((pdf, index) => (
              <div
                key={index}
                className={`thumbnail ${index === activePdf ? 'active' : ''}`}
                onClick={() => setActivePdf(index)}
              >
                <FaFilePdf className="pdf-icon" />
                <span>{pdf.title}</span>
              </div>
            ))}
          </div>

          <div className="pdf-viewer">
            <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
              <div style={{ height: isMobile ? '60vh' : '80vh', border: '1px solid #ccc', borderRadius: '8px' }}>
                <Viewer fileUrl={pdfs[activePdf].file} />
              </div>
            </Worker>
          </div>
        </div>
      </div>
    </>
  );
};
