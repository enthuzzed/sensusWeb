import { ethers } from 'ethers';

const SENS_TOKEN_ADDRESS = '0xbB0F4a74b0433D4876d3B7E690895FB06e004D0E';
const MIN_RECORDING_DURATION = 10; // Minimum 10 seconds for any reward
const TOKENS_PER_10_SECONDS = ethers.utils.parseUnits("1", 18); // 1 SENS per 10 seconds

// Basic ERC20 ABI for transfer function
const TOKEN_ABI = [
  "function transfer(address to, uint256 amount) returns (bool)",
  "function balanceOf(address account) view returns (uint256)"
];

export const calculateReward = (durationInSeconds) => {
  if (durationInSeconds < MIN_RECORDING_DURATION) {
    return ethers.BigNumber.from(0);
  }
  
  // Calculate how many complete 10-second intervals were recorded
  const tenSecondIntervals = Math.floor(durationInSeconds / 10);
  return TOKENS_PER_10_SECONDS.mul(tenSecondIntervals);
};

export const rewardUser = async (address, durationInSeconds) => {
  try {
    // Check if MetaMask is installed
    if (!window.ethereum) {
      return { 
        success: false, 
        reason: 'NO_WALLET',
        message: 'Please install MetaMask to receive rewards.'
      };
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    
    // Check if user is connected to the correct network (Sepolia)
    const network = await provider.getNetwork();
    if (network.chainId !== 11155111) { // Sepolia chainId
      return {
        success: false,
        reason: 'WRONG_NETWORK',
        message: 'Please switch to Sepolia network to receive rewards.'
      };
    }

    const signer = provider.getSigner();
    const tokenContract = new ethers.Contract(SENS_TOKEN_ADDRESS, TOKEN_ABI, signer);
    
    const rewardAmount = calculateReward(durationInSeconds);
    if (rewardAmount.isZero()) {
      return { 
        success: false, 
        reason: 'DURATION_TOO_SHORT',
        message: `Recording must be at least ${MIN_RECORDING_DURATION} seconds long to earn rewards.`
      };
    }

    // Check contract balance first
    const balance = await tokenContract.balanceOf(SENS_TOKEN_ADDRESS);
    if (balance.lt(rewardAmount)) {
      return { 
        success: false, 
        reason: 'INSUFFICIENT_BALANCE',
        message: 'Reward pool is currently empty. Please try again later.'
      };
    }

    // Attempt transfer
    const tx = await tokenContract.transfer(address, rewardAmount);
    await tx.wait();
    
    const formattedAmount = ethers.utils.formatUnits(rewardAmount, 18);
    return { 
      success: true,
      amount: formattedAmount,
      message: `You earned ${formattedAmount} SENS tokens!`
    };
  } catch (error) {
    console.error('Error rewarding user:', error);
    
    // Handle specific error cases
    if (error.code === 4001) {
      return {
        success: false,
        reason: 'USER_REJECTED',
        message: 'Transaction was rejected. Please try again.'
      };
    }
    
    if (error.code === -32002) {
      return {
        success: false,
        reason: 'PENDING_REQUEST',
        message: 'Please check MetaMask for pending requests.'
      };
    }

    return { 
      success: false,
      reason: 'TRANSFER_FAILED',
      message: 'Failed to send rewards. Please try again.',
      error: error
    };
  }
};

export const getTokenBalance = async (address) => {
  try {
    if (!window.ethereum) return '0';

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const tokenContract = new ethers.Contract(SENS_TOKEN_ADDRESS, TOKEN_ABI, provider);
    
    const balance = await tokenContract.balanceOf(address);
    return ethers.utils.formatUnits(balance, 18);
  } catch (error) {
    console.error('Error getting token balance:', error);
    return '0';
  }
};