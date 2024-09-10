import { Modal } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import ModalLoanding from '../../components/ModalLoanding';
import { carregarFontes, getOrCreateInstallationId } from '../../utils/UtilsGeral';
import { NotificationAppEncerrado, StatusToken } from '../../utils/UtilsType';
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { getAuth, db, doc, getDoc, onAuthStateChanged } from '../../configs/FirebaseConfig';
import { processarNotificationsAppEncerrado, validarExpoToken } from '../../utils/UtilsNotification';

interface AutenticacaoUserContextType {                                                                 // Define o tipo do contexdo de autenticacao
    user: any,
    setUser: React.Dispatch<React.SetStateAction<any>>
    dadosUser: any;
    buscarDadosUsuario: (userId: string) => Promise<any | null>;
    statusExpoToken: StatusToken;
    setStatusExpoToken: React.Dispatch<React.SetStateAction<StatusToken>>;
    notificationAppEncerrado: NotificationAppEncerrado;
}

const AutenticacaoUserContext = createContext<AutenticacaoUserContextType | undefined>(undefined);      // Cria o contexto com o valor padrão vazio

export const AutenticacaoUserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {          // Cria o provedor do contexto
    const [user, setUser] = useState(null);
    const [dadosUser, setDadosUser] = useState<any>(null);

    const [statusExpoToken, setStatusExpoToken] =
        useState<StatusToken>({
            statusExpoTokenLocal: false,
            statusExpoTokenRemoto: false,
            statusInstalation: false,
            permissaoNotifcations: 'undetermined',
            userNegou: false,
        });

    const [notificationAppEncerrado, setNotificationAppEncerrado] = useState<NotificationAppEncerrado>(null);

    const [tentativaCarga, setTentativaCarga] = useState(false);
    const [libera, setLibera] = useState(false);

    SplashScreen.preventAutoHideAsync()                                                                 // Trava a tela de SplashScreen para os carregamentos iniciais
        .then((result) => console.log(`SplashScreen.preventAutoHideAsync() succeeded: ${result}`))      //
        .catch(console.warn);                                                                           //

    async function buscarDadosUsuario(userId: string, installationId?: string) {
        try {
            const userDocRef = doc(db, 'Users', userId);
            const userDoc = await getDoc(userDocRef);

            if (userDoc.exists()) {

                if (installationId) {
                    await validarExpoToken(userId, installationId).then(async (retorno) => {            // Verifica se o token local do dispositivo é congruente com o token salvo no BD
                        setStatusExpoToken(retorno.status_expo_token);                                  //
                    });                                                                                 //

                }

                setDadosUser(userDoc.data());                                           // Retorno para acesso imediato aos dados do user, pois há um deley até os dados
                return userDoc.data();                                                  //   carregarem no contexto em tempo de execução de uma função JS
                

            } else {
                console.log('Dados do usuario não encontrados');
            }
        } catch (error) {
            console.error('Erro ao buscar dados do user: ', error);
        }
        return null;
        
    };

    useEffect(() => {

        let unsubscribe;

        async function carregamentoInicial() {

            setTentativaCarga(false);                                                       // Primeira tentativa de carga

            await carregarFontes();

            const installationId = await getOrCreateInstallationId();                       // Se o APP não tiver um id de instalação, ele o cria

            unsubscribe = onAuthStateChanged(getAuth(), async (user) => {
                setTentativaCarga(false);                                                   // Reseta a tentativa de carga toda vez que o estado do user muda

                console.log("estadoUser: " + user);
                if (user) {
                    setUser(user);                                                          // Atualiza o estado com o usuário autenticado
                    await buscarDadosUsuario(user.uid, installationId)
                    console.log("Usuario logado: " + user.email);

                    await processarNotificationsAppEncerrado(setNotificationAppEncerrado);  // Muda o fluxo da tela inicial caso o app inicie por um clique na notificação

                    setTentativaCarga(true);

                } else {
                    setUser(null);                                                          // Atualiza o estado para null se não houver usuário
                    setDadosUser(null);
                    console.log("Usuario off ");
                    setTentativaCarga(true);
                }
            });
        };

        carregamentoInicial();

        return () => unsubscribe();                                                     // Limpeza do listener ao desmontar o componente

    }, []);

    const liberarSplashScreen = async () => {
        if (tentativaCarga) {

            await SplashScreen.hideAsync();                                             // Libera a SplashScreen e continua as operações
            setLibera(true);
        }
    };
    liberarSplashScreen();


    return (
        <AutenticacaoUserContext.Provider value={{ user, setUser, dadosUser, buscarDadosUsuario, statusExpoToken, setStatusExpoToken, notificationAppEncerrado }}>

            {tentativaCarga ?                                                                               // Se a tentativa de carregar os dados terminou, renderize o APP
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