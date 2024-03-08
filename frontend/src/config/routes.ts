import IRoute from "../interfaces/route.interface";
import HomePage from "../pages/HomePage";
import ItemPage from "../pages/ItemPage";

const routes: IRoute[] = [
  {
    path: "/",
    element: HomePage,
    name: "Home Page",
    protected: false,
    id: "home",
  },
  {
    path: "/item/:itemId",
    element: ItemPage,
    name: "Item Page",
    protected: false,
    id: "item",
  },
];
export default routes;
