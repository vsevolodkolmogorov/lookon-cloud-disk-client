import React from 'react';
import {Card, Col} from "react-bootstrap";
import "./UsersList.css";

const UsersList = ({users}) => {
    return (
        (users.role === "USER" && users.isActivated) ?
            <Col md={6} sm={6} lg={3}>
                <Card className={"userListInfo"}>
                    <h5>Пользователь № {users.id}</h5>
                    <p className={"mt-3"}>Фамилия: {users.secondName ? users.secondName : "Пусто"}</p>
                    <p>Имя: {users.firstName ? users.firstName : "Пусто"}</p>
                    <p>Отчество: {users.patronymic ? users.patronymic : "Пусто"}</p>
                    <p id={"email"}>E-mail: {users.email ? users.email : "Пусто"}</p>
                    <p>Номер: {users.phoneNumber ? users.phoneNumber : "Пусто"}</p>
                </Card>
            </Col> : null
    );
};

export default UsersList;