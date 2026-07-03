package com.softcommerce.views.uiformmenuperfilarbol;

import com.softcommerce.beans.BeanTipoTrabajador;
import com.softcommerce.beans.BeanTipoTrabajadorPerfil;
import com.softcommerce.beans.MenuDinamico;
import com.softcommerce.beans.Usuario;
import com.softcommerce.formularios.*;
import com.softcommerce.general.controles.CTable;
import com.softcommerce.general.controles.UpperCaseNumberDocument;
import com.softcommerce.general.tablas.TipoTrabajadorPerfilTableModel;
import com.softcommerce.reglasnegocio.RnTipoTrabajador;
import com.softcommerce.reglasnegocio.RnTipoTrabajadorPerfil;
import com.softcommerce.reglasnegocio.RnUsuario;
import com.softcommerce.util.BeanTreeModel;
import com.softcommerce.util.editor.EditorTree;
import com.softcommerce.util.Propiedad;
import com.softcommerce.util.render.BeanTreeRenderer;
import com.softcommerce.util.TreeEntryBean;
import java.awt.BorderLayout;
import java.awt.Color;
import java.awt.Dimension;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.FocusEvent;
import java.awt.event.FocusListener;
import java.awt.event.KeyEvent;
import java.awt.event.KeyListener;
import java.awt.Font;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import javax.swing.border.LineBorder;
import javax.swing.event.ListSelectionEvent;
import javax.swing.event.ListSelectionListener;
import javax.swing.JButton;
import javax.swing.JComboBox;
import javax.swing.JDialog;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import javax.swing.JScrollPane;
import javax.swing.JSplitPane;
import javax.swing.JTextField;
import javax.swing.JTree;
import javax.swing.RowFilter;
import javax.swing.table.TableRowSorter;
import javax.swing.tree.TreePath;
import javax.swing.tree.TreeSelectionModel;

public class UiFormMenuPerfilArbolImpl extends UiFormMenuPerfilArbol {

    public UiFormMenuPerfilArbolImpl() {
        super();
    }

    public UiFormMenuPerfilArbolImpl(JFrame frame, Usuario usuario, java.net.URL ruta) {
        super(frame, usuario, ruta);
    }

    public UiFormMenuPerfilArbolImpl(JFrame frame, Usuario usuario, java.net.URL ruta, boolean modal) {
        super(frame, usuario, ruta, modal);
    }
}
