using System.Text.Json;

public class GlobalMiddleware
{
    private readonly RequestDelegate _next;

    public GlobalMiddleware(RequestDelegate next) => _next = next;

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            context.Response.StatusCode = 500;
            context.Response.ContentType = "application/json";
            await context.Response.WriteAsync(JsonSerializer.Serialize(new
            {
                error = "Something went wrong",
                message = ex.Message
            }));
        }
    }
}