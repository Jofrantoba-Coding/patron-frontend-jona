/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.softcommerce.views.uipaneltfnotadebito;


import com.softcommerce.formularios.*;
import com.softcommerce.accesoDatos.DAOGeneral;
import com.softcommerce.beans.BeanEstadoDocumento;
import com.softcommerce.beans.BeanTipoPago;
import com.softcommerce.beans.ContaCab;
import com.softcommerce.beans.Usuario;
import com.toedter.calendar.JDateChooser;
import com.toedter.calendar.JTextFieldDateEditor;
import com.softcommerce.general.controles.CuadroMensaje;
import com.softcommerce.general.controles.JHInternalFrame;
import com.softcommerce.general.controles.CTable;
import com.softcommerce.general.herramientas.DateTime;
import com.softcommerce.general.controles.DoubleDocument;
import com.softcommerce.general.controles.IntegerDocument;
import com.softcommerce.general.controles.UpperCaseNumberDocument;
import java.awt.BorderLayout;
import java.awt.event.ItemEvent;
import java.beans.PropertyChangeEvent;
import javax.swing.RowFilter.ComparisonType;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import javax.swing.JComboBox;
import javax.swing.JLabel;
import javax.swing.JPanel;
import javax.swing.JScrollPane;
import javax.swing.JTextField;
import javax.swing.RowFilter;
import javax.swing.border.LineBorder;
import javax.swing.event.InternalFrameEvent;
import javax.swing.table.TableRowSorter;
import com.softcommerce.reglasnegocio.RnEstadoDocumento;
import com.softcommerce.general.controles.PopupMenuView;
import java.awt.event.ActionListener;
import java.awt.event.FocusListener;
import java.awt.event.KeyListener;
import java.awt.event.ActionEvent;
import java.awt.event.FocusEvent;
import java.awt.event.KeyEvent;
import javax.swing.JDesktopPane;
import javax.swing.JFrame;
import com.softcommerce.general.controles.Register;
import java.awt.Color;
import java.awt.Component;
import java.awt.Cursor;
import java.awt.Font;
import java.awt.event.ItemListener;
import java.awt.event.KeyAdapter;
import java.awt.event.MouseAdapter;
import java.awt.event.MouseEvent;
import java.beans.PropertyChangeListener;
import javax.swing.JButton;
import javax.swing.JCheckBox;
import javax.swing.JComponent;
import javax.swing.JOptionPane;
import javax.swing.KeyStroke;
import javax.swing.SwingConstants;
import com.softcommerce.reglasnegocio.rn_NotaDebito;
import com.softcommerce.reglasnegocio.RnTipoPago;
import com.softcommerce.general.tablas.NotaDebitoTableModel;
import com.softcommerce.iconos.Gif;
import com.softcommerce.util.Constans;
import com.softcommerce.util.ExportExcel;
import com.softcommerce.util.Exportar;
import com.softcommerce.util.FEtxt;
import com.softcommerce.util.FormatObject;
import java.awt.GridBagConstraints;
import java.awt.GridBagLayout;
import java.awt.Insets;
import java.sql.Connection;
import java.util.HashMap;
import java.util.Map;

