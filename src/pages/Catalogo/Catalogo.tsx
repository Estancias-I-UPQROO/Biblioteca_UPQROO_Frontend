import { useState, useEffect } from 'react';
import { PageHeader } from "../../components";
import './Catalogo.css';

export const Catalogo = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    // Simular carga para demostración (puedes eliminarlo en producción)
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const handleIframeError = () => {
    setIsLoading(false);
    setLoadError(true);
  };

  return (
    <>
      <PageHeader>Catálogo de la Biblioteca</PageHeader>
    <div className="catalogo-container">
     
    

      {isLoading && (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Cargando catálogo...</p>
        </div>
      )}

      {loadError ? (
        <div className="error-container">
          <p>No se pudo cargar el catálogo. Por favor intenta nuevamente.</p>
          <a 
            href="https://siabuc.ucol.mx/upqroo" 
            target="_blank" 
            rel="noopener noreferrer"
            className="external-link"
          >
            Acceder al catálogo externamente
          </a>
        </div>
      ) : (
        <iframe
          src="https://siabuc.ucol.mx/upqroo"
          title="Catálogo de la Biblioteca"
          className="catalogo-iframe"
          onLoad={() => setIsLoading(false)}
          onError={handleIframeError}
          allowFullScreen
        />
      )}
    </div>
    </>
  );
};