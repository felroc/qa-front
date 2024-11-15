import { useEffect } from "react"
import { useAuth } from "../../AuthContext";


const LogOut = () => {

    const { logout, setUser } = useAuth();
    
    useEffect( () => {
        logout();        
        setUser(null);
        localStorage.removeItem('user');
        const storedUser = localStorage.getItem('user');
        console.log('storedUser: ',storedUser)
    },[])
    
    return (
        <>
            <h1>Cierre de sesión</h1>
            <hr></hr>
            <p>
                La sesión ha sido cerrada correctamente.
            </p>
        </>
    )
}

export default LogOut