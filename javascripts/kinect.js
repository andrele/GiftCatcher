// The radar object will respond to events from the
// zig object and move the dots around accordingly.
// It is also responsible for creating and destroying
// the dots when users are added and removed.
// Functions onnewuser(), onlostser(), and ondataupdate()
// are called by the zig object when those things happen.


var radar = {
  onuserfound: function (user) {
  },
  onuserlost: function (user) {
  },
  ondataupdate: function (zigdata) {
      if (zigdata.users[2]){
      var user = zigdata.users[2];
      var pos = user.position;
      var el = user.radarelement;
      var parentElenment = document.body;
      var zrange = 4000;
      var xrange = 4000;
      var pixelwidth = parentElenment.offsetWidth;
      var pixelheight = parentElenment.offsetHeight;
      var heightscale = pixelheight / zrange;
      var widthscale = pixelwidth / xrange;
      var jump = Math.floor(player.prev_height - pos[1]);

        // player.x = ((((pos[0] / xrange) + 0.5) * pixelwidth - (el.offsetWidth / 2)) - 200);
        var newPosition = ((pos[0]*(pixelwidth/2)/800) + 600);
        player.distance += Math.floor(Math.abs(newPosition-player.x));
        player.x = newPosition;
        player.y = ((game.floor) - (pos[1]).clamp(0, 250)*1.5);
        console.log('Jump:' + jump);
        console.log('pos[1]: '  + pos[1]);
        console.log('Distance: ' + player.distance);
      };
  }
};

// Add the radar object as a listener to the zig object, so that
// the zig object will call the radar object's callback functions

zig.addListener(radar);

