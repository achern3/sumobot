'use strict';

var five = require('johnny-five');
var board = new five.Board();
var keypress = require('keypress');

board.on('ready', function() {
  // Use your shield configuration from the list
  // http://johnny-five.io/api/motor/#pre-packaged-shield-configs
  var configs = five.Motor.SHIELD_CONFIGS.ADAFRUIT_V1;
  var motors = new five.Motors([
    configs.M4,
    configs.M3
  ]);

  var sstart = 162;
  var fine = 15;
  var trim = 2;

  var servo = new five.Servo({
    pin: 10,
    startAt: sstart
    //range: [45, 135]
  });

  this.repl.inject({
    motors: motors
  });

  this.repl.inject({
    servo: servo
  });

  console.log('Welcome to the Pee Wee Runt Rover!');
  console.log('Control the bot with the arrow keys, and SPACE to stop.');

  function forward() {
    console.log('Going forward');
    motors.fwd(255);
  }

  function backward() {
    console.log('Going backward');
    motors.rev(255);
  }

  function left() {
    console.log('Going left');
    motors[0].rev(200);
    motors[1].fwd(200);
  }

  function right() {
    console.log('Going right');
    motors[1].rev(200);
    motors[0].fwd(200);
  }

  function stop() {
    motors.stop();
  }

  keypress(process.stdin);
  process.stdin.resume();
  process.stdin.setEncoding('utf8');
  process.stdin.setRawMode(true);
  process.stdin.on('keypress', function (ch, key) {

    if ( !key ) { return; }

    if ( key.name === 'q' ) {

      console.log('Quitting');
      stop();
      process.exit();

    } else if ( key.name === 'up' ) {

      forward();

    } else if ( key.name === 'down' ) {

      backward();

    } else if ( key.name === 'left' ) {

      left();

    } else if ( key.name === 'right' ) {

      right();

    } else if ( key.name === 'space' ) {

      stop();

    } else if ( key.name === 'a' ) {
      servo.to(60);
    } else if ( key.name === 'z' ) {
      servo.to(sstart);

    // u and d used for fine control
    } else if ( key.name === 's' ) {
      if (servo.value < 60 + fine) {return;}
      servo.to(servo.value - fine);
    } else if ( key.name === 'x' ) {
      servo.to(servo.value + fine);
    }
    //d and c to control trim location of bottom
    else if ( key.name === 'd' ) {
      if (sstart < 60 + trim) {return;}
      sstart -= trim;
      console.log(sstart);
      servo.to(' ' + sstart);
    } else if ( key.name === 'c' ) {
      sstart += trim;
      console.log(' ' + sstart);
      servo.to(sstart);
    }
  });
});
