# Phaser学习笔记
## phaser文档
phaser的github仓库的docs目录可以下载下来方便观看
## 创建游戏
```javascript
var game = new Phaser.Game({ width, height, renderer, state, transparent, antialias, physicsConfig  })
```
- renderer 渲染引擎 Phaser.CANVAS Phaser.WEBGL Phaser.AUTO
- parent游戏容器，可以是一个DOM元素或ID
- state 游戏默认场景
- transparent 画布背景是否透明，默认不透明
- antialias 是否开启抗锯齿 默认开启
- physicsConfig物理引擎配置
- 所有参数均可选, 返回一个游戏实例对象
```javascript
// 下面的game是之前创建的一个游戏实例对象
game.paused = true/false 设置游戏暂停
game.add // 对游戏工厂对象的一个引用
game.camera // 对游戏中摄像机对象的一个引用
game.input // 对游戏中用户交互事件对象的一个引用
game.load // 对游戏资源加载模块的引用
game.scale // 对游戏缩放模块的引用
game.sound // 对游戏声音模块的引用
game.stage // 对游戏舞台对象的引用
game.world // 是游戏中世界对象的引用
game.particles // 是游戏中粒子对象的引用
game.physics // 对游戏中物理系统的引用
game.state // 是游戏场景管理对象(Phaser.StateManager)的引用
```
## 场景(state)
是指游戏中不同的界面或内容，比如游戏开始菜单界面是一个场景，不同关卡又是不同的场景。场景可以把一个复杂的游戏分成许多小块，从而简化游戏开发，但场景并不一定要包含游戏画面。

phaser中的创建场景有两种形式：
- 对象形式
    ```
    {
        init: functon(){}
        preload: function(){}
        create: function(){}
        update: funtion(){}
        render: function(){}
    }
    ```
- 函数形式.该函数会被phaser作为构造函数进行实例化
```
function(game){ // 参数为游戏实例
    this.init = function(){}
    this.preload = function(){}
    this.create = function(){}
    // ...
}
```

每个场景都可以有init/preload/create/update/render方法。
但preload/create/update/render至少要有一个。

- init() 一些场景的初始化代码可以写在这个方法里
- preload() 用来加载游戏资源等
- create() 创建游戏显示对象或注册事件
- update() 在游戏每一帧都会调用，用来书写需要在每一帧执行的代码
- render() 在游戏的每一个渲染周期都会调用，用来做一些自定义的/额外的渲染工作，比如显示调试文字。默认一帧就是一个渲染周期。该方法绘制的图形在所有游戏图像之上

执行顺序
1. Init()
2. preload() 
3. create() 在preload中要加载的资源已经完成加载才会执行
4. update()
5. render()

### Phaser.StateManager 场景管理对象
- 添加场景 `game.state.add(name[场景名称 | string], state[func/obj])`
- 运行/启动游戏场景 `game.state.start(name)`
- 可以在创建游戏时添加一个初始场景，会自动运行该场景。

## 加载游戏资源
加载的游戏资源可以是图片/声音和其他需要的资源。
Phaser.Loader对象是专门用于游戏资源加载的对象。常用的加载方法有如下：
```
game.load.image() // 加载图片
game.load.spritesheet() // 加载图片集/精灵图
game.load.atlas() // 加载图片集
game.load.audio() // 加载声音
game.load.audiosprite() // 加载声音集
game.load.text() // 加载文本文件
game.load.xml() // 加载xml文件
game.load.binary() // 加载二进制文件
```

1. game.load.image(key[stringt], url) 加载一个图片，key作为以后调用该图片时所用的名字，必须唯一
2. game.load.spritesheet() 图片集，要求集合内每个图片高宽相等。可以用来播放动画
    ```
    spritesheet(key, url, frameWidth, frameHeight)
    ```
    该方法加载图片集帧会自动从左到右，一行一行读取，并从0开始累加给frame编号
