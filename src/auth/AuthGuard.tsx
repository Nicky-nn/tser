import React, {FC, useEffect, useState} from 'react'
import {Navigate, useLocation} from 'react-router-dom'
import {flat} from "../app/utils/utils";
import {AllPages} from "../app/routes/routes";
import {PerfilProps} from "../app/base/models/loginModel";
import useAuth from "../app/base/hooks/useAuth";

const getUserRoleAuthStatus = (pathname: any, user: PerfilProps, routes: any) => {
    if (!user) {
        return false
    }
    const matched = routes.find((r: any) => r.path === pathname)

    const authenticated =
        matched && matched.auth && matched.auth.length
            ? matched.auth.includes(user.tipo)
            : true
    return authenticated
}

type Props = {
    title: string,
    children: JSX.Element,
};

const AuthGuard: FC<any> = ({children}: Props) => {
    const {isAuthenticated, user}: any = useAuth()

    // return <>{isAuthenticated ? children : <Navigate to="/session/signin" />}</>

    const [previouseRoute, setPreviousRoute]: any = useState(null)
    const {pathname} = useLocation()
    const routes = flat(AllPages())
    const isUserRoleAuthenticated = getUserRoleAuthStatus(
        pathname,
        user,
        routes
    )
    let authenticated = isAuthenticated && isUserRoleAuthenticated

    // IF YOU NEED ROLE BASED AUTHENTICATION,
    // UNCOMMENT ABOVE TWO LINES, getUserRoleAuthStatus METHOD AND user VARIABLE
    // AND COMMENT OUT BELOW LINE

    // let authenticated = isAuthenticated

    useEffect(() => {
        if (previouseRoute !== null) setPreviousRoute(pathname)
    }, [pathname, previouseRoute])

    if (authenticated) return <>{children}</>
    else {
        return (
            <Navigate
                to="/session/signin"
                state={{redirectUrl: previouseRoute}}
            />
        )
    }
}

export default AuthGuard
