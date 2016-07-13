var connected = false;


var socket = io.connect( 'http://104.199.153.48:4000' );

function addParticipantsMessage (data) {
  var message = '';
  if (data.numUsers === 1) {
    message += "there's 1 participant";
  } else {
    message += "there are " + data.numUsers + " participants";
  }
  log(message);
}

// Sets the client's username
function setUsername (username) {
  // If the username is valid
  if (username) {
    // Tell the server your username
    socket.emit('add user', username);
  }
}

// Sends a chat message
function sendMessage (message) {

  message = cleanInput(message);
  // if there is a non-empty message and a socket connection
  if (message && connected) {

    // tell server to execute 'new message' and send along one parameter
    socket.emit('new message', message);
  }
}

// Sends a command message
function sendCommand ($command, $data) {
  if ($command && connected) {
    socket.emit($command, $data);
  }
}

// Log a message
function log (message, options) {
  var $el = $('<li>').addClass('log').text(message);
  addMessageElement($el, options);
}



// Socket events

// Whenever the server emits 'login', log the login message
socket.on('login', function (data) {
  connected = true;
  // Display the welcome message
  var message = "Welcome to Socket.IO IM";
/*  log(message, {
    prepend: true
  });*/
  addParticipantsMessage(data);
});

// Whenever the server emits 'new message', update the chat body
socket.on('new message', function (data) {
  addChatMessage(data);
});

socket.on('personal message', function (data) {
  addChatMessage(data);
});

// Whenever the server emits 'user joined', log it in the chat body
socket.on('user joined', function (data) {
  //log(data.username + ' joined');
  addParticipantsMessage(data);
});

// Whenever the server emits 'user left', log it in the chat body
socket.on('user left', function (data) {
  //log(data.username + ' left');
  addParticipantsMessage(data);
  removeChatTyping(data);
});