3. game.load.atlas() 加载图片集，可加载多张大小不相同，位置不规范的图片组合而成，也可以用来播放动画
    ```
    atlas(key, textureURL, atlasURL, atlasData, format)
    ```
    - atlasURL 描述集合中各个小图片的长宽以及位置的一个文件的地址，可以是JSON或XML格式
    - atlasData 描述集合中各个小图片的长宽以及位置的信息，atlasURL和atlasData二选一
    - format 声明参数atlasURL或atlasData的格式
4. game.load.audio(key, urls[string | array | ...], [autoDecode])
5. game.load.audiosprite() 加载由多个音频分段组合的音频文件，可播放单独的声音文件或连续播放

### 加载事件处理
`game.load.onFileComplete` 返回一个Phaser.Signal对象，可以在它上面注册事件
```javascript
game.load.onFileComplete.add(function(){ // 单个资源加载完成时会触发该事件
    // 此时可以用 game.load.progres熟悉获取当前所有的资源加载进度
    var progress = game.load.progress; // 1表示1%,100表示100%
});

game.load.onFileComplete.add(function(){]}) // 所有资源加载完成事件
```

phaser有一套自己的事件系统。

游戏资源加载代码应该放到每个场景(state)的preload中。preload中的资源加载完毕后会进入create

## 舞台/世界/摄像机的区别
1. 舞台Stage 
    舞台是所有显示对象的一个顶层容器，会根据加入的显示对象自动扩展大小，初始尺寸默认和相机一样大小。
2. 世界World
    一个游戏只有一个世界，世界的尺寸是可以无限延伸的(但不会随着加入的对象自动延伸，需要手动设置边界)，你可以通过相机来观察世界，所有世界内的物体都是按世界坐标确定位置的，默认会自动创建一个和舞台一样大的世界。
3. 摄像机Camera
    摄像机是观看游戏世界(world)的一个视角,摄像机有一个固定的尺寸和位置,只有在摄像机可视范围内的对象才会被渲染。游戏在初始化时会自动创建一个和摄像机同样大小的舞台(stage).摄像机移动的最大范围是世界(world)的边界。

- Phaser.Stage 舞台对象，
    ```
    // 可以通过game.stage快速引用
    game.stage.setBackgroundColor(背景颜色16进制数字) // 改变舞台背景颜色
    ```
- Phaser.world 世界对象
    ```
    game.world.setBounds(x,y,width,height) // 设置世界边界大小
    ```
- Phaser.Camera 摄像机对象
    ```
    game.camera.x = 100; // 改变摄像机在X轴上的位置
    game.camera.y = 100; // 类似上一条
    game.camera.focusOn(displayObject); // 让摄像机定位到displayObject上
    game.focusOnXY(x, y); // 让摄像机定位到X,Y上
    game.camera.follow(target); // 摄像机跟随目标(设置了该方法后， 就无法用game.camera.x/ game.camera.y来改变相机位置)
    ```


## 游戏缩放控制
Phaser.ScaleManager是Phaser中的的缩放管理对象。

游戏实例化后可以通过`game.scale`引用
```
// scaleMode可以改变游戏缩放模式
game.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT
game.scale.pageAlignHorizontally = true // 游戏在父元素内水平剧中
game.scale.pageAlignVertically = ture // 游戏在父元素垂直平剧中
```
scaleMode 的可选值如下，注意加上`Phaser.ScaleManager`
- EXACT_FIT 缩放到父元素大小，填满父元素，可能会失去宽高比
- SHOW_ALL 保持宽高比缩放到可用的最大空间
- USER_SCALE 自定义缩放

使用USER_SCALE自定义缩放
```
// 缩放比是数字
game.scale.setUserScale(x方向的缩放比,y方向的缩放比)
```

## Phaser中的显示对象
显示对象就是需要在画布中渲染出来的对象。常见的有下面几种。
- 图片
- 图形
- 按钮
- 文字
- 精灵
- 瓦片精灵(可以平铺或者滚动)
- 瓦片地图
- 粒子

