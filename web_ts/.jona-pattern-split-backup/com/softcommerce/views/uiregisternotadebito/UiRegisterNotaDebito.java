package com.softcommerce.views.uiregisternotadebito;

import com.softcommerce.views.uipaneltfnotadebito.UiPanelTFNotaDebito;


import com.softcommerce.formularios.*;
import com.softcommerce.beans.Anexo;
import com.softcommerce.beans.Localidad;
import com.softcommerce.beans.BeanMoneda;
import com.softcommerce.beans.BeanMotivoNota;
import com.softcommerce.beans.PuntoVenta;
import com.softcommerce.beans.ContaCab;
import com.softcommerce.beans.Usuario;
import com.softcommerce.beans.UsuarioCorrelativo;
import com.softcommerce.beans.ContaItem;
import com.softcommerce.beans.BeanParametro;
import com.softcommerce.beans.BeanParametroProv;
import com.softcommerce.beans.BeanTipoCambio;
import com.softcommerce.beans.TipoOperacion;
import com.softcommerce.comboboxmodel.ComboModelFormaPago;
import com.softcommerce.entity.RegcontaCab;
import com.toedter.calendar.JDateChooser;
import com.toedter.calendar.JTextFieldDateEditor;
import com.softcommerce.general.controles.CComboBox;
import com.softcommerce.iconos.Gif;
import java.awt.Component;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.FocusEvent;
import java.awt.event.ItemEvent;
import java.awt.event.KeyEvent;
import java.awt.event.KeyListener;
import java.awt.Color;
import java.awt.Font;
import java.util.Date;
import javax.swing.JButton;
import javax.swing.JComponent;
import javax.swing.JTextField;
import javax.swing.KeyStroke;
import javax.swing.SwingConstants;
import javax.swing.event.TableModelEvent;
import com.softcommerce.reglasnegocio.RnLocalidad;
import java.util.ArrayList;
import javax.swing.JFrame;
import javax.swing.JPanel;
import com.softcommerce.general.controles.JHInternal;
import com.softcommerce.general.herramientas.CFunciones;
import com.softcommerce.general.controles.CLabel;
import com.softcommerce.general.controles.CTable;
import com.softcommerce.general.controles.DoubleDocument;
import com.softcommerce.general.herramientas.DateTime;
import com.softcommerce.general.controles.IntegerDocument;
import com.softcommerce.general.controles.UpperCaseNumberDocument;
import java.awt.Dimension;
import java.awt.Toolkit;
import java.awt.event.FocusListener;
import java.awt.event.ItemListener;
import java.util.List;
import javax.swing.JCheckBox;
import javax.swing.JLabel;
import javax.swing.JScrollPane;
import javax.swing.event.TableModelListener;
import com.softcommerce.reglasnegocio.RnAnexo;
import com.softcommerce.general.tablas.NotaDebitoRegistroTableModel;
import com.softcommerce.logic.LogicRegContaCab;
import com.softcommerce.reglasnegocio.rn_MotivoNotaCredito;
import com.softcommerce.reglasnegocio.RnPuntoVenta;
import com.softcommerce.reglasnegocio.RnCorrelativo;
import com.softcommerce.reglasnegocio.RnParametro;
import com.softcommerce.reglasnegocio.RnParametroProv;
import com.softcommerce.reglasnegocio.RnRegContaCab;
import com.softcommerce.reglasnegocio.RnTipoCambio;
import com.softcommerce.reglasnegocio.RnTipoOperacion;
import com.softcommerce.report.Reporte;
import com.softcommerce.util.CompareDate;
import com.softcommerce.util.Constans;
import com.softcommerce.util.combo.LoadCombo;
import com.softcommerce.util.FEtxt;
import com.softcommerce.util.Util;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Calendar;
import java.util.GregorianCalendar;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.swing.JComboBox;
import javax.swing.JOptionPane;

