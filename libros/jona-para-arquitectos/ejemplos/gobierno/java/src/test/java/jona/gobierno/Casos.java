package jona.gobierno;

import com.tngtech.archunit.core.domain.JavaClasses;
import com.tngtech.archunit.core.importer.ClassFileImporter;
import java.util.List;

/** Cada paquete de fixtures contiene violaciones de una sola regla: [paquete, regla, clase señalada]. */
final class Casos {
    private Casos() { }

    record Caso(String paquete, String regla, String clase) {
        @Override public String toString() { return paquete; }
    }

    static final List<Caso> TODOS = List.of(
        new Caso("n1sincontrato", "JONA-N1", "PerfilImpl"),
        new Caso("n1impladaptador", "JONA-N1", "UiLoginImpl"),
        new Caso("n2metododefault", "JONA-N2", "InterUiLogin"),
        new Caso("n2metodoestatico", "JONA-N2", "InterUiLogin"),
        new Caso("n2contratoclase", "JONA-N2", "InterUiLogin"),
        new Caso("n2defaultscalculado", "JONA-N2", "InterUiLogin$DEFAULTS"),
        new Caso("n3vistared", "JONA-N3", "UiLoginView"),
        new Caso("n3vistaadaptador", "JONA-N3", "UiLoginView"),
        new Caso("n3entradahilo", "JONA-N3", "UiLogin"),
        new Caso("n3contratoadaptador", "JONA-N3", "InterUiLogin"),
        new Caso("n4importaimpl", "JONA-N4", "App"),
        new Caso("n4importavista", "JONA-N4", "App"),
        // Forma de Plantilla: la Implementación hereda de la base y es la entrada; la base es interna.
        new Caso("n4basedeplantilla", "JONA-N4", "App"));

    /** Las clases compiladas de un paquete de fixtures (y sus subpaquetes). */
    static JavaClasses fixture(String... paquetes) {
        String[] completos = new String[paquetes.length];
        for (int i = 0; i < paquetes.length; i++) completos[i] = "jona.gobierno.fixtures." + paquetes[i];
        return new ClassFileImporter().importPackages(completos);
    }
}
