import React, { useContext } from 'react'
import AuthContext from './context/AuthContext'
import {useLocation, Navigate, Outlet} from 'react-router-dom'

function RequireAuth() {
    const {auth} = useContext(AuthContext)
    const location = useLocation();
    return (
        auth ? <Outlet/> : <Navigate to={'/login'} state={{from: location}} replace/>
    )
}

export default RequireAuth