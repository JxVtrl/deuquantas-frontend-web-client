import React from 'react';

interface CounterProps {
    value: number;
    onChange: (value: number) => void;
}

export const Counter: React.FC<CounterProps> = ({ value, onChange }) => {
    return (
        <div className='flex items-center gap-2 border border-solid border-[#FFCC00] h-[21px] rounded-[2px] w-[83px] justify-around mt-[12px]'>
            <button className='w-[22px] h-[21px] p-0 flex items-center justify-center' onClick={() => onChange(value - 1)}><svg width="10" height="3" viewBox="0 0 10 3" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1.5 1.5H8.5" stroke="#1E1E1E" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            </button>
            <span className='text-[12px] font-[600] leading-[16px] tracking-[0.5px] text-[#000000]'>{value}</span>
            <button className='w-[22px] h-[21px] p-0 flex items-center justify-center' onClick={() => onChange(value + 1)}><svg width="10" height="9" viewBox="0 0 10 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 1V8M1.5 4.5H8.5" stroke="#1E1E1E" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            </button>
        </div>
    );
};
