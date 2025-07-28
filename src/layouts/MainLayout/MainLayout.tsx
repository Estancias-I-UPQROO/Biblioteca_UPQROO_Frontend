import { Outlet } from "react-router-dom"
import { Footer, Navbar, RedesSociales, LibraryAssistant } from "../../components"

export const MainLayout = () => {
    return (
        <>
            <Navbar />

            <Outlet />
            <RedesSociales
                redes={[
                    { id: '1', nombre: 'Facebook', icono: 'fa-facebook', link: 'https://facebook.com/upqroo' },
                    { id: '2', nombre: 'X', icono: 'fa-x', link: 'https://x.com/upqroo' },
                    { id: '3', nombre: 'Instagram', icono: 'fa-instagram', link: 'https://www.instagram.com/up_qroo/' },
                    { id: '4', nombre: 'YouTube', icono: 'fa-youtube', link: 'https://www.youtube.com/@prensaydifusionupqroo4898' },
                    { id: '5', nombre: 'Tiktok', icono: 'fa-tiktok', link: 'https://www.tiktok.com/@upqroo' },
                ]}
            />
            <LibraryAssistant />
            <Footer />
        </>
    )
}