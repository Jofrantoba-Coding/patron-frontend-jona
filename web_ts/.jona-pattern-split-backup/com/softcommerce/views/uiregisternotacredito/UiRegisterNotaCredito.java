package com.softcommerce.views.uiregisternotacredito;

import com.softcommerce.views.uipaneltfnotacredito.UiPanelTFNotaCredito;


import com.softcommerce.formularios.*;
import com.softcommerce.beans.Localidad;
import com.softcommerce.beans.BeanMotivoNota;
import com.softcommerce.beans.BeanNcReporte;
import com.softcommerce.beans.PuntoVenta;
import com.softcommerce.beans.ContaCab;
import com.softcommerce.beans.Usuario;
import com.softcommerce.beans.UsuarioCorrelativo;
import com.softcommerce.beans.ContaItem;
import com.softcommerce.beans.Lote;
import com.softcommerce.comboboxmodel.ComboModelFormaPago;
import com.softcommerce.datasource.DataSourceNc;
import com.softcommerce.entity.RegcontaCab;
import com.softcommerce.enums.AuxiliarEnum;
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
import javax.swing.BorderFactory;
import java.awt.Color;
import java.awt.Font;
import javax.swing.border.TitledBorder;
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
import javax.swing.border.Border;
import com.softcommerce.general.controles.JHInternal;
import com.softcommerce.general.controles.CLabel;
import com.softcommerce.general.controles.CTable;
import com.softcommerce.general.herramientas.DateTime;
import com.softcommerce.general.controles.IntegerDocument;
import static com.softcommerce.general.controles.Register.INSERT;
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
import com.softcommerce.general.tablas.NotaCreditoDescuentoTableModel;
import com.softcommerce.general.tablas.NotaCreditoDespachadoTableModel;
import com.softcommerce.reglasnegocio.rn_MotivoNotaCredito;
import com.softcommerce.reglasnegocio.RnPuntoVenta;
import com.softcommerce.reglasnegocio.RnCorrelativo;
import com.softcommerce.general.tablas.NotaCreditoPendienteTableModel;
import com.softcommerce.logic.LogicLote;
import com.softcommerce.logic.LogicRegContaCab;
import com.softcommerce.reglasnegocio.RnConsultas;
import com.softcommerce.reglasnegocio.RnRegContaCab;
import com.softcommerce.util.CompareDate;
import com.softcommerce.util.Constans;
import com.softcommerce.util.ExceptionHandler;
import com.softcommerce.util.Exportar;
import com.softcommerce.util.FEtxt;
import com.softcommerce.util.editor.CellEditorBtnLoteVenta;
import java.math.BigDecimal;
import java.util.Calendar;
import java.util.GregorianCalendar;
import java.util.HashMap;
import java.util.Locale;
import java.util.Map;
import javax.swing.JComboBox;
import javax.swing.JDialog;
import javax.swing.JOptionPane;
import net.sf.jasperreports.engine.JRParameter;
import org.apache.log4j.Logger;

