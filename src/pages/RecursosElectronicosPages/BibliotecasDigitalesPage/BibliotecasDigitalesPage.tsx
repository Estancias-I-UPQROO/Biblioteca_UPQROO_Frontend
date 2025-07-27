import { PageContainer, PageHeader, RecursosElectronicosCard, RecursosElectronicosGrid } from "../../../components"
import { useState } from "react";
export const BibliotecasDigitalesPage = () => {

    const [expandedCardIndex, setExpandedCardIndex] = useState<number | null>(null);
    
      const recursos = [
        {
          title: "Chicago Journal",
          description: "Lorem ipsum dolor sit amet, consectetur",
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
          <PageHeader>Bibliotecas Digitales</PageHeader>
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
    