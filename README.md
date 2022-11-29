# threejs 学习

[使用react + threejs ](https://docs.pmnd.rs/react-three-fiber/getting-started/introduction)

- study: 包括基础的 threejs 的使用，以及使用 TEEEN.js 动画，以及使用设备进行方向控制;
- threejs_bmw: 是一个使用 threejs 做的在线展厅
- telsa-car: 自己做的特斯拉汽车 demo


## 开始步骤

```js
// 初始化场景
this.scene = new THREE.Scene();
// 初始化相机
this.camera = new THREE.PerspectiveCamera(
  90,
  document.body.clientWidth / document.body.clientHeight,
  0.1,
  50
);
//构造函数参数
//fov：视场角
//aspect：视场宽高比（一般用 画布宽/画布 高即可）
//near：能看多近
//far：能看多远
//这几个参数决定了哪些scene里的三维顶点会被渲染/绘制出来



// 设置相机的位置,默认先看侧面
this.camera.position.set(5, 0, 0);
// 初始化渲染器
this.renderer = new THREE.WebGLRenderer();
this.renderer.setSize(document.body.clientWidth, document.body.clientHeight);
this.ref.current.appendChild(this.renderer.domElement);
// 添加鼠标控制器
new Orbitcontrols(this.camera, this.renderer.domElement);
// 加载车子的lgtf模型
this.initCar();
this.loop();
window.addEventListener("resize", this.onWindowResize);
```
