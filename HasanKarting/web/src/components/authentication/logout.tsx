import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { notification } from "antd";
import userObject from "../entities/userObject";
import axios from "axios";

interface PropsType {
  // Определение типа пропсов для компонента Logout
  setUser: (value: userObject | null) => void;
}

const Logout = ({ setUser }: PropsType) => {
  const navigate = useNavigate(); // Перенаправление пользователя
  useEffect(() => { // Выполнение логики выхода при монтировании компонента
    const logout = async () => { // Функция для выполнения запроса на сервер
      await axios // Отправка POST-запроса на сервер с использованием axio
        .post("https://localhost:7198/api/Account/logout", null, {
          withCredentials: true, // включить куки в запросы
        })
        .then(function (response) { // Обработка статуса ответа сервера
          if (response.status === 200) {
            setUser(null);

            notification.success({
              message: "Вы вышли из аккаунта",
              placement: "top",
              duration: 3,
            });
            navigate("/");
          }
        })
        .catch(function (error) { // Обработка ошибок запроса
          if (error.response) {
            notification.error({
              message: "Вы не вошли в аккаунт",
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
          navigate("/"); // Перенаправление на главную страницу
        });
    };
    logout(); // Вызов функции logout
  }, [navigate, setUser]);

  return <></>; // Возвращает пустой фрагмент, так как логика выхода выполняется в useEffect
};

export default Logout;
