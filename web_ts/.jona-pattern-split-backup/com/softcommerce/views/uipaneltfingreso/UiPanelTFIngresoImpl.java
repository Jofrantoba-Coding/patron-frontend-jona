package com.softcommerce.views.uipaneltfingreso;

import com.softcommerce.beans.Almacen;
import com.softcommerce.beans.BeanEstadoDocumento;
import com.softcommerce.beans.ClasifInventario;
import com.softcommerce.beans.ContaCab;
import com.softcommerce.beans.TipoMovInventario;
import com.softcommerce.beans.Usuario;
import com.softcommerce.formularios.*;
import com.softcommerce.general.controles.ControlView;
import com.softcommerce.general.controles.CTable;
import com.softcommerce.general.controles.IntegerDocument;
import com.softcommerce.general.controles.JHInternalFrame;
import com.softcommerce.general.controles.Register;
import com.softcommerce.general.controles.UpperCaseNumberDocument;
import com.softcommerce.general.herramientas.DateTime;
import com.softcommerce.general.tablas.IngresoTableModel;
import com.softcommerce.reglasnegocio.rn_ClasifInventario;
import com.softcommerce.reglasnegocio.RnAlmacen;
import com.softcommerce.reglasnegocio.RnEstadoDocumento;
import com.softcommerce.reglasnegocio.RnMovInventarioCab;
import com.softcommerce.reglasnegocio.RnRegContaCab;
import com.softcommerce.reglasnegocio.RnTipoMovInventario;
import com.softcommerce.report.Reporte;
import com.softcommerce.util.ExportExcel;
import com.softcommerce.util.FormatObject;
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
import java.awt.event.ItemEvent;
import java.awt.event.ItemListener;
import java.awt.event.KeyAdapter;
import java.awt.event.KeyEvent;
import java.awt.event.KeyListener;
import java.awt.event.MouseAdapter;
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
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import javax.swing.border.LineBorder;
import javax.swing.event.InternalFrameEvent;
import javax.swing.event.ListSelectionEvent;
import javax.swing.event.ListSelectionListener;
import javax.swing.JComboBox;
import javax.swing.JComponent;
import javax.swing.JDesktopPane;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import javax.swing.JScrollPane;
import javax.swing.JTextField;
import javax.swing.KeyStroke;
import javax.swing.RowFilter.ComparisonType;
import javax.swing.RowFilter;
import javax.swing.table.TableRowSorter;

public class UiPanelTFIngresoImpl extends UiPanelTFIngreso {

    public UiPanelTFIngresoImpl(String title, Main frame, JDesktopPane jdp, Usuario usuario) {
        super(title, frame, jdp, usuario);
    }

    public UiPanelTFIngresoImpl(String title, Main frame, JDesktopPane jdp, Usuario usuario, List<Boolean> vPermiso) {
        super(title, frame, jdp, usuario, vPermiso);
    }

    public UiPanelTFIngresoImpl(String title, Main frame, JDesktopPane jdp, Usuario usuario, boolean vendedor) {
        super(title, frame, jdp, usuario, vendedor);
    }

    public UiPanelTFIngresoImpl(String title, Main frame, JDesktopPane jdp, Usuario usuario, boolean vendedor, boolean supervisor) {
        super(title, frame, jdp, usuario, vendedor, supervisor);
    }
}
