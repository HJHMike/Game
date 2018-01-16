// Learn cc.Class:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/class/index.html
// Learn Attribute:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/reference/attributes/index.html
// Learn life-cycle callbacks:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/life-cycle-callbacks/index.html

cc.Class({
    extends: cc.Component,

    properties: {
         // 这个属性引用了星星预制资源
         starPrefab: {
             default: null,
             type: cc.Prefab
         },
         // 星星产生后消失时间的随机范围
         maxStarDuration: 0,
         minStarDuration: 0,
         // 地面节点，用于确定星星生成的高度
         ground: {
             default: null,
             type: cc.Node
         },
         // player 节点，用于获取主角弹跳的高度，和控制主角行动开关
         player: {
             default: null,
             type: cc.Node
         },
         // score label 的引用
         scoreDisplay: {
             default: null,
             type: cc.Label
         },
         // 得分音效资源
         scoreAudio: {
             default: null,
             url: cc.AudioClip
         },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},
         onLoad: function () {
             // 获取地平面的 y 轴坐标
             this.groundY = this.ground.y + this.ground.height/2;
             //初始化计时器
             this.timer = 0;
             this.starDuration = 0;
             // 生成一个新的星星
             this.spawnNewStar();
             // 初始化计分
             this.score = 0;
         },
         
         spawnNewStar: function() {
             // 使用给定的模板在场景中生成一个新节点
             var newStar = cc.instantiate(this.starPrefab);
             // 将新增的节点添加到 Canvas 节点下面
             this.node.addChild(newStar);
             // 为星星设置一个随机位置
             newStar.setPosition(this.getNewStarPosition());
             // 将 Game 组件的实例传入星星组件
             newStar.getComponent('Star').game = this;
             //重制计时器，根据消失事件范围随机取一个值
             this.starDuration = this.minStarDuration + cc.random0To1() * (this.maxStarDuration - this.minStarDuration);
             this.timer = 0;
         
         },
         
         getNewStarPosition: function () {
             var randX = 0;
             // 根据地平面位置和主角跳跃高度，随机得到一个星星的 y 坐标
             var randY = this.groundY + cc.random0To1() * this.player.getComponent('Player').jumpHeight + 50;
             // 根据屏幕宽度，随机得到一个星星 x 坐标
             var maxX = this.node.width/2;
             randX = cc.randomMinus1To1() * maxX;
             // 返回星星坐标
             return cc.p(randX, randY);
         },

    start () {

    },

         update :function (dt) {
         //游戏失败逻辑
         if (this.timer > this.starDuration){
             this.gameOver();
             return;
         }
         this.timer += dt;
         
     },
         gainScore: function () {
             this.score += 1;
             // 更新 scoreDisplay Label 的文字
             this.scoreDisplay.string = 'Score: ' + this.score.toString();
             // 播放得分音效
             cc.audioEngine.playEffect(this.scoreAudio, false);
         
     },
         gameOver: function () {
             this.player.stopAllActions();
             cc.director.loadScene('game');
         }
    });
