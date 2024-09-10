import { useState } from 'react';

function useLoading() {
    const [Parado, setEstadoParado] = useState(false);
    const [Carregando, setEstadoCarregando] = useState(false);
    const [Pronto, setEstadoPronto] = useState(false);

    const setParado = () => {
        setEstado(1);
    };
    const setCarregando = () => {
        setEstado(2);
    };
    const setPronto = () => {
        setEstado(3);
    };

    const setEstado = (index: number) => {
        setEstadoParado(index === 1);
        setEstadoCarregando(index === 2);
        setEstadoPronto(index === 3);
    };

    const zerarEstados = () => {
        setEstadoParado(false);
        setEstadoCarregando(false);
        setEstadoPronto(false);
    };

    return {
        Parado,
        Carregando,
        Pronto,
        setParado,
        setCarregando,
        setPronto,
        zerarEstados,
    };
};

export default useLoading;
