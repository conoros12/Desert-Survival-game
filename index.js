let canvas;
let context;

let fpsInterval = 1000 /30; //the denominator is frames per second
let now;
let then = Date.now();

let xhttp;


//32 x 20
let background = [
    [416,112,113,114,115,116,117,118,119,120,121,122,123,123,57,58,59,60,61,62,62,419,416,417,10,11,2,3,4,5,62,419],
    [444,445,141,142,143,144,145,146,147,148,149,150,151,84,85,86,87,88,89,90,446,447,444,445,38,39,30,31,32,33,446,447,448],
    [376,377,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,396,395,354,355,-1,-1,-1,-1,-1,-1,370,341],
    [376,377,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,292,293,-1,-1,-1,396,395,352,353,-1,-1,-1,-1,-1,-1,370,397],
    [376,377,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,320,321,-1,-1,-1,396,395,350,351,-1,-1,-1,-1,-1,-1,370,399],
    [376,377,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,360,361,362,363,-1,-1,-1,-1,-1,-1,368,399],
    [376,377,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,388,389,390,391,-1,-1,-1,-1,-1,-1,366,399],
    [404,405,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,364,365],
    [432,433,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,392,393],
    [460,461,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,420,421],
    [488,489,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,242,243,-1,-1,-1,448,449],
    [516,517,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,270,271,-1,-1,-1,476,477],
    [546,545,-1,-1,304,305,305,305,306,305,306,305,306,305,305,306,307,-1,-1,-1,-1,-1,-1,298,299,-1,-1,-1,-1,-1,504,505],
    [350,351,-1,-1,332,333,202,202,202,202,202,202,202,202,202,334,335,-1,-1,-1,-1,-1,-1,326,327,-1,-1,-1,-1,-1,532,533],
    [350,351,-1,-1,360,399,416,417,61,62,63,64,65,66,67,362,363,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,370,399],
    [350,351,-1,-1,360,399,444,445,89,90,91,92,93,94,95,95,391,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,364,399],
    [350,351,-1,-1,360,399,384,383,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,368,399],
    [350,351,-1,-1,360,399,384,383,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,370,399],
    [472,473,169,224,474,399,472,473,172,172,172,172,172,172,172,229,228,227,226,225,177,176,175,174,173,172,171,170,169,224,474,475],
    [500,196,196,501,502,503,500,501,202,202,202,202,202,202,202,257,256,255,254,253,204,203,202,201,200,199,198,197,196,501,502,503],
]

let solid_tiles = new Set([
    61, 62, 63, 64, 65, 66, 67,
    89, 90, 91, 92, 93, 94, 95,
    202,
    242, 243,
    270, 271,
    292, 293,
    298, 299,
    304, 305, 306, 307,
    320, 321,
    326, 327,
    332, 333, 334, 335,
    350, 351, 352, 353, 354,
    360, 361, 362, 363,
    383, 384,
    388, 389, 390, 391,
    395, 396, 399,
    416, 417,
    444, 445
]);



let tilesPerRow = 28;
let tilesPerColumn = 20;
let tileSize = 16;

let request_id;

//initialize score variable
let score = 0;

//player health
let playerHealth = 100;
let maxPlayerHealth = 100;

//game over
let isgame_over = false;


//Add in background matrix + the no. of tiles/ row + tiles size + background image.


//Code for player
let player = {
    x: 0,
    y: 0,
    width: 64,
    height: 64,
    frameX: 0,
    frameY: 0,
    xChange: 0,
    yChange: 0,
    attackFrameWidth: 64,
    attackFrameHeight: 64,
    is_dead: false,
    death_frame: 0,
    deathframe_delay: 0
};

//Introduce multiple enemies moving randomly.
let enemies = [];

//introduce pickups
let pickups = []

// add iamges for the pickups
let coin_image = new Image();

let heartpickup_image = new Image();

//add in player image for walking
let walkingPlayerImage = new Image();

//add in player image for idle
let idlePlayerImage = new Image();

//add in player image for attack
let attackingPlayerImage = new Image();

//add in enemy image for walking
let walkingEnemyImage = new Image();

//add in health bar
let healthbarimage = new Image();

//player death
let playerdeath_image = new Image();

//enemy death
let enemydeathimage = new Image();

//enemy attacking
let enemy_attackimage = new Image();

