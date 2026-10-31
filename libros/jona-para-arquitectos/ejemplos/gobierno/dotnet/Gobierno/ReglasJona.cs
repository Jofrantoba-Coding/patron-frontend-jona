using System.Reflection;
using System.Text.RegularExpressions;
using ArchUnitNET.Domain;
using ArchUnitNET.Domain.Dependencies;
using ArchUnitNET.Fluent;
using ArchUnitNET.Fluent.Conditions;
using ArchUnitNET.Fluent.Syntax.Elements.Types;
using static ArchUnitNET.Fluent.ArchRuleDefinition;

namespace Jona.Gobierno;

/// <summary>
/// La norma JONA (../reglas.json) como reglas de ArchUnitNET, limitadas a un espacio de nombres
/// (el ejemplo o un fixture). Reconoce los roles por la convención de nombres.
/// </summary>
public static class ReglasJona
{
    // -----------------------------------------------------------------------------------------
    // Convenciones: toda la configuración está aquí, a la vista.
    // -----------------------------------------------------------------------------------------

    private static readonly Regex ContratoServicio = new(@"^Inter[A-Z]\w*Service$");
    private static readonly Regex ContratoUi = new(@"^Inter[A-Z]\w*$");
    /// <summary>Efectos que solo la Implementación y los adaptadores pueden producir (N3).</summary>
    private static readonly HashSet<string> EspaciosConEfectos = ["System.Net", "System.Net.Http", "System.Net.Sockets", "System.Net.WebSockets"];
    private static readonly HashSet<string> TiposConEfectos =
    [
        "System.IO.File", "System.IO.FileStream", "System.IO.Directory", "System.IO.StreamReader", "System.IO.StreamWriter",
        "System.Threading.Thread", "System.Threading.ThreadPool", "System.Threading.Timer", "System.Timers.Timer",
    ];
    /// <summary>Task es demasiado común como tipo (todo método async lo usa): se miran solo estas llamadas.</summary>
    private static readonly HashSet<string> LlamadasConEfectos = ["Run", "Delay"];

    private enum Rol { Contrato, ContratoServicio, Adaptador, Impl, Vista, Entrada, Interno, Libre }

    /// <summary>Roles, unidades y entradas de los tipos de un espacio de nombres.</summary>
    private sealed class Modelo
    {
        private readonly ILookup<string, IType> superioresPorEspacio;

        public Modelo(Architecture arquitectura, string espacio)
        {
            superioresPorEspacio = arquitectura.Types
                .Where(t => t.FullName.StartsWith(espacio + ".") && !t.IsNested)
                .ToLookup(t => t.Namespace.FullName);
        }

        /// <summary>Un tipo anidado o generado por el compilador tiene el rol del tipo de nivel superior.</summary>
        public static string Superior(IType tipo) => tipo.FullName.Split('+', '/')[0];

        private static string Nombre(string completo) => completo[(completo.LastIndexOf('.') + 1)..];

        public static string EspacioDe(IType tipo) => Superior(tipo)[..Math.Max(0, Superior(tipo).LastIndexOf('.'))];

        private IEnumerable<IType> Propios(string espacio) => superioresPorEspacio[espacio];

        private IType? TipoSuperior(IType tipo) => Propios(EspacioDe(tipo)).FirstOrDefault(t => t.FullName == Superior(tipo));

        public Rol RolPorNombre(IType tipo)
        {
            var nombre = Nombre(Superior(tipo));
            if (ContratoServicio.IsMatch(nombre)) return Rol.ContratoServicio;
            if (ContratoUi.IsMatch(nombre)) return Rol.Contrato;
            var superior = TipoSuperior(tipo) ?? tipo;
            if (superior is Class && superior.ImplementedInterfaces.Any(i => ContratoServicio.IsMatch(i.Name))) return Rol.Adaptador;
            if (nombre.EndsWith("Impl")) return Rol.Impl;
            if (nombre.EndsWith("View")) return Rol.Vista;
            return Rol.Libre;
        }

        /// <summary>Un espacio de nombres es una unidad de UI si tiene un contrato de UI, una Implementación o una vista.</summary>
        public bool EsUnidad(string espacio) =>
            Propios(espacio).Select(RolPorNombre).Any(r => r is Rol.Contrato or Rol.Impl or Rol.Vista);

