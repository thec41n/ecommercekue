import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const PrivateRoute = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const { pathname } = useLocation();

  return userInfo ? (
    <Outlet />
  ) : (
    <Navigate to={`/login?redirect=${pathname}`} replace />
  );
};

export default PrivateRoute;
