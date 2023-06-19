import React from 'react';
import {Image} from "react-bootstrap";
import {MERCHANDISE_ROUTE} from "../../../utils/consts";
import {useNavigate} from "react-router-dom";
import "./../PersonalAccount.css"

const OrdersItems = ({merch}) => {
    const navigate = useNavigate()
    return (
        <div>
            <div className={"orderImageWrapper"}>
                <Image style={{cursor: "pointer"}} onClick={() => {
                    navigate(MERCHANDISE_ROUTE + '/' +  merch.id);
                }} src={process.env.REACT_APP_API_URL + merch.image} />
            </div>
            <div>
                <div>
                    <p style={{margin: "5px",fontWeight:"600",fontSize:"14px"}}>{merch.name.toLowerCase()}</p>
                    <p style={{margin: "0px"}}>Размер: {merch.size}</p>
                    <p style={{margin: "0px"}}>Количество: {merch.count}</p>
                </div>
            </div>
        </div>
    );
};

export default OrdersItems;