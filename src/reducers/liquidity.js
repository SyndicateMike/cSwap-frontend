import { combineReducers } from "redux";
import {
  BASE_COIN_POOL_PRICE_SET,
  FARMED_TOKENS_DOLLAR_VALUE,
  FIRST_RESERVE_COIN_DENOM_SET,
  POOLS_LIQUIDITY_LIST_SET,
  POOLS_SET,
  POOL_BALANCES_SET,
  POOL_BALANCE_FETCH_IN_PROGRESS,
  POOL_BALANCE_SET,
  POOL_DEPOSITS_SET,
  POOL_INCENTIVES_SET,
  POOL_PRICE_SET,
  POOL_REWARDS_SET,
  POOL_SET,
  POOL_TOKEN_SUPPLY_SET,
  SECOND_RESERVE_COIN_DENOM_SET,
  SPOT_PRICE_SET, USER_LIQUIDITY_IN_DOLLAR_SET,
  USER_LIQUIDITY_IN_POOLS_SET
} from "../constants/liquidity";

const pool = (
  state = {
    _: {},
    list: [],
    pagination: {},
    inProgress: false,
  },
  action
) => {
  switch (action.type) {
    case POOLS_SET:
      return {
        ...state,
        list: action.list,
        pagination: action.pagination,
      };
    case POOL_SET:
      return {
        ...state,
        _: action.value,
      };
    default:
      return state;
  }
};

const poolDeposit = (
  state = {
    list: [],
    pagination: {},
  },
  action
) => {
  if (action.type === POOL_DEPOSITS_SET) {
    return {
      list: action.list,
      pagination: action.pagination,
    };
  }

  return state;
};

const poolBalance = (state = [], action) => {
  if (action.type === POOL_BALANCE_SET) {
    return action.list || [];
  }

  return state;
};

const spotPrice = (state = 0, action) => {
  if (action.type === SPOT_PRICE_SET) {
    return action.value;
  }

  return state;
};

const inProgress = (state = false, action) => {
  if (action.type === POOL_BALANCE_FETCH_IN_PROGRESS) {
    return action.value;
  }

  return state;
};

const firstReserveCoinDenom = (state = "", action) => {
  if (action.type === FIRST_RESERVE_COIN_DENOM_SET) {
    return action.value;
  }

  return state;
};

const secondReserveCoinDenom = (state = "", action) => {
  if (action.type === SECOND_RESERVE_COIN_DENOM_SET) {
    return action.value;
  }

  return state;
};

const poolTokenSupply = (state = {}, action) => {
  if (action.type === POOL_TOKEN_SUPPLY_SET) {
    return action.value;
  }

  return state;
};

const poolBalances = (state = [], action) => {
  if (action.type === POOL_BALANCES_SET && action.value) {
    const array = state;
    array[action.index - 1] = action.value;
    return array;
  }

  return state;
};

const list = (state = [], action) => {
  if (action.type === POOLS_LIQUIDITY_LIST_SET && action.value) {
    const array = state;
    array[action.index] = action.value;
    return array;
  }

  return state;
};

const baseCoinPoolPrice = (state = 0, action) => {
  if (action.type === BASE_COIN_POOL_PRICE_SET) {
    return action.value;
  }
  return state;
};

const userLiquidityInDollar = (state = 0, action) => {
  if (action.type === USER_LIQUIDITY_IN_DOLLAR_SET) {
    return action.value;
  }

  return state;
};

const userLiquidityInPools = (state = {}, action) => {
  if (action.type === USER_LIQUIDITY_IN_POOLS_SET && action?.poolId) {
    return {
      ...state,
      [action.poolId]: action.value || 0,
    };
  }

  return state;
};

const incentives = (state = {}, action) => {
  if (action.type === POOL_INCENTIVES_SET) {
    return action.value;
  }

  return state;
};

const rewardMap = (state = {}, action) => {
  if (action.type === POOL_INCENTIVES_SET) {
    return action.rewardMap;
  }

  return state;
};

const masterPoolMap = (state = {}, action) => {
  if (action.type === POOL_INCENTIVES_SET) {
    return action.masterPoolMap;
  }

  return state;
};

const farmedTokensDollarValue = (state = {}, action) => {
  if (action.type === FARMED_TOKENS_DOLLAR_VALUE) {
    return {
      ...state,
      [action.poolId]: action.value,
    };
  }

  return state;
};

const poolPriceMap = (state = {}, action) => {
  if (action.type === POOL_PRICE_SET) {
    return {
      ...state,
      [action.denom]: action.value,
    };
  }

  return state;
};

const rewardsMap = (state = {}, action) => {
  if (action.type === POOL_REWARDS_SET) {
    return action.value;
  }

  return state;
};

export default combineReducers({
  pool,
  poolBalance,
  poolDeposit,
  spotPrice,
  inProgress,
  firstReserveCoinDenom,
  secondReserveCoinDenom,
  poolTokenSupply,
  poolBalances,
  list,
  baseCoinPoolPrice,
  userLiquidityInDollar,
  userLiquidityInPools,
  incentives,
  masterPoolMap,
  rewardMap,
  farmedTokensDollarValue,
  poolPriceMap,
  rewardsMap,
});
