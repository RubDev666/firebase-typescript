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

export default function validarCrearProducto(valores: obj) {
    let errores = {};

    // Validar el nombre del usuario
    if (valores.nombre === '') {
        errores = {...errores, nombre: "El Nombre es obligatorio"}
    }

    // validar empresa
    if (valores.empresa === '') {
        errores = {...errores, empresa: "El Nombre de empresa es obligatorio"}
    }

    // validar la url
    if (!valores.url) {
        errores = {...errores, url: "El url es obligatorio"}
    } else if (!/^(ftp|http|https):\/\/[^ "]+$/.test(valores.url)) {
        errores = {...errores, url: "El url no es valido"}
    }

    // validar descripción.
    if (!valores.descripcion) {
        errores = {...errores, descripcion: "La descripcion es obligatorio"}
    }

    return errores;
}
