/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.softcommerce.views.uiregisterpedidodet;


import com.softcommerce.formularios.*;
import com.softcommerce.beans.BeanAlmacen;
import com.softcommerce.beans.BeanMoneda;
import com.softcommerce.beans.BeanPedidoCab;
import com.softcommerce.beans.BeanPedidoDet;
import com.softcommerce.beans.BeanPrecioItem;
import com.softcommerce.beans.BeanStock;
import com.softcommerce.beans.Usuario;
import com.softcommerce.general.controles.CTable;
import com.softcommerce.general.controles.ComponentToolKit;
import com.softcommerce.general.controles.JHDialog;
import com.softcommerce.general.tablas.TableModelPedidoDet;
import com.softcommerce.iconos.Gif;
import com.softcommerce.reglasnegocio.RnPedidoCab;
import com.softcommerce.reglasnegocio.RnItem;
import com.softcommerce.reglasnegocio.RnStock;
import com.softcommerce.util.FormatObject;
import com.softcommerce.util.combo.LoadCombo;
import com.toedter.calendar.JDateChooser;
import java.awt.BorderLayout;
import java.awt.Color;
import java.awt.Component;
import java.awt.Dimension;
import java.awt.FlowLayout;
import java.awt.Font;
import java.awt.Frame;
import java.awt.GridBagConstraints;
import java.awt.GridBagLayout;
import java.awt.Insets;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.ItemEvent;
import java.awt.event.ItemListener;
import java.math.BigDecimal;
import java.math.BigInteger;
import java.math.RoundingMode;
import java.text.DateFormat;
import java.text.NumberFormat;
import java.text.ParseException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Locale;
import javax.swing.JButton;
import javax.swing.JCheckBox;
import javax.swing.JComboBox;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import javax.swing.JScrollPane;
import javax.swing.JTabbedPane;
import javax.swing.JTextField;
import javax.swing.JToolBar;
import javax.swing.SwingConstants;
import javax.swing.event.TableModelEvent;
import javax.swing.event.TableModelListener;

/**
 *
 * @author Team Develtrex
 */
