import React, { useEffect, useState, useRef } from "react";
import searchImg2 from '/src/assets/searchImg2.svg';
import closeImg from '/src/assets/closeImg.svg';
import { Loader } from "./Loader";
import { Table } from "./Table";
import '../form.css';

export const Form = () => {
    // OPCIONES DE SELECCION 
    const [optionsCPU, setOptionsCPU] = useState("");
    const [optionsGPU, setOptionsGPU] = useState("");
    // VALORES SELECCIONADOS
    const [selectedValueCPU, setSelectedValueCPU] = useState("");
    const [selectedValueGPU, setSelectedValueGPU] = useState("");
    const [selectedMethod, setSelectedMethod] = useState('STAGING');
    // VALORES SUBMITTEADOS
    const [submittedData, setSubmittedData] = useState("");
    const [CPUScore, setCPUScore] = useState('');
    const [GPUScore, setGPUScore] = useState('');
    const [overallScore, setOverallScore] = useState('');
    const [selectedTypeGPU, setSelectedTypeGPU] = useState("");
    const [gamesTitles, setGamesTitles] = useState('');
    // ESTADOS GRALES.
    const [isLoading, setIsLoading] = useState(false);
    const [isActiveCPU, setIsActiveCPU] = useState(false);
    const [isActiveGPU, setIsActiveGPU] = useState(false);
    const [isActiveMethod, setIsActiveMethod] = useState(false);
    const [searchedValueCPU, setSearchedValueCPU] = useState('');
    const [searchedValueGPU, setSearchedValueGPU] = useState('');
    // REFS
    const chooseCPURef = useRef();
    const chooseGPURef = useRef();
    const searchRefCPU = useRef();
    const searchRefGPU = useRef();
    const chooseMethodRef = useRef();

    // AGREGA LA CLASE ACTIVE PARA MOSTRAR/OCULTAR LAS OPCIONES DE CADA SELECTOR
    const toggleElementCPU = () => {
        setIsActiveCPU(!isActiveCPU);
    }
    const toggleElementGPU = () => {
        setIsActiveGPU(!isActiveGPU);
    }
    const toggleElementMethod = () => {
        setIsActiveMethod(!isActiveMethod);
    }

    // FETCH DE LAS OPCIONES GPU CON FILTRO DE MÉTODO - default STAGING
    const getGPUOptions = async () => {
        let endpoint = import.meta.env.VITE_ENDPOINT_GPU_STAGING;
        if (selectedMethod === 'PRODUCTION') {
            endpoint = import.meta.env.VITE_ENDPOINT_GPU_PRODUCTION;
        } else {
            endpoint = import.meta.env.VITE_ENDPOINT_GPU_STAGING;
        }

        fetch(endpoint)
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                setOptionsGPU(data);
            })
            .catch((error) => {
                console.log("error :: ", error);
            });
    };

    // FETCH DE LAS OPCIONES CPU CON FILTRO DE MÉTODO - default STAGING
    const getCPUOptions = async () => {
        let endpoint = import.meta.env.VITE_ENDPOINT_CPU_STAGING;
        if (selectedMethod === 'PRODUCTION') {
            endpoint = import.meta.env.VITE_ENDPOINT_CPU_PRODUCTION;
        } else {
            endpoint = import.meta.env.VITE_ENDPOINT_CPU_STAGING;
        }

        fetch(endpoint)
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                setOptionsCPU(data);
            })
            .catch((error) => {
                console.error("error :: ", error);
            });
    };

    // AL OBTENER RESULTADOS
    const handleSubmit = (e) => {
        e.preventDefault();
        // VERIFICA QUE NO ESTÉN VACÍOS LOS DATOS
        if (!selectedValueCPU || !selectedValueGPU || selectedValueCPU === 'Select an option' || selectedValueGPU === 'Select an option' || !selectedMethod || selectedMethod === 'Select a method') {
            alert("Debes seleccionar un método junto a un CPU y una GPU para obtener la información!");
            return;
        }
        setIsLoading(true);

        // ASIGNA VALORES PARA FETCHEAR LA INFORMACIÓN CON LA API
        setSubmittedData({
            CPU: selectedValueCPU,
            GPU: selectedValueGPU,
            method: selectedMethod
        });
        const selectedGPU = optionsGPU.find(optGPU => optGPU.name === selectedValueGPU);
        setSelectedTypeGPU(selectedGPU ? selectedGPU.type : '');

    };

    // FETCH PARA MOSTRAR LA INFORMACIÓN DE LOS VALORES SELECCIONADOS CON FILTRO DE MÉTODO
    const fetchDataPost = () => {
        let endpoint = import.meta.env.VITE_ENDPOINT_ESTIMATE_STAGING;

        if (selectedMethod === 'PRODUCTION') {
            endpoint = import.meta.env.VITE_ENDPOINT_ESTIMATE_PRODUCTION
        } else {
            endpoint = import.meta.env.VITE_ENDPOINT_ESTIMATE_STAGING
        }

        fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                cpuName: submittedData.CPU,
                gpuName: submittedData.GPU,
                gpuType: selectedTypeGPU
            })
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                setCPUScore(data.timeSpyScoreCPU);
                setGPUScore(data.timeSpyScoreGPU);
                setOverallScore(data.timeSpyOverallScore);
                setGamesTitles(data.gameTitles);
            })
            .catch(error => {
                console.error('Error al obtener los datos:', error);
            })
            .finally(() => {
                setIsLoading(false);

            })
    };

    useEffect(() => {
        getCPUOptions();
        getGPUOptions();

    }, [selectedMethod]);

    useEffect(() => {
        if (submittedData) {
            setIsLoading(true);
            fetchDataPost();
        }
    }, [submittedData]);

    const updateCpu = (selectedCPU) => {
        setSelectedValueCPU(selectedCPU);
        chooseCPURef.current.innerText = selectedCPU;
        setIsActiveCPU(!isActiveCPU);
        searchRefCPU.current.value = '';
        setSearchedValueCPU('');
    }

    const updateGpu = (selectedGPU) => {
        setSelectedValueGPU(selectedGPU);
        chooseGPURef.current.innerText = selectedGPU;
        setIsActiveGPU(!isActiveGPU);
        searchRefGPU.current.value = '';
        setSearchedValueGPU('');
    }

    const updateMethod = (methodValue) => {
        setSelectedMethod(methodValue);
        chooseMethodRef.current.innerText = methodValue;
        setIsActiveMethod(!isActiveMethod);
    }

    const updateSearchCPU = (e) => {
        setSearchedValueCPU((e.target.value).toLowerCase());
    }
    const updateSearchGPU = (e) => {
        setSearchedValueGPU((e.target.value).toLowerCase());
    }


    return (
        <>
            <div className="container min-w-[1200px] mt-8 overflow-x-visible ">

                {/* SELECCIÓN DE MÉTODO - default STAGING  */}
                <div id="wrapper-method" className={`${isActiveMethod ? 'active' : ''} ml-56 `}>
                    <span className="after:content-['*'] after:ml-0.5 after:text-red-500 ml-1 mb-1 block text-md font-light text-[#FAFAFA] select-none">
                        Pick a method for response
                    </span>
                    <div id="select-button-method" onClick={toggleElementMethod} className=" w-[250px] h-[35px] bg-white flex items-center justify-between cursor-pointer px-5 py-0 rounded-[7px]">
                        <span ref={chooseMethodRef} className="block my-2 text-md font-medium text-black select-none">
                            STAGING
                        </span>
                        <span className="arrow transition-all duration-300 ease-linear select-none">↓</span>
                    </div>
                    <div className="content-method w-[250px] invisible opacity-0 bg-white mt-[5px] p-2 rounded-[7px] transition-all duration-300">
                        <ul className="options overflow-y-auto mt-1">
                            <li onClick={() => updateMethod('STAGING')} className="h-9 flex items-center px-1 py-0.5  rounded-[5px] hover:bg-[#f2f2f2] cursor-pointer select-none	">
                                STAGING
                            </li>
                            <li onClick={() => updateMethod('PRODUCTION')} className="h-9 flex items-center px-1 py-0.5  rounded-[5px] hover:bg-[#f2f2f2] cursor-pointer select-none	">
                                PRODUCTION
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="forms w-[100vw] mt-3 flex flex-wrap justify-evenly">

                    {/* SELECCIÓN CPU  */}
                    <div id="wrapper-cpu" className={`${isActiveCPU ? 'active' : ''} `} >
                        <span className="after:content-['*'] after:ml-0.5 after:text-red-500 ml-1 mb-1 block text-md font-light text-[#FAFAFA] select-none">
                            Choose CPU
                        </span>
                        <div id="select-button-cpu" onClick={toggleElementCPU} className=" w-[400px] h-[35px] bg-white flex items-center justify-between cursor-pointer px-5 py-0 rounded-[7px]">
                            <span ref={chooseCPURef} className="block my-2 text-md font-medium text-black select-none">
                                {/* <sup className="text-xs font-light text-[red]">*</sup> */}
                                Select an option
                            </span>
                            <span className="arrow transition-all duration-300 ease-linear select-none">↓</span>
                        </div>
                        <div className="content-cpu  invisible w-[500px] opacity-0 bg-white mt-[5px] p-2 rounded-[7px] transition-all duration-300">
                            <div className="search">
                                <label className="relative block">
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-2">
                                        <img className="h-5 w-5 fill-slate-300 select-none" src={searchImg2} />
                                    </span>
                                    <input ref={searchRefCPU} type="text" name="search-cpu" id="search-cpu" onChange={updateSearchCPU} autoComplete={'off'} className="placeholder:italic placeholder:text-slate-400 placeholder:select-none block bg-white w-full border border-slate-300 rounded-md py-2 pl-9 pr-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 text-sm" placeholder="Search for any CPU" />
                                    <span className="absolute inset-y-0 right-4 flex items-center">
                                        <img className="h-5 w-5 fill-slate-300 cursor-pointer select-none" src={closeImg} onClick={() => searchRefCPU.current.value = ''} />
                                    </span>
                                </label>
                            </div>
                            <ul className="options max-h-[150px] overflow-y-auto mt-1 mr-2">
                                {optionsCPU &&
                                    (searchedValueCPU ?
                                        (optionsCPU
                                            .filter(optCPU => optCPU.toLowerCase().includes(searchedValueCPU.toLowerCase()))
                                            .map((optCPU, index) => (
                                                <li key={index} onClick={() => updateCpu(optCPU)} className="h-9 flex items-center px-1 py-0.5 mr-2 rounded-[5px] hover:bg-[#f2f2f2] cursor-pointer select-none	">
                                                    {optCPU}
                                                </li>
                                            ))
                                        )
                                        :
                                        (
                                            optionsCPU.map((optCPU, index) => (
                                                <li key={index} onClick={() => updateCpu(optCPU)} className="h-9 flex items-center px-1 py-0.5 mr-2 rounded-[5px] hover:bg-[#f2f2f2] cursor-pointer select-none	">
                                                    {optCPU}
                                                </li>))
                                        ))
                                }
                            </ul>
                        </div>
                    </div>

                    {/*** SELECCIÓN GPU  ***/}
                    <div id="wrapper-gpu" className={`${isActiveGPU ? 'active' : ''} ml-4 `} >
                        <span className="after:content-['*'] after:ml-0.5 after:text-red-500 ml-1 mb-1 block text-md font-light text-[#FAFAFA] select-none">
                            Choose GPU
                        </span>
                        <div id="select-button-gpu" onClick={toggleElementGPU} className=" w-[400px] h-[35px] bg-white flex items-center justify-between cursor-pointer px-5 py-0 rounded-[7px]">
                            <span ref={chooseGPURef} className="block my-2 text-md font-medium text-black select-none">
                                Select an option
                            </span>
                            <span className="arrow transition-all duration-300 ease-linear select-none">↓</span>
                        </div>
                        <div className="content-gpu w-[500px] invisible opacity-0 bg-white mt-[5px] p-2 rounded-[7px] transition-all duration-300">
                            <div className="">
                                <label className="relative block">
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-2">
                                        <img className="h-5 w-5 fill-slate-300 select-none" src={searchImg2} />
                                    </span>
                                    <input ref={searchRefGPU} type="text" name="search-gpu" id="search-gpu" onChange={updateSearchGPU} autoComplete={'off'} className="placeholder:italic placeholder:text-slate-400 block bg-white w-full border border-slate-300 rounded-md py-2 pl-9 pr-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 text-sm" placeholder="Search for any GPU" />
                                    <span className="absolute inset-y-0 right-4 flex items-center">
                                        <img className="h-5 w-5 fill-slate-300 cursor-pointer select-none" src={closeImg} onClick={() => searchRefGPU.current.value = ''} />
                                    </span>
                                </label>
                            </div>
                            <ul className="options max-h-[150px] overflow-y-auto mt-1">

                                {optionsGPU &&
                                    (
                                        searchedValueGPU ? (
                                            optionsGPU
                                                .filter(optGPU => optGPU.name.toLowerCase().includes(searchedValueGPU.toLowerCase()))
                                                .map((optGPU, index) => (
                                                    <li key={index} onClick={() => updateGpu(optGPU.name)} className="h-9 flex items-center px-1 py-0.5 mr-2 rounded-[5px] hover:bg-[#f2f2f2] cursor-pointer select-none	">
                                                        {optGPU.name}
                                                    </li>
                                                ))
                                        )
                                            :
                                            (optionsGPU
                                                .map((optGPU, index) => (
                                                    <li key={index} onClick={() => updateGpu(optGPU.name)} className="h-9 flex items-center px-1 py-0.5 mr-2 rounded-[5px] hover:bg-[#f2f2f2] cursor-pointer select-none	">
                                                        {optGPU.name}
                                                    </li>
                                                )))
                                    )

                                }
                            </ul>
                        </div>
                    </div>
                </div>

                {/* SUBMIT  */}
                <div className=" w-[100vw] flex justify-center ">
                    <button onClick={handleSubmit}
                        className={`my-2 w-52  text-white bg-gradient-to-br from-purple-600 to-blue-500  hover:bg-gradient-to-bl focus:ring-2 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-lg py-4 ${selectedValueCPU == '' || selectedValueGPU == '' ? 'cursor-not-allowed' : 'cursor-pointer'}
                    `}
                    >
                        Get results
                    </button>
                </div>


                {/* LOADER */}
                {isLoading &&
                    <Loader />
                }

                {/* RESULTADOS AL ENVIAR FORM  */}
                {submittedData && !isLoading && (
                    <Table submittedData={submittedData} selectedMethod={selectedMethod} GPUScore={GPUScore} selectedTypeGPU={selectedTypeGPU} CPUScore={CPUScore} overallScore={overallScore} gamesTitles={gamesTitles} />
                )}

            </div>
        </>
    );
};
