import { w3mConnectors, w3mProvider } from '@web3modal/ethereum'
import { configureChains, createConfig } from 'wagmi'
import { goerli, mainnet, localhost } from 'wagmi/chains'

export const walletConnectProjectId = '7116adf1aa69faaf1f949b906a972001'

const { chains, publicClient, webSocketPublicClient } = configureChains(
  // [mainnet, ...(import.meta.env?.MODE === 'development' ? [localhost] : [])],
  [mainnet],
  // [mainnet],
  [w3mProvider({ projectId: walletConnectProjectId })],
)

export const config = createConfig({
  autoConnect: true,
  connectors: w3mConnectors({
    chains,
    projectId: walletConnectProjectId,
    version: 2,
  }),
  publicClient,
  webSocketPublicClient,
})

export { chains }
