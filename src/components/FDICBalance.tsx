import { useState } from 'react'
import { Address, useContractRead } from 'wagmi'
import { useAccount, useBalance } from 'wagmi'
import FDIC from '../contracts/eth/REFLECT.json'

export function FDICBalance() {
    const { address } = useAccount()

    const { data } = useContractRead({
        abi: FDIC.abi,
        address: "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9",
        functionName: 'balanceOf',
        args: [address],
        enabled: Boolean(address)
    })

    return (
        <div>
            <p>YESSIRRRRRRR {data}</p>
        </div>
    )
}