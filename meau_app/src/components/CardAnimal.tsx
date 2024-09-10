import { useEffect, useState } from "react";
import Constants from 'expo-constants';
import SelectDropdown from 'react-native-select-dropdown'
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProps } from "../utils/UtilsType";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useAutenticacaoUser } from "../assets/contexts/AutenticacaoUserContext";
import { returnArrayTokens, sendNotifications } from "../utils/UtilsNotification";
import { db, doc } from "../configs/FirebaseConfig";
import { addFavoritos, addInteressado, removeFavoritos, removeInteressado } from "../utils/UtilsDB";

interface CardProps {
    idAnimal: string;
    nome: string;
    tela: any;
    foto: { uri: string };
    modo: any;
    sexo?: string;
    idade?: string;
    porte?: string;
    cidade?: string;
    estado?: string;
    trocaIcone?: boolean;
    corCard?: string;
    meusPets?: boolean;
    disponivel?: boolean;
    updateEstadoAnimal?: (id: string, estado: boolean) => void,
    idDono: string;
    foiCurtido?: boolean;
    favoritos?: any;
    setFavoritos?: React.Dispatch<React.SetStateAction<any[]>>;
    interessadosQtd?: number
}

export default function CardAnimal({
    idDono, modo, nome, sexo, idade,
    porte, cidade, estado, trocaIcone = false,
    idAnimal, foto, tela, corCard = '#fee29b', meusPets = false,
    disponivel, updateEstadoAnimal, foiCurtido, favoritos,
    setFavoritos, interessadosQtd
}: CardProps) {

    const modoJustifyContent: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly' = modo;

    const navigationStack = useNavigation<NativeStackNavigationProps>();

    const { user, dadosUser } = useAutenticacaoUser();

    const [curtida, setCurtida] = useState(foiCurtido);

    const curtir = async () => {
        if (!user) {
            // Se o usuário não estiver autenticado, redirecione para a tela de aviso
            navigationStack.navigate("AvisoCadastro", { topbar: true })
        } else {

            curtida ? setCurtida(false) : setCurtida(true);

            console.log(nome, curtida);
            if (!curtida) {

                addFavoritos(user.uid, idAnimal);
                addInteressado(idAnimal, user.uid);

                try {

                    const expoTokensArray = await returnArrayTokens(idDono);

                    if (expoTokensArray.length > 0) {
                        const title = `${dadosUser.nome} curtiu seu pet!` + ' 🐾';
                        const body = `O usuário ${dadosUser.nome} curtiu o seu animal ${nome}`;
                        // Envia a notificação ao proprietário do animal
                        await sendNotifications(expoTokensArray, title, body, 'interessados', { nomeAnimal: nome, idAnimal: idAnimal, idIteressado: user.uid, idDono: idDono });
                    } else {
                        console.log("Proprietário do animal não possui um token de notificação registrado.");
                    }

                } catch (error) {
                    console.error("Erro ao buscar o token de notificação:", error);
                }

            } else {
                removeFavoritos(user.uid, idAnimal);
                removeInteressado(idAnimal, user.uid);

                if (favoritos) {
                    const novosFavoritos = favoritos.filter(favorito => favorito.id !== idAnimal);
                    setFavoritos(novosFavoritos);
                }

            }
        }
    };

    const emojis = [
        { title: 'Indisponível', icon: 'emoticon-neutral-outline' },
        { title: 'Disponível', icon: 'emoticon-excited-outline' },
    ];

    //console.log(nome + ": disp: " + disponivel, tela);


    return (

        <View style={[styles.card, { marginTop: 8 }]}>


            <View style={[styles.titulo, { backgroundColor: corCard }]}>

                <TouchableOpacity
                    onPress={() => navigationStack.navigate(tela, 
                        { animal_id: idAnimal, nome_animal: nome }
                    )}>
                    
                    <Text style={styles.text_nome}>{nome}</Text>
                </TouchableOpacity>

                {trocaIcone ?
                    interessadosQtd > 0 ?
                        <MaterialIcons name="error" size={24} color="#434343" style={{ marginRight: 15 }} />
                        :
                        <></>
                    :
                    <TouchableOpacity onPress={curtir}>
                        {curtida ?
                            <MaterialCommunityIcons name="cards-heart" size={24} color="#ff3030" style={{ marginRight: 15 }} />
                            :
                            <MaterialCommunityIcons name="cards-heart-outline" size={24} color="#434343" style={{ marginRight: 15 }} />
                        }
                    </TouchableOpacity>
                }
            </View>


            <TouchableOpacity
                onPress={() => navigationStack.navigate(tela, 
                    { animal_id: idAnimal, nome_animal: nome }
                )}
                style={styles.foto}>
                <Image source={foto} style={{ width: '100%', height: 180 }} resizeMode="cover" />

            </TouchableOpacity>

            <View style={styles.view_dados}>

                {meusPets ?
                    <>
                        <View style={[styles.dados1, {
                            justifyContent: modoJustifyContent,
                            //backgroundColor: 'red',
                            height: 49,
                            borderBottomRightRadius: 12,
                            borderBottomLeftRadius: 12,
                        }]} >

                            <SelectDropdown
                                defaultValue={
                                    disponivel ? { title: 'Disponível', icon: 'emoticon-excited-outline' }
                                        :
                                        { title: 'Indisponível', icon: 'emoticon-neutral-outline' }
                                }

                                data={emojis}

                                onSelect={(item, index) => {
                                    console.log(item, index);
                                    {
                                        item.title == 'Disponível' ?
                                            updateEstadoAnimal(idAnimal, true)
                                            :
                                            updateEstadoAnimal(idAnimal, false)
                                    }


                                }}

                                renderButton={(itemSelecionado, aberto) => {
                                    return (
                                        <View style={[styles.botaoDrop, { backgroundColor: itemSelecionado ? itemSelecionado.title == 'Disponível' ? '#88c9bf' : '#fee29b' : 'blue' }]}>
                                            {itemSelecionado && (
                                                <MaterialCommunityIcons name={itemSelecionado.icon} style={styles.botaoDropIcone} />
                                            )}
                                            <Text style={styles.bataoDropTexto}>
                                                {(itemSelecionado && itemSelecionado.title)}
                                            </Text>
                                            <MaterialCommunityIcons name={aberto ? 'chevron-up' : 'chevron-down'} style={styles.botaoDropSetinha} />
                                        </View>
                                    );
                                }}

                                renderItem={(item, index, isSelected) => {
                                    return (
                                        <View style={{ ...styles.botaoDropItem, ...(isSelected && { backgroundColor: '#D2D9DF' }) }}>
                                            <MaterialCommunityIcons name={item.icon} style={styles.botaoDropItemIcone} />
                                            <Text style={styles.botaoDropItemTexto}>{item.title}</Text>
                                        </View>
                                    );
                                }}

                                showsVerticalScrollIndicator={false}
                                dropdownStyle={styles.botaoDropMenu}
                            />

                            <View style={{ width: 1.1, height: 30, backgroundColor: '#434343' }} ></View>

                            <Text style={[styles.text_dados, { marginRight: 20 }]}>{interessadosQtd} INTERESSADOS</Text>

                        </View>
                    </>
                    :
                    <>
                        <View style={[styles.dados1, { justifyContent: modoJustifyContent }]} >
                            <Text style={[styles.text_dados, { marginLeft: 35 }]}>{sexo != undefined ? sexo.toUpperCase() : null}</Text>

                            <Text style={styles.text_dados}>{idade != undefined ? idade.toUpperCase() : null}</Text>

                            <Text style={[styles.text_dados, { marginRight: 35 }]}>{porte != undefined ? porte.toUpperCase() : null}</Text>
                        </View>

                        <View style={styles.dados2}>
                            <Text style={styles.text_dados}>{cidade != undefined ? cidade.toUpperCase() : null} – {estado != undefined ? estado.toUpperCase() : null}</Text>
                        </View>
                    </>
                }

            </View>

        </View>

    )
}



