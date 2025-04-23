import React from 'react';

interface CounterProps {
    value: number;
    onChange: (value: number) => void;
}


export const Counter: React.FC<CounterProps> = ({ value, onChange }) => {
    return (
        <div className="flex items-center gap-2">
            <button onClick={() => onChange(value - 1)}>-</button>
            <span>{value}</span>
            <button onClick={() => onChange(value + 1)}>+</button>
        </div>
    );
};