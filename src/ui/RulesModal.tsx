import { css } from "@emotion/css"
import { useEffect, useState } from "react"
import { TypeAnimation } from 'react-type-animation';
const RulesModal = () => {
    // const [show, setShow] = useState(overrideShow || localStorage.getItem('fdic-rules'))
    const [rerender, setRerender] = useState(0)
    const [typing, setTyping] = useState(true)

    const { hasCookie, removeCookie, addCookie } = useFdicCookie({ rerender })
    // const rulesCookie = () => localStorage.getItem('fdic-rules')
    if (hasCookie) {
        return (
            <h1 className={css`
                    cursor: pointer;
                    color: black;
                    font-size: 5vw;
                    font-family: TourneyBoldItalic;
                    &:hover {
                        color: blue;
                        text-decoration: underline;
                    }
                `} onClick={() => {
                    window.scrollTo({ top: 0 })
                    removeCookie()
                    setRerender(rerender + 1)
                }}>RULES</h1>
        )
    }

    function handleClose() {
        // removeCookie()
        addCookie()
        setRerender(rerender + 1)
    }

    return (
        <div className={css`
            display: flex;
            justify-content: center;
            align-items: center;
            position: fixed;
            top: 0px; left: 0px; right: 0px; bottom: 0px;
            background-color: rgba(0,0,0,0.5);
            min-height: 100%;
           
        `} onClick={handleClose}>

            <div className={css`
             ::-webkit-scrollbar {
                display: none;
            }
            color: green;
            background-color: black;
            font-size: 1vw;
            -ms-overflow-style: none;
            scrollbar-width: none;
            position: relative;
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            align-items: center;
            line-height: 1;
            border-radius: 1rem;
            // top: 20%;
            width: 30vw;

            @media(max-width: 740px) {
                font-size: 2vw;
            }
            p {
                font-size: .5vw;
            }
            height: 30vw;
            
            
            // height: max-content;

            font-family: TourneyBoldItalic;
            padding: 2rem;
            padding-top: 0rem;
            overflow: scroll;
            `}>

            <div className={css`margin-top: 3vw; display: flex; justify-content: center;`}>

                <TypeAnimation
                    sequence={[
                        'THESE ARE THE RULES OF THE GAME\nPLEASE TRY TO REMAIN FOCUSED\nYOUR ATTENTION IS VITAL',
                        () => {setTyping(false)}

                    ]}
                    speed={50}
                    style={{ textAlign: 'center',whiteSpace: 'pre-line', fontSize: '1.6vw' }}
                />
                
            </div>
            <div className={css`margin-top: 5vw; display: flex; justify-content: center;`}>
            <TypeAnimation
                    sequence={[
                        4800,
                        '4% REFLECTIONS\n\n\n1% FEE TO LP\n\n\nREFRESH WALLET EVERY 24hr\n\n\nSTAY UNDER 1% OF TOTAL SUPPLY PER WALLET\n\n\n5% LIQUIDATION BOUNTY\n\n\n\ngood luck soldier...',
                    ]}
                    speed={50}
                    style={{ textAlign: 'center',whiteSpace: 'pre-line', fontSize: '1vw' }}
                />
                </div>
                <div className={css`
                    position: absolute;
                    right: 16px;
                    top: 8px;
                    opacity: 0.8;
                    font-size: 1.25vw;;
                `}>
                    <p style={{ cursor: 'pointer' }} onClick={handleClose}>CLOSE</p>
                </div>
            </div>

        </div>
    )
}

const useFdicCookie = ({ rerender = 0 }) => {
    const [hasCookie, setHasCookie] = useState(false)

    useEffect(() => {
        function getCookie() {
            const cookie = localStorage.getItem('fdic-rules')
            setHasCookie(cookie != null)
        }
        getCookie()
    }, [rerender])

    const removeCookie = () => {
        return localStorage.removeItem('fdic-rules')
    }

    const addCookie = () => {
        localStorage.setItem('fdic-rules', 'true')
    }

    return { hasCookie, removeCookie, addCookie }
}

const typingContainer = css`
    display: flex;
    justify-content: center;
    align-items: center;
`

const inputCursor = css`
    display: inline-block;
    width: .1vw;
    height: 1.4vw;
    background-color: green;
    margin-left: 8px;
`
export { RulesModal }