显示对象列表：
- 组(一组显示对象的集合)
- 单个显示对象(一些单个显示对象也是可以添加子元素的，如精灵)

Phaser运行机制：
state.start() -> preload -> create -> update(一般用于更新显示对象的属性) -> render渲染舞台上所有需要渲染的显示对象

一般以1/60秒循环一次update -> render

### 游戏工程对象 Phaser.GameObjectFactory
`game.add` 就是 `Phaser.GameObjectFactory` 的一个实例。

GameObjectFactory 可以快捷创建一些显示对象或非显示对象。如下
```javascript
// 现有一游戏实例game和图片cat
// 向世界内添加图片的一般方法
var image = new Phaser.Image(game, 0, 0, 'cat');
game.world.add(image);
// 使用GameObjectFactory快速向世界添加图片的方法
game.add.image(game, 0, 0, 'cat');
```
下面是常见的游戏工程对象的使用：
`game.add.image(x, y, key, frame, group)`
- x,y 图片对象的位置坐标
- key 要加载的图片的资源名称
- frame 如果要加载的资源有多个帧，可以用这个属性指定某一帧
- group 添加到某个特定的组中，默认直接添加到世界中

`var graphics = game.add.graphics(x, y, group)`
- x,y 图形相对于其上一层容器的左上角的坐标
- group 该图形所属的组
- 返回一个图形对象，可以在该对象上画出不同的图形，这些图形会被当作一个整体看待
- 使用返回的图形对象绘图和canvas原生绘制图形类似

`game.add.button(x, y, key, callback, callbackContext, overFrame, outFrame, downFrame, upFrame, group)`
- key 要加载的图片的资源名称
- callback 按钮按下时的回调
- callbackContext 可以指定回掉中的上下文(this)
- overFrame 按钮四个状态显示的帧

### 精灵Sprite
`var spriteOne = game.add.sprite(x, y, key, frame, group)`
精灵对象比图片有更多功能，比如说动画和物理引擎

游戏中以世界的左上角为(0,0)原点坐标。
#### 设置位置
```
var sprite = game.add.sprite(x, y, 'ImageSourceKey');
sprite.x = 100;
sprite.y = 100;
// ponsition 属性是一个Phader.Point对象
sprite.position.x = 100;
sprite.position.y = 100;
sprite.position.set(x, y)
```

设定位置时，根据元素自身的锚点来计算，元素默认的锚点在自身的左上角，可以设置锚点位置
```
// 锚点位置取值范围0~1
sprite.anchor.x = 0.5;
sprite.anchor.y = 0.5;

sprite.anchor.set(0.5, 0.5)
```

#### 设置尺寸大小
一般来说精灵不需要设置尺寸大小，一般是该精灵的图片或者帧的大小。
```
sprite.height/width // 均可以读写
```

#### 其他
```
sprite.alpha = 0.5 // 透明度
sprite.angle = 90 // 旋转角度
sprite.scale.x/y = 2 // 缩放比
sprite.visible = true // 是否可见
sprite.exists = true // 是否存在，若为false，游戏每一帧都会跳过该元素的处理，并且不可见
```
#### tint 颜色属性
```
sprite.titnt = 0x00FF00; // 会将显示对象叠加一层颜色，但很影响性能
```

#### 遮罩
```
var graphics = game.add.graphics(0,0);
graphics.beginFill(0xFFFFFF); // 作为遮罩的图形必须填充
var circle = graphics.drawCircle(150,2500,200);
imageObject.mask = circle;
// imageObject在遮罩的区域才会显示出来
```

#### TileSprite 瓦片精灵
`game.add.tileSprite(x, y, width, height, key, frame, group)`
以上参数和其他的精灵对象类似

瓦片地图的资源frame如果高宽小于瓦片地图的width, height, 该frame就会保持大小并自动平铺到合适的大小。

瓦片地图可以自动滚动
```
titleSprite.autoScroll(speedX, speedY) // 以每秒speedX/speedY 的速度进行滚动，数值可以为负，代表负方向
```

### Phaser 中的文字
`var textObj = game.add.text(x, y, text, style, group)`
- style 是文字的样式, 类型为对象{}
- text 是文字的内容

文字的样式，除了初始可以设置之外，还可以按如下方法设置
```
tetx.style.fill(或其他样式) = value; 
text.fill = '#fff';
text.font = '微软雅黑';
text.fontSize = 60; // 字体大小
text.fontWeight = 'normal'; // 默认值是加粗的字体
text.style.backgroundColor = '#000'; // 文字的背景颜色
text.stroke = '#f00'; // 文字的描边颜色
text.strokeThickness = 10; // 文字描边的宽度
text.wordWrap = true; // 文字是否换行
text.wordWrapWidth = 150; // 换行的最大宽度，暂不支持中文，和上面的属性结合使用
```

### Phaser中的特殊字体
- webFont
- BitmapText
- RetroFont

#### webFont
使用CSS的font-face引入字体，需要在页面中使用一次该字体，不然字体的资源无法在游戏中引用。

#### BitmapText
某种图片字体，类似精灵图.
```
// 加载
game.load.bitmapFont(key, textureURL, atlasURL, atlasDta, xSpacing?, ySpacing?);
// 使用
var text = game.add.bitmapText(x, y, font, text?, size?, group?)

```
- textureURL 图片地址
- atlasURL 描述图片的数据文件地址
- atlasDta 描述图片的数据，和上一个参数二选一

- font 加载BitmapText定义的key
- text 文字的内容
- size 文字的大小,值为数字

生成BitmapText可以有如下方法
- BMFont (Windows, free): http://www.angelcode.com/products/bmfont/
- Glyph Designer (OS X, commercial): http://www.71squared.com/en/glyphdesigner
- Littera (Web-based, free): http://kvazars.com/littera/

### Phaser中的组 Phaser.Group
组可以把多个显示对象结合成一个整体，组也可以是其他显示对象或组的子元素。

Phaser.World是所有显示对象最顶层的一个组
```
var group = game.add.group(parent?, name?, addToStage?, enableBody?, physicsBodyType?)
```
- parent 组的父元素
- name 调试用的
- addToStage 直接将组添加到舞台上还是世界中

给组添加子元素的方法
- 创建图片/精灵等显示对象时指定组
- group.add() 直接添加
- group.create(x, y, key, frame?, exists?) 创建子元素并添加到组中.返回创建的显示对象

### Phaser中的动画
- Phaser.Tween 补间动画
- Phaser.Animation 逐帧动画
- 在场景的update中对可视对象的属性进行更改

#### 补间动画
```
var tween = game.add.tween(Object) // Object可以是图片/精灵/文字等可见对象
tween.to(properties, duration, ease, autoStart, delay, repeat, yoyo);
tween.from(properties, duration, ease, autoStart, delay, repeat, yoyo);
```
- `tween.to`从当前状态过度到指定状态
- `tween.from`从指定状态过渡到当前状态
- properties 需要过度的属性的集合，是一个对象
- duration 持续时间，单位是毫秒
- ease 缓动函数，值为字符串或函数
- autoStart 创建动画后自动立刻开始动画,布尔值
- delay 动画延迟多久后开始
- repeat 动画重复次数，数字
- yoyo 是否反向进行动画

返回的补间动画对象有如下方法
```
tween.start(); // 动画开始
tween.stop(); // 动画停止
tween.pause(); // 动画暂停
tween.resume(); // 动画恢复
```

#### 逐帧动画

Phaser.Animation逐帧动画的每一帧都要单独指定，不像补间动画只需指定开始和结束那两个关键帧。
Animation是通过图片来实现的，我们可以给它每一帧都指定一张图片，然后连续播放形成动画。

