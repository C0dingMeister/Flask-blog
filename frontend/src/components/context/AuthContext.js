import React, {useState, createContext, useEffect} from 'react';


const AuthContext = createContext()

export const AuthProvider = ({children}) => {
    const [auth, setAuth] = useState();
    const [isAuthenticated, setIsAuthenticated] = useState(localStorage.getItem('access_token')!==null)
    useEffect(()=>{
      (async()=>{
        console.log("useEffect running from context")
        const user = await getUser()
        setAuth(user)
      })()

    },[])
    return (
        <AuthContext.Provider value={{auth, setAuth,isAuthenticated, setIsAuthenticated}}>
            {children}
        </AuthContext.Provider>
    );
}

export const getCookie = (name)=>{
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

export const getUser = async()=>{
     
      console.log("getting user from context")
     
      const response = await fetch(process.env.API_URL+'/api/getuser', {
        headers: {
          'X-CSRF-TOKEN': getCookie('csrf_access_token'),
        },
        credentials: 'include'
      })
      if (response.ok) {
        const result = await response.json()
        return result.user
      }
      else {
        return null
      }
     
      
          
        
}

export const logout = async()=>{
  const response = await fetch(process.env.API_URL+'/api/logout',{
    method:'POST',
    credentials:'include'
  })
  const result = await response.json()
  return result.msg
}

export default AuthContext;
