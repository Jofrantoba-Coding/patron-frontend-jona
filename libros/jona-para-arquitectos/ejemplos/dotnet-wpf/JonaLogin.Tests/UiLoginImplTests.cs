using System.ComponentModel;
using JonaLogin.Services;
using JonaLogin.UiLogin;
using Xunit;

namespace JonaLogin.Tests;

/// <summary>La Implementación (modelo de vista) se prueba sin WPF: solo contratos y un servicio falso.</summary>
public sealed class UiLoginImplTests
{
    private static readonly LoginResult Ana = new("t-1", new LoginUser(1, "ana@ejemplo.com", "Ana Torres"));

    /// <summary>Servicio cuya respuesta controla la prueba.</summary>
    private sealed class DeferredService : InterAuthService
    {
        public List<TaskCompletionSource<LoginResult>> Pending { get; } = [];

        public Task<LoginResult> LoginAsync(string email, string password)
        {
            var pending = new TaskCompletionSource<LoginResult>(TaskCreationOptions.RunContinuationsAsynchronously);
            Pending.Add(pending);
            return pending.Task;
        }
    }

    private sealed class FailingService(ApiException error) : InterAuthService
    {
        public Task<LoginResult> LoginAsync(string email, string password) => Task.FromException<LoginResult>(error);
    }

    private static (UiLoginImpl Impl, List<LoginResult> Sessions) Create(InterAuthService service)
    {
        var sessions = new List<LoginResult>();
        return (new UiLoginImpl(service, sessions.Add), sessions);
    }

    private static Task Submit(UiLoginImpl impl) => ((AsyncCommand)impl.SubmitCommand).ExecuteAsync();

    [Fact]
    public async Task IniciaSesionConCredencialesValidas()
    {
        var (impl, sessions) = Create(new AuthServiceFake());
        impl.Email = "ana@ejemplo.com";
        impl.Password = "secreta123";

        await Submit(impl);

        Assert.Equal("Ana Torres", Assert.Single(sessions).User.Nombre);
        Assert.Null(impl.Error);
    }

    [Fact]
    public async Task PideLosDatosFaltantesSinLlamarAlServicio()
    {
        var service = new DeferredService();
        var (impl, _) = Create(service);
        impl.Email = "ana@ejemplo.com";

        await Submit(impl);

        Assert.Equal("Ingrese su correo y su contraseña.", impl.Error);
        Assert.Empty(service.Pending);
    }

    [Theory]
    [InlineData("ana@ejemplo.com", "otra", "Correo o contraseña incorrectos.")]
    [InlineData("bloqueado@ejemplo.com", "secreta123", "Su usuario está bloqueado. Contacte al administrador.")]
    public async Task InformaLosRechazosDelServicio(string email, string password, string message)
    {
        var (impl, sessions) = Create(new AuthServiceFake());
        impl.Email = email;
        impl.Password = password;

        await Submit(impl);

        Assert.Equal(message, impl.Error);
        Assert.Empty(sessions);
    }

    [Fact]
    public async Task InformaUnErrorDelServidor()
    {
        var (impl, _) = Create(new FailingService(new ApiException(500, "INTERNAL_ERROR", "x", [], "t")));
        impl.Email = "ana@ejemplo.com";
        impl.Password = "secreta123";

        await Submit(impl);

        Assert.Equal("No se pudo iniciar sesión. Intente de nuevo.", impl.Error);
    }

    [Fact]
    public async Task EvitaElDobleEnvioYDeshabilitaElComando()
    {
        var service = new DeferredService();
        var (impl, sessions) = Create(service);
        impl.Email = "ana@ejemplo.com";
        impl.Password = "secreta123";

        var first = Submit(impl);
        var second = Submit(impl);

        Assert.Single(service.Pending);
        Assert.True(impl.IsSubmitting);
        Assert.False(impl.SubmitCommand.CanExecute(null));
        service.Pending[0].SetResult(Ana);
        await Task.WhenAll(first, second);
        Assert.Single(sessions);
        Assert.True(impl.SubmitCommand.CanExecute(null));
    }

    [Fact]
    public async Task LimpiaElErrorAnteriorAlReintentar()
    {
        var service = new DeferredService();
        var (impl, _) = Create(service);
        impl.Email = "ana@ejemplo.com";
        impl.Password = "otra";
        var first = Submit(impl);
        service.Pending[0].SetException(new ApiException(401, "INVALID_CREDENTIALS", "x", [], "t"));
        await first;
        Assert.Equal("Correo o contraseña incorrectos.", impl.Error);

        var retry = Submit(impl);

        Assert.Null(impl.Error);
        service.Pending[1].SetResult(Ana);
        await retry;
    }

    [Fact]
    public void NotificaLosCambiosALaVista()
    {
        var (impl, _) = Create(new AuthServiceFake());
        var changed = new List<string?>();
        ((INotifyPropertyChanged)impl).PropertyChanged += (_, e) => changed.Add(e.PropertyName);

        impl.Email = "ana@ejemplo.com";
        impl.Password = "secreta123";

        Assert.Equal(["Email", "Password"], changed);
    }

    [Fact]
    public void LoginRulesTraduceElCodigoAUnMensaje()
    {
        Assert.Equal("Correo o contraseña incorrectos.", LoginRules.MessageFor("INVALID_CREDENTIALS"));
        Assert.Equal("No se pudo iniciar sesión. Intente de nuevo.", LoginRules.MessageFor("NETWORK_ERROR"));
        Assert.False(LoginRules.IsValidData("", "x"));
    }
}
