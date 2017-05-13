/*****************************************************************************
 * 遊戲GamePlay.
 * 
 * created  by channel
 * 
 * todo list:
 *  
 * note:
 *
****************************************************************************/
function GamePlay(scene) {

    // 常數-磚塊快速下降速度.
    var BRICK_DROP_RAPIDLY   = 0.001;
    // 常數-磚塊正常下降速度.
    var BRICK_DOWN_SPEED_MAX = 1.0;

    // 紀錄場景指標.
    var scene = scene;

    // 定義磚塊.
    // 1.
    var N1_1 = [4,  8,  9, 13];
    var N1_2 = [9, 10, 12, 13];
    // 2.
    var N2_1 = [5, 8,  9, 12];
    var N2_2 = [8, 9, 13, 14];
    // 3.
    var L1_1 = [8, 12, 13, 14];
    var L1_2 = [4,  5,  8, 12];
    var L1_3 = [8,  9, 10, 14];
    var L1_4 = [5,  9, 12, 13];
    // 4.
    var L2_1 = [10, 12, 13, 14];
    var L2_2 = [ 4,  8, 12, 13];
    var L2_3 = [ 8,  9, 10, 12];
    var L2_4 = [ 4,  5,  9, 13];
    // 5.
    var T_1 =  [ 9, 12, 13, 14];
    var T_2 =  [ 4,  8,  9, 12];
    var T_3 =  [ 8,  9, 10, 13];
    var T_4 =  [ 5,  8,  9, 13];
    // 6.
    var O_1 =  [ 8,  9, 12, 13];
    // 7.
    var I_1 = [12, 13, 14, 15];
    var I_2 =  [ 1,  5,  9, 13];

    // 方塊陣列(10x20).
    var bricksArray = [];
    // 方塊陣列(4x4).
    var bricks = [];
    // 下一個方塊陣列(4x4).
    var bricksNext = [];

    // 方塊在容器的位置.
    var containerX = 6;  // (-2~6)(  為6的時候不能旋轉方塊).
    var containerY =-4;  // (-3~16)(-3表示在上邊界外慢慢往下掉).

    // 方塊編號(1~7).
    var brickId = 1;
    // 方塊狀態(0~3).
    var brickState = 0;

    // 圖形磚塊陣列.
    var bricksObject = [];
    // 下一個圖形磚塊陣列.
    var bricksNextObject = [];

    // 遊戲時脈.
    var gamePlayClock = new THREE.Clock();
    // 磚塊下降速度.
    var brickDownSpeedMax = BRICK_DOWN_SPEED_MAX;
    var brickDownSpeed = brickDownSpeedMax;

    // 下一個磚塊編號(1~7).
    var brickNextID = 1;

    // 消失磚塊透明度.
    var brickAlpha = 1.0;

    // 連線數.
    var linesNumber = 0;
    // 最高分數.
    var highestLines = 0;

    // 連線數字物件.
    var fontLinesNumber = null;
    var fontHighestLinesNumber = null;

    // 10:遊戲中.
    // 11:遊戲中-清除磚塊.
    // 12:遊戲中-遊戲結束.
    var gamePlayMode = 10;


    //---------------------------------------------------------------------------
    // 取得磚塊索引陣列.
    //---------------------------------------------------------------------------
    getBrickIndex = function (brickId, state) {
        // 取得要轉的方塊物件.
        if (brickId == 1 && state == 0) {                   // N1_1.
            return N1_1;
        } else if (brickId == 1 && state == 1) {            // N1_2.
            return N1_2;
        } else if (brickId == 2 && state == 0) {            // N2_1.
            return N2_1;
        } else if (brickId == 2 && state == 1) {            // N2_2.
            return N2_2;
        } else if (brickId == 3 && state == 0) {            // L1_1.
            return L1_1;
        } else if (brickId == 3 && state == 1) {            // L1_2.
            return L1_2;
        } else if (brickId == 3 && state == 2) {            // L1_3.
            return L1_3;
        } else if (brickId == 3 && state == 3) {            // L1_4.
            return L1_4;
        } else if (brickId == 4 && state == 0) {            // L2_1.
            return L2_1;
        } else if (brickId == 4 && state == 1) {            // L2_2.
            return L2_2;
        } else if (brickId == 4 && state == 2) {            // L2_3.
            return L2_3;
        } else if (brickId == 4 && state == 3) {            // L2_4.
            return L2_4;
        } else if (brickId == 5 && state == 0) {            // T_1.
            return T_1;
        } else if (brickId == 5 && state == 1) {            // T_2.
            return T_2;
        } else if (brickId == 5 && state == 2) {            // T_3.
            return T_3;
        } else if (brickId == 5 && state == 3) {            // T_4.
            return T_4;
        } else if (brickId == 6 && state == 0) {            // O_1.
            return O_1;
        } else if (brickId == 7 && state == 0) {            // I_1.
            return I_1;
        } else if (brickId == 7 && state == 1) {            // I_2.
            return I_2;
        }
    }

    //---------------------------------------------------------------------------
    // 轉換定義方塊到方塊陣列.
    // brickId: 方塊編號(1~7).
    //   state: 方塊狀態(0~3).
    //---------------------------------------------------------------------------
    transformToBricks = function( brickId, state){
        var bx, by;

        // 清除方塊陣列.
        for (iy = 0; iy < 4; iy++) {
            for (ix = 0; ix < 4; ix++) {
                bricks[ix][iy] = 0;
            }
        }

        // 取得磚塊索引陣列.
        pBrick = getBrickIndex(brickId, state);

        // 轉換方塊到方塊陣列.
        for (i = 0; i < 4; i++) {
            bx = Math.floor(pBrick[i] % 4);
            by = Math.floor(pBrick[i] / 4);
            bricks[bx][by] = brickId;
        }

        /*
        // 印出訊息.
        for (iy = 0; iy < 4; iy++) {
            var str = ""
            for (ix = 0; ix < 4; ix++) {
                str += bricks[ix][iy] + ",";
            }
            console.log(str);
        }
        */
    }

    //---------------------------------------------------------------------------
    // 複製方塊到容器內.
    //---------------------------------------------------------------------------
    copyToBricksArray = function () {
        var posX = 0;
        var posY = 0;
        for (ix = 0; ix < 4; ix++) {
            for (iy = 0; iy < 4; iy++) {
                if (bricks[ix][iy] != 0) {
                    posX = containerX + ix;
                    posY = containerY + iy;
                    if (posX >= 0 && posY >= 0) {
                        bricksArray[posX][posY] = bricks[ix][iy];
                    }
                }
            }
        }

        /*
        // 印出訊息.
        for (iy = 0; iy < 20; iy++) {
            var str = ""
            for (ix = 0; ix < 10; ix++) {
                str += bricksArray[ix][iy] + ",";
            }
            console.log(str);
        }
        */
    }

    //---------------------------------------------------------------------------
    // 判斷是否可以複製到容器內.
    // true:可以.  false:不可以.
    //---------------------------------------------------------------------------
    ifCopyToBricksArray = function() {
        posX = 0;
        posY = 0;
        for (ix = 0; ix < 4; ix++) {
            for (iy = 0; iy < 4; iy++) {
                if (bricks[ix][iy] != 0) {
                    posX = containerX + ix;
                    posY = containerY + iy;
                    if (posX >= 0 && posY >= 0) {
                        if (bricksArray[posX][posY] != 0) {
                            return false;
                        }
                    }
                }
            }
        }
        return true;
    }

    //---------------------------------------------------------------------------
    // 更新下一個磚塊.
    //---------------------------------------------------------------------------
    updateNextBricks = function (brickId) {
        var bx, by;

        // 清除方塊陣列.
        for (iy = 0; iy < 4; iy++) {
            for (ix = 0; ix < 4; ix++) {
                bricksNext[ix][iy] = 0;
                bricksNextObject[ix][iy].visible(false);
            }
        }
        // 取得磚塊索引陣列.
        pBrick = getBrickIndex(brickId, 0);

        // 轉換方塊到方塊陣列.
        for (i = 0; i < 4; i++) {
            bx = Math.floor(pBrick[i] % 4);
            by = Math.floor(pBrick[i] / 4);
            bricksNext[bx][by] = brickId;
        }

        // 更新方塊.
        for (ix = 0; ix < 4; ix++) {
            for (iy = 0; iy < 4; iy++) {
                if (bricksNext[ix][iy] != 0) {
                    bricksNextObject[ix][iy].color(bricksNext[ix][iy]);
                    bricksNextObject[ix][iy].visible(true);
                }
            }
        }

    }

    //---------------------------------------------------------------------------
    // 更新畫面磚塊.
    //---------------------------------------------------------------------------
    updateScreenBricks = function () {
        // 更新容器.
        for (ix = 0; ix < 10; ix++) {
            for (iy = 0; iy < 20; iy++) {
                if (bricksArray[ix][iy] != 0) {
                    bricksObject[ix][iy].color(bricksArray[ix][iy]);
                    bricksObject[ix][iy].visible(true);
                } else {
                    bricksObject[ix][iy].visible(false);
                }                
            }
        }

        // 更新方塊.
        var posX = 0;
        var posY = 0;
        for (ix = 0; ix < 4; ix++) {
            for (iy = 0; iy < 4; iy++) {
                if (bricks[ix][iy] != 0) {
                    posX = containerX + ix;
                    posY = containerY + iy;
                    if (posX >= 0 && posY >= 0) {
                        bricksObject[posX][posY].color(bricks[ix][iy]);
                        bricksObject[posX][posY].visible(true);
                    }
                }
            }
        }
    }

    //---------------------------------------------------------------------------
    // 產生新磚塊.
    //---------------------------------------------------------------------------
    brickNew = function () {
        // 判斷遊戲結束.
        var gameOver = false;
        if (containerY < 0) {
            gameOver = true;
        }

        // 複製方塊到容器內.
        containerY--;
        copyToBricksArray();

        // 判斷與設定要清除的方塊.
        var lines = ifClearBrick() / 10;        
        if (lines > 0) {
            // 消除連線數量累加.
            linesNumber += lines;
            // 修改連線數量.
            modifyLabel(linesNumber, fontLinesNumber);
            // 11:遊戲中-清除磚塊.
            gamePlayMode = 11;
        }

        // 初始方塊位置.
        containerX = 3;
        containerY =-4;
        
        // 現在出現方塊.
        brickId = brickNextID;
        //brickId = 7;

        // 下個出現方塊.
        // 方塊編號(1~7).
        var minNum = 1;
        var maxNum = 7;
        brickNextID = Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum;

        // 更新下一個磚塊圖形.
        updateNextBricks(brickNextID);

        // 初始方塊狀態.
        brickState = 0;

        // GameOver.
        if (gameOver) {
            // 重新開始遊戲.
            resetGame();
        }
    }

    //---------------------------------------------------------------------------
    // 判斷與設定要清除的方塊.
    //---------------------------------------------------------------------------
    ifClearBrick = function () {
        var pointNum = 0;
        var lineNum = 0;
        for (iy = 0; iy < 20; iy++) {
            for (ix = 0; ix < 10; ix++) {
                if (bricksArray[ix][iy] > 0) {
                    pointNum++;
                }
                if (pointNum == 10) {
                    for (i = 0; i < 10; i++) {
                        lineNum++;
                        bricksArray[i][iy] = 255;
                    }
                }
            }
            pointNum = 0;
        }
        return lineNum;
    }

    //---------------------------------------------------------------------------
    // 清除的方塊.
    //---------------------------------------------------------------------------
    clearBrick = function () {
        var temp = 0;
        // 一列一列判斷清除方塊.
        for (ix = 0; ix < 10; ix++) {
            for (iu = 0; iu < 19; iu++) {
                for (iy = 0; iy < 20; iy++) {
                    if (bricksArray[ix][iy] == 255) {
                        if (iy > 0) {
                            temp = bricksArray[ix][iy - 1];
                            bricksArray[ix][iy - 1] = bricksArray[ix][iy];
                            bricksArray[ix][iy] = temp;
                            iy--;
                        }
                    }
                }
                bricksArray[ix][0] = 0;
            }
        }
    }

    //----------------------------------------------------------------------------
    // 初始遊戲.
    //----------------------------------------------------------------------------
    resetGame = function () {
        // 清除磚塊陣列.
        for (ix = 0; ix < 10; ix++) {
            for (iy = 0; iy < 20; iy++) {
                bricksArray[ix][iy] = 0;
            }
        }
        // 清除方塊陣列.
        for (iy = 0; iy < 4; iy++) {
            for (ix = 0; ix < 4; ix++) {
                bricks[ix][iy] = 0;
            }
        }

        // 更新最高分數.
        if (linesNumber > highestLines) {
            highestLines = linesNumber;
            modifyLabel(highestLines, fontHighestLinesNumber);            
        }

        // 初始連線數量.
        linesNumber = 0;
        // 修改連線數量.
        if (fontLinesNumber != null) {
            modifyLabel(linesNumber, fontLinesNumber);
        }
        // 初始磚塊下降速度.
        brickDownSpeed = brickDownSpeedMax = BRICK_DOWN_SPEED_MAX;        
    }

    //----------------------------------------------------------------------------
    // 加入文字.
    //----------------------------------------------------------------------------
    addLabel = function (text, font, size, color) {
        var textGeo = new THREE.TextGeometry(text, {
            font: font,
            size: size,
            height: 1,
            curveSegments: 1
        });
        var textMaterial = new THREE.MeshBasicMaterial({ color: color });
        var textMesh = new THREE.Mesh(textGeo, textMaterial);
        textMesh.position.copy(new THREE.Vector3(0, 0, 0));
        scene.add(textMesh);
        return textMesh;
    }

    //----------------------------------------------------------------------------
    // 修改文字.
    //----------------------------------------------------------------------------
    modifyLabel = function (text, textMesh) {
        var textGeo = new THREE.TextGeometry(text, {
            font: textMesh.geometry.parameters.parameters.font,
            size: textMesh.geometry.parameters.parameters.size,
            height: textMesh.geometry.parameters.parameters.height,
            curveSegments: textMesh.geometry.parameters.parameters.curveSegments
        });
        textMesh.geometry = null;
        textMesh.geometry = textGeo;
    }

    //----------------------------------------------------------------------------
    // 按下鍵盤.
    //----------------------------------------------------------------------------
    this.onKeydown = function (keyCode) {
        // 10:遊戲中模式.
        if (gamePlayMode == 10) {
            // 上(W)-變換方塊.
            if (keyCode == 38 || keyCode == 87) {
                // 在右邊界不能旋轉.
                if (containerX == 8) { return; }
                if (brickId == 1 || brickId == 2 || brickId == 7) {         // N1、N2、I.
                    // 長條方塊旋轉例外處理.
                    if (brickId == 7) {
                        if (containerX < 0) { return; }
                        if (containerX == 7) { return; }
                    }
                    // 旋轉方塊.
                    brickState++;
                    if (brickState > 1) {
                        brickState = 0;
                    }
                    // 轉換定義方塊到方塊陣列.
                    transformToBricks(brickId, brickState);
                    // 碰到磚塊.
                    if (!ifCopyToBricksArray()) {
                        brickState--;
                        if (brickState < 0) {
                            brickState = 1;
                        }
                    }

                } else if (brickId == 3 || brickId == 4 || brickId == 5) {  // L1、L2、T.
                    // 旋轉方塊.
                    brickState++;
                    if (brickState > 3) {
                        brickState = 0;
                    }
                    // 轉換定義方塊到方塊陣列.
                    transformToBricks(brickId, brickState);
                    // 碰到磚塊.
                    if (!ifCopyToBricksArray()) {
                        brickState--;
                        if (brickState < 0) {
                            brickState = 3;
                        }
                    }
                }

                // 下(S)-快速下降.
            } if (keyCode == 40 || keyCode == 83) {
                // 磚塊快速下降.
                brickDownSpeedMax = BRICK_DROP_RAPIDLY;

                // 左(A)-移動方塊.
            } if (keyCode == 37 || keyCode == 65) {
                containerX--;
                if (containerX < 0) {
                    if (containerX == -1) {
                        if (bricks[0][0] != 0 || bricks[0][1] != 0 || bricks[0][2] != 0 || bricks[0][3] != 0) {
                            containerX++;
                        }
                    } else if (containerX == -2) {
                        if (bricks[1][0] != 0 || bricks[1][1] != 0 || bricks[1][2] != 0 || bricks[1][3] != 0) {
                            containerX++;
                        }
                    } else {
                        containerX++;
                    }
                }
                // 碰到磚塊.
                if (!ifCopyToBricksArray()) {
                    containerX++;
                }

                // 右(S)-移動方塊.
            } if (keyCode == 39 || keyCode == 68) {
                containerX++;
                if (containerX > 6) {
                    if (containerX == 7) {
                        if (bricks[3][0] != 0 || bricks[3][1] != 0 || bricks[3][2] != 0 || bricks[3][3] != 0) {
                            containerX--;
                        }
                    } else if (containerX == 8) {
                        if (bricks[2][0] != 0 || bricks[2][1] != 0 || bricks[2][2] != 0 || bricks[2][3] != 0) {
                            containerX--;
                        }
                    } else {
                        containerX--;
                    }
                }
                // 碰到磚塊.
                if (!ifCopyToBricksArray()) {
                    containerX--;
                }
            }
            // 轉換定義方塊到方塊陣列.
            transformToBricks(brickId, brickState);
            // 更新畫面磚塊.
            updateScreenBricks();
        }
    }


    //----------------------------------------------------------------------------
    // 放開鍵盤.
    //----------------------------------------------------------------------------
    this.onKeyup = function (keyCode) {
        // 10:遊戲中模式.
        // 下(S)-快速下降.
        if (keyCode == 40 || keyCode == 83) {
            // 磚塊恢復正常下降速度.
            //brickDownSpeedMax = BRICK_DOWN_SPEED_MAX;
            brickDownSpeedMax = 1 - (0.02 * linesNumber);
            if (brickDownSpeedMax < 0.1) { brickDownSpeedMax = 0.1;}
        }
    }

    //----------------------------------------------------------------------------
    // 更新.
    //----------------------------------------------------------------------------
    this.update = function () {
        // 10:遊戲中模式.
        if (gamePlayMode == 10) {
            // 方塊下降.
            brickDownSpeed += gamePlayClock.getDelta();
            // 判斷不試快速下降中.
            if (brickDownSpeedMax != BRICK_DROP_RAPIDLY) {
                brickDownSpeedMax = 1 - (0.02 * linesNumber);
                if (brickDownSpeedMax < 0.1) { brickDownSpeedMax = 0.1; }
            }
            if (brickDownSpeed >= brickDownSpeedMax) {
                // 往下降.
                containerY++;                
                // 碰到磚塊.
                if (!ifCopyToBricksArray()) {
                    // 產生新塊.
                    brickNew();
                }
                // 轉換定義方塊到方塊陣列.
                transformToBricks(brickId, brickState);
                // 更新畫面磚塊.
                updateScreenBricks();

                // 初始時脈.
                brickDownSpeed = 0;
            }

        // 11:遊戲中-清除磚塊.
        } else if (gamePlayMode == 11) {
            // 消失磚塊透明度.
            brickAlpha -= 0.1;
            if (brickAlpha < 0) { brickAlpha = 0;}
            // 更新容器.
            for (ix = 0; ix < 10; ix++) {
                for (iy = 0; iy < 20; iy++) {
                    if (bricksArray[ix][iy] == 255) {
                        bricksObject[ix][iy].alpha(brickAlpha);
                    }
                }
            }

            // 磚塊透明度為0處理.
            if (brickAlpha == 0) {
                // 清除的方塊.
                clearBrick();
                // 初始消失磚塊透明度.
                brickAlpha = 1.0;
                // 遊戲中.
                gamePlayMode = 10;
                // 轉換定義方塊到方塊陣列.
                transformToBricks(brickId, brickState);
                // 更新畫面磚塊.
                updateScreenBricks();
            }

        }
    }

    //----------------------------------------------------------------------------
    // Main.
    //----------------------------------------------------------------------------
    // 文字
    var loader = new THREE.FontLoader();
    loader.load('js/fonts/gentilis_regular.typeface.json', function (font) {        
        // Next 
        var fontNext = addLabel("Next", font, 32, 0xffffff);
        fontNext.position.set(220, -260, -1000);
        fontNext.rotation.x = Math.PI;

        // Lines
        var fontLines = addLabel("Lines", font, 32, 0xffffff);
        fontLines.position.set(220, -40, -1000);
        fontLines.rotation.x = Math.PI;
        // LinesNumber
        fontLinesNumber = addLabel("0", font, 28, 0xffffff);
        fontLinesNumber.position.set(220, -4, -1000);
        fontLinesNumber.rotation.x = Math.PI;
                
        // Highest Lines.
        var highestLines = addLabel("Highest Lines", font, 32, 0xffffff);
        highestLines.position.set(220, 80, -1000);
        highestLines.rotation.x = Math.PI;
        // HighestLinesNumber.
        fontHighestLinesNumber = addLabel("0", font, 28, 0xffffff);
        fontHighestLinesNumber.position.set(220, 116, -1000);
        fontHighestLinesNumber.rotation.x = Math.PI;


    });

    //------------------------------------------------------------------------
    // 背景.
    var wallGeometry = new THREE.BoxGeometry(1000, 2000, 0);
    var wallMaterial = new THREE.MeshLambertMaterial({ "color": "#009912" });
    this.wallBase = new THREE.Mesh(wallGeometry, wallMaterial);
    this.wallBase.name = "wallBase";
    this.wallBase.position.set(0, 50, 0);
    this.wallBaseMove = function (x, y, z) {
        this.wallBase.position.set(x, y, z);
    }
    this.wallBase.castShadow = true;
    this.wallBase.receiveShadow = true;
    scene.add(this.wallBase);

    //------------------------------------------------------------------------
    // 方塊陣列(4x4).
    var nx =  650;
    var ny = -830;
    var nz = -50;
    for (ix = 0; ix < 4; ix++) {
        bricks[ix] = [];
        bricksNext[ix] = [];
        bricksNextObject[ix] = [];
        for (iy = 0; iy < 4; iy++) {
            bricks[ix][iy] = 0;
            // 下個方塊
            bricksNext[ix][iy] = 0;
            bricksNextObject[ix][iy] = new Brick(scene, "brickNext_" + ix + "_" + iy, 1);
            bricksNextObject[ix][iy].move(nx + (ix * 100), ny + (iy * 100), nz);
            bricksNextObject[ix][iy].visible(true);
        }
    }

    //------------------------------------------------------------------------
    // 圖形磚塊陣列.
    //this.bricksObject = [];
    var bx = -450;
    var by = -900;
    var bz = -50;
    for (ix = 0; ix < 10; ix++) {
        bricksArray[ix] = [];
        bricksObject[ix] = [];
        for (iy = 0; iy < 20; iy++) {
            bricksArray[ix][iy] = 0;
            bricksObject[ix][iy] = new Brick(scene, "brick_" + ix + "_" + iy, 1);
            bricksObject[ix][iy].move(bx + (ix * 100), by + (iy * 100), bz);
            bricksObject[ix][iy].visible(false);
        }
    }

    // 產生新磚塊.
    var minNum = 1;
    var maxNum = 7;
    brickNextID = Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum;
    brickNew();
        

    /*
    // Next.
    var objectLoader = new THREE.ObjectLoader();
    objectLoader.load("js/json/TextNext.json", function (obj) {
        obj.scale.set(100,100,100);
        obj.position.set( 260, -310, -1000);
        obj.rotation.z = Math.PI;        
        scene.add(obj);

        //var brickBoxHelper = new THREE.BoxHelper(obj, 0xff000);
        //scene.add(brickBoxHelper);
    });
    */
}