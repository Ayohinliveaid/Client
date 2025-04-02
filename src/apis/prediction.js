import { requestURL } from "./http";
//具体某一个接口，只需要在本文件中配置url，请求方式，请求体这三个参数
const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

//向AI提问并获得回答
const PREDICTION_BESTFITTINGMODELPREDICT = (dataAndN) =>
  requestURL(
    VITE_API_BASE_URL + "/prediction/bestFittingModelPredict",
    "post",
    dataAndN
  );

//ARIMA时间序列预测
const PREDICTION_ARIMAPREDICT = (dataAndN) =>
  requestURL(VITE_API_BASE_URL + "/prediction/ARIMAPredict", "post", dataAndN);
const PREDICTION_OPTIMIZEDARIMAPREDICT = (dataAndN) =>
  requestURL(
    VITE_API_BASE_URL + "/prediction/optimizedARIMAPredict",
    "post",
    dataAndN
  );

//BP神经网络预测
const PREDICTION_BPNETWORKPREDICT = (dataAndN) =>
  requestURL(
    VITE_API_BASE_URL + "/prediction/BPNetworkPredict",
    "post",
    dataAndN
  );

//SVM回归预测
const PREDICTION_SVMREGRESSIOINPREDICT = (dataAndN) =>
  requestURL(
    VITE_API_BASE_URL + "/prediction/SVMRegressionPredict",
    "post",
    dataAndN
  );

export {
  PREDICTION_BESTFITTINGMODELPREDICT,
  PREDICTION_ARIMAPREDICT,
  PREDICTION_OPTIMIZEDARIMAPREDICT,
  PREDICTION_BPNETWORKPREDICT,
  PREDICTION_SVMREGRESSIOINPREDICT,
};
