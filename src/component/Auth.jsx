import React, {useContext} from 'react'
import {AuthContext} from "../context/AuthContext"
import { Navigate } from 'react-router-dom'

export function Auth({children}) {
    const { userLogin, userLoading } = useContext(AuthContext);
    
  
    if (userLoading) return <h1>Cargando...</h1>
    if (!userLogin) return <Navigate to="/login" />;
    return <>{children}</>;
  };
  