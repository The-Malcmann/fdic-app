import { useAccount, useContractRead } from "wagmi"
import Web3 from "web3"
import Vesting from '../contracts/localhost/TokenVestingBase.json'

const useVesting = () => {
    const { address } = useAccount()

    const { data, error, isLoading, isSuccess } = useContractRead({
        abi: Vesting.abi,
        address: Vesting.address,
        functionName: 'getLastVestingScheduleForHolder',
        args: [address],
        enabled: Boolean(address),
    })
    
    const { data: scheduleId, error: e1, isLoading: l1, isSuccess: s1 } = useContractRead({
        abi: Vesting.abi,
        address: Vesting.address,
        functionName: 'computeLatestVestingScheduleIdForHolder',
        args: [address],
        enabled: Boolean(address),
    })
    console.log('SCHEDULEID', scheduleId)
    
    const { data: amountToClaim, error: e2, isLoading: l2, isSuccess: s2 } = useContractRead({
        abi: Vesting.abi,
        address: Vesting.address,
        functionName: 'computeReleasableAmount',
        args: [scheduleId],
        enabled: Boolean(scheduleId),
    })



    return { schedule: data, amount: Web3.utils.fromWei(data?.amountTotal || '0', 'ether'), amountToClaim: Web3.utils.fromWei(amountToClaim || '0', 'ether'), isLoading, isSuccess }
}

export { useVesting }