var game = function() {

	var Q = window.Q = Quintus()
			.include("Sprites, Scenes, Input, 2D, Anim, Touch, TMX, UI")
			.setup({width:320,
					height:480})
			.controls().touch();

	//--------------LEVEL-----------------
	Q.scene("level1",function(stage) {
		Q.stageTMX("level.tmx",stage);
		stage.centerOn(150, 380);
		var mario = stage.insert(new Mario());
		stage.add("viewport").follow(mario);
	});

	Q.loadTMX('level.tmx', function() {
		Q.stageScene("level1");
	});

	//-------------MARIO----------------
	Q.load(["mario_small.png","mario_small.json"], function(){
		Q.compileSheets("mario_small.png","mario_small.json");
	});

	Q.Sprite.extend("Mario", {
		init:function(p){
			this._super({
				sheet: "mario_small",
				frame: 1
			});
			this.add('2d, plataformerControls');
			this.on("bump.botton", this, "stomp");
		},

		stomp: function(collision){
			if(collision.obj.isA("Goomba")){
				collision.obj.destroy();
				this.p.vy = -500; //mkae Mario jump
			}
		}
	});

}

