# 简介

给view添加点击涟漪效果, 可自定义颜色、动画时间、涟漪大小以及透明度等. Ripple是一个构造函数

>由于button有高光, 最好用label或view来当按钮, userInteractionEnabled和clipsToBounds要改为true

main.js里是一个用view套的按钮实例, 并在点击后按钮标题改变
![GN5pOx.gif](https://s1.ax1x.com/2020/04/03/GN5pOx.gif)

# 属性&方法

属性 | 类型 | 默认值 | 说明
---|---|---|---
color | $color | $color("white") | 涟漪颜色
alpha | number | 0.5 | 动画开始时的透明度
size | number | 4.1 | 最终形成的涟漪大小(相对于父view)
duration | number | 0.8 | 涟漪扩大的时间
longPressedStopDuration | number | 0.5 | 长按时用stop()方法涟漪透明度下降的时间
index | number | Infinity(最上层) | 涟漪在子视图中所处的层级
addClearView | boolean | true | 为保证view能被流畅点击, 会在父view上加一层clear的view, 若此参数为false, 则不会添加.

### 三个事件

属性 | 说明
---|---
tappedHandler | 点击事件, 手指移开按钮则不会触发
longPressedHandler | 长按事件, 判定时间同duration
completionHandler |涟漪消失后触发

### 方法

```js
ripple.start(view, location) //动画开始
ripple.moved(location)       //判断手指是否移出view, 若移出则ripple.stop()
ripple.stop()                //使涟漪的透明度在[stopDuration]秒内降为0, 然后移除
```

# 食用举例

```js
//先导入riple.js, 然后设定一个全局变量用来放ripple对象
const Ripple = require("scripts/ripple"); //若想在单个js文件里用, 把ripple.js除最后一行复制进你的脚本就行, 这一行就不用了
var ripple;

$ui.render({
  views: [
    {
      type: "label",
      props: {
        text: "button",
        bgcolor: $color("lightGray"),
        userInteractionEnabled: true, //用label当按钮开启userInteractionEnabled
        frame: $rect(10, 10, 150, 40)
      },
      events: {
        touchesBegan: (sender, location) => {
          ripple = new Ripple();
          ripple.start(sender, location);
        },
        touchesMoved: (sender, location) => {
          ripple.moved(location);
        },
        touchesEnded: () => {
          ripple.stop();
        }
      }
    }
  ]
});
```

# PS

点击事件也可以直接在父view的events里加, 但是需要加上`ripple.stop()`以防止涟漪去不掉

```js
events: {
  tapped: (sender) => {
    ...
    ripple.stop()
  },
  longPressed: (info) => {
    ...
    ripple.stop()
  },
  doubleTapped: (sender) => {
    ...
    ripple.stop();
  }
}
```
