/**
 * @description console.log condicional al estado .env
 * @param args
 */
import { ColumnFiltersState } from '@tanstack/react-table';
import { customAlphabet } from 'nanoid';

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
  const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
  if (newWindow) newWindow.opener = null;
};

export const handleSelect = (event: any) => {
  event.target.select();
};

/**
 * Devuelve el producto cartesiano de un array de items
 * @param arr
 */
export const cartesianProduct = (arr: [[]]) => {
  return arr.reduce(
    function (a, b) {
      return a
        .map(function (x) {
          return b.map(function (y) {
            return x.concat([y]);
          });
        })
        .reduce(function (a, b) {
          return a.concat(b);
        }, []);
    },
    [[]],
  );
};

/**
 * @description true = vacio, false = no vacio
 * @param value
 */
export const isEmptyValue = (value: any): boolean => {
  const matches = [null, false, undefined, ''];
  if (typeof value === 'object') {
    if (matches.includes(value)) return true;
    if (Object.keys(value).length === 0) return true;
  }
  if (Array.isArray(value)) {
    if (value.length === 0) return true;
  }
  if (typeof value === 'string') {
    if (matches.includes(value)) return true;
    if (value.trim() === '') return true;
  }
  if (value === null || value === false || value === undefined) return true;
  return matches.includes(value);
};

/**
 * GENERAMOS CADENA ALEATORIA STRING SOLO ALFABETICO
 * @param lng
 */
export const genRandomString = (lng = 5): string => {
  const nanoidd = customAlphabet('abcdefghijkmnpqrtwxyz', lng);
  return nanoidd();
};

/**
 * Verificamos el tipo de dato, parceamos y enviamos el dato correcto
 * @param val
 * @param replace
 */
export const genReplaceEmpty = (val: any, replace: any): any => {
  if (val === undefined) return replace;
  if (val === null) return replace;
  if (typeof val === 'object') {
    if (Object.keys(val).length === 0) return replace;
  }
  if (Array.isArray(val)) {
    if (val.length === 0) return replace;
  }

  // Verificando si es string
  if (typeof val === 'string' || val instanceof String) {
    if (val.trim() === '') return replace;
  }
  return val;
};

export const handleFocus = (event: any) => event.target.select();

function isNumeric(str: any) {
  if (typeof str != 'string') return false; // we only process strings!
  return (
    !isNaN(Number(str)) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
    !isNaN(parseFloat(str))
  ); // ...and ensure strings of whitespace fail
}

/**
 * Parseamos un array en formato query para envio de parametro query, a la api
 * @param data
 */
export const genApiQuery = (data: ColumnFiltersState): string => {
  if (data.length === 0) return '';
  const query: Array<string> = [];
  data.forEach((item) => {
    if (isNumeric(item.value)) {
      query.push(`${item.id}=${item.value}`);
    } else {
      query.push(`${item.id}=/${item.value}/i`);
    }
  });
  return query.join('&');
};
