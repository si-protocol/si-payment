import { useEffect, useRef } from 'react';

function useDebounce(defaultDelay: number = 2000): { debounce: (FN?: Function, delay?: number) => Promise<void>; clear: () => void } {
    let timer: any = useRef(null);
    const debounce: any = (FN: Function, delay: number = defaultDelay): Promise<void> => {
        return new Promise((resolve, reject) => {
            clearInterval(timer.current);
            timer.current = setTimeout(() => {
                FN && FN();
                resolve();
            }, delay);
        });
    };

    const clear = () => {
        clearTimeout(timer.current);
    };

    useEffect(() => {
        return () => {
            clearTimeout(timer.current);
        };
    }, []);
    return { debounce, clear };
}

export default useDebounce;
