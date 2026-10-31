namespace JonaLogin.UiLogin;

/// <summary>Reglas puras de la pantalla: se prueban sin WPF y sin servicios.</summary>
public static class LoginRules
{
    public const string MissingDataError = "Ingrese su correo y su contraseña.";

    public static bool IsValidData(string email, string password) => email != "" && password != "";

    /// <summary>Traduce el código del error del servicio a un mensaje; la vista nunca ve una excepción.</summary>
    public static string MessageFor(string code) => code switch
    {
        "INVALID_CREDENTIALS" => "Correo o contraseña incorrectos.",
        "USER_DISABLED" => "Su usuario está bloqueado. Contacte al administrador.",
        _ => "No se pudo iniciar sesión. Intente de nuevo.",
    };
}
