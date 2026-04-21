let inputField;
let sizeSlider;
let jumpButton;
let isJumping = false; // 用來記錄是否開啟跳動效果
let tkuDiv; // 宣告 div 容器變數
let tkuIframe; // 宣告 iframe 變數
let siteSelect; // 宣告下拉式選單變數
let seaweeds = []; // 新增水草陣列變數
let bubbles = []; // 新增水泡陣列變數
let popSound; // 新增破掉音效變數

function preload() {
  // 預先載入水泡破掉的音效 (請確保專案目錄中有 pop.mp3)
  popSound = loadSound('pop.mp3');
}

function setup() {
  // 建立全螢幕畫布
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.style('pointer-events', 'none'); // 允許滑鼠事件穿透畫布，讓後方網頁可被正常點擊與操作
  
  // 建立文字輸入框 (DOM) 並預設一些文字
  inputField = createInput('創意程式設計 ');
  inputField.position(20, 20);
  // 將輸入框的字體大小調整為 25px
  inputField.style('font-size', '25px');
  
  // 建立文字大小滑桿，範圍 15 到 80，預設值設定為原來的 48
  sizeSlider = createSlider(15, 80, 48);
  // 將滑桿定位在輸入框右邊，距離為 50px
  sizeSlider.position(inputField.x + inputField.width + 50, 20);
  
  // 建立按鈕
  jumpButton = createButton('跳動開關');
  // 將按鈕定位在滑桿右邊，距離為 50px
  jumpButton.position(sizeSlider.x + sizeSlider.width + 50, 20);
  // 設定按鈕寬高為 150x50
  jumpButton.size(150, 50);
  // 設定按鈕文字大小為 20px
  jumpButton.style('font-size', '20px');
  jumpButton.mousePressed(toggleJump); // 綁定點擊事件
  
  // 建立下拉式選單
  siteSelect = createSelect();
  // 將選單定位在按鈕右邊，距離為 50px
  siteSelect.position(jumpButton.x + jumpButton.width + 50, 20);
  siteSelect.option('淡江大學');
  
  // 設定下拉選單寬度約等於預設滑桿大小 (130px)，高度設定為 40px
  siteSelect.size(130, 40);
  // 設定選單內的文字大小為 20px，與按鈕文字大小一致
  siteSelect.style('font-size', '20px');
  
  siteSelect.option('教科系'); // 加入教科系選項
  siteSelect.selected('教科系'); // 預設顯示切換為教科系
  siteSelect.changed(changeSite); // 綁定選項改變事件
  
  // 建立一個 div 容器，調整為全螢幕，並使用 z-index 放置在最底層 (水草後方)
  tkuDiv = createDiv();
  tkuDiv.position(0, 0);
  tkuDiv.size(windowWidth, windowHeight);
  tkuDiv.style('z-index', '-1');
  
  // 在 div 內建立 iframe 來嵌入淡江大學官網
  tkuIframe = createElement('iframe');
  tkuIframe.attribute('src', 'https://www.et.tku.edu.tw/'); // 改為連線至教科系官網
  tkuIframe.style('width', '100%');
  tkuIframe.style('height', '100%');
  tkuIframe.style('border', 'none'); // 隱藏 iframe 的預設邊框
  tkuIframe.parent(tkuDiv); // 將 iframe 放入 div 容器中
  
  // 設定字型對齊方式 (設定為垂直置中)
  textAlign(LEFT, CENTER);
  
  // 初始化 80 條水草的參數
  let colors = ['red', 'green', 'yellow', 'blue', 'orange', 'purple', 'cyan', 'magenta', 'pink', 'lime'];
  for (let i = 0; i < 80; i++) {
    seaweeds.push({
      position: random(1), // 位置：X 座標比例 (0~1)，讓水草隨機散佈於整個寬度
      color: random(colors), // 顏色：從 10 種顏色中亂數抽取
      thickness: random(40, 50), // 粗細：40-50 之間亂數產生
      heightRatio: random(0.2, 0.45), // 高度：佔視窗高度 20%-45% 亂數產生
      frequency: random(0.005, 0.035), // 搖晃頻率：每條水草搖晃頻率與速度不一
      noiseOffset: random(10000) // 給予不同的 noise 偏移量，讓擺動的時間點錯開
    });
  }
}

