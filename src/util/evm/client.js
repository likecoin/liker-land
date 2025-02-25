import { IS_TESTNET } from '../../constant';

let client;
export async function getEvmClient() {
  if (!client) {
    const [
      { optimism, optimismSepolia },
      { createPublicClient, http },
    ] = await Promise.all([import('viem/chains'), import('viem')]);
    client = createPublicClient({
      chain: IS_TESTNET ? optimismSepolia : optimism,
      transport: http(),
    });
  }
  return client;
}

export async function readContract({ address, abi, functionName, args }) {
  const [client, { readContract }] = await Promise.all([
    getEvmClient(),
    import('viem/actions'),
  ]);
  return readContract(client, {
    address,
    abi,
    functionName,
    args,
  });
}

export default getEvmClient;
