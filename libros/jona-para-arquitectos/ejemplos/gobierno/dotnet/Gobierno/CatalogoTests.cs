using System.Text.Json;
using Xunit;

namespace Jona.Gobierno;

/// <summary>Gobierno: un catálogo (../reglas.json), una implementación por regla en cada lenguaje.</summary>
public class CatalogoTests
{
    private static string[] IdsDelCatalogo()
    {
        // Las pruebas corren en bin/…; se sube hasta la carpeta del proyecto.
        var carpeta = new DirectoryInfo(AppContext.BaseDirectory);
        while (!File.Exists(Path.Combine(carpeta.FullName, "JonaGobierno.csproj"))) carpeta = carpeta.Parent!;
        using var catalogo = JsonDocument.Parse(File.ReadAllText(Path.Combine(carpeta.FullName, "..", "reglas.json")));
        return catalogo.RootElement.GetProperty("reglas").EnumerateArray().Select(r => r.GetProperty("id").GetString()!).Order().ToArray();
    }

    [Fact]
    public void CadaReglaDelCatalogoEstaImplementadaYNoHayReglasFueraDeEl()
    {
        var implementadas = ReglasJona.Para(ReglasJonaTests.Arquitectura, "Jona.Ejemplo").Keys.Order().ToArray();

        Assert.Equal(IdsDelCatalogo(), implementadas);
    }

    [Fact]
    public void CadaReglaDelCatalogoTieneUnFixtureQueLaHaceFallar()
    {
        var conFixture = ReglasJonaTests.Casos.Select(fila => (string)fila[1]).Distinct().Order().ToArray();

        Assert.Equal(IdsDelCatalogo(), conFixture);
    }
}
