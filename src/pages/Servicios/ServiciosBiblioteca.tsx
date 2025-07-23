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
    <>
      <PageHeader>Servicios</PageHeader>
      <section className="min-h-screen bg-white text-gray-900 px-6 py-14 font-['Inter']">
        <div className="max-w-7xl mx-auto">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-2 mb-10">
            {cards.slice(3, 5).map((card, index) => (
              <ServiceCard key={index + 3} {...card} />
            ))}
          </div>

          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {cards.slice(0, 3).map((card, index) => (
              <ServiceCard key={index} {...card} />
            ))}
          </div>
        </div>
      </section>
    </> 
  );
};

type ServiceCardProps = {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: React.ReactNode;
  link: string | null;
  bgImage: string | null;
};

const ServiceCard: React.FC<ServiceCardProps> = ({ icon: Icon, title, description, link, bgImage }) => {
  const hasImageBg = !!bgImage;
  
  return (
    <div className={`
      relative border border-orange-50 hover:shadow-2xl transition-all duration-300 rounded-3xl overflow-hidden 
      flex flex-col h-full shadow-sm ${hasImageBg ? '' : 'bg-white'}
    `}>
      {/* Fondo con imagen */}
      {bgImage && (
        <div className="absolute inset-0 z-0">
          <img 
            src={bgImage} 
            alt="" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/30"></div>
        </div>
      )}
      
      {/* Contenido */}
      <div className="relative z-10 flex flex-col h-full">
        {/* Encabezado con estilo original */}
        <div className="flex items-center gap-3 p-5 bg-orange-50">
          <Icon className="w-6 h-6 text-orange-500" />
          <h2 className="text-lg font-bold text-orange-600">{title}</h2>
        </div>
        
        {/* Área de descripción adaptada */}
        <div className={`
          flex-grow px-5 py-4 text-sm leading-relaxed 
          ${hasImageBg ? 
            'text-white bg-black/20 backdrop-blur-[1px]' : 
            'text-gray-700 bg-white'
          }
        `}>
          {description}
        </div>
        
        {link && (
          <div className={`p-5 mt-auto ${hasImageBg ? 'bg-black/20' : 'bg-white'}`}>
            <Link
              to={link}
              className="w-full inline-flex items-center justify-center gap-2 text-sm text-white bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-xl font-medium shadow-md"
            >
              Ir al formulario <ArrowRightIcon className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

const cards = [
  {
    icon: BookOpenIcon,
    title: 'Préstamo de material bibliográfico',
    description: (
      <div className="space-y-2">
        <p>Disponible para <strong>alumnos y comunidad UPQROO</strong> con matrícula vigente.</p>
        <p>Puedes llevar hasta <strong>tres libros</strong> por <strong>tres días naturales</strong>.</p>
        <p>Dos <strong>renovaciones</strong> adicionales disponibles.</p>
        <p>La renovación debe hacerse el <strong>día de vencimiento</strong> en biblioteca o en línea.</p>
      </div>
    ),
    link: null,
    bgImage: '/prestamo.jpg'
  },
  {
    icon: LaptopIcon,
    title: 'Préstamo de equipo de cómputo',
    description: (
      <div className="space-y-2">
        <p>Apoyo a la comunidad académica mediante préstamo de computadoras para fines académicos.</p>
        <p>El registro debe realizarse en la bitácora.</p>
      </div>
    ),
    link: null,
    bgImage: 'computo.jpg'
  },
  {
    icon: BookOpenIcon,
    title: 'Formación de usuarios',
    description: (
      <div className="space-y-2">
        <p>Capacitación general sobre el uso de la Biblioteca física y digital.</p>
        <p>Duración aproximada de <strong>una hora</strong>, previa cita.</p>
      </div>
    ),
    link: null,
    bgImage: 'formacion.jpg'
  },
  {
    icon: RefreshCwIcon,
    title: 'Renovación en línea',
    description: (
      <div className="space-y-2">
        <p>Puedes renovar tu préstamo desde casa solo el día exacto del vencimiento.</p>
        <p>Recibirás confirmación por correo.</p>
      </div>
    ),
    link: '/renovacion',
    bgImage: null
  },
  {
    icon: MessageSquareIcon,
    title: 'Sugerencias de material de compra',
    description: (
      <div className="space-y-2">
        <p>Propuesta de nuevos libros o recursos para enriquecer el acervo bibliográfico de la universidad.</p>
        <p>Tu sugerencia será revisada por el equipo bibliotecario.</p>
      </div>
    ),
    link: '/solicitud-compra',
    bgImage: null
  },
];