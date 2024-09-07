import * as FileSystem from 'expo-file-system';
import { manipulateAsync, SaveFormat } from "expo-image-manipulator";


export async function comprimirImagem(imagem: any, fator: number) {

    const uri = await Base64ToUri(imagem.base64);

    let imagemComprimida: any;

    try {
        const comprimida = await manipulateAsync(
            uri,
            [],
            { base64: true, compress: fator, format: SaveFormat.JPEG },
        );

        imagemComprimida = {
            "base64": comprimida.base64,
            "height": comprimida.height,
            "mimeType": comprimida.uri.split('.').pop() || 'unknown',
            "uri": comprimida.uri,
            "width": comprimida.width
        }
        console.log(`Imagem Compress ${fator} : String base64 tamanho: `,
            ((imagemComprimida.base64.length / 1024) / 1024).toFixed(4) + " MB");

    } catch (error) {
        console.log('Erro ao comprimir..');
        return null;

    } finally {
        await FileSystem.deleteAsync(uri);
        return imagemComprimida;
    }

}

async function Base64ToUri(base64: string): Promise<string> {
    const filename = `${FileSystem.cacheDirectory}temp.jpg`;

    await FileSystem.writeAsStringAsync(filename, base64, { encoding: FileSystem.EncodingType.Base64 });
    return filename;
}
