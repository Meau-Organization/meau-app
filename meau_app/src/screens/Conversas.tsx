import { TopBar } from "../components/TopBar";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StackRoutesParametros } from "../utils/StackRoutesParametros";
import { ScrollView } from "react-native-gesture-handler";


export default function Conversas(){

    const navigation = useNavigation<NativeStackNavigationProp<StackRoutesParametros, 'BoxLogin'>>();
    return (
        <ScrollView style={{ backgroundColor: '#fafafa' }}>
            <TopBar
                nome = "Conversas"
                icone='voltar'
                irParaPagina={() => navigation.goBack()}
                cor='#88c9bf'
            />
        </ScrollView>
    );

    
}
