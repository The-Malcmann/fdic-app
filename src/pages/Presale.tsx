import { css } from '@emotion/css'
import { Header } from '../ui/Header'
import '../index.css'

import bg from '../assets/bg.png'
import hero from '../assets/hero.png'
import heroText from '../assets/hero-text.png'
import heroTable from '../assets/table.png'
import { useAccount, useConnect, useContractRead, useContractWrite, useWaitForTransaction } from 'wagmi'
import { useEffect, useState } from 'react'
import Web3 from 'web3'
import PresaleContract from '../contracts/eth/Presale.json'
import FDIC from '../contracts/eth/REFLECT.json'
import { Footer } from '../ui'

const Presale = ({ }) => {
    const { address } = useAccount()

    const [amountToBuy, setAmountToBuy] = useState('0')
    // const [amountEthForTokens, setAmountEthForTokens] = useState('')
    // READ
    // is presale live
    const { data: isPresaleActive } = useContractRead({
        abi: PresaleContract.abi,
        address: PresaleContract.address,
        functionName: 'isPresaleActive',
    })

    const { data: fdicBalance } = useContractRead({
        abi: FDIC.abi,
        address: FDIC.address,
        functionName: 'balanceOf',
        args: [address],
        enabled: Boolean(address),
        select: (data) => {
            console.log('DATA HERE', data)
            // setAmount(Web3.utils.fromWei(data.toString(), 'ether'))
            if (data) {
                return Web3.utils.fromWei(data.toString(), 'ether')
            }
        }
    })
    
    // get eth for tokens
    const { data: ethFromTokens } = useContractRead({
        abi: PresaleContract.abi,
        address: PresaleContract.address,
        functionName: 'getEthFromTokens',
        args: [Web3.utils.toWei(amountToBuy || '0', 'ether')],
        enabled: Boolean(amountToBuy > 0),
        select: (data) => {
            console.log('ETH FOR TOKENS', data)
            if(data) {
                return Web3.utils.fromWei(data || '0', 'ether')
            }
        }
    })
    // claim after sale is over
    const { write: handleClaim, data: claimPresale, error: claimError, isLoading: isClaimLoading, isError: isClaimError } = useContractWrite({
        abi: PresaleContract.abi,
        address: PresaleContract.address,
        functionName: 'claimTokens',
    })
    const {
        data: receipt,
        isLoading: isPending,
        isSuccess,
    } = useWaitForTransaction({ hash: claimPresale?.hash })
    
    const { write: handleBuy, data: buyData, error: buyError, isLoading: isBuyLoading, isError: isBuyError } = useContractWrite({
        abi: PresaleContract.abi,
        address: PresaleContract.address,
        functionName: 'buyTokens',
        args: [address],
        value: Web3.utils.toWei(ethFromTokens || '0', 'ether'),
        gas: 200000
    })
    const {
        data: buyReceipt,
        isLoading: isBuyPending,
        isSuccess: isBuySuccess,
    } = useWaitForTransaction({ hash: buyData?.hash })

    useEffect(() => {
        if(fdicBalance != setAmountToBuy) {
            console.log('FDIC IN EFF', fdicBalance)
            setAmountToBuy(fdicBalance)
        }
    }, [fdicBalance])

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
            `}>

                {/* <p>{address}</p> */}

                <div id='hero-text' className={css` 
                    margin-top: 32px;
                    position: relative;
                `}>
                    <img id='hero-text-blurb' src={heroText} className={css`height: 30vw; max-width: auto;`} alt='hero.png' />
                    <div className={css`
                        position: absolute;
                        font-size: 1rem;
                        top: 32px;
                        left: 64px;
                        right: 64px;
                        line-height: 1.5rem;

                        @media(min-width: 300px) {
                            top: 16px;
                            left: 32px;
                            right: 32px;
                            font-size: 0.5rem;
                            line-height: 1rem;
                        }
                        
                        @media(min-width: 600px) {
                            left: 64px;
                            right: 64px;
                            font-size: 1.5rem;
                            line-height: 1.5rem;
                        }
                        
                        @media(min-width: 1400px) {
                            left: 64px;
                            right: 64px;
                            font-size: 2rem;
                            line-height: 2rem;
                        }
                    `}>
                        <p className={css`
                        
                        `}>You have been given the opportunity to double your airdrop tokens by participating in the presale. Do you accept?</p>
                    </div>
                </div>
                <div id='hero-text' className={css` 
                    margin-top: 32px;
                    position: relative;
                `}>
                    <img id='hero-text-blurb' src={heroTable} className={css`
                    height: 40vw; max-width: auto;
                    @media(max-width: 600px) {
                        height: 50vw;
                    }
                    `} alt='hero.png' />
                    <div className={css`
                        width: 100%;
                        position: absolute;
                        font-size: 0.7rem;
                        top: 16px;
                        left: 0px;
                        padding-left: 64px;
                        right: 64px;
                        line-height: 1.5rem;
                        display: relative;

                        @media(min-width: 300px) {
                            top: 8px;
                            // margin-top: 8px;
                            left: 0px;
                            padding-left: 8px;
                            font-size: 0.5rem;
                            line-height: 1rem;
                        }
                        
                        @media(min-width: 600px) {
                            top: 16px;
                            left: 0px;
                            padding-left: 24px;
                            font-size: 0.7rem;
                            line-height: 1rem;
                        }
                        
                        @media(min-width: 900px) {
                            top: 20px;
                            left: 0px;
                            padding-left: 80px;
                            font-size: 1rem;
                            line-height: 1rem;
                        }
                       
                        @media(min-width: 1100px) {
                            top: 28px;
                            left: 0px;
                            padding-left: 80px;
                            font-size: 1rem;
                            line-height: 1rem;
                        }

                        @media(min-width: 1440px) {
                            top: 28px;
                            font-size: 1.5rem;
                            line-height: 1.5rem;
                            left: 0px;
                            padding-left: 80px;
                        }

                    `}>
                        {/* <p>PRESALE Oct. 20th, 8:00 EST</p> */}
                        {/* <p>PRICE: 1 $FDIC == 0.00001 $WETH</p> */}

                        <div className={css`
                            position: absolute;
                            // background-color: green;
                            // width: calc(100%;
                            
                            display: flex;
                            flex-direction: column;

                            @media(min-width: 300px) {
                                width: 80%;
                                top: 64px;
                                p {
                                    font-size: 0.8rem;
                                }
                                input {
                                    font-size: 0.5rem;
                                }
                                label {
                                    font-size: 0.5rem;
                                }
                            }
                            
                            @media(min-width: 600px) {
                                width: 70%;
                                top: 100px;
                                p {
                                    font-size: 1rem;
                                }
                                input {
                                    font-size: 1rem;
                                }
                                label {
                                    font-size: 0.8rem;
                                }
                            }

                            @media(min-width: 900px) {
                                width: 55%;
                                top: 100px;
                                p {
                                    font-size: 1rem;
                                }
                                input {
                                    font-size: 1rem;
                                }
                            }
                            
                            @media(min-width: 1100px) {
                                width: 70%;
                                top: 140px;
                                p {
                                    font-size: 1.5rem;
                                }
                                input {
                                    font-size: 1.5rem;
                                }
                            }
                            
                            @media(min-width: 1440px) {
                                width: 70%;
                                top: 200px;
                                p {
                                    font-size: 2rem;
                                }
                                input {
                                    font-size: 2rem;
                                }
                            }
                        `}>
                            <div className={css`
                             display: flex;
                             flex-direction: row;
                             justify-content: space-between;
                             font-size: 1rem;

                             @media(max-width: 440px) {
                                font-size: 1rem;
                                flex-direction: column;
                                align-items: flex-end;
                             }
                            `}>
                                <div style={{ flexDirection: 'column' }}>
                                    <label>Double your airdropped $FDIC</label>
                                    <input className={css`
                                        font-family: TourneyBoldItalic;
                                        text-align: right;
                                `} placeholder={fdicBalance} max={fdicBalance as number} value={amountToBuy} type='number' onChange={(e) => setAmountToBuy(e.target.value)} />
                                </div>
                                <p className={css`
                                cursor: pointer;
                                    &:hover {
                                        opacity: 0.5;
                                    }
                                `} onClick={handleBuy}>BUY</p>
                            </div>

                            <div className={css`
                                 @media(min-width: 300px) {
                                    p {
                                        font-size: 0.5rem;
                                    }
                                    #claim {
                                        font-size: 1rem;
                                    }
                                }
                                
                                @media(min-width: 600px) {
                                    p {
                                        font-size: 0.8rem;
                                    }
                                    #claim {
                                        font-size: 1.6rem;
                                    }
                                }
    
                                @media(min-width: 900px) {
                                    p {
                                        font-size: 1rem;
                                    }
                                    #claim {
                                        font-size: 2rem;
                                    }
                                }
                                
                                @media(min-width: 1100px) {
                                    p {
                                        font-size: 1.5rem;
                                    }
                                    #claim {
                                        font-size: 3rem;
                                    }
                                }
                                
                                @media(min-width: 1440px) {
                                    p {
                                        font-size: 2rem;
                                    }
                                    #claim {
                                        font-size: 4rem;
                                    }
                                }
                            `}>

                                <p className={css`
                                text-align:right;
                                `}>AMOUNT TO PAY {ethFromTokens}ETH</p>
                                <p id='claim' className={css`
                                // cursor: pointer;
                                width: 100%;
                                line-height: 3rem;
                                &:hover {
                                    opacity: 0.5;
                                }
                                `} onClick={handleClaim}>CLAIM NOW</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}

export { Presale }