import React, { useEffect, useState } from "react";
import { Table, TableProps, Modal, Button, notification } from "antd";
import axios from "axios";

interface ProtocolResult {
    racer: string;
    car: string;
    completiontime: string;
}

interface ProtocolResponse {
    result: ProtocolResult;
    // Другие поля, которые могут быть полезны
}

interface PropsType {
    raceid: number;
    viewModalIsShow: boolean;
    showViewModal: (value: boolean) => void;
}

const RaceView: React.FC<PropsType> = ({
    raceid,
    viewModalIsShow,
    showViewModal
}) => {
    const [protocols, setProtocols] = useState<ProtocolResult[]>([]); // Изменено состояние

    useEffect(() => {
        if (viewModalIsShow) {
            const getProtocols = async () => {
                await axios
                    .get(`https://localhost:7198/api/Protocol/race/${raceid}`, {
                        withCredentials: true,
                    })
                    .then(function (response) {
                        console.log("DATA");
                        console.log(response.data);
                        // Изменено обновление состояния
                        setProtocols(response.data.map((item: ProtocolResponse) => item.result));
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

    const columns: TableProps<ProtocolResult>["columns"] = [
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
        <Modal open={viewModalIsShow}
            title="Протокол гонки"
            onCancel={() => showViewModal(false)}
            footer={[
                <Button key="closeButton" onClick={() => showViewModal(false)} danger>
                    Закрыть
                </Button>
            ]}>
            <Table
                key="protocolTable"
                dataSource={protocols}
                columns={columns}
            />
        </Modal>
    );
};

export default RaceView;