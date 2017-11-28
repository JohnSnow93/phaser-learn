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