/*****************************************************************************
 * 遊戲進入點.
 * 
 * created  by channel
 * 
 * todo list:
 *  
 * note:
 *
****************************************************************************/
function GameMain() {
    //----------------------------------------------------------------------------
    // 變數區.
    //----------------------------------------------------------------------------
    // 建立場景.
    var scene =  new THREE.Scene();
    // 建立攝影機.
    var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 5000);

    // 建立成像物件.
    var renderer = new THREE.WebGLRenderer({ alpha: true});

    // 建立FPS.
    var stats = new Stats();
    var container = document.createElement('div');

    // 遊戲時脈.
    var gameClock = new THREE.Clock();
    var gameClockOldT =  0;

    // 鏡頭Z軸縮放.
    var cameraZoom = -1500;

    // 10:遊戲模式.
    var gameMainMode = 10;
  
    //----------------------------------------------------------------------------
    // 初始THREE.
    //----------------------------------------------------------------------------
    initTHREE = function (camera, renderer) {
        // 建立成像物件.
        //renderer.shadowMap.enabled = true;
        //renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(renderer.domElement);

        // 設定全域光源物件.
        //var ambient = new THREE.AmbientLight(0xe0e0e0);
        //scene.add(ambient);

        // 設定平行光源物件.
        //var directionalLight = new THREE.DirectionalLight(0xffffff, 1.0, 100);
        //directionalLight.position.set(0, -100, 150);
        //directionalLight.castShadow = true;
        //scene.add(directionalLight);
        
        // 設定聚光燈物件.
        var spotLight = this.spotLight1 = new THREE.SpotLight(0xffffff, 1.0);
        spotLight.position.set(0, 0, cameraZoom);
        spotLight.castShadow = true;
        scene.add(spotLight);

        // 設置相機的位置
        camera.position.set( 0, 50, cameraZoom);
        // 設置相機聚焦的位置.        
        camera.lookAt(scene.position);

        camera.rotation.x = Math.PI;
        camera.rotation.y = 0;
        camera.rotation.z = 0;

    }

    //----------------------------------------------------------------------------
    // 初始FPS.
    //----------------------------------------------------------------------------
    initFPS = function (stats, container) {
        document.body.appendChild(container);
        var info = document.createElement('div');
        info.style.position = 'absolute';
        info.style.top = '10px';
        info.style.width = '100%';
        info.style.textAlign = 'center';
        info.innerHTML = '';
        container.appendChild(info);
    }

    //--------------------------------------------------------------------
    // 點擊滑鼠. 
    //--------------------------------------------------------------------
    onMouseUp = function (e) {
    }

    //--------------------------------------------------------------------
    // 觸碰移動. 
    //--------------------------------------------------------------------
    onMouseMove = function (e) {
    }

    //--------------------------------------------------------------------
    // 觸碰放開. 
    //--------------------------------------------------------------------
    onTouchEnd = function (e) {
    }

    //--------------------------------------------------------------------
    // 觸碰移動. 
    //--------------------------------------------------------------------
    onTouchMove = function (e) {
    }

    //--------------------------------------------------------------------
    // 按下鍵盤. 
    //--------------------------------------------------------------------
    onKeydown = function (e) {
        var keyCode = e.keyCode;
        //alert('keydown:' + keyCode);
        gamePlay.onKeydown(keyCode);
    }

    //--------------------------------------------------------------------
    // 放開鍵盤. 
    //--------------------------------------------------------------------
    onKeyup = function (e) {
        var keyCode = e.keyCode;
        //alert('keydown:' + keyCode);
        gamePlay.onKeyup(keyCode);
    }

    
    //--------------------------------------------------------------------
    // 成像迴圈. 
    //--------------------------------------------------------------------
    render = function () {
        // 鎖 FPS 30.
        gameClockOldT += gameClock.getDelta();
        if (gameClockOldT < 0.033) {
            requestAnimationFrame(render);
            return;
        }
        gameClockOldT -= 0.033;
                
        // 開始計算FPS.
        stats.begin();

        // gameMainMode(10:遊戲模式).
        if(gameMainMode == 10)
        {
            gamePlay.update();
        }

        // 成像場景.
        renderer.render(scene, camera);
        // 設定執行成像.
        requestAnimationFrame(render);
        // 結束計算FPS.
        stats.end();
    }

    //----------------------------------------------------------------------------
    // 顯示或關閉FPS.
    //----------------------------------------------------------------------------
    this.FPS = function (visible) {
        if (visible) {
            container.appendChild(stats.dom);
        }
    }


    //----------------------------------------------------------------------------
    // Main.
    //----------------------------------------------------------------------------
    // 初始THREE.
    initTHREE(camera, renderer);
    // 初始FPS.
    initFPS(stats, container);

    // gameMainMode(10:遊戲模式).
    if (gameMainMode == 10) {
        // 建立Gameplay物件.
        var gamePlay = new GamePlay(scene);
        // 建立關卡.
        //gamePlay.resetGame(1);
    }

    // 設定成像迴圈.
    render();

    // 放開滑鼠.
    window.addEventListener('mouseup', onMouseUp, false);
    // 滑鼠移動. 
    window.addEventListener('mousemove', onMouseMove, false);

    // 觸碰移動.
    window.addEventListener('touchmove', onTouchMove, false);
    // 觸碰放開.
    window.addEventListener('touchend', onTouchEnd, false);
    
    // 按下按鍵.
    window.addEventListener('keydown', onKeydown, false);
    // 放開鍵盤.
    window.addEventListener('keyup', onKeyup, false);
}


//----------------------------------------------------------------------------
// 程式進入點.
//----------------------------------------------------------------------------
window.onload = function () {
    // 使用手機裝置
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        alert("抱歉!!暫時不支援手機裝置!!請使用電腦版瀏覽器體驗!!");
    }
    // 使用桌上裝置
    else {
        // 建立物件.
        var gameMain = new GameMain();
        // 顯示FPS.
        gameMain.FPS(true);
    }
};