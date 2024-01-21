
//Overworld events are here mainly for programing NPCs and directing cutsenes
class OverworldEvent{
    constructor({map, event}){
        this.map = map;
        this.event = event;
    }
    //Event for person to stand in set direction for set amount of time
    stand(resolve){
        const who = this.map.gameObjects[ this.event.who ];
        who.startBehavior({ map: this.map}, {
            type: "stand",
            direction:  this.event.direction,
            time: this.event.time
        })

        //Set up a handler to complete when correct person is done walking, then resolve the event
        const completeHandler = e => {
            if(e.detail.whoId === this.event.who){
                document.removeEventListener("PersonStandComplete", completeHandler);
                resolve();
           }
        }

        document.addEventListener("PersonStandComplete", completeHandler)
    }
    //Event for person to walk in set direction of one 16*16 tile
    walk(resolve){
        const who = this.map.gameObjects[ this.event.who ];
        who.startBehavior({ map: this.map}, {
            type: "walk",
            direction:  this.event.direction,
            retry: true
        })

        //Set up a handler to complete when correct person is done walking, then resolve the event
        const completeHandler = e => {
            if(e.detail.whoId === this.event.who){
                document.removeEventListener("PersonWalkingComplete", completeHandler);
                resolve();
            }
        }

        document.addEventListener("PersonWalkingComplete", completeHandler)
    }
    //Event for text message show up with set text
    textMessage(resolve){

        if(this.event.faceHero){
            const obj = this.map.gameObjects[this.event.faceHero];
            obj.direction = utils.oppositeDirection(this.map.gameObjects["hero"].direction);
        }


        const message = new TextMessage({
            text: this.event.text,
            onComplete: () => resolve()
        })
        message.init( document.querySelector(".game-container") )
    }
    //Event for changing set map
    changeMap(resolve){

        const sceneTransition = new SceneTransition();
        sceneTransition.init(document.querySelector(".game-container"), () => {
            this.map.overworld.startMap(window.OverworldMaps[this.event.map])
            resolve();

            sceneTransition.fadeOut();
        });

      
    }
    //Event to start battle 
    battle(resolve){
        const battle = new Battle({
            onComplete: () => {
                resolve();
            }

        })
        battle.init(document.querySelector(".game-container"));
    }
    //Initialization
    init(){
        return new Promise(resolve => {
            this[this.event.type](resolve)
        })
    }


}