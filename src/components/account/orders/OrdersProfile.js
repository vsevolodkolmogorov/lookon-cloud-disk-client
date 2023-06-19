import React from 'react';
import "../PersonalAccount.css";
import {useContext, useEffect, useState} from "react";
import {fetchBasket} from "../../../http/API/basketAPI";
import {toJS} from "mobx";
import {Context} from "../../../index";
import {fetchMerchandises} from "../../../http/API/merchandiseAPI";
import OrdersContent from "./OrdersContent";
import MakeKey from "../../../utils/makeKey";

const OrdersProfile = () => {
    const {merchandise, user} = useContext(Context);
    const [merch, setMerch] = useState([])

    useEffect(() => {
        const getBasketContent = async () => {
            const getData = await fetchBasket().then(function (result) {
                let selected = [];
                result.map(i => {
                        (toJS(merchandise.merchandises).map(m => {
                            if (m.id === i.merchandiseId && i.orderStatusId === 2 && i.userId === toJS(user.user).id) {
                                m.size = i.selectedSize;
                                m.sizeId = i.sizeId;
                                m.count = i.count;
                                m.updatedAt = i.updatedAt;
                                m.createdAt = i.createdAt;
                                m.numberOfOrder = i.orderNumber;
                                m.isAdmin = false;
                                m.merchandiseId = i.merchandiseId;
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
        fetchMerchandises(merchandise.selectedType.id, merchandise.selectedBrand.id, merchandise.page, 16).then(data => {
            merchandise.setTotalCount(data.count);
            merchandise.setMerchandises(data.rows);
        }).then(data => getBasketContent())

    }, [merchandise.isMerchDelete])

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

    return (
        <div>
            <h5>ЗАКАЗЫ</h5>
            <div className={"mt-4"}>
                <div className={"d-flex justify-content-between flex-wrap"}>
                    {
                        ordersList.length === 0 ? <span>здесь пока что пусто :(</span> : null
                    }
                    {
                        ordersList.map(item => {
                            return <OrdersContent key={MakeKey()} orders={item} />
                        })
                    }
                </div>
            </div>
        </div>
    );
};

export default OrdersProfile;