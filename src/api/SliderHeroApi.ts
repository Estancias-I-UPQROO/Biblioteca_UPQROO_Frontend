import axios from 'axios';

// URL base de tu API. Asegúrate de que coincida con la configuración de tu servidor.
const API_URL = 'http://localhost:4000/api/slider-hero';

// --- Tipos de Datos (Interfaces de TypeScript) ---

/**
 * Representa la estructura de un objeto Slider tal como lo devuelve la API.
 * Es una buena práctica definir los tipos para tener un código más seguro y predecible.
 */
export interface ApiSlider {
  id_slider_hero: string; // El UUID que identifica al slider
  Imagen_URL: string;     // La ruta relativa de la imagen en el servidor
  createdAt: string;      // Fecha de creación
  updatedAt: string;      // Fecha de última actualización
}

/**
 * Define la estructura de la respuesta al crear un nuevo slider.
 */
export interface CreateSliderResponse {
    message: string;
    data: ApiSlider;
}

// --- Funciones del Servicio para interactuar con la API ---

/**
 * Obtiene todas las imágenes del slider.
 * No requiere autenticación.
 * @returns Una promesa que se resuelve con un arreglo de sliders.
 */
export const getSliderImages = async (): Promise<ApiSlider[]> => {
  // Realiza una petición GET a /get-sliders
  const { data } = await axios.get<ApiSlider[]>(`${API_URL}/get-sliders`);
  return data;
};

/**
 * Sube una nueva imagen para el slider.
 * Requiere autenticación (JWT).
 * @param formData - El objeto FormData que contiene el archivo de imagen. La clave debe ser 'imagen'.
 * @param token - El token JWT del usuario autenticado.
 * @returns Una promesa que se resuelve con el mensaje y los datos del nuevo slider.
 */
export const createSliderImage = async (formData: FormData, token: string): Promise<CreateSliderResponse> => {
  // Realiza una petición POST a /add-slider
  const { data } = await axios.post<CreateSliderResponse>(`${API_URL}/add-slider`, formData, {
    headers: {
      // Es crucial para que el backend reconozca que se envía un archivo
      'Content-Type': 'multipart/form-data',
      // Envía el token para la verificación del middleware 'verifyJWT'
      'Authorization': `Bearer ${token}`,
    },
  });
  return data;
};

/**
 * Elimina una imagen del slider por su ID.
 * Requiere autenticación (JWT).
 * @param sliderId - El ID (UUID) del slider que se va a eliminar.
 * @param token - El token JWT del usuario autenticado.
 * @returns Una promesa que se resuelve con el mensaje de éxito del backend.
 */
export const deleteSliderImage = async (sliderId: string, token: string): Promise<string> => {
  // Realiza una petición DELETE a /delete-slider/:id_slider
  const { data } = await axios.delete<string>(`${API_URL}/delete-slider/${sliderId}`, {
    headers: {
      // Envía el token para la verificación del middleware 'verifyJWT'
      'Authorization': `Bearer ${token}`,
    },
  });
  // La API devuelve un string directamente, no un JSON
  return data;
};