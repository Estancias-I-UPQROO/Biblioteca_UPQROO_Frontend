// src/pages/Prestamo.tsx
import React from 'react';
import { BookOpenIcon, ArrowRightIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

export const PrestamoMat: React.FC = () => {
  return (
  <section className="min-h-screen bg-white text-gray-900 px-4 py-14 flex justify-center items-start font-['Inter']">
  <div className="max-w-4xl w-full bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] p-6 md:p-10 transition-all duration-300 ease-in-out hover:shadow-[0_25px_60px_rgba(0,0,0,0.15)]">
    
    {/* Header */}
    <div className="flex items-center gap-3 mb-8">
      <BookOpenIcon className="text-orange-500 w-9 h-9 drop-shadow-sm" />
      <h1 className="text-3xl md:text-4xl font-extrabold text-orange-500 tracking-tight">
        Préstamo de material bibliográfico
      </h1>
    </div>

    {/* Body Text */}
    <div className="space-y-5 text-[1.1rem] leading-relaxed text-gray-700">
      <p>
        Este servicio está disponible para <strong className="text-gray-800">alumnos y comunidad UPQROO</strong> con matrícula vigente.
      </p>
      <p>
        Puedes llevar hasta <span className="font-semibold text-orange-600">tres libros</span> (excepto el ejemplar 1) por un periodo de <span className="font-semibold text-orange-600">tres días naturales</span>.
      </p>
      <p>
        Si necesitas más tiempo, puedes hacer hasta <span className="font-semibold text-orange-600">dos renovaciones</span> adicionales.
      </p>
      <p>
        La renovación debe solicitarse el <span className="font-semibold">día de vencimiento</span>, ya sea directamente en biblioteca o a través de la plataforma:
      </p>
    </div>

    {/* Botón */}
    <div className="mt-8">
      <Link
        to="/renovacion"
        className="inline-flex items-center gap-2 bg-orange-500 text-white hover:bg-orange-600 active:bg-orange-700 focus:ring-4 focus:ring-orange-300 focus:outline-none px-6 py-3 rounded-2xl text-base font-semibold shadow-md transition duration-200"
      >
        Renovación en línea
        <ArrowRightIcon className="w-4 h-4" />
      </Link>
    </div>

  </div>
</section>


  );
};