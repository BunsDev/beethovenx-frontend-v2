import {
  DecoratedFarm,
  DecoratedPool,
  Farm,
  FarmUser,
  PoolApr
} from '@/services/balancer/subgraph/types';
import { getAddress } from '@ethersproject/address';
import useTokens from '@/composables/useTokens';
import BigNumber from 'bignumber.js';

export function calculateTvl(farm: Farm, pool: DecoratedPool) {
  const { tokens, priceFor } = useTokens();

  if (pool && pool.totalShares !== '0' && farm.slpBalance !== '0') {
    const valuePerShare =
      parseFloat(pool.totalLiquidity) / parseFloat(pool.totalShares);

    return Number(parseInt(farm.slpBalance) / 1e18) * valuePerShare;
  }

  const address = getAddress(farm.pair);
  const price = priceFor(address);

  if (tokens.value[address] && price) {
    return Number(parseInt(farm.slpBalance) / 1e18) * price;
  }

  return 0;
}

export function calculateRewardsPerDay(
  farm: Farm,
  pool: DecoratedPool,
  blocksPerDay: number
) {
  const totalBeetsPerDay = new BigNumber(
    farm.masterChef.beetsPerBlock
  ).multipliedBy(blocksPerDay);

  return totalBeetsPerDay
    .multipliedBy(farm.allocPoint / farm.masterChef.totalAllocPoint)
    .dividedBy(1e18)
    .toNumber();
}

export function calculateApr(
  farm: Farm,
  pool: DecoratedPool,
  blocksPerYear: number,
  beetsPrice: number,
  rewardTokenPrice: number
) {
  const tvl = calculateTvl(farm, pool);

  if (tvl === 0) {
    return 0;
  }

  const beetsPerBlock =
    Number(parseInt(farm.masterChef.beetsPerBlock) / 1e18) * 0.872;
  const beetsPerYear = beetsPerBlock * blocksPerYear;
  const farmBeetsPerYear =
    (farm.allocPoint / farm.masterChef.totalAllocPoint) * beetsPerYear;
  const rewardTokenPerYear =
    Number(parseInt(farm.rewarder?.rewardPerSecond || '0') / 1e18) *
    86400 *
    365;

  const valuePerYear =
    beetsPrice * farmBeetsPerYear + rewardTokenPrice * rewardTokenPerYear;

  return valuePerYear / tvl;
}

export function getPoolApr(
  pool: DecoratedPool,
  farm: DecoratedFarm,
  blocksPerYear: number,
  beetsPrice: number,
  rewardTokenPrice: number
): PoolApr {
  const liquidityMiningApr = farm
    ? `${calculateApr(farm, pool, blocksPerYear, beetsPrice, rewardTokenPrice)}`
    : '0';

  return {
    pool: pool.dynamic.apr.pool,
    liquidityMining: liquidityMiningApr,
    total: `${parseFloat(pool.dynamic.apr.pool) +
      parseFloat(liquidityMiningApr)}`
  };
}

export function decorateFarm(
  farm: Farm,
  pool: DecoratedPool,
  blocksPerYear: number,
  blocksPerDay: number,
  beetsPrice: number,
  rewardTokenPrice: number,
  farmUser?: FarmUser
): DecoratedFarm {
  const tvl = calculateTvl(farm, pool);
  const apr = calculateApr(
    farm,
    pool,
    blocksPerYear,
    beetsPrice,
    rewardTokenPrice
  );
  const userShare = new BigNumber(farmUser?.amount || 0)
    .div(farm.slpBalance)
    .toNumber();

  return {
    ...farm,
    tvl,
    rewards: calculateRewardsPerDay(farm, pool, blocksPerDay),
    apr,
    stake: tvl * userShare,
    pendingBeets: farmUser?.pendingBeets || 0,
    pendingBeetsValue: (farmUser?.pendingBeets || 0) * beetsPrice,
    share: userShare,
    pendingRewardToken: farmUser?.pendingRewardToken || 0,
    pendingRewardTokenValue: farmUser?.pendingRewardTokenValue || 0
  };
}

export function decorateFarms(
  pools: DecoratedPool[],
  farms: Farm[],
  allFarmsForUser: FarmUser[],
  blocksPerYear: number,
  blocksPerDay: number,
  beetsPrice: number,
  rewardTokenPrice: number
) {
  if (farms.length === 0 || pools.length === 0) {
    return [];
  }

  const decorated: DecoratedFarm[] = [];

  for (const farm of farms) {
    const pool = pools.find(
      pool => pool.address.toLowerCase() === farm.pair.toLowerCase()
    );
    const farmUser = allFarmsForUser.find(
      userFarm => userFarm.pool.id === farm.id
    );

    if (pool) {
      decorated.push(
        decorateFarm(
          farm,
          pool,
          blocksPerYear,
          blocksPerDay,
          beetsPrice,
          rewardTokenPrice,
          farmUser
        )
      );
    }
  }

  return decorated;
}
