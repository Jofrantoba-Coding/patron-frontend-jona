package com.softcommerce.views.uipnltipotrabajador;

import com.softcommerce.beans.BeanTipoTrabajador;
import com.softcommerce.beans.Usuario;
import com.softcommerce.formularios.*;
import com.softcommerce.general.controles.CTable;
import com.softcommerce.general.controles.IntegerDocument;
import com.softcommerce.general.controles.JHInternalFrame;
import com.softcommerce.general.controles.Register;
import com.softcommerce.general.controles.UpperCaseNumberDocument;
import com.softcommerce.general.tablas.TipoTrabajadorTableModel;
import com.softcommerce.reglasnegocio.RnTipoTrabajador;
import com.softcommerce.util.ExportExcel;
import com.softcommerce.util.render.CellRender;
import java.awt.BorderLayout;
import java.awt.Color;
import java.awt.Component;
import java.awt.Cursor;
import java.awt.Dimension;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.FocusEvent;
import java.awt.event.FocusListener;
import java.awt.event.ItemEvent;
import java.awt.event.ItemListener;
import java.awt.event.KeyEvent;
import java.awt.event.KeyListener;
import java.awt.event.WindowEvent;
import java.awt.event.WindowListener;
import java.awt.FlowLayout;
import java.awt.Font;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import javax.swing.border.LineBorder;
import javax.swing.event.ListSelectionEvent;
import javax.swing.event.ListSelectionListener;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import javax.swing.JScrollPane;
import javax.swing.JTextField;
import javax.swing.RowFilter;
import javax.swing.table.TableRowSorter;

public class UiPnlTipoTrabajadorImpl extends UiPnlTipoTrabajador {

    public UiPnlTipoTrabajadorImpl(String title, JFrame frame, Usuario usuario) {
        super(title, frame, usuario);
    }

    public UiPnlTipoTrabajadorImpl(String title, JFrame frame, Usuario usuario, List<Boolean> vPermiso) {
        super(title, frame, usuario, vPermiso);
    }
}
