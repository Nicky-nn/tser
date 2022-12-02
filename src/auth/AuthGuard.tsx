import React, { FC } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

import useAuth from '../app/base/hooks/useAuth';
import { PerfilProps } from '../app/base/models/loginModel';
import { appRoutes } from '../app/routes/routes';
import { isEmptyValue } from '../app/utils/helper';
import { flat } from '../app/utils/utils';

// Verificamos si el usuario tiene acceso a cierto rol
const userHasPermission = (pathname: any, user: PerfilProps, routes: any) => {
  try {
    if (isEmptyValue(user)) {
      return false;
    }
    const matched = routes.find((r: any) => r.path === pathname);
    return matched && matched.auth && matched.auth.length
      ? matched.auth.includes(user.tipo)
      : true;
  } catch (e: any) {
    return false;
  }
};

type Props = {
  children: JSX.Element | JSX.Element[];
};

const AuthGuard: FC<Props> = ({ children }: Props) => {
  const { pathname } = useLocation();
  try {
    const { isAuthenticated, user } = useAuth();
    const routes = flat(appRoutes);

    // tiene permisos?
    const hasPermission = userHasPermission(pathname, user, routes);
    // IF YOU NEED ROLE BASED AUTHENTICATION,
    // UNCOMMENT ABOVE TWO LINES, getUserRoleAuthStatus METHOD AND user VARIABLE
    // AND COMMENT OUT BELOW LINE
    let authenticated = isAuthenticated && hasPermission;

    console.log('app,auth,authguard', pathname, authenticated);
    return (
      <>
        {isAuthenticated ? (
          children
        ) : (
          <Navigate replace to="/session/signin" state={{ from: pathname }} />
        )}
      </>
    );
  } catch (e) {
    return <Navigate replace to="/session/signin" state={{ from: pathname }} />;
  }
};

export default AuthGuard;
