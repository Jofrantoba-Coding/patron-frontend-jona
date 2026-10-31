package jona.gobierno;

import static com.tngtech.archunit.base.DescribedPredicate.describe;
import static com.tngtech.archunit.base.DescribedPredicate.not;
import static com.tngtech.archunit.lang.syntax.ArchRuleDefinition.classes;
import static com.tngtech.archunit.lang.syntax.ArchRuleDefinition.noClasses;

import com.tngtech.archunit.base.DescribedPredicate;
import com.tngtech.archunit.core.domain.Dependency;
import com.tngtech.archunit.core.domain.JavaClass;
import com.tngtech.archunit.core.domain.JavaMethod;
import com.tngtech.archunit.core.domain.JavaModifier;
import com.tngtech.archunit.core.domain.JavaPackage;
import com.tngtech.archunit.lang.ArchCondition;
import com.tngtech.archunit.lang.ArchRule;
import com.tngtech.archunit.lang.CompositeArchRule;
import com.tngtech.archunit.lang.ConditionEvents;
import com.tngtech.archunit.lang.SimpleConditionEvent;
import java.util.Arrays;
import java.util.Map;
import java.util.Set;
import java.util.TreeSet;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

/** La norma JONA (../reglas.json) como reglas de ArchUnit. Reconoce los roles por la convención de nombres. */
public final class ReglasJona {
    private ReglasJona() { }

    // -----------------------------------------------------------------------------------------
    // Convenciones: toda la configuración está aquí, a la vista.
    // -----------------------------------------------------------------------------------------

    private static final Pattern CONTRATO_SERVICIO = Pattern.compile("Inter[A-Z]\\w*Service");
    private static final Pattern CONTRATO_UI = Pattern.compile("Inter[A-Z]\\w*");
    /** Efectos que solo la Implementación y los adaptadores pueden producir (N3). */
    private static final Set<String> PAQUETES_CON_EFECTOS = Set.of("java.net", "java.net.http", "java.nio.file", "java.sql", "java.util.prefs");
    private static final Set<String> CLASES_CON_EFECTOS = Set.of(
        "java.io.File", "java.io.FileInputStream", "java.io.FileOutputStream", "java.io.FileReader", "java.io.FileWriter",
        "java.io.RandomAccessFile", "java.lang.Thread", "java.util.Timer", "java.util.concurrent.Executors",
        "java.util.concurrent.CompletableFuture", "javax.swing.Timer", "javax.swing.SwingWorker");

    enum Rol { CONTRATO, CONTRATO_SERVICIO, ADAPTADOR, IMPL, VISTA, ENTRADA, INTERNO, LIBRE }

    /** Una clase anidada o anónima tiene el rol de la clase de nivel superior que la contiene. */
    private static JavaClass superior(JavaClass clase) {
        JavaClass actual = clase.getBaseComponentType();
        while (actual.getEnclosingClass().isPresent()) actual = actual.getEnclosingClass().get();
        return actual;
    }

    /** El rol que da el nombre, sin mirar el paquete. */
    private static Rol rolPorNombre(JavaClass clase) {
        String nombre = superior(clase).getSimpleName();
        if (CONTRATO_SERVICIO.matcher(nombre).matches()) return Rol.CONTRATO_SERVICIO;
        if (CONTRATO_UI.matcher(nombre).matches()) return Rol.CONTRATO;
        boolean implementaUnServicio = superior(clase).getAllRawInterfaces().stream()
            .anyMatch(i -> CONTRATO_SERVICIO.matcher(i.getSimpleName()).matches());
        if (!superior(clase).isInterface() && implementaUnServicio) return Rol.ADAPTADOR;
        if (nombre.endsWith("Impl")) return Rol.IMPL;
        if (nombre.endsWith("View")) return Rol.VISTA;
        return Rol.LIBRE;
    }

    private static Set<JavaClass> propias(JavaPackage paquete) {
        return paquete.getClasses().stream().filter(JavaClass::isTopLevelClass).collect(Collectors.toSet());
    }

    /** Un paquete es una unidad de UI si tiene un contrato de UI, una Implementación o una vista. */
    private static boolean esUnidad(JavaPackage paquete) {
        return propias(paquete).stream().map(ReglasJona::rolPorNombre)
            .anyMatch(r -> r == Rol.CONTRATO || r == Rol.IMPL || r == Rol.VISTA);
    }

