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
                .SendAsync("ReceiveMessage", userConnection.UserName, message);
            }
        }

        public override Task OnDisconnectedAsync(Exception? exception)
        {
            if (_connections.TryGetValue(Context.ConnectionId, out UserConnection? userConnection))
            {
                Clients.Group(userConnection.Room)
                .SendAsync("ReceiveMessage", _botUser, $"{userConnection.UserName} saiu.");

                SendConnectedUsers(userConnection.Room);
            }
            return base.OnDisconnectedAsync(exception);
        }

        public async Task JoinInRoom(UserConnection userConnection)
        {

            await Groups.AddToGroupAsync(Context.ConnectionId, userConnection.Room);

            _connections[Context.ConnectionId] = userConnection;

            await Clients.Group(userConnection.Room).SendAsync("ReceiveMessage", _botUser, $"{userConnection.UserName} entrou na sala {userConnection.Room}.");

            await SendConnectedUsers(userConnection.Room);
        }

        public Task SendConnectedUsers(string room)
        {
            var users = _connections.Values.Where(c => c.Room == room).Select(c => c.UserName);
            return Clients.Group(room).SendAsync("UsersInRoom", users);
        }
    }
}
