import { Outlet } from "react-router-dom"
import {  Navbar  } from "../../components"

export const MainAdmin = () => {
    return (
        <>
            <Navbar />

            <Outlet />
        
        </>
    )
}
