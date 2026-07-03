package com.softcommerce.views.uiregisterventadirecta;


import com.softcommerce.formularios.*;
import com.softcommerce.reportes.jheyson.RptVenta;
import com.softcommerce.beans.Anexo;
import com.softcommerce.beans.BeanAlmacen;
import com.softcommerce.beans.BeanAnexo;
import com.softcommerce.beans.BeanCondicionPago;
import com.softcommerce.beans.BeanCotizacionCab;
import com.softcommerce.beans.BeanCotizacionDet;
import com.softcommerce.beans.BeanEstadoDocumento;
import com.softcommerce.beans.BeanItem;
import com.softcommerce.beans.BeanMarca;
import com.softcommerce.beans.BeanMoneda;
import com.softcommerce.beans.BeanPedidoCab;
import com.softcommerce.beans.BeanPedidoContacto;
import com.softcommerce.beans.BeanPedidoDet;
import com.softcommerce.beans.BeanPrecioItem;
import com.softcommerce.beans.BeanPuntoVenta;
import com.softcommerce.beans.BeanRegcontaCab;
import com.softcommerce.beans.BeanRegcontaItem;
import com.softcommerce.beans.BeanRptaVenta;
import com.softcommerce.beans.BeanStock;
import com.softcommerce.beans.BeanTipoAnexo;
import com.softcommerce.beans.BeanTipoCambio;
import com.softcommerce.beans.BeanTipoDocVenta;
import com.softcommerce.beans.BeanTrabajador;
import com.softcommerce.beans.BeanUnidadMedida;
import com.softcommerce.beans.BeanVendedor;
import com.softcommerce.beans.BeanVentaConversion;
import com.softcommerce.beans.ContaCab;
import com.softcommerce.beans.TipoOperacion;
import com.softcommerce.beans.Usuario;
import com.softcommerce.beans.UsuarioCorrelativo;
import com.softcommerce.beans.Zona;
import com.softcommerce.beans.sunat.ResultSfs;
import com.softcommerce.comboboxmodel.ComboModelAlmacen;
import com.softcommerce.comboboxmodel.ComboModelPrecio;
import com.softcommerce.compras.formularios.FormComprasPorItem;
import com.softcommerce.datasource.DataSourceVenta;
import com.softcommerce.enums.AuxiliarEnum;
import com.softcommerce.enums.MonedaEnum;
import com.softcommerce.enums.TipoDocVentaEnum;
import com.softcommerce.general.controles.CButton;
import com.softcommerce.general.controles.CLabel;
import com.softcommerce.general.controles.CTable;
import com.softcommerce.general.controles.CuadroMensaje;
import com.softcommerce.general.controles.DoubleDocument;
import com.softcommerce.general.controles.IntegerDocument;
import com.softcommerce.general.controles.PopupItemCompra;
import com.softcommerce.general.controles.Register;
import com.softcommerce.general.controles.UpperCaseDocument;
import com.softcommerce.general.controles.UpperCaseNumberDocument;
import com.softcommerce.general.herramientas.CFunciones;
import com.softcommerce.general.herramientas.CTableFx;
import com.softcommerce.general.herramientas.DateTime;
import com.softcommerce.general.sunat.ConvertDataSunat;
import com.softcommerce.general.tablas.PedidoContactoTableModel;
import com.softcommerce.general.tablas.TableModelItemAlmacen;
import com.softcommerce.general.tablas.TableModelItemVenta;
import com.softcommerce.general.tablas.TableModelRegcontaItem;
import com.softcommerce.gui.FormConversion;
import com.softcommerce.iconos.Gif;
import com.softcommerce.inputvalidator.PrecioMinimo;
import com.softcommerce.logic.LogicConfiguracion;
import com.softcommerce.reglasnegocio.RnCotizacionCab;
import com.softcommerce.reglasnegocio.RnPedidoCab;
import com.softcommerce.reglasnegocio.RnRegconta;
import com.softcommerce.reglasnegocio.RnVendedor;
import com.softcommerce.reglasnegocio.RnAnexo;
import com.softcommerce.reglasnegocio.RnConsultas;
import com.softcommerce.reglasnegocio.RnCorrelativo;
import com.softcommerce.reglasnegocio.RnItem;
import com.softcommerce.reglasnegocio.RnStock;
import com.softcommerce.reglasnegocio.RnTipoCambio;
import com.softcommerce.report.ConvertNumberToLetter;
import com.softcommerce.util.editor.CellEditorCbAlmacen;
import com.softcommerce.util.render.CellRenderer;
import com.softcommerce.util.editor.ComboBoxEditorPrecio;
import com.softcommerce.util.Constans;
import com.softcommerce.util.ExceptionHandler;
import com.softcommerce.util.Exportar;
import com.softcommerce.util.FormatObject;
import com.softcommerce.util.combo.LoadCombo;
import com.softcommerce.util.LoadDataGenerica;
import com.softcommerce.util.Propiedad;
import com.softcommerce.util.combo.SingletonCombo;
import com.softcommerce.util.Util;
import com.softcommerce.util.UtilCenter;
import com.softcommerce.util.UtilDate;
import com.softcommerce.util.VerificarEnteroMayorCero;
import com.softcommerce.util.VerificarEntreFechas;
import com.softcommerce.util.combo.LoadComboItem;
import com.softcommerce.util.singleton.SingletonTipoDocVenta;
import com.toedter.calendar.JDateChooser;
import com.toedter.calendar.JTextFieldDateEditor;
import java.awt.BorderLayout;
import java.awt.Color;
import java.awt.Component;
import java.awt.Cursor;
import java.awt.Dimension;
import java.awt.FlowLayout;
import java.awt.Font;
import java.awt.GridBagConstraints;
import java.awt.GridBagLayout;
import java.awt.HeadlessException;
import java.awt.Insets;
import java.awt.Toolkit;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.FocusAdapter;
import java.awt.event.FocusEvent;
import java.awt.event.FocusListener;
import java.awt.event.ItemEvent;
import java.awt.event.ItemListener;
import java.awt.event.KeyAdapter;
import java.awt.event.KeyEvent;
import java.awt.event.KeyListener;
import java.awt.event.MouseEvent;
import java.awt.event.MouseListener;
import java.beans.PropertyChangeEvent;
import java.beans.PropertyChangeListener;
import java.beans.PropertyVetoException;
import java.math.BigDecimal;
import java.math.BigInteger;
import java.math.RoundingMode;
import java.text.NumberFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import javax.swing.BorderFactory;
import javax.swing.JButton;
import javax.swing.JCheckBox;
import javax.swing.JComboBox;
import javax.swing.JComponent;
import javax.swing.JDialog;
import javax.swing.JInternalFrame;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import javax.swing.JScrollPane;
import javax.swing.JTabbedPane;
import javax.swing.JTable;
import javax.swing.JTextField;
import javax.swing.JToolBar;
import javax.swing.KeyStroke;
import javax.swing.ListSelectionModel;
import javax.swing.RowFilter;
import javax.swing.SwingConstants;
import javax.swing.border.Border;
import javax.swing.border.LineBorder;
import javax.swing.border.TitledBorder;
import javax.swing.event.ChangeEvent;
import javax.swing.event.ChangeListener;
import javax.swing.event.DocumentEvent;
import javax.swing.event.DocumentListener;
import javax.swing.event.ListSelectionEvent;
import javax.swing.event.ListSelectionListener;
import javax.swing.event.TableModelEvent;
import javax.swing.event.TableModelListener;
import javax.swing.table.TableRowSorter;
import javax.swing.text.JTextComponent;
import net.sf.jasperreports.engine.JRParameter;
import java.net.URL;
import java.sql.SQLException;
import java.util.logging.Level;
import org.apache.log4j.Logger;

