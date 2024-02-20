import '@/styles/app.css'; //estilos globales

import type { AppProps } from "next/app";
import firebase, {FirebaseContext} from '@/firebase';
import useAutenticacion from '@/hooks/useAutenticacion';

export default function App({ Component, pageProps }: AppProps) {
    const usuario = useAutenticacion();

    return (
        <FirebaseContext.Provider value={{firebase, usuario}}>
            <Component {...pageProps} />
        </FirebaseContext.Provider>
    )
}
