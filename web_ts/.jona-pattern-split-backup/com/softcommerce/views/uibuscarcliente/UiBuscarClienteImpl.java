package com.softcommerce.views.uibuscarcliente;

import com.softcommerce.beans.Anexo;
import com.softcommerce.formularios.*;
import com.softcommerce.general.controles.CDialog;
import com.softcommerce.general.controles.ComponentToolKit;
import com.softcommerce.general.controles.CTable;
import com.softcommerce.general.controles.IntegerDocument;
import com.softcommerce.general.controles.JHDialog;
import com.softcommerce.general.controles.JHInternal;
import com.softcommerce.general.controles.JHInternalDialog;
import com.softcommerce.general.controles.UpperCaseNumberDocument;
import com.softcommerce.general.tablas.AnexoTableModel;
import com.softcommerce.iconos.Gif;
import com.softcommerce.reglasnegocio.RnAnexo;
import java.awt.Color;
import java.awt.Component;
import java.awt.Dialog;
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
import java.awt.event.WindowEvent;
import java.awt.event.WindowListener;
import java.awt.Font;
import java.awt.Frame;
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
import javax.swing.JTable;
import javax.swing.JTextField;
import javax.swing.KeyStroke;
import javax.swing.RowFilter;
import javax.swing.SwingConstants;
import javax.swing.table.TableRowSorter;

public class UiBuscarClienteImpl extends UiBuscarCliente {

    public UiBuscarClienteImpl(CDialog arg1, java.net.URL path) {
        super(arg1, path);
    }

    public UiBuscarClienteImpl(Frame arg0, CDialog arg1, java.net.URL path) {
        super(arg0, arg1, path);
    }

    public UiBuscarClienteImpl(Dialog arg0, JHDialog arg1, java.net.URL path) {
        super(arg0, arg1, path);
    }

    public UiBuscarClienteImpl(JFrame arg0, JHInternal arg1, java.net.URL path) {
        super(arg0, arg1, path);
    }

    public UiBuscarClienteImpl(JFrame arg0, Object arg1, java.net.URL path, String wForm) {
        super(arg0, arg1, path, wForm);
    }

    public UiBuscarClienteImpl(Dialog arg0, CDialog arg1, java.net.URL path) {
        super(arg0, arg1, path);
    }

    public UiBuscarClienteImpl(JHDialog arg0, java.net.URL path) {
        super(arg0, path);
    }

    public UiBuscarClienteImpl(Frame arg0, JHInternalDialog arg1, java.net.URL path) {
        super(arg0, arg1, path);
    }
}