//background image
let backgroundImage = new Image();

//background music
let backgroundMusic = new Audio();

//get rid of enemy jitters
let enemyFrameCounter = 0;





//moving
let moveLeft = false;
let moveUp = false;
let moveRight = false;
let moveDown = false;

//attacking
let isAttacking = false;
let attackFrame = 0;
let attackCooldown = 0;

//taking damage
let damagecooldown = 0;

document.addEventListener("DOMContentLoaded", init, false);

function init() {
    canvas = document.querySelector("canvas");
    context = canvas.getContext("2d");

    player.x = canvas.width / 2;
    player.y = 100;

    window.addEventListener("keydown", activate, false );
    window.addEventListener("keyup", deactivate, false);


    //Use the load assets function to load, player images and background images. Even audio.
    load_assets([
        {"var": walkingPlayerImage, "url": "static/images/Orc3/orc3_walk/orc3_walk_full.png"},
        {"var": idlePlayerImage, "url": "static/images/Orc3/orc3_idle/orc3_idle_full.png"},
        {"var": attackingPlayerImage, "url": "static/images/Orc3/orc3_walk_attack/orc3_walk_attack_full.png"},
        {"var": walkingEnemyImage, "url": "static/images/Vampires1/Walk/Vampires1_Walk_full.png"},
        {"var":healthbarimage, "url": "static/images/items/hearts16x16.png"},
        {"var": enemydeathimage, "url": "static/images/Vampires1/Death/Vampires1_Death_full.png"},
        {"var": coin_image, "url": "static/images/items/gold.png"},
        {"var": heartpickup_image, "url": "static/images/items/hearts16x16.png"},
        {"var": playerdeath_image, "url": "static/images/Orc3/orc3_death/orc3_death_full.png"},
        {"var": enemy_attackimage, "url": "static/images/Vampires1/Attack/Vampires1_Attack_full.png"},
        {"var": backgroundImage, "url": "static/images/background/sheet.png"},
        {"var": backgroundMusic, "url": "static/audio/background_music.mp3"}
    ], draw);

}



