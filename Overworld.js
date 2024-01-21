class Overworld{
constructor(config){
this.element = config.element;
 this.canvas = this.element.querySelector(".game-canvas");
 this.ctx = this.canvas.getContext("2d");
 this.map = null;
}

//Game loop, it refreshes frames
startGameLoop(){
    const step = () => {

        this.ctx.clearRect(0,0, this.canvas.width, this.canvas.height);

        //Establish the camera person
        const cameraPerson = this.map.gameObjects.hero;
        
        //Update all objects
        Object.values(this.map.gameObjects).forEach(object =>{
        object.update({
            arrow: this.directionInput.direction,
            map : this.map,
            })
        })
        //Draw Lower layer
        this.map.drawLowerImage(this.ctx, cameraPerson);

        //Draw Game Objects
        Object.values(this.map.gameObjects).sort((a,b) =>{
         return a.y -b.y;
        }).forEach(object =>{
            object.sprite.draw(this.ctx, cameraPerson);
        })


        //Draw Upper layer
        this.map.drawUpperImage(this.ctx, cameraPerson);


        requestAnimationFrame(() => {
            step();
        })
    }
    step();
}
// Checks if there is person that can be interacted with 
bindActionInput(){
    new KeyPressListener("Enter", () =>{
        //Is there person to talk to?
        this.map.checkForActionCutscene();
    })
}

//Checks if there is some cutscene on place that he is standing on
bindHeroPositionCheck(){
    document.addEventListener("PersonWalkingComplete", e =>{
        if (e.detail.whoId === "hero"){
           this.map.checkForFootstepCutscene();
        }
    })
}
//Starts map
startMap(mapConfig){
    this.map = new OverworldMap(mapConfig);
   this.map.overworld = this;
    this.map.mountObjects();

}
//Initializes stuff before starting everything
 init(){
    this.startMap(window.OverworldMaps.DemoRoom)
  
   this.bindActionInput();
   this.bindHeroPositionCheck();
  
   this.directionInput = new DirectionInput();
   this.directionInput.init();
    this.startGameLoop();

    //I am using this to test each new event 
   this.map.startCutscene([

    //Started working on battle event but it is not done yet
     //{type: "battle",}

    ])

 }

}