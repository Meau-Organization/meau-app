
import { useState } from 'react';

const useVetorBool = (tam: number) => {

    const [vetorBool, setVetorBool] = useState(Array.from({ length: tam }, () => false));

    const AlternarItem = (index) => {
        setVetorBool(prevArray => 
            prevArray.map((item, i) => (i === index ? !item : item))
        );
    };

    return [vetorBool, AlternarItem] as const;
};

export default useVetorBool;
