package jona.gobierno;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import com.tngtech.archunit.core.domain.JavaClasses;
import com.tngtech.archunit.core.importer.ClassFileImporter;
import com.tngtech.archunit.core.importer.ImportOption;
import java.util.List;
import java.util.Set;
import java.util.TreeSet;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.FieldSource;
import org.junit.jupiter.api.Test;

class ReglasJonaTest {
    /** Las reglas que encuentran al menos una violación en las clases dadas. */
    private static Set<String> reglasQueFallan(JavaClasses clases) {
        Set<String> fallan = new TreeSet<>();
        ReglasJona.TODAS.forEach((id, regla) -> {
            if (regla.evaluate(clases).hasViolation()) fallan.add(id);
        });
        return fallan;
    }

    static final List<Casos.Caso> CASOS = Casos.TODOS;

    @ParameterizedTest(name = "{0}")
    @FieldSource("CASOS")
    void cadaReglaDetectaLoQueDiceDetectar(Casos.Caso caso) {
        JavaClasses clases = Casos.fixture(caso.paquete());

        assertEquals(Set.of(caso.regla()), reglasQueFallan(clases));
        List<String> detalles = ReglasJona.TODAS.get(caso.regla()).evaluate(clases).getFailureReport().getDetails();
        // ArchUnit nombra la clase como <paquete.Clase> o <paquete.Clase.metodo(...)>.
        String clase = "." + caso.clase();
        assertTrue(detalles.stream().anyMatch(d -> d.contains(clase + ">") || d.contains(clase + ".")),
            () -> "se esperaba una violación en " + caso.clase() + ":\n" + String.join("\n", detalles));
    }

    @Test
    void enLaFormaDePlantillaLaImplementacionEsLaEntrada() {
        assertEquals(Set.of(), reglasQueFallan(Casos.fixture("plantillaentrada")));
    }

    @Test
    void elEjemploCumpleLaNorma() {
        JavaClasses ejemplo = new ClassFileImporter()
            .withImportOption(ImportOption.Predefined.DO_NOT_INCLUDE_TESTS)
            .importPackages("jona.ejemplo");

        assertFalse(ejemplo.isEmpty(), "debe analizar las clases del ejemplo");
        assertTrue(ejemplo.contain(jona.ejemplo.uilogin.UiLogin.class));
        assertEquals(Set.of(), reglasQueFallan(ejemplo));
    }
}
