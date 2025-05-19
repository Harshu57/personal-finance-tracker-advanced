import React, { useEffect, useState } from "react";
import "./styles.css";
import { Link, useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebase";
import userSvg from "../../assets/user.svg";
import { Dropdown, Menu } from "antd";
import { UserOutlined, LogoutOutlined, DashboardOutlined, MenuOutlined } from "@ant-design/icons";

function Header() {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  function logout() {
    auth.signOut();
    navigate("/");
  }

  useEffect(() => {
    if (!user) {
      navigate("/");
    } else {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const userMenu = (
    <Menu>
      <Menu.Item key="1" icon={<DashboardOutlined />} onClick={() => navigate("/dashboard")}>
        Dashboard
      </Menu.Item>
      <Menu.Item key="2" icon={<LogoutOutlined />} onClick={logout}>
        Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <div className="navbar">
      <div className="navbar-container">
        <p className="navbar-heading">
          <span className="app-title">Personal Finance Tracker</span>
        </p>
        
      {user ? (
          <div className="user-menu-container">
            <div className="mobile-menu-icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              <MenuOutlined />
            </div>
            <div className={`navbar-menu ${isMobileMenuOpen ? 'active' : ''}`}>
              <Dropdown overlay={userMenu} trigger={['click']} placement="bottomRight">
                <div className="user-profile">
            <img
              src={user.photoURL ? user.photoURL : userSvg}
              width={user.photoURL ? "32" : "24"}
              style={{ borderRadius: "50%" }}
                    alt="User Avatar"
            />
                  <span className="user-name">{user.displayName || user.email}</span>
                </div>
              </Dropdown>
            </div>
          </div>
      ) : (
        <></>
      )}
      </div>
    </div>
  );
}

export default Header;
