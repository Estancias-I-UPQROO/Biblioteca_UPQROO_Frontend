import { useState, useEffect } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './styles.css';

interface Evento {
  id: number;
  imagen: string;
  titulo: string;
  descripcion: string;
  botones?: {
    texto: string;
    imagenAsociada: string;
  }[];
}

export const InicioPage = () => {
  // Imágenes para el hero banner
  const imagenesBiblioteca = [
    'https://preview.redd.it/vo9vm1fcqrp71.jpg?auto=webp&s=cb4016edf50a37cf06dbe9e975ed9410b253bff0',
    'https://www.taisa-designer.com/wp-content/uploads/2019/09/anton-darius-thesollers-xYIuqpHD2oQ-unsplash.jpg',
    'https://cf-assets.www.cloudflare.com/slt3lc6tev37/3HvNfky6HzFsLOx8cz4vdR/1c6801dde97ae3c8685553db5a4fb8ff/example-image-compressed-70-kb.jpeg'
  ];

  // Datos para el carrusel de eventos (como Crunchyroll)
  const eventos: Evento[] = [
    { 
      id: 1, 
      imagen: 'https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg', 
      titulo: 'Taller de Investigación',
      descripcion: 'Taller práctico sobre metodologías de investigación académica. Duración: 4 semanas.',
      botones: [
        {
          texto: "Ver Programa",
          imagenAsociada: "https://images.unsplash.com/photo-1544717305-2782549b5136?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
        },
        {
          texto: "Instructores",
          imagenAsociada: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
        }
      ]
    },
    { 
      id: 2, 
      imagen: 'https://wallpapers.com/images/hd/1920-x-1080-hd-1qq8r4pnn8cmcew4.jpg', 
      titulo: 'Feria del Libro',
      descripcion: 'Evento anual donde se presentan las novedades editoriales y se ofrecen descuentos especiales.',
      botones: [
        {
          texto: "Horarios",
          imagenAsociada: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
        },
        {
          texto: "Editoriales",
          imagenAsociada: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
        },
        {
          texto: "Promociones",
          imagenAsociada: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
        }
      ]
    },
    // ... otros eventos pueden seguir el mismo patrón
  ];

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [eventoSeleccionado, setEventoSeleccionado] = useState<Evento | null>(null);
  const [imagenActual, setImagenActual] = useState<string | null>(null);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Configuración para el hero banner
  const settingsHero = {
    dots: false,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    fade: true,
    arrows: false,
    pauseOnHover: false
  };

  // Configuración para el carrusel de eventos
  const settingsJustinMind = {
    infinite: true,
    speed: 500,
    slidesToShow: windowWidth > 768 ? 3 : 2,
    slidesToScroll: 1,
    arrows: true,
    dots: false,
    draggable: true,
    swipe: true,
    touchThreshold: 10,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          draggable: true,
          swipe: true,
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          draggable: true,
          swipe: true,
        }
      }
    ]
  };

  const abrirModal = (evento: Evento) => {
    setEventoSeleccionado(evento);
    setImagenActual(evento.imagen); // Establece la imagen principal inicialmente
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setEventoSeleccionado(null);
    setImagenActual(null);
  };

  const cambiarImagen = (nuevaImagen: string) => {
    setImagenActual(nuevaImagen);
  };

  return (
    <div className="inicio-container">
      {/* Hero Banner */}
      <section className="hero-biblioteca">
        <div className="contenido-hero">
          <h1>BIBLIOTECA VIRTUAL KAXÁANT</h1>
          <h2>UNIVERSIDAD POLITÉCNICA DE QUINTANA ROO</h2>
        </div>
        <Slider {...settingsHero} className="hero-slider">
          {imagenesBiblioteca.map((src, idx) => (
            <div key={idx} className="slide-biblio">
              <img src={src} alt={`Imagen biblioteca ${idx}`} />
              <div className="slide-overlay"></div>
            </div>
          ))}
        </Slider>
      </section>

      {/* Carrusel de Eventos */}
      <section className="slider-jmind">
        <Slider {...settingsJustinMind} className="slider-container">
          {eventos.map((evento) => (
            <div
              key={evento.id}
              className="slider-card"
              onClick={() => abrirModal(evento)}
            >
              <img src={evento.imagen} alt={evento.titulo} />
              <div className="slider-hover-box">
                <h3>{evento.titulo}</h3>
                <p>Haz clic para más información</p>
              </div>
            </div>
          ))}
        </Slider>
      </section>

      {/* Modal para mostrar detalles del evento */}
      {modalAbierto && eventoSeleccionado && (
        <div className="modal-overlay" onClick={cerrarModal}>
          <div className="modal-contenido" onClick={(e) => e.stopPropagation()}>
            <button className="modal-cerrar" onClick={cerrarModal}>&times;</button>

            {/* Imagen arriba */}
            <div className="modal-imagen-container">
              <img
                src={imagenActual || eventoSeleccionado.imagen}
                alt={eventoSeleccionado.titulo}
                className="modal-imagen-fullscreen"
                onClick={(e) => {
                  e.stopPropagation();
                  document.querySelector('.modal-imagen-fullscreen')?.classList.toggle('fullscreen-active');
                }}
              />
            </div>

            {/* Fondo blanco para texto + botón */}
            <div className="modal-texto">
              <h3>{eventoSeleccionado.titulo}</h3>
              <p>{eventoSeleccionado.descripcion}</p>

              {eventoSeleccionado.botones && (
                <div className="botones-imagenes">
                  {eventoSeleccionado.botones.map((boton, index) => (
                    <button
                      key={index}
                      className={`imagen-boton ${imagenActual === boton.imagenAsociada ? 'activo' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        cambiarImagen(boton.imagenAsociada);
                      }}
                    >
                      {boton.texto}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};