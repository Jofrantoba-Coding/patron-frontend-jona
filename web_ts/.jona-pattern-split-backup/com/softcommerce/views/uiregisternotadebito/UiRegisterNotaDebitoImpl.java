package com.softcommerce.views.uiregisternotadebito;

import com.softcommerce.views.uipaneltfnotadebito.UiPanelTFNotaDebito;

import com.softcommerce.beans.Anexo;
import com.softcommerce.beans.BeanMoneda;
import com.softcommerce.beans.BeanMotivoNota;
import com.softcommerce.beans.BeanParametro;
import com.softcommerce.beans.BeanParametroProv;
import com.softcommerce.beans.BeanTipoCambio;
import com.softcommerce.beans.ContaCab;
import com.softcommerce.beans.ContaItem;
import com.softcommerce.beans.Localidad;
import com.softcommerce.beans.PuntoVenta;
import com.softcommerce.beans.TipoOperacion;
import com.softcommerce.beans.Usuario;
import com.softcommerce.beans.UsuarioCorrelativo;
import com.softcommerce.comboboxmodel.ComboModelFormaPago;
import com.softcommerce.entity.RegcontaCab;
import com.softcommerce.formularios.*;
import com.softcommerce.general.controles.CComboBox;
import com.softcommerce.general.controles.CLabel;
import com.softcommerce.general.controles.CTable;
import com.softcommerce.general.controles.DoubleDocument;
import com.softcommerce.general.controles.IntegerDocument;
import com.softcommerce.general.controles.JHInternal;
import com.softcommerce.general.controles.UpperCaseNumberDocument;
import com.softcommerce.general.herramientas.CFunciones;
import com.softcommerce.general.herramientas.DateTime;
import com.softcommerce.general.tablas.NotaDebitoRegistroTableModel;
import com.softcommerce.iconos.Gif;
import com.softcommerce.logic.LogicRegContaCab;
import com.softcommerce.reglasnegocio.rn_MotivoNotaCredito;
import com.softcommerce.reglasnegocio.RnAnexo;
import com.softcommerce.reglasnegocio.RnCorrelativo;
import com.softcommerce.reglasnegocio.RnLocalidad;
import com.softcommerce.reglasnegocio.RnParametro;
import com.softcommerce.reglasnegocio.RnParametroProv;
import com.softcommerce.reglasnegocio.RnPuntoVenta;
import com.softcommerce.reglasnegocio.RnRegContaCab;
import com.softcommerce.reglasnegocio.RnTipoCambio;
import com.softcommerce.reglasnegocio.RnTipoOperacion;
import com.softcommerce.report.Reporte;
import com.softcommerce.util.combo.LoadCombo;
import com.softcommerce.util.CompareDate;
import com.softcommerce.util.Constans;
import com.softcommerce.util.FEtxt;
import com.softcommerce.util.Util;
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
import java.awt.event.KeyListener;
import java.awt.Font;
import java.awt.Toolkit;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.swing.event.TableModelEvent;
import javax.swing.event.TableModelListener;
import javax.swing.JButton;
import javax.swing.JCheckBox;
import javax.swing.JComboBox;
import javax.swing.JComponent;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import javax.swing.JScrollPane;
import javax.swing.JTextField;
import javax.swing.KeyStroke;
import javax.swing.SwingConstants;

public class UiRegisterNotaDebitoImpl extends UiRegisterNotaDebito {

    public UiRegisterNotaDebitoImpl(UiPanelTFNotaDebito pnltfnotacredito, String title, Usuario usuario, JFrame frame) {
        super(pnltfnotacredito, title, usuario, frame);
    }
}

