import {BrowserRouter} from "react-router-dom";
import AppRouter from "./components/appRouter/AppRouter";
import NavBar from "./components/bars/navBar/NavBar";
import {observer} from "mobx-react-lite";
import {useContext, useEffect, useState} from "react";
import {Context} from "./index";
import {Spinner} from "react-bootstrap";
import {
    fetchBrands,
    fetchLook,
    fetchMerchandiseAvailable,
    fetchMerchandises,
    fetchTypes
} from "./http/API/merchandiseAPI";

const App = observer(() => {
    const {user, merchandise} = useContext(Context)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchLook().then(data => {
            merchandise.setLooks(data);
        })
        fetchMerchandises(merchandise.selectedType.id, merchandise.selectedBrand.id, merchandise.page, 16, false).then(data => {
            merchandise.setMerchandises(data.rows);
            fetchMerchandiseAvailable().then(available => {
                merchandise.setMerchandisesAvailable(available);
            })
            fetchTypes().then(data => {
                merchandise.setTypes(data);
            })
            fetchBrands().then(data => {
                merchandise.setBrands(data);
            })
        })
        if (localStorage.getItem('token')) {
            user.checkIsAuth().then(data => {
                    setLoading(false);
                }
            )
        } else {
            setLoading(false);
        }
    }, [])

    if (loading) {
        return <Spinner animation={"grow"}/>
    }

    return (
        <BrowserRouter>
            <div className={"mainBackground"} style={{padding: "10px"}}>
                <NavBar/>
                <AppRouter/>
            </div>
        </BrowserRouter>
    );
});

export default App;