通过精灵对象的`animations`属性类使用动画，这个精灵对象的贴图必须是spritesheet或者atlas加载的。
```
// 精灵对象
var spriteObj = game.add.sprite(/* ... */)

// 定义动画
spriteObj.animations.add(name, frames[array]);
// 播放动画
spriteObj.animations.play(name, frameRate, loop, killOnComplete)
// 停止动画
spriteObj.animations.stop(name)
```
- name 动画名称，自定义的字符串
- frames 数组，用于指定资源中哪些帧用于动画
- frameRate 帧率，每秒播放多少帧，默认60
- loop 是否循环，布尔值
- killOnComplete 但动画完成时是否清除精灵对象

#### 制作altas的方法
软件
- texture packer
- shoebox

```
game.load.atlasXML()
```

### Phaser中的粒子系统
Phaser中的粒子扩展自Phaser.Sprite对象，粒子是由粒子发射器发射出来的。

目前Phaser内置的粒子发射器为`Phaser.Particles.Acrade.Emitter`,它是以Arcade物理引擎为几次的一种粒子发射器。可以通知粒子的形态、熟练、速度、方向、生存时间等，甚至可以在粒子上进行物理碰撞检测。

```
// 添加一个粒子发射器
var emitter = game.add.emitter(x?, y?, maxParticles?)
```
- x,y 粒子发射器的位置
- maxParticles 该粒子发射器所能产生的最大粒子数量

```
// 使用粒子发射器创建粒子
var emitter = game.add.emitter()
emitter.makeParticles(keys, frames?, quantity?, collide?, collideWoldBounds?);
// 发射一定数量的粒子
emitter.start(explode?, lifeSpan?, frequency?, quantity?, foreceQuantity?);
// 持续发射粒子
emitter.flow(lifeSpan?, frequency?, quantity?, total?, immediate?)
```
- keys 所要加载的资源名称
- frames 在资源内的帧名成
- quantity 产生多少个粒子，在同一时间内屏幕上显示的粒子数量，越小越好，太多影响性能
- collide 粒子之间碰撞检测
- collideWoldBounds 粒子和游戏边界碰撞检测

- explode 是否把粒子一次性发射出去，布尔值，若未假，一次就发射一个粒子
- lifeSpan 粒子发射后的存在时间
- frequency 发射频率，单位毫秒
- quantity 发射的粒子数量,`emitter.flow`中为每次发射的粒子数量
- total `emitter.flow`中若为-1则会发射无限粒子

发射出的粒子大小、速度、透明度是随机的，可以用下列方法加以限定
```
emitter.setXSpeed(min?,max?)
emitter.setYSpeed(min?,max?)
emitter.setScale(minX?, maxX?, minY?, maxY?, rate?)
emitter.setAlpha(min?, max?, rate?, ease?);
emitter.setRotation(min?, max?)
```
- setXSpeed/setYSpeed 设置所产生的粒子在x,y轴方向上的速度
- rate 如果设置，粒子会从最小值过度到最大值，值为数字，为过渡时间，毫秒
- setRotation 设置角速度
- setScale 设置缩放
```
emitter.gravity = 600 // 设置粒子重力
emitter.bounce.x/y = 0.8 // 设置弹性系数
```

### 瓦片地图
一些可复用的瓦片构成的的地图就叫瓦片地图，组成地图的小图块也被称之为瓦片

#### Tiled 瓦片地图编辑器
官网 http://www.mapeditor.org/

制作步骤:
1. 添加瓦片图集
2. 新建图层
3. 构建地图
4. 导出地图

在导入图块后，需要进行embed tileset将图块数据放入json内部，不然Phaser现阶段无法正确的读取。
见：https://github.com/photonstorm/phaser-ce/issues/273

最后应导出为json数据

#### 在phaser中使用瓦片地图
```
// 加载瓦片地图数据
game.load.tilemap(key, url?, data?, format?)
```
- url 存放瓦片地图的地址
- data 瓦片地图数据 与url参数二选一
- format 数据的格式，一般是json, 填写`Phaser.Tilemap.CSV`或`Phaser.Tilemap.TILED_JSON`

