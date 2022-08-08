import React, {createContext, useEffect, useReducer} from 'react'
import jwtDecode from 'jwt-decode'
import MatxLoading from "../components/Template/MatxLoading/MatxLoading";
import {loginModel, PerfilProps, UserProps} from "../models/loginModel";
import {perfilModel} from "../models/perfilModel";
import {AccessToken} from "../models/paramsModel";

type InitialStateProps = {
    isAuthenticated: boolean,
    isInitialised: boolean,
    user: PerfilProps,
}
const initialState: InitialStateProps = {
    isAuthenticated: false,
    isInitialised: false,
    user: {} as PerfilProps,
}

const isValidToken = (accessToken: string) => {
    if (!accessToken) {
        return false
    }

    const decodedToken: any = jwtDecode(accessToken)
    const currentTime = Date.now() / 1000
    return decodedToken.exp > currentTime
}

const setSession = (accessToken: string | null) => {
    if (accessToken) {
        localStorage.setItem('accessToken', accessToken)
        // axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`
    } else {
        localStorage.removeItem('accessToken')
        // delete axios.defaults.headers.common.Authorization
    }
}

const reducer = (state: any, action: any) => {
    switch (action.type) {
        case 'INIT': {
            const {isAuthenticated, user} = action.payload

            return {
                ...state,
                isAuthenticated,
                isInitialised: true,
                user,
            }
        }
        case 'LOGIN': {
            const {user} = action.payload

            return {
                ...state,
                isAuthenticated: true,
                user,
            }
        }
        case 'LOGOUT': {
            return {
                ...state,
                isAuthenticated: false,
                user: null,
            }
        }
        case 'REGISTER': {
            const {user} = action.payload

            return {
                ...state,
                isAuthenticated: true,
                user,
            }
        }
        default: {
            return {...state}
        }
    }
}

const AuthContext = createContext({
    ...initialState,
    method: 'JWT',
    login: () => Promise.resolve(),
    logout: () => { },
    register: () => Promise.resolve(),
})

export const AuthProvider = ({children}: any) => {
    const [state, dispatch] = useReducer(reducer, initialState)

    const login = async (shop: string, email: string, password: string) => {
        const user: UserProps = await loginModel(shop, email, password)
        setSession(user.token)
        dispatch({
            type: 'LOGIN',
            payload: {
                user: user.perfil
            },
        })
    }

    const register = async (email: string, username: string, password: string) => {
        /*
        const response = await axios.post('/api/auth/register', {
            email,
            username,
            password,
        })

        const {accessToken, user} = response.data

        setSession(accessToken)

        dispatch({
            type: 'REGISTER',
            payload: {
                user,
            },
        })
        */
    }

    const logout = () => {
        setSession(null)
        dispatch({type: 'LOGOUT'})
    }

    useEffect(() => {
        ;(async () => {
            try {
                const accessToken = window.localStorage.getItem(AccessToken)
                if (accessToken && isValidToken(accessToken)) {
                    setSession(accessToken)
                    const user = await perfilModel()
                    dispatch({
                        type: 'INIT',
                        payload: {
                            isAuthenticated: true,
                            user,
                        },
                    })
                } else {
                    dispatch({
                        type: 'INIT',
                        payload: {
                            isAuthenticated: false,
                            user: {},
                        },
                    })
                }
            } catch (err) {
                console.error(err)
                dispatch({
                    type: 'INIT',
                    payload: {
                        isAuthenticated: false,
                        user: {},
                    },
                })
            }
        })()
    }, [])

    if (!state.isInitialised) {
        return <MatxLoading/>
    }

    return (
        <AuthContext.Provider
            value={{
                ...state,
                method: 'JWT',
                login,
                logout,
                register,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext
