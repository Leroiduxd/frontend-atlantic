import { Hash } from 'viem';

export interface VenueTxHashRequest {
  userAddress: string; 
  txHash: Hash; 
  actionType: string;
  venue: string;
  chainId: number;
}

const API_ENDPOINT = "https://tx-submission-api-dev.spicenet.io/venue-tx-hashes";

export const logTransaction = async (request: VenueTxHashRequest): Promise<void> => {
  if (!request.txHash || !request.userAddress || !request.actionType || !request.venue || !request.chainId) {
    console.error('Missing required fields for transaction logging:', {
      hasTxHash: !!request.txHash,
      hasUserAddress: !!request.userAddress,
      hasActionType: !!request.actionType,
      hasVenue: !!request.venue,
      hasChainId: !!request.chainId,
    });
    return;
  }

  try {
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        address: request.userAddress,
        txHash: request.txHash,
        actionType: request.actionType,
        venue: "BROKEX",
        chainId: request.chainId,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Failed to log transaction:', {
        status: response.status,
        statusText: response.statusText,
        txHash: request.txHash,
        actionType: request.actionType,
        userAddress: request.userAddress,
        error: errorText,
      });
    } else {
      console.log('Transaction logged successfully:', {
        txHash: request.txHash,
        actionType: request.actionType,
        userAddress: request.userAddress,
      });
    }
  } catch (error) {
    console.error('Error logging transaction to API:', error, {
      txHash: request.txHash,
      actionType: request.actionType,
      userAddress: request.userAddress,
    });
  }
};

