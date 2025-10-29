import { useAccount, useWriteContract } from 'wagmi';
import { TRADING_ADDRESS, TRADING_ABI } from '@/config/contracts';
import { customChain } from '@/config/wagmi';

interface OpenPositionParams {
  longSide: boolean;
  leverageX: number;
  lots: number;
  isLimit: boolean;
  priceX6: number;
  slX6: number;
  tpX6: number;
}

export const useTrading = () => {
  const { address } = useAccount();
  const { writeContractAsync } = useWriteContract();

  const openPosition = async (params: OpenPositionParams) => {
    if (!address) throw new Error('No wallet connected');

    const hash = await writeContractAsync({
      address: TRADING_ADDRESS,
      abi: TRADING_ABI,
      functionName: 'open',
      args: [
        0, // assetId always 0
        params.longSide,
        params.leverageX,
        params.lots,
        params.isLimit,
        BigInt(params.priceX6),
        BigInt(params.slX6),
        BigInt(params.tpX6),
      ],
      account: address,
      chain: customChain,
    });

    return hash;
  };

  const cancelOrder = async (id: number) => {
    if (!address) throw new Error('No wallet connected');

    const hash = await writeContractAsync({
      address: TRADING_ADDRESS,
      abi: TRADING_ABI,
      functionName: 'cancel',
      args: [id],
      account: address,
      chain: customChain,
    });

    return hash;
  };

  const updateStops = async (id: number, slX6: number, tpX6: number) => {
    if (!address) throw new Error('No wallet connected');

    const hash = await writeContractAsync({
      address: TRADING_ADDRESS,
      abi: TRADING_ABI,
      functionName: 'updateStops',
      args: [id, BigInt(slX6), BigInt(tpX6)],
      account: address,
      chain: customChain,
    });

    return hash;
  };

  const closePosition = async (id: number) => {
    if (!address) throw new Error('No wallet connected');

    const hash = await writeContractAsync({
      address: TRADING_ADDRESS,
      abi: TRADING_ABI,
      functionName: 'close',
      args: [id],
      account: address,
      chain: customChain,
    });

    return hash;
  };

  return {
    openPosition,
    cancelOrder,
    updateStops,
    closePosition,
  };
};
