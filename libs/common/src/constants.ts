export const RMQ_ORDERS = 'RMQ_ORDERS';
export const RMQ_INVENTORY = 'RMQ_INVENTORY';
export const RMQ_USERS = 'RMQ_USERS';

export const TCP_ORDERS = 'TCP_ORDERS';
export const TCP_INVENTORY = 'TCP_INVENTORY';
export const TCP_USERS = 'TCP_USERS';

export const ORDERS_DB = 'ORDERS';
export const INVENTORY_DB = 'INVENTORY';
export const USERS_DB = 'USERS';

export const REDIS_SESSIONS = 'REDIS_SESSIONS';

export enum PN {
  user_by_id = 'user_by_id',
  login = 'login',
  register = 'register',
  rpc_example = 'rpc_example',
  create_category = 'create_category',
  read_categories = 'read_categories',
  update_category = 'update_category',
  delete_category = 'delete_category',
  create_product = 'create_product',
  update_product = 'update_product',
  delete_product = 'delete_product',
  get_chefs = 'get_chefs',
  update_chef_category_overview = 'update_chef_category_overview',
  delete_chef_category_overview = 'delete_chef_category_overview',
  add_product_to_chef_category_overview = 'add_product_to_chef_category_overview',
  remove_product_from_chef_category_overview = 'remove_product_from_chef_category_overview',
}
