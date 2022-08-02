import React from "react"
import { ConnectButton } from "web3uikit"

// https://stackoverflow.com/questions/72157841/importing-connectbutton-from-web3uikit-gives-error-invalid-hook-call-hooks-can
const MainHeader = () => {
    return (
        <div className="p-5 border-b-2 flex flex-row">
            <h1 className="p-4 font-bold text-3xl">Decentralized Lottery</h1>
            <div className="ml-auto py-2 px-4">
                <ConnectButton moralisAuth={false} />
            </div>
        </div>
    )
}

export default MainHeader
