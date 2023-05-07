import axios from 'axios';

export async function getEthToUsdRate() {
  try {
    const response = await axios.get(
      'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd'
    );

    return response.data.ethereum.usd;
  } catch (error) {
    console.error('Error fetching ETH to USD rate:', error);
    return null;
  }
}