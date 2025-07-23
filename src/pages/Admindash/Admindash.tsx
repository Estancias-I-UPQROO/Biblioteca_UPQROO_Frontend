import { useState, type ChangeEvent } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './Admindash.css';

// --- TIPOS DE DATOS ---

type HeroImage = {
  id: number;
  url: string; // Para la previsualización
  file?: File; // El archivo real
  name: string; // Nombre del archivo
};

export type Evento = {
  id: number;
  imagen: string;
  imagenFile?: File;
  titulo: string;
  descripcion: string;
  botones: {
    texto: string;
    imagenAsociada: string;
  }[];
};

// CAMBIO: Se añade la propiedad 'imageFile' para guardar el archivo de la imagen.
export type Recurso = {
  id: number;
  title: string;
  description: string;
  image: string; // Usado para la URL (previsualización o existente)
  imageFile?: File; // El archivo de imagen subido
  siteLink: string;
  active: boolean;
};

type Categoria = {
  id: number;
  nombre: string;
  recursos: Recurso[];
};

// --- DATOS INICIALES DE EJEMPLO ---
const initialHeroImages: HeroImage[] = [
    { id: 1, url: 'https://preview.redd.it/vo9vm1fcqrp71.jpg?auto=webp&s=cb4016edf50a37cf06dbe9e975ed9410b253bff0', name: 'Imagen 1' },
    { id: 2, url: 'https://www.taisa-designer.com/wp-content/uploads/2019/09/anton-darius-thesollers-xYIuqpHD2oQ-unsplash.jpg', name: 'Imagen 2' },
    { id: 3, url: 'https://cf-assets.www.cloudflare.com/slt3lc6tev37/3HvNfky6HzFsLOx8cz4vdR/1c6801dde97ae3c8685553db5a4fb8ff/example-image-compressed-70-kb.jpeg', name: 'Imagen 3' },
];

const initialEventos: Evento[] = [
    {
      id: 1,
      imagen: 'https://preview.redd.it/vo9vm1fcqrp71.jpg?auto=webp&s=cb4016edf50a37cf06dbe9e975ed9410b253bff0',
      titulo: 'Taller de Investigación',
      descripcion: 'Taller práctico sobre metodologías de investigación académica. Duración: 4 semanas.',
      botones: [
        { texto: 'Ver Programa', imagenAsociada: '/ruta/a/imagen1.jpg' },
        { texto: 'Instructores', imagenAsociada: '/ruta/a/imagen2.jpg' },
      ],
    },
    {
      id: 2,
      imagen: 'https://preview.redd.it/vo9vm1fcqrp71.jpg?auto=webp&s=cb4016edf50a37cf06dbe9e975ed9410b253bff0',
      titulo: 'Feria del Libro',
      descripcion: 'Evento anual donde se presentan las novedades editoriales y se ofrecen descuentos especiales.',
      botones: [
        { texto: 'Horarios', imagenAsociada: '/ruta/a/imagen3.jpg' },
      ],
    },
];