        public bool TieneContrato(string espacio) => Propios(espacio).Any(t => RolPorNombre(t) == Rol.Contrato);

        /// <summary>
        /// La entrada: el tipo con el nombre del contrato sin "Inter" (InterUiLogin: UiLogin). En la forma de
        /// Plantilla (UiLoginImpl : UiLogin), la Implementación. Sin ninguna, la Implementación.
        /// </summary>
        public HashSet<string> Entradas(string espacio)
        {
            var propios = Propios(espacio).ToList();
            var nombres = propios.Select(t => t.Name).ToHashSet();
            var publicos = propios.Where(t => RolPorNombre(t) == Rol.Contrato).Select(t => t.Name["Inter".Length..]).ToHashSet();
            var impls = propios.Where(t => RolPorNombre(t) == Rol.Impl).ToList();
            var plantilla = impls.OfType<Class>().Where(c => c.BaseClass is { } b && nombres.Contains(b.Name) && b.Namespace.FullName == espacio)
                .Select(c => c.Name).ToHashSet();
            var elegidas = plantilla.Count > 0 ? plantilla : nombres.Where(publicos.Contains).ToHashSet();
            return elegidas.Count > 0 ? elegidas : impls.Select(t => t.Name).ToHashSet();
        }

        /// <summary>El rol completo: un tipo sin rol por nombre dentro de una unidad es su entrada o es interno.</summary>
        public Rol De(IType tipo)
        {
            var porNombre = RolPorNombre(tipo);
            var espacio = EspacioDe(tipo);
            if (porNombre != Rol.Libre || !EsUnidad(espacio)) return porNombre;
            return Entradas(espacio).Contains(Nombre(Superior(tipo))) ? Rol.Entrada : Rol.Interno;
        }

        public bool EnUnidad(IType tipo) => EsUnidad(EspacioDe(tipo));

        /// <summary>Lo que otra unidad puede usar: la entrada y el contrato de UI.</summary>
        public bool EsPublico(IType tipo) =>
            Entradas(EspacioDe(tipo)).Contains(Nombre(Superior(tipo))) || RolPorNombre(tipo) == Rol.Contrato;
    }

    private static bool ProduceEfectos(ITypeDependency dependencia) =>
        EspaciosConEfectos.Contains(dependencia.Target.Namespace.FullName)
        || TiposConEfectos.Contains(dependencia.Target.FullName)
        || (dependencia is MethodCallDependency llamada && llamada.Target.FullName == "System.Threading.Tasks.Task"
            && LlamadasConEfectos.Contains(llamada.TargetMember.Name.Split('(')[0]));

    /// <summary>Un resultado por tipo: aprueba o reúne todos sus motivos.</summary>
    private static ConditionResult Resultado(IType tipo, IEnumerable<string> motivos)
    {
        var lista = motivos.ToList();
        return new ConditionResult(tipo, lista.Count == 0, $"{tipo.FullName} {string.Join("; ", lista)}");
    }

