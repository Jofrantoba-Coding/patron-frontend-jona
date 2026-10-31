// Fixture generado: violaciones de una sola regla (ver Casos.cs).
#pragma warning disable CS9113 // parámetro sin leer: el fixture solo necesita la dependencia
namespace Jona.Gobierno.Fixtures.N1SinContrato.Servicios
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

namespace Jona.Gobierno.Fixtures.N1SinContrato.Login
{
    using Jona.Gobierno.Fixtures.N1SinContrato.Servicios;

    public class PerfilImpl
    {
        public string Nombre() => "Ana";
    }

    public class PerfilView
    {
        public string Pintar(string nombre) => "<p>" + nombre + "</p>";
    }

    public static class Perfil
    {
        public static string Crear() => new PerfilView().Pintar(new PerfilImpl().Nombre());
    }
}
