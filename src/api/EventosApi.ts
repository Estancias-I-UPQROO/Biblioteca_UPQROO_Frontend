// src/api/api.ts

import axios from 'axios';

const API_BASE_URL = 'http://localhost:4000/api';

const token = () => localStorage.getItem('token');

const authHeaders = () => ({
  headers: {
    Authorization: `Bearer ${token()}`
  }
});

// -------- EVENTOS ----------------

export const getEventos = async () => {
  const res = await axios.get(`${API_BASE_URL}/eventos/get-eventos`);
  return res.data;
};

export const createEvento = async (evento: {
  titulo: string;
  descripcion: string;
  imagenFile: File;
  botones: { texto: string; imagenAsociada: File }[];
}) => {
  const formData = new FormData();
  formData.append('Titulo', evento.titulo);
  formData.append('Descripcion', evento.descripcion);
  formData.append('imagen', evento.imagenFile);

  const subeventosData = evento.botones.map(b => ({ Titulo: b.texto }));
  formData.append('subeventos', JSON.stringify(subeventosData));

  evento.botones.forEach((b) => {
    if (b.imagenAsociada) {
      formData.append('subeventosImages', b.imagenAsociada);
    }
  });

  await axios.post(`${API_BASE_URL}/eventos/create-evento`, formData, {
    headers: {
      ...authHeaders().headers,
      'Content-Type': 'multipart/form-data'
    }
  });
};

export const updateEvento = async (evento: {
  id: string;
  titulo: string;
  descripcion: string;
  imagenFile?: File;
  botones: { texto: string; ID_SubEvento?: string; imagenAsociada?: File }[];
}) => {
  const formData = new FormData();
  formData.append('Titulo', evento.titulo);
  formData.append('Descripcion', evento.descripcion);
  if (evento.imagenFile) formData.append('imagen', evento.imagenFile);

  const subeventosData = evento.botones.map(b => ({
    Titulo: b.texto,
    ID_SubEvento: b.ID_SubEvento ?? undefined
  }));
  formData.append('subeventos', JSON.stringify(subeventosData));

  evento.botones.forEach((b) => {
    if (b.imagenAsociada instanceof File) {
      formData.append('subeventosImages', b.imagenAsociada);
    }
  });

  await axios.put(`${API_BASE_URL}/eventos/update-evento/${evento.id}`, formData, {
    headers: {
      ...authHeaders().headers,
      'Content-Type': 'multipart/form-data'
    }
  });
};

export const toggleEventoActivo = async (id: string) => {
  await axios.patch(`${API_BASE_URL}/eventos/delete-evento/${id}`, {}, authHeaders());
};
