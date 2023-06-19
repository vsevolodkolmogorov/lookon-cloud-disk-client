import React, {useContext, useState} from 'react';
import {Context} from "../../../index";
import {Button, Container, Dropdown, Nav, Navbar} from "react-bootstrap";
import {
    ADMIN_ROUTE,
    BASKET_ROUTE,
    LOGIN_ROUTE,
    LOOK_ROUTE,
    PERSONAL_ACCOUNT_ROUTE,
    SHOP_ROUTE
} from "../../../utils/consts";
import {observer} from "mobx-react-lite";
import "./NavBar.css"
import logo from "../../../images/logo.png"
import {useNavigate} from "react-router-dom"
import {deleteBasket, fetchBasket} from "../../../http/API/basketAPI";
import {toJS} from "mobx";

const NavBar = observer(() => {
    const {user, merchandise} = useContext(Context);
    const [buttonActiveName, setButtonActiveName] = useState("");
    const navigate = useNavigate();

    const logOut = () => {
        fetchBasket().then(function (result) {
            if (result.length === 0) {
                return [];
            } else {
                let selected = [];
                result.map(i => (toJS(merchandise.merchandises).map(m => {
                    if (m.id === i.merchandiseId) {
                        m.size = i.selectedSize;
                        selected.push(m)
                    }
                })))
                return selected;
            }
        }).then(data => {
            if (data.length === 0) {
                user.logout()
                navigate(LOGIN_ROUTE)
            } else {
                data.map(i => {
                    deleteBasket(i.id, i.size).then(data => {
                    });
                })
                user.logout();
                navigate(LOGIN_ROUTE);
            }

        })
    }

    const goToShop = () => {
        merchandise.setFiltersClear();
        setButtonActiveName("");
        navigate(SHOP_ROUTE);
    }

    const goToLook = () => {
        setButtonActiveName("");
        navigate(LOOK_ROUTE);
    }

    return (
        <div>
            <Navbar className={"mt-3 mb-5"}>
                <Container>
                    <div className={"d-flex align-items-center"}>
                        <img height={65} width={65} src={logo} alt="logo"/>
                        <span className={"logoLookon"}>LOOKON</span>
                    </div>
                    <div className={"navShop d-flex justify-content-center"}>
                        <Nav className="ml-auto">
                            <Button className={"btnShop"} variant={"outline-light"} onClick={goToShop}>Магазин</Button>
                        </Nav>
                        <Nav className="ml-auto">
                            <Button className={"btnLook"} variant={"outline-light"}
                                    onClick={goToLook}>Луки</Button>
                        </Nav>
                    </div>
                    {user.isAuth ?
                        <div>
                            <Dropdown>
                                <Dropdown.Toggle variant={"outline-light"} className={"navigationToggle"}>
                                    <img
                                        src="https://uploads-ssl.webflow.com/637412e5f6b29b2cb01a253e/63869c66b65921578d28d2aa_more-horizontal.svg"
                                        loading="lazy" alt="More Button"></img>
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    <Dropdown.Item href={BASKET_ROUTE}>Корзина</Dropdown.Item>
                                    {toJS(user.user).role === "ADMIN" ?
                                        <Dropdown.Item href={ADMIN_ROUTE}>Админ панель</Dropdown.Item> :
                                        <Dropdown.Item href={PERSONAL_ACCOUNT_ROUTE}>Личный кабинет</Dropdown.Item>}
                                    <Dropdown.Item onClick={() => logOut()}>Выйти</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                            <Nav className="navMenu ml-auto">
                                {
                                    buttonActiveName === "BASKET" ? <Button
                                        className={"navigationActive"}
                                        variant={"outline-light"}
                                        onClick={() => {
                                            setButtonActiveName("BASKET");
                                            navigate(BASKET_ROUTE);
                                        }}>
                                        Корзина
                                    </Button> : <Button
                                        variant={"outline-light"}
                                        onClick={() => {
                                            setButtonActiveName("BASKET");
                                            navigate(BASKET_ROUTE);
                                        }
                                        }>Корзина</Button>
                                }

                                {toJS(user.user).role === "ADMIN" ? <Button
                                    className={buttonActiveName === "ADMIN" ? "button_nav_center navigationActive" : "button_nav_center"}
                                    variant={"outline-light"}
                                    onClick={() => {
                                        setButtonActiveName("ADMIN");
                                        navigate(ADMIN_ROUTE)
                                    }
                                    }>Админ панель</Button> : <Button
                                    className={buttonActiveName === "PROFILE" ? "button_nav_center navigationActive" : "button_nav_center"}
                                    variant={"outline-light"}
                                    onClick={() => {
                                        setButtonActiveName("PROFILE");
                                        navigate(PERSONAL_ACCOUNT_ROUTE)
                                    }}>Личный кабинет</Button>}
                                <Button
                                    className={"button_nav"}
                                    variant={"outline-light"}
                                    onClick={() => {
                                        setButtonActiveName("");
                                        logOut();
                                    }
                                    }>Выйти</Button>
                            </Nav>
                        </div>
                        :
                        <Nav className="ml-auto">
                            <Button className={"btnLook"} variant={"outline-light"}
                                    onClick={() => navigate(LOGIN_ROUTE)}>Авторизация</Button>
                        </Nav>
                    }
                </Container>
            </Navbar>
        </div>
    );
});

export default NavBar;