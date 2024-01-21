class OverworldMap{
    constructor(config){
        this.overworld = null
        this.walls = config.walls || {};
        this.cutsceneSpaces = config.cutsceneSpaces || {};
        this.gameObjects = config.gameObjects; 
        //Floor and tiles and stuff
        this.lowerImage = new Image();
        this.lowerImage.src = config.lowerSrc;
        //Rooftop, trees something
        this.upperImage = new Image();
        this.upperImage.src = config.upperSrc;

        this.isCutscenePlaying = false;
    }
    //Draw images
    drawLowerImage(ctx, cameraPerson){
        ctx.drawImage(this.lowerImage,utils.withGrid(10.5) - cameraPerson.x,utils.withGrid(6) - cameraPerson.y)
    }
    drawUpperImage(ctx, cameraPerson){
        ctx.drawImage(this.upperImage,utils.withGrid(10.5) - cameraPerson.x,utils.withGrid(6) - cameraPerson.y)
    }
    //Check if space is currently taken
    isSpaceTaken(currentX,currentY,direction){
        const {x,y} = utils.nextPosition(currentX,currentY,direction);
        return this.walls[`${x}, ${y}`] || false;
    }

    mountObjects(){
        Object.keys(this.gameObjects).forEach(key => {
            
            let object = this.gameObjects[key];
            object.id = key;
            
            object.mount(this);
        })
    }
    //Starts cutscene
    //If cutscene is playing, player cannot make any action
    async startCutscene(events){
        this.isCutscenePlaying = true;
    
        for(let i=0; i<events.length; i++){
            const eventHandler = new OverworldEvent({
                event: events[i],
                map: this,
            })
            await eventHandler.init();
        }
    
        this.isCutscenePlaying = false;

        //Reset NPCs to do their idle behavior
        Object.values(this.gameObjects).forEach(object => object.doBehaviorEvent(this))
    }

    
    //This checks for cutscene that is triggered by interacting with something
    checkForActionCutscene(){
        const hero = this.gameObjects["hero"];
        const nextCords = utils.nextPosition(hero.x, hero.y, hero.direction);
        const match = Object.values(this.gameObjects).find(object =>{
            return `${object.x},${object.y}` === `${nextCords.x},${nextCords.y}`
        });
        if(!this.isCutscenePlaying && match && match.talking.length){
            this.startCutscene(match.talking[0].events)
        }
    }
    //This checks for cutscene that is triggered by walking upon certain tile
    checkForFootstepCutscene(){
        const hero = this.gameObjects["hero"];
        const match = this.cutsceneSpaces[ `${hero.x}, ${hero.y}` ];
        if (!this.isCutscenePlaying && match){
            this.startCutscene(match[0].events)
        }
    }

    //Few functions that work with walls
    addWall(x,y){
        this.walls[`${x}, ${y}`] = true;
    }
    removeWall(x,y){
       delete this.walls[`${x}, ${y}`]
    }
    moveWall(wasX,wasY,direction){
        this.removeWall(wasX,wasY);
        const {x,y} = utils.nextPosition(wasX, wasY, direction);
        this.addWall(x,y);
    }

}

