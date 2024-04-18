import { StyleSheet, Text, View } from "react-native";



export default function SplashScreen() {


    return (
        <View>
            <Text>Fala meu bom</Text>
        </View>
    );


}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        //paddingTop: Constants.statusBarHeight,
        backgroundColor: '#fafafa',
        alignItems: 'center',
    },

});