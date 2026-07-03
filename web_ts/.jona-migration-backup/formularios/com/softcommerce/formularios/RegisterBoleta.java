package com.softcommerce.formularios;

import com.softcommerce.beans.BeanCondicionPago;
import com.softcommerce.beans.BeanMoneda;
import com.softcommerce.beans.BeanTipoDocVenta;
import com.softcommerce.beans.BeanTipoPago;
import com.softcommerce.beans.ContaCab;
import com.softcommerce.beans.ContaItem;
import com.softcommerce.beans.BeanParametro;
import com.softcommerce.beans.Usuario;
import com.softcommerce.enums.AuxiliarEnum;
import com.softcommerce.enums.TipoMovInventarioEnum;
import com.softcommerce.general.controles.CComboBox;
import com.softcommerce.general.controles.CLabel;
import com.softcommerce.general.controles.CTable;
import com.softcommerce.general.controles.DigitTextFieldCellEditor;
import com.softcommerce.general.controles.EnumClass;
import com.softcommerce.general.controles.IntegerDocument;
import com.softcommerce.general.controles.JHInternal;
import com.softcommerce.general.controles.RowSelection;
import com.softcommerce.general.controles.View;
import com.softcommerce.general.herramientas.CFunciones;
import com.softcommerce.general.herramientas.DateTime;
import com.softcommerce.general.sunat.ConvertDataSunat;
import com.softcommerce.general.tablas.TableModelRegisterBoletaDetalleVenta;
import com.softcommerce.logic.LogicRegContaCab;
import com.softcommerce.reglasnegocio.RnConsultas;
import com.softcommerce.reglasnegocio.RnTipoDocVenta;
import com.softcommerce.reglasnegocio.RnTipoPago;
import com.softcommerce.reglasnegocio.rn_CondicionPago;
import com.softcommerce.reglasnegocio.RnCorrelativo;
import com.softcommerce.reglasnegocio.RnMovInventarioCab;
import com.softcommerce.reglasnegocio.RnParametro;
import com.softcommerce.reglasnegocio.RnRegContaCab;
import com.softcommerce.util.render.CellRendererDetalleDocumento;
import com.softcommerce.util.Constans;
import com.softcommerce.util.ExceptionHandler;
import com.softcommerce.util.FormatObject;
import com.softcommerce.util.combo.LoadCombo;
import com.toedter.calendar.JDateChooser;
import com.toedter.calendar.JTextFieldDateEditor;
import java.awt.BorderLayout;
import java.awt.Color;
import java.awt.Component;
import java.awt.Dimension;
import java.awt.Font;
import java.awt.Toolkit;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.FocusEvent;
import java.awt.event.FocusListener;
import java.awt.event.KeyEvent;
import java.awt.event.KeyListener;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;
import java.util.List;
import javax.swing.JCheckBox;
import javax.swing.JComboBox;
import javax.swing.JComponent;
import javax.swing.JFormattedTextField;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import javax.swing.JScrollPane;
import javax.swing.JTabbedPane;
import javax.swing.JTextField;
import javax.swing.JToolBar;
import javax.swing.KeyStroke;
import javax.swing.SwingConstants;
import javax.swing.event.InternalFrameEvent;
import javax.swing.event.TableModelEvent;
import javax.swing.event.TableModelListener;
import org.apache.log4j.Logger;

