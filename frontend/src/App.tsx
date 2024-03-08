import * as React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import routes from "./config/routes";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {routes.map((route, index) => {
          return (
            <Route
              key={index}
              path={route.path}
              element={<route.element name={route.name} id={route.id} />}
            />
          );
        })}
      </Routes>
    </BrowserRouter>
  );
}
