import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, onAuthStateChanged, signOut, sendEmailVerification, UserCredential } from "firebase/auth";
//import { initializeApp as appRegistrar } from 'firebase-admin/app';

import firebaseConfig from './config';

import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

import { getFirestore, collection, getDocs, orderBy, query, where, deleteDoc, doc, getDoc, updateDoc, DocumentData } from 'firebase/firestore';

import { v4 } from 'uuid';

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

class Firebase {
    auth: any;
    storage: any;
    db: any;

    constructor() {
        if (initializeApp) {
            const app = initializeApp(firebaseConfig);

            this.auth = getAuth(app);
            this.storage = getStorage(app);
            this.db = getFirestore(app);
        }
    }

    //registrar usuario
    async registrar(nombre: string, email: string, password: string): Promise<void> {
        await createUserWithEmailAndPassword(this.auth, email, password);

        sendEmailVerification(this.auth.currentUser)
            .then(() => {
                // Email verification sent!
                // ...
                console.log('email enviado');
            });

        await updateProfile(this.auth.currentUser, {
            displayName: nombre
        })
    }

    //iniciar sesion
    async login(email: string, password: string): Promise<UserCredential> {
        return await signInWithEmailAndPassword(this.auth, email, password)
    }

    //cerrar sesion del usuario
    async cerrarSesion(): Promise<void> {
        await signOut(this.auth);
    }

    //para subir imagen a storage
    async subirImg(img: File): Promise<object> {
        const id = v4();

        //const storage = getStorage(app);

        //images es el nombre de la carpeta, si no lo lleva no se guarda en ninguna carpeta
        const storageRef = ref(this.storage, `images/${id}`)

        await uploadBytes(storageRef, img);

        //este es como viene en la documentacion
        /*await uploadBytes(storageRef, img).then(snapshot => {
            console.log(snapshot)
        })*/

        //extraer url de la imagen ya almacenada en la base de datos
        const urlImg = await getDownloadURL(storageRef).then((url) => url);

        //retorna el objeto con la url de la imagen y el nombre de la imagen
        return {
            nombreImg: id,
            urlImg
        };
    }

    //para subir imagen a storage
    async borrarImg(id: string): Promise<void> {
        //const storage = getStorage(app);

        //images es el nombre de la carpeta, si no lo lleva no se guarda en ninguna carpeta
        const storageRef = ref(this.storage, `images/${id}`)

        await deleteObject(storageRef);
    }

    //obtener productos
    async getProductos(): Promise<ProductoCreate[]> {
        //sin ordenar
        //const res = await getDocs(collection(db, "productos"));

        //para traer los datos ordenados
        //'creado' es la propiedad de referencia para ordenar
        //'desc', ordenar de forma inversa, para que el mas reciente creado, se muestre primero hasta arriba
        const q = query(collection(this.db, "productos"), orderBy('creado', 'desc'));

        const res = await getDocs(q);

        //este es el que viene en la documentacion
        /*querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            console.log(doc.id, " => ", doc.data());
        });*/

        let productos: ProductoCreate[] = [];

        res.forEach((doc) => productos = [...productos, { id: doc.id, producto: doc.data() }]);

        return productos;
    }

    //obtener solo un producto
    async getProducto(id: string): Promise<object>  {
        //sin ordenar
        //const res = await getDocs(collection(db, "productos"));

        //para traer los datos ordenados
        //'creado' es la propiedad de referencia para ordenar
        //'desc', ordenar de forma inversa, para que el mas reciente creado, se muestre primero hasta arriba
        const q = query(collection(this.db, "productos"));

        const res = await getDocs(q);

        //este es el que viene en la documentacion
        /*querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            console.log(doc.id, " => ", doc.data());
        });*/

        let producto: ProductoCreate = {id: '', producto: {}};

        //extraer el producto nada mas
        res.forEach(doc => {
            if (doc.id === id) {
                producto = { id: doc.id, producto: doc.data() }
            }
        });

        //esta es la forma correcta, pero es mas lenta y no me gusta...
        /*try {
            //codigo para extraer por id directamente
            const product = await getDoc( doc(db, "productos", id) );
    
            if(product.exists()) {
                let res = product.data();
    
                producto = res;
            }else{
                console.log('El producto no existe')
            }
        } catch (error) {
            
        }*/

        return producto;
    }

    //obtener populares
    async getPopulares(): Promise<object[]> {
        //sin ordenar
        //const res = await getDocs(collection(db, "productos"));

        //para traer los datos ordenados
        //'creado' es la propiedad de referencia para ordenar
        //'desc', ordenar de forma inversa, para que el mas reciente creado, se muestre primero hasta arriba
        const q = query(collection(this.db, "productos"), orderBy('votos', 'desc'));

        const res = await getDocs(q);

        //este es el que viene en la documentacion
        /*querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            console.log(doc.id, " => ", doc.data());
        });*/

        let productos: ProductoCreate[] = [];

        res.forEach(doc => productos = [...productos, { id: doc.id, producto: doc.data() }]);

        //filtrar solo los que tienen mas de 0 votos
        const conVotos = productos.filter((producto) => producto.producto.votos !== 0);

        return conVotos;
    }

    //actualizar producto
    async actualizarProducto(id: string, comentarios: comentarios[]): Promise<void> {
        const referencia = doc(this.db, "productos", id);

        //const data = {description: description, stock: stock}

        //ponemos nombre de la propiedad que queremos editar
        await updateDoc(referencia, { comentarios })
    };

    //eliminar producto
    async borrarProducto(id: string) {
        try {
            await deleteDoc(doc(this.db, "productos", id));
            //setData(data.filter((item) => item.id !== id));
        } catch (err) {
            console.log(err);
        }
    };

    //votos
    async votos(id: string, obj: object) {
        const referencia = doc(this.db, "productos", id);

        //ponemos nombre de la propiedad que queremos editar
        await updateDoc(referencia, obj)
    }
};

const firebase = new Firebase();

export default firebase;