function draw() {
  // 先清除前一個影格，再鋪上透明度 0.3 的淺藍色背景，避免水草與水泡產生殘影
  clear();
  background('rgba(173, 216, 230, 0.3)');
  
  // --- 新增：利用 vertex、map 與 noise 繪製水草 ---
  push(); // 儲存當前繪圖設定，避免影響後方的文字繪製
  noFill();
  strokeJoin(ROUND); // 讓線條轉折處更圓滑
  
  // 繪製 80 條水草
  for (let i = 0; i < seaweeds.length; i++) {
    let sw = seaweeds[i];
    stroke(sw.color); // 讀取屬性：套用顏色
    strokeWeight(sw.thickness); // 讀取屬性：套用粗細
    
    beginShape();
    let rootX = sw.position * width; // 讀取屬性：計算實體 X 座標位置
    let topY = height * (1 - sw.heightRatio); // 讀取屬性：計算實體水草高度
    for (let y = height; y > topY; y -= 10) {
      // 加入 sw.noiseOffset 讓形狀錯開，並使用 sw.frequency 改變各別搖晃頻率
      let n = noise(y * 0.01 + sw.noiseOffset, frameCount * sw.frequency);
      let sway = map(n, 0, 1, -200, 200);
      let factor = map(y, height, topY, 0, 1);
      curveVertex(rootX + sway * factor, y);
    }
    endShape();
  }
  pop(); // 恢復之前的繪圖設定
  
  // 隨機產生水泡 (每幀大約 5% 的機率產生)
  if (random() < 0.05) {
    bubbles.push(new Bubble());
  }
  
  // 更新與繪製水泡 (由後往前走訪迴圈，以安全移除元素)
  for (let i = bubbles.length - 1; i >= 0; i--) {
    bubbles[i].update();
    bubbles[i].display();
    if (bubbles[i].dead) {
      bubbles.splice(i, 1); // 移除已經破掉並消失的水泡
    }
  }
  
  // 根據滑桿目前的數值即時更新文字大小
  textSize(sizeSlider.value());
  
  let txt = inputField.value();
  let tw = textWidth(txt);
  
  // 設定文字顏色為紫色
  fill('purple');
  
  // 檢查字體寬度是否大於 0，避免輸入框空白時造成無窮迴圈
  if (tw > 0) {
    // 利用雙層迴圈將文字重複繪製，填滿整個畫面的X軸與Y軸
    // 行距設定為當前文字大小加上 20px 緩衝空間
    for (let y = 0; y < height; y += sizeSlider.value() + 20) {
      for (let x = 0; x < width; x += tw + 30) {
        let offsetX = 0;
        let offsetY = 0;
        
        // 如果跳動狀態為 true，利用 sin 與 cos 搭配 frameCount 產生平滑的波浪移動效果
        if (isJumping) {
          // frameCount 控制時間與速度，x 與 y 的偏移產生波浪的相位差
          // 最後乘上 8 放大移動幅度 (可自由調整數值改變波浪大小)
          offsetX = sin(frameCount * 0.05 + y * 0.01) * 8;
          offsetY = cos(frameCount * 0.05 + x * 0.01) * 8;
        }
        text(txt, x + offsetX, y + offsetY);
      }
    }
  }
}

// 切換跳動狀態的函式
function toggleJump() {
  isJumping = !isJumping;
}

// 處理選單改變的函式
function changeSite() {
  let item = siteSelect.value(); // 取得當前選取的選項
  if (item === '淡江大學') {
    tkuIframe.attribute('src', 'https://www.tku.edu.tw/');
    inputField.value('淡江大學'); // 改變文字輸入框的內容
  } else if (item === '教科系' || item === ' 教科系') {
    tkuIframe.attribute('src', 'https://www.et.tku.edu.tw/'); // 連結至教科系官網
    inputField.value('教科系'); // 改變文字輸入框的內容
  }
}

// 當瀏覽器視窗大小改變時，自動調整畫布以維持全螢幕
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  // 同步調整 div 的大小，以確保視窗改變時仍維持全螢幕
  tkuDiv.size(windowWidth, windowHeight);
}

// --- 新增：定義水泡的 Class ---
class Bubble {
  constructor() {
    this.x = random(width);
    this.y = height + random(20, 50); // 從視窗底部稍微下方開始
    this.size = random(15, 35); // 隨機水泡大小 (直徑)
    this.speedY = random(1.5, 3.5); // 隨機上升速度
    this.noiseOffsetX = random(1000); // 用於左右飄動的雜訊偏移
    this.popY = random(height * 0.1, height * 0.8); // 隨機決定破掉的高度
    this.isPopping = false; // 是否正在破掉
    this.popRadius = this.size; // 破掉效果的圓圈半徑
    this.popAlpha = 127; // 破掉效果的初始透明度 (0.5 * 255)
    this.dead = false; // 是否完全消失可被移除
  }

  update() {
    if (!this.isPopping) {
      // 往上升
      this.y -= this.speedY;
      // 利用 noise 產生自然的左右飄動
      this.x += map(noise(this.noiseOffsetX, frameCount * 0.02), 0, 1, -1.5, 1.5);
      
      // 當到達設定的高度時，觸發破掉狀態
      if (this.y < this.popY) {
        this.isPopping = true;
        // 播放破掉的音效
        if (popSound) {
          popSound.play();
        }
      }
    } else {
      // 破掉效果動畫更新
      this.popRadius += 3; // 圓圈擴大
      this.popAlpha -= 8; // 透明度降低
      if (this.popAlpha <= 0) {
        this.dead = true; // 完全透明後標記為可移除
      }
    }
  }

  display() {
    push();
    if (!this.isPopping) {
      // 畫主體水泡：白色，透明度 0.5 (255 * 0.5 = 127)
      noStroke();
      fill(255, 127);
      circle(this.x, this.y, this.size);
      
      // 畫左上角反光：白色，透明度 0.8 (255 * 0.8 = 204)
      fill(255, 204);
      let offset = this.size * 0.2; // 偏移量
      let highlightSize = this.size * 0.3; // 反光圈的大小
      circle(this.x - offset, this.y - offset, highlightSize);
    } else {
      // 破掉的效果
      // 1. 擴散的空心外圈
      noFill();
      stroke(255, this.popAlpha);
      strokeWeight(2);
      circle(this.x, this.y, this.popRadius);
      
      // 2. 四散的小水花 (四個小點)
      noStroke();
      fill(255, this.popAlpha);
      circle(this.x - this.size * 0.4, this.y - this.size * 0.4, this.size * 0.15);
      circle(this.x + this.size * 0.5, this.y - this.size * 0.2, this.size * 0.2);
      circle(this.x - this.size * 0.2, this.y + this.size * 0.5, this.size * 0.1);
      circle(this.x + this.size * 0.4, this.y + this.size * 0.3, this.size * 0.15);
    }
    pop();
  }
}
