
import { FontAwesome6 } from '@expo/vector-icons';
import { Alert } from 'react-native';
type SetStateFunction<String> = React.Dispatch<React.SetStateAction<string>>;


export function onChangeGenerico<String> (
    setFuncao: SetStateFunction<String>,
    novoTexto: string,
    checkid: number,
    vetorBoolCheckIcone: Array<Boolean>,
    vetorBoolError: Array<Boolean>,
    AlternarCheckIcone: (index: number) => void,
    AlternarError: (index: number) => void,

){
    
    setFuncao(novoTexto);

    if (novoTexto.trim() !== '') {
        

        if (checkid == 2) {
            //console.log(validarEmail(novoTexto));

            if (validarEmail(novoTexto)) {
                if ( !vetorBoolCheckIcone[checkid] )
                    AlternarCheckIcone(checkid);

                if ( vetorBoolError[checkid] )
                    AlternarError(checkid);
            } else {
                if ( vetorBoolCheckIcone[checkid] )
                    AlternarCheckIcone(checkid);

                if ( !vetorBoolError[checkid] )
                    AlternarError(checkid);
            }

        } else {
            if ( !vetorBoolCheckIcone[checkid] )
                AlternarCheckIcone(checkid);
        }
        
        
    } else {
        if ( vetorBoolCheckIcone[checkid] )
            AlternarCheckIcone(checkid);

        if ( vetorBoolError[checkid] )
            AlternarError(checkid);
        
    }


};


export const onChangeSenhaConfirm = (
    senha : string,
    idSenhaConfirm : number,
    novoTexto : string,
    setSenhaConfirm: React.Dispatch<React.SetStateAction<string>>,
    vetorBoolCheckIcone: Array<Boolean>,
    vetorBoolError: Array<Boolean>,
    AlternarCheckIcone: (index: number) => void,
    AlternarError: (index: number) => void,

) => {

    setSenhaConfirm(novoTexto);

    if (novoTexto.trim() !== '') {
        if (senha == novoTexto) {
            
            //console.log("senhas iguais");
            if ( !vetorBoolCheckIcone[idSenhaConfirm] )
                AlternarCheckIcone(idSenhaConfirm);

            if ( vetorBoolError[idSenhaConfirm] )
                AlternarError(idSenhaConfirm);

        } else {
            if (senha.length > 0) {
                //console.log("senhas diferentes");
                if ( vetorBoolCheckIcone[idSenhaConfirm] )
                    AlternarCheckIcone(idSenhaConfirm);
                if ( !vetorBoolError[idSenhaConfirm] )
                    AlternarError(idSenhaConfirm);
            }
        }

    } else {
        if ( vetorBoolCheckIcone[idSenhaConfirm] )
            AlternarCheckIcone(idSenhaConfirm);
        if ( vetorBoolError[idSenhaConfirm] )
                AlternarError(idSenhaConfirm);
    }
};


export const onChangeSenha = (
    senha : string,
    senhaConfirm : string,
    idSenhaConfirm : number,
    idSenha: number,
    novoTexto : string,
    setSenha: React.Dispatch<React.SetStateAction<string>>,
    vetorBoolCheckIcone: Array<Boolean>,
    vetorBoolError: Array<Boolean>,
    AlternarCheckIcone: (index: number) => void,
    AlternarError: (index: number) => void,

) => {

    setSenha(novoTexto);

    if (novoTexto.trim() !== '') {
        
        // ------------------------------------------------------------------------
        if (senhaConfirm.length > 0) {
            if (senhaConfirm == novoTexto) {
                //console.log("senhas iguais 2");
                if ( !vetorBoolCheckIcone[idSenhaConfirm] )
                    AlternarCheckIcone(idSenhaConfirm);

                if ( vetorBoolError[idSenhaConfirm] )
                    AlternarError(idSenhaConfirm);

            } else {
                if (senha.length > 0) {
                    //console.log("senhas diferentes 2");
                    if ( vetorBoolCheckIcone[idSenhaConfirm] )
                        AlternarCheckIcone(idSenhaConfirm);
                    if ( !vetorBoolError[idSenhaConfirm] )
                        AlternarError(idSenhaConfirm);
                }
            }
        }
        // ------------------------------------------------------------------------

        if (novoTexto.length >= 8) {
            if ( !vetorBoolCheckIcone[idSenha] )
                AlternarCheckIcone(idSenha);
        } else {
            if ( vetorBoolCheckIcone[idSenha] )
                AlternarCheckIcone(idSenha);
        }

    } else {
        if ( vetorBoolCheckIcone[idSenha] )
            AlternarCheckIcone(idSenha);
    }
};


export const validarEmail = (email: string): boolean => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    return regex.test(email);
};

export const mostrarIconeCheckFunc = (iconeState : Boolean) => {
    if (iconeState) {
        return <FontAwesome6 name="check" size={24} color="#589b9b" />
    } else {
        return null;
    }
};

export const validarFinal = (
    senha : string,
    senhaConfirm : string,
    setValidar: React.Dispatch<React.SetStateAction<boolean>>,
    vetorBoolCheckIcone: Array<Boolean>

): Boolean => {
    
    let erroDados = false;
    vetorBoolCheckIcone.forEach((boolValue, index) => {
        if ( !boolValue ) {
            setValidar(true);
            erroDados = true;
        }
        //console.log(`Item ${index + 1}: ${boolValue ? 'ON' : 'OFF'}` + " " + erro);
    });

    if (senha != senhaConfirm)
        erroDados = true;

    return erroDados;
};

export const validarSenha = (senha: string, senhaConfirm: string): number => {

    if (senha == senhaConfirm && senha.length >= 8) {
        return 111;
    }
    else if (senha == senhaConfirm && senha.length < 8) {
        return 110;
    }
    else if (senha != senhaConfirm && senha.length >= 8) {
        return 101;
    }
    else if (senha != senhaConfirm && senha.length < 8) {
        return 100;
    }

}

export const alertaErros = (senha: string, senhaConfirm: string, email: string): void => {

    const cod = validarSenha(senha, senhaConfirm);
    let mensagem = "";
    let mensagem2 = "";

    if (cod == 111) {
        mensagem = "";
    }
    else if (cod == 110) {
        mensagem = "Senha inferior a 8 caracteres.\n";
    }
    else if (cod == 101) {
        mensagem = "Senha de confirmação diferente.\n";
    }
    else if (cod == 100) {
        mensagem = "Senha de confirmação diferente.\nSenha inferior a 8 caracteres.\n";
    }

    if (!validarEmail(email)) {
        mensagem2 = "Email inválido.\n";
    } else {
        mensagem2 = "";
    }

    let msg_final = mensagem + mensagem2;

    if (msg_final.length == 0) {
        msg_final = "Campos obrigatórios vazios.\n";
    } else {
        msg_final = "Campos obrigatórios.\n" + msg_final;
    }

    Alert.alert("Atenção", msg_final);

}