    /**
     * La entrada de una unidad: la clase con el nombre del contrato sin "Inter" (InterUiLogin: UiLogin).
     * En la forma de Plantilla (UiLoginImpl extends UiLogin), la Implementación. Sin ninguna, la Implementación.
     */
    private static Set<String> entradas(JavaPackage paquete) {
        Set<JavaClass> propias = propias(paquete);
        Set<String> nombres = propias.stream().map(JavaClass::getSimpleName).collect(Collectors.toSet());
        Set<String> publicos = propias.stream().filter(c -> rolPorNombre(c) == Rol.CONTRATO)
            .map(c -> c.getSimpleName().substring("Inter".length())).collect(Collectors.toSet());
        Set<String> impls = propias.stream().filter(c -> rolPorNombre(c) == Rol.IMPL).map(JavaClass::getSimpleName).collect(Collectors.toCollection(TreeSet::new));
        Set<String> plantilla = propias.stream()
            .filter(c -> rolPorNombre(c) == Rol.IMPL && c.getRawSuperclass().map(s -> nombres.contains(s.getSimpleName())
                && s.getPackageName().equals(paquete.getName())).orElse(false))
            .map(JavaClass::getSimpleName).collect(Collectors.toCollection(TreeSet::new));
        Set<String> elegidas = !plantilla.isEmpty() ? plantilla
            : nombres.stream().filter(publicos::contains).collect(Collectors.toCollection(TreeSet::new));
        return elegidas.isEmpty() ? impls : elegidas;
    }

    /** El rol completo: una clase sin rol por nombre dentro de una unidad es su entrada o un archivo interno. */
    private static Rol rol(JavaClass clase) {
        Rol porNombre = rolPorNombre(clase);
        JavaPackage paquete = superior(clase).getPackage();
        if (porNombre != Rol.LIBRE || !esUnidad(paquete)) return porNombre;
        return entradas(paquete).contains(superior(clase).getSimpleName()) ? Rol.ENTRADA : Rol.INTERNO;
    }

    private static DescribedPredicate<JavaClass> tienenRol(Rol... roles) {
        Set<Rol> buscados = Set.of(roles);
        return describe("tienen el rol " + Arrays.toString(roles), c -> buscados.contains(rol(c)));
    }

    private static final DescribedPredicate<JavaClass> EN_UNA_UNIDAD =
        describe("están en una unidad de UI", c -> esUnidad(superior(c).getPackage()));
    private static final DescribedPredicate<JavaClass> ADAPTADORES = describe("son adaptadores", c -> rol(c) == Rol.ADAPTADOR);
    private static final DescribedPredicate<JavaClass> CONTRATOS_DE_SERVICIO =
        describe("son contratos de servicio", c -> rol(c) == Rol.CONTRATO_SERVICIO);
    private static final DescribedPredicate<JavaClass> PRODUCEN_EFECTOS = describe("producen efectos (red, archivos, hilos, temporizadores)",
        c -> PAQUETES_CON_EFECTOS.contains(c.getBaseComponentType().getPackageName())
            || CLASES_CON_EFECTOS.contains(c.getBaseComponentType().getName()));

    // -----------------------------------------------------------------------------------------
    // JONA-N1: toda unidad tiene contrato de UI; depende del contrato de servicio, no del adaptador.
    // -----------------------------------------------------------------------------------------

    private static final ArchCondition<JavaClass> TENER_CONTRATO_DE_UI = new ArchCondition<>("tener un contrato de UI (Inter*) en su paquete") {
        @Override
        public void check(JavaClass clase, ConditionEvents eventos) {
            boolean tiene = propias(clase.getPackage()).stream().anyMatch(c -> rolPorNombre(c) == Rol.CONTRATO);
            if (!tiene) {
                eventos.add(SimpleConditionEvent.violated(clase,
                    "<" + clase.getName() + "> pertenece a la unidad " + clase.getPackageName() + ", que no tiene contrato de UI (Inter*)"));
            }
        }
    };