```
// 添加到游戏之中
var titlemap = game.add.titlemap(key, tileWidth?, tileHeight?, width?, height?)

// 将瓦片地图依赖的资源集合(小图片集)加载进来
tilemap.addTilesetImage(tileset, key?); // tileset是瓦片地图软件tiled中导入的图块的名称,后一个Key是图片资源key
// 创建层
tilemap.createLayer(layer);
```
- layer 在Tiled软件中绘制地图的层的名称
- tileset 瓦片地图软件tiled中导入的图块的名称

```
// 设置哪些瓦片需要进行碰撞检测
tilemap.setCollision(indexs, collides?, layer?);
// 某个区间的瓦片进行碰撞检测
tilemap.setCollisionBetween(start, stop, collides?, layer?);
```
- indexs 数组，数组元素为瓦片的索引


## Phaser中的事件与交互
### Phaser中的事件系统
Phaser有一套内置的事件系统，基于观察者模式(发布/订阅者模式)来设计的。

Phaser中的事件系统是由Phaser.Signal对象来实现的。
每一个Signal对象都代表着一类事件，是一个信号发射器。
```
// 创建对象
var signal = new Phaser.Signal();
// 添加事件监听器
siganl.add(listener, listenerContext?. priority?, args?);
// 添加只会执行一次的监听器
signal.addOnece(listener, listenerContext?. priority?, args?)
// 移除单个事件监听器
signal.remove(listener);
// 移除该signal对象上所有的事件监听器
signal.removeAll();
// 向所有该signal对象上的监听器分发事件
signal.dispatch(params?)
// 注销并释放signal对象
signal.dispose()
```
- listener 事件监听器函数
- listenerContext 事件监听器函数内的上下文(this)
- priority 函数执行的优先级
- args 给监听器函数的参数
- params 传入监听器函数的参数

#### 常用的系统事件
```
game.onBlur // 游戏失去焦点时事件
game.onFocus // 游戏得到焦点事件
game.onPause // 游戏暂停事件
game.Resume // 游戏恢复事件

game.scale.onFullScreenChange // 当进入或退出全屏时
game.scale.onOrientationChange // 当游戏横竖屏切换时
game.scale.onSizeChaneg // 当游戏尺寸改变时

game.load.onFileComlete // 当某一个文件加载完成时
game.load.onFileError //  当一个文件加载失败时
game.load.onFileStart // 当一个文件开始加载时
game.load.onLoadComplete // 当所有资源加载完成时

// tween是一个补间动画实例
tween.onStart // 动画开始时
tween.onComplete // 动画完成时
tween.onLoop // 动画循环时（开始时指定动画无限循环）
tween.onRepeat // 动画重复时（开始时指定动画循环指定次数）

// animation 是一个逐帧动画实例
animation.onStart // 动画开始时
animation.onComplete // 动画完成时
animation.onLoop // 动画循环播放时
animation.onUpdate // 东湖阿达帧变化时

```
以上游戏事件都是一个signal实例，所以由add/remove等signal对象的方法用于注册或移除监听器

### Phaser中的用户交互管理对象
Phaser.Input 是用户交互管理对象，负责所有用户交互的管理，包括鼠标事件、键盘事件以及触摸事件等
```
// 快速引用
game.input // => new Phaser.Input(game);

// 下面四个是signal对象
game.input.onDown // 按下事件
game.input.onUp // 离开事件
game.input.onTap // 轻击事件
game.input.onHold // 长按事件

// 添加鼠标或手指一动事件监听器
game.input.addMoveCallback(callbackFunction, context)
// 删除鼠标或手指移动事件监听器
game.input.deleteMoveCallback(callbackFunction, context)
```

#### Phaser.Pointer对象
Phaser.Pointer代表的是一个指针对象，这个指针可以是鼠标、手指或其他输入设备。在触摸设备上，一个Pointer对象代表一个手指，所以可能由多个Pointer对象。

