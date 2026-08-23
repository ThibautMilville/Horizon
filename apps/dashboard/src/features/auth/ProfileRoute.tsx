import {Navigate} from "react-router-dom";

import {useAuth} from "./AuthProvider";
import {ProfilePage} from "./ProfilePage";

export function ProfileRoute() {
  const {user} = useAuth();

  if (!user) {
    return <Navigate replace to="/login" />;
  }

  return <ProfilePage user={user} />;
}
