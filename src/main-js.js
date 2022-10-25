

const plainTile = (color) => {
    // render to a canvas
    // convert to a 2d array of pixles, having that color
    // conver color to hex, save that
    return {
        _tag: 'plain',
        color
    };
};

const clockwise = (tile) => ({
    _tag: 'clockwise',
    tile
});

const counterclockwise = (tile) => (
    clockwise(clockwise(clockwise(tile)));
);

const flipH = (tile) => ({
    _tag: 'flipH',
    tile
});

const beside = (tileLeft, tileRight) =>({
    _tag: 'beside',
    tileLeft,
    tileRight
});

const interpretToSVG = (tile) => {
    switch(tile._tag) {
        case 'plain': {
            const {color} = tile;
            return `
                <rect x="0" y="0" width="1" height="1" fill ="${color}" />
            `
        }
        case 'flipH': {
            const {tile: tileToFlip} = tile;
            
            return `
                <g = transform="scale(-1, 1)">
                ${interpretToSVG(tileToFlip)}
                </g>
            `
        }

        case 'clockwise': {
            const {tile: tileToRotate} = tile;
            
            return `
                <g = transform="rotate(90)">
                ${interpretToSVG(tileToRotate)}
                </g>
            `
        }
        case 'beside': {

        }
    }
}


const someTile = flipH(
    beside(
        plainTile('red'),
        plainTile('green')
    )
);

const output = interpretToSVG(someTile);