import React from 'react';
import { PageHeader } from '../../components';
import {
  BookOpenIcon,
  LaptopIcon,
  RefreshCwIcon,
  MessageSquareIcon,
  ArrowRightIcon,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const ServiciosBiblioteca: React.FC = () => {
  return (
      <> <PageHeader>Servicios</PageHeader>
    <section className="min-h-screen bg-white text-gray-900 px-6 py-14 font-['Inter']">
      <div className="max-w-7xl mx-auto">
       

        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-2 mb-10">
          {/* Primera fila con 2 tarjetas */}
          {cards.slice(3, 5).map(({ icon: Icon, title, description, link }, index) => (
            <div
              key={index + 3}
              className="bg-white border border-orange-50 hover:shadow-2xl transition-shadow duration-300 rounded-3xl overflow-hidden flex flex-col h-full shadow-sm"
            >
              <div className="flex items-center gap-3 p-5 bg-orange-50">
                <Icon className="text-orange-500 w-6 h-6" />
                <h2 className="text-lg font-bold text-orange-600">{title}</h2>
              </div>
              <div className="flex-grow px-5 py-4 text-sm leading-relaxed text-gray-700">
                {description}
              </div>
              {link && (
                <div className="p-5 mt-auto">
                  <Link
                    to={link}
                    className="w-full inline-flex items-center justify-center gap-2 text-sm text-white bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-xl font-medium shadow-md"
                  >
                    Ir al formulario <ArrowRightIcon className="w-4 h-4" />
                  </Link>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {/* Segunda fila con 3 tarjetas */}
          {cards.slice(0, 3).map(({ icon: Icon, title, description, link }, index) => (
            <div
              key={index}
              className="bg-white border border-orange-50 hover:shadow-2xl transition-shadow duration-300 rounded-3xl overflow-hidden flex flex-col h-full shadow-sm"
            >
              <div className="flex items-center gap-3 p-5 bg-orange-50">
                <Icon className="text-orange-500 w-6 h-6" />
                <h2 className="text-lg font-bold text-orange-600">{title}</h2>
              </div>
              <div className="flex-grow px-5 py-4 text-sm leading-relaxed text-gray-700">
                {description}
              </div>
              {link && (
                <div className="p-5 mt-auto">
                  <Link
                    to={link}
                    className="w-full inline-flex items-center justify-center gap-2 text-sm text-white bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-xl font-medium shadow-md"
                  >
                    Ir al formulario <ArrowRightIcon className="w-4 h-4" />
                  </Link>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
    </> 
  );
};

const cards = [
  {
    icon: BookOpenIcon,
    title: 'Préstamo de material bibliográfico',
    description: (
      <>
        <p>Disponible para <strong>alumnos y comunidad UPQROO</strong> con matrícula vigente.</p>
        <p>Puedes llevar hasta <strong>tres libros</strong> por <strong>tres días naturales</strong>.</p>
        <p>Dos <strong>renovaciones</strong> adicionales disponibles.</p>
        <p>La renovación debe hacerse el <strong>día de vencimiento</strong> en biblioteca o en línea.</p>
      </>
    ),
    link: null,
  },
  {
    icon: LaptopIcon,
    title: 'Préstamo de equipo de cómputo',
    description: (
      <>
        <p>Apoyo a la comunidad académica mediante préstamo de computadoras para fines académicos.</p>
        <p>El registro debe realizarse en la bitácora.</p>
      </>
    ),
    link: null,
  },
  {
    icon: BookOpenIcon,
    title: 'Formación de usuarios',
    description: (
      <>
        <p>Capacitación general sobre el uso de la Biblioteca física y digital.</p>
        <p>Duración aproximada de <strong>una hora</strong>, previa cita.</p>
      </>
    ),
    link: null,
  },
  {
    icon: RefreshCwIcon,
    title: 'Renovación en línea',
    description: (
      <>
        <p>Puedes renovar tu préstamo desde casa solo el día exacto del vencimiento.</p>
        <p>Recibirás confirmación por correo.</p>
      </>
    ),
    link: '/renovacion',
  },
  {
    icon: MessageSquareIcon,
    title: 'Sugerencias de material de compra',
    description: (
      <>
        <p>Propuesta de nuevos libros o recursos para enriquecer el acervo bibliográfico de la universidad.</p>
        <p>Tu sugerencia será revisada por el equipo bibliotecario.</p>
      </>
    ),
    link: '/solicitud-compra',
  },
];