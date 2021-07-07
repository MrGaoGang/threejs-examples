import React, { Component } from "react";
import * as THREE from "three";
import * as Orbitcontrols from "three-orbitcontrols";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
export default class App extends Component {
  constructor(props) {
    super(props);
    this.ref = React.createRef();
  }
  loop = () => {
    requestAnimationFrame(this.loop);
    this.renderer.render(this.scene, this.camera);
  };

  addLight() {
    // 环境光
    var ambientLight = new THREE.AmbientLight(0xd5d5d5);
    ambientLight.intensity = 1.2;
    this.scene.add(ambientLight);
    // 从顶上有一个聚光灯
    const light = new THREE.SpotLight();
    light.position.y = 1000;
    light.position.x = 0;
    light.position.z = 0;
    this.scene.add(light);

    // 从车底来一个平行光
    var bottomRightDirLight = new THREE.DirectionalLight();
    bottomRightDirLight.position.x = 0;
    bottomRightDirLight.position.y = -1000;
    bottomRightDirLight.position.z = 0;
    bottomRightDirLight.intensity = 0.8;
    this.scene.add(bottomRightDirLight);

    // var frontDirLight = new THREE.DirectionalLight(0xffffff);
    // frontDirLight.position.x = -500;
    // frontDirLight.position.y = 300;
    // frontDirLight.position.z = 500;
    // frontDirLight.intensity = 0.8;
    // this.scene.add(frontDirLight);
    // 车子正前上方斜45度的灯结束
  }

  initCar() {
    this.addLight();
    const loader = new GLTFLoader();
    loader.load(
      "/scene.gltf", // called when the resource is loaded
      (gltf) => {
        console.log("success");
        this.scene.add(gltf.scene);
      },
      // called while loading is progressing
      function (xhr) {
        console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
      },
      // called when loading has errors
      function (error) {
        console.log("An error happened", error);
      }
    );
  }
  componentDidMount() {
    // 初始化场景
    this.scene = new THREE.Scene();
    // 初始化相机
    this.camera = new THREE.PerspectiveCamera(
      90,
      document.body.clientWidth / document.body.clientHeight,
      0.1,
      50
    );
    // 设置相机的位置,默认先看侧面
    this.camera.position.set(5, 0, 0);
    // 初始化渲染器
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(
      document.body.clientWidth,
      document.body.clientHeight
    );
    this.ref.current.appendChild(this.renderer.domElement);
    // 添加鼠标控制器
    new Orbitcontrols(this.camera, this.renderer.domElement);
    // 加载车子的lgtf模型
    this.initCar();
    this.loop();
    window.addEventListener("resize", this.onWindowResize);
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(
      document.body.clientWidth,
      document.body.clientHeight
    );

    this.renderer.render(this.scene, this.camera);
  }
  render() {
    return <div id="container" ref={this.ref}></div>;
  }
}
