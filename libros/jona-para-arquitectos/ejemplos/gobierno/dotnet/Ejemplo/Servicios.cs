using System.Net.Http.Json;

namespace Jona.Ejemplo.Servicios;

/// <summary>Tipo de dominio que devuelve el inicio de sesión.</summary>
public sealed record Sesion(string Token, string Nombre);

/// <summary>Única falla del contrato de servicio.</summary>
public sealed class AuthException(string mensaje) : Exception(mensaje);

/// <summary>Contrato de servicio (puerto): la unidad depende de esto, nunca de un adaptador.</summary>
public interface InterAuthService
{
    Task<Sesion> LoginAsync(string correo, string clave);
}

/// <summary>Adaptador HTTP: el único lugar del ejemplo que habla con la red.</summary>
public sealed class AuthServiceHttp(HttpClient cliente) : InterAuthService
{
    public async Task<Sesion> LoginAsync(string correo, string clave)
    {
        using var respuesta = await cliente.PostAsJsonAsync("/auth/login", new { usuario = correo, clave });
        if (!respuesta.IsSuccessStatusCode) throw new AuthException($"El servidor respondió {(int)respuesta.StatusCode}.");
        return await respuesta.Content.ReadFromJsonAsync<Sesion>() ?? throw new AuthException("Respuesta vacía.");
    }
}

/// <summary>Adaptador falso en memoria: el mismo contrato que el HTTP, sin red.</summary>
public sealed class AuthServiceFake : InterAuthService
{
    public Task<Sesion> LoginAsync(string correo, string clave) =>
        correo == "ana@ejemplo.com" && clave == "secreta123"
            ? Task.FromResult(new Sesion("falso", "Ana Torres"))
            : Task.FromException<Sesion>(new AuthException("Correo o contraseña incorrectos."));
}
