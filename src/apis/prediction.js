import { requestURL } from "./http";
//具体某一个接口，只需要在本文件中配置url，请求方式，请求体这三个参数
const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

//多项式预测

const PREDICTION_POLYNOMIALREGRESSIONPREDICT = (data) =>
  requestURL(
    VITE_API_BASE_URL + "/prediction/polynomialRegressionPredict",
    "post",
    data
  );

//最优多项式预测
const PREDICTION_OPTIMIZEDPOLYNOMIALREGRESSIONPREDICT = (data) =>
  requestURL(
    VITE_API_BASE_URL + "/prediction/optimizedPolynomialRegressionPredict",
    "post",
    data
  );

//ARIMA时间序列预测
const PREDICTION_ARIMAPREDICT = (data) =>
  requestURL(VITE_API_BASE_URL + "/prediction/ARIMAPredict", "post", data);
const PREDICTION_OPTIMIZEDARIMAPREDICT = (data) =>
  requestURL(
    VITE_API_BASE_URL + "/prediction/optimizedARIMAPredict",
    "post",
    data
  );

//BP神经网络预测
const PREDICTION_BPNETWORKPREDICT = (data) =>
  requestURL(VITE_API_BASE_URL + "/prediction/BPNetworkPredict", "post", data);

//SVM回归预测
const PREDICTION_SVMREGRESSIOINPREDICT = (data) =>
  requestURL(
    VITE_API_BASE_URL + "/prediction/SVMRegressionPredict",
    "post",
    data
  );

//最佳SVM回归预测
const PREDICTION_OPTIMIZEDSVMREGRESSIOINPREDICT = (data) =>
  requestURL(
    VITE_API_BASE_URL + "/prediction/optimizedSVMRegressionPredict",
    "post",
    data
  );

//最佳BPNetwork回归预测
const PREDICTION_OPTIMIZEDBPNETWORKPREDICT = (data) =>
  requestURL(
    VITE_API_BASE_URL + "/prediction/optimizedBPNetworkPredict",
    "post",
    data
  );

//综合回归预测
const PREDICTION_OPTIMIZEDPREDICT = (data) =>
  requestURL(VITE_API_BASE_URL + "/prediction/optimizedPredict", "post", data);

export {
  PREDICTION_POLYNOMIALREGRESSIONPREDICT,
  PREDICTION_OPTIMIZEDPOLYNOMIALREGRESSIONPREDICT,
  PREDICTION_ARIMAPREDICT,
  PREDICTION_OPTIMIZEDARIMAPREDICT,
  PREDICTION_BPNETWORKPREDICT,
  PREDICTION_SVMREGRESSIOINPREDICT,
  PREDICTION_OPTIMIZEDSVMREGRESSIOINPREDICT,
  PREDICTION_OPTIMIZEDBPNETWORKPREDICT,
  PREDICTION_OPTIMIZEDPREDICT,
};
