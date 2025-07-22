// src/components/AdminPanel/AdminPanel.tsx
import { useState } from 'react';
import './Admindash.css';

type Recurso = {
  id: number;
  title: string;
  description: string;
  image: string;
  siteLink: string;
  active: boolean;
};

type Categoria = {
  id: number;
  nombre: string;
  recursos: Recurso[];
};

export const AdminPanel = () => {
  // Estado para las pestañas principales
  const [activeTab, setActiveTab] = useState<'inicio'|'recursos'>('recursos');
  
  // Estado para las categorías de recursos electrónicos
  const [categorias, setCategorias] = useState<Categoria[]>([
    {
      id: 1,
      nombre: 'Base de datos',
      recursos: [
        {
          id: 1,
          title: 'Chicago Journal',
          description: 'Base de datos académica con publicaciones científicas',
          image: '/Chicago_Journal.png',
          siteLink: 'https://www.journals.uchicago.edu/',
          active: true
        }
      ]
    },
    {
      id: 2,
      nombre: 'Bibliotecas digitales',
      recursos: [
        {
          id: 1,
          title: 'Biblioteca Digital Mundial',
          description: 'Recursos culturales de todo el mundo',
          image: '/digital-library.jpg',
          siteLink: 'https://www.wdl.org/',
          active: true
        }
      ]
    },
    {
      id: 3,
      nombre: 'Revistas electrónicas',
      recursos: [
        {
          id: 1,
          title: 'Nature Journal',
          description: 'Revista científica de alto impacto',
          image: '/nature-journal.jpg',
          siteLink: 'https://www.nature.com/',
          active: true
        }
      ]
    },
    {
      id: 4,
      nombre: 'E-books',
      recursos: [
        {
          id: 1,
          title: 'Project Gutenberg',
          description: 'Libros electrónicos gratuitos',
          image: '/gutenberg.jpg',
          siteLink: 'https://www.gutenberg.org/',
          active: true
        }
      ]
    },
    {
      id: 5,
      nombre: 'Diccionarios',
      recursos: [
        {
          id: 1,
          title: 'RAE Diccionario',
          description: 'Diccionario de la Real Academia Española',
          image: '/rae.jpg',
          siteLink: 'https://dle.rae.es/',
          active: true
        }
      ]
    },
    {
      id: 6,
      nombre: 'Normas y guías',
      recursos: [
        {
          id: 1,
          title: 'ISO Standards',
          description: 'Normas internacionales ISO',
          image: '/iso-standards.jpg',
          siteLink: 'https://www.iso.org/',
          active: true
        }
      ]
    }
  ]);

  const [activeCategory, setActiveCategory] = useState(1);
  const [newResource, setNewResource] = useState<Omit<Recurso, 'id' | 'active'>>({ 
    title: '', 
    description: '', 
    image: '', 
    siteLink: '' 
  });

  const [editingResource, setEditingResource] = useState<Recurso | null>(null);

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
      setNewResource({ title: '', description: '', image: '', siteLink: '' });
    }
  };

  const handleUpdateResource = () => {
    if (editingResource) {
      setCategorias(categorias.map(cat => 
        cat.id === activeCategory
          ? {
              ...cat,
              recursos: cat.recursos.map(res => 
                res.id === editingResource.id 
                  ? { ...editingResource }
                  : res
              )
            }
          : cat
      ));
      setEditingResource(null);
    }
  };

  const handleDeleteResource = (id: number) => {
    setCategorias(categorias.map(cat => 
      cat.id === activeCategory
        ? {
            ...cat,
            recursos: cat.recursos.filter(res => res.id !== id)
          }
        : cat
    ));
  };

  return (
    <div className="admin-panel">
      {/* Sidebar */}
      <div className="admin-sidebar">
        <h2>Panel de Administración</h2>
        <nav>
          <button 
            className={activeTab === 'inicio' ? 'active' : ''}
            onClick={() => setActiveTab('inicio')}
          >
            Inicio
          </button>
          <button 
            className={activeTab === 'recursos' ? 'active' : ''}
            onClick={() => setActiveTab('recursos')}
          >
            Recursos Electrónicos
          </button>
        </nav>
      </div>

      {/* Contenido principal */}
      <div className="admin-content">
        {activeTab === 'inicio' ? (
          <div className="inicio-admin">
            <h2>Administrar Slider Hero</h2>
            {/* Contenido para administrar el slider hero */}
          </div>
        ) : (
          <div className="recursos-admin">
            <div className="categories-sidebar">
              {categorias.map(categoria => (
                <button
                  key={categoria.id}
                  className={activeCategory === categoria.id ? 'active' : ''}
                  onClick={() => {
                    setActiveCategory(categoria.id);
                    setEditingResource(null);
                  }}
                >
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
                        <img 
                          src={recurso.image} 
                          alt={recurso.title}
                          className="recursos-card-image"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/placeholder-recursos.jpg';
                          }}
                        />
                        <div className="recursos-card-title-overlay">
                          <h3 className="recursos-card-title">{recurso.title}</h3>
                        </div>
                      </div>
                    </div>
                    <div className="resource-controls">
                      <label>
                        <input
                          type="checkbox"
                          checked={recurso.active}
                          onChange={(e) => {
                            setCategorias(categorias.map(cat => 
                              cat.id === activeCategory
                                ? {
                                    ...cat,
                                    recursos: cat.recursos.map(res => 
                                      res.id === recurso.id 
                                        ? {...res, active: e.target.checked} 
                                        : res
                                    )
                                  }
                                : cat
                            ));
                          }}
                        />
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
                <input
                  type="text"
                  placeholder="Título"
                  value={editingResource ? editingResource.title : newResource.title}
                  onChange={(e) => 
                    editingResource
                      ? setEditingResource({...editingResource, title: e.target.value})
                      : setNewResource({...newResource, title: e.target.value})
                  }
                />
                <textarea
                  placeholder="Descripción"
                  value={editingResource ? editingResource.description : newResource.description}
                  onChange={(e) => 
                    editingResource
                      ? setEditingResource({...editingResource, description: e.target.value})
                      : setNewResource({...newResource, description: e.target.value})
                  }
                />
                <input
                  type="text"
                  placeholder="URL de la imagen"
                  value={editingResource ? editingResource.image : newResource.image}
                  onChange={(e) => 
                    editingResource
                      ? setEditingResource({...editingResource, image: e.target.value})
                      : setNewResource({...newResource, image: e.target.value})
                  }
                />
                <input
                  type="text"
                  placeholder="Enlace al recurso"
                  value={editingResource ? editingResource.siteLink : newResource.siteLink}
                  onChange={(e) => 
                    editingResource
                      ? setEditingResource({...editingResource, siteLink: e.target.value})
                      : setNewResource({...newResource, siteLink: e.target.value})
                  }
                />
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