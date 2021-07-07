var hotPoints = [
  {
    position: {
      x: 0,
      y: 0,
      z: -0.4,
    },
    detail: {
      title: "信息点1",
    },
  },
  {
    position: {
      x: -0.4,
      y: -0.1,
      z: 0.4,
    },
    detail: {
      title: "信息点2",
    },
  },
];

var scene, camera, renderer, controls, deviceControls;

function initThree() {
  scene = new THREE.Scene();

  var axesHelper = new THREE.AxesHelper(1500);
  // 和网格模型Mesh一样，AxesHelper你也可以理解为一个模型对象，需要插入到场景中
  scene.add(axesHelper);

  camera = new THREE.PerspectiveCamera(
    90,
    document.body.clientWidth / document.body.clientHeight,
    0.1,
    100
  );
  camera.position.set(0, 0, 0.01);

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(document.body.clientWidth, document.body.clientHeight);

  document.getElementById("container").appendChild(renderer.domElement);

  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.enableZoom = false;
  controls.enablePan = true;
  controls.enableDamping = true;
  controls.minZoom = 0.5;
  controls.maxZoom = 2;

  controls.addEventListener("change", function (e) {
    // console.log(e.target.);
  });
  // deviceControls = new THREE.DeviceOrientationControls(camera);
  //   controls.autoRotateSpeed = 1;
  //   controls.autoRotate = true;
  // useSphere();
  useBox();

  initPoints();

  loop();
}

function useBox() {
  var materials = [];

  var texture_left = new THREE.TextureLoader().load("./images/scene_left.jpeg");
  materials.push(new THREE.MeshBasicMaterial({ map: texture_left }));

  var texture_right = new THREE.TextureLoader().load(
    "./images/scene_right.jpeg"
  );
  materials.push(new THREE.MeshBasicMaterial({ map: texture_right }));

  var texture_top = new THREE.TextureLoader().load("./images/scene_top.jpeg");
  materials.push(new THREE.MeshBasicMaterial({ map: texture_top }));

  var texture_bottom = new THREE.TextureLoader().load(
    "./images/scene_bottom.jpeg"
  );
  materials.push(new THREE.MeshBasicMaterial({ map: texture_bottom }));

  var texture_front = new THREE.TextureLoader().load(
    "./images/scene_front.jpeg"
  );
  materials.push(new THREE.MeshBasicMaterial({ map: texture_front }));

  var texture_back = new THREE.TextureLoader().load("./images/scene_back.jpeg");
  materials.push(new THREE.MeshBasicMaterial({ map: texture_back }));

  var box = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), materials);
  box.geometry.scale(1, 1, -1);
  scene.add(box);
}

function useSphere() {
//   SphereGeometry(radius : Float, widthSegments : Integer, heightSegments : Integer, phiStart : Float, phiLength : Float, thetaStart : Float, thetaLength : Float)
// radius — 球体半径，默认为1。
// widthSegments — 水平分段数（沿着经线分段），最小值为3，默认值为8。
// heightSegments — 垂直分段数（沿着纬线分段），最小值为2，默认值为6。
// phiStart — 指定水平（经线）起始角度，默认值为0。。
// phiLength — 指定水平（经线）扫描角度的大小，默认值为 Math.PI * 2。
// thetaStart — 指定垂直（纬线）起始角度，默认值为0。
// thetaLength — 指定垂直（纬线）扫描角度大小，默认值为 Math.PI。
  var sphereGeometry = new THREE.SphereGeometry(1, 50, 50);
  sphereGeometry.scale(-1, 1, 1);
  // sphereGeometry.rotateY(180*Math.PI/180);

  var texture = new THREE.TextureLoader().load("./images/scene.jpeg");
  var sphereMaterial = new THREE.MeshBasicMaterial({ map: texture });

  // var sphereGeometry = new THREE.SphereGeometry(50, 20, 20);

  var sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
  // sphere.material.wireframe  = true;
  scene.add(sphere);
}

function loop() {
  requestAnimationFrame(loop);
  controls.update();
  TWEEN.update();
  // deviceControls.update();
  renderer.render(scene, camera);
}

window.onload = initThree;

function initPoints() {
  var pointTexture = new THREE.TextureLoader().load("images/hot.png");
  var material = new THREE.SpriteMaterial({ map: pointTexture });

  var poiObjects = [];
  for (var i = 0; i < hotPoints.length; i++) {
    var sprite = new THREE.Sprite(material);
    sprite.scale.set(0.1, 0.1, 0.1);
    sprite.position.set(
      hotPoints[i].position.x,
      hotPoints[i].position.y,
      hotPoints[i].position.z
    );

    scene.add(sprite);

    sprite.detail = hotPoints[i].detail;
    poiObjects.push(sprite);
  }

  document
    .querySelector("#container")
    .addEventListener("click", function (event) {
      event.preventDefault();

      var raycaster = new THREE.Raycaster();
      var mouse = new THREE.Vector2();

      mouse.x = (event.clientX / document.body.clientWidth) * 2 - 1;
      mouse.y = -(event.clientY / document.body.clientHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);

      var intersects = raycaster.intersectObjects(poiObjects);
      if (intersects.length > 0) {
        const p = intersects[0].point;
        console.log(intersects[0].object.detail);
        console.log("点击的点", p);
        p.z = p.z > 0 ? p.z - 0.1 : p.z + 0.1;

        set_cameraPosition(p, () => {
          console.log(p);
          // 重新设置相机的位置
          camera.position.set(p.x, p.y, p.z);
          // 往正前方看
          // camera.lookAt(new THREE.Vector3(p.x, 0, p.z))
        });
      }
    });
}



//调整相机视角
function set_cameraPosition(p, callback) {
  let position = new THREE.Vector3(p.x, p.y, p.z);
  new TWEEN.Tween(camera.position)
    .to(position)
    .repeat(0)
    .start()
    .onComplete(callback);
}
