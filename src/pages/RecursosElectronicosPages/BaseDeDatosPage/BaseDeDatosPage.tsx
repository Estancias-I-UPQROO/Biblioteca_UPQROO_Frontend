import { useState } from "react";
import {
  PageContainer,
  PageHeader,
  RecursosElectronicosCard,
  RecursosElectronicosGrid,
} from "../../../components";

export const BaseDeDatosPage = () => {
  // Estado para controlar qué card está expandida
  const [expandedCardIndex, setExpandedCardIndex] = useState<number | null>(null);

  const recursos = [
    {
      title: "Chicago Journal",
      description: "¡Entendido! Aquí tienes una versión que preserva al máximo la estructura y el estilo del buscador de tu segundo ejemplo, integrándola en el componente Navbar completamente funcional y responsivo.Se ha adoptado la maquetación y los estilos específicos que tenías para la barra de búsqueda y el menú de resultados, incluyendo las imágenes y el formato del texto.Puntos Clave de la ImplementaciónEstructura de Escritorio: Se ha replicado la disposición de tu ejemplo. El icono de búsqueda y los enlaces de navegación de escritorio ahora conviven dentro de un mismo contenedor flex, y su visibilidad se controla con las clases de Tailwind (hidden, md:block, md:flex), tal como lo propusiste.Estilo de Resultados: El menú desplegable que muestra los resultados de la búsqueda se ha implementado con el mismo diseño y clases que en tu código. Esto incluye la miniatura de la imagen, el título, y el manejo del espacio para el texto (break-words) tanto en la vista de escritorio como en la móvil.Lógica Combinada: Esta estructura visual se ha fusionado con la lógica de estado (useState, useEffect) y los hooks personalizados (useMediaQuery) de tu componente original para asegurar que el menú móvil, los menús desplegables y la interactividad general sigan funcionando perfectamente.",
      image: "/Chicago_Journal.png",
      siteLink: "https://www.journals.uchicago.edu/",
    },
    {
      title: "SciELO",
      description: "Descripción larga...",
      image: "/scielo.png",
      siteLink: "https://www.scielo.org/",
    },
    {
      title: "Redalyc 1",
      description: "Descripción larga...",
      image: "/redalyc.jpg",
      siteLink: "https://www.redalyc.org/",
    },
    {
      title: "Redalyc 2",
      description: "Descripción larga...",
      image: "/redalyc.jpg",
      siteLink: "https://www.redalyc.org/",
    },
    {
      title: "Redalyc 3",
      description: "Descripción larga...",
      image: "/redalyc.jpg",
      siteLink: "https://www.redalyc.org/",
    },
    {
      title: "Redalyc 4",
      description: "Descripción larga...",
      image: "/redalyc.jpg",
      siteLink: "https://www.redalyc.org/",
    },
  ];

  return (
    <>
      <PageHeader>Base de datos</PageHeader>
      <PageContainer>
        <RecursosElectronicosGrid>
          {recursos.map((recurso, index) => (
            <RecursosElectronicosCard
              key={index}
              {...recurso}
              index={index}
              expandedCardIndex={expandedCardIndex}
              setExpandedCardIndex={setExpandedCardIndex}
            />
          ))}
        </RecursosElectronicosGrid>
      </PageContainer>
    </>
  );
};
