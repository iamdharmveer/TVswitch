$(document).ready(function() {

  $('input[type=radio][name=filter]').change(function() {
    if (this.value == 'all') {
      enableAll();
    } else if (this.value == 'online') {
      enableOnline();
    } else {
      enableOffline();
    }
  });

  getTwitchInfo("freecodecamp");

});

function getAllTwitchInfo() {
  saj.userlist.forEach(function(u) {
    getTwitchInfo(u);
  });
}

function getTwitchInfo(user) {
  var url = `https://api.twitch.tv/kraken/streams/${user}?callback=?`;

  $.getJSON(url, function(data) {
    onResponse(user, data);

  });
}

function onResponse(user, data) {
  var found = false;

  saj.elements.forEach(function(elem) {
    if (elem.user === user) {
      found = true;
      var state = getState();
      if (state != elem.state) {
        // TODO - change text - remove image
        if (state == "online") {
          elem.column.classList.remove("offline");
          elem.column.classList.add("online");
        } else if (state == "offline") {
          elem.column.classList.remove("online");
          elem.column.classList.add("offline");
        }
      }
    }
  });

  if (!found) {
    var divrow = document.createElement("div");
    divrow.classList.add("row");

    // var divleft = document.createElement("div");
    // divleft.classList.add("col-md-2");
    // divrow.appendChild(divleft);

    var divcol = document.createElement("div");
    divcol.classList.add("col-md-8", "col-md-offset-2", user);
    divrow.appendChild(divcol);

    var state = getState(data);
    if (state == "online") {
      divcol.classList.add("online");
    } else if (state == "offline") {
      divcol.classList.add("offline");
    } else {
      divcol.classList.add("unavailable");
    }

    var divrow2 = document.createElement("div");
    divrow2.classList.add("row");
    if (user == "freecodecamp") {
      divrow2.classList.add("toprow");
    }
    divcol.appendChild(divrow2);

    var divcol2 = document.createElement("div");
    divcol2.classList.add("col-md-8", "col-md-offset-1", user);
    divrow2.appendChild(divcol2);

    var ent = document.createElement("h2");
    // ent.classList.add("text-center");
    divcol2.appendChild(ent);

    var divcol3 = document.createElement("div");
    divcol3.classList.add("col-md-1");
    divrow2.appendChild(divcol3);

    var img = undefined;
    console.log(JSON.stringify(data));
    if (state == "online" || state == "offline") {
      var b = document.createElement("button");
      b.classList.add("btn", "btn-info");
      b.setAttribute("title", "http://twitch.tv/" + user);

      b.textContent = "Go";
      divcol3.appendChild(b);

      var divcolimg = document.createElement("div");
      divcolimg.classList.add("col-md-2");
      divrow2.appendChild(divcolimg);

      if (state == "online") {
        img = document.createElement("img");
        img.classList.add(user);
        img.setAttribute("title", "Streaming: " + data.stream.game + " - " + data.stream.channel.status);

        img.setAttribute("src", data.stream.preview.small);
        divcolimg.appendChild(img);
        $("img ." + user).tooltip();
      }
    }

    var obj = {
      user: user,
      state: state,
      element: divrow,
      column: divcol,
      image: img,
      text: ent
    };

    ent.textContent = user + " is " + state;

    $(".container").append(divrow);

    if (state == "online" || state == "offline") {
      ent.setAttribute("title", "http://twitch.tv/" + user);
      // $(ent).tooltip();

      $("." + user + " button").on("click", function() {
        window.open("http://twitch.tv/" + user);
      });
    }

    saj.elements.push(obj);
  }

  if (user == "freecodecamp") {
    // Get remaining users after loading freecodecamp - stays at top.
    getAllTwitchInfo();
  }
}

// Unhide all
function enableAll() {
  saj.elements.forEach(function(val) {
    val.element.hidden = false;
  });
}

// Unhide online - hide others.
function enableOnline() {
  saj.elements.forEach(function(val) {
    if (val.user != "freecodecamp") {
      val.element.hidden = (val.state != "online");
    }
  });
}

// Unhide offline - hide others.
function enableOffline() {
  saj.elements.forEach(function(val) {
    if (val.user != "freecodecamp") {
      val.element.hidden = (val.state != "offline");
    }
  });
}

function enableUnavailable() {
  saj.elements.forEach(function(val) {
    if (val.user != "freecodecamp") {
      val.element.hidden = (val.state != "not found");
    }
  });
}

function getState(data) {
  var state = "not found";
  if (!data.error) {
    if (data.stream) {
      state = "online";
    } else {
      state = "offline";
    }
  }
  return state;
}

var saj = {
  elements: [],
  userlist: ["storbeck", "terakilobyte", "habathcx", "RobotCaleb", "thomasballinger", "noobs2ninjas", "beohoff", "brunofin", "geekandsundry", "comster404", "chiefpat"]
};
