class Battle{
    constructor(){

    }

    createElement(){
        this.element = document.createElement("div");
        this.element.classList.add("Battle");
        this.element.innerHTML = (`
        <div class="Battle_hero">
        <img src="${'/Wimages/characters/demo2.png'}" alt="Hero" />
        </div>
        <div class="Battle_enemy">
        <img src="${'/Wimages/characters/Mon1.png'}" alt="Enemy" />
        </div>
        `)
    }

    init(container){
        this.createElement();
        container.appendChild(this.element);
    }




}