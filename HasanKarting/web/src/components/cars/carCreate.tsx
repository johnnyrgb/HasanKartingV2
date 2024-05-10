import React, { useEffect, useState } from "react";
import { Input, Modal, Button, Form, notification } from "antd";
import carObject from "../entities/carObject";
import axios from "axios";

interface PropsType {
    editedCar: carObject | undefined;
    addedCar: (company: carObject) => void;
    updatedCar: (company: carObject) => void;
    createModalIsShow: boolean;
    showCreateModel: (value: boolean) => void;
}

const CarCreate : React.FC<PropsType> = ({
    editedCar,
    addedCar,
    updatedCar,
    createModalIsShow, 
    showCreateModel
}) => {
    const [form] = Form.useForm(); //Создание экземпляра формы
    const [manufacturer, setManufacturer] = useState<string>(""); //Текущее значение названия компании
    const [model, setModel] = useState<string>(""); //Текущее значение названия компании
    const [power, setPower] = useState<number>(0); //Текущее значение названия компании
    const [mileage, setMileage] = useState<number>(0); //Текущее значение названия компании
    const [weight, setWeight] = useState<number>(0); //Текущее значение названия компании
    const [isEdit, setIsEdit] = useState<boolean>(false); //Редактриуется ли текущая компания

    useEffect(() => {
        console.log(editedCar);
        if (editedCar !== undefined)
        {
            form.setFieldsValue({
                manufacturer: editedCar.manufacturer,
                model: editedCar.model,
                power: editedCar.power,
                mileage: editedCar.mileage,
                weight: editedCar.weight,
            });
            setManufacturer(editedCar.manufacturer);
            setModel(editedCar.model);
            setPower(editedCar.power);
            setMileage(editedCar.mileage);
            setWeight(editedCar.weight);
            console.log(editedCar);
            setIsEdit(true);
            console.log(isEdit);
        }
        else
        {
            form.resetFields();
            setIsEdit(false);
        }

        return () => {
            
        }
    }, [editedCar, form, isEdit]);

    const handleSubmit = (e: Event) => {
        const createCar = async () => {
            const car : carObject = {
                manufacturer,
                model,
                power,
                mileage,
                weight
            }

            await axios
            .post("https://localhost:7198/api/Car", car, {
                withCredentials: true,
            })
            .then(function (response) {
                console.log(response);
                if (response.status === 201)
                    {
                        addedCar(car)
                        form.resetFields();
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
            })
        };

        const editCar = async (id: number | undefined) => {
            const car : carObject = {
                id,
                manufacturer,
                model,
                power,
                mileage,
                weight
            }
            console.log("dfsdf");
            await axios
            .put(`https://localhost:7198/api/Car/${id}`, car, {
                withCredentials: true,
            })
            .then(function (response) {
                console.log(response);
                if (response.status === 204)
                    {
                        updatedCar(car)
                        form.resetFields();
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
            })
        };

        if (isEdit)
        {
            console.log(editedCar);
            editCar(editedCar?.id);
        }
        else createCar();
    };

    return (
        <Modal open={createModalIsShow}
            title="Болид"
            onCancel={() => showCreateModel(false)}
            footer={[
                <Button
                    key="submitButton"
                    form="carForm"
                    type="primary"
                    htmlType="submit"
                    onClick={() => showCreateModel(false)}>
                    Сохранить
                </Button>,
                <Button key="closeButton" onClick={() => showCreateModel(false)} danger>
                    Отменить
                </Button>
            ]}>
            <Form id="carForm" onFinish={handleSubmit} form={form}>
            <Form.Item name="manufacturer" 
                    label="Производитель" 
                    hasFeedback rules={[
                    {
                        required: true,
                        type: "string",
                        message: "Введите название производителя"
                    }
                ]}>
                    <Input
                        key="manufacturerInput"
                        type="text"
                        name="manufacturerInput"
                        placeholder=""
                        value={manufacturer}
                        onChange={(el) => setManufacturer(el.target.value)} />
                </Form.Item>
                <Form.Item name="model" 
                    label="Модель" 
                    hasFeedback rules={[
                    {
                        required: true,
                        type: "string",
                        message: "Введите название модели"
                    }
                ]}>
                    <Input
                        key="modelInput"
                        type="text"
                        name="modelInput"
                        placeholder=""
                        value={model}
                        onChange={(el) => setModel(el.target.value)} />
                </Form.Item>
                <Form.Item name="power" 
                    label="Мощность" 
                    hasFeedback rules={[
                    {
                        required: true,
                        message: "Введите мощность (л.с.)"
                    },
                    {
                        validator: (_, value) => {
                            if (isNaN(value  || value <= 0)) {
                                return Promise.reject(new Error('Введите корректное числовое значение'));
                            }
                            return Promise.resolve();
                        }
                    }
                ]}>
                    <Input
                        key="powerInput"
                        type="number"
                        name="powerInput"
                        placeholder=""
                        value={power}
                        onChange={(el) => setPower(Number(el.target.value))} />
                </Form.Item>
                <Form.Item name="weight" 
                    label="Масса" 
                    hasFeedback rules={[
                    {
                        required: true,
                        message: "Введите массу"
                    },
                    {
                        validator: (_, value) => {
                            if (isNaN(value) || value <= 0) {
                                return Promise.reject(new Error('Введите корректное числовое значение'));
                            }
                            return Promise.resolve();
                        }
                    }
                    
                ]}>
                    <Input
                        key="weightInput"
                        type="number"
                        name="weightInput"
                        placeholder=""
                        value={weight}
                        onChange={(el) => setWeight(Number(el.target.value))} />
                </Form.Item>
                <Form.Item name="mileage" 
                    label="Пробег" 
                    hasFeedback rules={[
                    {
                        required: true,
                        message: "Введите пробег",
                        
                    },
                    {
                        validator: (_, value) => {
                            if (isNaN(value) || value < 0) {
                                return Promise.reject(new Error('Введите корректное числовое значение'));
                            }
                            return Promise.resolve();
                        }
                    }
                ]}>
                    <Input
                        key="mileageInput"
                        type="number"
                        name="mileageInput"
                        placeholder=""
                        value={mileage}
                        onChange={(el) => setMileage(Number(el.target.value))} />
                </Form.Item>
                
            </Form>
        </Modal>
    );
};
export default CarCreate;