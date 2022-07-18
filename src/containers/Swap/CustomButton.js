import * as PropTypes from "prop-types";
import { Button, message } from "antd";
import { connect } from "react-redux";
import { getAmount, orderPriceConversion } from "../../utils/coin";
import { signAndBroadcastTransaction } from "../../services/helper";
import React, { useEffect, useState } from "react";
import { setComplete } from "../../actions/swap";
import Snack from "../../components/common/Snack";
import variables from "../../utils/variables";
import { useDispatch } from "react-redux";
import { APP_ID, DEFAULT_FEE } from "../../constants/common";
import Long from "long";

const CustomButton = ({
  offerCoin,
  demandCoin,
  address,
  name,
  isDisabled,
  setComplete,
  slippageTolerance,
  validationError,
  lang,
  refreshBalance,
  pair,
  orderDirection,
  isLimitOrder,
  limitPrice,
  baseCoinPoolPrice,
}) => {
  const [inProgress, setInProgress] = useState(false);
  const dispatch = useDispatch();

  const poolPrice = Number(baseCoinPoolPrice);

  useEffect(() => {
    setComplete(false);
  }, []);

  const calculateOrderPrice = () => {
    if (orderDirection === 1) {
      return orderPriceConversion(
        poolPrice + poolPrice * Number(slippageTolerance / 100)
      );
    } else {
      return orderPriceConversion(
        poolPrice - poolPrice * Number(slippageTolerance / 100)
      );
    }
  };

  const priceWithOutConversion = () => {
    return poolPrice + poolPrice * Number(slippageTolerance / 100);
  };

  const calculateBuyAmount = () => {
    const price = priceWithOutConversion();
    const amount = Number(offerCoin?.amount) / price;

    return getAmount(amount);
  };

  const handleSwap = () => {
    setInProgress(true);
    const price = calculateOrderPrice();

    signAndBroadcastTransaction(
      {
        message: {
          typeUrl: "/comdex.liquidity.v1beta1.MsgLimitOrder",
          value: {
            orderer: address,
            orderLifespan: isLimitOrder ? { seconds: 600, nanos: 0 } : "0",
            pairId: pair?.id,
            appId: Long.fromNumber(APP_ID),
            direction: orderDirection,
            /** offer_coin specifies the amount of coin the orderer offers */
            offerCoin: {
              denom: offerCoin?.denom,
              amount: getAmount(
                Number(offerCoin?.amount) + Number(offerCoin?.fee)
              ),
            },
            demandCoinDenom: demandCoin?.denom,
            price: isLimitOrder ? orderPriceConversion(limitPrice) : price,
            /** amount specifies the amount of base coin the orderer wants to buy or sell */
            amount:
              orderDirection === 2
                ? getAmount(offerCoin?.amount)
                : calculateBuyAmount(),
          },
        },
        fee: {
          amount: [{ denom: "ucmdx", amount: DEFAULT_FEE.toString() }],
          gas: "500000",
        },
        memo: "",
      },
      address,
      (error, result) => {
        setInProgress(false);
        if (error) {
          message.error(error);
          return;
        }

        if (result?.code) {
          message.info(result?.rawLog);
          return;
        }

        setComplete(true);
        updateValues();
        message.success(
          <Snack
            message={variables[lang].tx_success}
            hash={result?.transactionHash}
          />
        );
      }
    );
  };

  const updateValues = () => {
    dispatch({
      type: "BALANCE_REFRESH_SET",
      value: refreshBalance + 1,
    });
    dispatch({
      type: "DEMAND_COIN_AMOUNT_SET",
      value: 0,
    });
    dispatch({
      type: "OFFER_COIN_AMOUNT_SET",
      value: 0,
    });
  };

  return (
    <div className="assets-form-btn">
      <Button
        disabled={
          isDisabled ||
          inProgress ||
          !(offerCoin && Number(offerCoin.amount)) ||
          validationError?.message
        }
        type="primary"
        loading={inProgress}
        className="btn-filled"
        onClick={() => handleSwap()}
      >
        {name}
      </Button>
    </div>
  );
};

CustomButton.propTypes = {
  setComplete: PropTypes.func.isRequired,
  address: PropTypes.string,
  baseCoinPoolPrice: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  demandCoin: PropTypes.shape({
    amount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    denom: PropTypes.string,
  }),
  isDisabled: PropTypes.bool,
  isLimitOrder: PropTypes.bool,
  inputValue: PropTypes.number,
  limitPrice: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  name: PropTypes.string,
  offerCoin: PropTypes.shape({
    amount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    denom: PropTypes.string,
    fee: PropTypes.number,
  }),
  params: PropTypes.shape({
    swapFeeRate: PropTypes.string,
  }),
  refreshBalance: PropTypes.number.isRequired,
  slippage: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  slippageTolerance: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  validationError: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.shape({
      message: PropTypes.string.isRequired,
    }),
  ]),
};

const stateToProps = (state) => {
  return {
    address: state.account.address,
    demandCoin: state.swap.demandCoin,
    offerCoin: state.swap.offerCoin,
    slippage: state.swap.slippage,
    slippageTolerance: state.swap.slippageTolerance,
    refreshBalance: state.account.refreshBalance,
  };
};

const actionsToProps = {
  setComplete,
};

export default connect(stateToProps, actionsToProps)(CustomButton);