const styles = StyleSheet.create({
    card: {
        flex: 1,
        width: '95.5%',
        height: 264,
        marginTop: 8 - Constants.statusBarHeight,
        borderWidth: 0.4,
        borderRadius: 12,
        alignItems: 'center',
        borderColor: 'rgba(0, 0, 0, 0.2)',
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
    },
    titulo: {
        flexDirection: 'row',
        width: '100%',
        height: 32,
        //backgroundColor: '#fee29b',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
    },
    view_dados: {
        flexDirection: 'column',
        width: '100%',
        height: 49,
        backgroundColor: '#fff',
        borderBottomRightRadius: 12,
        borderBottomLeftRadius: 12,
    },
    dados1: {
        flexDirection: 'row',
        width: '100%',
        height: 24.5,
        backgroundColor: '#fff',
        alignItems: 'center',
    },
    dados2: {
        marginTop: 0,
        width: '100%',
        height: 24.5,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomRightRadius: 12,
        borderBottomLeftRadius: 12,
    },
    foto: {
        width: '100%',
        height: 180,
        backgroundColor: '#97aeff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    text_nome: {
        color: '#434343',
        marginLeft: 15,
        fontFamily: 'Roboto-Medium',
        fontSize: 16,
    },
    text_dados: {
        color: '#434343',
        fontSize: 12,
        fontFamily: 'Roboto-Medium'
    },
    text: {
        color: '#fff',
    },
    botaoDrop: {
        marginLeft: 20,
        width: 160,
        height: 22,
        borderRadius: 12,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 16,
    },
    bataoDropTexto: {
        flex: 1,
        fontSize: 14,
        fontWeight: '500',
        color: '#151E26',
    },
    botaoDropSetinha: {
        fontSize: 20,
    },
    botaoDropIcone: {
        fontSize: 20,
        marginRight: 8,
    },
    botaoDropMenu: {
        backgroundColor: '#E9ECEF',
        borderRadius: 8,
    },
    botaoDropItem: {
        width: '100%',
        flexDirection: 'row',
        paddingHorizontal: 12,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 8,
    },
    botaoDropItemTexto: {
        flex: 1,
        fontSize: 14,
        fontWeight: '500',
        color: '#151E26',
    },
    botaoDropItemIcone: {
        fontSize: 20,
        marginRight: 8,

    },
});