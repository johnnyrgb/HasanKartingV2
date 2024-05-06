import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Input, Button, Form, notification, Typography } from "antd";
import registrationObject from "../entities/registrationObject";

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
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(model),
      };

      const response = await fetch(`api/Account/register`, requestOptions);

      if (response.ok) {
        const data = await response.json();

        if (data.error !== undefined) {
          console.log(data.error);

          notification.error({
            message: `Ошибка регистрации: ${data.error}`,
            placement: "bottom",
            duration: 3,
          });
        } else {
          notification.success({
            message: "Вы успешно зарегистрированы!",
            placement: "bottom",
            duration: 3,
          });
          navigate("/login");
        }
      } else {
        notification.error({
          message: "Критическая ошибка!",
          placement: "bottom",
          duration: 3,
        });
      }
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
          <Input.TextArea
            name="usernameInput"
            onChange={(el) => setUsername(el.target.value)}
            placeholder="Имя пользователя"
            allowClear={true}
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
          <Input.TextArea
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
          hasFeedback={true}
          rules={[
            {
              required: true,
              message: "Введите пароль повторно",
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (getFieldValue("passwordInput") === value)
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
