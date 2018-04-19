var game = function() {

	var Q = window.Q = Quintus()
			.include("Sprites, Scenes, Input, 2D, Anim, Touch, TMX, UI")
			.setup({width:320,
					height:480})
			.controls().touch();

	//--------------LEVEL-----------------
	Q.scene("level1",function(stage) {
		Q.stageTMX("level.tmx",stage);
		var mario = stage.insert(new Q.Mario());
		stage.add("viewport").follow(mario);
		stage.viewport.offsetX = -130;
		stage.viewport.offsetY = 156;
		stage.centerOn(150, 380);
	});



	//-------------MARIO----------------
	Q.load(["mario_small.png","mario_small.json"], function(){
		Q.compileSheets("mario_small.png","mario_small.json");
		Q.loadTMX('level.tmx', function() {
			Q.stageScene("level1");
		});
	});

	Q.Sprite.extend("Mario", {
		init:function(p){
			this._super(p,{
				sheet: "mario",
				frame: 1,
				x: 30,
				y:380
			});
			this.add('2d, platformerControls');
			this.on("bump.botton", this, "stomp");
		},

		stomp: function(collision){
			if(collision.obj.isA("Goomba")){
				collision.obj.destroy();
				this.p.vy = -500; //mkae Mario jump
			}
		},

		step: function(){
			if(this.p.y >= 800){
				this.p.sheet = "mario";
				this.p.frame = 1;
				this.p.x = 30;
				this.p.y = 380;
			}
		}
	});

}

