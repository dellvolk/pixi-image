import * as PIXI from "pixi.js";
import Image from "./components/Image";

export default class Builder {
    constructor(ref) {
        this.app = new PIXI.Application({
            backgroundColor: 0xffffff,
            preserveDrawingBuffer: true
        });
        console.log("++++")
        ref.current.appendChild(this.app.view);
    }

    setImage = (src, layer = this.app.stage) => {
        // const src = 'https://www.publicdomainpictures.net/pictures/320000/nahled/background-image.png'
        const texture = PIXI.Texture.from(src);

// Scale mode for pixelation
        texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;

        function createSquare(x, y) {
            let texture = PIXI.Texture.WHITE;
            let graphics = new PIXI.Graphics();

            // graphics.beginFill(0xFFFF00);

// set the line style to have a width of 5 and set the color to red
//             graphics.anchor.set(0.5);
            graphics.lineStyle(1, 0x00cce9);

// draw a rectangle
            // texture.border = "1px solid #000";
            const square = new PIXI.Sprite(texture);
            // square.tint = 0xff0000;
            square.factor = 0.5;
            square.anchor.set(0.5);
            square.position.set(x, y);
            square.width = 10;
            square.height = 10;
            graphics.beginFill(0xFF0000, 1);
            graphics.drawRect(-7, -7, 16, 16);
            graphics.endFill();
            square.addChild(graphics);
            square.isMask = true;
            // console.log(square);
            return square;
        }

        // const quad = squares.map((s) => s.position);
        let squares;
        PIXI.SCALE_MODES.DEFAULT = PIXI.SCALE_MODES.NEAREST;
        const createTransform = obj => {
            console.log(obj.position.x);
            // console.log(obj.width);
            const {x, y} = obj.position;
            const {width, height} = obj;
            // const data = obj.getLocalPosition(this.app.stage);
            console.log("x", x);
            console.log("y", y);
            // console.log("w", width);
            // console.log("h", height);

            squares = [
                createSquare(x, y),
                createSquare(x + width / 2, y),
                createSquare(width + x, y),
                createSquare(width + x, height / 2 + y),
                createSquare(x, height + y),
                createSquare(x, height / 2 + y),
                createSquare(width + x, height + y),
                createSquare(x + width / 2, height + y),
            ];

            squares.forEach((s) => {
                this.app.stage.addChild(s);
                addInteraction(s);
            });
        };

        const sprite = createBunny(200, 200);

        function createBunny(x, y) {
            // create our little bunny friend..
            // const bunny = new Editor.Image(texture).image;
            const image = new Image(texture);
            console.log(image);
            const bunny = image.container;

            bunny.x = x;
            bunny.y = y;

            // createTransform(bunny);

            // console.log(bunny);

            // add it to the stage
            layer.addChild(bunny);
            return bunny;
        }

        function addInteraction(obj) {
            obj.interactive = true;
            obj
                .on('pointerdown', onDragStart_)
                .on('pointerup', onDragEnd_)
                .on('pointerupoutside', onDragEnd_)
                .on('pointermove', onDragMove_);
        }

        function onDragStart_(event) {
            const obj = event.currentTarget;
            console.log(obj)
            obj.dragData = event.data;
            obj.dragging = 1;
            obj.dragPointerStart = event.data.getLocalPosition(obj.parent);
            obj.dragObjStart = new PIXI.Point();
            obj.dragObjStart.copyFrom(obj.position);
            obj.dragGlobalStart = new PIXI.Point();
            obj.dragGlobalStart.copyFrom(event.data.global);
        }

        function onDragEnd_(event) {
            const obj = event.currentTarget;
            console.log(obj)
            if (obj.dragging === 1) {
                // toggle(obj);
            } else {
                // snap(obj);
            }
            obj.dragging = 0;
            obj.dragData = null;
            // set the interaction data to null
        }

        function onDragMove_(event) {
            const obj = event.currentTarget;
            const data = obj.dragData; // it can be different pointer!
            if (!obj.dragging) return;
            const dragPointerEnd = data.getLocalPosition(obj.parent);
            // sprite.width = dragPointerEnd.x;

            let x = obj.dragObjStart.x + (dragPointerEnd.x - obj.dragPointerStart.x);
            let y = obj.dragObjStart.y + (dragPointerEnd.y - obj.dragPointerStart.y);
            obj.position.set(x, y);

            sprite.height = dragPointerEnd.y - sprite.position.y;
            sprite.width = dragPointerEnd.x - sprite.position.x;

            // sprite.destroy({
            //     children: true,
            //     texture: true,
            //     baseTexture: true,
            // });

            // sprite.scale.set(dragPointerEnd.x, dragPointerEnd.y);
            console.log({
                x: dragPointerEnd.x,
                y: dragPointerEnd.y,
            })
        }

        function onDragStart(event) {
            this.data = event.data;
            const newPivot = this.data.getLocalPosition(this);
            this.pivot.set(newPivot.x, newPivot.y);
            this.alpha = 0.5;
            this.dragging = true;
            const newPosition = this.data.getLocalPosition(this.parent);
            this.x = newPosition.x;
            this.y = newPosition.y;
        }

        function onDragEnd() {
            this.alpha = 1;
            this.dragging = false;
            // set the interaction data to null
            this.data = null;
        }

        function onDragMove() {
            if (this.dragging) {
                const newPosition = this.data.getLocalPosition(this.parent);
                this.x = newPosition.x;
                this.y = newPosition.y;
            }
        }

    };

}