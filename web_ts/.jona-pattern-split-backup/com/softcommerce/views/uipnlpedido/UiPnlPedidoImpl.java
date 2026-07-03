package com.softcommerce.views.uipnlpedido;

import com.softcommerce.beans.BeanPedidoCab;
import com.softcommerce.beans.BeanPuntoVenta;
import com.softcommerce.beans.Usuario;
import com.softcommerce.formularios.*;
import com.softcommerce.general.controles.CTable;
import com.softcommerce.general.controles.IntegerDocument;
import com.softcommerce.general.controles.JHInternalFrame;
import com.softcommerce.general.controles.Register;
import com.softcommerce.general.controles.UpperCaseNumberDocument;
import com.softcommerce.general.herramientas.DateTime;
import com.softcommerce.general.tablas.PedidoTableModel;
import com.softcommerce.reglasnegocio.RnCotizacionCab;
import com.softcommerce.reglasnegocio.RnPedidoCab;
import com.softcommerce.reglasnegocio.RnPuntoVenta;
import com.softcommerce.report.ConvertNumberToLetter;
import com.softcommerce.util.Constans;
import com.softcommerce.util.Exportar;
import com.softcommerce.util.ExportarToExcel;
import com.softcommerce.util.ExportExcel;
import com.softcommerce.util.FormatObject;
import com.toedter.calendar.JDateChooser;
import com.toedter.calendar.JTextFieldDateEditor;
import java.awt.BorderLayout;
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
import java.awt.event.MouseEvent;
import java.awt.event.MouseListener;
import java.awt.event.WindowEvent;
import java.awt.event.WindowListener;
import java.awt.Font;
import java.awt.GridBagConstraints;
import java.awt.GridBagLayout;
import java.awt.Insets;
import java.beans.PropertyChangeEvent;
import java.beans.PropertyChangeListener;
import java.io.File;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import javax.swing.event.ListSelectionEvent;
import javax.swing.event.ListSelectionListener;
import javax.swing.JComboBox;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import javax.swing.JScrollPane;
import javax.swing.JTextField;
import javax.swing.RowFilter.ComparisonType;
import javax.swing.RowFilter;
import javax.swing.table.TableRowSorter;
import net.sf.jasperreports.engine.data.JRBeanCollectionDataSource;
import net.sf.jasperreports.engine.JRParameter;

public class UiPnlPedidoImpl extends UiPnlPedido {

    public UiPnlPedidoImpl(String title, JFrame frame, Usuario usuario) {
        super(title, frame, usuario);
    }

    public UiPnlPedidoImpl(String title, JFrame frame, Usuario usuario, List<Boolean> vPermiso) {
        super(title, frame, usuario, vPermiso);
    }
}
