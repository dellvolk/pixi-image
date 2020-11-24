import * as PIXI from "pixi.js";
import Image from "./components/Image";

export default class Builder {
    constructor(ref) {
        this.app = new PIXI.Application({
            backgroundColor: 0xffffff,
            preserveDrawingBuffer: true
        });
        console.log(this.app.stage)
        ref.current.appendChild(this.app.view);
    }

    setImage = (src, layer = this.app.stage) => {
        // const src = 'https://www.publicdomainpictures.net/pictures/320000/nahled/background-image.png'
        const texture = PIXI.Texture.from(src);

        createBunny(200, 200);
        function createBunny(x, y) {
            const image = new Image(texture);
            console.log(image);
            const bunny = image.container;

            bunny.x = x;
            bunny.y = y;

            layer.addChild(bunny);
            return bunny;
        }

    };

}