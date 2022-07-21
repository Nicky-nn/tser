/**
 * @description console.log condicional al estado .env
 * @param args
 */
import {customAlphabet} from "nanoid";

export const logg = (...args: any) => {
    if (import.meta.env.MODE !== 'production') {
        console.log(...args);
    }
};

/**
 * Abrimos url en una nueva pestaña
 * @param url
 */
export const openInNewTab = (url: string): void => {
    const newWindow = window.open(url, '_blank', 'noopener,noreferrer')
    if (newWindow) newWindow.opener = null
}

export const handleSelect = (event: any) => {
    event.target.select()
}

/**
 * Devuelve el producto cartesiano de un array de items
 * @param arr
 */
export const cartesianProduct = (arr: [[]]) => {
    return arr.reduce(function (a, b) {
        return a.map(function (x) {
            return b.map(function (y) {
                return x.concat([y]);
            })
        }).reduce(function (a, b) {
            return a.concat(b)
        }, [])
    }, [[]])
}

/**
 * @description true = vacio, false = no vacio
 * @param value
 */
export const isEmptyValue = (value: any): boolean => {
    const matches = [null, false, undefined, '', {}, [] ]
    if (typeof value === 'string') {
        if (value.trim() === '')
            return true
    }
    return matches.includes(value)
}

/**
 * GENERAMOS CADENA ALEATORIA STRING SOLO ALFABETICO
 * @param lng
 */
export const genRandomString = (lng = 5): string => {
    const nanoidd = customAlphabet('abcdefghijkmnpqrtwxyz', lng)
    return nanoidd()
}