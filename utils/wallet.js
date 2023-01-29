import { ethers } from 'ethers';

export const walletEntropyPwd = '123456';

// wei => ether.toFixed(2)
export const formatEther = (wei, toFixedNum = 2) => {
  const ether = ethers.utils.formatEther(wei || '0');
  console.log('ether', ether);
  // toFixedNum为-1时不需要精确小数
  if (toFixedNum !== -1) {
    return parseFloat(ether).toFixed(toFixedNum).toString();
  } else {
    return ether;
  }
}

// ether => wei
export const parseEther = (ether) => {
  const wei = ethers.utils.parseEther(ether).toString();
  return wei; 
}