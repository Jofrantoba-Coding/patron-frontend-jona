// Fixture generado: violaciones de una sola regla (ver Casos.cs).
#pragma warning disable CS9113 // parámetro sin leer: el fixture solo necesita la dependencia
namespace Jona.Gobierno.Fixtures.N4BaseDePlantilla.Servicios
{
    public interface InterAuthService
    {
        string Login(string correo);
    }

    public class AuthServiceHttp : InterAuthService
    {
        public string Login(string correo) => new Uri("http://127.0.0.1:4010/" + correo).ToString();
    }
}

namespace Jona.Gobierno.Fixtures.N4BaseDePlantilla.Login
{
    using Jona.Gobierno.Fixtures.N4BaseDePlantilla.Servicios;

    public interface InterUiLogin
    {
        void Login(string correo);
    }

    /// <summary>Plantilla: comportamiento por defecto, sin integración.</summary>
    public class UiLogin : InterUiLogin
    {
        public virtual void Login(string correo) { }
    }

    /// <summary>Implementación y entrada: reemplaza lo que necesita integración.</summary>
    public class UiLoginImpl : UiLogin
    {
        public override void Login(string correo) => Console.WriteLine(correo);
    }
}

namespace Jona.Gobierno.Fixtures.N4BaseDePlantilla
{
    public static class App
    {
        public static object Iniciar() => new Login.UiLogin();
    }
}
