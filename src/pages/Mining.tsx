import { css } from '@emotion/css'
import { useState } from 'react'
import { Header } from '../ui/Header'
import { Footer } from '../ui'
import '../index.css'
import Web3 from 'web3';

import bg from '../assets/bg.png'
import hero from '../assets/scales.png'
import heroText from '../assets/scale-sub.png'
import { useAccount, useConnect, useContractRead, useContractWrite, useWaitForTransaction } from 'wagmi'

import UniswapV2Pair from '../contracts/eth/UniswapV2Pair.json';
// import MiningContract from '../contracts/eth/Mining.json';
import FarmContract from '../contracts/eth/Farm.json';
import { FDICBalance } from '../components';
import FDIC from '../contracts/eth/REFLECT.json';
// import { useVesting } from '../hooks/useVesting';

const Mining = ({ }) => {
    const { address } = useAccount()
    const [amount, setAmount] = useState('')
    const [amountToWithdraw, setAmountToWithdraw] = useState('')
    // const { schedule, amount: amountVesting, amountToClaim } = useVesting()
    // console.log('SCHEDULE', schedule, amountVesting, amountToClaim)
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
    const { data: fdicWethBalance } = useContractRead({
        abi: UniswapV2Pair.abi,
        address: UniswapV2Pair.address,
        functionName: 'balanceOf',
        args: [address],
        enabled: Boolean(address),
        watch: true,
        select: (data) => {
            console.log('DATA HERE', data)
            // setAmount(Web3.utils.fromWei(data.toString(), 'ether'))
            if (data) {
                return Web3.utils.fromWei(data.toString(), 'ether')
            }
        }
    })
    const { data: fdicWethBalanceOfPool } = useContractRead({
        abi: UniswapV2Pair.abi,
        address: UniswapV2Pair.address,
        functionName: 'balanceOf',
        args: [FarmContract.address],
        enabled: Boolean(address),
        watch: true,
        select: (data) => {
            console.log('DATA HERE', data)
            // setAmount(Web3.utils.fromWei(data.toString(), 'ether'))
            if (data) {
                return Web3.utils.fromWei(data.toString(), 'ether')
            }
        }
    })

    const { data: amountLpStaked } = useContractRead({
        abi: FarmContract.abi,
        address: FarmContract.address,
        functionName: 'userInfo',
        args: ['0', address],
        enabled: Boolean(address),
        watch: true,
        select: (data) => {
            const amount = data[0]
            return Web3.utils.fromWei(amount || '0', 'ether')
        }

    })
    
    console.log('USER INFO', amountLpStaked)

    // MINING -----------------------------------
    const { write: depositToFarm, data: miningData, error, isLoading, isError } = useContractWrite({
        abi: FarmContract.abi,
        address: FarmContract.address,
        functionName: 'deposit',
        args: ['0', Web3.utils.toWei(amount, 'ether')]

    })
    const {
        data: receipt,
        isLoading: isMiningLoading,
        isSuccess: isMiningSuccess,
        isError: isMiningApproveError
    } = useWaitForTransaction({ hash: miningData?.hash })

    const { write: withdraw, data: withdrawData } = useContractWrite({
        abi: FarmContract.abi,
        address: FarmContract.address,
        functionName: 'withdraw',
        args: ['0', Web3.utils.toWei(amountToWithdraw, 'ether')]

    })
    const {
        data: withdrawReceipt,
        isLoading: isWithdrawLoading,
        isSuccess: isWithdrawSuccess,
        isError: isWithdrawApproveError
    } = useWaitForTransaction({ hash: withdrawData?.hash })


    // APPROVE -----------------------------------
    const { write: approveFarm, data: approveData } = useContractWrite({
        abi: UniswapV2Pair.abi,
        address: UniswapV2Pair.address,
        functionName: 'approve',
        // from: address,
        args: [FarmContract.address, Web3.utils.toWei(amount, 'ether')]

    })
    const {
        data: receiptApprove,
        isLoading: isApproveLoading,
        isSuccess: isApproveSuccess,
        isError: isApproveError,
        isFetched: isApproveFetched,
    } = useWaitForTransaction({ hash: approveData?.hash })

    const { data: dino, isError: dinoError, error: dError } = useContractRead({
        abi: FarmContract.abi,
        address: FarmContract.address,
        functionName: 'FDIC',
        args: [],
        enabled: Boolean(address),
    })
    console.log('DINO', dino, dinoError, dError)

    const { data: fdicPending } = useContractRead({
        abi: FarmContract.abi,
        address: FarmContract.address,
        functionName: 'pendingFdic',
        args: ['0', address],
        enabled: Boolean(address),
        watch: true,
        select: (data) => {
            return Web3.utils.fromWei(data || '0', 'ether')
        }
    })
    console.log(fdicPending)

    const renderStakeButton = () => {
        if (isApproveLoading || isMiningLoading) {
            return <div className={buttonStyle}><p className={css`margin: .5vw;`}>Loading...</p></div>
        }
        if (isApproveSuccess) {
            return (<div className={buttonStyle}><p className={css`margin: .5vw;`} onClick={depositToFarm}>STAKE LP</p> </div>)
        }
        return (<div className={buttonStyle}>
            <p className={css`margin: .5vw;`} onClick={approveFarm}>APPROVE </p>
            <p className={css`font-size:  50%;`}>(then stake)</p>
        </div>)

    }
    const renderUnstakeButton = () => {
        if (isWithdrawLoading) {
            return <div className={buttonStyle}><p className={css`margin: .5vw;`}>Loading...</p></div>
        }
        return (<div className={buttonStyle}>
            <p className={css`margin: .5vw;`} onClick={withdraw}>UNSTAKE LP</p>
        </div>)

    }
    const setMax = () => {
        if (fdicWethBalance) {

            setAmount(Number(fdicWethBalance).toFixed(2).toString())
        } else {
            setAmount('0')
        }

    }
    const setMaxWithdraw = () => {
        if (fdicWethBalance) {
            setAmountToWithdraw(Number(amountLpStaked).toFixed(2).toString())
        } else {
            setAmountToWithdraw('0')
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
                position: relative;
                margin-left: auto;
                margin-right: auto;
                min-height: 100vh;
                max-width: 69vw;
                background-color: rgba(255,255,255,0.9);
                font-family: TourneyBoldItalic;
                font-size: 2rem;
                padding: 4vw;
                // display: relative;
            `}>
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
                        left: 35%;
                        background-color: black;
                        font-size: 2.2vw;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        @media(max-width: 800px) {
                            left: 33%;
                            font-size: 4vw;
                        }
                        @media(max-width: 400px) {
                        }
                    `}>
                        <p className={css`margin:0px;`}>STAKING</p>
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
                            grid-template-columns: repeat(3, 1fr);
                            
                            grid-gap: 1px;
                            & > div {
                                background-color: black;
                                padding: 2vw;
                            }
                            >:nth-child(1) {
                                border-radius: 15px 15px 0px 0px;
                                grid-column: span 3;
                            }
                            >:nth-child(2) {
                                grid-column: span 3;
                            }
                            >:nth-child(3) {
                                border-radius: 0px 0px 0px 15px;
                            }
                            >:nth-child(5) {
                                border-radius: 0px 0px 15px 0px;
                            }

                            @media(max-width: 800px){
                                & > div {
                                    padding: 4vw;
                                }
                            }
                            
                        `
                    }>
                        <div className={css`
                                display: flex;
                                flex-direction: row;
                                justify-content: space-between;
                                input::-webkit-outer-spin-button,
                                input::-webkit-inner-spin-button {
                                -webkit-appearance: none;
                                margin: 0;
                                }
                                input[type=number] {
                                    -moz-appearance: textfield;
                                  }
                        `}>
                            <div className={css`
                                    flex: 1;
                                    color: green;
                                    margin-right: .5vw;
                                    display: flex;
                                    flex-direction: row;
                                    align-items: center;
                                    justify-content: space-between;
                                    padding-left: .8vw;
                                    padding-right: .8vw;
                                    border: 1px green solid;
                                    border-radius: 10px;
                            `}>

                                <input type={'number'} placeholder={fdicWethBalance ? fdicWethBalance.toString() : '0'} value={amount} onChange={(e) => setAmount(e.target.value)} className={css`
                                 outline: none;
                                 border: none;
                                 border-radius: 10px;
                                 background-color: black;
                                 color: green;
                                 font-size: 80%;
                                 ::placeholder {
                                    color: gray;
                                 }
                                 margin: 0px;
                                `} />
                                <p className={css`margin: 0px; font-size: 80%`} onClick={setMax}>Max</p>
                            </div>
                            {renderStakeButton()}
                        </div>
                        <div className={css`
                                display: flex;
                                flex-direction: row;
                                justify-content: space-between;
                                input::-webkit-outer-spin-button,
                                input::-webkit-inner-spin-button {
                                -webkit-appearance: none;
                                margin: 0;
                                }
                                input[type=number] {
                                    -moz-appearance: textfield;
                                  }
                        `}>
                            <div className={css`
                                    flex: 1;
                                    color: green;
                                    margin-right: .5vw;
                                    display: flex;
                                    flex-direction: row;
                                    align-items: center;
                                    justify-content: space-between;
                                    padding-left: .8vw;
                                    padding-right: .8vw;
                                    border: 1px green solid;
                                    border-radius: 10px;
                            `}>

                                <input type={'number'} placeholder={amountLpStaked ? amountLpStaked.toString() : '0'} value={amountToWithdraw} onChange={(e) => setAmountToWithdraw(e.target.value)} className={css`
                                 outline: none;
                                 border: none;
                                 border-radius: 10px;
                                 background-color: black;
                                 color: green;
                                 font-size: 80%;
                                 ::placeholder {
                                    color: gray;
                                 }
                                 margin: 0px;
                                `} />
                                <p className={css`margin: 0px; font-size: 80%`} onClick={setMaxWithdraw}>Max</p>
                            </div>
                            {renderUnstakeButton()}
                        </div>
                        <div>Amount LP Staked: {amountLpStaked? Number(amountLpStaked).toFixed(2) : '0'}</div>
                        <div>Percent of Pool: {amountLpStaked? Number(Number(amountLpStaked)/Number(fdicWethBalanceOfPool)*100).toFixed(2)+"%": '0%'}</div>
                        <div>Earned $FDIC Rewards: {amountLpStaked? Number(fdicPending).toFixed(2): '0'}</div>
                    </div>
                </div>
                <div className={css`
                cursor: pointer;
                border: 1px solid black;
                border-radius: 15px;
                background-color: black;
                color: green;
                padding-left: 4vw;
                padding-right: 4vw;
                padding-top: 1vw;
                padding-bottom: 1vw;
                margin-bottom: 4vw;
                font-size: 4vw;
                &:hover {
                    background-color: green;
                    color: white;
                }`}
                onClick={() => window.open('https://app.uniswap.org/#/add/v2/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/0xE1EF0cBa666e4BAcbBB666E9aE7978CC22BD23F6')}>
                    ADD LP
                </div>
            </div>
            <Footer />
        </div>
    )
}
const buttonStyle = css`
flex: 1;
cursor: pointer;
display: flex;
flex-direction: row;
align-items: center;
justify-content: center;
max-width: 27%;  
border: 1px green solid;
border-radius: 8px;
background-color: black;
color: green;
padding: 4px;
margin-left: 2vw;
&:hover {
    border-color: white;
    color: white;
}
`
export { Mining }