    public static final ArchRule N1 = CompositeArchRule
        .of(classes().that(tienenRol(Rol.IMPL, Rol.VISTA)).and().areTopLevelClasses().should(TENER_CONTRATO_DE_UI))
        // La vista y el contrato importando un adaptador son N3; aquí, el resto de la unidad.
        .and(noClasses().that(EN_UNA_UNIDAD.and(not(tienenRol(Rol.VISTA, Rol.CONTRATO)))).should().dependOnClassesThat(ADAPTADORES))
        .as("JONA-N1 Contratos explícitos");

    // -----------------------------------------------------------------------------------------
    // JONA-N2: un contrato es una interfaz sin código; los DEFAULTS son constantes de compilación.
    // -----------------------------------------------------------------------------------------

    private static final ArchCondition<JavaClass> NO_LLEVAR_COMPORTAMIENTO = new ArchCondition<>("no llevar comportamiento") {
        @Override
        public void check(JavaClass clase, ConditionEvents eventos) {
            if (!clase.isInterface()) {
                eventos.add(SimpleConditionEvent.violated(clase, "<" + clase.getName() + "> no es una interfaz: un contrato solo declara"));
            }
            for (JavaMethod metodo : clase.getMethods()) {
                if (!metodo.getModifiers().contains(JavaModifier.ABSTRACT)) {
                    eventos.add(SimpleConditionEvent.violated(metodo, "Method <" + metodo.getFullName() + "> tiene código en un contrato"));
                }
            }
            // Un valor que no es constante de compilación se calcula en el inicializador estático.
            clase.getStaticInitializer().ifPresent(inicializador -> eventos.add(SimpleConditionEvent.violated(clase,
                "<" + clase.getName() + "> calcula valores al cargarse: los DEFAULTS son constantes")));
        }
    };

    public static final ArchRule N2 = classes().that(tienenRol(Rol.CONTRATO, Rol.CONTRATO_SERVICIO))
        .should(NO_LLEVAR_COMPORTAMIENTO)
        .as("JONA-N2 Los contratos no llevan comportamiento");

    // -----------------------------------------------------------------------------------------
    // JONA-N3: efectos solo en la Implementación y en los adaptadores.
    // -----------------------------------------------------------------------------------------

    public static final ArchRule N3 = CompositeArchRule
        .of(noClasses().that(EN_UNA_UNIDAD.and(not(tienenRol(Rol.IMPL, Rol.ADAPTADOR)))).should().dependOnClassesThat(PRODUCEN_EFECTOS))
        .and(noClasses().that(tienenRol(Rol.VISTA, Rol.CONTRATO)).should().dependOnClassesThat(ADAPTADORES))
        .and(noClasses().that(tienenRol(Rol.VISTA)).should().dependOnClassesThat(CONTRATOS_DE_SERVICIO))
        .as("JONA-N3 Efectos solo en la Implementación y en los adaptadores");

    // -----------------------------------------------------------------------------------------
    // JONA-N4: fuera de una unidad solo se usa su entrada (y su contrato: en Java un tipo no se reexporta).
    // -----------------------------------------------------------------------------------------

    private static final ArchCondition<JavaClass> USAR_SOLO_LA_ENTRADA = new ArchCondition<>("usar de otras unidades solo su entrada") {
        @Override
        public void check(JavaClass origen, ConditionEvents eventos) {
            for (Dependency dependencia : origen.getDirectDependenciesFromSelf()) {
                JavaClass destino = superior(dependencia.getTargetClass());
                JavaPackage unidad = destino.getPackage();
                if (unidad.getName().equals(origen.getPackageName()) || !esUnidad(unidad)) continue;
                Set<String> entradas = entradas(unidad);
                if (entradas.contains(destino.getSimpleName()) || rolPorNombre(destino) == Rol.CONTRATO) continue;
                eventos.add(SimpleConditionEvent.violated(dependencia, dependencia.getDescription() + ": " + destino.getSimpleName()
                    + " es interno de la unidad " + unidad.getName() + "; use su entrada " + String.join(" o ", entradas)));
            }
        }
    };

    public static final ArchRule N4 = classes().should(USAR_SOLO_LA_ENTRADA)
        .as("JONA-N4 El resto de la aplicación solo conoce la entrada");

    /** Una regla por id del catálogo; CatalogoTest verifica que coincidan con ../reglas.json. */
    public static final Map<String, ArchRule> TODAS = Map.of("JONA-N1", N1, "JONA-N2", N2, "JONA-N3", N3, "JONA-N4", N4);
}
