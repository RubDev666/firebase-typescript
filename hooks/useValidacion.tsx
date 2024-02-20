import { useState, useEffect } from 'react';

type obj = {
    nombre?: string;
    email?: string;
    password?: string;
    empresa?: string,
    imagen?: File,
    url?: string,
    descripcion?: string;
}

type objError = {
    descripcion: string;
    empresa: string;
    nombre: string;
    url: string;
    email: string;
    password: string;
}

const errorEmpty = {
    descripcion: '',
    empresa: '',
    nombre: '',
    url: '',
    email: '',
    password: ''
}

const useValidacion = (stateInicial: obj, validar: Function, fn: Function) => {
    const [valores, guardarValores] = useState<obj>(stateInicial);
    const [errores, guardarErrores] = useState<objError>(errorEmpty);
    const [submitForm, guardarSubmitForm] = useState(false);

    useEffect(() => {
        if (submitForm) {
            const noErrores = Object.keys(errores).length === 0;

            if (noErrores) {
                fn(); // Fn = Función que se ejecuta en el componente
            }

            guardarSubmitForm(false);
        }
    }, [errores]);

    // Función que se ejecuta conforme el usuario escribe algo
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        if (e.target.name !== 'imagen') {
            guardarValores({
                ...valores,
                [e.target.name]: e.target.value
            })
        } else if (e.target.name === 'imagen' && e.target.files) {
            guardarValores({
                ...valores,
                [e.target.name]: e.target.files[0]
            })
        }

    }

    // Función que se ejecuta conforme el usuario escribe algo
    const handleChangeTextArea = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
        guardarValores({
            ...valores,
            [e.target.name]: e.target.value
        })
    }

    // Función que se ejecuta cuando el usuario hace submit
    const handleSubmit = (e: React.FormEvent): void => {
        e.preventDefault();

        const erroresValidacion = validar(valores);

        guardarErrores(erroresValidacion);

        guardarSubmitForm(true);
    }

    // cuando se realiza el evento de blur
    const handleBlur = () => {
        const erroresValidacion = validar(valores);

        guardarErrores(erroresValidacion);
    }

    return {
        valores,
        errores,
        handleSubmit,
        handleChange,
        handleBlur,
        handleChangeTextArea
    }
}

export default useValidacion;