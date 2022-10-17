import React, { useContext } from 'react'
import { Navigate, Outlet} from 'react-router-dom'
import AuthContext from './context/AuthContext'

function PublicRoute() {
    const {auth} = useContext(AuthContext)
    return (
        auth ? <Navigate to={'/user'}/> : <Outlet/>
    )
}

export default PublicRoute