import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  PageContainer,
  PageHeader,
  RecursosElectronicosCard,
  RecursosElectronicosGrid,
} from "../../components";
import axios from "axios";
const BASE_URL_C = import.meta.env.VITE_API_URL_Categorias_Recursos_Electronicos;
const BASE_URL_R = import.meta.env.VITE_API_URL_Recursos_Electronicos;

type RelacionCategoriaRecurso = {
  ID_Rel_Categorias_Recursos_Electronicos: string;
  ID_Recurso_Electronico: string;
  ID_Categoria_Recursos_Electronicos: string;
  createdAt: string;
  updatedAt: string;
  Recursos_Electronicos: {
    ID_Recurso_Electronico: string;
    Nombre: string;
    Descripcion: string;
    Imagen_URL: string;
    Enlace_Pagina: string;
    Activo: boolean;
    createdAt: string;
    updatedAt: string;
  };
};

type Categoria = {
  ID_Categoria_Recursos_Electronicos: string;
  Nombre: string;
  Activo: boolean;
};

export const CategoriaPage = () => {
  const { id_categoria } = useParams<{ id_categoria: string }>();
  const navigate = useNavigate();

  const [relaciones, setRelaciones] = useState<RelacionCategoriaRecurso[]>([]);
  const [categoria, setCategoria] = useState<Categoria | null>(null);
  const [loadingRecursos, setLoadingRecursos] = useState(true);
  const [loadingCategoria, setLoadingCategoria] = useState(true);
  const [errorRecursos, setErrorRecursos] = useState<string | null>(null);
  const [expandedCardIndex, setExpandedCardIndex] = useState<number | null>(null);

  // Verificar si la categoría existe y está activa
useEffect(() => {
  if (!id_categoria) return;

  setLoadingCategoria(true);

  axios
    .get(`${BASE_URL_C}/get-categoria/${id_categoria}`)
    .then(({ data }: { data: Categoria }) => {
      if (!data.Activo) {
        navigate('/', { replace: true });
        return;
      }
      setCategoria(data);
      setLoadingCategoria(false);
    })
    .catch((error) => {
      console.error('Error al obtener la categoría:', error);
      navigate('/', { replace: true });
    });
}, [id_categoria, navigate]);

  // Obtener recursos electrónicos de la categoría
  useEffect(() => {
    if (!id_categoria) return;

    setLoadingRecursos(true);
    setErrorRecursos(null);

    axios
      .get(`${BASE_URL_R}/get-recursos/${id_categoria}`)
      .then(({ data }: { data: RelacionCategoriaRecurso[] }) => {
        setRelaciones(data);
        setLoadingRecursos(false);
      })
      .catch((error) => {
        console.error('Error al obtener los recursos electrónicos:', error);
        setErrorRecursos(error.message || "Error al cargar recursos");
        setLoadingRecursos(false);
      });
  }, [id_categoria]);
   

  const nombreCategoria = categoria?.Nombre || "Categoría";

  return (
    <>
      <PageHeader>{loadingCategoria ? "Cargando..." : nombreCategoria}</PageHeader>

      <PageContainer>
        {loadingRecursos && <p className="text-center text-gray-600">Cargando recursos...</p>}
        {errorRecursos && <p className="text-center text-red-600">Error: {errorRecursos}</p>}
        {!loadingRecursos && !errorRecursos && relaciones.length === 0 && (
          <p className="text-center text-gray-600">No hay recursos para esta categoría.</p>
        )}

        {!loadingRecursos && !errorRecursos && relaciones.length > 0 && (
          <RecursosElectronicosGrid>
            {relaciones.map((relacion, index) => {
              const recurso = relacion.Recursos_Electronicos;
              return (
                <RecursosElectronicosCard
                  key={recurso.ID_Recurso_Electronico}
                  title={recurso.Nombre}
                  description={recurso.Descripcion}
                  image={`${import.meta.env.VITE_API_URL}${recurso.Imagen_URL}`}
                  siteLink={recurso.Enlace_Pagina}
                  index={index}
                  expandedCardIndex={expandedCardIndex}
                  setExpandedCardIndex={setExpandedCardIndex}
                />
              );
            })}
          </RecursosElectronicosGrid>
        )}
      </PageContainer>
    </>
  );
};