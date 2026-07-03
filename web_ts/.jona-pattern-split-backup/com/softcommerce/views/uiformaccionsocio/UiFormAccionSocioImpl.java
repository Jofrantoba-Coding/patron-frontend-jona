package com.softcommerce.views.uiformaccionsocio;

import com.softcommerce.beans.AccionPrecio;
import com.softcommerce.beans.AccionSocio;
import com.softcommerce.beans.Usuario;
import com.softcommerce.formularios.*;
import com.softcommerce.general.controles.CTable;
import com.softcommerce.general.tablas.AccionPrecioTableModel;
import com.softcommerce.general.tablas.AccionSocioTableModel;
import com.softcommerce.iconos.Gif;
import com.softcommerce.reglasnegocio.RnCliente;
import com.softcommerce.util.render.CellRendererImageEstado;
import java.awt.BorderLayout;
import java.awt.Component;
import java.awt.Dimension;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.Font;
import java.math.BigDecimal;
import java.math.BigInteger;
import java.text.SimpleDateFormat;
import javax.swing.JButton;
import javax.swing.JDialog;
import javax.swing.JFrame;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import javax.swing.JScrollPane;
import javax.swing.JTabbedPane;
import javax.swing.JToolBar;
import javax.swing.SwingConstants;

public class UiFormAccionSocioImpl extends UiFormAccionSocio {

    public UiFormAccionSocioImpl(JFrame frame, Usuario usuario, java.net.URL ruta, boolean modal) {
        super(frame, usuario, ruta, modal);
    }
}
