var radardiv = document.getElementById('radar');

// The radar object will respond to events from the
// zig object and move the dots around accordingly.
// It is also responsible for creating and destroying
// the dots when users are added and removed.
// Functions onnewuser(), onlostser(), and ondataupdate()
// are called by the zig object when those things happen.

var radar = {
  onuserfound: function (user) {
    var userdiv = document.createElement('div');
    userdiv.className = 'user';
    user.radarelement = userdiv; // add radarelement as a property of the user
    radardiv.appendChild(user.radarelement);
  },
  onuserlost: function (user) {
    radardiv.removeChild(user.radarelement);
  },
  ondataupdate: function (zigdata) {
    for (var userid in zigdata.users) {
      var user = zigdata.users[userid];
      var pos = user.position;
      var el = user.radarelement;
      var parentElenment = document.body;
      var zrange = 4000;
      var xrange = 4000;
      var pixelwidth = parentElenment.offsetWidth;
      var pixelheight = parentElenment.offsetHeight;
      var heightscale = pixelheight / zrange;
      var widthscale = pixelwidth / xrange;
      if (userid = 1)
      {
        player.x = (((pos[0] / xrange) + 0.5) * pixelwidth - (el.offsetWidth / 2)) - 300;
        el.style.left = player.x + "px";
        console.log('Position X:' + pos[0]);
      }
    }
  }
};

// Add the radar object as a listener to the zig object, so that
// the zig object will call the radar object's callback functions

zig.addListener(radar);

