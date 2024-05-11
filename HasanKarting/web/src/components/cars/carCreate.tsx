import React, { useEffect, useState } from "react";
import { Input, Modal, Button, Form, notification } from "antd";
import carObject from "../entities/carObject";
import axios from "axios";

interface PropsType {
  editedCar: carObject | undefined; // Автомобиль, который редактируется
  addedCar: (car: carObject) => void; // Функция, вызываемая при добавлении автомобиля
  updatedCar: (car: carObject) => void; // Функция, вызываемая при обновлении автомобиля
  createModalIsShow: boolean; // Флаг, указывающий, открыт ли модальный окно
  showCreateModal: (value: boolean) => void; // Функция, открывающая/закрывающая модальное окно
}

const CarCreate = ({
  editedCar,
  addedCar,
  updatedCar,
  createModalIsShow,
  showCreateModal,
}: PropsType) => {
  const [form] = Form.useForm(); // Создание экземпляра формы
  const [manufacturer, setManufacturer] = useState<string>(""); // Состояние для названия производителя
  const [model, setModel] = useState<string>(""); // Состояние для названия модели
  const [power, setPower] = useState<number>(0); // Состояние для мощности автомобиля
  const [mileage, setMileage] = useState<number>(0); // Состояние для пробега автомобиля
  const [weight, setWeight] = useState<number>(0); // Состояние для массы автомобиля
  const [isEdit, setIsEdit] = useState<boolean>(false); // Состояние для флага, указывающего, редактируется ли текущий автомобиль

  useEffect(() => {
    // При монтировании компонента и изменении editedCar, обновляем состояние формы и данных
    console.log(editedCar); 
    if (editedCar !== undefined) { // Устанавливаем значения формы и состояний из editedCar
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
    } else { // Сбрасываем форму и устанавливаем флаг isEdit в false
      form.resetFields();
      setIsEdit(false);
    }

    return () => {};
  }, [editedCar, form, isEdit]);
 // Обработчик отправки формы
  const handleSubmit = (e: Event) => { // Функция для создания автомоби
    const createCar = async () => {
      const car: carObject = {
        manufacturer,
        model,
        power,
        mileage,
        weight,
      };

      await axios
        .post("https://localhost:7198/api/Car", car, { // Отправляем POST-запрос на сервер для создания автомобиля
          withCredentials: true,
        })
        .then(function (response) {
          console.log(response);
          if (response.status === 201) {
            addedCar(car);
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
    };

    const editCar = async (id: number | undefined) => { // Функция для редактирования автомобиля
      const car: carObject = {
        id,
        manufacturer,
        model,
        power,
        mileage,
        weight,
      };
      await axios
        .put(`https://localhost:7198/api/Car/${id}`, car, { // Отправляем PUT-запрос на сервер для редактирования автомобиля
          withCredentials: true,
        })
        .then(function (response) {
          console.log(response);
          if (response.status === 204) {
            updatedCar(car);
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
    };

    if (isEdit) { // Вызываем соответствующую функцию в зависимости от флага isEditё
      console.log(editedCar);
      editCar(editedCar?.id);
    } else createCar();
  };

  return (
    <Modal
      open={createModalIsShow}
      title="Болид"
      onCancel={() => showCreateModal(false)}
      footer={[
        <Button
          key="submitButton"
          form="carForm"
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
        {/* Форма для ввода данных автомобиля */}
      <Form id="carForm" onFinish={handleSubmit} form={form}>
        <Form.Item
          name="manufacturer"
          label="Производитель"
          hasFeedback
          rules={[
            {
              required: true,
              type: "string",
              message: "Введите название производителя",
            },
          ]}
        >
          <Input
            key="manufacturerInput"
            type="text"
            name="manufacturerInput"
            placeholder=""
            value={manufacturer}
            onChange={(el) => setManufacturer(el.target.value)}
          />
        </Form.Item>
        <Form.Item
          name="model"
          label="Модель"
          hasFeedback
          rules={[
            {
              required: true,
              type: "string",
              message: "Введите название модели",
            },
          ]}
        >
          <Input
            key="modelInput"
            type="text"
            name="modelInput"
            placeholder=""
            value={model}
            onChange={(el) => setModel(el.target.value)}
          />
        </Form.Item>
        <Form.Item
          name="power"
          label="Мощность"
          hasFeedback
          rules={[
            {
              required: true,
              message: "Введите мощность (л.с.)",
            },
            {
              validator: (_, value) => {  // Проверяем, что значение является числом и больше нуля
                if (isNaN(value || value <= 0)) {
                  return Promise.reject(
                    new Error("Введите корректное числовое значение")
                  );
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <Input
            key="powerInput"
            type="number"
            name="powerInput"
            placeholder=""
            value={power}
            onChange={(el) => setPower(Number(el.target.value))}
          />
        </Form.Item>
        <Form.Item
          name="weight"
          label="Масса"
          hasFeedback
          rules={[
            {
              required: true,
              message: "Введите массу",
            },
            {
              validator: (_, value) => {
                if (isNaN(value) || value <= 0) { // Проверяем, что значение является числом и больше нуля
                  return Promise.reject(
                    new Error("Введите корректное числовое значение")
                  );
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <Input
            key="weightInput"
            type="number"
            name="weightInput"
            placeholder=""
            value={weight}
            onChange={(el) => setWeight(Number(el.target.value))}
          />
        </Form.Item>
        <Form.Item
          name="mileage"
          label="Пробег"
          hasFeedback
          rules={[
            {
              required: true,
              message: "Введите пробег",
            },
            {
              validator: (_, value) => {
                if (isNaN(value) || value < 0) { // Проверяем, что значение является числом и больше нуля
                  return Promise.reject(
                    new Error("Введите корректное числовое значение")
                  );
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <Input
            key="mileageInput"
            type="number"
            name="mileageInput"
            placeholder=""
            value={mileage}
            onChange={(el) => setMileage(Number(el.target.value))}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};
export default CarCreate;
