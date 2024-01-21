class Battle{
    constructor(){
        this.combatants = {
            "player1": new Combatant({
                ...Weapons.p001,
                team: "player",
                hp: 50,
                maxHp: 50, 
                xp: 0,
                level: 1,
                status: null,
            }, this),
            "enemy1": new Combatant({
                ...Weapons.e001,
                team: "enemy",
                hp: 50,
                maxHp: 50, 
                xp: 0,
                level: 1,
                status: null,
            }, this),
            "enemy2": new Combatant({
                ...Weapons.e002,
                team: "enemy",
                hp: 50,
                maxHp: 50, 
                xp: 0,
                level: 1,
                status: null,
            }, this),
        }
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

        Object.keys(this.combatants).forEach(key =>{
            let combatant = this.combatants[key];
            combatant.id = key;
            combatant.init(this.element)
        })
    }




}