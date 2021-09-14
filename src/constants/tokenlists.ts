export interface TokenListMap {
  Balancer: {
    Default: string;
    Vetted: string;
  };
  External: string[];
}

interface TokenListMapByNetwork {
  [networkKey: string]: TokenListMap;
}

/**
 * Mapping of the TokenLists used on each network
 */
export const TOKEN_LIST_MAP: TokenListMapByNetwork = {
  '1': {
    Balancer: {
      Default:
        'https://storageapi.fleek.co/balancer-team-bucket/assets/listed.tokenlist.json',
      Vetted:
        'https://storageapi.fleek.co/balancer-team-bucket/assets/vetted.tokenlist.json'
    },
    External: [
      'ipns://tokens.uniswap.org',
      'tokenlist.zerion.eth',
      'tokens.1inch.eth',
      'tokenlist.aave.eth',
      // 'https://tokens.coingecko.com/uniswap/all.json', Breaks balance/allowance fetching
      'https://umaproject.org/uma.tokenlist.json'
    ]
  },
  '42': {
    Balancer: {
      Default:
        'https://storageapi.fleek.co/balancer-team-bucket/assets/listed.tokenlist.json',
      Vetted:
        'https://storageapi.fleek.co/balancer-team-bucket/assets/vetted.tokenlist.json'
    },
    External: [
      'ipns://tokens.uniswap.org',
      // 'https://tokens.coingecko.com/uniswap/all.json',
      'https://umaproject.org/uma.tokenlist.json'
    ]
  },
  '137': {
    Balancer: {
      Default:
        'https://storageapi.fleek.co/tomafrench-team-bucket/polygon.listed.tokenlist.json',
      Vetted:
        'https://storageapi.fleek.co/tomafrench-team-bucket/polygon.vetted.tokenlist.json'
    },
    External: [
      'https://unpkg.com/quickswap-default-token-list@1.0.67/build/quickswap-default.tokenlist.json'
    ]
  },
  '43113': {
    Balancer: {
      Default: 'http://localhost:8080/beethoven-fuji.tokenlist.json',
      Vetted: 'http://localhost:8080/beethoven-fuji.tokenlist.json'
    },
    External: ['http://localhost:8080/beethoven-fuji.tokenlist.json']
  },
  '4': {
    Balancer: {
      Default:
        'https://storageapi.fleek.co/beethovenxfi-team-bucket/beethoven-rinkeby.tokenlist.json',
      Vetted:
        'https://storageapi.fleek.co/beethovenxfi-team-bucket/beethoven-rinkeby.tokenlist.json'
    },
    External: [
      'https://storageapi.fleek.co/beethovenxfi-team-bucket/beethoven-rinkeby.tokenlist.json'
    ]
  }
};
