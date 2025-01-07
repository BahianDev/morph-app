import { ConnectButton } from "@rainbow-me/rainbowkit";

export const ConnectWallet = () => {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        const ready = mounted && authenticationStatus !== "loading";
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus || authenticationStatus === "authenticated");
        return (
          <div
            {...(!ready && {
              "aria-hidden": true,
              style: {
                opacity: 0,
                pointerEvents: "none",
                userSelect: "none",
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <button
                    className="focus:outline-none text-white bg-primary hover:bg-green-700 font-bold rounded-lg text-lg px-5 py-2 me-2 mb-2"
                    onClick={openConnectModal}
                    type="button"
                  >
                    Connect Wallet
                  </button>
                );
              }
              if (chain.unsupported) {
                return (
                  <button
                    className="focus:outline-none text-white bg-primary hover:bg-green-700 font-bold rounded-lg text-lg px-5 py-2 me-2 mb-2"
                    onClick={openChainModal}
                    type="button"
                  >
                    Wrong Network
                  </button>
                );
              }
              return (
                <button
                  className="focus:outline-none text-white bg-primary hover:bg-green-700 font-bold rounded-lg text-lg px-5 py-2 me-2 mb-2"
                  onClick={openAccountModal}
                  type="button"
                >
                  {account.displayName}
                </button>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};