利用Pointer可以兼容支持不同设备上的指针输入对象
```
// 获取最近一次“激活”的Pointer对象
var pointer = game.input.activePointer;

pointer.clientX // 指针事件发生时的x坐标
pointer.clientY // 指针事件发生时的y坐标

pointer.isDown // 用来判断指针是否在按下状态，布尔值
pointer.isUp // 用来判断指针是否在释放状态，布尔值
```

在移动设备上手指触摸到屏幕上就是激活状态，桌面上鼠标在游戏中永远是激活的

##### 鼠标对象

```
// 获取普通鼠标对象
var mouse = game.input.mouse;
// 获取为鼠标定制的Pointer对象
var mousePointer = game.input.mousePointer;

// 鼠标滚轮事件的回调
mouse.mouseWheelCallback // 对其负值一个函数
// 鼠标滚轮的滚动方向,1为向上,-1为向下
mouse.wheelDelta // 可读取属性

mousePointer.leftButton // 鼠标左键对象
mousePointer.middleButton // 鼠标中键对象
mousePointer.rightButton // 鼠标右键对象
// 以上三个对象的使用详情见文档
```

#### 键盘对象
```
// 获取键盘对象
var keyboard = game.input.keyboard;

// 添加按键回调，该回调监听所有键盘按键
keyboard.addCallbacks(context, onDown, onUp, onPress)
// 创建单个按键的键盘对象
keyboard.addKey(keycode) // 返回Phaser.key对象
// 创建一个包含上下左右方向键的键盘对象
keyboard.createCursorKeys()
```
- onDown, onUp, onPress 传入的函数
```

#### Phaser.key对象
```
var keyboard = game.input.keyboard;
var key = keyboard.addKey(keycode)

key.isDown // 用来判断该键是否处于按下状态,布尔值
key.isUp // 用来判断该键是否处于释放状态,布尔值
key.onDown // 键按下时的Signal对象
key.onUp // 键按下时的Signal对象

key.altKey // 判断是否alt键是否也被同时按下
key.ctrlKey
key.shiftKey
```
### 特定游戏对象的交互事件处理 Phaer.Events对象

Phaer.Events对象用于处理特定的游戏对象(如图片/精灵)的交互事件，每个Phaer.Events对象都有一个宿主，用于处理跟宿主相关的事件。

Phaer.Events处理的可能不全是用户交互事件，还包括一些发生在宿主上的系统事件
```
var sprite = game.add.sprite();
sprite.inputEnabled = true; // 开启输入事件
// 获得该游戏对象的Phaser.Events对象
var events = sprite.events;

events.onInputDown  // 当有指针在该对象上按下时的事件(Signal)
events.onInputUp // 当指针在该对象上释放时的事件(Signal)
events.onInputOver // 当指针进入该对象上的事件(Signal)
events.onInputOut // 指针离开该对象的事件(Signal)
```

除了Phaer.Events对象在某一特定的游戏对象上(一般是Sprite)还有一个Phaser.InputHandler对象
```
var sprite = game.add.sprite();
sprite.inputEnabled = true; // 开启输入事件
// 获取该游戏对象上的Phaser.InputHandler对象
var inputHandler = sprite.input;

inputHandler.enableDrag(); // 使其能够被拖动
inputHandler.disableDrag(); // 禁用拖动

inputHandler.pointerOver(); // 判断指针是否在对象之内，返回布尔值，可选参数为一个特定的Pointer对象ID
inputHandler.pointerOut(); // 判断指针是否在该对象之外，返回布尔值，可选参数为一个特定的Pointer对象ID
inputHandler.pointerX; // 指针在该对象内是时，指针相对于该对象的坐标X
inputHandler.pointerY; // 类似上一条

