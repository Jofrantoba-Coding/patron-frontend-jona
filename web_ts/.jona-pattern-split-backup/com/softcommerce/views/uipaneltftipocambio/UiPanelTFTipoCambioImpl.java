package com.softcommerce.views.uipaneltftipocambio;

import com.softcommerce.beans.BeanTipoCambio;
import com.softcommerce.beans.Usuario;
import com.softcommerce.formularios.*;
import com.softcommerce.general.controles.ControlView;
import com.softcommerce.general.controles.CTable;
import com.softcommerce.general.controles.JHInternalFrame;
import com.softcommerce.general.controles.PopupMenuView;
import com.softcommerce.general.controles.Register;
import com.softcommerce.general.controles.RowSelection;
import com.softcommerce.general.controles.View;
import com.softcommerce.general.herramientas.DateTime;
import com.softcommerce.general.tablas.TipoCambioTableModel;
import com.softcommerce.reglasnegocio.RnTipoCambio;
import com.softcommerce.views.uiregistertipocambio.UiRegisterTipoCambioImpl;
import com.toedter.calendar.JDateChooser;
import com.toedter.calendar.JTextFieldDateEditor;
import java.awt.BorderLayout;
import java.awt.Color;
import java.awt.Component;
import java.awt.Cursor;
import java.awt.Dimension;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.FocusEvent;
import java.awt.event.FocusListener;
import java.awt.event.KeyAdapter;
import java.awt.event.KeyEvent;
import java.awt.event.KeyListener;
import java.awt.event.MouseAdapter;
import java.awt.event.MouseEvent;
import java.awt.event.MouseListener;
import java.awt.event.WindowEvent;
import java.awt.event.WindowListener;
import java.awt.FlowLayout;
import java.beans.PropertyChangeEvent;
import java.beans.PropertyChangeListener;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import javax.swing.border.LineBorder;
import javax.swing.event.ListSelectionEvent;
import javax.swing.event.ListSelectionListener;
import javax.swing.JComponent;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import javax.swing.JScrollPane;
import javax.swing.JTextField;
import javax.swing.KeyStroke;
import javax.swing.RowFilter.ComparisonType;
import javax.swing.RowFilter;
import javax.swing.table.TableRowSorter;

public class UiPanelTFTipoCambioImpl extends UiPanelTFTipoCambio {

    public UiPanelTFTipoCambioImpl(String title, JFrame frame, Usuario usuario) {
        super(title, frame, usuario);
    }

    public UiPanelTFTipoCambioImpl(String title, JFrame frame, Usuario usuario, List<Boolean> vPermiso) {
        super(title, frame, usuario, vPermiso);
    }
}
