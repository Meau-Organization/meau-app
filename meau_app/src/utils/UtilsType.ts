
export type StackRoutesParametros = {
    Inicial: { userEstado: number };
    AvisoCadastro: { topbar: boolean };
    Login: undefined;
    CadastroPessoal: undefined;
    SucessoCadastroAnimal: undefined;
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
    ChatScreen: {
        idChat: string;
        nomeTopBar: string;
    };
    Conversas: undefined;
    Config: undefined;
    AvisoNotification: { topbar: boolean };
    Interessados: { id_dono: string; id_interessado: string; animal_id: string; nome_animal: string; };
};

export type Trigger = {
    channelId: string;
    remoteMessage: string;
    type: string;
}

export interface StatusToken {
    statusExpoTokenLocal: boolean;
    statusExpoTokenRemoto: boolean;
    statusInstalation: boolean;
    permissaoNotifcations: string;
    userNegou: boolean;
}

export type NotificationAppEncerrado = {
    tela: any;
    idChat: string;
    nomeTopBar: string;
    idDono: string;
    idInteressado: string;
    idAnimal: string;
    nomeAnimal: string;
};

export type MensagemData = {
    idChat: string;
};

export type InteressadoData = {
    nomeAnimal: string;
    idDono: string;
    idIteressado: string;
    idAnimal: string;
};

export type MeauData = {
    to: string[];
    title: string;
    body: string;
    channelId: string;
    data: object;
}