export const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState<'inicio' | 'recursos'>('inicio');

  // --- ESTADOS Y LÓGICA PARA LA SECCIÓN INICIO ---
  const [heroImages, setHeroImages] = useState<HeroImage[]>(initialHeroImages);
  const [eventos, setEventos] = useState<Evento[]>(initialEventos);
  const [editingEvento, setEditingEvento] = useState<Evento | null>(null);

  const handleHeroImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const newImage: HeroImage = {
        id: Date.now(),
        url: URL.createObjectURL(file),
        file: file,
        name: file.name,
      };
      setHeroImages([...heroImages, newImage]);
    }
  };

  const handleDeleteHeroImage = (id: number) => {
    const imageToDelete = heroImages.find(img => img.id === id);
    if (imageToDelete && imageToDelete.file) {
      URL.revokeObjectURL(imageToDelete.url);
    }
    setHeroImages(heroImages.filter(img => img.id !== id));
  };

  const handleSelectEventoForEditing = (evento: Evento) => {
    setEditingEvento({ ...evento, botones: evento.botones ? [...evento.botones] : [] });
  };

  const handleUpdateEvento = () => {
    if (editingEvento) {
      setEventos(eventos.map(e => e.id === editingEvento.id ? editingEvento : e));
      setEditingEvento(null);
    }
  };

  const handleDeleteEvento = (id: number) => {
    setEventos(eventos.filter(e => e.id !== id));
    if (editingEvento && editingEvento.id === id) {
      setEditingEvento(null);
    }
  };

  const handleEventoFormChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (editingEvento) {
      setEditingEvento({ ...editingEvento, [name]: value });
    }
  };

  const handleEventoImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && editingEvento) {
      const file = e.target.files[0];
      setEditingEvento({
        ...editingEvento,
        imagen: URL.createObjectURL(file),
        imagenFile: file,
      });
    }
  };
    const addBotonToForm = () => {
        if (editingEvento) {
          const newBotones = [...(editingEvento.botones || []), { texto: '', imagenAsociada: '' }];
          setEditingEvento({ ...editingEvento, botones: newBotones });
        }
      };
    
      const removeBotonFromForm = (btnIndex: number) => {
        if (editingEvento && editingEvento.botones) {
          const filteredBotones = editingEvento.botones.filter((_, index) => index !== btnIndex);
          setEditingEvento({ ...editingEvento, botones: filteredBotones });
        }
      };
  const settingsHero = { dots: true, infinite: true, speed: 500, slidesToShow: 1, slidesToScroll: 1, autoplay: true, fade: true, arrows: false };
  const settingsEvents = { dots: true, infinite: false, speed: 500, slidesToShow: 3, slidesToScroll: 1, arrows: true, responsive: [{ breakpoint: 768, settings: { slidesToShow: 1 } }] };

  // --- ESTADOS Y LÓGICA PARA RECURSOS ELECTRÓNICOS ---
  const [categorias, setCategorias] = useState<Categoria[]>([
    { id: 1, nombre: 'Base de datos', recursos: [{ id: 1, title: 'Chicago Journal', description: 'Base de datos académica con publicaciones científicas', image: '/Chicago_Journal.png', siteLink: 'https://www.journals.uchicago.edu/', active: true }] },
    { id: 2, nombre: 'Bibliotecas digitales', recursos: [{ id: 1, title: 'Biblioteca Digital Mundial', description: 'Recursos culturales de todo el mundo', image: '/digital-library.jpg', siteLink: 'https://www.wdl.org/', active: true }] },
    { id: 3, nombre: 'Revistas electrónicas', recursos: [{ id: 1, title: 'Nature Journal', description: 'Revista científica de alto impacto', image: '/nature-journal.jpg', siteLink: 'https://www.nature.com/', active: true }] },
    { id: 4, nombre: 'E-books', recursos: [{ id: 1, title: 'Project Gutenberg', description: 'Libros electrónicos gratuitos', image: '/gutenberg.jpg', siteLink: 'https://www.gutenberg.org/', active: true }] },
    { id: 5, nombre: 'Diccionarios', recursos: [{ id: 1, title: 'RAE Diccionario', description: 'Diccionario de la Real Academia Española', image: '/rae.jpg', siteLink: 'https://dle.rae.es/', active: true }] },
    { id: 6, nombre: 'Normas y guías', recursos: [{ id: 1, title: 'ISO Standards', description: 'Normas internacionales ISO', image: '/iso-standards.jpg', siteLink: 'https://www.iso.org/', active: true }] },
  ]);

  const [activeCategory, setActiveCategory] = useState(1);
  
  // CAMBIO: Se define un tipo más específico para el estado 'newResource'.
  type NewResourceState = Omit<Recurso, 'id' | 'active'>;
  
  const [newResource, setNewResource] = useState<NewResourceState>({
    title: '',
    description: '',
    image: '',
    siteLink: '',
    imageFile: undefined,
  });

  const [editingResource, setEditingResource] = useState<Recurso | null>(null);

  // CAMBIO: Nueva función para manejar la carga de la imagen del recurso.
  const handleResourceImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const previewUrl = URL.createObjectURL(file);

      if (editingResource) {
        // Libera la URL anterior si era un objeto blob para evitar fugas de memoria
        if (editingResource.image.startsWith('blob:')) {
          URL.revokeObjectURL(editingResource.image);
        }
        setEditingResource({ ...editingResource, image: previewUrl, imageFile: file });
      } else {
        if (newResource.image.startsWith('blob:')) {
          URL.revokeObjectURL(newResource.image);
        }
        setNewResource({ ...newResource, image: previewUrl, imageFile: file });
      }
    }
  };

  const handleAddResource = () => {
    if (newResource.title.trim() && newResource.siteLink.trim()) {
      setCategorias(categorias.map(cat =>
        cat.id === activeCategory
          ? {
              ...cat,
              recursos: [
                ...cat.recursos,
                {
                  ...newResource,
                  id: Math.max(0, ...cat.recursos.map(r => r.id)) + 1,
                  active: true
                }
              ]
            }
          : cat
      ));
      // CAMBIO: Se resetea el estado incluyendo 'imageFile'.
      setNewResource({ title: '', description: '', image: '', siteLink: '', imageFile: undefined });
    }
  };

  const handleUpdateResource = () => {
    if (editingResource) {
      setCategorias(categorias.map(cat =>
        cat.id === activeCategory
          ? {
              ...cat,
              recursos: cat.recursos.map(res =>
                res.id === editingResource.id ? { ...editingResource } : res
              )
            }
          : cat
      ));
      setEditingResource(null);
    }
  };

  const handleDeleteResource = (id: number) => {
    setCategorias(categorias.map(cat => {
      if (cat.id === activeCategory) {
        const resourceToDelete = cat.recursos.find(res => res.id === id);
        // CAMBIO: Si la imagen era local, se revoca su URL para liberar memoria.
        if (resourceToDelete && resourceToDelete.image.startsWith('blob:')) {
          URL.revokeObjectURL(resourceToDelete.image);
        }
        return {
          ...cat,
          recursos: cat.recursos.filter(res => res.id !== id)
        };
      }
      return cat;
    }));
  };

  return (
    <div className="admin-panel">
        <div className="admin-sidebar">
            <h2>Panel de Administración</h2>
            <nav>
                <button className={activeTab === 'inicio' ? 'active' : ''} onClick={() => setActiveTab('inicio')}>Inicio</button>
                <button className={activeTab === 'recursos' ? 'active' : ''} onClick={() => setActiveTab('recursos')}>Recursos Electrónicos</button>
            </nav>
        </div>
        <div className="admin-content">
            {activeTab === 'inicio' ? (
                <div className="inicio-admin-container">
                    <h1>Administrar Página de Inicio</h1>
                    <div className="admin-section">
                        <h2>Slider Hero</h2>
                        <div className="resource-form">
                            <h3>Añadir Nueva Imagen</h3>
                            <label htmlFor="hero-image-upload" className="file-upload-label">Seleccionar Archivo...</label>
                            <input id="hero-image-upload" type="file" accept="image/*" onChange={handleHeroImageChange} style={{ display: 'none' }}/>
                        </div>
                        <div className="hero-images-list">
                            {heroImages.map(image => (
                                <div key={image.id} className="hero-image-item">
                                    <img src={image.url} alt={image.name} />
                                    <span>{image.name}</span>
                                    <button onClick={() => handleDeleteHeroImage(image.id)}>Eliminar</button>
                                </div>
                            ))}
                        </div>
                        <div className="preview-section">
                            <h3>Vista Previa del Slider</h3>
                            <div className="hero-preview-wrapper">
                                <Slider {...settingsHero}>
                                    {heroImages.map((image) => (
                                        <div key={image.id}>
                                            <img src={image.url} alt="Vista previa" className="hero-preview-image"/>
                                        </div>
                                    ))}
                                </Slider>
                            </div>
                        </div>
                    </div>
                    <div className="admin-section">
                        <h2>Eventos</h2>
                        <div className="eventos-grid">
                            {eventos.map((evento) => (
                                <div key={evento.id} className="evento-card" onClick={() => handleSelectEventoForEditing(evento)}>
                                    <img src={evento.imagen} alt={evento.titulo} />
                                    <h4>{evento.titulo}</h4>
                                    <div className="card-actions"><button>Editar</button></div>
                                </div>
                            ))}
                        </div>
                        {editingEvento && (
                            <div className="resource-form">
                                <h3>Editando Evento: {editingEvento.titulo}</h3>
                                <input name="titulo" type="text" placeholder="Título del evento" value={editingEvento.titulo} onChange={handleEventoFormChange} />
                                <textarea name="descripcion" placeholder="Descripción" value={editingEvento.descripcion} onChange={handleEventoFormChange} />
                                <h4>Imagen Principal del Evento</h4>
                                <label htmlFor="evento-image-upload" className="file-upload-label">Cambiar Imagen...</label>
                                <input id="evento-image-upload" type="file" accept="image/*" onChange={handleEventoImageChange} style={{ display: 'none' }} />
                                {editingEvento.imagen && <img src={editingEvento.imagen} alt="Previsualización" className="form-image-preview" />}
                                <h4>Botones del Evento</h4>
                                {editingEvento.botones?.map((btn, index) => (
                                    <div key={index} className="boton-item">
                                        <input type="text" placeholder="Texto del botón" value={btn.texto} onChange={(e) => {
                                            const updated = [...(editingEvento.botones ?? [])];
                                            updated[index].texto = e.target.value;
                                            setEditingEvento({ ...editingEvento, botones: updated });
                                        }}/>
                                        <label htmlFor={`boton-image-${index}`} className="file-upload-label">Cambiar Imagen Asociada...</label>
                                        <input id={`boton-image-${index}`} type="file" accept="image/*" onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                const reader = new FileReader();
                                                reader.onload = () => {
                                                    const updated = [...(editingEvento.botones ?? [])];
                                                    updated[index].imagenAsociada = reader.result as string;
                                                    setEditingEvento({ ...editingEvento, botones: updated });
                                                };
                                                reader.readAsDataURL(file);
                                            }
                                        }} style={{ display: 'none' }} />
                                        {btn.imagenAsociada && <img src={btn.imagenAsociada} alt="Botón" className="form-image-preview-small" />}
                                        <button onClick={() => removeBotonFromForm(index)}>Eliminar</button>
                                    </div>
                                ))}
                                <div className="form-actions">
                                    <button onClick={addBotonToForm}>Agregar Botón</button>
                                    <button onClick={handleUpdateEvento}>Guardar Cambios</button>
                                    <button onClick={() => setEditingEvento(null)} className="cancel">Cancelar</button>
                                    <button onClick={() => handleDeleteEvento(editingEvento.id)} className="delete">Eliminar Evento</button>
                                </div>
                            </div>
                        )}
                        <div className="preview-section">
                            <h3>Vista Previa del Carrusel de Eventos</h3>
                            <div className="event-preview-wrapper">
                                <Slider {...settingsEvents}>
                                    {eventos.map((evento) => (
                                        <div key={evento.id} className="event-preview-card">
                                            <img src={evento.imagen} alt={evento.titulo} />
                                            <div className="slider-hover-box-preview">
                                                <h3>{evento.titulo}</h3>
                                                <p>Haz clic para más información</p>
                                            </div>
                                        </div>
                                    ))}
                                </Slider>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="recursos-admin">
                    <div className="categories-sidebar">
                        {categorias.map(categoria => (
                            <button key={categoria.id} className={activeCategory === categoria.id ? 'active' : ''} onClick={() => {
                                setActiveCategory(categoria.id);
                                setEditingResource(null);
                            }}>
                                {categoria.nombre}
                            </button>
                        ))}
                    </div>
                    <div className="recursos-content">
                        <h2>Administrar {categorias.find(c => c.id === activeCategory)?.nombre}</h2>
                        <div className="recursos-grid">
                            {categorias.find(c => c.id === activeCategory)?.recursos.map(recurso => (
                                <div key={recurso.id} className="resource-item">
                                    <div className="recursos-card">
                                        <div className="recursos-card-image-container">
                                            <img src={recurso.image} alt={recurso.title} className="recursos-card-image" onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder-recursos.jpg'; }}/>
                                            <div className="recursos-card-title-overlay">
                                                <h3 className="recursos-card-title">{recurso.title}</h3>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="resource-controls">
                                        <label>
                                            <input type="checkbox" checked={recurso.active} onChange={(e) => {
                                                setCategorias(categorias.map(cat => cat.id === activeCategory ? { ...cat, recursos: cat.recursos.map(res => res.id === recurso.id ? {...res, active: e.target.checked} : res) } : cat ));
                                            }}/>
                                            Activo
                                        </label>
                                        <button onClick={() => setEditingResource(recurso)}>Editar</button>
                                        <button onClick={() => handleDeleteResource(recurso.id)}>Eliminar</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="resource-form">
                            <h3>{editingResource ? 'Editar Recurso' : 'Añadir Nuevo Recurso'}</h3>
                            <input type="text" placeholder="Título" value={editingResource ? editingResource.title : newResource.title} onChange={(e) => editingResource ? setEditingResource({...editingResource, title: e.target.value}) : setNewResource({...newResource, title: e.target.value}) }/>
                            <textarea placeholder="Descripción" value={editingResource ? editingResource.description : newResource.description} onChange={(e) => editingResource ? setEditingResource({...editingResource, description: e.target.value}) : setNewResource({...newResource, description: e.target.value})}/>
                            
                            {/* CAMBIO: Se reemplaza el input de texto por un input de tipo 'file' con una label estilizada. */}
                            <div className="form-image-upload-container">
                                <label htmlFor="resource-image-upload" className="file-upload-label">
                                    {editingResource ? 'Cambiar Imagen...' : 'Seleccionar Imagen...'}
                                </label>
                                <input id="resource-image-upload" type="file" accept="image/*" onChange={handleResourceImageChange} style={{ display: 'none' }}/>
                                
                                {/* Previsualización de la imagen */}
                                {editingResource?.image && <img src={editingResource.image} alt="Previsualización" className="form-image-preview" />}
                                {!editingResource && newResource.image && <img src={newResource.image} alt="Previsualización" className="form-image-preview" />}
                            </div>

                            <input type="text" placeholder="Enlace al recurso" value={editingResource ? editingResource.siteLink : newResource.siteLink} onChange={(e) => editingResource ? setEditingResource({...editingResource, siteLink: e.target.value}) : setNewResource({...newResource, siteLink: e.target.value})}/>
                            
                            {editingResource ? (
                                <div className="form-actions">
                                    <button onClick={handleUpdateResource}>Actualizar</button>
                                    <button onClick={() => setEditingResource(null)}>Cancelar</button>
                                </div>
                            ) : (
                                <button onClick={handleAddResource}>Guardar Recurso</button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    </div>
  );
};