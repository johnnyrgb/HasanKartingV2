import React, { useState, useEffect } from "react";
import { Button, Table, notification } from "antd";
import type { TableProps } from "antd";
import racerObject from "../entities/racerObject";
import RacerCreate from "./racerCreate";
import axios from "axios";

interface PropsType { }

const Racers : React.FC<PropsType> = () => {

    const [racers, setRacers] = useState<Array<racerObject>>([]); //Хранение состояния компаний
    const [createModalIsShow, showCreateModel] = useState<boolean>(false); //Храниение состояния модального окна для создания компании
    const [editedRacer, setEditedRacer] = useState<racerObject>(); //Хранение компании, которую редактируют

    const updateRacer = (racer : racerObject) => {
        setRacers(
            racers.map((e) => {
                if (e.id === racer.id)
                    return racer;
                return e;
            })
        )
    };

    const addRacer = () => {
        setEditedRacer(undefined);
        setRacers([...racers]);
        showCreateModel(true);
    }

    useEffect(() => {
        const getRacers = async () => {

            await axios
            .get("https://localhost:7198/api/Account/racers", {
                withCredentials: true,
            })
            .then(function (response) {
                console.log(response);
                setRacers(response.data);
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
        getRacers();
    }, [createModalIsShow]);


    const editRacer = (racer : racerObject) => {
        setEditedRacer(racer);
        console.log(racer);
        showCreateModel(true);
    };

    const columns : TableProps<racerObject>["columns"] = [
        {
            title: "Имя пользователя",
            dataIndex: "username",
            key: "username",
            sorter: (a, b) => a.username.localeCompare(b.username),
        },
        {
            title: "Email",
            dataIndex: "email",
            key: "email",
            sorter: (a, b) => a.email.localeCompare(b.email),
        },
        {
            title: "Количество гонок",
            dataIndex: "racenumber",
            key: "racenumber",
            sorter: (a, b) => {
                const aRaceNumber = a.racenumber !== undefined ? a.racenumber : 0;
                const bRaceNumber = b.racenumber !== undefined ? b.racenumber : 0;
                return aRaceNumber - bRaceNumber;
            },
        },
        {
            title: "Количество побед",
            dataIndex: "winsnumber",
            key: "winsnumber",
            sorter: (a, b) => {
                const aRaceNumber = a.racenumber !== undefined ? a.racenumber : 0;
                const bRaceNumber = b.racenumber !== undefined ? b.racenumber : 0;
                return aRaceNumber - bRaceNumber;
            },
        },
        {
            key: "edit",
            render: (row : racerObject) => (
                <Button key="editButton"
                        type="primary"
                        onClick={() => editRacer(row)}>
                            Изменить
                </Button>
            ),
        },

        
    ];

    return (
        <React.Fragment>
            <RacerCreate
                editedRacer={editedRacer}
                addedRacer={addRacer}
                updatedRacer={updateRacer}
                createModalIsShow={createModalIsShow}
                showCreateModel={showCreateModel}
            />
            
            <Table
                key="RacersTable"
                dataSource={racers}
                columns={columns}
                pagination={{pageSize: 30}}
                scroll={{y: 1000}}
                bordered
                sortDirections={['ascend', 'descend']}
            />
            <Button onClick={(e) => {
                addRacer()
                }}>Создать гонищка</Button>
        </React.Fragment>
    )
};
export default Racers;