import { pipe } from "ramda";
import { Alg, Tile } from "./algebra";
import { match } from "./match";

const repeat = (n: number) => <T>(val: T) => Array(n).fill(val);
const transpose = <T>(arr2d: T[][]) => arr2d[0].map((_, colIndex) => arr2d.map(row => row[colIndex]));
const reverse = <T>(arr: T[]) => [...arr].reverse();
const rotate = <T>(arr2d: T[][]) => transpose(arr2d).map(reverse);
const map = <A, B>(f: (_: A) => B) => (arr: A[]) => arr.map(f);

export type Raster<T> = T[][];

export const rasterize: (dims: {width: number, height: number}) => <A>(tile: Tile<A>) => Raster<A> =
  ({width, height}) => match({
    Cw   : ({tile}) => {
      return pipe(
        rasterize({width: height, height: width}),
        rotate
      )(tile);
    },
    FlipH: ({tile}) => {
      return pipe(
        rasterize({width: height, height: width}),
        map(reverse)
      )(tile);
    },
    Above: ({tiles}) => {
      if (tiles.length === 0) throw new Error('Yeah you can\'t pass nothing to Above');
      if (tiles.length === 1) return rasterize({width, height})(tiles[0]);

      if (height >= tiles.length) {
        const h = Math.floor(height / tiles.length);
        return [
          ...rasterize({width, height: h})(tiles[0]),
          ...rasterize({width, height: height - h})(Alg.above(...tiles.slice(1)))
        ];
      }
                         
      const zSpan = tiles.length / height;
      return rasterize({width, height})(
        Alg.above(
          ...Array(height).fill(null).map((_, i) => tiles[Math.floor(i * zSpan)])
        )
      );
    },
    Pure : ({value}) => {
      return pipe(
        repeat(width), repeat(height)
      )(value);
    },
    Ap   : ({functionTile, domainTile}) => {
      const functionRaster = rasterize({width, height})(functionTile);
      const domainRaster = rasterize({width, height})(domainTile);
      
      return functionRaster.map((row, i) => row.map((f, j) => f(domainRaster[i][j])));
    }
  })