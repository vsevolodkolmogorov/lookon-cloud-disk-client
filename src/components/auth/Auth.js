import React, {useContext, useState} from 'react';
import {Container, Form, Card, Button} from "react-bootstrap";
import {NavLink, useLocation, useNavigate} from "react-router-dom";
import {LOGIN_ROUTE, REGISTRATION_ROUTE, SHOP_ROUTE} from "../../utils/consts";
import {observer} from "mobx-react-lite";
import {Context} from "../../index";
import Modal from "react-bootstrap/Modal";
import  "./Auth.css"
import {toJS} from "mobx";

const Auth = observer(() => {
    const {user} = useContext(Context)
    const location = useLocation();
    const navigate = useNavigate();
    const isLogin = location.pathname === LOGIN_ROUTE;

    const [firstName, setFirstName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(true);

    const [show, setShow] = useState(false);
    const [errorText, setErrorText] = useState('');
    const [emailNotification, setEmailNotification] = useState('');
    const handleClose = () => {
        setShow(false);
        setErrorText("");
    }
    const navigateToShop = () => navigate(SHOP_ROUTE);
    const handleShow = () => setShow(true);

    let errorCount = 0;

    const click = async () => {
        try {
            let errorsLogin;
            let errorsReg;

            if (isLogin) {
                errorsLogin = await user.login(email,password)
            } else {
                errorsReg = await user.registration(firstName, email, password)
            }

            if (errorsLogin != null) {
                setErrorText(errorsLogin);
                errorCount++;
                handleShow();
            }

            if (errorsReg != null) {
                console.log(errorsReg);
                errorsReg.map(i => {

                    if (i.param === "name") {
                        setErrorText("Имя пользователя не может быть пустым!");
                        errorCount++;
                    }

                    if (i.param === "email") {
                        setErrorText("Электронная почта заполнена неверно!");
                        errorCount++;
                    }

                    if (i.param === "password") {
                        setErrorText("Пароль должен быть больше восьми символов,содержать хотя бы одну цифру и заглавную букву!");
                        errorCount++;
                    }

                })
                handleShow();
            }

            if (toJS(user.user).isActivated === false && toJS(user.user).role === "USER") {
                setEmailNotification("Пожалуйста подтвердите вашу электронную почту!");
                errorCount++;
                handleShow();
            }

            if (errorCount < 1) {
                navigateToShop();
            }

        } catch (e) {
            alert(e.response.data.message)
        }
    }

    return (
        <Container
            className="userAuth d-flex justify-content-center align-items-center"
            style={{height: window.innerHeight - 254}}>
            {!isLogin ? <Card style={{width: 600}} className={"p-5"}>
                <h3 className={"m-auto"}>Регистрация</h3>
                <Form className={"d-flex flex-column"}>
                    <Form.Control placeholder={"Введить ваше имя"} className={"mt-3"} value={firstName} onChange={e => setFirstName(e.target.value)}/>
                    <Form.Control placeholder={"Введить ваш email"} className={"mt-3"} value={email} onChange={e => setEmail(e.target.value)}/>
                    <input placeholder={"Введить ваш пароль"} className={"authPassword mt-3"}  value={password} onChange={e => setPassword(e.target.value)} type={passwordVisible ? "password" : "text"}/>
                    <Form.Check
                        onChange={() => setPasswordVisible(!passwordVisible)}
                        className={"mt-3"}
                        type={"checkbox"}
                        label={"показать пароль"}
                    />
                    <div className={"btnSignIn d-flex justify-content-between align-items-center mt-3"} style={{width: "none"}}>
                        <div>
                            У вас есть аккаунт ? <NavLink to={LOGIN_ROUTE}>Войдите!</NavLink>
                        </div>
                        <Button id={"btnRegister"} onClick={click} className={"align-self-end"} variant={"dark"}>Зарегестрироваться</Button>
                    </div>
                </Form>
            </Card> : <Card style={{width: 600}} className={"p-5"}>
                <h3 className={"m-auto"}>Авторизация</h3>
                <Form className={"d-flex flex-column"}>
                    <Form.Control placeholder={"Введить ваш email"} className={"mt-3"} value={email} onChange={e => setEmail(e.target.value)}/>
                    <input placeholder={"Введить ваш пароль"} className={"authPassword mt-3"} value={password} onChange={e => setPassword(e.target.value)} type={passwordVisible ? "password" : "text"}/>
                    <Form.Check
                        onChange={() => setPasswordVisible(!passwordVisible)}
                        className={"mt-3"}
                        type={"checkbox"}
                        label={"показать пароль"}
                    />
                    <div className={"btnSignIn d-flex justify-content-between align-items-center mt-3"} style={{width: "none"}}>
                        <div>
                            Нет аккаунта ? <NavLink to={REGISTRATION_ROUTE}>Зарегестрируйтесь!</NavLink>
                        </div>
                        <Button onClick={click} className={"align-self-end"} variant={"dark"}>Войти</Button>
                    </div>
                </Form>
            </Card>
            }
            <Modal
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Внимание</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {errorText}
                    {emailNotification}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Закрыть
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
});

export default Auth;