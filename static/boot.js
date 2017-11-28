var bootState = function (game) {
    this.preload =function(){
        game.load.image('BOOT_LOADING', './static/source/loading.gif');
    };
    this.create = function(){
        game.state.start('load');
    }
}