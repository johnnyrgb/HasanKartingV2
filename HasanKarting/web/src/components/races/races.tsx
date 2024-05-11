import React, { useState, useEffect } from "react";
import { Button, Table, notification } from "antd";
import type { TableProps } from "antd";
import raceObject from "../entities/raceObject";
import RaceCreate from "./raceCreate";
import RaceView from "./raceView";
import axios from "axios";

const Races = () => { // Определяем компонент Races
  const [races, setRaces] = useState<Array<raceObject>>([]); // Состояние для хранения списка гонок
  const [createModalIsShow, showCreateModal] = useState<boolean>(false); // Состояние для хранения флага, указывающего, открыто ли модальное окно для создания гонки
  const [editedRace, setEditedRace] = useState<raceObject>();   // Состояние для хранения редактируемой гонки
  const [raceid, setRaceId] = useState<number>(0); // Состояние для хранения идентификатора гонки
  const [viewModalIsShow, showViewModal] = useState<boolean>(false); // Состояние для хранения флага, указывающего, открыто ли модальное окно для просмотра результатов гонки

  const updateRace = (race: raceObject) => { // Функция для обновления гонки в списке гонок
    setRaces(
      races.map((e) => {
        if (e.id === race.id) return race;
        return e;
      })
    );
  };

  const addRace = () => { // Функция для добавления новой гонки
    setEditedRace(undefined);
    setRaces([...races]);
    showCreateModal(true);
  };

  const getRaces = async () => { // Функция для получения списка гонок с сервера
    await axios
      .get("https://localhost:7198/api/Race/all", {
        withCredentials: true,
      })
      .then(function (response) {
        console.log(response);
        setRaces(response.data);
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

  useEffect(() => { // При монтировании компонента, получаем список гонок с сервера
    getRaces();
  }, [createModalIsShow]);

  const editRace = (race: raceObject) => {  // Функция для редактирования гонки
    setEditedRace(race);
    console.log(race);
    showCreateModal(true);
  };

  const endRace = async (id: number) => { // Функция для завершения гонки и генерации результатов
    console.log(id);
    await axios
      .get(`https://localhost:7198/api/Race/generate/${id}`, {
        withCredentials: true,
      })
      .then(function (response) {
        console.log(response);
        setRaces(response.data);
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
    getRaces();
  };

  const viewRace = (id: number) => { // Функция для просмотра результатов гонки (протоколы)
    setRaceId(id);
    console.log(id);
    showViewModal(true);
  };

  const columns: TableProps<raceObject>["columns"] = [ // Определяем столбцы таблицы для гонок
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
      key: "edit",
      render: (row: raceObject) => (
        <Button key="editButton" type="primary" onClick={() => editRace(row)}>
          Изменить
        </Button>
      ),
    },
    {
      key: "endOrView",
      render: (row: raceObject) => {
        if (!row.protocols || row.protocols.length === 0) { // Проверяем, есть ли протоколы и не завершена ли гонка
          return null; // Возвращаем null, если массив protocols пуст или отсутствует
        }
        console.log(row.protocols);
        const protocol = row.protocols.at(0) ?? { completionTime: null };
        const isRaceFinished = protocol?.completionTime !== null;
        // console.log(row.date + " " + protocol?.completiontime);
        const raceDate = new Date(row.date);
        const isRaceOngoing = raceDate > new Date();

        if (!isRaceOngoing && !isRaceFinished) {
          return (
            <Button
              key="endButton"
              type="primary"
              onClick={() => (row.id !== undefined ? endRace(row.id) : null)}
            >
              Завершить
            </Button>
          );
        } else if (!isRaceOngoing && isRaceFinished) {
          return (
            <Button
              key="viewButton"
              type="primary"
              onClick={() => (row.id !== undefined ? viewRace(row.id) : null)}
            >
              Результаты
            </Button>
          );
        }
      },
    },
  ];

  return (
    <React.Fragment>
      <RaceCreate
        editedRace={editedRace}
        addedRace={addRace}
        updatedRace={updateRace}
        createModalIsShow={createModalIsShow}
        showCreateModal={showCreateModal}
      />
      <RaceView
        raceid={raceid}
        viewModalIsShow={viewModalIsShow}
        showViewModal={showViewModal}
      />

      <Table
        key="RacesTable"
        dataSource={races}
        columns={columns}
        pagination={{ pageSize: 30 }}
        scroll={{ y: 1000 }}
        bordered
        sortDirections={["ascend", "descend"]}
      />
      <Button
        onClick={(e) => {
          addRace();
        }}
      >
        Создать гонку
      </Button>
    </React.Fragment>
  );
};
export default Races;
