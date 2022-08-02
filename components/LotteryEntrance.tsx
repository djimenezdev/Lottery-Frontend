import React, { useEffect, useState } from "react"
import { useMoralis, useWeb3Contract } from "react-moralis"
import abi from "../constants/abi.json"
import contractAddresses from "../constants/contractAddresses.json"
import { BigNumber, ethers, Signer } from "ethers"
import { useNotification } from "web3uikit"

const LotteryEntrance = () => {
    const { chainId: mainId, Moralis, isWeb3Enabled } = useMoralis()

    const [entranceFee, setEntranceFee] = useState<string | null>(null)
    const [players, setPlayers] = useState<number>(0)
    const [recentWinner, setRecentWinner] = useState<string>("")
    const [raffleState, setRaffleState] = useState<number>(0)
    const parseChainId = mainId === null ? null : parseInt(mainId, 16)
    const raffleAddress = parseChainId === null ? null : contractAddresses[parseInt(mainId, 16)][0]
    const dispatch = useNotification()

    useEffect(() => {
        if (mainId !== "null") return
        alert("No chain active!")
    }, [contractAddresses, mainId])

    useEffect(() => {
        Moralis.onChainChanged((chainId) => {
            if (chainId === "null") {
                alert("No chain active")
            } else {
            }
        })
    }, [Moralis])

    const { runContractFunction: getEntranceFee } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getEntranceFee",
        params: {},
    })
    const {
        runContractFunction: enterRaffle,
        isLoading,
        isFetching,
    } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "enterRaffle",
        params: {},
        msgValue: entranceFee,
    })
    const { runContractFunction: getNumberOfPlayers } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getNumberOfPlayers",
        params: {},
    })

    const { runContractFunction: getRecentWinner } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getRecentWinner",
        params: {},
    })

    const { runContractFunction: getRaffleState } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getRaffleState",
        params: {},
    })

    const getFee = async () => {
        const getEntraceFeeV = (await getEntranceFee()).toString()
        const getNumOfPlayers = parseInt((await getNumberOfPlayers()).toString())
        const winner: string = (await getRecentWinner()) as string
        const raffleStateVar: number = (await getRaffleState()) as number
        setEntranceFee(getEntraceFeeV)
        setPlayers(getNumOfPlayers)
        setRecentWinner(winner)
        setRaffleState(raffleStateVar)
    }

    useEffect(() => {
        if (isWeb3Enabled) {
            getFee()
        }
    }, [isWeb3Enabled])

    const handleSuccess = async (tx) => {
        const txReceipt = await tx.wait(1)
        if (txReceipt.events[0].args.sender) {
            handleNewNotification(tx)
            getFee()
        }
    }

    useEffect(() => {
        if (raffleAddress) {
            const setWinnerWatch = async () => {
                const web3Provider = await Moralis.enableWeb3()
                const raffleContract = new ethers.Contract(
                    raffleAddress,
                    JSON.stringify(abi),
                    web3Provider
                )
                console.log(raffleContract)
                if (raffleContract.getRaffleState === 1) return
                raffleContract.once("WinnerPicked", () => {
                    if (localStorage.getItem("winner") === "false") {
                        dispatch({
                            type: "success",
                            message: "We have a winner",
                            title: "Winner",
                            position: "topR",
                            icon: "bell",
                            id: "Winner",
                        })
                        getFee()
                        localStorage.setItem("winner", "true")
                    }
                })
            }
            setWinnerWatch()
        }
    }, [raffleAddress])

    const handleNewNotification = (tx) => {
        dispatch({
            type: "info",
            message: "Transaction Successfully Sent",
            title: "Tx Notification",
            position: "topR",
            icon: "bell",
        })
    }

    const enterError = () => {
        dispatch({
            type: "error",
            message: "Cannot Enter raffle is close",
            title: "Raffle Error",
            position: "topR",
            icon: "exclamation",
        })
    }

    return (
        <div className="p-5">
            Hi from Lottery entrance!
            {raffleAddress ? (
                <div>
                    <div className="relative mb-2">
                        {(isLoading || isFetching) && (
                            <div className="absolute flex items-center py-2 px-4 rounded ml-auto bg-blue-500 ">
                                <div className="animate-ping h-2 w-2 rounded-full bg-white mr-2" />
                                <p className="text-white">Loading...</p>
                            </div>
                        )}
                        <button
                            type="button"
                            className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto `}
                            onClick={async () => {
                                if (raffleState === 0) {
                                    await enterRaffle({
                                        onSuccess: handleSuccess,
                                        onError(error) {
                                            console.error("error", error)
                                        },
                                    }).catch((error) => console.log("error", error))
                                    localStorage.setItem("winner", "false")
                                } else {
                                    enterError()
                                }
                            }}
                            disabled={isLoading || isFetching}
                        >
                            Enter Raffle
                        </button>
                    </div>
                    <p>
                        Entrance FEE:
                        {entranceFee !== null &&
                            ethers.utils.formatUnits(BigNumber.from(entranceFee), "ether")}{" "}
                        ETH
                    </p>
                    <p>Number of Players: {players}</p>
                    <p>Recent Winner: {recentWinner}</p>
                </div>
            ) : null}
        </div>
    )
}

export default LotteryEntrance
