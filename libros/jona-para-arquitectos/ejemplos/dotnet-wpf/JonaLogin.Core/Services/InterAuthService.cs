namespace JonaLogin.Services;

/// <summary>Contrato de servicio (puerto). Toda falla se informa con <see cref="ApiException"/>.</summary>
public interface InterAuthService
{
    /// <summary>Devuelve el token y el usuario.</summary>
    Task<LoginResult> LoginAsync(string email, string password);
}
