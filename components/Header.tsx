import React, { useEffect } from "react"
import { useMoralis } from "react-moralis"

const Header = () => {
    const { enableWeb3, account, isWeb3Enabled, Moralis, deactivateWeb3, isWeb3EnableLoading } =
        useMoralis()
    /* 
     web3 can be enabled without an account even connected
     
     */
    useEffect(() => {
        if (isWeb3Enabled) return
        if (typeof window !== "undefined") {
            if (window.localStorage.getItem("connected")) {
                ;(async function () {
                    await enableWeb3()
                })()
            }
        }
    }, [isWeb3Enabled])

    useEffect(() => {
        Moralis.onAccountChanged((account) => {
            console.log(`Account changed to ${account}`)
            if (account === null) {
                window.localStorage.removeItem("connected")
                ;(async function () {
                    await deactivateWeb3()
                    console.log("Null Account")
                })()
            }
        })
    }, [])

    return (
        <div>
            {account ? (
                <div>
                    Connected to {account.slice(0, 6)}...{account.slice(account.length - 4)}
                </div>
            ) : (
                <button
                    type="button"
                    onClick={async () => {
                        await enableWeb3()
                        if (typeof window !== "undefined") {
                            window.localStorage.setItem("connected", "injected")
                        }
                    }}
                    disabled={isWeb3EnableLoading}
                >
                    {isWeb3EnableLoading ? "Connecting..." : "Connect"}
                </button>
            )}
        </div>
    )
}

export default Header
