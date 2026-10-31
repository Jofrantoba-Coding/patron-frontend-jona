namespace JonaLogin.Services;

/// <summary>Servicio falso en memoria (punto de sustitución 2), con los datos de prueba del contrato de API.</summary>
public sealed class AuthServiceFake : InterAuthService
{
    private sealed record User(int Id, string Clave, string Nombre, bool Bloqueado);

    private static readonly Dictionary<string, User> Users = new()
    {
        ["ana@ejemplo.com"] = new User(1, "secreta123", "Ana Torres", false),
        ["bloqueado@ejemplo.com"] = new User(2, "secreta123", "Usuario Bloqueado", true),
    };

    private int _requests;

    public Task<LoginResult> LoginAsync(string email, string password)
    {
        var traceId = $"fake-{Interlocked.Increment(ref _requests)}";
        var details = new List<ApiErrorDetail>();
        if (email == "") details.Add(new ApiErrorDetail("usuario", "Es obligatorio."));
        if (password == "") details.Add(new ApiErrorDetail("clave", "Es obligatorio."));
        if (details.Count > 0) return Fail(422, "VALIDATION_ERROR", "La petición no es válida.", details, traceId);

        if (!Users.TryGetValue(email, out var user) || user.Clave != password)
            return Fail(401, "INVALID_CREDENTIALS", "Usuario o clave incorrectos.", [], traceId);
        if (user.Bloqueado)
            return Fail(403, "USER_DISABLED", "El usuario está bloqueado.", [], traceId);

        return Task.FromResult(new LoginResult($"fake-token-{user.Id}-{_requests}", new LoginUser(user.Id, email, user.Nombre)));
    }

    private static Task<LoginResult> Fail(int status, string code, string message, List<ApiErrorDetail> details, string traceId) =>
        Task.FromException<LoginResult>(new ApiException(status, code, message, details, traceId));
}
