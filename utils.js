const utils = {
    //Changes number to tile format
    withGrid(n){
        return n * 16;
    },
    //Makes coordination into exact tile
    asGridCord(x,y){
        return `${x*16}, ${y*16}`
    },
    //Lets us know what is in front of us
    nextPosition(initialX, initialY, direction){
        let x = initialX;
        let y = initialY;
        const size = 16;
        if(direction === "left"){
            x -= size;
        }
        else if(direction === "right"){
           x += size; 
        }
        else if(direction === "up"){
            y -= size;
        }
        else  if (direction === "down"){
            y += size;
        }
        return {x,y};
    },
    //It can allow us to make something look at us
    oppositeDirection(direction){
        if(direction === "left"){return "right"}
        if(direction === "right"){return "left"}
        if(direction === "up"){return "down"}
        if(direction === "down"){return "up"}

    },



    emitEvent(name, detail){
        const event = new CustomEvent(name, {
            detail
        });
        document.dispatchEvent(event);
    }
}