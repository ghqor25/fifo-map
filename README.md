# fifo-map

Simple map cache using Map and Array(for improve fifo performance). \
Memory use(N items): N Map items, N ~ 2N Array items(When using delete() frequently, maximum 2N Array items can be created) \

Only has get(same as Map.get(). So fast because it does nothing more.), \
put(FIFO handling if size is full), \
delete(delete and manage Array) \