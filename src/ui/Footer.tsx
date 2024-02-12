import { css } from "@emotion/css"
import twitter from '../assets/twitter.png'
import telegram from '../assets/telegram.png'

const Footer = () => {
    return (
        <footer className={css`
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
            // width: 100%;
            background-color: white;
            height: 200px;
            gap: 24px;
            padding-left: 30%;
            padding-right: 30%;
            padding-top: 16px;
            padding-bottom: 16px;
            font-family: TourneyBoldItalic;
            @media(max-width: 750px) {
                padding-left: 16px;
                padding-right: 16px;  
      
            }
            @media(max-width: 607px) {
                gap: 0px;
                height: 80px;
                align-items: space-between;
                padding-bottom: 4px;
                p {
                    font-size: .5rem;
                }
                img {
                    height: 45px;
                }   
            }
        `}>
            <div className={css`
                display: flex;
                flex-direction: row;
                div {
                    cursor: pointer;
                }
            `}>
                <div onClick={() => window.open('https://twitter.com/RealFDIC', '_blank')}>
                    <img src={twitter} height='80px' style={{marginRight: 8}}/>
                </div >
                <div onClick={() => window.open('https://t.co/cJGuykJuCR', '_blank')}>
                    <img src={telegram} height='80px' style={{marginLeft: 8}}/>
                </div>
            </div>
            <p>FDIC is a Fully Decentralized International Cryptocurrency. It has no inherent value. It is highly experimental. The FDIC smart contract is complete at launch. There are no more features to add. There is no individual or team to be relied upon to give FDIC any value.</p>
        </footer>
    )
}

export { Footer }