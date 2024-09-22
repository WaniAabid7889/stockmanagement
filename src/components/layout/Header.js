import React, { useState, useContext } from 'react';
import { NavLink,useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthProvider';
import { Image } from 'react-bootstrap';


const Header = () => {
    const { loginData, setSidebarVisibility, logout, } = useContext(AuthContext);
    const [showSidebar, setShowSidebar] = useState(true);
    const navigate = useNavigate();

    const handleLogoutClick = () => {
       logout();
       navigate('/login');   
    };

    const handelSidebar = () => {
        setShowSidebar(!showSidebar)
        setSidebarVisibility(!showSidebar)
    }

    return (
        <>
            <nav className={`navbar navbar-expand-lg navbar-light`} style={{ padding: '6px', background: 'rgb(17, 24, 39)',marginBottom:'20px', height: '45px' }}>
                <div className="container-fluid">

                    {/* <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button> */}
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0 d-flex align-items-center" id="navbarNav">
                            <li className="nav-item mx-2" onClick={handelSidebar} style={{ border: '2px solid white', padding: '6px 6px 0px', borderRadius: '3px', position: 'relative', top: '1px', left: '-20px',height:"30px" }}>
                                <i className="fa-solid fa-bars" style={{ color: 'white', fontSize: '14px' }}></i>
                            </li>
                            <li className="nav-item mx-2">
                                <NavLink to="/profile" style={{ textDecoration: 'none' }}>
                                    <div className="d-flex justify-content-center align-items-center" style={{borderRadius:"20px",paddingRight:"10px",position: 'relative', left: '-20px' }} >
                                        <Image src='/images/user.png' style={{marginRight:"10px", height: "30px", borderRadius: "100%"}} /><span  style={{color:"white",fontSize:"16px"}}>{loginData.name}</span>
                                        &nbsp;&nbsp;<button className={'fontFamilyDesign'} style={{ border:"0px",borderRadius:"10px",backgroundColor:"blue"}}>{loginData.role_name}</button>
                                    </div>
                                </NavLink>
                            </li>
                        </ul>

                        <div className={`form-check form-switch mx-4 `}>
                            <i className="fa-solid fa-bell text-white mx-4" style={{ fontSize: "15px" }} aria-hidden="true"></i>
                            <span style={{ fontSize: "16px", color: 'white' }}>Logout&nbsp;<i className="fa fa-sign-out text-white " style={{ fontSize: '16px',height:"20px" }} aria-hidden="true" onClick={handleLogoutClick}></i></span>
                        </div>
                    </div>
                </div>
            </nav>
        </>
    );
};



export default Header;
