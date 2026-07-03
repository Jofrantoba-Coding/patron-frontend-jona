package com.softcommerce.views.uiregisterconsultakardex;

import com.softcommerce.beans.ContaItem;
import com.softcommerce.beans.Item;
import com.softcommerce.beans.Kardex;
import com.softcommerce.beans.TipoMovInventario;
import com.softcommerce.formularios.*;
import com.softcommerce.general.controles.ComponentToolKit;
import com.softcommerce.general.controles.CTable;
import com.softcommerce.general.controles.UpperCaseNumberDocument;
import com.softcommerce.general.herramientas.CFunciones;
import com.softcommerce.general.herramientas.DateTime;
import com.softcommerce.general.tablas.KardexTableModel;
import com.softcommerce.iconos.Gif;
import com.softcommerce.reglasnegocio.RnItem;
import com.softcommerce.reglasnegocio.RnRegContaCab;
import com.softcommerce.reglasnegocio.RnTipoMovInventario;
import com.softcommerce.report.Reporte;
import com.softcommerce.util.ExportarToExcel;
import com.softcommerce.util.render.CellRenderer;
import com.toedter.calendar.JDateChooser;
import com.toedter.calendar.JTextFieldDateEditor;
import java.awt.BorderLayout;
import java.awt.Color;
import java.awt.Dimension;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.FocusEvent;
import java.awt.event.FocusListener;
import java.awt.event.ItemEvent;
import java.awt.event.ItemListener;
import java.awt.event.KeyEvent;
import java.awt.event.KeyListener;
import java.awt.event.MouseEvent;
import java.awt.event.MouseListener;
import java.awt.Font;
import java.beans.PropertyChangeEvent;
import java.beans.PropertyChangeListener;
import java.io.File;
import java.io.IOException;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import javax.swing.border.Border;
import javax.swing.border.EmptyBorder;
import javax.swing.border.TitledBorder;
import javax.swing.BorderFactory;
import javax.swing.event.ListSelectionEvent;
import javax.swing.event.ListSelectionListener;
import javax.swing.JButton;
import javax.swing.JCheckBox;
import javax.swing.JComboBox;
import javax.swing.JComponent;
import javax.swing.JDialog;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import javax.swing.JScrollPane;
import javax.swing.JTabbedPane;
import javax.swing.JTextField;
import javax.swing.KeyStroke;
import javax.swing.SwingConstants;
import javax.swing.table.DefaultTableCellRenderer;

public class UiRegisterConsultaKardexImpl extends UiRegisterConsultaKardex {

    public UiRegisterConsultaKardexImpl(Main frm, java.net.URL path) {
        super(frm, path);
    }
}