public class UiRegisterNotaDebito
        extends JHInternal
        implements InterUiRegisterNotaDebito, KeyListener, ActionListener, FocusListener, ItemListener, TableModelListener {
    private final org.apache.log4j.Logger logger = org.apache.log4j.Logger.getLogger(UiRegisterNotaDebito.class);
    private static final long serialVersionUID = 1L;
    private CComboBox cbo_idlocalidad;
    private List<Localidad> x_idlocalidad;
    private JLabel lblFechaVenc;
    private JDateChooser dc_fechafin;
    private CComboBox cbo_idtipodocumento;
    private CComboBox cbo_idmovimiento;
    private List<BeanMotivoNota> x_idmovimiento;
    private CComboBox cbo_serie;
    private List<UsuarioCorrelativo> x_serie;
    private CComboBox cbo_idpuntoventa;
    private List<PuntoVenta> x_idpuntoventa;
    private CComboBox cbo_idmoneda;
    private List<BeanMoneda> xmoneda = new ArrayList();
    private JTextField txtTipoCambio;
    private JTextField txt_idregconta;
    private JTextField txt_tmpanexo;
    private JTextField txt_idanexo;
    private JTextField txt_tmpruc;
    private JTextField txt_noafecto;
    private JTextField txt_igv;
    private JTextField txt_afecto;
    private JTextField txt_total;
    private JTextField txt_monto;
    private JTextField txt_percepcion;
    private JTextField txt_idregconta_ref;
    private JTextField txt_tmpdireccion;
    private JTextField txt_glosa;
    private JTextField txt_preimpreso;
    private JTextField txt_preimpresoref;
    private JTextField txt_idtipooperacion;
    private JTextField txt_serieref;
    private JComboBox txt_idcondicionventa;
    private JDateChooser dc_fechainicio;
    private JButton btn_buscar;
    private Usuario usuario;
    private JFrame frame;
    private JCheckBox chk_igv;
    private JScrollPane scp_xdescuento;
    private NotaDebitoRegistroTableModel mdl_xdescuento;
    private CTable tbl_xdescuento;
    private JTextField txt_idconcepto;
    private JTextField txt_concepto;
    private JTextField txt_cuenta;
    private JButton btn_buscarconcepto;
    private JTextField txt_importe;
    private JTextField txt_importeIGV;
    private JLabel lblconcepto;
    private JLabel lblimporte;
    private JLabel lbligv;
    private JLabel lbltipooperacion;
    private JLabel lbl_condventa;
    private JButton btn_buscar_cliente;
    private Date fechaRef = new Date();
    private RegcontaCab beanReferencia;
    private ComboModelFormaPago modelFormaPago = new ComboModelFormaPago();

    public UiRegisterNotaDebito(UiPanelTFNotaDebito pnltfnotacredito, String title, Usuario usuario, JFrame frame) {
        super(title);
        this.usuario = usuario;
        this.frame = frame;
        inicialize();
    }

    private void inicialize() {
        super.pnlRegister.setPreferredSize(new Dimension(980, 485));
        super.setMaximizable(false);
        super.setSize(1020, 545);
        super.setLocation(((Toolkit.getDefaultToolkit().getScreenSize().width - getSize().width) / 2), (Toolkit.getDefaultToolkit().getScreenSize().height - getSize().height) / 20);

        Gif gif = new Gif();

        JPanel pnlDialog = new JPanel();
        pnlDialog.setLayout(null);
        pnlDialog.setBackground(new Color(245, 245, 245));

        JLabel lblMovimiento = new JLabel("Motivo");
        lblMovimiento.setBounds(20, 5, 60, 20);
        pnlDialog.add(lblMovimiento);

        cbo_idmovimiento = new CComboBox();
        cbo_idmovimiento.setFont(new Font(Font.SANS_SERIF, Font.BOLD, 9));
        cbo_idmovimiento.setBounds(65, 5, 325, 20);
        cbo_idmovimiento.addKeyListener(this);
        cbo_idmovimiento.addActionListener(this);
        pnlDialog.add(cbo_idmovimiento);

        JLabel lblSerie = new JLabel("NÂ°");
        lblSerie.setBounds(400, 5, 15, 20);
        pnlDialog.add(lblSerie);

        cbo_serie = new CComboBox();
        cbo_serie.setBounds(415, 5, 50, 20);
        cbo_serie.addKeyListener(this);
        cbo_serie.addActionListener(this);
        pnlDialog.add(cbo_serie);

        txt_preimpreso = new JTextField();
        txt_preimpreso.setBounds(470, 5, 100, 20);
        txt_preimpreso.addKeyListener(this);
        txt_preimpreso.setFont(new Font(Font.SANS_SERIF, Font.BOLD | Font.ITALIC, 12));
        txt_preimpreso.addFocusListener(this);
        txt_preimpreso.setDocument(new IntegerDocument(10));
        txt_preimpreso.setForeground(Color.BLACK);
        pnlDialog.add(txt_preimpreso);

        btn_buscar = new JButton(gif.SEARCH16);
        btn_buscar.setBounds(570, 5, 40, 20);
        btn_buscar.setToolTipText("Buscar Documento");
        btn_buscar.setContentAreaFilled(true);
        btn_buscar.setBorderPainted(true);
        btn_buscar.setFocusable(true);
        btn_buscar.setFocusPainted(false);
        btn_buscar.addActionListener(this);
        btn_buscar.addKeyListener(this);
        btn_buscar.registerKeyboardAction(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
            }
        }, KeyStroke.getKeyStroke(KeyEvent.VK_ENTER, 0, false), JComponent.WHEN_FOCUSED);
        pnlDialog.add(this.btn_buscar);

        txt_idregconta_ref = new JTextField();
        txt_idregconta_ref.setBounds(615, 5, 80, 20);
        txt_idregconta_ref.addKeyListener(this);
        txt_idregconta_ref.setFont(new Font(Font.SANS_SERIF, 0, 11));
        txt_idregconta_ref.addFocusListener(this);
        txt_idregconta_ref.setDocument(new IntegerDocument(10));
        txt_idregconta_ref.setForeground(Color.BLACK);
        txt_idregconta_ref.setEditable(false);
        pnlDialog.add(txt_idregconta_ref);

        cbo_idtipodocumento = new CComboBox();
        cbo_idtipodocumento.setBounds(700, 5, 120, 20);
        cbo_idtipodocumento.setFont(new Font(Font.SANS_SERIF, Font.BOLD, 9));
        cbo_idtipodocumento.addActionListener(this);
        cbo_idtipodocumento.addKeyListener(this);
        pnlDialog.add(cbo_idtipodocumento);

        txt_serieref = new JTextField();
        txt_serieref.setBounds(825, 5, 30, 20);
        txt_serieref.addKeyListener(this);
        txt_serieref.setFont(new Font(Font.SANS_SERIF, 0, 11));
        txt_serieref.addFocusListener(this);
        txt_serieref.setForeground(Color.BLACK);
        pnlDialog.add(txt_serieref);

        txt_preimpresoref = new JTextField();
        txt_preimpresoref.setBounds(860, 5, 80, 20);
        txt_preimpresoref.addKeyListener(this);
        txt_preimpresoref.setFont(new Font(Font.SANS_SERIF, 0, 11));
        txt_preimpresoref.addFocusListener(this);
        txt_preimpresoref.setDocument(new IntegerDocument(10));
        txt_preimpresoref.setForeground(Color.BLACK);
        pnlDialog.add(txt_preimpresoref);

        JLabel lblCodigo = new JLabel("Codigo");
        lblCodigo.setBounds(20, 30, 40, 20);
        pnlDialog.add(lblCodigo);

        txt_idregconta = new JTextField();
        txt_idregconta.setEditable(false);
        txt_idregconta.setBounds(65, 30, 90, 20);
        pnlDialog.add(txt_idregconta);

        cbo_idlocalidad = new CComboBox();
        cbo_idlocalidad.setFont(new Font(Font.SANS_SERIF, Font.BOLD, 9));
        cbo_idlocalidad.setBounds(160, 30, 190, 20);
        cbo_idlocalidad.addActionListener(this);
        cbo_idlocalidad.setEnabled(false);
        cbo_idlocalidad.addKeyListener(this);
        pnlDialog.add(cbo_idlocalidad);

        cbo_idpuntoventa = new CComboBox();
        cbo_idpuntoventa.setFont(new Font(Font.SANS_SERIF, Font.BOLD, 9));
        cbo_idpuntoventa.setBounds(360, 30, 210, 20);
        cbo_idpuntoventa.addActionListener(this);
        cbo_idpuntoventa.setEnabled(false);
        cbo_idpuntoventa.addKeyListener(this);
        pnlDialog.add(cbo_idpuntoventa);

        JLabel lbl_moneda = new JLabel("Moneda");
        lbl_moneda.setBounds(580, 30, 60, 20);
        pnlDialog.add(lbl_moneda);

        cbo_idmoneda = new CComboBox();
        cbo_idmoneda.setFont(new Font(Font.SANS_SERIF, Font.BOLD, 9));
        cbo_idmoneda.setBounds(640, 30, 150, 20);
        cbo_idmoneda.addActionListener(this);
        cbo_idmoneda.setEnabled(false);
        cbo_idmoneda.addKeyListener(this);
        pnlDialog.add(cbo_idmoneda);

        JLabel lbl_tcambio = new JLabel("T Cambio");
        lbl_tcambio.setBounds(790, 30, 70, 20);
        pnlDialog.add(lbl_tcambio);

        txtTipoCambio = new JTextField();
        txtTipoCambio.setBounds(860, 30, 70, 20);
        txtTipoCambio.addKeyListener(this);
        txtTipoCambio.setFont(new Font(Font.SANS_SERIF, 0, 11));
        txtTipoCambio.addFocusListener(this);
        txtTipoCambio.setDocument(new DoubleDocument());
        txtTipoCambio.setForeground(Color.BLACK);
        txtTipoCambio.setEditable(false);
        pnlDialog.add(txtTipoCambio);

        JLabel lblRazonSocial = new JLabel("Cliente");
        lblRazonSocial.setBounds(20, 55, 45, 20);
        pnlDialog.add(lblRazonSocial);

        txt_idanexo = new JTextField();
        txt_idanexo.setBounds(65, 55, 90, 20);
        txt_idanexo.addKeyListener(this);
        txt_idanexo.setEditable(false);
        pnlDialog.add(txt_idanexo);

        txt_tmpanexo = new JTextField();
        txt_tmpanexo.setBounds(160, 55, 350, 20);
        txt_tmpanexo.addKeyListener(this);
        txt_tmpanexo.setEditable(false);
        pnlDialog.add(txt_tmpanexo);

        JLabel lbl_RucCliente = new JLabel("RUC/DNI");
        lbl_RucCliente.setBounds(535, 55, 50, 20);
        pnlDialog.add(lbl_RucCliente);

        txt_tmpruc = new JTextField();
        txt_tmpruc.setBounds(585, 55, 120, 20);
        txt_tmpruc.addFocusListener(this);
        txt_tmpruc.setEditable(false);
        txt_tmpruc.addKeyListener(this);
        pnlDialog.add(txt_tmpruc);

        btn_buscar_cliente = new JButton(gif.SEARCH16);
        btn_buscar_cliente.setBounds(668, 55, 40, 20);
        btn_buscar_cliente.setToolTipText("Buscar Documento");
        btn_buscar_cliente.setContentAreaFilled(true);
        btn_buscar_cliente.setBorderPainted(true);
        btn_buscar_cliente.setFocusable(true);
        btn_buscar_cliente.setFocusPainted(false);
        btn_buscar_cliente.addActionListener(this);
        btn_buscar_cliente.addKeyListener(this);
        btn_buscar_cliente.registerKeyboardAction(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
            }
        }, KeyStroke.getKeyStroke(KeyEvent.VK_ENTER, 0, false), JComponent.WHEN_FOCUSED);
        pnlDialog.add(btn_buscar_cliente);
        btn_buscar_cliente.setVisible(false);

        JLabel lblDireccion = new JLabel("Direc");
        lblDireccion.setBounds(20, 80, 40, 20);
        pnlDialog.add(lblDireccion);

        txt_tmpdireccion = new JTextField();
        txt_tmpdireccion.setBounds(65, 80, 460, 20);
        txt_tmpdireccion.addKeyListener(this);
        txt_tmpdireccion.addFocusListener(this);
        txt_tmpdireccion.setEditable(true);
        txt_tmpdireccion.setHorizontalAlignment(SwingConstants.LEFT);
        txt_tmpdireccion.setDocument(new UpperCaseNumberDocument(255));
        pnlDialog.add(txt_tmpdireccion);

        lbltipooperacion = new JLabel("T Operacion");
        lbltipooperacion.setBounds(550, 80, 90, 20);
        pnlDialog.add(lbltipooperacion);

        txt_idtipooperacion = new JTextField();
        txt_idtipooperacion.setBounds(640, 80, 50, 20);
        txt_idtipooperacion.addKeyListener(this);
        txt_idtipooperacion.addFocusListener(this);
        txt_idtipooperacion.setEditable(true);
        txt_idtipooperacion.setHorizontalAlignment(SwingConstants.LEFT);
        txt_idtipooperacion.setDocument(new UpperCaseNumberDocument(255));
        pnlDialog.add(txt_idtipooperacion);
        txt_idtipooperacion.setEditable(false);

        lbl_condventa = new JLabel("Cond Venta");
        lbl_condventa.setBounds(700, 80, 100, 20);
        pnlDialog.add(lbl_condventa);

        txt_idcondicionventa = new JComboBox();
        txt_idcondicionventa.setBounds(790, 80, 50, 20);
        pnlDialog.add(txt_idcondicionventa);
        txt_idcondicionventa.setModel(modelFormaPago);
        txt_idcondicionventa.addItemListener(itemListener);
        JLabel lblGlosa = new JLabel("Glosa");
        lblGlosa.setBounds(20, 105, 40, 20);
        pnlDialog.add(lblGlosa);

        txt_glosa = new JTextField();
        txt_glosa.setBounds(65, 105, 460, 20);
        txt_glosa.addKeyListener(this);
        txt_glosa.addFocusListener(this);
        txt_glosa.setEditable(true);
        txt_glosa.setHorizontalAlignment(SwingConstants.LEFT);
        txt_glosa.setDocument(new UpperCaseNumberDocument(255));
        pnlDialog.add(txt_glosa);

        JLabel lblFechaEmision = new JLabel("Fec. Emi");
        lblFechaEmision.setDisplayedMnemonic('c');
        lblFechaEmision.setBounds(525, 105, 70, 20);
        pnlDialog.add(lblFechaEmision);

        dc_fechainicio = new JDateChooser("dd/MM/yyyy", "##/##/####", '_');
        dc_fechainicio.setBounds(595, 105, 105, 20);
        ((JTextFieldDateEditor) dc_fechainicio.getDateEditor()).addFocusListener(new FocusListener() {
            @Override
            public void focusGained(FocusEvent e) {
            }

            @Override
            public void focusLost(FocusEvent e) {
                try {
                    if (txt_idcondicionventa.getSelectedItem().toString().equalsIgnoreCase("CO")) {
                        dc_fechafin.setDate(dc_fechainicio.getDate());
                    }
                } catch (Exception ex) {
                }
            }
        });
        dc_fechainicio.getJCalendar().addFocusListener(this);
        dc_fechainicio.getJCalendar().addKeyListener(this);
        dc_fechainicio.getCalendarButton().addActionListener(this);
        dc_fechainicio.addKeyListener(this);
        dc_fechainicio.addFocusListener(this);
        pnlDialog.add(dc_fechainicio);

        lblFechaVenc = new JLabel("Fec. Venc");
        lblFechaVenc.setDisplayedMnemonic('c');
        lblFechaVenc.setBounds(700, 105, 70, 20);
        pnlDialog.add(lblFechaVenc);

        dc_fechafin = new JDateChooser("dd/MM/yyyy", "##/##/####", '_');
        dc_fechafin.setDate(new Date(Main.fechaActualServer.getTime()));
        dc_fechafin.setBounds(770, 105, 105, 20);
        ((JTextFieldDateEditor) dc_fechafin.getDateEditor()).addFocusListener(new FocusListener() {
            @Override
            public void focusGained(FocusEvent e) {
            }

            @Override
            public void focusLost(FocusEvent e) {
                try {
                    if (txt_idcondicionventa.getSelectedItem().toString().equalsIgnoreCase("CR")) {
                        if (dc_fechafin.getDate().compareTo(dc_fechainicio.getDate()) == -1) {
                            JOptionPane.showMessageDialog(null, "Fecha vencimiento menor a fecha de emisiÃ³n");
                            dc_fechafin.setDate(dc_fechainicio.getDate());
                        }
                    }
                } catch (Exception ex) {
                }
            }
        });
        dc_fechafin.getJCalendar().addFocusListener(this);
        dc_fechafin.getJCalendar().addKeyListener(this);
        dc_fechafin.getCalendarButton().addActionListener(this);
        dc_fechafin.addKeyListener(this);
        dc_fechafin.addFocusListener(this);
        pnlDialog.add(dc_fechafin);

        CLabel lblMAfecto = new CLabel("Afecto");
        lblMAfecto.setBounds(5, 385, 40, 20);
        lblMAfecto.setFont(new Font(Font.SANS_SERIF, 0, 11));
        pnlDialog.add(lblMAfecto);

        txt_afecto = new JTextField();
        txt_afecto.setBounds(45, 385, 100, 20);
        txt_afecto.setHorizontalAlignment(SwingConstants.RIGHT);
        txt_afecto.setFont(new Font(Font.SANS_SERIF, 1, 13));
        txt_afecto.addKeyListener(this);
        txt_afecto.setEditable(false);
        pnlDialog.add(txt_afecto);

        CLabel lblMNoAfecto = new CLabel("No Afecto");
        lblMNoAfecto.setBounds(170, 385, 60, 20);
        lblMNoAfecto.setFont(new Font(Font.SANS_SERIF, 0, 11));
        pnlDialog.add(lblMNoAfecto);

        txt_noafecto = new JTextField();
        txt_noafecto.setBounds(230, 385, 100, 20);
        txt_noafecto.setHorizontalAlignment(SwingConstants.RIGHT);
        txt_noafecto.setFont(new Font(Font.SANS_SERIF, 1, 13));
        txt_noafecto.addKeyListener(this);
        txt_noafecto.setEditable(false);
        pnlDialog.add(txt_noafecto);

        CLabel lblMIgv = new CLabel("Igv");
        lblMIgv.setBounds(360, 385, 20, 20);
        lblMIgv.setFont(new Font(Font.SANS_SERIF, 0, 11));
        pnlDialog.add(lblMIgv);

        txt_igv = new JTextField();
        txt_igv.setBounds(380, 385, 100, 20);
        txt_igv.setHorizontalAlignment(SwingConstants.RIGHT);
        txt_igv.setFont(new Font(Font.SANS_SERIF, 1, 13));
        txt_igv.addKeyListener(this);
        txt_igv.setEditable(false);
        pnlDialog.add(txt_igv);

        CLabel lblMonto = new CLabel("Monto");
        lblMonto.setBounds(510, 385, 40, 20);
        lblMonto.setFont(new Font(Font.SANS_SERIF, 0, 11));
        pnlDialog.add(lblMonto);

        txt_monto = new JTextField();
        txt_monto.setBounds(550, 385, 100, 25);
        txt_monto.addKeyListener(this);
        txt_monto.setFont(new Font(Font.SANS_SERIF, 1, 20));
        txt_monto.setEditable(false);
        txt_monto.setHorizontalAlignment(SwingConstants.RIGHT);
        txt_monto.setForeground(Color.RED);
        pnlDialog.add(txt_monto);

        JLabel lblMPercepcion = new JLabel("Perc");
        lblMPercepcion.setFont(new Font(Font.SANS_SERIF, 0, 11));
        lblMPercepcion.setForeground(Color.BLACK);
        lblMPercepcion.setBounds(670, 385, 25, 20);
        pnlDialog.add(lblMPercepcion);

        txt_percepcion = new JTextField();
        txt_percepcion.setBounds(695, 385, 120, 25);
        txt_percepcion.setHorizontalAlignment(SwingConstants.RIGHT);
        txt_percepcion.addKeyListener(this);
        txt_percepcion.setForeground(Color.BLUE);
        txt_percepcion.setFont(new Font(Font.SANS_SERIF, 1, 20));
        txt_percepcion.setEditable(false);
        pnlDialog.add(txt_percepcion);

        JLabel lblTotal = new JLabel("Total");
        lblTotal.setFont(new Font(Font.SANS_SERIF, 0, 11));
        lblTotal.setForeground(Color.BLACK);
        lblTotal.setBounds(805, 385, 30, 20);
        pnlDialog.add(lblTotal);

        txt_total = new JTextField();
        txt_total.setBounds(835, 385, 120, 25);
        txt_total.setHorizontalAlignment(SwingConstants.RIGHT);
        txt_total.addKeyListener(this);
        txt_total.setForeground(Color.darkGray);
        txt_total.setFont(new Font(Font.SANS_SERIF, 1, 20));
        txt_total.setEditable(false);
        pnlDialog.add(txt_total);

        mdl_xdescuento = new NotaDebitoRegistroTableModel();
        mdl_xdescuento.addTableModelListener(this);
        tbl_xdescuento = new CTable();
        tbl_xdescuento.setModel(mdl_xdescuento);
        tbl_xdescuento.addKeyListener(this);
        tbl_xdescuento.setAllColumnNoResizable();
        tbl_xdescuento.setAllTableNoEditable();
        tbl_xdescuento.setAllColumnPreferredWidth();
        scp_xdescuento = new JScrollPane(tbl_xdescuento);
        scp_xdescuento.setBounds(5, 152, 970, 223);
        pnlDialog.add(scp_xdescuento);

        lblconcepto = new JLabel("Concepto");
        lblconcepto.setFont(new Font(Font.SANS_SERIF, 0, 11));
        lblconcepto.setForeground(Color.BLACK);
        lblconcepto.setBounds(20, 152, 50, 20);
        pnlDialog.add(lblconcepto);

        txt_idconcepto = new JTextField();
        txt_idconcepto.setBounds(70, 152, 70, 20);
        txt_idconcepto.addKeyListener(this);
        txt_idconcepto.setFont(new Font(Font.SANS_SERIF, Font.BOLD | Font.ITALIC, 12));
        txt_idconcepto.addFocusListener(this);
        txt_idconcepto.setDocument(new IntegerDocument(10));
        txt_idconcepto.setForeground(Color.BLACK);
        txt_idconcepto.setEditable(false);
        pnlDialog.add(txt_idconcepto);

        txt_concepto = new JTextField();
        txt_concepto.setBounds(145, 152, 200, 20);
        txt_concepto.addKeyListener(this);
        txt_concepto.setFont(new Font(Font.SANS_SERIF, Font.BOLD | Font.ITALIC, 12));
        txt_concepto.addFocusListener(this);
        txt_concepto.setDocument(new UpperCaseNumberDocument(255));
        txt_concepto.setForeground(Color.BLACK);
        txt_concepto.setEditable(false);
        pnlDialog.add(txt_concepto);

        txt_cuenta = new JTextField();
        txt_cuenta.setBounds(350, 152, 85, 20);
        txt_cuenta.addKeyListener(this);
        txt_cuenta.setFont(new Font(Font.SANS_SERIF, Font.BOLD | Font.ITALIC, 12));
        txt_cuenta.addFocusListener(this);
        txt_cuenta.setDocument(new IntegerDocument(20));
        txt_cuenta.setForeground(Color.BLACK);
        txt_cuenta.setEditable(false);
        pnlDialog.add(txt_cuenta);

        btn_buscarconcepto = new JButton(gif.SEARCH16);
        btn_buscarconcepto.setBounds(440, 152, 40, 20);
        btn_buscarconcepto.setToolTipText("Buscar Documento");
        btn_buscarconcepto.setContentAreaFilled(true);
        btn_buscarconcepto.setBorderPainted(true);
        btn_buscarconcepto.setFocusable(true);
        btn_buscarconcepto.setFocusPainted(false);
        btn_buscarconcepto.addActionListener(this);
        btn_buscarconcepto.addKeyListener(this);
        btn_buscarconcepto.registerKeyboardAction(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
            }
        }, KeyStroke.getKeyStroke(KeyEvent.VK_ENTER, 0, false), JComponent.WHEN_FOCUSED);
        pnlDialog.add(btn_buscarconcepto);

        lblimporte = new JLabel("Importe");
        lblimporte.setFont(new Font(Font.SANS_SERIF, 0, 11));
        lblimporte.setForeground(Color.BLACK);
        lblimporte.setBounds(20, 177, 50, 20);
        pnlDialog.add(lblimporte);

        txt_importe = new JTextField();
        txt_importe.setBounds(80, 177, 100, 20);
        txt_importe.addKeyListener(this);
        txt_importe.setFont(new Font(Font.SANS_SERIF, Font.BOLD | Font.ITALIC, 12));
        txt_importe.addFocusListener(this);
        txt_importe.setDocument(new DoubleDocument());
        txt_importe.setForeground(Color.BLACK);
        pnlDialog.add(txt_importe);

        chk_igv = new JCheckBox("Incluye IGV");
        chk_igv.setBounds(185, 177, 150, 20);
        chk_igv.addItemListener(this);
        chk_igv.setFont(new Font("Verdana", 1, 11));
        chk_igv.addKeyListener(this);
        chk_igv.setHorizontalTextPosition(SwingConstants.LEFT);
        chk_igv.addFocusListener(this);
        chk_igv.setOpaque(false);
        chk_igv.setVisible(false);
        pnlDialog.add(chk_igv);

        lbligv = new JLabel("IGV");
        lbligv.setFont(new Font(Font.SANS_SERIF, 0, 11));
        lbligv.setForeground(Color.BLACK);
        lbligv.setBounds(20, 203, 50, 20);
        pnlDialog.add(lbligv);

        txt_importeIGV = new JTextField();
        txt_importeIGV.setBounds(80, 203, 100, 20);
        txt_importeIGV.addKeyListener(this);
        txt_importeIGV.setFont(new Font(Font.SANS_SERIF, Font.BOLD | Font.ITALIC, 12));
        txt_importeIGV.addFocusListener(this);
        txt_importeIGV.setDocument(new DoubleDocument());
        txt_importeIGV.setForeground(Color.BLACK);
        pnlDialog.add(txt_importeIGV);

        setTitleName("Nota de Debito");
        setRegister(pnlDialog);
    }
    ItemListener itemListener = new ItemListener() {
        @Override
        public void itemStateChanged(ItemEvent e) {
            if (txt_idcondicionventa.equals(e.getSource())) {
                try {
                    if (txt_idcondicionventa.getSelectedItem().toString().equalsIgnoreCase("CO")) {
                        dc_fechafin.setVisible(false);
                        lblFechaVenc.setVisible(false);
                    } else if (txt_idcondicionventa.getSelectedItem().toString().equalsIgnoreCase("CR")) {
                        dc_fechafin.setVisible(true);
                        lblFechaVenc.setVisible(true);
                    }
                } catch (Exception ex) {
                    dc_fechafin.setVisible(false);
                    lblFechaVenc.setVisible(false);
                }
            }
        }
    };

    @Override
    public void loadCombo() {
        loadMovimiento();
        loadLocalidad(usuario.getCodempresa());
        loadtipoDocumento();
        loadMoneda();
    }

    public void loadMovimiento() {
        rn_MotivoNotaCredito regla = new rn_MotivoNotaCredito(path);

        if (x_idmovimiento != null) {
            x_idmovimiento.clear();
        } else {
            x_idmovimiento = new ArrayList<BeanMotivoNota>();
        }

        BeanMotivoNota m = new BeanMotivoNota();
        m.setFlag("Y");

        x_idmovimiento.addAll(regla.listar(m));

        cbo_idmovimiento.removeAllItems();

        for (int i = 0; i < x_idmovimiento.size(); i++) {
            cbo_idmovimiento.addItem(x_idmovimiento.get(i).getDescripcion());
        }

        if (cbo_idmovimiento.getItemCount() > 0) {
            cbo_idmovimiento.setSelectedIndex(0);
        }
    }

    public void loadLocalidad(String xcodEmpres) {
        try {
            RnLocalidad regla_Localidad = new RnLocalidad(path);

            if (x_idlocalidad != null) {
                x_idlocalidad.clear();
            } else {
                x_idlocalidad = new ArrayList<Localidad>();
            }

            x_idlocalidad.addAll(regla_Localidad.listar("", xcodEmpres, "", "", ""));

            cbo_idlocalidad.removeAllItems();
            cbo_idlocalidad.addItem("--- Seleccione una Localidad ---");

            for (int i = 0; i < x_idlocalidad.size(); i++) {
                cbo_idlocalidad.addItem(x_idlocalidad.get(i).getDescripcion());
            }

            if (cbo_idlocalidad.getItemCount() > 0) {
                cbo_idlocalidad.setSelectedIndex(0);
            }
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }

    public void loadPuntoVenta(String xcodLocalidad) {
        try {
            RnPuntoVenta regla_PuntoVenta = new RnPuntoVenta(path);

            if (x_idpuntoventa != null) {
                x_idpuntoventa.clear();
            } else {
                x_idpuntoventa = new ArrayList<PuntoVenta>();
            }

            x_idpuntoventa.addAll(regla_PuntoVenta.listar("", "", xcodLocalidad, "", "", "", "", ""));

            cbo_idpuntoventa.removeAllItems();
            cbo_idpuntoventa.addItem("--- Seleccione un Punto de Venta ---");

            for (int i = 0; i < x_idpuntoventa.size(); i++) {
                cbo_idpuntoventa.addItem(x_idpuntoventa.get(i).getDescripcion_puntoventa());
            }

            if (cbo_idpuntoventa.getItemCount() > 0) {
                cbo_idpuntoventa.setSelectedIndex(0);
            }
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }

    public void loadtipoDocumento() {
        cbo_idtipodocumento.removeAllItems();
        cbo_idtipodocumento.addItem("BOLETA DE VENTA");
        cbo_idtipodocumento.addItem("FACTURA");

        if (cbo_idtipodocumento.getItemCount() > 0) {
            cbo_idtipodocumento.setSelectedIndex(0);
        }
    }

    public void loadMoneda() {
        try {
            LoadCombo.loadMoneda(path, xmoneda, cbo_idmoneda,
                    Constans.ITEM_INIT_MONEDA, 0);
        } catch (Exception ex) {
            JOptionPane.showMessageDialog(this, ex.getMessage());
        }
    }

    @Override
    public void newRegister() {
        try {
            if (mode == INSERT) {
                JTextField txt = new JTextField();
                cbo_idmovimiento.setBorder(txt.getBorder());
                txt_preimpreso.setBorder(txt.getBorder());
                dc_fechainicio.setBorder(new JDateChooser().getBorder());
                cbo_serie.setBorder(txt.getBorder());
                scp_xdescuento.setBorder(txt.getBorder());
                scp_xdescuento.setBorder(txt.getBorder());
                txt_serieref.setBorder(txt.getBorder());
                txt_preimpresoref.setBorder(txt.getBorder());

                txt_idtipooperacion.setText("");
                txt_tmpdireccion.setText("");
                txt_idregconta_ref.setText("");
                txt_idanexo.setText("");
                txt_preimpreso.setText("");
                txt_serieref.setText("");
                txt_preimpresoref.setText("");
                txt_idregconta.setText("");
                dc_fechainicio.setDate(new Date(Main.fechaActualServer.getTime()));
                txt_afecto.setText("0.0");
                txt_noafecto.setText("0.0");
                txt_igv.setText("0.0");
                txt_total.setText("0.0");
                txt_percepcion.setText("0.0");
                txt_monto.setText("0.0");
                txt_glosa.setText(cbo_idmovimiento.getSelectedItem().toString());

                if (cbo_idmovimiento.getSelectedItem().toString().trim().equals("OTROS COSTOS Y GASTOS")) {
                    cargarLocalidad(usuario.getCodlocalidad());
                    cargarPuntoVenta(usuario.getCodpuntoventa());
                    txt_tmpruc.setText(usuario.getRuc());
                    txt_tmpanexo.setText(usuario.getDescriempresa());
                    txt_idanexo.setText("0000000001");
                    txt_tmpdireccion.setText(usuario.getDireccion());
                    cbo_idmoneda.setSelectedItem("NUEVO SOL");
                    chk_igv.setSelected(true);
                    RnTipoCambio logicTc = new RnTipoCambio(path);
                    BeanTipoCambio beanTc = logicTc.getBeanTipoCambio(new java.sql.Date(dc_fechainicio.getDate().getTime()),
                            xmoneda.get(cbo_idmoneda.getSelectedIndex() - 1).getIdMoneda());
                    txtTipoCambio.setText(beanTc == null ? "0.0" : beanTc.getMontocompra().toString());
                } else {
                    if (cbo_idlocalidad.getItemCount() > 0) {
                        cbo_idlocalidad.setSelectedIndex(0);
                    }
                    if (cbo_idpuntoventa.getItemCount() > 0) {
                        cbo_idpuntoventa.setSelectedIndex(0);
                    }
                    if (cbo_idmoneda.getItemCount() > 0) {
                        cbo_idmoneda.setSelectedIndex(0);
                    }
                    if (cbo_idtipodocumento.getItemCount() > 0) {
                        cbo_idtipodocumento.setSelectedIndex(0);
                    }
                    txt_tmpruc.setText("");
                    txt_tmpanexo.setText("");
                    txt_idanexo.setText("");
                    txt_tmpdireccion.setText("");
                    txtTipoCambio.setText("");
                }

                if (cbo_idmovimiento.getItemCount() > 0) {
                    if (cbo_serie.getItemCount() <= 0) {
                        loadSerieCorrelativo("08");
                    }
                }

                if (cbo_serie.getItemCount() > 0) {
                    if (txt_preimpreso.getText().trim().length() < 10) {
                        mostrarPreimpreso();
                    }
                }

                mdl_xdescuento.clearTable();
                tbl_xdescuento.setAllColumnPreferredWidth();
            }
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }

    public void setFormato(String cod) {
        boolean e = false;
        scp_xdescuento.setVisible(cod.equals("012") ? !e : e);
        lblconcepto.setVisible(cod.equals("011") ? !e : e);
        txt_idconcepto.setVisible(cod.equals("011") ? !e : e);
        txt_concepto.setVisible(cod.equals("011") ? !e : e);
        txt_cuenta.setVisible(cod.equals("011") ? !e : e);
        btn_buscarconcepto.setVisible(cod.equals("011") ? !e : e);
        txt_importe.setVisible(cod.equals("011") ? !e : e);
        lbligv.setVisible(cod.equals("011") ? false : e);
        txt_importeIGV.setVisible(cod.equals("011") ? false : e);
        chk_igv.setVisible(cod.equals("011") ? false : e);
        newRegister();
    }

    public void cargarMoneda(String codMoneda) {
        if (xmoneda != null && !codMoneda.equals("")) {
            for (int i = 0; i < xmoneda.size(); i++) {
                if (xmoneda.get(i).getIdMoneda().equals(codMoneda)) {
                    cbo_idmoneda.setSelectedIndex(i + 1);
                    break;
                }
            }
        }
    }

    public void cargarLocalidad(String xcodiLocalidad) {
        if (x_idlocalidad != null && !xcodiLocalidad.equals("")) {
            for (int i = 0; i < x_idlocalidad.size(); i++) {
                if (x_idlocalidad.get(i).getId_localidad().equals(xcodiLocalidad)) {
                    cbo_idlocalidad.setSelectedIndex(i + 1);
                    break;
                }
            }
        }
    }

    public void cargarPuntoVenta(String codPuntoVenta) {
        if (x_idpuntoventa != null && !codPuntoVenta.equals("")) {
            for (int i = 0; i < x_idpuntoventa.size(); i++) {
                if (x_idpuntoventa.get(i).getId_punto_venta().equals(codPuntoVenta)) {
                    cbo_idpuntoventa.setSelectedIndex(i + 1);
                    break;
                }
            }
        }
    }

    @Override
    public void setValueSearch(Object valor, Component comp) {
        if (comp == btn_buscar_cliente) {
            Anexo a = new Anexo();
            a.setNumeroInicial(-1);
            a.setNumeroFinal(-1);
            a.setIdAnexo(valor.toString().trim());
            a.setIdTipoAnexo("2");
            a.setIdEmpresa(usuario.getCodempresa());
            cargarCliente(a);
        }

        if (comp == btn_buscar) {
            ContaCab r = new ContaCab();
            r.setRcIdregconta(valor.toString().trim());
            r.setFEmision(DateTime.format(1901, 0, 1));
            r.setFInicial(DateTime.format(1901, 0, 1));
            r.setFFinal(DateTime.format(1901, 0, 1));
            cargarDocumentoReferencia(r);
        }

        if (comp == btn_buscarconcepto) {
            cargarConcepto(valor.toString().trim());
        }
    }

    private void cargarCliente(Anexo a) {
        try {
            RnAnexo regla = new RnAnexo(path);
            List<Anexo> reg = regla.listarAnexo(a);

            if (reg != null && reg.size() > 0) {
                Anexo cliente = reg.get(0);

                txt_tmpdireccion.setText(cliente.getDireccion());
                txt_tmpanexo.setText(cliente.getDescripcion());
                txt_tmpruc.setText(cliente.getNumerodoc());
                txt_idanexo.setText(cliente.getIdAnexo());
            }
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }

    private void cargarConcepto(String id_parametro_prov) {
        try {
            RnParametroProv regla = new RnParametroProv(path);
            List<BeanParametroProv> reg = regla.listarParametroProv(id_parametro_prov, "", "", "", "", "", "");

            if (reg != null && reg.size() > 0) {
                BeanParametroProv regContaCab = reg.get(0);

                txt_idconcepto.setText(regContaCab.getId_parametro_prov());
                txt_concepto.setText(regContaCab.getDescripcion());
                txt_cuenta.setText(regContaCab.getId_cuenta());
            }
        } catch (Exception e) {
            e.printStackTrace();
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }

    @Override
    public boolean loadRegister() {
        try {
            ContaCab m = new ContaCab();
            m.setRcIdregconta(rowSelection.getSelectedValue(1).toString());
            m.setFEmision(DateTime.format(1901, 0, 1));
            m.setFInicial(DateTime.format(1901, 0, 1));
            m.setFFinal(DateTime.format(1901, 0, 1));

            RnRegContaCab regla = new RnRegContaCab(path);

            List<ContaCab> reg = regla.listarDocumentosVenta(m);

            if (reg.isEmpty()) {
                return false;
            } else {
                ContaCab r = reg.get(0);
                cbo_serie.addItem(r.getSerie());
                cbo_idtipodocumento.setSelectedItem(r.getIdTipoDoc().equals("01") ? "FACTURA" : "BOLETA DE VENTA");
                txt_idanexo.setText(r.getAnIdanexo());
                txt_tmpanexo.setText(r.getAnTmpanexo());
                txt_tmpruc.setText(r.getAnTmpruc());
                dc_fechainicio.setDate(r.getFEmision());
                txt_idregconta.setText(r.getRcIdregconta());
                txt_preimpreso.setText(r.getPreimpreso());
                txt_glosa.setText(r.getGlosa());
                txt_tmpdireccion.setText(r.getAnTmpdireccion());
                txtTipoCambio.setText(String.valueOf(r.getMTipoCambio()));
                txt_idtipooperacion.setText(r.getIdTipoOperacion());
                txt_idcondicionventa.setSelectedItem(r.getTipoCondpago());
                txt_idcondicionventa.setEnabled(false);
                cargarLocalidad(r.getIdLocalidad());
                cargarPuntoVenta(r.getIdPuntoventa());
                cargarMoneda(r.getIdMoneda());
                txt_igv.setText(String.valueOf(r.getMIgv()));
                txt_idregconta_ref.setText(r.getRcIdregconta());
                txt_serieref.setText(r.getSerie());
                txt_preimpresoref.setText(r.getPreimpreso());
                RnRegContaCab regla_det = new RnRegContaCab(path);
                mdl_xdescuento.clearTable();
                mdl_xdescuento.agregarVectorVentaDirecta(regla_det.listarRegContaDet(m));
                tbl_xdescuento.setNoVisibleColumn(6);
                tbl_xdescuento.setNoVisibleColumn(7);
                tbl_xdescuento.setNoVisibleColumn(8);
                tbl_xdescuento.setNoVisibleColumn(10);
                tbl_xdescuento.setNoVisibleColumn(11);
                tbl_xdescuento.setNoVisibleColumn(14);
                tbl_xdescuento.setNoVisibleColumn(15);
                tbl_xdescuento.setNoVisibleColumn(16);
                tbl_xdescuento.setNoVisibleColumn(17);
                tbl_xdescuento.setNoVisibleColumn(18);
                tbl_xdescuento.setNoVisibleColumn(19);
                tbl_xdescuento.setNoVisibleColumn(20);
                tbl_xdescuento.setNoVisibleColumn(21);
                tbl_xdescuento.setNoVisibleColumn(22);
                tbl_xdescuento.setNoVisibleColumn(23);
                tbl_xdescuento.setNoVisibleColumn(24);
                tbl_xdescuento.setNoVisibleColumn(25);
                tbl_xdescuento.setNoVisibleColumn(26);
                tbl_xdescuento.setNoVisibleColumn(27);
                tbl_xdescuento.setAllColumnPreferredWidth();
            }

            return true;
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, e.getMessage());
            return false;
        }
    }

    private void cargarDocumentoReferencia(ContaCab r) {
        try {
            RnRegContaCab regla = new RnRegContaCab(path);
            List<ContaCab> reg = regla.listarDocumentosVenta(r);

            if (reg != null && reg.size() > 0) {
                ContaCab regContaCab = reg.get(0);
                LogicRegContaCab log = new LogicRegContaCab(path);
                beanReferencia = log.getRegcontaCab(regContaCab.getRcIdregconta());
                fechaRef = regContaCab.getFEmision();
                cbo_idtipodocumento.setSelectedItem(regContaCab.getIdTipoDoc().equals("01") ? "FACTURA" : "BOLETA DE VENTA");
                txt_idregconta_ref.setText(regContaCab.getRcIdregconta());
                txt_serieref.setText(regContaCab.getSerie());
                txt_preimpresoref.setText(regContaCab.getPreimpreso());
                txt_idanexo.setText(regContaCab.getAnIdanexo());
                txt_tmpanexo.setText(regContaCab.getAnTmpanexo());
                txt_tmpruc.setText(regContaCab.getAnTmpruc());
                txt_tmpdireccion.setText(regContaCab.getAnTmpdireccion());
                txt_idtipooperacion.setText(regContaCab.getIdTipoOperacion());
                txt_idcondicionventa.setSelectedItem(regContaCab.getTipoCondpago().equalsIgnoreCase("TA") ? "CR" : regContaCab.getTipoCondpago());
                cargarLocalidad(regContaCab.getIdLocalidad());
                cargarPuntoVenta(usuario.getCodpuntoventa());
                cargarMoneda(regContaCab.getIdMoneda());
                txt_afecto.setText(String.valueOf(regContaCab.getMAfecto()));
                txt_noafecto.setText(String.valueOf(regContaCab.getMNoafecto()));
                txt_igv.setText(String.valueOf(regContaCab.getMIgv()));
                txt_percepcion.setText(String.valueOf(regContaCab.getMPercepcion()));
                txt_monto.setText(String.valueOf(regContaCab.getMonto()));
                txt_total.setText(String.valueOf(regContaCab.getTotal()));
                txt_idcondicionventa.setSelectedItem(regContaCab.getTipoCondpago().equalsIgnoreCase("TA") ? "CR" : regContaCab.getTipoCondpago());
                if (regContaCab.getTipoCondpago().equalsIgnoreCase("TA") || regContaCab.getTipoCondpago().equalsIgnoreCase("CR")) {
                    txt_idcondicionventa.setEnabled(false);
                } else {
                    try {
                        java.util.Date fechaActual = new java.util.Date(Main.fechaActualServer.getTime());
                        CompareDate compare = new CompareDate(regContaCab.getFEmision(), fechaActual);
                        int validar = compare.validarFechas();
                        if (validar == 0) {
                            txt_idcondicionventa.setEnabled(true);
                        } else if (validar == 1) {
                            txt_idcondicionventa.setSelectedItem("CR");
                            txt_idcondicionventa.setEnabled(false);
                        } else {
                            txt_idcondicionventa.setSelectedItem(null);
                            JOptionPane.showMessageDialog(null, "Fecha de Documento venta \nMayor a fecha Actual");
                            txt_idcondicionventa.setEnabled(false);
                        }

                    } catch (Exception ex) {
                        JOptionPane.showMessageDialog(null, ex.getMessage());
                    }
                }
                txtTipoCambio.setText(beanReferencia.getmTipoCambio().toString());

                List<ContaItem> v = new ArrayList<ContaItem>();
                v.addAll(regla.listarDocumentoNotaDebito(r));
                mdl_xdescuento.clearTable();
                mdl_xdescuento.agregarVectorVentaDirecta(v);
                tbl_xdescuento.setAllColumnPreferredWidth();
            }
        } catch (ClassNotFoundException ex) {
            System.out.println(ex.getMessage());
        } catch (InstantiationException ex) {
            System.out.println(ex.getMessage());
        } catch (IllegalAccessException ex) {
            System.out.println(ex.getMessage());
        } catch (Exception ex) {
            System.out.println(ex.getMessage());
        }

    }

    @Override
    public void itemStateChanged(ItemEvent e) {
        boolean isSelect;

        isSelect = (e.getStateChange() == ItemEvent.SELECTED);

        if (e.getItemSelectable() == chk_igv) {
            calcularMontos();
        }
    }

    @Override
    public void keyReleased(KeyEvent e) {
        if (e.getSource() == txt_importe) {
            calcularMontos();
        }
    }

    private void calcularMontos() {
        try {
            BeanParametro param = new BeanParametro();
            param.setNombre("IGV VENTA");
            RnParametro reg = new RnParametro(path);
            List<BeanParametro> a = reg.listarParametro(param);
            Double p_igv = new Double(1);
            if (a != null && a.size() > 0) {
                p_igv = Double.valueOf(a.get(0).getValor());
                p_igv = p_igv / 100;
            }
            txt_monto.setText(String.valueOf((txt_importe.getText().trim().length() > 0 ? Double.valueOf(txt_importe.getText().trim()) : 0.0)));
            txt_total.setText(String.valueOf((txt_importe.getText().trim().length() > 0 ? Double.valueOf(txt_importe.getText().trim()) : 0.0)));
            txt_afecto.setText(chk_igv.isSelected() ? String.valueOf((txt_monto.getText().trim().length() > 0 ? Double.valueOf(txt_monto.getText().trim()) / (1 + p_igv) : 0.0)) : "0.0");
            txt_afecto.setText(BigDecimal.valueOf(Double.parseDouble(txt_afecto.getText())).setScale(4, RoundingMode.HALF_UP).toString());
            txt_importeIGV.setText(chk_igv.isSelected() ? String.valueOf((txt_afecto.getText().trim().length() > 0 ? Double.valueOf(txt_afecto.getText().trim()) * p_igv : 0.0)) : "0.0");
            txt_importeIGV.setText(BigDecimal.valueOf(Double.parseDouble(txt_importeIGV.getText())).setScale(4, RoundingMode.HALF_UP).toString());
            txt_igv.setText(txt_importeIGV.getText().trim());
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }

    public void mostrarPreimpreso() {
        try {
            RnCorrelativo regla_correlativo = new RnCorrelativo(path);
            String preimpreso = regla_correlativo.listarPreimpreso(x_serie.get(cbo_serie.getSelectedIndex()).getIdCorrelativo());
            txt_preimpreso.setText(Util.getPreimpresoValue(preimpreso));
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }

    private String getNameFile(String idTipoDoc, ContaCab beanRcc) {
        return this.usuario.getRuc() + "-" + idTipoDoc + "-" + beanRcc.getSerie() + "-" + beanRcc.getPreimpreso8Digs();
    }

    private void exportarTxt(ContaCab beanRcc) {
        try {
            FEtxt feTxt = new FEtxt(path, this.getNameFile(beanRcc.getIdTipoDoc(), beanRcc));
            feTxt.exportarTxt(beanRcc.getIdTipoDoc(), beanRcc.getSerie(), beanRcc.getPreimpreso());
            JOptionPane.showMessageDialog(null, "Comprobante electrÃ³nico fue generada");
        } catch (Exception e) {
            JOptionPane.showMessageDialog(null, "No se exporto TXT");
        }
    }

    @Override
    public String executeInsert() {
        try {
            //012 - DEV. DE MERCADERIA POR CAMBIO DE PRECIO
            if (x_idmovimiento.get(cbo_idmovimiento.getSelectedIndex()).getId_motivo().equals("012")) {
                if (txt_idcondicionventa.getSelectedItem() == null) {
                    return "errorCV";
                }
                if (txt_idcondicionventa.getSelectedItem().toString().trim().equalsIgnoreCase("CR")) {
                    Calendar calEmision = new GregorianCalendar();
                    calEmision.setTime(dc_fechainicio.getDate());
                    Calendar calVencimiento = new GregorianCalendar();
                    calVencimiento.setTime(dc_fechafin.getDate());
                    int annoInicio = calEmision.get(Calendar.YEAR);
                    int mesInicio = calEmision.get(Calendar.MONTH);
                    int diaInicio = calEmision.get(Calendar.DAY_OF_MONTH);
                    int annoFin = calVencimiento.get(Calendar.YEAR);
                    int mesFin = calVencimiento.get(Calendar.MONTH);
                    int diaFin = calVencimiento.get(Calendar.DAY_OF_MONTH);
                    if (annoFin == annoInicio) {
                        if (mesFin == mesInicio) {
                            if (diaFin >= diaInicio) {
                            } else {
                                return "errorfecha";
                            }
                        } else if (mesFin > mesInicio) {
                        } else {
                            return "errorfecha";
                        }
                    } else if (annoFin > annoInicio) {
                    } else {
                        return "errorfecha";
                    }
                }
                if (txt_idcondicionventa.getSelectedItem().toString().trim().equals("CO")) {
                    TipoOperacion param = new TipoOperacion();
                    String id_moneda = cbo_idmoneda.getSelectedIndex() > 0 ? xmoneda.get(cbo_idmoneda.getSelectedIndex() - 1).getIdMoneda() : "";
                    if (id_moneda.trim().equalsIgnoreCase("00001")) {
                        param.setDescripcion("ND VENTAS MERCADERIA CONTADO");
                    } else if (id_moneda.trim().equalsIgnoreCase("00004")) {
                        param.setDescripcion("ND VENTAS MERCADERIA CONTADO ME");
                    }
                    param.setId_empresa(usuario.getCodempresa());
                    param.setTasa(-1);
                    param.setTasa_d(-1);
                    param.setTasa_p(-1);

                    RnTipoOperacion reg = new RnTipoOperacion(path);
                    List<TipoOperacion> a = reg.listarTipoOperacion(param);

                    ContaCab r = new ContaCab();

                    r.setIdTipoOperacion((a != null && a.size() > 0) ? a.get(0).getCodigo() : "");
                    r.setIdEmpresa(usuario.getCodempresa());
                    r.setIdLocalidad(x_idlocalidad.get(cbo_idlocalidad.getSelectedIndex() - 1).getId_localidad());
                    r.setIdPuntoventa(cbo_idpuntoventa.getSelectedIndex() > 0 ? (x_idpuntoventa.get(cbo_idpuntoventa.getSelectedIndex() - 1).getId_punto_venta()) : "");
                    r.setIdRegcontaRef(txt_idregconta_ref.getText().trim());
                    r.setIdTipoDocRef(cbo_idtipodocumento.getSelectedItem().toString().equalsIgnoreCase("FACTURA") ? "01" : cbo_idtipodocumento.getSelectedItem().toString().equalsIgnoreCase("BOLETA DE VENTA") ? "03" : "");
                    r.setSerieRef(txt_serieref.getText().trim());
                    r.setPreimpresoRef(txt_preimpresoref.getText().trim());
                    r.setAnIdanexo(txt_idanexo.getText().trim());
                    r.setAnIdtipoanexo("2");
                    r.setIdTipoDoc("08");
                    r.setSerie(x_serie.get(cbo_serie.getSelectedIndex()).getSerie());
                    r.setPreimpreso(txt_preimpreso.getText().trim());
                    r.setAnTmpanexo(txt_tmpanexo.getText().trim());
                    r.setAnTmpdireccion(txt_tmpdireccion.getText().trim());
                    r.setAnTmpruc(txt_tmpruc.getText().trim());
                    r.setGlosa(txt_glosa.getText().trim());
                    r.setIdUsuario(usuario.getId_usuario());
                    r.setIdMotivoNc(x_idmovimiento.get(cbo_idmovimiento.getSelectedIndex()).getId_motivo());
                    r.setMovDet(scp_xdescuento.isVisible() ? mdl_xdescuento.getData() : (scp_xdescuento.isVisible() ? mdl_xdescuento.getData() : mdl_xdescuento.getData()));
                    r.setIdMoneda(cbo_idmoneda.getSelectedIndex() > 0 ? xmoneda.get(cbo_idmoneda.getSelectedIndex() - 1).getIdMoneda() : "");
                    r.setMDescuento(0.0);
                    r.setMAfecto(Double.valueOf(txt_afecto.getText().trim()));
                    r.setMNoafecto(Double.valueOf(txt_noafecto.getText().trim()));
                    r.setMIgv(Double.valueOf(txt_igv.getText().trim()));
                    r.setMonto(Double.valueOf(txt_monto.getText().trim()));
                    r.setIdEstado("005");
                    r.setIdTrabajador(usuario.getId_trabajador());
                    r.setMTipoCambio(Double.valueOf(txtTipoCambio.getText().trim()));
                    r.setFEmision(dc_fechainicio.getDate());
                    r.setFAnulacion(DateTime.format(0, 0, 0));
                    r.setFCancelacion(DateTime.format(0, 0, 0));
                    r.setFContable(dc_fechainicio.getDate());
                    r.setFDetraccion(DateTime.format(0, 0, 0));
                    r.setFDiferida(DateTime.format(0, 0, 0));
                    r.setFVencimiento(txt_idcondicionventa.getSelectedItem().toString().trim().equalsIgnoreCase("CO") ? dc_fechainicio.getDate() : dc_fechafin.getDate());
                    r.setIdAuxiliar("00070");
                    r.setAnio(((JTextFieldDateEditor) dc_fechainicio.getDateEditor()).getText().substring(6, 10));
                    r.setMes(((JTextFieldDateEditor) dc_fechainicio.getDateEditor()).getText().substring(3, 5));
                    r.setIdCondicionVenta(txt_idcondicionventa.getSelectedItem().toString().trim().equalsIgnoreCase("CO") ? "17" : txt_idcondicionventa.getSelectedItem().toString().trim().equalsIgnoreCase("CR") ? "22" : txt_idcondicionventa.getSelectedItem().toString().trim().equalsIgnoreCase("OB") ? "26" : "");
                    r.setIdTipoPago(((txt_idcondicionventa.getSelectedItem().toString().trim() != null) && (txt_idcondicionventa.getSelectedItem().toString().trim().equals("CO"))) ? "001" : "");
                    r.setFechaRef(fechaRef);
                    r.setMPercepcion(Double.valueOf(txt_percepcion.getText().trim()));
                    r.setIdCorrelativo(x_serie.get(cbo_serie.getSelectedIndex()).getIdCorrelativo());
                    RnRegContaCab regla = new RnRegContaCab(path);
                    try {
                        String idReconta = regla.insertarNotaDebitoDevdeMercaderiaxCambioPrecio(r);
                        if (!Constans.ISIMPRESIONVENTA) {
                            if (Integer.parseInt(idReconta) > 0) {
                                exportarTxt(r);
                            }else{
                                System.err.println("Error: "+idReconta);
                                logger.debug(idReconta);
                            }
                        }
                        return idReconta;
                    } catch (Exception ex) {
                        Logger.getLogger(UiRegisterNotaDebito.class.getName()).log(Level.SEVERE, null, ex);
                        JOptionPane.showMessageDialog(null, ex.getMessage());
                        return null;
                    }
                } else {
                    TipoOperacion param = new TipoOperacion();
                    String id_moneda = cbo_idmoneda.getSelectedIndex() > 0 ? xmoneda.get(cbo_idmoneda.getSelectedIndex() - 1).getIdMoneda() : "";
                    if (id_moneda.trim().equalsIgnoreCase("00001")) {
                        param.setDescripcion("ND VENTAS MERCADERIA CREDITO");
                    } else if (id_moneda.trim().equalsIgnoreCase("00004")) {
                        param.setDescripcion("ND VENTAS MERCADERIA CREDITO ME");
                    }
                    param.setId_empresa(usuario.getCodempresa());
                    param.setTasa(-1);
                    param.setTasa_d(-1);
                    param.setTasa_p(-1);

                    RnTipoOperacion reg = new RnTipoOperacion(path);
                    List<TipoOperacion> a = reg.listarTipoOperacion(param);

                    ContaCab r = new ContaCab();

                    r.setIdTipoOperacion((a != null && a.size() > 0) ? a.get(0).getCodigo() : "");
                    r.setIdEmpresa(usuario.getCodempresa());
                    r.setIdLocalidad(x_idlocalidad.get(cbo_idlocalidad.getSelectedIndex() - 1).getId_localidad());
                    r.setIdPuntoventa(cbo_idpuntoventa.getSelectedIndex() > 0 ? (x_idpuntoventa.get(cbo_idpuntoventa.getSelectedIndex() - 1).getId_punto_venta()) : "");
                    r.setIdRegcontaRef(txt_idregconta_ref.getText().trim());
                    r.setIdTipoDocRef(cbo_idtipodocumento.getSelectedItem().toString().equalsIgnoreCase("FACTURA") ? "01" : cbo_idtipodocumento.getSelectedItem().toString().equalsIgnoreCase("BOLETA DE VENTA") ? "03" : "");
                    r.setSerieRef(txt_serieref.getText().trim());
                    r.setPreimpresoRef(txt_preimpresoref.getText().trim());
                    r.setAnIdanexo(txt_idanexo.getText().trim());
                    r.setAnIdtipoanexo("2");
                    r.setIdTipoDoc("08");
                    r.setSerie(x_serie.get(cbo_serie.getSelectedIndex()).getSerie());
                    r.setPreimpreso(txt_preimpreso.getText().trim());
                    r.setAnTmpanexo(txt_tmpanexo.getText().trim());
                    r.setAnTmpdireccion(txt_tmpdireccion.getText().trim());
                    r.setAnTmpruc(txt_tmpruc.getText().trim());
                    r.setGlosa(txt_glosa.getText().trim());
                    r.setIdUsuario(usuario.getId_usuario());
                    r.setIdMotivoNc(x_idmovimiento.get(cbo_idmovimiento.getSelectedIndex()).getId_motivo());
                    r.setMovDet(scp_xdescuento.isVisible() ? mdl_xdescuento.getData() : (scp_xdescuento.isVisible() ? mdl_xdescuento.getData() : mdl_xdescuento.getData()));
                    r.setIdMoneda(cbo_idmoneda.getSelectedIndex() > 0 ? xmoneda.get(cbo_idmoneda.getSelectedIndex() - 1).getIdMoneda() : "");
                    r.setMDescuento(0.0);
                    r.setMAfecto(Double.valueOf(txt_afecto.getText().trim()));
                    r.setMNoafecto(Double.valueOf(txt_noafecto.getText().trim()));
                    r.setMIgv(Double.valueOf(txt_igv.getText().trim()));
                    r.setMonto(Double.valueOf(txt_total.getText().trim()));
                    r.setIdEstado("005");
                    r.setIdTrabajador(usuario.getId_trabajador());
                    r.setMTipoCambio(Double.valueOf(txtTipoCambio.getText().trim()));
                    r.setFEmision(dc_fechainicio.getDate());
                    r.setFAnulacion(DateTime.format(0, 0, 0));
                    r.setFCancelacion(DateTime.format(0, 0, 0));
                    r.setFContable(dc_fechainicio.getDate());
                    r.setFDetraccion(DateTime.format(0, 0, 0));
                    r.setFDiferida(DateTime.format(0, 0, 0));
                    r.setFVencimiento(txt_idcondicionventa.getSelectedItem().toString().trim().equalsIgnoreCase("CO") ? dc_fechainicio.getDate() : dc_fechafin.getDate());
                    r.setIdAuxiliar("00070");
                    r.setAnio(((JTextFieldDateEditor) dc_fechainicio.getDateEditor()).getText().substring(6, 10));
                    r.setMes(((JTextFieldDateEditor) dc_fechainicio.getDateEditor()).getText().substring(3, 5));
                    r.setIdCondicionVenta(txt_idcondicionventa.getSelectedItem().toString().trim().equalsIgnoreCase("CO") ? "17" : txt_idcondicionventa.getSelectedItem().toString().trim().equalsIgnoreCase("CR") ? "22" : txt_idcondicionventa.getSelectedItem().toString().trim().equalsIgnoreCase("OB") ? "26" : "");
                    r.setIdTipoPago(((txt_idcondicionventa.getSelectedItem().toString().trim() != null) && (txt_idcondicionventa.getSelectedItem().toString().trim().equals("CO"))) ? "001" : "");
                    r.setFechaRef(fechaRef);
                    RnRegContaCab regla = new RnRegContaCab(path);
                    r.setMPercepcion(Double.valueOf(txt_percepcion.getText().trim()));
                    r.setIdCorrelativo(x_serie.get(cbo_serie.getSelectedIndex()).getIdCorrelativo());
                    try {
                        String idReconta = regla.insertarNotaDebitoDevdeMercaderiaxCambioPrecio(r);
                        if (!Constans.ISIMPRESIONVENTA) {
                            if (Integer.parseInt(idReconta) > 0) {
                                exportarTxt(r);
                            }else{
                                System.err.println("Error: "+idReconta);
                                logger.debug(idReconta);
                            }
                        }
                        return idReconta;
                    } catch (Exception ex) {
                        Logger.getLogger(UiRegisterNotaDebito.class.getName()).log(Level.SEVERE, null, ex);
                        JOptionPane.showMessageDialog(null, ex.getMessage());
                        return null;
                    }
                }

            } else {
                TipoOperacion param = new TipoOperacion();
                param.setDescripcion("ND VENTAS OTROS INGRESOS");
                param.setId_empresa(usuario.getCodempresa());
                param.setTasa(-1);
                param.setTasa_d(-1);
                param.setTasa_p(-1);
                RnTipoOperacion reg = new RnTipoOperacion(path);
                List<TipoOperacion> a = reg.listarTipoOperacion(param);
                ContaCab r = new ContaCab();
                r.setIdEmpresa(usuario.getCodempresa());
                r.setIdLocalidad(x_idlocalidad.get(cbo_idlocalidad.getSelectedIndex() - 1).getId_localidad());
                r.setIdPuntoventa(cbo_idpuntoventa.getSelectedIndex() > 0 ? (x_idpuntoventa.get(cbo_idpuntoventa.getSelectedIndex() - 1).getId_punto_venta()) : "");
                r.setAnIdanexo(txt_idanexo.getText().trim());
                r.setAnIdtipoanexo("2");
                r.setIdTipoDoc("08");
                r.setSerie(cbo_serie.getSelectedItem().toString());
                r.setPreimpreso(txt_preimpreso.getText().trim());
                r.setSerieRef(txt_serieref.getText().trim());
                r.setPreimpresoRef(txt_preimpresoref.getText().trim());
                r.setAnTmpanexo(txt_tmpanexo.getText().trim());
                r.setAnTmpdireccion(txt_tmpdireccion.getText().trim());
                r.setAnTmpruc(txt_tmpruc.getText().trim());
                r.setGlosa(txt_glosa.getText().trim());
                r.setIdUsuario(usuario.getId_usuario());
                r.setIdMotivoNc(x_idmovimiento.get(cbo_idmovimiento.getSelectedIndex()).getId_motivo());
                r.setIdTipoOperacion((a != null && a.size() > 0) ? a.get(0).getCodigo() : "");
                r.setIdMoneda(cbo_idmoneda.getSelectedIndex() > 0 ? xmoneda.get(cbo_idmoneda.getSelectedIndex() - 1).getIdMoneda() : "");
                r.setMDescuento(0.0);
                r.setMAfecto(Double.valueOf(txt_afecto.getText().trim()));
                r.setMNoafecto(Double.valueOf(txt_noafecto.getText().trim()));
                r.setMIgv(Double.valueOf(txt_igv.getText().trim()));
                r.setMonto(Double.valueOf(txt_total.getText().trim()));
                r.setIdEstado("005");
                r.setIdTrabajador(usuario.getId_trabajador());
                r.setFEmision(dc_fechainicio.getDate());
                r.setFAnulacion(DateTime.format(0, 0, 0));
                r.setFCancelacion(DateTime.format(0, 0, 0));
                r.setFContable(dc_fechainicio.getDate());
                r.setFDetraccion(DateTime.format(0, 0, 0));
                r.setFDiferida(DateTime.format(0, 0, 0));
                r.setFVencimiento(dc_fechafin.getDate());
                r.setIdAuxiliar("00070");
                r.setAnio(((JTextFieldDateEditor) dc_fechainicio.getDateEditor()).getText().substring(6, 10));
                r.setMes(((JTextFieldDateEditor) dc_fechainicio.getDateEditor()).getText().substring(3, 5));
                r.setCuentaContable(txt_cuenta.getText().trim());
                r.setIdParametroprov(txt_idconcepto.getText().trim());
                r.setMTipoCambio(Double.valueOf(txtTipoCambio.getText().trim()));
                r.setImporte(Double.parseDouble(txt_importe.getText().trim()));
                r.setImporteIGV(Double.valueOf(txt_importeIGV.getText().trim()));
                r.setIdRegcontaRef(txt_idregconta_ref.getText());
                r.setIdCorrelativo(x_serie.get(cbo_serie.getSelectedIndex()).getIdCorrelativo());
                RnRegContaCab regla = new RnRegContaCab(path);
                String idReconta = regla.insertarNotaDebitoOtrosCostosyGastos(r);
                if (!Constans.ISIMPRESIONVENTA) {
                    if (Integer.parseInt(idReconta) > 0) {
                        exportarTxt(r);
                    }
                }
                return idReconta;
            }
        } catch (Exception ex) {
            Logger.getLogger(UiRegisterNotaDebito.class.getName()).log(Level.SEVERE, null, ex);
            JOptionPane.showMessageDialog(null, ex.getMessage());
            return null;
        }
    }

    private String getPrint(String codigo) {
        String parametro = "SELECT "
                + " ND.TMP_ANEXO AS TMP_ANEXO "
                + " ,ND.TMP_DIRECCION as TMP_DIRECCION "
                + " ,ND.TMP_RUC AS TMP_RUC "
                + " ,EXTRACT(YEAR FROM TO_DATE(ND.F_EMISION,'DD/MM/YY HH24:MI:SS')) AS ANIO "
                + " ,EXTRACT(MONTH FROM TO_DATE(ND.F_EMISION,'DD/MM/YY HH24:MI:SS')) AS MES "
                + " ,EXTRACT(DAY FROM TO_DATE(ND.F_EMISION,'DD/MM/YY HH24:MI:SS')) AS DIA "
                + " ,ND.GLOSA AS GLOSA "
                + " ,ND.M_IGV AS M_IGV"
                + " ,ND.M_AFECTO AS M_AFECTO"
                + " ,ND.MONTO AS MONTO"
                + " ,PP.DESCRIPCION AS CONCEPTO"
                + " FROM REGCONTA_CAB ND "
                + " LEFT JOIN PARAMETRO_PROV PP ON ND.ID_PARAMETRO_PROV = PP.ID_PARAMETRO_PROV "
                + "  WHERE 1 = 1 "
                + " AND ND.\"_ESTADO\" = 'A' "
                + " AND ND.ID_REGCONTA = \'" + codigo + "\' ";

        return parametro;
    }

    @Override
    public void showMessagePrint(String codigo) {
        try {
            Reporte report = new Reporte(path);
            report.generarReporte("NotaDebito", getPrint(codigo), "", "", "", "", "", true, false,
                    "Reporte de Notas de DÃ©bito");
        } catch (Exception ex) {
            JOptionPane.showMessageDialog(this, ex.toString());
        }
    }

    @Override
    public void focusGained(FocusEvent e) {
        if (e.getSource() == ((JTextFieldDateEditor) dc_fechainicio.getDateEditor())) {
            ((JTextFieldDateEditor) dc_fechainicio.getDateEditor()).selectAll();
        }

        if (e.getSource() == txt_preimpreso) {
            txt_preimpreso.selectAll();
        }

        if (e.getSource() == txt_serieref) {
            txt_serieref.selectAll();
        }

        if (e.getSource() == txt_preimpresoref) {
            txt_preimpresoref.selectAll();
        }

        if (e.getSource() == txt_glosa) {
            txt_glosa.selectAll();
        }
    }

    @Override
    public void focusLost(FocusEvent e) {
        if (e.getSource() == txt_preimpreso && txt_preimpreso.getText().trim().length() > 0) {
            String serie = "0000000000" + txt_preimpreso.getText().trim();
            String nuevaserie = serie.substring(serie.length() - 10, serie.length());
            txt_preimpreso.setText(nuevaserie);
        }

        if (e.getSource() == txt_preimpresoref && txt_preimpresoref.getText().trim().length() > 0) {
            String serie = "0000000000" + txt_preimpresoref.getText().trim();
            String nuevaserie = serie.substring(serie.length() - 10, serie.length());
            txt_preimpresoref.setText(nuevaserie);
        }

        if (e.getSource() == txt_glosa && txt_glosa.getText().trim().length() == 0) {
            txt_glosa.setText(cbo_idmovimiento.getSelectedItem().toString());
        }
    }

    @Override
    public void setRegisterEditable(boolean e) {
        tbl_xdescuento.setColumnEditable(6, e);
        tbl_xdescuento.setColumnEditable(15, e);
        txt_preimpreso.setEditable(e);
        txt_serieref.setEditable(!e);
        txt_preimpresoref.setEditable(!e);
        txt_glosa.setEditable(e);
    }

    @Override
    public void setRegisterEnabled(boolean e) {
        cbo_idmovimiento.setEnabled(e);
        cbo_serie.setEnabled(e);
        cbo_idtipodocumento.setEnabled(!e);
        btn_buscar.setEnabled(e);
        dc_fechainicio.setEnabled(e);
    }

    public void loadSerieCorrelativo(String id_tipodoc) {
        try {
            RnCorrelativo regla_correlativo = new RnCorrelativo(path);

            if (x_serie != null) {
                x_serie.clear();
            } else {
                x_serie = new ArrayList<UsuarioCorrelativo>();
            }
            x_serie.addAll(regla_correlativo.listarCorrelativo(usuario.getId_usuario(), usuario.getCodpuntoventa(), id_tipodoc));
            cbo_serie.removeAllItems();

            for (int i = 0; i < x_serie.size(); i++) {
                cbo_serie.addItem(x_serie.get(i).getSerie());
            }

            if (cbo_serie.getItemCount() > 0) {
                cbo_serie.setSelectedIndex(0);
            }
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }

    public void prepareRegister() {
    }

    @Override
    public void actionPerformed(ActionEvent e) {
        if (btn_buscar_cliente == e.getSource()) {
            Anexo a = new Anexo();
            a.setIdEmpresa(usuario.getCodempresa());
            a.setIdTipoAnexo("2");

            BuscarCliente buscar_cliente;
            buscar_cliente = new BuscarCliente(frame, this, path);
            buscar_cliente.cargarTabla(a, btn_buscar_cliente, 0);
        }

        if (cbo_idmovimiento == e.getSource()) {
            if (cbo_idmovimiento.getItemCount() > 0) {
                setFormato(x_idmovimiento.get(cbo_idmovimiento.getSelectedIndex()).getId_motivo());
            }
        }

        if (e.getSource() == btn_buscar) {
            BuscarNCDocumentosVentaND a = new BuscarNCDocumentosVentaND(frame, this, usuario, path);
            a.cargarTabla(btn_buscar);
        }

        if (e.getSource() == btn_buscarconcepto) {
            BuscarParametroProv a = new BuscarParametroProv(frame, this, path);
            a.cargarTabla(usuario.getCodempresa(), btn_buscarconcepto, 0);
        }

        if (cbo_idlocalidad == e.getSource()) {
            if (cbo_idlocalidad.getItemCount() > 0) {
                if (cbo_idlocalidad.getSelectedIndex() == 0) {
                    cbo_idpuntoventa.removeAllItems();
                } else {
                    loadPuntoVenta(x_idlocalidad.get(cbo_idlocalidad.getSelectedIndex() - 1).getId_localidad());
                }
            }
        }

        if (cbo_serie == e.getSource() && mode == INSERT) {
            if (cbo_serie.getSelectedIndex() > -1) {
                mostrarPreimpreso();
            }
        }

    }

    @Override
    public void tableChanged(TableModelEvent e) {
        if (e.getSource() == mdl_xdescuento) {
            calcularImportesDescuento();
        }
    }

    public void calcularImportesDescuento() {
        txt_afecto.setText("0.0");
        txt_percepcion.setText("0.0");
        txt_igv.setText("0.0");
        txt_noafecto.setText("0.0");
        txt_monto.setText("0.0");
        txt_total.setText("0.0");

        BigDecimal m_percepcion = BigDecimal.ZERO;
        BigDecimal monto = BigDecimal.ZERO;
        BigDecimal m_afecto = BigDecimal.ZERO;
        BigDecimal m_noafecto = BigDecimal.ZERO;
        BigDecimal m_igv = BigDecimal.ZERO;
        BigDecimal m_descuento = BigDecimal.ZERO;

        for (int i = 0; i < mdl_xdescuento.getRowCount(); i++) {
            ContaItem obtab = mdl_xdescuento.getVentaDirecta(i);

            m_percepcion = m_percepcion.add(BigDecimal.valueOf(obtab.getDif_perc()));
            monto = monto.add(BigDecimal.valueOf(obtab.getDif_monto()));
            m_afecto = m_afecto.add(BigDecimal.valueOf(obtab.getDif_afecto()));
            m_noafecto = m_noafecto.add(BigDecimal.valueOf(obtab.getDif_noafecto()));
            m_igv = m_igv.add(BigDecimal.valueOf(obtab.getDif_igv()));
        }
        BigDecimal sumAfecto = monto.subtract(m_igv).add(m_noafecto);
        txt_afecto.setText(sumAfecto.toString());
        txt_noafecto.setText(m_noafecto.toString());
        txt_igv.setText(m_igv.toString());
        txt_monto.setText(monto.toString());
        txt_percepcion.setText(m_percepcion.toString());
        BigDecimal saldo = monto.add(m_percepcion);
        txt_total.setText(saldo.toString());
    }

    public void calcularImportesDescuentoAntiguo() {
        txt_afecto.setText("0.0");
        txt_percepcion.setText("0.0");
        txt_igv.setText("0.0");
        txt_noafecto.setText("0.0");
        txt_monto.setText("0.0");
        txt_total.setText("0.0");

        double m_percepcion = 0.0;
        double monto = 0.0;
        double m_afecto = 0.0;
        double m_noafecto = 0.0;
        double m_igv = 0.0;
        double m_descuento = 0.0;

        for (int i = 0; i < mdl_xdescuento.getRowCount(); i++) {
            ContaItem obtab = mdl_xdescuento.getVentaDirecta(i);

            m_percepcion = m_percepcion + obtab.getDif_perc();
            monto = monto + obtab.getDif_monto();
            m_afecto = m_afecto + obtab.getDif_afecto();
            m_noafecto = m_noafecto + obtab.getDif_noafecto();
            m_igv = m_igv + obtab.getDif_igv();
        }

        txt_afecto.setText(String.valueOf(CFunciones.redondea(monto - m_igv + m_noafecto, 2)));
        txt_noafecto.setText(String.valueOf(CFunciones.redondea(m_noafecto, 2)));
        txt_igv.setText(String.valueOf(CFunciones.redondea(m_igv, 2)));
        txt_monto.setText(String.valueOf(CFunciones.redondea(monto, 2)));
        txt_percepcion.setText(String.valueOf(CFunciones.redondea(m_percepcion, 2)));
        txt_total.setText(String.valueOf(CFunciones.redondea(monto + m_percepcion, 2)));
    }

    @Override
    public boolean isRegisterValid() {
        return true;
    }

    @Override
    public boolean executeDelete() {
        return false;
    }

    @Override
    public void showMessageSuccessfulInsert() {
    }

    @Override
    public void showMessageSuccessfulUpdate() {
    }

    @Override
    public void showMessageSuccessfulDelete() {
    }

    @Override
    public void showMessageErrorDelete() {
    }

    @Override
    public void showMessageErrorUpdate() {
    }

    @Override
    public void showMessageErrorInsert() {
    }

    @Override
    public String executeUpdate() {
        return "";
    }

    @Override
    public boolean executeAnular() {
        RnRegContaCab regla = new RnRegContaCab(path);
        return regla.anularNotaDebito(txt_idregconta.getText().trim());
    }

    @Override
    public boolean executeSelect() {
        return true;
    }

    @Override
    public void onPressEsc() {
    }

    @Override
    public void keyTyped(KeyEvent e) {
    }

    @Override
    public void keyPressed(KeyEvent e) {
    }
}

