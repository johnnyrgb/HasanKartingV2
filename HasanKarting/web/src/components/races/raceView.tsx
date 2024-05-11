import React, { useEffect, useState } from "react";
import { Table, TableProps, Modal, Button, notification } from "antd";
import axios from "axios";

interface ProtocolResult {
  // Определяем интерфейс ProtocolResult для результатов протокола
  racer: string;
  car: string;
  completiontime: string;
}

interface ProtocolResponse {
  // Определяем интерфейс ProtocolResponse для ответа сервера
  result: ProtocolResult;
}

interface PropsType {
  // Определяем интерфейс PropsType для пропсов компонента RaceView
  raceid: number; // Идентификатор гонки
  viewModalIsShow: boolean; // Флаг, указывающий, открыто ли модальный окно
  showViewModal: (value: boolean) => void; // Функция, открывающая/закрывающая модальное окно
}

const RaceView = ({
  // Определяем компонент RaceView
  raceid,
  viewModalIsShow,
  showViewModal,
}: PropsType) => {
  const [protocols, setProtocols] = useState<ProtocolResult[]>([]); // Состояние для хранения результатов протокола

  useEffect(() => {
    if (viewModalIsShow) {
      const getProtocols = async () => { // Отправляем GET-запрос на сервер для получения результатов протокола
        await axios
          .get(`https://localhost:7198/api/Protocol/race/${raceid}`, {
            withCredentials: true,
          })
          .then(function (response) {
            console.log("DATA");
            console.log(response.data);
            setProtocols(
              response.data.map((item: ProtocolResponse) => item.result)
            );
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
      getProtocols();
    }
  }, [viewModalIsShow, raceid]);

  const columns: TableProps<ProtocolResult>["columns"] = [ // Определяем столбцы таблицы
    {
      title: "Гонщик",
      dataIndex: "racer",
      key: "racer",
    },
    {
      title: "Болид",
      dataIndex: "car",
      key: "car",
    },
    {
      title: "Общее время",
      dataIndex: "completiontime",
      key: "completiontime",
      sorter: (a, b) => a.completiontime.localeCompare(b.completiontime),
    },
  ];

  return (
    <Modal
      open={viewModalIsShow}
      title="Протокол гонки"
      onCancel={() => showViewModal(false)}
      footer={[
        <Button key="closeButton" onClick={() => showViewModal(false)} danger>
          Закрыть
        </Button>,
      ]}
    >
      <Table key="protocolTable" dataSource={protocols} columns={columns} />
    </Modal>
  );
};

export default RaceView;
