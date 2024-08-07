import React, { createContext, useContext, useState, ReactNode } from 'react';

//Define o tipo do contexdo de autenticacao

interface AutenticacaoUserContextType{
    user: any,
    setUser: React.Dispatch<React.SetStateAction<any>>
}

//Cria o contexto com o valor padrão vazio

const AutenticacaoUserContext = createContext<AutenticacaoUserContextType | undefined>(undefined);

//Cria o provedor do contexto

export const AutenticacaoUserProvider : React.FC<{children: ReactNode}> = ({ children }) => {
    const [user, setUser] = useState(null); // Substitua `any` pelo tipo específico do usuário se disponível

    return (
        <AutenticacaoUserContext.Provider value={{ user, setUser }}>
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