let seeds = [];
let myIframe;
let activeSeed = null; // 追蹤當前被選中的種子
let particles = []; // 新增：漂浮粒子陣列
let trail = [];     // 新增：滑鼠軌跡陣列

// 這裡請改成您實際的檔案路徑！
// 如果您的作業是在資料夾內，請加上資料夾名稱，例如："week1/index.html"
// 如果是直接放在同一個資料夾的 HTML 檔，請確保名稱完全相同（包含大小寫）。
let links = [
  "week1/index.html",
  "week2/index.html",
  "week3/index.html",
  "week4/index.html",
  "week5/index.html",
  "week6/index.html",
  "week7/index.html"
];

// let popSound; // 進階挑戰：預載音效
function preload() {
  // popSound = loadSound('assets/bubble.mp3'); 
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  // 動態建立 iframe 顯示區域 (位於畫面右半部)
  myIframe = createElement('iframe');
  myIframe.position(width * 0.4, height * 0.1);
  myIframe.size(width * 0.55, height * 0.8);
  // 升級：改為「毛玻璃 (Glassmorphism)」高質感面板
  myIframe.style('border', '1px solid rgba(255, 255, 255, 0.5)');
  myIframe.style('border-radius', '20px');
  myIframe.style('box-shadow', '0 20px 40px rgba(0,0,0,0.4), 0 0 20px rgba(100,200,255,0.3), inset 0 0 15px rgba(255,255,255,0.4)');
  myIframe.style('background-color', 'rgba(255, 255, 255, 0.85)'); // 微透明的背景
  myIframe.style('backdrop-filter', 'blur(10px)'); // 毛玻璃模糊特效
  myIframe.elt.src = links[0]; // 預設顯示第一週的作業內容
  
  // 初始化背景漂浮粒子
  for (let i = 0; i < 80; i++) {
    particles.push(new Particle());
  }

  // 建立六個週次的種子節點
  let startX = width * 0.2; // 佈局在畫面左側 20% 處
  let startY = height * 0.85; // 從底部開始往上生長
  let spacingY = height * 0.7 / (links.length - 1); // 依據週次數量動態計算垂直間距
  
  for (let i = 0; i < links.length; i++) { // 迴圈現在會自動根據 links 數量產生節點
    let x = startX + sin(i * 1.5) * 60; // 呈現自然波浪狀交錯分佈
    let y = startY - i * spacingY;
    seeds.push(new Seed(x, y, i + 1, links[i]));
  }
  
  if (seeds.length > 0) {
    activeSeed = seeds[0];
    activeSeed.isActive = true;
  }
}

function draw() {
  // 高級感升級 1：使用原生 Canvas API 繪製深邃的深海/星空漸層背景
  let gradient = drawingContext.createLinearGradient(0, 0, 0, height);
  gradient.addColorStop(0, color(5, 10, 25));
  gradient.addColorStop(1, color(15, 35, 60));
  drawingContext.fillStyle = gradient;
  noStroke();
  rect(0, 0, width, height);
  
  // 視角切換 (Map 函數)：計算視差效果 (Parallax offset)
  let moveX = map(mouseX, 0, width, -20, 20);
  let moveY = map(mouseY, 0, height, -10, 10);
  
  // 讓 iframe 也跟著視差效果浮動，產生與畫布融為一體的 3D 浮空感！
  myIframe.style('transform', `translate(${moveX}px, ${moveY}px)`);

  push();
  translate(moveX, moveY); // 整個畫布跟著滑鼠輕微反向偏移，產生 3D 空間感
  
  drawIframeAura();   // 畫 iframe 背後的魔法光環與聚光燈 (藝術美感升級)
  
  // 畫漂浮粒子 (新增特效)
  for (let i = 0; i < particles.length; i++) {
    particles[i].update();
    particles[i].display();
  }
  
  drawGallerySpace(); // 畫展廳背景線條
  drawDigitalPlant(); // 畫背景裝飾 (海草)
  drawVine();         // 畫生長的藤蔓
  
  // 更新與顯示所有種子節點
  for (let i = 0; i < seeds.length; i++) {
    // 更新時傳入校正後的滑鼠座標
    let adjustedMouseX = mouseX - moveX;
    let adjustedMouseY = mouseY - moveY;
    seeds[i].display();
    seeds[i].update(adjustedMouseX, adjustedMouseY);
  }
  pop();
  
  // 畫滑鼠軌跡 (不跟隨視差，直接畫在最上層)
  drawMouseTrail();
}

// 繪製滑鼠軌跡特效
function drawMouseTrail() {
  trail.push({x: mouseX, y: mouseY});
  if (trail.length > 35) { // 控制軌跡長度
    trail.shift();
  }
  if (trail.length < 2) return; // 點不夠不畫

  push();
  noFill();
  // 高級感升級 2：真實發光軌跡與連續平滑曲線
  drawingContext.shadowBlur = 15;
  drawingContext.shadowColor = 'rgba(100, 220, 255, 0.8)';
  stroke(150, 230, 255, 200);
  strokeWeight(3);
  beginShape();
  curveVertex(trail[0].x, trail[0].y);
  for (let i = 0; i < trail.length; i++) {
    curveVertex(trail[i].x, trail[i].y);
  }
  curveVertex(trail[trail.length - 1].x, trail[trail.length - 1].y);
  endShape();
  pop();
}

