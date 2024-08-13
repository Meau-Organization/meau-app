
import { SaveFormat, manipulateAsync } from 'expo-image-manipulator';
import * as FileSystem from 'expo-file-system';

import { collection, db, doc, getDoc, getDocs, limitToLast, orderBy, query, where } from '../configs/firebaseConfig.js'

export async function buscarCampoEspecifico(colecao: string, id_documento: string, campo: string) {
    const docRef = doc(db, colecao, id_documento);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        const campoEspecifico = await docSnap.get(campo);
        //console.log("Valor do campo:", campoEspecifico);
        return campoEspecifico;
    } else {
        console.log("Campo não encontrado");
    }
}

export async function buscarDadosUsuario(colecao: string, id_documento: string) {
    const docRef = doc(db, colecao, id_documento);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        return { uid: docSnap.id, ...docSnap.data() };
    } else {
        console.log('Dados do usuario não encontrados');
    }
}

export async function buscarUltimaMensagem(idChat: string, userId: string) {
    const msgsRef = collection(db, 'Chats', idChat, 'messages');

    const messagesQuery = query(msgsRef, orderBy('dataMsg'), limitToLast(1));

    const MessagesQueryNaoLidas = query(msgsRef, where('lido', '==', false));

    const SnapshotNaoLidas = await getDocs(MessagesQueryNaoLidas);

    const msgsNaoLidas = SnapshotNaoLidas.docs.filter(doc => doc.data().sender !== userId);
    
    //console.log('--------------------------------> buscarUltimaMensagem', msgsNaoLidas)

    const snapshot = await getDocs(messagesQuery);
    if (!snapshot.empty) {
        return { ultimaMensagem: { key: snapshot.docs[0].id, ...snapshot.docs[0].data() }, contador: msgsNaoLidas.length};

    } else {
        console.log('Erro ao buscar ultima mensagem');
    }

}

export async function comprimirImagem(imagem: any, fator: number) {

    const uri = await Base64ToUri(imagem.base64);

    let imagemComprimida: any;

    try {
        const comprimida = await manipulateAsync(
            uri,
            [],
            { base64: true, compress: fator, format: SaveFormat.JPEG },
        );

        imagemComprimida = {
            "base64": comprimida.base64,
            "height": comprimida.height,
            "mimeType": comprimida.uri.split('.').pop() || 'unknown',
            "uri": comprimida.uri,
            "width": comprimida.width
        }
        console.log(`Imagem Compress ${fator} : String base64 tamanho: `,
            ((imagemComprimida.base64.length / 1024) / 1024).toFixed(4) + " MB");

    } catch (error) {
        console.log('Erro ao comprimir..');
        return null;

    } finally {
        await FileSystem.deleteAsync(uri);
        return imagemComprimida;
    }

}

async function Base64ToUri(base64: string): Promise<string> {
    const filename = `${FileSystem.cacheDirectory}temp.jpg`;

    await FileSystem.writeAsStringAsync(filename, base64, { encoding: FileSystem.EncodingType.Base64 });
    return filename;
}