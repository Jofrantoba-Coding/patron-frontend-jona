// Fixture generado: violaciones de una sola regla (ver Casos.cs).
#pragma warning disable CS9113 // parámetro sin leer: el fixture solo necesita la dependencia
namespace Jona.Gobierno.Fixtures.N1ImplAdaptador.Servicios
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

namespace Jona.Gobierno.Fixtures.N1ImplAdaptador.Login
{
    using Jona.Gobierno.Fixtures.N1ImplAdaptador.Servicios;

    public interface InterUiLogin
    {
        void Mostrar(string texto);

        public interface DEFAULTS
        {
            const string Titulo = "Iniciar sesión";
        }
    }

    public class UiLoginView : InterUiLogin
    {
        public string Texto = InterUiLogin.DEFAULTS.Titulo;

        public void Mostrar(string texto) => Texto = texto;
    }

    public class UiLoginImpl(InterUiLogin vista)
    {
        private readonly AuthServiceHttp servicio = new();

        public void Enviar(string correo) => vista.Mostrar(servicio.Login(correo));
    }

    public static class UiLogin
    {
        public static object Crear()
        {
            var vista = new UiLoginView();
            new UiLoginImpl(vista).Enviar("");
            return vista;
        }
    }
}
