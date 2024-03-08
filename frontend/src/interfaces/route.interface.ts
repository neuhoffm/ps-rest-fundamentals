import React from "react";
import IPageProps from "./page.interface";

export default interface IRoute {
  path: string;
  element: React.FunctionComponent<IPageProps>;
  name: string; // Used to update page info and title.
  id: string;
  icon?: string;
  protected: boolean; // This will defines if the route is protected or not
}
