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
    const matches = [null, false, undefined, '', {}, []]
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

/**
 * Verificamos el tipo de dato, parceamos y enviamos el dato correcto
 * @param val
 * @param replace
 */
export const genReplaceEmpty = (val: any, replace: any): any => {
    if (val === undefined) return replace
    if (val === null) return replace
    if (typeof val === 'object') {
        if (Object.keys(val).length === 0)
            return replace
    }
    if (Array.isArray(val)) {
        if (val.length === 0)
            return replace
    }

    // Verificando si es string
    if (typeof val === 'string' || val instanceof String) {
        if (val.trim() === '') return replace
    }
    return val
}