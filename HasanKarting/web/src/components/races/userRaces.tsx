import React, { useState, useEffect } from "react";
import { Button, Table, notification } from "antd";
import type { TableProps } from "antd";
import raceObject from "../entities/raceObject";
import RaceView from "./raceView";
import axios from "axios";

const MyRaces = () => {
  // Определяем компонент MyRaces

  const [registerRaces, setRegisterRaces] = useState<Array<raceObject>>([]); // Состояние для хранения доступных для регистрации гонок
  const [myRaces, setMyRaces] = useState<Array<raceObject>>([]); // Состояние для хранения моих гонок
  const [raceid, setRaceId] = useState<number>(0); // Состояние для хранения идентификатора гонки
  const [viewModalIsShow, showViewModal] = useState<boolean>(false); // Состояние для хранения флага, указывающего, открыто ли модальное окно для просмотра результатов гонки

  const getRegisterRaces = async () => {
    await axios
      .get("https://localhost:7198/api/Race/registerraces", { // Отправляем GET-запрос на сервер для получения доступных для регистрации гонок
        withCredentials: true,
      })
      .then(function (response) {
        console.log(response);
        setRegisterRaces(response.data);
      })
      .catch(function (error) {
        console.error(error);
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
      });
  };

  const getMyRaces = async () => {
    await axios
      .get("https://localhost:7198/api/Race/myraces", { // Отправляем GET-запрос на сервер для получения моих гонок
        withCredentials: true,
      })
      .then(function (response) {
        console.log(response);
        setMyRaces(response.data);
      })
      .catch(function (error) {
        console.error(error);
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
      });
  };

  useEffect(() => {  // При монтировании компонента, получаем доступные для регистрации гонки и мои гонки
    getRegisterRaces();
    getMyRaces();
  }, []);

  const registerRace = async (id: number) => {
    await axios
      .get(`https://localhost:7198/api/Race/registerrace/${id}`, { // Отправляем GET-запрос на сервер для регистрации на гонку
        withCredentials: true,
      })
      .then(function (response) {
        console.log(response);
        if (response.status === 200) {
            notification.success({
                message: `Успешная регистрация! Ваш болид: ${response.data.manufacturer} ${response.data.model}`,
                placement: "top",
                duration: 3
            })
        } else if (response.status === 201) {
            notification.warning({
                message: "Нет свободных болидов на эту гонку!",
                placement: "top",
                duration: 3
            })
        }
      })
      .catch(function (error) {
        console.error(error);
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
      });

    // Обновляем состояние с доступными для регистрации гонками и моими гонками
    getRegisterRaces();
    getMyRaces();
  };
  const viewRace = (id: number) => { // Функция для просмотра результатов гонки
    setRaceId(id);
    console.log(id);
    showViewModal(true);
  };

  const quitRace = async (id: number) => {
    await axios
      .delete(`https://localhost:7198/api/Race/quitrace/${id}`, { // Отправляем DELETE-запрос на сервер для снятия регистрации с гонки
        withCredentials: true,
      })
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.error(error);
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
      });
      // Обновляем состояние с доступными для регистрации гонками и моими гонками
    getRegisterRaces();
    getMyRaces();
  };

  const registerColumns: TableProps<raceObject>["columns"] = [ // Определяем столбцы таблицы для доступных для регистрации гонок
    {
      title: "Дата проведения",
      dataIndex: "date",
      key: "date",
      sorter: (a, b) => a.date.localeCompare(b.date),
    },
    {
      title: "Количество гонщиков",
      dataIndex: "racersnumber",
      key: "racersnumber",
      // sorter: (a, b) => a.date.localeCompare(b.date),
    },
    {
      key: "register",
      render: (row: raceObject) => (
        <Button
          key="registerButton"
          type="primary"
          onClick={() => (row.id !== undefined ? registerRace(row.id) : null)}
        >
          Зарегистрироваться
        </Button>
      ),
    },
  ];

  const myColumns: TableProps<raceObject>["columns"] = [ // Определяем столбцы таблицы для моих гонок
    {
      title: "Дата проведения",
      dataIndex: "date",
      key: "date",
      sorter: (a, b) => a.date.localeCompare(b.date),
    },
    {
      title: "Количество гонщиков",
      dataIndex: "racersnumber",
      key: "racersnumber",
      // sorter: (a, b) => a.date.localeCompare(b.date),
    },
    {
      key: "view",
      render: (row: raceObject) => {
        if (row.isended === true) {
          return (
            <Button
              key="viewButton"
              type="primary"
              onClick={() => (row.id !== undefined ? viewRace(row.id) : null)}
            >
              Результаты
            </Button>
          );
        } else {
          return (
            <Button
              key="quitButton"
              type="primary"
              onClick={() => (row.id !== undefined ? quitRace(row.id) : null)}
            >
              Снять регистрацию
            </Button>
          );
        }
      },
    },
  ];

  return (
    <React.Fragment>
      <RaceView
        raceid={raceid}
        viewModalIsShow={viewModalIsShow}
        showViewModal={showViewModal}
      />

      <Table
        key="RacesToRegisterTable"
        dataSource={registerRaces}
        columns={registerColumns}
        pagination={{ pageSize: 30 }}
        scroll={{ y: 1000 }}
        bordered
        sortDirections={["ascend", "descend"]}
      />
      <Table
        key="MyRacesTable"
        dataSource={myRaces}
        columns={myColumns}
        pagination={{ pageSize: 30 }}
        scroll={{ y: 1000 }}
        bordered
        sortDirections={["ascend", "descend"]}
      />
    </React.Fragment>
  );
};
export default MyRaces;
