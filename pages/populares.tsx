import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import Head from 'next/head';
import DetallesProducto from '@/components/layout/DetallesProducto';
import usePopulares from '@/hooks/usePopulares';
import firebase from '@/firebase';
import { DocumentData } from 'firebase/firestore';

type comentarios = {
    usuarioNombre: string;
    usuarioId: string;
    mensaje: string;
}

interface Producto {
    id: string;
    producto: {
        comentarios: comentarios[];
        creado: number;
        creador: {id: string, nombre: string};
        descripcion: string;
        empresa: string;
        haVotado: string[];
        img: {nombreImg: string, urlImg: string};
        nombre: string;
        url: string;
        votos: number;
    };
}

const Populares = () => {
    const [productos, setProductos] = useState<DocumentData[]>([]);

    useEffect(() => {
        obtenerDatos();
    }, [])

    const obtenerDatos = async () => {
        let datos: DocumentData[] = [];
 
        //no se puede poner diretamente esta variable en un state... sea variable, objeto o lo que sea...
        //const res = await usePopulares();

        const res = await firebase.getPopulares();

        //iteramos y creamos una variable nueva...
        res.forEach((producto: DocumentData) => datos.push(producto));

        //y todo para poder meterlo aqui...
        setProductos(datos);
    }

    return (
        <>
            <Head>
                <title>Product Hunt | Populares</title>
                <meta name="description" content="Pagina populares" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <Layout>
                <div className="listado-productos">
                    <div className="contenedor">
                        <ul className="bg-white">
                            {productos.map(producto => (
                                <DetallesProducto
                                    key={producto.id}
                                    id={producto.id}
                                    producto={producto.producto}
                                />
                            ))}
                        </ul>
                    </div>
                </div>
            </Layout>
        </>
    )
}

export default Populares;