    /// <summary>Las cuatro reglas, por id del catálogo; CatalogoTests verifica que coincidan con ../reglas.json.</summary>
    public static IReadOnlyDictionary<string, IArchRule> Para(Architecture arquitectura, string espacio)
    {
        var modelo = new Modelo(arquitectura, espacio);
        // Los constructores de ArchUnitNET acumulan predicados: cada regla parte de uno nuevo.
        GivenTypesConjunction EnEspacio() => Types().That().FollowCustomPredicate(t => t.FullName.StartsWith(espacio + "."), $"están en {espacio}");

        // JONA-N1: toda unidad tiene contrato de UI; depende del contrato de servicio, no del adaptador.
        var n1 = EnEspacio().And().FollowCustomPredicate(t => !t.IsNested && modelo.De(t) is Rol.Impl or Rol.Vista, "son Implementaciones o vistas")
            .Should().FollowCustomCondition(
                t => Resultado(t, modelo.TieneContrato(Modelo.EspacioDe(t)) ? [] : ["pertenece a una unidad sin contrato de UI (Inter*)"]),
                "tener un contrato de UI en su unidad").WithoutRequiringPositiveResults()
            .And(EnEspacio().And().FollowCustomPredicate(t => modelo.EnUnidad(t) && modelo.De(t) is not (Rol.Vista or Rol.Contrato), "son de una unidad")
                .Should().FollowCustomCondition(
                    t => Resultado(t, t.Dependencies.Where(d => modelo.De(d.Target) == Rol.Adaptador)
                        .Select(d => $"depende del adaptador {d.Target.FullName}; tipe el servicio con su contrato").Distinct()),
                    "depender del contrato de servicio, no del adaptador").WithoutRequiringPositiveResults());

        // JONA-N2: un contrato es una interfaz sin código; los DEFAULTS son constantes de compilación.
        var n2 = EnEspacio().And().FollowCustomPredicate(t => modelo.De(t) is Rol.Contrato or Rol.ContratoServicio, "son contratos")
            .Should().FollowCustomCondition(t => Resultado(t, ComportamientoDe(t)), "no llevar comportamiento").WithoutRequiringPositiveResults();

        // JONA-N3: efectos solo en la Implementación y en los adaptadores.
        var n3 = EnEspacio().And().FollowCustomPredicate(t => modelo.EnUnidad(t) && modelo.De(t) is not (Rol.Impl or Rol.Adaptador), "son de una unidad")
            .Should().FollowCustomCondition(t => Resultado(t, t.Dependencies.Where(ProduceEfectos)
                .Select(d => $"produce un efecto con {d.Target.FullName}; los efectos van en la Implementación o en un adaptador").Distinct()),
                "no producir efectos").WithoutRequiringPositiveResults()
            .And(EnEspacio().And().FollowCustomPredicate(t => modelo.De(t) is Rol.Vista or Rol.Contrato, "son vistas o contratos")
                .Should().FollowCustomCondition(t => Resultado(t, t.Dependencies
                    .Where(d => modelo.De(d.Target) == Rol.Adaptador || (modelo.De(t) == Rol.Vista && modelo.De(d.Target) == Rol.ContratoServicio))
                    .Select(d => $"usa el servicio {d.Target.FullName}").Distinct()),
                    "no conocer servicios").WithoutRequiringPositiveResults());

        // JONA-N4: fuera de una unidad solo se usa su entrada (y su contrato: en C# un tipo no se reexporta).
        var n4 = EnEspacio().Should().FollowCustomCondition(t => Resultado(t, t.Dependencies
                .Select(d => d.Target)
                .Where(destino => Modelo.EspacioDe(destino) != Modelo.EspacioDe(t) && modelo.EsUnidad(Modelo.EspacioDe(destino)))
                .Where(destino => !modelo.EsPublico(destino))
                .Select(destino => $"usa {destino.FullName}, interno de la unidad {Modelo.EspacioDe(destino)}; "
                    + $"use su entrada {string.Join(" o ", modelo.Entradas(Modelo.EspacioDe(destino)).Order())}")
                .Distinct()),
            "usar de otras unidades solo su entrada").WithoutRequiringPositiveResults();

        return new Dictionary<string, IArchRule> { ["JONA-N1"] = n1, ["JONA-N2"] = n2, ["JONA-N3"] = n3, ["JONA-N4"] = n4 };
    }

    /// <summary>
    /// N2 se comprueba con reflexión: ArchUnitNET describe dependencias, no si un método tiene cuerpo.
    /// </summary>
    private static IEnumerable<string> ComportamientoDe(IType contrato)
    {
        var tipo = System.Reflection.Assembly.Load(contrato.Assembly.FullName).GetType(contrato.FullName.Replace('/', '+'));
        if (tipo is null) yield break;
        if (!tipo.IsInterface) yield return "no es una interfaz: un contrato solo declara";
        const BindingFlags Todos = BindingFlags.DeclaredOnly | BindingFlags.Public | BindingFlags.NonPublic | BindingFlags.Instance | BindingFlags.Static;
        foreach (var metodo in tipo.GetMethods(Todos).Where(m => !m.IsAbstract)) yield return $"el método {metodo.Name} tiene código";
        // Un valor que no es constante de compilación se calcula en el constructor estático.
        if (tipo.TypeInitializer is not null) yield return "calcula valores al cargarse: los DEFAULTS son constantes";
    }
}
