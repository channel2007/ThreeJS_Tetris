/*****************************************************************************
 * 磚塊.
 * 
 * created  by channel
 * 
 * todo list:
 *  
 * note:
 *
****************************************************************************/
function Brick(scene, name, colorId) {
    // 磚塊.
    this.brick = null;
    //this.brickBoxHelper = null;

    //--------------------------------------------------------------------
    // 取得磚塊顏色. 
    //--------------------------------------------------------------------
    getColor = function (colorId) {
        var color = "";
        if (colorId == 1) {
            color = "#00F0F0";      // 1.
        } else if (colorId == 2) {
            color = "#0000F0";      // 2.
        } else if (colorId == 3) {
            color = "#F0A000";      // 3.
        } else if (colorId == 4) {
            color = "#F0F000";      // 4.
        } else if (colorId == 5) {
            color = "#00F000";      // 5.
        } else if (colorId == 6) {
            color = "#A000F0";      // 6.
        } else if (colorId == 7) {
            color = "#F00000";      // 7.
        } else if (colorId == 255) {
            color = "#FFFFFF";      // 255.
        }
        return color;
    }

    //----------------------------------------------------------------------------
    // 設定物件座標.
    //----------------------------------------------------------------------------
    this.move = function (x, y, z) {
        //this.brick.position.x = this.brickBoxHelper.position.x = x;
        //this.brick.position.y = this.brickBoxHelper.position.y = y;
        //this.brick.position.z = this.brickBoxHelper.position.z = z;
        //this.brickBoxHelper.update();

        this.brick.position.x = x;
        this.brick.position.y = y;
        this.brick.position.z = z;
    }

    //----------------------------------------------------------------------------
    // 開關物件.
    // status  
    //  true   = 開
    //  false  = 關
    //----------------------------------------------------------------------------
    this.visible = function (v) {
        this.brick.visible = v;
        this.alpha(1.0);
        //this.brickBoxHelper.visible = v;
    }

    //----------------------------------------------------------------------------
    // 設定物件透明度.
    // a = 0.0~1.0.
    //----------------------------------------------------------------------------
    this.alpha = function (a) {
        this.brick.material.opacity = a;
    }

    //----------------------------------------------------------------------------
    // 設定物件顏色.
    //----------------------------------------------------------------------------
    this.color = function (colorId) {
        var color = "";
        color = getColor(colorId);
        if (color == "") {
            this.visible(false);
        }

        this.brick.material.color = new THREE.Color(color);
        if (colorId != 0) {this.visible(true);}
    }

    // 建立Box物件.
    var geometry = new THREE.BoxGeometry(100, 100, 100);

    // 設定Normal貼圖.
    color = getColor(colorId);
    if (color == "") {
        this.visible(false);
    }
 
    var bricksMaterial = new THREE.MeshLambertMaterial({ "color": color });
    bricksMaterial.transparent = true;      // 開啟使用透明度.

    this.brick = new THREE.Mesh(geometry, bricksMaterial);
    //this.brickBoxHelper = new THREE.BoxHelper(this.brick, 0x00000);

    //this.brick.castShadow = true;
    //this.brick.material.color = new THREE.Color("#0070EC");  // 設定顏色.
    //this.brick.material.opacity = 0.5;   // 設定透明度.

    scene.add(this.brick);
    //scene.add(this.brickBoxHelper);

    // 變數.
    this.name = name;           // 物件名稱.

}