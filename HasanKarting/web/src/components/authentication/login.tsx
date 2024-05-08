import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Input, Button, Form, Checkbox, notification, Typography } from "antd";
import loginObject from "../entities/loginObject";
import userObject from "../entities/userObject";
import axios from 'axios';

const { Text } = Typography;
interface PropsType {
  setUser: (value: userObject) => void;
}

const Login = ({ setUser }: PropsType) => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleSubmit = () => {
    const model: loginObject = {
      username,
      password,
      rememberMe,
    };

    const login = async () => {
      const requestOptions = {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Access-Control-Allow-Credentials": "true"
         },
        body: JSON.stringify(model),
      };

      try {
        const response = await axios.post('https://localhost:7198/api/Account/login', model, {
          withCredentials: true, // включить куки в запросы
        });
    
        if (response.data.error) {
          console.log(response.data.error);
    
          notification.error({
            message: `Ошибка входа: ${response.data.error}`,
            placement: "bottom",
            duration: 3,
          });
        } else {
          notification.success({
            message: "Вы успешно вошли!",
            placement: "bottom",
            duration: 3,
          });
          navigate("/");
        }
      } catch (error) {
        notification.error({
          message: "Критическая ошибка!",
          placement: "bottom",
          duration: 3,
        });
      }
    };
    login();
  };

  return (
    <>
      <Form onFinish={handleSubmit}>
        <Form.Item
          name="usernameItem"
          label="Имя пользователя"
          hasFeedback={true}
          rules={[
            {
              required: true,
              message: "Введите имя пользователя",
            },
            () => ({
              validator(_, value) {
                if (/^[a-zA-Z0-9_]*$/.test(value)) return Promise.resolve();
                else {
                  return Promise.reject(); //TODO: вернуть ошибку
                }
              },
            }),
          ]}
        >
          <Input.TextArea
            name="usernameInput"
            onChange={(el) => setUsername(el.target.value)}
            placeholder="Имя пользователя"
            allowClear={true}
          />
        </Form.Item>
        <Form.Item
          name="passwordItem"
          label="Пароль"
          hasFeedback={true}
          rules={[
            {
              required: true,
              message: "Введите пароль",
            },
            () => ({
              validator(_, value) {
                if (
                  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(
                    value
                  )
                )
                  return Promise.resolve();
                else {
                  return Promise.reject(); //TODO: вернуть ошибку
                }
              },
            }),
          ]}
        >
          <Input.Password
            name="passwordInput"
            onChange={(el) => setPassword(el.target.value)}
            placeholder="Пароль"
            allowClear={true}
          />
        </Form.Item>
        <Form.Item name="rememberMeItem">
          <Checkbox
            value={rememberMe}
            onChange={(el) => setRememberMe(el.target.checked)}
          >
            Запомнить меня
          </Checkbox>
        </Form.Item>
        <Form.Item>
          <Button htmlType="submit" type="primary">
            Войти
          </Button>
          <Text>
            {" "}
            Еще нет аккаунта? <Link to="/login">Зарегистрироваться.</Link>
          </Text>
        </Form.Item>
      </Form>
    </>
  );
};

export default Login;
