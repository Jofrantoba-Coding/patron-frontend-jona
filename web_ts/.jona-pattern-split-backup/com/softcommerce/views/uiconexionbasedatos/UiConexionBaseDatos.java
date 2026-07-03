package com.softcommerce.views.uiconexionbasedatos;

import com.softcommerce.util.Propiedad;
import java.awt.Frame;
import java.net.URL;
import javax.swing.JDialog;

public class UiConexionBaseDatos extends JDialog implements InterUiConexionBaseDatos {
    private static final long serialVersionUID = 1L;
    protected static URL basedatos;

    public UiConexionBaseDatos(Frame frmsys, Object sessionSystem) {
        super(frmsys);
        initializeConexion();
    }

    protected final void initializeConexion() {
        Propiedad p = new Propiedad();
        basedatos = p.getDbSys();
    }

    public static URL getPath() {
        return basedatos;
    }

    @Override
    public URL getPathConexion() {
        return basedatos;
    }
}
