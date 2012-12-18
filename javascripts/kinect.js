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
      var user = zigdata.users[1];
      var pos = user.position;
      var el = user.radarelement;
      var parentElenment = document.body;
      var zrange = 4000;
      var xrange = 4000;
      var pixelwidth = parentElenment.offsetWidth;
      var pixelheight = parentElenment.offsetHeight;
      var heightscale = pixelheight / zrange;
      var widthscale = pixelwidth / xrange;

        // player.x = ((((pos[0] / xrange) + 0.5) * pixelwidth - (el.offsetWidth / 2)) - 200);
        var newPosition = ((pos[0]*(pixelwidth/2)/800) + 600);
        player.distance += Math.floor(Math.abs((newPosition-player.x)));
        player.x = newPosition;
        // Add jumping, but limit it to 250px high
        player.y = ((window.innerHeight/2) - (pos[1]).clamp(0, 250)*1.5);
        console.log('Position X:' + player.x);
        console.log('Distance: ' + player.distance);
  }
};

// Add the radar object as a listener to the zig object, so that
// the zig object will call the radar object's callback functions

zig.addListener(radar);
