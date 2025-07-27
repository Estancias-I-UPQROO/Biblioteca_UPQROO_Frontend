import { useState } from 'react'; // Eliminamos useEffect porque ya no se necesita
import Slider from 'react-slick';
import type { Settings } from 'react-slick'; 
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './styles.css';

// La interfaz Evento se mantiene igual
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
  // Te recomiendo optimizar también estas imágenes del hero banner.
  const imagenesBiblioteca = [
    'https://i.redd.it/1920-x-1080-collection-of-my-fav-wallpapers-part-1-v0-rie6s4t6yza81.png?width=1920&format=png&auto=webp&s=bb7cf5a4627680dd360c716817df0f4911f54740',
    'https://wallpapers.com/images/hd/1920-x-1080-nature-desktop-zt65xx09vu42vnfu.jpg',
    'https://wallpapers.com/images/hd/1920-x-1080-nebula-havw620hbw6nokls.jpg'
  ];

  // IMPORTANTE: Usa imágenes optimizadas aquí para mayor velocidad
  const eventos: Evento[] = [
    {
      id: 1,
      imagen: 'https://preview.redd.it/vo9vm1fcqrp71.jpg?auto=webp&s=cb4016edf50a37cf06dbe9e975ed9410b253bff0', // Reemplaza esta URL
      titulo: 'Taller de Investigación',
      descripcion: 'Taller práctico sobre metodologías de investigación académica. Duración: 4 semanas.',
      botones: [
        {
          texto: "Ver Programa",
          imagenAsociada: "URL_DE_TU_IMAGEN_OPTIMIZADA_1A.jpg" // Reemplaza esta URL
        },
        {
          texto: "Instructores",
          imagenAsociada: "URL_DE_TU_IMAGEN_OPTIMIZADA_1B.jpg" // Reemplaza esta URL
        }
      ]
    },
    {
      id: 2,
      imagen: 'https://preview.redd.it/vo9vm1fcqrp71.jpg?auto=webp&s=cb4016edf50a37cf06dbe9e975ed9410b253bff0', // Reemplaza esta URL
      titulo: 'Feria del Libro',
      descripcion: 'Evento anual donde se presentan las novedades editoriales y se ofrecen descuentos especiales.',
      botones: [
        {
          texto: "Horarios",
          imagenAsociada: "URL_DE_TU_IMAGEN_OPTIMIZADA_2A.jpg" // Reemplaza
        },
        {
          texto: "Editoriales",
          imagenAsociada: "URL_DE_TU_IMAGEN_OPTIMIZADA_2B.jpg" // Reemplaza
        },
        {
          texto: "Promociones",
          imagenAsociada: "URL_DE_TU_IMAGEN_OPTIMIZADA_2C.jpg" // Reemplaza
        }
      ]
    },
    {
      id: 2,
      imagen: 'https://preview.redd.it/vo9vm1fcqrp71.jpg?auto=webp&s=cb4016edf50a37cf06dbe9e975ed9410b253bff0', // Reemplaza esta URL
      titulo: 'Feria del Libro',
      descripcion: 'Evento anual donde se presentan las novedades editoriales y se ofrecen descuentos especiales.',
      botones: [
        {
          texto: "Horarios",
          imagenAsociada: "URL_DE_TU_IMAGEN_OPTIMIZADA_2A.jpg" // Reemplaza
        },
        {
          texto: "Editoriales",
          imagenAsociada: "URL_DE_TU_IMAGEN_OPTIMIZADA_2B.jpg" // Reemplaza
        },
        {
          texto: "Promociones",
          imagenAsociada: "URL_DE_TU_IMAGEN_OPTIMIZADA_2C.jpg" // Reemplaza
        }
      ]
    },
  ];

  // ❌ SE ELIMINA EL ESTADO windowWidth Y SU useEffect.
  // const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  // useEffect(() => { ... });

  const [modalAbierto, setModalAbierto] = useState(false);
  const [eventoSeleccionado, setEventoSeleccionado] = useState<Evento | null>(null);
  const [imagenActual, setImagenActual] = useState<string | null>(null);


  // Configuración para el hero banner (sin cambios)
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

  // ✅ CONFIGURACIÓN CORREGIDA Y MEJORADA PARA EL CARRUSEL
   const settingsJustinMind: Settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        arrows: true,
        lazyLoad: 'ondemand', // Ahora TypeScript entiende que este valor es correcto
        responsive: [
          {
            breakpoint: 1024,
            settings: {
              slidesToShow: 2,
            }
          },
          {
            breakpoint: 600,
            settings: {
              slidesToShow: 1,
            }
          }
        ]
    };


  const abrirModal = (evento: Evento) => {
    setEventoSeleccionado(evento);
    setImagenActual(evento.imagen);
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

      {/* El Modal se queda igual */}
      {modalAbierto && eventoSeleccionado && (
        <div className="modal-overlay" onClick={cerrarModal}>
          <div className="modal-contenido" onClick={(e) => e.stopPropagation()}>
            <button className="modal-cerrar" onClick={cerrarModal}>&times;</button>
            <div className="modal-imagen-container">
              <img
                src={imagenActual || eventoSeleccionado.imagen}
                alt={eventoSeleccionado.titulo}
                className="modal-imagen-fullscreen"
              />
            </div>
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