function draw() {
    request_id = window.requestAnimationFrame(draw);
    let now = Date.now();
    let elapsed = now - then;
    backgroundMusic.play();
    if (elapsed <= fpsInterval) {
        return;
    }
    then = now - (elapsed % fpsInterval);

    enemyFrameCounter = enemyFrameCounter + 1;
    
    if (enemies.length < 5) {
        spawn_enemy();
    }

    //Draw background on canvas
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "#f4a460" //light blue sky
    context.fillRect(0, 0, canvas.width, canvas.height);
    for (let r = 0; r < 20; r += 1) {
        for (let c =0; c < 32; c += 1) {
            let tile = background[r][c]
            if (tile >=0) {
                let tileRow = Math.floor(tile / tilesPerRow);
                let tileCol = Math.floor(tile % tilesPerRow);
                context.drawImage(backgroundImage,
                    tileCol * tileSize, tileRow * tileSize, tileSize, tileSize,
                    c * tileSize, r * tileSize, tileSize, tileSize);
            }
        }
    }

    
    if (player.is_dead) {
        if (player.death_frame < 8) {
            if (player.deathframe_delay % 6 === 0) {
                player.death_frame = player.death_frame + 1;
            }
            
            player.deathframe_delay = player.deathframe_delay + 1;

            context.drawImage(playerdeath_image,
                player.death_frame * player.width, player.frameY * player.height,
                player.width, player.height, player.x, player.y,player.width, player.height);
        } else {
            context.font = "40px Courier New";
            context.fillStyle = "red";
            context.fillText("GAME OVER", canvas.width /2 - 120, canvas.height / 2);
            context.font = "15px Courier New";
            context.fillText("Press R to Restart", canvas.width / 2 - 90, canvas.height / 2 + 20);
            isgame_over = true;
        }

        return;
    }


    //for each enemy
    for (let e of enemies) {
        if ((e.moveLeft || e.moveRight || e.moveUp || e.moveDown) && enemyFrameCounter % 8 === 0) {
            e.frameX = (e.frameX + 1) % 6;
        }

        
        //Draw enemy
        if (e.isDying) {
            if (enemyFrameCounter % 6 === 0) {
                e.deathFrame = e.deathFrame + 1;
            }

            if (e.deathFrame < 11) {
                context.drawImage(enemydeathimage,
                    e.deathFrame * e.width, e.frameY * e.height,
                    e.width, e.height, e.x, e.y, e.width, e.height);
            }
        } else if (e.is_attacking) {
            if (enemyFrameCounter % 6 === 0) {
                e.attack_frame = (e.attack_frame + 1) % 12;
            }

            context.drawImage(enemy_attackimage,
                e.attack_frame * e.width, e.frameY * e.height,
                e.width, e.height, e.x, e.y, e.width, e.height);
            
            e.attack_framedelay = e.attack_framedelay + 1;

        } else {
            context.drawImage(walkingEnemyImage, 
                e.frameX * e.width, e.frameY * e.height, e.width, e.height,
                e.x, e.y, e. width, e.height);
        }



    
        // Reset movement
        e.moveLeft = e.moveRight = e.moveUp = e.moveDown = false;
        e.xChange = 0;
        e.yChange = 0;
    
        //makes it so the enemy freezes when its dying
        if(!e.isDying) {
            // Get enemy to follow the player
            if (player.x < e.x) {
                e.moveLeft = true;
            } 
            if (player.x > e.x) {
                e.moveRight = true;
            } 
            if (player.y > e.y) {
                e.moveDown = true;
            } 
            if (player.y < e.y) {
                e.moveUp = true;
            }
            

            let enemy_speed = 1.2;
            
            // Handle enemy speed
            if (e.moveLeft) {
                e.xChange = e.xChange - enemy_speed;
                e.frameY = 2
            }
            if (e.moveRight) {
                e.xChange = e.xChange + enemy_speed;
                e.frameY = 3
            }
            if (e.moveUp) {
                e.yChange = e.yChange - enemy_speed;
                e.frameY = 1
            }
            if (e.moveDown) {
                e.yChange = e.yChange + enemy_speed;
                e.frameY = 0
            }
        
            // Update the enemy 
            e.x = e.x + e.xChange;
            e.y = e.y + e.yChange;

            //Enemy speed
            e.xChange = e.xChange * 0.9
            e.yChange = e.yChange * 0.9
        }    }

    for (let e of enemies) {
        if (collides(player, e)) {
            if (damagecooldown <= 0 && !e.isDying) {
                playerHealth = playerHealth - 10;
                damagecooldown = 30;
            }

            e.is_attacking = true;

        }

            //check if the enemy has been hit and take away health
        if (isAttacking && collides(player, e)) {
            if (!e.washit && !e.isDying) {
                e.health = e.health - 1;
                e.washit = true;

                if (e.health <=0) {
                    e.isDying = true;
                    e.deathFrame = 0;
                }   

                    if (!e.pickup_spawned) {
                        let drop_chance = Math.random();
                        if (drop_chance < 0.5) {
                            pickups.push({
                                type: "coin",
                                x: e.x + e.width /2 -8,
                                y: e.y + e.height / 2 - 8,
                                width: 16,
                                height: 16
                            });
                        } else if (drop_chance < 0.7) {
                            pickups.push ({
                                type: "heart",
                                x: e.x + e.width /2 - 8,
                                y: e.y + e.height / 2 -8,
                                width: 16,
                                height: 16
                            })
                        }
                        e.pickup_spawned = true;
                    }
            }
        }
    }





    //reset it so enemies can be hit again
    for (let e of enemies) {
        e.washit = false;
    }

    enemies = enemies.filter(e => !(e.isDying && e.deathFrame >= 11));

    if (damagecooldown > 0) {
        damagecooldown = damagecooldown -1
    }

    //draw the pickups
    for (let p of pickups) {
        if (p.type === "coin") {
            context.drawImage(coin_image,
                0, 0, p.width, p.height, p.x, p.y, p.width, p.height);
        } else if (p.type === "heart") {
            context.drawImage(heartpickup_image,
                0, 0, p.width, p.height, p.x, p.y, p.width, p.height);
        }
    }

    
    if (isAttacking) {
        context.drawImage(attackingPlayerImage,
            attackFrame * player.attackFrameWidth, player.frameY * player.attackFrameHeight,
            player.attackFrameWidth, player.attackFrameHeight,
            player.x, player.y, player.width, player.height);

        attackFrame = attackFrame + 1;

        if (attackFrame >= 6) {
            attackFrame = 0;
            isAttacking = false;
        }
    } else if ((moveLeft || moveRight || moveUp || moveDown) && ! (moveLeft && moveRight)) {
            player.frameX = (player.frameX + 1) % 4;
            //Draw player walking
            context.drawImage(walkingPlayerImage,
                player.frameX * player.width, player.frameY * player.height, player.width, player.height,
                player.x, player.y, player.width, player.height);
    } else {
        //Draw player idle
        context.drawImage(idlePlayerImage,
            player.frameX * player.width, player.frameY * player.height, player.width, player.height,
            player.x, player.y, player.width, player.height);
    }

    //Draw other objects
    //
    //health bar
    let totalHearts = 5;
    let healthPerHeart = maxPlayerHealth / totalHearts;
    let heartsize = 16;
    let spacing = 2;

    //centre it above the players head
    let startX = player.x + player.width / 2 - (totalHearts * (heartsize + spacing))


    //spacing between the top left corner of the player and the health bar
    let startY = player.y - 20;

    for (let i = 0; i < totalHearts; i = i + 1) {
        let heartX = startX + i * (heartsize + spacing);
        let healthRemaining = playerHealth - i * healthPerHeart;

        let frameX;
        let frameY;

        if (healthRemaining >= healthPerHeart) {
            frameX = 0; //full health
            frameY = 0
        } else if (healthRemaining >= healthPerHeart / 2) {
            frameX = 16; //half health
            frameY = 0;
        } else {
            frameX = 32; //no health
            frameY = 48;
        }

        context.drawImage(healthbarimage,
            frameX, frameY, heartsize, heartsize,
            heartX, startY, heartsize, heartsize);
    }



    let player_speed = 0.5;
    //Handle key presses
    if (moveLeft) {
        player.xChange = player.xChange - player_speed;
        player.frameY = 2;
    }
    if (moveRight) {
        player.xChange = player.xChange + player_speed;
        player.frameY = 3;
    }
    if (moveUp) {
        player.yChange = player.yChange - player_speed;
        player.frameY = 1;
    }
    if (moveDown) {
        player.yChange = player.yChange + player_speed;
        player.frameY = 0
    }

    //update the player
    let nextX = player.x + player.xChange;
    let nextY = player.y + player.yChange;

    //hitbox
    let hitbox = 25;
    

    let blocked = (
        solid_tile(nextX + hitbox, nextY + hitbox) || //Checks top left of player
        solid_tile(nextX + player.width - hitbox - 1, nextY + hitbox) || //Checks top right of player
        solid_tile(nextX + hitbox, nextY + player.height - hitbox -1) ||  //Checks bottom left
        solid_tile(nextX + player.width - hitbox -1, nextY + player.height - hitbox -1)); // Checks bottom right

    if (!blocked) {
        player.x = nextX;
        player.y = nextY;
    }



    //keep the player inside the canvas
    //stops player from going over top or left side
    if (player.x < 0) {
        player.x = 0;
    };

    if (player.y < 0) {
        player.y = 0;
    };
    
    //stops player from going over right side
    if (player.x + player.width > canvas.width) {
        player.x = canvas.width - player.width;
    };

    //stops player from going over bottom
    if (player.y + player.height > canvas.height) {
        player.y = canvas.height - player.height;
    };

    for (let i = pickups.length - 1; i >= 0; i = i-1) {
        let p = pickups[i]
        if (collides(player, p)) {
            if (p.type === "coin") {
                score = score + 100;
            } else if (p.type === "heart" && playerHealth < maxPlayerHealth) {
                playerHealth = Math.min(playerHealth + 10, maxPlayerHealth);
            }

            pickups.splice(i, 1)

        }
    }
    
    //gravity
    player.xChange = player.xChange * 0.9; //friction
    player.yChange = player.yChange * 0.9; //friction

    //Helps to stop the character sliding when letting go of keys
    if (Math.abs(player.xChange) < 0.4){
        player.xChange = 0;
    };

    if (Math.abs(player.yChange) < 0.4){
        player.yChange = 0;
    };





    //Score system
    context.fillStyle = "black";
    context.font = "17px Courier New";
    context.fillText("Score: " + score, 27, 39);

    if (attackCooldown > 0) {
        attackCooldown = attackCooldown - 1;
    }

    //check for death
    if (playerHealth <= 0 && !player.is_dead) {
        playerHealth = 0;
        player.is_dead = true;
        player.death_frame = 0;
        player.deathframe_delay = 0;
        stop();
    }

    
}


