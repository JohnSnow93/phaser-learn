function loaderState(game){
    var progressText;
    this.init = function () {
        var loadImg = game.add.image(game.world.centerX, game.world.centerY, 'BOOT_LOADING');
        loadImg.anchor = 0.5;
        progressText = game.add.text(game.world.centerX, game.world.centerY + 50, '0%', { fill: '#ffffff', fontSize: '16px' });
        progressText.anchor = 0.5;
    };
    this.preload = function () {
        game.load.audio('BGM', './static/source/bgm.mp3');
        game.load.audio('ENTRANCE_BGM', './static/source/entranceBGM.mp3');
        game.load.image('BG_NIGHT', './static/source/bg_night.png');
        game.load.image('BG_DAY', './static/source/bg_day.png');
        game.load.image('START_BUTTON', './static/source/button_play.png');
        game.load.image('PIPE_DOWN', './static/source/button_play.png');
        game.load.image('PIPE_UP', './static/source/button_play.png');

        game.load.onFileComplete.add(function (progress) {
          progressText.text = progress + '%';
          console.log(progress)
        });
    }
    this.create = function () {
      // var c = game.add.image(game.world.centerX, game.world.centerY, 'BOOT_LOADING');
      // c.anchor.setTo(0.5);
      game.add.text(0, 0, '0%', { fill: '#ffffff', fontSize: '16px' });
    }
}