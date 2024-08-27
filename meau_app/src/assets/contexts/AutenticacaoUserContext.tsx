import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { getAuth, db, doc, getDoc, onAuthStateChanged, updateDoc } from '../../configs/firebaseConfig';
import * as SplashScreen from 'expo-splash-screen';
import { Modal, View } from 'react-native';
import ModalLoanding from '../../components/ModalLoanding';
import { getOrCreateInstallationId, getTokenArmazenado, validarExpoToken } from '../../utils/Utils';


interface StatusToken {
    statusExpoTokenLocal: boolean;
    statusExpoTokenRemoto: boolean;
    statusInstalation: boolean;
}

//Define o tipo do contexdo de autenticacao
interface AutenticacaoUserContextType {
    user: any,
    setUser: React.Dispatch<React.SetStateAction<any>>
    dadosUser: any;
    buscarDadosUsuario: (userId: string) => Promise<void>;
    statusExpoToken: StatusToken;
    setStatusExpoToken: React.Dispatch<React.SetStateAction<StatusToken>>;
}

//Cria o contexto com o valor padrão vazio

const AutenticacaoUserContext = createContext<AutenticacaoUserContextType | undefined>(undefined);

//Cria o provedor do contexto

export const AutenticacaoUserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState(null);
    const [dadosUser, setDadosUser] = useState<any>(null);
    const [statusExpoToken, setStatusExpoToken] = useState<StatusToken>({statusExpoTokenLocal: false, statusExpoTokenRemoto: false, statusInstalation: false});

    const [tentativaCarga, setTentativaCarga] = useState(false);
    const [libera, setLibera] = useState(false);

    // Trava a tela de SplashScreen para os carregamentos iniciais
    SplashScreen.preventAutoHideAsync()
        .then((result) => console.log(`SplashScreen.preventAutoHideAsync() succeeded: ${result}`))
        .catch(console.warn);

    const buscarDadosUsuario = async (userId: string, installationId?: string) => {
        try {
            const userDocRef = doc(db, 'Users', userId);
            const userDoc = await getDoc(userDocRef);

            if (userDoc.exists()) {

                let userDocUpdate = userDoc.data();
                
                if (installationId) {
                    // Verifica se o token local do dispositivo é congruente com o token salvo no BD
                    await validarExpoToken(userDocUpdate.expoTokens, installationId).then( async (retorno) => {
                        setStatusExpoToken(retorno.status_expo_token);
                        userDocUpdate.expoTokens = retorno.expoTokens;
                        await updateDoc(userDocRef, { expoTokens: retorno.expoTokens });
                    });
                    
                }

                setDadosUser(userDocUpdate);

            } else {
                console.log('Dados do usuario não encontrados');
            }
        } catch (error) {
            console.error('Erro ao buscar dados do user: ', error);
        }
    };

    // Modifiquei em parte, para a SplashScreen esperar carregar os dados antes de renderizar a tela inicial
    useEffect(() => {

        const unsubscribe = onAuthStateChanged(getAuth(), async (user) => {
            setTentativaCarga(false);

            // Se o APP não tiver um id de instalação, ele o cria
            const installationId = await getOrCreateInstallationId();

            console.log("Teste USUARIO 2" + " estadoUser: " + user);

            if (user) {
                setUser(user);                                                  // Atualiza o estado com o usuário autenticado
                await buscarDadosUsuario(user.uid, installationId)
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
        <AutenticacaoUserContext.Provider value={{ user, setUser, dadosUser, buscarDadosUsuario, statusExpoToken, setStatusExpoToken }}>
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