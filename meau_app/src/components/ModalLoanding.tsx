import { StyleSheet, Text, View } from "react-native";
import Spinner from "react-native-loading-spinner-overlay";
import Constants from 'expo-constants';

interface ModalLoandingProps {
    spinner: boolean;
}

export default function ModalLoanding( { spinner } : ModalLoandingProps ) {

    return(
        <View style={styles.container}>
            <View style={styles.modal}>
                <Spinner visible={spinner} size={50}/>
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
        backgroundColor: "rgba(43, 43, 43, 0.6)",
        borderRadius: 10
    },

});