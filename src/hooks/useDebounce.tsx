import { useState, useEffect } from 'react';

// Hook để debouncing giá trị
const useDebounce = (value, delay) => {
    // State và setter cho giá trị debounced
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        // Thiết lập một timer để thay đổi giá trị debounced sau khi delay đã qua
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        // Hủy bỏ timer khi có giá trị mới hoặc component bị unmount
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]); // Chỉ re-call effect nếu giá trị hoặc delay thay đổi

    return debouncedValue;
}

export default useDebounce;
