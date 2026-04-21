/**
 * p5_audio_visualizer
 * 
 * 描述: 這是一個結合 p5.js 與 p5.sound 的程式，載入音樂並循環播放，
 * 畫面上會有多個隨機生成的多邊形在視窗內移動反彈，且其大小會跟隨音樂的振幅（音量）即時縮放。
 */

// 全域變數
let shapes = [];
let bubbles = [];
let song;
let amplitude;
// 外部定義的二維陣列，做為多邊形頂點的基礎座標 (這裡定義一個六邊形作為基礎)
let points = [[-3, 5], [3, 7], [1, 5],[2,4],[4,3],[5,2],[6,2],[8,4],[8,-1],[6,0],[0,-3],[2,-6],[-2,-3],[-4,-2],[-5,-1],[-6,1],[-6,2]];

function preload() {
  // 在程式開始前預載入外部音樂資源
  // 請確保 'midnight-quirk-255361.mp3' 檔案存在於專案目錄中
  song = loadSound('midnight-quirk-255361.mp3');
}

function setup() {
  // 初始化畫布，建立符合視窗大小的畫布
  createCanvas(windowWidth, windowHeight);

  // 初始化 p5.Amplitude 物件
  amplitude = new p5.Amplitude();

  // 循環播放音樂
  // 注意：現代瀏覽器通常會阻擋自動播放，已改至 mousePressed 中觸發

  // 使用 for 迴圈產生 10 個形狀物件
  for (let i = 0; i < 10; i++) {
    // 產生一個隨機的縮放比例，讓每個形狀大小不同，但保持原比例
    let randomScale = random(10, 30);
    let deformedPoints = points.map(p => {
      return [
        p[0] * randomScale,
        p[1] * randomScale
      ];
    });

    // 定義形狀物件結構
    let shape = {
      x: random(windowWidth),      // 0 到 windowWidth 之間的隨機亂數
      y: random(windowHeight),     // 0 到 windowHeight 之間的隨機亂數
      dx: random(-3, 3),           // -3 到 3 之間的隨機亂數 (X 速度)
      dy: random(-3, 3),           // -3 到 3 之間的隨機亂數 (Y 速度)
      scale: random(1, 10),        // 1 到 10 之間的隨機亂數 (雖然 draw 中主要使用音量縮放，但此屬性仍依需求保留)
      color: color(random(255), random(255), random(255)), // 隨機生成的 RGB 顏色
      points: deformedPoints       // 變形後的頂點座標
    };

    // 將物件 push 到 shapes 陣列中
    shapes.push(shape);
  }

  // 初始化泡泡物件
  for (let i = 0; i < 50; i++) {
    bubbles.push({
      x: random(width),
      y: random(height),
      size: random(5, 20),
      speed: random(1, 3),
      offset: random(100)
    });
  }
}

function draw() {
  // 設定背景顏色
  background('#ffcdb2');

  // 繪製泡泡特效
  push();
  noFill();
  stroke(255, 150);
  strokeWeight(1);
  for (let b of bubbles) {
    b.y -= b.speed;
    b.x += sin(frameCount * 0.05 + b.offset) * 0.5;
    if (b.y < -b.size) {
      b.y = height + b.size;
      b.x = random(width);
    }
    circle(b.x, b.y, b.size);
  }
  pop();
  
  // 設定邊框粗細
  strokeWeight(2);

  // 透過 amplitude.getLevel() 取得當前音量大小 (0 到 1)
  let level = amplitude.getLevel();

  // 使用 map() 將 level 映射到 (0.5, 2) 的範圍，做為縮放倍率
  let sizeFactor = map(level, 0, 1, 0.5, 2);

  // 使用 for...of 迴圈走訪 shapes 陣列
  for (let shape of shapes) {
    // 位置更新
    shape.x += shape.dx;
    shape.y += shape.dy;

    // 邊緣反彈檢查
    if (shape.x < 0 || shape.x > windowWidth) {
      shape.dx *= -1;
    }
    if (shape.y < 0 || shape.y > windowHeight) {
      shape.dy *= -1;
    }

    // 設定外觀
    fill(shape.color);
    stroke(shape.color);

    // 座標轉換與縮放
    push();
    translate(shape.x, shape.y); // 將原點移動到形狀座標
    scale(sizeFactor);           // 依照音樂音量縮放圖形

    // 繪製多邊形
    beginShape();
    for (let p of shape.points) {
      vertex(p[0], p[1]);
    }
    endShape(CLOSE);

    // 狀態還原
    pop();
  }

  // 如果音樂沒有播放，顯示提示文字
  if (!song.isPlaying()) {
    fill(50);
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(32);
    text('Click to Play', width / 2, height / 2);
  }
}

// 額外功能：點擊滑鼠以確保音樂播放 (解決瀏覽器自動播放限制)
function mousePressed() {
  userStartAudio(); // 啟動 AudioContext
  if (song.isLoaded() && !song.isPlaying()) {
    song.loop();
  }
}

// 額外功能：視窗大小改變時調整畫布
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}