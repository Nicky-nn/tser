export interface ProveedorProps {
    codigo: string,
    nombre: string,
    direccion: string,
    ciudad: string,
    contacto: string,
    correo: string,
    telefono: string,
    state: string,
    createdAt: string,
    updatedAt?: string,
    usucre: string,
    usumod?: string
}

export interface ProveedorInputProp {
    codigo: string,
    nombre: string,
    direccion: string,
    ciudad: string,
    contacto: string,
    correo: string,
    telefono: string,
}