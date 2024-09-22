import React, { useContext, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { AuthContext } from '../context/AuthProvider';
import { Image } from 'react-bootstrap';
import '../Sidebar.css';
import {
  CDBSidebar,
  CDBSidebarContent,
  CDBSidebarFooter,
  CDBSidebarHeader,
  CDBSidebarMenu,
  CDBSidebarMenuItem,
} from 'cdbreact';

export default function Sidebar(props) {

  let { permissions } = useContext(AuthContext);

  const [dropdownOpen2, setDropdownOpen2] = useState(false);
  const toggleDropdown = () => { setDropdownOpen2(!dropdownOpen2); };
  const { loginData, sidebarVisibility } = useContext(AuthContext);
  const isSidebarVisible = sidebarVisibility;

  const styles = {
    dropdownMenu: {
      paddingLeft: '20px',
    },
    dropdownToggle: {
      cursor: 'pointer',
      height: '10px'
    },
    dropdownItem: {
      color: 'white',
      textDecoration: 'none',
    },
    activeClicked: {
      backgroundColor: '#555',
    },
    hoverEffect: {
      backgroundColor: '#444',
    },
    fa_icon: {
      marginLeft: 'auto',
      fontSize: '12px'
    }
  };

  // const roleData = JSON.parse(localStorage.getItem('permissionData')) || [];



  const hasUpdatePermission = permissions?.some(role => role.name === 'Admin' || role.name === 'Super Admin');

  return (
    <div className='fontFamilyDesign' style={{ display: 'flex', height: '100vh' }}>
      {isSidebarVisible &&
        <CDBSidebar>
          <CDBSidebarHeader>
            <Image src='/images/stock.png' style={{ height: '200px' }}></Image>
            <b className='logoStyle'>Stock Management</b>
          </CDBSidebarHeader>
          <CDBSidebarContent className="sidebar-content">
            <CDBSidebarMenu className="sidebar-menu">
              <Link exact to={`/Home`} activeClassName="activeClicked">
                <CDBSidebarMenuItem className='sidebarItem navItems'>
                  <i className="fa fa-home sidebarIcon" style={{ marginRight: '9px' }}></i>
                  Home
                </CDBSidebarMenuItem>
              </Link>
              <NavLink exact to="/User" activeClassName="activeClicked">
                <CDBSidebarMenuItem className='sidebarItem navItems' style={{ marginRight: '14px' }}>
                  <i className="fa fa-user sidebarIcon"></i>
                  Users
                </CDBSidebarMenuItem>
              </NavLink>

              <NavLink exact to="/branch" activeClassName="activeClicked">
                <CDBSidebarMenuItem className='sidebarItem navItems'>
                  <i className="fa fa-code-branch sidebarIcon"></i>
                  Branches
                </CDBSidebarMenuItem>
              </NavLink>

              <NavLink exact to="/productCategory" activeClassName="activeClicked">
                <CDBSidebarMenuItem className='sidebarItem navItems '>
                  <i className="fa-solid fa-layer-group sidebarIcon" style={{ fontSize: '11px' }}></i>
                  Categories
                </CDBSidebarMenuItem>
              </NavLink>

              <NavLink exact to="/product" activeClassName="activeClicked">
                <CDBSidebarMenuItem className='sidebarItem navItems'>
                  <i className="fa-brands fa-product-hunt sidebarIcon"></i>
                  Products
                </CDBSidebarMenuItem>
              </NavLink>

              <NavLink exact to="/order" activeClassName="activeClicked">
                <CDBSidebarMenuItem className='sidebarItem navItems'>
                  <i className="fa fa-list-ol sidebarIcon"></i>
                  Orders
                </CDBSidebarMenuItem>
              </NavLink>

              <NavLink exact to="/vendor" activeClassName="activeClicked">
                <CDBSidebarMenuItem className='sidebarItem navItems'>
                  <i className="fa fa-store sidebarIcon" style={{ fontSize: '11px' }}></i>
                  Vendors
                </CDBSidebarMenuItem>
              </NavLink>

              <NavLink exact to="/issue" activeClassName="activeClicked">
                <CDBSidebarMenuItem className='sidebarItem navItems'>
                  <i className="fa fa-hand-holding sidebarIcon"></i>
                  Provision
                </CDBSidebarMenuItem>
              </NavLink>

              {hasUpdatePermission ? (
                <>
                  <CDBSidebarMenuItem
                    subMenu
                    title="Role"
                    onClick={toggleDropdown}
                    className={'sidebar-menu sidebarItem navItems'}
                    style={{ fontSize: '10px' }}
                  >
                    <i className="fa fa-tasks sidebarIcon"></i>
                    Settings
                    <i className={`fa fa-chevron-${dropdownOpen2 ? 'up' : 'down'}`} style={styles.fa_icon}></i>
                  </CDBSidebarMenuItem>
                  {dropdownOpen2 ? (
                    <div className="dropdown" style={{ marginLeft: '20px' }}>
                      <NavLink exact to="/permission" activeClassName="activeClicked">
                        <CDBSidebarMenuItem className='navItems'>
                          <i className="fa fa-lock sidebarIcon" style={{ fontSize: '11px' }}></i>
                          Permissions
                        </CDBSidebarMenuItem>
                      </NavLink>
                      <NavLink exact to="/Role" activeClassName="activeClicked">
                        <CDBSidebarMenuItem className='navItems'>
                          <i className="fa fa-users sidebarIcon" style={{ fontSize: '11px' }}></i>
                          Roles
                        </CDBSidebarMenuItem>
                      </NavLink>
                      <NavLink exact to="/modules" activeClassName="activeClicked">
                        <CDBSidebarMenuItem className='navItems'>
                          <i className='fa fa-list-alt sidebarIcon'></i>
                          Modules
                        </CDBSidebarMenuItem>
                      </NavLink>
                    </div>
                  ) : <div className='dropdown'></div>}
                </>
              ):(
                <div></div>
              )
            }
            </CDBSidebarMenu>
          </CDBSidebarContent>
          <CDBSidebarFooter style={{ textAlign: 'center' }}>
            <div style={{ padding: '20px 5px' }}>
              <p>Copyright © 2024</p>
            </div>
          </CDBSidebarFooter>
        </CDBSidebar>
      }
    </div >
  );
}
