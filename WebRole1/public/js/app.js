angular.module('chatRooms', ['chatRooms.controllers']);
/* This class is used to emit messages to the server via socket */
var Chat = function(socket) {
	this.socket = socket;
};

Chat.prototype.sendMessage = function(room, text) {
	var message = {
		room: room,
		text: text
	};
	this.socket.emit('message', message);
};

Chat.prototype.changeRoom = function(room){
	this.socket.emit('join', {
		newRoom: room
	});
};

Chat.prototype.processCommand = function(command){
	var words = command.split(' ');
	command = words[0].substring(1, words[0].length).toLowerCase();
	var message = false;

	switch(command){
		case 'join':
		words.shift();
		var room = words.join(' ');
		this.changeRoom(room);
		break;
		case 'nick':
		words.shift();
		var name = words.join(' ');
		this.socket.emit('nameAttempt', name);
		break;
		default:
		message = 'Unrecognized command.';
		break;
	}

	return message;
};

Chat.prototype.initRoomPuller = function(){
	setInterval(function() {
		socket.emit('rooms');
	}, 1000);
};

function divEscapedContentElement(message) {
	return $('<div></div>').text(message);
}

function divSystemContentElement(message) {
	return $('<div></div>').html('<i>' + message + '</i>');
}

function processUserInput(chatApp, socket) {
	var message = $('#send-message').val();
	var systemMessage;

	if(message.charAt(0) == '/'){ 
		systemMessage = chatApp.processCommand(message);
		if(systemMessage) {
			$('#messages').append(divSystemContentElement(systemMessage));
		}
	} else{
		chatApp.sendMessage($('#room').text(), message);
		$('#messages').append(divEscapedContentElement(message));
		$('#messages').scrollTop($('#messages').prop('scrollHeight'));
	}
	$('#send-message').val('');
}

var socket = io.connect();

$(document).ready(function() {
	var chatApp = new Chat(socket);

	//Listen for server messages and update the view accordingly.
	socket.on('nameResult', function(result) {
		var message;

		if(result.success) {
			message = 'You are now known as ' + result.name + '.';
		} else{
			message = result.message;
		}
		$('#messages').append(divSystemContentElement(message));
	});

	socket.on('joinResult', function(result) {
		$('#room').text(result.room);
		$('#messages').append(divSystemContentElement('Room changed.'));
	});

	socket.on('message', function(message) {
		var newElement = $('<div></div>').text(message.text);
		$('#messages').append(newElement);
	});

	socket.on('rooms', function(rooms) {
		$('#room-list').empty();

		for (var room in rooms) {
			room = room.substring(1, room.length);
			if(room !== ''){
				$('#room-list').append(divEscapedContentElement(room));
			}
		}

		$('#room-list div').click(function() {
			chatApp.processCommand('/join ' + $(this).text());
			$('#send-message').focus();
		});
	});

	chatApp.initRoomPuller();

	$('#send-message').focus();

	$('#send-form').submit(function() {
		processUserInput(chatApp, socket);
		return false;
	});
});


angular.module('chatRooms.controllers')
	.controller('chatController', ['$scope', '$http', function($scope, $http) {}]);
 
angular.module('chatRooms', ['chatRooms.controllers']);
/* This class is used to emit messages to the server via socket */
var Chat = function(socket) {
	this.socket = socket;
};

Chat.prototype.sendMessage = function(room, text) {
	var message = {
		room: room,
		text: text
	};
	this.socket.emit('message', message);
};

Chat.prototype.changeRoom = function(room){
	this.socket.emit('join', {
		newRoom: room
	});
};

Chat.prototype.processCommand = function(command){
	var words = command.split(' ');
	command = words[0].substring(1, words[0].length).toLowerCase();
	var message = false;

	switch(command){
		case 'join':
		words.shift();
		var room = words.join(' ');
		this.changeRoom(room);
		break;
		case 'nick':
		words.shift();
		var name = words.join(' ');
		this.socket.emit('nameAttempt', name);
		break;
		default:
		message = 'Unrecognized command.';
		break;
	}

	return message;
};

Chat.prototype.initRoomPuller = function(){
	setInterval(function() {
		socket.emit('rooms');
	}, 1000);
};

function divEscapedContentElement(message) {
	return $('<div></div>').text(message);
}

function divSystemContentElement(message) {
	return $('<div></div>').html('<i>' + message + '</i>');
}

function processUserInput(chatApp, socket) {
	var message = $('#send-message').val();
	var systemMessage;

	if(message.charAt(0) == '/'){ 
		systemMessage = chatApp.processCommand(message);
		if(systemMessage) {
			$('#messages').append(divSystemContentElement(systemMessage));
		}
	} else{
		chatApp.sendMessage($('#room').text(), message);
		$('#messages').append(divEscapedContentElement(message));
		$('#messages').scrollTop($('#messages').prop('scrollHeight'));
	}
	$('#send-message').val('');
}

var socket = io.connect();

$(document).ready(function() {
	var chatApp = new Chat(socket);

	//Listen for server messages and update the view accordingly.
	socket.on('nameResult', function(result) {
		var message;

		if(result.success) {
			message = 'You are now known as ' + result.name + '.';
		} else{
			message = result.message;
		}
		$('#messages').append(divSystemContentElement(message));
	});

	socket.on('joinResult', function(result) {
		$('#room').text(result.room);
		$('#messages').append(divSystemContentElement('Room changed.'));
	});

	socket.on('message', function(message) {
		var newElement = $('<div></div>').text(message.text);
		$('#messages').append(newElement);
	});

	socket.on('rooms', function(rooms) {
		$('#room-list').empty();

		for (var room in rooms) {
			room = room.substring(1, room.length);
			if(room !== ''){
				$('#room-list').append(divEscapedContentElement(room));
			}
		}

		$('#room-list div').click(function() {
			chatApp.processCommand('/join ' + $(this).text());
			$('#send-message').focus();
		});
	});

	chatApp.initRoomPuller();

	$('#send-message').focus();

	$('#send-form').submit(function() {
		processUserInput(chatApp, socket);
		return false;
	});
});


angular.module('chatRooms.controllers')
	.controller('chatController', ['$scope', '$http', function($scope, $http) {}]);
 