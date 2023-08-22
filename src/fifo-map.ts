export interface FifoMapProps {
   maxSize: number;
}

/**
 * FIFO Map Cache.
 */
export class FifoMap<KeyType, ValueType> {
   private _db: Map<KeyType, ValueType>;
   private _fifoKeys: KeyType[];

   private _maxSize: number;

   constructor(props: FifoMapProps) {
      this._db = new Map();
      this._fifoKeys = new Array();

      if (props.maxSize <= 0) throw new Error('maxSize should be more than 0.');
      this._maxSize = props.maxSize;
   }

   get size() {
      return this._db.size;
   }

   /**
    * Get item.
    * @param key key
    * @returns `cached value`, if input key matches.\
      `undefined`, if it does not exist.
    */
   get = (key: KeyType) => this._db.get(key);

   /**
    * Put item. \
    * It also deletes item as FIFO only when cache is full.
    * @param key key
    * @param value value
    * @returns `old item`, if cache is full and delete an item done. \
    *  `undefined`, if cache is not full and only put done.
    */
   put = (key: KeyType, value: ValueType) => {
      let oldItem = undefined;

      // When operation is add, FIFO handling.
      if (!this._db.has(key)) {
         this._fifoKeys.push(key);

         // Delete operation when db is full.
         // Keep shift until item matches and delete item. (No matching keys would be exist in fifoKeys, because of delete() method)
         if (this._db.size === this._maxSize) {
            let keyShouldBeDeleted;
            while ((keyShouldBeDeleted = this._fifoKeys.shift()) !== undefined) {
               oldItem = this.delete(keyShouldBeDeleted);
               if (oldItem !== undefined) break;
            }
         }
      }

      this._db.set(key, value);

      return oldItem;
   };

   /**
    * Delete item.
    * @param key key
    * @returns `deleted item`, if key exists and deleted.\
    *  `undefined`, if key does not exist.
    */
   delete = (key: KeyType) => {
      const value = this._db.get(key);

      if (value !== undefined) {
         this._db.delete(key);

         // If _fifoKeys' length is over 2 time than max size, reset and sync with _db. (For put() method performance and memoryUsage)
         if (this._fifoKeys.length > this._maxSize * 2) this._fifoKeys = Array.from(this._db.keys());

         return { key, value };
      } else return undefined;
   };

   /**
    * Clear all.
    */
   clear = () => {
      this._db.clear();
      this._fifoKeys = new Array();
   };
}
