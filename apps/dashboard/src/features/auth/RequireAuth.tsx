import {Navigate, Outlet, useLocation} from "react-router-dom";

import {useAuth} from "./AuthProvider";

export function RequireAuth() {
  const {user} = useAuth();
  const location = useLocation();

  if (!user) {
    return (
      <Navigate
        replace
        state={{from: `${location.pathname}${location.search}${location.hash}`}}
        to="/login"
      />
    );
  }

  return <Outlet />;
}
