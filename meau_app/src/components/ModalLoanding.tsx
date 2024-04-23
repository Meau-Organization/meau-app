import { useEffect, useState } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";



export default function ModalLoanding() {

    const [rotation] = useState(new Animated.Value(0));

    useEffect(() => {
        Animated.loop(
          Animated.timing(rotation, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          })
        ).start();
      }, [rotation]); // Certifique-se de incluir rotation como dependência

    const spin = rotation.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    console.log(rotation);

    return(
        <View style={styles.container}>
            {/* <View style={styles.modal}> */}
            <Animated.View style={[styles.spinner, { transform: [{ rotate: spin }] }]} />
                
            {/* </View> */}
        </View>
    )

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        //backgroundColor: "rgba(43, 43, 43, 0.6)",
        alignItems: 'center',
        justifyContent: 'center',
    },
    modal: {
        backgroundColor: '#ffffff',
        width: '80%',
        height: 100,
        paddingTop: 24,
        paddingBottom: 24,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
    },
    spinner: {
        width: 50,
        height: 50,
        borderRadius: 25,
        borderWidth: 4,
        borderColor: '#0000ff',
        borderTopColor: 'transparent',
        borderRightColor: 'transparent',
        position: 'absolute',
      },

});