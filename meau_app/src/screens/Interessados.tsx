import { Text, View, ScrollView, StyleSheet } from "react-native";

import { TopBar } from "../components/TopBar";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StackRoutesParametros } from "../utils/StackRoutesParametros";
import { useNavigation } from "@react-navigation/native";
interface InteressadosProps {
    route: {
        params: {
            animal_id: string;
            nome_animal: string;
        };
    };
}



export default function Interessados({ route }: InteressadosProps) {

    const navigation = useNavigation<NativeStackNavigationProp<StackRoutesParametros, 'Interessados'>>();

    return (
        <>
            <TopBar
                nome={route.params.nome_animal}
                icone='voltar'
                irParaPagina={() => navigation.getState().index > 0 ? navigation.goBack() : navigation.navigate('DrawerRoutes')}
                cor='#fee29b'
            />

            <ScrollView style={{ backgroundColor: '#fafafa' }}>
                <View style={styles.container}>
                    <Text>INTERESSADOS: {route.params.nome_animal} (ID: {route.params.animal_id})</Text>
                </View>
            </ScrollView>


        </>
    )



}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fafafa',
        alignItems: 'center'
    },
});