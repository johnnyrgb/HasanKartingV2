import React, { useEffect, useState } from "react";
import { Input, Modal, Button, Form, notification } from "antd";
import racerObject from "../entities/racerObject";
import axios from "axios";
interface PropsType {
    editedRacer: racerObject | undefined;
    addedRacer: (company: racerObject) => void;
    updatedRacer: (company: racerObject) => void;
    createModalIsShow: boolean;
    showCreateModel: (value: boolean) => void;
}



const RacerCreate : React.FC<PropsType> = ({
    editedRacer,
    addedRacer,
    updatedRacer,
    createModalIsShow, 
    showCreateModel
}) => {
    const [form] = Form.useForm(); //Создание экземпляра формы
    const [username, setUsername] = useState<string>(""); //Текущее значение названия компании
    const [email, setEmail] = useState<string>(""); //Текущее значение названия компании
    const [racenumber] = useState<number | undefined>(); //Текущее значение названия компании
    const [winsnumber] = useState<number | undefined>(); //Текущее значение названия компании
    const [isEdit, setIsEdit] = useState<boolean>(false); //Редактриуется ли текущая компания

    useEffect(() => {
        console.log(editedRacer);
        if (editedRacer !== undefined)
        {
            form.setFieldsValue({
                username: editedRacer.username,
                email: editedRacer.email,
            });
            setUsername(editedRacer.username);
            setEmail(editedRacer.email);
            console.log(editedRacer);
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
    }, [editedRacer, form, isEdit]);

    const handleSubmit = (e: Event) => {
        const createRacer = async () => {
            const racer : racerObject = {
                username,
                email,
                racenumber,
                winsnumber,
            }

            await axios
            .post("https://localhost:7198/api/Account/racers", racer, {
                withCredentials: true,
            })
            .then(function (response) {
                console.log(response);
                if (response.status === 200) {
                  notification.success({
                    message: `Аккаунт ${racer.username} создан! Временный пароль: ChangeMe1!`,
                    placement: "top",
                    duration: 3,
                  });
                }
                else if (response.status === 201) {
                  notification.warning({
                    message: `Пользователь с такими данными уже существует`,
                    placement: "top",
                    duration: 3,
                  });
                }
                else if (response.status === 202) {
                  notification.warning({
                    message: `Введены некорректные данные`,
                    placement: "top",
                    duration: 3,
                  });
                }
              })
              .catch(function (error) {
                console.error(error);
                console.log(error);
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

        const editRacer = async (id: number | undefined) => {
            const racer = {
                id,
                username,
                email
            }
            await axios
            .put(`https://localhost:7198/api/Account/racers/${id}`, racer, {
                withCredentials: true,
            })
            .then(function (response) {
                console.log(response);
                if (response.status === 204)
                    {
                        updatedRacer(racer)
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
            console.log(editedRacer);
            editRacer(editedRacer?.id);
        }
        else createRacer();
    };

    return (
        <Modal open={createModalIsShow}
            title="Болид"
            onCancel={() => showCreateModel(false)}
            footer={[
                <Button
                    key="submitButton"
                    form="racerForm"
                    type="primary"
                    htmlType="submit"
                    onClick={() => showCreateModel(false)}>
                    Сохранить
                </Button>,
                <Button key="closeButton" onClick={() => showCreateModel(false)} danger>
                    Отменить
                </Button>
            ]}>
            <Form id="racerForm" onFinish={handleSubmit} form={form}>
            <Form.Item name="username" 
                    label="Имя пользователя" 
                    hasFeedback rules={[
                    {
                        required: true,
                        type: "string",
                        message: "Введите имя пользователя"
                    }
                ]}>
                    <Input
                        key="usernameInput"
                        type="text"
                        name="usernameInput"
                        placeholder=""
                        value={username}
                        onChange={(el) => setUsername(el.target.value)} />
                </Form.Item>
                <Form.Item name="email" 
                    label="Email" 
                    hasFeedback rules={[
                    {
                        required: true,
                        type: "string",
                        message: "Введите адрес электронной почты"
                    }
                ]}>
                    <Input
                        key="emailInput"
                        type="text"
                        name="emailInput"
                        placeholder=""
                        value={email}
                        onChange={(el) => setEmail(el.target.value)} />
                </Form.Item>
            </Form>
        </Modal>
    );
};
export default RacerCreate;