import React, {useContext} from 'react';
import {observer} from "mobx-react-lite";
import {Context} from "../../../index";
import {Col, Dropdown, Form} from "react-bootstrap";
import MakeKey from "../../../utils/makeKey";
import "./PriceBar.css"
import {useState} from "react";
import {toJS} from "mobx";

const PriceBar = observer(() => {
    const {merchandise} = useContext(Context)

    Array.prototype.max = function () {
        return Math.max.apply(null, this);
    };

    Array.prototype.min = function () {
        return Math.min.apply(null, this);
    };

    const [minPrice, setMinPrice] = useState(toJS(merchandise.prices).min());
    const [maxPrice, setMaxPrice] = useState(toJS(merchandise.prices).max());

    const setPrices = () => {
        merchandise.setMinPrice(minPrice);
        merchandise.setMaxPrice(maxPrice);
    }

    return (
        <div className={"sortingWrapper"}>
            <Col md={12} className={"d-flex justify-content-between align-items-center"}>
                <Dropdown>
                    <div className={"dropdownFilter"}>
                    <Dropdown.Toggle variant={"outline-light"} >Цена</Dropdown.Toggle>
                    <Dropdown.Menu>
                        <div className={"d-flex dropdownFilerPrice"}>
                            <input placeholder={"min"} value={minPrice} onChange={e => setMinPrice(e.target.value)}/>
                            <span>—</span>
                            <input placeholder={"max"} value={maxPrice} onChange={e => setMaxPrice(e.target.value)}/>
                            <Dropdown.Item
                                style={{cursor: "pointer"}}
                                key={MakeKey()}
                                className={"p-2 m-1"}
                                onClick={setPrices}
                            >
                                ОК
                            </Dropdown.Item>
                        </div>
                    </Dropdown.Menu>
                    </div>
                </Dropdown>
            </Col>
        </div>
    );
});

export default PriceBar;