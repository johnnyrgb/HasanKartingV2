import React, { useEffect, useState } from "react";
import { DatePicker, Modal, Button, Form, notification } from "antd";
import raceObject from "../entities/raceObject";
import axios from "axios";
import moment from "moment-timezone";

interface PropsType {
  // Определяем интерфейс PropsType для пропсов компонента RaceCreate
  editedRace: raceObject | undefined; // Гонка, которая редактируется
  addedRace: (race: raceObject) => void; // Функция, вызываемая при добавлении гонки
  updatedRace: (race: raceObject) => void; // Функция, вызываемая при обновлении гонки
  createModalIsShow: boolean; // Флаг, указывающий, открыт ли модальный окно
  showCreateModal: (value: boolean) => void; // Функция, открывающая/закрывающая модальное окно
}

const RaceCreate = ({
  // Определяем компонент RaceCreate
  editedRace,
  addedRace,
  updatedRace,
  createModalIsShow,
  showCreateModal,
}: PropsType) => {
  const [form] = Form.useForm(); // Создание экземпляра формы
  const [date, setDatetime] = useState<string>(""); // Состояние для флага, указывающего, редактируется ли текущая гонка

  const [isEdit, setIsEdit] = useState<boolean>(false); // Состояние для флага, указывающего, редактируется ли текущая гонка

  useEffect(() => { // Устанавливаем значения формы из editedRace
    console.log(editedRace);
    if (editedRace !== undefined) {
      form.setFieldsValue({
        datetime: editedRace.date,
      });
      console.log(editedRace);
      setIsEdit(true);
      console.log(isEdit);
    } else { // Сбрасываем форму и устанавливаем флаг isEdit в false
      form.resetFields();
      setIsEdit(false);
    }

    return () => {};
  }, [editedRace, form, isEdit]);

  const handleSubmit = (e: Event) => { // Обработчик отправки формы
    const createRace = async () => { // Функция для создания гонки
      const race: raceObject = {
        date,
      };
      console.log("Dfds");
      console.log(race);
      await axios
        .post("https://localhost:7198/api/Race", race, { // Отправляем POST-запрос на сервер для создания гонки
          withCredentials: true,
        })
        .then(function (response) {
          console.log(response);
          if (response.status === 201) {
            addedRace(race);
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
        });
    };

    const editRace = async (id: number | undefined) => { // Функция для редактирования гонки
      const race: raceObject = {
        id,
        date,
      };
      await axios
        .put(`https://localhost:7198/api/Race/${id}`, race, { // Отправляем PUT-запрос на сервер для редактирования гонки
          withCredentials: true,
        })
        .then(function (response) {
          console.log(response);
          if (response.status === 204) {
            updatedRace(race);
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
        });
      console.log(race);
    };

    if (isEdit) { // Вызываем соответствующую функцию в зависимости от флага isEdit
      console.log(editedRace);
      editRace(editedRace?.id);
    } else createRace();
  };

  return (
    <Modal
      open={createModalIsShow}
      title="Болид"
      onCancel={() => showCreateModal(false)}
      footer={[
        <Button
          key="submitButton"
          form="raceForm"
          type="primary"
          htmlType="submit"
          onClick={() => showCreateModal(false)}
        >
          Сохранить
        </Button>,
        <Button key="closeButton" onClick={() => showCreateModal(false)} danger>
          Отменить
        </Button>,
      ]}
    >
        {/* Форма для ввода даты гонки */}
      <Form id="raceForm" onFinish={handleSubmit} form={form}>
        <Form.Item
          name="date"
          label="Дата проведения"
          hasFeedback
          rules={[
            {
              required: true,
              type: "date",
              message: "Введите дату",
            },
          ]}
        >
          <DatePicker
            key="datePicker"
            name="datePicker"
            showTime={true}
            onChange={(date, dateString) =>
              setDatetime(moment.utc(dateString).format())
            }
            value={date}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};
export default RaceCreate;
