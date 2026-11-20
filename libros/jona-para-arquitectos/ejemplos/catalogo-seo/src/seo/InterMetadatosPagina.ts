// Contrato de los metadatos de una página: lo que va en el <head> y no se ve. Lo produce la
// Implementación del servidor de cada pantalla, como función pura de sus datos y del sitio, y lo
// dibuja un solo renderizador (renderizarCabeza.ts). Ninguna vista escribe la cabeza (regla 5).

/** Un valor que JSON conserva. */
export type ValorJson = string | number | boolean | null | ValorJson[] | { [clave: string]: ValorJson };

/** Datos estructurados con el vocabulario de schema.org, para un <script type="application/ld+json">. */
export interface ObjetoJsonLd {
  '@context': 'https://schema.org';
  '@type': string;
  [propiedad: string]: ValorJson;
}

/** El sitio: su URL pública (sin barra final), su nombre y su idioma. */
export interface InterSitio {
  url: string;
  nombre: string;
  /** Etiqueta BCP 47 del idioma del contenido. */
  idioma: string;
}

interface MetadatosComunes {
  /** El <title>: único entre las páginas que se indexan. */
  titulo: string;
  /** La meta description: también única entre las páginas que se indexan. */
  descripcion: string;
  /**
   * Open Graph, para las vistas previas de un enlace compartido. og:title, og:description y
   * og:url salen del título, la descripción y la canónica; aquí va solo lo propio.
   */
  openGraph: {
    tipo: 'website' | 'product';
    /** URL absoluta. */
    imagen?: string;
  };
  jsonLd?: ObjetoJsonLd;
}

/** Una página que se indexa declara su URL canónica, absoluta. */
export interface MetadatosIndexables extends MetadatosComunes {
  robots: 'index, follow';
  canonica: string;
}

/**
 * Una página que no se indexa no declara canónica: las dos señales dirían cosas distintas.
 * `follow`: sus enlaces se siguen igual.
 */
export interface MetadatosNoIndexables extends MetadatosComunes {
  robots: 'noindex, follow';
  canonica?: never;
}

export type InterMetadatosPagina = MetadatosIndexables | MetadatosNoIndexables;
