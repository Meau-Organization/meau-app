import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { getAuth, db, doc, getDoc, onAuthStateChanged } from '../../configs/firebaseConfig';
import * as SplashScreen from 'expo-splash-screen';
import { Modal, View } from 'react-native';
import ModalLoanding from '../../components/ModalLoanding';

//Define o tipo do contexdo de autenticacao
interface AutenticacaoUserContextType {
    user: any,
    setUser: React.Dispatch<React.SetStateAction<any>>
    dadosUser: any;
    buscarDadosUsuario: (userId: string) => Promise<void>;
}

//Cria o contexto com o valor padrão vazio

const AutenticacaoUserContext = createContext<AutenticacaoUserContextType | undefined>(undefined);

//Cria o provedor do contexto

export const AutenticacaoUserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState(null); // Substitua `any` pelo tipo específico do usuário se disponível
    const [dadosUser, setDadosUser] = useState<any>(null);

    const [tentativaCarga, setTentativaCarga] = useState(false);

    const [libera, setLibera] = useState(false);

    // Trava a tela de SplashScreen para os carregamentos iniciais
    SplashScreen.preventAutoHideAsync()
        .then((result) => console.log(`SplashScreen.preventAutoHideAsync() succeeded: ${result}`))
        .catch(console.warn);

    const buscarDadosUsuario = async (userId: string) => {
        try {
            const userDocRef = doc(db, 'Users', userId);
            const userDoc = await getDoc(userDocRef);

            if (userDoc.exists()) {
                setDadosUser(userDoc.data());
                console.log(' set dados user ------------->', userDoc.data().nome);

            } else {
                console.log('Dados do usuario não encontrados');
            }
        } catch (error) {
            console.error('Erro ao buscar dados do user: ', error);
        }
    };

    // Modifiquei em parte, para a SplashScreen esperar carregar os dados antes de renderizar a tela inicial
    useEffect(() => {

        let libera = false;

        const unsubscribe = onAuthStateChanged(getAuth(), async (user) => {
            setTentativaCarga(false);

            console.log("Teste USUARIO 2" + " estadoUser: " + user);

            if (user) {
                setUser(user);                                                  // Atualiza o estado com o usuário autenticado
                await buscarDadosUsuario(user.uid)
                console.log("Usuario logado: " + user.email);

                setTentativaCarga(true);

            } else {
                setUser(null);                                                  // Atualiza o estado para null se não houver usuário
                setDadosUser(null);
                console.log("Usuario off ");
                setTentativaCarga(true);
            }
        });

        return () => unsubscribe();                                             // Limpeza do listener ao desmontar o componente

    }, []);

    const liberarSplashScreen = async () => {
        if (tentativaCarga) {
            await SplashScreen.hideAsync();                                               // Libera a SplashScreen e continua as operações
            setLibera(true);
        }
    };
    liberarSplashScreen();


    // Foi necessario modificar para que o app não carregasse antes de terminar as buscas, inclusive no login onde ocorre a troca de contexto
    return (
        <AutenticacaoUserContext.Provider value={{ user, setUser, dadosUser, buscarDadosUsuario }}>
            {tentativaCarga ?                                                                           // Se a tentativa de carregar os dados terminou, renderize o APP
                children
            :                                                                                           // Se não mostre o loading...
                <Modal visible={!tentativaCarga && libera} animationType='fade' transparent={true}>
                    <ModalLoanding spinner={!tentativaCarga && libera} cor={'#cfe9e5'} />
                </Modal>
            }
        </AutenticacaoUserContext.Provider>
    )
};

export const useAutenticacaoUser = () => {
    const context = useContext(AutenticacaoUserContext);
    if (context == undefined) {
        throw new Error('useAutenticacaoUser must be used within an AutenticacaoUserProvider');
    }
    return context;
};