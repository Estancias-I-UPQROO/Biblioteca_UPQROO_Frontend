import React from 'react';
import { BookOpenIcon } from 'lucide-react';

export const FormacionUsuarios: React.FC = () => {
  return (
    <section className="min-h-screen bg-white text-gray-900 px-6 py-14 flex justify-center items-start font-['Inter']">
      <div className="max-w-4xl w-full bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] p-8 md:p-12">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <BookOpenIcon className="text-orange-500 w-8 h-8" />
          <h1 className="text-3xl md:text-4xl font-extrabold text-orange-500 tracking-tight">
            Formación de usuarios
          </h1>
        </div>

        {/* Texto */}
        <p className="text-lg leading-relaxed text-gray-700">
          Se brinda información general sobre el uso de la Biblioteca física y digital. La capacitación es de una hora aproximadamente y se programa previa cita.
        </p>
      </div>
    </section>
  );
};
