import { FC } from "react";
import { Navigate } from "react-router-dom";

interface pros {
  children: React.ReactNode;
}

export const PrivateRoute: FC<pros> = ({ children }) => {
  const isAuthenticated =
    sessionStorage.getItem("token") != undefined ||
    sessionStorage.getItem("token") != null
      ? true
      : false;

  return isAuthenticated ? <>{children}</> : <Navigate to="/auth/login" />;
};