public class UiPanelTFNotaDebito 
        extends JHInternalFrame 
        implements InterUiPanelTFNotaDebito, FocusListener, KeyListener, ActionListener, PropertyChangeListener, ItemListener {

    private static final long serialVersionUID = 1L;
    public CTable table;
    public NotaDebitoTableModel modeltable;
    public TableRowSorter<NotaDebitoTableModel> modeloOrdenado;
    public JScrollPane scroll;
    protected JComboBox cbo_tipopago;
    protected List<BeanTipoPago> x_tipopago;
    protected JComboBox cbo_idestado;
    protected List<BeanEstadoDocumento> xestadoDocumento;
    protected JComboBox cbo_monto;
    protected JTextField txt_serie;
    protected JTextField txt_preimpreso;
    protected JTextField txt_rucdni;
    protected JTextField txt_tmpanexo;
    protected JTextField txt_idregconta;
    protected JTextField txt_monto;
    protected JComboBox cbo_condicionpago;
    protected Usuario usuario;
    protected JDesktopPane jdp;
    protected JFrame frame;
    protected RegisterNotaDebito registeri;
    protected Date fechaInicio;
    protected Date fechaFin;
    protected JDateChooser dc_fechainicio;
    protected JDateChooser dc_fechafin;
    protected JCheckBox chk_incluyepercepcion;
    protected JCheckBox chk_noincluyepercepcion;
    protected JButton btnBuscar;
    protected CuadroMensaje cuadro;
    protected JComboBox cbo_idtipodoc;
    protected Gif gif;

    public UiPanelTFNotaDebito(String title, JFrame frame, JDesktopPane jdp, Usuario usuario) {
        super(title + " - UiPanelTFNotaDebito", true, false, true, true, true, true, true, true, true, true, true, true, true);
        cuadro = new CuadroMensaje(usuario);
        this.usuario = usuario;
        this.frame = frame;
        this.jdp = jdp;
        inicialize();
    }

    public UiPanelTFNotaDebito(String title, JFrame frame, JDesktopPane jdp, Usuario usuario, List<Boolean> vPermiso) {
        super(title, vPermiso.get(0), vPermiso.get(1), vPermiso.get(2), vPermiso.get(3), vPermiso.get(4), vPermiso.get(5), vPermiso.get(6), vPermiso.get(7), vPermiso.get(8), vPermiso.get(9), vPermiso.get(10), vPermiso.get(11), vPermiso.get(12));
        cuadro = new CuadroMensaje(usuario);
        this.usuario = usuario;
        this.frame = frame;
        this.jdp = jdp;
        inicialize();
    }

    public UiPanelTFNotaDebito(String title, JFrame frame, JDesktopPane jdp, Usuario usuario, boolean vendedor) {
        super(title + " - UiPanelTFNotaDebito", true, false, false, true, false, true, true, true, true, true, true, true, true);
        this.usuario = usuario;
        this.frame = frame;
        this.jdp = jdp;
        inicialize();
    }

    protected void inicialize() {
    }

    public JPanel getPanelFilter() {
        JPanel pnlp = new JPanel();
        pnlp.setBorder(new LineBorder(new Color(130, 135, 144)));
        GridBagLayout gbl = new GridBagLayout();
        GridBagConstraints gbc = new GridBagConstraints();
        pnlp.setLayout(gbl);

        JLabel lblCodigoDespacho = new JLabel("Código");
        gbc.gridx = 0;
        gbc.gridy = 0;
        gbc.weighty = 1.0;
        gbc.weightx = 1.0;
        gbc.fill = GridBagConstraints.BOTH;
        gbc.insets = new Insets(5, 5, 5, 5);
        pnlp.add(lblCodigoDespacho, gbc);

        txt_idregconta = new JTextField();
        gbc.gridx = 1;
        gbc.gridy = 0;
        gbc.fill = GridBagConstraints.BOTH;
        gbc.insets = new Insets(5, 5, 5, 5);
        pnlp.add(txt_idregconta, gbc);
        txt_idregconta.setColumns(6);

        txt_idregconta.addKeyListener(this);
        txt_idregconta.setDocument(new IntegerDocument(10));
        txt_idregconta.addFocusListener(this);

        JLabel lblTipoDocumento = new JLabel("Doc");
        gbc.gridx = 2;
        gbc.gridy = 0;
        gbc.fill = GridBagConstraints.BOTH;
        gbc.insets = new Insets(5, 5, 5, 5);
        pnlp.add(lblTipoDocumento, gbc);

        cbo_idtipodoc = new JComboBox();
        gbc.gridx = 3;
        gbc.gridy = 0;
        gbc.fill = GridBagConstraints.BOTH;
        gbc.insets = new Insets(5, 5, 5, 5);
        pnlp.add(cbo_idtipodoc, gbc);
        cbo_idtipodoc.addActionListener(this);
        cbo_idtipodoc.addKeyListener(this);
        cbo_idtipodoc.setEnabled(false);

        txt_serie = new JTextField();
        gbc.gridx = 4;
        gbc.gridy = 0;
        gbc.fill = GridBagConstraints.BOTH;
        gbc.insets = new Insets(5, 5, 5, 5);
        pnlp.add(txt_serie, gbc);
        txt_serie.setColumns(3);
        txt_serie.addKeyListener(this);
        txt_serie.addFocusListener(this);
        FormatObject.formatJTextFieldSerie(txt_serie);
        txt_serie.setForeground(Color.BLACK);

        txt_preimpreso = new JTextField();
        gbc.gridx = 5;
        gbc.gridy = 0;
        gbc.fill = GridBagConstraints.BOTH;
        gbc.insets = new Insets(5, 5, 5, 5);
        pnlp.add(txt_preimpreso, gbc);
        txt_preimpreso.setColumns(8);
        txt_preimpreso.addKeyListener(this);
        txt_preimpreso.addFocusListener(this);
        txt_preimpreso.setDocument(new IntegerDocument(10));
        txt_preimpreso.setForeground(Color.BLACK);

        JLabel lbl_condpago = new JLabel("C Pago");
        gbc.gridx = 6;
        gbc.gridy = 0;
        gbc.fill = GridBagConstraints.BOTH;
        gbc.insets = new Insets(5, 5, 5, 5);
        pnlp.add(lbl_condpago, gbc);

        cbo_condicionpago = new JComboBox();
        gbc.gridx = 7;
        gbc.gridy = 0;
        gbc.fill = GridBagConstraints.BOTH;
        gbc.insets = new Insets(5, 5, 5, 5);
        pnlp.add(cbo_condicionpago, gbc);
        cbo_condicionpago.addKeyListener(this);
        cbo_condicionpago.addActionListener(this);

        JLabel lbl_familia = new JLabel("Estado");
        gbc.gridx = 8;
        gbc.gridy = 0;
        gbc.fill = GridBagConstraints.BOTH;
        gbc.insets = new Insets(5, 5, 5, 5);
        pnlp.add(lbl_familia, gbc);

        cbo_idestado = new JComboBox();
        gbc.gridx = 9;
        gbc.gridy = 0;
        gbc.fill = GridBagConstraints.BOTH;
        gbc.insets = new Insets(5, 5, 5, 5);
        pnlp.add(cbo_idestado, gbc);
        cbo_idestado.addActionListener(this);
        cbo_idestado.addKeyListener(this);

        JLabel lblRazonSocial = new JLabel("R Social");
        gbc.gridx = 0;
        gbc.gridy = 1;
        gbc.fill = GridBagConstraints.BOTH;
        gbc.insets = new Insets(5, 5, 5, 5);
        pnlp.add(lblRazonSocial, gbc);

        txt_tmpanexo = new JTextField();
        gbc.gridx = 1;
        gbc.gridy = 1;
        gbc.fill = GridBagConstraints.BOTH;
        gbc.gridwidth = 6;
        gbc.insets = new Insets(5, 5, 5, 5);
        pnlp.add(txt_tmpanexo, gbc);
        txt_tmpanexo.addKeyListener(this);
        txt_tmpanexo.setDocument(new UpperCaseNumberDocument(255));
        txt_tmpanexo.addFocusListener(this);

        JLabel lbl_RucCliente = new JLabel("RUC/DNI");
        gbc.gridx = 7;
        gbc.gridy = 1;
        gbc.fill = GridBagConstraints.BOTH;
        gbc.gridwidth = 1;
        gbc.insets = new Insets(5, 5, 5, 5);
        pnlp.add(lbl_RucCliente, gbc);

        txt_rucdni = new JTextField();
        gbc.gridx = 8;
        gbc.gridy = 1;
        gbc.fill = GridBagConstraints.BOTH;
        gbc.gridwidth = 1;
        gbc.insets = new Insets(5, 5, 5, 5);
        pnlp.add(txt_rucdni, gbc);
        txt_rucdni.addFocusListener(this);
        txt_rucdni.setDocument(new IntegerDocument(11));
        txt_rucdni.addKeyListener(this);

        JLabel lbl_tipopago = new JLabel("T. Pago");
        gbc.gridx = 9;
        gbc.gridy = 1;
        gbc.fill = GridBagConstraints.BOTH;
        gbc.gridwidth = 1;
        gbc.insets = new Insets(5, 5, 5, 5);
        pnlp.add(lbl_tipopago, gbc);

        cbo_tipopago = new JComboBox();
        gbc.gridx = 10;
        gbc.gridy = 1;
        gbc.fill = GridBagConstraints.BOTH;
        gbc.gridwidth = 1;
        gbc.insets = new Insets(5, 5, 5, 5);
        pnlp.add(cbo_tipopago, gbc);
        cbo_tipopago.addKeyListener(this);
        cbo_tipopago.addActionListener(this);
        pnlp.add(cbo_tipopago, gbc);

        JPanel pnlFlow = new JPanel();
        pnlFlow.setLayout(gbl);
        gbc.gridx = 0;
        gbc.gridy = 2;
        gbc.fill = GridBagConstraints.BOTH;
        gbc.gridwidth = 11;
        gbc.insets = new Insets(5, 5, 5, 5);
        pnlp.add(pnlFlow, gbc);

        JLabel lblFechaInicio = new JLabel("F Inicio");
        lblFechaInicio.setDisplayedMnemonic('c');
        gbc.gridx = 0;
        gbc.gridy = 0;
        gbc.fill = GridBagConstraints.BOTH;
        gbc.gridwidth = 1;
        gbc.insets = new Insets(5, 5, 5, 5);
        pnlFlow.add(lblFechaInicio, gbc);

        dc_fechainicio = new JDateChooser("dd/MM/yyyy", "##/##/####", '_');
        dc_fechainicio.getJCalendar().addFocusListener(this);
        dc_fechainicio.getJCalendar().addKeyListener(this);
        dc_fechainicio.getCalendarButton().addActionListener(this);
        dc_fechainicio.addPropertyChangeListener(this);
        dc_fechainicio.addKeyListener(this);
        dc_fechainicio.addFocusListener(this);
        ((JTextField) dc_fechainicio.getDateEditor()).registerKeyboardAction(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                ((JTextFieldDateEditor) dc_fechafin.getDateEditor()).requestFocus();
            }
        }, KeyStroke.getKeyStroke(KeyEvent.VK_ENTER, 0, false), JComponent.WHEN_FOCUSED);
        ((JTextField) dc_fechainicio.getDateEditor()).registerKeyboardAction(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                dc_fechainicio.getCalendarButton().doClick();
            }
        }, KeyStroke.getKeyStroke(KeyEvent.VK_SPACE, 0, false), JComponent.WHEN_FOCUSED);
        gbc.gridx = 1;
        gbc.gridy = 0;
        gbc.fill = GridBagConstraints.BOTH;
        gbc.insets = new Insets(5, 5, 5, 5);
        pnlFlow.add(dc_fechainicio, gbc);
        JLabel lblFechaFin = new JLabel("F Fin");
        lblFechaFin.setDisplayedMnemonic('a');
        gbc.gridx = 2;
        gbc.gridy = 0;
        gbc.fill = GridBagConstraints.BOTH;
        gbc.insets = new Insets(5, 5, 5, 5);
        pnlFlow.add(lblFechaFin, gbc);

        dc_fechafin = new JDateChooser("dd/MM/yyyy", "##/##/####", '_');
        dc_fechafin.getJCalendar().addFocusListener(this);
        dc_fechafin.getJCalendar().addKeyListener(this);
        dc_fechafin.getCalendarButton().addActionListener(this);
        dc_fechafin.addPropertyChangeListener(this);
        dc_fechafin.addKeyListener(this);
        dc_fechafin.addFocusListener(this);
        ((JTextField) dc_fechafin.getDateEditor()).registerKeyboardAction(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                cbo_monto.requestFocus();
            }
        }, KeyStroke.getKeyStroke(KeyEvent.VK_ENTER, 0, false), JComponent.WHEN_FOCUSED);
        ((JTextField) dc_fechafin.getDateEditor()).registerKeyboardAction(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                dc_fechafin.getCalendarButton().doClick();
            }
        }, KeyStroke.getKeyStroke(KeyEvent.VK_SPACE, 0, false), JComponent.WHEN_FOCUSED);
        ((JTextField) dc_fechafin.getDateEditor()).setColumns(12);
        gbc.gridx = 3;
        gbc.gridy = 0;
        gbc.fill = GridBagConstraints.BOTH;
        gbc.insets = new Insets(5, 5, 5, 5);
        pnlFlow.add(dc_fechafin, gbc);

        JLabel lblMonto = new JLabel("Monto");
        lblMonto.setDisplayedMnemonic('o');
        gbc.gridx = 4;
        gbc.gridy = 0;
        gbc.fill = GridBagConstraints.BOTH;
        gbc.insets = new Insets(5, 5, 5, 5);
        pnlFlow.add(lblMonto, gbc);

        cbo_monto = new JComboBox();
        cbo_monto.addItem("=");
        cbo_monto.addItem("<>");
        cbo_monto.addItem("<");
        cbo_monto.addItem(">");
        cbo_monto.addActionListener(this);
        cbo_monto.addKeyListener(this);
        gbc.gridx = 5;
        gbc.gridy = 0;
        gbc.fill = GridBagConstraints.BOTH;
        gbc.insets = new Insets(5, 5, 5, 5);
        pnlFlow.add(cbo_monto, gbc);

        txt_monto = new JTextField();
        txt_monto.addKeyListener(this);
        txt_monto.setDocument(new DoubleDocument());
        txt_monto.addFocusListener(this);
        txt_monto.setFont(new Font("Garamond", 0, 14));
        gbc.gridx = 6;
        gbc.gridy = 0;
        gbc.fill = GridBagConstraints.BOTH;
        gbc.insets = new Insets(5, 5, 5, 5);
        pnlFlow.add(txt_monto, gbc);
        txt_monto.setColumns(5);

        chk_incluyepercepcion = new JCheckBox("Inc Percep");
        chk_incluyepercepcion.addItemListener(this);
        chk_incluyepercepcion.setFont(new Font("Verdana", 1, 10));
        chk_incluyepercepcion.addKeyListener(this);
        chk_incluyepercepcion.setHorizontalTextPosition(SwingConstants.RIGHT);
        chk_incluyepercepcion.addFocusListener(this);
        chk_incluyepercepcion.setOpaque(false);
        gbc.gridx = 0;
        gbc.gridy = 1;
        gbc.fill = GridBagConstraints.BOTH;
        gbc.insets = new Insets(5, 5, 5, 5);
        pnlFlow.add(chk_incluyepercepcion, gbc);

        chk_noincluyepercepcion = new JCheckBox("No Inc Percep");
        chk_noincluyepercepcion.addItemListener(this);
        chk_noincluyepercepcion.setFont(new Font("Verdana", 1, 10));
        chk_noincluyepercepcion.addKeyListener(this);
        chk_noincluyepercepcion.setHorizontalTextPosition(SwingConstants.RIGHT);
        chk_noincluyepercepcion.addFocusListener(this);
        chk_noincluyepercepcion.setOpaque(false);
        gbc.gridx = 1;
        gbc.gridy = 1;
        gbc.fill = GridBagConstraints.BOTH;
        gbc.insets = new Insets(5, 5, 5, 5);
        pnlFlow.add(chk_noincluyepercepcion, gbc);

        return pnlp;
    }

    protected String getParametro() {
        String parametro = "SELECT "
                + "R.ID_REGCONTA AS CODIGO "
                + ",(CASE WHEN TDV.ABREV IS NULL OR R.SERIE IS NULL OR R.PREIMPRESO IS NULL THEN \' \' ELSE TDV.ABREV  || \'/\' ||  R.SERIE || TO_CHAR(CHR(45)) || R.PREIMPRESO END) AS \"N° DOC.\" "
                + ",(CASE "
                + "WHEN (R.ID_ESTADO=\'001\') "
                + "THEN 0.0 "
                + "WHEN (R.ID_ESTADO IS NULL) "
                + "THEN 0.0 "
                + "ELSE R.MONTO END "
                + ") AS MONTO "
                + ",(CASE "
                + "WHEN (R.ID_ESTADO=\'001\') "
                + "THEN 0.0 "
                + "WHEN (R.ID_ESTADO IS NULL) "
                + "THEN 0.0 "
                + "ELSE R.M_PERCEPCION END "
                + ") AS PERCEPCION "
                + ",(CASE "
                + "WHEN (R.ID_ESTADO=\'001\') "
                + "THEN 0.0 "
                + "WHEN (R.ID_ESTADO IS NULL) "
                + "THEN 0.0 "
                + "ELSE (R.MONTO+R.M_PERCEPCION) END "
                + ") AS TOTAL "
                + ",R.TMP_ANEXO AS \"RAZON SOCIAL\""
                + ",R.ID_TIPO_DOC AS \"DOC\""
                + ",R.SERIE AS \"SERIE\""
                + ",R.PREIMPRESO AS \"PREIMPRESO\""
                + ",R.TMP_DIRECCION AS \"DIRECCION\""
                + ",R.TMP_RUC AS \"RUC/DNI\""
                + ",TP.DESCRPCION AS TIPO_PAGO "
                + ",(CASE "
                + "WHEN (R.ID_ESTADO=\'001\') "
                + "THEN 0.0 "
                + "WHEN (R.ID_ESTADO IS NULL) "
                + "THEN 0.0 "
                + "ELSE R.M_IGV END "
                + ") AS \"IGV\" "
                + ",(CASE "
                + "WHEN (R.ID_ESTADO=\'001\') "
                + "THEN 0.0 "
                + "WHEN (R.ID_ESTADO IS NULL) "
                + "THEN 0.0 "
                + "ELSE R.M_AFECTO END "
                + ") AS \"V. AFECTO\" "
                + ",(CASE "
                + "WHEN (R.ID_ESTADO=\'001\') "
                + "THEN 0.0 "
                + "WHEN (R.ID_ESTADO IS NULL) "
                + "THEN 0.0 "
                + "ELSE R.M_NOAFECTO END "
                + ") AS \"V.NO AFECTO\" "
                + ",CV.TIPO AS TIPO_CONDPAGO "
                + ",R.F_EMISION AS \"F. EMISION\" "
                + ",ED.ABREV AS ESTADO"
                + " FROM REGCONTA_CAB R "
                + " LEFT JOIN TIPO_DOC_VENTA TDV    ON R.ID_TIPO_DOC = TDV.ID_TIPO_DOC "
                + " LEFT JOIN ESTADO_DOCUMENTO ED   ON R.ID_ESTADO   = ED.ID_ESTADO"
                + " LEFT JOIN CONDICION_PAGO CV   ON R.ID_CONDICION_VENTA = CV.ID_CONDICION"
                + " LEFT JOIN TIPO_PAGO TP   ON R.ID_TIPO_PAGO       = TP.ID_TIPO_PAGO "
                + " WHERE 1 = 1 AND R.\"_ESTADO\" = 'A' "
                + " AND (R.ID_AUXILIAR = \'00070\')"
                + " AND (R.ID_TIPO_DOC = \'03\' OR R.ID_TIPO_DOC = \'01\')"
                + " AND R.ID_EMPRESA = \'" + usuario.getCodempresa() + "\' "
                + " AND R.ID_PUNTO_VENTA = \'" + usuario.getCodpuntoventa() + "\' ";

        if (cbo_idestado.getSelectedIndex() > 0) {
            parametro = parametro + " AND R.ID_ESTADO = \'" + xestadoDocumento.get(cbo_idestado.getSelectedIndex() - 1).getIdEstado() + "\' ";
        }

        if (cbo_condicionpago.getSelectedIndex() > 0) {
            parametro = parametro + " AND CV.TIPO = \'" + (cbo_condicionpago.getSelectedIndex() == 1 ? "CO" : "CR") + "\' ";
        }

        if (cbo_tipopago.getSelectedIndex() > 0) {
            parametro = parametro + " AND R.ID_TIPO_PAGO = \'" + x_tipopago.get(cbo_tipopago.getSelectedIndex() - 1).getId_tipo_pago() + "\' ";
        }

        parametro = parametro + " AND R.ID_TIPO_DOC = \'08\' ";

        if (!((JTextFieldDateEditor) dc_fechainicio.getDateEditor()).getText().equals("__/__/____")
                && !((JTextFieldDateEditor) dc_fechafin.getDateEditor()).getText().equals("__/__/____")) {
            if (DateTime.isValidDate(((JTextFieldDateEditor) dc_fechainicio.getDateEditor()).getText())
                    && DateTime.isValidDate(((JTextFieldDateEditor) dc_fechafin.getDateEditor()).getText())) {
                parametro = parametro + " AND R.F_EMISION >= TO_DATE(\'" + ((JTextFieldDateEditor) dc_fechainicio.getDateEditor()).getText() + " 00:00:00\', \'DD/MM/YYYY HH24:MI:SS\') "
                        + " AND R.F_EMISION <= TO_DATE(\'" + ((JTextFieldDateEditor) dc_fechafin.getDateEditor()).getText() + " 00:00:00\', \'DD/MM/YYYY HH24:MI:SS\') ";
            }
        }

        if (chk_incluyepercepcion.isSelected()) {
            parametro = parametro + " AND (CASE "
                    + "WHEN (R.ID_ESTADO=\'001\') "
                    + "THEN 0.0 "
                    + "WHEN (R.ID_ESTADO IS NULL) "
                    + "THEN 0.0 "
                    + "ELSE R.M_PERCEPCION END "
                    + ") > 0.0 ";
        }

        if (chk_noincluyepercepcion.isSelected()) {
            parametro = parametro + " AND (CASE "
                    + "WHEN (R.ID_ESTADO=\'001\') "
                    + "THEN 0.0 "
                    + "WHEN (R.ID_ESTADO IS NULL) "
                    + "THEN 0.0 "
                    + "ELSE R.M_PERCEPCION END "
                    + ") = 0.0 ";
        }

        if (txt_monto.getText().trim().length() > 0) {
            parametro = parametro + " AND R.MONTO " + cbo_monto.getSelectedItem().toString() + " " + txt_monto.getText().trim() + " ";
        }

        if (txt_tmpanexo.getText().trim().length() > 0) {
            parametro = parametro + " AND R.TMP_ANEXO LIKE \'%" + txt_tmpanexo.getText().trim() + "%\' ";
        }

        if (txt_rucdni.getText().trim().length() > 0) {
            parametro = parametro + " AND R.TMP_RUC LIKE \'%" + txt_rucdni.getText().trim() + "%\' ";
        }

        if (txt_idregconta.getText().trim().length() > 0) {
            parametro = parametro + " AND R.ID_REGCONTA LIKE \'%" + txt_idregconta.getText().trim() + "%\' ";
        }

        parametro = parametro + " ORDER BY R.F_EMISION ASC,R.ID_TIPO_DOC,R.SERIE,R.PREIMPRESO";

        return parametro;
    }

    protected String getPrint() {
        String parametro = "SELECT "
                + " ND.TMP_ANEXO AS TMP_ANEXO "
                + " ,ND.TMP_DIRECCION as TMP_DIRECCION "
                + " ,ND.TMP_RUC AS TMP_RUC "
                + " ,EXTRACT(YEAR FROM TO_DATE(ND.F_EMISION,'DD/MM/YY HH24:MI:SS')) AS ANIO "
                + " ,EXTRACT(MONTH FROM TO_DATE(ND.F_EMISION,'DD/MM/YY HH24:MI:SS')) AS MES "
                + " ,EXTRACT(DAY FROM TO_DATE(ND.F_EMISION,'DD/MM/YY HH24:MI:SS')) AS DIA "
                + " ,ND.GLOSA AS GLOSA "
                + " ,TO_CHAR((CASE WHEN ND.ID_MONEDA='00004' THEN ND.M_IGV/ND.M_TIPO_CAMBIO ELSE ND.M_IGV END),'99,990.00') AS M_IGV"
                + " ,TO_CHAR((CASE WHEN ND.ID_MONEDA='00004' THEN ND.M_AFECTO/ND.M_TIPO_CAMBIO ELSE ND.M_AFECTO END),'99,990.00')  AS M_AFECTO"
                + " ,TO_CHAR((CASE WHEN ND.ID_MONEDA='00004' THEN ND.MONTO ELSE ND.MONTO END),'99,990.00') AS MONTO"
                + " ,PP.DESCRIPCION AS CONCEPTO"
                + " ,ND.ID_MONEDA"
                + " FROM REGCONTA_CAB ND "
                + " LEFT JOIN PARAMETRO_PROV PP ON ND.ID_PARAMETRO_PROV = PP.ID_PARAMETRO_PROV "
                + "  WHERE 1 = 1 "
                + " AND ND.\"_ESTADO\" = 'A' "
                + " AND ND.ID_REGCONTA = \'" + modeltable.getRegContaCab(table.convertRowIndexToModel(table.getSelectedRow())).getRcIdregconta() + "\' ";

        return parametro;
    }

    protected String getPrintSubreport() {
        String parametro = "select "
                + "RCI.ID_REGCONTACAB    "
                + ",RCI.ID_SECUENCIA     "
                + ",RCI.ID_ITEM         "
                + ",I.DESCRIPCION as ITEM "
                + ",I.ID_MARCA            "
                + ",MAR.DESCRIPCION as MARCA   "
                + ",(CASE WHEN RCC.ID_MONEDA='00004' THEN RCI.M_BRUTO/RCC.M_TIPO_CAMBIO ELSE RCI.M_BRUTO END) AS M_BRUTO "
                + ",(CASE WHEN RCC.ID_MONEDA='00004' THEN RCI.M_DESCUENTO/RCC.M_TIPO_CAMBIO ELSE RCI.M_DESCUENTO END) AS M_DESCUENTO "
                + ",(CASE WHEN RCC.ID_MONEDA='00004' THEN RCI.M_GASTOS/RCC.M_TIPO_CAMBIO ELSE RCI.M_GASTOS END) AS M_GASTOS  "
                + ",(CASE WHEN RCC.ID_MONEDA='00004' THEN RCI.M_AFECTO/RCC.M_TIPO_CAMBIO ELSE RCI.M_AFECTO END) AS M_AFECTO"
                + ",(CASE WHEN RCC.ID_MONEDA='00004' THEN RCI.M_NOAFECTO/RCC.M_TIPO_CAMBIO ELSE RCI.M_NOAFECTO END) AS M_NOAFECTO"
                + ",RCI.P_IGV "
                + ",(CASE WHEN RCC.ID_MONEDA='00004' THEN RCI.M_IGV/RCC.M_TIPO_CAMBIO ELSE RCI.M_IGV END) AS M_IGV"
                + ",RCI.P_ISC "
                + ",(CASE WHEN RCC.ID_MONEDA='00004' THEN RCI.M_ISC/RCC.M_TIPO_CAMBIO ELSE RCI.M_ISC END) AS M_ISC"
                + ",TO_CHAR((CASE WHEN RCC.ID_MONEDA='00004' THEN RCI.MONTO/RCC.M_TIPO_CAMBIO ELSE RCI.MONTO END),'99,990.00') AS MONTO "
                + ",RCI.P_PERCEPCION "
                + ",(CASE WHEN RCC.ID_MONEDA='00004' THEN  RCI.M_PERCEPCION/RCC.M_TIPO_CAMBIO ELSE RCI.M_PERCEPCION END) AS M_PERCEPCION "
                + ",RCI.P_RETRACCION "
                + ",(CASE WHEN RCC.ID_MONEDA='00004' THEN RCI.M_RETRACCION/RCC.M_TIPO_CAMBIO ELSE RCI.M_RETRACCION END) AS M_RETRACCION "
                + ",RCI.P_RETENCION "
                + ",(CASE WHEN RCC.ID_MONEDA='00004' THEN RCI.M_RETENCION/RCC.M_TIPO_CAMBIO ELSE RCI.M_RETENCION END) AS M_RETENCION "
                + ",(CASE WHEN RCC.ID_MONEDA='00004' THEN RCI.M_SALDO/RCC.M_TIPO_CAMBIO ELSE RCI.M_SALDO END) AS  M_SALDO"
                + ",RCI.CANTIDAD "
                + ",RCI.ID_UM        "
                + ",UM.ABREV         "
                + ",RCI.ID_ALMACEN     "
                + ",AL.DESCRIPCION as DESCRIPCION_ALMACEN  "
                + ",TO_CHAR(RCI.PRECIO_ITEM,'99,990.00') AS PRECIO_FINAL     "
                + " FROM REGCONTA_ITEM RCI "
                + " LEFT JOIN REGCONTA_CAB RCC                      ON RCI.ID_REGCONTACAB              = RCC.ID_REGCONTA "
                + " LEFT JOIN ITEM I                      ON RCI.ID_ITEM              = I.ID_ITEM "
                + " LEFT JOIN MARCA MAR                   ON I.ID_MARCA               = MAR.ID_MARCA "
                + " LEFT JOIN ALMACEN AL                  ON RCI.ID_ALMACEN           = AL.ID_ALMACEN "
                + " LEFT JOIN UNIDAD_MEDIDA UM            ON RCI.ID_UM                = UM.ID_UM "
                + " where RCI.\"_ESTADO\" = 'A' "
                + " and RCI.ID_REGCONTACAB = \'" + modeltable.getRegContaCab(table.convertRowIndexToModel(table.getSelectedRow())).getRcIdregconta() + "\' "
                + " ORDER BY RCI.ID_SECUENCIA,RCI.ID_ITEM ";
        return parametro;
    }

    @Override
    public void controlReport(boolean export) {
    }

    public void filtrar() {
    }

    public void setFecha(Date fechaInicio, Date fechaFin) {
        this.fechaInicio = fechaInicio;
        this.fechaFin = fechaFin;

        dc_fechainicio.setSelectableDateRange(fechaInicio, fechaFin);
        dc_fechafin.setSelectableDateRange(fechaInicio, fechaFin);
        dc_fechainicio.setDate(fechaInicio);
        dc_fechafin.setDate(fechaFin);
    }

    @Override
    public void keyReleased(KeyEvent e) {
        if (e.getKeyChar() != '\n') {
            if ((e.getSource() == txt_idregconta)
                    || (e.getSource() == txt_tmpanexo)
                    || (e.getSource() == txt_monto)
                    || (e.getSource() == txt_rucdni)
                    || (e.getSource() == txt_serie)
                    || (e.getSource() == txt_preimpreso)) {
                filtrar();
            }
        }
    }

    public RowFilter<Object, Object> getFilter() {
        return null;
    }

    public void cargarFiltro() {
    }

    public void loadTipoPago(String tipo_condicion) {
    }

    public void loadCondPago() {
    }

    public void loadTipoDocumento() {
    }

    public void loadEstadoDocumento() {
    }

    @Override
    public void focusGained(FocusEvent e) {
        if (e.getSource() == txt_idregconta) {
            txt_idregconta.selectAll();
        }

        if (e.getSource() == txt_monto) {
            txt_monto.selectAll();
        }

        if (e.getSource() == txt_tmpanexo) {
            txt_tmpanexo.selectAll();
        }

        if (e.getSource() == txt_rucdni) {
            txt_rucdni.selectAll();
        }

        if (e.getSource() == txt_serie) {
            txt_serie.selectAll();
        }

        if (e.getSource() == txt_preimpreso) {
            txt_preimpreso.selectAll();
        }
    }

    @Override
    public void actionPerformed(ActionEvent e) {
        if (e.getSource() == dc_fechainicio.getCalendarButton()) {
            dc_fechainicio.setSelectableDateRange(fechaInicio, dc_fechafin.getDate());
        }

        if (e.getSource() == dc_fechafin.getCalendarButton()) {
            dc_fechafin.setSelectableDateRange(dc_fechainicio.getDate(), fechaFin);
        }

        if (e.getSource() == cbo_idestado) {
            if (cbo_idestado.getItemCount() > 0) {
                if (cbo_idestado.getSelectedIndex() >= 0) {
                    filtrar();
                }
            }
        }

        if (e.getSource() == cbo_monto) {
            if (cbo_monto.getSelectedIndex() >= 0) {
                filtrar();
            }
        }

        if (e.getSource() == cbo_tipopago) {
            if (cbo_tipopago.getItemCount() > 0) {
                if (cbo_tipopago.getSelectedIndex() >= 0) {
                    filtrar();
                }
            }
        }

        if (e.getSource() == cbo_condicionpago) {
            if (cbo_condicionpago.getItemCount() > 0) {
                if (cbo_condicionpago.getSelectedIndex() >= 0) {
                    if (cbo_condicionpago.getSelectedIndex() == 0) {
                        cbo_tipopago.removeAllItems();
                        cbo_tipopago.setEnabled(false);
                    } else {
                        if (cbo_condicionpago.getSelectedIndex() == 2) {
                            cbo_tipopago.removeAllItems();
                            cbo_tipopago.setEnabled(false);
                        } else {
                            loadTipoPago("C");
                            cbo_tipopago.setEnabled(true);
                        }
                    }

                    filtrar();
                }
            }
        }
    }

    protected void exportarTxt(ContaCab beanRcc) throws Exception {
    }

    protected String getNameFile(String idTipoDoc, ContaCab beanRcc) {
        return this.usuario.getRuc() + "-" + idTipoDoc + "-" + beanRcc.getSerie() + "-" + beanRcc.getPreimpreso8Digs();
    }

    @Override
    public void controlPrint(boolean view) {
    }

    @Override
    public void controlAdd() {
    }

    @Override
    public void controlModify() {
    }

    @Override
    public void controlNullify() {
    }

    @Override
    public void controlEliminate() {
    }

    @Override
    public void controlDetails() {
    }

    @Override
    public void controlClone() {
    }

    @Override
    public void controlClose() {
    }

    @Override
    public void controlRefresh() {
    }

    @Override
    public Object getSelectedValue(int column) {
        return null;
    }

    @Override
    public void cargarTabla() {
    }

    @Override
    public void focusLost(FocusEvent e) {
        if (e.getSource() == txt_serie && txt_serie.getText().trim().length() > 0) {
            String serie = "000" + txt_serie.getText().trim();
            String nuevaserie = serie.substring(serie.length() - 3, serie.length());

            txt_serie.setText(nuevaserie);

            filtrar();
        }

        if (e.getSource() == txt_preimpreso && txt_preimpreso.getText().trim().length() > 0) {
            String serie = "0000000000" + txt_preimpreso.getText().trim();
            String nuevaserie = serie.substring(serie.length() - 10, serie.length());

            txt_preimpreso.setText(nuevaserie);

            filtrar();
        }
    }

    @Override
    public void keyPressed(KeyEvent e) {
        if (e.getKeyChar() == '\n') {
            if (e.getSource() == txt_idregconta) {
                txt_serie.requestFocus();
            }

            if (e.getSource() == txt_serie) {
                txt_preimpreso.requestFocus();
            }

            if (e.getSource() == txt_preimpreso) {
                cbo_idestado.requestFocus();
            }

            if (e.getSource() == cbo_idestado) {
                txt_tmpanexo.requestFocus();
            }

            if (e.getSource() == txt_tmpanexo) {
                txt_rucdni.requestFocus();
            }

            if (e.getSource() == txt_rucdni) {
                cbo_condicionpago.requestFocus();
            }

            if (e.getSource() == cbo_condicionpago) {
                if (cbo_tipopago.isEnabled()) {
                    cbo_tipopago.requestFocus();
                } else {
                    ((JTextFieldDateEditor) dc_fechainicio.getDateEditor()).requestFocus();
                }
            }

            if (e.getSource() == cbo_monto) {
                txt_monto.requestFocus();
            }

            if (e.getSource() == txt_monto) {
                chk_incluyepercepcion.requestFocus();
            }

            if (e.getSource() == chk_incluyepercepcion) {
                chk_noincluyepercepcion.requestFocus();
            }
        }
    }

    @Override
    public void propertyChange(PropertyChangeEvent evt) {
        if ((evt.getSource() == dc_fechainicio)
                || (evt.getSource() == dc_fechafin)) {
            filtrar();
        }
    }

    @Override
    public void internalFrameClosing(InternalFrameEvent e) {
        jdp.updateUI();

        if (registeri == e.getSource()) {
            registeri.dispose();
            registeri = null;
        }

        jdp.updateUI();

        System.gc();
    }

    @Override
    public void itemStateChanged(ItemEvent e) {
        boolean is_Selected;

        is_Selected = (e.getStateChange() == ItemEvent.SELECTED);

        if (e.getItemSelectable() == chk_incluyepercepcion) {
            if (is_Selected) {
                chk_noincluyepercepcion.setSelected(false);
            }

            filtrar();
        }

        if (e.getItemSelectable() == chk_noincluyepercepcion) {
            if (is_Selected) {
                chk_incluyepercepcion.setSelected(false);
            }

            filtrar();
        }
    }

    @Override
    public void controlSearch() {
    }

    @Override
    public Object getSelectedValue(String column) {
        return null;
    }

    @Override
    public void keyTyped(KeyEvent e) {
    }

    @Override
    public void setSelectedRow(int row) {
    }

    @Override
    public void setSelectedRow(String clave, int column) {
    }

    @Override
    public void setValueSearch(Object valor, Component comp) {
    }

    @Override
    public void refreshTitleName() {
    }

    public void setScrollValueView(int row) {
    }

    @Override
    public void selectLastRow() {
    }

    @Override
    public void selectNextRow() {
    }

    @Override
    public void selectPreviusRow() {
    }

    @Override
    public void selectFirstRow() {
    }

    @Override
    public int getSelectedRow() {
        return 0;
    }

    @Override
    public int getRowCount() {
        return 0;
    }

    @Override
    public void selectFirstPage() {
    }

    @Override
    public void selectPreviusPage() {
    }

    @Override
    public void selectNextPage() {
    }

    @Override
    public void selectLastPage() {
    }

    @Override
    public int getSelectedPage() {
        return 0;
    }

    @Override
    public int getPageCount() {
        return 0;
    }
    
}
