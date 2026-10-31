using Jona.Ejemplo.Servicios;

namespace Jona.Ejemplo.Login;

/// <summary>Contrato de UI: solo firmas, eventos y DEFAULTS constantes (N2).</summary>
public interface InterUiLogin
{
    void MostrarError(string mensaje);

    void SetEnviando(bool enviando);

    /// <summary>Eventos: la vista avisa con valores de negocio.</summary>
    public interface Eventos
    {
        void OnEnviar(string correo, string clave);
    }

    /// <summary>Solo valores de presentación, constantes de compilación.</summary>
    public interface DEFAULTS
    {
        const string Titulo = "Iniciar sesión";
        const string EtiquetaEnviar = "Ingresar";
    }
}

/// <summary>Vista: solo pinta (aquí, en texto) y avisa por el contrato. Interna a la unidad.</summary>
internal sealed class UiLoginView(InterUiLogin.Eventos eventos) : InterUiLogin
{
    private string error = "";
    private bool enviando;

    public void MostrarError(string mensaje) => error = mensaje;

    public void SetEnviando(bool enviando) => this.enviando = enviando;

    public void Enviar(string correo, string clave) => eventos.OnEnviar(correo, clave);

    public string Pintar() =>
        $"[{InterUiLogin.DEFAULTS.Titulo}] {error} <{(enviando ? "..." : InterUiLogin.DEFAULTS.EtiquetaEnviar)}>";
}

/// <summary>Implementación: comportamiento y efectos. Recibe el servicio tipado por su contrato (N1).</summary>
internal sealed class UiLoginImpl(InterAuthService servicio, Action<Sesion> alAutenticar) : InterUiLogin.Eventos
{
    public InterUiLogin? Vista { get; set; }

    public async void OnEnviar(string correo, string clave)
    {
        if (correo.Length == 0 || clave.Length == 0)
        {
            Vista?.MostrarError("Ingrese su correo y su contraseña.");
            return;
        }
        Vista?.SetEnviando(true);
        try
        {
            alAutenticar(await servicio.LoginAsync(correo, clave));
        }
        catch (AuthException e)
        {
            Vista?.MostrarError(e.Message);
        }
        finally
        {
            Vista?.SetEnviando(false);
        }
    }
}

/// <summary>Entrada: lo único público de la unidad junto con su contrato (N4).</summary>
public static class UiLogin
{
    public static InterUiLogin Crear(InterAuthService servicio, Action<Sesion> alAutenticar)
    {
        var impl = new UiLoginImpl(servicio, alAutenticar);
        var vista = new UiLoginView(impl);
        impl.Vista = vista;
        return vista;
    }
}
