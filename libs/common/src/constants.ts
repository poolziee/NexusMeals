export const RMQ_ORDERS = 'RMQ_ORDERS';
export const RMQ_INVENTORY = 'RMQ_INVENTORY';
export const RMQ_USERS = 'RMQ_USERS';

export const TCP_ORDERS = 'TCP_ORDERS';
export const TCP_INVENTORY = 'TCP_INVENTORY';
export const TCP_USERS = 'TCP_USERS';

export const USERS_DB = 'USERS';
export const INVENTORY_DB = 'INVENTORY';

export const REDIS_SESSIONS = 'REDIS_SESSIONS';

export enum PN {
  login = 'login',
  register = 'register',
  rpc_example = 'rpc_example',
  pub_sub_example = 'pub_sub_example',
  create_category = 'create_category',
  read_categories = 'read_categories',
  update_category = 'update_category',
  delete_category = 'delete_category',
  create_product = 'create_product',
  update_product = 'update_product',
  delete_product = 'delete_product',
}
