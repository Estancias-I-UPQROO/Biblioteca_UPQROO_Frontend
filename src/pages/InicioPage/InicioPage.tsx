import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // NUEVO: Importa useNavigate para la redirección
import Slider from 'react-slick';
import type { Settings } from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './styles.css';
import axios from 'axios';
import Acceso_Biblioteca from '../../../public/Como_acceder.png'; 
import Novedades from '../../../public/novedades.jpeg'; 
import Pearson from '../../../public/Pearson.jpeg'; 

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
  SubEventos?: SubEvento[];
}

interface Hero {
  ID_Slider_Hero: string;
  Imagen_URL: string;
}

export const InicioPage = () => {
  const [imagenesHero, setImagenesHero] = useState<Hero[]>([]);
  const [inicioEventos, setInicioEventos] = useState<Evento[]>([]);
  const navigate = useNavigate(); // NUEVO: Inicializa el hook de navegación

  useEffect(() => {
    const obtenerImagenesHero = async () => {
      try {
        const { data } = await axios.get(`${BASE_URL_S}/get-sliders`);
        setImagenesHero(data);
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

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
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

  const totalItems = 3 + inicioEventos.length;

  const slidesToShowValue = Math.min(3, totalItems);

  const settingsJustinMind: Settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: slidesToShowValue,
    slidesToScroll: 1,
    arrows: true,
    lazyLoad: 'ondemand',
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: Math.min(2, totalItems) }
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
        
         <div
            className="slider-card"
            onClick={() => navigate('/ayuda')} // Corregido a minúsculas para coincidir con la ruta
          >
            <img 
              src={Acceso_Biblioteca} 
              alt="Cómo usar la Biblioteca"
            />
            <div className="slider-hover-box">
              <h3>¿Cómo usar la Biblioteca?</h3>
              <p>Haz clic para ir a la página de ayuda.</p>
            </div>
          </div>

          <div
            className="slider-card"
            onClick={() => navigate('/recursos-electronicos/e30f1e48-c61e-4635-a1f3-ab66cd108500')}
          >
            <img 
              src={Novedades} 
              alt="Novedades"
            />
            <div className="slider-hover-box">
              <h3>Novedades</h3>
              <p>Haz clic para explorar las novedades.</p>
            </div>
          
          </div>
          <div
            className="slider-card"
            onClick={() => window.open('https://login.vitalsource.com/?context=bookshelf&redirect_uri=https%3A%2F%2Fupqroo.vitalsource.com%2Fhome%2Fexplore%3Fcontext_token%3Df3022c70-5522-013e-16a2-560b2d3411be%26request_token%3DeyJhbGciOiJkaXIiLCJlbmMiOiJBMTI4Q0JDLUhTMjU2In0..Q0QR74wMd2NE6snlQTcwpA.RmPe5z3vW7NYZTomO2EOv6X-INzNQpvTF460KLnYPSWK7ei4Ay-7pr2cSBqFfS71gQFhJiaChbfZMYU8D6awLhnjaFfgctYijChonbd50QkQF5SWQy6iISXrwTEX1NBR1bXlXzzT1cKaGwSMC_1H6cB2263s1NMx-3FIU0HW8_Y.2uTtGUchyL_8d7yE-cCtPg&brand=upqroo.vitalsource.com&method=universal&auth_host=upqroo.vitalsource.com&auth_protocol=https%3A', '_blank')}
          >
            <img 
              src={Pearson} 
              alt="Pearson"
            />
            <div className="slider-hover-box">
              <h3>Pearson</h3>
              <p>Haz clic para explorar Pearson.</p>
            </div>
          
          </div>

          {/* Cards dinámicas que vienen del backend */}
          {inicioEventos.map((evento) => (
            <div
              key={evento.ID_Evento}
              className="slider-card"
              onClick={() => abrirModal(evento)}
            >
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

      {/* Modal (sin cambios) */}
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