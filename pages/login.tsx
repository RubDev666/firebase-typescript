import React, { useState } from 'react';
import Head from 'next/head';
import { css } from '@emotion/react';
import Router from 'next/router';
import Layout from '@/components/layout/Layout';
import { Formulario, Campo, InputSubmit, Error } from '@/components/ui/Formulario';

import firebase from '@/firebase';

// validaciones
import useValidacion from '@/hooks/useValidacion';
import validarIniciarSesion from '@/validacion/validarIniciarSesion';

const STATE_INICIAL = {
    email: '',
    password: ''
}

const Login = () => {
    const [error, guardarError] = useState(false);

    const { valores, errores, handleSubmit, handleChange, handleBlur } = useValidacion(STATE_INICIAL, validarIniciarSesion, iniciarSesion);

    const { email, password } = valores;

    async function iniciarSesion() {
        try {
            const res = await firebase.login(email!, password!); 

            Router.push('/');
        } catch (error: any) {
            console.error('Hubo un error al autenticar el usuario ', error.message);
            guardarError(error.message);
        }
    }

    return (
        <>
            <Head>
                <title>Product Hunt | Iniciar Sesion</title>
                <meta name="description" content="Pagina de inicio sesion" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <Layout>
                <h1
                    css={css`
                        text-align: center;
                        margin-top: 5rem;
                    `}
                >
                    Iniciar Sesión
                </h1>

                <Formulario
                    onSubmit={handleSubmit}
                    noValidate
                >
                    <Campo>
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            placeholder="Tu Email"
                            name="email"
                            value={email}
                            onChange={handleChange}
                            onBlur={handleBlur}
                        />
                    </Campo>
                    {errores.email && <Error>{errores.email}</Error>}

                    <Campo>
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            placeholder="Tu Password"
                            name="password"
                            value={password}
                            onChange={handleChange}
                            onBlur={handleBlur}
                        />
                    </Campo>
                    {errores.password && <Error>{errores.password}</Error>}

                    {error && <Error>{error} </Error>}

                    <InputSubmit
                        type="submit"
                        value="Iniciar Sesión"
                    />
                </Formulario>
            </Layout>
        </>
    )
}

export default Login