import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  PageContainer,
  PageHeader,
  RecursosElectronicosCard,
  RecursosElectronicosGrid,
} from "../../components";

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

    fetch(`http://localhost:4000/api/categorias-recursos-electronicos/get-categoria/${id_categoria}`)
      .then(async (res) => {
        if (!res.ok) throw new Error(`Error ${res.status}`);
        return res.json();
      })
      .then((data: Categoria) => {
        if (!data.Activo) {
          navigate("/", { replace: true });
          return;
        }
        setCategoria(data);
        setLoadingCategoria(false);
      })
      .catch(() => {
        navigate("/", { replace: true }); // Si no existe, también redirige
      });
  }, [id_categoria, navigate]);

  // Obtener recursos electrónicos de la categoría
  useEffect(() => {
    if (!id_categoria) return;

    setLoadingRecursos(true);
    setErrorRecursos(null);

    fetch(`http://localhost:4000/api/recursos-electronicos/get-recursos/${id_categoria}`)
      .then(async (res) => {
        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(`Error ${res.status}: ${errorText}`);
        }
        return res.json();
      })
      .then((data: RelacionCategoriaRecurso[]) => {
        setRelaciones(data);
        setLoadingRecursos(false);
      })
      .catch((err) => {
        setErrorRecursos(err.message || "Error al cargar recursos");
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
                  image={`http://localhost:4000${recurso.Imagen_URL}`}
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