# Fifo-map

Simple FIFO behavior map cache using Map(key,value) and Array(for improving FIFO performance). \
If your usecase can be enough with get(Fast read), put(Put item & FIFO manage when size is full), delete(Invalidate item on your own), 
it will be fast-read choice.

## Memory Usage
Caching N items: N Map items, N ~ 2N Array items \
(When using delete() frequently, maximum 2N Array items can be created) \

## Examples:

### Init:
```js
const fifoMap  = new FifoMap({maxSize: 10000});
```

### Get:

`fifoMap.get( key )`

Get value as key matches. It will return `value` if key matches, otherwise return `undefined`.

```js
const value = fifoMap.get( key );
```

### Put:

`fifoMap.put( key, value )`

Put item. If size is full, it deletes item as FIFO and return deleted item as `{ key, value }`, otherwise return `undefined`.

```js
const oldItem = fifoMap.put( key, value );
```

### Delete:

`fifoMap.delete( key )`

Delete item if exists. It will return `{ key, value }` if key matches, otherwise return `undefined`.

```js
const deletedItem = fifoMap.delete( key );
```

### Clear:

`fifoMap.clear()`

clear all items.

```js
fifoMap.clear()
```


