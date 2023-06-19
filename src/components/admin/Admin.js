import React, {useState} from 'react';
import {Button, Container, Row} from "react-bootstrap";
import CreateBrand from "../modals/CreateBrand";
import CreateType from "../modals/CreateType";
import {useEffect, useContext} from "react";
import {fetchBasket} from "../../http/API/basketAPI";
import {toJS} from "mobx";
import {fetchMerchandiseAvailable, fetchMerchandises} from "../../http/API/merchandiseAPI";
import {Context} from "../../index";
import OrdersContent from "../account/orders/OrdersContent";
import MakeKey from "../../utils/makeKey";
import UsersList from "../users/list/UsersList";
import CreateMerchandise from "../modals/CreateMerchandise";
import CreateSize from "../modals/CreateSize";
import CreateMerchandiseAvailable from "../modals/CreateMerchandiseAvailable";
import "./Admin.css"
import MerchandiseList from "../merchandise/list/MerchandiseList";
import {CREATE_LOOK_ROUTE} from "../../utils/consts";
import {useNavigate} from "react-router-dom";

const Admin = () => {
    const {merchandise, user} = useContext(Context);
    const [merch, setMerch] = useState([]);
    const navigate = useNavigate();

    let usersList = [];
    if (toJS(user.users).length !== undefined) {
        usersList = toJS(user.users);
    }

    useEffect(() => {
        user.getUsers();
        user.getAllAddress();
        const getBasketContent = async () => {
            const getData = await fetchBasket().then(function (result) {
                let selected = [];
                result.map(i => {
                        (toJS(merchandise.merchandises).map(m => {
                            if (m.id === i.merchandiseId && i.orderStatusId === 2) {
                                m.size = i.selectedSize;
                                m.numberOfOrder = i.orderNumber;
                                m.updatedAt = i.updatedAt;
                                m.createdAt = i.createdAt;
                                m.isAdmin = true;
                                m.sizeId = i.sizeId;
                                m.count = i.count;
                                m.merchandiseId = i.merchandiseId;
                                toJS(user.users).map(u => {
                                    if (i.userId === u.id) {
                                        m.user = u;
                                    }
                                })
                                toJS(user.allAddress).map(a => {
                                    if (i.addressId === a.id) {
                                        m.address = a;
                                    }
                                })
                                selected.push(m);
                            }
                        }))
                    }
                )
                return selected;
            });
            getData.push({numberOfOrder: "numberOfOrder"})
            setMerch(getData);
        }

        fetchMerchandises(null, null, merchandise.page, 16, true).then(data => {
            merchandise.setMerchandises(data.rows);
            fetchMerchandiseAvailable().then(available => {
                merchandise.setMerchandisesAvailable(available);
            })
        }).then(data => getBasketContent())
    }, [user])


    let ordersList = [];
    let order = [];

    for (let i = 0; i < merch.length; i++) {
        if (i !== 0) {
            if (merch[i - 1].numberOfOrder !== merch[i].numberOfOrder) {
                ordersList.push(order);
                order = [];
                order.push(merch[i]);
            } else {
                order.push(merch[i]);
            }
        } else {
            order.push(merch[i]);
        }
    }

    ordersList.isAdmin = true;

    const [brandVisible, setBrandVisible] = useState(false);
    const [typeVisible, setTypeVisible] = useState(false);
    const [sizeVisible, setSizeVisible] = useState(false);
    const [merchVisible, setMerchVisible] = useState(false);
    const [merchVisibleAva, setMerchVisibleAva] = useState(false);

    return (
        <Container>
            <div className={"adminModals d-flex flex-column"}>
                <Button
                    variant={"outline-dark"}
                    className={"mt-3 p-2"}
                    onClick={() => setTypeVisible(true)}
                >Создать тип</Button>
                <Button
                    variant={"outline-dark"}
                    className={"mt-3 p-2"}
                    onClick={() => setBrandVisible(true)}
                >Создать бренд</Button>
                <Button
                    variant={"outline-dark"}
                    className={"mt-3 p-2"}
                    onClick={() => setMerchVisible(true)}
                >Создать товар</Button>
                <Button
                    variant={"outline-dark"}
                    className={"mt-3 p-2"}
                    onClick={() => setSizeVisible(true)}
                >Создать размер</Button>
                <Button
                    variant={"outline-dark"}
                    className={"mt-3 p-2"}
                    onClick={() => setMerchVisibleAva(true)}
                >Добавить товар в магазин</Button>
                <Button
                    variant={"outline-dark"}
                    className={"mt-3 p-2"}
                    onClick={() => navigate(CREATE_LOOK_ROUTE)}>
                    Создать лук</Button>

                <CreateBrand show={brandVisible} onHide={() => setBrandVisible(false)}/>
                <CreateType show={typeVisible} onHide={() => setTypeVisible(false)}/>
                <CreateSize show={sizeVisible} onHide={() => setSizeVisible(false)}/>
                <CreateMerchandise show={merchVisible} onHide={() => setMerchVisible(false)}/>
                <CreateMerchandiseAvailable show={merchVisibleAva} onHide={() => setMerchVisibleAva(false)}/>
            </div>
            {
                ordersList.length !== 0 ? <div className={"d-flex flex-column userList"}>
                    <h5 className={"mt-4"}>Заказы пользователей:</h5>
                    <Row >
                        {
                            ordersList.map(item => {
                                return <OrdersContent key={MakeKey()} orders={item}/>
                            })
                        }
                    </Row>
                </div> : null

            }
            {
                usersList.length !== 0 ? <div className={"d-flex flex-column userList"}>
                    <h5 className={"mt-4"}>Список пользователей:</h5>
                    <Row>
                        {
                            usersList.map(users => {
                                return <UsersList key={MakeKey()} users={users}/>
                            })
                        }
                    </Row>
                </div> : null
            }
            <div className={"d-flex flex-column userList"}>
                <h5 className={"mt-4"}>Список скрытых товаров:</h5>
                <div className={"col-md-12"}>
                    {
                        <MerchandiseList key={MakeKey()} isAdmin={true} />
                    }
                </div>
            </div>
        </Container>
    );
};

export default Admin;