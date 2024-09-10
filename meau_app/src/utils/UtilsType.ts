import { DrawerNavigationProp } from "@react-navigation/drawer";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

export type StackRoutesParametros = {
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
    CardAnimal: undefined;
    DetalhesAnimal: { animal_id: string };
    DetalhesAnimalAdocao: { animal_id: string; nome_animal: string; };
    ChatScreen: {
        idChat: string;
        nomeTopBar: string;
    };
    AvisoNotification: { topbar: boolean };
    Interessados: { id_dono: string; id_interessado: string; animal_id: string; nome_animal: string; };
};

export type DrawerRoutesParametros = {
    Inicial: undefined;
    MeuPerfil: undefined;
    MeusPets: undefined;
    Adotar: undefined;
    Favoritos: undefined;
    Conversas: undefined;
    Config: undefined;
};

export type NativeStackNavigationProps = NativeStackNavigationProp<StackRoutesParametros>;
export type DrawerNavigationProps = DrawerNavigationProp<DrawerRoutesParametros>;

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