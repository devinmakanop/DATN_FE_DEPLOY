import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Space, Badge } from 'antd';
import "./login.css";

const LoginClient = () => {
  const API_CLIENT = process.env.REACT_APP_API_URL_CLIENT;
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const loginData = {
      username,
      password,
    };

    try {
      const response = await fetch(`${API_CLIENT}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData),
      });

      const data = await response.json();

      if (response.ok) {
        const { token, user } = data;

        if (token && user) {
          // Lưu token và thông tin user vào localStorage
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(user));

          // Chuyển hướng sang trang chủ
          navigate('/');
        } else {
          setShowErrorAlert(true);
        }
      } else {
        setShowErrorAlert(true);
      }
    } catch (error) {
      console.error('Lỗi hệ thống:', error);
      setShowErrorAlert(true);
    }
  };

  const handleRegister = () => {
    navigate("/register");
  };

  return (
    <div className="login-box-client">
      <h3>Đăng nhập</h3>
      <form onSubmit={handleLogin}>
        <div>
          <input
            placeholder='Tài khoản'
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className='mt-3' style={{ position: "relative" }}>
          <input
            placeholder='Mật khẩu'
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Space direction="vertical" style={{ position: "absolute", width: '240px', left: "39%", top: "50px" }}>
            {showErrorAlert && (
              <Badge
                key="red"
                color="red"
                text={<span style={{ color: "red" }}>Sai tên đăng nhập hoặc mật khẩu</span>}
              />
            )}
          </Space>
        </div>
        <button className='btn-loginClient' style={{ marginTop: "35px" }} type="submit">
          Đăng nhập
        </button>
      </form>
      <div className='mt-2'>
        Bạn chưa có tài khoản?
        <span className='text-register' onClick={handleRegister}> Đăng ký ngay</span>
      </div>
    </div>
  );
};

export default LoginClient;
