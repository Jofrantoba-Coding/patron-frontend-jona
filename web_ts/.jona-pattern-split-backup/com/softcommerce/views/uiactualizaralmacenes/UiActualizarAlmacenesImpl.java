package com.softcommerce.views.uiactualizaralmacenes;

import com.softcommerce.beans.ContaCab;
import com.softcommerce.beans.Stock;
import com.softcommerce.beans.Usuario;
import com.softcommerce.beans.UsuarioCorrelativo;
import com.softcommerce.formularios.*;
import com.softcommerce.general.controles.CComboBox;
import com.softcommerce.general.controles.CDialog;
import com.softcommerce.general.controles.ComponentToolKit;
import com.softcommerce.general.controles.CTable;
import com.softcommerce.general.controles.IntegerDocument;
import com.softcommerce.general.controles.JHInternal;
import com.softcommerce.general.controles.JHInternalDialog;
import com.softcommerce.general.controles.JHInternalFrame;
import com.softcommerce.general.herramientas.DateTime;
import com.softcommerce.general.tablas.ActualizarAlmacenesTableModel;
import com.softcommerce.iconos.Gif;
import com.softcommerce.reglasnegocio.RnCorrelativo;
import com.softcommerce.reglasnegocio.RnRegContaCab;
import com.softcommerce.reglasnegocio.RnStock;
import java.awt.Color;
import java.awt.Component;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.FocusEvent;
import java.awt.event.FocusListener;
import java.awt.event.ItemEvent;
import java.awt.event.ItemListener;
import java.awt.event.KeyEvent;
import java.awt.event.KeyListener;
import java.awt.event.MouseAdapter;
import java.awt.event.MouseEvent;
import java.awt.event.MouseListener;
import java.awt.event.WindowEvent;
import java.awt.event.WindowListener;
import java.awt.Font;
import java.awt.Frame;
import java.beans.PropertyChangeEvent;
import java.beans.PropertyChangeListener;
import java.util.ArrayList;
import java.util.List;
import javax.swing.border.EmptyBorder;
import javax.swing.JButton;
import javax.swing.JComboBox;
import javax.swing.JComponent;
import javax.swing.JDialog;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import javax.swing.JScrollPane;
import javax.swing.JTabbedPane;
import javax.swing.JTextField;
import javax.swing.KeyStroke;
import javax.swing.SwingConstants;

public class UiActualizarAlmacenesImpl extends UiActualizarAlmacenes {

    public UiActualizarAlmacenesImpl(JFrame arg0, JHInternal pnlguia, Usuario usuario, java.net.URL path) {
        super(arg0, pnlguia, usuario, path);
    }

    public UiActualizarAlmacenesImpl(Frame arg0, JHInternalFrame pnlguia, Usuario usuario, java.net.URL path) {
        super(arg0, pnlguia, usuario, path);
    }

    public UiActualizarAlmacenesImpl(Frame arg0, Usuario usuario, java.net.URL path) {
        super(arg0, usuario, path);
    }

    public UiActualizarAlmacenesImpl(Frame arg0, JHInternalDialog arg1, java.net.URL path) {
        super(arg0, arg1, path);
    }
}
