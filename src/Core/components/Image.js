import * as PIXI from "pixi.js";

export default class Image {
    constructor(texture) {
        this.image = new PIXI.Sprite(texture);
        this.image.interactive = true;
        this.image.buttonMode = true;

        this.helpers = new PIXI.Sprite();

        this.container = new PIXI.Container();
        this.container.addChild(this.image);
        this.createTransform(this.image);
        PIXI.SCALE_MODES.DEFAULT = PIXI.SCALE_MODES.NEAREST;
        // this.image
        // .on('click', event => console.log(event))
        // .on('pointerdown', event => console.log(event))
        // .on('pointerup', event => console.log(event))
        // .on('mouseover', event => console.log(event))
    }

    _createSquare(x, y) {
        let texture = PIXI.Texture.WHITE;
        let graphics = new PIXI.Graphics();

        graphics.lineStyle(1, 0x00cce9);

// draw a rectangle
        // texture.border = "1px solid #000";
        const square = new PIXI.Sprite(texture);
        // square.tint = 0xff0000;
        // square.factor = 0.5;
        square.anchor.set(0.5);
        square.position.set(x, y);
        square.width = 10;
        square.height = 10;
        graphics.beginFill(0xFF0000, 1);
        graphics.drawRect(-7, -7, 16, 16);
        graphics.endFill();
        square.addChild(graphics);
        // square.isMask = true;
        // console.log(square);
        return square;
    }

    createTransform = obj => {
        const prevAnchor = obj.anchor;
        obj.anchor.set(0, 0);
        const {x, y} = obj.position;
        const {width, height} = obj;
        obj.anchor.set(prevAnchor.x, prevAnchor.y);


        this.squares = [
            this._createSquare(x, y),
            this._createSquare(x + width / 2, y),
            this._createSquare(width + x, y),
            this._createSquare(x, height / 2 + y),
            this._createSquare(width + x, height / 2 + y),
            this._createSquare(x, height + y),
            this._createSquare(x + width / 2, height + y),
            this._createSquare(width + x, height + y),
        ];

        this.squares.forEach((i, index) => {
            i.id = index;
            if (index === 1 || index === 6)
                i.moving = -1;
            else if (index === 3 || index === 4) {
                i.moving = 1;
            } else i.moving = 0;
            i.opposite = this.squares[7 - index];
        });
        this.squares.forEach((s) => {
            this.helpers.addChild(s);
            this.addInteraction(s);
        });
        this.container.addChild(this.helpers);
    };