public class UiRegisterNotaCredito
        extends JHInternal
        implements InterUiRegisterNotaCredito, ActionListener, FocusListener, ItemListener, TableModelListener {

    private final Logger logger = Logger.getLogger(UiRegisterNotaCredito.class);
    private CComboBox cboLocalidad;
    private List<Localidad> xLocalidad;
    private CComboBox cboTipoDocumento;
    private CComboBox cboMotivoNota;
    private List<BeanMotivoNota> xMotivoNota;
    private CComboBox cboSerie;
    private List<UsuarioCorrelativo> xSerie;
    private CComboBox cboPuntoVenta;
    private List<PuntoVenta> xPuntoVenta;
    private JTextField txt_idregconta;
    private JTextField txt_tmpanexo;
    private JTextField txt_idanexo;
    private JTextField txt_tmpruc;
    private JTextField txt_noafecto;
    private JTextField txt_descuento;
    private JTextField txt_igv;
    private JTextField txt_afecto;
    private JTextField txt_total;
    private JTextField txt_monto;
    private JTextField txt_percepcion;
    private JTextField txt_idregconta_ref;
    private JTextField txt_idauxiliar;
    private JTextField txt_tmpdireccion;
    private JTextField txt_idestado;
    private JTextField txt_idtipodoc;
    private JTextField txt_glosa;
    private JTextField txt_preimpreso;
    private JTextField txt_preimpresoref;
    private JTextField txt_idtipooperacion;
    private JTextField txt_serieref;
    private JTextField txt_idtipoanexo;
    private JTextField txt_mes;
    private JTextField txt_anio;
    private JComboBox txt_idcondicionventa;
    private JTextField txt_idmoneda;
    private JDateChooser dc_fechainicio;
    private JDateChooser dc_fechafin;
    private JButton btn_buscar;
    private final Usuario usuario;
    private final JFrame frame;
    private JCheckBox chk_seleccionar;
    private JScrollPane scp_xdescuento;
    private NotaCreditoDescuentoTableModel mdl_xdescuento;
    private CTable tbl_xdescuento;
    private JScrollPane scp_xdevolucionpendiente;
    private NotaCreditoPendienteTableModel mdlDevolucionPendiente;
    private CTable tblDevolucionPendiente;
    private JScrollPane scp_xdevoluciondespachado;
    private NotaCreditoDespachadoTableModel mdl_xdevoluciondespachado;
    private CTable tbl_xdevoluciondespachado;
    private final ComboModelFormaPago modelFormaPago = new ComboModelFormaPago();
    private JLabel lblFechaVenc;
    private java.util.Date fechaRef = new java.util.Date();
    private RegcontaCab beanReferencia;
    private JLabel lblMoneda;
    private JTextField txtMoneda;
    private JTextField txt_idtipo_doc_ref1;
    private JTextField txt_serie_ref1;
    private JTextField txt_preimpreso_ref1;
    private JTextField txt_id_regconta_doc1;
    private JTextField txt_id_anexo_ref;
    private CLabel lblMonto;
    private String userAutorizado;
    private JTextField txt_id_vendedor;
    private JTextField txt_id_movimiento;
    private CellEditorBtnLoteVenta editorLote;
    private JButton btnEditLote;

    public UiRegisterNotaCredito(UiPanelTFNotaCredito pnltfnotacredito, String title, Usuario usuario, JFrame frame) {
        super(title + " - UiRegisterNotaCredito");
        this.usuario = usuario;
        this.frame = frame;
        inicialize();
    }

    public void userAutorizado(String user) {
        userAutorizado = user;
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

        cboMotivoNota = new CComboBox();
        cboMotivoNota.setFont(new Font(Font.SANS_SERIF, Font.BOLD, 9));
        cboMotivoNota.setBounds(65, 5, 275, 20);
        cboMotivoNota.addActionListener(this);
        pnlDialog.add(cboMotivoNota);

        JLabel lblSerie = new JLabel("NÂ° N CrÃ©dito");
        lblSerie.setBounds(350, 5, 70, 20);
        pnlDialog.add(lblSerie);

        cboSerie = new CComboBox();
        cboSerie.setBounds(425, 5, 50, 20);
        cboSerie.addActionListener(this);
        pnlDialog.add(cboSerie);

        txt_id_vendedor = new JTextField();
        txt_id_vendedor.setBounds(790, 85, 130, 20);
        pnlDialog.add(txt_id_vendedor);
        txt_id_vendedor.setVisible(false);
        txt_id_vendedor.setEditable(false);
        txt_id_movimiento = new JTextField();
        txt_id_movimiento.setBounds(790, 85, 130, 20);
        pnlDialog.add(txt_id_movimiento);
        txt_id_movimiento.setVisible(false);
        txt_id_movimiento.setEditable(false);

        txt_preimpreso = new JTextField();
        txt_preimpreso.setBounds(480, 5, 85, 20);
        txt_preimpreso.setEnabled(false);
        txt_preimpreso.setFont(new Font(Font.SANS_SERIF, Font.BOLD | Font.ITALIC, 12));
        txt_preimpreso.addFocusListener(this);
        txt_preimpreso.setDocument(new IntegerDocument(10));
        txt_preimpreso.setForeground(Color.BLACK);
        pnlDialog.add(txt_preimpreso);

        lblMonto = new CLabel("Monto");
        lblMonto.setBounds(510, 385, 40, 20);
        lblMonto.setFont(new Font(Font.SANS_SERIF, 0, 11));
        pnlDialog.add(lblMonto);

        btn_buscar = new JButton(gif.SEARCH16);
        btn_buscar.setBounds(570, 5, 40, 20);
        btn_buscar.setToolTipText("Buscar Documento");
        btn_buscar.setContentAreaFilled(true);
        btn_buscar.setBorderPainted(true);
        btn_buscar.setFocusable(true);
        btn_buscar.setFocusPainted(false);
        btn_buscar.addActionListener(this);
        btn_buscar.registerKeyboardAction(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
            }
        }, KeyStroke.getKeyStroke(KeyEvent.VK_ENTER, 0, false), JComponent.WHEN_FOCUSED);
        pnlDialog.add(this.btn_buscar);

        txt_idregconta_ref = new JTextField();
        txt_idregconta_ref.setBounds(615, 5, 80, 20);
        txt_idregconta_ref.setFont(new Font(Font.SANS_SERIF, 0, 11));
        txt_idregconta_ref.addFocusListener(this);
        txt_idregconta_ref.setDocument(new IntegerDocument(10));
        txt_idregconta_ref.setEnabled(false);
        txt_idregconta_ref.setForeground(Color.BLACK);
        txt_idregconta_ref.setText("0");
        pnlDialog.add(txt_idregconta_ref);

        cboTipoDocumento = new CComboBox();
        cboTipoDocumento.setBounds(700, 5, 120, 20);
        cboTipoDocumento.setFont(new Font(Font.SANS_SERIF, Font.BOLD, 9));
        cboTipoDocumento.addActionListener(this);
        pnlDialog.add(cboTipoDocumento);

        txt_serieref = new JTextField();
        txt_serieref.setBounds(825, 5, 30, 20);
        txt_serieref.setFont(new Font(Font.SANS_SERIF, 0, 11));
        txt_serieref.addFocusListener(this);
        txt_serieref.setForeground(Color.BLACK);
        pnlDialog.add(txt_serieref);

        txt_preimpresoref = new JTextField();
        txt_preimpresoref.setBounds(860, 5, 80, 20);
        txt_preimpresoref.setFont(new Font(Font.SANS_SERIF, 0, 11));
        txt_preimpresoref.addFocusListener(this);
        txt_preimpresoref.setDocument(new IntegerDocument(10));
        txt_preimpresoref.setForeground(Color.BLACK);
        pnlDialog.add(txt_preimpresoref);

        Border border = BorderFactory.createTitledBorder(null, "Datos de Documento", TitledBorder.LEFT, TitledBorder.DEFAULT_POSITION, new Font("Comic Sans MS", 0, 12), Color.BLACK);

        JPanel pnlCabezera = new JPanel();
        pnlCabezera.setLayout(null);
        pnlCabezera.setBackground(new Color(245, 245, 245));
        pnlCabezera.setBorder(border);

        JLabel lblCodigo = new JLabel("Cod");
        lblCodigo.setBounds(10, 25, 20, 20);
        pnlCabezera.add(lblCodigo);

        txt_idregconta = new JTextField();
        txt_idregconta.setEditable(false);
        txt_idregconta.setBounds(35, 25, 90, 20);
        pnlCabezera.add(txt_idregconta);

        cboLocalidad = new CComboBox();
        cboLocalidad.setFont(new Font(Font.SANS_SERIF, Font.BOLD, 9));
        cboLocalidad.setBounds(335, 25, 190, 20);
        cboLocalidad.addActionListener(this);
        cboLocalidad.setEnabled(false);
        pnlCabezera.add(cboLocalidad);

        cboPuntoVenta = new CComboBox();
        cboPuntoVenta.setFont(new Font(Font.SANS_SERIF, Font.BOLD, 9));
        cboPuntoVenta.setBounds(530, 25, 210, 20);
        cboPuntoVenta.addActionListener(this);
        cboPuntoVenta.setEnabled(false);
        pnlCabezera.add(cboPuntoVenta);

        JLabel lblRazonSocial = new JLabel("R. Social");
        lblRazonSocial.setBounds(20, 55, 50, 20);
        pnlCabezera.add(lblRazonSocial);

        txt_tmpanexo = new JTextField();
        txt_tmpanexo.setBounds(75, 55, 350, 20);
        txt_tmpanexo.setEditable(false);
        pnlCabezera.add(txt_tmpanexo);

        JLabel lbl_RucCliente = new JLabel("RUC/DNI");
        lbl_RucCliente.setBounds(450, 55, 50, 20);
        pnlCabezera.add(lbl_RucCliente);

        txt_tmpruc = new JTextField();
        txt_tmpruc.setBounds(500, 55, 80, 20);
        txt_tmpruc.addFocusListener(this);
        txt_tmpruc.setEditable(false);
        pnlCabezera.add(txt_tmpruc);

        JLabel lblFechaEmision = new JLabel("Fec. Emision");
        lblFechaEmision.setDisplayedMnemonic('c');
        lblFechaEmision.setBounds(600, 55, 70, 20);
        pnlCabezera.add(lblFechaEmision);

        dc_fechainicio = new JDateChooser("dd/MM/yyyy", "##/##/####", '_');
        dc_fechainicio.setBounds(665, 55, 105, 20);
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
        dc_fechainicio.getCalendarButton().addActionListener(this);
        dc_fechainicio.addFocusListener(this);
        pnlCabezera.add(dc_fechainicio);

        lblFechaVenc = new JLabel("Fec. Vencimiento");
        lblFechaVenc.setDisplayedMnemonic('c');
        lblFechaVenc.setBounds(780, 55, 70, 20);
        pnlCabezera.add(lblFechaVenc);

        dc_fechafin = new JDateChooser("dd/MM/yyyy", "##/##/####", '_');
        dc_fechafin.setDate(new Date());
        dc_fechafin.setBounds(860, 55, 105, 20);
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
        dc_fechafin.getCalendarButton().addActionListener(this);
        dc_fechafin.addFocusListener(this);
        pnlCabezera.add(dc_fechafin);

        JLabel lblGlosa = new JLabel("Glosa");
        lblGlosa.setBounds(20, 85, 40, 20);
        pnlCabezera.add(lblGlosa);

        txt_glosa = new JTextField();
        txt_glosa.setBounds(60, 85, 460, 20);
        txt_glosa.addFocusListener(this);
        txt_glosa.setEditable(true);
        txt_glosa.setHorizontalAlignment(SwingConstants.LEFT);
        txt_glosa.setDocument(new UpperCaseNumberDocument(255));
        pnlCabezera.add(txt_glosa);

        JLabel lblCondicionPago = new JLabel("Condicion Pago");
        lblCondicionPago.setBounds(530, 85, 100, 20);
        pnlCabezera.add(lblCondicionPago);

        txt_idcondicionventa = new JComboBox();
        txt_idcondicionventa.setBounds(635, 85, 70, 20);
        txt_idcondicionventa.setModel(modelFormaPago);
        txt_idcondicionventa.addItemListener(itemListener);
        pnlCabezera.add(txt_idcondicionventa);

        pnlCabezera.setBounds(5, 28, 980, 120);
        pnlDialog.add(pnlCabezera);

        CLabel lblMAfecto = new CLabel("Afecto");
        lblMAfecto.setBounds(5, 385, 40, 20);
        lblMAfecto.setFont(new Font(Font.SANS_SERIF, 0, 11));
        pnlDialog.add(lblMAfecto);

        txt_afecto = new JTextField();
        txt_afecto.setBounds(45, 385, 100, 20);
        txt_afecto.setHorizontalAlignment(SwingConstants.RIGHT);
        txt_afecto.setFont(new Font(Font.SANS_SERIF, 1, 13));
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
        txt_igv.setEditable(false);
        pnlDialog.add(txt_igv);

        CLabel lblMontoLocal = new CLabel("Monto");
        lblMontoLocal.setBounds(510, 385, 40, 20);
        lblMontoLocal.setFont(new Font(Font.SANS_SERIF, 0, 11));
        pnlDialog.add(lblMontoLocal);

        txt_monto = new JTextField();
        txt_monto.setBounds(550, 385, 100, 25);
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
        txt_percepcion.setBounds(695, 385, 90, 25);
        txt_percepcion.setHorizontalAlignment(SwingConstants.RIGHT);
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
        txt_total.setBounds(835, 385, 100, 25);
        txt_total.setHorizontalAlignment(SwingConstants.RIGHT);
        txt_total.setForeground(Color.darkGray);
        txt_total.setFont(new Font(Font.SANS_SERIF, 1, 20));
        txt_total.setEditable(false);
        pnlDialog.add(txt_total);

        chk_seleccionar = new JCheckBox("Seleccionar Todo");
        chk_seleccionar.setBounds(5, 147, 150, 20);
        chk_seleccionar.addItemListener(this);
        chk_seleccionar.setFont(new Font("Verdana", 1, 11));
        chk_seleccionar.setHorizontalTextPosition(SwingConstants.LEFT);
        chk_seleccionar.addFocusListener(this);
        chk_seleccionar.setOpaque(false);
        pnlDialog.add(chk_seleccionar);

        mdl_xdescuento = new NotaCreditoDescuentoTableModel();
        mdl_xdescuento.addTableModelListener(this);
        tbl_xdescuento = new CTable();
        tbl_xdescuento.setModel(mdl_xdescuento);
        tbl_xdescuento.setAllColumnNoResizable();
        tbl_xdescuento.setAllTableNoEditable();
        tbl_xdescuento.setAllColumnPreferredWidth();
        scp_xdescuento = new JScrollPane(tbl_xdescuento);
        scp_xdescuento.setBounds(5, 170, 970, 205);
        pnlDialog.add(scp_xdescuento);

        mdlDevolucionPendiente = new NotaCreditoPendienteTableModel();
        mdlDevolucionPendiente.addTableModelListener(this);
        editorLote = new CellEditorBtnLoteVenta(mdlDevolucionPendiente, this);
        btnEditLote = new JButton();
        tblDevolucionPendiente = new CTable();
        tblDevolucionPendiente.setModel(mdlDevolucionPendiente);
        tblDevolucionPendiente.setAllColumnNoResizable();
        tblDevolucionPendiente.setAllTableNoEditable();
        tblDevolucionPendiente.setAllColumnPreferredWidth();
        scp_xdevolucionpendiente = new JScrollPane(tblDevolucionPendiente);
        scp_xdevolucionpendiente.setBounds(5, 170, 970, 205);
        pnlDialog.add(scp_xdevolucionpendiente);

        mdl_xdevoluciondespachado = new NotaCreditoDespachadoTableModel();
        mdl_xdevoluciondespachado.addTableModelListener(this);
        tbl_xdevoluciondespachado = new CTable();
        tbl_xdevoluciondespachado.setModel(mdl_xdevoluciondespachado);
        tbl_xdevoluciondespachado.setAllColumnNoResizable();
        tbl_xdevoluciondespachado.setAllTableNoEditable();
        tbl_xdevoluciondespachado.setAllColumnPreferredWidth();
        scp_xdevoluciondespachado = new JScrollPane(tbl_xdevoluciondespachado);
        scp_xdevoluciondespachado.setBounds(5, 170, 970, 205);
        pnlDialog.add(scp_xdevoluciondespachado);

        txt_descuento = new JTextField();
        txt_idtipooperacion = new JTextField();
        txt_idestado = new JTextField();
        txt_idtipodoc = new JTextField();
        txt_tmpdireccion = new JTextField();
        txt_mes = new JTextField();
        txt_anio = new JTextField();
        txt_idtipoanexo = new JTextField();
        txt_idauxiliar = new JTextField();
        txt_idanexo = new JTextField();
        txt_idmoneda = new JTextField();
        lblMoneda = new JLabel("Moneda");
        txtMoneda = new JTextField();

        txt_idtipo_doc_ref1 = new JTextField();
        txt_serie_ref1 = new JTextField();
        txt_preimpreso_ref1 = new JTextField();
        txt_id_regconta_doc1 = new JTextField();
        txt_id_anexo_ref = new JTextField();

        txt_idtipo_doc_ref1.setBounds(790, 85, 130, 20);
        txt_preimpreso_ref1.setBounds(790, 85, 130, 20);
        txt_id_regconta_doc1.setBounds(790, 85, 130, 20);
        txt_id_anexo_ref.setBounds(790, 85, 130, 20);
        txt_serie_ref1.setBounds(790, 85, 130, 20);

        pnlCabezera.add(txt_idtipo_doc_ref1);
        pnlCabezera.add(txt_preimpreso_ref1);
        pnlCabezera.add(txt_id_regconta_doc1);
        pnlCabezera.add(txt_id_anexo_ref);
        pnlCabezera.add(txt_serie_ref1);
        txt_serie_ref1.setVisible(false);
        txt_idtipo_doc_ref1.setVisible(false);
        txt_preimpreso_ref1.setVisible(false);
        txt_id_regconta_doc1.setVisible(false);
        txt_id_anexo_ref.setVisible(false);

        txt_idtipo_doc_ref1.setEditable(false);
        txt_preimpreso_ref1.setEditable(false);
        txt_id_regconta_doc1.setEditable(false);
        txt_id_anexo_ref.setEditable(false);
        txt_serie_ref1.setEditable(false);

        lblMoneda.setBounds(715, 85, 70, 20);
        pnlCabezera.add(lblMoneda);

        txtMoneda.setBounds(790, 85, 130, 20);
        pnlCabezera.add(txtMoneda);
        txtMoneda.setEditable(false);
        setRegister(pnlDialog);
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
    }

    public void loadMovimiento() {
        rn_MotivoNotaCredito regla = new rn_MotivoNotaCredito(path);
        if (xMotivoNota != null) {
            xMotivoNota.clear();
        } else {
            xMotivoNota = new ArrayList();
        }
        BeanMotivoNota m = new BeanMotivoNota();
        m.setFlag("C");
        xMotivoNota.addAll(regla.listar(m));
        cboMotivoNota.removeAllItems();
        for (int i = 0; i < xMotivoNota.size(); i++) {
            cboMotivoNota.addItem(xMotivoNota.get(i).getDescripcion());
        }
        cboMotivoNota.setSelectedIndex(0);
    }

    @Override
    public void newRegister() {
        try {
            JTextField txt = new JTextField();
            cboMotivoNota.setBorder(txt.getBorder());
            txt_preimpreso.setBorder(txt.getBorder());
            dc_fechainicio.setBorder(new JDateChooser().getBorder());
            cboSerie.setBorder(txt.getBorder());
            scp_xdevolucionpendiente.setBorder(txt.getBorder());
            scp_xdescuento.setBorder(txt.getBorder());
            txt_serieref.setBorder(txt.getBorder());
            txt_preimpresoref.setBorder(txt.getBorder());
            txtMoneda.setText(null);
            txt_descuento.setText("0.0");
            txt_idtipooperacion.setText("");
            txt_idestado.setText("005");
            txt_idtipodoc.setText("07");
            txt_tmpdireccion.setText("");
            txt_mes.setText("");
            txt_anio.setText("");
            txt_idtipoanexo.setText("");
            txt_idregconta_ref.setText("");
            txt_idauxiliar.setText("");
            txt_idanexo.setText("");

            txt_serie_ref1.setText("");
            txt_idtipo_doc_ref1.setText("");
            txt_preimpreso_ref1.setText("");
            txt_id_regconta_doc1.setText("");
            txt_id_anexo_ref.setText("");

            txt_preimpreso.setText("");
            txt_serieref.setText("");
            txt_glosa.setText("GLOSA POR " + cboMotivoNota.getSelectedItem().toString());
            txt_preimpresoref.setText("");
            txt_tmpanexo.setText("");
            txt_tmpruc.setText("");
            txt_idregconta.setText("");
            dc_fechainicio.setDate(new Date());
            txt_afecto.setText("0.0");
            txt_noafecto.setText("0.0");
            txt_igv.setText("0.0");
            txt_total.setText("0.0");
            txt_percepcion.setText("0.0");
            txt_monto.setText("0.0");
            txt_id_vendedor.setText("");
            txt_id_movimiento.setText("");
            if (cboTipoDocumento.getItemCount() > 0) {
                cboTipoDocumento.setSelectedIndex(0);
            }

            if (mode == INSERT && cboMotivoNota.getItemCount() > 0) {
                if (cboSerie.getItemCount() <= 0) {
                    loadSerieCorrelativo(txt_idtipodoc.getText().trim());
                }
            }

            if (mode == INSERT && cboSerie.getItemCount() > 0) {
                if (txt_preimpreso.getText().trim().length() < 10) {
                    this.mostrarPreimpreso();
                }
            }

            mdl_xdescuento.clearTable();
            tbl_xdescuento.setAllColumnPreferredWidth();

            mdl_xdevoluciondespachado.clearTable();
            tbl_xdevoluciondespachado.setAllColumnPreferredWidth();

            tbl_xdescuento.setNoVisibleColumn(0);
            mdlDevolucionPendiente.clearTable();
            tblDevolucionPendiente.setAllColumnPreferredWidth();
        } catch (Exception e) {
            ExceptionHandler.handleException(e, logger);
            JOptionPane.showMessageDialog(this, e.getMessage());
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
            txt_glosa.setText("GLOSA POR " + cboMotivoNota.getSelectedItem().toString());
        }
    }

    @Override
    public void setRegisterEditable(boolean e) {
        tblDevolucionPendiente.setColumnEditable(0, e);
        tblDevolucionPendiente.setColumnEditable(11, e);
        tbl_xdescuento.setColumnEditable(0, e);
        tbl_xdescuento.setColumnEditable(6, e);
        tbl_xdescuento.setColumnEditable(14, e);
        txt_preimpreso.setEditable(e);
        txt_serieref.setEditable(!e);
        txt_preimpresoref.setEditable(!e);
        txt_glosa.setEditable(e);
        if (Constans.ISBOTICA) {
            if (Constans.IS_LOTE_RESERVA) {
                tblDevolucionPendiente.getColumnModel().getColumn(11).setCellEditor(editorLote);
                tblDevolucionPendiente.getColumnModel().getColumn(11).setCellRenderer(editorLote);
            }
        }
    }

    @Override
    public void setRegisterEnabled(boolean e) {
        cboMotivoNota.setEnabled(e);
        cboSerie.setEnabled(e);
        cboTipoDocumento.setEnabled(e);
        btn_buscar.setEnabled(e);
        dc_fechainicio.setEnabled(e);
        chk_seleccionar.setEnabled(e);
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
            }
            ContaCab r = reg.get(0);
            cargarMotivoNotaCredito(r.getIdMotivoNc());
            txt_idregconta.setText(r.getRcIdregconta());
            txt_tmpanexo.setText(r.getAnTmpanexo());
            txt_tmpruc.setText(r.getAnTmpruc());
            dc_fechainicio.setDate(r.getFEmision());
            txt_preimpreso.setText(r.getPreimpreso());
            txt_glosa.setText(r.getGlosa());
            cargarLocalidad(r.getIdLocalidad());
            cargarPuntoVenta(r.getIdPuntoventa());
            txt_igv.setText(String.valueOf(r.getMIgv()));
            cboSerie.addItem(r.getSerie());
            txt_idcondicionventa.setSelectedItem(r.getTipoCondpago());
            txt_idcondicionventa.setEnabled(false);
            RnRegContaCab regla_det = new RnRegContaCab(path);
            //001 - DEV. DE PRODUCTOS ENTREGADOS
            if (xMotivoNota.get(cboMotivoNota.getSelectedIndex()).getId_motivo().equals("001")) {
                //LogicMovInventarioCab log1 = new LogicMovInventarioCab(path);
                //ContaCab beanMovRef = log1.getMovInventarioCab(r.getId_regconta_ref());
                LogicRegContaCab log = new LogicRegContaCab(path);
                //beanReferencia = log.getRegcontaCab(beanMovRef.getId_regconta_doc1());
                beanReferencia = log.getRegcontaCab(r.getIdRegcontaRef());
                txt_serieref.setText(beanReferencia.getSerie());
                txt_preimpresoref.setText(beanReferencia.getPreimpreso());
                mdl_xdevoluciondespachado.clearTable();
                mdl_xdevoluciondespachado.agregarVectorVentaDirecta(regla_det.listarRegContaDet(m));
                tbl_xdevoluciondespachado.setAllColumnPreferredWidth();
                calcularImportesDevolucionDespachado();
                cboTipoDocumento.removeAllItems();
                if (beanReferencia.getIdTipoDoc().equalsIgnoreCase("03")) {
                    cboTipoDocumento.addItem("BOLETA DE VENTA");
                } else if (beanReferencia.getIdTipoDoc().equalsIgnoreCase("01")) {
                    cboTipoDocumento.addItem("FACTURA");
                }
            }

            //002 - DEV. DE PRODUCTOS POR ENTREGAR
            if (xMotivoNota.get(cboMotivoNota.getSelectedIndex()).getId_motivo().equals("002")) {
                LogicRegContaCab log = new LogicRegContaCab(path);
                beanReferencia = log.getRegcontaCab(r.getIdRegcontaRef());
                txt_serieref.setText(beanReferencia.getSerie());
                txt_preimpresoref.setText(beanReferencia.getPreimpreso());
                txt_idregconta_ref.setText(beanReferencia.getIdRegconta());
                mdlDevolucionPendiente.clearTable();
                mdlDevolucionPendiente.agregarVectorVentaDirecta(regla_det.listarRegContaDet(m));
                tblDevolucionPendiente.setAllColumnPreferredWidth();
                if (beanReferencia.getIdTipoDoc().equalsIgnoreCase("03")) {
                    cboTipoDocumento.setSelectedIndex(0);
                } else if (beanReferencia.getIdTipoDoc().equalsIgnoreCase("01")) {
                    cboTipoDocumento.setSelectedIndex(1);
                }
            }

            //003 - DEV. DE MERCADERIA POR CAMBIO DE PRECIO
            if (xMotivoNota.get(cboMotivoNota.getSelectedIndex()).getId_motivo().equals("003")) {
                LogicRegContaCab log = new LogicRegContaCab(path);
                beanReferencia = log.getRegcontaCab(r.getIdRegcontaRef());
                txt_serieref.setText(beanReferencia.getSerie());
                txt_preimpresoref.setText(beanReferencia.getPreimpreso());
                mdl_xdescuento.clearTable();
                mdl_xdescuento.agregarVectorVentaDirecta(regla_det.listarRegContaDet(m));
                tbl_xdescuento.setAllColumnPreferredWidth();
                if (beanReferencia.getIdTipoDoc().equalsIgnoreCase("03")) {
                    cboTipoDocumento.setSelectedIndex(1);
                } else if (beanReferencia.getIdTipoDoc().equalsIgnoreCase("01")) {
                    cboTipoDocumento.setSelectedIndex(0);
                }
            }

            return true;
        } catch (Exception e) {
            ExceptionHandler.handleException(e, logger);
            JOptionPane.showMessageDialog(this, e.getMessage());
            return false;
        }
    }

    public void setFormato(String cod) {
        boolean e = false;

        scp_xdevoluciondespachado.setVisible(cod.equals("001") ? !e : e);
        scp_xdescuento.setVisible(cod.equals("003") ? !e : e);
        scp_xdevolucionpendiente.setVisible(cod.equals("002") ? !e : e);
        chk_seleccionar.setVisible(cod.equals("001") ? e : !e);
        cboTipoDocumento.removeAllItems();
        if (cod.equals("001")) {
            cboTipoDocumento.addItem("NOTA DE INGRESO");
        } else {
            cboTipoDocumento.addItem("BOLETA DE VENTA");
            cboTipoDocumento.addItem("FACTURA");
        }

        newRegister();
    }

    @Override
    public void setValueSearch(Object valor, Component comp) {
        if (comp == btn_buscar) {
            //001 - DEV. DE PRODUCTOS ENTREGADOS
            if (xMotivoNota.get(cboMotivoNota.getSelectedIndex()).getId_motivo().equals("001")) {
                ContaCab r = new ContaCab();
                r.setIdMovimiento(valor.toString().trim());
                r.setFEmision(DateTime.format(1901, 0, 1));
                r.setFInicial(DateTime.format(1901, 0, 1));
                r.setFFinal(DateTime.format(1901, 0, 1));

                cargarDocumentoReferenciaDocumentoProductosEntregados(r);
            }

            //002 - DEV. DE PRODUCTOS POR ENTREGAR
            if (xMotivoNota.get(cboMotivoNota.getSelectedIndex()).getId_motivo().equals("002")) {
                ContaCab r = new ContaCab();
                r.setRcIdregconta(valor.toString().trim());
                r.setFEmision(DateTime.format(1901, 0, 1));
                r.setFInicial(DateTime.format(1901, 0, 1));
                r.setFFinal(DateTime.format(1901, 0, 1));

                cargarDocumentoReferenciaDocumentoProductosXEntregar(r);
            }

            //003 - DEV. DE MERCADERIA POR CAMBIO DE PRECIO
            if (xMotivoNota.get(cboMotivoNota.getSelectedIndex()).getId_motivo().equals("003")) {
                List<ContaItem> list = (List<ContaItem>) valor;
                mdl_xdescuento.clearTable();
                mdl_xdescuento.agregarVectorVentaDirecta((List<ContaItem>) valor);
                ContaItem obj = list.get(0);
                double afec = 0;
                double noafec = 0;
                double igv = 0;
                double mont = 0;
                double total = 0;
                ContaItem obj2;
                for (int i = 0; i < list.size(); i++) {
                    obj2 = list.get(i);
                    afec += (list.get(i).getM_afecto() == 0 ? 0 : list.get(i).getM_afecto());
                    noafec += list.get(i).getM_noafecto();
                    igv += list.get(i).getM_igv();
                    mont += list.get(i).getM_monto();
                    total += list.get(i).getM_descuento_total();
                }
                txt_afecto.setText(String.valueOf(Math.rint(afec * 100) / 100));
                txt_noafecto.setText(String.valueOf(Math.rint(noafec * 100) / 100));
                txt_igv.setText(String.valueOf(Math.rint(igv * 100) / 100));
                txt_monto.setText(String.valueOf(Math.rint(mont * 100) / 100));
                tbl_xdescuento.getColumnModel().getColumn(0).setPreferredWidth(60);
                tbl_xdescuento.getColumnModel().getColumn(1).setPreferredWidth(300);
                txt_monto.setVisible(false);
                lblMonto.setVisible(false);
                cargarDocumentoReferenciaDocumentoCambioPrecio2(obj.getContacab());
            }
        }
        if (comp.equals(btnEditLote)) {
            editorLote.stopCellEditing();
            String idSecuencia = valor.toString();
            mdlDevolucionPendiente.reloadLotesSecuencia(idSecuencia);
            tblDevolucionPendiente.setAllColumnPreferredWidth();
        }
    }

    private void cargarDocumentoReferenciaDocumentoCambioPrecio2(ContaCab r) {
        try {
            RnRegContaCab regla = new RnRegContaCab(path);
            List<ContaCab> reg = regla.listarDocumentosVenta(r);

            if (reg != null && reg.size() > 0) {
                ContaCab regContaCab = reg.get(0);
                LogicRegContaCab log = new LogicRegContaCab(path);
                beanReferencia = log.getRegcontaCab(regContaCab.getRcIdregconta());
                fechaRef = regContaCab.getFEmision();
                txt_serieref.setText(regContaCab.getSerie());
                txt_preimpresoref.setText(regContaCab.getPreimpreso());
                txt_idanexo.setText(regContaCab.getAnIdanexo());
                txt_tmpanexo.setText(regContaCab.getAnTmpanexo());
                txt_tmpruc.setText(regContaCab.getAnTmpruc());
                txt_tmpdireccion.setText(regContaCab.getAnTmpdireccion());
                txt_idtipooperacion.setText(regContaCab.getIdTipoOperacion());
                txt_idregconta_ref.setText(regContaCab.getRcIdregconta());
                txt_idtipoanexo.setText(regContaCab.getAnIdtipoanexo());
                txt_id_anexo_ref.setText(regContaCab.getIdAnexoRef());
                txt_id_vendedor.setText(regContaCab.getIdVendedor());
                System.out.println("id_anexo_ref: " + txt_id_anexo_ref.getText().trim() + ", id_vendedor: " + txt_id_vendedor.getText().trim());
                txt_idcondicionventa.setSelectedItem(regContaCab.getTipoCondpago().equalsIgnoreCase("TA") ? "CR" : regContaCab.getTipoCondpago());
                txtMoneda.setText(regContaCab.getMoneda());
                this.setCondicionVenta(regContaCab, regContaCab.getFEmision(), "Fecha de Documento venta \nMayor a fecha Actual");
                txt_idmoneda.setText(regContaCab.getIdMoneda());
                txt_idauxiliar.setText(regContaCab.getIdAuxiliar());
                cboTipoDocumento.setSelectedItem(regContaCab.getIdTipoDoc().equals("01") ? "FACTURA" : "BOLETA DE VENTA");
                cargarLocalidad(regContaCab.getIdLocalidad());
                cargarPuntoVenta(regContaCab.getIdPuntoventa());
                tbl_xdescuento.getColumnModel().getColumn(0).setPreferredWidth(60);
                tbl_xdescuento.getColumnModel().getColumn(1).setPreferredWidth(300);
            }
        } catch (ClassNotFoundException ex) {
            ExceptionHandler.handleException(ex, logger);
        } catch (InstantiationException ex) {
            ExceptionHandler.handleException(ex, logger);
        } catch (IllegalAccessException ex) {
            ExceptionHandler.handleException(ex, logger);
        } catch (Exception ex) {
            ExceptionHandler.handleException(ex, logger);
        }
    }

    private void setCondicionVenta(ContaCab regContaCab, Date fechaEmision, String msgFecha) {
        if (regContaCab.getTipoCondpago().equalsIgnoreCase("TA") || regContaCab.getTipoCondpago().equalsIgnoreCase("CR")) {
            txt_idcondicionventa.setEnabled(false);
            return;
        }
        try {
            java.util.Date fechaActual = new java.util.Date(Main.fechaActualServer.getTime());
            CompareDate compare = new CompareDate(fechaEmision, fechaActual);
            int validar = compare.validarFechas();
            switch (validar) {
                case 0:
                    txt_idcondicionventa.setEnabled(true);
                    break;
                case 1:
                    txt_idcondicionventa.setSelectedItem("CR");
                    txt_idcondicionventa.setEnabled(false);
                    break;
                default:
                    txt_idcondicionventa.setSelectedItem(null);
                    JOptionPane.showMessageDialog(null, msgFecha);
                    txt_idcondicionventa.setEnabled(false);
                    break;
            }
        } catch (Exception ex) {
            ExceptionHandler.handleException(ex, logger);
            JOptionPane.showMessageDialog(null, ex.getMessage());
        }
    }

    private void cargarDocumentoReferenciaDocumentoProductosEntregados(ContaCab r) {
        RnRegContaCab regla = new RnRegContaCab(path);
        List<ContaCab> reg = regla.listarOrdenRecojo(r);

        if (reg != null && reg.size() > 0) {
            try {
                ContaCab regContaCab = reg.get(0);
                LogicRegContaCab log = new LogicRegContaCab(path);
                beanReferencia = log.getRegcontaCab(regContaCab.getIdRegcontaDoc1());
                txt_serieref.setText(regContaCab.getSerie());
                txt_preimpresoref.setText(regContaCab.getPreimpreso());
                txt_idanexo.setText(regContaCab.getAnIdanexo());
                txt_tmpanexo.setText(regContaCab.getAnTmpanexo());
                txt_tmpruc.setText(regContaCab.getAnTmpruc());
                txt_tmpdireccion.setText(regContaCab.getAnTmpdireccion());
                txt_idtipooperacion.setText(regContaCab.getIdTipoOperacion());
                txt_id_movimiento.setText(r.getIdMovimiento());
                txt_idregconta_ref.setText(regContaCab.getIdRegcontaDoc1());
                txt_idtipoanexo.setText(regContaCab.getAnIdtipoanexo());
                txtMoneda.setText(regContaCab.getMoneda());
                txt_idtipo_doc_ref1.setText(regContaCab.getIdTipoDocRef1());
                txt_serie_ref1.setText(regContaCab.getSerieRef1());
                txt_preimpreso_ref1.setText(regContaCab.getPreimpresoRef1());
                txt_id_regconta_doc1.setText(regContaCab.getIdRegcontaDoc1());
                txt_id_anexo_ref.setText(beanReferencia.getIdAnexoRef());
                txt_id_vendedor.setText(beanReferencia.getIdVendedor());
                System.out.println("id_vendedor: " + txt_id_vendedor.getText().trim() + ", id_anexo_ref: " + txt_id_anexo_ref.getText().trim() + ", id_regconta_ref: " + txt_idregconta_ref.getText().trim() + ", id_movimiento: " + txt_id_movimiento.getText().trim());
                if (beanReferencia.getIdCondicionVenta().equalsIgnoreCase("17")) {
                    regContaCab.setTipoCondpago("CO");
                    regContaCab.setFEmision(beanReferencia.getfEmision());
                    txt_idcondicionventa.setSelectedItem(regContaCab.getTipoCondpago().equalsIgnoreCase("TA") ? "CR" : regContaCab.getTipoCondpago());
                } else if (beanReferencia.getIdCondicionVenta().equalsIgnoreCase("22")) {
                    regContaCab.setTipoCondpago("CR");
                    regContaCab.setFEmision(beanReferencia.getfEmision());
                    txt_idcondicionventa.setSelectedItem(regContaCab.getTipoCondpago().equalsIgnoreCase("TA") ? "CR" : regContaCab.getTipoCondpago());
                } else if (beanReferencia.getIdCondicionVenta().equalsIgnoreCase("27")) {
                    regContaCab.setTipoCondpago("TA");
                    regContaCab.setFEmision(beanReferencia.getfEmision());
                    txt_idcondicionventa.setSelectedItem(regContaCab.getTipoCondpago().equalsIgnoreCase("TA") ? "CR" : regContaCab.getTipoCondpago());
                } else {
                    JOptionPane.showMessageDialog(null, "Condicion de venta erronea");
                }
                this.setCondicionVenta(regContaCab, regContaCab.getFEmision(), "Fecha de Documento venta \nMayor a fecha Actual");
                txt_idmoneda.setText(regContaCab.getIdMoneda());
                txt_idauxiliar.setText(regContaCab.getIdAuxiliar());
                cboTipoDocumento.setSelectedItem(regContaCab.getIdTipoDoc().equals("01") ? "FACTURA" : "BOLETA DE VENTA");
                cargarLocalidad(regContaCab.getIdLocalidad());
                cargarPuntoVenta(usuario.getCodpuntoventa());
                txt_afecto.setText(String.valueOf(regContaCab.getMAfecto()));
                txt_noafecto.setText(String.valueOf(regContaCab.getMNoafecto()));
                txt_igv.setText(String.valueOf(regContaCab.getMIgv()));
                txt_percepcion.setText(String.valueOf(regContaCab.getMPercepcion()));
                txt_monto.setText(String.valueOf(regContaCab.getMonto()));
                txt_total.setText(String.valueOf(regContaCab.getTotal()));

                List<ContaItem> v = new ArrayList();
                v.addAll(regla.listarDet("", r.getIdMovimiento(), "", "", "", "", "", "", "", "", "", -1, -1, -1, -1, -1, -1, -1, "", "", -1, "SI"));
                fechaRef = v.get(0).getF_emision();
                this.setCondicionVenta(regContaCab, v.get(0).getF_emision(), "Fecha de Documento de Despacho \nMayor a fecha Actual");
                mdl_xdevoluciondespachado.clearTable();
                chk_seleccionar.setSelected(false);
                mdl_xdevoluciondespachado.agregarVectorVentaDirecta(v);
                chk_seleccionar.setSelected(true);
                tbl_xdevoluciondespachado.setAllColumnPreferredWidth();
            } catch (ClassNotFoundException ex) {
                ExceptionHandler.handleException(ex, logger);
            } catch (InstantiationException ex) {
                ExceptionHandler.handleException(ex, logger);
            } catch (IllegalAccessException ex) {
                ExceptionHandler.handleException(ex, logger);
            } catch (Exception ex) {
                ExceptionHandler.handleException(ex, logger);
            }
        }
    }

    public void mostrarPreimpreso() {
        try {
            RnCorrelativo regla_correlativo = new RnCorrelativo(path);
            String preimpreso = regla_correlativo.listarPreimpreso(xSerie.get(cboSerie.getSelectedIndex()).getIdCorrelativo());
            txt_preimpreso.setText(preimpreso);
        } catch (Exception e) {
            ExceptionHandler.handleException(e, logger);
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }

    private void cargarDocumentoReferenciaDocumentoProductosXEntregar(ContaCab r) {
        try {
            RnRegContaCab regla = new RnRegContaCab(path);
            List<ContaCab> reg = regla.listarDocumentosVenta(r);
            if (reg == null) {
                return;
            }

            if (reg.isEmpty()) {
                return;
            }

            ContaCab regContaCab = reg.get(0);
            LogicRegContaCab log = new LogicRegContaCab(path);
            beanReferencia = log.getRegcontaCab(regContaCab.getRcIdregconta());
            fechaRef = regContaCab.getFEmision();
            txt_serieref.setText(regContaCab.getSerie());
            txt_preimpresoref.setText(regContaCab.getPreimpreso());
            txt_idanexo.setText(regContaCab.getAnIdanexo());
            txt_tmpanexo.setText(regContaCab.getAnTmpanexo());
            txt_tmpruc.setText(regContaCab.getAnTmpruc());
            txt_tmpdireccion.setText(regContaCab.getAnTmpdireccion());
            txt_idtipooperacion.setText(regContaCab.getIdTipoOperacion());
            txt_idregconta_ref.setText(regContaCab.getRcIdregconta());
            txt_idtipoanexo.setText(regContaCab.getAnIdtipoanexo());
            txt_idcondicionventa.setSelectedItem(regContaCab.getTipoCondpago().equalsIgnoreCase("TA") ? "CR" : regContaCab.getTipoCondpago());
            txtMoneda.setText(regContaCab.getMoneda());
            txt_id_vendedor.setText(regContaCab.getIdVendedor());
            txt_id_anexo_ref.setText(regContaCab.getIdAnexoRef());
            System.out.println("id_anexo_ref: " + txt_id_anexo_ref.getText().trim() + ", id_vendedor: " + txt_id_vendedor.getText().trim());
            this.setCondicionVenta(regContaCab, regContaCab.getFEmision(), "Fecha de Documento venta \nMayor a fecha Actual");
            txt_idmoneda.setText(regContaCab.getIdMoneda());
            txt_idauxiliar.setText(regContaCab.getIdAuxiliar());
            cboTipoDocumento.setSelectedItem(regContaCab.getIdTipoDoc().equals("01") ? "FACTURA" : "BOLETA DE VENTA");
            cargarLocalidad(regContaCab.getIdLocalidad());
            cargarPuntoVenta(regContaCab.getIdPuntoventa());
            txt_afecto.setText(String.valueOf(regContaCab.getMAfecto()));
            txt_noafecto.setText(String.valueOf(regContaCab.getMNoafecto()));
            txt_igv.setText(String.valueOf(regContaCab.getMIgv()));
            txt_percepcion.setText(String.valueOf(regContaCab.getMPercepcion()));
            txt_monto.setText(String.valueOf(regContaCab.getMonto()));
            txt_total.setText(String.valueOf(regContaCab.getTotal()));

            r.setTieneCantPordespacharCliente("SI");
            mdlDevolucionPendiente.clearTable();
            chk_seleccionar.setSelected(false);
            mdlDevolucionPendiente.agregarVectorVentaDirecta(this.getItemsPorVenta(r));
            chk_seleccionar.setSelected(true);
            tblDevolucionPendiente.setAllColumnPreferredWidth();
        } catch (ClassNotFoundException ex) {
            ExceptionHandler.handleException(ex, logger);
        } catch (InstantiationException ex) {
            ExceptionHandler.handleException(ex, logger);
        } catch (IllegalAccessException ex) {
            ExceptionHandler.handleException(ex, logger);
        } catch (Exception ex) {
            ExceptionHandler.handleException(ex, logger);
        }
    }

    private List<ContaItem> getItemsPorVenta(ContaCab r) throws Exception {
        try {
            RnRegContaCab regla = new RnRegContaCab(path);
            List<ContaItem> listDetatle = regla.listarRegContaDet(r);
            if (Constans.ISBOTICA && Constans.IS_LOTE_RESERVA) {
                this.setLotesItemReserva(listDetatle, r.getRcIdregconta());
            }
            return listDetatle;
        } catch (Exception e) {
            throw e;
        }
    }

    private void setLotesItemReserva(List<ContaItem> listDetatle, String idRegconta) throws Exception {
        try {
            LogicLote logicLote = new LogicLote(path);
            List<Lote> lotes = logicLote.lotesPorVenta(idRegconta);
            for (ContaItem item : listDetatle) {
                item.setListaLotes(this.getLotesBySecuencia(lotes, item.getId_secuencia()));
                item.setCantidadDespacharLote();
            }
        } catch (Exception e) {
            throw e;
        }
    }

    private ArrayList<Lote> getLotesBySecuencia(List<Lote> lotes, String idSecuencia) {
        ArrayList<Lote> result = new ArrayList();
        for (Lote lote : lotes) {
            if (lote.getIdSecuencia().equals(idSecuencia)) {
                result.add(lote);
            }
        }
        return result;
    }

    private String getNameFile(String idTipoDoc, ContaCab beanRcc) {
        return this.usuario.getRuc() + "-" + idTipoDoc + "-" + beanRcc.getSerie() + "-" + beanRcc.getPreimpreso8Digs();
    }

    private void exportarTxt(ContaCab beanRcc) {
        try {
            FEtxt feTxt = new FEtxt(path, this.getNameFile(beanRcc.getIdTipoDoc(), beanRcc));
            feTxt.exportarTxt(beanRcc.getIdTipoDoc(), beanRcc.getSerie(), beanRcc.getPreimpreso());
            JOptionPane.showMessageDialog(null, "Comprobante electrÃ³nico fue generado");
        } catch (Exception e) {
            ExceptionHandler.handleException(e, logger);
            JOptionPane.showMessageDialog(null, "No se exporto TXT");
        }
    }

    @Override
    public String executeInsert() {
        editorLote.stopCellEditing();
        try {
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
            ContaCab r = new ContaCab();

            r.setIdEmpresa(usuario.getCodempresa());
            r.setIdLocalidad(xLocalidad.get(cboLocalidad.getSelectedIndex() - 1).getId_localidad());
            r.setIdPuntoventa(cboPuntoVenta.getSelectedIndex() > 0 ? (xPuntoVenta.get(cboPuntoVenta.getSelectedIndex() - 1).getId_punto_venta()) : "");
            r.setIdRegcontaRef(txt_idregconta_ref.getText().trim());
            r.setIdMovimiento(txt_id_movimiento.getText().trim());
            r.setIdTipoDocRef(cboTipoDocumento.getSelectedItem().toString().equalsIgnoreCase("FACTURA") ? "01" : cboTipoDocumento.getSelectedItem().toString().equalsIgnoreCase("BOLETA DE VENTA") ? "03" : cboTipoDocumento.getSelectedItem().toString().equalsIgnoreCase("NOTA DE INGRESO") ? "NI" : "");
            r.setSerieRef(txt_serieref.getText().trim());
            r.setPreimpresoRef(txt_preimpresoref.getText().trim());
            r.setAnIdanexo(txt_idanexo.getText().trim());
            r.setAnIdtipoanexo(txt_idtipoanexo.getText().trim());
            r.setIdTrabajador(usuario.getId_trabajador());
            r.setIdTipoDoc(txt_idtipodoc.getText().trim());
            r.setSerie(xSerie.get(cboSerie.getSelectedIndex()).getSerie());
            r.setPreimpreso(txt_preimpreso.getText().trim());
            r.setAnTmpanexo(txt_tmpanexo.getText().trim());
            r.setAnTmpdireccion(txt_tmpdireccion.getText().trim());
            r.setAnTmpruc(txt_tmpruc.getText().trim());
            r.setGlosa(txt_glosa.getText().trim());
            r.setIdEstado(txt_idestado.getText().trim());
            r.setIdUsuario(usuario.getId_usuario());
            r.setIdMotivoNc(xMotivoNota.get(cboMotivoNota.getSelectedIndex()).getId_motivo());
            r.setIdTipoOperacion(txt_idtipooperacion.getText().trim());
            r.setIdAuxiliar(txt_idauxiliar.getText().trim());
            r.setMovDet(scp_xdevolucionpendiente.isVisible() ? mdlDevolucionPendiente.getData() : (scp_xdescuento.isVisible() ? mdl_xdescuento.getData() : mdl_xdevoluciondespachado.getData()));
            r.setIdMoneda(txt_idmoneda.getText().trim());
            r.setMDescuento(Double.valueOf(txt_descuento.getText().trim()));
            r.setMAfecto(Double.valueOf(txt_afecto.getText().trim()));
            r.setMNoafecto(Double.valueOf(txt_noafecto.getText().trim()));
            r.setMIgv(Double.valueOf(txt_igv.getText().trim()));
            r.setMonto(Double.valueOf(txt_monto.getText().trim()));
            r.setFEmision(this.getDateTime0(dc_fechainicio.getDate()));
            r.setFAnulacion(r.getFEmision());
            r.setFCancelacion(r.getFEmision());
            r.setFContable(r.getFEmision());
            r.setFDetraccion(r.getFEmision());
            r.setFDiferida(r.getFEmision());
            r.setFVencimiento(txt_idcondicionventa.getSelectedItem().toString().trim().equalsIgnoreCase("CO") ? dc_fechainicio.getDate() : dc_fechafin.getDate());
            r.setFVencimiento(this.getDateTime0(r.getFVencimiento()));
            r.setAnio(((JTextFieldDateEditor) dc_fechainicio.getDateEditor()).getText().substring(6, 10));
            r.setMes(((JTextFieldDateEditor) dc_fechainicio.getDateEditor()).getText().substring(3, 5));
            r.setIdCondicionVenta(txt_idcondicionventa.getSelectedItem().toString().trim().equalsIgnoreCase("CO") ? "17" : txt_idcondicionventa.getSelectedItem().toString().trim().equalsIgnoreCase("CR") ? "22" : txt_idcondicionventa.getSelectedItem().toString().trim().equalsIgnoreCase("OB") ? "26" : "");
            r.setIdTipoPago(((txt_idcondicionventa.getSelectedItem().toString().trim() != null) && (txt_idcondicionventa.getSelectedItem().toString().trim().equals("CO"))) ? "001" : "");
            r.setMTipoCambio(beanReferencia.getmTipoCambio().doubleValue());
            r.setFechaRef(new java.util.Date(fechaRef.getTime()));

            r.setIdTipoDocRef1(txt_idtipo_doc_ref1.getText());
            r.setSerieRef1(txt_serie_ref1.getText());
            r.setPreimpresoRef1(txt_preimpreso_ref1.getText());
            r.setIdRegcontaDoc1(txt_id_regconta_doc1.getText());
            r.setIdAnexoRef(txt_id_anexo_ref.getText());
            r.setIdVendedor(txt_id_vendedor.getText());
            r.setIdCorrelativo(xSerie.get(cboSerie.getSelectedIndex()).getIdCorrelativo());

            RnRegContaCab regla = new RnRegContaCab(path);

            //001 - DEV. DE PRODUCTOS ENTREGADOS
            if (xMotivoNota.get(cboMotivoNota.getSelectedIndex()).getId_motivo().equals("001")) {
                if (r.getIdMoneda().equalsIgnoreCase("00001")) {
                    r.setIdTipoOperacion(txt_idcondicionventa.getSelectedItem().toString().trim().equalsIgnoreCase("CO") ? "022" : txt_idcondicionventa.getSelectedItem().toString().trim().equalsIgnoreCase("CR") ? "021" : "");
                } else if (r.getIdMoneda().equalsIgnoreCase("00004")) {
                    r.setIdTipoOperacion(txt_idcondicionventa.getSelectedItem().toString().trim().equalsIgnoreCase("CO") ? "122" : txt_idcondicionventa.getSelectedItem().toString().trim().equalsIgnoreCase("CR") ? "121" : "");
                }

                if (validarFechas(r.getFechaRef(), r.getFEmision())) {
                    String idReconta = regla.insertarNotaCreditoProductosEntregados(r);
                    if (!Constans.ISIMPRESIONVENTA) {
                        if (Integer.parseInt(idReconta) > 0) {
                            exportarTxt(r);
                        } else {
                            System.err.println("Error: " + idReconta);
                            logger.debug(idReconta);
                        }
                    }
                    return idReconta;
                } else {
                    JOptionPane.showMessageDialog(null, "Fecha de referencia mayor a fecha de emision");
                }
            }

            //002 -	DEV. DE PRODUCTOS POR ENTREGAR
            if (xMotivoNota.get(cboMotivoNota.getSelectedIndex()).getId_motivo().equals("002")) {
                if (validarFechas(r.getFechaRef(), r.getFEmision())) {
                    String idReconta = regla.insertarNotaCreditoProductosPorEntregar(r);
                    if (!Constans.ISIMPRESIONVENTA) {
                        if (Integer.parseInt(idReconta) > 0) {
                            exportarTxt(r);
                        } else {
                            System.err.println("Error: " + idReconta);
                            logger.debug(idReconta);
                        }
                    }
                    return idReconta;
                } else {
                    JOptionPane.showMessageDialog(null, "Fecha de referencia mayor a fecha de emision");
                }
            }
            Boolean bol = true;
            //003 - DEV. DE MERCADERIA POR CAMBIO DE PRECIO
            if (xMotivoNota.get(cboMotivoNota.getSelectedIndex()).getId_motivo().equals("003")) {
                if (validarFechas(r.getFEmision(), Main.fechaActualServer)) {
                    if (validarFechas(r.getFechaRef(), r.getFEmision())) {
                        List<ContaItem> lista = mdl_xdescuento.getData();
                        ContaItem conta;
                        for (int i = 0; i < lista.size(); i++) {
                            conta = lista.get(i);
                            if (conta.isAutorizar()) {
                                bol = false;
                                break;
                            }
                        }
                        if (bol) {
                            String idReconta = regla.insertarNotaCreditoCambioPrecio(r);
                            if (!Constans.ISIMPRESIONVENTA) {
                                if (Integer.parseInt(idReconta) > 0) {
                                    exportarTxt(r);
                                } else {
                                    System.err.println("Error: " + idReconta);
                                    logger.debug(idReconta);
                                }
                            }
                            return idReconta;
                        } else if (userAutorizado != null) {
                            if (userAutorizado.equals("S")) {
                                this.dispose();
                                String idReconta = regla.insertarNotaCreditoCambioPrecio(r);
                                if (!Constans.ISIMPRESIONVENTA) {
                                    if (Integer.parseInt(idReconta) > 0) {
                                        exportarTxt(r);
                                    } else {
                                        System.err.println("Error: " + idReconta);
                                        logger.debug(idReconta);
                                    }
                                }
                                return idReconta;
                            }
                        } else {
                            JDialog dialogo = new JDialog();
                            dialogo.setUndecorated(true);
                            String idReconta = regla.insertarNotaCreditoCambioPrecio(r);
                            if (!Constans.ISIMPRESIONVENTA) {
                                if (Integer.parseInt(idReconta) > 0) {
                                    exportarTxt(r);
                                } else {
                                    System.err.println("Error: " + idReconta);
                                    logger.debug(idReconta);
                                }
                            }
                            return idReconta;
                        }

                    } else {
                        JOptionPane.showMessageDialog(null, "Fecha de referencia mayor a fecha de emision");
                    }
                } else {
                    JOptionPane.showMessageDialog(null, "Fecha de emision no debe ser mayor a fecha actual");
                }
            }

            return "";
        } catch (ClassNotFoundException ex) {
            ExceptionHandler.handleException(ex, logger);
            JOptionPane.showMessageDialog(null, ex.getMessage());
        } catch (InstantiationException ex) {
            ExceptionHandler.handleException(ex, logger);
            JOptionPane.showMessageDialog(null, ex.getMessage());
        } catch (IllegalAccessException ex) {
            ExceptionHandler.handleException(ex, logger);
            JOptionPane.showMessageDialog(null, ex.getMessage());
        } catch (Exception ex) {
            ExceptionHandler.handleException(ex, logger);
            JOptionPane.showMessageDialog(null, ex.getMessage());
        }
        return "";
    }

    private Date getDateTime0(Date fecha) {
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(fecha);
        calendar.set(Calendar.MILLISECOND, 0);
        calendar.set(Calendar.SECOND, 0);
        calendar.set(Calendar.MINUTE, 0);
        calendar.set(Calendar.HOUR, 0);
        return calendar.getTime();
    }

    private boolean validarFechas(java.util.Date fechaInicio, java.util.Date fechaFin) {
        Calendar calendarIni = new GregorianCalendar();
        Calendar calendarFin = new GregorianCalendar();
        calendarIni.setTime(fechaInicio);
        calendarFin.setTime(fechaFin);
        int annoInicio = calendarIni.get(Calendar.YEAR);
        int mesInicio = calendarIni.get(Calendar.MONTH);
        int diaInicio = calendarIni.get(Calendar.DAY_OF_MONTH);
        int annoFin = calendarFin.get(Calendar.YEAR);
        int mesFin = calendarFin.get(Calendar.MONTH);
        int diaFin = calendarFin.get(Calendar.DAY_OF_MONTH);
        if (annoFin == annoInicio) {
            if (mesFin == mesInicio) {
                return diaFin >= diaInicio;
            } else {
                return mesFin > mesInicio;
            }
        } else {
            return annoFin > annoInicio;
        }
    }

    private void loadLocalidad(String xcodEmpres) {
        try {
            RnLocalidad regla_Localidad = new RnLocalidad(path);
            if (xLocalidad != null) {
                xLocalidad.clear();
            } else {
                xLocalidad = new ArrayList();
            }
            xLocalidad.addAll(regla_Localidad.listar("", xcodEmpres, "", "", ""));
            cboLocalidad.removeAllItems();
            cboLocalidad.addItem("--- Seleccione una Localidad ---");
            for (int i = 0; i < xLocalidad.size(); i++) {
                cboLocalidad.addItem(xLocalidad.get(i).getDescripcion());
            }
            cboLocalidad.setSelectedIndex(0);
        } catch (Exception e) {
            ExceptionHandler.handleException(e, logger);
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }

    private void loadPuntoVenta(String xcodLocalidad) {
        try {
            RnPuntoVenta regla_PuntoVenta = new RnPuntoVenta(path);

            if (xPuntoVenta != null) {
                xPuntoVenta.clear();
            } else {
                xPuntoVenta = new ArrayList();
            }

            xPuntoVenta.addAll(regla_PuntoVenta.listar("", "", xcodLocalidad, "", "", "", "", ""));

            cboPuntoVenta.removeAllItems();
            cboPuntoVenta.addItem("--- Seleccione un Punto de Venta ---");

            for (int i = 0; i < xPuntoVenta.size(); i++) {
                cboPuntoVenta.addItem(xPuntoVenta.get(i).getDescripcion_puntoventa());
            }

            cboPuntoVenta.setSelectedIndex(0);
        } catch (Exception e) {
            ExceptionHandler.handleException(e, logger);
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }

    private void loadSerieCorrelativo(String idTipoDoc) {
        try {
            RnCorrelativo regla_correlativo = new RnCorrelativo(path);

            if (xSerie != null) {
                xSerie.clear();
            } else {
                xSerie = new ArrayList();
            }
            xSerie.addAll(regla_correlativo.listarCorrelativo(usuario.getId_usuario(), usuario.getCodpuntoventa(), idTipoDoc));

            cboSerie.removeAllItems();

            for (int i = 0; i < xSerie.size(); i++) {
                cboSerie.addItem(xSerie.get(i).getSerie());
            }

            if (cboSerie.getItemCount() > 0) {
                cboSerie.setSelectedIndex(0);
            }
        } catch (Exception e) {
            ExceptionHandler.handleException(e, logger);
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }

    @Override
    public void actionPerformed(ActionEvent e) {
        if (cboMotivoNota == e.getSource()) {
            if (cboMotivoNota.getItemCount() > 0) {
                setFormato(xMotivoNota.get(cboMotivoNota.getSelectedIndex()).getId_motivo());
            }
        }

        if (e.getSource() == btn_buscar) {
            //001 - DEV. DE PRODUCTOS ENTREGADOS
            if (xMotivoNota.get(cboMotivoNota.getSelectedIndex()).getId_motivo().equals("001")) {
                BuscarNCIngresoCliente a = new BuscarNCIngresoCliente(frame, this, usuario, path);
                a.cargarTabla(btn_buscar);
            }

            //002 - DEV. DE PRODUCTOS POR ENTREGAR
            if (xMotivoNota.get(cboMotivoNota.getSelectedIndex()).getId_motivo().equals("002")) {
                BuscarNCPendienteCliente a = new BuscarNCPendienteCliente(frame, this, usuario, path);
                a.cargarTabla(btn_buscar);
            }

            //003 - DEV. DE MERCADERIA POR CAMBIO DE PRECIO
            if (xMotivoNota.get(cboMotivoNota.getSelectedIndex()).getId_motivo().equals("003")) {
                BuscarNCDocumentosVenta a = new BuscarNCDocumentosVenta(frame, this, usuario, path);
                chk_seleccionar.setVisible(false);
                a.cargarTabla(btn_buscar);

            }
        }
        if (cboLocalidad == e.getSource()) {
            if (cboLocalidad.getItemCount() > 0) {
                if (cboLocalidad.getSelectedIndex() == 0) {
                    cboPuntoVenta.removeAllItems();
                } else {
                    loadPuntoVenta(xLocalidad.get(cboLocalidad.getSelectedIndex() - 1).getId_localidad());
                }
            }
        }

        if (cboSerie == e.getSource()) {
            if (cboSerie.getItemCount() > 0 && mode == INSERT) {
                mostrarPreimpreso();
            }
        }

    }

    public void cargarMotivoNotaCredito(String xcodiEmpresa) {
        if (xMotivoNota != null && !xcodiEmpresa.isEmpty()) {
            for (int i = 0; i < xMotivoNota.size(); i++) {
                if (xMotivoNota.get(i).getId_motivo().equals(xcodiEmpresa)) {
                    cboMotivoNota.setSelectedIndex(i);
                    break;
                }
            }
        }
    }

    public void cargarLocalidad(String xcodiLocalidad) {
        if (xLocalidad != null && !xcodiLocalidad.isEmpty()) {
            for (int i = 0; i < xLocalidad.size(); i++) {
                if (xLocalidad.get(i).getId_localidad().equals(xcodiLocalidad)) {
                    cboLocalidad.setSelectedIndex(i + 1);
                    break;
                }
            }
        }
    }

    public void cargarPuntoVenta(String codPuntoVenta) {
        if (xPuntoVenta != null && !codPuntoVenta.isEmpty()) {
            for (int i = 0; i < xPuntoVenta.size(); i++) {
                if (xPuntoVenta.get(i).getId_punto_venta().equals(codPuntoVenta)) {
                    cboPuntoVenta.setSelectedIndex(i + 1);
                    break;
                }
            }
        }
    }

    @Override
    public void itemStateChanged(ItemEvent e) {
        editorLote.stopCellEditing();
        boolean isSelect;

        isSelect = (e.getStateChange() == ItemEvent.SELECTED);

        if (e.getItemSelectable() == chk_seleccionar) {
            if (xMotivoNota.get(cboMotivoNota.getSelectedIndex()).getId_motivo().equals("002")) {
                for (int i = 0; i < mdlDevolucionPendiente.getRowCount(); i++) {
                    mdlDevolucionPendiente.getVentaDirecta(i).setSeleccionado(isSelect);
                    mdlDevolucionPendiente.getVentaDirecta(i).setCant_a_devolver(mdlDevolucionPendiente.getVentaDirecta(i).isSeleccionado() == false ? "" : String.valueOf(mdlDevolucionPendiente.getVentaDirecta(i).getCant_pordespachar_cliente()).trim());
                    mdlDevolucionPendiente.getVentaDirecta(i).calcularMontos("C");
                }
                mdlDevolucionPendiente.fireTableDataChanged();
            }

            if (xMotivoNota.get(cboMotivoNota.getSelectedIndex()).getId_motivo().equals("003")) {
                for (int i = 0; i < mdl_xdescuento.getRowCount(); i++) {
                    mdl_xdescuento.getVentaDirecta(i).setSeleccionado(isSelect);
                    mdl_xdescuento.getVentaDirecta(i).setCant_a_devolver(mdl_xdescuento.getVentaDirecta(i).isSeleccionado() == false ? "" : String.valueOf(mdl_xdescuento.getVentaDirecta(i).getCantidad_string()).trim());
                    mdl_xdescuento.getVentaDirecta(i).setM_monto(mdl_xdescuento.getVentaDirecta(i).getCant_a_devolver().length() > 0 ? (Double.parseDouble(mdl_xdescuento.getVentaDirecta(i).getCant_a_devolver()) * mdl_xdescuento.getVentaDirecta(i).getP_unit()) : 0);
                    mdl_xdescuento.getVentaDirecta(i).setM_valor(mdl_xdescuento.getVentaDirecta(i).getAfecto_a_igv().equals("S") ? (mdl_xdescuento.getVentaDirecta(i).getM_monto() / (1 + mdl_xdescuento.getVentaDirecta(i).getP_igv())) : mdl_xdescuento.getVentaDirecta(i).getM_monto());
                    mdl_xdescuento.getVentaDirecta(i).setM_igv(mdl_xdescuento.getVentaDirecta(i).getAfecto_a_igv().equals("S") ? (mdl_xdescuento.getVentaDirecta(i).getM_monto() - mdl_xdescuento.getVentaDirecta(i).getM_valor()) : 0);
                    mdl_xdescuento.getVentaDirecta(i).setM_afecto(mdl_xdescuento.getVentaDirecta(i).getAfecto_a_igv().equals("S") ? (mdl_xdescuento.getVentaDirecta(i).getM_valor()) : 0);
                    mdl_xdescuento.getVentaDirecta(i).setM_noafecto(mdl_xdescuento.getVentaDirecta(i).getAfecto_a_igv().equals("S") ? (0) : mdl_xdescuento.getVentaDirecta(i).getM_valor());
                    mdl_xdescuento.getVentaDirecta(i).setM_percepcion(mdl_xdescuento.getVentaDirecta(i).getAfecto_percepcion().equals("S") ? (mdl_xdescuento.getVentaDirecta(i).getM_monto() * mdl_xdescuento.getVentaDirecta(i).getP_percepcion()) : 0);
                    mdl_xdescuento.getVentaDirecta(i).setM_total(mdl_xdescuento.getVentaDirecta(i).getM_monto() + mdl_xdescuento.getVentaDirecta(i).getM_percepcion());
                }

                mdl_xdescuento.fireTableDataChanged();
            }
        }
    }

    @Override
    public void tableChanged(TableModelEvent e) {
        if (mdl_xdescuento.getRowCount() > 0) {
            if (e.getSource() == mdl_xdescuento) {
                calcularImportesDescuento();
            }
        }

        if (mdlDevolucionPendiente.getRowCount() > 0) {
            if (e.getSource() == mdlDevolucionPendiente) {
                calcularImportesDevolucionPendiente();
            }
        }

        if (mdl_xdevoluciondespachado.getRowCount() > 0) {
            if (e.getSource() == mdl_xdevoluciondespachado) {
                calcularImportesDevolucionDespachado();
            }
        }
    }

    public void calcularImportesDescuento() {
        txt_afecto.setText("0.0");
        txt_percepcion.setText("0.0");
        txt_descuento.setText("0.0");
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

        tbl_xdescuento.setNoVisibleColumn(6);
        tbl_xdescuento.setNoVisibleColumn(7);
        tbl_xdescuento.setNoVisibleColumn(8);
        tbl_xdescuento.setNoVisibleColumn(9);
        tbl_xdescuento.setNoVisibleColumn(10);
        tbl_xdescuento.setNoVisibleColumn(11);
        tbl_xdescuento.setNoVisibleColumn(12);
        tbl_xdescuento.setNoVisibleColumn(13);
        tbl_xdescuento.setNoVisibleColumn(14);

        for (int i = 0; i < mdl_xdescuento.getRowCount(); i++) {
            ContaItem obtab = mdl_xdescuento.getVentaDirecta(i);

            m_percepcion = m_percepcion.add(BigDecimal.valueOf(obtab.getM_percepcion()));
            monto = monto.add(BigDecimal.valueOf(obtab.getM_monto()));
            m_afecto = m_afecto.add(BigDecimal.valueOf(obtab.getM_afecto()));
            m_noafecto = m_noafecto.add(BigDecimal.valueOf(obtab.getM_noafecto()));
            m_igv = m_igv.add(BigDecimal.valueOf(obtab.getM_igv()));
            m_descuento = m_descuento.add(BigDecimal.valueOf(obtab.getM_descuento()));
            obtab.setP_unit(obtab.getM_descuento());
        }

        txt_descuento.setText(m_descuento.toString());
        BigDecimal montoAfecto = monto.subtract(m_igv).add(m_noafecto);
        txt_afecto.setText(montoAfecto.toString());
        txt_noafecto.setText(m_noafecto.toString());
        txt_igv.setText(m_igv.toString());
        txt_monto.setText(monto.toString());
        txt_percepcion.setText(m_percepcion.toString());
        BigDecimal montoTotal = monto.add(m_percepcion);
        txt_total.setText(montoTotal.toString());
    }

    public void calcularImportesDevolucionDespachado() {
        txt_afecto.setText("0.0");
        txt_percepcion.setText("0.0");
        txt_descuento.setText("0.0");
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

        for (int i = 0; i < mdl_xdevoluciondespachado.getRowCount(); i++) {
            ContaItem obtab = mdl_xdevoluciondespachado.getVentaDirecta(i);

            m_percepcion = m_percepcion.add(BigDecimal.valueOf(obtab.getM_percepcion()));
            monto = monto.add(BigDecimal.valueOf(obtab.getM_monto()));
            m_afecto = m_afecto.add(BigDecimal.valueOf(obtab.getM_afecto()));
            m_noafecto = m_noafecto.add(BigDecimal.valueOf(obtab.getM_noafecto()));
            m_igv = m_igv.add(BigDecimal.valueOf(obtab.getM_igv()));
            m_descuento = m_descuento.add(BigDecimal.valueOf(obtab.getM_descuento()));
        }

        txt_descuento.setText(m_descuento.toString());
        BigDecimal montoAfecto = monto.subtract(m_igv).add(m_noafecto);
        txt_afecto.setText(montoAfecto.toString());
        txt_noafecto.setText(m_noafecto.toString());
        txt_igv.setText(m_igv.toString());
        txt_monto.setText(monto.toString());
        txt_percepcion.setText(m_percepcion.toString());
        BigDecimal montoTotal = monto.add(m_percepcion);
        txt_total.setText(montoTotal.toString());
    }

    public JDialog verDialogo() {
        JDialog dialogo = new JDialog();

        return dialogo;
    }

    public void calcularImportesDevolucionPendiente() {
        txt_afecto.setText("0.0");
        txt_percepcion.setText("0.0");
        txt_descuento.setText("0.0");
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

        for (int i = 0; i < mdlDevolucionPendiente.getRowCount(); i++) {
            ContaItem obtab = mdlDevolucionPendiente.getVentaDirecta(i);

            m_percepcion = m_percepcion.add(BigDecimal.valueOf(obtab.getM_percepcion()));
            monto = monto.add(BigDecimal.valueOf(obtab.getM_montoReal()));
            m_afecto = m_afecto.add(BigDecimal.valueOf(obtab.getM_afecto()));
            m_noafecto = m_noafecto.add(BigDecimal.valueOf(obtab.getM_noafecto()));
            m_igv = m_igv.add(BigDecimal.valueOf(obtab.getM_igv()));
            m_descuento = m_descuento.add(BigDecimal.valueOf(obtab.getM_descuento()));
        }

        txt_descuento.setText(m_descuento.toString());
        BigDecimal montoAfecto = monto.subtract(m_igv).add(m_noafecto);
        txt_afecto.setText(montoAfecto.toString());
        txt_noafecto.setText(m_noafecto.toString());
        txt_igv.setText(m_igv.toString());
        txt_monto.setText(monto.toString());
        txt_percepcion.setText(m_percepcion.toString());
        BigDecimal montoTotal = monto.add(m_percepcion);
        txt_total.setText(montoTotal.toString());
    }

    @Override
    public boolean isRegisterValid() {
        /*String digitSerie = xSerie.get(cboSerie.getSelectedIndex()).getSerie().substring(0, 1);
        //String digitSerieRef = txt_serieref.getText().substring(0, 1);
        String digitSerieRef = beanReferencia.getSerie().substring(0, 1);
        if (!digitSerie.equals(digitSerieRef)) {
            JOptionPane.showMessageDialog(this, "Seleccione otra serie");
            return false;
        }*/
        String serie = xSerie.get(cboSerie.getSelectedIndex()).getSerie().trim();
        String serieRef = beanReferencia.getSerie().trim();
        if (serie.length() != serieRef.length()) {
            return true;
        }
        String digitSerie = serie.substring(0, 1);
        String digitSerieRef = serieRef.substring(0, 1);
        if (!digitSerie.equals(digitSerieRef)) {
            JOptionPane.showMessageDialog(this, "Seleccione otra serie");
            return false;
        }
        return true;
    }

    @Override
    public void showMessagePrint(String codigo) {
        try {
            if (Constans.IS_FACTURADOR_SUNAT) {
                return;
            }
            String rutaJasper;
            rutaJasper = com.softcommerce.util.Constans.PATH_RPT_NOTACREDITO;
            Map parameters = new HashMap();
            parameters.put(JRParameter.REPORT_LOCALE, Locale.US);
            Exportar exportar;
            DataSourceNc dataSource = new DataSourceNc();
            RnConsultas logic = new RnConsultas(path);
            List<BeanNcReporte> list = logic.listarNcReporte(codigo);
            for (int i = 0; i < list.size(); i++) {
                BeanNcReporte bean = list.get(i);
                dataSource.add(bean);
            }
            exportar = new Exportar(parameters, dataSource, rutaJasper);
            exportar.vistaPrevia(false);
        } catch (Exception ex) {
            ExceptionHandler.handleException(ex, logger);
            JOptionPane.showMessageDialog(this, ex.toString());
        }
    }

    @Override
    public boolean executeDelete() {
        try {
            String idRegconta = txt_idregconta.getText().trim();
            RnRegContaCab logicRcc = new RnRegContaCab(path);
            logicRcc.eliminarRccVenta(idRegconta);
            JOptionPane.showMessageDialog(this, "Documento eliminado correctamente");
            return true;
        } catch (Exception e) {
            ExceptionHandler.handleException(e, logger);
            JOptionPane.showMessageDialog(this, e.getMessage());
            return false;
        }
    }

    @Override
    public boolean executeAnular() {
        String motivo = xMotivoNota.get(cboMotivoNota.getSelectedIndex()).getId_motivo();
        try {
            RnRegContaCab regla = new RnRegContaCab(path);
            return regla.anularNotaCredito(txt_idregconta.getText().trim(), usuario.getId_usuario(), new Date(),
                    usuario.getCodempresa(), DateTime.getYear(), DateTime.getMonth(), AuxiliarEnum.VENTA.getValue(), motivo);
        } catch (Exception e) {
            ExceptionHandler.handleException(e, logger);
            JOptionPane.showMessageDialog(this, e.getMessage());
            return false;
        }
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
    public boolean executeSelect() {
        return true;
    }

    @Override
    public void onPressEsc() {
    }

    public JButton getBtnEditLote() {
        return btnEditLote;
    }

}

