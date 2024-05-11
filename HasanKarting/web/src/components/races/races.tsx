import React, { useState, useEffect } from "react";
import { Button, Table, notification } from "antd";
import type { TableProps } from "antd";
import raceObject from "../entities/raceObject";
import RaceCreate from "./raceCreate";
import RaceView from "./raceView";
import axios from "axios";

interface PropsType { }

const Races : React.FC<PropsType> = () => {

    const [races, setRaces] = useState<Array<raceObject>>([]); //Хранение состояния компаний
    const [createModalIsShow, showCreateModel] = useState<boolean>(false); //Храниение состояния модального окна для создания компании
    const [editedRace, setEditedRace] = useState<raceObject>(); //Хранение компании, которую редактируют
    const [raceid, setRaceId] = useState<number>(0);
    const [viewModalIsShow, showViewModal] = useState<boolean>(false); //Храниение состояния модального окна для создания компании


    const updateRace = (race : raceObject) => {
        setRaces(
            races.map((e) => {
                if (e.id === race.id)
                    return race;
                return e;
            })
        )
    };

    const addRace = () => {
        setEditedRace(undefined);
        setRaces([...races]);
        showCreateModel(true);
    }

    const getRaces = async () => {

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
        })
    };

    useEffect(() => {
        getRaces();
    }, [createModalIsShow]);


    const editRace = (race : raceObject) => {
        setEditedRace(race);
        console.log(race);
        showCreateModel(true);
    };

    const endRace = async (id : number) => {
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
            })
        getRaces();
    };

    const viewRace = (id : number) => {
        setRaceId(id);
        console.log(id);
        showViewModal(true);
    }

    const columns : TableProps<raceObject>["columns"] = [
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
            render: (row : raceObject) => (
                <Button key="editButton"
                        type="primary"
                        onClick={() => editRace(row)}>
                            Изменить
                </Button>
            ),
        }, 
        {
            key: "endOrView",
            render: (row: raceObject) => {
                if (!row.protocols || row.protocols.length === 0) {
                    return null; // Возвращаем null, если массив protocols пуст или отсутствует
                }
                console.log(row.protocols);
                const protocol = row.protocols.at(0) ?? { completionTime: null};
                const isRaceFinished = protocol?.completionTime !== null;
                // console.log(row.date + " " + protocol?.completiontime);
                const raceDate = new Date(row.date);
                const isRaceOngoing = raceDate > new Date();
        
                if (!isRaceOngoing && !isRaceFinished) {
                    return (
                        <Button key="endButton" type="primary" onClick={() => row.id !== undefined ? endRace(row.id) : null} >
                            Завершить
                        </Button>
                    );
                } else if (!isRaceOngoing && isRaceFinished) {
                    return (
                        <Button key="viewButton" type="primary" onClick={() => row.id !== undefined ? viewRace(row.id) : null}>
                            Результаты
                        </Button>
                    );
                }
            },
        }
    ];

    return (
        <React.Fragment>
            <RaceCreate
                editedRace={editedRace}
                addedRace={addRace}
                updatedRace={updateRace}
                createModalIsShow={createModalIsShow}
                showCreateModel={showCreateModel}
            />
            <RaceView
                raceid={raceid}
                viewModalIsShow={viewModalIsShow}
                showViewModal={showViewModal}
            />
            
            <Table
                key="CompaniesTable"
                dataSource={races}
                columns={columns}
                pagination={{pageSize: 30}}
                scroll={{y: 1000}}
                bordered
                sortDirections={['ascend', 'descend']}
            />
            <Button onClick={(e) => {
                addRace()
                }}>Создать гонку</Button>
        </React.Fragment>
    )
};
export default Races;