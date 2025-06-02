import React, { useState, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import Cookies from 'js-cookie'; // nếu bạn dùng cookie, còn không có thể bỏ

const PrivateRoute = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkToken = async () => {
      const token = localStorage.getItem('token'); // hoặc Cookies.get('token') nếu bạn dùng cookie
      if (token) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
      setLoading(false); // đã kiểm tra xong
    };

    checkToken();
  }, []);

  if (loading) {
    return <div>Đang kiểm tra xác thực...</div>; // hoặc spinner
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/admin/login" />;
};

export default PrivateRoute;
