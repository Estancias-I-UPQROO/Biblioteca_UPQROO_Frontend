import React, { useState } from 'react';
import { MessageSquareIcon } from 'lucide-react';

export const SugerenciasMaterial: React.FC = () => {
  const [formData, setFormData] = useState({
    matricula: '',
    titulo: '',
    autorEditorial: '',
    tema: '',
    anio: '',
  });

  const [respuesta, setRespuesta] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validar campos obligatorios
    if (!formData.matricula || !formData.titulo || !formData.autorEditorial) {
      setRespuesta('Por favor, completa los campos obligatorios: Matrícula, Título y Autor/Editorial.');
      return;
    }

    // Aquí podrías conectar con backend o EmailJS para enviar la sugerencia
    setRespuesta('¡Gracias por tu sugerencia! Será revisada por el equipo de la Biblioteca.');

    // Limpiar formulario
    setFormData({
      matricula: '',
      titulo: '',
      autorEditorial: '',
      tema: '',
      anio: '',
    });
  };

  return (
    <section className="min-h-screen bg-white text-gray-900 px-6 py-14 flex justify-center font-['Inter']">
      <div className="max-w-4xl w-full bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] p-8 md:p-12">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <MessageSquareIcon className="text-orange-500 w-8 h-8" />
          <h1 className="text-3xl md:text-4xl font-extrabold text-orange-500 tracking-tight">
            Sugerencias de material de compra
          </h1>
        </div>

        <p className="text-lg leading-relaxed text-gray-700 mb-8">
          La Biblioteca acepta sugerencias de material bibliográfico que sea de interés para la comunidad UPQROO, con el objetivo de constituir un acervo amplio en apoyo a la comunidad universitaria.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Matrícula */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Matrícula*:
            </label>
            <input
              type="text"
              name="matricula"
              value={formData.matricula}
              onChange={handleChange}
              required
              placeholder="Ej. 2023123456"
              className="w-full border border-gray-300 rounded-xl px-4 py-2 text-base focus:ring-2 focus:ring-orange-500 focus:outline-none"
            />
          </div>

          {/* Título */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Título*:
            </label>
            <input
              type="text"
              name="titulo"
              value={formData.titulo}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-xl px-4 py-2 text-base focus:ring-2 focus:ring-orange-500 focus:outline-none"
            />
          </div>

          {/* Autor/Editorial */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Autor/Editorial*:
            </label>
            <input
              type="text"
              name="autorEditorial"
              value={formData.autorEditorial}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-xl px-4 py-2 text-base focus:ring-2 focus:ring-orange-500 focus:outline-none"
            />
          </div>

          {/* Tema */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tema:
            </label>
            <input
              type="text"
              name="tema"
              value={formData.tema}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl px-4 py-2 text-base focus:ring-2 focus:ring-orange-500 focus:outline-none"
            />
          </div>

          {/* Año de publicación */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Año de publicación:
            </label>
            <input
              type="number"
              name="anio"
              value={formData.anio}
              onChange={handleChange}
              min={0}
              max={new Date().getFullYear()}
              className="w-full border border-gray-300 rounded-xl px-4 py-2 text-base focus:ring-2 focus:ring-orange-500 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="inline-flex items-center gap-2 bg-orange-500 text-white hover:bg-orange-600 px-6 py-3 rounded-xl font-semibold shadow-md transition duration-200"
          >
            Enviar sugerencia
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

