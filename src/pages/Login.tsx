import { Button, Form, Input, Typography, message } from 'antd';
import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { authApi } from '../services/apis/authApi';
import '../styles/login.scss'; // Import SCSS styles

const { Title } = Typography;

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const onFinish = async (values: { username: string; password: string }) => {
    setLoading(true);
    try {
      const response:any = await authApi.login(values.username, values.password);
      console.log(response,'Response')
      setLoading(false);
      login(values.username, response?.data?.token);
      navigate('/');
    } catch (error:any) {
      console.log(error.response)
      setLoading(false);
      message.error(error?.response?.data?.message || 'An error occurred. Please try again later.');
    }
  };
  return (
    <div className="login-container">
      <div className='login-wrapper'>
      <Title level={2} ><strong>Chaperone</strong> Admin Login</Title>
      <Form name="login" onFinish={onFinish}>
        <Form.Item name="username" rules={[{ required: true, message: 'Please enter username' }]}>
          <Input placeholder="Username" />
        </Form.Item>
        <Form.Item name="password" rules={[{ required: true, message: 'Please enter password' }]}>
          <Input.Password placeholder="Password" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} className="login-button">
            Log in
          </Button>
        </Form.Item>
      </Form>
      </div>
    </div>
  );
};

export default Login;
