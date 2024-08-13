import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { User, getAuth, onAuthStateChanged} from '../../src/configs/firebaseConfig.js';
import { buscarDadosUsuario } from '../../src/utils/Utils';

// Trava a tela de SplashScreen para os carregamentos iniciais
SplashScreen.preventAutoHideAsync()
    .then((result) => console.log(`SplashScreen.preventAutoHideAsync() succeeded: ${result}`))
    .catch(console.warn);

// Define o tipo do contexdo de autenticacao
interface AutenticacaoUserContextType{
    user: User,
    dadosUser: any,
    setUser: React.Dispatch<React.SetStateAction<User>>,
    setDadosUser: React.Dispatch<React.SetStateAction<any>>,
}

// Cria o contexto com o valor padrão vazio
const AutenticacaoUserContext = createContext<AutenticacaoUserContextType | undefined>(undefined);

// Cria o provedor do contexto
export const AutenticacaoUserProvider : React.FC<{children: ReactNode}> = ({ children }) => {
    
    const [user, setUser] = useState<User>(null);
    const [dadosUser, setDadosUser] = useState<any>(null); 

    useEffect(() => {
        
        const unsubscribe = onAuthStateChanged(getAuth(), (user) => {
            console.log("Teste USUARIO 2" + " estadoUser: " + user);

            if (user) {

                buscarDadosUsuario('Users', user.uid)                // Busca o nome do usuario
                    .then((dados: any) => {
                        setDadosUser(dados);
                        setUser(user);                                          // Atualiza o estado com o usuário autenticado

                        SplashScreen.hideAsync();                               // Libera a SplashScreen

                        console.log("Usuario logado: " + user.email, dados.nome);
                        
                    })
                    .catch((erro) => {
                        console.error('Erro:', erro);                           // Captura e lida com qualquer erro
                        SplashScreen.hideAsync();                               // Libera a SplashScreen
                });
                
            } else {
                setUser(null);                                                  // Atualiza o estado para null se não houver usuário
                console.log("Usuario off ");
                SplashScreen.hideAsync();                                       // Libera a SplashScreen
            }
        });

        return () => unsubscribe();                                             // Limpeza do listener ao desmontar o componente

    }, []);

    return (
        <AutenticacaoUserContext.Provider value={{ user, setUser, dadosUser, setDadosUser }}>
            {children}
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