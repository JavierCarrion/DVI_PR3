var game = function() {

	var Q = window.Q = Quintus()
			.include("Sprites, Scenes, Input, 2D, Anim, Touch, TMX, UI")
			.setup({width:320,
					height:480})
			.controls().touch();


	Q.scene("level1",function(stage) {
		Q.stageTMX("level.tmx",stage);
		stage.add("viewport");
		stage.centerOn(150, 380);
	});

	Q.loadTMX('level.tmx', function() {
		Q.stageScene("level1");
	});


}

