function setup() {
  //createCanvas(400, 400);
  //background(220);
  //background(225,0,0);
  createCanvas(windowWidth, windowHeight);
  background('#a9d6e5');
}

function draw() {
  //background(220);
  fill('#ffca3a')
  strokeWeight(8)
  ellipse(windowWidth/2,windowHeight/2,200,200)
  fill('#6a4c93')
  rectMode(CENTER)
  rect(windowWidth/2-50,windowHeight/2-50,20,20)
  rect(windowWidth/2-50,windowHeight/2-50,20,20)
  noFill();
  stroke('#6a4c93')
  strokeWeight(8)
arc(windowWidth/2,windowHeight/2+20,100,50,0,PI)
}
