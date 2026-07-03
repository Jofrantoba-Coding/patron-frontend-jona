package com.softcommerce.views.uiregisterserviciotransporte;

import com.softcommerce.views.uipaneltfserviciotransporte.UiPanelTFServicioTransporte;


import com.softcommerce.formularios.*;
import com.softcommerce.accesoDatos.DAOServicioTransporte;
import com.softcommerce.beans.Anexo;
import com.softcommerce.beans.BeanMoneda;
import com.softcommerce.beans.ContaItem;
import com.softcommerce.beans.ContaCab;
import com.softcommerce.beans.Item;
import com.softcommerce.beans.TipoMovInventario;
import com.softcommerce.beans.Usuario;
import com.toedter.calendar.JDateChooser;
import com.toedter.calendar.JTextFieldDateEditor;
import com.softcommerce.general.controles.CuadroMensaje;
import com.softcommerce.general.controles.JHInternal;
import java.util.logging.Logger;
import com.softcommerce.general.herramientas.DateTime;
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
import javax.swing.JTextField;
import javax.swing.SwingConstants;
import javax.swing.event.ListSelectionEvent;
import javax.swing.event.TableModelEvent;
import javax.swing.JPanel;
import com.softcommerce.general.controles.CTable;
import com.softcommerce.general.controles.ItemObject;
import java.awt.BorderLayout;
import java.awt.Dimension;
import java.awt.Toolkit;
import java.awt.event.FocusListener;
import java.awt.event.ItemListener;
import java.awt.event.MouseEvent;
import java.awt.event.MouseListener;
import java.util.ArrayList;
import java.util.List;
import javax.swing.JCheckBox;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.JScrollPane;
import javax.swing.JTabbedPane;
import javax.swing.JToolBar;
import javax.swing.event.ListSelectionListener;
import javax.swing.event.TableModelListener;
import com.softcommerce.reglasnegocio.RnAnexo;
import com.softcommerce.reglasnegocio.RnRegContaCab;
import com.softcommerce.report.Reporte;
import com.softcommerce.general.tablas.IngresoItemTableModel;
import com.softcommerce.general.tablas.ServicioTransporteDetalleTableModel;
import com.softcommerce.logic.*;
import com.softcommerce.util.Constans;
import com.softcommerce.util.combo.LoadCombo;
import java.awt.event.KeyAdapter;
import java.text.NumberFormat;
import java.util.*;
import javax.swing.JComboBox;
import javax.swing.JFormattedTextField;
import javax.swing.RowFilter;
import javax.swing.table.TableModel;
import javax.swing.table.TableRowSorter;
import javax.swing.text.DefaultFormatterFactory;
import javax.swing.text.NumberFormatter;

