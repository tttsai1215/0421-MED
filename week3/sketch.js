function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(173, 216, 230); // 淺藍色背景

  // 畫一排圓形
  let diameter = 100;
  let y = height / 2; // 垂直置中

  // 使用 for 迴圈從畫布左邊畫到右邊
  for (let x = diameter / 2; x < width; x += diameter) {
    ellipse(x, y, diameter, diameter);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
