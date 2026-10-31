// Fixture generado: violaciones de una sola regla (ver Casos.cs).
#pragma warning disable CS9113 // parámetro sin leer: el fixture solo necesita la dependencia
namespace Jona.Gobierno.Fixtures.N2ContratoClase.Servicios
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

namespace Jona.Gobierno.Fixtures.N2ContratoClase.Login
{
    using Jona.Gobierno.Fixtures.N2ContratoClase.Servicios;

    public abstract class InterUiLogin
    {
        public abstract void Mostrar(string texto);

        public bool EsCorreoValido(string correo) => correo.Contains('@');

        public interface DEFAULTS
        {
            const string Titulo = "Iniciar sesión";
        }
    }

    public class UiLoginView : InterUiLogin
    {
        public string Texto = DEFAULTS.Titulo;

        public override void Mostrar(string texto) => Texto = texto;
    }

    public class UiLoginImpl(InterAuthService servicio, InterUiLogin vista)
    {
        public void Enviar(string correo) => vista.Mostrar(servicio.Login(correo));
    }

    public static class UiLogin
    {
        public static object Crear(InterAuthService servicio)
        {
            var vista = new UiLoginView();
            new UiLoginImpl(servicio, vista).Enviar("");
            return vista;
        }
    }
}
