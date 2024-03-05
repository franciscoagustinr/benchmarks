import React from 'react'

export const Table = ({ submittedData, GPUScore, CPUScore, overallScore, gamesTitles, selectedTypeGPU, selectedMethod }) => {
    return (
        <div className="p-2 w-[100vw] ">
            <h2 className="text-white text-center text-xl">Results for</h2>
            <div className="mt-1 mb-1 text-white flex items-center justify-center gap-5">
                <div className=" text-sm">
                    GPU: <span className="font-bold text-xl">{submittedData.GPU}</span>
                </div>

                <div className=" text-sm">
                    CPU: <span className="font-bold text-xl">{submittedData.CPU}</span>
                </div>

                <div className="w-fit bg-gray-700 text-gray-400 text-sm font-medium my-2 px-2.5 py-0.5 rounded border border-gray-500 h-fit">
                    {selectedTypeGPU && selectedTypeGPU.toUpperCase()}
                </div>
                <div className="w-fit bg-gray-700 text-gray-400 text-sm font-medium my-2 px-2.5 py-0.5 rounded border border-gray-500 h-fit">
                    {submittedData.method && submittedData.method.toUpperCase()}
                </div>
            </div>

            <div className='overflow-x-scroll'>
                <table className="text-white border-collapse border border-slate-500 my-3">
                    <thead>
                        <tr>
                            <th className="border border-slate-600 min-w-[100px] text-sm">GPU</th>
                            <th className="border border-slate-600 min-w-[100px] text-sm">Score GPU</th>
                            <th className="border border-slate-600 min-w-[100px] text-sm">Score CPU</th>
                            <th className="border border-slate-600 min-w-[100px] text-sm">Score Overall</th>
                            {/* GAMES  */}
                            {Object.keys(gamesTitles).map((game, index) => (
                                <th key={index} className="text-sm border border-slate-600 min-w-[150px] px-2">{game}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="border border-slate-600 text-center p-2">{submittedData.GPU}</td>
                            <td className="border border-slate-600 text-center p-2">{GPUScore}</td>
                            <td className="border border-slate-600 text-center p-2">{CPUScore}</td>
                            <td className="border border-slate-600 text-center p-2">{overallScore}</td>
                            {Object.keys(gamesTitles).map((game, index) => (

                                <td key={index} className="border border-slate-600 p-2">
                                    {
                                        Object.entries(gamesTitles[game]).map(([key, value], index) => (
                                            <p key={index}>
                                                <strong>{key}:</strong> {value}
                                            </p>
                                        ))
                                    }
                                </td>


                            ))}

                        </tr>
                    </tbody>
                </table>
            </div>
        </div >
    )
}