function activate(event) {
    let key = event.key;
    if (event.key === "w" ||
        event.key === "a" ||
        event.key === "s" ||
        event.key === "d") {
            event.preventDefault();
    }
    if (key === "a") {
        moveLeft = true;
    } else if (key === "w") {
        moveUp = true;
    } else if (key === "d") {
        moveRight = true;
    } else if (key === "s") {
        moveDown = true;
    }

    //listening for spacebar to attack
    if (key === " ") {
        if (!isAttacking && attackCooldown <= 0) {
            isAttacking = true;
            attackFrame = 0;
            attackCooldown = 10;
        }
    }

    //listen for r to restart game
    if (key === "r" && isgame_over) {
        restart_game();
    }
}

function deactivate(event) {
    let key = event.key;
    if (key === "a") {
        moveLeft = false;
    } else if (key === "w") {
        moveUp = false;
    } else if (key === "d") {
        moveRight = false;
    } else if (key === "s") {
        moveDown = false;
    }
}

function load_assets(assets, callback) {
    let num_assets = assets.length;
    let loaded = function() {
        console.log("loaded");
        num_assets = num_assets - 1;
        if (num_assets === 0) {
            callback();
        }
    };
    for (let asset of assets) {
        let element = asset.var;
        if (element instanceof HTMLImageElement) {
            console.log("img");
            element.addEventListener("load", loaded, false);
        }
        else if (element instanceof HTMLAudioElement) {
            console.log("audio");
            element.addEventListener("canplaythrough", loaded, false);
        }
        element.src = asset.url;
    }
}

