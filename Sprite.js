class Sprite{
    constructor(config){


        //Set up the  image
        this.image =  new Image();
        this.image.src = config.src;
        this.image.onload = () => {
            this.isLoaded = true;
        }


        this.shadow = new Image();
        this.useShadow = true;
        this.shadow.src = "images/characters/shadow.png";
        this.shadow.onload = () =>{
            this.isShadowLoaded = true;
        }
 
        //Configure Animation & Initial State
        this.animations = config.animations || {
            "idle-down": [[0,0]],
            "idle-right": [[0,1]],
            "idle-up": [[0,2]],
            "idle-left":[[0,3]],
            "walk-down": [ [1,0], [2,0], [3,0], [0,0]],
            "walk-right": [[1,1], [2,1], [3,1], [0,1]],
            "walk-up": [[1,2], [2,2], [3,2], [0,2]],
            "walk-left":[[0,3], [3,3], [2,3], [1,3]],
        }
        this.currentAnimations = "idle-down";// config.currentAnimation || "idleDown";
        this.currentAnimationFrame = 0;

        this.animationFrameLimit = config.animationFrameLimit || 16;
        this.animationFrameProgress = this.animationFrameLimit;

        //Reference the game object
        this.gameObject = config.gameObject;
    }

    get frame(){
        return this.animations[this.currentAnimations][this.currentAnimationFrame];
    }
    
    setAnimation(key){
        if(this.currentAnimations !== key){
            this.currentAnimations = key;
            this.currentAnimationFrame = 0;
            this.animationFrameProgress = this.animationFrameLimit;
        }
    }

    updateAnimationProgress(){
        //Downtick frame progress
        if(this.animationFrameProgress > 0){
            this.animationFrameProgress -= 1;
            return;   
        }
        //Reset the counter
        this.animationFrameProgress = this.animationFrameLimit;
        this.currentAnimationFrame += 1;

        if(this.frame === undefined){
            this.currentAnimationFrame = 0;
        }
    }

    draw(ctx, cameraPerson){
        const x = this.gameObject.x - 8 + utils.withGrid(10.5) - cameraPerson.x;
        const y = this.gameObject.y - 18 + utils.withGrid(6) - cameraPerson.y;
        //Sprites has to be cut the same
        this.isShadowLoaded && ctx.drawImage(this.shadow, x, y)

        const [frameX, frameY] = this.frame;

        this.isLoaded && ctx.drawImage(this.image,
            frameX * 32, frameY * 32,
           32,32,
            x,y,
            32,32
        )
        this.updateAnimationProgress();
    }

}