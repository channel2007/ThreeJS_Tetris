/*****************************************************************************
 * AI.
 * 
 * created by channel
 * 
 * todo list:
 *
 * 參考資料:
 * https://codemyroad.wordpress.com/2013/04/14/tetris-ai-the-near-perfect-player/
 *
 * note:
 *
****************************************************************************/
// bricksArray : 磚塊陣列.
//      brickId: 磚塊編號.
function AIMode2() {

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
    aiMode2GetBrickIndex = function (brickId, state) {
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
    aiMode2TransformToBricks = function (brickId, state) {
        var bx, by;

        // 清除方塊陣列.
        for (iy = 0; iy < 4; iy++) {
            for (ix = 0; ix < 4; ix++) {
                bricks[ix][iy] = 0;
            }
        }

        // 取得磚塊索引陣列.
        var pAiBrick = aiMode2GetBrickIndex(brickId, state);

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
    //---------------------------------------------------------------------------
    aiMode2CopyToBricksArray = function (bricksArray, containerX, containerY) {
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
    aiMode2IfCopyToBricksArray = function (bricksArray, containerX, containerY) {
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
    aiMode2CopyArray = function (bricksArray) {
        for (ix = 0; ix < 10; ix++) {
            pAiBricksArray[ix] = [];
            for (iy = 0; iy < 20; iy++) {
                pAiBricksArray[ix][iy] = bricksArray[ix][iy];
            }
        }
    }

    //---------------------------------------------------------------------------
    // 判斷與設定要清除的方塊.
    //---------------------------------------------------------------------------
    aiMode2IfClearBrick = function (bricksArray) {
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
    // 運算.
    // bricksArray: 磚塊陣列.
    //     brickId: 方塊編號(1~7).
    //       state: 磚塊狀態.
    //---------------------------------------------------------------------------
    aiMode2Mathematical = function (bricksArray, brickId, state, x1, x2, y1, y2) {
        // 由左至右下降方塊.
        for (var x = x1; x < (x2 + 1) ; x++) {
//            console.log("Begin " + (x + 1) + "=====================================================");
            //------------------------------------------------------------
            // 1.處理方塊下降到底.
            for (var y = y1; y < (y2 + 1) ; y++) {                
                
                // 方塊下降判斷碰撞.
                if (!aiMode2IfCopyToBricksArray(pAiBricksArray, x, y)) {
                    // 複製方塊到容器內.
                    aiMode2CopyToBricksArray(pAiBricksArray, x, y - 1);
                    break;
                }
                // 方塊下降到底.
                if (y == 16) {
                    // 複製方塊到容器內.
                    aiMode2CopyToBricksArray(pAiBricksArray, x, y);
                }
            }

            //------------------------------------------------------------
            // 2.Aggregate Height.
            var aggregateHeight = 0;
            for (var ax = 0; ax < pAiBricksArray.length ; ax++) {
                for (var ay = 0; ay < pAiBricksArray[0].length; ay++) {
                    if (pAiBricksArray[ax][ay] != 0) {
                        aggregateHeight += (pAiBricksArray[0].length - ay);
                        break;
                    }
                }
            }
            // 印出訊息.
//            if (aggregateHeight != 0) {
//                console.log("Aggregate Height:" + aggregateHeight);
//            }

            //------------------------------------------------------------
            // 3.Complete Lines.
            var completeLines = 0;
            completeLines = aiMode2IfClearBrick(pAiBricksArray) / 10;
//            console.log("Complete Lines:" + completeLines);

            //------------------------------------------------------------
            // 4.Holes.
            var holes = 0;
            var statrUp = false;
            for (var ax = 0; ax < pAiBricksArray.length ; ax++) {
                for (var ay = 0; ay < pAiBricksArray[0].length; ay++) {
                    if (pAiBricksArray[ax][ay] != 0) {
                        statrUp = true;
                    }
                    if (statrUp) {
                        if (pAiBricksArray[ax][ay] == 0) {
                            holes += 1;
                        }                        
                    }
                }
                statrUp = false;
            }
//            console.log("Holes:" + holes);

            //------------------------------------------------------------
            // 5.Bumpiness.
            var Bumpiness = 0;
            var BumpinessArr = [];
            for (var ax = 0; ax < pAiBricksArray.length ; ax++) {
                for (var ay = 0; ay < pAiBricksArray[0].length; ay++) {
                    if (pAiBricksArray[ax][ay] != 0) {
                        BumpinessArr.push((pAiBricksArray[0].length - ay));
                        break;
                    }
                }
                if (ay == pAiBricksArray[0].length) {
                    BumpinessArr.push(0);
                }
            }
            for (var i = 0; i < 9 ; i++) {
                Bumpiness += Math.abs(BumpinessArr[i] - BumpinessArr[i+1]);
            }
 //           console.log("BumpinessArr:" + BumpinessArr);
 //           console.log("Bumpiness:" + Bumpiness);

            //------------------------------------------------------------
            // 6.Putting the heuristic together.
            var totalScore = (-0.510066 * aggregateHeight) + (0.760666 * completeLines) + (-0.35663 * holes) + (-0.184483 * Bumpiness);
//            console.log("TotalScore:" + totalScore);

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
            aiMode2CopyArray(bricksArray);
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
        aiMode2CopyArray(bricksArray);

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
                aiMode2TransformToBricks(brickId, s);
                aiMode2Mathematical(bricksArray, brickId, s, brickStateN[s][0], brickStateN[s][1], brickStateN[s][2], brickStateN[s][3]);
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
                aiMode2TransformToBricks(brickId, s);
                aiMode2Mathematical(bricksArray, brickId, s, brickStateLT[s][0], brickStateLT[s][1], brickStateLT[s][2], brickStateLT[s][3]);
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
                aiMode2TransformToBricks(brickId, s);
                aiMode2Mathematical(bricksArray, brickId, s, brickStateO[s][0], brickStateO[s][1], brickStateO[s][2], brickStateO[s][3]);
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
            brickStateI[1][0] = -1;
            brickStateI[1][1] = 8;
            brickStateI[1][2] = -3;
            brickStateI[1][3] = 16;

            // 運算.
            for (var s = 0; s < 2; s++) {
                aiMode2TransformToBricks(brickId, s);
                aiMode2Mathematical(bricksArray, brickId, s, brickStateI[s][0], brickStateI[s][1], brickStateI[s][2], brickStateI[s][3]);
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