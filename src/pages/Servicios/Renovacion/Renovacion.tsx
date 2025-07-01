import React, { useState } from 'react';
import { RefreshCwIcon, MailIcon } from 'lucide-react';

export const Renovacion: React.FC = () => {
  const [formData, setFormData] = useState({
    matricula: '',
    nombre: '',
    libro: '',
    clasificacion: '',
  });

  const [respuesta, setRespuesta] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validar campos vacíos
    if (!formData.matricula || !formData.nombre || !formData.libro || !formData.clasificacion) {
      setRespuesta('Por favor completa todos los campos.');
      return;
    }

    try {
      const res = await fetch('http://localhost:4000/api/renovacion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setRespuesta('Solicitud enviada con éxito. Se notificará a biblioteca@upqroo.edu.mx.');
        setFormData({ matricula: '', nombre: '', libro: '', clasificacion: '' });
      } else {
        setRespuesta(data.message || 'Error al enviar la solicitud.');
      }
    } catch (error) {
      setRespuesta('Error en la conexión con el servidor.');
    }
  };

  return (
    <section className="min-h-screen bg-white text-gray-900 px-4 py-14 flex justify-center font-['Inter']">
      <div className="max-w-3xl w-full bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] p-6 md:p-10">
        <div className="flex items-center gap-3 mb-8">
          <RefreshCwIcon className="text-orange-500 w-8 h-8" />
          <h1 className="text-3xl md:text-4xl font-extrabold text-orange-500 tracking-tight">
            Renovación en línea
          </h1>
        </div>

        <p className="text-lg text-gray-700 leading-relaxed mb-6">
          Puedes renovar tu préstamo desde casa solo el día exacto del vencimiento. Recibirás confirmación por correo.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Matrícula:</label>
            <input
              type="text"
              name="matricula"
              value={formData.matricula}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-xl px-4 py-2 text-base focus:ring-2 focus:ring-orange-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del estudiante:</label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-xl px-4 py-2 text-base focus:ring-2 focus:ring-orange-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del libro:</label>
            <input
              type="text"
              name="libro"
              value={formData.libro}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-xl px-4 py-2 text-base focus:ring-2 focus:ring-orange-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Clasificación:</label>
            <input
              type="text"
              name="clasificacion"
              value={formData.clasificacion}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-xl px-4 py-2 text-base focus:ring-2 focus:ring-orange-500 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="inline-flex items-center gap-2 bg-orange-500 text-white hover:bg-orange-600 px-6 py-3 rounded-xl font-semibold shadow-md transition duration-200"
          >
            Enviar solicitud
            <MailIcon className="w-4 h-4" />
          </button>
        </form>

        {respuesta && (
          <div className="mt-6 p-4 bg-orange-50 border border-orange-300 rounded-xl text-orange-800 text-sm">
            {respuesta}
          </div>
        )}
      </div>
    </section>
  );
};
