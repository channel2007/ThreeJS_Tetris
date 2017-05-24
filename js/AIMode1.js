/*****************************************************************************
 * AI.
 * 
 * created by channel
 * 
 * todo list:
 *
 * 參考資料:
 * http://imake.ninja/el-tetris-an-improvement-on-pierre-dellacheries-algorithm/
 *
 * note:
 *
****************************************************************************/
// bricksArray : 磚塊陣列.
//      brickId: 磚塊編號.
function AIMode1() {

    // 定義磚塊.
    // 1.
    var N1_1 = [4, 8, 9, 13];
    var N1_2 = [9, 10, 12, 13];
    // 2.
    var N2_1 = [5, 8, 9, 12];
    var N2_2 = [8, 9, 13, 14];
    // 3.
    var L1_1 = [8, 12, 13, 14];
    var L1_2 = [4, 5, 8, 12];
    var L1_3 = [8, 9, 10, 14];
    var L1_4 = [5, 9, 12, 13];
    // 4.
    var L2_1 = [10, 12, 13, 14];
    var L2_2 = [4, 8, 12, 13];
    var L2_3 = [8, 9, 10, 12];
    var L2_4 = [4, 5, 9, 13];
    // 5.
    var T_1 = [9, 12, 13, 14];
    var T_2 = [4, 8, 9, 12];
    var T_3 = [8, 9, 10, 13];
    var T_4 = [5, 8, 9, 13];
    // 6.
    var O_1 = [8, 9, 12, 13];
    // 7.
    var I_1 = [12, 13, 14, 15];
    var I_2 = [1, 5, 9, 13];

    // 陣列容器.
    var pAiBricksArray = [];

    // 方塊陣列(4x4).
    var bricks = [];

    // 0:磚塊狀態(0~3).
    // 1:X軸位置.
    // 2:總分.
    var champion = [0, 0, -999];

    //---------------------------------------------------------------------------
    // 取得磚塊索引陣列.
    //---------------------------------------------------------------------------
    aiMode1GetBrickIndex = function (brickId, state) {
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
    aiMode1TransformToBricks = function (brickId, state) {
        var bx, by;

        // 清除方塊陣列.
        for (iy = 0; iy < 4; iy++) {
            for (ix = 0; ix < 4; ix++) {
                bricks[ix][iy] = 0;
            }
        }

        // 取得磚塊索引陣列.
        var pAiBrick = aiMode1GetBrickIndex(brickId, state);

        // 轉換方塊到方塊陣列.
        for (i = 0; i < 4; i++) {
            bx = Math.floor(pAiBrick[i] % 4);
            by = Math.floor(pAiBrick[i] / 4);
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
    // 回傳:最高點.
    //---------------------------------------------------------------------------
    aiMode1CopyToBricksArray = function (bricksArray, containerX, containerY) {
        var posX = 0;
        var posY = 0;
        var posYHeight = 0;
        for (ix = 0; ix < 4; ix++) {
            for (iy = 0; iy < 4; iy++) {
                if (bricks[ix][iy] != 0) {
                    posX = containerX + ix;
                    posY = containerY + iy;
                    if (posX >= 0 && posY >= 0) {
                        bricksArray[posX][posY] = bricks[ix][iy];
                        if(posY>posYHeight){
                            posYHeight = posY;
                        }                        
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
    aiMode1IfCopyToBricksArray = function (bricksArray, containerX, containerY) {
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
    // 複製容器陣列.
    //---------------------------------------------------------------------------
    aiMode1CopyArray = function (bricksArray) {
        for (ix = 0; ix < 10; ix++) {
            pAiBricksArray[ix] = [];
            for (iy = 0; iy < 20; iy++) {
                pAiBricksArray[ix][iy] = bricksArray[ix][iy];
            }
        }
    }

    //---------------------------------------------------------------------------
    // 1-1.Landing Height.
    //   tx: 磚塊x陣列.
    //---------------------------------------------------------------------------
    aiMode1LandingHeight = function (tx) {
        var height = 20;
        var dx = tx + 4;
        if (dx > 10) { dx = 10;}
        for (var ax = tx; ax < dx; ax++) {
            for (var ay = 0; ay < 20; ay++) {
                if (pAiBricksArray[ax][ay] != 0) {
                    if (ay < height) {
                        height = ay;
                    }
                }
            }
        }
        return 20 - height;
    }

    //---------------------------------------------------------------------------
    // 1-2.RowsEliminated.
    //---------------------------------------------------------------------------
    aiMode1RowsEliminated = function (bricksArray, tx, ty) {
        var pointNum = 0;
        var lineNum = 0;
        var gridNum = 0;

        // 1.eliminatedNum.
        for (iy = 0; iy < 20; iy++) {
            for (ix = 0; ix < 10; ix++) {                
                if (pAiBricksArray[ix][iy] > 0) {
                    pointNum++;
                }
                if (pointNum == 10) {
                    for (i = 0; i < 10; i++) {
                        lineNum++;
                        pAiBricksArray[i][iy] = 255;
                    }
                }
            }
            pointNum = 0;
        }

        // 2.eliminatedGridNum.
        if (lineNum >= 10) {
            /*
            console.log("Begin =====================================================");
            // 印出訊息.
            for (iy = 0; iy < 4; iy++) {
                str = "";
                for (ix = 0; ix < 4; ix++) {
                    str += bricks[ix][iy] + ",";
                }
                console.log(str);
            }
            */
            //console.log("=====================================================");
            // 印出訊息.
            x = 0; y = 0;
            for (iy = (ty-1); iy < (ty-1) + 4; iy++) {
                //str = "";
                for (ix = tx; ix < tx + 4; ix++) {
                    if (iy < 20 && ix < 10) {
                        if (bricks[x][y] > 0 && pAiBricksArray[ix][iy] == 255) {
                            gridNum++;
                        }
                        //str += pAiBricksArray[ix][iy] + ",";
                    }
                    x++;
                }
                x = 0;
                y++;
                //console.log(str);
            }
            //console.log("End gridNum:" + gridNum + "=====================================================");
        }
        return (lineNum / 10) * gridNum;
    }

    //---------------------------------------------------------------------------
    // 1-3.RowTransitions.
    //---------------------------------------------------------------------------
    aiMode1RowTransitions = function () {
        var totalTransNum = 0;
        var bricksColor = 1;
        for (var iy = 0; iy < 20; iy++) {
            var nowTransNum = 0;
            var prevColor = 1;
            for (var ix = 0; ix < 10; ix++) {
                if (pAiBricksArray[ix][iy] > 0) {
                    bricksColor = 1;
                } else {
                    bricksColor = 0;
                }
                if (bricksColor != prevColor) {
                    nowTransNum++;
                    prevColor = bricksColor;
                }
            }
            if (prevColor === 0) {
                nowTransNum++;
            }
            totalTransNum += nowTransNum;
        }
        return totalTransNum;
    }

    //---------------------------------------------------------------------------
    // 1-4.ColumnTransitions.
    //---------------------------------------------------------------------------
    aiMode1ColumnTransitions = function () {
        var totalTransNum = 0;
        for (var ix = 0; ix < 10; ix++) {
            var nowTransNum = 0;
            var prevColor = 1;
            for (var iy = 0; iy < 20; iy++) {
                if (pAiBricksArray[ix][iy] > 0) {
                    bricksColor = 1;
                } else {
                    bricksColor = 0;
                }
                if (bricksColor != prevColor) {
                    nowTransNum++;
                    prevColor = bricksColor;
                }
            }
            if (prevColor === 0) {
                nowTransNum++;
            }
            totalTransNum += nowTransNum;
        }
        return totalTransNum;
    }

    //---------------------------------------------------------------------------
    // 1-5.NumberHoles.
    //---------------------------------------------------------------------------
    aiMode1NumberHoles = function () {
        var totalEmptyHoles = 0;
        for (var i = 0; i < 10; i++) {
            var j = 0;
            var emptyHoles = 0;
            for (; j < 20; j++) {
                if (pAiBricksArray[i][j] > 0) {
                    bricksColor = 1;
                } else {
                    bricksColor = 0;
                }
                if (bricksColor === 1) {
                    j++;
                    break;
                }
            }
            for (; j < 20; j++) {
                if (pAiBricksArray[i][j] > 0) {
                    bricksColor = 1;
                } else {
                    bricksColor = 0;
                }
                if (bricksColor === 0) {
                    emptyHoles++;
                }
            }
            totalEmptyHoles += emptyHoles;
        }
        return totalEmptyHoles;
    }

    //---------------------------------------------------------------------------
    // 1-6.aiWellSums.
    //---------------------------------------------------------------------------
    aiMode1WellSums = function () {
        var i = 0, j = 0, wellDepth = 0, tDepth = 0;

        var totalWellDepth = 0;
        // 取得最左邊的井數.
        wellDepth = 0;
        tDepth = 0;
        for (j = 0; j < 20; j++) {
            if (pAiBricksArray[0][j] === 0 && pAiBricksArray[1][j] > 0) {
                tDepth++;
            } else {
                wellDepth += tDepth * (tDepth + 1) / 2;
                tDepth = 0;
            }
        }
        wellDepth += tDepth * (tDepth + 1) / 2;
        totalWellDepth += wellDepth;

        // 取得最中間的井數.
        wellDepth = 0;
        for (i = 1; i < 10 - 1; i++) {
            tDepth = 0;
            for (j = 0; j < 20; j++) {
                if (pAiBricksArray[i][j] === 0 && pAiBricksArray[i - 1][j] > 0 && pAiBricksArray[i + 1][j] > 0) {
                    tDepth++;
                } else {
                    wellDepth += tDepth * (tDepth + 1) / 2;
                    tDepth = 0;
                }
            }
            wellDepth += tDepth * (tDepth + 1) / 2;
        }
        totalWellDepth += wellDepth;

        // 取得最右邊的井數.
        wellDepth = 0;
        tDepth = 0;
        for (j = 0; j < 20; j++) {
            if (pAiBricksArray[10 - 1][j] === 0 && pAiBricksArray[10 - 2][j] > 0) {
                tDepth++;
            } else {
                wellDepth += tDepth * (tDepth + 1) / 2;
                tDepth = 0;
            }
        }
        wellDepth += tDepth * (tDepth + 1) / 2;
        totalWellDepth += wellDepth;

        return totalWellDepth;
    }

    //---------------------------------------------------------------------------
    // 運算.
    // bricksArray: 磚塊陣列.
    //     brickId: 方塊編號(1~7).
    //       state: 磚塊狀態.
    //---------------------------------------------------------------------------
    aiMode1Mathematical = function (bricksArray, brickId, state, x1, x2, y1, y2) {
        // 由左至右下降方塊.
        for (var x = x1; x < (x2 + 1) ; x++) {
//            console.log("Begin " + (x + 1) + "=====================================================");
            //------------------------------------------------------------
            // 1.處理方塊下降到底.
            for (var y = y1; y < (y2 + 1) ; y++) {
                // 方塊下降判斷碰撞.
                if (!aiMode1IfCopyToBricksArray(pAiBricksArray, x, y)) {
                    // 複製方塊到容器內.
                    aiMode1CopyToBricksArray(pAiBricksArray, x, y - 1);
                    break;
                }
                // 方塊下降到底.
                if (y == 16) {
                    // 複製方塊到容器內.
                    aiMode1CopyToBricksArray(pAiBricksArray, x, y);
                }
            }

            //------------------------------------------------------------
            // 1-1:Landing Height(下落高度).
            var landingHeight = aiMode1LandingHeight(x);
            //console.log("1-1:LandingHeight:" + landingHeight + " =====================================================");

            //------------------------------------------------------------
            // 1-2:Rows eliminated(消行數).
            var rowsEliminated = aiMode1RowsEliminated(bricksArray, x, y);
            //if (rowsEliminated > 0) {
            //console.log("1-2:rowsEliminated:" + rowsEliminated + " x:" + x + " y:" + y + "=====================================================");
            //}
            
            //------------------------------------------------------------
            // 1-3:Row Transitions(行變換).
            var rowTransitions = aiMode1RowTransitions();
            //console.log("1-3:rowTransitions:" + rowTransitions + "=====================================================");

            //------------------------------------------------------------
            // 1-4:Column Transitions(列變換).
            var columnTransitions = aiMode1ColumnTransitions();
            //console.log("1-4:columnTransitions:" + columnTransitions + "=====================================================");

            //------------------------------------------------------------
            // 1-5:Number of Holes(空洞數).
            var numberHoles = aiMode1NumberHoles();
            //console.log("1-5:NumberHoles:" + numberHoles + "=====================================================");

            //------------------------------------------------------------
            // 1-6:Well Sums(井數).
            var wellSums = aiMode1WellSums();

            // 計算權重.
            var totalScore = (-4.500158825082766) * landingHeight
                            + (3.4181268101392694) * rowsEliminated
                            + (-3.2178882868487753) * rowTransitions
                            + (-9.348695305445199) * columnTransitions
                            + (-7.899265427351652) * numberHoles
                            + (-3.3855972247263626) * wellSums; 

            // 0:磚塊狀態(0~3).
            // 1:X軸位置.
            // 2:總分.
            if (totalScore > champion[2]) {
                champion[0] = state;
                champion[1] = x;
                champion[2] = totalScore;
            }

            //------------------------------------------------------------
            // 複製容器陣列.
            aiMode1CopyArray(bricksArray);
        }
//        console.log("Champion =====================================================");
//        console.log("Champion:" + champion);
    }

    //---------------------------------------------------------------------------
    // 轉換定義方塊到方塊陣列.
    // bricksArray: 磚塊陣列.
    //     brickId: 方塊編號(1~7).
    //---------------------------------------------------------------------------
    this.go = function (bricksArray, brickId) {
        // 方塊在容器的位置.
        //var containerX =  0;  // (-2~6)(  為6的時候不能旋轉方塊).
        //var containerY = -3;  // (-3~16)(-3表示在上邊界外慢慢往下掉).

        // 初始變數.
        champion[0] = 0;
        champion[1] = 0;
        champion[2] = -999;

        // 複製容器陣列.
        aiMode1CopyArray(bricksArray);

        //------------------------------------------------------------
        // 1.處理磚塊掉落後容器陣列.
        // 轉換定義方塊到方塊陣列.
        if (brickId == 1 || brickId == 2) {
            // [1-0]        [1-1]
            //  X: 0~8      X: 0~7
            //  Y:-3~16     Y:-3~16
            //
            // [2-0]        [2-1]
            //  X: 0~8      X: 0~7
            //  Y:-3~16     Y:-3~16
            //
            var brickStateN = [];
            // 0.
            brickStateN[0] = [];
            brickStateN[0][0] = 0;
            brickStateN[0][1] = 8;
            brickStateN[0][2] = -3;
            brickStateN[0][3] = 16;
            // 1.
            brickStateN[1] = [];
            brickStateN[1][0] = 0;
            brickStateN[1][1] = 7;
            brickStateN[1][2] = -3;
            brickStateN[1][3] = 16;

            // 運算.
            for (var s = 0; s < 2; s++){
                aiMode1TransformToBricks(brickId, s);
                aiMode1Mathematical(bricksArray, brickId, s, brickStateN[s][0], brickStateN[s][1], brickStateN[s][2], brickStateN[s][3]);
            }

        } else if (brickId == 3 || brickId == 4 || brickId == 5) {
            // [3-0]        [3-1]       [3-2]       [3-3]
            //  X: 0~7      X: 0~8      X: 0~7      X: 0~8
            //  Y:-3~16     Y:-3~16     Y:-3~16     Y:-3~16
            //
            // [4-0]        [4-1]       [4-2]       [4-3]
            //  X: 0~7      X: 0~8      X: 0~7      X: 0~8
            //  Y:-3~16     Y:-3~16     Y:-3~16     Y:-3~16
            //
            // [5-0]        [5-1]       [5-2]       [5-3]
            //  X: 0~7      X: 0~8      X: 0~7      X: 0~8
            //  Y:-3~16     Y:-3~16     Y:-3~16     Y:-3~16
            //
            var brickStateLT = [];
            // 0.
            brickStateLT[0] = [];
            brickStateLT[0][0] = 0;
            brickStateLT[0][1] = 7;
            brickStateLT[0][2] = -3;
            brickStateLT[0][3] = 16;
            // 1.
            brickStateLT[1] = [];
            brickStateLT[1][0] = 0;
            brickStateLT[1][1] = 8;
            brickStateLT[1][2] = -3;
            brickStateLT[1][3] = 16;
            // 2.
            brickStateLT[2] = [];
            brickStateLT[2][0] = 0;
            brickStateLT[2][1] = 7;
            brickStateLT[2][2] = -3;
            brickStateLT[2][3] = 16;
            // 3.
            brickStateLT[3] = [];
            brickStateLT[3][0] = 0;
            brickStateLT[3][1] = 8;
            brickStateLT[3][2] = -3;
            brickStateLT[3][3] = 16;

            // 運算.
            for (var s = 0; s < 4; s++) {
                aiMode1TransformToBricks(brickId, s);
                aiMode1Mathematical(bricksArray, brickId, s, brickStateLT[s][0], brickStateLT[s][1], brickStateLT[s][2], brickStateLT[s][3]);
            }

        } else if (brickId == 6) {
            // [6-0] 
            //  X: 0~8
            //  Y:-3~16
            //
            var brickStateO = [];
            // 0.
            brickStateO[0] = [];
            brickStateO[0][0] = 0;
            brickStateO[0][1] = 8;
            brickStateO[0][2] = -3;
            brickStateO[0][3] = 16;

            // 運算.
            for (var s = 0; s < 1; s++) {
                aiMode1TransformToBricks(brickId, s);
                aiMode1Mathematical(bricksArray, brickId, s, brickStateO[s][0], brickStateO[s][1], brickStateO[s][2], brickStateO[s][3]);
            }

        } else if (brickId == 7) {
            // [7-0]        [7-0] 
            //  X: 0~6      X:-1~8
            //  Y:-3~16     Y:-3~16
            var brickStateI = [];
            // 0.
            brickStateI[0] = [];
            brickStateI[0][0] = 0;
            brickStateI[0][1] = 6;
            brickStateI[0][2] = -3;
            brickStateI[0][3] = 16;
            // 1.
            brickStateI[1] = [];
            brickStateI[1][0] = 0;
            brickStateI[1][1] = 8;
            brickStateI[1][2] = -3;
            brickStateI[1][3] = 16;

            // 運算.
            for (var s = 0; s < 2; s++) {
                aiMode1TransformToBricks(brickId, s);
                aiMode1Mathematical(bricksArray, brickId, s, brickStateI[s][0], brickStateI[s][1], brickStateI[s][2], brickStateI[s][3]);
            }
        }

        return champion;
    }

    //----------------------------------------------------------------------------
    // Main.
    //----------------------------------------------------------------------------
    for (ix = 0; ix < 4; ix++) {
        bricks[ix] = [];
        for (iy = 0; iy < 4; iy++) {
            bricks[ix][iy] = 0;
        }
    }

}