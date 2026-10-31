package jona.ejemplo.boton;

/** Contrato de UI de una unidad solo visual: no tiene contrato de servicio. */
public interface InterBoton {
    interface Eventos {
        void onClick();
    }

    interface DEFAULTS {
        String VARIANTE = "principal";
    }
}
