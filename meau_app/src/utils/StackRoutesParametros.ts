
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
        idChat: string;
        nomeTopBar: string;
    };
    Conversas: undefined;
    Config: undefined;
    AvisoNotification: { topbar: boolean };
    Interessados: { animal_id: string; nome_animal: string; };
};