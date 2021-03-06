let Minecraft = {}; 

Minecraft.allBlocks = [];
Minecraft.selectedWidth = 1000; /// default map width

Minecraft.start = function() { 
    let letsPlay = new Minecraft.map;
    letsPlay.generateMap(Minecraft.selectedWidth);
    letsPlay.generateBlock();
    Minecraft.elements(Minecraft.random(2, Minecraft.oneLine), ground);
    Minecraft.initializeTools();
    Minecraft.buttons();
}

// button handlers

Minecraft.buttons = function() {

    $(".reset").click(function() {
        $("#map").remove();
        Minecraft.allBlocks = [];
        Minecraft.selectedTool = [];
        inventoryCounter = {};
        Minecraft.start();
    })
    $(".difficulty .animate").click(function() {
        Minecraft.selectedWidth = $(this).val();
        $(".selected").removeClass('selected');
        $(this).addClass('selected');
    })
}

// random number function

Minecraft.random = function(min, max, excluded) { 
    let n = Math.floor(Math.random() * (max - min) + min);
    if (n >= excluded) n++;
    return n;
}

 // tools handler

Minecraft.selectedTool = [];

Minecraft.tools = function(type, approachedBlock) {
    this.type = type;
    this.approachedBlock = approachedBlock;
    let self = this;
    this.toolHolder = $("<div>", {
        "class": "tool " + this.type
    }).append("<img src='images/" + this.type + ".png'>");
    $(".tools-container").append(this.toolHolder);
    this.toolHolder.click(function() {
        Minecraft.selectedInventory = null;
        Minecraft.selectedTool = [];
        Minecraft.selectedTool = self.approachedBlock;
        $("div").removeClass('active');
        $(this).addClass('active');
        $("#map").css('cursor', 'url(images/cursors/' + self.type + '.png), auto');
    })
}

// creating the tools

Minecraft.initializeTools = function() {
    new Minecraft.tools("axe", ["tree", "leaf"]);
    new Minecraft.tools("shovel", ["dirt", "grass"]);
    new Minecraft.tools("pickaxe", ["rock"]);
    new Minecraft.tools("eraser", ["tree", "leaf", "dirt", "grass", "rock", "cloud", "lava"]);
}

// block handler object

Minecraft.block = function(type, x, y) {
    this.type = type;
    this.coordinates = [x, y];
    let self = this;
    this.blockHolder = $("<div>", {
        "class": "block " + this.type,
        "style": "background-image: url('images/" + this.type + ".png')"
    });
    $("#map").append(this.blockHolder);
    this.changeType = function(type) { 
        this.type = type;
        this.blockHolder.css("background-image", "url('images/" + this.type + ".png')");
        this.blockHolder.removeClass().addClass("block " + this.type);
    }

    this.blockHolder.click(function() { 

        for (let i = 0; i < Minecraft.selectedTool.length; i++) {
            targetBlock = Minecraft.selectedTool[i];
            if (targetBlock == self.type) {
                if (testArray = self.type in inventoryCounter) {} else {
                    inventoryCounter[self.type] = 0;
                }
                self.changeType("blank");
                new Minecraft.inventory(targetBlock);
            }

        }
        if (Minecraft.selectedInventory != null && inventoryCounter[Minecraft.selectedInventory] != 0) { 
            if (self.type == "blank") {
                self.changeType(Minecraft.selectedInventory);
                inventoryCounter[Minecraft.selectedInventory]--;
                $("." + self.type + " span").text(inventoryCounter[Minecraft.selectedInventory]);
                if (inventoryCounter[Minecraft.selectedInventory] == 0) { 
                    Minecraft.selectedInventory = null;
                    $("#map").css('cursor', 'auto');
                    $(".inventory-container ." + self.type).remove();
                }
            }
        }

    })
}

// initializing selected inventory

Minecraft.selectedInventory; 

// inventory handler

Minecraft.inventory = function(type) {
    let self = this;
    this.type = type;
    let $inv = $("<div>", {
        'class': 'inv ' + this.type
    }).append("<img src='images/" + this.type + ".png'>")
    let $counting = $("<span>")
    $($inv).append($counting);
    inventoryCounter[targetBlock]++;
    $("." + this.type + " span").text(inventoryCounter[type]);
    if ($('.inventory-container .' + self.type).length == 0) {
        $(".inventory-container").append($inv);
        $("." + this.type + " span").text(inventoryCounter[type]);
    }
    $inv.click(function() {
        Minecraft.selectedTool = [];
        $(".tool").removeClass("active");
        $(this).addClass("active");
        $("#map").css('cursor', 'url(images/cursors/' + self.type + '.png), auto');
        Minecraft.selectedInventory = self.type;
    })

}

// inventory block counter

