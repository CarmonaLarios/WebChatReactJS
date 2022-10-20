using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;

namespace WebChat.Hubs
{
    public class ChatHub : Hub
    {
        private readonly string _botUser;
        private readonly IDictionary<string, UserConnection> _connections;

        public ChatHub(IDictionary<string, UserConnection> connections)
        {
            _botUser = "ChatBot";
            _connections = connections;
        }

        public async Task SendMessage(string message)
        {
            if (_connections.TryGetValue(Context.ConnectionId, out UserConnection? userConnection))
            {
                await Clients.Group(userConnection.Room)
                .SendAsync("ReceiveMessage", userConnection.UserName, message, userConnection.UserId);
            }
        }

        public override Task OnDisconnectedAsync(Exception? exception)
        {
            if (_connections.TryGetValue(Context.ConnectionId, out UserConnection? userConnection))
            {
                LeaveRoom(userConnection);

                Clients.Group(userConnection.Room)
                .SendAsync("ReceiveMessage", _botUser, $"{userConnection.UserName} saiu.");

                SendConnectedUsers(userConnection);
            }
            return base.OnDisconnectedAsync(exception);
        }

        public async Task JoinInRoom(UserConnection userConnection)
        {

            await Groups.AddToGroupAsync(Context.ConnectionId, userConnection.Room);

            _connections[Context.ConnectionId] = userConnection;

            await Clients.Group(userConnection.Room).SendAsync("ReceiveMessage", _botUser, $"{userConnection.UserName} entrou na sala {userConnection.Room}.", userConnection.UserId);

            await SendConnectedUsers(userConnection);
        }


        public Task SendConnectedUsers(UserConnection userConnection)
        {
            var users = _connections.Values.Where(c => c.Room == userConnection.Room).Select(c => c.UserName);
            
            return Clients.Group(userConnection.Room).SendAsync("UsersInRoom", users);
        }

        public Task LeaveRoom(UserConnection userConnection)
        {
            //_connections.Values.Remove(userConnection);

            return Groups.RemoveFromGroupAsync(Context.ConnectionId, userConnection.Room);
        }
    }
}
