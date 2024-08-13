
export type StackRoutesParametros = {
    Inicial: { userEstado: number };
    AvisoCadastro: { topbar: boolean };
    Login: undefined;
    CadastroPessoal: undefined;
    CadastroAnimal: undefined;
    PreencherCadastroAnimal: undefined;
    Loading: undefined;
    TesteLogado: undefined;
    ProtectTelas: undefined;
    DrawerRoutes: undefined;
    DrawerRouteAuth: undefined;
    BoxLogin: undefined;
    MeusPets: undefined;
    Adotar: undefined;
    CardAnimal: undefined;
    DetalhesAnimal: { animal_id: string };
    DetalhesAnimalAdocao: { animal_id: string; nome_animal: string; };
    ChatScreen : {
        dadosAnimal: {
            idAnimal: string;
            idDono: string;
            nomeAnimal?: string;
            nomeDono?: string;
            iconeDonoAnimal?: any;
        },
        dadosInteressado: {
            idInteressado: string;
            nomeInteressado?: string;
            iconeInteressado?: any;
        },
        nomeTopBar: string;
    };
    Conversas: undefined;
};