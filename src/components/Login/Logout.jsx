import { useEffect } from "react"
import { useAuth } from "../../AuthContext";
import { useNavigate } from "react-router-dom";

const LogOut = () => {
    const navigate = useNavigate();
    const { logout, setUser } = useAuth();
    
    useEffect( () => {        
        logout();        
    },[])
    
    return (
        <>
            <h1 className="mt-3">Cierre de sesión</h1>
            <hr></hr>
            <p>
                La sesión ha sido cerrada correctamente.
            </p>
            <hr></hr>
            <button type="button" onClick={()=>{navigate('/login')}} className='btn btn-primary'>Login</button>
        </>
    )
}

export default LogOut