import React from 'react';
import {Card, Spinner} from "react-bootstrap";
import MerchandiseItem from "../../merchandise/item/MerchandiseItem";
import MakeKey from "../../../utils/makeKey";
import {toJS} from "mobx";
import {useContext,useState,useEffect} from "react";
import {Context} from "../../../index";

const LookItem = ({look}) => {
    const context = useContext(Context);
    const merchandises = [];

    toJS(context.merchandise.looks).lookMerchandise.map(lm => {
        (toJS(context.merchandise.merchandises).map(m => {
            if (m.id === lm.merchandiseId && lm.lookId === look.id) {
                merchandises.push(m);
            }
        }))
    })

    return (
        <Card className={"lookCard"}>
            <div>
                <h5>{look.name}</h5>
                <h5>{look.description}</h5>
            </div>
            <div className={"d-flex flex-wrap justify-content-center look"}>
                {
                    merchandises.map(m => {
                        return <MerchandiseItem key={MakeKey()} merch={m} isAdmin={true} isLook={false} viewOnly={true}/>
                    })
                }
            </div>
        </Card>
    );
}

export default LookItem;