
import * as ImagePicker from 'expo-image-picker';

export const openImagePickerAsync = async (fromCamera) => {
    let permissionResult;
    if (fromCamera) {
        permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    } else {
        permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    }

    if (permissionResult.granted === false) {
        alert("É necessário conceder permissão para acessar a câmera ou a galeria de fotos!");
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
        return pickerResult;
    } else {
        return null;
    }
}