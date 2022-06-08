/**
 * @description console.log condicional al estado .env
 * @param args
 */
export const logg = (...args: any) => {
    if (import.meta.env.MODE !== 'production') {
        console.log(...args);
    }
};