//@ts-nocheck
import { css } from '@emotion/css'
import { Header } from '../ui/Header'
import '../index.css'
import Web3 from 'web3';

import bg from '../assets/bg.png'
// import hero from '../assets/hero-clean.png'
import heroText from '../assets/hero-text.png'
import heroTable from '../assets/table.png'
import { useAccount, useContractRead, useContractWrite, useWaitForTransaction } from "wagmi"
import { useState, useEffect } from 'react'
import { Footer, RulesModal } from '../ui'
import FDIC from '../contracts/eth/REFLECT.json';
import FarmContract from '../contracts/eth/Farm.json';
import PresaleContract from '../contracts/eth/Presale.json'



const Home = ({ }) => {
    const { address } = useAccount()

    const [addressToCheck, setAddressToCheck] = useState('')
    const [addressToLiquidate, setAddressToLiquidate] = useState('')
    const [hasChecked, setHasChecked] = useState(false)
    const [canLiquidateCheck, setCanLiquidateCheck] = useState(false)
    const [isInactiveWallet, setIsInactiveWallet] = useState(false)
    const [isWalletOverThreshold, setIsWalletOverThreshold] = useState(false)
    const [liquidateBalanceIsZero, setLiquidateBalanceIsZero] = useState(false);
    const [cantLiquidate, setCantLiquidate] = useState(false)
    const { data: liquidationThreshold } = useContractRead({
        abi: FDIC.abi,
        address: FDIC.address,
        functionName: 'liquidationThresholdTime',
        args: [],
        enabled: Boolean(address)
    })
    const { data: lastTransactionForConnected } = useContractRead({
        abi: FDIC.abi,
        address: FDIC.address,
        functionName: 'getLastTransaction',
        args: [address],
        enabled: Boolean(address),
        watch: true,
        select(data) {
            return data;
        }
    })
    const { data: lastTransactionForCheck, isError: checkError } = useContractRead({
        abi: FDIC.abi,
        address: FDIC.address,
        functionName: 'getLastTransaction',
        args: [addressToCheck],
        enabled: Boolean(address)
    })
    const { data: isExcludedCheck, isError: excludeError } = useContractRead({
        abi: FDIC.abi,
        address: FDIC.address,
        functionName: 'isExcluded',
        args: [addressToCheck],
        enabled: Boolean(address),
        select(data) {
            console.log('isExcluded', data)

        }
    })
    const { data: isExcludedLiquidate, isError: excludeLiquidateError } = useContractRead({
        abi: FDIC.abi,
        address: FDIC.address,
        functionName: 'isExcluded',
        args: [addressToLiquidate],
        enabled: Boolean(address)
    })

    const {
        data: receiptLastTransactionForCheck,
        isLoading: isLastTransactionForCheckLoading,
        isSuccess: isLastTransactionForCheckSuccess,
        isError: isLastTransactionForCheckError,
        isFetched: isLastTransactionForCheckFetched,
    } = useWaitForTransaction({ hash: lastTransactionForCheck?.hash })
    const { data: lastTransactionForLiquidate, isError: isLiquidateError } = useContractRead({
        abi: FDIC.abi,
        address: FDIC.address,
        functionName: 'getLastTransaction',
        args: [addressToLiquidate],
        enabled: Boolean(address)
    })

    const { data: fdicBalance } = useContractRead({
        abi: FDIC.abi,
        address: FDIC.address,
        functionName: 'balanceOf',
        args: [address],
        enabled: Boolean(address),
        select: (data) => {
            if (data) {
                return Web3.utils.fromWei(data.toString(), 'ether')
            }
        },
        watch: true
    })
    const { data: fdicBalanceLiquidate } = useContractRead({
        abi: FDIC.abi,
        address: FDIC.address,
        functionName: 'balanceOf',
        args: [addressToLiquidate],
        enabled: Boolean(address),
        select: (data) => {
            if (data != undefined) {
                return Web3.utils.fromWei(data.toString(), 'ether')
            }
        }
    })
    const { data: fdicPercent } = useContractRead({
        abi: FDIC.abi,
        address: FDIC.address,
        functionName: 'getFloatingPointPercentOfSupply',
        args: [address],
        enabled: Boolean(address),
        watch: true,
        select: (data) => {
            if (data != undefined) {
                if (Number(data) == 0) {
                    return '< 0.01'
                }
                return Number(data) / 100
            }
        }

    })
    const { data: fdicPercentCheck } = useContractRead({
        abi: FDIC.abi,
        address: FDIC.address,
        functionName: 'getIntegerPercentOfSupply',
        args: [addressToCheck],
        enabled: Boolean(address),
    })
    const {
        data: receiptfdicPercentCheck,
        isLoading: isfdicPercentCheckLoading,
        isSuccess: isfdicPercentCheckSuccess,
        isError: isfdicPercentCheckError,
        isFetched: isfdicPercentCheckFetched,
    } = useWaitForTransaction({ hash: fdicPercentCheck?.hash })
    const { data: fdicPercentLiquidate } = useContractRead({
        abi: FDIC.abi,
        address: FDIC.address,
        functionName: 'getIntegerPercentOfSupply',
        args: [addressToLiquidate],
        enabled: Boolean(address),
    })
    const { data: fdicPending } = useContractRead({
        abi: FarmContract.abi,
        address: FarmContract.address,
        functionName: 'pendingFdic',
        args: ['0', address],
        enabled: Boolean(address),
        select: (data) => {
            return Web3.utils.fromWei(data || '0', 'ether')
        }
    })
    const { data: amountLpStaked } = useContractRead({
        abi: FarmContract.abi,
        address: FarmContract.address,
        functionName: 'userInfo',
        args: ['0', address],
        enabled: Boolean(address),
        select: (data) => {
            const amount = data[0]
            return Web3.utils.fromWei(amount || '0', 'ether')
        }

    })
    // claim after sale is over
    const { write: handleClaim, data: claimPresale, error: claimError, isLoading: isClaimLoading, isError: isClaimError } = useContractWrite({
        abi: PresaleContract.abi,
        address: PresaleContract.address,
        functionName: 'claimTokens',
    })

    const { write: liquidateInactiveWallet, data: liquidateInactiveWalletData, error: liquidateInactiveWalletError, isLoading: isliquidateInactiveWalletLoading } = useContractWrite({
        abi: FDIC.abi,
        address: FDIC.address,
        functionName: 'liquidateInactiveWallet',
        args: [addressToLiquidate]
    })
    const { isError: isliquidateInactiveWalletError, isSuccess: isliquidateInactiveWalletSuccess } = useWaitForTransaction({ hash: liquidateInactiveWallet?.hash })

    const { write: liquidateWalletOverThreshold, data: liquidateWalletOverThresholdData, error: liquidateWalletOverThresholdError, isLoading: isliquidateWalletOverThresholdLoading } = useContractWrite({
        abi: FDIC.abi,
        address: FDIC.address,
        functionName: 'liquidateWalletOverThreshold',
        args: [addressToLiquidate]
    })
    const { isError: isliquidateWalletOverThresholdError, isSuccess: isliquidateWalletOverThresholdSuccess } = useWaitForTransaction({ hash: liquidateWalletOverThreshold?.hash })
    const formatLastTransaction = () => {
        if (!lastTransactionForConnected) {
            return;
        }

        // in seconds
        const day = 86400 * 1000
        const now = new Date()
        let lastTx = new Date(Number(lastTransactionForConnected.toString()) * 1000)

        const diff = Math.abs(lastTx.getTime() - now.getTime())
        if (day - diff <= 0) {
            return 0 + ' HOURS ' + 0 + ' MINS'
        }
        let timeLeft = Math.abs(day - diff)

        function msToTime(ms) {
            var hours = ms / (1000 * 60 * 60);
            var absoluteHours = Math.floor(hours);
            var h = absoluteHours > 9 ? absoluteHours : '0' + absoluteHours;

            //Get remainder from hours and convert to minutes
            var minutes = (hours - absoluteHours) * 60;
            var absoluteMinutes = Math.floor(minutes);
            var m = absoluteMinutes > 9 ? absoluteMinutes : '0' + absoluteMinutes;
            return h + ' HOURS ' + m + ' MINS'
        }
        const time = msToTime(timeLeft)
        return [time]

    }


    const checkIfAddressCanBeLiquidated = () => {
        if (addressToCheck.length != 42 || isLastTransactionForCheckError || isfdicPercentCheckError) {
            return;
        }
        const timeRemaining = Date.now() / 1000 - Number(lastTransactionForCheck);

        if (!liquidationThreshold) {
            return;
        }
        console.log('is excluded in check', isExcludedCheck)
        if (addressToCheck == '0x2800f24CfB260Ea4aA0f0C3C26C36ec13CDa45c0' || addressToCheck == '0xDfAC797312E8B0E60BAF0017de1a1C96B49f4505') {
            setCanLiquidateCheck(false)
            setHasChecked(true)
            return;
        }
        let isInactive = false
        let isOverThreshold = false
        if (timeRemaining >= liquidationThreshold) {
            console.log('inactive')
            isInactive = true;
        }
        if (Number(fdicPercentCheck) >= 1) {

            isOverThreshold = true
        }
        setCanLiquidateCheck(isInactive || isOverThreshold);
        console.log('canLiquidateCheck', canLiquidateCheck)
        setHasChecked(true);
    }

    function checkIfLiquidateCanBeLiquidated() {
        setCantLiquidate(false)
        // accounts for slight integer division errors in liquidation, 
        // if their balance is less than 1 FDIC
        if (Number(fdicBalanceLiquidate) <= 1) {
            setLiquidateBalanceIsZero(true);
            return 0;
        }
        if (addressToLiquidate == '0x2800f24CfB260Ea4aA0f0C3C26C36ec13CDa45c0' || addressToLiquidate == '0xDfAC797312E8B0E60BAF0017de1a1C96B49f4505') {
            setCantLiquidate(true)
            return -1;
        }
        const timeRemaining = Date.now() / 1000 - Number(lastTransactionForLiquidate)
        if (timeRemaining >= liquidationThreshold) {
            setLiquidateBalanceIsZero(false);
            return 1;
        }
        else if (Number(fdicPercentLiquidate) >= 1) {
            setLiquidateBalanceIsZero(false);
            return 2;
        }
        else {
            setCantLiquidate(true)
            return -1;
        }
    }
    function onClickLiquidate() {
        const functionCall = checkIfLiquidateCanBeLiquidated();
        if (functionCall == 0) {
            setLiquidateBalanceIsZero(true);
        }
        if (functionCall == 1) {
            liquidateInactiveWallet()
        }
        else if (functionCall == 2) {
            liquidateWalletOverThreshold();
        } else {
        }
    }

    function updateAndCheckLiquidate(e) {
        setAddressToLiquidate(e.target.value)

    }
    const renderCheckButton = () => {

        return (<div className={css`
        cursor: pointer;
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 20%;  
        border: 1px green solid;
        border-radius: 10px;
        background-color: black;
        color: green;
        padding: 4px;
        &:hover {
            border-color: white;
            color: white;
        }
   `}>
            <p onClick={checkIfAddressCanBeLiquidated} className={css`margin: 0px;`}>Check</p>
        </div>)
    }

    const renderLiquidateButton = () => {
        if (isliquidateInactiveWalletLoading || isliquidateWalletOverThresholdLoading) {
            return (<div className={buttonStyle}>
                <p className={css`margin: 0px;`}>Loading...</p>

            </div>)
        } else {
            return (<div className={buttonStyle}>
                <p onClick={onClickLiquidate} className={css`margin: 0px;`}>Liquidate</p>

            </div>)
        }
    }


    return (
        <div className={css`
            background-image: url(${bg});
            min-height: 100%;
            background-size: cover;
            background-repeat: no-repeat;
            margin: none;
        `}>

            <Header />

            {/* Poster */}
            <div className={css`
                display: flex;
                flex-direction: column;
                align-items: center;

                margin-left: auto;
                margin-right: auto;
                min-height: 100vh;
                max-width: 69vw;
                background-color: rgba(255,255,255,0.9);
                font-family: TourneyBoldItalic;
                font-size: 2rem;
                padding: 16px;
                
            `}>
                {/* <h1 className={css`
                    cursor: pointer;

                    &:hover {
                        color: blue;
                        text-decoration: underline;
                    }
                `} onClick={() => window.location.pathname = '/presale'}>CLAIM PRESALE</h1> */}
                <div id='hero' className={css`
                    position: relative;
                `}>
                    <img /*src={hero}*/ src={window.location.origin + '/hero-clean.png'} className={css`
                    
                        height: 30vw; max-width: auto;
                        @media(max-width: 800px) {
                            height: 50vw;
                        }
                    `} alt='hero.png' />
                    <div className={css`
                        position: absolute;
                        color: green;
                        bottom: 14.5%;
                        left: 29%;
                        background-color: black;
                        font-size: 2.2vw;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        @media(max-width: 800px) {
                            left: 27%;
                            font-size: 4vw;
                        }
                        @media(max-width: 400px) {
                        }
                    `}>
                        <p className={css`margin:0px;`}>DASHBOARD</p>
                    </div>
                </div>
                <div className={css`
                        margin-top: 3vw;
                        margin-bottom: 3vw;
                        min-width: 60vw;
                        max-width: 60vw;
                        color: green;
                        background-color: green;
                        font-size: 1.415vw;
                        border-radius: 15px;
                        @media(max-width: 800px) {
                            max-width: 80vw;
                            font-size: 2.5vw;
                        }
                    `}>
                    <div className={css`
                            width: 100%;
                            border-radius: 5px;
                            display: grid;
                            grid-template-columns: repeat(2, 1fr);
                            
                            grid-gap: 1px;
                            & > div {
                                background-color: black;
                                padding: 1vw;
                            }
                            >:nth-child(1) {
                                border-radius: 15px 0px 0px 0px;
                            }
                            >:nth-child(2) {
                                border-radius: 0px 15px 0px 0px;
                            }
                            >:nth-child(5) {
                                border-radius: 0px 0px 0px 15px;
                            }
                            >:nth-child(6) {
                                border-radius: 0px 0px 15px 0px;
                            }

                            @media(max-width: 800px){
                                & > div {
                                    padding: 4vw;
                                }
                                grid-template-columns: repeat(1, 1fr);
                                >:nth-child(1) {
                                    border-radius: 15px 15px 0px 0px;
                                }
                                >:nth-child(2) {
                                    border-radius: 0px 0px 0px 0px;
                                }
                                >:nth-child(5) {
                                    border-radius: 0px 0px 0px 0px;
                                }
  
                                >:nth-child(6) {
                                    border-radius: 0px 0px 15px 15px;
                                }
                            }
                            
                        `
                    }>
                        <div>$FDIC Balance: {fdicBalance ? Number(fdicBalance).toFixed(2) : "0.00"}</div>
                        <div>Percent Owned of Total Supply: {fdicPercent ? Number(fdicPercent) == 0 ? "< 1%" : fdicPercent + "%" : "0%"}</div>
                        <div>Time Left Until Liquidation: {formatLastTransaction()}</div>
                        <div>$FDIC Reward from Staking: {amountLpStaked != 0 ? fdicPending : 0} </div>
                        <div>
                            <p>Check if wallet can be liquidated</p>
                            <div className={css`
                                display: flex;
                                flex-direction: row;
                                
                            `}>
                                <input type='text' placeholder='0x' value={addressToCheck} onChange={(e) => setAddressToCheck(e.target.value)} className={css`
                                    flex: 2;
                                    font-size: 90%;
                                    outline: none;
                                    border: 1px green solid;
                                    border-radius: 10px;
                                    background-color: black;
                                    color: green;
                                    margin-right: .5vw;
                                `} />
                                {renderCheckButton()}

                            </div>
                            {hasChecked ?

                                <div className={css`
                                color: green;
                                `}>
                                    {canLiquidateCheck ? <p>Yes!</p> : <p>No!</p>}
                                </div>
                                :
                                <div></div>
                            }
                        </div>
                        <div>
                            <p>Liquidate Wallet</p>
                            <div className={css`
                                display: flex;
                                flex-direction: row;
                                
                            `}>
                                <input type='text' placeholder='0x' value={addressToLiquidate} onChange={e => updateAndCheckLiquidate(e)} className={css`
                                    flex: 2;
                                    font-size: 90%;
                                    outline: none;
                                    border: 1px green solid;
                                    border-radius: 10px;
                                    background-color: black;
                                    color: green;
                                    margin-right: .5vw;
                                `} />
                                {renderLiquidateButton()}

                            </div>

                            <div className={css`
                                    color: green;
                                `}>
                                {liquidateBalanceIsZero ? <p>Balance of target account is 0</p> : <p></p>}
                                {cantLiquidate ? <p>Cannot liquidate account</p> : <p></p>}
                            </div>
                            <div></div>
                        </div>
                    </div>
                </div>
                <RulesModal />

                <h1 className={css`
                    cursor: pointer;
                    color: black;
                    font-size: 5vw;
                    &:hover {
                        color: blue;
                        text-decoration: underline;
                    }
                `} onClick={handleClaim}>CLAIM PRESALE</h1>
                {isClaimError ? <p>Connected account has no more tokens left to claim</p> : <p></p>}

            </div>
            <Footer />
        </div>
    )
}
const buttonStyle = css`
flex: 1;
cursor: pointer;
display: flex;
flex-direction: column;
align-items: center;
width: 20%;  
border: 1px green solid;
border-radius: 8px;
background-color: black;
color: green;
padding: 4px;
&:hover {
    border-color: white;
    color: white;
}
`
export { Home }