public class UiRegisterVentaDirecta
        extends JInternalFrame
        implements InterUiRegisterVentaDirecta, KeyListener, ActionListener, ListSelectionListener, MouseListener, FocusListener,
        TableModelListener, ItemListener, DocumentListener, ChangeListener, PropertyChangeListener {

    protected final Main frm;
    protected JComboBox cboPrecio;
    protected JComboBox cboMoneda;
    protected CButton btn_guardar;
    protected CButton btnNuevo;
    protected JButton btn_buscar;
    protected JButton btnRefrescar;
    protected CButton btn_agregar;
    protected CButton btn_quitar;
    protected JTable tbl_venta;
    protected TableModelRegcontaItem mdl_venta;
    protected CTable tbl_producto;
    protected TableModelItemVenta mdl_producto;
    protected TableRowSorter<TableModelItemVenta> modeloOrdenadoProducto;
    protected CTable tbl_almacen;
    protected TableModelItemAlmacen mdl_almacen;
    protected JTextField txt_descripcion;
    protected JTextField txt_iditem;
    protected JTextField txtMaximoProductos;
    protected JTextField txtAfecto;
    protected JTextField txtNoafecto;
    protected JTextField txtIgv;
    protected JTextField txtDescuento;
    protected JTextField txtMonto;
    protected JTextField txtPercepcion;
    protected JTextField txt_cantidad;
    protected final Usuario usuario;
    protected final URL path;
    protected JTextField txtCostoCompra;
    protected PrecioMinimo validPrecio;
    protected JCheckBox checkAutorizado;
    protected ComboBoxEditorPrecio editorPrecio;
    protected ComboModelPrecio cboModelPrecio;
    protected final CuadroMensaje cuadro;
    protected JTextField txtPesoTotal;
    protected Map<String, BeanPrecioItem> mapPrecio;
    protected JCheckBox chkCotizacion;
    protected JCheckBox chkPedido;
    protected JCheckBox chkAgRetencion;
    protected JButton btnCotizacion;
    protected JButton btnCopia;
    protected BeanCotizacionCab beanCotizacion;
    protected BeanPedidoCab beanPedido;
    protected BigDecimal porcIgv;
    protected int maxProd;
    protected BigDecimal paramValorBoletaDNI;
    protected BigDecimal paramValorPercepcion;
    protected int numeroDecimales;
    protected String idItem = "";
    protected List<BeanMoneda> xMoneda;
    protected JTabbedPane tabb;
    protected JComboBox cboTipoDocumento;
    protected JComboBox cboSerie;
    protected JTextField txt_preimpreso;
    protected JDateChooser dc_femision;
    protected JTextField txt_diaspago;
    protected JDateChooser dc_fvencimiento;
    protected JComboBox cboCondPago;
    protected JTextField txt_tipocambio;
    protected JComboBox cbo_moneda;
    protected JComboBox cbo_cancelaen;
    protected JComboBox cbo_mediopago;
    protected JCheckBox chk_publicogeneral;
    protected JButton btn_nuevocliente;
    protected JTextField txt_idclientereal;
    protected JTextField txtDireccionReal;
    protected JTextField txtCorreoCliente;
    protected JTextField txt_direccionficticio;
    protected JTextField txt_idclienteficticio;
    protected JComboBox cbo_clienteficticio;
    protected JTextField txt_rucficticio;
    protected JButton btn_buscarcliente;
    protected Gif gif;
    protected JCheckBox chk_promocion;
    protected JTextField txt_cliente;
    protected JTextField txt_rucreal;
    protected JTextField txt_recibo;
    protected JTextField txt_vuelto;
    protected JButton btn_cancelar;
    protected JButton btnGuardar;
    protected JComboBox cbo_idvendedor;
    protected JTextField txt_igv;
    protected JTextField txt_idtrabajador;
    protected JTextField txt_trabajador;
    protected JTextField txt_total;
    protected JTextField txt_valorventa;
    protected JTextField txt_descuento;
    protected JTextField txt_afecto;
    protected JTextField txt_noafecto;
    protected JTextField txt_percepcion;
    protected JTextField txtTotalCobrar;
    protected JLabel lblTotalRetencion;
    protected JTextField txtTotalRetencion;
    protected List<BeanTipoDocVenta> xTipoDocVenta;
    protected boolean blnClickAceptar = false;
    protected int numero = -1;
    protected List<UsuarioCorrelativo> xCorrelativo;
    protected List<BeanVendedor> listaV;
    protected String idTipoOperacion;
    protected boolean flag = false;
    protected List<Anexo> lst_anexogrupo;
    protected JDateChooser dc_fdespacho;
    protected JComboBox cboModVta;
    protected JComboBox cboModDespacho;
    protected JTextField txtObser1;
    protected JTextField txtObser2;
    protected JComboBox cboDepartamento;
    protected JComboBox cboProvincia;
    protected JComboBox cboDistrito;
    protected JComboBox cboZona;
    protected JTextField txtDireccionDespacho;
    protected JButton btnAgregarContacto;
    protected JButton btnQuitarContacto;
    protected CTable tableContacto;
    protected PedidoContactoTableModel modeltableContacto;
    protected JTextField txtContacto;
    protected JTextField txtTelef;
    protected JTextField txtCorreo;
    protected List<BeanVentaConversion> listConversion = new ArrayList();
    protected JTextField txtClienteTemporal;
    protected final JPanel pnlEastMaxRefresh = new JPanel();
    protected final Logger logger = Logger.getLogger(UiRegisterVentaDirecta.class);
    protected JComboBox cboTipoOperIgv;
    protected final JLabel TIPOOPERIGV = new JLabel("NORMAL");
    protected final JTextField txtMontoInafecto = new JTextField(BigDecimal.ZERO.toString());
    protected final JTextField txtMontoExonerado = new JTextField(BigDecimal.ZERO.toString());
    protected TipoOperacion tipoOperacionVenta = null;
    protected BeanTipoCambio tipoCambioFecha = null;
    protected String idTipoDocCbo = "";

    public UiRegisterVentaDirecta(Main frm, String title, Usuario usuario, java.net.URL path) {
        super(title);
        cuadro = new CuadroMensaje(usuario);
        this.path = path;
        this.frm = frm;
        this.usuario = usuario;
        inicialize();
        initListener();
    }

    protected void inicialize() {
        checkAutorizado = new JCheckBox("AUT. PRECIO");
        gif = new Gif();

        JPanel pnlPrincipal = new JPanel();
        pnlPrincipal.setLayout(new BorderLayout());

        tabb = new JTabbedPane();

        pnlPrincipal.add(tabb, BorderLayout.CENTER);
        tabb.add("PRODUCTOS", this.getPnlProducto());
        JScrollPane scrollCab = new JScrollPane(getPnlCab());
        tabb.add("GENERAL", scrollCab);
        tabb.add("DESPACHO", getPnlPedido());
        tabb.setEnabledAt(1, false);
        tabb.setEnabledAt(2, false);
        getContentPane().add(pnlPrincipal);
        this.configInternal();
    }

    protected JPanel getPnlProducto() {
        JPanel pnl = new JPanel();
        pnl.setLayout(new BorderLayout());

        pnl.add(this.getPnlProductoNorth(), BorderLayout.NORTH);
        pnl.add(this.getPnlProductoSouth(), BorderLayout.SOUTH);
        pnl.add(this.getPnlProductoCenter(), BorderLayout.CENTER);
        return pnl;
    }

    protected JPanel getPnlProductoCenter() {
        JPanel pnlCenter = new JPanel();
        pnlCenter.setLayout(new BorderLayout());
        pnlCenter.setBackground(new Color(245, 245, 245));

        pnlCenter.add(this.getPnlProductoTable(), BorderLayout.CENTER);
        pnlCenter.add(this.getPnlProductoAlmacen(), BorderLayout.EAST);
        return pnlCenter;
    }

    protected JPanel getPnlProductoSouth() {
        JPanel pnlSouth = new JPanel();
        pnlSouth.setLayout(new BorderLayout());
        pnlSouth.setBackground(new Color(245, 245, 245));

        pnlSouth.add(this.getPnlVenta(), BorderLayout.CENTER);

        pnlSouth.add(this.getPnlVenta(), BorderLayout.CENTER);
        return pnlSouth;
    }

    protected JPanel getPnlProductoNorth() {
        JPanel pnlNorth = new JPanel();
        pnlNorth.setLayout(new BorderLayout());
        pnlNorth.setBackground(new Color(245, 245, 245));

        pnlNorth.add(this.getPnlFiltro(), BorderLayout.WEST);
        pnlNorth.add(pnlEastMaxRefresh, BorderLayout.EAST);
        return pnlNorth;
    }

    protected JPanel getPnlFiltro() {
        JPanel pnlFiltro = new JPanel();
        pnlFiltro.setLayout(new GridBagLayout());
        pnlFiltro.setBackground(new Color(245, 245, 245));

        GridBagConstraints gbc = new GridBagConstraints();
        gbc.gridx = 0;
        gbc.gridy = 0;
        gbc.insets = new Insets(2, 2, 2, 2);

        JLabel lbl_CodigoAlterno = new JLabel("COD");
        lbl_CodigoAlterno.setFont(new Font("Helvetica", Font.BOLD, 13));
        pnlFiltro.add(lbl_CodigoAlterno, gbc);

        txt_iditem = new JTextField();
        txt_iditem.addKeyListener(this);
        txt_iditem.setColumns(5);
        txt_iditem.addFocusListener(this);
        txt_iditem.setDocument(new IntegerDocument(6));
        txt_iditem.setFont(new Font("Helvetica", Font.BOLD, 13));
        gbc.gridx = 1;
        pnlFiltro.add(txt_iditem, gbc);

        JLabel lblItem = new JLabel("DESC");
        lblItem.setFont(new Font("Helvetica", Font.BOLD, 13));
        gbc.gridx = 2;
        pnlFiltro.add(lblItem, gbc);

        txt_descripcion = new JTextField();
        txt_descripcion.setFont(new Font("Helvetica", Font.BOLD, 13));
        txt_descripcion.setDocument(new UpperCaseNumberDocument());
        txt_descripcion.addFocusListener(this);
        txt_descripcion.addKeyListener(this);
        txt_descripcion.setColumns(15);
        gbc.gridx = 3;
        pnlFiltro.add(txt_descripcion, gbc);

        JLabel lblMarca = new JLabel("MONEDA");
        lblMarca.setFont(new Font("Helvetica", Font.BOLD, 13));
        gbc.gridx = 4;
        pnlFiltro.add(lblMarca, gbc);

        cboMoneda = new JComboBox();
        cboMoneda.setFont(new Font("Helvetica", Font.BOLD, 13));
        gbc.gridx = 5;
        pnlFiltro.add(cboMoneda, gbc);

        btn_buscar = new JButton(gif.BUSCAR);
        btn_buscar.setFont(new Font("Helvetica", Font.BOLD, 13));
        btn_buscar.setHorizontalTextPosition(SwingConstants.LEFT);
        btn_buscar.setToolTipText("Buscar");
        btn_buscar.setContentAreaFilled(true);
        btn_buscar.setBorderPainted(true);
        btn_buscar.setFocusable(true);
        btn_buscar.setFocusPainted(false);
        btn_buscar.addActionListener(this);
        btn_buscar.addKeyListener(this);
        btn_buscar.registerKeyboardAction(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                btn_agregar.requestFocus();
            }
        }, KeyStroke.getKeyStroke(KeyEvent.VK_ENTER, 0, false), JComponent.WHEN_FOCUSED);
        gbc.gridx = 6;
        pnlFiltro.add(this.btn_buscar, gbc);

        gbc.gridx = 7;
        gbc.gridx = 8;
        gbc.gridx = 9;
        btnRefrescar = new JButton(gif.REFRESH16);
        btnRefrescar.setToolTipText("Refrescar");
        btnRefrescar.setFont(new Font("Helvetica", Font.BOLD, 13));
        btnRefrescar.setHorizontalTextPosition(SwingConstants.LEFT);
        btnRefrescar.setOpaque(false);
        btnRefrescar.setFocusPainted(false);
        btnRefrescar.setContentAreaFilled(true);
        btnRefrescar.setBorderPainted(true);
        JLabel lblMaxProd = new JLabel("Max Productos");
        txtMaximoProductos = new JTextField();
        txtMaximoProductos.setColumns(2);
        txtMaximoProductos.addFocusListener(this);
        txtMaximoProductos.setDocument(new IntegerDocument(2));
        txtMaximoProductos.setFont(new Font("Helvetica", Font.BOLD, 13));
        pnlEastMaxRefresh.add(lblMaxProd);
        pnlEastMaxRefresh.add(txtMaximoProductos);
        pnlEastMaxRefresh.add(btnRefrescar);
        JPanel pnlCenter = new JPanel();
        pnlCenter.setLayout(new BorderLayout());
        pnlCenter.setBackground(new Color(245, 245, 245));
        JPanel pnlProducto = new JPanel();
        pnlProducto.setLayout(new BorderLayout());
        pnlProducto.setBackground(new Color(245, 245, 245));
        JPanel pnlAlmacen = new JPanel();
        pnlAlmacen.setLayout(new BorderLayout());
        pnlAlmacen.setBackground(new Color(245, 245, 245));

        chkCotizacion = new JCheckBox("Cotizacion");
        gbc.gridx = 7;
        pnlFiltro.add(chkCotizacion, gbc);
        chkPedido = new JCheckBox("Pedido");
        gbc.gridx = 8;
        //pnlFiltro.add(chkPedido, gbc);

        btnCotizacion = new JButton("", gif.SEARCH16);
        gbc.gridx = 9;
        btnCotizacion.setVisible(false);
        btnCotizacion.setToolTipText("Buscar Cotizacion");
        pnlFiltro.add(btnCotizacion, gbc);
        cboTipoOperIgv = new JComboBox();
        cboTipoOperIgv.addItem("NORMAL");
        cboTipoOperIgv.addItem("GRATUITA");
        cboTipoOperIgv.addItem("EXPORTACION");
        cboTipoOperIgv.addItem("EXONERADA");
        cboTipoOperIgv.addItem("INAFECTO_MUESTRA_MEDICA");
        cboTipoOperIgv.setFont(new Font("Helvetica", Font.BOLD, 13));
        gbc.gridx = 10;
        pnlFiltro.add(cboTipoOperIgv, gbc);
        btnCopia = new JButton("Buscar Venta", gif.SEARCH16);
        gbc.gridx = 11;
        btnCopia.setToolTipText("Buscar Venta");
        if (Constans.IS_COSTO_COMPRA_ITEM) {
            pnlFiltro.add(btnCopia, gbc);
        }
        return pnlFiltro;
    }

    protected JPanel getPnlVenta() {
        JPanel pnlVenta = new JPanel();
        pnlVenta.setLayout(new BorderLayout());
        pnlVenta.setOpaque(false);

        mdl_venta = new TableModelRegcontaItem();
        mdl_venta.addTableModelListener(this);
        tbl_venta = new JTable();
        tbl_venta.getTableHeader().setFont(new Font(Font.SANS_SERIF, 1, 11));
        tbl_venta.setFont(new Font("Helvetica", Font.BOLD, 14));
        tbl_venta.setModel(mdl_venta);
        tbl_venta.getSelectionModel().addListSelectionListener(this);
        tbl_venta.addFocusListener(this);
        tbl_venta.addKeyListener(this);
        tbl_venta.addMouseListener(this);
        tbl_venta.setAutoResizeMode(JTable.AUTO_RESIZE_OFF);
        tbl_venta.getColumnModel().getColumn(7).setMinWidth(0);
        tbl_venta.getColumnModel().getColumn(7).setMaxWidth(0);
        tbl_venta.getColumnModel().getColumn(11).setMinWidth(0);
        tbl_venta.getColumnModel().getColumn(11).setMaxWidth(0);
        tbl_venta.getColumnModel().getColumn(12).setMinWidth(0);
        tbl_venta.getColumnModel().getColumn(12).setMaxWidth(0);
        tbl_venta.getColumnModel().getColumn(13).setMinWidth(0);
        tbl_venta.getColumnModel().getColumn(13).setMaxWidth(0);
        tbl_venta.getColumnModel().getColumn(14).setMinWidth(0);
        tbl_venta.getColumnModel().getColumn(14).setMaxWidth(0);
        if (Constans.SWCODEBARRA) {
            tbl_venta.getColumnModel().getColumn(10).setCellRenderer(new CellEditorCbAlmacen(this.mdl_venta));
            tbl_venta.getColumnModel().getColumn(10).setCellEditor(new CellEditorCbAlmacen(this.mdl_venta));
        }
        this.configTableVenta(false);
        CTableFx.setAllColumnPreferredWidth(tbl_venta);
        tbl_venta.setSelectionMode(ListSelectionModel.SINGLE_SELECTION);
        CellRenderer CellRenderer = new CellRenderer();
        tbl_venta.setDefaultRenderer(String.class, CellRenderer);
        tbl_venta.setDefaultRenderer(BigDecimal.class, CellRenderer);
        JScrollPane scrollViewVenta = new JScrollPane(tbl_venta);
        scrollViewVenta.setPreferredSize(new Dimension(698, 220));
        pnlVenta.add(scrollViewVenta, BorderLayout.CENTER);

        pnlVenta.add(this.getPnlProductoOpciones(), BorderLayout.NORTH);
        pnlVenta.add(this.getPnlMontos(), BorderLayout.SOUTH);
        return pnlVenta;
    }

    protected JPanel getPnlMontos() {
        JPanel pnlMontos = new JPanel();
        pnlMontos.setOpaque(false);

        JLabel lblMPercepcion = new JLabel("PERCEPCION");
        lblMPercepcion.setFont(new Font(Font.SANS_SERIF, 0, 9));
        lblMPercepcion.setForeground(Color.BLACK);
        lblMPercepcion.setVisible(false);
        pnlMontos.add(lblMPercepcion);

        txtPercepcion = new JTextField();
        txtPercepcion.setHorizontalAlignment(SwingConstants.RIGHT);
        txtPercepcion.setFont(new Font(Font.SANS_SERIF, 1, 13));
        txtPercepcion.setEditable(false);
        txtPercepcion.setText("0.0");
        txtPercepcion.setVisible(false);
        pnlMontos.add(txtPercepcion);

        CLabel lblMAfecto = new CLabel("AFECTO");
        pnlMontos.add(lblMAfecto);

        txtAfecto = new JTextField();
        txtAfecto.setColumns(7);
        txtAfecto.setHorizontalAlignment(SwingConstants.RIGHT);
        txtAfecto.addKeyListener(this);
        txtAfecto.setFont(new Font(Font.SANS_SERIF, 1, 13));
        txtAfecto.setEditable(false);
        txtAfecto.setText("0.0");
        pnlMontos.add(txtAfecto);

        CLabel lblMNoAfecto = new CLabel("NO AFECTO");
        pnlMontos.add(lblMNoAfecto);

        txtNoafecto = new JTextField();
        txtNoafecto.setHorizontalAlignment(SwingConstants.RIGHT);
        txtNoafecto.setEditable(false);
        txtNoafecto.setText("0.0");
        txtNoafecto.setColumns(7);
        txtNoafecto.setFont(new Font(Font.SANS_SERIF, 1, 13));
        pnlMontos.add(txtNoafecto);

        CLabel lblMIgv = new CLabel("IGV");
        pnlMontos.add(lblMIgv);

        txtIgv = new JTextField();
        txtIgv.setHorizontalAlignment(SwingConstants.RIGHT);
        txtIgv.setEditable(false);
        txtIgv.setText("0.0");
        txtIgv.setColumns(7);
        txtIgv.setFont(new Font(Font.SANS_SERIF, 1, 13));
        pnlMontos.add(txtIgv);

        JLabel lblMDescuento = new JLabel("DESCUENTO");
        lblMDescuento.setFont(new Font(Font.SANS_SERIF, 0, 9));
        lblMDescuento.setForeground(Color.BLACK);
        lblMDescuento.setVisible(false);
        pnlMontos.add(lblMDescuento);

        txtDescuento = new JTextField();
        txtDescuento.setHorizontalAlignment(SwingConstants.RIGHT);
        txtDescuento.addKeyListener(this);
        txtDescuento.setFont(new Font(Font.SANS_SERIF, 1, 13));
        txtDescuento.setEditable(false);
        txtDescuento.setVisible(false);
        txtDescuento.setText("0.0");
        pnlMontos.add(txtDescuento);

        CLabel lblMonto = new CLabel("MONTO");
        pnlMontos.add(lblMonto);

        txtMonto = new JTextField();
        txtMonto.addKeyListener(this);
        txtMonto.setEditable(false);
        txtMonto.setText("0.0");
        txtMonto.setForeground(Color.red);
        txtMonto.setFont(new Font(Font.SANS_SERIF, 1, 13));
        txtMonto.setHorizontalAlignment(SwingConstants.RIGHT);
        txtMonto.setColumns(7);
        pnlMontos.add(txtMonto);

        CLabel lblPeso = new CLabel("PESO TOTAL");
        pnlMontos.add(lblPeso);

        txtPesoTotal = new JTextField();
        txtPesoTotal.setEditable(false);
        txtPesoTotal.setText("0.0");
        txtPesoTotal.setForeground(Color.blue);
        txtPesoTotal.setFont(new Font(Font.SANS_SERIF, 1, 13));
        txtPesoTotal.setHorizontalAlignment(SwingConstants.RIGHT);
        txtPesoTotal.setColumns(7);
        pnlMontos.add(txtPesoTotal);
        return pnlMontos;
    }

    protected JPanel getPnlProductoTable() {
        JPanel pnlProducto = new JPanel();
        pnlProducto.setLayout(new BorderLayout());
        pnlProducto.setBackground(new Color(245, 245, 245));

        mdl_producto = new TableModelItemVenta();
        modeloOrdenadoProducto = new TableRowSorter(mdl_producto);
        tbl_producto = new CTable();
        tbl_producto.getSelectionModel().addListSelectionListener(this);
        tbl_producto.addKeyListener(this);
        tbl_producto.addMouseListener(this);

        tbl_producto.getTableHeader().setFont(new Font(Font.SANS_SERIF, 1, 11));
        tbl_producto.setFont(new Font("Helvetica", Font.BOLD, 13));
        tbl_producto.setRowSorter(modeloOrdenadoProducto);
        tbl_producto.setModel(mdl_producto);
        tbl_producto.registerKeyboardAction(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                txt_cantidad.requestFocus();
            }
        }, KeyStroke.getKeyStroke(KeyEvent.VK_ENTER, 0, false), JComponent.WHEN_ANCESTOR_OF_FOCUSED_COMPONENT);

        tbl_producto.setAllColumnNoResizable();
        tbl_producto.setRendererColumnZero();
        tbl_producto.setAllTableNoEditable();
        tbl_producto.setNoVisibleColumn(4);
        tbl_producto.setNoVisibleColumn(6);
        tbl_producto.setNoVisibleColumn(9);
        tbl_producto.setNoVisibleColumn(10);
        tbl_producto.setNoVisibleColumn(11);
        tbl_producto.setNoVisibleColumn(12);
        tbl_producto.setNoVisibleColumn(13);
        tbl_producto.setNoVisibleColumn(14);
        if (!Constans.IS_ITEM_BY_CLIENTE) {
            tbl_producto.setNoVisibleColumn(16);
        }
        tbl_producto.setAllColumnPreferredWidthNvo(5);

        PopupItemCompra popupItem = new PopupItemCompra();
        popupItem.setFrmVenta(this);
        tbl_producto.setComponentPopupMenu(popupItem);

        JScrollPane scrollViewProducto = new JScrollPane(tbl_producto);
        scrollViewProducto.setPreferredSize(new Dimension(600, 100));
        pnlProducto.add(scrollViewProducto, BorderLayout.CENTER);
        return pnlProducto;
    }

    protected JPanel getPnlProductoAlmacen() {
        JPanel pnlAlmacen = new JPanel();
        pnlAlmacen.setLayout(new BorderLayout());
        pnlAlmacen.setBackground(new Color(245, 245, 245));

        mdl_almacen = new TableModelItemAlmacen();
        tbl_almacen = new CTable();
        tbl_almacen.getTableHeader().setFont(new Font(Font.SANS_SERIF, 1, 11));
        tbl_almacen.setFont(new Font("Helvetica", Font.BOLD, 13));
        tbl_almacen.setModel(mdl_almacen);
        tbl_almacen.getSelectionModel().addListSelectionListener(this);
        tbl_almacen.addKeyListener(this);
        tbl_almacen.addMouseListener(this);
        tbl_almacen.setAllColumnNoResizable();
        tbl_almacen.setAllTableNoEditable();
        CTableFx.alignRightColumnTable(tbl_almacen, 1);
        tbl_almacen.setAllColumnPreferredWidthNvo(5);
        tbl_almacen.registerKeyboardAction(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                procesoAgregar();
            }
        }, KeyStroke.getKeyStroke(KeyEvent.VK_ENTER, 0, false), JComponent.WHEN_ANCESTOR_OF_FOCUSED_COMPONENT);

        JScrollPane scrollViewAlmacen = new JScrollPane(tbl_almacen);
        scrollViewAlmacen.setPreferredSize(new Dimension(400, 100));

        pnlAlmacen.add(scrollViewAlmacen, BorderLayout.CENTER);
        return pnlAlmacen;
    }

    protected JPanel getPnlProductoOpciones() {
        return null;
    }

    protected JPanel getPnlProductoValores() {
        return null;
    }

    protected void configInternal() {
        setMaximizable(true);
        setResizable(true);
        setClosable(true);
        setSize(1020, 545);
        setIconifiable(true);
        setLocation(((Toolkit.getDefaultToolkit().getScreenSize().width - getSize().width) / 2),
                (Toolkit.getDefaultToolkit().getScreenSize().height - getSize().height) / 20);
    }

    protected JPanel getPnlPedido() {
        JPanel pnlPrinc = new JPanel();
        pnlPrinc.setLayout(new BorderLayout());
        JPanel pnlNorth = new JPanel();
        JPanel pnlWest = new JPanel();
        pnlNorth.setLayout(new BorderLayout());
        pnlWest.setLayout(new BorderLayout());
        pnlPrinc.add(pnlNorth, BorderLayout.NORTH);
        pnlNorth.add(pnlWest, BorderLayout.WEST);
        pnlWest.add(getPnlContactoDireccion(), BorderLayout.NORTH);
        return pnlPrinc;
    }

    protected JPanel getPnlContactoDireccion() {
        JPanel pnl = new JPanel();
        pnl.setLayout(new BorderLayout());
        pnl.add(getPnlDireccion(), BorderLayout.NORTH);
        pnl.add(getPnlContacto(), BorderLayout.CENTER);
        return pnl;
    }

    protected JPanel getPnlDireccion() {
        JPanel pnl = new JPanel();
        Border border = BorderFactory.createTitledBorder(null, "Datos de Direccion",
                TitledBorder.LEFT, TitledBorder.DEFAULT_POSITION,
                new Font("Comic Sans MS", 0, 12), Color.BLACK);
        pnl.setBorder(border);
        GridBagConstraints gbc = new GridBagConstraints();
        gbc.gridx = 0;
        gbc.gridy = 0;
        gbc.insets = new Insets(2, 2, 2, 2);
        gbc.anchor = GridBagConstraints.WEST;
        pnl.setLayout(new GridBagLayout());
        JLabel lblDepartamento = new JLabel("Departamento");
        pnl.add(lblDepartamento, gbc);
        gbc.gridx = 1;
        cboDepartamento = new JComboBox();
        pnl.add(cboDepartamento, gbc);
        gbc.gridx = 0;
        gbc.gridy = 1;
        JLabel lblProvincia = new JLabel("Provincia");
        pnl.add(lblProvincia, gbc);
        gbc.gridx = 1;
        cboProvincia = new JComboBox();
        cboProvincia.setEnabled(false);
        pnl.add(cboProvincia, gbc);
        gbc.gridx = 0;
        gbc.gridy = 2;
        JLabel lblDistrito = new JLabel("Distrito");
        pnl.add(lblDistrito, gbc);
        gbc.gridx = 1;
        cboDistrito = new JComboBox();
        cboDistrito.setEnabled(false);
        pnl.add(cboDistrito, gbc);
        gbc.gridx = 0;
        gbc.gridy = 3;
        JLabel lblZona = new JLabel("Zona");
        pnl.add(lblZona, gbc);
        gbc.gridx = 1;
        cboZona = new JComboBox();
        cboZona.setEnabled(false);
        pnl.add(cboZona, gbc);
        gbc.gridx = 0;
        gbc.gridy = 4;
        JLabel lblDireccion = new JLabel("Direccion");
        pnl.add(lblDireccion, gbc);
        gbc.gridx = 1;
        txtDireccionDespacho = new JTextField();
        txtDireccionDespacho.setColumns(25);
        txtDireccionDespacho.setDocument(new UpperCaseNumberDocument(100));
        pnl.add(txtDireccionDespacho, gbc);
        loadDepartamento();
        return pnl;
    }

    protected JPanel getPnlContacto() {
        JPanel pnl = new JPanel();
        pnl.setLayout(new BorderLayout());
        Border border = BorderFactory.createTitledBorder(null, "Datos de Contacto", TitledBorder.LEFT, TitledBorder.DEFAULT_POSITION, new Font("Comic Sans MS", 0, 12), Color.BLACK);
        pnl.setBorder(border);
        pnl.add(getPnlContactoNorth(), BorderLayout.NORTH);
        pnl.add(getPnlContactoCenter(), BorderLayout.CENTER);
        return pnl;
    }

    protected JPanel getPnlContactoCenter() {
        JPanel pnl = new JPanel();
        pnl.setLayout(new BorderLayout());
        JToolBar toolbar = new JToolBar();
        pnl.add(toolbar, BorderLayout.NORTH);
        btnAgregarContacto = new JButton("Agregar", gif.ADD16);
        btnAgregarContacto.setMnemonic('A');
        btnAgregarContacto.setHorizontalAlignment(SwingConstants.LEFT);
        btnAgregarContacto.setIconTextGap(10);
        btnAgregarContacto.setOpaque(false);
        btnAgregarContacto.setFocusPainted(false);
        btnAgregarContacto.setFont(new Font(Font.SANS_SERIF, 0, 11));
        toolbar.add(btnAgregarContacto);
        toolbar.addSeparator();
        btnQuitarContacto = new JButton("Quitar", gif.ADD16);
        btnQuitarContacto.setMnemonic('Q');
        btnQuitarContacto.setHorizontalAlignment(SwingConstants.LEFT);
        btnQuitarContacto.setIconTextGap(10);
        btnQuitarContacto.setOpaque(false);
        btnQuitarContacto.setFocusPainted(false);
        btnQuitarContacto.setFont(new Font(Font.SANS_SERIF, 0, 11));
        toolbar.add(btnQuitarContacto);

        modeltableContacto = new PedidoContactoTableModel();
        tableContacto = new CTable();
        tableContacto.setModel(modeltableContacto);
        tableContacto.setAllTableNoEditable();
        tableContacto.setAllColumnNoResizable();
        tableContacto.setRendererColumnZero();
        tableContacto.setAllColumnPreferredWidthNvo(10);
        JScrollPane scrollContacto = new JScrollPane(tableContacto);
        scrollContacto.setPreferredSize(new Dimension(300, 100));
        pnl.add(scrollContacto, BorderLayout.CENTER);

        return pnl;
    }

    protected JPanel getPnlContactoNorth() {
        JPanel pnl = new JPanel();
        GridBagConstraints gbc = new GridBagConstraints();
        gbc.gridx = 0;
        gbc.gridy = 0;
        gbc.insets = new Insets(2, 2, 2, 2);
        gbc.anchor = GridBagConstraints.WEST;
        pnl.setLayout(new GridBagLayout());
        JLabel lblContacto = new JLabel("Contacto");
        pnl.add(lblContacto, gbc);
        gbc.gridx = 1;
        txtContacto = new JTextField();
        txtContacto.setColumns(25);
        txtContacto.setDocument(new UpperCaseNumberDocument(100));
        pnl.add(txtContacto, gbc);
        gbc.gridx = 0;
        gbc.gridy = 1;
        JLabel lblTelef = new JLabel("Telef");
        pnl.add(lblTelef, gbc);
        gbc.gridx = 1;
        txtTelef = new JTextField();
        txtTelef.setColumns(10);
        txtTelef.setDocument(new IntegerDocument(20));
        pnl.add(txtTelef, gbc);
        gbc.gridx = 0;
        gbc.gridy = 2;
        JLabel lblCorreo = new JLabel("Correo");
        pnl.add(lblCorreo, gbc);
        gbc.gridx = 1;
        txtCorreo = new JTextField();
        txtCorreo.setColumns(10);
        pnl.add(txtCorreo, gbc);
        return pnl;
    }

    protected JPanel getPnlCab() {
        JPanel pnlPrincipal = new JPanel();
        pnlPrincipal.setLayout(new BorderLayout());
        JPanel pnl = new JPanel();
        pnl.setLayout(new BorderLayout());
        JPanel pnlLeft = new JPanel();
        pnlLeft.setLayout(new BorderLayout());
        pnlLeft.add(getPnlNorth(), BorderLayout.NORTH);
        pnlLeft.add(getPnlCenter(), BorderLayout.CENTER);
        JPanel pnlSouth = new JPanel();
        pnlSouth.setLayout(new BorderLayout());
        pnlLeft.add(pnlSouth, BorderLayout.SOUTH);
        pnlSouth.add(getPnlSouth(), BorderLayout.CENTER);
        pnlSouth.add(getPnlObserv(), BorderLayout.SOUTH);
        pnlPrincipal.add(pnl, BorderLayout.NORTH);
        pnl.add(pnlLeft, BorderLayout.WEST);
        return pnlPrincipal;
    }

    protected JPanel getPnlNorth() {
        JPanel pnl = new JPanel();
        pnl.setLayout(new BorderLayout());
        Border border = BorderFactory.createTitledBorder(null, "",
                TitledBorder.LEFT, TitledBorder.DEFAULT_POSITION,
                new Font("Comic Sans MS", 0, 12), Color.BLACK);
        pnl.add(this.getPnlDocumento(), BorderLayout.WEST);
        JPanel pnlForma = new JPanel();
        pnlForma.setLayout(new BorderLayout());
        pnlForma.setBorder(border);
        pnl.add(pnlForma, BorderLayout.CENTER);
        pnlForma.add(this.getPnlFormaPago(), BorderLayout.WEST);
        return pnl;
    }

    protected JPanel getPnlDocumento() {
        JPanel pnlDocumento = new JPanel();
        pnlDocumento.setLayout(new GridBagLayout());
        Border border = BorderFactory.createTitledBorder(null, "",
                TitledBorder.LEFT, TitledBorder.DEFAULT_POSITION,
                new Font("Comic Sans MS", 0, 12), Color.BLACK);
        pnlDocumento.setBorder(border);

        GridBagConstraints gbc = new GridBagConstraints();
        gbc.gridx = 0;
        gbc.gridy = 0;
        gbc.insets = new Insets(2, 2, 2, 2);
        gbc.anchor = GridBagConstraints.WEST;

        JLabel lblTDoc = new JLabel("T Doc");
        pnlDocumento.add(lblTDoc, gbc);

        gbc.gridx = 1;
        gbc.gridwidth = 2;
        gbc.fill = GridBagConstraints.HORIZONTAL;
        cboTipoDocumento = new JComboBox();
        pnlDocumento.add(cboTipoDocumento, gbc);
        gbc.gridwidth = 1;
        gbc.fill = GridBagConstraints.NONE;

        gbc.gridx = 0;
        gbc.gridy = 1;
        JLabel lblDoc = new JLabel("N° Documento");
        pnlDocumento.add(lblDoc, gbc);

        gbc.gridx = 1;
        cboSerie = new JComboBox();
        cboSerie.setPreferredSize(new Dimension(80, 20));
        pnlDocumento.add(cboSerie, gbc);

        gbc.gridx = 2;
        txt_preimpreso = new JTextField();
        txt_preimpreso.setEditable(false);
        txt_preimpreso.setColumns(10);
        pnlDocumento.add(txt_preimpreso, gbc);

        gbc.gridx = 0;
        gbc.gridy = 2;
        JLabel lblFEmision = new JLabel("F Emision");
        pnlDocumento.add(lblFEmision, gbc);

        gbc.gridx = 1;
        gbc.gridwidth = 2;
        dc_femision = new JDateChooser("dd/MM/yyyy", "##/##/####", '_');
        try {
            Date fechaActual = new Date();
            ((JTextFieldDateEditor) dc_femision.getDateEditor()).setInputVerifier(new VerificarEntreFechas(frm.getFechaInicio(), fechaActual));
        } catch (Exception ex1) {
            logger.error("ex1 = " + ex1.getMessage());
        }
        pnlDocumento.add(dc_femision, gbc);
        return pnlDocumento;
    }

    protected JPanel getPnlFormaPago() {
        JPanel pnlFormaPago = new JPanel();
        pnlFormaPago.setLayout(new GridBagLayout());

        GridBagConstraints gbc = new GridBagConstraints();
        gbc.gridx = 0;
        gbc.gridy = 0;
        gbc.insets = new Insets(2, 2, 2, 2);
        gbc.anchor = GridBagConstraints.WEST;

        JLabel lblCPago = new JLabel("C Pago");
        pnlFormaPago.add(lblCPago, gbc);

        gbc.gridx = 1;
        gbc.fill = GridBagConstraints.HORIZONTAL;
        cboCondPago = new JComboBox();
        pnlFormaPago.add(cboCondPago, gbc);

        gbc.gridx = 2;
        JLabel lblDias = new JLabel("T Dias");
        pnlFormaPago.add(lblDias, gbc);

        gbc.gridx = 3;
        txt_diaspago = new JTextField();
        txt_diaspago.setDocument(new IntegerDocument(3));
        txt_diaspago.setColumns(3);
        txt_diaspago.setEnabled(false);
        txt_diaspago.setInputVerifier(new VerificarEnteroMayorCero());
        pnlFormaPago.add(txt_diaspago, gbc);

        gbc.gridx = 4;
        JLabel lblVence = new JLabel("F Vence");
        pnlFormaPago.add(lblVence, gbc);

        gbc.gridx = 5;
        dc_fvencimiento = new JDateChooser("dd/MM/yyyy", "##/##/####", '_');
        dc_fvencimiento.setEnabled(false);
        pnlFormaPago.add(dc_fvencimiento, gbc);

        gbc.gridx = 0;
        gbc.gridy = 1;
        JLabel lblMoneda = new JLabel("Moneda");
        pnlFormaPago.add(lblMoneda, gbc);

        gbc.gridx = 1;
        cbo_moneda = new JComboBox();
        cbo_moneda.setEnabled(false);
        pnlFormaPago.add(cbo_moneda, gbc);

        gbc.gridx = 2;
        JLabel lblTCambio = new JLabel("T Cambio");
        pnlFormaPago.add(lblTCambio, gbc);

        gbc.gridx = 3;
        txt_tipocambio = new JTextField();
        txt_tipocambio.setEditable(false);
        pnlFormaPago.add(txt_tipocambio, gbc);
        gbc.fill = GridBagConstraints.NONE;

        gbc.gridx = 4;
        JLabel lblDespacho = new JLabel("F Despacho");
        pnlFormaPago.add(lblDespacho, gbc);

        gbc.gridx = 5;
        dc_fdespacho = new JDateChooser("dd/MM/yyyy", "##/##/####", '_');
        dc_fdespacho.setEnabled(false);
        pnlFormaPago.add(dc_fdespacho, gbc);

        gbc.gridx = 0;
        gbc.gridy = 2;
        JLabel lblTPago = new JLabel("T Pago");
        pnlFormaPago.add(lblTPago, gbc);

        gbc.gridx = 1;
        gbc.fill = GridBagConstraints.HORIZONTAL;
        cbo_mediopago = new JComboBox();
        pnlFormaPago.add(cbo_mediopago, gbc);

        gbc.gridx = 2;
        JLabel lblCancela = new JLabel("Cancela en");
        pnlFormaPago.add(lblCancela, gbc);

        gbc.gridwidth = 3;
        gbc.gridx = 3;
        cbo_cancelaen = new JComboBox();
        cbo_cancelaen.setEnabled(false);
        pnlFormaPago.add(cbo_cancelaen, gbc);
        gbc.gridwidth = 1;

        gbc.gridx = 0;
        gbc.gridy = 3;

        JLabel lblModVta = new JLabel("Mod. Vta");
        pnlFormaPago.add(lblModVta, gbc);

        cboModVta = new JComboBox();
        cboModVta.addItem("Cliente Recoge");
        cboModVta.addItem("Despacho al Cliente");
        gbc.gridx = 1;
        pnlFormaPago.add(cboModVta, gbc);
        JLabel lblModDespacho = new JLabel("Despacho");
        gbc.gridx = 2;
        pnlFormaPago.add(lblModDespacho, gbc);

        cboModDespacho = new JComboBox();
        cboModDespacho.addItem("Almacen Empresa");
        cboModDespacho.addItem("Almacen Proveedor");
        cboModDespacho.setEnabled(false);
        gbc.gridx = 3;
        gbc.gridwidth = 3;
        pnlFormaPago.add(cboModDespacho, gbc);
        return pnlFormaPago;
    }

    protected JPanel getPnlCenter() {
        JPanel pnl = new JPanel();
        pnl.setLayout(new BorderLayout());
        JPanel pnlWest = new JPanel();
        pnlWest.setLayout(new BorderLayout());
        pnlWest.setBorder(BorderFactory.createTitledBorder(null, "", TitledBorder.LEFT,
                TitledBorder.DEFAULT_POSITION, new Font("Comic Sans MS", 0, 12), Color.BLACK));
        pnl.add(pnlWest, BorderLayout.WEST);
        pnlWest.add(this.getPnlClienteCenter(), BorderLayout.CENTER);
        pnlWest.add(this.getPnlOpcCenter(), BorderLayout.NORTH);
        pnl.add(this.getPnlReciboCenter(), BorderLayout.CENTER);
        return pnl;
    }

    protected JPanel getPnlClienteCenter() {
        JPanel pnlCliente = new JPanel();
        pnlCliente.setLayout(new GridBagLayout());
        GridBagConstraints gbc = new GridBagConstraints();

        gbc.gridx = 0;
        gbc.gridy = 0;
        gbc.insets = new Insets(2, 2, 2, 2);
        gbc.anchor = GridBagConstraints.WEST;

        gbc.gridx = 0;
        gbc.gridy = 0;
        JLabel lblCliente = new JLabel("Cliente");
        lblCliente.setFont(new Font("Arial", 0, 11));
        pnlCliente.add(lblCliente, gbc);

        gbc.gridx = 1;
        txt_idclientereal = new JTextField();
        txt_idclientereal.setEditable(false);
        txt_idclientereal.setColumns(7);
        gbc.fill = GridBagConstraints.HORIZONTAL;
        pnlCliente.add(txt_idclientereal, gbc);
        gbc.fill = GridBagConstraints.NONE;

        gbc.gridx = 2;
        txt_cliente = new JTextField();
        txt_cliente.setDocument(new UpperCaseNumberDocument(255));
        txt_cliente.setColumns(20);
        pnlCliente.add(txt_cliente, gbc);

        gbc.gridx = 3;
        JLabel lblRucCliente = new JLabel("RUC/DNI");
        lblRucCliente.setFont(new Font("Arial", 0, 10));
        pnlCliente.add(lblRucCliente, gbc);
        gbc.gridx = 4;
        txt_rucreal = new JTextField();
        txt_rucreal.setDocument(new UpperCaseNumberDocument(20));
        txt_rucreal.setColumns(7);
        pnlCliente.add(txt_rucreal, gbc);

        gbc.gridx = 0;
        gbc.gridy = 1;
        JLabel lbl_direccionreal = new JLabel("Direccion");
        lbl_direccionreal.setFont(new Font("Arial", 0, 11));
        pnlCliente.add(lbl_direccionreal, gbc);

        gbc.gridx = 1;
        gbc.gridwidth = 4;
        gbc.fill = GridBagConstraints.HORIZONTAL;
        txtDireccionReal = new JTextField();
        txtDireccionReal.setDocument(new UpperCaseNumberDocument(300));
        pnlCliente.add(txtDireccionReal, gbc);
        gbc.gridwidth = 1;

        JLabel lblCorreo = new JLabel("Correo");

        txtCorreoCliente = new JTextField();
        if (Constans.IS_FACTURADOR_SUNAT) {
            gbc.gridx = 0;
            gbc.gridy = 2;
            pnlCliente.add(lblCorreo, gbc);

            gbc.gridx = 1;
            gbc.gridwidth = 4;
            gbc.fill = GridBagConstraints.HORIZONTAL;
            pnlCliente.add(txtCorreoCliente, gbc);
            gbc.gridwidth = 1;
        }
        chkAgRetencion = new JCheckBox("Agente Retención");
        chkAgRetencion.setEnabled(false);
        if (Constans.IS_RETENCION_VENTA_CLIENTE) {
            gbc.gridx = 1;
            gbc.gridy = 3;
            gbc.gridwidth = 2;
            pnlCliente.add(chkAgRetencion, gbc);
            gbc.gridwidth = 1;
        }
        gbc.gridx = 0;
        gbc.gridy = 4;
        JLabel lblDescripcion = new JLabel("Sustituto");
        lblDescripcion.setFont(new Font("Arial", 0, 11));
        pnlCliente.add(lblDescripcion, gbc);
        gbc.gridx = 1;
        txt_idclienteficticio = new JTextField();
        txt_idclienteficticio.setEditable(false);
        pnlCliente.add(txt_idclienteficticio, gbc);

        gbc.gridx = 2;
        cbo_clienteficticio = new JComboBox();
        this.txtClienteTemporal = new JTextField();
        txtClienteTemporal.setDocument(new UpperCaseDocument(300));
        txtClienteTemporal.setText("PUBLICO GENERAL PG");
        txtClienteTemporal.setColumns(20);
        JPanel pnlPG = new JPanel();
        pnlPG.setLayout(new BorderLayout());
        pnlPG.add(txtClienteTemporal, BorderLayout.WEST);
        pnlPG.add(cbo_clienteficticio, BorderLayout.CENTER);
        pnlCliente.add(pnlPG, gbc);
        txtClienteTemporal.setVisible(false);
        gbc.gridx = 3;
        JLabel lbl_rucficticio = new JLabel("RUC/DNI");
        lbl_rucficticio.setFont(new Font("Arial", 0, 10));
        pnlCliente.add(lbl_rucficticio, gbc);

        gbc.gridx = 4;
        txt_rucficticio = new JTextField();
        txt_rucficticio.setDocument(new UpperCaseNumberDocument(20));
        pnlCliente.add(txt_rucficticio, gbc);
        txt_rucficticio.setEditable(false);

        gbc.gridx = 0;
        gbc.gridy = 5;
        JLabel lbl_direccionficticio = new JLabel("Direccion");
        lbl_direccionficticio.setFont(new Font("Arial", 0, 11));
        pnlCliente.add(lbl_direccionficticio, gbc);

        gbc.gridx = 1;
        gbc.gridwidth = 4;
        txt_direccionficticio = new JTextField();
        txt_direccionficticio.setDocument(new UpperCaseNumberDocument(300));
        pnlCliente.add(txt_direccionficticio, gbc);
        gbc.gridwidth = 1;
        gbc.fill = GridBagConstraints.NONE;
        return pnlCliente;
    }

    protected JPanel getPnlOpcCenter() {
        JPanel pnlOpc = new JPanel(new FlowLayout(FlowLayout.LEFT, 5, 5));
        chk_publicogeneral = new JCheckBox("PUBLICO GENERAL");
        chk_publicogeneral.setOpaque(false);
        pnlOpc.add(chk_publicogeneral);

        JLabel lblbuscar = new JLabel("F7");
        lblbuscar.setFont(new Font(Font.SANS_SERIF, 0, 9));
        lblbuscar.setForeground(Color.BLUE);
        pnlOpc.add(lblbuscar);

        btn_buscarcliente = new JButton(gif.SEARCH16);
        btn_buscarcliente.setToolTipText("Buscar");
        btn_buscarcliente.setContentAreaFilled(true);
        btn_buscarcliente.setBorderPainted(true);
        btn_buscarcliente.setFocusable(true);
        btn_buscarcliente.setFocusPainted(false);
        pnlOpc.add(this.btn_buscarcliente);

        JLabel lblnuevo = new JLabel("F8");
        lblnuevo.setFont(new Font(Font.SANS_SERIF, 1, 9));
        lblnuevo.setForeground(Color.BLUE);
        pnlOpc.add(lblnuevo);

        btn_nuevocliente = new JButton(gif.ADDORANGE);
        btn_nuevocliente.setToolTipText("Nuevo");
        btn_nuevocliente.setFocusPainted(false);
        pnlOpc.add(this.btn_nuevocliente);

        chk_promocion = new JCheckBox("PROMOCION");
        chk_promocion.setOpaque(false);
        chk_promocion.setEnabled(false);
        pnlOpc.add(chk_promocion);
        return pnlOpc;
    }

    protected JPanel getPnlReciboCenter() {
        JPanel pnlRecibo = new JPanel();
        pnlRecibo.setLayout(new GridBagLayout());

        GridBagConstraints gbc = new GridBagConstraints();
        gbc.gridx = 0;
        gbc.gridy = 0;
        gbc.insets = new Insets(2, 2, 2, 2);
        gbc.anchor = GridBagConstraints.WEST;
        JLabel lblRecibo = new JLabel("Recibo");
        lblRecibo.setFont(new Font("Arial", 1, 11));
        lblRecibo.setForeground(new Color(10, 52, 10));
        pnlRecibo.add(lblRecibo, gbc);

        gbc.gridx = 1;
        txt_recibo = new JTextField();
        txt_recibo.setFont(new Font("Arial", 1, 17));
        txt_recibo.setColumns(7);
        txt_recibo.setDocument(new DoubleDocument());
        pnlRecibo.add(txt_recibo, gbc);

        gbc.gridx = 2;
        gbc.fill = GridBagConstraints.HORIZONTAL;
        btnGuardar = new JButton("(Ctrl) Guardar", gif.SAVE16);
        btnGuardar.setOpaque(false);
        pnlRecibo.add(btnGuardar, gbc);

        gbc.gridx = 0;
        gbc.gridy = 1;
        JLabel lblVuelto = new JLabel("Vuelto");
        lblVuelto.setForeground(new Color(10, 52, 10));
        lblVuelto.setFont(new Font("Arial", 1, 11));
        pnlRecibo.add(lblVuelto, gbc);

        gbc.gridx = 1;
        txt_vuelto = new JTextField();
        txt_vuelto.setFont(new Font("Arial", 1, 17));
        txt_vuelto.setForeground(new Color(9, 26, 0));
        txt_vuelto.setEditable(false);
        pnlRecibo.add(txt_vuelto, gbc);

        gbc.gridx = 2;
        btn_cancelar = new JButton("Cancelar", gif.CANCEL16);
        btn_cancelar.setOpaque(false);
        pnlRecibo.add(btn_cancelar, gbc);
        return pnlRecibo;
    }

    protected JPanel getPnlSouth() {
        JPanel pnl = new JPanel();
        pnl.setLayout(new BorderLayout());
        JPanel pnlNorth = new JPanel(new FlowLayout(FlowLayout.LEFT, 5, 5));
        JPanel pnlSouth = new JPanel();
        Border border = BorderFactory.createTitledBorder(null,
                "Cobranza", TitledBorder.LEFT, TitledBorder.DEFAULT_POSITION, new Font("Comic Sans MS", 0, 12), Color.BLACK);
        pnlSouth.setBorder(border);
        pnl.add(pnlNorth, BorderLayout.NORTH);
        pnl.add(pnlSouth, BorderLayout.CENTER);

        JLabel lbl_vendedor = new JLabel("Vendedor");
        lbl_vendedor.setFont(new Font("Arial", 0, 11));
        pnlNorth.add(lbl_vendedor);

        cbo_idvendedor = new JComboBox();
        pnlNorth.add(cbo_idvendedor);

        JLabel lbl_trabajador = new JLabel("Usuario");
        lbl_trabajador.setFont(new Font("Arial", 0, 11));
        pnlNorth.add(lbl_trabajador);

        txt_idtrabajador = new JTextField();
        txt_idtrabajador.setFont(new Font("Comic Sans Serif", Font.PLAIN, 12));
        txt_idtrabajador.setEditable(false);
        txt_idtrabajador.setColumns(7);
        txt_idtrabajador.setText(usuario.getId_trabajador());
        pnlNorth.add(txt_idtrabajador);

        txt_trabajador = new JTextField();
        txt_trabajador.setFont(new Font("Comic Sans Serif", Font.PLAIN, 12));
        txt_trabajador.setEditable(false);
        txt_trabajador.setColumns(20);
        txt_trabajador.setText(usuario.getTrabajador());
        pnlNorth.add(txt_trabajador);

        JLabel lblValorVenta = new JLabel("V Venta");
        lblValorVenta.setFont(new Font("Arial", 1, 11));
        lblValorVenta.setForeground(new Color(10, 52, 10));
        pnlSouth.add(lblValorVenta);

        txt_valorventa = new JTextField();
        txt_valorventa.setFont(new Font("Comic Sans Serif", Font.PLAIN, 12));
        txt_valorventa.setEditable(false);
        txt_valorventa.setColumns(10);
        pnlSouth.add(txt_valorventa);

        txt_descuento = new JTextField();
        txt_afecto = new JTextField();
        txt_noafecto = new JTextField();

        JLabel lblIgv = new JLabel("Igv");
        lblIgv.setFont(new Font("Arial", 1, 11));
        lblIgv.setForeground(new Color(10, 52, 10));
        pnlSouth.add(lblIgv);

        txt_igv = new JTextField();
        txt_igv.setFont(new Font("Comic Sans Serif", Font.PLAIN, 12));
        txt_igv.setEditable(false);
        txt_igv.setColumns(10);
        pnlSouth.add(txt_igv);

        JLabel lblTotal = new JLabel("P Venta");
        lblTotal.setBounds(350, 25, 100, 20);
        lblTotal.setFont(new Font("Arial", 1, 11));
        lblTotal.setForeground(new Color(10, 52, 10));
        pnlSouth.add(lblTotal);

        txt_total = new JTextField();
        txt_total.setFont(new Font("Arial", 1, 12));
        txt_total.setForeground(Color.RED);
        txt_total.setEditable(false);
        txt_total.setColumns(10);
        pnlSouth.add(txt_total);

        JLabel lblPercepcion = new JLabel("Perc");
        lblPercepcion.setFont(new Font("Arial", 1, 10));
        lblPercepcion.setForeground(new Color(10, 52, 10));
        pnlSouth.add(lblPercepcion);

        txt_percepcion = new JTextField();
        txt_percepcion.setFont(new Font("Arial", 1, 12));
        txt_percepcion.setForeground(Color.BLUE);
        txt_percepcion.setEditable(false);
        txt_percepcion.setColumns(9);
        pnlSouth.add(txt_percepcion);

        JLabel lblTotalCobrar = new JLabel("Total");
        lblTotalCobrar.setFont(new Font("Arial", 1, 11));
        lblTotalCobrar.setForeground(new Color(10, 52, 10));
        pnlSouth.add(lblTotalCobrar);

        txtTotalCobrar = new JTextField();
        txtTotalCobrar.setFont(new Font("Arial", 1, 12));
        txtTotalCobrar.setForeground(Color.RED);
        txtTotalCobrar.setEditable(false);
        txtTotalCobrar.setColumns(9);
        pnlSouth.add(txtTotalCobrar);

        lblTotalRetencion = new JLabel("Retencion");
        lblTotalRetencion.setFont(new Font("Arial", 1, 11));
        lblTotalRetencion.setForeground(new Color(10, 52, 10));
        lblTotalRetencion.setVisible(false);
        pnlSouth.add(lblTotalRetencion);

        txtTotalRetencion = new JTextField();
        txtTotalRetencion.setFont(new Font("Arial", 1, 12));
        txtTotalRetencion.setForeground(Color.RED);
        txtTotalRetencion.setEditable(false);
        txtTotalRetencion.setColumns(9);
        txtTotalRetencion.setVisible(false);
        pnlSouth.add(txtTotalRetencion);

        return pnl;
    }

    protected JPanel getPnlObserv() {
        JPanel pnlPrinc = new JPanel();
        pnlPrinc.setLayout(new BorderLayout());
        JPanel pnl = new JPanel();
        pnl.setLayout(new GridBagLayout());
        pnlPrinc.add(pnl, BorderLayout.WEST);
        pnlPrinc.setBorder(BorderFactory.createTitledBorder(null, "Observaciones", TitledBorder.LEFT, TitledBorder.DEFAULT_POSITION, new Font("Comic Sans MS", 0, 12), Color.BLACK));
        GridBagConstraints gbc = new GridBagConstraints();
        gbc.gridx = 0;
        gbc.gridy = 0;
        gbc.insets = new Insets(2, 2, 2, 2);
        gbc.anchor = GridBagConstraints.WEST;
        JLabel lblObserv1 = new JLabel("Observ 1");
        pnl.add(lblObserv1, gbc);
        gbc.gridx = 1;
        txtObser1 = new JTextField();
        txtObser1.setColumns(50);
        txtObser1.setDocument(new UpperCaseNumberDocument(150));
        pnl.add(txtObser1, gbc);
        gbc.gridx = 0;
        gbc.gridy = 1;
        JLabel lblObserv2 = new JLabel("Observ 2");
        pnl.add(lblObserv2, gbc);
        gbc.gridx = 1;
        txtObser2 = new JTextField();
        txtObser2.setColumns(50);
        txtObser2.setDocument(new UpperCaseNumberDocument(150));
        pnl.add(txtObser2, gbc);
        return pnlPrinc;
    }
    ItemListener itemListener = new ItemListener() {
        @Override
        public void itemStateChanged(ItemEvent e) {
            cboPrecio.getEditor().setItem(cboPrecio.getSelectedItem());
        }
    };

    protected void initListener() {
    }

    protected List<Anexo> getClientes(Anexo c) {
        return null;
    }

    public void mostrarComprasPorItem() {
    }

    protected void eventListener() {
        ((JTextFieldDateEditor) dc_femision.getDateEditor()).addFocusListener(new FocusListener() {
            @Override
            public void focusGained(FocusEvent e) {
            }

            @Override
            public void focusLost(FocusEvent e) {
                changeFechaEmision();
                calcularpercepcion();
                calcFVenc();
            }
        });
        ((JTextField) dc_femision.getDateEditor()).registerKeyboardAction(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                cboCondPago.requestFocus();
                changeFechaEmision();
            }
        }, KeyStroke.getKeyStroke(KeyEvent.VK_ENTER, 0, false), JComponent.WHEN_FOCUSED);

        ((JTextField) dc_femision.getDateEditor()).registerKeyboardAction(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                dc_femision.getCalendarButton().doClick();
            }
        }, KeyStroke.getKeyStroke(KeyEvent.VK_SPACE, 0, false), JComponent.WHEN_FOCUSED);
    }

    protected BeanTipoCambio getBeanTipoCambio(String idMoneda, Date fecha) throws Exception {
        return null;
    }

    protected void changeFechaEmision() {
    }

    protected void changeCotizacion() {
        boolean sw = chkCotizacion.isSelected();
        if (!sw) {
            if (beanCotizacion != null) {
                mdl_venta.clearTable();
                beanCotizacion = null;
                chk_publicogeneral.setSelected(true);
                cboCondPago.setSelectedItem("CONTADO");
                txtObser1.setText("");
                txtObser2.setText("");
            }
        }
    }

    protected void changePedido() {
        boolean sw = chkPedido.isSelected();
        if (!sw) {
            if (beanPedido != null) {
                mdl_venta.clearTable();
                beanPedido = null;
                chk_publicogeneral.setSelected(true);
                cboCondPago.setSelectedItem("CONTADO");
                txtObser1.setText("");
                txtObser2.setText("");
            }
        }
    }

    protected void insertarContacto() {
    }

    protected void quitarContacto() {
    }

    public void setListConversion(List<BeanVentaConversion> listConversion) {
        this.listConversion = listConversion;
    }

    protected void configTableVenta(boolean swCotPed) {
        if (Constans.SWCODEBARRA && !swCotPed) {
            tbl_venta.getColumnModel().getColumn(9).setMinWidth(0);
            tbl_venta.getColumnModel().getColumn(9).setMaxWidth(0);
            tbl_venta.getColumnModel().getColumn(10).setMinWidth(100);
            tbl_venta.getColumnModel().getColumn(10).setMaxWidth(500);
        } else {
            tbl_venta.getColumnModel().getColumn(9).setMinWidth(100);
            tbl_venta.getColumnModel().getColumn(9).setMaxWidth(500);
            tbl_venta.getColumnModel().getColumn(10).setMinWidth(0);
            tbl_venta.getColumnModel().getColumn(10).setMaxWidth(0);
        }
        if (swCotPed) {
            tbl_venta.getColumnModel().getColumn(17).setMinWidth(100);
            tbl_venta.getColumnModel().getColumn(17).setMaxWidth(500);
        } else {
            tbl_venta.getColumnModel().getColumn(17).setMinWidth(0);
            tbl_venta.getColumnModel().getColumn(17).setMaxWidth(0);
        }

    }

    @Override
    public void focusGained(FocusEvent e) {
        if (e.getSource() == txt_iditem) {
            txt_iditem.selectAll();
        }
        if (((JTextFieldDateEditor) dc_femision.getDateEditor()) == e.getSource()) {
            ((JTextFieldDateEditor) dc_femision.getDateEditor()).selectAll();
        }

        if (e.getSource() == txt_descripcion) {
            txt_descripcion.selectAll();
        }

        if (e.getSource() == txt_cantidad) {
            txt_cantidad.selectAll();
        }

        if (e.getSource() == cboPrecio.getEditor().getEditorComponent()) {
            cboPrecio.getEditor().selectAll();
        }
        if (txt_cliente == e.getSource()) {
            txt_cliente.selectAll();
        }

        if (this.txtClienteTemporal == e.getSource()) {
            txtClienteTemporal.selectAll();
        }

        if (txt_rucreal == e.getSource()) {
            txt_rucreal.selectAll();
        }

        if (txtDireccionReal == e.getSource()) {
            txtDireccionReal.selectAll();
        }
        if (txt_recibo == e.getSource()) {
            txt_recibo.selectAll();
        }
        if (e.getSource() == txtContacto) {
            txtContacto.selectAll();
        }
        if (e.getSource() == txtTelef) {
            txtTelef.selectAll();
        }
        if (e.getSource() == txtDireccionDespacho) {
            txtDireccionDespacho.selectAll();
        }
        if (e.getSource() == txtCorreo) {
            txtCorreo.selectAll();
        }
    }

    protected void valorCodItem() {
    }

    @Override
    public void focusLost(FocusEvent e) {
        if (e.getSource() == txt_iditem && txt_iditem.getText().trim().length() > 0) {
            valorCodItem();
        }
        if (e.getSource() == txt_cantidad && txt_cantidad.getText().trim().length() == 0) {
            txt_cantidad.setText("0.0");
        }
        if (e.getSource().equals(txt_diaspago)) {
            calcFVenc();
        }
        if (e.getSource().equals(txtMaximoProductos)) {
            if (txtMaximoProductos.getText().trim().isEmpty()) {
                txtMaximoProductos.setText(String.valueOf(maxProd));
            }
        }
    }

    public void cargarDatos() {
    }

    protected void loadCondPago() {
    }

    protected void loadDepartamento() {
    }

    protected void changeDepartamento() throws Exception {
    }

    protected void changeProvincia() throws Exception {
    }

    protected void changeDistrito() throws Exception {
    }

    protected void cargarMoneda() throws Exception {
    }

    protected void limpiarVenta() {
    }

    protected void setFechas() {
    }

    protected String getIdMoneda() {
        return xMoneda.get(cboMoneda.getSelectedIndex()).getIdMoneda();
    }

    protected void agregarItem(double num, boolean swButton) {
    }

    protected boolean validateCantidad(BigDecimal cantidad, BigDecimal disponible) {
        if (!Constans.ISBOTICA) {
            return true;
        }
        return cantidad.compareTo(disponible) != 1;
    }

    protected ComboModelAlmacen getComboModelAlmacen(BeanAlmacen beanAlmacen) {
        mdl_almacen.getData();
        ArrayList<BeanAlmacen> listAlmacen = new ArrayList();
        for (BeanStock stock : mdl_almacen.getData()) {
            listAlmacen.add(stock.getBeanAlmacen());
        }
        ComboModelAlmacen modelAlmacen = new ComboModelAlmacen();
        modelAlmacen.setSelectedItem(beanAlmacen.getDescripcion());
        modelAlmacen.setData(listAlmacen);
        return modelAlmacen;
    }

    protected void generarVenta() {
    }

    protected boolean flagPromocion() {
        for (int i = 0; i < mdl_venta.getRowCount(); i++) {
            if (mdl_venta.getRci(i).getBeanItem().getFlagPromocion().equals("S")) {
                return true;
            }
        }
        return false;
    }

    protected void calcularpercepcion() {
    }

    protected void calcPercepcion() {
    }

    protected void loadTipoDocumento() throws Exception {
    }

    protected boolean verificarMoneda(String idMoneda) {
        return false;
    }

    protected boolean verificarItemPercepcion(String perc) {
        return false;
    }

    protected void cargarTabla() throws Exception {
    }

    protected void cargarProductoPrecioAll() throws Exception {
    }

    protected void cargarPrecios(String id_item) {
    }

    protected BigDecimal getPrecioMinimo(BeanPrecioItem beanPrecioItem) {
        BigDecimal precMin = BigDecimal.ZERO;
        if (cboMoneda.getSelectedIndex() == 0) {
            if (beanPrecioItem.getPrecio1().compareTo(BigDecimal.ZERO) == 1) {
                precMin = beanPrecioItem.getPrecio1();
            }
            if (beanPrecioItem.getPrecio2().compareTo(BigDecimal.ZERO) == 1) {
                if (precMin.compareTo(BigDecimal.ZERO) == 1) {
                    if (beanPrecioItem.getPrecio2().compareTo(precMin) == -1) {
                        precMin = beanPrecioItem.getPrecio2();
                    }
                } else {
                    precMin = beanPrecioItem.getPrecio2();
                }
            }
            if (beanPrecioItem.getPrecio3().compareTo(BigDecimal.ZERO) == 1) {
                if (precMin.compareTo(BigDecimal.ZERO) == 1) {
                    if (beanPrecioItem.getPrecio3().compareTo(precMin) == -1) {
                        precMin = beanPrecioItem.getPrecio3();
                    }
                } else {
                    precMin = beanPrecioItem.getPrecio3();
                }
            }
            return precMin;
        } else {
            if (beanPrecioItem.getPrecio4().compareTo(BigDecimal.ZERO) == 1) {
                precMin = beanPrecioItem.getPrecio4();
            }
            if (beanPrecioItem.getPrecio5().compareTo(BigDecimal.ZERO) == 1) {
                if (precMin.compareTo(BigDecimal.ZERO) == 1) {
                    if (beanPrecioItem.getPrecio5().compareTo(precMin) == -1) {
                        precMin = beanPrecioItem.getPrecio5();
                    }
                } else {
                    precMin = beanPrecioItem.getPrecio5();
                }
            }
            if (beanPrecioItem.getPrecio6().compareTo(BigDecimal.ZERO) == 1) {
                if (precMin.compareTo(BigDecimal.ZERO) == 1) {
                    if (beanPrecioItem.getPrecio6().compareTo(precMin) == -1) {
                        precMin = beanPrecioItem.getPrecio6();
                    }
                } else {
                    precMin = beanPrecioItem.getPrecio6();
                }
            }
            return precMin;
        }
    }

    protected void addProductBarCode() {
    }

    @Override
    public void keyPressed(KeyEvent e) {

        if (KeyEvent.VK_CONTROL == e.getKeyCode() && tabb.getSelectedIndex() == 0) {
            tbl_producto.editCellAt(-1, -1);
            tbl_venta.editCellAt(-1, -1);
            btn_guardar.requestFocus();
            btn_guardar.doClick();
            return;
        }
        if (KeyEvent.VK_ALT == e.getKeyCode() && tabb.getSelectedIndex() == 0) {
            txt_descripcion.requestFocus();
            txt_descripcion.selectAll();
            return;
        }

        if (KeyEvent.VK_ALT == e.getKeyCode() && tabb.getSelectedIndex() == 1) {
            this.cboTipoDocumento.requestFocus();
            return;
        }

        if (KeyEvent.VK_CONTROL == e.getKeyCode() && tabb.getSelectedIndex() == 1) {
            guardarDocumento();
            return;
        }
        if (e.getKeyCode() == KeyEvent.VK_F10) {
            cargarDatos();
            return;
        }

        if (e.getKeyCode() == KeyEvent.VK_F9) {
            tbl_producto.editCellAt(-1, -1);
            tbl_venta.editCellAt(-1, -1);
            btn_quitar.requestFocus();
            btn_quitar.doClick();
            return;
        }

        if (e.getKeyCode() == KeyEvent.VK_F8) {
            tbl_producto.editCellAt(-1, -1);
            tbl_venta.editCellAt(-1, -1);
            btn_agregar.requestFocus();
            btn_agregar.doClick();
            return;
        }

        if (e.getKeyCode() == KeyEvent.VK_F6) {
            tbl_producto.editCellAt(-1, -1);
            tbl_venta.editCellAt(-1, -1);
            btnNuevo.requestFocus();
            btnNuevo.doClick();
            return;
        }

        if ((e.getSource() == txt_descripcion)
                || (e.getSource() == txt_iditem)) {
            filtrarTablaProducto();
            this.addProductBarCode();
            if (e.getKeyChar() == '\n') {
                tbl_producto.requestFocus();
            }
        }
        if (e.getKeyChar() == '\n') {
            if (e.getSource() == cboMoneda) {
                btn_buscar.requestFocus();
            }
            if ((e.getSource() == txt_descripcion)
                    || (e.getSource() == txt_iditem)) {
                if (txt_iditem.getText().trim().length() > 0) {
                    valorCodItem();
                    filtrarTablaProducto();
                    this.addProductBarCode();
                }
            }

            if (e.getSource() == txt_cantidad) {
                cboPrecio.getEditor().getEditorComponent().requestFocus();
            }
            if (e.getSource() == txt_cliente) {
                if (txt_cliente.getText().trim().length() > 0) {
                    verificarCliente("2");
                } else {
                    txt_rucreal.requestFocus();
                }
            }

            if (e.getSource() == txt_rucreal) {
                if (txt_rucreal.getText().trim().length() > 0) {
                    verificarCliente("1");
                } else {
                    txtDireccionReal.requestFocus();
                }
            }

        }

    }

    protected void procesoVerificar() {
    }

    protected int getMaximoProductos() {
        if (!Constans.ISBOTICA) {
            return maxProd;
        }
        return Integer.parseInt(txtMaximoProductos.getText().trim());
    }

    protected void procesoAgregar() {
    }

    protected boolean validateCantidad() {
        if (txt_cantidad.getText().trim().length() == 0) {
            return false;
        }
        return Double.valueOf(txt_cantidad.getText().trim()) > 0;
    }

    protected void cargarCostoUltimaCompra() {
    }

    protected void procesoCargarAlmacen() {
    }

    @Override
    public void keyReleased(KeyEvent e) {
        if ((e.getKeyCode() == KeyEvent.VK_DOWN)
                || (e.getKeyCode() == KeyEvent.VK_UP)
                || (e.getKeyCode() == KeyEvent.VK_PAGE_DOWN)
                || (e.getKeyCode() == KeyEvent.VK_PAGE_UP)) {
            tbl_producto.editCellAt(-1, -1);
            tbl_venta.editCellAt(-1, -1);

            if (e.getSource() == tbl_producto) {
                procesoCargarAlmacen();
            }
        }
        if ((e.getSource() == txt_cliente && txt_cliente.getText().trim().length() == 0)
                || (e.getSource() == txt_rucreal && txt_rucreal.getText().trim().length() == 0)) {
            chk_publicogeneral.setSelected(false);
        }
        if (txt_recibo == e.getSource()) {
            if (txt_recibo.getText().length() > 0
                    && Character.isDigit(txt_recibo.getText().charAt(0))) {
                double vuelto = Double.valueOf(txt_recibo.getText().trim()) - Double.valueOf(txtTotalCobrar.getText().trim());
                double vueltoRedondeado = CFunciones.redondea(vuelto, 2);
                txt_vuelto.setText(String.valueOf(vueltoRedondeado));
            } else {
                txt_vuelto.setText(String.valueOf(0.0));
            }
        }
    }

    @Override
    public void mouseClicked(MouseEvent e) {
        if (e.getClickCount() == 1) {
            tbl_producto.editCellAt(-1, -1);
            tbl_venta.editCellAt(-1, -1);

            if (e.getSource() == tbl_producto) {
                procesoCargarAlmacen();
            }
        }

        if (e.getClickCount() == 2) {
            tbl_producto.editCellAt(-1, -1);
            tbl_venta.editCellAt(-1, -1);

            if (e.getSource() == tbl_producto) {
                int fila = tbl_producto.rowAtPoint(e.getPoint());
                int columna = tbl_producto.columnAtPoint(e.getPoint());

                if ((fila >= 0) && (columna == 5 || columna == 4)) {
                } else {
                    procesoAgregar();
                }
            }

            if (e.getSource() == tbl_almacen) {
                procesoAgregar();
            }
        }
        if (e.getSource().equals(dc_femision.getCalendarButton())) {
            ((JTextField) dc_femision.getDateEditor()).requestFocus();
        }
    }

    @Override
    public void mouseReleased(MouseEvent e) {
        if (e.getSource() == tbl_producto) {
            tbl_venta.editCellAt(-1, -1);
            procesoCargarAlmacen();
        }

        if (e.getSource() == tbl_venta) {
            tbl_producto.editCellAt(-1, -1);
        }
    }

    @Override
    public void tableChanged(TableModelEvent e) {
        if (e.getSource() == mdl_venta) {
            calcularImportes();
        }
    }

    public void selectInternalFrame() {
        try {
            setSelected(true);
        } catch (PropertyVetoException e) {
        }
    }

    protected void nuevo() {
    }

    protected void filtrarTablaProducto() {
    }

    protected RowFilter getFilterProducto() {
        List filters = new ArrayList();
        if (cboMoneda.getSelectedIndex() >= 0) {
            filters.add(RowFilter.regexFilter(".*" + this.getIdMoneda() + ".*", 6));
        }
        if (txt_iditem.getText().trim().length() > 0) {
            filters.add(RowFilter.regexFilter(".*" + txt_iditem.getText().trim() + ".*", 0));
        }
        if (txt_descripcion.getText().trim().length() > 0) {
            filters.add(RowFilter.regexFilter(".*" + txt_descripcion.getText().trim() + ".*", 1));
        }
        RowFilter fooBarFilter = RowFilter.andFilter(filters);
        return fooBarFilter;
    }

    public void setValueSearch(Object valor, Component comp) {
    }

    protected void cargarCotizacion() {
    }

    protected void cargarVenta(BeanRegcontaCab beanRcc) {
    }

    protected void cargarPedido() {
    }

    protected boolean isCondCredito() {
        return cboCondPago.getSelectedItem().equals("CREDITO");
    }

    protected void loadVendedor() throws SQLException {
    }

    protected void eventCondPago() throws Exception {
    }

    protected void calcFVenc() {
    }

    protected boolean verificarCliente(String opcion) {
        return false;
    }

    protected void nuevoCliente() {
        setCursor(new Cursor(Cursor.WAIT_CURSOR));

        RegisterClienteNuevo register = new RegisterClienteNuevo(frm, usuario);
        register.setPath(path);
        register.setModeRegister(Register.INSERT);
        register.setVisible(true);

        setCursor(new Cursor(Cursor.DEFAULT_CURSOR));

        String codigo = register.getResultado();

        if ((codigo != null) && !codigo.equals("")) {
            Anexo a = new Anexo();
            a.setIdAnexo(codigo);

            cargarCliente(getClientes(a));
        }
    }

    protected void buscarCliente() {
    }

    protected boolean isRegisterValid() throws Exception {
        return false;
    }

    protected void insertDocumento(boolean swDespacho) throws Exception {
    }

    protected void enviarDocumentoSunat(String idRegconta) {
    }

    protected void impresionDocumentoSunat(ContaCab beanRcc, String idRegconta, String idTipoDoc,
            String urlRpt, String urlImgQr) throws Exception {
    }

    protected void validateMontoCabDet(BeanRegcontaCab beanRcc) {
    }

    protected void updateCorreoCliente(RnRegconta logic, String idRegconta) {
    }

    protected int getIdCotizacion() {
        if (beanCotizacion == null) {
            return 0;
        }
        return beanCotizacion.getIdCotizacion();
    }

    protected String getMsgDespacho(BeanRptaVenta beanRptaVenta, boolean swDespacho) {
        String msg = "Documento Generado: " + beanRptaVenta.getVoucher();
        if (!swDespacho) {
            return msg;
        }
        if (beanRptaVenta.getMsgDespacho().isEmpty()) {
            msg += "\n";
            msg += "DOCUMENTO NO SE DESPACHO";
            msg += "\nNO TIENE ASIGNADO SERIE PARA EL PUNTO DE VENTA";
            return msg;
        }
        msg += "\n";
        msg += beanRptaVenta.getMsgDespacho();
        msg += "\nDOCUMENTOS DE DESPACHO";
        String[] docs = beanRptaVenta.getDocumentosDespacho().split(";");
        for (int i = 0; i < docs.length; i++) {
            msg += "\n";
            msg += docs[i];
        }
        return msg;
    }

    protected String getXmlCuenta(Map<String, String> mapCta) throws Exception {
        try {
            Iterator< String> iterador = mapCta.keySet().iterator();
            String xmlCta = "<?xml version=\"1.0\" ?> ";
            xmlCta += "<CTAS>";
            while (iterador.hasNext()) {
                String id_cuenta = iterador.next().trim();
                if (id_cuenta == null || id_cuenta.trim().length() == 0) {
                    throw new Exception("Configura Cuenta de Productos");
                }
                xmlCta += "<CTA>";
                xmlCta += "<ID_CUENTA>" + id_cuenta + "</ID_CUENTA>";
                xmlCta += "</CTA>";
            }
            xmlCta += "</CTAS>";
            logger.info("xmlCta = " + xmlCta);
            return xmlCta;
        } catch (Exception e) {
            throw e;
        }
    }

    protected String getXmlItem(Map<String, String> mapCta) {
        String xmlItem = "<?xml version=\"1.0\" ?> ";
        xmlItem += "<ITEMS>";
        for (int i = 0; i < mdl_venta.getRowCount(); i++) {
            BeanRegcontaItem beanRci = (BeanRegcontaItem) mdl_venta.getRci(i);
            xmlItem += "<ITEM>";
            xmlItem += "<ID_ITEM>" + beanRci.getBeanItem().getIdItem() + "</ID_ITEM>";
            xmlItem += "<ID_CUENTA>" + (xMoneda.get(cbo_moneda.getSelectedIndex()).getIdMoneda().equals(MonedaEnum.SOLES.getValue())
                    ? beanRci.getBeanItem().getCtaVta() : beanRci.getBeanItem().getCtaVtaDolar()) + "</ID_CUENTA>";
            xmlItem += "<M_AFECTO>" + beanRci.getMafecto().toString().replace(".", ",") + "</M_AFECTO>";
            xmlItem += "<M_NOAFECTO>" + beanRci.getMnoafecto().toString().replace(".", ",") + "</M_NOAFECTO>";
            xmlItem += "<P_IGV>" + beanRci.getPigv().toString().replace(".", ",") + "</P_IGV>";
            xmlItem += "<M_IGV>" + beanRci.getMigv().toString().replace(".", ",") + "</M_IGV>";
            xmlItem += "<MONTO>" + beanRci.getMonto().toString().replace(".", ",") + "</MONTO>";
            xmlItem += "<P_PERCEPCION>" + beanRci.getPpercepcion().toString().replace(".", ",") + "</P_PERCEPCION>";
            xmlItem += "<M_PERCEPCION>" + beanRci.getMpercepcion().toString().replace(".", ",") + "</M_PERCEPCION>";
            xmlItem += "<CANTIDAD>" + beanRci.getCantidad().toString().replace(".", ",") + "</CANTIDAD>";
            xmlItem += "<ID_ALMACEN>" + beanRci.getBeanAlmacen().getIdAlmacen() + "</ID_ALMACEN>";
            xmlItem += "<PRECIO>" + beanRci.getPrecio().toString().replace(".", ",") + "</PRECIO>";
            xmlItem += "<FLAG_AUTORIZADO>" + beanRci.getFlagAutorizado() + "</FLAG_AUTORIZADO>";
            xmlItem += "<ID_UM>" + beanRci.getBeanItem().getBeanUmStock().getIdUm() + "</ID_UM>";
            xmlItem += "<ID_COTIZACION_DET>" + beanRci.getId_cotizacion_det() + "</ID_COTIZACION_DET>";
            xmlItem += "<ID_PEDIDO_DET>" + beanRci.getId_pedido_det() + "</ID_PEDIDO_DET>";
            xmlItem += "<TIPO_OPERACION_IGV>" + beanRci.getBeanItem().getTipoOperacionIgv() + "</TIPO_OPERACION_IGV>";
            xmlItem += "<TIPO_AFECTACION_IGV>" + beanRci.getBeanItem().getTipoAfectacionIgv() + "</TIPO_AFECTACION_IGV>";
            xmlItem += "<DESC_ITEM_FACT>" + this.getDescripcionItem(beanRci) + "</DESC_ITEM_FACT>";
            xmlItem += "</ITEM>";
            mapCta.put((xMoneda.get(cbo_moneda.getSelectedIndex()).getIdMoneda().equals(MonedaEnum.SOLES.getValue())
                    ? beanRci.getBeanItem().getCtaVta().trim() : beanRci.getBeanItem().getCtaVtaDolar().trim()), "");
        }
        xmlItem += "</ITEMS>";
        logger.info("xmlItem = " + xmlItem);
        return xmlItem;
    }

    protected String getDescripcionItem(BeanRegcontaItem beanRci) {
        if (Constans.IS_EDIT_DESCRIPCION_ITEM_VENTA) {
            return beanRci.getBeanItem().getDescripcion();
        }
        return "";
    }

    protected BeanRegcontaCab getRcc() {
        BeanRegcontaCab beanRcc = new BeanRegcontaCab();
        BeanAnexo beanAnexo = new BeanAnexo();
        BeanTipoAnexo beanTipoAnexo = new BeanTipoAnexo();
        BeanAnexo beanAnexoRef = new BeanAnexo();
        BeanMoneda beanMoneda = new BeanMoneda();
        BeanTipoDocVenta beanTipoDocVenta = new BeanTipoDocVenta();
        BeanTrabajador beanTrabajador = new BeanTrabajador();
        beanRcc.setIdEmpresa(usuario.getCodempresa());
        beanRcc.setIdLocalidad(usuario.getCodlocalidad());
        beanAnexo.setIdAnexo(txt_idclienteficticio.getText().trim());
        beanTipoAnexo.setIdTipoAnexo("2");
        beanAnexo.setBeanTipoAnexo(beanTipoAnexo);
        beanTrabajador.setId_trabajador(usuario.getId_trabajador());
        beanTrabajador.setNombre(usuario.getTrabajador());
        beanRcc.setBeanTrabajador(beanTrabajador);
        BeanCondicionPago beanCondicionPago = new BeanCondicionPago();
        beanCondicionPago.setDescripcion(cboCondPago.getSelectedItem().toString());
        beanRcc.setBeanCondicionPago(beanCondicionPago);
        beanRcc.setIdPuntoVenta(usuario.getCodpuntoventa());
        BeanPuntoVenta beanPuntoVenta = new BeanPuntoVenta();
        beanPuntoVenta.setId_punto_venta(usuario.getCodpuntoventa());
        beanPuntoVenta.setDireccion(usuario.getDireccionPuntoVenta());
        beanRcc.setBeanPuntoVenta(beanPuntoVenta);
        beanRcc.setIdCondicionVenta((cboCondPago.getSelectedItem().toString().trim().equals("CONTADO") ? "17" : (cboCondPago.getSelectedItem().toString().trim().equals("CREDITO") ? "22" : (cboCondPago.getSelectedItem().toString().trim().equals("OPERACION BANCARIA") ? "26" : "27"))));
        beanMoneda.setIdMoneda(xMoneda.get(cbo_moneda.getSelectedIndex()).getIdMoneda());
        beanRcc.setBeanMoneda(beanMoneda);
        beanTipoDocVenta.setIdTipoDoc(xTipoDocVenta.get(cboTipoDocumento.getSelectedIndex()).getIdTipoDoc());
        beanRcc.setBeanTipoDocVenta(beanTipoDocVenta);
        beanRcc.setSerie(cboSerie.getSelectedItem().toString());
        beanRcc.setPreimpreso(txt_preimpreso.getText().toLowerCase());
        if (Constans.ISPG && txt_rucficticio.getText().trim().equalsIgnoreCase("00000000")) {
            beanAnexo.setDescripcion(this.txtClienteTemporal.getText());
        } else {
            beanAnexo.setDescripcion(cbo_clienteficticio.getSelectedItem().toString().trim());
        }
        beanAnexo.setDireccion(txt_direccionficticio.getText().trim());
        beanAnexo.setNumero(txt_rucficticio.getText().trim());
        beanRcc.setTipoCambio(new BigDecimal(txt_tipocambio.getText().trim()));
        beanRcc.setBeanAnexo(beanAnexo);
        beanRcc.setAfecto(new BigDecimal(txt_afecto.getText().trim()));
        beanRcc.setNoafecto(new BigDecimal(txt_noafecto.getText().trim()));
        beanRcc.setPIgv(porcIgv);
        beanRcc.setMIgv(new BigDecimal(txt_igv.getText().trim()));
        beanRcc.setMonto(new BigDecimal(txt_total.getText().trim()));
        beanRcc.setmRetencion(this.getMontoRetencion());
        beanRcc.setpRetencion(Constans.PORC_RETENCION);
        beanRcc.setMontoInafecto(BigDecimal.ZERO);
        beanRcc.setMontoExonerado(BigDecimal.ZERO);
        beanRcc.setPPercepcion(new BigDecimal(txt_percepcion.getText().trim()).divide(new BigDecimal(txt_total.getText().trim()), numeroDecimales, RoundingMode.HALF_UP));
        beanRcc.setMPercepcion(new BigDecimal(txt_percepcion.getText().trim()));
        beanRcc.setFEmision(dc_femision.getDate());
        beanRcc.setFVencimiento(dc_fvencimiento.getDate());
        beanRcc.setIdAuxiliar(AuxiliarEnum.VENTA.getValue());
        SimpleDateFormat formatoMes = new SimpleDateFormat("MM");
        SimpleDateFormat formatoAnio = new SimpleDateFormat("yyyy");
        beanRcc.setAnio(formatoAnio.format(dc_femision.getDate()));
        beanRcc.setMes(formatoMes.format(dc_femision.getDate()));
        beanRcc.setIdTipoOperacion(idTipoOperacion);
        BeanEstadoDocumento beanEstadoDocumento = new BeanEstadoDocumento();
        beanEstadoDocumento.setIdEstado("003");
        beanRcc.setBeanEstadoDocumento(beanEstadoDocumento);
        beanRcc.setEstado("A");
        beanRcc.setIdTipoPago((cbo_mediopago.getItemCount() == 0 ? "" : (cbo_mediopago.getSelectedItem().equals("EFECTIVO MN") ? "001" : (cbo_mediopago.getSelectedItem().equals("TARJETA DINNER") ? "004" : (cbo_mediopago.getSelectedItem().equals("TARJETA MC PROCESS") ? "005" : (cbo_mediopago.getSelectedItem().equals("TARJETA VISA") ? "002" : ""))))));
        beanAnexoRef.setIdAnexo(txt_idclientereal.getText().trim());
        beanAnexoRef.setDescripcion(txt_cliente.getText().trim());
        beanAnexoRef.setDireccion(txtDireccionReal.getText().trim());
        beanAnexoRef.setNumero(txt_rucreal.getText().trim());
        beanRcc.setBeanAnexoRef(beanAnexoRef);
        beanRcc.setIdVendedor(listaV.get(cbo_idvendedor.getSelectedIndex()).getID_VENDEDOR());
        beanRcc.setIdUsuario(usuario.getId_usuario());
        beanRcc.setIdUsuarioAutoriza("");
        UsuarioCorrelativo userCorre = (UsuarioCorrelativo) xCorrelativo.get(cboSerie.getSelectedIndex());
        beanRcc.setIdCorrelativo(userCorre.getIdCorrelativo());
        beanRcc.setLineaImpresion(userCorre.getLineaImpresion());
        beanRcc.setFlagPromocion((chk_promocion.isSelected() ? "S" : "N"));
        UsuarioCorrelativo uCorrelativo = this.getUsuarioCorrelativo();
        beanRcc.setNumeroAutorizacion(uCorrelativo != null ? uCorrelativo.getNumeroAutorizacion() : "");
        beanRcc.setCodigoMaquina(uCorrelativo != null ? uCorrelativo.getCodigoMaquina() : "");
        beanRcc.setTipoOperacionIgv(TIPOOPERIGV.getText());
        beanRcc.setMontoInafecto(new BigDecimal(txtMontoInafecto.getText().trim()));
        beanRcc.setMontoExonerado(new BigDecimal(txtMontoExonerado.getText().trim()));
        return beanRcc;
    }

    protected BigDecimal getMontoRetencion() {
        if (!Constans.IS_RETENCION_VENTA_CLIENTE) {
            return BigDecimal.ZERO;
        }
        if (!chkAgRetencion.isSelected()) {
            return BigDecimal.ZERO;
        }
        BigDecimal mRetencion = new BigDecimal(txtTotalRetencion.getText().trim());
        return mRetencion;
    }

    protected void changeTipoOperIgv() {
        String actualTipoOperIgv = this.cboTipoOperIgv.getSelectedItem().toString();
        if (!actualTipoOperIgv.equalsIgnoreCase(TIPOOPERIGV.getText()) && (actualTipoOperIgv.equalsIgnoreCase("EXPORTACION") || actualTipoOperIgv.equalsIgnoreCase("EXONERADA"))) {
            this.limpiarVenta();
        } else if (!actualTipoOperIgv.equalsIgnoreCase(TIPOOPERIGV.getText()) && (TIPOOPERIGV.getText().equalsIgnoreCase("EXPORTACION") || TIPOOPERIGV.getText().equalsIgnoreCase("EXONERADA")) && (actualTipoOperIgv.equalsIgnoreCase("NORMAL") || actualTipoOperIgv.equalsIgnoreCase("GRATUITA") || actualTipoOperIgv.equalsIgnoreCase("INAFECTO_MUESTRA_MEDICA"))) {
            this.limpiarVenta();
        }
        TIPOOPERIGV.setText(this.cboTipoOperIgv.getSelectedItem().toString());
    }

    protected UsuarioCorrelativo getUsuarioCorrelativo() {
        if (cboSerie.getSelectedIndex() >= 0) {
            return xCorrelativo.get(cboSerie.getSelectedIndex());
        }
        return null;
    }

    protected void imprimirDocumentoNotSunat(BeanRegcontaCab beanRcc, String idRegconta) throws Exception {
    }

    protected boolean isImpresion(BeanRegcontaCab beanRcc) {
        if (!Constans.IS_FACTURADOR_SUNAT) {
            return true;
        }
        String digitSerie = beanRcc.getSerie().substring(0, 1);
        return Util.isNumber(digitSerie);
    }

    protected void impresionContinua(String idRegconta, String idTipoDoc) throws Exception {
    }

    protected void impresionNormal(BeanRegcontaCab beanRcc, String idRegconta, String idTipoDoc)
            throws Exception {
    }

    protected DataSourceVenta getDataSourceVenta(BeanRegcontaCab beanRcc) {
        if (Constans.SWCONVERSION) {
            return this.getDataSourceVentaConversion(beanRcc);
        }
        return this.getDataSourceVentaNormal(beanRcc);
    }

    protected DataSourceVenta getDataSourceVentaConversion(BeanRegcontaCab beanRcc) {
        if (listConversion.isEmpty()) {
            return this.getDataSourceVentaNormal(beanRcc);
        }
        DataSourceVenta dataSource = new DataSourceVenta();
        for (int i = 0; i < listConversion.size(); i++) {
            BeanVentaConversion bean = listConversion.get(i);
            BeanRegcontaItem beanRci = new BeanRegcontaItem();
            beanRci.setCantidad(bean.getCantidad());
            beanRci.setPrecio(bean.getTotal().divide(bean.getCantidad(), 5, RoundingMode.CEILING));
            beanRci.setMonto(bean.getTotal());
            beanRci.setBeanRegcontaCab(beanRcc);
            BeanItem beanItem = new BeanItem(bean.getDescripcion());
            BeanUnidadMedida beanUm = new BeanUnidadMedida("", "");
            beanItem.setBeanUmStock(beanUm);
            BeanMarca beanMarca = new BeanMarca("", "");
            beanItem.setBeanMarca(beanMarca);
            beanRci.setBeanItem(beanItem);
            dataSource.add(beanRci);
        }
        return dataSource;
    }

    protected DataSourceVenta getDataSourceVentaNormal(BeanRegcontaCab beanRcc) {
        DataSourceVenta dataSource = new DataSourceVenta();
        for (int i = 0; i < mdl_venta.getRowCount(); i++) {
            BeanRegcontaItem beanRci = mdl_venta.getRci(i);
            beanRci.setBeanRegcontaCab(beanRcc);
            dataSource.add(beanRci);
        }
        return dataSource;
    }

    protected String getXmlContacto() {
        String xmlContacto = "<?xml version=\"1.0\" ?> ";
        xmlContacto += "<CONTACTOS>";
        for (int i = 0; i < modeltableContacto.getRowCount(); i++) {
            xmlContacto += "<CONTACTO>";
            xmlContacto += "<NOMBRE>" + modeltableContacto.getContacto(i).getContacto() + "</NOMBRE>";
            xmlContacto += "<TELEF>" + modeltableContacto.getContacto(i).getTelef() + "</TELEF>";
            xmlContacto += "<CORREO>" + modeltableContacto.getContacto(i).getCorreo() + "</CORREO>";
            xmlContacto += "</CONTACTO>";
        }
        xmlContacto += "</CONTACTOS>";
        logger.info("xmlContacto: " + xmlContacto);
        return xmlContacto;
    }

    protected BeanPedidoCab getPedido() {
        return null;
    }

    protected boolean isEmptyDocument(String idTipoDoc) throws Exception {
        return false;
    }

    protected void guardarDocumento() {
    }

    protected void validateDocumento(boolean swDespacho) throws Exception {
    }

    protected boolean swAutorizarDocumento() {
        if (!this.swAutorizado()) {
            FormAutorizar formAutorizar = new FormAutorizar(frm, xCorrelativo.get(cboSerie.getSelectedIndex()).getIdCorrelativo(), path);
            formAutorizar.setVisible(true);
            return formAutorizar.isSwAutorizar();
        }
        return true;
    }

    protected boolean swAutorizado() {
        if (!Constans.IS_AUTORIZAR_PRECIO) {
            return true;
        }
        Iterator<BeanRegcontaItem> iterador = mdl_venta.getData().iterator();
        boolean autorizado = true;
        while (iterador.hasNext()) {
            if (iterador.next().getFlagAutorizado().equalsIgnoreCase("N")) {
                autorizado = false;
                break;
            }
        }
        return autorizado;
    }

    protected boolean pregDocumento() {
        return false;
    }

    protected boolean continuePedido() throws Exception {
        try {
            if (this.beanPedido != null) {
                return true;
            }
            if (!Constans.SWPEDIDO) {
                return true;
            }
            if (this.isEmptyDocument("PD")) {
                return this.pregContinue("No tiene Serie para Registrar Pedido\nDesea Continuar sin Registrar Pedido");
            }
            return true;
        } catch (Exception e) {
            throw e;
        }
    }

    protected void agregarVentaConversion() {
    }

    protected Map<String, Boolean> continueDespacho() throws Exception {
        try {
            Map<String, Boolean> mapRpta = new HashMap();
            mapRpta.put("respuesta", true);
            mapRpta.put("despacho", false);
            boolean swRpta;
            logger.debug("isDespacho Automatico: " + Constans.SWDESPACHO);
            if (!Constans.SWDESPACHO) {
                return mapRpta;
            }
            if (this.isEmptyDocument("NS")) {
                mapRpta.put("respuesta", this.pregContinue("No tiene Serie para Registrar Despacho\nDesea Continuar sin Registrar Despacho"));
                return mapRpta;
            }
            swRpta = this.pregContinue("Desea Registrar Despacho");
            mapRpta.put("despacho", swRpta);
            return mapRpta;
        } catch (Exception e) {
            throw e;
        }
    }

    protected boolean pregContinue(String preg) {
        return false;
    }

    protected void guardarVentaF5() {
    }

    protected void cotizacion() {
    }

    protected void buscarVenta() {
    }

    public void registerTipoCambio() {
    }

    protected java.sql.Date getFechaServer() throws InstantiationException, IllegalAccessException, Exception {
        return null;
    }

    @Override
    public void actionPerformed(ActionEvent e) {
        try {
            if (e.getSource().equals(btnCotizacion)) {
                this.cotizacion();
            }
            if (e.getSource().equals(btnCopia)) {
                this.buscarVenta();
            }
            if (btn_guardar == e.getSource()) {
                guardarVentaF5();
            }

            if (btn_quitar == e.getSource()) {
                if (tbl_venta.getSelectedRow() >= 0) {
                    int xres = JOptionPane.showConfirmDialog(this, "Desea eliminar el item?", "Eliminar Item", JOptionPane.OK_CANCEL_OPTION);

                    if (xres == JOptionPane.OK_OPTION) {
                        mdl_venta.eliminarRci(tbl_venta.convertRowIndexToModel(tbl_venta.getSelectedRow()));
                        CTableFx.setAllColumnPreferredWidth(tbl_venta);
                    }
                } else {
                    JOptionPane.showMessageDialog(frm, "Para eliminar un item primero debe seleccionar la fila.", "Eliminar Item", JOptionPane.INFORMATION_MESSAGE);
                }
                this.txt_descripcion.requestFocus();
            }

            if (e.getSource().equals(btnRefrescar)) {
                cargarTabla();
            }

            if (e.getSource() == btnNuevo) {
                if (tbl_venta.getRowCount() == 0) {
                    JOptionPane.showMessageDialog(this, "La venta ya esta limpia.", "Limpiar Venta", JOptionPane.INFORMATION_MESSAGE);
                    txt_descripcion.requestFocus();
                } else {
                    int xres = JOptionPane.showConfirmDialog(this, "Desea limpiar la venta?", "Limpiar venta", JOptionPane.OK_CANCEL_OPTION);

                    if (xres == JOptionPane.OK_OPTION) {
                        limpiarVenta();
                    }
                }
            }

            if (e.getSource() == btn_agregar) {
                procesoAgregar();
            }

            if (e.getSource() == btn_buscar) {
                filtrarTablaProducto();
            }
            if (txt_diaspago == e.getSource()) {
                calcFVenc();
            }
            if (cbo_clienteficticio == e.getSource()) {
                if (cbo_clienteficticio.getItemCount() > 0) {
                    txt_idclienteficticio.setText(lst_anexogrupo.get(cbo_clienteficticio.getSelectedIndex()).getIdAnexo());
                    txt_direccionficticio.setText(lst_anexogrupo.get(cbo_clienteficticio.getSelectedIndex()).getDireccion());
                    txt_rucficticio.setText(lst_anexogrupo.get(cbo_clienteficticio.getSelectedIndex()).getNumerodoc());
                } else {
                    txt_idclienteficticio.setText("");
                    txt_direccionficticio.setText("");
                    txt_rucficticio.setText("");
                }
            }
            if (btn_buscarcliente == e.getSource()) {
                buscarCliente();
            }
            if (btn_nuevocliente == e.getSource()) {
                nuevoCliente();
            }
            if (btnGuardar == e.getSource()) {
                guardarDocumento();
            }
            if (e.getSource().equals(btn_cancelar)) {
                blnClickAceptar = false;
                tabb.setSelectedIndex(0);
            }
            if (e.getSource().equals(btnAgregarContacto)) {
                insertarContacto();
            }
            if (e.getSource().equals(btnQuitarContacto)) {
                quitarContacto();
            }
        } catch (Exception ex) {
            ExceptionHandler.handleException(ex, logger);
            JOptionPane.showMessageDialog(this, ex.getMessage());
        }
    }

    protected void actualizarCorrelativo() {
    }

    protected void mostrarPreimpreso() {
    }

    protected void loadSerieCorrelativo(String ls_IdTipoDoc) throws Exception {
    }

    protected void calcularImportes() {
    }

    protected void cotPed() {
        boolean swCotPed = (chkCotizacion.isSelected() || chkPedido.isSelected());
        btnCotizacion.setVisible(swCotPed);
        cboMoneda.setEnabled(!swCotPed);
        btn_agregar.setEnabled(!swCotPed || Constans.ISCOTIZACIONEDIT);
        mdl_venta.setSwCotizacionPedido(swCotPed && !Constans.ISCOTIZACIONEDIT);
        this.configTableVenta(swCotPed && !Constans.ISCOTIZACIONEDIT);
        CTableFx.setAllColumnPreferredWidth(tbl_venta);
    }

    protected void loadPublicGeneral() {
    }

    protected void changedTipoDoc() {
        if (cboTipoDocumento.getItemCount() == 0) {
            return;
        }
        String idTipoDoc = xTipoDocVenta.get(cboTipoDocumento.getSelectedIndex()).getIdTipoDoc();
        if (idTipoDoc.equals(idTipoDocCbo)) {
            return;
        }
        idTipoDocCbo = idTipoDoc;
        actualizarCorrelativo();
    }

    @Override
    public void itemStateChanged(ItemEvent e) {
        try {
            if (cboTipoDocumento == e.getSource()) {
                this.changedTipoDoc();
            }
            if (cboCondPago == e.getSource()) {
                eventCondPago();
            }
            if (cboSerie == e.getSource()) {
                if (cboSerie.getItemCount() > 0) {
                    mostrarPreimpreso();
                }
            }
            if (e.getSource().equals(cboTipoOperIgv)) {
                changeTipoOperIgv();
            }

            if (e.getSource().equals(chkCotizacion)) {
                if (chkCotizacion.isSelected()) {
                    chkPedido.setSelected(false);
                }
                changeCotizacion();
                cotPed();
            }
            if (e.getSource().equals(chkPedido)) {
                if (chkPedido.isSelected()) {
                    chkCotizacion.setSelected(false);
                }
                changePedido();
                cotPed();
            }
            if (e.getSource().equals(cboMoneda)) {
                filtrarTablaProducto();
                cboPrecio.removeAllItems();
                cboPrecio.updateUI();
                cbo_moneda.setSelectedIndex(cboMoneda.getSelectedIndex());
                cbo_cancelaen.setSelectedIndex(cboMoneda.getSelectedIndex());
            }
            if (e.getSource().equals(chk_publicogeneral)) {
                if (!flag) {
                    if (chk_publicogeneral.isSelected()) {
                        loadPublicGeneral();
                    } else {
                        txt_idclientereal.setText("");
                        txt_cliente.setText("");
                        txt_rucreal.setText("");
                        txtDireccionReal.setText("");
                        cbo_clienteficticio.removeAllItems();
                        lst_anexogrupo.clear();
                        if (com.softcommerce.util.Constans.ISPG) {
                            this.txtClienteTemporal.setVisible(false);
                            this.cbo_clienteficticio.setVisible(true);
                        }
                    }
                }
            }
            if (e.getSource().equals(cboModVta)) {
                cboModDespacho.setSelectedIndex(0);
                if (cboModVta.getSelectedIndex() == 0) {
                    cboModDespacho.setEnabled(false);
                    dc_fdespacho.setEnabled(false);
                } else {
                    cboModDespacho.setEnabled(true);
                    dc_fdespacho.setEnabled(true);
                }
            }
            if (e.getSource().equals(cboDepartamento)) {
                this.changeDepartamento();
            }
            if (e.getSource().equals(cboProvincia)) {
                this.changeProvincia();
            }
            if (e.getSource().equals(cboDistrito)) {
                this.changeDistrito();
            }
        } catch (Exception ex) {
            ExceptionHandler.handleException(ex, logger);
            JOptionPane.showMessageDialog(this, ex.getMessage());
        }
    }

    protected void changeAgRetencion(Anexo cliente) {
        txtTotalRetencion.setText("0.0");
        if (!Constans.IS_RETENCION_VENTA_CLIENTE) {
            return;
        }
        String flagAgRetencion = cliente.getFlagretencion() == null ? "N" : cliente.getFlagretencion();
        boolean isAgRetencion = flagAgRetencion.equals("S");
        logger.info("Ag Retencion: " + isAgRetencion);
        chkAgRetencion.setSelected(isAgRetencion);
        lblTotalRetencion.setVisible(isAgRetencion);
        txtTotalRetencion.setVisible(isAgRetencion);
        this.calcularMontoRetencion();
    }

    protected void calcularMontoRetencion() {
    }

    protected boolean cargarCliente(List<Anexo> reg) {
        return false;
    }

    @Override
    public void valueChanged(ListSelectionEvent e) {
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

    @Override
    public void keyTyped(KeyEvent e) {
    }

    public void controlClose() {
    }

    public void restaurarInternalFrame() {
    }

    @Override
    public void insertUpdate(DocumentEvent e) {
        if (e.getDocument().equals(txt_cliente.getDocument())) {
            txtContacto.setText(txt_cliente.getText());
        }
        if (e.getDocument().equals(txtDireccionReal.getDocument())) {
            txtDireccionDespacho.setText(txtDireccionReal.getText());
        }
    }

    @Override
    public void removeUpdate(DocumentEvent e) {
        if (e.getDocument().equals(txt_cliente.getDocument())) {
            txtContacto.setText(txt_cliente.getText());
        }
        if (e.getDocument().equals(txtDireccionReal.getDocument())) {
            txtDireccionDespacho.setText(txtDireccionReal.getText());
        }
    }

    @Override
    public void changedUpdate(DocumentEvent e) {
        if (e.getDocument().equals(txt_cliente.getDocument())) {
            txtContacto.setText(txt_cliente.getText());
        }
        if (e.getDocument().equals(txtDireccionReal.getDocument())) {
            txtDireccionDespacho.setText(txtDireccionReal.getText());
        }
    }

    @Override
    public void stateChanged(ChangeEvent e) {
        if (e.getSource() == tabb) {
            if (tabb.getSelectedIndex() == 0) {
                tabb.setEnabledAt(1, false);
                tabb.setEnabledAt(2, false);
            }
        }
    }

    public JTextField getTxt_descripcion() {
        return txt_descripcion;
    }

    @Override
    public void propertyChange(PropertyChangeEvent evt) {
        if ((evt.getSource() == dc_femision)) {
            changeFechaEmision();
        }
    }

}
