export interface UserPortfolioData {
  timestamp: number;
  totalValue: number;
  totalFees: number;
  totalVolume: number;
  myFees: number;

  pools: UserPoolData[];
  tokens: UserTokenData[];
}

export interface UserPoolData {
  id: string;
  poolId: string;
  poolAddress: string;
  name: string;
  shares: number;
  percentShare: number;
  totalPrice: number;
  pricePerShare: number;
  tokens: UserTokenData[];
  fees: number;
  volume: number;
}

export interface UserTokenData {
  id: string;
  address: string;
  symbol: string;
  name: string;
  balance: number;
  pricePerToken: number;
  totalPrice: number;
  percentOfPortfolio: number;
}
