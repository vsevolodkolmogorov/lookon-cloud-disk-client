import React from 'react';
import {Button, Card, Col} from "react-bootstrap";
import OrdersItems from "./OrdersItems";
import MakeKey from "../../../utils/makeKey";
import {deleteBasket} from "../../../http/API/basketAPI";
import {useContext} from "react";
import {Context} from "../../../index";
import Modal from "react-bootstrap/Modal";
import {useState} from "react";
import {updateMerchandiseAvailable} from "../../../http/API/merchandiseAPI";

const OrdersContent = ({orders}) => {
    const context = useContext(Context);
    const [show, setShow] = useState(false);
    const handleClose = () => {
        setShow(false);
    };
    const handleShow = () =>  setShow(true);
    const [codeModal, setCodeModal] = useState("");
    const [showOrders, setShowOrders] = useState(false);
    const handleCloseOrders = () => {
        setShowOrders(false);
        setCodeModal("");
    }
    const handleShowOrders = () => setShowOrders(true);

    let data, uniqueCode, address, user, isAdmin, userId, price = 0;

    orders.map(item => {
        data = item.createdAt;
        uniqueCode = item.numberOfOrder;
        price = item.price + price;
        userId = item.userId;
        isAdmin = item.isAdmin;
        user = item.user;
        address = item.address;
    })

    let today = new Date();
    let day = String(today.getDate()).padStart(2, '0');
    let month = String(today.getMonth() + 1).padStart(2, '0');
    let dataNow = month + "-" + day;

    return (
        <Col md={6} sm={6} lg={4}>
            <Card className={"ordersContentCard mt-4"}>
                <Card.Header style={{height: "40px"}}></Card.Header>
                <Card.Body>
                    <div className={"ordersContentClient"}>
                        {isAdmin ? <div className={"d-flex flex-column"}>
                            <button onClick={() => {
                                setCodeModal("CLIENT");
                                handleShowOrders();
                            }}>Клиент
                            </button>
                            <button onClick={() => {
                                setCodeModal("ADDRESS");
                                handleShowOrders();
                            }}>Адрес
                            </button>
                        </div> : null}
                        <div>
                            <p>Дата заказа: {data.substr(0, 10)}</p>
                            <p>Уникальный код: {uniqueCode}</p>
                        </div>
                    </div>
                    <div className={"d-flex justify-content-center"}>
                        {
                            orders.length < 3 ? orders.map(item => {
                                return <OrdersItems key={MakeKey()} merch={item}/>
                            }) : <Button className={"ordersContentBtn"}  onClick={() => {
                                setCodeModal("ITEMS");
                                handleShowOrders();
                            }}>Показать товары</Button>
                        }
                    </div>
                    <div className={"mt-2 d-flex justify-content-center"}>
                        {
                            isAdmin ? <Button className={"ordersContentBtn"} variant={"danger"} onClick={handleShow}>
                                Отменить заказ
                            </Button> : dataNow === data.substr(5, 5) ? <Button className={"ordersContentBtn"} variant={"danger"} onClick={handleShow}>
                                Отменить заказ
                            </Button> : null
                        }
                    </div>
                </Card.Body>
                <Card.Footer>
                    <p style={{margin: "0"}}>Стоимость: {price} руб.</p>
                </Card.Footer>
            </Card>
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
                    Вы уверены что хотите отменить заказ?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Закрыть
                    </Button>
                    <Button variant="danger" onClick={() => {
                        context.merchandise.setIsMerchDelete(MakeKey());
                        orders.map(item => {
                            try {
                                updateMerchandiseAvailable({sizeId:item.sizeId, merchandiseId:item.merchandiseId, count:item.count, isCancel: true});
                                deleteBasket(item.createdAt).then(data => {
                                    window.location.reload();
                                });
                            } catch (e) {
                                console.log(e);
                            }
                        })
                        handleClose();
                    }}>Отменить</Button>
                </Modal.Footer>
            </Modal>
            <Modal
                show={showOrders}
                onHide={handleCloseOrders}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Товары</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className={"d-flex flex-wrap justify-content-center"}>
                        {
                            codeModal === "CLIENT" ? <div>
                                <div>
                                    <p>Фамилия: {user.secondName}</p>
                                    <p>Имя: {user.firstName}</p>
                                    <p>Отчество: {user.patronymic}</p>
                                    <p>E-mail: {user.email}</p>
                                    <p>Номер: {user.phoneNumber}</p>
                                </div>
                            </div> : null
                        }
                        {
                            codeModal === "ADDRESS" ? <div>
                                <div>
                                    <p>Город: {address.city}</p>
                                    <p>Улица: {address.street}</p>
                                    <p>Дом: {address.house}</p>
                                    <p>Квартира: {address.flat}</p>
                                    <p>Индекс: {address.index}</p>
                                    <p>Корпус: {address.corpus}</p>
                                    <p>Описание: {address.description}</p>
                                </div>
                            </div> : null
                        }
                        {
                            codeModal === "ITEMS" ? orders.map(item => {
                                return <OrdersItems key={MakeKey()} merch={item}/>
                            }) : null
                        }
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseOrders}>
                        Закрыть
                    </Button>
                </Modal.Footer>
            </Modal>
        </Col>
    );
};

export default OrdersContent;