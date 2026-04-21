let capture;
let graphics;
let bubbles = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  capture = createCapture(VIDEO);
  capture.hide(); // 隱藏 p5.js 預設產生的 HTML 影片元素
  
  // 使用 createGraphics 產生與縮放後視訊畫面相同寬高的圖層
  graphics = createGraphics(windowWidth * 0.6, windowHeight * 0.6);
  
  // 建立拍照按鈕，並放置於視訊畫面下方
  let btn = createButton('拍照儲存 (Take Photo)');
  btn.position(windowWidth / 2 - 75, windowHeight * 0.85);
  btn.style('padding', '10px 20px');
  btn.style('font-size', '16px');
  btn.mousePressed(takeSnapshot);
}

function draw() {
  background('#e7c6ff');
  
  // 計算影像寬高 (畫布的 60%)
  let imgWidth = width * 0.6;
  let imgHeight = height * 0.6;
  
  // 在 graphics 圖層上繪製冒泡效果
  graphics.clear(); // 每次繪製前清除背景，維持透明

  // 每隔一段時間隨機產生新的泡泡
  if (random(1) < 0.3) {
    bubbles.push(new Bubble());
  }
  // 更新並顯示所有泡泡
  for (let i = bubbles.length - 1; i >= 0; i--) {
    bubbles[i].update();
    bubbles[i].show();
    if (bubbles[i].finished()) {
      bubbles.splice(i, 1); // 如果泡泡超出畫面，就從陣列中移除
    }
  }
  
  // 繪製攝影機影像（利用水平翻轉修正左右顛倒）
  push(); // 儲存目前的繪圖設定（避免影響到後續其他可能繪製的圖形）
  translate(width / 2, height / 2); // 將畫布座標原點移動到畫面正中央
  
  push(); // 針對影片翻轉再包一層，避免接下來的 graphics 也被翻轉
  scale(-1, 1); // 將 X 軸縮放 -1，達到水平翻轉的效果
  
  // 讀取視訊當前畫面的像素資料
  capture.loadPixels();
  if (capture.pixels.length > 0) { // 確保攝影機已經載入畫面
    let stepSize = 15; // 縮小單位尺寸，讓畫面更細緻
    let wRatio = imgWidth / capture.width; // 計算畫布顯示的寬度比例
    let hRatio = imgHeight / capture.height; // 計算畫布顯示的高度比例
    
    push();
    translate(-imgWidth / 2, -imgHeight / 2); // 將繪圖起點移至影像區域的左上角
    noStroke(); // 單位方塊不需要邊框
    for (let y = 0; y < capture.height; y += stepSize) { // 單位化迴圈
      for (let x = 0; x < capture.width; x += stepSize) { // 單位化迴圈
        let index = (y * capture.width + x) * 4; // 計算一維陣列中的像素索引 (R, G, B, A)
        let r = capture.pixels[index];
        let g = capture.pixels[index + 1];
        let b = capture.pixels[index + 2];
        
        fill(r, g, b, 220); // 直接使用原始顏色，並加上一點透明度
        // 將方塊改為圓形，創造點彩畫效果
        ellipse(x * wRatio, y * hRatio, stepSize * wRatio, stepSize * hRatio);
      }
    }
    pop();
  }
  pop(); // 恢復影片的翻轉設定
  
  // 疊加 graphics 圖片在視訊畫面的上方
  imageMode(CENTER);
  image(graphics, 0, 0, imgWidth, imgHeight);
  
  pop(); // 恢復先前的繪圖設定
}

// 拍照功能：擷取視訊畫面區域並存檔
function takeSnapshot() {
  let imgWidth = width * 0.6;
  let imgHeight = height * 0.6;
  let startX = (width - imgWidth) / 2; // 計算畫面擷取的起始 X 座標
  let startY = (height - imgHeight) / 2; // 計算畫面擷取的起始 Y 座標
  
  let snapshot = get(startX, startY, imgWidth, imgHeight); // 擷取畫布上特定範圍的畫面
  snapshot.save('photo', 'jpg'); // 將擷取下來的圖片儲存為 photo.jpg
}

// 定義泡泡的 class
class Bubble {
  constructor() {
    // 泡泡從 graphics 圖層的底部隨機位置出現
    this.x = random(graphics.width);
    this.y = graphics.height + random(20);
    this.r = random(5, 20); // 泡泡的半徑
    this.vx = random(-0.5, 0.5); // 水平漂移速度
    this.vy = random(-1, -4); // 垂直上升速度
    this.alpha = random(100, 200); // 透明度
  }

  // 檢查泡泡是否已超出畫面頂部
  finished() {
    return this.y < -this.r;
  }

  // 更新泡泡位置
  update() {
    this.x += this.vx;
    this.y += this.vy;
    
    // 讓泡泡與背景影像互動
    if (capture.pixels.length > 0) {
      // 將泡泡在 graphics 圖層上的座標，轉換為 capture 影像的像素座標
      let capX = floor(map(this.x, 0, graphics.width, 0, capture.width));
      let capY = floor(map(this.y, 0, graphics.height, 0, capture.height));
      
      // 因為繪製時有水平翻轉，所以取樣時也要翻轉回來
      let flippedCapX = capture.width - capX;

      // 確保座標在安全範圍內
      let x = constrain(flippedCapX, 0, capture.width - 1);
      let y = constrain(capY, 0, capture.height - 1);

      let index = (y * capture.width + x) * 4;
      let brightness = (capture.pixels[index] + capture.pixels[index+1] + capture.pixels[index+2]) / 3;
      
      // 亮度越高，給予一個越強的向上推力
      let boost = map(brightness, 0, 255, 0, -0.3);
      this.vy = constrain(this.vy + boost, -5, -0.5); // 限制速度範圍
    }
  }

  // 在 graphics 圖層上畫出泡泡
  show() {
    graphics.noFill();
    graphics.stroke(255, this.alpha);
    graphics.strokeWeight(2);
    graphics.ellipse(this.x, this.y, this.r * 2);
  }
}
