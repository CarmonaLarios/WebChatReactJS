using WebChat.Hubs;
using WebChat;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddSignalR()
    .AddAzureSignalR("Endpoint=https://websignalwithoutserverless.service.signalr.net;AccessKey=gAOp/J1gznFfWZKoAsJWRIe0ST2XlMVoDKzjZuSHBBo=;Version=1.0;");

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(builder =>
        builder.WithOrigins("http://localhost:3000")
        .AllowAnyHeader()
        .AllowAnyMethod()
        .AllowCredentials()
    );
});

builder.Services.AddSingleton<IDictionary<string, UserConnection>>(opts => new Dictionary<string, UserConnection>());

var app = builder.Build();

app.UseCors();
app.UseRouting();

app.UseEndpoints(endpoints =>
{
    endpoints.MapHub<ChatHub>("/chat");
});

app.MapGet("/", () => "Hello World!");

app.Run();

