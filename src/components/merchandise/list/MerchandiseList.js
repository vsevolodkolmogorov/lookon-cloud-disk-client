import React, {useContext} from 'react';
import {observer} from "mobx-react-lite";
import {Context} from "../../../index";
import {Row} from "react-bootstrap";
import MerchandiseItem from "../item/MerchandiseItem";
import MakeKey from "../../../utils/makeKey";
import {toJS} from "mobx";

const MerchandiseList = observer(({isAdmin, isLook}) => {
    const {merchandise} = useContext(Context);
    const available = [...toJS(merchandise.merchandisesAvailable), []];
    const unavailableList = [...toJS(merchandise.merchandises)];
    let merchandisesList = [];
    let merch = [];

    for (let i = 0; i < available.length; i++) {
        if (i !== 0) {
            if (available[i - 1].merchandiseId !== available[i].merchandiseId) {
                toJS(merchandise.merchandises).map((ml, number) => {
                    if (ml.id === merch[0].merchandiseId) {
                        unavailableList.map((item,num) => {
                            if (item.id === ml.id) {
                                delete unavailableList[num];
                            }
                        });
                    }
                })
                if (toJS(merchandise.searchText).length === 0) {
                    if (toJS(merchandise.minPrice) <= merch[0].price && toJS(merchandise.maxPrice) >= merch[0].price) {
                        merchandisesList.push(merch);
                    }
                } else {
                    if (toJS(merchandise.searchText) === merch[0].name) {
                        merchandisesList.push(merch);
                    } else {
                        let coincidence = 0;
                        let length = toJS(merchandise.searchText).length > merch[0].name.length ? merch[0].name.length : toJS(merchandise.searchText).length
                        for (let i = 0; i < length; i++) {
                            if (toJS(merchandise.searchText)[i].toLowerCase() === merch[0].name[i].toLowerCase()) {
                                if (i === 0) {
                                    coincidence = coincidence + 4;
                                } else if (i === 1) {
                                    coincidence = coincidence + 3;
                                } else {
                                    coincidence++;
                                }
                            }
                        }
                        if (coincidence >= 4) {
                            if (toJS(merchandise.minPrice) <= merch[0].price && toJS(merchandise.maxPrice) >= merch[0].price) {
                                merchandisesList.push(merch);
                            }
                        }
                    }
                }
                merch = [];
                merch.push(available[i]);
            } else {
                merch.push(available[i]);
            }
        } else {
            merch.push(available[i]);
        }
    }


    return (
        <Row style={{margin: "0px auto"}}>
            {!isAdmin ? merchandisesList.map(merch =>
                <MerchandiseItem key={MakeKey()} merch={merch} isAdmin={isAdmin} isLook={isLook} viewOnly={false}/>) : unavailableList.map(merch =>
                <MerchandiseItem key={MakeKey()} merch={merch} isAdmin={isAdmin} viewOnly={false}/>)}

            {(merchandise.merchandisesAvailable.length <= 0 && !isAdmin)
                ?
                <h3 className="d-flex justify-content-center align-items-center"
                    style={{height: window.innerHeight - 415}}>{merchandise.textMerchNull}</h3>
                :
                null
            }
        </Row>
    );
});

export default MerchandiseList;