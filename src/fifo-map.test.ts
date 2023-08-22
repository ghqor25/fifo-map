import { FifoMap } from './fifo-map.js';

describe('FifoMap', () => {
   describe('constructor', () => {
      test('throw maxSize error', () => {
         expect(() => new FifoMap({ maxSize: 0 })).toThrow('maxSize should be more than 0.');
      });
   });

   describe('get', () => {
      const fifoMap = new FifoMap<string, number>({ maxSize: 10 });

      beforeAll(() => {
         fifoMap.put('a', 0);
      });

      test('key exists', () => {
         expect(fifoMap.get('a')).toBe(0);
      });
      test('key not exists', () => {
         expect(fifoMap.get('b')).toBe(undefined);
      });
   });

   describe('put', () => {
      const fifoMap = new FifoMap<string, number>({ maxSize: 1 });
      const firstItem = { key: 'a', value: 0 };
      const secondItem = { key: 'b', value: 1 };

      test('fifo not happened', () => {
         expect(fifoMap.put(firstItem.key, firstItem.value)).toBe(undefined);
      });
      test('fifo delete happened', () => {
         expect(fifoMap.put(secondItem.key, secondItem.value)).toStrictEqual(firstItem);
      });
   });

   describe('delete', () => {
      const fifoMap = new FifoMap<string, number>({ maxSize: 1 });
      const itemExists = { key: 'a', value: 0 };
      const itemNotExists = { key: 'b', value: 1 };

      beforeAll(() => {
         fifoMap.put(itemExists.key, itemExists.value);
      });

      test('key exists', () => {
         expect(fifoMap.delete(itemExists.key)).toStrictEqual(itemExists);
      });
      test('key not exists', () => {
         expect(fifoMap.delete(itemNotExists.key)).toBe(undefined);
      });
   });

   describe('clear', () => {
      const fifoMap = new FifoMap<string, number>({ maxSize: 5 });

      beforeAll(() => {
         fifoMap.put('a', 0);
         fifoMap.put('b', 1);
      });

      test('size check', () => {
         expect(fifoMap.size).toBe(2);

         fifoMap.clear();

         expect(fifoMap.size).toBe(0);
      });
   });

   describe('Fifo behavior', () => {
      const fifoMap = new FifoMap<string, number>({ maxSize: 2 });
      const sampleDelete1 = { key: 'delete1', value: 0 };
      const sampleDelete2 = { key: 'delete2', value: 1 };
      const sampleFifo1 = { key: 'fifo1', value: 2 };
      const sampleFifo2 = { key: 'fifo2', value: 3 };
      const sampleFifo3 = { key: 'fifo3', value: 4 };
      const sampleFifo4 = { key: 'fifo4', value: 5 };

      test('overall', () => {
         // Map { delete1, delete2 }
         fifoMap.put(sampleDelete1.key, sampleDelete1.value);
         fifoMap.put(sampleDelete2.key, sampleDelete2.value);

         // Map { delete2 }  ==> delete1
         expect(fifoMap.delete(sampleDelete1.key)).toStrictEqual(sampleDelete1);

         // Map {} ==> delete2
         expect(fifoMap.delete(sampleDelete2.key)).toStrictEqual(sampleDelete2);

         // Map { fifo1, fifo2 }
         fifoMap.put(sampleFifo1.key, sampleFifo1.value);
         fifoMap.put(sampleFifo2.key, sampleFifo2.value);

         // Map { fifo2, fifo3 } ==> fifo1
         expect(fifoMap.put(sampleFifo3.key, sampleFifo3.value)).toStrictEqual(sampleFifo1);

         // Map { fifo3, fifo4 } ==> fifo2
         expect(fifoMap.put(sampleFifo4.key, sampleFifo4.value)).toStrictEqual(sampleFifo2);

         // Map { fifo3, fifo4 }
         expect(fifoMap.size).toBe(2);
         expect(fifoMap.get(sampleFifo3.key)).toStrictEqual(sampleFifo3.value);
         expect(fifoMap.get(sampleFifo4.key)).toStrictEqual(sampleFifo4.value);
      });
   });
});
