using System.Net.Http.Json;
using System.Text.Json;

namespace JonaLogin.Services;

/// <summary>Adaptador: implementa el contrato de servicio contra el contrato de API (POST /auth/login).</summary>
public sealed class AuthServiceHttp : InterAuthService
{
    private static readonly HttpClient SharedClient = new();
    private static readonly JsonSerializerOptions Json = new(JsonSerializerDefaults.Web);

    // El cuerpo 200 se lee sin tolerancia: todo campo del constructor es obligatorio y ninguno puede ser null.
    private static readonly JsonSerializerOptions StrictJson = new(JsonSerializerDefaults.Web)
    {
        RespectRequiredConstructorParameters = true,
        RespectNullableAnnotations = true,
    };

    private readonly HttpClient _client;
    private readonly string _baseUrl;
    private readonly IReadOnlyDictionary<string, string> _headers;

    /// <param name="baseUrl">La única diferencia entre el servidor mock y el backend real.</param>
    /// <param name="headers">Cabeceras adicionales (por ejemplo, X-Mock-Scenario en pruebas).</param>
    /// <param name="client">Cliente HTTP; las pruebas pasan uno con un HttpMessageHandler falso.</param>
    public AuthServiceHttp(string baseUrl, IReadOnlyDictionary<string, string>? headers = null, HttpClient? client = null)
    {
        _client = client ?? SharedClient;
        _baseUrl = baseUrl;
        _headers = headers ?? new Dictionary<string, string>();
    }

    private sealed record ErrorBody(string? Code, string? Message, List<ApiErrorDetail>? Details, string? TraceId);

    public async Task<LoginResult> LoginAsync(string email, string password)
    {
        var correlationId = Guid.NewGuid().ToString();
        // El contrato de API nombra los campos usuario y clave; el adaptador traduce.
        using var request = new HttpRequestMessage(HttpMethod.Post, $"{_baseUrl}/auth/login")
        {
            Content = JsonContent.Create(new { usuario = email, clave = password }),
        };
        request.Headers.Add("X-Correlation-Id", correlationId);
        foreach (var (name, value) in _headers) request.Headers.Add(name, value);

        HttpResponseMessage response;
        try
        {
            response = await _client.SendAsync(request);
        }
        catch (Exception ex) when (ex is HttpRequestException or TaskCanceledException)
        {
            throw new ApiException(0, "NETWORK_ERROR", "No se pudo conectar con el servidor.", [], correlationId);
        }

        using (response)
        {
            if (response.IsSuccessStatusCode)
                return await ReadLoginResultAsync(response, correlationId);

            var status = (int)response.StatusCode;
            ErrorBody? body = null;
            try { body = await response.Content.ReadFromJsonAsync<ErrorBody>(Json); }
            catch (JsonException) { }
            if (body?.Code is null || body.Message is null)
                throw new ApiException(status, "HTTP_ERROR", $"La petición falló con estado {status}.", [], correlationId);
            throw new ApiException(status, body.Code, body.Message, body.Details ?? [], body.TraceId ?? correlationId);
        }
    }

    /// <summary>Un 2xx cuyo cuerpo no cumple el contrato de API también es una ApiException, nunca una JsonException.</summary>
    private static async Task<LoginResult> ReadLoginResultAsync(HttpResponseMessage response, string correlationId)
    {
        LoginResult? result = null;
        try { result = await response.Content.ReadFromJsonAsync<LoginResult>(StrictJson); }
        catch (JsonException) { }
        if (result is { Token.Length: > 0 }) return result;
        throw new ApiException((int)response.StatusCode, "INVALID_RESPONSE", "La respuesta del servidor no es válida.", [],
            correlationId);
    }
}
