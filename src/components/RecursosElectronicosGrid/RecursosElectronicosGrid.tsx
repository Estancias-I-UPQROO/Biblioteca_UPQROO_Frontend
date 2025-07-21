import './styles.css'

export const RecursosElectronicosGrid = ({ children }: { children: React.ReactNode }) => {
  return (
    <section className="recursos-grid-container">
      <div className="recursos-grid">
        {children}
      </div>
    </section>
  );
};  