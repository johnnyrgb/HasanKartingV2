import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Input, Button, Form, notification, Typography } from "antd";
import registrationObject from "../entities/registrationObject";
import axios from "axios";

const { Text } = Typography;

const Register = () => {
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordConfirmation, setPasswordConfirmation] = useState<string>("");
  const navigate = useNavigate();

  const handleSubmit = () => {
    const model: registrationObject = {
      username,
      email,
      password,
      passwordConfirmation,
    };

    const register = async () => {
      await axios
        .post("https://localhost:7198/api/Account/register", model, {
          withCredentials: true,
        })
        .then(function (response) {
          console.log(response);
          if (response.status === 200) {
            navigate("/login");
            notification.success({
              message: `Аккаунт ${model.username} создан!`,
              placement: "top",
              duration: 3,
            });
          }
          else if (response.status === 201) {
            notification.warning({
              message: `Пользователь с такими данными уже существует`,
              placement: "top",
              duration: 3,
            });
          }
          else if (response.status === 202) {
            notification.warning({
              message: `Введены некорректные данные`,
              placement: "top",
              duration: 3,
            });
          }
        })
        .catch(function (error) {
          console.error(error);
          console.log(error);
          if (error.response) {
            notification.error({
              message: "Ошибка сервера",
              placement: "top",
              duration: 3,
            });
          } else if (error.request) {
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
        })
    };
    register();
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
          <Input
            name="usernameInput"
            onChange={(el) => setUsername(el.target.value)}
            placeholder="Имя пользователя"
            allowClear={true}
            maxLength={25}
            count={{
              show: true,
              max: 25,
            }}
          />
        </Form.Item>
        <Form.Item
          name="emailItem"
          label="Адрес электронной почты"
          hasFeedback={true}
          rules={[
            {
              required: true,
              message: "Введите адрес",
            },
            () => ({
              validator(_, value) {
                if (
                  /^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/.test(value)
                )
                  return Promise.resolve();
                else {
                  return Promise.reject(); //TODO: вернуть ошибку
                }
              },
            }),
          ]}
        >
          <Input
            name="emailInput"
            onChange={(el) => setEmail(el.target.value)}
            placeholder="hasan@karting.com"
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
        <Form.Item
          name="passwordConfirmationItem"
          label="Подтвердите пароль"
          dependencies={["passwordItem"]}
          hasFeedback={true}
          rules={[
            {
              required: true,
              message: "Введите пароль повторно",
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("passwordItem") === value)
                  return Promise.resolve();
                else {
                  return Promise.reject(); //TODO: вернуть ошибку
                }
              },
            }),
          ]}
        >
          <Input.Password
            name="passwordConfirmationInput"
            onChange={(el) => setPasswordConfirmation(el.target.value)}
            placeholder="Повторите пароль"
            allowClear={true}
          />
        </Form.Item>
        <Form.Item>
          <Button htmlType="submit" type="primary">
            Зарегистрироваться
          </Button>
        </Form.Item>
        <Text>
          {" "}
          Уже есть аккаунт? <Link to="/login">Войти.</Link>
        </Text>
      </Form>
    </>
  );
};

export default Register;
