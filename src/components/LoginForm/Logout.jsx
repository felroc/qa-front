import { useEffect } from "react"
import { useAuth } from "../../AuthContext";


const LogOut = () => {

    const { logout } = useAuth();
    
    useEffect( () => {
        logout();        
    })
    
    return (
        <>
            <h1>Log out</h1>
            <hr></hr>
            <p>
                La sesión ha sido cerrada correctamente.
            </p>
        </>
    )
}

export default LogOut