public class RegisterBoleta
        extends JHInternal
        implements KeyListener, ActionListener, FocusListener, TableModelListener {

    private static final long serialVersionUID = 1L;
    private JFrame frame;
    private Usuario usuario;
    private JFormattedTextField txtFechaVence;
    private JComboBox cbo_condicionpago;
    public TableModelRegisterBoletaDetalleVenta mdl_detalleventa;
    public CTable tbl_detalleventa;
    private List<BeanTipoDocVenta> lst_tipodocventa;
    private CComboBox cbo_idtipodoc;
    private List<BeanMoneda> lst_moneda = new ArrayList();
    private JComboBox cbo_moneda;
    private List<BeanCondicionPago> lst_condpago;
    private JComboBox cbo_diaspago;
    private List<BeanTipoPago> lst_tipopago;
    private JComboBox cbo_tipopago;
    private JDateChooser dc_fechaemision;
    private JTextField txt_tipocambio;
    private JTextField txt_serie;
    private JTextField txt_preimpreso;
    private JTextField txt_empresa;
    private JTextField txt_localidad;
    private JTextField txt_puntoventa;
    private JTextField txt_idregconta;
    private JTextField txt_tmpanexo;
    private JTextField txt_tmpruc;
    private JTextField txt_tmpdireccion;
    private JTextField txt_idanexo;
    private JTextField txt_tipoanexo;
    private JTextField txt_idauxiliar;
    private JTextField txt_estado;
    private JTextField txt_mpercepcion;
    private JTextField txt_mafecto;
    private JTextField txt_mnoafecto;
    private JTextField txt_migv;
    private JTextField txt_mdescuento;
    private JTextField txt_total;
    private JTextField txt_monto;
    private JTextField txt_valor;
    private JCheckBox chk_agpercepcion;
    private JCheckBox chk_buencontribuyente;
    private JCheckBox chk_agretencion;
    private JCheckBox chk_exepetuado;
    private final Logger logger = Logger.getLogger(RegisterBoleta.class);

    public RegisterBoleta(String title, Usuario usuario, JFrame frame) {
        super(title + " - RegisterBoleta");
        this.usuario = usuario;
        this.frame = frame;
        inicialize();
    }

    private void inicialize() {
        super.pnlRegister.setPreferredSize(new Dimension(980, 485));
        super.setMaximizable(false);
        super.setSize(1020, 545);
        super.setLocation(((Toolkit.getDefaultToolkit().getScreenSize().width - getSize().width) / 2), (Toolkit.getDefaultToolkit().getScreenSize().height - getSize().height) / 20);
        super.setResizable(false);

        JPanel pnlDialog = new JPanel();
        pnlDialog.setLayout(null);
        pnlDialog.setBackground(new Color(245, 245, 245));

        CLabel lbl_idregconta = new CLabel("Código");
        lbl_idregconta.setFont(new Font(Font.SANS_SERIF, 0, 11));
        lbl_idregconta.setBounds(20, 25, 40, 20);
        pnlDialog.add(lbl_idregconta);

        txt_idregconta = new JTextField();
        txt_idregconta.setEditable(false);
        txt_idregconta.setBounds(70, 25, 90, 20);
        txt_idregconta.setFont(new Font(Font.SANS_SERIF, 0, 11));
        pnlDialog.add(txt_idregconta);

        CLabel lbl_idtipodoc = new CLabel("T Doc");
        lbl_idtipodoc.setBounds(200, 25, 35, 20);
        lbl_idtipodoc.setFont(new Font(Font.SANS_SERIF, 0, 11));
        pnlDialog.add(lbl_idtipodoc);

        cbo_idtipodoc = new CComboBox();
        cbo_idtipodoc.setBounds(235, 25, 220, 20);
        cbo_idtipodoc.addActionListener(this);
        cbo_idtipodoc.setFont(new Font(Font.SANS_SERIF, 0, 11));
        cbo_idtipodoc.addKeyListener(this);
        pnlDialog.add(cbo_idtipodoc);

        JLabel lbl_serie = new JLabel("N° Doc");
        lbl_serie.setBounds(460, 25, 35, 20);
        lbl_serie.setFont(new Font(Font.SANS_SERIF, 0, 11));
        pnlDialog.add(lbl_serie);

        txt_serie = new JTextField();
        txt_serie.setBounds(495, 25, 30, 20);
        txt_serie.addKeyListener(this);
        txt_serie.setFont(new Font(Font.SANS_SERIF, 0, 11));
        txt_serie.addFocusListener(this);
        FormatObject.formatJTextFieldSerie(txt_serie);
        txt_serie.setForeground(Color.BLACK);
        pnlDialog.add(txt_serie);

        txt_preimpreso = new JTextField();
        txt_preimpreso.setBounds(530, 25, 80, 20);
        txt_preimpreso.addKeyListener(this);
        txt_preimpreso.setFont(new Font(Font.SANS_SERIF, 0, 11));
        txt_preimpreso.addFocusListener(this);
        txt_preimpreso.setDocument(new IntegerDocument(10));
        txt_preimpreso.setForeground(Color.BLACK);
        pnlDialog.add(txt_preimpreso);

        CLabel lblFechaEmision = new CLabel("F Emision");
        lblFechaEmision.setDisplayedMnemonic('c');
        lblFechaEmision.setFont(new Font(Font.SANS_SERIF, 0, 11));
        lblFechaEmision.setBounds(620, 25, 50, 20);
        pnlDialog.add(lblFechaEmision);

        dc_fechaemision = new JDateChooser("dd/MM/yyyy", "##/##/####", '_');
        ((JTextFieldDateEditor) dc_fechaemision.getDateEditor()).addFocusListener(this);
        ((JTextFieldDateEditor) dc_fechaemision.getDateEditor()).addKeyListener(this);
        dc_fechaemision.setBounds(680, 25, 90, 20);
        dc_fechaemision.getJCalendar().addFocusListener(this);
        dc_fechaemision.getJCalendar().addKeyListener(this);
        dc_fechaemision.getCalendarButton().addActionListener(this);
        dc_fechaemision.addKeyListener(this);
        dc_fechaemision.addFocusListener(this);
        ((JTextField) dc_fechaemision.getDateEditor()).registerKeyboardAction(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                dc_fechaemision.getCalendarButton().doClick();
            }
        }, KeyStroke.getKeyStroke(KeyEvent.VK_SPACE, 0, false), JComponent.WHEN_FOCUSED);
        pnlDialog.add(dc_fechaemision);

        JLabel lblCondicionPago = new JLabel("C. Pago");
        lblCondicionPago.setBounds(20, 55, 60, 20);
        lblCondicionPago.setFont(new Font("Verdana", 0, 11));
        lblCondicionPago.setFont(new Font(Font.SANS_SERIF, 0, 11));
        pnlDialog.add(lblCondicionPago);

        cbo_condicionpago = new JComboBox();
        cbo_condicionpago.setBounds(70, 55, 215, 20);
        cbo_condicionpago.addKeyListener(this);
        cbo_condicionpago.addActionListener(this);
        cbo_condicionpago.setFont(new Font(Font.SANS_SERIF, 0, 11));
        pnlDialog.add(cbo_condicionpago);

        JLabel lblDiasPago = new JLabel("T. Dias");
        lblDiasPago.setFont(new Font("Verdana", 0, 11));
        lblDiasPago.setBounds(320, 55, 40, 20);
        lblDiasPago.setFont(new Font(Font.SANS_SERIF, 0, 11));
        pnlDialog.add(lblDiasPago);

        cbo_diaspago = new JComboBox();
        cbo_diaspago.setBounds(370, 55, 180, 20);
        cbo_diaspago.addKeyListener(this);
        cbo_diaspago.addActionListener(this);
        cbo_diaspago.setEnabled(false);
        cbo_diaspago.setFont(new Font(Font.SANS_SERIF, 0, 11));
        pnlDialog.add(cbo_diaspago);

        txtFechaVence = new JFormattedTextField();
        txtFechaVence.addKeyListener(this);
        txtFechaVence.setBounds(630, 55, 80, 20);
        txtFechaVence.setFont(new Font(Font.SANS_SERIF, 0, 11));
        txtFechaVence.setEditable(false);
        pnlDialog.add(txtFechaVence);

        JLabel lblFechaVence = new JLabel("F. Vence");
        lblFechaVence.setDisplayedMnemonic('c');
        lblFechaVence.setLabelFor(txtFechaVence);
        lblFechaVence.setFont(new Font(Font.SANS_SERIF, 0, 11));
        lblFechaVence.setBounds(575, 55, 60, 20);
        pnlDialog.add(lblFechaVence);

        JLabel lbl_tipopago = new JLabel("T Pago");
        lbl_tipopago.setBounds(20, 85, 60, 20);
        lbl_tipopago.setFont(new Font(Font.SANS_SERIF, 0, 11));
        pnlDialog.add(lbl_tipopago);

        cbo_tipopago = new JComboBox();
        cbo_tipopago.setBounds(70, 85, 205, 20);
        cbo_tipopago.addKeyListener(this);
        cbo_tipopago.setFont(new Font(Font.SANS_SERIF, 0, 11));
        cbo_tipopago.addActionListener(this);
        pnlDialog.add(cbo_tipopago);

        JLabel lblMoneda = new JLabel("Moneda");
        lblMoneda.setFont(new Font("Verdana", 0, 11));
        lblMoneda.setFont(new Font(Font.SANS_SERIF, 0, 11));
        lblMoneda.setBounds(300, 85, 45, 20);
        pnlDialog.add(lblMoneda);

        cbo_moneda = new JComboBox();
        cbo_moneda.setBounds(345, 85, 180, 20);
        cbo_moneda.addActionListener(this);
        cbo_moneda.setFont(new Font(Font.SANS_SERIF, 0, 11));
        cbo_moneda.addKeyListener(this);
        pnlDialog.add(cbo_moneda);

        JLabel lblTipoCambio = new JLabel("T. Cambio");
        lblTipoCambio.setBounds(550, 85, 70, 20);
        lblTipoCambio.setFont(new Font(Font.SANS_SERIF, 0, 11));
        pnlDialog.add(lblTipoCambio);

        txt_tipocambio = new JTextField();
        txt_tipocambio.setBounds(620, 85, 60, 20);
        txt_tipocambio.setFont(new Font(Font.SANS_SERIF, 0, 11));
        txt_tipocambio.addKeyListener(this);
        txt_tipocambio.setEditable(false);
        pnlDialog.add(txt_tipocambio);

        CLabel lblRazonSocial = new CLabel("R. Social");
        lblRazonSocial.setBounds(20, 115, 50, 20);
        lblRazonSocial.setFont(new Font(Font.SANS_SERIF, 0, 11));
        pnlDialog.add(lblRazonSocial);

        txt_idanexo = new JTextField();
        txt_idanexo.setBounds(70, 115, 80, 20);
        txt_idanexo.addKeyListener(this);
        txt_idanexo.addFocusListener(this);
        txt_idanexo.setFont(new Font(Font.SANS_SERIF, 0, 11));
        pnlDialog.add(txt_idanexo);

        txt_tmpanexo = new JTextField();
        txt_tmpanexo.setBounds(152, 115, 295, 20);
        txt_tmpanexo.addFocusListener(this);
        txt_tmpanexo.addKeyListener(this);
        txt_tmpanexo.setFont(new Font(Font.SANS_SERIF, 0, 11));
        pnlDialog.add(txt_tmpanexo);

        CLabel lblRucCliente = new CLabel("RUC/DNI");
        lblRucCliente.setBounds(570, 115, 60, 20);
        lblRucCliente.setFont(new Font(Font.SANS_SERIF, 0, 11));
        pnlDialog.add(lblRucCliente);

        txt_tmpruc = new JTextField();
        txt_tmpruc.setBounds(630, 115, 80, 20);
        txt_tmpruc.addKeyListener(this);
        txt_tmpruc.addFocusListener(this);
        txt_tmpruc.setFont(new Font(Font.SANS_SERIF, 0, 11));
        pnlDialog.add(txt_tmpruc);

        CLabel lblDireccion = new CLabel("Direccion");
        lblDireccion.setBounds(20, 145, 50, 20);
        lblDireccion.setFont(new Font(Font.SANS_SERIF, 0, 11));
        pnlDialog.add(lblDireccion);

        txt_tmpdireccion = new JTextField();
        txt_tmpdireccion.setBounds(70, 145, 310, 20);
        txt_tmpdireccion.addFocusListener(this);
        txt_tmpdireccion.setFont(new Font(Font.SANS_SERIF, 0, 11));
        txt_tmpdireccion.addKeyListener(this);
        pnlDialog.add(txt_tmpdireccion);

        chk_agpercepcion = new JCheckBox("A Percepcion");
        chk_agpercepcion.setBounds(390, 145, 100, 20);
        chk_agpercepcion.addKeyListener(this);
        chk_agpercepcion.setHorizontalTextPosition(SwingConstants.LEFT);
        chk_agpercepcion.addFocusListener(this);
        chk_agpercepcion.setOpaque(false);
        pnlDialog.add(chk_agpercepcion);

        chk_buencontribuyente = new JCheckBox("B Contribuyente");
        chk_buencontribuyente.setBounds(515, 145, 130, 20);
        chk_buencontribuyente.addKeyListener(this);
        chk_buencontribuyente.setHorizontalTextPosition(SwingConstants.LEFT);
        chk_buencontribuyente.addFocusListener(this);
        chk_buencontribuyente.setOpaque(false);
        pnlDialog.add(chk_buencontribuyente);

        chk_agretencion = new JCheckBox("A Retencion");
        chk_agretencion.setBounds(665, 145, 100, 20);
        chk_agretencion.addKeyListener(this);
        chk_agretencion.setHorizontalTextPosition(SwingConstants.LEFT);
        chk_agretencion.addFocusListener(this);
        chk_agretencion.setOpaque(false);
        pnlDialog.add(chk_agretencion);

        chk_exepetuado = new JCheckBox("Exceptuado");
        chk_exepetuado.setBounds(775, 145, 100, 20);
        chk_exepetuado.addKeyListener(this);
        chk_exepetuado.setHorizontalTextPosition(SwingConstants.LEFT);
        chk_exepetuado.addFocusListener(this);
        chk_exepetuado.setOpaque(false);
        pnlDialog.add(chk_exepetuado);

        JTabbedPane tabb = new JTabbedPane();
        JPanel pnltabb = new JPanel(new BorderLayout());
        pnltabb.setBackground(new Color(245, 245, 245));

        JPanel pnltabla = new JPanel(new BorderLayout());
        pnltabla.setBackground(new Color(245, 245, 245));

        mdl_detalleventa = new TableModelRegisterBoletaDetalleVenta();
        mdl_detalleventa.addTableModelListener(this);
        tbl_detalleventa = new CTable();
        tbl_detalleventa.setFont(new Font(Font.SANS_SERIF, 0, 11));
        tbl_detalleventa.getTableHeader().setFont(new Font(Font.SANS_SERIF, 1, 11));
        tbl_detalleventa.setModel(mdl_detalleventa);
        tbl_detalleventa.addKeyListener(this);
        tbl_detalleventa.setAllColumnNoResizable();
        tbl_detalleventa.setAllTableNoEditable();
        tbl_detalleventa.setColumnEditable(4);
        tbl_detalleventa.getColumnModel().getColumn(4).setCellEditor(new DigitTextFieldCellEditor(EnumClass.TipoDatoEditor.DOUBLE_EDITOR).cellEditor);
        tbl_detalleventa.setColumnEditable(5);
        tbl_detalleventa.getColumnModel().getColumn(5).setCellEditor(new DigitTextFieldCellEditor(EnumClass.TipoDatoEditor.DOUBLE_EDITOR).cellEditor);
        tbl_detalleventa.setNoVisibleColumn(6);
        tbl_detalleventa.setNoVisibleColumn(7);
        tbl_detalleventa.setNoVisibleColumn(11);
        tbl_detalleventa.setNoVisibleColumn(12);
        tbl_detalleventa.setNoVisibleColumn(13);
        tbl_detalleventa.setNoVisibleColumn(14);
        tbl_detalleventa.setNoVisibleColumn(16);
        tbl_detalleventa.setNoVisibleColumn(17);
        tbl_detalleventa.setNoVisibleColumn(20);
        tbl_detalleventa.setNoVisibleColumn(21);
        tbl_detalleventa.setNoVisibleColumn(22);
        tbl_detalleventa.setNoVisibleColumn(23);
        tbl_detalleventa.setNoVisibleColumn(24);
        tbl_detalleventa.setNoVisibleColumn(25);
        tbl_detalleventa.setNoVisibleColumn(26);
        tbl_detalleventa.setNoVisibleColumn(27);
        tbl_detalleventa.setNoVisibleColumn(28);
        tbl_detalleventa.setNoVisibleColumn(29);
        tbl_detalleventa.setNoVisibleColumn(30);
        tbl_detalleventa.setNoVisibleColumn(31);
        tbl_detalleventa.setNoVisibleColumn(32);
        tbl_detalleventa.setRendererColumnZero();
        tbl_detalleventa.setAllColumnPreferredWidth();

        CellRendererDetalleDocumento render = new CellRendererDetalleDocumento();
        tbl_detalleventa.setDefaultRenderer(String.class, render);
        tbl_detalleventa.setDefaultRenderer(Double.class, render);
        tbl_detalleventa.setDefaultRenderer(Object.class, render);
        JScrollPane scrollViewVenta = new JScrollPane(tbl_detalleventa);
        pnltabla.add(scrollViewVenta, BorderLayout.CENTER);

        pnltabb.add(pnltabla, BorderLayout.CENTER);

        JToolBar toolbar = new JToolBar();
        toolbar.setBackground(new Color(245, 245, 245));
        toolbar.setPreferredSize(new Dimension(0, 30));

        pnltabb.add(toolbar, BorderLayout.NORTH);

        tabb.addTab("", pnltabb);
        tabb.setTitleAt(0, "Item");
        tabb.setBounds(13, 175, 950, 195);

        pnlDialog.add(tabb);

        CLabel lblMAfecto = new CLabel("Afecto");
        lblMAfecto.setBounds(5, 375, 40, 20);
        pnlDialog.add(lblMAfecto);

        txt_mafecto = new JTextField();
        txt_mafecto.setBounds(45, 375, 100, 20);
        txt_mafecto.setHorizontalAlignment(SwingConstants.RIGHT);
        txt_mafecto.setFont(new Font(Font.SANS_SERIF, 1, 13));
        txt_mafecto.addKeyListener(this);
        txt_mafecto.setEditable(false);
        pnlDialog.add(txt_mafecto);

        CLabel lblMNoAfecto = new CLabel("No Afecto");
        lblMNoAfecto.setBounds(170, 375, 60, 20);
        pnlDialog.add(lblMNoAfecto);

        txt_mnoafecto = new JTextField();
        txt_mnoafecto.setBounds(230, 375, 100, 20);
        txt_mnoafecto.setHorizontalAlignment(SwingConstants.RIGHT);
        txt_mnoafecto.setFont(new Font(Font.SANS_SERIF, 1, 13));
        txt_mnoafecto.addKeyListener(this);
        txt_mnoafecto.setEditable(false);
        pnlDialog.add(txt_mnoafecto);

        CLabel lblMIgv = new CLabel("Igv");
        lblMIgv.setBounds(360, 375, 20, 20);
        pnlDialog.add(lblMIgv);

        txt_migv = new JTextField();
        txt_migv.setBounds(380, 375, 100, 20);
        txt_migv.setHorizontalAlignment(SwingConstants.RIGHT);
        txt_migv.setFont(new Font(Font.SANS_SERIF, 1, 13));
        txt_migv.addKeyListener(this);
        txt_migv.setEditable(false);
        pnlDialog.add(txt_migv);

        CLabel lblMonto = new CLabel("Monto");
        lblMonto.setBounds(510, 375, 40, 20);
        pnlDialog.add(lblMonto);

        txt_monto = new JTextField();
        txt_monto.setBounds(550, 375, 100, 25);
        txt_monto.addKeyListener(this);
        txt_monto.setFont(new Font(Font.SANS_SERIF, 1, 20));
        txt_monto.setEditable(false);
        txt_monto.setHorizontalAlignment(SwingConstants.RIGHT);
        txt_monto.setForeground(Color.RED);
        pnlDialog.add(txt_monto);

        JLabel lblMPercepcion = new JLabel("Perc");
        lblMPercepcion.setBounds(670, 375, 25, 20);
        pnlDialog.add(lblMPercepcion);

        txt_mpercepcion = new JTextField();
        txt_mpercepcion.setBounds(695, 375, 90, 25);
        txt_mpercepcion.setHorizontalAlignment(SwingConstants.RIGHT);
        txt_mpercepcion.addKeyListener(this);
        txt_mpercepcion.setForeground(Color.BLUE);
        txt_mpercepcion.setFont(new Font(Font.SANS_SERIF, 1, 20));
        txt_mpercepcion.setEditable(false);
        pnlDialog.add(txt_mpercepcion);

        CLabel lblTotal = new CLabel("Total");
        lblTotal.setBounds(805, 375, 30, 20);
        pnlDialog.add(lblTotal);

        txt_total = new JTextField();
        txt_total.setBounds(835, 375, 100, 25);
        txt_total.setHorizontalAlignment(SwingConstants.RIGHT);
        txt_total.addKeyListener(this);
        txt_total.setForeground(Color.darkGray);
        txt_total.setFont(new Font(Font.SANS_SERIF, 1, 20));
        txt_total.setEditable(false);
        pnlDialog.add(txt_total);
        txt_empresa = new JTextField();
        txt_estado = new JTextField();
        txt_idauxiliar = new JTextField();
        txt_tipoanexo = new JTextField();
        txt_localidad = new JTextField();
        txt_puntoventa = new JTextField();
        txt_mdescuento = new JTextField();
        txt_valor = new JTextField();

        setTitleName("Documento de Venta");
        setRegister(pnlDialog);
    }

    @Override
    public void loadCombo() {
        loadTipoDocumento();
        loadCondPago();
        loadMoneda();
    }

    public void loadTipoDocumento() {
        try {
            RnTipoDocVenta regla_TipoDoc = new RnTipoDocVenta(path);

            if (lst_tipodocventa != null) {
                lst_tipodocventa.clear();
            } else {
                lst_tipodocventa = new ArrayList<BeanTipoDocVenta>();
            }

            lst_tipodocventa.addAll(regla_TipoDoc.listarTipoDocVenta("", "", "", "A", "VE", "", ""));

            cbo_idtipodoc.removeAllItems();
            cbo_idtipodoc.addItem("--- Seleccione Tipo de Documento ---");

            for (int i = 0; i < lst_tipodocventa.size(); i++) {
                cbo_idtipodoc.addItem(lst_tipodocventa.get(i).getDescripcion());
            }

            cbo_idtipodoc.setSelectedIndex(0);
        } catch (Exception e) {
        }
    }

    public void loadCondPago() {
        cbo_condicionpago.addItem("--- Seleccione Condicion de Pago ---");
        cbo_condicionpago.addItem("CONTADO");
        cbo_condicionpago.addItem("CREDITO");
        cbo_condicionpago.setSelectedIndex(0);
    }

    public void loadMoneda() {
        try {
            LoadCombo.loadMoneda(path, lst_moneda, cbo_moneda,
                    Constans.ITEM_INIT_MONEDA, 0);
        } catch (Exception ex) {
            JOptionPane.showMessageDialog(this, ex.getMessage());
        }
    }

    public void loadTipoPago(String tipo_condicion) {
        try {
            RnTipoPago regla = new RnTipoPago(path);

            if (lst_tipopago != null) {
                lst_tipopago.clear();
            } else {
                lst_tipopago = new ArrayList<BeanTipoPago>();
            }

            lst_tipopago.addAll(regla.listarTipoPago("", tipo_condicion, "A"));

            cbo_tipopago.removeAllItems();
            cbo_tipopago.addItem("--- Seleccione Tipo de Pago ---");

            for (int i = 0; i < lst_tipopago.size(); i++) {
                cbo_tipopago.addItem(lst_tipopago.get(i).getDescripcion());
            }

            cbo_tipopago.setSelectedIndex(0);
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }

    public void loadDiasPago(String xmediopago) {
        rn_CondicionPago regla = new rn_CondicionPago(path);

        if (lst_condpago != null) {
            lst_condpago.clear();
        } else {
            lst_condpago = new ArrayList<BeanCondicionPago>();
        }

        lst_condpago.addAll(regla.listar("", "", -1, xmediopago));

        cbo_diaspago.removeAllItems();
        cbo_diaspago.addItem("--- Seleccione Cant. Dias ---");

        for (int i = 0; i < lst_condpago.size(); i++) {
            cbo_diaspago.addItem(lst_condpago.get(i).getDiaspago());
        }

        cbo_diaspago.setSelectedIndex(0);
    }

    @Override
    public void focusGained(FocusEvent e) {
        if (e.getSource() == ((JTextFieldDateEditor) dc_fechaemision.getDateEditor())) {
            ((JTextFieldDateEditor) dc_fechaemision.getDateEditor()).selectAll();
        }

        if (e.getComponent() == txt_serie) {
            txt_serie.selectAll();
        }

        if (e.getComponent() == txt_preimpreso) {
            txt_preimpreso.selectAll();
        }

        if (e.getComponent() == txt_tmpanexo) {
            txt_tmpanexo.selectAll();
        }

        if (e.getComponent() == txt_idanexo) {
            txt_idanexo.selectAll();
        }

        if (e.getComponent() == txt_tmpdireccion) {
            txt_tmpdireccion.selectAll();
        }

        if (e.getComponent() == txt_tmpruc) {
            txt_tmpruc.selectAll();
        }
    }

    @Override
    public void setRegisterEnabled(boolean e) {
        cbo_moneda.setEnabled(e);
        cbo_condicionpago.setEnabled(e);
        cbo_diaspago.setEnabled(e);
        cbo_idtipodoc.setEnabled(e);
        cbo_tipopago.setEnabled(e);
        tbl_detalleventa.setEnabled(e);
    }

    @Override
    public void setRegisterEditable(boolean e) {
        txt_tmpanexo.setEditable(e);
        txt_tmpdireccion.setEditable(e);
        txt_tmpruc.setEditable(e);
    }

    public void cargarTipoDocumento(String id_tipo_doc) {
        if (lst_tipodocventa != null && !id_tipo_doc.equals("") && id_tipo_doc != null) {
            for (int i = 0; i < lst_tipodocventa.size(); i++) {
                if (lst_tipodocventa.get(i).getIdTipoDoc().equals(id_tipo_doc)) {
                    cbo_idtipodoc.setSelectedIndex(i + 1);
                    break;
                }
            }
        }
    }

    public void cargarMoneda(String id_moneda) {
        if (lst_moneda != null && !id_moneda.equals("") && id_moneda != null) {
            for (int i = 0; i < lst_moneda.size(); i++) {
                if (lst_moneda.get(i).getIdMoneda().equals(id_moneda)) {
                    cbo_moneda.setSelectedIndex(i + 1);
                    break;
                }
            }
        }
    }

    public void calcularImportes() {
        txt_mafecto.setText("0.0");
        txt_mpercepcion.setText("0.0");
        txt_mdescuento.setText("0.0");
        txt_migv.setText("0.0");
        txt_mnoafecto.setText("0.0");
        txt_monto.setText("0.0");
        txt_total.setText("0.0");

        double m_percepcion = 0.0;
        double monto = 0.0;
        double m_afecto = 0.0;
        double m_noafecto = 0.0;
        double m_igv = 0.0;
        double m_descuento = 0.0;

        for (int i = 0; i < mdl_detalleventa.getRowCount(); i++) {
            ContaItem obtab = mdl_detalleventa.getVentaDirecta(i);

            m_percepcion = m_percepcion + obtab.getM_percepcion();
            monto = monto + obtab.getM_monto();
            m_afecto = m_afecto + obtab.getM_afecto();
            m_noafecto = m_noafecto + obtab.getM_noafecto();
            m_igv = m_igv + obtab.getM_igv();
            m_descuento = m_descuento + obtab.getM_descuento();
        }

        txt_monto.setText(String.valueOf(CFunciones.redondea(monto, 2)));
        txt_migv.setText(String.valueOf(CFunciones.redondea(m_igv, 2)));
        txt_mnoafecto.setText(String.valueOf(CFunciones.redondea(m_noafecto, 2)));
        txt_mafecto.setText(String.valueOf(CFunciones.redondea(monto - m_igv + m_noafecto, 2)));
        txt_total.setText(String.valueOf(CFunciones.redondea(monto + m_percepcion, 2)));
        txt_mpercepcion.setText(String.valueOf(CFunciones.redondea(m_percepcion, 2)));
        txt_mdescuento.setText(String.valueOf(CFunciones.redondea(m_descuento, 2)));
    }

    @Override
    public void newRegister() {
        txt_empresa.setText(usuario.getCodempresa());
        txt_localidad.setText(usuario.getCodlocalidad());
        txt_puntoventa.setText(usuario.getCodpuntoventa());
        txt_monto.setText("0.0");
        txt_mafecto.setText("0.0");
        txt_mdescuento.setText("0.0");
        txt_migv.setText("0.0");
        txt_mpercepcion.setText("0.0");
        txt_mnoafecto.setText("0.0");
        txt_total.setText("0.0");
        txt_tipoanexo.setText("2");
        txt_idauxiliar.setText("00070");
        txt_estado.setText("003");
        cbo_condicionpago.setSelectedItem("CONTADO");
        cbo_moneda.setSelectedItem("NUEVO SOL");
        cbo_idtipodoc.setSelectedItem("BOLETA DE VENTA");
        RnCorrelativo regla_correlativo = new RnCorrelativo(path);
        //txtSerieRef.setText(regla_correlativo.nuevo_correlativo(usuario.getCodpuntoventa(),cbo_idtipodoc.getSelectedIndex()>0?lst_tipodocventa.get(cbo_idtipodoc.getSelectedIndex()-1).getCodigo():""));
    }

    @Override
    public void actionPerformed(ActionEvent e) {
        if (cbo_idtipodoc == e.getSource()) {
            if (cbo_idtipodoc.getItemCount() > 0) {
                calcularpercepcion();
            }
        }

        if (cbo_condicionpago == e.getSource()) {
            if (cbo_condicionpago.getItemCount() > 0) {
                if (cbo_condicionpago.getSelectedIndex() == 0) {
                    cbo_tipopago.removeAllItems();
                    cbo_tipopago.setEnabled(false);
                    cbo_diaspago.removeAllItems();
                    cbo_diaspago.setEnabled(false);
                } else {
                    if (cbo_condicionpago.getSelectedIndex() == 2) {
                        cbo_tipopago.removeAllItems();
                        cbo_tipopago.setEnabled(false);

                        if (mode == UPDATE || mode == INSERT || mode == CLONE) {
                            cbo_diaspago.setEnabled(true);
                        }
                    } else {
                        cbo_diaspago.setEnabled(false);

                        if (mode == UPDATE || mode == INSERT || mode == CLONE) {
                            cbo_tipopago.setEnabled(true);
                        }

                        loadTipoPago("C");
                    }

                    loadDiasPago(cbo_condicionpago.getSelectedItem().toString().trim().equals("CONTADO") ? "CO" : "CR");

                    if (cbo_condicionpago.getSelectedItem().equals("CONTADO")) {
                        cbo_diaspago.setSelectedIndex(1);
                    }
                }
            }
        }
    }

    @Override
    public void onClickCancel() {
        setVisible(false);
        dispose();
        doDefaultCloseAction();
    }

    @Override
    public void onClickNew() {
        setRegisterEnabled(true);
        setRegisterEditable(true);
        newRegister();
    }

    public void limpiarVenta() {
        txt_mafecto.setText("0.0");
        txt_mpercepcion.setText("0.0");
        txt_mnoafecto.setText("0.0");
        txt_migv.setText("0.0");
        txt_monto.setText("0.0");
        txt_mpercepcion.setText("0.0");

        mdl_detalleventa.clearTable();
        tbl_detalleventa.setAllColumnPreferredWidth();
    }

    @Override
    public void keyPressed(KeyEvent e) {
        if (e.getKeyCode() == KeyEvent.VK_ESCAPE) {
            dispose();
            doDefaultCloseAction();
        }
    }

    @Override
    public void tableChanged(TableModelEvent e) {
        if (e.getSource() == mdl_detalleventa) {
            calcularImportes();
        }
    }

    @Override
    public String executeInsert() {
        return "";
    }

    @Override
    public void setValueSearch(Object valor, Component comp) {
    }

    @Override
    public void onClickNext() {
        rowSelection.selectNextRow();
        newRegister();
        if (!loadRegister()) {
            setVisible(false);
            if (view != null) {
                view.controlRefresh();
            }
        }
    }

    @Override
    public void onClickPrevius() {
        rowSelection.selectPreviusRow();
        newRegister();
        if (!loadRegister()) {
            setVisible(false);
            if (view != null) {
                view.controlRefresh();
            }
        }
    }

    @Override
    public void onPressEsc() {
        setVisible(false);
        view.refreshTitleName();
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
            ContaCab regconta = reg.get(0);

            chk_agpercepcion.setSelected(regconta.getFlagApercepcion().equals("S"));
            chk_agretencion.setSelected(regconta.getFlagAretencion().equals("S"));
            chk_buencontribuyente.setSelected(regconta.getFlagBcontribuyente().equals("S"));
            chk_exepetuado.setSelected(regconta.getFlagExceptuado().equals("S"));
            txt_idregconta.setText(regconta.getRcIdregconta());
            txt_idanexo.setText(regconta.getAnIdanexo());
            txt_tmpdireccion.setText(regconta.getAnTmpdireccion());
            txt_tmpruc.setText(regconta.getAnTmpruc());
            txt_tmpanexo.setText(regconta.getAnTmpanexo());
            txt_serie.setText(regconta.getSerie());
            txt_preimpreso.setText(regconta.getPreimpreso());
            dc_fechaemision.setDate(regconta.getFEmision());
            txt_tipocambio.setText(String.valueOf(regconta.getMTipoCambio()));
            cbo_condicionpago.setSelectedItem(regconta.getTipoCondpago().equals("CO") ? "CONTADO" : "CREDITO");
            cbo_tipopago.setSelectedItem(regconta.getTipopago());
            cargarTipoDocumento(regconta.getIdTipoDoc());

            RnRegContaCab regla_det = new RnRegContaCab(path);
            mdl_detalleventa.clearTable();
            mdl_detalleventa.agregarVectorVentaDirecta(regla_det.listarRegContaDet(m));
            tbl_detalleventa.setAllColumnPreferredWidth();

            calcularImportes();

            return true;
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, e.getMessage());
            return false;
        }
    }

    @Override
    public String executeUpdate() {
        return null;
    }

    @Override
    public void setFecha(Date fechaInicio, Date fechaFin) {
        super.fechaInicio = fechaInicio;
        super.fechaFin = fechaFin;

        dc_fechaemision.setSelectableDateRange(fechaInicio, fechaFin);
    }

    @Override
    public boolean executeAnular() {
        try {
            return this.anularVenta();
        } catch (InstantiationException ex) {
            ExceptionHandler.handleException(ex, logger);
            JOptionPane.showMessageDialog(null, ex.getMessage());
        } catch (Exception ex) {
            ExceptionHandler.handleException(ex, logger);
            JOptionPane.showMessageDialog(null, ex.getMessage());
        }
        return false;
    }

    private boolean anularVenta() throws InstantiationException, Exception {
        String idRegconta = txt_idregconta.getText().trim();
        if (Constans.SWDESPACHO) {
            RnConsultas logicConsulta = new RnConsultas(path);
            List<String> lstDespachos = logicConsulta.listarDespachosVenta(idRegconta);
            RnMovInventarioCab logic = new RnMovInventarioCab(path);
            for (String idMov : lstDespachos) {
                ContaCab m = new ContaCab();
                m.setIdMovimiento(idMov);
                m.setIdTipoMov(TipoMovInventarioEnum.SALIDA_PRODUCTOS_VENTA.getValue());
                m.setIdUsuario(usuario.getId_usuario());
                m.setIdRegcontaDoc1(idRegconta);
                logic.anularSalidaOrdenRecojo(m);
            }
        }
        if (!(new LogicRegContaCab(path)).isAnulable(idRegconta)) {
            return false;
        }
        RnRegContaCab regla = new RnRegContaCab(path);
        java.sql.Date ini = new java.sql.Date(dc_fechaemision.getDate().getTime());
        Calendar calendarIni = new GregorianCalendar();
        calendarIni.setTime(ini);
        int annoInicio = calendarIni.get(Calendar.YEAR);
        int mesInicio = calendarIni.get(Calendar.MONTH) + 1;
        String auxMes = String.valueOf(mesInicio);
        if (auxMes.length() == 1) {
            auxMes = "0" + auxMes;
        }
        boolean rptaAnular = regla.anular(idRegconta, usuario.getId_usuario(), new Date(),
                usuario.getCodempresa(), String.valueOf(annoInicio),
                auxMes, AuxiliarEnum.VENTA.getValue());
        if (Constans.IS_FACTURADOR_SUNAT) {
            ConvertDataSunat sunat = new ConvertDataSunat(path, usuario);
            sunat.anularDataSunat(idRegconta);
        }
        return rptaAnular;
    }

    @Override
    public boolean executeDelete() {
        try {
            if ((new LogicRegContaCab(path)).isAnulable(txt_idregconta.getText().trim())) {
                RnRegContaCab regla = new RnRegContaCab(path);
                //return regla.eliminar(txt_idregconta.getText().trim(), usuario.getId_usuario());
                return true;
            }
        } catch (ClassNotFoundException ex) {
            JOptionPane.showMessageDialog(null, ex.getMessage());
        } catch (InstantiationException ex) {
            JOptionPane.showMessageDialog(null, ex.getMessage());
        } catch (IllegalAccessException ex) {
            JOptionPane.showMessageDialog(null, ex.getMessage());
        } catch (Exception ex) {
            JOptionPane.showMessageDialog(null, ex.getMessage());
        }
        return false;
    }

    public void calcularpercepcion() {
        double monto_percepcion = 0.0;

        for (int i = 0; i < mdl_detalleventa.getData().size(); i++) {
            if (mdl_detalleventa.getData().get(i).getAfecto_percepcion().equals("S")) {
                monto_percepcion = monto_percepcion + mdl_detalleventa.getData().get(i).getM_monto();
            }
        }

        double m_percepcion = 0.0;
        double monto = 0.0;
        double m_afecto = 0.0;
        double m_noafecto = 0.0;
        double m_igv = 0.0;
        double m_descuento = 0.0;

        for (int i = 0; i < mdl_detalleventa.getData().size(); i++) {
            mdl_detalleventa.getData().get(i).setP_percepcion(
                    //SI EL PRODUCTO ESTA AFECTO A PERCEPCION
                    mdl_detalleventa.getData().get(i).getAfecto_percepcion().equals("S")
                    ? ( //SI EL TIPO DE DOCUMENTO ES FACTURA
                    cbo_idtipodoc.getSelectedItem().equals("FACTURA")
                    ? ( //SI EL TIPO DE CLIENTE ES AGENTE DE PERCEPCION SE LE COBRA EL 0.05 % DE PERCEPCION
                    (chk_agpercepcion.isSelected())
                            ? (Double.valueOf(getParametro("PORCENTAJE CLIENTE AGENTE PERCEPCION", usuario.getCodempresa())) / 100)
                            : ( //SI EL TIPO DE CLIENTE ES BUEN CONTRIBUYENTE SE LE COBRA EL 0.0 % DE PERCEPCION
                            (chk_buencontribuyente.isSelected())
                                    ? 0
                                    : //SI EL CLIENTE NO ES AGENTE DE PERCEPCION NI BUEN CONTRIBUYENTE LE COBRA EL 0.2 % DE PERCEPCION
                                    (Double.valueOf(getParametro("PORCENTAJE PRODUCTO PERCEPCION", usuario.getCodempresa())) / 100)))
                    : ( //SI EL TIPO DE DOCUMENTO ES BOLETA
                    cbo_idtipodoc.getSelectedItem().equals("BOLETA")
                    ? ( //SI LA BOLETA SOBREPASA EL MONTO DE 700 SOLES
                    (monto_percepcion >= Double.valueOf(getParametro("MONTO BOLETA PERCEPCION", usuario.getCodempresa())))
                    ? ( //SI EL TIPO DE CLIENTE ES AGENTE DE PERCEPCION SE LE COBRA EL 0.05 % DE PERCEPCION
                    (chk_agpercepcion.isSelected())
                            ? (Double.parseDouble(getParametro("PORCENTAJE CLIENTE AGENTE PERCEPCION", usuario.getCodempresa())) / 100)
                            : ( //SI EL TIPO DE CLIENTE ES BUEN CONTRIBUYENTE SE LE COBRA EL 0.0 % DE PERCEPCION
                            (chk_buencontribuyente.isSelected())
                                    ? 0
                                    : //SI EL CLIENTE NO ES AGENTE DE PERCEPCION NI BUEN CONTRIBUYENTE LE COBRA EL 0.2 % DE PERCEPCION
                                    (Double.valueOf(getParametro("PORCENTAJE PRODUCTO PERCEPCION", usuario.getCodempresa())) / 100)))
                    : //SI LA BOLETA NO SOBREPASA LOS 700 SE LE COBRA EL 0.0 % DE PERCEPCION
                    0)
                    : //SI EL TIPO DE DOCUMENTO NO ES FACTURA NI BOLETA SE LE COBRA EL 0.0 % DE PERCEPCION
                    0))
                    : //SI EL PRODUCTO NO ESTA AFECTO A PERCEPCION SE LE COBRA EL 0.0 % DE PERCEPCION
                    0);
            mdl_detalleventa.getData().get(i).calcularPercepcion();

            m_percepcion = m_percepcion + mdl_detalleventa.getData().get(i).getM_percepcion();
            monto = monto + mdl_detalleventa.getData().get(i).getM_monto();
            m_afecto = m_afecto + mdl_detalleventa.getData().get(i).getM_afecto();
            m_noafecto = m_noafecto + mdl_detalleventa.getData().get(i).getM_noafecto();
            m_igv = m_igv + mdl_detalleventa.getData().get(i).getM_igv();
            m_descuento = m_descuento + mdl_detalleventa.getData().get(i).getM_descuento();
        }

        txt_migv.setText(String.valueOf(CFunciones.redondea(m_igv, 2)));
        txt_mafecto.setText(String.valueOf(CFunciones.redondea(monto - m_igv + m_noafecto, 2)));
        txt_mnoafecto.setText(String.valueOf(CFunciones.redondea(m_noafecto, 2)));
        txt_mpercepcion.setText(String.valueOf(CFunciones.redondea(m_percepcion, 2)));
        txt_mdescuento.setText(String.valueOf(CFunciones.redondea(m_descuento, 2)));
        txt_monto.setText(String.valueOf(CFunciones.redondea(monto, 2)));
        txt_total.setText(String.valueOf(CFunciones.redondea(monto + m_percepcion, 2)));
        txt_valor.setText(String.valueOf(CFunciones.redondea(monto - m_igv + m_noafecto, 2)));
    }

    public String getParametro(String descripcion, String id_empresa) {
        try {
            BeanParametro p = new BeanParametro();
            p.setNombre(descripcion);
            p.setIdEmpresa(id_empresa);
            RnParametro regla = new RnParametro(path);
            return regla.listarParametro(p).get(0).getValor().trim();
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, e.getMessage());
            return "";
        }
    }

    @Override
    public void internalFrameClosing(InternalFrameEvent e) {
        setVisible(false);
    }

    @Override
    public void showMessagePrint(String codigo) {
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
    public void showMessageErrorInsert() {
    }

    @Override
    public void showMessageErrorUpdate() {
    }

    @Override
    public void showMessageErrorDelete() {
    }

    @Override
    public boolean isRegisterValid() {
        return true;
    }

    @Override
    public void setView(View view) {
        this.view = view;
    }

    @Override
    public void setRowSelection(RowSelection row) {
        this.rowSelection = row;
    }

    @Override
    public void keyTyped(KeyEvent e) {
    }

    @Override
    public void keyReleased(KeyEvent e) {
    }

    @Override
    public void focusLost(FocusEvent e) {
    }

    @Override
    public boolean executeSelect() {
        return true;
    }
}
