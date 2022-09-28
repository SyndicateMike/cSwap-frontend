import axios from "axios";
import { QueryClientImpl } from "comdex-codec/build/comdex/market/v1beta1/query";
import { API_URL } from "../../constants/url";
import { createQueryClient } from "../helper";

let myClient = null;

const getQueryService = (callback) => {
  if (myClient) {
    const queryService = new QueryClientImpl(myClient);

    return callback(null, queryService);
  } else {
    createQueryClient((error, client) => {
      if (error) {
        return callback(error);
      }

      myClient = client;
      const queryService = new QueryClientImpl(client);

      return callback(null, queryService);
    });
  }
};

export const fetchRestPrices = (callback) => {
  axios
    .get(`${API_URL}/cswap/prices`)
    .then((result) => {
      callback(null, result?.data);
    })
    .catch((error) => {
      callback(error?.message);
    });
};
