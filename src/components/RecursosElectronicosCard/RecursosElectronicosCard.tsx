import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

type RecursosElectronicosCardProps = {
  title: string;
  description: string;
  image: string;
  siteLink: string;
  index: number;
  expandedCardIndex: number | null;
  setExpandedCardIndex: (index: number | null) => void;
};

export const RecursosElectronicosCard = ({
  title,
  description,
  image,
  siteLink,
  index,
  expandedCardIndex,
  setExpandedCardIndex,
}: RecursosElectronicosCardProps) => {
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    const touchCheck = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    setIsTouchDevice(touchCheck);
  }, []);

  const isExpanded = expandedCardIndex === index;

  const handleTouchExpand = () => {
    if (isTouchDevice) {
      setExpandedCardIndex(isExpanded ? null : index);
    }
  };

  const handleBackdropClick = () => {
    setExpandedCardIndex(null);
  };

  const handleMouseEnter = () => {
    if (!isTouchDevice) {
      setExpandedCardIndex(index);
    }
  };

  const handleMouseLeave = () => {
    if (!isTouchDevice) {
      setExpandedCardIndex(null);
    }
  };

  const imageClasses = `w-full h-full object-cover rounded-xl ${
    isExpanded ? 'blur-sm brightness-75' : 'brightness-90'
  }`;

  // === MÓVIL ===
  if (isTouchDevice) {
    if (isExpanded) {
      return (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={handleBackdropClick}
        >
          <div
            className="bg-white rounded-2xl aspect-square w-full max-w-sm relative overflow-hidden recursos-card"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="recursos-card-image-container">
              <img src={image} alt={title} className={imageClasses} />
              <div className="recursos-card-title-overlay">
                <h2 className="recursos-card-title">{title}</h2>
              </div>
              <div className="recursos-card-description-overlay">
                <p className="recursos-card-description">{description}</p>
                <Link
                  to={siteLink}
                  className="recursos-card-sitelink"
                  onClick={(e) => e.stopPropagation()}
                >
                  Visitar Sitio
                </Link>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="recursos-card group" onClick={handleTouchExpand}>
        <div className="recursos-card-image-container">
          <img src={image} alt={title} className={imageClasses} loading="lazy" />
          <div className="recursos-card-title-overlay">
            <h2 className="recursos-card-title">{title}</h2>
          </div>
        </div>
      </div>
    );
  }

  // === PC ===
  return (
    <Link
      className="recursos-card group"
      to={siteLink}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="recursos-card-image-container">
        <img src={image} alt={title} className={imageClasses} loading="lazy" />
        <div className="recursos-card-title-overlay">
          <h2 className="recursos-card-title">{title}</h2>
        </div>
        {isExpanded && (
          <div className="recursos-card-description-overlay">
            <p className="recursos-card-description">{description}</p>
          </div>
        )}
      </div>
    </Link>
  );
};
