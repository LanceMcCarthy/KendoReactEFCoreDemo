using Microsoft.EntityFrameworkCore;
using ReactWithRestApi.Server.Models;

var builder = WebApplication.CreateBuilder(args);

// CORS is set to allow any origin to access the web API.
// If your front end is on a domain, you will need to change this to the domain of your front end so that only requests form your domain can use the REST API
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: "_myAllowAllOrigins", policy  => { policy.AllowAnyHeader().AllowAnyMethod().AllowAnyOrigin(); });
});


// NOTE: this uses the connection string from appsettings.json
builder.Services.AddDbContext<LanceDbContext>(options => 
{
    options.UseSqlServer(builder.Configuration.GetConnectionString("LanceSqlServer"));
});


// This surfaces the API controller
builder.Services.AddControllers();

// These gives oyu a nice swagger UI when you want to see the REST endpoints at /swagger/index.html
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.MapFallbackToFile("/index.html");

app.UseCors("_myAllowAllOrigins");

app.Run();
