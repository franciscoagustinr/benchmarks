import React from 'react'
import loader from '/src/assets/loader2.png';

export const Loader = () => {
    return (
        <div className="mt-10 w-[100vw] text-white flex flex-col items-center justify-center gap-2 ">
            <img src={loader} alt="Loader" className="w-12" />
            <span className="">Loading...</span>
        </div>
    )
}
