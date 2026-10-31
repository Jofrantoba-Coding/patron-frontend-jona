package jona.gobierno.fixtures.n2contratoclase.uilogin;

public abstract class InterUiLogin {
    public abstract void mostrar(String texto);

    public boolean esCorreoValido(String correo) { return correo.contains("@"); }

    public interface DEFAULTS {
        String TITULO = "Iniciar sesión";
    }
}
