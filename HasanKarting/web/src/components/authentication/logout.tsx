import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { notification } from "antd";
import userObject from "../entities/userObject";

interface PropsType {
    setUser: (value: userObject | null) => void;
}

const Logout = ({ setUser }: PropsType) => {
    const navigate = useNavigate();
    

    useEffect(() => {
        const Logout = async() => {
            const requestOptions = {
                method: 'POST',
            };

            const response = await fetch("api/Account/logout", requestOptions)

            if (response.status === 200) {
                setUser(null);
                navigate("/");
                notification.success({
                    message: "Вы вышли из аккаунта",
                    placement: "top",
                    duration: 3,
                });
            }
            else {
                notification.error({
                    message: "Вы не вошли в аккаунт",
                    placement: "top",
                    duration: 3,
                });
            }
        }
        Logout();
    }, [navigate, setUser]);
    return <></>
};

export default Logout;