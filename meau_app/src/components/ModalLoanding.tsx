import Constants from 'expo-constants';
import { StyleSheet, View } from "react-native";
import Spinner from "react-native-loading-spinner-overlay";

interface ModalLoandingProps {
    spinner: boolean;
    cor?: string;
}

export default function ModalLoanding( { spinner, cor = "#ffd358"  } : ModalLoandingProps ) {

    return(
        <View style={styles.container}>
            <View style={styles.modal}>
                <Spinner visible={spinner} size={50} color={cor}/>
            </View>
        </View>
    )

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    modal: {
        width: "80%",
        height: 200,
        marginTop: -Constants.statusBarHeight,
        backgroundColor: "rgba(43, 43, 43, 0.0)",
        borderRadius: 10
    },

});