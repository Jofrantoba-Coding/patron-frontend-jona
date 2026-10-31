using System.Diagnostics;
using System.Text.RegularExpressions;
using JonaLogin.Services;
using Xunit;

namespace JonaLogin.Tests;

/// <summary>
/// Arranca ../mock-server con node en un puerto libre y lo detiene al terminar.
/// Con la variable CONTRATO_API_URL, usa ese servidor en lugar del mock.
/// </summary>
public sealed partial class MockServerFixture : IAsyncLifetime
{
    private Process? _process;

    public string? BaseUrl { get; private set; }
    public bool IsMock => _process is not null;
    public string? Unavailable { get; private set; }

    public async ValueTask InitializeAsync()
    {
        var external = Environment.GetEnvironmentVariable("CONTRATO_API_URL");
        if (!string.IsNullOrWhiteSpace(external)) { BaseUrl = external; return; }

        // bin/Debug/net10.0 -> dotnet-wpf/JonaLogin.Tests -> ejemplos
        var script = Path.GetFullPath(Path.Combine(AppContext.BaseDirectory,
            "..", "..", "..", "..", "..", "mock-server", "src", "server.mjs"));
        var start = new ProcessStartInfo("node") { RedirectStandardOutput = true, UseShellExecute = false };
        start.ArgumentList.Add(script);
        start.Environment["PORT"] = "0";
        try
        {
            _process = Process.Start(start)!;
        }
        catch (System.ComponentModel.Win32Exception)
        {
            Unavailable = "node no está en el PATH: se omiten las pruebas contra el servidor mock";
            return;
        }
        while (await _process.StandardOutput.ReadLineAsync() is { } line)
        {
            var match = UrlPattern().Match(line);
            if (match.Success) { BaseUrl = match.Value; return; }
        }
        throw new InvalidOperationException("El servidor mock terminó sin imprimir su URL");
    }

    public ValueTask DisposeAsync()
    {
        if (_process is { HasExited: false }) _process.Kill();
        _process?.Dispose();
        return ValueTask.CompletedTask;
    }

    [GeneratedRegex(@"http://127\.0\.0\.1:\d+")]
    private static partial Regex UrlPattern();
}

/// <summary>La misma suite de contrato contra AuthServiceHttp y el servidor mock en ejecución.</summary>
public sealed class AuthServiceHttpTests(MockServerFixture server) : AuthServiceContract, IClassFixture<MockServerFixture>
{
    protected override InterAuthService Service()
    {
        if (server.Unavailable is not null) Assert.Skip(server.Unavailable);
        return new AuthServiceHttp(server.BaseUrl!);
    }

    [Fact]
    public async Task TraduceUn500DelServidorAApiException()
    {
        if (!server.IsMock) Assert.Skip("el escenario errorServidor solo existe en el servidor mock");
        var service = new AuthServiceHttp(server.BaseUrl!,
            new Dictionary<string, string> { ["X-Mock-Scenario"] = "errorServidor" });

        var error = await Assert.ThrowsAsync<ApiException>(() => service.LoginAsync("ana@ejemplo.com", "secreta123"));

        Assert.Equal(500, error.Status);
        Assert.Equal("INTERNAL_ERROR", error.Code);
    }

    [Fact]
    public async Task TraduceUnFalloDeRedAApiExceptionConEstado0()
    {
        var service = new AuthServiceHttp("http://127.0.0.1:1");

        var error = await Assert.ThrowsAsync<ApiException>(() => service.LoginAsync("ana@ejemplo.com", "secreta123"));

        Assert.Equal(0, error.Status);
        Assert.Equal("NETWORK_ERROR", error.Code);
    }
}
