import React, { useEffect, useState } from "react";
import { DatePicker, Modal, Button, Form, notification } from "antd";
import raceObject from "../entities/raceObject";
import axios from "axios";
import moment from "moment-timezone";

interface PropsType {   
    editedRace: raceObject | undefined;
    addedRace: (race: raceObject) => void;
    updatedRace: (race: raceObject) => void;
    createModalIsShow: boolean;
    showCreateModel: (value: boolean) => void;
}

const RaceCreate : React.FC<PropsType> = ({
    editedRace,
    addedRace,
    updatedRace,
    createModalIsShow, 
    showCreateModel
}) => {
    const [form] = Form.useForm(); //Создание экземпляра формы
    const [date, setDatetime] = useState<string>(""); //Текущее значение названия компании
    
    const [isEdit, setIsEdit] = useState<boolean>(false); //Редактриуется ли текущая компания

    useEffect(() => {
        console.log(editedRace);
        if (editedRace !== undefined)
        {
            form.setFieldsValue({
                datetime: editedRace.date
            });
            console.log(editedRace);
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
    }, [editedRace, form, isEdit]);

    const handleSubmit = (e: Event) => {
        const createRace = async () => {
            const race : raceObject = {
                date,
            }
            console.log("Dfds");
            console.log(race);
            await axios
            .post("https://localhost:7198/api/Race", race, {
                withCredentials: true,
            })
            .then(function (response) {
                console.log(response);
                if (response.status === 201)
                    {
                        addedRace(race)
                        form.resetFields();
                    }
            })
            .catch(function (error) {
                console.log(race);
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

        const editRace = async (id: number | undefined) => {
            const race : raceObject = {
                id,
                date,
            }
            await axios
            .put(`https://localhost:7198/api/Race/${id}`, race, {
                withCredentials: true,
            })
            .then(function (response) {
                console.log(response);
                if (response.status === 204)
                    {
                        updatedRace(race)
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
            console.log(race);
        };

        if (isEdit)
        {
            console.log(editedRace);
            editRace(editedRace?.id);
        }
        else createRace();
    };

    return (
        <Modal open={createModalIsShow}
            title="Болид"
            onCancel={() => showCreateModel(false)}
            footer={[
                <Button
                    key="submitButton"
                    form="raceForm"
                    type="primary"
                    htmlType="submit"
                    onClick={() => showCreateModel(false)}>
                    Сохранить
                </Button>,
                <Button key="closeButton" onClick={() => showCreateModel(false)} danger>
                    Отменить
                </Button>
            ]}>
            <Form id="raceForm" onFinish={handleSubmit} form={form}>
            <Form.Item name="date" 
                    label="Дата проведения" 
                    hasFeedback rules={[
                    {
                        required: true,
                        type: "date",
                        message: "Введите дату"
                    }
                ]}>
                    <DatePicker 
                    key="datePicker" 
                    name="datePicker" 
                    showTime={true} 
                    onChange={(date, dateString) => setDatetime(moment.utc(dateString).format())}
                    value={date}/>
                </Form.Item>
            </Form>
        </Modal>
    );
};
export default RaceCreate;