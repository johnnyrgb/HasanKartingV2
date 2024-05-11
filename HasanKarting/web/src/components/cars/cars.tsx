import React, { useState, useEffect } from "react";
import { Button, Table, notification } from "antd";
import type { TableProps } from "antd";
import carObject from "../entities/carObject";
import CarCreate from "./carCreate";
import axios from "axios";

interface PropsType { }

const Cars = () => {
    const [cars, setCars] = useState<Array<carObject>>([]);  // Состояние для хранения списка автомобилей
    const [createModalIsShow, showCreateModal] = useState<boolean>(false); // Состояние для отображения модального окна создания автомобиля
    const [editedCar, setEditedCar] = useState<carObject>(); // Состояние для хранения редактируемого автомобиля

    const updateCar = (car : carObject) => { // Обновление списка автомобилей после изменения
        setCars(
            cars.map((e) => {
                if (e.id === car.id)
                    return car;
                return e;
            })
        )
    };

    const removeCar = (removeId: number | undefined) => setCars(cars.filter(({ id }) => id !== removeId)); // Удаление автомобиля из списка

    const addCar = () => { // Открытие модального окна для создания нового автомобиля
        setEditedCar(undefined);
        setCars([...cars]);
        showCreateModal(true);
    }

    useEffect(() => { // Загрузка списка автомобилей с сервера при монтировании компонента
        const getCars = async () => {

            await axios
            .get("https://localhost:7198/api/Car", {
                withCredentials: true,
            })
            .then(function (response) {
                console.log(response);
                setCars(response.data);
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
        getCars();
    }, [createModalIsShow]);

    const deleteCar = async (id: number | undefined) => { // Удаление автомобиля с сервера и из списка

        await axios
            .delete(`https://localhost:7198/api/Car/${id}`, {
                withCredentials: true,
            })
            .then(function (response) {
                console.log(response);
                removeCar(id)
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

    const editCar = (car : carObject) => { // Открытие модального окна для редактирования автомобиля
        setEditedCar(car);
        console.log(car);
        showCreateModal(true);
    };

    const columns : TableProps<carObject>["columns"] = [ // Определение колонок таблицы
        {
            title: "Произоводитель",
            dataIndex: "manufacturer",
            key: "manufacturer",
            sorter: (a, b) => a.manufacturer.localeCompare(b.manufacturer),
        },
        {
            title: "Модель",
            dataIndex: "model",
            key: "model",
            sorter: (a, b) => a.model.localeCompare(b.model),
        },
        {
            title: "Мощность",
            dataIndex: "power",
            key: "power",
            sorter: (a, b) => a.power - b.power,
        },
        {
            title: "Масса",
            dataIndex: "weight",
            key: "weight",
            sorter: (a, b) => a.power - b.power,
        },
        {
            title: "Пробег",
            dataIndex: "mileage",
            key: "mileage",
            sorter: (a, b) => a.power - b.power,
        },
        {
            key: "edit",
            render: (row : carObject) => (
                <Button key="editButton"
                        type="primary"
                        onClick={() => editCar(row)}>
                            Изменить
                </Button>
            ),
        },
        {
            key: "delete",
            render: (row : carObject) => (
                <Button key="deleteButton"
                        type="primary"
                        onClick={() => deleteCar(row.id)}
                        danger>
                            Удалить
                </Button>
            ),
        },
        
    ];

    return (
        <React.Fragment>
            {/* Модальное окно для создания и редактирования автомобиля */}
            <CarCreate
                editedCar={editedCar}
                addedCar={addCar}
                updatedCar={updateCar}
                createModalIsShow={createModalIsShow}
                showCreateModal={showCreateModal}
            />
            {/* Таблица с автомобилями */}
            <Table
                key="carsTable"
                dataSource={cars}
                columns={columns}
                pagination={{pageSize: 30}}
                scroll={{y: 1000}}
                bordered
                sortDirections={['ascend', 'descend']}
            />
            {/* Кнопка для создания нового автомобиля */}
            <Button onClick={(e) => {
                addCar()
                }}>Создать болид</Button>
        </React.Fragment>
    )
};
export default Cars;