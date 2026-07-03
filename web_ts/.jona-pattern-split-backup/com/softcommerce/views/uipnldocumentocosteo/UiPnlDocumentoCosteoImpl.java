package com.softcommerce.views.uipnldocumentocosteo;

import com.softcommerce.beans.DetalleCosteoMov;
import com.softcommerce.beans.DocumentoCosteo;
import com.softcommerce.beans.Usuario;
import com.softcommerce.formularios.*;
import com.softcommerce.general.controles.CuadroMensaje;
import com.softcommerce.general.controles.ItemObject;
import com.softcommerce.reglasnegocio.rn_DocumentoCosteo;
import java.awt.*;
import java.awt.event.MouseAdapter;
import java.awt.event.MouseEvent;
import java.util.ArrayList;
import java.util.List;
import javax.swing.*;
import javax.swing.border.TitledBorder;
import javax.swing.table.DefaultTableCellRenderer;
import javax.swing.table.DefaultTableModel;
import org.jdesktop.swingx.decorator.HighlighterFactory;
import org.jdesktop.swingx.JXTable;

public class UiPnlDocumentoCosteoImpl extends UiPnlDocumentoCosteo {

    public UiPnlDocumentoCosteoImpl(java.net.URL path, Usuario user, JFrame frame) {
        super(path, user, frame);
    }
}
