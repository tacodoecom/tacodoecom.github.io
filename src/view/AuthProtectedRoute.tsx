import {Api} from "../api/api";
import {Navigate} from "react-router-dom";

export const AuthProtectedRoute = function (props: { children: any, api: Api }) {
  const api = props.api;
  if (!api.isLoggedIn()) {
    return <Navigate to="/login"/>
  }
  return props.children;
}
