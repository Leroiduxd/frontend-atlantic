import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { VAULT_ADDRESS, VAULT_ABI, TOKEN_ADDRESS, TOKEN_ABI } from '@/config/contracts';
import { formatUnits, parseUnits } from 'viem';
import { customChain } from '@/config/wagmi';

export const useVault = () => {
  const { address } = useAccount();
  const { writeContractAsync } = useWriteContract();

  // Read vault balances
  const { data: balance, refetch: refetchBalance } = useReadContract({
    address: VAULT_ADDRESS,
    abi: VAULT_ABI,
    functionName: 'balance',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
      refetchInterval: 5000,
    },
  });

  const { data: available, refetch: refetchAvailable } = useReadContract({
    address: VAULT_ADDRESS,
    abi: VAULT_ABI,
    functionName: 'available',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
      refetchInterval: 5000,
    },
  });

  const { data: locked, refetch: refetchLocked } = useReadContract({
    address: VAULT_ADDRESS,
    abi: VAULT_ABI,
    functionName: 'locked',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
      refetchInterval: 5000,
    },
  });

  // Read token allowance
  const { data: allowance, refetch: refetchAllowance } = useReadContract({
    address: TOKEN_ADDRESS,
    abi: TOKEN_ABI,
    functionName: 'allowance',
    args: address ? [address, VAULT_ADDRESS] : undefined,
    query: {
      enabled: !!address,
    },
  });

  // Read token balance
  const { data: tokenBalance } = useReadContract({
    address: TOKEN_ADDRESS,
    abi: TOKEN_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
      refetchInterval: 5000,
    },
  });

  // Format values (6 decimals)
  const formattedBalance = balance ? Number(formatUnits(balance, 6)).toFixed(2) : '0.00';
  const formattedAvailable = available ? Number(formatUnits(available, 6)).toFixed(2) : '0.00';
  const formattedLocked = locked ? Number(formatUnits(locked, 6)).toFixed(2) : '0.00';
  const formattedTokenBalance = tokenBalance ? Number(formatUnits(tokenBalance, 6)).toFixed(2) : '0.00';

  // Approve token
  const approveToken = async (amount: string) => {
    if (!address) throw new Error('No wallet connected');
    
    const amountInWei = parseUnits(amount, 6);
    
    const hash = await writeContractAsync({
      address: TOKEN_ADDRESS,
      abi: TOKEN_ABI,
      functionName: 'approve',
      args: [VAULT_ADDRESS, amountInWei],
      account: address,
      chain: customChain,
    });

    return hash;
  };

  // Deposit
  const deposit = async (amount: string) => {
    if (!address) throw new Error('No wallet connected');

    const amountInWei = parseUnits(amount, 6);
    
    // Check allowance
    if (!allowance || allowance < amountInWei) {
      await approveToken(amount);
      await refetchAllowance();
    }

    const hash = await writeContractAsync({
      address: VAULT_ADDRESS,
      abi: VAULT_ABI,
      functionName: 'deposit',
      args: [amountInWei],
      account: address,
      chain: customChain,
    });

    return hash;
  };

  // Withdraw
  const withdraw = async (amount: string) => {
    if (!address) throw new Error('No wallet connected');

    const amountInWei = parseUnits(amount, 6);

    const hash = await writeContractAsync({
      address: VAULT_ADDRESS,
      abi: VAULT_ABI,
      functionName: 'withdraw',
      args: [amountInWei],
      account: address,
      chain: customChain,
    });

    return hash;
  };

  const refetchAll = () => {
    refetchBalance();
    refetchAvailable();
    refetchLocked();
    refetchAllowance();
  };

  return {
    balance: formattedBalance,
    available: formattedAvailable,
    locked: formattedLocked,
    tokenBalance: formattedTokenBalance,
    deposit,
    withdraw,
    approveToken,
    refetchAll,
  };
};
