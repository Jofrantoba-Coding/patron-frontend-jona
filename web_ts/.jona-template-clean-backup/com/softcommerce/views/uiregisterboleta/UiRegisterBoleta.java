package com.softcommerce.views.uiregisterboleta;


import com.softcommerce.formularios.*;
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

public class UiRegisterBoleta
        extends JHInternal
        implements InterUiRegisterBoleta, KeyListener, ActionListener, FocusListener, TableModelListener {

    private static final long serialVersionUID = 1L;
    protected JFrame frame;
    protected Usuario usuario;
    protected JFormattedTextField txtFechaVence;
    protected JComboBox cbo_condicionpago;
    public TableModelRegisterBoletaDetalleVenta mdl_detalleventa;
    public CTable tbl_detalleventa;
    protected List<BeanTipoDocVenta> lst_tipodocventa;
    protected CComboBox cbo_idtipodoc;
    protected List<BeanMoneda> lst_moneda = new ArrayList();
    protected JComboBox cbo_moneda;
    protected List<BeanCondicionPago> lst_condpago;
    protected JComboBox cbo_diaspago;
    protected List<BeanTipoPago> lst_tipopago;
    protected JComboBox cbo_tipopago;
    protected JDateChooser dc_fechaemision;
    protected JTextField txt_tipocambio;
    protected JTextField txt_serie;
    protected JTextField txt_preimpreso;
    protected JTextField txt_empresa;
    protected JTextField txt_localidad;
    protected JTextField txt_puntoventa;
    protected JTextField txt_idregconta;
    protected JTextField txt_tmpanexo;
    protected JTextField txt_tmpruc;
    protected JTextField txt_tmpdireccion;
    protected JTextField txt_idanexo;
    protected JTextField txt_tipoanexo;
    protected JTextField txt_idauxiliar;
    protected JTextField txt_estado;
    protected JTextField txt_mpercepcion;
    protected JTextField txt_mafecto;
    protected JTextField txt_mnoafecto;
    protected JTextField txt_migv;
    protected JTextField txt_mdescuento;
    protected JTextField txt_total;
    protected JTextField txt_monto;
    protected JTextField txt_valor;
    protected JCheckBox chk_agpercepcion;
    protected JCheckBox chk_buencontribuyente;
    protected JCheckBox chk_agretencion;
    protected JCheckBox chk_exepetuado;
    protected final Logger logger = Logger.getLogger(UiRegisterBoleta.class);

    public UiRegisterBoleta(String title, Usuario usuario, JFrame frame) {
        super(title + " - UiRegisterBoleta");
        this.usuario = usuario;
        this.frame = frame;
        inicialize();
    }

    protected void inicialize() {
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
    }

    public void loadTipoDocumento() {
    }

    public void loadCondPago() {
    }

    public void loadMoneda() {
    }

    public void loadTipoPago(String tipo_condicion) {
    }

    public void loadDiasPago(String xmediopago) {
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
    }

    public void cargarMoneda(String id_moneda) {
    }

    public void calcularImportes() {
    }

    @Override
    public void newRegister() {
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
        return null;
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
        return false;
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
        return false;
    }

    protected boolean anularVenta() throws InstantiationException, Exception {
        return false;
    }

    @Override
    public boolean executeDelete() {
        return false;
    }

    public void calcularpercepcion() {
    }

    public String getParametro(String descripcion, String id_empresa) {
        return null;
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
        return false;
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
        return false;
    }
}
