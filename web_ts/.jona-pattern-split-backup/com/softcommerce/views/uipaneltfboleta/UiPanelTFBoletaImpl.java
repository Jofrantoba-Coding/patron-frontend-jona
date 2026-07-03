package com.softcommerce.views.uipaneltfboleta;

import com.softcommerce.beans.BeanEstadoDocumento;
import com.softcommerce.beans.BeanParametro;
import com.softcommerce.beans.BeanRegcontaAdicional;
import com.softcommerce.beans.BeanRegcontaCab;
import com.softcommerce.beans.BeanRegcontaItem;
import com.softcommerce.beans.ContaCab;
import com.softcommerce.beans.Usuario;
import com.softcommerce.datasource.DataSourceVenta;
import com.softcommerce.enums.AuxiliarEnum;
import com.softcommerce.enums.CondicionPagoEnum;
import com.softcommerce.enums.EstadoDocumentoEnum;
import com.softcommerce.enums.MonedaEnum;
import com.softcommerce.enums.TipoDocVentaEnum;
import com.softcommerce.enums.TipoVentaEnum;
import com.softcommerce.formularios.*;
import com.softcommerce.general.controles.CTable;
import com.softcommerce.general.controles.IntegerDocument;
import com.softcommerce.general.controles.JHInternalFrame;
import com.softcommerce.general.controles.PopupMenuVenta;
import com.softcommerce.general.controles.Register;
import com.softcommerce.general.controles.UpperCaseNumberDocument;
import com.softcommerce.general.herramientas.DateTime;
import com.softcommerce.general.tablas.TableModelPanelTFBoleta;
import com.softcommerce.gui.FormVentaItemReport;
import com.softcommerce.iconos.Gif;
import com.softcommerce.reglasnegocio.RnConsultas;
import com.softcommerce.reglasnegocio.RnEstadoDocumento;
import com.softcommerce.reglasnegocio.RnParametro;
import com.softcommerce.reglasnegocio.RnRegconta;
import com.softcommerce.reglasnegocio.RnRegContaCab;
import com.softcommerce.report.ConvertNumberToLetter;
import com.softcommerce.reportes.jheyson.RptVenta;
import com.softcommerce.util.Constans;
import com.softcommerce.util.editor.CellEditorBtnFactElect;
import com.softcommerce.util.ExceptionHandler;
import com.softcommerce.util.Exportar;
import com.softcommerce.util.ExportExcel;
import com.softcommerce.util.FactElectTxt;
import com.softcommerce.util.FEtxt;
import com.softcommerce.util.FormatObject;
import com.softcommerce.util.LayoutUtil;
import com.softcommerce.util.Util;
import com.softcommerce.util.UtilCenter;
import com.softcommerce.views.uilogin.UiLoginImpl;
import com.toedter.calendar.JDateChooser;
import com.toedter.calendar.JTextFieldDateEditor;
import java.awt.BorderLayout;
import java.awt.Color;
import java.awt.Component;
import java.awt.Cursor;
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
import java.awt.Font;
import java.awt.GridBagConstraints;
import java.awt.GridBagLayout;
import java.beans.PropertyChangeEvent;
import java.beans.PropertyChangeListener;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import javax.swing.event.InternalFrameEvent;
import javax.swing.event.ListSelectionEvent;
import javax.swing.event.ListSelectionListener;
import javax.swing.JCheckBox;
import javax.swing.JComboBox;
import javax.swing.JComponent;
import javax.swing.JDesktopPane;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import javax.swing.JScrollPane;
import javax.swing.JTextField;
import javax.swing.KeyStroke;
import javax.swing.RowFilter.ComparisonType;
import javax.swing.RowFilter;
import javax.swing.SwingConstants;
import javax.swing.table.TableRowSorter;
import net.sf.jasperreports.engine.JRParameter;
import org.apache.log4j.Logger;

public class UiPanelTFBoletaImpl extends UiPanelTFBoleta {

    public UiPanelTFBoletaImpl(String title, JFrame frame, JDesktopPane jdp, Usuario usuario) {
        super(title, frame, jdp, usuario);
    }

    public UiPanelTFBoletaImpl(String title, JFrame frame, JDesktopPane jdp, Usuario usuario, List<Boolean> vPermiso) {
        super(title, frame, jdp, usuario, vPermiso);
    }

    public UiPanelTFBoletaImpl(String title, JFrame frame, JDesktopPane jdp, Usuario usuario, boolean vendedor) {
        super(title, frame, jdp, usuario, vendedor);
    }
}
