// The radar object will respond to events from the
// zig object and move the dots around accordingly.
// It is also responsible for creating and destroying
// the dots when users are added and removed.
// Functions onnewuser(), onlostser(), and ondataupdate()
// are called by the zig object when those things happen.


var engager = zig.EngageUsersWithSkeleton(1);

engager.addEventListener('userengaged', function (user) {
  console.log('User engaged: ' + user.id);
  if (game.waiting){
    game.countdown();
  };

  user.addEventListener('userupdate', function(user) {
    var pos = user.position;


    if (player.floor_offset === 0){
      player.floor_offset = pos[1];
    }

    if (player.prev_depth === 0){
      player.prev_depth = pos[2];
    }

    // If user moves closer or further to the sensor, update the floor threshold
    if (Math.abs(player.prev_depth - pos[2]) >= 100){
      player.floor_offset = pos[1];
      player.prev_depth = pos[2];
      console.log('Floor offset: ' + player.floor_offset);
    }
    var parentElement = document.body;
    var pixelwidth = parentElement.offsetWidth;
    var newPosition = ((pos[0]*(pixelwidth/2)/800) + 600);
    player.distance += Math.floor(Math.abs(newPosition-player.x));
    player.x = newPosition;
    player.y = ((game.floor) - (pos[1]-player.floor_offset-50).clamp(0, 250)*1.5);
  })
});

engager.addEventListener('userdisengaged', function (user) {
  console.log('User disengaged: ' + user.id);
});

// Add the radar object as a listener to the zig object, so that
// the zig object will call the radar object's callback functions

zig.addListener(engager);

