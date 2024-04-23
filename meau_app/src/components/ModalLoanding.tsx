import { StyleSheet, Text, View } from "react-native";
import Spinner from "react-native-loading-spinner-overlay";

interface ModalLoandingProps {
    spinner: boolean;
}

export default function ModalLoanding( { spinner } : ModalLoandingProps ) {

    return(
        <View style={styles.container}>
            <Spinner visible={spinner} />
        </View>
    )

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "rgba(43, 43, 43, 0.6)",
        alignItems: 'center',
        justifyContent: 'center',
    },

});