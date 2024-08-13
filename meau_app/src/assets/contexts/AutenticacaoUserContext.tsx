import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { getAuth, db, doc, getDoc, onAuthStateChanged } from '../../configs/firebaseConfig';


//Define o tipo do contexdo de autenticacao

interface AutenticacaoUserContextType{
    user: any,
    setUser: React.Dispatch<React.SetStateAction<any>>
    dadosUser: any;
    buscarDadosUsuario: (userId:string) => Promise<void>;
}

//Cria o contexto com o valor padrão vazio

const AutenticacaoUserContext = createContext<AutenticacaoUserContextType | undefined>(undefined);

//Cria o provedor do contexto

export const AutenticacaoUserProvider : React.FC<{children: ReactNode}> = ({ children }) => {
    const [user, setUser] = useState(null); // Substitua `any` pelo tipo específico do usuário se disponível
    const [dadosUser,setDadosUser] = useState<any>(null);
    

    const buscarDadosUsuario = async (userId : string) => {
        try {
                
            const userDocRef = doc(db, 'Users', userId);
            const userDoc = await getDoc(userDocRef);

            if (userDoc.exists()) {
                setDadosUser(userDoc.data());

            } else {
                console.log('Dados do usuario não encontrados');

            }
        } catch (error) {
            console.error('Erro ao buscar dados do user: ', error);

        } finally {

        }
    };

    useEffect(() => {
        
        const unsubscribe = onAuthStateChanged(getAuth(), async (user) => {
            console.log("Teste USUARIO 2"+ "estadoUser: " + user);
            if (user) {
                setUser(user); // Atualiza o estado com o usuário autenticado
                await buscarDadosUsuario(user.uid);
                console.log("Usuario logado: " + user.email);
            } else {
                setUser(null);  // Atualiza o estado para null se não houver usuário
                setDadosUser(null);
                console.log("Usuario off ");
            }
        });
        return () => unsubscribe(); // Limpeza do listener ao desmontar o componente
    }, []);
    
    return (
        <AutenticacaoUserContext.Provider value={{ user, setUser, dadosUser, buscarDadosUsuario }}>
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