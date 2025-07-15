import { useState } from 'react';
import { Link } from 'react-router-dom';

type RecursosElectronicosCardProps = {
  title: string;
  description: string;
  image: string;
  siteLink: string;
};

export const RecursosElectronicosCard = ({ title, description, image, siteLink }: RecursosElectronicosCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link
      className="recursos-card group"
      to={siteLink}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="recursos-card-image-container">
        <img 
          src={image} 
          alt={title} 
          className={`recursos-card-image ${isHovered ? 'blur-sm brightness-75' : 'brightness-90'}`}
          loading="lazy"
        />
         
        {/* Título siempre visible sobre la imagen */}
        <div className="recursos-card-title-overlay">
          <h2 className="recursos-card-title">{title}</h2>
        </div>
        
        {/* Descripción solo visible en hover */}
        {isHovered && (
          <div className="recursos-card-description-overlay">
            <p className="recursos-card-description">{description}</p>
          </div>
        )}
      </div>
    </Link>
  );
};