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

      await axios
        .post("https://localhost:7198/api/Account/login", model, {
          withCredentials: true, // включить куки в запросы
        })
        .then(function (response) {
          if (response.status === 200) {
            console.log(response);
            setUser(response.data.responseUser);
            navigate("/");
            notification.success({
              message: `Добро пожаловать, ${response.data.responseUser.username}!`,
              placement: "top",
              duration: 3,
            });
          }
          else if (response.status === 201) {
            notification.error({
              message: "Неверные данные",
              placement: "top",
              duration: 3,
            });
          } 
        })
        .catch(function (error) {
          console.log(error);
          if (error.request) {
            notification.error({
              message: "Ошибка при отправке данных",
              placement: "top",
              duration: 3,
            });
          } else {
            notification.error({
              message: "Неизвестная ошибка",
              placement: "top",
              duration: 3,
            });
          }
        });
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
