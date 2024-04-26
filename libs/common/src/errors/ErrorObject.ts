export type ErrorObject = {
  status: 'CustomRpcException';
  message: string;
  errorCode: number;
  errorType: string;
};