let inventoryCounter = {};

// map handler

Minecraft.map = function() {
    this.x = 1;
    this.y = 0;

    this.generateMap = function(mapWidth) {
        Minecraft.mapWidth = mapWidth;
        let $mapHolder = $("<div>", {
            id: 'map',
            'style': 'width: ' + mapWidth + 'px'
        }) 
        let $toolContainer = $("<div>", {
            'class': 'tools-container bgholder'
        })
        let $inventoryContainer = $("<div>", {
            'class': 'inventory-container bgholder'
        })
        let $buttonsContainer = $("<div>", {
            'class': 'buttons-container bgholder'
        })
        let $resetButton = $("<div>", {
            'class': 'reset'
        }).append("<img src='images/reset.PNG'>");

        $('body').append($mapHolder);
        $($mapHolder).append($toolContainer);
        $($mapHolder).append($inventoryContainer);
        $($mapHolder).append($buttonsContainer);
        $($buttonsContainer).append($resetButton);

        Minecraft.oneLine = mapWidth / 50; 
    }
    Minecraft.f = -1; 
    this.generateLines = function(block, lines) { 
        for (let i = 0; i < lines; i++) {
            this.x += 1;
            if (i % Minecraft.oneLine === 0) {
                this.y += 1;
                this.x = 1;
            }
            Minecraft.allBlocks[(Minecraft.f + 1)] = new Minecraft.block(block, this.x, this.y);
            Minecraft.f++;
        }
        if (block == "blank") {
            ground = (this.y - 1);
        }
    };
    this.generateBlock = function() {
        this.generateLines("blank", Minecraft.mapWidth / 5);
        this.generateLines("blank", Minecraft.oneLine);
        this.generateLines("dirt", Minecraft.mapWidth / 10);
        this.generateLines("lava", Minecraft.oneLine);
    }
}

Minecraft.RandomArray = new Array(Minecraft.oneLine); 


Minecraft.elements = function(x, y) { 
    for (i = 0; i < Minecraft.oneLine; i++) {
        Minecraft.RandomArray[i] = Math.floor(Math.random() * 3 + 1);
    }
    randomNumber = Minecraft.random(0, Minecraft.oneLine, x)
    randomNumber2 = Minecraft.random(0, Minecraft.oneLine, x)
    for (let i = 0; i < Minecraft.allBlocks.length; i++) {


        // GENERATING TERRAIN

        for (let terrain = 0; terrain < Minecraft.oneLine; terrain++) {
            if (Minecraft.allBlocks[i].coordinates.join() == [terrain, (ground + Minecraft.RandomArray[terrain]) - 1].join()) {
                Minecraft.allBlocks[i].changeType("grass");
                Minecraft.allBlocks[i + Minecraft.oneLine].changeType("dirt");
            }
        }

        // GENERATING 1 CLOUD 

        for (let c = 0; c < 2; c++) {
            for (let o = 0; o < 4; o++) {
                if (Minecraft.allBlocks[i].coordinates.join() == [o + randomNumber, c + 2].join()) {
                    Minecraft.allBlocks[i].changeType("cloud");
                }
            }
        }

        // GENERATING 2 CLOUD 

        for (let c = 0; c < 2; c++) {
            for (let o = 0; o < 4; o++) {
                if (Minecraft.allBlocks[i].coordinates.join() == [o + randomNumber2, c + 3].join()) {
                    Minecraft.allBlocks[i].changeType("cloud");
                }
            }
        }


        // GENERATING ROCKS
        for (let z = 1; z < 5; z++) {
            if (Minecraft.allBlocks[i].coordinates.join() == [randomNumber + (Minecraft.random(2, Minecraft.oneLine)), y].join()) {
                Minecraft.allBlocks[i].changeType("rock");
                Minecraft.allBlocks[i + Minecraft.oneLine].changeType("grass");
                Minecraft.allBlocks[i + (Minecraft.oneLine * 2)].changeType("dirt");
            }
        }


        // GENERATING TREE TRUNK

        for (let j = 0; j < 2; j++) {
            if (Minecraft.allBlocks[i].coordinates.join() == [x, (y - j)].join()) {
                Minecraft.allBlocks[i].changeType("tree");
            }

            if (Minecraft.allBlocks[i].coordinates.join() == [x, (y - j) + 1].join()) {
                Minecraft.allBlocks[i].changeType("tree");
            }
            // GENERATING TREE LEAVES

            for (let line = 0; line < 3; line++) {
                for (let p = -1; p < 2; p++) {
                    if (Minecraft.allBlocks[i].coordinates.join() == [(x + p), (y - 2) - line].join()) {
                        Minecraft.allBlocks[i].changeType("leaf");
                    }
                }
            }
        }
    }
}



Minecraft.start();


