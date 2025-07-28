import React, { useState } from 'react';
import { MessageSquareIcon } from 'lucide-react';

export const SugerenciasMaterial: React.FC = () => {
  const [formData, setFormData] = useState({
    matricula: '',
    titulo: '',
    autor_editorial: '',
    tema: '',
    anio_publicacion: '',
  });

  const [respuesta, setRespuesta] = useState('');
  const [cargando, setCargando] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRespuesta(''); // Limpiar la respuesta anterior
    setCargando(true); // Activar estado de carga

    // Validar campos obligatorios
    if (!formData.matricula || !formData.titulo || !formData.autor_editorial) {
      setRespuesta('Por favor, completa los campos obligatorios: Matrícula, Título y Autor/Editorial.');
      setCargando(false);
      return;
    }

    try {
      const res = await fetch('http://localhost:4000/api/correos/enviar-correo-sugerencia-material', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.text();

      if (res.ok) {
        setRespuesta('¡Gracias por tu sugerencia! Será revisada por el equipo de la Biblioteca.');
        setFormData({
          matricula: '',
          titulo: '',
          autor_editorial: '',
          tema: '',
          anio_publicacion: '',
        });
      } else {
        setRespuesta(`Error: ${data || 'No se pudo enviar la sugerencia.'}`);
      }
    } catch (error) {
      setRespuesta('Error en la conexión con el servidor. Intenta de nuevo más tarde.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <section className="min-h-screen bg-white text-gray-900 px-6 py-14 flex justify-center font-['Inter']">
      <div className="max-w-4xl w-full bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] p-8 md:p-12">
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
          <div>
            <label htmlFor="matricula" className="block text-sm font-medium text-gray-700 mb-1">
              Matrícula*:
            </label>
            <input
              type="text"
              id="matricula"
              name="matricula"
              value={formData.matricula}
              onChange={handleChange}
              required
              placeholder="Ej. 2023123456"
              className="w-full border border-gray-300 rounded-xl px-4 py-2 text-base focus:ring-2 focus:ring-orange-500 focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="titulo" className="block text-sm font-medium text-gray-700 mb-1">
              Título*:
            </label>
            <input
              type="text"
              id="titulo"
              name="titulo"
              value={formData.titulo}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-xl px-4 py-2 text-base focus:ring-2 focus:ring-orange-500 focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="autor_editorial" className="block text-sm font-medium text-gray-700 mb-1">
              Autor/Editorial*:
            </label>
            <input
              type="text"
              id="autor_editorial"
              name="autor_editorial"
              value={formData.autor_editorial}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-xl px-4 py-2 text-base focus:ring-2 focus:ring-orange-500 focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="tema" className="block text-sm font-medium text-gray-700 mb-1">
              Tema:
            </label>
            <input
              type="text"
              id="tema"
              name="tema"
              value={formData.tema}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl px-4 py-2 text-base focus:ring-2 focus:ring-orange-500 focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="anio_publicacion" className="block text-sm font-medium text-gray-700 mb-1">
              Año de publicación:
            </label>
            <input
              type="number"
              id="anio_publicacion"
              name="anio_publicacion"
              value={formData.anio_publicacion}
              onChange={handleChange}
              min={0}
              max={new Date().getFullYear()}
              className="w-full border border-gray-300 rounded-xl px-4 py-2 text-base focus:ring-2 focus:ring-orange-500 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={cargando}
            className={`inline-flex items-center gap-2 bg-orange-500 text-white hover:bg-orange-600 px-6 py-3 rounded-xl font-semibold shadow-md transition duration-200 ${cargando ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {cargando ? 'Enviando...' : 'Enviar sugerencia'}
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