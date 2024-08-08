

export const formatarData = (objetoDate: Date): string => {
    
    const year = objetoDate.getFullYear();
    const month = String(objetoDate.getMonth() + 1).padStart(2, '0'); // Meses são baseados em zero
    const day = String(objetoDate.getDate()).padStart(2, '0');
    const hours = String(objetoDate.getHours()).padStart(2, '0');
    const minutes = String(objetoDate.getMinutes()).padStart(2, '0');
    const seconds = String(objetoDate.getSeconds()).padStart(2, '0');

    const dataFormatada = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;

    return dataFormatada;

}

