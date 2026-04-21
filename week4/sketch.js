let inputField;
let sizeSlider;
let jumpButton;
let isJumping = false; // 用來記錄是否開啟跳動效果
let tkuDiv; // 宣告 div 容器變數
let tkuIframe; // 宣告 iframe 變數
let siteSelect; // 宣告下拉式選單變數

function setup() {
  // 建立全螢幕畫布
  createCanvas(windowWidth, windowHeight);
  
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
  siteSelect.changed(changeSite); // 綁定選項改變事件
  
  // 建立一個 div 容器，左右保持 200px，距離上下邊緣 100px
  tkuDiv = createDiv();
  tkuDiv.position(200, 100);
  tkuDiv.size(windowWidth - 400, windowHeight - 200);
  
  // 在 div 內建立 iframe 來嵌入淡江大學官網
  tkuIframe = createElement('iframe');
  tkuIframe.attribute('src', 'https://www.tku.edu.tw/');
  tkuIframe.style('width', '100%');
  tkuIframe.style('height', '100%');
  tkuIframe.style('border', 'none'); // 隱藏 iframe 的預設邊框
  tkuIframe.parent(tkuDiv); // 將 iframe 放入 div 容器中
  
  // 設定字型對齊方式 (設定為垂直置中)
  textAlign(LEFT, CENTER);
}

function draw() {
  // 背景調整為淺藍色
  background('lightblue');
  
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
  // 同步調整 div 的大小，以確保視窗改變時仍維持設定的間距
  tkuDiv.size(windowWidth - 400, windowHeight - 200);
}
