using ArchUnitNET.Domain;
using ArchUnitNET.Fluent;
using ArchUnitNET.Loader;
using Xunit;

namespace Jona.Gobierno;

public class ReglasJonaTests
{
    /// <summary>El ensamblado completo: el ejemplo (Jona.Ejemplo) y los fixtures (Jona.Gobierno.Fixtures.*).</summary>
    internal static readonly Architecture Arquitectura = new ArchLoader().LoadAssemblies(typeof(ReglasJona).Assembly).Build();

    /// <summary>Cada espacio de nombres de Fixtures/ contiene violaciones de una sola regla: [caso, regla, tipo señalado].</summary>
    public static readonly TheoryData<string, string, string> Casos = new()
    {
        { "N1SinContrato", "JONA-N1", "PerfilImpl" },
        { "N1ImplAdaptador", "JONA-N1", "UiLoginImpl" },
        { "N2MetodoConCuerpo", "JONA-N2", "InterUiLogin" },
        { "N2ContratoClase", "JONA-N2", "InterUiLogin" },
        { "N2DefaultsCalculado", "JONA-N2", "DEFAULTS" },
        { "N3VistaRed", "JONA-N3", "UiLoginView" },
        { "N3VistaAdaptador", "JONA-N3", "UiLoginView" },
        { "N3EntradaTarea", "JONA-N3", "UiLogin" },
        { "N3ContratoAdaptador", "JONA-N3", "InterUiLogin" },
        { "N4ImportaImpl", "JONA-N4", "App" },
        { "N4ImportaVista", "JONA-N4", "App" },
        // Forma de Plantilla: la Implementación hereda de la base y es la entrada; la base es interna.
        { "N4BaseDePlantilla", "JONA-N4", "App" },
    };

    private static IReadOnlyDictionary<string, IArchRule> Reglas(string espacio) => ReglasJona.Para(Arquitectura, espacio);

    private static string[] ReglasQueFallan(string espacio) =>
        Reglas(espacio).Where(r => !r.Value.HasNoViolations(Arquitectura)).Select(r => r.Key).Order().ToArray();

    [Theory]
    [MemberData(nameof(Casos))]
    public void CadaReglaDetectaLoQueDiceDetectar(string caso, string regla, string tipo)
    {
        var espacio = $"Jona.Gobierno.Fixtures.{caso}";

        Assert.Equal([regla], ReglasQueFallan(espacio));
        var fallas = Reglas(espacio)[regla].Evaluate(Arquitectura).Where(r => !r.Passed).Select(r => r.Description).ToList();
        Assert.Contains(fallas, f => f.Contains($".{tipo} ") || f.Contains($".{tipo}+") || f.Contains($"+{tipo} "));
    }

    [Fact]
    public void EnLaFormaDePlantillaLaImplementacionEsLaEntrada()
    {
        Assert.Empty(ReglasQueFallan("Jona.Gobierno.Fixtures.PlantillaEntrada"));
    }

    [Fact]
    public void ElEjemploCumpleLaNorma()
    {
        Assert.Contains(Arquitectura.Types, t => t.FullName == "Jona.Ejemplo.Login.UiLogin");
        Assert.Empty(ReglasQueFallan("Jona.Ejemplo"));
    }
}
