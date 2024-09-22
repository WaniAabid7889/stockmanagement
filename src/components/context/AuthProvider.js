import { useState, createContext, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {


    const [loginData, setLoginData] = useState(localStorage.getItem('token') && jwtDecode(localStorage.getItem('token')).user);
    const [loginStatus, setLoginStatus] = useState(localStorage.getItem('loginStatus') && localStorage.getItem('loginStatus'));
    const [sidebarVisibility, setSidebarVisibility] = useState(true);
    const [token, setToken] = useState({});
    const [permissions, setPermissions] = useState(localStorage.getItem('token') && jwtDecode(localStorage.getItem('token')).permission);

    const login = (token) => {
        const data = jwtDecode(token);
        console.log('Token Data : ', data);
        localStorage.setItem("token",token);
        setToken(token);
        setLoginData(data.user);
        setLoginStatus(true);
        setPermissions(data.permission); 
    };

    useEffect(() => {
        localStorage.setItem('loginStatus', loginStatus);
        // localStorage.setItem('loginData', JSON.stringify(loginData));
    }, [loginStatus,loginData]);

    const logout = () => {
        localStorage.clear();
    };

  
    return (
        <AuthContext.Provider value={{ loginData, setLoginData, sidebarVisibility, setSidebarVisibility, login, logout, loginStatus,token, setToken, setLoginStatus,permissions}}>
            {children}
        </AuthContext.Provider>
    );
};
