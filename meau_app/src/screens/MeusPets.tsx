import { FlatList, Modal, StyleSheet, Text, View } from "react-native";
import Constants from 'expo-constants';

import { getAuth, db, collection, query, where, getDocs } from '../configs/firebaseConfig';
import { useEffect, useState } from "react";
import ModalLoanding from "../components/ModalLoanding";


export default function MeusPets({ route }) { 

    let { recarregar, usuario_id } = route.params;

    const [modal, setModal] = useState(false);
    const [loading, setLoading] = useState(true);

    const [meusPets, setMeusPets]  = useState([]);

    const buscarMeusPets = async (usuario_id : string) => {
        setModal(true);
        try {
            const animalsRef = collection(db, 'Animals');

            const q = query(animalsRef, where('usuario_id', '==', usuario_id));

            const snapshot = await getDocs(q);
            const meus_pets = [];

            snapshot.forEach((doc) => {
                meus_pets.push({ uid: doc.id, ...doc.data() });
                //console.log(doc.id, " => ", doc.data());
            });

            setMeusPets(meus_pets);

            setLoading(false);
            setModal(false);

        } catch(error) {
            setLoading(false);
            setModal(false);
            console.log(error);
        }
    };


    useEffect(() => {
        const user = getAuth().currentUser;

<<<<<<< Updated upstream
        if (user) {
            console.log("Logado - Pagina Meus Pets");
            buscarMeusPets(user.uid);
=======
            setCurrentUser(user);

            if (user) {
                console.log("Logado - Pagina Meus Pets");
                buscarMeusPets(user.uid);

            } else {
                setEsperando(false);
                console.log("SAIU");
            }

            return () => {
                //console.log('Tela perdeu foco');
            };

        }, [])
    );

    if (currentUser && !esperando) {

        return(
            <ScrollView style={{backgroundColor: '#fafafa'}}>
                <View style={styles.container}>

                    {meusPets.map((animal, index : number) => (
                        
                        <View key={animal.uid} style={{ flexDirection: 'row',  width: '95.5%' }}>
                            
                            <CardAnimal
                                primeiro={ index == 0 ? true : false}
                                modo={'space-between'}
                                nome={animal.nomeAnimal}
                                sexo={""}
                                idade={"0 NOVOS INTERESSADOS"}
                                porte={""}
                                cidade={""}
                                estado={""}
                                trocaIcone={true}
                                id={animal.uid}
                            />

                        </View>
                    ))}

                    <View style={{marginTop:20, backgroundColor: 'rgba(0, 0, 0, 0)', width: '80%', height: 100}}></View>



                </View>
            </ScrollView>


        );

    } else {
        if (esperando) {
            return (
                <Modal visible={esperando && modal} animationType='fade' transparent={true}>
                    <ModalLoanding spinner={esperando} />
                </Modal>
            );
>>>>>>> Stashed changes

        } else {
            
            console.log("SAIU");
        }

    }, []);

    return(
        
        <View>
            <Text>{recarregar ? 'Recarregar' : ''}</Text>
            
            <FlatList
            
                data={meusPets}

                keyExtractor={item => item.id.toString()}

                renderItem={({ item }) => (
                    <View  style={{marginTop: 10, borderWidth: 1}}>
                        <Text>Nome: {item.nomeAnimal}</Text>
                        <Text>Epecie: {item.especie}</Text>
                        <Text>Sexo: {item.sexo}</Text>
                        <Text>Porte: {item.porte}</Text>
                        <Text>Idade: {item.idade}</Text>
                        <Text>Temperamento: {item.temperamento.join(', ')}</Text>
                        <Text>Saúde: {item.saude.join(', ')}</Text>
                        <Text>Doenças: {item.doencasAnimal}</Text>
                        <Text>Sobre: {item.sobreAnimal}</Text>
                        <Text>Termos de Adoção: {item.termosAdocao}</Text>
                        <Text>Fotos da Casa: {item.exigenciaFotosCasa}</Text>
                        <Text>Visita Prévia ao animal: {item.visitaPrevia}</Text>
                        <Text>Tempo de Acompanhamento: {item.tempoAcompanhamento}</Text>
                        
                    </View>
                )}
            />
            
            <Modal visible={loading && modal} animationType='fade' transparent={true}>
                <ModalLoanding spinner={loading} />
            </Modal>
        </View>
    );

}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: Constants.statusBarHeight,
        backgroundColor: '#fafafa',
        alignItems: 'center',
    },
});