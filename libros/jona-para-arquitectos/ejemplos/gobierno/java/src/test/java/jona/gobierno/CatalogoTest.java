package jona.gobierno;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Set;
import java.util.TreeSet;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;
import org.junit.jupiter.api.Test;

/** Gobierno: un catálogo (../reglas.json), una implementación por regla en cada lenguaje. */
class CatalogoTest {
    /** Los id del catálogo. Basta una expresión regular: el archivo es pequeño y de formato fijo. */
    private static Set<String> idsDelCatalogo() throws IOException {
        String json = Files.readString(Path.of("..", "reglas.json"));
        Matcher id = Pattern.compile("\"id\"\\s*:\\s*\"([^\"]+)\"").matcher(json);
        Set<String> ids = new TreeSet<>();
        while (id.find()) ids.add(id.group(1));
        return ids;
    }

    @Test
    void cadaReglaDelCatalogoEstaImplementadaYNoHayReglasFueraDeEl() throws IOException {
        assertEquals(idsDelCatalogo(), new TreeSet<>(ReglasJona.TODAS.keySet()));
    }

    @Test
    void cadaReglaDelCatalogoTieneUnFixtureQueLaHaceFallar() throws IOException {
        assertEquals(idsDelCatalogo(), Casos.TODOS.stream().map(Casos.Caso::regla).collect(Collectors.toCollection(TreeSet::new)));
    }
}
