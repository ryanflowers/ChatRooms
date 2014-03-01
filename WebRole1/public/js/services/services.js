angular.module('chatRooms')
.service('chatService', ['socketService', chatServiceProvider])
.factory('socketService', function() { //TODO: Change to service
	var socket = io.connect();
	return socket;
});