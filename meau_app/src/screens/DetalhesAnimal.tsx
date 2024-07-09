import { StyleSheet, Text, View } from "react-native";
import Constants from 'expo-constants';



export default function DetalhesAnimal({route}) {

    const { animal_id } = route.params;

    return(
        <View>
            <Text>Detalhes Animal: :{animal_id}</Text>
        </View>
    )

}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: Constants.statusBarHeight,
        backgroundColor: '#fafafa',
        alignItems: 'center',
    },
});