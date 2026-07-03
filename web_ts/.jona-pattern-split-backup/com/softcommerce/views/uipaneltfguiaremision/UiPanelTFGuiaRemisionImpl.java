package com.softcommerce.views.uipaneltfguiaremision;

import com.softcommerce.beans.BeanEstadoDocumento;
import com.softcommerce.beans.BeanGuiaReporte;
import com.softcommerce.beans.ContaCab;
import com.softcommerce.beans.MotivoTraslado;
import com.softcommerce.beans.Usuario;
import com.softcommerce.datasource.DataSourceGuia;
import com.softcommerce.enums.TipoDocVentaEnum;
import com.softcommerce.formularios.*;
import com.softcommerce.general.controles.CTable;
import com.softcommerce.general.controles.CuadroMensaje;
import com.softcommerce.general.controles.IntegerDocument;
import com.softcommerce.general.controles.JHInternalFrame;
import com.softcommerce.general.controles.Register;
import com.softcommerce.general.controles.UpperCaseNumberDocument;
import com.softcommerce.general.herramientas.DateTime;
import com.softcommerce.general.tablas.GuiaTableModel;
import com.softcommerce.reglasnegocio.RnConsultas;
import com.softcommerce.reglasnegocio.RnEstadoDocumento;
import com.softcommerce.reglasnegocio.RnMotivoTraslado;
import com.softcommerce.reglasnegocio.RnMovInventarioCab;
import com.softcommerce.reglasnegocio.RnRegContaCab;
import com.softcommerce.report.Reporte;
import com.softcommerce.util.Constans;
import com.softcommerce.util.ExceptionHandler;
import com.softcommerce.util.Exportar;
import com.softcommerce.util.ExportExcel;
import com.softcommerce.util.FactElectTxt;
import com.softcommerce.util.FormatObject;
import com.softcommerce.util.LayoutUtil;
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
import java.awt.event.KeyEvent;
import java.awt.event.KeyListener;
import java.awt.event.MouseAdapter;
import java.awt.event.MouseEvent;
import java.awt.GridBagConstraints;
import java.awt.GridBagLayout;
import java.awt.Insets;
import java.beans.PropertyChangeEvent;
import java.beans.PropertyChangeListener;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import javax.swing.border.LineBorder;
import javax.swing.event.InternalFrameEvent;
import javax.swing.event.ListSelectionEvent;
import javax.swing.event.ListSelectionListener;
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
import javax.swing.table.TableRowSorter;
import net.sf.jasperreports.engine.JRParameter;
import org.apache.log4j.Logger;

public class UiPanelTFGuiaRemisionImpl extends UiPanelTFGuiaRemision {

    public UiPanelTFGuiaRemisionImpl(String title, JFrame frame, JDesktopPane jdp, Usuario usuario) {
        super(title, frame, jdp, usuario);
    }

    public UiPanelTFGuiaRemisionImpl(String title, JFrame frame, JDesktopPane jdp, Usuario usuario, List<Boolean> vPermiso) {
        super(title, frame, jdp, usuario, vPermiso);
    }

    public UiPanelTFGuiaRemisionImpl(String title, JFrame frame, JDesktopPane jdp, Usuario usuario, boolean vendedor) {
        super(title, frame, jdp, usuario, vendedor);
    }
}
