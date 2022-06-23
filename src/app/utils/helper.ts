/**
 * @description console.log condicional al estado .env
 * @param args
 */
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