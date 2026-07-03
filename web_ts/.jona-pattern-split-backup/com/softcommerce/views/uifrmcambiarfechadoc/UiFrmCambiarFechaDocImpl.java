package com.softcommerce.views.uifrmcambiarfechadoc;

import com.softcommerce.beans.Usuario;
import com.softcommerce.conta.formularios.PnlAsientoContable;
import com.softcommerce.formularios.*;
import com.softcommerce.general.herramientas.DateTime;
import com.softcommerce.iconos.Gif;
import com.softcommerce.reglasnegocio.RnRegconta;
import com.softcommerce.util.FxTipoDocVenta;
import com.softcommerce.util.Propiedad;
import com.softcommerce.util.Util;
import com.toedter.calendar.JDateChooser;
import com.toedter.calendar.JTextFieldDateEditor;
import java.awt.BorderLayout;
import java.awt.Color;
import java.awt.Dimension;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.FocusEvent;
import java.awt.event.FocusListener;
import java.awt.event.KeyEvent;
import java.awt.Font;
import java.awt.GridBagConstraints;
import java.awt.GridBagLayout;
import java.awt.Insets;
import java.net.URL;
import java.util.Date;
import javax.swing.border.Border;
import javax.swing.border.TitledBorder;
import javax.swing.BorderFactory;
import javax.swing.JButton;
import javax.swing.JComponent;
import javax.swing.JDialog;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import javax.swing.JTextField;
import javax.swing.KeyStroke;

public class UiFrmCambiarFechaDocImpl extends UiFrmCambiarFechaDoc {

    public UiFrmCambiarFechaDocImpl() {
        super();
    }

    public UiFrmCambiarFechaDocImpl(Main frmMain, PnlAsientoContable pnlAsientoContable, Usuario usuario, URL path) {
        super(frmMain, pnlAsientoContable, usuario, path);
    }
}
