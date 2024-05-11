import React, { useEffect, useState } from "react";
import { Input, Modal, Button, Form, notification } from "antd";
import racerObject from "../entities/racerObject";
import axios from "axios";
interface PropsType { // Определяем интерфейс PropsType для пропсов компонента RacerCreate
    editedRacer: racerObject | undefined; // Гонщик, который редактируется
    addedRacer: (racer: racerObject) => void; // Функция, вызываемая при добавлении гонщика
    updatedRacer: (racer: racerObject) => void; // Функция, вызываемая при обновлении гонщика
    createModalIsShow: boolean; // Флаг, указывающий, открыт ли модальный окно
    showCreateModal: (value: boolean) => void; // Функция, открывающая/закрывающая модальное окно
}



const RacerCreate = ({ 
    editedRacer,
    addedRacer,
    updatedRacer,
    createModalIsShow, 
    showCreateModal
} : PropsType) => {
    const [form] = Form.useForm(); // Создание экземпляра формы
    const [username, setUsername] = useState<string>(""); // Состояние для имени пользовател
    const [email, setEmail] = useState<string>(""); // Состояние для email
    const [racenumber] = useState<number | undefined>(); // Состояние для количества гонок
    const [winsnumber] = useState<number | undefined>(); // Состояние для количества побед
    const [isEdit, setIsEdit] = useState<boolean>(false); // Состояние для флага, указывающего, редактируется ли текущий гонщик

    useEffect(() => { // При монтировании компонента и изменении editedRacer, обновляем состояние формы и данных
        console.log(editedRacer);
        if (editedRacer !== undefined)
        {
            form.setFieldsValue({ // Устанавливаем значения формы и состояний из editedRacer
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
        {  // Сбрасываем форму и устанавливаем флаг isEdit в false
            form.resetFields();
            setIsEdit(false);
        }

        return () => {
            
        }
    }, [editedRacer, form, isEdit]);

    const handleSubmit = (e: Event) => { // Обработчик отправки формы
        const createRacer = async () => {  // Функция для создания гонщика
            const racer : racerObject = {
                username,
                email,
                racenumber,
                winsnumber,
            }

            await axios
            .post("https://localhost:7198/api/Account/racers", racer, { // Отправляем POST-запрос на сервер для создания гонщика
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

        const editRacer = async (id: number | undefined) => { // Функция для редактирования гонщика
            const racer = {
                id,
                username,
                email
            }
            await axios // Отправляем PUT-запрос на сервер для редактирования гонщика
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

        if (isEdit) // Вызываем соответствующую функцию в зависимости от флага isEdit
        {
            console.log(editedRacer);
            editRacer(editedRacer?.id);
        }
        else createRacer();
    };

    return (
        <Modal open={createModalIsShow}
            title="Болид"
            onCancel={() => showCreateModal(false)}
            footer={[
                <Button
                    key="submitButton"
                    form="racerForm"
                    type="primary"
                    htmlType="submit"
                    onClick={() => showCreateModal(false)}>
                    Сохранить
                </Button>,
                <Button key="closeButton" onClick={() => showCreateModal(false)} danger>
                    Отменить
                </Button>
            ]}>
              {/* Форма для ввода данных гонщика */}
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