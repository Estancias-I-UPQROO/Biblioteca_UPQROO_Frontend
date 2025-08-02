import { useEffect, useState } from 'react';
import Slider from 'react-slick';
import type { Settings } from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './styles.css';
import axios from 'axios';
const BASE_URL_S = import.meta.env.VITE_API_URL_Silder;
const BASE_URL_E = import.meta.env.VITE_API_URL_Eventos;

interface SubEvento {
  ID_SubEvento: string;
  ID_Evento: string;
  Titulo: string;
  Imagen_URL: string;
  createdAt: string;
  updatedAt: string;
}

interface Evento {
  ID_Evento: string;
  Titulo: string;
  Descripcion: string;
  Imagen_URL: string;
  Activo: boolean;
  createdAt: string;
  updatedAt: string;
  SubEventos?: SubEvento[]; // opcional para contemplar que no siempre existan
}

// Hero slider
interface Hero {
  ID_Slider_Hero: string;
  Imagen_URL: string;
}

export const InicioPage = () => {
  const [imagenesHero, setImagenesHero] = useState<Hero[]>([]);
  const [inicioEventos, setInicioEventos] = useState<Evento[]>([]);

 useEffect(() => {
    const obtenerImagenesHero = async () => {
      try {
        const { data } = await axios.get(`${BASE_URL_S}/get-sliders`);
        setImagenesHero(data); // Asignas directamente
      } catch (error) {
        console.error('Error cargando imágenes del hero:', error);
        setImagenesHero([]);
      }
    };

    obtenerImagenesHero();
  }, []);


   useEffect(() => {
    const obtenerEventos = async () => {
      try {
        const { data } = await axios.get(`${BASE_URL_E}/get-eventos`);
        setInicioEventos(data);
      } catch (error) {
        console.error('Error cargando eventos:', error);
        setInicioEventos([]);
      }
    };

    obtenerEventos();
  }, []);


  const [modalAbierto, setModalAbierto] = useState(false);
  const [eventoSeleccionado, setEventoSeleccionado] = useState<Evento | null>(null);
  const [imagenActual, setImagenActual] = useState<string | null>(null);

  const settingsHero: Settings = {
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

  const settingsJustinMind: Settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: true,
    lazyLoad: 'ondemand',
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 2 }
      },
      {
        breakpoint: 600,
        settings: { slidesToShow: 1 }
      }
    ]
  };

  const abrirModal = (evento: Evento) => {
    setEventoSeleccionado(evento);
    setImagenActual(evento.Imagen_URL);
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


        {/* Slider de imágenes del hero */}
        <Slider {...settingsHero} className="hero-slider">
          {imagenesHero.map((src, idx) => (
            <div key={idx} className="slide-biblio">
              <img
                src={`${import.meta.env.VITE_API_URL}${src.Imagen_URL}`}
                alt={`Imagen biblioteca ${idx}`}
              />
              <div className="slide-overlay"></div>
            </div>
          ))}
        </Slider>
      </section>


      {/* Carrusel de Eventos */}
      <section className="slider-jmind">
        <Slider {...settingsJustinMind} className="slider-container">
          {inicioEventos.map((evento) => (
            <div
              key={evento.ID_Evento}
              className="slider-card"
              onClick={() => abrirModal(evento)}>
              <img 
                src={`${import.meta.env.VITE_API_URL}${evento.Imagen_URL}`} 
                alt={evento.Titulo}  
              />
              <div className="slider-hover-box">
                <h3>{evento.Titulo}</h3>
                <p>Haz clic para más información</p>
              </div>
            </div>
          ))}
        </Slider>
      </section>

      {/* Modal */}
      {modalAbierto && eventoSeleccionado && (
        <div className="modal-overlay" onClick={cerrarModal}>
          <div className="modal-contenido" onClick={e => e.stopPropagation()}>
            <button className="modal-cerrar" onClick={cerrarModal}>&times;</button>
            <div className="modal-imagen-container">
           <img
              src={imagenActual?.startsWith('http') ? imagenActual : `${import.meta.env.VITE_API_URL}${imagenActual || eventoSeleccionado.Imagen_URL}`}
              alt={eventoSeleccionado.Titulo}
              className="modal-imagen-fullscreen"
            />

            </div>
            <div className="modal-texto">
              <h3>{eventoSeleccionado.Titulo}</h3>
              <p>{eventoSeleccionado.Descripcion}</p>
              {eventoSeleccionado.SubEventos && eventoSeleccionado.SubEventos.length > 0 && (
                <div className="botones-imagenes">
                  {eventoSeleccionado.SubEventos.map((subevento) => (
                    <button
                      key={subevento.ID_SubEvento}
                      className={`imagen-boton ${imagenActual === subevento.Imagen_URL ? 'activo' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        cambiarImagen(`${import.meta.env.VITE_API_URL}${subevento.Imagen_URL}`)
                      }}
                    >
                      {subevento.Titulo}
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