// 繪製 Iframe 背後的科技/魔法光環與聚光燈 (藝術美感升級)
function drawIframeAura() {
  push();
  let spotX = width * 0.675; // iframe 中心 X
  let spotY = height * 0.5;  // iframe 中心 Y
  
  // 1. 原本的柔和底光
  noStroke();
  for (let r = 800; r > 0; r -= 40) {
    fill(80, 150, 255, 2); // 淡淡的藍光疊加
    ellipse(spotX, spotY, r, r * 0.8);
  }
  
  // 2. 新增：環繞 iframe 的動態能量環與邊框
  translate(spotX, spotY);
  noFill();
  
  // 內圈：隨著時間呼吸縮放的科技感虛線方框
  push();
  rectMode(CENTER);
  drawingContext.shadowBlur = 20;
  drawingContext.shadowColor = '#88ccff'; // 高級感發光
  stroke(150, 220, 255, 150);
  strokeWeight(2);
  drawingContext.setLineDash([15, 20]); // 使用原生 Canvas 畫虛線
  let breathe = sin(frameCount * 0.03) * 15;
  rect(0, 0, width * 0.55 + 40 + breathe, height * 0.8 + 40 + breathe, 25);
  pop();
  
  // 外圈：逆時針旋轉的星軌/魔法細點陣橢圓
  push();
  rotate(-frameCount * 0.002);
  stroke(200, 255, 255, 80);
  strokeWeight(1);
  drawingContext.setLineDash([2, 8]);
  ellipse(0, 0, width * 0.65, height * 0.95);
  pop();
  
  // 恢復實線設定，避免影響其他繪圖
  drawingContext.setLineDash([]);
  pop();
}

// 繪製展廳背景透視網格線
function drawGallerySpace() {
  push();
  stroke(255, 30);
  strokeWeight(1);
  // 讓背景線條帶有閃爍效果
  for (let i = 0; i < height; i += 50) {
    let alpha = map(sin(frameCount * 0.01 + i * 0.1), -1, 1, 10, 60);
    stroke(255, alpha);
    line(0, i, width * 0.35, i + (height - i) * 0.2);
  }
  pop();
}

// 利用 vertex 繪製生長的時間軸藤蔓
function drawVine() {
  push();
  noFill();
  drawingContext.shadowBlur = 10;
  drawingContext.shadowColor = 'rgba(100, 255, 150, 0.5)'; // 讓藤蔓自帶微光
  stroke(100, 220, 150, 200);
  strokeWeight(4);
  beginShape();
  curveVertex(seeds[0].x, seeds[0].y + 100); // 延長根部
  for (let i = 0; i < seeds.length; i++) {
    let s = seeds[i];
    // 讓藤蔓的控制點隨時間呼吸擺動 (生命力)
    let controlX = s.x + sin(frameCount * 0.02 + i) * 15;
    curveVertex(controlX, s.y);
  }
  let lastSeed = seeds[seeds.length - 1];
  curveVertex(lastSeed.x, lastSeed.y - 100); // 延長頂部
  endShape();
  pop();
}

// 裝飾用數位盆栽 (海草指令轉換) - 改為對稱且更茂盛
function drawDigitalPlant() {
  push();
  noFill();
  // 以 week 種子 (width * 0.2) 為中心，左右對稱畫兩叢海草
  drawSeaweedCluster(width * 0.12, -1); // 左側
  drawSeaweedCluster(width * 0.28, 1);  // 右側
  pop();
}

function drawSeaweedCluster(baseX, direction) {
  // 產生 6 根不同粗細、高低的海草，使畫面更茂盛
  for (let i = 0; i < 6; i++) {
    strokeWeight(10 - i * 1.2);
    stroke(40 + i * 10, 160 + i * 15, 210, 45); // 顏色帶有漸層變化
    
    let startX = baseX + (i * 12 * direction) + sin(frameCount * 0.01 + i) * 10;
    beginShape();
    // 讓海草長得更高，覆蓋更多背景空間
    for (let y = height + 50; y > height * 0.15 + i * 25; y -= 30) {
      let x = startX + sin(frameCount * (0.015 + i * 0.005) + y * 0.01) * (35 + i * 6);
      curveVertex(x, y);
    }
    endShape();
  }
}

function mousePressed() {
  let moveX = map(mouseX, 0, width, -20, 20);
  let moveY = map(mouseY, 0, height, -10, 10);
  let adjustedMouseX = mouseX - moveX;
  let adjustedMouseY = mouseY - moveY;

  for (let i = 0; i < seeds.length; i++) {
    if (seeds[i].checkHover(adjustedMouseX, adjustedMouseY)) {
      // 取消上一個被選中的種子
      if (activeSeed) {
        activeSeed.isActive = false;
      }
      // 設定新的種子為選中狀態
      activeSeed = seeds[i];
      activeSeed.isActive = true;
      
      // 切換 iframe 內容
      myIframe.elt.src = seeds[i].url;
      
      // 進階挑戰：若有載入音效可取消註解
      // if (popSound && popSound.isLoaded()) popSound.play();
      seeds[i].popEffect(); // 觸發跳動特效
    }
  }
}

