import { css } from "@emotion/css"

import { Header } from "../ui"
import bg from '../assets/bg.png'
import gameboy from '../assets/gameboy.png'
import FDIC from '../contracts/eth/REFLECT.json';

import { useAccount, useContractRead, useContractWrite, useWaitForTransaction } from "wagmi"
import Web3 from "web3";
import { useEffect } from "react";
import useWindowDimensions from "../hooks/useWindowDimension";


const Game = () => {
    const { address, isConnected } = useAccount()
    const { height, width } = useWindowDimensions();

    const { write: approveForGame, data: gameData, error, isLoading, isError, isSuccess } = useContractWrite({
        abi: FDIC.abi,
        address: FDIC.address,
        functionName: 'approve',
        args: [address, Web3.utils.toWei('1', 'ether')],
        onSuccess: () => console.log('yessirrrrrr')

    })

    const {
        data: receipt,
        isLoading: isApproveLoading,
        isSuccess: isApproveSuccess,
        isError: isApproveApproveError,
    } = useWaitForTransaction({ hash: gameData?.hash })

    const { data: lastTransaction } = useContractRead({
        abi: FDIC.abi,
        address: FDIC.address,
        functionName: 'getLastTransaction',
        args: [address],
        enabled: Boolean(address)
    })
    console.log('TX', lastTransaction?.toString())

    const onGameboy = async () => {
        await approveForGame()


    }

    const formatLastTransaction = () => {
        if (!lastTransaction) return ''

        // in seconds
        const day = 86400 * 1000
        const now = new Date()
        let lastTx = new Date(Number(lastTransaction.toString()) * 1000)
        // let diff = Math.abs(lastTx.getTime() - now.getTime())
        
        // const msLeft = lastTx.getTime() - day
        // diff -= day - 
        const diff = Math.abs(lastTx.getTime() - now.getTime())
        if(day-diff <= 0) {
            return 0 + ' HOURS ' + 0 + ' MINS'
        }
        let timeLeft = Math.abs(day - diff)
    
        
        console.log(now.getTime(), lastTx.getTime())
        console.log(now.getTime() - lastTx.getTime())

        function msToTime(ms) {
            console.log(ms)
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
        return time

    }

    useEffect(() => {
        console.log('SUCCESS', isSuccess, isLoading)
        if (width < 500) {}
        else if (isSuccess) {
            setTimeout(() => {
                window.location.pathname = '/goldmansachs.html'
            }, 5000);
        }
    }, [isSuccess])

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
            font-size: 1.6vw;
            
        `}>     
                {
                    width >= 500?
                    <div className={css` display: flex;
                    flex-direction: column;
                    align-items: center;`}>
                        {lastTransaction? <p style={{ marginBottom: 16, paddingLeft: 32, paddingRight: 32 }}>CLICK GAMEBOY TO BURN DOWN GOLDMAN SACHS BEFORE THEY LIQUIDATE YOU. YOU HAVE {formatLastTransaction()}</p> :
                        <p style={{ marginBottom: 16,paddingLeft: 32, paddingRight: 32 }}>CLICK GAMEBOY TO BURN DOWN GOLDMAN SACHS BEFORE THEY LIQUIDATE YOU</p>}
                        
      
    
                            <img onClick={onGameboy} src={gameboy} className={css`
                                height: 50vw;
                                max-width: auto; 
                                cursor: pointer; 
            
                                &:hover {
                                    opacity: 0.5;
                                }
                            `} />
                            <p style={{fontSize: '0.5rem'}}>*PARODY</p>
                    </div> :

                    <div className={css`display: flex; flex-direction: column; justify-content: center; align-items: center; font-size: 4vw; padding: 5vw;`}>
                        <p className={css`margin: 0px;`}>Refresh Liquidation Timer for</p>
                        <p className={css`margin-top: 0px;`}>Connected Wallet</p>
                        <div className={buttonStyle} onClick={approveForGame}>
                                Refresh Wallet Timer
                        </div>
                    </div>
                }

            </div>
        </div>
    )
}

const buttonStyle = css`
margin-top: 5vw;
cursor: pointer;
display: flex;
flex-direction: column;
align-items: center;
justify-content: center;
width: 60%;
height: 4vw;  
border: 1px green solid;
border-radius: 8px;
background-color: black;
color: green;
padding: 4px;
font-size: 2vw;
&:hover {
    border-color: white;
    color: white;
}
`

export { Game }