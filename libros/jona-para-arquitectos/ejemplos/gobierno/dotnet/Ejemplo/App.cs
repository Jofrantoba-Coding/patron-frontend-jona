using Jona.Ejemplo.Botones;
using Jona.Ejemplo.Servicios;
using Jona.Ejemplo.Login;

namespace Jona.Ejemplo;

/// <summary>Raíz de composición: el único lugar que elige un adaptador. Solo conoce las entradas (N4).</summary>
public static class App
{
    public static InterUiLogin Iniciar(bool falso, Action<object> mostrar)
    {
        InterAuthService servicio = falso
            ? new AuthServiceFake()
            : new AuthServiceHttp(new HttpClient { BaseAddress = new Uri("http://127.0.0.1:4010") });
        return UiLogin.Crear(servicio, sesion => mostrar(Boton.Crear($"Salir ({sesion.Nombre})", new Salir())));
    }

    private sealed class Salir : InterBoton.Eventos
    {
        public void OnClick() { }
    }
}