window.OverworldMaps = {
//This is one big cluster of information about map    
DemoRoom: {
    //Map that you will see
    lowerSrc: "Wimages/maps/DemoLower.png",
    upperSrc: "Wimages/maps/DemoUpper.png",
    //Game objects that will be on that map, can be People or objects
    gameObjects: {
        hero: new Person({
            isPlayerControlled: true,
            //Coordinations that shows where the certain object will be
            x: utils.withGrid(5),
            y: utils.withGrid(6),  
          }),
         npcA: new Person({
           x: utils.withGrid(7),
            y: utils.withGrid(9),
           src: "/Wimages/characters/Mon1.png",
          // behaviorLoop: [
           // { type: "stand", direction: "left", time: 800 },
            //{ type: "stand", direction: "up", time: 800 },
            //{ type: "stand", direction: "right", time: 1200 },
            //{ type: "stand", direction: "up", time: 300 },
           //],
           
           //Certain event that will happen if being interacted with
           talking: [
           { 
            events:[
                {type: "textMessage", text: "Im busy...", faceHero: "npcA"},
                {type: "textMessage", text: "GTFO"},
                {   who: "hero", type: "walk", direction: "left"},
            ]
            },
           ]
        }),
        npcB: new Person({
            x: utils.withGrid(2),
             y: utils.withGrid(6),
            src: "/Wimages/characters/Mon2.png",
            //behaviorLoop: [
            //    { type: "walk", direction: "left" },
            //    { type: "stand", direction: "up", time: 800},
            //    { type: "walk", direction: "up" },
            //    { type: "walk", direction: "right" },
            //    { type: "walk", direction: "down" },
            //]
         }),
    },
    //This shows where walls will be
    walls: {
        [utils.asGridCord(7,6)] : true,
        [utils.asGridCord(8,6)] : true,
        [utils.asGridCord(7,7)] : true,
        [utils.asGridCord(8,7)] : true,
        [utils.asGridCord(0,4)] : true,
        [utils.asGridCord(0,5)] : true,
        [utils.asGridCord(0,6)] : true,
        [utils.asGridCord(0,7)] : true,
        [utils.asGridCord(0,8)] : true,
        [utils.asGridCord(0,9)] : true,
        [utils.asGridCord(1,10)] : true,
        [utils.asGridCord(2,10)] : true,
        [utils.asGridCord(3,10)] : true,
        [utils.asGridCord(4,10)] : true,
        [utils.asGridCord(6,10)] : true,
        [utils.asGridCord(7,10)] : true,
        [utils.asGridCord(8,10)] : true,
        [utils.asGridCord(9,10)] : true,
        [utils.asGridCord(10,10)] : true,
        [utils.asGridCord(11,9)] : true,
        [utils.asGridCord(11,8)] : true,
        [utils.asGridCord(11,7)] : true,
        [utils.asGridCord(11,6)] : true,
        [utils.asGridCord(11,5)] : true,
        [utils.asGridCord(11,4)] : true,
        [utils.asGridCord(11,9)] : true,
        [utils.asGridCord(10,3)] : true,
        [utils.asGridCord(9,3)] : true,
        [utils.asGridCord(8,3)] : true,
        [utils.asGridCord(7,3)] : true,
        [utils.asGridCord(6,3)] : true,
        [utils.asGridCord(5,3)] : true,
        [utils.asGridCord(4,3)] : true,
        [utils.asGridCord(3,3)] : true,
        [utils.asGridCord(2,3)] : true,
        [utils.asGridCord(1,3)] : true,



    },
    //Spaces that will trigger cutscenes or certain events like changing a map
    cutsceneSpaces: {
        [utils.asGridCord(2,5)]:[
            {
                events: [
                
                { who: "npcB", type: "walk", direction: "right"},
                { who: "npcB", type: "walk", direction: "up"},
                { who: "npcB", type: "stand", direction: "left", time: 500},
                {type: "textMessage", text: "That is my bed!", faceHero: "npcA"},
                { who: "npcB", type: "walk", direction: "down"},
                { who: "npcB", type: "walk", direction: "left"},
                { who: "npcB", type: "stand", direction: "down", time: 500},
                { who: "hero", type: "walk", direction: "right"},
                { who: "hero", type: "walk", direction: "right"},
                ]



            }
        ],
        [utils.asGridCord(5,10)]:[
            {
                events: [
                    {type:"changeMap", map: "Forest"}

                ]
            }


        ]
    },
},
    Forest:{
lowerSrc: "/Wimages/maps/ForestLower.png",
upperSrc: "/Wimages/maps/ForestUpper.png",
gameObjects:{
    hero: new Person({
        isPlayerControlled: true,
      x: utils.withGrid(33),
      y: utils.withGrid(10),  
    }),
    npcA: new Person({
      x: utils.withGrid(17),
      y: utils.withGrid(15), 
      src: "/Wimages/characters/Mon1.png", 
      talking: [
        { 
         events:[
             {type: "textMessage", text: "Bro, you should not see mee.", faceHero: "npcA"},
             {type: "textMessage", text: "Go away please."},
             {type: "textMessage", text: "Go along like you cannot see me."},
             {type: "textMessage", text: "Shooo."},
             {   who: "hero", type: "walk", direction:  "right"},
         ]
         },
        ]
    
    
    }),
    npcB: new Person({
        x: utils.withGrid(10),
        y: utils.withGrid(15), 
        src: "/Wimages/characters/Mon2.png", 
    }),

},
walls: {
    [utils.asGridCord(31,9)] : true, 
    [utils.asGridCord(30,9)] : true,
    [utils.asGridCord(34,9)] : true,
    [utils.asGridCord(35,9)] : true,
    [utils.asGridCord(36,8)] : true,
    [utils.asGridCord(36,7)] : true,     




},
cutsceneSpaces: {
    [utils.asGridCord(32,9)]:[
        {
            events: [
                {type:"changeMap", map: "DemoRoom"},
            
            ]
        }
    ],      
    [utils.asGridCord(33,9)]:[
        {
            events: [
                {type:"changeMap", map: "DemoRoom"},
  

            ]
        }
    ],
    [utils.asGridCord(17,17)]: [
    {
        events: [
            {who: "npcA", type: "walk", direction: "left"},
            {who: "npcA", type: "walk", direction: "left"},
            {who: "npcA", type: "walk", direction: "down"},
            {who: "npcA", type: "walk", direction: "down"},
            {who: "npcA", type: "walk", direction: "right"},
            {who: "npcA", type: "stand", direction: "left", time: 500},
            {type: "textMessage", text: "HA, you did not expect me did ya boy.", faceHero: "npcA"},
            {type: "textMessage", text: "Well, nice seeing ya, see ya.", faceHero: "npcA"},
            {who: "npcA", type: "walk", direction: "left"},
            {who: "npcA", type: "walk", direction: "up"},
            {who: "npcA", type: "walk", direction: "up"},
            {who: "npcA", type: "walk", direction: "right"},
            {who: "npcA", type: "walk", direction: "right"},
            {who: "npcA", type: "stand", direction: "down", time: 500},

        ],
        
    }
    ],
    [utils.asGridCord(17,18)]: [
        {
            events: [
                {who: "npcA", type: "walk", direction: "left"},
                {who: "npcA", type: "walk", direction: "left"},
                {who: "npcA", type: "walk", direction: "down"},
                {who: "npcA", type: "walk", direction: "down"},
                {who: "npcA", type: "walk", direction: "down"},
                {who: "npcA", type: "walk", direction: "right"},
                {who: "npcA", type: "stand", direction: "left", time: 500},
                {type: "textMessage", text: "HA, you did not expect me did ya boy.", faceHero: "npcA"},
                {type: "textMessage", text: "Well, nice seeing ya, see ya.", faceHero: "npcA"},
                {who: "npcA", type: "walk", direction: "left"},
                {who: "npcA", type: "walk", direction: "up"},
                {who: "npcA", type: "walk", direction: "up"},
                {who: "npcA", type: "walk", direction: "up"},
                {who: "npcA", type: "walk", direction: "right"},
                {who: "npcA", type: "walk", direction: "right"},
                {who: "npcA", type: "stand", direction: "down", time: 500},
    
            ],
            
        }
        ]
    
},




    },
}