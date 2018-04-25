var game = function() {

	var Q = window.Q = Quintus()
			.include("Sprites, Scenes, Input, 2D, Anim, Touch, TMX, UI")
			.setup({width:320,
					height:480})
			.controls().touch();

//--------------HOME_SCREEN-----------------

	Q.scene("mainTitle", function(stage){
		var container = stage.insert(new Q.UI.Container({
			x:Q.width,
			y:Q.height
		}));
		var button = container.insert(new Q.UI.Button({
			x:-Q.width/2,
			y:-Q.height/2,
			fill: "#CCCCCC",
			asset: "mainTitle.png"
		}));
		button.on("click", function(){
			Q.stageScene("level1");
		});
		container.fit(20);
	});

//-------------LEVEL1----------------
	Q.scene("level1",function(stage) {
		Q.stageTMX("level.tmx",stage);
		var mario = stage.insert(new Q.Mario());
		var goomba = stage.insert(new Q.Goomba());
		var bloopa = stage.insert(new Q.Bloopa());
		var princess = stage.insert(new Q.Princess());

		stage.add("viewport").follow(mario);
		stage.viewport.offsetX = -130;
		stage.viewport.offsetY = 156;
		stage.centerOn(150, 380);
	});

//-------------END_GAME----------------
	Q.scene("endGame",function(stage){
		var container = stage.insert(new Q.UI.Container({
			x: Q.width/2,
			y: Q.height/2,
			fill:"rgba(0,0,0,0.5)"
		}));
		var button = container.insert(new Q.UI.Button({
			x:0,
			y:0,
			fill:"#CCCCCC",
			label:"Play Again"
		}))
		var label = container.insert(new Q.UI.Text({
			x:10,
			y:-10 - button.p.h,
			label:stage.options.label
		}));
		button.on("click", function(){
			Q.clearStages();
			Q.stageScene("mainTitle");
		});
		container.fit(20);
	});


//-------------LOAD_RESOURCES----------------
	Q.load(["mario_small.png","mario_small.json",
					"goomba.png", "goomba.json", 
					"bloopa.png", "bloopa.json",
					"princess.png","mainTitle.png"], function(){

		Q.compileSheets("mario_small.png","mario_small.json");
		Q.compileSheets("goomba.png", "goomba.json");
		Q.compileSheets("bloopa.png", "bloopa.json");

		Q.loadTMX('level.tmx', function() {
			Q.stageScene("mainTitle");
		});
	});


//-------------ANIMATIONS-------------
	Q.animations("mario", {
		move_right: 	{ frames: [1,2,3],    rate: 1/9 }, 
		move_left: 		{ frames: [15,16,17], rate:1/9 },
		stand_right: 	{ frames: [0],  rate: 1/5 },
		stand_left: 	{ frames: [14], rate: 1/5 },
		died: 			{ frames: [12], rate: 1/5, loop: false, trigger:"died" },
		fall_right: 	{ frames: [2],  rate: 1/5, loop: false },
		fall_left: 		{ frames: [16], rate: 1/5, loop: false },
		jump_right:     { frames: [4],  rate: 1/5, loop: false },
		jump_left: 		{ frames: [18], rate: 1/5, loop: false }
	});

	Q.animations("goomba", {
		move_right: 	{ frames: [1,2,3],    rate: 1/9 }, 
		move_left: 		{ frames: [15,16,17], rate:1/9 },
		stand_right: 	{ frames: [0],  rate: 1/5 },
		stand_left: 	{ frames: [14], rate: 1/5 },
		died: 			{ frames: [12], rate: 1/5, loop: false },
		fall_right: 	{ frames: [2],  rate: 1/5, loop: false },
		fall_left: 		{ frames: [16], rate: 1/5, loop: false },
		jump_right:     { frames: [4],  rate: 1/5, loop: false },
		jump_left: 		{ frames: [18], rate: 1/5, loop: false }
	});

	Q.animations("bloopa", {
		move_right: 	{ frames: [1,2,3],    rate: 1/9 }, 
		move_left: 		{ frames: [15,16,17], rate:1/9 },
		stand_right: 	{ frames: [0],  rate: 1/5 },
		stand_left: 	{ frames: [14], rate: 1/5 },
		died: 			{ frames: [12], rate: 1/5, loop: false },
		fall_right: 	{ frames: [2],  rate: 1/5, loop: false },
		fall_left: 		{ frames: [16], rate: 1/5, loop: false },
		jump_right:     { frames: [4],  rate: 1/5, loop: false },
		jump_left: 		{ frames: [18], rate: 1/5, loop: false }
	});

//-------------MARIO----------------
	Q.Sprite.extend("Mario", {
		init:function(p){
			this._super(p,{
				sprite: "mario",
				sheet: "mario",
				frame: 0,
				x: 30,
				y:380
			});
			this.add('2d, platformerControls, animation');
			this.on("died", this, "kill");
		},



		step: function(){
			if(this.p.y >= 800){
				this.p.vy = -200;
				this.play("died", 1);
				Q.stageScene("endGame", 1, {label: "You Died!"});
			}
			if(this.p.vx > 0) {
		     	this.play("move_right");
		    } else if(this.p.vx < 0) {
		      	this.play("move_left");
		    }
		    if(this.p.vy > 0){
		    	if(this.p.direction === "right"){
			    	this.play("fall_right");
			   	} else{
			   		this.play("fall_left");
			   	}
			} else if(this.p.vy === 0 && this.p.vx === 0){
		    	if(this.p.direction === "right"){
			   		this.play("stand_right");
		    	} else{
		    		this.play("stand_left");
		    	}
		    } else if(this.p.vy < 0){
		   		if(this.p.direction === "right"){
			   		this.play("jump_right", 1);
				} else{
					this.play("jump_left", 1);
				}
		    }
		},
		kill: function(){
			this.destroy();
		}
	});



//-------------GOOMBA----------------

	Q.Sprite.extend("Goomba", {
		init:function(p){
			this._super(p,{
				sprite: "goomba",
				sheet: "goomba",
				frame: 0,
				x: 1500,
				y:380,
				vx: 80
			});
			this.add('2d, aiBounce');
			this.on("bump.left, bump.right, bump.bottom", this, "stomp");
			this.on("bump.top",this, "smash");
		},

		smash: function(collision){
			if(collision.obj.isA("Mario")){
				this.destroy();
				collision.obj.p.vy = -300;
			}
		},

		stomp: function(collision){
			if(collision.obj.isA("Mario")){
				collision.obj.p.vy = -300;
				collision.obj.p.vx = 0;
				collision.obj.play("died", 1);
				Q.stageScene("endGame", 1, {label: "You Died!"});
			}
		}
	});



//-------------BLOOPA----------------

	Q.Sprite.extend("Bloopa", {
		init:function(p){
			this._super(p,{
				sprite: "bloopa",
				sheet: "bloopa",
				frame: 0,
				x: 1200,
				y:380,
				vy: -350,
				gravityY: 5*100
			});
			this.add('2d');
			this.on("bump.left, bump.right, bump.bottom", this, "stomp");
			this.on("bump.top",this, "smash");
		},
		step: function(){
			if(this.p.y >= 519){
				this.p.vy = -350;
			}
		},

		smash: function(collision){
			if(collision.obj.isA("Mario")){
				this.destroy();
				collision.obj.p.vy = -300;
			}
		},

		stomp: function(collision){
			if(collision.obj.isA("Mario")){
				collision.obj.p.vy = -200;
				collision.obj.play("died", 1);
				Q.stageScene("endGame", 1, {label: "You Died!"});
			}
		}
	});



//-------------PRINCESS----------------

	Q.Sprite.extend("Princess", {
		init:function(p){
			this._super(p,{
				asset: "princess.png",
				x: 2000,
				y:380
			});
			this.add('2d');
			this.on("bump.left, bump.right, bump.bottom, bump.top", this, "sensor");
		},
		sensor: function(collision){
			if(collision.obj.isA("Mario")){
				collision.obj.destroy();
				Q.stageScene("endGame", 1, {label: "You Won!"});
			}
		}
	});
}