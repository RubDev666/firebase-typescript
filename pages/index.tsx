import React, { useEffect, useState } from 'react';
import Head from "next/head";
import Layout from '@/components/layout/Layout';
import DetallesProducto from '@/components/layout/DetallesProducto';
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

type ProductoCreate = {
    id: string;
    producto: DocumentData;
}

export default function Home() {
    const [productos, setProductos] = useState<ProductoCreate[]>([]);

    useEffect(() => {
        obtenerDatos();
    }, [])

    const obtenerDatos = async () => {
        try {
            let datos: ProductoCreate[] = [];

            //no se puede poner diretamente esta variable en un state... sea variable, objeto o lo que sea...
            //const res = await useProductos();
    
            const res = await firebase.getProductos();
    
            //iteramos y creamos una variable nueva...
            res.forEach((producto) => datos.push(producto)); 
    
            //y todo para poder meterlo aqui...
            setProductos(datos);
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <>
            <Head>
                <title>Product Hunt | Inicio</title>
                <meta name="description" content="Pagina principal" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <Layout> 
                <div className="listado-productos">
                    <div className="contenedor">
                        <ul className="bg-white">
                            {productos.map((producto: DocumentData) => (
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
