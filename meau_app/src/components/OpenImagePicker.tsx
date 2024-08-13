
import { Modal, View , Button, StyleSheet, Alert } from 'react-native'; 
import * as ImagePicker from 'expo-image-picker';

import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';

import * as FileSystem from 'expo-file-system'

export default function OpenImagePicker({ onImagePicked, onClose }) {


    const openImagePickerAsync = async (fromCamera) => {
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
    
        let imagemLida : any;
        if (fromCamera) {
            imagemLida = await ImagePicker.launchCameraAsync({
                base64: true,
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                quality: 1,
            });
        } else {
            //console.log("galeria");
            imagemLida = await ImagePicker.launchImageLibraryAsync({
                base64: true,
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                quality: 1,
            });
        }

        
        
        //console.log("canceled status: " + canceled);
        if (!imagemLida.canceled) {
            const canceled = imagemLida.canceled;
            const imagemOriginal = imagemLida.assets[0];
            
            const info = await FileSystem.getInfoAsync(imagemOriginal.uri);

            let imagemPrincipal : any;
            let imagemComprimidaCard : any;
            let tamBase64Principal : number;

            if (info.exists) {
                const tamImagem : number = Number(((info.size/1024)/1024).toFixed(4));

                if (tamImagem <= 0.7) {
                    console.log("Arq Img original: ", tamImagem + " MB : Menor que 0.7 MB, não precisa de compressão");

                    imagemPrincipal = {
                        "base64": imagemOriginal.base64,
                        "height": imagemOriginal.height,
                        "mimeType": imagemOriginal.mimeType,
                        "uri": imagemOriginal.uri,
                        "width": imagemOriginal.width
                    };

                    tamBase64Principal =  Number(((imagemPrincipal.base64.length/1024)/1024).toFixed(4) );
                    console.log("Imagem Principal : Sem compressão : String base64 tamanho: ", tamBase64Principal + " MB");

                    const comprime1 = await manipulateAsync(
                        imagemOriginal.uri,
                        [],
                        { base64: true, compress: 0.3, format: SaveFormat.JPEG },
                    );
                    if (comprime1) {
                        imagemComprimidaCard = {
                            "base64": comprime1.base64,
                            "height": comprime1.height,
                            "mimeType": comprime1.uri.split('.').pop() || 'unknown',
                            "uri": comprime1.uri,
                            "width": comprime1.width
                        }
                        console.log("Imagem Card-anim : Compress 30% : String base64 tamanho: ", 
                            ((imagemComprimidaCard.base64.length/1024)/1024).toFixed(4) + " MB");
                    }

                    onImagePicked({
                        imagemPrincipal: imagemPrincipal,
                        imagemCard: imagemComprimidaCard,
                        tamBase64Principal: tamBase64Principal,
                        canceled: canceled
                    });
                
                    //////////////////////////////////////////////////////////////////////////////////////////////////////////
                } else {
                    console.log("Arq Img original: ", tamImagem + " MB");

                    const comprime1 = await manipulateAsync(
                        imagemOriginal.uri,
                        [],
                        { base64: true, compress: 0.5, format: SaveFormat.JPEG },
                    );
                    if (comprime1) {
                        imagemPrincipal = {
                            "base64": comprime1.base64,
                            "height": comprime1.height,
                            "mimeType": comprime1.uri.split('.').pop() || 'unknown',
                            "uri": comprime1.uri,
                            "width": comprime1.width
                        };
                        tamBase64Principal =  Number( ((imagemPrincipal.base64.length/1024)/1024).toFixed(4) );
        
                        console.log("Imagem Principal : Compress 50% : String base64 tamanho: ", tamBase64Principal + " MB");
                    }

                    const comprime2 = await manipulateAsync(
                        imagemOriginal.uri,
                        [],
                        { base64: true, compress: 0.2, format: SaveFormat.JPEG },
                    );
                    
                    if (comprime2) {
                        imagemComprimidaCard = {
                            "base64": comprime2.base64,
                            "height": comprime2.height,
                            "mimeType": comprime2.uri.split('.').pop() || 'unknown',
                            "uri": comprime2.uri,
                            "width": comprime2.width
                        };
                        console.log("Imagem Card-anim : Compress 20% : String base64 tamanho: ", ((imagemComprimidaCard.base64.length/1024)/1024).toFixed(4) + " MB");
                    }

                }

                onImagePicked({
                    imagemPrincipal: imagemPrincipal,
                    imagemCard: imagemComprimidaCard,
                    tamBase64Principal: tamBase64Principal,
                    canceled: canceled
                });

            }

            

        } else {
            console.log("User canceled image picker")
        }
        
        onClose();
    }
    return (
        <>
        <Modal
            animationType="slide"
            transparent={true}
            visible={true}
            onRequestClose={onClose}

        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <Button title="Usar Câmera" onPress={() => openImagePickerAsync(true)} />
                    <Button title="Abrir Galeria" onPress={() => openImagePickerAsync(false)} />
                    <Button title="Cancelar" onPress={onClose} color="#FF6347" />
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