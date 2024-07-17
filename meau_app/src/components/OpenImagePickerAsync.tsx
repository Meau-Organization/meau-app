import React, { useState } from 'react';
import { Modal, View , Button, StyleSheet, Alert } from 'react-native'; 
import * as ImagePicker from 'expo-image-picker';

export default function OpenImagePicker({ onImagePicked }) {

    const [modalVisible,setModalVisible] = useState(false);

    const openImagePickerAsync = async (fromCamera) => {
        setModalVisible(false);
        let permissionResult;
        if (fromCamera) {
            permissionResult = await ImagePicker.requestCameraPermissionsAsync();
        } else {
            permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        }
    
        if (permissionResult.granted === false) {
            Alert.alert("Permissão necessária","É necessário conceder permissão para acessar a câmera ou a galeria de fotos!");
            return null;
        }
    
        let pickerResult;
        if (fromCamera) {
           
            pickerResult = await ImagePicker.launchCameraAsync({
                base64: true,
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                quality: 1,
            });
        } else {
            
            pickerResult = await ImagePicker.launchImageLibraryAsync({
                base64: true,
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                quality: 1,
            });
        }
    
        if (!pickerResult.cancelled) {
            onImagePicked(pickerResult);
        }
    }
    return (
        <>
            <Button title="Open Picker" onPress={() => setModalVisible(true)} />
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Button title="Usar Câmera" onPress={() => openImagePickerAsync(true)} />
                        <Button title="Abrir Galeria" onPress={() => openImagePickerAsync(false)} />
                        <Button title="Cancelar" onPress={() => setModalVisible(false)} color="#FF6347" />
                    </View>
                </View>
            </Modal>
        </>
    );




};

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    }
});