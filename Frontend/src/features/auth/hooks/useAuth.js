import { useContext, useEffect } from "react";
import { AuthContext } from "../auth.context";
import { login,register,logout,getMe } from "../services/auth.api";

export const useAuth = () =>{
    const context = useContext(AuthContext)
    const {user, setUser, loading, setLoading} = context


    const handleLogin = async({email,password}) =>{
    setLoading(true)
    try {
        const data = await login({email,password})
        if (data && data.user) {
            setUser(data.user)
            return true
        } else {
            throw new Error("Login failed - no user data returned")
        }
    } catch (error) {
        console.error("Login error:", error);
        throw error
    }finally{
   setLoading(false)
    }
    }

    const handleRegister = async({username,email,password}) =>{
        setLoading(true)
        try {
             const data = await register({username,email,password})
             if (data && data.user) {
                setUser(data.user)
                return true
             } else {
                throw new Error("Registration failed - no user data returned")
             }
        } catch (error) {
            console.error("Register error:", error);
            throw error
        }finally{
        setLoading(false)
        }
       
    }

    const handleLogout = async() =>{
        setLoading(true)
        try {
             const data = await logout()
             setUser(null)
             return true
        } catch (error) {
            console.error("Logout error:", error);
            setUser(null)
            return false
        }finally{
              setLoading(false)
        }
    }
    
    useEffect(() => {
        const getAndSetUser = async () => {
            try {
                const data = await getMe()
                if (data && data.user) {
                    setUser(data.user)
                } else {
                    setUser(null)
                }
            } catch (error) {
                console.log("Not authenticated:", error.message);
                setUser(null)
            } finally {
                setLoading(false)
            }
        }
        getAndSetUser()
    }, [])

    return {user, loading, handleLogin, handleRegister, handleLogout}
}