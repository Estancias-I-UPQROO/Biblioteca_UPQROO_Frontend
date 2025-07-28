import React, { useState } from 'react';
import { RefreshCwIcon, MailIcon } from 'lucide-react';

export const Renovacion: React.FC = () => {
  const [formData, setFormData] = useState({
    matricula: '',
    nombre_estudiante: '',
    nombre_libro: '',
    clasificacion: '',
  });

  const [respuesta, setRespuesta] = useState('');
  const [cargando, setCargando] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRespuesta(''); // Limpiar la respuesta anterior
    setCargando(true); // Activar estado de carga

    // Validar campos vacíos
    if (!formData.matricula || !formData.nombre_estudiante || !formData.nombre_libro || !formData.clasificacion) {
      setRespuesta('Por favor, completa todos los campos.');
      setCargando(false);
      return;
    }

    try {
      const res = await fetch('http://localhost:4000/api/correos/enviar-correo-renovacion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.text(); // El backend responde con texto, no JSON

      if (res.ok) {
        setRespuesta('Solicitud de renovación enviada con éxito. Recibirás una confirmación por correo.');
        setFormData({ matricula: '', nombre_estudiante: '', nombre_libro: '', clasificacion: '' });
      } else {
        setRespuesta(`Error: ${data || 'No se pudo enviar la solicitud.'}`);
      }
    } catch (error) {
      setRespuesta('Error en la conexión con el servidor. Intenta de nuevo más tarde.');
    } finally {
      setCargando(false); // Desactivar estado de carga
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
            <label htmlFor="matricula" className="block text-sm font-medium text-gray-700 mb-1">Matrícula:</label>
            <input
              type="text"
              id="matricula"
              name="matricula"
              value={formData.matricula}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-xl px-4 py-2 text-base focus:ring-2 focus:ring-orange-500 focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="nombre_estudiante" className="block text-sm font-medium text-gray-700 mb-1">Nombre del estudiante:</label>
            <input
              type="text"
              id="nombre_estudiante"
              name="nombre_estudiante"
              value={formData.nombre_estudiante}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-xl px-4 py-2 text-base focus:ring-2 focus:ring-orange-500 focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="nombre_libro" className="block text-sm font-medium text-gray-700 mb-1">Nombre del libro:</label>
            <input
              type="text"
              id="nombre_libro"
              name="nombre_libro"
              value={formData.nombre_libro}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-xl px-4 py-2 text-base focus:ring-2 focus:ring-orange-500 focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="clasificacion" className="block text-sm font-medium text-gray-700 mb-1">Clasificación:</label>
            <input
              type="text"
              id="clasificacion"
              name="clasificacion"
              value={formData.clasificacion}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-xl px-4 py-2 text-base focus:ring-2 focus:ring-orange-500 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={cargando}
            className={`inline-flex items-center gap-2 bg-orange-500 text-white hover:bg-orange-600 px-6 py-3 rounded-xl font-semibold shadow-md transition duration-200 ${cargando ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {cargando ? 'Enviando...' : 'Enviar solicitud'}
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