public class UiRegisterServicioTransporte 
        extends JHInternal 
        implements InterUiRegisterServicioTransporte, ActionListener, ItemListener, KeyListener, FocusListener, TableModelListener, MouseListener, ListSelectionListener {

    private String almacenDevolucion = null;//jona la cago
    private static final long serialVersionUID = 1L;
    private JComboBox cbo_idmoneda;
    private List<BeanMoneda> xmoneda;
    //private List<Almacen> xalmacen;
    private JComboBox cbo_idempresatransportista;
    private List<Anexo> xEmpresaTransportista;
    private JComboBox cboItemServicio;
    private List<Item> xItemServicio;
    private JDateChooser dc_fechaemision;
    //INGRESO POR COMPRA DE MERCADERIA
    private JTabbedPane tabb_ordencompra;
    private ServicioTransporteDetalleTableModel mdl_servicio_transporte;
    private CTable tbl_ordencompra;
    private JButton btn_Agregar;
    private JButton btn_Quitar;
    private JButton btn_buscardocumento;
    private Gif gif;
    private JLabel lbl_idmovinventario;
    private JLabel lbl_tmpanexo;
    private JLabel lbl_tmpruc;
    private JLabel lbl_idempresaTransportista;
    private JLabel lblMAfecto;
    private JLabel lblMNoAfecto;
    private JLabel lblMIgv;
    private JLabel lblMonto;
    private JLabel lblMPercepcion;
    private JLabel lblTotal;
    private JTextField txt_tipocambio;
    private JTextField txt_preimpreso;
    private JTextField txt_direccion_origen;
    private JTextField txt_idmovimientodestino;
    private JTextField txt_tmpanexo;
    private JTextField txt_CodCliente;
    private JTextField txt_tmpruc;
    private JTextField txt_codigodoc;
    private JTextField txt_idauxiliar;
    private JTextField txt_CodRegContaCab;
    private JTextField txt_flagdescuento;
    private JFormattedTextField txt_total;
    private JTextField txt_percepcion;
    private JFormattedTextField txt_noafecto;
    private JTextField txt_descuento;
    private JTextField txt_igv;
    private JFormattedTextField txt_afecto;
    private JFormattedTextField txt_monto;
    private JTextField txt_flagdetigv;
    private JTextField txt_rendimiento_tonelada;
    private JTextField txt_peso_unidad;
    private Usuario usuario;
    private Main frm;
    private JCheckBox chk_seleccionar;
    private JCheckBox chk_compralocal;
    private String id_condicionventa;
    private CuadroMensaje cuadro;
    private ContaCab orden_compra;
    JTextField txt_itemorigen_filtro;
    private TableRowSorter<IngresoItemTableModel> modeloOrdenado;
    //GR-EI
    private JTextField txt_guia_remision;
    JCheckBox chkIGV;

    public UiRegisterServicioTransporte(UiPanelTFServicioTransporte pnltf, String title, Usuario usuario, Main frm) {
        super(title + " - UiRegisterServicioTransporte");
        this.usuario = usuario;
        this.frm = frm;
        cuadro = new CuadroMensaje(usuario);
        inicialize();
    }

    private void inicialize() {
        /*
         * Formato para las caja de Texto. Formato: 1,000.00
         */
        NumberFormat dispFormat = NumberFormat.getNumberInstance(Locale.US);
        NumberFormatter dnFormat = new NumberFormatter(dispFormat);
        DefaultFormatterFactory currFactory = new DefaultFormatterFactory(dnFormat, dnFormat);

        super.pnlRegister.setPreferredSize(new Dimension(980, 485));
        super.setMaximizable(false);
        super.setSize(1020, 545);
        super.setLocation(((Toolkit.getDefaultToolkit().getScreenSize().width - getSize().width) / 2), (Toolkit.getDefaultToolkit().getScreenSize().height - getSize().height) / 20);

        gif = new Gif();

        JPanel pnlDialog = new JPanel();
        pnlDialog.setLayout(null);
        pnlDialog.setBackground(new Color(245, 245, 245));

        JLabel lblServicio = new JLabel("Servicio");
        lblServicio.setBounds(10, 5, 60, 20);
        pnlDialog.add(lblServicio);


        lbl_idmovinventario = new JLabel("Pto Origen");
        lbl_idmovinventario.setBounds(10, 65, 80, 20);
        pnlDialog.add(lbl_idmovinventario);

        lbl_tmpanexo = new JLabel("Cliente");
        lbl_tmpanexo.setBounds(10, 35, 50, 20);
        pnlDialog.add(lbl_tmpanexo);

        lbl_tmpruc = new JLabel("RUC/DNI");
        lbl_tmpruc.setBounds(420, 35, 50, 20);
        pnlDialog.add(lbl_tmpruc);

        cbo_idempresatransportista = new JComboBox();
        cbo_idempresatransportista.setBounds(125, 95, 250, 20);
        pnlDialog.add(cbo_idempresatransportista);

        lbl_idempresaTransportista = new JLabel("Emp. Transportista");
        lbl_idempresaTransportista.setBounds(10, 95, 100, 20);
        pnlDialog.add(lbl_idempresaTransportista);

        lblMAfecto = new JLabel("Afecto");
        lblMAfecto.setBounds(5, 385, 40, 20);
        lblMAfecto.setFont(new Font(Font.SANS_SERIF, 0, 11));
        pnlDialog.add(lblMAfecto);

        lblMNoAfecto = new JLabel("No Afecto");
        lblMNoAfecto.setBounds(170, 385, 80, 20);
        lblMNoAfecto.setFont(new Font(Font.SANS_SERIF, 0, 11));
        pnlDialog.add(lblMNoAfecto);

        lblMPercepcion = new JLabel("Perc");
        lblMPercepcion.setFont(new Font(Font.SANS_SERIF, 0, 11));
        lblMPercepcion.setForeground(Color.BLACK);
        lblMPercepcion.setBounds(670, 385, 25, 20);
        lblMPercepcion.setVisible(false);
        pnlDialog.add(lblMPercepcion);

        lblMIgv = new JLabel("Igv");
        lblMIgv.setBounds(360, 385, 20, 20);
        lblMIgv.setFont(new Font(Font.SANS_SERIF, 0, 11));
        pnlDialog.add(lblMIgv);

        lblMonto = new JLabel("Monto");
        lblMonto.setBounds(510, 385, 40, 20);
        lblMonto.setFont(new Font(Font.SANS_SERIF, 0, 11));
        pnlDialog.add(lblMonto);

        lblTotal = new JLabel("Total");
        lblTotal.setFont(new Font(Font.SANS_SERIF, 0, 11));
        lblTotal.setForeground(Color.BLACK);
        lblTotal.setBounds(805, 385, 30, 20);
        pnlDialog.add(lblTotal);



        /*
         * Agregando componentes al formulario
         */
        pnlDialog.add(getCboItemServicio());
        pnlDialog.add(getBtn_buscardocumento());
        pnlDialog.add(getTxtDireccionOrigen());
        pnlDialog.add(getTxt_tmpanexo());
        pnlDialog.add(getTxt_tmpruc());
        pnlDialog.add(getDc_fechaemision());

        JPanel pnl = new JPanel(new BorderLayout());
        pnl.setBackground(new Color(245, 245, 245));
        mdl_servicio_transporte = new ServicioTransporteDetalleTableModel();
        mdl_servicio_transporte.addTableModelListener(this);
        tbl_ordencompra = new CTable();
        tbl_ordencompra.setModel((TableModel) mdl_servicio_transporte);

        tbl_ordencompra.setNoVisibleColumn(0);

        JScrollPane scrollTableguiaventa = new JScrollPane(tbl_ordencompra);
        pnl.add(scrollTableguiaventa, BorderLayout.CENTER);
        tabb_ordencompra = new JTabbedPane();
        JPanel pnltabb_ordencompra = new JPanel(new BorderLayout());
        pnltabb_ordencompra.setBackground(new Color(245, 245, 245));
        pnltabb_ordencompra.add(pnl, BorderLayout.CENTER);
        JToolBar toolbar = new JToolBar();
        toolbar.setBackground(new Color(245, 245, 245));
        toolbar.setFloatable(false);
        toolbar.setPreferredSize(new Dimension(0, 30));
        btn_Agregar = new JButton("Agregar", gif.ADD16);
        btn_Agregar.setMnemonic('A');
        btn_Agregar.setHorizontalAlignment(SwingConstants.LEFT);
        btn_Agregar.setIconTextGap(10);
        btn_Agregar.addActionListener(this);
        btn_Agregar.setOpaque(false);
        btn_Agregar.addKeyListener(this);
        btn_Agregar.setFocusPainted(false);
        btn_Agregar.setFont(new Font("Comic Sans MS", 0, 11));
        btn_Agregar.setVisible(false);
        chkIGV = new JCheckBox("Incluido IGV");
        chkIGV.addActionListener(this);
        toolbar.add(chkIGV);
        toolbar.addSeparator();
        btn_Quitar = new JButton("Quitar", gif.ELIMINATE16);
        btn_Quitar.setMnemonic('Q');
        btn_Quitar.setHorizontalAlignment(SwingConstants.LEFT);
        btn_Quitar.setIconTextGap(10);
        btn_Quitar.addActionListener(this);
        btn_Quitar.setOpaque(false);
        btn_Quitar.addKeyListener(this);
        btn_Quitar.setFocusPainted(false);
        btn_Quitar.setFont(new Font("Comic Sans MS", 0, 11));
        btn_Quitar.setVisible(false);
        toolbar.add(btn_Quitar);
        pnltabb_ordencompra.add(toolbar, BorderLayout.NORTH);
        tabb_ordencompra.addTab("", pnltabb_ordencompra);
        tabb_ordencompra.setTitleAt(0, "Item");
        tabb_ordencompra.setBounds(13, 145, 970, 230);
        pnlDialog.add(tabb_ordencompra);

        JToolBar toolbar7 = new JToolBar();
        toolbar7.setBackground(new Color(245, 245, 245));
        toolbar7.setFloatable(false);
        toolbar7.setPreferredSize(new Dimension(0, 30));
        /*
         * //Comentado por: csenmache btn_Agregar8	= new JButton("Agregar",
         * gif.ADD16); btn_Agregar8.setMnemonic('A');
         * btn_Agregar8.setHorizontalAlignment(SwingConstants.LEFT);
         * btn_Agregar8.setIconTextGap(10);
         * btn_Agregar8.addActionListener(this); btn_Agregar8.setOpaque(false);
         * btn_Agregar8.addKeyListener(this);
         * btn_Agregar8.setFocusPainted(false); btn_Agregar8.setFont(new
         * Font("Comic Sans MS",0,11)); toolbar.add(btn_Agregar8);
         */
        toolbar7.addSeparator();
        /*
         * //Comentado por: csenmache btn_Quitar8	= new JButton("Quitar",
         * gif.ELIMINATE16); btn_Quitar8.setMnemonic('Q');
         * btn_Quitar8.setHorizontalAlignment(SwingConstants.LEFT);
         * btn_Quitar8.setIconTextGap(10); btn_Quitar8.addActionListener(this);
         * btn_Quitar8.setOpaque(false); btn_Quitar8.addKeyListener(this);
         * btn_Quitar8.setFocusPainted(false); btn_Quitar8.setFont(new
         * Font("Comic Sans MS",0,11)); toolbar7.add(btn_Quitar8);
         */





        chk_seleccionar = new JCheckBox("Seleccionar Todo");
        chk_seleccionar.addItemListener(this);
        chk_seleccionar.setFont(new Font("Verdana", 1, 11));
        chk_seleccionar.addKeyListener(this);
        chk_seleccionar.setHorizontalTextPosition(SwingConstants.LEFT);
        chk_seleccionar.addFocusListener(this);
        chk_seleccionar.setOpaque(false);
        pnlDialog.add(chk_seleccionar);



        txt_afecto = new JFormattedTextField();

        txt_afecto.setBounds(45, 385, 100, 20);

        txt_afecto.setHorizontalAlignment(SwingConstants.RIGHT);
        txt_afecto.setFont(new Font(Font.SANS_SERIF, 1, 13));
        txt_afecto.addKeyListener(this);
        txt_afecto.setEditable(false);
        txt_afecto.setFormatterFactory(currFactory);
        pnlDialog.add(txt_afecto);

        txt_noafecto = new JFormattedTextField();

        txt_noafecto.setBounds(230, 385, 100, 20);

        txt_noafecto.setHorizontalAlignment(SwingConstants.RIGHT);
        txt_noafecto.setFont(new Font(Font.SANS_SERIF, 1, 13));
        txt_noafecto.setFormatterFactory(currFactory);
        txt_noafecto.addKeyListener(this);
        txt_noafecto.setEditable(false);
        pnlDialog.add(txt_noafecto);

        txt_igv = new JTextField();
        txt_igv.setBounds(380, 385, 100, 20);
        txt_igv.setHorizontalAlignment(SwingConstants.RIGHT);
        txt_igv.setFont(new Font(Font.SANS_SERIF, 1, 13));
        txt_igv.addKeyListener(this);
        txt_igv.setEditable(false);
        txt_igv.setText("0");
        pnlDialog.add(txt_igv);



        txt_monto = new JFormattedTextField();

        txt_monto.setBounds(550, 385, 100, 25);

        txt_monto.addKeyListener(this);
        txt_monto.setFont(new Font(Font.SANS_SERIF, 1, 16));
        txt_monto.setEditable(false);
        txt_monto.setHorizontalAlignment(SwingConstants.RIGHT);
        txt_monto.setForeground(Color.RED);
        txt_monto.setFormatterFactory(currFactory);
        pnlDialog.add(txt_monto);

        txt_percepcion = new JTextField();

        txt_percepcion.setBounds(695, 385, 90, 25);

        txt_percepcion.setHorizontalAlignment(SwingConstants.RIGHT);
        txt_percepcion.addKeyListener(this);
        txt_percepcion.setForeground(Color.BLUE);
        txt_percepcion.setFont(new Font(Font.SANS_SERIF, 1, 16));
        txt_percepcion.setEditable(false);
        txt_percepcion.setVisible(false);
        pnlDialog.add(txt_percepcion);

        txt_total = new JFormattedTextField();
        txt_total.setBounds(835, 385, 100, 25);
        txt_total.setHorizontalAlignment(SwingConstants.RIGHT);
        txt_total.addKeyListener(this);
        txt_total.setForeground(Color.darkGray);
        txt_total.setFont(new Font(Font.SANS_SERIF, 1, 16));
        txt_total.setEditable(false);
        txt_total.setFormatterFactory(currFactory);
        pnlDialog.add(txt_total);

        txt_guia_remision = new JTextField();
        txt_flagdescuento = new JTextField();
        txt_descuento = new JTextField();
        txt_codigodoc = new JTextField();
        txt_CodRegContaCab = new JTextField();
        txt_idmovimientodestino = new JTextField();
        txt_CodCliente = new JTextField();
        cbo_idmoneda = new JComboBox();
        txt_tipocambio = new JTextField();
        txt_idauxiliar = new JTextField();
        txt_flagdetigv = new JTextField();

        cbo_idempresatransportista.setEnabled(false);
        tbl_ordencompra.getColumnModel().getColumn(4).setPreferredWidth(220);
        tbl_ordencompra.getColumnModel().getColumn(1).setPreferredWidth(120);
        tbl_ordencompra.getColumnModel().getColumn(2).setPreferredWidth(120);

        setRegister(pnlDialog);
    }

    public void cargarDocumentoVenta(List<ContaItem> m) {
        if (m != null && m.size() > 0) {
            ContaItem regContaCab = m.get(0);

            //cargarLocalidad(regContaCab.getId_localidad());
            //cargarPuntoVenta(regContaCab.getId_punto_venta());

            txt_CodCliente.setText(regContaCab.getId_anexo());
            txt_CodRegContaCab.setText(regContaCab.getId_regcontacab());
            System.out.println(regContaCab.getId_regcontacab());
            txt_idauxiliar.setText(regContaCab.getId_auxiliar());
            txt_tmpanexo.setText(regContaCab.getTmpanexo());
            txt_tmpruc.setText(regContaCab.getTmpruc());
            id_condicionventa = regContaCab.getId_condicion_venta();


            LogicRegContaCab obj = new LogicRegContaCab(path);
            String Moneda = obj.RetornaMonedaNC(regContaCab.getId_regcontacab());
            System.out.print(Moneda);
            regContaCab.setIdMoneda(Moneda);

            cargarMoneda(regContaCab.getIdMoneda());

            almacenDevolucion = m.get(0).getId_almacen();//jona la cago
            chk_seleccionar.requestFocus();
        }
    }

    @Override
    public void itemStateChanged(ItemEvent e) {
        boolean isSelect;

        isSelect = (e.getStateChange() == ItemEvent.SELECTED);

//        if (e.getItemSelectable() == chk_seleccionar) {
//            for (int i = 0; i < mdl_servicio_transporte.getRowCount(); i++) {
//                mdl_servicio_transporte.getOrdenCompraDet(i).setSeleccionado(isSelect);
//                mdl_servicio_transporte.getOrdenCompraDet(i).setCantidad_string(mdl_servicio_transporte.getOrdenCompraDet(i).isSeleccionado() ? String.valueOf(mdl_servicio_transporte.getOrdenCompraDet(i).getCantidad_double()) : "");
//            }
//
//            mdl_servicio_transporte.fireTableDataChanged();
//
//
//
////            if (xItemServicio.get((getCboItemServicio().getSelectedIndex())).getId_item().equals("005")) {
////                for (int i = 0; i < mdl_inventarioinicial.getRowCount(); i++) {
////                    mdl_inventarioinicial.getOrdenCompraDet(i).setSeleccionado(isSelect);
////                    mdl_inventarioinicial.getOrdenCompraDet(i).setCantidad_string(mdl_inventarioinicial.getOrdenCompraDet(i).isSeleccionado() ? String.valueOf(mdl_inventarioinicial.getOrdenCompraDet(i).getCantidad_double()) : "");
////                }
////
////                mdl_inventarioinicial.fireTableDataChanged();
////            }
//        }
    }

    @Override
    public void loadCombo() {

        loadMovimiento();
        loadEmpresaTransportista();
        loadMoneda();
        //   loadItemStock();
    }

    public void filtrarItemOrigen() {
        this.modeloOrdenado.setRowFilter(buscarFilas());
    }

    public RowFilter<Object, Object> buscarFilas() {
        ArrayList<RowFilter<Object, Object>> listaRow = new ArrayList<RowFilter<Object, Object>>();
        String valor = this.txt_itemorigen_filtro.getText().trim();
        if (!valor.equals("")) {
            listaRow.add(RowFilter.regexFilter(".*" + valor.toUpperCase() + ".*", 0));
        }

        RowFilter<Object, Object> fooBarFilter = RowFilter.andFilter(listaRow);
        return fooBarFilter;
    }

    public void loadMovimiento() {
        LogicServicioTransporte regla = new LogicServicioTransporte(path);

        if (xItemServicio != null) {
            xItemServicio.clear();
        } else {
            xItemServicio = new ArrayList<Item>();
        }

        TipoMovInventario t = new TipoMovInventario();
        t.setTipo("E");
        t.setHabNi("S");
        try {
            xItemServicio.addAll(regla.listarItemServicio("S"));
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, e.toString());
        }


        getCboItemServicio().removeAllItems();

        for (int i = 0; i < xItemServicio.size(); i++) {
            getCboItemServicio().addItem(xItemServicio.get(i).getDescripcion());
        }

        if (getCboItemServicio().getItemCount() > 0) {
            getCboItemServicio().setSelectedItem("INGRESO POR COMPRA DE MERCADERIA");
        }
    }

    public void loadEmpresaTransportista() {
        try {
            Anexo a = new Anexo();
            a.setIdTipoAnexo("6");
            a.setNumeroInicial(-1);
            a.setNumeroFinal(-1);
            a.setIdEmpresa(usuario.getCodempresa());

            RnAnexo regla_Anexo = new RnAnexo(path);

            if (xEmpresaTransportista != null) {
                xEmpresaTransportista.clear();
            } else {
                xEmpresaTransportista = new ArrayList<Anexo>();
            }

            xEmpresaTransportista.addAll(regla_Anexo.listarAnexo(a));

            cbo_idempresatransportista.removeAllItems();
            cbo_idempresatransportista.addItem("--- Seleccione una Empresa de Transporte ---");

            for (int i = 0; i < xEmpresaTransportista.size(); i++) {
                cbo_idempresatransportista.addItem(xEmpresaTransportista.get(i).getDescripcion());
            }

            cbo_idempresatransportista.setSelectedIndex(0);
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }

    public void loadMoneda() {
        try {
            xmoneda = new ArrayList();
            LoadCombo.loadMoneda(xmoneda, cbo_idmoneda, Constans.ITEM_INIT_MONEDA, 0);
        } catch (Exception ex) {
            JOptionPane.showMessageDialog(this, ex.getMessage());
        }
    }

    @Override
    public void newRegister() {
        try {
            JTextField txt = new JTextField();
            getCboItemServicio().setBorder(txt.getBorder());
            dc_fechaemision.setBorder(new JDateChooser().getBorder());
            tabb_ordencompra.setBorder(txt.getBorder());

            txt_guia_remision.setText("");
            txt_CodRegContaCab.setText("");
            dc_fechaemision.setDate(new Date());
            txt_direccion_origen.setText("");
            txt_tmpanexo.setText("");
            txt_CodCliente.setText("");
            txt_tmpruc.setText("");
            txt_tipocambio.setText("");

            if (mode == INSERT && getCboItemServicio().getItemCount() > 0) {
            }


            cbo_idmoneda.setSelectedIndex(cbo_idmoneda.getItemCount() > 0 ? 0 : -1);

            mdl_servicio_transporte.clearTable();
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }

    @Override
    public String executeInsert() {
        try {
            DAOServicioTransporte regla = new DAOServicioTransporte(path);

            ArrayList<ContaItem> lista;
            lista = mdl_servicio_transporte.getData();
            cab.setMIgv(Double.parseDouble(txt_igv.getText()));
            cab.setMonto(Double.parseDouble(txt_total.getText()));
            cab.setIdUsuario(usuario.getId_usuario());
            cab.setIdEstado("003");
            cab.setIdAnexoEmpresaTransportista(xEmpresaTransportista.get(cbo_idempresatransportista.getSelectedIndex() - 1).toString());
            cab.setAnexoTransportista(cbo_idempresatransportista.getSelectedItem().toString());
            cab.setIdItemServicio(xItemServicio.get(cboItemServicio.getSelectedIndex()).getId_item().toString());
            String res = regla.insertarServicioTransporte(cab, lista, "I");
            if (res.equals("CORRECTO")) {
                JOptionPane.showMessageDialog(null, "Servicio de Transporte registrado correctamente");
            }
            return "";
        } catch (Exception ex) {
            JOptionPane.showMessageDialog(this, ex.toString());
        }

        orden_compra = null;
        return "";
    }
    ContaCab cab = new ContaCab();

    @Override
    public void focusGained(FocusEvent e) {
        if (e.getSource() == ((JTextFieldDateEditor) dc_fechaemision.getDateEditor())) {
            ((JTextFieldDateEditor) dc_fechaemision.getDateEditor()).selectAll();
        }


        if (e.getComponent() == txt_rendimiento_tonelada) {
            txt_rendimiento_tonelada.selectAll();
        }

        if (e.getComponent() == txt_peso_unidad) {
            txt_peso_unidad.selectAll();
        }

    }

    @Override
    public void keyPressed(KeyEvent e) {
        if (e.getKeyChar() == '\n') {

            /*
             * if(e.getSource() == getCbo_idtipomovimiento()) {
             * cbo_serie.requestFocus(); }
             */




            if (e.getSource() == chk_seleccionar) {
                setFocusAndClick();
            }
        }

        if (e.getKeyCode() == KeyEvent.VK_F6) {
            chk_seleccionar.requestFocus();
            chk_seleccionar.doClick();
        }

        if (e.getKeyCode() == KeyEvent.VK_F5) {
            btn_buscardocumento.requestFocus();
            btn_buscardocumento.doClick();
        }

        if (e.getKeyCode() == KeyEvent.VK_ESCAPE) {
            dispose();
            doDefaultCloseAction();
        }
    }

    @Override
    public boolean isRegisterValid() {
        JTextField txt = new JTextField();
        getCboItemServicio().setBorder(txt.getBorder());
        dc_fechaemision.setBorder(new JDateChooser().getBorder());
        tabb_ordencompra.setBorder(txt.getBorder());


        return true;
    }
    String codigo;

    @Override
    public boolean loadRegister() {
        try {
            ContaCab m = new ContaCab();
            m.setIdMovimiento(rowSelection.getSelectedValue(0).toString());
            codigo = rowSelection.getSelectedValue(0).toString();
            m.setFInicial(DateTime.format(1901, 0, 1));
            m.setFFinal(DateTime.format(1901, 0, 1));

            LogicServicioTransporte regla = new LogicServicioTransporte(path);
            //        List<ContaCab> reg = null;
            List<ContaItem> reg = regla.listarServicioDet(m.getIdMovimiento());

            if (reg.isEmpty()) {
                return false;
            } else {
                if (mode == ANULAR || mode == CLONE) {
                    tbl_ordencompra.setEnabled(false);
                    chkIGV.setEnabled(false);
                }
                if (reg != null) {
                    ContaCab cab = reg.get(0).getContacab();
//            mdl_servicio_transporte.clearTable();
                    chk_seleccionar.setSelected(false);
                    chk_seleccionar.setSelected(true);

                    txt_tmpanexo.setText(cab.getAnTmpanexo());
                    txt_tmpruc.setText(cab.getRucempresa());
                    txt_direccion_origen.setText(cab.getProveedorDireccion());
                    cbo_idempresatransportista.setSelectedItem(cab.getAnexoTransportista());
                    chk_seleccionar.requestFocus();
                    Double cant = 0.0;
                    Double igv = 0.0;
                    Double afecto = 0.0;
                    try {
                        mdl_servicio_transporte.agregarVectorRegContaItem(reg);
                        mdl_servicio_transporte.fireTableDataChanged();
                        igv = cab.getMIgv();
                        txt_total.setText(String.valueOf(cab.getMonto()));
                        txt_afecto.setText(String.valueOf(cab.getMonto() - cab.getMIgv()));
                        txt_igv.setText(String.valueOf(cab.getMIgv()));
                        if (igv > 0) {
                            chkIGV.setSelected(true);
                        }
                    } catch (Exception e) {
                        JOptionPane.showMessageDialog(this, e.toString());
                    }
                }
                chk_seleccionar.setSelected(true);

                return true;
            }
        } catch (Exception ex) {
            JOptionPane.showMessageDialog(this, ex.toString());
        }
        return true;
    }

    public void cargarTipoMovimiento(String codTipoMov) {
        if (xItemServicio != null && !codTipoMov.equals("")) {
            for (int i = 0; i < xItemServicio.size(); i++) {
                if (xItemServicio.get(i).getId_item().equals(codTipoMov)) {
                    getCboItemServicio().setSelectedIndex(i);
                    break;
                }
            }
        }
    }

    public void cargarEmpresaTransportista(String codEmpresaTransportista) {
        if (xEmpresaTransportista != null && !codEmpresaTransportista.equals("")) {
            for (int i = 0; i < xEmpresaTransportista.size(); i++) {
                if (xEmpresaTransportista.get(i).getIdAnexo().equals(codEmpresaTransportista)) {
                    cbo_idempresatransportista.setSelectedIndex(i + 1);
                    break;
                }
            }
        }
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

    @Override
    public boolean executeDelete() {
        try {
            RnRegContaCab regla = new RnRegContaCab(path);

            ContaCab m = new ContaCab();
            m.setIdMovimiento(txt_direccion_origen.getText().trim());
            m.setIdMovimientoDestino(txt_idmovimientodestino.getText().trim());
            m.setIdUsuario(usuario.getId_usuario());

            //INGRESO POR ORDEN DE COMPRA
            if (xItemServicio.get((getCboItemServicio().getSelectedIndex())).getId_item().equals("001")) {
                return regla.eliminarIngresoOrdenCompra(m);
            } //INGRESO POR INVENTARIO INICIAL

        } catch (Exception ex) {
            ex.printStackTrace();
            cuadro.CuadroAviso("Error al eliminar documento", JOptionPane.ERROR_MESSAGE);
            return false;
        } finally {
            try {
                (new LogicStock(path)).regularizarStock(Main.anio);
                System.out.println(Main.anio);
            } catch (ClassNotFoundException ex) {
                System.err.println(ex.getLocalizedMessage());
            } catch (InstantiationException ex) {
                System.err.println(ex.getLocalizedMessage());
            } catch (IllegalAccessException ex) {
                System.err.println(ex.getLocalizedMessage());
            } catch (Exception ex) {
                System.err.println(ex.getLocalizedMessage());
            }
        }
        return false;

    }

    @Override
    public void setRegisterEnabled(boolean e) {

        chk_seleccionar.setEnabled(e);
        getCboItemServicio().setEnabled(e);
        btn_buscardocumento.setEnabled(e);
        cbo_idempresatransportista.setEnabled(e);
        btn_Agregar.setEnabled(e);
        btn_Quitar.setEnabled(e);
        dc_fechaemision.setEnabled(e);
    }

    @Override
    public void setRegisterEditable(boolean e) {
        tbl_ordencompra.setColumnEditable(0, e);
        tbl_ordencompra.setColumnEditable(10, e);

    }

    @Override
    public void focusLost(FocusEvent e) {



        if (e.getSource() == txt_rendimiento_tonelada && txt_rendimiento_tonelada.getText().trim().length() == 0) {
            txt_rendimiento_tonelada.setText("0.0");
        }

        if (e.getSource() == txt_peso_unidad && txt_peso_unidad.getText().trim().length() == 0) {
            txt_peso_unidad.setText("0.0");
        }


    }

    @Override
    public void keyReleased(KeyEvent e) {
    }

    @Override
    public void showMessagePrint(String codigo) {
        try {
            Reporte report = new Reporte(path);
            report.generarReporte("Ingreso", codigo, "", "", "", "", "", true, false, "Reporte Servicio Transporte");
        } catch (Exception ex) {
            JOptionPane.showMessageDialog(this, ex.toString());
        }
    }

    @Override
    public boolean executeAnular() {
        try {
            LogicServicioTransporte regla = new LogicServicioTransporte(path);
            String res = regla.anularServicio(codigo, usuario.getId_usuario());
            JOptionPane.showMessageDialog(this, res);
            tbl_ordencompra.setEnabled(false);
            chkIGV.setEnabled(false);
            return true;

        } catch (Exception ex) {
            System.err.println(ex.getLocalizedMessage());
            JOptionPane.showMessageDialog(null, ex.getMessage());
            return false;
        }
    }

    @Override
    public void mouseClicked(MouseEvent e) {
    }

    @Override
    public String executeUpdate() {
        RnRegContaCab regla = new RnRegContaCab(path);


        ItemObject itAlmacen = null;


        ContaCab m = new ContaCab();

        m.setIdMovimiento(txt_direccion_origen.getText().trim());
        m.setIdEmpresa(usuario.getCodempresa());
        m.setIdAlmacen(itAlmacen.getId());
        m.setIdTipoDoc("NI");
        m.setAnIdanexo(txt_CodCliente.getText().toString().trim());
        m.setIdMoneda(cbo_idmoneda.getSelectedIndex() > 0 ? xmoneda.get(cbo_idmoneda.getSelectedIndex() - 1).getIdMoneda() : "");
        m.setMTipoCambio(txt_tipocambio.getText().toString().trim().equals("") ? 0.0 : Double.valueOf(txt_tipocambio.getText().toString().trim()));
        m.setMDescuento(Double.valueOf(txt_descuento.getText().toString().trim()));
        m.setMAfecto(Double.valueOf(txt_afecto.getValue().toString().trim()));
        m.setMNoafecto(Double.valueOf(txt_noafecto.getValue().toString().trim()));
        m.setMIgv(Double.valueOf(txt_igv.getText().toString().trim()));
        m.setMonto(Double.valueOf(txt_monto.getValue().toString().trim()));
        m.setFEmision(dc_fechaemision.getDate());

        m.setMovDet(mdl_servicio_transporte.getData());
        m.setIdUsuario(usuario.getId_usuario());
        m.setIdAnexoEmpresaTransportista(cbo_idempresatransportista.getSelectedIndex() > 0 ? xEmpresaTransportista.get(cbo_idempresatransportista.getSelectedIndex() - 1).getIdAnexo() : "");

        //return regla.modificarIngresoCompraMercaderia(m);
        return "";

    }

    @Override
    @SuppressWarnings({"unchk_seleccionared", "unchecked", "unchecked"})
    public void setValueSearch(Object objeto, Component comp) {
        try {
            if (comp == btn_buscardocumento) {
                ContaCab obj = (ContaCab) objeto;
                cab = (ContaCab) objeto;
                cargardetalleGuia(obj);
//                if (xItemServicio.get((getCboItemServicio().getSelectedIndex())).getId_item().equals("001")) {
//                    cargarOrdenCompra(objeto.toString(), "", "", usuario.getCodpuntoventa());
//                } 
            }
        } catch (Exception ex) {
            ex.printStackTrace();
            cuadro = new CuadroMensaje(usuario);
            cuadro.CuadroAviso("Error al buscar documento", JOptionPane.ERROR_MESSAGE);
        }

    }

    public void cargardetalleGuia(
            ContaCab regconta) {
//        rn_RegContaCab regla = new rn_RegContaCab(path);
        LogicServicioTransporte logica = new LogicServicioTransporte(path);
        //List<ContaCab> reg = regla.listarOrdenCompra(codOrdenCompra, "", serie, preimpreso, "", codPuntoVenta, "X", frm.getAnio());

        if (regconta != null) {
//            mdl_servicio_transporte.clearTable();
            chk_seleccionar.setSelected(false);
            chk_seleccionar.setSelected(true);

            txt_tmpanexo.setText(regconta.getAnTmpanexo());
            txt_tmpruc.setText(regconta.getAnTmpruc());
            txt_direccion_origen.setText(regconta.getProveedorDireccion());
            cbo_idempresatransportista.setSelectedItem(regconta.getAnexoTransportista());
            chk_seleccionar.requestFocus();
            List lista = null;
            try {
                lista = logica.listarDetalleGuia(regconta.getIdMovimiento());
                mdl_servicio_transporte.agregarVectorRegContaItem(lista);
                mdl_servicio_transporte.fireTableDataChanged();
            } catch (Exception e) {
                JOptionPane.showMessageDialog(this, e.toString());
            }
        }
    }

    @Override
    public void actionPerformed(ActionEvent e) {
        /*
         * if(getCbo_idtipomovimiento() == e.getSource()) { if
         * (getCbo_idtipomovimiento().getItemCount() > 0) {
         * setFormato(xtipomovimiento.get(getCbo_idtipomovimiento().getSelectedIndex()).getId_item());
         * } }
         */
        /*
         * if(cbo_idtipodocref == e.getSource())
         * if(cbo_idtipodocref.getItemCount()>0)
         * setFormato(xtipomovimiento.get((getCbo_idtipomovimiento().getSelectedIndex())).getId_item());
         */


        if (btn_buscardocumento == e.getSource()) {
            BuscarGuiaRemisionPDU buscar_oc = new BuscarGuiaRemisionPDU(frm, this, path);
            buscar_oc.cargarTabla(usuario.getCodempresa(), usuario.getCodlocalidad(), usuario.getCodpuntoventa(), btn_buscardocumento, 0);
        }
        if (chkIGV == e.getSource()) {
            if (chkIGV.isSelected()) {
                double total = (Math.rint(mdl_servicio_transporte.getTotal() * 1000) / 1000);
                txt_total.setText(String.valueOf(total));
                txt_monto.setText(String.valueOf(total));
                txt_igv.setText(String.valueOf(total * 0.18));
                txt_afecto.setText(String.valueOf(total - total * 0.18));
                txt_noafecto.setText("0");
            } else {
                txt_igv.setText("0");
            }
        }

    }

    @Override
    public void mouseReleased(MouseEvent e) {
    }

    @Override
    public void valueChanged(ListSelectionEvent e) {
        if (!e.getValueIsAdjusting()) {
        }
    }

    private void cargarTablas() {
    }

    @Override
    public void tableChanged(TableModelEvent e) {
        double total = (Math.rint(mdl_servicio_transporte.getTotal() * 1000) / 1000);
        txt_total.setText(String.valueOf(total));
        txt_monto.setText(String.valueOf(total));
        Boolean bol = chkIGV.isSelected();
        if (chkIGV.isSelected()) {
            txt_igv.setText(String.valueOf(total * 0.18));
        }
        txt_afecto.setText(String.valueOf(total - total * 0.18));
        txt_noafecto.setText("0");
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
    public void mousePressed(MouseEvent e) {
    }

    @Override
    public void mouseEntered(MouseEvent e) {
    }

    @Override
    public void mouseExited(MouseEvent e) {
    }
    private static final Logger LOG = Logger.getLogger(UiRegisterServicioTransporte.class.getName());

    private JComboBox getCboItemServicio() {
        if (cboItemServicio == null) {
            cboItemServicio = new JComboBox();
            cboItemServicio.setBounds(125, 5, 240, 20);
            cboItemServicio.setFont(new Font(Font.SANS_SERIF, 0, 9));
            cboItemServicio.addActionListener(new ActionListener() {
                @Override
                public void actionPerformed(ActionEvent arg0) {
                    if (cboItemServicio.getItemCount() > 0) {
                    }
                }
            });
            cboItemServicio.addKeyListener(new KeyAdapter() {
                @Override
                public void keyPressed(KeyEvent e) {
                    if (e.getKeyCode() == KeyEvent.VK_ENTER) {
                    }
                }
            });
        }
        return cboItemServicio;
    }

    private JButton getBtn_buscardocumento() {
        if (btn_buscardocumento == null) {
            btn_buscardocumento = new JButton("Buscar Guia", gif.SEARCH16);
            btn_buscardocumento.setBounds(470, 5, 120, 20);
            btn_buscardocumento.setMnemonic('B');
            btn_buscardocumento.setOpaque(false);
            btn_buscardocumento.setIconTextGap(10);
            btn_buscardocumento.setToolTipText("Buscar Documento");
            btn_buscardocumento.setHorizontalAlignment(SwingConstants.LEFT);
            btn_buscardocumento.setContentAreaFilled(true);
            btn_buscardocumento.setBorderPainted(true);
            btn_buscardocumento.setFocusable(true);
            btn_buscardocumento.setFocusPainted(false);
            btn_buscardocumento.addFocusListener(this);
            btn_buscardocumento.addActionListener(this);
            btn_buscardocumento.addKeyListener(this);
        }
        return btn_buscardocumento;
    }

    private JTextField getTxtDireccionOrigen() {
        if (txt_direccion_origen == null) {
            txt_direccion_origen = new JTextField();
            txt_direccion_origen.setBounds(125, 65, 190, 20);
            txt_direccion_origen.setEditable(false);
        }
        return txt_direccion_origen;
    }

    private JTextField getTxt_tmpanexo() {
        if (txt_tmpanexo == null) {
            txt_tmpanexo = new JTextField();
            txt_tmpanexo.setBounds(125, 35, 280, 20);
            txt_tmpanexo.addKeyListener(this);
            txt_tmpanexo.setEditable(false);
        }
        return txt_tmpanexo;
    }

    private JTextField getTxt_tmpruc() {
        if (txt_tmpruc == null) {
            txt_tmpruc = new JTextField();
            txt_tmpruc.setBounds(470, 35, 80, 20);
            txt_tmpruc.addFocusListener(this);
            txt_tmpruc.setEditable(false);
            txt_tmpruc.addKeyListener(this);
        }
        return txt_tmpruc;
    }

    private JDateChooser getDc_fechaemision() {
        if (dc_fechaemision == null) {
            dc_fechaemision = new JDateChooser("dd/MM/yyyy", "##/##/####", '_');
            dc_fechaemision.getJCalendar().addMouseListener(this);
            dc_fechaemision.getJCalendar().addFocusListener(this);
            dc_fechaemision.getJCalendar().addKeyListener(this);
            dc_fechaemision.getCalendarButton().addMouseListener(this);
            dc_fechaemision.getCalendarButton().addActionListener(this);
            dc_fechaemision.addMouseListener(this);
            dc_fechaemision.addKeyListener(this);
            dc_fechaemision.addFocusListener(this);
        }
        return dc_fechaemision;
    }
}