function randint(min, max) {
    return Math.round(Math.random() * (max - min)) + min;
}

//if there is a collision
function collides(obj1, obj2) {
    if (obj1.x + obj1.width < obj2.x ||
        obj2.x + obj2.width < obj1.x ||
        obj1.y > obj2.height + obj2.y ||
        obj2.y > obj1.height + obj1.y) {
        return false;
    } else {
        return true;
    }
}

//Stop the game
function stop() {
    
    let data = new FormData();
    data.append("score", score);

    xhttp = new XMLHttpRequest();
    xhttp.addEventListener("readystatechange",
        handle_response, false);
    xhttp.open("POST", "store_score", true);
    xhttp.send(data);
}

function handle_response() {
    //Check that the response has fully arrived
    if (xhttp.readyState === 4) {
        //Check the request was successful
        if (xhttp.status === 200) {
            if (xhttp.responseText === "success") {
                console.log("Yes");
            } else {
                console.log("No");
            }
        }
    }
}

//Function to spawn enemies away from player
function spawn_enemy(){
    let safe = false;
    let e;

    while (!safe) {
        e = {
            x: randint(0, canvas.width),
            y: randint(0, canvas.height),
            width: 64,
            height: 64,
            xChange: 0,
            yChange: 0,
            moveLeft: false,
            moveRight: false,
            moveUp: false,
            moveDown: false,
            frameX: 0,
            frameY: 0,
            health: 1,
            washit: false,
            isDying: false,
            deathFrame: 0,
            deathFrameDelay: 0,
            pickup_spawned: false,
            attack_frame: 0,
            is_attacking: false,
            attack_framedelay: 0
        };

        if (!collides(player, e)) {
            safe = true;
        }
    }

    enemies.push(e)
}

function restart_game(){
    player.x = canvas.width / 2;
    player.y = 50;
    player.xChange = 0;
    player.yChange = 0;
    playerHealth = maxPlayerHealth;
    player.is_dead = false;
    player.death_frame = 0;
    player.deathframe_delay = 0;

    enemies = [];
    pickups = [];
    score = 0;
    isgame_over = false;
}

function solid_tile(x, y) {
    let c = Math.floor(x / tileSize);
    let r = Math.floor(y / tileSize);
    if (r < 0 || r >= background.length
        || c < 0 || c >= background[0].length) {
            return true;
        }
        let tile = background[r][c];
        return solid_tiles.has(tile);
}