import React from 'react';
import {Button, Card, Container, Nav, Navbar,} from "react-bootstrap";
import "./PersonalAccount.css";
import AccountProfile from "./profile/AccountProfile";
import AddressProfile from "./address/AddressProfile";
import OrdersProfile from "./orders/OrdersProfile";
import {useState} from "react";

const PersonalAccount = () => {
    const [codeShow, setCodeShow] = useState("PROFILE");

    const selectMainContent = (codeShow) => {
        switch (codeShow) {
            case "PROFILE":
                return <AccountProfile />;
            case "ADDRESS":
                return <AddressProfile />;
            case "ORDERS":
                return <OrdersProfile />;
        }
    }

    return (
        <Container className={"mt-4 d-flex justify-content-between accountContainer"}>
            <Card className={"accountContainerBackgroundCard"}>
                <Navbar variant="light" className={"accountNavigation"}>
                    <button onClick={() => setCodeShow("PROFILE")}>Профиль</button>
                    <button onClick={() => setCodeShow("ADDRESS")}>Адрес</button>
                    <button id={"btnOrder"} onClick={() => setCodeShow("ORDERS")}>Мои заказы</button>
                </Navbar>
                {selectMainContent(codeShow)}
            </Card>
        </Container>
    );
};

export default PersonalAccount;