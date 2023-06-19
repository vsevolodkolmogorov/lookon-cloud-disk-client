import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import React, {createContext} from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import UserStore from "./store/UserStore";
import MerchandiseStore from "./store/MerchandiseStore";
import './index.css'

export const Context = createContext(null)

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Context.Provider value={{
        user: new UserStore(),
        merchandise: new MerchandiseStore()
    }}>
        <App/>
    </Context.Provider>
);


