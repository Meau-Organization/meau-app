import { collection, db, doc, getDoc, getDocs, limitToLast, orderBy, query, where } from '../configs/FirebaseConfig.js'

export async function buscarCampoEspecifico(colecao: string, id_documento: string, campo: string) {
    const docRef = doc(db, colecao, id_documento);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        const campoEspecifico = await docSnap.get(campo);
        //console.log("Valor do campo:", campoEspecifico);
        return campoEspecifico;
    } else {
        console.log("Campo não encontrado");
        return null;
    }
}

export async function buscarDadosAnimalBasico(idAnimal: string) {

    try {
        const animalsRef = doc(db, 'Animals', idAnimal);
        const animalDoc = await getDoc(animalsRef);

        if (animalDoc.exists()) {
            return animalDoc.data();
        } else {
            console.log('Dados do animal não encontrados');
            return null;
        }
    } catch (error) {
        console.error('Erro ao buscar dados do animal: ', error);
    }

    return null;
}

export async function buscarDadosUsuarioExterno(userId: string) {

    try {
        const userRef = doc(db, 'Users', userId);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
            console.log(userDoc.data().nome)
            return userDoc.data();
        } else {
            console.log('Dados do user externo não encontrados');
            return null;
        }
    } catch (error) {
        console.error('Erro ao buscar dados do user externo: ', error);
    }

    return null;
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
        return { ultimaMensagem: { key: snapshot.docs[0].id, ...snapshot.docs[0].data() }, contador: msgsNaoLidas.length };

    } else {
        console.log('Erro ao buscar ultima mensagem');
        return null;
    }

}

export async function documentExiste(docRef : any): Promise<boolean> {
    try {
      const docSnapshot = await getDoc(docRef);
      if (docSnapshot.exists()) {
        //console.log("Documento existe!");
        return true;
      } else {
        console.log("Documento não existe.");
        return false;
      }
    } catch (error) {
      console.error("Erro ao verificar documento:", error);
    }
    return false;
  };