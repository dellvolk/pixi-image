import * as PIXI from "pixi.js";

export default class Builder {
    constructor(ref) {
        this.app = new PIXI.Application({
            backgroundColor: 0xffffff,
            preserveDrawingBuffer: true
        });
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
            graphics.beginFill(0xFFFFFF, 0.5);
            graphics.drawRect(-7, -7, 16, 16);
            graphics.endFill();
            square.addChild(graphics);
            square.isMask = true;
            console.log(square);
            return square;
        }

        // const squares = [
        //     createSquare(w - 150, h - 150),
        //     createSquare(w + 150, h - 150),
        //     createSquare(w + 150, h + 150),
        //     createSquare(w - 150, h + 150),
        // ];

        // const quad = squares.map((s) => s.position);
        let squares;
        // PIXI.SCALE_MODES.DEFAULT = PIXI.SCALE_MODES.NEAREST;
        const createTransform = obj => {
            console.log(obj.position);
            console.log(obj.width);
            const {x, y, width, height} = obj;
            console.log("x", x);
            console.log("y", y);
            console.log("w", width);
            console.log("h", height);
            // app.stage.addChild(createSquare(x, y))
            // app.stage.addChild(createSquare(x+width, y))
            // app.stage.addChild(createSquare(x, y+height))
            // app.stage.addChild(createSquare(x+width, y+height))
            squares = [
                createSquare(0, 0),
                createSquare(width / 2, 0),
                createSquare(width, 0),
                createSquare(width, height / 2),
                createSquare(0, height),
                createSquare(0, height / 2),
                createSquare(width, height),
                createSquare(width / 2, height),
            ];

            squares.forEach((s) => {
                obj.addChild(s);
            });


            squares.forEach((s) => {
                addInteraction(s);
            });
        };

        const sprite = createBunny(200, 200);

        function createBunny(x, y) {
            // create our little bunny friend..
            const bunny = new PIXI.Sprite(texture);

            bunny.interactive = true;

            bunny.buttonMode = true;

            // bunny.anchor.set(0.5);

            // bunny
            //     .on('pointerdown', onDragStart)
            //     .on('pointerup', onDragEnd)
            //     .on('pointerupoutside', onDragEnd)
            //     .on('pointermove', onDragMove);

            // scale params
            createTransform(bunny);

            bunny.x = x;
            bunny.y = y;

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
            if (!obj.dragging) return;
            // console.log(obj.dragging)
            const data = obj.dragData; // it can be different pointer!
            if (obj.dragging === 1) {
                // click or drag?
                if (Math.abs(data.global.x - obj.dragGlobalStart.x)
                    + Math.abs(data.global.y - obj.dragGlobalStart.y) >= 3) {
                    // DRAG
                    obj.dragging = 2;
                }
            }
            if (obj.dragging === 2) {
                const dragPointerEnd = data.getLocalPosition(obj.parent);
                // DRAG
                let x = obj.dragObjStart.x + (dragPointerEnd.x - obj.dragPointerStart.x);
                let y = obj.dragObjStart.y + (dragPointerEnd.y - obj.dragPointerStart.y);
                // console.log({x, y})
                console.log(dragPointerEnd);
                // sprite.resize(dragPointerEnd.x, dragPointerEnd.y);
                sprite.width = dragPointerEnd.x;
                sprite.height = dragPointerEnd.y;
                // obj.parent.anchor.setTo(0.5, 0.5);
                obj.position.set(x, y);
            }
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