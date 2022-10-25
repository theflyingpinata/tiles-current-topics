import './style.css'
import { Tile } from './tiles';
import { rasterize } from './tiles/rasterize';
import { renderRaster } from './tiles/renderRaster';

// document.querySelector<HTMLButtonElement>('#counter')!

const width = 800,
      height = 800;

const canvas = document.querySelector<HTMLCanvasElement>('#canvas') as HTMLCanvasElement;
canvas.width = width;
canvas.height = height;

const ctx = canvas?.getContext('2d') as CanvasRenderingContext2D;

const tile = Tile.swirl(Tile.above(
  Tile.pure('blue'),
  Tile.pure('red')
))

const raster = rasterize({width, height})(tile);

renderRaster(raster)(ctx);

console.log('done');