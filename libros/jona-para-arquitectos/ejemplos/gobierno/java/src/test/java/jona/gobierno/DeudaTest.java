package jona.gobierno;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import com.tngtech.archunit.core.domain.JavaClasses;
import com.tngtech.archunit.lang.ArchRule;
import com.tngtech.archunit.lang.EvaluationResult;
import com.tngtech.archunit.library.freeze.FreezingArchRule;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;
import java.util.stream.Stream;
import org.junit.jupiter.api.Test;

/**
 * Trinquete con FreezingArchRule: las violaciones del código heredado están congeladas en deuda-archunit/.
 * archunit.properties prohíbe crear o modificar ese almacén durante las pruebas.
 */
class DeudaTest {
    private static final ArchRule N3_CONGELADA = FreezingArchRule.freeze(ReglasJona.N3);
    private static final ArchRule N4_CONGELADA = FreezingArchRule.freeze(ReglasJona.N4);
    private static final Path ALMACEN = Path.of("deuda-archunit");

    private static JavaClasses legado() {
        return Casos.fixture("deuda.legado");
    }

    @Test
    void elLegadoTieneViolacionesReales() {
        assertTrue(ReglasJona.N3.evaluate(legado()).hasViolation());
        assertTrue(ReglasJona.N4.evaluate(legado()).hasViolation());
    }

    @Test
    void lasViolacionesCongeladasPasan() {
        assertFalse(N3_CONGELADA.evaluate(legado()).hasViolation());
        assertFalse(N4_CONGELADA.evaluate(legado()).hasViolation());
    }

    @Test
    void unaViolacionNuevaFalla() {
        EvaluationResult resultado = N4_CONGELADA.evaluate(Casos.fixture("deuda.legado", "deuda.nueva"));

        assertTrue(resultado.hasViolation());
        List<String> detalles = resultado.getFailureReport().getDetails();
        assertEquals(1, detalles.size(), String.join("\n", detalles));
        assertTrue(detalles.get(0).contains("deuda.nueva.Menu"), detalles.get(0));
    }

    @Test
    void unaViolacionCongeladaQueYaNoOcurreFallaYPideActualizarElAlmacen() {
        // Se corrige el código heredado: App ya no está entre las clases y su violación desaparece.
        JavaClasses corregido = Casos.fixture("deuda.legado.uilogin", "deuda.legado.servicios");

        // StoreUpdateFailedException no es pública en ArchUnit: se reconoce por su nombre.
        RuntimeException error = assertThrows(RuntimeException.class, () -> N4_CONGELADA.evaluate(corregido));
        assertEquals("StoreUpdateFailedException", error.getClass().getSimpleName());
        assertTrue(error.getMessage().contains("allowStoreUpdate"), error.getMessage());
    }

    @Test
    void evaluarLasReglasCongeladasNoReescribeElAlmacen() throws IOException {
        Map<Path, String> antes = contenido(ALMACEN);
        N3_CONGELADA.evaluate(legado());
        N4_CONGELADA.evaluate(Casos.fixture("deuda.legado", "deuda.nueva"));

        assertFalse(antes.isEmpty(), "el almacén deuda-archunit/ debe existir y estar versionado");
        assertEquals(antes, contenido(ALMACEN));
    }

    private static Map<Path, String> contenido(Path carpeta) throws IOException {
        Map<Path, String> archivos = new TreeMap<>();
        if (!Files.isDirectory(carpeta)) return archivos;
        try (Stream<Path> rutas = Files.list(carpeta)) {
            for (Path ruta : rutas.toList()) archivos.put(ruta.getFileName(), Files.readString(ruta));
        }
        return archivos;
    }
}
