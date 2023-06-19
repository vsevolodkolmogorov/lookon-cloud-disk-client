import React, {useContext} from 'react';
import {observer} from "mobx-react-lite";
import {Context} from "../../../index";
import {Col, Dropdown} from "react-bootstrap";
import MakeKey from "../../../utils/makeKey";
import './BrandBar.css'

const BrandBar = observer(() => {
    const {merchandise} = useContext(Context)
    return (
        <div className={"sortingWrapper"}>
            <Col md={12} className={"d-flex flex-wrap"}>
                <Dropdown>
                    <div className={"dropdownFilter"}>
                        <Dropdown.Toggle variant={"outline-light"}>Бренд</Dropdown.Toggle>
                        <Dropdown.Menu>
                                {merchandise.brands.map(brand =>
                                    <Dropdown.Item
                                        style={{cursor: "pointer"}}
                                        key={MakeKey()}
                                        className={"p-2 m-1"}
                                        onClick={() => merchandise.setSelectedBrand(brand)}
                                        border={brand.id === merchandise.selectedBrand.id ? 'secondary' : "light"}>
                                        {brand.name.charAt(0).toUpperCase() + brand.name.slice(1)}
                                    </Dropdown.Item>
                                )}
                        </Dropdown.Menu>
                    </div>
                </Dropdown>
            </Col>
        </div>
    );
});

export default BrandBar;