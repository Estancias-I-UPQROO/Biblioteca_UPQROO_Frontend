import React, { useState } from 'react';
import { RefreshCwIcon, MailIcon, PlusIcon, MinusIcon } from 'lucide-react';

export const Renovacion: React.FC = () => {
  const [formData, setFormData] = useState({
    matricula: '',
    nombre_libro: [''], // Se convierte en arreglo
  });

  const [respuesta, setRespuesta] = useState('');
  const [cargando, setCargando] = useState(false);

  const handleChange = (index: number, value: string) => {
    const updatedLibros = [...formData.nombre_libro];
    updatedLibros[index] = value;
    setFormData({ ...formData, nombre_libro: updatedLibros });
  };

  const addLibro = () => {
    if (formData.nombre_libro.length < 3) {
      setFormData({ ...formData, nombre_libro: [...formData.nombre_libro, ''] });
    }
  };

  const removeLibro = (index: number) => {
    const updatedLibros = formData.nombre_libro.filter((_, i) => i !== index);
    setFormData({ ...formData, nombre_libro: updatedLibros });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRespuesta('');
    setCargando(true);

    if (!formData.matricula || formData.nombre_libro.some(libro => !libro.trim())) {
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

      const data = await res.text();
      if (res.ok) {
        setRespuesta('Solicitud de renovación enviada con éxito. Recibirás una confirmación por correo.');
        setFormData({ matricula: '', nombre_libro: [''] });
      } else {
        setRespuesta(`Error: ${data || 'No se pudo enviar la solicitud.'}`);
      }
    } catch (error) {
      setRespuesta('Error en la conexión con el servidor. Intenta de nuevo más tarde.');
    } finally {
      setCargando(false);
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
              onChange={(e) => setFormData({ ...formData, matricula: e.target.value })}
              required
              className="w-full border border-gray-300 rounded-xl px-4 py-2 text-base focus:ring-2 focus:ring-orange-500 focus:outline-none"
            />
          </div>

          {formData.nombre_libro.map((libro, index) => (
            <div key={index} className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre del libro {formData.nombre_libro.length > 1 && `(${index + 1})`}:
              </label>
              <input
                type="text"
                value={libro}
                onChange={(e) => handleChange(index, e.target.value)}
                required
                className="w-full border border-gray-300 rounded-xl px-4 py-2 text-base focus:ring-2 focus:ring-orange-500 focus:outline-none"
              />
              {formData.nombre_libro.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeLibro(index)}
                  className="absolute right-2 top-9 text-red-500 hover:text-red-700"
                >
                  <MinusIcon size={18} />
                </button>
              )}
            </div>
          ))}

          {formData.nombre_libro.length < 3 && (
            <button
              type="button"
              onClick={addLibro}
              className="text-sm text-orange-600 hover:underline flex items-center gap-1"
            >
              <PlusIcon size={16} /> Agregar otro libro
            </button>
          )}

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
