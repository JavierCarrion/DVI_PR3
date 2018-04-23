var game = function() {

	var Q = window.Q = Quintus()
			.include("Sprites, Scenes, Input, 2D, Anim, Touch, TMX, UI")
			.setup({width:320,
					height:480})
			.controls().touch();

	//--------------LEVEL-----------------

	Q.scene("mainTitle", function(stage){
		var container = stage.insert(new Q.UI.Container({
			x:Q.width,
			y:Q.width
		}));

		var button = container.insert(new Q.UI.Button({
			x:-Q.width/2,
			y:-Q.width/2,
			fill: "#CCCCCC",
			asset: "mainTitle.png"
		}));

		button.on("click", function(){
			Q.stageScene("level1");
		});

		container.fit(20);
	});

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

	Q.scene("endGame",function(stage){
		var container = stage.insert(new Q.UI.Container({
			x: Q.width/2, y: Q.height/2 , fill: "rgba(0,0,0,0.5)"
		}));
		var button = container.insert(new Q.UI.Button({x:0, y:0, fill: "#CCCCCC", label: "Play Again"}))
		var label = container.insert(new Q.UI.Text({x:10, y:-10 - button.p.h, label: stage.options.label}));
		button.on("click", function(){
			Q.clearStages();
			Q.stageScene("mainTitle");
		});
		container.fit(20);
	});

	Q.load(["mario_small.png","mario_small.json",
					"goomba.png", "goomba.json", 
					"bloopa.png", "bloopa.json",
					"princess.png"], function(){

		Q.compileSheets("mario_small.png","mario_small.json");
		Q.compileSheets("goomba.png", "goomba.json");
		Q.compileSheets("bloopa.png", "bloopa.json");

		Q.loadTMX('level.tmx', function() {
			Q.stageScene("level1");
		});
	});



	//-------------MARIO----------------
	Q.Sprite.extend("Mario", {
		init:function(p){
			this._super(p,{
				sheet: "mario",
				frame: 0,
				x: 30,
				y:380
			});
			this.add('2d, platformerControls');
		},

		step: function(){
			if(this.p.y >= 800){
				this.p.sheet = "mario";
				this.destroy();
				Q.stageScene("endGame", 1, {label: "You Died!"});
			}
		}
	});



//-------------GOOMBA----------------

	Q.Sprite.extend("Goomba", {
		init:function(p){
			this._super(p,{
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
				collision.obj.destroy();
				Q.stageScene("endGame", 1, {label: "You Died!"});
			}
		}
	});



//-------------BLOOPA----------------

	Q.Sprite.extend("Bloopa", {
		init:function(p){
			this._super(p,{
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
				collision.obj.destroy();
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