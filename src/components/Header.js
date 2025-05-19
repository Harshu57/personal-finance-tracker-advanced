import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { signOut } from "firebase/auth";
import { Dropdown, Menu, Avatar, Badge, Modal, Form, Input, Button, InputNumber } from "antd";
import {
  LogoutOutlined,
  UserOutlined,
  SettingOutlined,
  BellOutlined,
  FileTextOutlined,
  SyncOutlined,
  BarChartOutlined,
  BankOutlined,
  LockOutlined,
} from "@ant-design/icons";
import { toast } from "react-toastify";
import profilePic from '../assets/default-profile.png';

const Header = () => {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showFinancialGoalsModal, setShowFinancialGoalsModal] = useState(false);
  const [form] = Form.useForm();
  const [goalsForm] = Form.useForm();
  
  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        toast.success("Logged out successfully");
        navigate("/");
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  const showProfile = () => {
    setShowProfileModal(true);
  };
  
  const showGoals = () => {
    setShowFinancialGoalsModal(true);
  };
  
  const handleProfileSubmit = (values) => {
    // In a real app, this would update the user profile in the database
    toast.success("Profile updated successfully!");
    setShowProfileModal(false);
  };
  
  const handleGoalsSubmit = (values) => {
    // In a real app, this would save the financial goals in the database
    toast.success("Financial goals saved successfully!");
    setShowFinancialGoalsModal(false);
  };

  const menu = (
    <Menu>
      <Menu.Item key="profile" onClick={showProfile} icon={<UserOutlined />}>
        Profile Settings
      </Menu.Item>
      <Menu.Item key="goals" onClick={showGoals} icon={<BarChartOutlined />}>
        Financial Goals
      </Menu.Item>
      <Menu.Item key="bank" icon={<BankOutlined />}>
        Connected Accounts
      </Menu.Item>
      <Menu.Item key="security" icon={<LockOutlined />}>
        Security Settings
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout" onClick={handleSignOut} icon={<LogoutOutlined />} danger>
        Log Out
      </Menu.Item>
    </Menu>
  );

  return (
    <div className="navbar">
      <Link to="/">
        <p className="navbar-heading">Personal Finance Tracker</p>
      </Link>
      <div className="navbar-right">
        {user && (
          <>
            <Badge count={2} className="notification-badge">
              <BellOutlined className="header-icon" />
            </Badge>
            <Dropdown overlay={menu} trigger={["click"]} placement="bottomRight">
              <div className="profile-avatar">
                <Avatar 
                  src={user.photoURL || profilePic} 
                  alt={user.displayName || user.email}
                  size="large"
                >
                  {!user.photoURL && ((user.displayName || user.email || "").charAt(0).toUpperCase())}
                </Avatar>
                <span className="user-name">{user.displayName ? user.displayName.split(" ")[0] : user.email.split("@")[0]}</span>
              </div>
            </Dropdown>
          </>
        )}
      </div>

      {/* Profile Settings Modal */}
      <Modal
        title="Profile Settings"
        visible={showProfileModal}
        onCancel={() => setShowProfileModal(false)}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleProfileSubmit}
          initialValues={{
            name: user?.displayName || "",
            email: user?.email || "",
            currency: "INR",
            profilePhoto: "",
          }}
        >
          <div className="profile-photo-container">
            <Avatar
              size={100}
              src={user?.photoURL || profilePic}
            >
              {!user?.photoURL && ((user?.displayName || user?.email || "").charAt(0).toUpperCase())}
            </Avatar>
            <Form.Item name="profilePhoto" className="profile-upload">
              <Input type="file" accept="image/*" />
            </Form.Item>
          </div>
          
          <Form.Item
            label="Full Name"
            name="name"
            rules={[{ required: true, message: "Please enter your name" }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Your full name" />
          </Form.Item>
          
          <Form.Item label="Email" name="email">
            <Input prefix={<UserOutlined />} disabled />
          </Form.Item>
          
          <Form.Item label="Preferred Currency" name="currency">
            <Input prefix={<BankOutlined />} />
          </Form.Item>
          
          <Form.Item>
            <Button type="primary" htmlType="submit" className="btn-blue" block>
              Save Settings
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Financial Goals Modal */}
      <Modal
        title="Financial Goals"
        visible={showFinancialGoalsModal}
        onCancel={() => setShowFinancialGoalsModal(false)}
        footer={null}
      >
        <Form
          form={goalsForm}
          layout="vertical"
          onFinish={handleGoalsSubmit}
          initialValues={{
            monthlySavings: 10000,
            emergencyFund: 50000,
            yearlyBudget: 500000,
          }}
        >
          <Form.Item
            label="Monthly Savings Goal (₹)"
            name="monthlySavings"
            rules={[{ required: true, message: "Please set a savings goal" }]}
          >
            <InputNumber 
              formatter={value => `₹ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => value.replace(/₹\s?|(,*)/g, '')}
              style={{ width: '100%' }}
            />
          </Form.Item>
          
          <Form.Item
            label="Emergency Fund Goal (₹)"
            name="emergencyFund"
            rules={[{ required: true, message: "Please set emergency fund goal" }]}
          >
            <InputNumber 
              formatter={value => `₹ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => value.replace(/₹\s?|(,*)/g, '')}
              style={{ width: '100%' }}
            />
          </Form.Item>
          
          <Form.Item
            label="Yearly Budget Limit (₹)"
            name="yearlyBudget"
            rules={[{ required: true, message: "Please set yearly budget" }]}
          >
            <InputNumber 
              formatter={value => `₹ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => value.replace(/₹\s?|(,*)/g, '')}
              style={{ width: '100%' }}
            />
          </Form.Item>
          
          <Form.Item>
            <Button type="primary" htmlType="submit" className="btn-blue" block>
              Save Financial Goals
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Header; 