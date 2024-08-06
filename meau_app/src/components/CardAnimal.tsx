import { Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Constants from 'expo-constants';
import { StackRoutesParametros } from "../utils/StackRoutesParametros";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { Screen } from "react-native-screens";

import SelectDropdown from 'react-native-select-dropdown'


const PlaceLogoImage = require('../assets/images/Meau_marca_2.png');

interface CardProps {
    id: string;
    nome: string;
    tela: any;
    foto: { uri: string };
    modo: any;
    primeiro?: boolean;
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
}

export default function CardAnimal({ primeiro, modo, nome, sexo, idade, porte, cidade, estado, trocaIcone = false, id, foto, tela, corCard = '#fee29b', meusPets = false, disponivel, updateEstadoAnimal }: CardProps) {

    const modoJustifyContent: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly' = modo;

    const navigation = useNavigation<NativeStackNavigationProp<StackRoutesParametros, 'CardAnimal'>>();

    const [curtida, setCurtida] = useState(false);

    const curtir = () => {
        curtida ? setCurtida(false) : setCurtida(true);
    };

    const emojis = [
        { title: 'Indisponível', icon: 'emoticon-neutral-outline' },
        { title: 'Disponível', icon: 'emoticon-excited-outline' },
    ];

    //console.log(nome + ": disp: " + disponivel);

    // Simulando interessados
    let interessados : number;
    if (meusPets) { 
        if (Math.floor(Math.random() * 2) == 1) {
            interessados = 3;
        } else {
            interessados = 0;
        }
    }
    

    return (

        <View style={[styles.card, { marginTop: primeiro ? 8 - Constants.statusBarHeight : 8 }]}>


            <View style={[styles.titulo, { backgroundColor: corCard }]}>

                <TouchableOpacity
                    onPress={
                        // () => navigation.navigate("DetalhesAnimal", {animal_id: id })
                        () => navigation.navigate(tela, { animal_id: id })
                    }
                >
                    <Text style={styles.text_nome}>{nome}</Text>
                </TouchableOpacity>

                {trocaIcone ?
                    interessados > 0 ? 
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
                onPress={
                    //() => navigation.navigate("DetalhesAnimal", {animal_id: id })
                    () => navigation.navigate(tela, { animal_id: id })
                }
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
                                        updateEstadoAnimal(id, true)
                                        :
                                        updateEstadoAnimal(id, false)
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

                            <View style={{width: 1.1, height: 30, backgroundColor: '#434343'}} ></View>

                            <Text style={[styles.text_dados, { marginRight: 20 }]}>{interessados} INTERESSADOS</Text>

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
        fontFamily: 'Roboto',
        fontSize: 16,
    },
    text_dados: {
        color: '#434343',
        fontSize: 12,
        fontFamily: 'Roboto'
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