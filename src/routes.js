import Admin from "./components/admin/Admin";
import Basket from "./components/basket/Basket";
import {
    ADMIN_ROUTE,
    BASKET_ROUTE, CREATE_LOOK_ROUTE,
    LOGIN_ROUTE, LOOK_ROUTE,
    MERCHANDISE_ROUTE, PERSONAL_ACCOUNT_ROUTE,
    REGISTRATION_ROUTE,
    SHOP_ROUTE
} from "./utils/consts";
import Shop from "./components/shop/Shop";
import Auth from "./components/auth/Auth";
import Merchandise from "./components/merchandise/Merchandise";
import PersonalAccount from "./components/account/PersonalAccount";
import Look from "./components/look/Look";
import CreateLook from "./components/look/createLook/CreateLook";

export const authRoutes = [
    {
        path: ADMIN_ROUTE,
        Component: Admin
    },
    {
        path: BASKET_ROUTE,
        Component: Basket
    },
    {
        path: PERSONAL_ACCOUNT_ROUTE,
        Component: PersonalAccount
    },
]

export const publicRoutes = [
    {
        path: SHOP_ROUTE,
        Component: Shop
    },
    {
        path: LOOK_ROUTE,
        Component: Look
    },
    {
        path: CREATE_LOOK_ROUTE,
        Component: CreateLook
    },
    {
        path: LOGIN_ROUTE,
        Component: Auth
    },
    {
        path: REGISTRATION_ROUTE,
        Component: Auth
    },
    {
        path: MERCHANDISE_ROUTE + '/:id',
        Component: Merchandise
    },
]
