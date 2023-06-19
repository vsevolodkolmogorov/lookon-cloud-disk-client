import React from 'react';
import {useContext} from "react";
import {Context} from "../../index";
import "./Basket.css";
import {fetchBasket} from "../../http/API/basketAPI";
import {toJS} from "mobx";
import {useEffect, useState} from "react";
import BasketContent from "./content/BasketContent";
import {fetchMerchandises} from "../../http/API/merchandiseAPI";
import {observer} from "mobx-react-lite";

const Basket = observer(() => {
    const context = useContext(Context);
    const [merch, setMerch] = useState([])

    useEffect(() => {
        context.merchandise.setSelectedType("");
        context.merchandise.setSelectedBrand("");
        const getBasketContent = async () => {
            const getData = await fetchBasket().then(function (result) {
                let selected = [];
                result.map(i => (toJS(context.merchandise.merchandises).map(m => {
                        if (m.id === i.merchandiseId && i.orderStatusId === 1 && i.userId === toJS(context.user.user).id) {
                            m.size = i.selectedSize;
                            m.sizeId = i.sizeId;
                            m.updatedAt = i.updatedAt;
                            m.createdAt = i.createdAt;
                            m.count = i.count;
                            m.merchandiseId = i.merchandiseId;
                            selected.push(m);
                        }
                })))
                return selected;
            });
            setMerch(getData);
        }

        fetchMerchandises(context.merchandise.selectedType.id, context.merchandise.selectedBrand.id, context.merchandise.page, 16).then(data => {
            context.merchandise.setTotalCount(data.count);
            context.merchandise.setMerchandises(data.rows);
        }).then(data => getBasketContent())

    }, [context.merchandise.isMerchDelete])

    return  <BasketContent content={merch} />;
});

export default Basket;