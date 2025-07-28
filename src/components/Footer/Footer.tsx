import { Link } from "react-router-dom"
import { PageContainer } from "../PageContainer/PageContainer"
import './styles.css'

const handleSmoothScroll = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};
export const Footer = () => {
    return (
        <footer className="footer-bg">
            <div className="footer-orange-bg">
                <PageContainer>
                    <div className="grid gap-20 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                        <div className="text-white">
                            <img src="/Upqroo_Logo.png" alt="Upqroo Logo" />
                            <p className="text-center my-5">Síguenos en nuestras redes sociales</p>
                        </div>

                        <div className="text-white">
                            <h3 className="font-extrabold uppercase mb-5">Enlaces Útiles</h3>

                            <ul className="mt-5 space-y-5 flex flex-col">
                                <li>
                                <Link to='/base-de-datos' onClick={handleSmoothScroll}>
                                    Base de Datos
                                </Link>
                                </li>
                                <li>
                                <Link to='/bibliotecas-digitales' onClick={handleSmoothScroll}>
                                    Bibliotecas Virtuales
                                </Link>
                                </li>
                                <li>
                                <Link to='/renovacion' onClick={handleSmoothScroll}>
                                    Renovación
                                </Link>
                                </li>
                                <li>
                                <Link to='/ayuda' onClick={handleSmoothScroll}>
                                    Ayuda
                                </Link>
                                </li>
                            </ul>

                        </div>

                        <div className="text-white font-bold space-y-5">
                            <h3 className="font-extrabold uppercase mb-5">Horario de atención</h3>

                            <ul className="font-normal">
                                <p>Lunes - Viernes:</p>
                                <li>
                                    09:00 a.m. - 14:00 p.m.
                                </li>
                                <li>
                                    17:00 p.m. - 20:00 p.m.
                                </li>
                            </ul>

                            <ul className="font-normal">
                                <p>Sábado - Domingo:</p>
                                <li>Cerrado</li>
                            </ul>
                        </div>

                        <div className="text-white font-bold">
                            <h3 className="font-extrabold uppercase mb-5">Contactanos</h3>

                            <ul className="space-y-5 font-normal">
                                <li>
                                    998 283 1859
                                </li>

                                <li>
                                    biblioteca@upqroo.edu.mx
                                </li>

                                <li>
                                    Smza. 255, Mza. 11, Lote 1119-33 77500 Cancún, México
                                </li>
                            </ul>
                        </div>
                    </div>
                </PageContainer>
            </div>
        </footer>
    )
}