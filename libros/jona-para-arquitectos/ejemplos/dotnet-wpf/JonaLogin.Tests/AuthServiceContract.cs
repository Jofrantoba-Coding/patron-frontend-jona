using JonaLogin.Services;
using Xunit;

namespace JonaLogin.Tests;

/// <summary>
/// Casos que toda implementación de InterAuthService debe cumplir (paridad de doble fuente).
/// Son los mismos casos que web-react/src/services/authServiceContract.ts.
/// </summary>
public abstract class AuthServiceContract
{
    /// <summary>Construye la implementación bajo prueba.</summary>
    protected abstract InterAuthService Service();

    [Fact]
    public async Task DevuelveElTokenYElUsuarioConCredencialesValidas()
    {
        var result = await Service().LoginAsync("ana@ejemplo.com", "secreta123");

        Assert.Equal(new LoginUser(1, "ana@ejemplo.com", "Ana Torres"), result.User);
        Assert.IsType<string>(result.Token);
        Assert.True(result.Token.Length > 0, "el token no puede estar vacío");
    }

    [Theory]
    [InlineData("ana@ejemplo.com", "otra", 401, "INVALID_CREDENTIALS")]
    [InlineData("nadie@ejemplo.com", "secreta123", 401, "INVALID_CREDENTIALS")]
    [InlineData("bloqueado@ejemplo.com", "secreta123", 403, "USER_DISABLED")]
    public async Task RechazaConApiExceptionYUnTraceId(string email, string password, int status, string code)
    {
        var error = await Assert.ThrowsAsync<ApiException>(() => Service().LoginAsync(email, password));

        Assert.Equal(status, error.Status);
        Assert.Equal(code, error.Code);
        Assert.Empty(error.Details);
        Assert.NotEmpty(error.Message);
        Assert.NotEmpty(error.TraceId);
    }

    [Fact]
    public async Task RechazaCamposVaciosCon422YUnDetallePorCampo()
    {
        var error = await Assert.ThrowsAsync<ApiException>(() => Service().LoginAsync("", ""));

        Assert.Equal(422, error.Status);
        Assert.Equal("VALIDATION_ERROR", error.Code);
        Assert.Equal(["usuario", "clave"], error.Details.Select(d => d.Field));
    }
}

public sealed class AuthServiceFakeTests : AuthServiceContract
{
    protected override InterAuthService Service() => new AuthServiceFake();
}