public class UiRegisterPedidoDet 
        extends JHDialog 
        implements InterUiRegisterPedidoDet, ActionListener, TableModelListener, ItemListener {

    private Usuario usuario;
    private BeanPedidoCab beanPedido;
    private JTextField txt_monto;
    private JTextField txt_migv;
    private JTextField txt_mafecto;
    private JTextField txt_mnoafecto;
    private JTextField txt_codigo;
    private JTextField txt_TipoDoc;
    private JTextField txt_serie;
    private JTextField txt_preimpreso;
    private JTextField txt_numDias;
    private JTextField txt_tipocambio;
    private JTextField txt_idAnexo;
    private JTextField txt_Anexo;
    private JTextField txt_Ruc;
    private JTextField txt_Direccion;
    private JDateChooser dc_fechaemision;
    private JDateChooser dc_fechavence;
    private JDateChooser dc_fechadespacho;
    private JComboBox cboModVta;
    private JComboBox cboModDespacho;
    private JComboBox cboMoneda;
    private List<BeanMoneda> xMoneda;
    public TableModelPedidoDet mdl_detalle;
    public CTable tbl_detalle;
    //private boolean swAutorizar = false;
    private int swOpcUpdate = 0;//0:modificar; 1: autorizar; 2:cerrar
    private JButton btnAgregar;
    private JButton btnQuitar;
    private JButton btnAlmacen;
    private Gif gif;
    JToolBar toolbar;
    List<BeanPedidoDet> listaDet;
    private JPanel pnlAlmacen;
    private JComboBox cboAlmacen;
    private List<BeanStock> xStock;
    private JButton btnAlmAceptar;
    private JButton btnAlmCancelar;
    private Frame frame;
    private JCheckBox chkSeleccionar;

    public UiRegisterPedidoDet(Frame arg0, Usuario usuario, BeanPedidoCab wCotizacion) {
        super(arg0, true);
        this.frame = arg0;
        this.usuario = usuario;
        this.beanPedido = wCotizacion;
        inicialize();
        initListener();
    }

    private void inicialize() {
        gif = new Gif();
        //super.setResizable(false);
        setTitleName("Documento de Pedido");
        JPanel pnlDialog = new JPanel();
        pnlDialog.setLayout(new BorderLayout());
        pnlDialog.add(getPnlNorth(), BorderLayout.NORTH);
        pnlDialog.add(getPnlCenter(), BorderLayout.CENTER);
        pnlDialog.add(getPnlSouth(), BorderLayout.SOUTH);
        setRegister(pnlDialog);
        setMinimumSize(new Dimension(800, 250));
        pack();
        ComponentToolKit.centerComponentPosicion(this);
    }

    private void initListener() {
        btnAgregar.addActionListener(this);
        btnAlmacen.addActionListener(this);
        btnAlmCancelar.addActionListener(this);
        btnAlmAceptar.addActionListener(this);
        btnQuitar.addActionListener(this);
        mdl_detalle.addTableModelListener(this);
        chkSeleccionar.addItemListener(this);
    }

    private JPanel getPnlNorth() {
        JPanel pnlReturn = new JPanel();
        pnlReturn.setLayout(new BorderLayout());
        JPanel pnl = new JPanel();
        pnl.setLayout(new GridBagLayout());
        GridBagConstraints gbc = new GridBagConstraints();
        gbc.gridx = 0;
        gbc.gridy = 0;
        gbc.insets = new Insets(5, 5, 5, 5);
        JLabel lblCodigo = new JLabel("Codigo");
        lblCodigo.setFont(new Font(Font.SANS_SERIF, 0, 11));
        pnl.add(lblCodigo, gbc);
        gbc.gridx = 1;
        txt_codigo = new JTextField();
        txt_codigo.setEditable(false);
        txt_codigo.setFont(new Font(Font.SANS_SERIF, 0, 11));
        pnl.add(txt_codigo, gbc);
        gbc.gridx = 2;
        JLabel lbl_idtipodoc = new JLabel("T Doc");
        lbl_idtipodoc.setFont(new Font(Font.SANS_SERIF, 0, 11));
        pnl.add(lbl_idtipodoc, gbc);
        gbc.gridx = 3;
        gbc.gridwidth = 2;
        gbc.fill = GridBagConstraints.HORIZONTAL;
        txt_TipoDoc = new JTextField();
        txt_TipoDoc.setEditable(false);
        txt_TipoDoc.setFont(new Font(Font.SANS_SERIF, 0, 11));
        pnl.add(txt_TipoDoc, gbc);
        gbc.gridwidth = 1;
        gbc.fill = GridBagConstraints.NONE;

        gbc.gridx = 5;
        JLabel lbl_NDoc = new JLabel("N° Doc");
        lbl_NDoc.setFont(new Font(Font.SANS_SERIF, 0, 11));
        pnl.add(lbl_NDoc, gbc);
        gbc.gridx = 6;
        txt_serie = new JTextField();
        //txt_serie.setEditable(false);
        txt_serie.setFont(new Font(Font.SANS_SERIF, 0, 11));
        pnl.add(txt_serie, gbc);
        gbc.gridx = 7;
        txt_preimpreso = new JTextField();
        txt_preimpreso.setFont(new Font(Font.SANS_SERIF, 0, 11));
        pnl.add(txt_preimpreso, gbc);
        gbc.gridx = 8;
        JLabel lbl_fEmision = new JLabel("F Emision");
        lbl_fEmision.setFont(new Font(Font.SANS_SERIF, 0, 11));
        pnl.add(lbl_fEmision, gbc);

        gbc.gridx = 9;
        dc_fechaemision = new JDateChooser("dd/MM/yyyy", "##/##/####", '_');
        pnl.add(dc_fechaemision, gbc);

        gbc.gridx = 0;
        gbc.gridy = 1;

        JLabel lbl_TPago = new JLabel("Mod Venta");
        lbl_TPago.setFont(new Font(Font.SANS_SERIF, 0, 11));
        pnl.add(lbl_TPago, gbc);
        gbc.gridx = 1;
        gbc.gridwidth = 2;
        gbc.fill = GridBagConstraints.HORIZONTAL;
        cboModVta = new JComboBox();
        cboModVta.addItem("Cliente Recoge");
        cboModVta.addItem("Despacho al Cliente");
        pnl.add(cboModVta, gbc);
        gbc.gridwidth = 1;
        gbc.fill = GridBagConstraints.NONE;

        gbc.gridx = 3;
        JLabel lblDias = new JLabel("T. Dias");
        lblDias.setFont(new Font(Font.SANS_SERIF, 0, 11));
        pnl.add(lblDias, gbc);
        gbc.gridx = 4;
        txt_numDias = new JTextField();
        txt_numDias.setFont(new Font(Font.SANS_SERIF, 0, 11));
        pnl.add(txt_numDias, gbc);

        gbc.gridx = 5;
        JLabel lblDespacho = new JLabel("Mod Despacho");
        lblDespacho.setFont(new Font(Font.SANS_SERIF, 0, 11));
        pnl.add(lblDespacho, gbc);

        gbc.gridx = 6;
        gbc.gridwidth = 2;
        gbc.fill = GridBagConstraints.HORIZONTAL;
        cboModDespacho = new JComboBox();
        cboModDespacho.addItem("Almacen Empresa");
        cboModDespacho.addItem("Almacen Proveedor");
        pnl.add(cboModDespacho, gbc);
        gbc.gridwidth = 1;
        gbc.fill = GridBagConstraints.NONE;

        gbc.gridx = 8;
        JLabel lbl_fVence = new JLabel("F Vence");
        lbl_fVence.setFont(new Font(Font.SANS_SERIF, 0, 11));
        pnl.add(lbl_fVence, gbc);

        gbc.gridx = 9;
        dc_fechavence = new JDateChooser("dd/MM/yyyy", "##/##/####", '_');
        pnl.add(dc_fechavence, gbc);

        gbc.gridx = 0;
        gbc.gridy = 2;
        JLabel lblMoneda = new JLabel("Moneda");
        pnl.add(lblMoneda, gbc);
        gbc.gridx = 1;
        gbc.gridwidth = 4;
        gbc.fill = GridBagConstraints.HORIZONTAL;
        cboMoneda = new JComboBox();
        pnl.add(cboMoneda, gbc);
        gbc.gridwidth = 1;
        gbc.fill = GridBagConstraints.NONE;

        gbc.gridx = 5;
        JLabel lblTc = new JLabel("T. Cambio");
        pnl.add(lblTc, gbc);
        gbc.gridx = 6;
        gbc.anchor = GridBagConstraints.WEST;
        txt_tipocambio = new JTextField();
        txt_tipocambio.setFont(new Font(Font.SANS_SERIF, 0, 11));
        pnl.add(txt_tipocambio, gbc);

        gbc.gridx = 8;
        JLabel lbl_fDespacho = new JLabel("F Despacho");
        lbl_fDespacho.setFont(new Font(Font.SANS_SERIF, 0, 11));
        pnl.add(lbl_fDespacho, gbc);

        gbc.gridx = 9;
        dc_fechadespacho = new JDateChooser("dd/MM/yyyy", "##/##/####", '_');
        pnl.add(dc_fechadespacho, gbc);

        gbc.gridx = 0;
        gbc.gridy = 3;
        JLabel lbl_Anexo = new JLabel("R. Social");
        lbl_Anexo.setFont(new Font(Font.SANS_SERIF, 0, 11));
        pnl.add(lbl_Anexo, gbc);
        gbc.gridx = 1;
        gbc.fill = GridBagConstraints.HORIZONTAL;
        txt_idAnexo = new JTextField();
        txt_idAnexo.setFont(new Font(Font.SANS_SERIF, 0, 11));
        pnl.add(txt_idAnexo, gbc);
        gbc.gridx = 2;
        gbc.gridwidth = 6;
        txt_Anexo = new JTextField();
        txt_Anexo.setFont(new Font(Font.SANS_SERIF, 0, 11));
        pnl.add(txt_Anexo, gbc);
        gbc.gridwidth = 8;

        gbc.gridx = 8;
        JLabel lblRuc = new JLabel("RUC/DNI");
        pnl.add(lblRuc, gbc);
        gbc.gridx = 9;
        gbc.anchor = GridBagConstraints.WEST;
        txt_Ruc = new JTextField();
        txt_Ruc.setFont(new Font(Font.SANS_SERIF, 0, 11));
        pnl.add(txt_Ruc, gbc);
        //gbc.fill = GridBagConstraints.NONE;
        gbc.gridx = 0;
        gbc.gridy = 4;
        JLabel lbl_direccion = new JLabel("Direccion");
        lbl_direccion.setFont(new Font(Font.SANS_SERIF, 0, 11));
        pnl.add(lbl_direccion, gbc);
        gbc.gridx = 1;
        gbc.gridwidth = 7;
        txt_Direccion = new JTextField();
        txt_Direccion.setFont(new Font(Font.SANS_SERIF, 0, 11));
        pnl.add(txt_Direccion, gbc);
        gbc.fill = GridBagConstraints.NONE;
        gbc.gridwidth = 1;

        pnlReturn.add(pnl, BorderLayout.WEST);
        return pnlReturn;
    }

    private JPanel getPnlCenter() {
        JPanel pnl = new JPanel();
        pnl.setLayout(new BorderLayout());
        JTabbedPane tabb = new JTabbedPane();
        pnl.add(tabb, BorderLayout.CENTER);
        mdl_detalle = new TableModelPedidoDet();
        tbl_detalle = new CTable();
        tbl_detalle.setFont(new Font(Font.SANS_SERIF, 0, 11));
        tbl_detalle.getTableHeader().setFont(new Font(Font.SANS_SERIF, 1, 11));
        tbl_detalle.setModel(mdl_detalle);
        tbl_detalle.setAllColumnNoResizable();
        tbl_detalle.setAllTableNoEditable();
        //tbl_detalleventa.setColumnEditable(4);
        tbl_detalle.setNoVisibleColumn(0);
        tbl_detalle.setNoVisibleColumn(8);
        tbl_detalle.setNoVisibleColumn(11);
        tbl_detalle.setNoVisibleColumn(12);
        tbl_detalle.setNoVisibleColumn(13);
        tbl_detalle.setNoVisibleColumn(14);
        JPanel pnltabla = new JPanel();
        pnltabla.setLayout(new BorderLayout());
        JScrollPane scrollViewVenta = new JScrollPane(tbl_detalle);
        scrollViewVenta.setPreferredSize(new Dimension(800, 150));
        JPanel pnlNorth = new JPanel();
        pnlNorth.setLayout(new BorderLayout());
        toolbar = new JToolBar();
        pnlAlmacen = new JPanel(new FlowLayout(FlowLayout.LEADING, 14, 5));
        pnltabla.add(scrollViewVenta, BorderLayout.CENTER);
        pnltabla.add(pnlNorth, BorderLayout.NORTH);
        JPanel pnl_botones = new JPanel(new FlowLayout(FlowLayout.LEFT, 14, 5));
        pnl_botones.add(toolbar);
        chkSeleccionar = new JCheckBox("Seleccionar");
        chkSeleccionar.setVisible(false);
        pnl_botones.add(chkSeleccionar);
        pnlNorth.add(pnl_botones, BorderLayout.NORTH);
        //pnlNorth.add(toolbar, BorderLayout.NORTH);
        pnlNorth.add(pnlAlmacen, BorderLayout.CENTER);
        tabb.add("Detalle", pnltabla);
        btnAgregar = new JButton("Agregar", gif.ADD16);
        btnAgregar.setMnemonic('A');
        btnAgregar.setHorizontalAlignment(SwingConstants.LEFT);
        btnAgregar.setIconTextGap(10);
        btnAgregar.setOpaque(false);
        btnAgregar.setFocusPainted(false);
        btnAgregar.setFont(new Font(Font.SANS_SERIF, 0, 11));
        toolbar.add(btnAgregar);

        toolbar.addSeparator();

        btnQuitar = new JButton("Quitar", gif.ELIMINATE16);
        btnQuitar.setMnemonic('Q');
        btnQuitar.setHorizontalAlignment(SwingConstants.LEFT);
        btnQuitar.setIconTextGap(10);
        btnQuitar.setOpaque(false);
        btnQuitar.setFocusPainted(false);
        btnQuitar.setFont(new Font(Font.SANS_SERIF, 0, 11));
        toolbar.add(btnQuitar);

        toolbar.addSeparator();

        btnAlmacen = new JButton("Cambiar Almacen", gif.ADDORANGE);
        btnAlmacen.setMnemonic('C');
        btnAlmacen.setHorizontalAlignment(SwingConstants.LEFT);
        btnAlmacen.setIconTextGap(10);
        btnAlmacen.setOpaque(false);
        btnAlmacen.setFocusPainted(false);
        btnAlmacen.setFont(new Font(Font.SANS_SERIF, 0, 11));
        toolbar.add(btnAlmacen);
        toolbar.setVisible(false);
        //
        JLabel lblAlmacen = new JLabel("Almacen");
        pnlAlmacen.add(lblAlmacen);
        cboAlmacen = new JComboBox();
        pnlAlmacen.add(cboAlmacen);
        btnAlmAceptar = new JButton("Aceptar", gif.ADDORANGE);
        btnAlmAceptar.setMnemonic('A');
        btnAlmAceptar.setHorizontalAlignment(SwingConstants.LEFT);
        btnAlmAceptar.setIconTextGap(10);
        btnAlmAceptar.setOpaque(false);
        btnAlmAceptar.setFocusPainted(false);
        btnAlmAceptar.setFont(new Font(Font.SANS_SERIF, 0, 11));

        btnAlmCancelar = new JButton("Cancelar", gif.CANCEL16);
        btnAlmCancelar.setMnemonic('C');
        btnAlmCancelar.setHorizontalAlignment(SwingConstants.LEFT);
        btnAlmCancelar.setIconTextGap(10);
        btnAlmCancelar.setOpaque(false);
        btnAlmCancelar.setFocusPainted(false);
        btnAlmCancelar.setFont(new Font(Font.SANS_SERIF, 0, 11));

        pnlAlmacen.add(btnAlmAceptar);
        pnlAlmacen.add(btnAlmCancelar);

        pnlAlmacen.setVisible(false);

        return pnl;
    }

    private JPanel getPnlSouth() {
        JPanel pnl = new JPanel();
        JLabel lblAfecto = new JLabel("Afecto");
        pnl.add(lblAfecto);
        txt_mafecto = new JTextField();
        txt_mafecto.setHorizontalAlignment(SwingConstants.RIGHT);
        txt_mafecto.setFont(new Font(Font.SANS_SERIF, 1, 13));
        txt_mafecto.setEditable(false);
        txt_mafecto.setColumns(7);
        pnl.add(txt_mafecto);

        JLabel lblNoAfecto = new JLabel("No Afecto");
        pnl.add(lblNoAfecto);
        txt_mnoafecto = new JTextField();
        txt_mnoafecto.setHorizontalAlignment(SwingConstants.RIGHT);
        txt_mnoafecto.setFont(new Font(Font.SANS_SERIF, 1, 13));
        txt_mnoafecto.setEditable(false);
        txt_mnoafecto.setColumns(7);
        pnl.add(txt_mnoafecto);
        JLabel lblIgv = new JLabel("Igv");
        pnl.add(lblIgv);
        txt_migv = new JTextField();
        txt_migv.setHorizontalAlignment(SwingConstants.RIGHT);
        txt_migv.setFont(new Font(Font.SANS_SERIF, 1, 13));
        txt_migv.setEditable(false);
        txt_migv.setColumns(7);
        pnl.add(txt_migv);
        JLabel lblMonto = new JLabel("Monto");
        pnl.add(lblMonto);
        txt_monto = new JTextField();
        txt_monto.setHorizontalAlignment(SwingConstants.RIGHT);
        txt_monto.setFont(new Font(Font.SANS_SERIF, 1, 13));
        txt_monto.setEditable(false);
        txt_monto.setColumns(7);
        txt_monto.setForeground(Color.RED);
        pnl.add(txt_monto);
        return pnl;
    }

    private void loadMoneda() throws Exception {
        try {
            xMoneda = new ArrayList();
            LoadCombo.loadMoneda(path, xMoneda, cboMoneda);
        } catch (Exception e) {
            throw e;
        }
    }

    private void loadStock(String id_item, String id_almacen) throws Exception {
        try {
            System.out.println("id_almacen = " + id_almacen + "\nid_item: " + id_item);
            if (xStock != null) {
                xStock.clear();
            } else {
                xStock = new ArrayList<BeanStock>();
            }
            RnStock logic = new RnStock(path);
            xStock.addAll(logic.listarStockVentas(usuario.getCodempresa(), usuario.getCodpuntoventa(), id_item, usuario.getCodlocalidad(), "S"));
            int pos = -1;
            cboAlmacen.removeAllItems();
            for (int i = 0; i < xStock.size(); i++) {
                if (xStock.get(i).getBeanAlmacen().getIdAlmacen().equals(id_almacen)) {
                    pos = i;
                }
                cboAlmacen.addItem(xStock.get(i).getBeanAlmacen().getDescripcion());
            }
            if (pos > -1) {
                cboAlmacen.setSelectedIndex(pos);
            }
        } catch (Exception e) {
            throw e;
        }
    }

    private int fechasDiferenciaEnDias(Date fechaInicial, Date fechaFinal) {

        DateFormat df = DateFormat.getDateInstance(DateFormat.MEDIUM);
        String fechaInicioString = df.format(fechaInicial);
        try {
            fechaInicial = df.parse(fechaInicioString);
        } catch (ParseException ex) {
        }

        String fechaFinalString = df.format(fechaFinal);
        try {
            fechaFinal = df.parse(fechaFinalString);
        } catch (ParseException ex) {
        }

        long fechaInicialMs = fechaInicial.getTime();
        long fechaFinalMs = fechaFinal.getTime();
        long diferencia = fechaFinalMs - fechaInicialMs;
        double dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
        return ((int) dias);
    }

    private void calcTotal() {
        BigDecimal afecto = BigDecimal.ZERO;
        BigDecimal noafecto = BigDecimal.ZERO;
        BigDecimal igv = BigDecimal.ZERO;
        BigDecimal monto = BigDecimal.ZERO;
        NumberFormat formatter = NumberFormat.getInstance(new Locale("en_US"));
        for (int i = 0; i < mdl_detalle.getRowCount(); i++) {
            afecto = afecto.add(mdl_detalle.getPedido(i).getAfecto());
            noafecto = noafecto.add(mdl_detalle.getPedido(i).getNoafecto());
            igv = igv.add(mdl_detalle.getPedido(i).getIgv());
            monto = monto.add(mdl_detalle.getPedido(i).getMonto());
        }
        txt_mafecto.setText(FormatObject.formatNumber(formatter.format(afecto.setScale(2, RoundingMode.HALF_UP)), 2));
        txt_mnoafecto.setText(FormatObject.formatNumber(formatter.format(noafecto.setScale(2, RoundingMode.HALF_UP)), 2));
        txt_migv.setText(FormatObject.formatNumber(formatter.format(igv.setScale(2, RoundingMode.HALF_UP)), 2));
        txt_monto.setText(FormatObject.formatNumber(formatter.format(monto.setScale(2, RoundingMode.HALF_UP)), 2));
    }

    private void cargarmodVta(String modVta) {
        for (int i = 0; i < cboModVta.getItemCount(); i++) {
            cboModVta.setSelectedIndex(i);
            if (cboModVta.getSelectedItem().toString().substring(0, 1).equals(modVta)) {
                break;
            }
        }
    }

    private void cargarmodDespacho(String modDespacho) {
        if (modDespacho.equals("E")) {
            cboModDespacho.setSelectedIndex(0);
        } else {
            cboModDespacho.setSelectedIndex(1);
        }
    }

    private void cargarMoneda(String id_moneda) {
        for (int i = 0; i < xMoneda.size(); i++) {
            if (xMoneda.get(i).getIdMoneda().equals(id_moneda)) {
                cboMoneda.setSelectedIndex(i);
                break;
            }
        }
    }

    private void cargarDetalle() throws Exception {
        try {
            RnPedidoCab logic = new RnPedidoCab(path);
            mdl_detalle.clearTable();
            listaDet = logic.detallePedido(Integer.parseInt(txt_codigo.getText()));
            mdl_detalle.agregarListPedido(listaDet);
            tbl_detalle.setAllColumnPreferredWidthNvo(10);
            calcTotal();
        } catch (Exception e) {
            throw e;
        }
    }

    public void setSwOpcUpdate(int swOpcUpdate) {
        this.swOpcUpdate = swOpcUpdate;
        dc_fechaemision.setEnabled(false);
        dc_fechavence.setEnabled(false);
        dc_fechadespacho.setEnabled(false);
        cboModVta.setEnabled(false);
        cboModDespacho.setEnabled(false);
        cboMoneda.setEnabled(false);
        txt_TipoDoc.setEditable(false);
        txt_serie.setEditable(false);
        txt_preimpreso.setEditable(false);
        txt_numDias.setEditable(false);
        txt_tipocambio.setEditable(false);
        txt_idAnexo.setEditable(false);
        txt_Anexo.setEditable(false);
        txt_Ruc.setEditable(false);
        txt_Direccion.setEditable(false);
        if (swOpcUpdate == 1) {
            mdl_detalle.setSwAutorizar(true);
            tbl_detalle.setVisibleColumn(0);
            for (int i = 0; i < mdl_detalle.getRowCount(); i++) {
                if (mdl_detalle.getPedido(i).getCantDesp().compareTo(BigDecimal.ZERO) == 0) {
                    tbl_detalle.setCellEditable(i, 0);
                }
            }
            this.getPnlControl().getCbOk().setText("Autorizar");
            tbl_detalle.setAllColumnPreferredWidthNvo(10);
            chkSeleccionar.setVisible(false);
        } else if (swOpcUpdate == 2) {
            tbl_detalle.setVisibleColumn(0);
            for (int i = 0; i < mdl_detalle.getRowCount(); i++) {
                if (!mdl_detalle.getPedido(i).isSwCerrado()) {
                    if (!(mdl_detalle.getPedido(i).getCantDesp().compareTo(mdl_detalle.getPedido(i).getCantidad()) == 0)) {
                        tbl_detalle.setCellEditable(i, 0);
                    }
                }
            }
            this.getPnlControl().getCbOk().setText("Cerrar Pedido");
            tbl_detalle.setAllColumnPreferredWidthNvo(10);
            chkSeleccionar.setVisible(true);
        } else {
            toolbar.setVisible(true);
            for (int i = 0; i < mdl_detalle.getRowCount(); i++) {
                if (mdl_detalle.getPedido(i).getCantDesp().compareTo(BigDecimal.ZERO) == 0) {
                    tbl_detalle.setCellEditable(i, 4);
                    tbl_detalle.setCellEditable(i, 5);
                }
            }
            chkSeleccionar.setVisible(false);
        }
    }

    private void agregarItem() {
        List<BeanPedidoDet> listDetalle = mdl_detalle.getData();
        PnlCotizacionAddItem pnl = new PnlCotizacionAddItem(this, "Agregar Item Pedido", usuario, path, btnAgregar);
        pnl.setListDetallePedido(listDetalle);
        pnl.cargarDatos();
        pnl.setVisible(true);
    }        

    private void quitarItem() {
        if (tbl_detalle.getRowCount() == 0 || tbl_detalle.getSelectedRow() < 0) {
            return;
        }
        int visibleRowIndex = tbl_detalle.getSelectedRow();
        if (visibleRowIndex < 0) {
            return;
        }
        int realRowIndex = tbl_detalle.convertRowIndexToModel(visibleRowIndex);
        BeanPedidoDet beanDet = mdl_detalle.getPedido(realRowIndex);
        if (beanDet.getCantDesp().compareTo(BigDecimal.ZERO) == 1) {
            JOptionPane.showMessageDialog(this, "No Se Puede Quitar Item, Estado Atendido");
            return;
        }
        int xres = JOptionPane.showConfirmDialog(this, "Desea Quitar Item?", "Cotizacion", JOptionPane.OK_CANCEL_OPTION);
        if (xres == JOptionPane.OK_OPTION) {
            mdl_detalle.eliminarPedido(realRowIndex);
            mdl_detalle.fireTableDataChanged();
            tbl_detalle.setAllColumnPreferredWidthNvo(10);
            for (int i = 0; i < listaDet.size(); i++) {
                if (listaDet.get(i).getId_pedido_det() == beanDet.getId_pedido_det()) {
                    listaDet.get(i).setOperacion("E");
                    break;
                }
                //System.out.println(" - "+listaDet.get(i).getOperacion());
            }
        }
    }

    private void cambiarAlmacen() throws Exception {
        try {
            if (tbl_detalle.getRowCount() == 0 || tbl_detalle.getSelectedRow() < 0) {
                return;
            }
            int visibleRowIndex = tbl_detalle.getSelectedRow();
            if (visibleRowIndex < 0) {
                return;
            }
            int realRowIndex = tbl_detalle.convertRowIndexToModel(visibleRowIndex);
            BeanPedidoDet beanDet = mdl_detalle.getPedido(realRowIndex);
            if (beanDet.getCantDesp().compareTo(BigDecimal.ZERO) == 1) {
                JOptionPane.showMessageDialog(this, "No Se Puede Cambiar Almacen, Estado Atendido");
                return;
            }
            loadStock(beanDet.getBeanItem().getIdItem(), beanDet.getBeanAlmacen().getIdAlmacen());
            pnlAlmacen.setVisible(true);
            toolbar.setVisible(false);
            tbl_detalle.setEnabled(false);
        } catch (Exception e) {
            throw e;
        }
    }

    private void almacenAceptar() {
        int visibleRowIndex = tbl_detalle.getSelectedRow();
        if (visibleRowIndex < 0) {
            return;
        }
        int realRowIndex = tbl_detalle.convertRowIndexToModel(visibleRowIndex);
        BeanPedidoDet beanDet = mdl_detalle.getPedido(realRowIndex);
        if (!beanDet.getBeanAlmacen().getIdAlmacen().equals(xStock.get(cboAlmacen.getSelectedIndex()).getBeanAlmacen().getIdAlmacen())) {
            BeanAlmacen bean = xStock.get(cboAlmacen.getSelectedIndex()).getBeanAlmacen();
            mdl_detalle.getPedido(realRowIndex).setBeanAlmacen(bean);
            if (!mdl_detalle.getPedido(realRowIndex).getOperacion().equals("I")) {
                mdl_detalle.getPedido(realRowIndex).setOperacion("A");
            }
            mdl_detalle.fireTableDataChanged();
            tbl_detalle.setAllColumnPreferredWidthNvo(10);
        }
        pnlAlmacen.setVisible(false);
        toolbar.setVisible(true);
        tbl_detalle.setEnabled(true);
    }

    private BeanPedidoCab getPedidoCab() throws Exception {
        try {
            String xmlItem = "";
            xmlItem = "<?xml version=\"1.0\" ?> ";
            xmlItem += "<ITEMS>";
            String flag_autorizado = "S";
            BigDecimal afecto = BigDecimal.ZERO;
            BigDecimal noafecto = BigDecimal.ZERO;
            BigDecimal igv = BigDecimal.ZERO;
            BigDecimal monto = BigDecimal.ZERO;
            RnItem logicItem = new RnItem(path);
            BigDecimal precioMenor = new BigDecimal(BigInteger.ZERO);
            for (int i = 0; i < mdl_detalle.getRowCount(); i++) {
                BeanPedidoDet beanDet = mdl_detalle.getPedido(i);
                if (beanDet.getOperacion().length() > 0) {
                    precioMenor = new BigDecimal(BigInteger.ZERO);
                    List<BeanPrecioItem> lista = logicItem.listarProductoPrecioVenta(usuario.getCodlocalidad(), beanDet.getBeanItem().getIdItem());
                    if (lista.size() > 0) {
                        BeanPrecioItem beanPrecio = lista.get(0);
                        if (beanPedido.getBeanMoneda().getIdMoneda().equals("00001")) {
                            precioMenor = beanPrecio.getPrecio1();
                            if (precioMenor.compareTo(beanPrecio.getPrecio2()) == 1) {
                                precioMenor = beanPrecio.getPrecio2();
                            }
                            if (precioMenor.compareTo(beanPrecio.getPrecio3()) == 1) {
                                precioMenor = beanPrecio.getPrecio3();
                            }
                        } else {
                            precioMenor = beanPrecio.getPrecio4();
                            if (precioMenor.compareTo(beanPrecio.getPrecio5()) == 1) {
                                precioMenor = beanPrecio.getPrecio5();
                            }
                            if (precioMenor.compareTo(beanPrecio.getPrecio6()) == 1) {
                                precioMenor = beanPrecio.getPrecio6();
                            }
                        }
                        if (beanDet.getPrecio().compareTo(precioMenor) == -1) {
                            beanDet.setFlagAutorizado("N");
                        }
                    } else {
                        beanDet.setFlagAutorizado("N");
                    }
                    xmlItem += "<ITEM>";
                    xmlItem += "<ID_ITEM>" + beanDet.getBeanItem().getIdItem() + "</ID_ITEM>";
                    xmlItem += "<M_AFECTO>" + beanDet.getAfecto().toString().replace(".", ",") + "</M_AFECTO>";
                    xmlItem += "<M_NOAFECTO>" + beanDet.getNoafecto().toString().replace(".", ",") + "</M_NOAFECTO>";
                    xmlItem += "<P_IGV>" + beanDet.getP_igv().toString().replace(".", ",") + "</P_IGV>";
                    xmlItem += "<M_IGV>" + beanDet.getIgv().toString().replace(".", ",") + "</M_IGV>";
                    xmlItem += "<MONTO>" + beanDet.getMonto().toString().replace(".", ",") + "</MONTO>";
                    xmlItem += "<CANTIDAD>" + beanDet.getCantidad().toString().replace(".", ",") + "</CANTIDAD>";
                    xmlItem += "<ID_ALMACEN>" + beanDet.getBeanAlmacen().getIdAlmacen() + "</ID_ALMACEN>";
                    xmlItem += "<PRECIO>" + beanDet.getPrecio().toString().replace(".", ",") + "</PRECIO>";
                    xmlItem += "<FLAG_AUTORIZADO>" + beanDet.getFlagAutorizado() + "</FLAG_AUTORIZADO>";
                    xmlItem += "<OPERACION>" + beanDet.getOperacion() + "</OPERACION>";
                    xmlItem += "<ID_PEDIDO_DET>" + beanDet.getId_pedido_det() + "</ID_PEDIDO_DET>";
                    if (beanDet.getFlagAutorizado().equals("N")) {
                        flag_autorizado = "N";
                    }
                    xmlItem += "</ITEM>";
                }
                afecto = afecto.add(mdl_detalle.getPedido(i).getAfecto());
                noafecto = noafecto.add(mdl_detalle.getPedido(i).getNoafecto());
                igv = igv.add(mdl_detalle.getPedido(i).getIgv());
                monto = monto.add(mdl_detalle.getPedido(i).getMonto());
            }
            for (int i = 0; i < listaDet.size(); i++) {
                BeanPedidoDet beanDet = listaDet.get(i);
                if (beanDet.getOperacion().equals("E")) {
                    xmlItem += "<ITEM>";
                    xmlItem += "<ID_ITEM>" + beanDet.getBeanItem().getIdItem() + "</ID_ITEM>";
                    xmlItem += "<M_AFECTO>" + beanDet.getAfecto().toString().replace(".", ",") + "</M_AFECTO>";
                    xmlItem += "<M_NOAFECTO>" + beanDet.getNoafecto().toString().replace(".", ",") + "</M_NOAFECTO>";
                    xmlItem += "<P_IGV>" + beanDet.getP_igv().toString().replace(".", ",") + "</P_IGV>";
                    xmlItem += "<M_IGV>" + beanDet.getIgv().toString().replace(".", ",") + "</M_IGV>";
                    xmlItem += "<MONTO>" + beanDet.getMonto().toString().replace(".", ",") + "</MONTO>";
                    xmlItem += "<CANTIDAD>" + beanDet.getCantidad().toString().replace(".", ",") + "</CANTIDAD>";
                    xmlItem += "<ID_ALMACEN>" + beanDet.getBeanAlmacen().getIdAlmacen() + "</ID_ALMACEN>";
                    xmlItem += "<PRECIO>" + beanDet.getPrecio().toString().replace(".", ",") + "</PRECIO>";
                    xmlItem += "<FLAG_AUTORIZADO>" + beanDet.getFlagAutorizado() + "</FLAG_AUTORIZADO>";
                    xmlItem += "<OPERACION>" + beanDet.getOperacion() + "</OPERACION>";
                    xmlItem += "<ID_PEDIDO_DET>" + beanDet.getId_pedido_det() + "</ID_PEDIDO_DET>";
                    xmlItem += "</ITEM>";
                }
            }
            xmlItem += "</ITEMS>";
            System.out.println("xmlItem = " + xmlItem);
            BeanPedidoCab beanCot = new BeanPedidoCab();
            beanCot.setId_pedido(Integer.parseInt(txt_codigo.getText()));
            beanCot.setFlag_autorizado(flag_autorizado);
            beanCot.setAfecto(afecto);
            beanCot.setNoafecto(noafecto);
            beanCot.setIgv(igv);
            beanCot.setMonto(monto);
            //beanCot.setP_igv(new BigDecimal("0.18"));
            beanCot.setEstado("A");
            beanCot.setId_usuario(usuario.getId_usuario());
            beanCot.setXmlCotizacionDet(xmlItem);
            return beanCot;
        } catch (Exception e) {
            throw e;
        }
    }

    private String updateCotizacion() throws Exception {
        try {
            String rpta = "";
            RnPedidoCab logic = new RnPedidoCab(path);
            BeanPedidoCab bean = getPedidoCab();
            rpta = logic.updatePedido(bean);
            return rpta;
        } catch (Exception e) {
            throw e;
        }
    }

    @Override
    public boolean isRegisterValid() {
        return true;
    }

    @Override
    public void showMessagePrint(String codigo) {
    }

    @Override
    public void setRegisterEnabled(boolean flag) {
        dc_fechaemision.setEnabled(flag);
        dc_fechavence.setEnabled(flag);
        dc_fechadespacho.setEnabled(flag);
        cboModVta.setEnabled(flag);
        cboModDespacho.setEnabled(flag);
        cboMoneda.setEnabled(flag);
    }

    @Override
    public void setRegisterEditable(boolean flag) {
        txt_TipoDoc.setEditable(flag);
        txt_serie.setEditable(flag);
        txt_preimpreso.setEditable(flag);
        txt_numDias.setEditable(flag);
        txt_tipocambio.setEditable(flag);
        txt_idAnexo.setEditable(flag);
        txt_Anexo.setEditable(flag);
        txt_Ruc.setEditable(flag);
        txt_Direccion.setEditable(flag);
    }

    @Override
    public void loadCombo() {
        try {
            loadMoneda();
        } catch (Exception e) {
            e.printStackTrace();
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }

    @Override
    public void newRegister() {
    }

    @Override
    public boolean loadRegister() {
        try {
            if (beanPedido != null) {
                txt_codigo.setText(String.valueOf(beanPedido.getId_pedido()));
                txt_TipoDoc.setText(beanPedido.getBeanTipoDocVenta().getDescripcion());
                txt_serie.setText(beanPedido.getSerie());
                txt_preimpreso.setText(beanPedido.getPreimpreso());
                txt_tipocambio.setText(beanPedido.getTipo_cambio().toString());
                dc_fechaemision.setDate(beanPedido.getF_emision());
                dc_fechavence.setDate(beanPedido.getF_vence());
                dc_fechadespacho.setDate(beanPedido.getF_despacho());
                txt_numDias.setText(String.valueOf(fechasDiferenciaEnDias(dc_fechavence.getDate(), dc_fechavence.getDate())));
                txt_idAnexo.setText(beanPedido.getBeanCliente().getIdCliente());
                txt_Anexo.setText(beanPedido.getBeanCliente().getDescripcion());
                txt_Ruc.setText(beanPedido.getBeanCliente().getNumero());
                txt_Direccion.setText(beanPedido.getBeanCliente().getDireccion());
                cargarDetalle();
                cargarmodVta(beanPedido.getModVenta());
                cargarmodDespacho(beanPedido.getModDespacho());
                cargarMoneda(beanPedido.getBeanMoneda().getIdMoneda());
            }
            pack();
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            JOptionPane.showMessageDialog(this, "Error: " + e.getMessage(), "Sunat", JOptionPane.OK_OPTION);
            return false;
        }
    }

    @Override
    public boolean loadRegister(Object o) {
        return true;
    }

    @Override
    public void setValueSearch(Object valor, Component comp) {
        if (comp == btnAgregar) {
            BeanPedidoDet bean = (BeanPedidoDet) valor;
            mdl_detalle.agregarPedido(bean);
            mdl_detalle.fireTableDataChanged();
            tbl_detalle.setAllColumnPreferredWidthNvo(10);
            calcTotal();
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
    public String executeInsert() {
        return "";
    }

    @Override
    public String executeUpdate() {
        try {
            String rpta = "";
            RnPedidoCab logic = new RnPedidoCab(path);
            if (swOpcUpdate == 1) {
                String flag_autorizado = "S";
                String xmlItem = "";
                xmlItem = "<?xml version=\"1.0\" ?> ";
                xmlItem += "<ITEMS>";
                for (int i = 0; i < mdl_detalle.getRowCount(); i++) {
                    BeanPedidoDet bean = mdl_detalle.getPedido(i);
                    if (!bean.isSwAutorizado()) {
                        flag_autorizado = "N";
                    }
                    xmlItem += "<ITEM>";
                    xmlItem += "<ID_PEDIDO_DET>" + bean.getId_pedido_det() + "</ID_PEDIDO_DET>";
                    xmlItem += "<FLAG_AUTORIZADO>" + (bean.isSwAutorizado() ? "S" : "N") + "</FLAG_AUTORIZADO>";
                    xmlItem += "</ITEM>";
                }
                xmlItem += "</ITEMS>";
                rpta = logic.autorizarPedido(Integer.parseInt(txt_codigo.getText()), flag_autorizado, xmlItem, usuario.getId_usuario());
            } else if (swOpcUpdate == 2) {
                boolean swCerrado = true;
                String xmlItem = "";
                xmlItem = "<?xml version=\"1.0\" ?> ";
                xmlItem += "<ITEMS>";
                for (int i = 0; i < mdl_detalle.getRowCount(); i++) {
                    BeanPedidoDet bean = mdl_detalle.getPedido(i);
                    if (bean.isSwCerrado()) {
                        xmlItem += "<ITEM>";
                        xmlItem += "<ID_PEDIDO_DET>" + bean.getId_pedido_det() + "</ID_PEDIDO_DET>";
                        xmlItem += "<FLAG_CERRADO>" + (bean.isSwCerrado() ? "S" : "N") + "</FLAG_CERRADO>";
                        xmlItem += "</ITEM>";
                    } else if (bean.getCantDesp().compareTo(BigDecimal.ZERO) == 0) {
                        swCerrado = false;
                    } else if (!(bean.getCantDesp().compareTo(bean.getCantidad()) == 0)) {
                        swCerrado = false;
                    }
                }
                xmlItem += "</ITEMS>";
                rpta = logic.cerrarPedido(Integer.parseInt(txt_codigo.getText()), swCerrado ? "S" : "N", xmlItem, usuario.getId_usuario());
            } else {
                rpta = updateCotizacion();
            }
            JOptionPane.showMessageDialog(this, rpta);
            return rpta;
        } catch (Exception e) {
            e.printStackTrace();
            JOptionPane.showMessageDialog(this, e.getMessage());
            return "";
        }
    }

    @Override
    public boolean executeDelete() {
        try {
            RnPedidoCab logic = new RnPedidoCab(path);
            String rpta = logic.eliminarPedido(Integer.parseInt(txt_codigo.getText()), usuario.getId_usuario());
            JOptionPane.showMessageDialog(this, rpta);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            JOptionPane.showMessageDialog(this, e.getMessage());
            return false;
        }
    }

    @Override
    public boolean executeAnular() {
        try {
            RnPedidoCab logic = new RnPedidoCab(path);
            String rpta = logic.anularPedido(Integer.parseInt(txt_codigo.getText()), usuario.getId_usuario());
            JOptionPane.showMessageDialog(this, rpta);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            JOptionPane.showMessageDialog(this, e.getMessage());
            return false;
        }
    }

    @Override
    public boolean executeSelect() {
        return false;
    }

    @Override
    public void actionPerformed(ActionEvent e) {
        try {
            if (e.getSource().equals(btnAgregar)) {
                agregarItem();
            }
            if (e.getSource().equals(btnQuitar)) {
                quitarItem();
            }
            if (e.getSource().equals(btnAlmacen)) {
                cambiarAlmacen();
            }
            if (e.getSource().equals(btnAlmAceptar)) {
                almacenAceptar();
            }
            if (e.getSource().equals(btnAlmCancelar)) {
                pnlAlmacen.setVisible(false);
                toolbar.setVisible(true);
                tbl_detalle.setEnabled(true);
            }
        } catch (Exception ex) {
            ex.printStackTrace();
            JOptionPane.showMessageDialog(this, ex.getMessage());
        }
    }

    @Override
    public void tableChanged(TableModelEvent e) {
        if (e.getSource() == mdl_detalle) {
            if (mdl_detalle.getRowCount() > 0) {
                calcTotal();
            }
        }
    }

    @Override
    public void itemStateChanged(ItemEvent e) {
        if (e.getSource().equals(chkSeleccionar)) {
            boolean sw = chkSeleccionar.isSelected();
            for (int i = 0; i < mdl_detalle.getRowCount(); i++) {
                if (tbl_detalle.isCellEditable(i, 0)) {
                    mdl_detalle.getPedido(i).setSwCerrado(sw);
                }
                /*if (!mdl_detalle.getPedido(i).isSwCerrado()) {
                 if (!(mdl_detalle.getPedido(i).getCantDesp().compareTo(mdl_detalle.getPedido(i).getCantidad()) == 0)) {
                 //tbl_detalle.setCellEditable(i, 0);
                 }
                 }*/
            }
            tbl_detalle.setAllColumnPreferredWidthNvo(10);
        }
    }
}
