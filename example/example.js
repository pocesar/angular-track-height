angular
.module('App', ['TrackHeight'])
.controller('Ctrl', ['TrackHeight', function(TrackHeight){
    this.heights = function(){
        return TrackHeight.get('w00t');
    };

    var self = this;
    this.randomText = [];

    this.setRandomText = function(){
        self.randomText.length = Math.ceil(Math.random() * 10);
    };

    self.setRandomText();
}]);