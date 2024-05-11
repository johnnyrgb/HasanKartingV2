import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Input, Button, Form, Checkbox, notification, Typography } from "antd";
import loginObject from "../entities/loginObject";
import userObject from "../entities/userObject";
import axios from 'axios';

const { Text } = Typography;

// Определение типа пропсов для компонента Login
interface PropsType {
  setUser: (value: userObject) => void;
}

const Login = ({ setUser }: PropsType) => {
  const [username, setUsername] = useState<string>(""); // Состояние для имени пользователя
  const [password, setPassword] = useState<string>(""); // Состояние для пароля
  const [rememberMe, setRememberMe] = useState<boolean>(false); // Состояние для флага "Запомнить меня"
  const navigate = useNavigate(); // Перенаправление пользователя

  const handleSubmit = () => {  // Обработчик отправки формы
    const model: loginObject = { 
      username,
      password,
      rememberMe,
    };

    const login = async () => { // Функция для выполнения запроса на сервер

      await axios
        .post("https://localhost:7198/api/Account/login", model, { // Отправка POST-запроса на сервер с использованием axios
          withCredentials: true, // включить куки в запросы
        })
        .then(function (response) { // Обработка различных статусов ответа сервера
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
            notification.warning({
              message: "Неверные данные",
              placement: "top",
              duration: 3,
            });
          } 
        })
        .catch(function (error) { // Обработка ошибок запроса
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
    login(); // Вызов функции login
  };

  return (
    <>
      <Form onFinish={handleSubmit}>
        <Form.Item
          name="usernameItem"
          label="Имя пользователя"
          hasFeedback={false}
          rules={[
            {
              required: true,
              message: "Введите имя пользователя",
            },
            () => ({ // Валидация имени пользователя
              validator(_, value) {
                if (/^[a-zA-Z0-9_]*$/.test(value)) return Promise.resolve();
                else {
                  return Promise.reject();
                }
              },
            }),
          ]}
        >
          <Input
            name="usernameInput"
            onChange={(el) => setUsername(el.target.value)}
            placeholder="Имя пользователя"
            allowClear={true}
          />
        </Form.Item>
        <Form.Item
          name="passwordItem"
          label="Пароль"
          hasFeedback={false}
          rules={[
            {
              required: true,
              message: "Введите пароль",
            },
            () => ({ // Валидация пароля
              validator(_, value) {
                if ( 
                  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(
                    value
                  )
                )
                  return Promise.resolve();
                else {
                  return Promise.reject();
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
        {/* Флажок "Запомнить меня" */}
        <Form.Item name="rememberMeItem">
          <Checkbox
            value={rememberMe}
            onChange={(el) => setRememberMe(el.target.checked)}
          >
            Запомнить меня
          </Checkbox>
        </Form.Item>
        {/* Кнопка "Войти" и ссылка на страницу регистрации */}
        <Form.Item>
          <Button htmlType="submit" type="primary">
            Войти
          </Button>
          <Text>
            {" "}
            Еще нет аккаунта? <Link to="/register">Зарегистрироваться.</Link>
          </Text>
        </Form.Item>
      </Form>
    </>
  );
};

export default Login;