    addInteraction = (obj) => {
        obj.interactive = true;
        obj
            .on('pointerdown', onDragStart_)
            .on('pointerup', onDragEnd_)
            .on('pointerupoutside', onDragEnd_)
            .on('pointermove', onDragMove_);

        const sprite = this.image;
        const {updateSquarePosition, createTransform, helpers, squares} = this;

        function onDragStart_(event) {
            const obj = event.currentTarget;
            console.log({x: obj.opposite.position.x, y: obj.opposite.position.y})
            // sprite.pivot.set(obj.opposite.position.x - sprite.width - sprite.x, obj.opposite.position.y - sprite.y - sprite.height);
            // console.log(obj.opposite);
            // sprite.pivot.set((obj.opposite.position.x), (obj.opposite.position.y));

            // sprite.position.set((obj.opposite.position.x), (obj.opposite.position.y));
            // sprite.anchor.set(1);

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
            obj.dragging = 0;
            obj.dragData = null;
            // set the interaction data to null
        }

        function onDragMove_(event) {
            const obj = event.currentTarget;
            const data = obj.dragData; // it can be different pointer!
            if (!obj.dragging) return;
            const dragPointerEnd = data.getLocalPosition(obj.parent);
            // sprite.pivot.set(-(obj.opposite.position.x), -(obj.opposite.position.y));


            // sprite.anchor.set(obj.id > 3 ? 1 : -1);
            let x = obj.dragObjStart.x + (dragPointerEnd.x - obj.dragPointerStart.x);
            let y = obj.dragObjStart.y + (dragPointerEnd.y - obj.dragPointerStart.y);

            // sprite.anchor.set(1);
            // sprite.scale.set(dragPointerEnd.x - sprite.position.x, dragPointerEnd.y - sprite.position.y)
            sprite.scale.set(1);

            // sprite.scale.set(obj.id > 3 ? 1 : -1);

            if (!obj.moving) {
                sprite.position.set((obj.opposite.position.x), (obj.opposite.position.y));
                obj.position.set(x, y);

                switch (obj.id) {
                    case 0:
                        sprite.anchor.set(1);
                        sprite.scale.set(-1);
                        helpers.anchor.set(1);
                        break;
                    case 2:
                        sprite.anchor.set(0, 1);
                        sprite.scale.set(1, -1);
                        helpers.anchor.set(0, 1);
                        break;
                    case 5:
                        sprite.anchor.set(1, 0);
                        sprite.scale.set(-1, 1);
                        helpers.anchor.set(1, 0);

                        break;
                    case 7:
                        sprite.anchor.set(0);
                        sprite.scale.set(1);
                        helpers.anchor.set(0);
                        break;
                }

                sprite.height = dragPointerEnd.y - sprite.position.y;
                sprite.width = dragPointerEnd.x - sprite.position.x;
            } else if (obj.moving === 1) {
                // sprite.height = dragPointerEnd.y - sprite.position.y;
                obj.position.x = x;

                if (obj.id === 4) {
                    sprite.position.set((squares[0].position.x), (squares[0].position.y));
                    sprite.anchor.set(0, 0);     /* 0 = top, 0.5 = center, 1 = bottom */
                    sprite.scale.x *= 1;
                    sprite.scale.y *= 1;
                } else {
                    sprite.position.set((squares[2].position.x), (squares[2].position.y));
                    sprite.anchor.y = 0;     /* 0 = top, 0.5 = center, 1 = bottom */
                    sprite.anchor.x = 1;     /* 0 = top, 0.5 = center, 1 = bottom */
                    sprite.scale.x *= -1;    /* flip vertically */
                }
                sprite.height = 2 * (obj.position.y - sprite.position.y);
                sprite.width = dragPointerEnd.x - sprite.position.x;

                // sprite.scale.y = 1;    /* flip vertically */
            } else if (obj.moving === -1) {

                if (obj.id === 1) {
                    sprite.position.set((squares[5].position.x), (squares[5].position.y));
                    sprite.anchor.y = 1;     /* 0 = top, 0.5 = center, 1 = bottom */
                    sprite.anchor.x = 0;     /* 0 = top, 0.5 = center, 1 = bottom */
                    sprite.scale.y *= -1;    /* flip vertically */

                    console.log(squares[5].position.x)
                } else {
                    sprite.position.set((squares[0].position.x), (squares[0].position.y));
                    sprite.anchor.set(0, 0);     /* 0 = top, 0.5 = center, 1 = bottom */
                    sprite.scale.x *= 1;
                    sprite.scale.y *= 1;
                }

                obj.position.y = y;

                sprite.height = dragPointerEnd.y - sprite.position.y;
                // sprite.width = dragPointerEnd.x - sprite.position.x;

                // sprite.anchor.y = 0;     /* 0 = top, 0.5 = center, 1 = bottom */
                // sprite.anchor.x = 1;     /* 0 = top, 0.5 = center, 1 = bottom */
                // sprite.scale.x = -1;    /* flip vertically */
            }
            // createTransform(sprite);
            updateSquarePosition(sprite, obj.id);
        }
    }

    updateSquarePosition = (sprite, id) => {
        // const {x, y} = this.squares[0];

        const {width, height} = sprite;

        const x = 0,
            y = 0;
        // sprite.anchor.set(0, 0);
        // const {x, y} = sprite.position;
        // const prevAnchor = sprite.anchor;
        // console.log({
        //     x: prevAnchor.x,
        //     y: prevAnchor.y
        // })
        // this.helpers.anchor.set(1);

        console.log({
            x: this.helpers.anchor,
            y: this.helpers.height,
            // x: sprite.position.x,
            // y: sprite.position.y,
            // width: sprite.width,
            // height: sprite.height
        })

        // console.log({
        //     x: sprite.position.x,
        //     y: sprite.position.y
        // })
        // sprite.anchor.set(1, 1);
        // sprite.anchor.set(0, 0);
        // const {x, y} = sprite.position;
        // const {width, height} = sprite;
        // sprite.anchor.set(prevAnchor.x, prevAnchor.y);

        const getPos = (index) => {
            switch (index) {
                case 0:
                    return {x, y}
                case 1:
                    return {x: width / 2 + x, y}
                case 2:
                    return {x: width + x, y}
                case 3:
                    return {x, y: height / 2 + y}
                case 4:
                    return {x: width + x, y: height / 2 + y}
                case 5:
                    return {x, y: height + y}
                case 6:
                    return {x: x + width / 2, y: height + y}
                case 7:
                    return {x: width + x, y: height + y}
                default:
                    return {x, y};
            }
        }
        // console.log({
        //     x: sprite.position.x,
        //     y: sprite.position.y
        // })
        // this.squares[0].position.set(sprite.position.x, sprite.position.y);
        this.squares.forEach((i, index) => {
            if (index !== id) {
                const pos = getPos(index);
                // debugger;
                // i.anchor.set(sprite.anchor.x, sprite.anchor.y);
                i.position.set(pos.x, pos.y);
            }
        })
    }
}