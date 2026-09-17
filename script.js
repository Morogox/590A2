window.onload = function() {
  //Variables representing the canvas and the canvas' context (the context is used for actually drawing on the canvas)
  var canvas = document.getElementById("canvas");
  var context = canvas.getContext("2d");
			
  var rocket = {
    x: 100,
    y: 100,
    velocity_x: 1,
    velocity_y: 0,
    angle: 0,
    curr_speed: 0,
    max_speed : 8
  };
  var particles = [];
  var stars = [];
  var starsFar = [];
			
  //draw the first frame
  requestAnimationFrame(mainLoop);
  generate_stars();
  var mouse = {
    x: 0,
    y: 0
  };

  canvas.addEventListener("mousemove", function(event) {
    var rect = canvas.getBoundingClientRect();

    mouse.x = event.clientX - rect.left;
    mouse.y = event.clientY - rect.top;
  });
  //Game/simulation Loop
  function mainLoop() {
    //processInput(); //in this simple example, we don't have any input to process
	update();
	draw();
				
	requestAnimationFrame(mainLoop);
  }
  function update() {
      handle_particle();
      handle_rocket_movment();
      handle_stars_movment();

      
				
    }
  
  function handle_particle(){
    var spd_ratio = rocket.curr_speed / rocket.max_speed;

    if (Math.random() < spd_ratio) {
        createParticle();
    }

      for (var i = particles.length - 1; i >= 0; i--) {
          var p = particles[i];

          p.x += p.velocity_x;
          p.y += p.velocity_y;

          p.life -= 0.02;
    

          if (p.life <= 0) {
              particles.splice(i, 1);
          }
      }
  }
  
  function generate_stars(){
    for (i = 0; i < 25; i++){
      
      stars.push({
        x: Math.random() * canvas.width + 20,
        y: Math.random() * canvas.height + 20
      });
    }
    
    for (i = 0; i < 25; i++){
      
      starsFar.push({
        x: Math.random() * canvas.width + 20,
        y: Math.random() * canvas.height + 20
      });
    }
  }
  
  function handle_stars_movment(){
    for (var i = stars.length - 1; i >= 0; i--){
      var s = stars[i];
      s.x += -rocket.velocity_x * 0.05;
      s.y += -rocket.velocity_y * 0.05;
    }
    
    for (var j = starsFar.length - 1; j >= 0; j--){
      var sf = starsFar[j];
      sf.x += -rocket.velocity_x * 0.015;
      sf.y += -rocket.velocity_y * 0.015;
    }
  }
  
  function handle_rocket_movment(){
    var dx = mouse.x - rocket.x;
    var dy = mouse.y - rocket.y;

    var length = Math.sqrt(dx * dx + dy * dy);
    
    if (length > 0) {
      dx /= length;
      dy /= length;
    }
     
    var desiredSpeed = Math.min(length * 0.05, rocket.max_speed);
    if (length <= 100){
      desiredSpeed = 0
    }
    var desired_x = dx * desiredSpeed;
    var desired_y = dy * desiredSpeed;

    //steering
    var steering_x = desired_x - rocket.velocity_x;
    var steering_y = desired_y - rocket.velocity_y;

    //apply steering
    rocket.velocity_x += steering_x * 0.05;
    rocket.velocity_y += steering_y * 0.05;
    rocket.curr_speed = Math.sqrt(rocket.velocity_x * rocket.velocity_x + rocket.velocity_y * rocket.velocity_y)

    //move rocket
    rocket.x += rocket.velocity_x;
    rocket.y += rocket.velocity_y;
    
    //rotate rocket
    rocket.angle = Math.atan2(rocket.velocity_y, rocket.velocity_x) + Math.PI / 2;
  }
  function draw() {			
    //clear our drawing
	context.clearRect(0, 0, canvas.width, canvas.height);
    
    //background
    context.fillStyle = "black";
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    //stars
    for (i = 0; i < stars.length; i++){
      var s = stars[i]
      context.beginPath();
      context.arc(s.x, s.y, 1, 0, 2 * Math.PI);

      context.fillStyle = "white";
      context.fill();
    }
    
    for (i = 0; i < starsFar.length; i++){
      var sf = starsFar[i]
      context.beginPath();
      context.arc(sf.x, sf.y, 1, 0, 2 * Math.PI);

      context.fillStyle = "white";
      context.fill();
    }
    
    var spd_ratio = rocket.curr_speed / rocket.max_speed
    
    //particle
    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];

      context.beginPath();
      context.arc(p.x, p.y, 3, 0, 2 * Math.PI);

      context.fillStyle = "rgba(255, 165, 0, " + p.life + ")";
      context.fill();
    }
    
    //rocket
    context.save();
    context.translate(rocket.x, rocket.y);
    context.rotate(rocket.angle);

    context.beginPath();
    context.moveTo(0, -30);   
    context.lineTo(-20, 20);  
    context.lineTo(20, 20);   
    context.closePath();

    context.fillStyle = "gray";
    context.fill();
   
    //window
    context.beginPath();
    context.arc(0, 0, 6, 0, 2 * Math.PI);

    context.fillStyle = "lightblue";
    context.fill();

    context.strokeStyle = "black";
    context.stroke();
    context.closePath();
    
    //fire
    context.beginPath();
    var fireLength = 20 + Math.random() * 20;
    context.moveTo(-8, 20);
    context.lineTo(0, 20 + fireLength * spd_ratio);
    context.lineTo(8, 20);
    context.closePath();

    context.fillStyle = "orange";
    context.fill();
    context.restore()
    
    
   }
  
  function createParticle() {
    var length = Math.sqrt(rocket.velocity_x * rocket.velocity_x + rocket.velocity_y * rocket.velocity_y);
    var x = rocket.velocity_x / length
    var y = rocket.velocity_y / length
    particles.push({
        x: rocket.x,
        y: rocket.y,
        velocity_x: -x + (Math.random() - 0.5),
        velocity_y: -y + (Math.random() - 0.5),
        life: 1.0
    });
  }
 }
