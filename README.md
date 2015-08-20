# Angular Track Height

Watch an element for the min or/and max height then save it for use somewhere else

Mostly to avoid flicker on ui-view/ng-view when it changes height.

## Install

### Bower

```bash
$ bower install angular-track-height --save
```

### NPM

```bash
$ npm install angular-track-height --save
```

## Usage

### Directives

#### track-height

Tracks the height of an element for usage somewhere else, like inside a controller or inside other directives.

```html
<div track-height="'nameit'" class="some-element" ui-view=""></div>
```

#### track-height-apply

You can set the min and max, depending on the options you pass to it.

By passing "min", the `min-height` will be set on the element

By passing "max", the `max-height` will be set on the element

```html
<div track-height="'nameit'" track-height-apply="min max" class="some-element" ui-view=""></div>
```

### Service

#### TrackHeight

You can access your element height using this service, by the name you provide

##### .get

Gets the min or max height of an element

##### .set

Programatically sets the min or max height of an element

```js
angular
.module('App', [
  'TrackHeight'
])
.controller('yourcontroller', ['TrackHeight', function(TrackHeight){
  var heights = TrackHeight.get('nameit');
  heights.min / heights.max;
  TrackHeight.set('nameit', {
    min: 10,
    max: 100
  });
});
```