// 每一個週次節點 (Class)
class Seed {
  constructor(x, y, weekNum, url) {
    this.x = x;
    this.y = y;
    this.weekNum = weekNum;
    this.url = url;
    this.baseRadius = 25;
    this.radius = this.baseRadius;
    this.isHovered = false;
    this.isActive = false; // 新增：是否為當前選中
    this.popScale = 1;
  }
  
  update(mx, my) {
    this.isHovered = this.checkHover(mx, my);
    
    if (this.isActive) {
      // 被選中時，維持較大的尺寸
      this.radius = lerp(this.radius, this.baseRadius * 1.5, 0.1);
    } else if (this.isHovered) {
      // 滑鼠懸停時放大
      this.radius = lerp(this.radius, this.baseRadius * 1.4, 0.15);
    } else {
      // 平常狀態加入呼吸效果
      let breathing = sin(frameCount * 0.05 + this.weekNum) * 2;
      this.radius = lerp(this.radius, this.baseRadius + breathing, 0.1);
    }
    
    // 使跳動特效隨時間平滑恢復成比例 1
    this.popScale = lerp(this.popScale, 1, 0.1);
  }
  
  checkHover(mx, my) {
    return dist(mx, my, this.x, this.y) < this.radius;
  }
  
  popEffect() {
    this.popScale = 1.6; // 點擊瞬間膨脹 1.6 倍
  }
  
  display() {
    push();
    translate(this.x, this.y);
    scale(this.popScale);
    
    // 高級感升級 3：節點的真實發光 (Bloom Effect)
    drawingContext.shadowBlur = 15;
    drawingContext.shadowColor = this.isActive ? 'rgba(255, 255, 150, 0.8)' : (this.isHovered ? 'rgba(255, 200, 100, 0.8)' : 'rgba(100, 255, 180, 0.5)');

    // 如果是當前選中的種子，顯示持續發光的外圈
    if (this.isActive) {
      noFill();
      stroke(255, 255, 150, 150); // 淡黃色光暈
      strokeWeight(3);
      circle(0, 0, this.radius * 2.2 + sin(frameCount * 0.05) * 3);
      circle(0, 0, this.radius * 1.8 + sin(frameCount * 0.05) * 2);
    }
    
    if (this.isHovered) {
      // 懸停時：發光外暈效果
      fill(255, 200, 100, 80);
      noStroke();
      
      // 開花特效 (利用 vertex 畫花瓣形狀)
      fill(255, 180, 150);
      beginShape();
      for(let a = 0; a < TWO_PI; a += PI / 6) {
        // 利用 sin 和時間產生稍微震動的花瓣邊緣
        let h = this.radius + sin(frameCount * 0.1 + a * 3) * 6;
        vertex(cos(a) * h, sin(a) * h);
      }
      endShape(CLOSE);
    } else {
      // 平常狀態：圓潤的種子
      if (this.isActive) {
        fill(150, 255, 200); // 選中時顏色稍微亮一點
      } else {
        fill(100, 255, 180);
      }
      stroke(255);
      strokeWeight(2);
      circle(0, 0, this.radius * 2);
    }
    
    // 文字標籤
    fill(0);
    noStroke();
    drawingContext.shadowBlur = 0; // 文字不需要發光，確保清晰易讀
    textAlign(CENTER, CENTER);
    textSize(16);
    textStyle(BOLD);
    text("W" + this.weekNum, 0, 0);
    pop();
  }
}

// 漂浮粒子 Class (新增特效)
class Particle {
  constructor() {
    // 稍微超出畫面以防視差移動時邊緣露餡
    this.x = random(width * -0.2, width * 1.2); 
    this.y = random(height * -0.2, height * 1.2);
    this.size = random(2, 6);
    this.speedY = random(-0.5, -2);
    this.noiseOffsetX = random(1000);
    this.alpha = random(30, 150);
  }

  update() {
    this.y += this.speedY;
    this.x += map(noise(this.noiseOffsetX), 0, 1, -1, 1); // 左右輕微飄動
    this.noiseOffsetX += 0.01;

    // 如果飄出畫面頂部，就從底部重新產生
    if (this.y < height * -0.2) {
      this.y = height * 1.2;
      this.x = random(width * -0.2, width * 1.2);
    }
  }

  display() {
    push();
    noStroke();
    drawingContext.shadowBlur = 10;
    drawingContext.shadowColor = 'rgba(150, 200, 255, 0.6)'; // 粒子發光
    fill(200, 230, 255, this.alpha);
    circle(this.x, this.y, this.size);
    pop();
  }
}

// 當視窗改變大小時，重繪 Canvas 並且重新定位 iframe
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  myIframe.position(width * 0.4, height * 0.1);
  myIframe.size(width * 0.55, height * 0.8);
}