import kaboom from "https://kaboomjs.com/lib/0.5.1/kaboom.mjs";

const k = kaboom({
    width: 320, 
    height: 240, 
    scale: 2, 
    clearColor: [0, 0, 0, 1]
})

function movement(){
    const {
        vec2, 
        dt
    } = k
    const direction = vec2(0, 0)
    const speed = 16
    let accumulatedTime = 0

    return {
        add() {
            this.movement.right(); 
        },
        update(){
            accumulatedTime+=dt()
            if(accumulatedTime < 0.15){
                return
            }
            accumulatedTime = 0

            if(!this.pos)
            {
                console.error('missing pos component')
                return
            }
            this.pos.x += direction.x * speed
            this.pos.y += direction.y * speed
        }, 
        movement: {
            left() {
                direction.x = -1
                direction.y = 0
            },
            right() {
                direction.x = 1
                direction.y = 0
            },
            up() {
                direction.x = 0
                direction.y = -1
            }, 
            down(){
                direction.x = 0
                direction.y = 1
            }
        }
    }
}

function controls() {
    const {
        keyPress
    } =k
    return {
        add() {
            keyPress('left', () => {
                if(!this.movement){
                    console.error("missing movement componemnt")
                    return
                }

                this.movement.left()
            })

            keyPress('right', () => {
                this.movement.right()
            })

            keyPress('down', () => {
                this.movement.down()
            })

            keyPress('up', () => {
                this.movement.up()
            })

        }
    }
}
function getRandomPos(tileW = 16, tileH = 16) {
    const {
        vec2, 
        width,
        height, 
        rand,
    } = k
    const tx = Math.floor(width() / tileW)
    const ty = Math.floor(height() / tileH)

    const x = (Math.floor(rand(0, tx)) * tileW) + (tileW * 0.5) 
    const y = (Math.floor(rand(0, ty)) * tileH) + (tileH * 0.5) 

    return vec2(x, y)
}

function spawn() {
    const {
        wait, 
        add, 
        pos,
        rect,
        color, 
        origin
    } = k
    return {
        spawn() {
            wait(1, () => {
                add([
                    pos(getRandomPos()), 
                    rect(16, 16), 
                    color(0, 0, 1, 1), 
                    origin('center'), 
                    'food'
                ])
            })
        }
    }
}

function Snake() {
    const {
        add, 
        pos,
        rect,
        color,
        origin, 
        overlaps,
        destroy
    } = k

   const spawner = add([
        spawn()
    ])

    add([
        pos(8, 8), 
        rect(16, 16),
        color(0, 1, 0),
        origin('center'),
        movement(), 
        controls(), 
        'head'
    ])

    spawner.spawn(); 

    overlaps('head', 'food', (head, food) => {
        destroy(food)
    })
}
k.scene('snake', Snake)

k.start('snake')
