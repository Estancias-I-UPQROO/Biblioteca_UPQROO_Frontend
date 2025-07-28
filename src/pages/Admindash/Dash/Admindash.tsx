import { useState, type ChangeEvent, useRef, useEffect } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './Admindash.css';
import { useResourceForm } from '../../../hooks/useResourceForm';
import axios from 'axios';

// Configuración de axios para la API
const api = axios.create({
  baseURL: 'http://localhost:4000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// --- TIPOS DE DATOS ---
type HeroImage = {
  id: number;
  url: string;
  file?: File;
  name: string;
};

export type Evento = {
  id: number;
  imagen: string;
  imagenFile?: File;
  titulo: string;
  activo: boolean;
  descripcion: string;
  botones: {
    ID_SubEvento?: string;
    texto: string;
    imagenAsociada: string | File;
  }[];
};

export type Recurso = {
  id: string;
  title: string;
  description: string;
  image: string;
  imageFile?: File;
  siteLink: string;
  active: boolean;
};

type Categoria = {
  id: string;
  nombre: string;
  recursos: Recurso[];
  active: boolean;
};

export const AdminPanel = () => {
  const formRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<'inicio' | 'recursos'>('inicio');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // --- ESTADOS PARA LA SECCIÓN INICIO (MANTENIDOS SIN CAMBIOS) ---
  const [heroImages, setHeroImages] = useState<HeroImage[]>([]);
  const [eventos, setEventos] = useState<Evento[]>([]);

  const [editingEvento, setEditingEvento] = useState<Evento | null>(null);
  const [addingEvento, setAddingEvento] = useState<Partial<Evento> | null>(null);

  // --- ESTADOS PARA RECURSOS ELECTRÓNICOS ---
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [newImageFile, setNewImageFile] = useState<File | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [editingResource, setEditingResource] = useState<Recurso | null>(null);
  const [showInactiveCategories, setShowInactiveCategories] = useState(false);

  // Hook para el formulario de recursos
  const {
    register,
    handleSubmit,
    errors,
    reset,
    setValue,
    watch,
  } = useResourceForm();

  const watchedImage = watch('image');

  // Obtener todas las categorías
  const fetchCategorias = async () => {
    try {
      setLoading(true);
      const response = await api.get('/categorias-recursos-electronicos/get-categorias');

      const categoriasData = response.data.map((cat: any) => ({
        id: cat.ID_Categoria_Recursos_Electronicos,
        nombre: cat.Nombre,
        active: cat.Activo,
        recursos: []
      }));

      setCategorias(categoriasData);

      // Establecer la primera categoría activa como activa por defecto
      const primeraCategoriaActiva = categoriasData.find((cat: any) => cat.active);
      if (primeraCategoriaActiva) {
        setActiveCategory(primeraCategoriaActiva.id);
      }
    } catch (err) {
      setError('Error al cargar las categorías');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Obtener recursos de una categoría específica
  const fetchRecursos = async (categoriaId: string) => {
    try {
      setLoading(true);
      const response = await api.get(`/recursos-electronicos/get-recursos/${categoriaId}`);

      setCategorias(prev => prev.map(cat =>
        cat.id === categoriaId
          ? {
            ...cat,
            recursos: response.data.map((rel: any) => ({
              id: rel.Recursos_Electronicos.ID_Recurso_Electronico,
              title: rel.Recursos_Electronicos.Nombre,
              description: rel.Recursos_Electronicos.Descripcion,
              image: `http://localhost:4000${rel.Recursos_Electronicos.Imagen_URL}`,
              siteLink: rel.Recursos_Electronicos.Enlace_Pagina,
              active: rel.Recursos_Electronicos.Activo
            }))
          }
          : cat
      ));
    } catch (err) {
      setError('Error al cargar los recursos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };


  const fetchEventos = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/eventos/get-eventos');
      const data = response.data.map((e: any) => ({
        id: e.ID_Evento,
        imagen: e.Imagen_URL,
        titulo: e.Titulo,
        activo: e.Activo,
        descripcion: e.Descripcion,
        botones: (e.SubEventos || []).map((se: any) => ({
          texto: se.Titulo,
          imagenAsociada: se.Imagen_URL
        }))
      }));
      setEventos(data);
    } catch (err) {
      console.error("Error al obtener eventos:", err);
    }
  };

  useEffect(() => {
    if (activeTab === 'inicio') {
      fetchSliderImages();
      fetchEventos();
    }
  }, [activeTab]);

  // Cargar categorías al cambiar a la pestaña de recursos
  useEffect(() => {
    if (activeTab === 'recursos') {
      fetchCategorias();
    }
  }, [activeTab, showInactiveCategories]);

  // Cargar recursos cuando cambia la categoría activa
  useEffect(() => {
    if (activeTab === 'recursos' && activeCategory) {
      fetchRecursos(activeCategory);
    }
  }, [activeTab, activeCategory]);

  // Effect para poblar el formulario cuando se edita un recurso
  useEffect(() => {
    if (editingResource) {
      reset({
        title: editingResource.title,
        description: editingResource.description,
        image: editingResource.image,
        siteLink: editingResource.siteLink,
      });
    } else {
      reset({
        title: '',
        description: '',
        image: '',
        siteLink: '',
      });
    }
  }, [editingResource, reset]);

  const subirEvento = async (evento: Partial<Evento>) => {
    const token = localStorage.getItem('token');
    const formData = new FormData();

    formData.append('Titulo', evento.titulo!);
    formData.append('Descripcion', evento.descripcion!);
    if (evento.imagenFile) formData.append('imagenEvento', evento.imagenFile);

    const subeventosData = (evento.botones || []).map(b => ({ Titulo: b.texto }));
    formData.append('subeventos', JSON.stringify(subeventosData));
    (evento.botones || []).forEach((b) => {
      const blob = b.imagenAsociada instanceof File ? b.imagenAsociada : null;
      if (blob) formData.append('imagenesSubEventos', blob);
    });

    try {
      await axios.post(
        'http://localhost:4000/api/eventos/create-evento',
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      fetchEventos(); // refresca
      setAddingEvento(null);
    } catch (err) {
      console.error("Error al crear evento:", err);
    }
  };


const fetchSliderImages = async () => {
  try {
    const response = await axios.get('http://localhost:4000/api/slider-hero/get-sliders');
    const data = response.data.map((item: any) => ({
      id: item.ID_Slider_Hero,
      url: `http://localhost:4000${item.Imagen_URL}`, // <- Aquí se completa la URL
      name: item.Imagen_URL.split('/').pop() || 'Imagen'
    }));
    setHeroImages(data);
  } catch (err) {
    console.error("Error al obtener imágenes del slider:", err);
  }
};

  // --- HANDLERS PARA LA SECCIÓN INICIO (MANTENIDOS SIN CAMBIOS) ---
  const handleHeroImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      const formData = new FormData();
      formData.append('imagen', file);

      try {
        const token = localStorage.getItem('token');
        await axios.post(
          'http://localhost:4000/api/slider-hero/add-slider',
          formData,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'multipart/form-data'
            }
          }
        );

        // Recargar lista desde el backend (mejor que manejar local)
        fetchSliderImages();
      } catch (err) {
        console.error("Error al subir imagen del slider:", err);
      }
    }
  };

  const handleDeleteHeroImage = async (id: number) => {

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:4000/api/slider-hero/delete-slider/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      fetchSliderImages();
    } catch (err) {
      console.error("Error al eliminar la imagen:", err);
    }
  };

  const handleSelectEventoForEditing = (evento: Evento) => {
    setAddingEvento(null);
    setEditingEvento({ ...evento, botones: evento.botones ? [...evento.botones] : [] });
  };

  const handleShowAddEventoForm = () => {
    setEditingEvento(null);
    setAddingEvento({
      titulo: '',
      descripcion: '',
      imagen: '',
      botones: [],
    });
  };

  const handleCreateEvento = () => {
    if (addingEvento && addingEvento.titulo && addingEvento.descripcion && addingEvento.imagenFile) {
      subirEvento(addingEvento);
    } else {
      console.warn('Evento incompleto');
    }
  };

  const actualizarEvento = async (evento: Evento) => {
    const token = localStorage.getItem('token');
    const formData = new FormData();

    formData.append('Titulo', evento.titulo);
    formData.append('Descripcion', evento.descripcion);

    const subeventosData: any[] = [];
    const imagenesParaSubeventos: File[] = [];

    evento.botones.forEach((boton, index) => {
      const isNuevo = !boton.ID_SubEvento;

      subeventosData.push({
        Titulo: boton.texto,
        ...(boton.ID_SubEvento ? { ID_SubEvento: boton.ID_SubEvento } : {})
      });

      // 🧠 SOLO SI es nuevo O tiene una imagen nueva, la añadimos
      if (boton.imagenAsociada instanceof File) {
        imagenesParaSubeventos.push(boton.imagenAsociada);
      } else if (isNuevo) {
        // 🔥 Error crítico: nuevo subevento sin imagen => backend no podrá crearlo correctamente
        console.error('Subevento nuevo sin imagen. Este se ignorará por el backend.');
      }
    });

    // Agregar al form en orden
    for (const img of imagenesParaSubeventos) {
      formData.append('imagenesSubEventos', img);
    }

    formData.append('subeventos', JSON.stringify(subeventosData));

    if (evento.imagenFile) {
      formData.append('imagenEvento', evento.imagenFile);
    }

    try {
      await axios.put(
        `http://localhost:4000/api/eventos/update-evento/${evento.id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      fetchEventos();
      setEditingEvento(null);
    } catch (err) {
      console.error("Error al actualizar evento:", err);
    }
  };

  const handleUpdateEvento = () => {
    if (editingEvento) {
      actualizarEvento(editingEvento);
    }
  };

  const handleDeleteEvento = async (id: number) => {
    console.log(id);

    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `http://localhost:4000/api/eventos/delete-evento/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setEventos(prevEventos =>
        prevEventos.map(ev =>
          ev.id === id ? { ...ev, activo: !ev.activo } : ev
        )
      );

      // También actualizar el formulario en edición
      if (editingEvento && editingEvento.id === id) {
        setEditingEvento({ ...editingEvento, activo: !editingEvento.activo });
      }
    } catch (err) {
      console.error("Error al eliminar evento:", err);
    }
  };

  const handleEventoFormChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (editingEvento) {
      setEditingEvento({ ...editingEvento, [name]: value });
    } else if (addingEvento) {
      setAddingEvento({ ...addingEvento, [name]: value });
    }
  };

  const handleEventoImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const imageUrl = URL.createObjectURL(file);

      if (editingEvento) {
        setEditingEvento({
          ...editingEvento,
          imagen: imageUrl,
          imagenFile: file,
        });
      } else if (addingEvento) {
        setAddingEvento({
          ...addingEvento,
          imagen: imageUrl,
          imagenFile: file,
        });
      }
    }
  };

  const addBotonToForm = () => {
    const nuevoBoton = { texto: '', imagenAsociada: '' };
    if (editingEvento) {
      const newBotones = [...(editingEvento.botones || []), nuevoBoton];
      setEditingEvento({ ...editingEvento, botones: newBotones });
    } else if (addingEvento) {
      const newBotones = [...(addingEvento.botones || []), nuevoBoton];
      setAddingEvento({ ...addingEvento, botones: newBotones });
    }
  };

  const removeBotonFromForm = (btnIndex: number) => {
    if (editingEvento && editingEvento.botones) {
      const filteredBotones = editingEvento.botones.filter((_, index) => index !== btnIndex);
      setEditingEvento({ ...editingEvento, botones: filteredBotones });
    } else if (addingEvento && addingEvento.botones) {
      const filteredBotones = addingEvento.botones.filter((_, index) => index !== btnIndex);
      setAddingEvento({ ...addingEvento, botones: filteredBotones });
    }
  };

  const handleBotonTextChange = (index: number, value: string) => {
    if (editingEvento) {
      const updatedBotones = [...editingEvento.botones];
      updatedBotones[index].texto = value;
      setEditingEvento({ ...editingEvento, botones: updatedBotones });
    } else if (addingEvento) {
      const updatedBotones = [...(addingEvento.botones || [])];
      updatedBotones[index].texto = value;
      setAddingEvento({ ...addingEvento, botones: updatedBotones });
    }
  };

  const handleBotonImageChange = (index: number, file: File | null) => {
    if (!file) return;

    if (editingEvento) {
      const updatedBotones = [...editingEvento.botones];
      updatedBotones[index].imagenAsociada = file;
      setEditingEvento({ ...editingEvento, botones: updatedBotones });
    } else if (addingEvento) {
      const updatedBotones = [...(addingEvento.botones || [])];
      updatedBotones[index].imagenAsociada = file;
      setAddingEvento({ ...addingEvento, botones: updatedBotones });
    }
  };

  // --- HANDLERS PARA RECURSOS ELECTRÓNICOS ---
  const handleResourceImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const previewUrl = URL.createObjectURL(file);
      setValue('image', previewUrl, { shouldValidate: true });

      // ✅ Guardar imagen temporalmente sin afectar editingResource
      setNewImageFile(file);
    }
  };

  const handleEditButtonClick = (recurso: Recurso) => {
    setEditingResource(recurso);
  };

  const handleEditCategoryName = async (id: string, currentName: string) => {
    const nuevoNombre = prompt('Editar nombre de la categoría:', currentName);
    if (!nuevoNombre || !nuevoNombre.trim()) return;

    try {
      setLoading(true);
      await api.put(`/categorias-recursos-electronicos/update-categoria/${id}`, {
        Nombre: nuevoNombre.trim()
      });
      await fetchCategorias();
    } catch (err) {
      setError('Error al actualizar la categoría');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Crear o actualizar un recurso
  const onResourceSubmit = async (data: Omit<Recurso, 'id' | 'active'>) => {
    if (!activeCategory) return;

    try {
      setLoading(true);
      setError('');

      const formData = new FormData();
      formData.append('Nombre', data.title);
      formData.append('Descripcion', data.description);
      formData.append('Enlace_Pagina', data.siteLink);

      const fileToUpload = newImageFile ?? editingResource?.imageFile;
      if (fileToUpload) {
        formData.append('imagen', fileToUpload);
      }

      if (editingResource) {
        // Editar recurso existente
        await api.put(
          `/recursos-electronicos/update-recurso/${editingResource.id}/${activeCategory}`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }
        );
      } else {
        // Crear nuevo recurso
        await api.post(
          `/recursos-electronicos/create-recurso/${activeCategory}`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }
        );
      }

      await fetchRecursos(activeCategory);
      setEditingResource(null);
      reset();
    } catch (err) {
      setError('Error al guardar el recurso');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Eliminar (desactivar) un recurso
  const handleDeleteResource = async (id: string) => {
    try {
      setLoading(true);
      setError('');
      await api.patch(`/recursos-electronicos/delete-recurso/${id}`);
      await fetchRecursos(activeCategory!);

      if (editingResource && editingResource.id === id) {
        setEditingResource(null);
        reset();
      }
    } catch (err) {
      setError('Error al eliminar el recurso');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Restaurar (activar) un recurso
  const handleRestoreResource = async (id: string) => {
    try {
      setLoading(true);
      setError('');
      await api.patch(`/recursos-electronicos/restore-recurso/${id}`);
      await fetchRecursos(activeCategory!);
    } catch (err) {
      setError('Error al restaurar el recurso');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Crear una nueva categoría
  const handleCreateCategory = async (nombre: string) => {
    try {
      setLoading(true);
      setError('');
      await api.post('/categorias-recursos-electronicos/create-categoria', { Nombre: nombre });
      await fetchCategorias();
    } catch (err) {
      setError('Error al crear la categoría');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Eliminar (desactivar) una categoría
  const handleDeleteCategory = async (id: string) => {
    try {
      setLoading(true);
      setError('');
      await api.patch(`/categorias-recursos-electronicos/delete-categoria/${id}`);
      await fetchCategorias();

      // Si la categoría activa fue eliminada, seleccionar otra
      if (activeCategory === id) {
        const nuevaCategoriaActiva = categorias.find(cat => cat.id !== id && cat.active);
        setActiveCategory(nuevaCategoriaActiva?.id || null);
      }
    } catch (err) {
      setError('Error al eliminar la categoría');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Restaurar (activar) una categoría
  const handleRestoreCategory = async (id: string) => {
    try {
      setLoading(true);
      setError('');
      await api.patch(`/categorias-recursos-electronicos/restore-categoria/${id}`);
      await fetchCategorias();
    } catch (err) {
      setError('Error al restaurar la categoría');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Configuraciones para los sliders
  const settingsHero = { dots: true, infinite: true, speed: 500, slidesToShow: 1, slidesToScroll: 1, autoplay: true, fade: true, arrows: false };
  const settingsEvents = { dots: true, infinite: false, speed: 500, slidesToShow: 3, slidesToScroll: 1, arrows: true, responsive: [{ breakpoint: 768, settings: { slidesToShow: 1 } }] };

  const currentFormEvento = editingEvento || addingEvento;

  useEffect(() => {
    if (currentFormEvento && formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [currentFormEvento]);

  return (
    <div className="admin-panel">
      <div className="admin-sidebar">
        <h2>Panel de Administración</h2>
        <nav>
          <button className={activeTab === 'inicio' ? 'active' : ''} onClick={() => setActiveTab('inicio')}>Inicio</button>
          <button className={activeTab === 'recursos' ? 'active' : ''} onClick={() => setActiveTab('recursos')}>Recursos Electrónicos</button>
        </nav>
        <button
          className="logout-button"
          onClick={() => {
            localStorage.removeItem('token');
            window.location.href = '/admin/login';
          }}
        >
          Cerrar Sesión
        </button>
      </div>
      <div className="admin-content">
        {loading && <div className="loading-overlay">Cargando...</div>}
        {error && <div className="error-message">{error}</div>}

        {activeTab === 'inicio' ? (
          /* SECCIÓN INICIO (MANTENIDA SIN CAMBIOS) */
          <div className="inicio-admin-container">
            <h1>Administrar Página de Inicio</h1>
            <div className="admin-section">
              <h2>Slider Hero</h2>
              <div className="resource-form">
                <h3>Añadir Nueva Imagen</h3>
                <label htmlFor="hero-image-upload" className="file-upload-label">Seleccionar Archivo...</label>
                <input id="hero-image-upload" type="file" accept="image/*" onChange={handleHeroImageChange} style={{ display: 'none' }} />
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
                        <img src={image.url} alt="Vista previa" className="hero-preview-image" />
                      </div>
                    ))}
                  </Slider>
                </div>
              </div>
            </div>
            <div className="admin-section">
              <h2>Eventos</h2>
              <button
                onClick={handleShowAddEventoForm}
                className="btn-add-evento-ghost">
                Añadir Nuevo Evento
              </button>
              <div className="eventos-grid">
                {eventos.map((evento) => (
                  <div key={evento.id} className="evento-card" onClick={() => handleSelectEventoForEditing(evento)}>
                    <img src={evento.imagen} alt={evento.titulo} />
                    <h4>{evento.titulo}</h4>
                    <div className="card-actions"><button>Editar</button></div>
                  </div>
                ))}
              </div>
              {currentFormEvento && (
                <div ref={formRef} className="resource-form">
                  <h3>{editingEvento ? `Editando Evento: ${currentFormEvento.titulo}` : 'Añadir Nuevo Evento'}</h3>
                  {currentFormEvento.imagen && <img src={currentFormEvento.imagen} alt="Previsualización" className="form-image-preview" />}
                  <label htmlFor="evento-image-upload" className="file-upload-label">Imagen del Evento...</label>
                  <input name="titulo" type="text" placeholder="Título del evento" value={currentFormEvento.titulo} onChange={handleEventoFormChange} />
                  <textarea name="descripcion" placeholder="Descripción" value={currentFormEvento.descripcion} onChange={handleEventoFormChange} />
                  <input id="evento-image-upload" type="file" accept="image/*" onChange={handleEventoImageChange} style={{ display: 'none' }} />
                  <h4></h4>
                  {currentFormEvento.botones?.map((btn, index) => (
                    <div key={index} className="boton-item">
                      <label htmlFor={`boton-image-${index}`} className="file-upload-label">
                        Imagen del Boton...
                      </label>
                      <input
                        type="text"
                        placeholder="Texto del botón"
                        value={btn.texto}
                        onChange={(e) => handleBotonTextChange(index, e.target.value)}
                      />
                      <input
                        id={`boton-image-${index}`}
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleBotonImageChange(index, e.target.files?.[0] || null)}
                        style={{ display: 'none' }}
                      />
                      {btn.imagenAsociada && (
                        <img
                          src={
                            typeof btn.imagenAsociada === 'string'
                              ? btn.imagenAsociada
                              : URL.createObjectURL(btn.imagenAsociada)
                          }
                          alt="Imagen del subevento"
                          className="form-image-preview-small"
                        />
                      )}
                      <button onClick={() => removeBotonFromForm(index)}>Eliminar</button>
                    </div>
                  ))}
                  <div className="form-actions">
                    <button onClick={addBotonToForm}>Agregar Botón</button>
                    {editingEvento ? (
                      <>
                        <button onClick={handleUpdateEvento}>Guardar Cambios</button>
                        <button onClick={() => setEditingEvento(null)} className="cancel">Cancelar</button>
                        <button
                          onClick={() => handleDeleteEvento(editingEvento.id)}
                          className={editingEvento.activo === false ? 'restore' : 'delete'}
                        >
                          {editingEvento.activo === false ? 'Activar Evento' : 'Desactivar Evento'}
                        </button>
                      </>
                    ) : (
                      <>
                        <button onClick={handleCreateEvento}>Crear Evento</button>
                        <button onClick={() => setAddingEvento(null)} className="cancel">Cancelar</button>
                      </>
                    )}
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
          /* SECCIÓN RECURSOS ELECTRÓNICOS */
          <div className="recursos-admin">
            <div className="categories-sidebar">
              <div className="categories-filter">
                <label className="custom-checkbox">
                  <input
                    type="checkbox"
                    checked={showInactiveCategories}
                    onChange={() => setShowInactiveCategories(!showInactiveCategories)}
                  />
                  <span className="checkmark"></span>
                  <span className="checkbox-label">Mostrar categorías inactivas</span>
                </label>
              </div>

              {categorias
                .filter(cat => showInactiveCategories || cat.active)
                .map(categoria => (
                  <div key={categoria.id} className="category-item-flex">
                    <button
                      className={`category-name-button ${activeCategory === categoria.id ? 'active' : ''}`}
                      onClick={() => {
                        setActiveCategory(categoria.id);
                        setEditingResource(null);
                        reset();
                      }}
                    >
                      {categoria.nombre}
                    </button>

                    <button
                      className="category-action-button edit"
                      title="Editar nombre"
                      onClick={() => handleEditCategoryName(categoria.id, categoria.nombre)}
                    >
                      ✏️
                    </button>

                    {categoria.active ? (
                      <button
                        className="category-action-button delete"
                        onClick={() => handleDeleteCategory(categoria.id)}
                      >
                        Desactivar
                      </button>
                    ) : (
                      <button
                        className="category-action-button restore"
                        onClick={() => handleRestoreCategory(categoria.id)}
                      >
                        Activar
                      </button>
                    )}
                  </div>
                ))}

              <div className="add-category-container">
                <button
                  className="add-category-btn"
                  onClick={() => {
                    const nombre = prompt('Ingrese el nombre de la nueva categoría:');
                    if (nombre && nombre.trim()) {
                      handleCreateCategory(nombre.trim());
                    }
                  }}
                >
                  + Añadir Categoría
                </button>
              </div>
            </div>

            <div className="recursos-content">
              {activeCategory ? (
                <>
                  <h2>Administrar {categorias.find(c => c.id === activeCategory)?.nombre}</h2>
                  <div className="recursos-grid">
                    {categorias.find(c => c.id === activeCategory)?.recursos.map(recurso => (
                      <div key={recurso.id} className="resource-item">
                        <div className="recursos-card">
                          <div className="recursos-card-image-container">
                            <img
                              src={recurso.image}
                              alt={recurso.title}
                              className="recursos-card-image"

                            />
                            <div className="recursos-card-title-overlay">
                              <h3 className="recursos-card-title">{recurso.title}</h3>
                            </div>
                          </div>
                        </div>
                        <div className="resource-controls-flex">
                          <label className="checkbox-label">
                            <input
                              type="checkbox"
                              checked={recurso.active}
                              onChange={(e) =>
                                e.target.checked
                                  ? handleRestoreResource(recurso.id)
                                  : handleDeleteResource(recurso.id)
                              }
                            />
                            <span>Activo</span>
                          </label>
                          <button
                            className="edit-btn"
                            onClick={() => handleEditButtonClick(recurso)}
                          >
                            Editar
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Formulario de recursos */}
                  <div className="resource-form">
                    <h3>{editingResource ? 'Editar Recurso' : 'Añadir Nuevo Recurso'}</h3>
                    <form onSubmit={handleSubmit(onResourceSubmit)}>
                      <input
                        type="text"
                        placeholder="Título"
                        {...register('title')}
                        className={errors.title ? 'input-error' : ''}
                      />
                      {errors.title && <p className="error-message">{errors.title.message}</p>}

                      <textarea
                        placeholder="Descripción"
                        {...register('description')}
                        className={errors.description ? 'input-error' : ''}
                      />
                      {errors.description && <p className="error-message">{errors.description.message}</p>}

                      <div className="form-image-upload-container">
                        <label htmlFor="resource-image-upload" className="file-upload-label">
                          {editingResource ? 'Cambiar Imagen...' : 'Seleccionar Imagen...'}
                        </label>
                        <input
                          id="resource-image-upload"
                          type="file"
                          accept="image/*"
                          onChange={handleResourceImageChange}
                          style={{ display: 'none' }}
                        />
                        {watchedImage && (
                          <img src={watchedImage} alt="Previsualización" className="form-image-preview" />
                        )}
                        {errors.image && <p className="error-message">{errors.image.message}</p>}
                      </div>

                      <input
                        type="text"
                        placeholder="Enlace al recurso"
                        {...register('siteLink')}
                        className={errors.siteLink ? 'input-error mt-7' : ''}
                      />
                      {errors.siteLink && <p className="error-message">{errors.siteLink.message}</p>}

                      <div className="form-actions">
                        {editingResource ? (
                          <>
                            <button type="submit">Actualizar</button>
                            <button
                              type="button"
                              onClick={() => { setEditingResource(null); reset(); }}
                              className="cancel-btn"
                            >
                              Cancelar
                            </button>
                          </>
                        ) : (
                          <button type="submit">Guardar Recurso</button>
                        )}
                      </div>
                    </form>
                  </div>
                </>
              ) : (
                <div className="no-category-selected">
                  <p>Seleccione una categoría para administrar sus recursos</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};