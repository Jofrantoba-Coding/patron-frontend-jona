using System.Net;
using System.Text;
using JonaLogin.Services;
using Xunit;

namespace JonaLogin.Tests;

/// <summary>
/// Un 200 cuyo cuerpo no cumple el contrato de API también es una ApiException (INVALID_RESPONSE),
/// nunca una JsonException ni un LoginResult con campos nulos. Un HttpMessageHandler falso responde lo que la prueba indica.
/// </summary>
public sealed class AuthServiceHttpRespuestaInvalidaTests
{
    public static TheoryData<string, string> CuerposInvalidos => new()
    {
        { "un cuerpo que no es JSON", "esto no es JSON" },
        { "un cuerpo vacío", "" },
        { "un cuerpo null", "null" },
        { "un objeto vacío", "{}" },
        { "un cuerpo sin token", """{"user":{"id":1,"usuario":"ana@ejemplo.com","nombre":"Ana Torres"}}""" },
        { "un token vacío", """{"token":"","user":{"id":1,"usuario":"ana@ejemplo.com","nombre":"Ana Torres"}}""" },
        { "un usuario incompleto", """{"token":"t-1","user":{"id":"1","usuario":"ana@ejemplo.com"}}""" },
    };

    [Theory]
    [MemberData(nameof(CuerposInvalidos))]
    public async Task RechazaUnCuerpoQueNoCumpleElContrato(string caso, string body)
    {
        Assert.NotEmpty(caso);
        var handler = new RespuestaFija(body);
        var service = new AuthServiceHttp("http://backend.invalid", client: new HttpClient(handler));

        var error = await Assert.ThrowsAsync<ApiException>(() => service.LoginAsync("ana@ejemplo.com", "secreta123"));

        Assert.Equal(200, error.Status);
        Assert.Equal("INVALID_RESPONSE", error.Code);
        Assert.Equal("La respuesta del servidor no es válida.", error.Message);
        Assert.Empty(error.Details);
        Assert.Equal(handler.CorrelationId, error.TraceId);
    }

    /// <summary>Responde siempre 200 con el cuerpo indicado y recuerda el X-Correlation-Id recibido.</summary>
    private sealed class RespuestaFija(string body) : HttpMessageHandler
    {
        public string? CorrelationId { get; private set; }

        protected override Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, CancellationToken cancellationToken)
        {
            CorrelationId = request.Headers.GetValues("X-Correlation-Id").Single();
            return Task.FromResult(new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StringContent(body, Encoding.UTF8, "application/json"),
            });
        }
    }
}