inputHandler.bringToTop; // 设置为true时，点击或拖动该对象会自动位于显示列表的上方
```

## Phaser中的物理引擎
- Arcade : 速度以及加速度,角速度和其加速度,质量，重力，摩擦力和弹跳，碰撞检测
- P2: 比第一个支持更多形状检测，支持物体之间的约束行为，支持物体的材质设置
- Ninja
- box2D 收费物理引擎

### Arcade物理引擎
```
// 在游戏中开启物理引擎(phaser中默认开启此物理引擎，可以省略该句)
game.physics.startSystem(Phaser.Physics.ARCADE);

// 在sprite上启用arcade物理引擎
game.physics.enable(spriteObj[精灵对象实例], Phaser.Physics.ARCADE)

// 对组开启物理引擎(会对组内每一个元素开启物理引擎)
groupObj.enableBody = true;
groupObj.physicsBodyType = Phaser.Physics.ARCADE; // 指定要启用的物理引擎
```
一旦组启用了物理引擎，之后添加进组的子元素也会自动启用指定的物理引擎

一个精灵上启用了物理引擎后，该精灵对象会拥有一个body属性,物理属性都是附加在body上的
```
sprite.body;

// 设置速度velocity(速度值可以为负)
sprite.body.velocity = new Phaser.Point(x方向上的速度, y方向上的速度);
sprite.body.velocity.set(xSpeed, ySpeed);
sprite.body.velocity.x = 100;
sprite.body.velocity.y = 100;

// 设置加速度acceleration
sprite.body.acceleration = new Phaser.Point(aX, aY);
sprite.body.acceleration.set(aX, aY);
sprite.body.acceleration.x = 100;
sprite.body.acceleration.y = 100;

// 设置角速度(旋转速度，正值为顺时针方向)
sprite.body.angularVelocity = 90; // 单位：度每秒

// 设置角加速度
sprite.body.angularAcceleration = 45;

// 设置阻力 drag属性
sprite.body.drag = new Phaser.Point(x, y)
sprite.body.drag.set(x,y);
sprite.body.drag.x = 100;
sprite.body.drag.y = 100;

// 设置重力 一般只设置Y轴上的重力，但X轴上也可以设置
sprite.body.gravity = new Phaser.Point(x, y);
sprite.body.gravity.set(x,y);
sprite.body.gravity.x = 100;
sprite.body.gravity.y = 100;

// 设置弹跳
sprite.body.bounce = new Phaser.Point(x, y); // 取值0~1，以下都是
sprite.body.bounce.set(x,y);
sprite.body.bounce.x = 100;
sprite.body.bounce.y = 100;
```

```
sprite.body.friction.set(100); // 设置与其他物体的摩擦力
sprite.body.rotation = Math.PI // 设置角度
sprite.body.immovable = true // 设置物体是否固定
sprite.body.mass = 10;  // 设置物体的相对质量，默认为1
sprite.body.maxVelocity.set(100, 200) //  设置最大速度
sprite.body.maxAugular = 1000; // 设置最大角速度

sprite.body.setSize(width, height, offsetX, offsetY) // 设置body的范围大小
sprite.body.reset(x, y) // 重置所有物理方法

// 以下三个方法均返回一个角度
game.physic.arcade.moveToXY(sprite, x, y, speed); // 朝着坐标点移动
game.physic.arcade.moveToObject(sprite, destinationObj, speed); // 朝着目标对象移动
game.physic.arcade.moveToPointer(sprite, speed, pointerObj) // 朝着Pointer对象移动

// 加速运动到某个位置
game.physic.arcade.accelerateToXY()
game.physic.arcade.accelerateToObject()
game.physic.arcade.accelerateToPointer()


// 计算角度
game.physic.arcade.angleBetween(source, target)
game.physic.arcade.angleToPointer(displayObj, pointerObj);
game.physic.arcade.angleToXY(displayObj, x, y);

// 计算距离
game.physic.arcade.distanceBetween(source, target);
game.physic.arcade.distanceToPointer(displayObj, PointerObj);

// 计算速度
game.physic.arcade.computeVelocity(axis, body, velocity, acceleration, drag)
game.physic.arcade.velocityFromAngle(angle, speed, point)
```
#### 使用Arcade进行碰撞检测
