namespace Jona.Ejemplo.Botones;

/// <summary>Contrato de UI de una unidad solo visual: no tiene contrato de servicio.</summary>
public interface InterBoton
{
    public interface Eventos
    {
        void OnClick();
    }

    public interface DEFAULTS
    {
        const string Variante = "principal";
    }
}

/// <summary>Vista: render puro.</summary>
internal sealed class BotonView(string texto, string variante, InterBoton.Eventos eventos)
{
    public void Click() => eventos.OnClick();

    public override string ToString() => $"<button data-variante=\"{variante}\">{texto}</button>";
}

/// <summary>Entrada: aplica los DEFAULTS y pinta la vista. Sin servicios, la unidad no necesita Implementación.</summary>
public static class Boton
{
    public static object Crear(string texto, InterBoton.Eventos eventos) =>
        new BotonView(texto, InterBoton.DEFAULTS.Variante, eventos);
}
