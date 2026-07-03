package com.softcommerce.views.uiregisternotacredito;

import com.softcommerce.views.uipaneltfnotacredito.UiPanelTFNotaCredito;

import com.softcommerce.beans.BeanMotivoNota;
import com.softcommerce.beans.BeanNcReporte;
import com.softcommerce.beans.ContaCab;
import com.softcommerce.beans.ContaItem;
import com.softcommerce.beans.Localidad;
import com.softcommerce.beans.Lote;
import com.softcommerce.beans.PuntoVenta;
import com.softcommerce.beans.Usuario;
import com.softcommerce.beans.UsuarioCorrelativo;
import com.softcommerce.comboboxmodel.ComboModelFormaPago;
import com.softcommerce.datasource.DataSourceNc;
import com.softcommerce.entity.RegcontaCab;
import com.softcommerce.enums.AuxiliarEnum;
import com.softcommerce.formularios.*;
import com.softcommerce.general.controles.CComboBox;
import com.softcommerce.general.controles.CLabel;
import com.softcommerce.general.controles.CTable;
import com.softcommerce.general.controles.IntegerDocument;
import com.softcommerce.general.controles.JHInternal;
import com.softcommerce.general.controles.UpperCaseNumberDocument;
import com.softcommerce.general.herramientas.DateTime;
import com.softcommerce.general.tablas.NotaCreditoDescuentoTableModel;
import com.softcommerce.general.tablas.NotaCreditoDespachadoTableModel;
import com.softcommerce.general.tablas.NotaCreditoPendienteTableModel;
import com.softcommerce.iconos.Gif;
import com.softcommerce.logic.LogicLote;
import com.softcommerce.logic.LogicRegContaCab;
import com.softcommerce.reglasnegocio.rn_MotivoNotaCredito;
import com.softcommerce.reglasnegocio.RnConsultas;
import com.softcommerce.reglasnegocio.RnCorrelativo;
import com.softcommerce.reglasnegocio.RnLocalidad;
import com.softcommerce.reglasnegocio.RnPuntoVenta;
import com.softcommerce.reglasnegocio.RnRegContaCab;
import com.softcommerce.util.CompareDate;
import com.softcommerce.util.Constans;
import com.softcommerce.util.editor.CellEditorBtnLoteVenta;
import com.softcommerce.util.ExceptionHandler;
import com.softcommerce.util.Exportar;
import com.softcommerce.util.FEtxt;
import com.toedter.calendar.JDateChooser;
import com.toedter.calendar.JTextFieldDateEditor;
import java.awt.Color;
import java.awt.Component;
import java.awt.Dimension;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.FocusEvent;
import java.awt.event.FocusListener;
import java.awt.event.ItemEvent;
import java.awt.event.ItemListener;
import java.awt.event.KeyEvent;
import java.awt.Font;
import java.awt.Toolkit;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import javax.swing.border.Border;
import javax.swing.border.TitledBorder;
import javax.swing.BorderFactory;
import javax.swing.event.TableModelEvent;
import javax.swing.event.TableModelListener;
import javax.swing.JButton;
import javax.swing.JCheckBox;
import javax.swing.JComboBox;
import javax.swing.JComponent;
import javax.swing.JDialog;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import javax.swing.JScrollPane;
import javax.swing.JTextField;
import javax.swing.KeyStroke;
import javax.swing.SwingConstants;
import net.sf.jasperreports.engine.JRParameter;
import org.apache.log4j.Logger;
import static com.softcommerce.general.controles.Register.INSERT;

public class UiRegisterNotaCreditoImpl extends UiRegisterNotaCredito {

    public UiRegisterNotaCreditoImpl(UiPanelTFNotaCredito pnltfnotacredito, String title, Usuario usuario, JFrame frame) {
        super(pnltfnotacredito, title, usuario, frame);
    }
}

