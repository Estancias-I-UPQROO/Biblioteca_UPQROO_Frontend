import axios from 'axios';

const API_URL = 'http://localhost:4000'; // Your backend URL

// --- Tipos de datos para el frontend (adaptados de tu backend y requisitos) ---

// Tipo de Recurso tal como lo recibes de la API
export type ApiRecurso = {
  ID_Recurso_Electronico: string; // UUID
  Nombre: string;
  Descripcion: string;
  Imagen_URL: string;
  Enlace_Pagina: string;
  Activo: boolean;
  createdAt: string;
  updatedAt: string;
};

// Tipo de Categoría tal como lo recibes de la API
export type ApiCategoria = {
  ID_Categoria_Recursos_Electronicos: string; // UUID
  Nombre: string;
  Activo: boolean;
  createdAt: string;
  updatedAt: string;
  // Si incluyes recursos en la categoría, puedes añadirlos aquí:
  Recursos_Electronicos?: ApiRecurso[];
};

// Tipo de relación (cuando obtienes recursos por categoría)
export type RelacionCategoriaRecurso = {
  ID_Relacion: string;
  ID_Recurso_Electronico: string;
  ID_Categoria_Recursos_Electronicos: string;
  createdAt: string;
  updatedAt: string;
  Recursos_Electronico: ApiRecurso; // Nota la "s" al final, es el nombre del modelo incluido
};


// --- Funciones de Fetching ---

// Obtener todas las categorías
export const getCategorias = async (): Promise<ApiCategoria[]> => {
  const { data } = await axios.get(`${API_URL}/get-categorias`);
  return data;
};

// Obtener recursos por categoría
export const getRecursosByCategoria = async (categoryId: string): Promise<RelacionCategoriaRecurso[]> => {
  const { data } = await axios.get(`${API_URL}/get-recursos/${categoryId}`);
  return data;
};

// Crear un nuevo recurso
export const createRecurso = async (idCategoria: string, formData: FormData) => {
  const { data } = await axios.post(`${API_URL}/create-recurso/${idCategoria}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data', // Importante para enviar archivos
    },
  });
  return data;
};

// Actualizar un recurso
export const updateRecurso = async (idRecurso: string, idCategoria: string, formData: FormData) => {
  const { data } = await axios.put(`${API_URL}/update-recurso/${idRecurso}/${idCategoria}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data', // Importante para enviar archivos
    },
  });
  return data;
};

// Desactivar un recurso (soft delete)
export const deleteRecurso = async (idRecurso: string) => {
  const { data } = await axios.patch(`${API_URL}/delete-recurso/${idRecurso}`);
  return data;
};

// Reactivar un recurso
export const restoreRecurso = async (idRecurso: string) => {
  const { data } = await axios.patch(`${API_URL}/restore-recurso/${idRecurso}`);
  return data;
}; 