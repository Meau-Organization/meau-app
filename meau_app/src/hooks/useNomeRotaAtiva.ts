import { useNavigationState, NavigationState } from '@react-navigation/native';

const rotaAtiva = (estadoNavegacao: NavigationState): string => {
    if (!estadoNavegacao || !estadoNavegacao.routes) {
        return 'Desconhecido';
    }
    const rota = estadoNavegacao.routes[estadoNavegacao.index];
    if (rota.state) {
        return rotaAtiva(rota.state as NavigationState);
    }
    return rota.name;
};

export const useNomeRotaAtiva = (): string => {
    const estadoNavegacao = useNavigationState(state => state);
    return rotaAtiva(estadoNavegacao);
};
