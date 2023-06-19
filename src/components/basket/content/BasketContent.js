import React from 'react';
import {Button, Col, Container, Form} from "react-bootstrap";
import BasketItem from "../item/BasketItem";
import MakeKey from "../../../utils/makeKey";
import "../Basket.css"
import {toJS} from "mobx";
import {useContext, useState} from "react";
import {Context} from "../../../index";
import Modal from "react-bootstrap/Modal";
import {useEffect} from "react";
import {updateBasket} from "../../../http/API/basketAPI";
import {useNavigate} from "react-router-dom";
import {PERSONAL_ACCOUNT_ROUTE} from "../../../utils/consts";
import {fetchOneMerchandise, updateMerchandiseAvailable} from "../../../http/API/merchandiseAPI";
import {observer} from "mobx-react-lite";

const BasketContent = observer(({content}) => {
    const navigate = useNavigate()
    const context = useContext(Context);
    const [city, setCity] = useState("");
    const [street, setStreet] = useState("");
    const [index, setIndex] = useState("");
    const [house, setHouse] = useState("");
    const [corpus, setCorpus] = useState("");
    const [flat, setFlat] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [description, setDescription] = useState("");
    const [cantBuy, setCantBuy] = useState(true);
    const [modalText, setModalText] = useState("");
    const [show, setShow] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const inputs = [city, street, index, house, flat, phoneNumber];
    const handleClose = () => {
        setShow(false);
    }
    const handleShow = () => setShow(true);
    const handleCloseForm = () => {
        setShowForm(false);
        window.location.reload();
    }
    const handleShowForm = () => {
        if (toJS(context.user.userAddress) || toJS(context.user.userAddress).length !== undefined) {
            setModalText("Заполнить форму данными из вашего профиля?");
            handleShow();
        } else {
            setShowForm(true);
        }
    };

    let allPrice = 0;
    let sizes = [];
    let count = [];
    let names = []
    let error = 0;

    content.map(item => {
        allPrice = item.price * item.count + allPrice;
        sizes.push(item.size);
        count.push(item.count);
        names.push(item.name);
    });

    if (phoneNumber === "7") {
        setPhoneNumber("8");
    }

    const validate = (event) => {
        let key;
        if (event.type === 'paste') {
            key = event.clipboardData.getData('text/plain');
        } else {
            key = event.keyCode || event.which;
            key = String.fromCharCode(key);
        }
        let regex = /[0-9]|\./;
        if (!regex.test(key)) {
            event.returnValue = false;
            if (event.preventDefault) event.preventDefault();
        }
    }

    const pay = () => {
        if (!toJS(context.user.user).isActivated) {
            setModalText("Для приобритения товаров нужно подтвердить электронную почту!");
            handleShow();
        } else {
            handleShowForm();
        }
    }

    const createOrder = () => {
        const generatedNumber = MakeKey();
        inputs.map((i) => {
            if (i === "") {
                setModalText("Пожалуйста заполните все поля!");
                error++;
                handleShow();
            }
        })
        if (error === 0) {
            context.user.createAddress(city, street, index, house, corpus, flat, description, toJS(context.user.user).email, undefined, true).finally(() => {
                content.map(item => {
                    updateBasket({createdAt: item.createdAt, orderStatusId: 2, orderNumber: generatedNumber, addressId:toJS(context.user.orderAddress).id,email:toJS(context.user.user).email,price:allPrice,sizes:sizes,count:count,names:names}).then(updateMerchandiseAvailable({sizeId:item.sizeId, merchandiseId:item.merchandiseId, count:item.count}));
                })
            })
            context.user.updateUser(toJS(context.user.user).email, null, null, null, null, null, phoneNumber);
            setModalText("Спасибо за заказ!");
            handleShow();
        }
    }

    useEffect(() => {
        context.merchandise.setSelectedMerchandises(content);
        content.length !== 0 ? setCantBuy(false) : setCantBuy(true);
    }, [content])

    let btn_class = cantBuy ? "disableButton" : "enableButton";

    return (
        <Container className={"d-flex basketContainer"}>
            <Col className={"basketItems"} sm={12} md={12} lg={8}>
                <div className={"selectedMerch d-flex justify-content-center"}>
                    <div>
                        <h3>Ваш заказ:</h3>
                        {
                            content.map(item => <BasketItem merch={item} key={MakeKey()}/>)
                        }
                    </div>
                </div>
            </Col>
            <Col className={"basketPrice d-flex justify-content-center"} sm={12} md={12} lg={4} >
                <div className={"checkout"}>
                    <h3>Сумма заказа</h3>
                    <p className={"mt-3"}>Общая стомость: {allPrice} руб.</p>
                    <Button className={btn_class} id={"btnPay"} variant={"dark"} disabled={cantBuy} onClick={pay}>Оплатить</Button>
                </div>
            </Col>
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
                    {modalText}
                </Modal.Body>
                <Modal.Footer>
                    {modalText === "Для приобритения товаров нужно подтвердить электронную почту!" ?
                        <Button variant="light" onClick={() => {
                            navigate(PERSONAL_ACCOUNT_ROUTE);
                        }}>
                            Подтвердить e-mail
                        </Button> : null}
                    {modalText === "Заполнить форму данными из вашего профиля?" ?
                        <Button variant="success" onClick={() => {
                            setCity(toJS(context.user.userAddress).city);
                            setStreet(toJS(context.user.userAddress).street);
                            setIndex(toJS(context.user.userAddress).index);
                            setHouse(toJS(context.user.userAddress).house);
                            setCorpus(toJS(context.user.userAddress).corpus);
                            setFlat(toJS(context.user.userAddress).flat);
                            setPhoneNumber(toJS(context.user.user).phoneNumber);
                            setDescription(toJS(context.user.userAddress).description);
                            handleClose();
                            setShowForm(true);
                        }}>
                            Заполнить
                        </Button> : null}
                    <Button variant="danger" onClick={() => {
                        if (modalText === "Заполнить форму данными из вашего профиля?") {
                            setShowForm(true);
                        }
                        if (modalText === "Спасибо за заказ!") {
                            handleCloseForm();
                        }
                        handleClose();
                    }}>
                        Закрыть
                    </Button>
                </Modal.Footer>
            </Modal>
            <Modal
                show={showForm}
                onHide={handleCloseForm}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Внимание</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <div className={"d-flex flex-wrap justify-content-between"}>
                            <div className={"accountSelectDataBirthday"}>
                                <div className={"mt-4 d-flex align-items-center"}>
                                    <span className={"accountFormSpan"}>Город</span>
                                    <Form.Control placeholder={"Город"} value={city}
                                                  onChange={e => setCity(e.target.value)}/>
                                </div>
                                <div className={"mt-4 d-flex align-items-center"}>
                                    <span className={"accountFormSpan"}>Улица</span>
                                    <Form.Control placeholder={"Улица"} value={street}
                                                  onChange={e => setStreet(e.target.value)}/>
                                </div>
                            </div>
                            <div className={"accountSelectDataBirthday"}>
                                <div className={"mt-4 d-flex align-items-center"}>
                                    <span className={"accountFormSpan"}>Индекс</span>
                                    <Form.Control placeholder={"Индекс"} value={index}
                                                  onKeyPress={event => validate(event)}
                                                  maxLength="6" onChange={e => setIndex(e.target.value)}/>
                                </div>
                                <div className={"mt-4"}>
                                    <div className={"mt-2  d-flex justify-content-between align-items-center"}>
                                        <Form.Control className={"accountSelectDataBirthdayDataYear"} maxLength={5}
                                                      placeholder={"Дом"}
                                                      value={house} onChange={e => setHouse(e.target.value)}/>
                                        <Form.Control className={"accountSelectDataBirthdayDataYear"} maxLength={5}
                                                      placeholder={"Корп."}
                                                      value={corpus} onChange={e => setCorpus(e.target.value)}/>
                                        <Form.Control className={"accountSelectDataBirthdayDataYear"} maxLength={5}
                                                      placeholder={"Кв."}
                                                      value={flat} onChange={e => setFlat(e.target.value)}/>
                                    </div>
                                </div>
                            </div>
                            <div className={"accountSelectDataBirthday"}>
                                <div className={"mt-4 d-flex align-items-center"}>
                                    <span className={"accountFormSpan"}>Телефон</span>
                                    <Form.Control placeholder={"Телефон"} value={phoneNumber} maxLength="11"
                                                  onKeyPress={event => validate(event)}
                                                  onChange={e => setPhoneNumber(e.target.value)}/>
                                </div>
                            </div>
                        </div>
                        <div className={"mt-4"}>
                            <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                                <Form.Label>Комментарий</Form.Label>
                                <Form.Control style={{resize: "none"}} value={description}
                                              onChange={e => setDescription(e.target.value)} as="textarea" rows={3}/>
                            </Form.Group>
                        </div>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={handleCloseForm}>
                        Отменить
                    </Button>
                    <Button variant="success" onClick={createOrder}>
                        Заказать
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
});

export default BasketContent;