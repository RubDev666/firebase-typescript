type obj = {
    nombre?: string;
    email?: string;
    password?: string;
    empresa?: string,
    imagen?: File,
    url?: string,
    descripcion?: string;
}

const errorEmpty = {
    descripcion: '',
    empresa: '',
    nombre: '',
    url: '',
    email: '',
    password: ''
}

export default function validarIniciarSesion(valores: obj) {
    let errores = {}

    // validar el email
    if(!valores.email) {
        errores = {...errores, email: 'Email es obligatorio'}
    } else if( !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(valores.email) ) {
        errores = {...errores, email: 'Email incorrecto'}
    }

    // validar el password
    if(!valores.password) {
        errores = {...errores, password: 'Password es obligatorio'}
    } else if( valores.password.length < 6 ) {
        errores = {...errores, password: 'Minimo deben ser 6 caracteres'}
    }

    return errores;
}