import { computed, reactive } from 'vue';
import { useQuery } from 'vue-query';
import { QueryObserverOptions } from 'react-query/core';
import QUERY_KEYS from '@/constants/queryKeys';
import { farmSubgraphClient } from '@/services/balancer/subgraph/farm-subgraph.client';
import { masterChefContractsService } from '@/services/farm/master-chef-contracts.service';
import useWeb3 from '@/services/web3/useWeb3';
import { FarmUser } from '@/services/balancer/subgraph/types';
import useApp from '@/composables/useApp';
import useBeetsPrice from '@/composables/useBeetsPrice';
import { scale } from '@/lib/utils';
import BigNumber from 'bignumber.js';

export default function useFarmUserQuery(
  farmId: string,
  options: QueryObserverOptions<FarmUser> = {}
) {
  const { account, isWalletReady } = useWeb3();
  const { appLoading } = useApp();
  const beetsPrice = useBeetsPrice();

  const enabled = computed(
    () => isWalletReady.value && account.value != null && !appLoading.value
  );
  const queryKey = QUERY_KEYS.Farms.User(farmId, account);

  const queryFn = async () => {
    try {
      const userData = await farmSubgraphClient.getUserDataForFarm(
        farmId,
        account.value
      );
      const pendingBeets = await masterChefContractsService.masterChef.getPendingBeetsForFarm(
        farmId,
        account.value
      );

      return {
        ...userData,
        pendingBeets,
        pendingBeetsValue: pendingBeets * beetsPrice
      };
    } catch (e) {
      console.log('ERROR', e);
    }
  };

  const queryOptions = reactive({
    enabled,
    refetchInterval: 3000,
    ...options
  });

  return useQuery<FarmUser>(queryKey, queryFn, queryOptions);
}
