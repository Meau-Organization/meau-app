import { Text, View, ScrollView, StyleSheet } from "react-native";

import { TopBar } from "../components/TopBar";

import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useAutenticacaoUser } from "../assets/contexts/AutenticacaoUserContext";
import { useCallback } from "react";
import { NativeStackNavigationProps } from "../utils/UtilsType";

interface InteressadosProps {
    route: {
        params: {
            animal_id: string;
            nome_animal: string;
            id_dono: string;
            id_interessado: string;
        };
    };
}



export default function Interessados({ route }: InteressadosProps) {

    const { user } = useAutenticacaoUser();

    const navigationStack = useNavigation<NativeStackNavigationProps>();

    useFocusEffect(
        useCallback(() => {

            if (user.uid == route.params.id_dono || user.uid == route.params.id_interessado) {
                // Execute as operações
                
            } else {
                navigationStack.navigate("DrawerRoutes");
            }

        }, [])
    );

    if (user.uid == route.params.id_dono || user.uid == route.params.id_interessado) {

        return (
            <>
                <TopBar
                    nome={route.params.nome_animal}
                    icone='voltar'
                    irParaPagina={() => navigationStack.getState().index > 0 ? navigationStack.goBack() : navigationStack.navigate('DrawerRoutes')}
                    cor='#fee29b'
                />

                <ScrollView style={{ backgroundColor: '#fafafa' }}>
                    <View style={styles.container}>
                        <Text>INTERESSADOS: NOME_ANIMAL: {route.params.nome_animal} || ID_ANIMAL: {route.params.animal_id} || ID_DONO: {route.params.id_dono}
                            || ID_INTERESSADO: {route.params.id_interessado}
                        </Text>
                    </View>
                </ScrollView>


            </>
        )
    }

}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fafafa',
        alignItems: 'center'
    },
});