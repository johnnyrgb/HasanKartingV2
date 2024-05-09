import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { notification } from "antd";
import userObject from "../entities/userObject";
import axios from "axios";

interface PropsType {
  setUser: (value: userObject | null) => void;
}

const Logout = ({ setUser }: PropsType) => {
  const navigate = useNavigate();

  useEffect(() => {
    const logout = async () => {
      await axios
        .post("https://localhost:7198/api/Account/logout", null, {
          withCredentials: true, // включить куки в запросы
        })
        .then(function (response) {
          if (response.status === 200) {
            setUser(null);
            navigate("/");
            notification.success({
              message: "Вы вышли из аккаунта",
              placement: "top",
              duration: 3,
            });
          }
        })
        .catch(function (error) {
          navigate("/")
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
        });
    };
    logout();
  }, [navigate, setUser]);

  return <></>;
};

export default Logout;
