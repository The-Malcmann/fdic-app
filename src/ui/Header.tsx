import { css } from "@emotion/css"
import { Web3Button } from "@web3modal/react";
import { useAccount, useConnect, useContractRead, useContractWrite, useWaitForTransaction } from "wagmi";
import { InjectedConnector } from 'wagmi/connectors/injected'
import '../index.css'

import square from '../assets/circle-square.png';
import stock from '../assets/circle-stock.png';
import swirl from '../assets/circle-swirl.png';
import flag from '../assets/circle-flag.png';
import tv from '../assets/circle-tv.png';

import FDIC from '../contracts/eth/REFLECT.json';
import { useEffect } from "react";
import useWindowDimensions from "../hooks/useWindowDimension";

const Header = () => {
    const { address, isConnected } = useAccount()
    const { height, width } = useWindowDimensions();
    const { connect } = useConnect({
        connector: new InjectedConnector(),
    })

    const handleConnect = async () => {

    }

    function onHome() {
        window.location.pathname = '/';
    }

    // const { write: approveForGame, data: gameData, error, isLoading, isError, isSuccess } = useContractWrite({
    //     abi: FDIC.abi,
    //     address: FDIC.address,
    //     functionName: 'approve',
    //     args: [address, '10000'],
    //     onSuccess: () => console.log('yessirrrrrr')

    // })
    // console.log(gameData)
    // const {
    //     data: receipt,
    //     isLoading: isApproveLoading,
    //     isSuccess: isApproveSuccess,
    //     isError: isApproveApproveError,
    // } = useWaitForTransaction({ hash: gameData?.hash })

    // useEffect(() => {
    //     console.log('SUCCESS', isSuccess, isLoading)

    //     if(isSuccess) {
    //         setTimeout(() => {
    //             window.location.pathname = '/game.html'
    //         }, 5000);
    //     }
    // }, [isSuccess])

    const handleGame = async () => {
        // await approveForGame()

        // console.log(isLoading, isSuccess, isApproveLoading, isApproveSuccess)
    }

    return (
        <div className={css`
        display: flex;    
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        height: 160px;
        width: 100%;
        background-color: rgba(255,255,255,0.9);
        font-family: TourneyBoldItalic;
        text-align: center;

            div {
                cursor: pointer;
            }


            
            @media(max-width: 734px) {
                justify-content: space-evenly;
                .nav {
                    margin-top: 75px;
                }
                div {
                    padding: 0px;
                    h1 {
                        font-size: 1.5rem;
                    }
                    img {
                        height: 40px;
                    }
                    p {
                        font-size:.75rem;
                    }
                }
            }

            @media(max-width: 440px) {
                justify-content: space-evenly;
                .nav {
                    margin-top: 60px;
                }
                height: 130px;
                div {
                    padding-left: 0px;
                    h1 {
                        font-size: 1rem;
                    }
                    img {
                        height: 36px;
                    }
                    p {
                        font-size: .6rem;
                    }
                }
            }
        `}>

            <div className={css`padding-left: 32px;`} onClick={onHome} >
                <img />
                <h1 className={css`font-size: 2.5rem;`}>$FDIC</h1>
            </div>

            {/* <div className={css`
                display: flex;
                flex: 1;
                flex-direction: row;
            `}> */}

            {/* <div onClick={() => window.location.pathname = '/game.html'}> */}
            <div onClick={() => window.location.pathname = '/game'} className='nav'>
                <img src={flag} height='80px' />
                <p>REFRESH</p>
            </div>
            <div onClick={() => window.location.pathname = '/mining'} className='nav'>
                <img src={tv} height='80px' />
                <p>MINING</p>
            </div>
            <div onClick={() => window.open('https://etherscan.io/token/0xE1EF0cBa666e4BAcbBB666E9aE7978CC22BD23F6', '_blank')} className='nav'>
                <img src={square} height='80px' />
                <p>CONTRACT</p>
            </div>
            <div onClick={() => { width <= 500 ? window.open('https://app.uniswap.org/#/swap?&inputCurrency=ETH&outputCurrency=0xE1EF0cBa666e4BAcbBB666E9aE7978CC22BD23F6') : window.open('https://app.uniswap.org/#/swap?&inputCurrency=ETH&outputCurrency=0xE1EF0cBa666e4BAcbBB666E9aE7978CC22BD23F6', '_blank') }} className='nav'>
                <img src={stock} height='80px' />
                <p>SWAP</p>
            </div>
            <div onClick={() => { width <= 500 ? window.open('https://app.uniswap.org/add/v2/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/0xE1EF0cBa666e4BAcbBB666E9aE7978CC22BD23F6') : window.open('https://app.uniswap.org/add/v2/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/0xE1EF0cBa666e4BAcbBB666E9aE7978CC22BD23F6', '_blank') }} className='nav'>
                <img src={swirl} height='80px' />
                <p>LIQUIDITY</p>
            </div>

            <div style={{ paddingRight: 32 }} className={css`
                @media(max-width: 734px) {
                    position: absolute;
                    top: 20px;
                    left: ${width / 2 - 135.2 / 2}px;
                }
                @media(max-width: 440px) {
                    position: absolute;
                    top: 12px;
                }

            `}>

                <Web3Button icon="hide" />
            </div>
            {/* <div style={{ paddingRight: 32, cursor: 'pointer' }} onClick={connect}>
                <img src={tv} height='100px' />
                <p>Connect Wallet</p>
            </div> */}
            {/* </div> */}

        </div>
    )
}

export { Header }