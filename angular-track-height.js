(function(){
    'use strict';

    angular
    .module('TrackHeight', [])
    .directive('trackHeight', ['TrackHeight', function(TrackHeight){
        return {
            restrict: 'A',
            require: 'trackHeight',
            controller: [function() {
                var self = this;

                this.name = '';
                this.lastFrame = 0;
                this.destroy = false;

                this.listeners = [];

                this.notify = function(cb){
                    if (!self.destroy) {

                        cb(function(dimensions) {

                            self.listeners.forEach(function(listener) {
                                listener(dimensions);
                            });

                        });

                    } else {
                        self.listeners.length = 0;
                    }
                };

            }],
            link: {
                post: function(scope, el, attrs, trackHeight) {
                    var lastMinHeight;
                    var lastMaxHeight = 0;
                    var unwatch;

                    var unobserve = attrs.$observe('trackHeight', function(name){
                        trackHeight.name = name;

                        scope.$applyAsync(function(){

                            lastMinHeight = el.outerHeight();
                            var currentMinHeight = 0;
                            unobserve();

                            unwatch = scope.$watch(function() {
                                currentMinHeight = parseInt(el.css('minHeight'));

                                el.css('minHeight', 0);

                                var outer = el.outerHeight();

                                if (currentMinHeight > 0) {
                                    el.css('minHeight', currentMinHeight);
                                }

                                return outer;
                            }, function(currentHeight){

                                trackHeight.notify(function(done){

                                    var obj = {
                                        current: currentHeight,
                                        min: lastMinHeight
                                    };

                                    if (currentHeight < lastMinHeight) {
                                        obj.min = lastMinHeight = currentHeight;
                                    }

                                    if (currentHeight > lastMaxHeight) {
                                        obj.max = lastMaxHeight = currentHeight;
                                    }

                                    done(TrackHeight.set(trackHeight.name, obj));
                                });

                            });

                        });

                    });

                    el.on('$destroy', function(){
                        unwatch();
                        trackHeight.destroy = true;
                    });

                    scope.$on('$destroy', function(){
                        unwatch();
                        trackHeight.destroy = true;
                    });
                }
            }
        };
    }])
    .directive('trackHeightApply', ['TrackHeight', function(TrackHeight) {
        return {
            restrict: 'A',
            require: 'trackHeight',
            link: {
                post: function(scope, el, attrs, trackHeight) {

                    var apply = attrs['trackHeightApply'] || 'min';
                    var min = apply.indexOf('min') > -1;
                    var max = apply.indexOf('max') > -1;

                    trackHeight.listeners.push(function(heights){
                        requestAnimationFrame(function(){
                            if (min && max) {
                                el.css('height', heights.max);
                            } else if (max) {
                                el.css('minHeight', heights.max);
                            } else if (min) {
                                el.css('minHeight', heights.min);
                            }
                        });
                    });

                }
            }
        };
    }])
    .service('TrackHeight', [function(){
        var _heights = {};

        return {
            get: function(name) {
                if (typeof _heights[name] !== 'object') {
                    _heights[name] = {
                        current: 0,
                        min: 0,
                        max: 0
                    };
                }

                return _heights[name];
            },
            set: function(name, heights) {
                if (!name || !heights || typeof heights !== 'object') {
                    return;
                }

                if (typeof _heights[name] !== 'object') {
                    _heights[name] = {
                        current: 0,
                        min: 0,
                        max: 0
                    };
                }

                angular.extend(_heights[name], heights);

                return _heights[name];
            }
        };
    }])
    ;
})();