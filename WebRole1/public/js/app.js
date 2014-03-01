angular.module('chatRooms', []);
function chatController($scope, chatService) {

	var _chatService = chatService;

	function divEscapedContentElement(message) {
		return $('<div></div>').text(message);
	}

	function divSystemContentElement(message) {
		return $('<div></div>').html('<i>' + message + '</i>');
	}

	function processUserInput(chatService) {
		var message = $('#send-message').val();
		var systemMessage;

		if(message.charAt(0) == '/'){ 
			systemMessage = chatService.processCommand(message);
			if(systemMessage) {
				$('#messages').append(divSystemContentElement(systemMessage));
			}
		} else{
			chatService.sendMessage($('#room').text(), message);
			$('#messages').append(divEscapedContentElement(message));
			$('#messages').scrollTop($('#messages').prop('scrollHeight'));
		}
		$('#send-message').val('');
	}

	$(document).ready(function() {

		//Listen for server messages and update the view accordingly.
		_chatService.on('nameResult', function(result) {
			var message;

			if(result.success) {
				message = 'You are now known as ' + result.name + '.';
			} else{
				message = result.message;
			}
			$('#messages').append(divSystemContentElement(message));
		});

		_chatService.on('joinResult', function(result) {
			$('#room').text(result.room);
			$('#messages').append(divSystemContentElement('Room changed.'));
		});

		_chatService.on('message', function(message) {
			var newElement = $('<div></div>').text(message.text);
			$('#messages').append(newElement);
		});

		_chatService.on('rooms', function(rooms) {
			$('#room-list').empty();

			for (var room in rooms) {
				room = room.substring(1, room.length);
				if(room !== ''){
					$('#room-list').append(divEscapedContentElement(room));
				}
			}

			$('#room-list div').click(function() {
				_chatService.processCommand('/join ' + $(this).text());
				$('#send-message').focus();
			});
		});

		_chatService.initRoomPuller();

		$('#send-message').focus();

		$('#send-form').submit(function() {
			processUserInput(_chatService);
			return false;
		});
	});
}

angular.module('chatRooms')
	.controller('chatController', ['$scope', 'chatService', chatController]);
 
function chatServiceProvider(socketService) {	

	var Chat = function(socketService) {
		this.socket = socketService;
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
		var self = this;
		setInterval(function() {
			self.socket.emit('rooms');
		}, 1000);
	};

	Chat.prototype.on = function(eventName, handler) {
		this.socket.on(eventName, handler);
	};

	return new Chat(socketService);
}
angular.module('chatRooms')
.service('chatService', ['socketService', chatServiceProvider])
.factory('socketService', function() { //TODO: Change to service
	var socket = io.connect();
	return socket;
});