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

    private final Main frm;
    private JComboBox cboPrecio;
    private JComboBox cboMoneda;
    private CButton btn_guardar;
    private CButton btnNuevo;
    private JButton btn_buscar;
    private JButton btnRefrescar;
    private CButton btn_agregar;
    private CButton btn_quitar;
    private JTable tbl_venta;
    private TableModelRegcontaItem mdl_venta;
    private CTable tbl_producto;
    private TableModelItemVenta mdl_producto;
    private TableRowSorter<TableModelItemVenta> modeloOrdenadoProducto;
    private CTable tbl_almacen;
    private TableModelItemAlmacen mdl_almacen;
    private JTextField txt_descripcion;
    private JTextField txt_iditem;
    private JTextField txtMaximoProductos;
    private JTextField txtAfecto;
    private JTextField txtNoafecto;
    private JTextField txtIgv;
    private JTextField txtDescuento;
    private JTextField txtMonto;
    private JTextField txtPercepcion;
    private JTextField txt_cantidad;
    private final Usuario usuario;
    private final URL path;
    private JTextField txtCostoCompra;
    private PrecioMinimo validPrecio;
    private JCheckBox checkAutorizado;
    private ComboBoxEditorPrecio editorPrecio;
    private ComboModelPrecio cboModelPrecio;
    private final CuadroMensaje cuadro;
    private JTextField txtPesoTotal;
    private Map<String, BeanPrecioItem> mapPrecio;
    private JCheckBox chkCotizacion;
    private JCheckBox chkPedido;
    private JCheckBox chkAgRetencion;
    private JButton btnCotizacion;
    private JButton btnCopia;
    private BeanCotizacionCab beanCotizacion;
    private BeanPedidoCab beanPedido;
    private BigDecimal porcIgv;
    private int maxProd;
    private BigDecimal paramValorBoletaDNI;
    private BigDecimal paramValorPercepcion;
    private int numeroDecimales;
    private String idItem = "";
    private List<BeanMoneda> xMoneda;
    private JTabbedPane tabb;
    private JComboBox cboTipoDocumento;
    private JComboBox cboSerie;
    private JTextField txt_preimpreso;
    private JDateChooser dc_femision;
    private JTextField txt_diaspago;
    private JDateChooser dc_fvencimiento;
    private JComboBox cboCondPago;
    private JTextField txt_tipocambio;
    private JComboBox cbo_moneda;
    private JComboBox cbo_cancelaen;
    private JComboBox cbo_mediopago;
    private JCheckBox chk_publicogeneral;
    private JButton btn_nuevocliente;
    private JTextField txt_idclientereal;
    private JTextField txtDireccionReal;
    private JTextField txtCorreoCliente;
    private JTextField txt_direccionficticio;
    private JTextField txt_idclienteficticio;
    private JComboBox cbo_clienteficticio;
    private JTextField txt_rucficticio;
    private JButton btn_buscarcliente;
    private Gif gif;
    private JCheckBox chk_promocion;
    private JTextField txt_cliente;
    private JTextField txt_rucreal;
    private JTextField txt_recibo;
    private JTextField txt_vuelto;
    private JButton btn_cancelar;
    private JButton btnGuardar;
    private JComboBox cbo_idvendedor;
    private JTextField txt_igv;
    private JTextField txt_idtrabajador;
    private JTextField txt_trabajador;
    private JTextField txt_total;
    private JTextField txt_valorventa;
    private JTextField txt_descuento;
    private JTextField txt_afecto;
    private JTextField txt_noafecto;
    private JTextField txt_percepcion;
    private JTextField txtTotalCobrar;
    private JLabel lblTotalRetencion;
    private JTextField txtTotalRetencion;
    private List<BeanTipoDocVenta> xTipoDocVenta;
    private boolean blnClickAceptar = false;
    private int numero = -1;
    private List<UsuarioCorrelativo> xCorrelativo;
    private List<BeanVendedor> listaV;
    private String idTipoOperacion;
    private boolean flag = false;
    private List<Anexo> lst_anexogrupo;
    private JDateChooser dc_fdespacho;
    private JComboBox cboModVta;
    private JComboBox cboModDespacho;
    private JTextField txtObser1;
    private JTextField txtObser2;
    private JComboBox cboDepartamento;
    private JComboBox cboProvincia;
    private JComboBox cboDistrito;
    private JComboBox cboZona;
    private JTextField txtDireccionDespacho;
    private JButton btnAgregarContacto;
    private JButton btnQuitarContacto;
    private CTable tableContacto;
    private PedidoContactoTableModel modeltableContacto;
    private JTextField txtContacto;
    private JTextField txtTelef;
    private JTextField txtCorreo;
    private List<BeanVentaConversion> listConversion = new ArrayList();
    private JTextField txtClienteTemporal;
    private final JPanel pnlEastMaxRefresh = new JPanel();
    private final Logger logger = Logger.getLogger(UiRegisterVentaDirecta.class);
    private JComboBox cboTipoOperIgv;
    private final JLabel TIPOOPERIGV = new JLabel("NORMAL");
    private final JTextField txtMontoInafecto = new JTextField(BigDecimal.ZERO.toString());
    private final JTextField txtMontoExonerado = new JTextField(BigDecimal.ZERO.toString());
    private TipoOperacion tipoOperacionVenta = null;
    private BeanTipoCambio tipoCambioFecha = null;
    private String idTipoDocCbo = "";

    public UiRegisterVentaDirecta(Main frm, String title, Usuario usuario, java.net.URL path) {
        super(title);
        cuadro = new CuadroMensaje(usuario);
        this.path = path;
        this.frm = frm;
        this.usuario = usuario;
        inicialize();
        initListener();
    }

    private void inicialize() {
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

    private JPanel getPnlProducto() {
        JPanel pnl = new JPanel();
        pnl.setLayout(new BorderLayout());

        pnl.add(this.getPnlProductoNorth(), BorderLayout.NORTH);
        pnl.add(this.getPnlProductoSouth(), BorderLayout.SOUTH);
        pnl.add(this.getPnlProductoCenter(), BorderLayout.CENTER);
        return pnl;
    }

    private JPanel getPnlProductoCenter() {
        JPanel pnlCenter = new JPanel();
        pnlCenter.setLayout(new BorderLayout());
        pnlCenter.setBackground(new Color(245, 245, 245));

        pnlCenter.add(this.getPnlProductoTable(), BorderLayout.CENTER);
        pnlCenter.add(this.getPnlProductoAlmacen(), BorderLayout.EAST);
        return pnlCenter;
    }

    private JPanel getPnlProductoSouth() {
        JPanel pnlSouth = new JPanel();
        pnlSouth.setLayout(new BorderLayout());
        pnlSouth.setBackground(new Color(245, 245, 245));

        pnlSouth.add(this.getPnlVenta(), BorderLayout.CENTER);

        pnlSouth.add(this.getPnlVenta(), BorderLayout.CENTER);
        return pnlSouth;
    }

    private JPanel getPnlProductoNorth() {
        JPanel pnlNorth = new JPanel();
        pnlNorth.setLayout(new BorderLayout());
        pnlNorth.setBackground(new Color(245, 245, 245));

        pnlNorth.add(this.getPnlFiltro(), BorderLayout.WEST);
        pnlNorth.add(pnlEastMaxRefresh, BorderLayout.EAST);
        return pnlNorth;
    }

    private JPanel getPnlFiltro() {
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

    private JPanel getPnlVenta() {
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

    private JPanel getPnlMontos() {
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

    private JPanel getPnlProductoTable() {
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

    private JPanel getPnlProductoAlmacen() {
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

    private JPanel getPnlProductoOpciones() {
        JPanel pnlOpc = new JPanel();
        pnlOpc.setLayout(new BorderLayout());
        pnlOpc.setOpaque(false);

        JPanel pnl_botones = new JPanel(new FlowLayout(FlowLayout.LEFT, 14, 5));
        pnlOpc.add(pnl_botones, BorderLayout.CENTER);
        pnlOpc.add(this.getPnlProductoValores(), BorderLayout.WEST);
        pnl_botones.setOpaque(false);

        btn_agregar = new CButton("(F8) Agregar Item", gif.ADDORANGE, "Agregar Item", 'B');
        btn_quitar = new CButton("(F9) Quitar Item", gif.DELETERED, "Quitar Item", 'B');
        btn_guardar = new CButton("(Ctrl) Guardar Venta", gif.SAVE16, "Guardar Venta", 'B');
        btnNuevo = new CButton("(F6) Limpiar Venta", gif.NEW16, "Limpiar Venta", 'B');

        btn_agregar.registerKeyboardAction(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                btn_quitar.requestFocus();
            }
        }, KeyStroke.getKeyStroke(KeyEvent.VK_ENTER, 0, false), JComponent.WHEN_FOCUSED);
        btn_quitar.registerKeyboardAction(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                btn_guardar.requestFocus();
            }
        }, KeyStroke.getKeyStroke(KeyEvent.VK_ENTER, 0, false), JComponent.WHEN_FOCUSED);
        btn_guardar.registerKeyboardAction(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                btnNuevo.requestFocus();
            }
        }, KeyStroke.getKeyStroke(KeyEvent.VK_ENTER, 0, false), JComponent.WHEN_FOCUSED);
        btnNuevo.registerKeyboardAction(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                txt_descripcion.requestFocus();
            }
        }, KeyStroke.getKeyStroke(KeyEvent.VK_ENTER, 0, false), JComponent.WHEN_FOCUSED);

        pnl_botones.add(btn_agregar);
        pnl_botones.add(btn_quitar);
        pnl_botones.add(btn_guardar);
        pnl_botones.add(btnNuevo);
        return pnlOpc;
    }

    private JPanel getPnlProductoValores() {
        JPanel pnlProductoSouth = new JPanel(new FlowLayout(FlowLayout.LEADING, 14, 5));
        pnlProductoSouth.setBackground(new Color(245, 245, 245));

        JLabel lbl_cantidad = new JLabel("CANT");
        lbl_cantidad.setFont(new Font("Helvetica", Font.BOLD, 13));
        pnlProductoSouth.add(lbl_cantidad);

        txt_cantidad = new JTextField();
        txt_cantidad.addKeyListener(this);
        txt_cantidad.addFocusListener(this);
        txt_cantidad.setDocument(new DoubleDocument());
        txt_cantidad.setColumns(7);
        txt_cantidad.setFont(new Font("Helvetica", Font.BOLD, 13));
        pnlProductoSouth.add(txt_cantidad);

        JLabel lbl_precio = new JLabel("PRECIO");
        lbl_precio.setFont(new Font("Helvetica", Font.BOLD, 13));
        pnlProductoSouth.add(lbl_precio);
        cboPrecio = new JComboBox();
        cboPrecio.setPreferredSize(new Dimension(70, 25));
        validPrecio = new PrecioMinimo(checkAutorizado, cboPrecio);
        cboPrecio.addKeyListener(this);
        cboPrecio.setEditable(true);
        editorPrecio = new ComboBoxEditorPrecio();
        cboPrecio.setEditor(editorPrecio);
        cboPrecio.addFocusListener(new FocusAdapter() {
            @Override
            public void focusLost(FocusEvent arg0) {
                String valor = ((JTextComponent) cboPrecio.getEditor().getEditorComponent()).getText();
                int punto = valor.indexOf(".");
                if (valor.substring(punto).length() > 2) {
                    cuadro.CuadroAviso("Debe registrar máximo 2 dígitos decimales", JOptionPane.WARNING_MESSAGE);
                    cboPrecio.requestFocus();
                }
            }

            @Override
            public void focusGained(FocusEvent e) {
                cboPrecio.getEditor().selectAll();
            }
        });
        ((JTextComponent) cboPrecio.getEditor().getEditorComponent()).setDocument(new DoubleDocument());
        ((JTextComponent) cboPrecio.getEditor().getEditorComponent()).setInputVerifier(validPrecio);
        ((JTextComponent) cboPrecio.getEditor().getEditorComponent()).addKeyListener(new KeyAdapter() {
            @Override
            public void keyPressed(KeyEvent arg0) {
                String valor = ((JTextComponent) cboPrecio.getEditor().getEditorComponent()).getText();

                if (valor.isEmpty() == false) {
                    if (arg0.getKeyChar() == KeyEvent.VK_1) {
                    }
                    if (KeyEvent.VK_ENTER == arg0.getKeyChar()) {
                        procesoVerificar();
                    }
                }

            }

            @Override
            public void keyTyped(KeyEvent evt) {
            }
        });

        cboPrecio.setFont(new Font("Helvetica", Font.BOLD, 13));
        cboPrecio.addActionListener(this);

        cboPrecio.registerKeyboardAction(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                txt_descripcion.requestFocus();
            }
        }, KeyStroke.getKeyStroke(KeyEvent.VK_ENTER, 0, false), JComponent.WHEN_ANCESTOR_OF_FOCUSED_COMPONENT);
        pnlProductoSouth.add(cboPrecio);
        cboPrecio.addItemListener(itemListener);
        checkAutorizado.setForeground(Color.BLUE);
        checkAutorizado.setFont(new Font("Helvetica", Font.BOLD, 12));
        checkAutorizado.setVisible(Constans.IS_AUTORIZAR_PRECIO);
        pnlProductoSouth.add(checkAutorizado);
        JLabel lblCostoCompra = new JLabel("Costo Compra");
        lblCostoCompra.setFont(new Font("Helvetica", Font.BOLD, 13));

        txtCostoCompra = new JTextField();
        txtCostoCompra.setColumns(7);
        txtCostoCompra.setFont(new Font("Helvetica", Font.BOLD, 13));
        txtCostoCompra.setText("0.00");
        txtCostoCompra.setHorizontalAlignment(SwingConstants.RIGHT);
        txtCostoCompra.setEditable(false);
        if (Constans.IS_COSTO_COMPRA_ITEM) {
            pnlProductoSouth.add(lblCostoCompra);
            pnlProductoSouth.add(txtCostoCompra);
        }
        return pnlProductoSouth;
    }

    private void configInternal() {
        setMaximizable(true);
        setResizable(true);
        setClosable(true);
        setSize(1020, 545);
        setIconifiable(true);
        setLocation(((Toolkit.getDefaultToolkit().getScreenSize().width - getSize().width) / 2),
                (Toolkit.getDefaultToolkit().getScreenSize().height - getSize().height) / 20);
    }

    private JPanel getPnlPedido() {
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

    private JPanel getPnlContactoDireccion() {
        JPanel pnl = new JPanel();
        pnl.setLayout(new BorderLayout());
        pnl.add(getPnlDireccion(), BorderLayout.NORTH);
        pnl.add(getPnlContacto(), BorderLayout.CENTER);
        return pnl;
    }

    private JPanel getPnlDireccion() {
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

    private JPanel getPnlContacto() {
        JPanel pnl = new JPanel();
        pnl.setLayout(new BorderLayout());
        Border border = BorderFactory.createTitledBorder(null, "Datos de Contacto", TitledBorder.LEFT, TitledBorder.DEFAULT_POSITION, new Font("Comic Sans MS", 0, 12), Color.BLACK);
        pnl.setBorder(border);
        pnl.add(getPnlContactoNorth(), BorderLayout.NORTH);
        pnl.add(getPnlContactoCenter(), BorderLayout.CENTER);
        return pnl;
    }

    private JPanel getPnlContactoCenter() {
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

    private JPanel getPnlContactoNorth() {
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

    private JPanel getPnlCab() {
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

    private JPanel getPnlNorth() {
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

    private JPanel getPnlDocumento() {
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

    private JPanel getPnlFormaPago() {
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

    private JPanel getPnlCenter() {
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

    private JPanel getPnlClienteCenter() {
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

    private JPanel getPnlOpcCenter() {
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

    private JPanel getPnlReciboCenter() {
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

    private JPanel getPnlSouth() {
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

    private JPanel getPnlObserv() {
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

    private void initListener() {
        addKeyListener(this);
        addFocusListener(this);
        cboModVta.addItemListener(this);
        btnRefrescar.addActionListener(this);
        chkCotizacion.addItemListener(this);
        chkPedido.addItemListener(this);
        btnCotizacion.addActionListener(this);
        btnCopia.addActionListener(this);
        cboMoneda.addKeyListener(this);
        txtClienteTemporal.addKeyListener(this);
        cboMoneda.addActionListener(this);
        cboMoneda.addItemListener(this);
        cboTipoDocumento.addItemListener(this);
        cboTipoDocumento.addKeyListener(this);
        cboSerie.addItemListener(this);
        cboSerie.addKeyListener(this);
        btn_agregar.addActionListener(this);
        btn_quitar.addActionListener(this);
        btn_guardar.addActionListener(this);
        btnNuevo.addActionListener(this);

        btn_agregar.addKeyListener(this);
        btn_quitar.addKeyListener(this);
        btn_guardar.addKeyListener(this);
        btnNuevo.addKeyListener(this);

        dc_femision.getJCalendar().addMouseListener(this);
        dc_femision.getJCalendar().addFocusListener(this);
        dc_femision.getJCalendar().addKeyListener(this);
        dc_femision.getCalendarButton().addMouseListener(this);
        dc_femision.addMouseListener(this);
        dc_femision.addKeyListener(this);
        dc_femision.addFocusListener(this);
        cboCondPago.addKeyListener(this);
        cboCondPago.addItemListener(this);
        txt_diaspago.addKeyListener(this);
        txt_diaspago.addActionListener(this);
        txt_diaspago.addFocusListener(this);
        chk_publicogeneral.addKeyListener(this);
        chk_publicogeneral.addActionListener(this);
        chk_publicogeneral.addItemListener(this);
        cbo_clienteficticio.addKeyListener(this);
        cbo_clienteficticio.addActionListener(this);
        btn_buscarcliente.addActionListener(this);
        btn_buscarcliente.addKeyListener(this);
        btn_nuevocliente.addActionListener(this);
        btn_nuevocliente.addKeyListener(this);
        txt_cliente.addFocusListener(this);
        txtClienteTemporal.addFocusListener(this);
        txt_cliente.addKeyListener(this);
        txt_rucreal.addFocusListener(this);
        txt_rucreal.addKeyListener(this);
        txt_recibo.addKeyListener(this);
        txt_recibo.addFocusListener(this);
        btnGuardar.addActionListener(this);
        btn_cancelar.addActionListener(this);
        eventListener();
        txtContacto.addFocusListener(this);
        txtTelef.addFocusListener(this);
        txtCorreo.addFocusListener(this);
        txtDireccionDespacho.addFocusListener(this);
        cboDepartamento.addItemListener(this);
        cboProvincia.addItemListener(this);
        cboDistrito.addItemListener(this);
        txtDireccionReal.getDocument().addDocumentListener(this);
        txt_cliente.getDocument().addDocumentListener(this);
        btnAgregarContacto.addActionListener(this);
        btnQuitarContacto.addActionListener(this);
        this.txt_preimpreso.addKeyListener(this);
        ((JTextFieldDateEditor) dc_femision.getDateEditor()).addKeyListener(this);
        this.txt_tipocambio.addKeyListener(this);
        ((JTextFieldDateEditor) dc_fdespacho.getDateEditor()).addKeyListener(this);
        this.cboModVta.addKeyListener(this);
        this.cbo_mediopago.addKeyListener(this);
        this.txt_idclientereal.addKeyListener(this);
        this.txt_idclienteficticio.addKeyListener(this);
        this.txtDireccionReal.addKeyListener(this);
        this.txt_direccionficticio.addKeyListener(this);
        this.txt_rucficticio.addKeyListener(this);
        this.txt_vuelto.addKeyListener(this);
        this.cbo_idvendedor.addKeyListener(this);
        this.btnGuardar.addKeyListener(this);
        tabb.addChangeListener(this);
        cboTipoOperIgv.addItemListener(this);
        dc_femision.addPropertyChangeListener(this);
    }

    private List<Anexo> getClientes(Anexo c) {
        try {
            RnAnexo regla = new RnAnexo(path);
            return regla.listAnexo("2", c.getIdAnexo(), c.getNumerodoc(), c.getDescripcion(), "A");
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, e.getMessage());
            return null;
        }
    }

    public void mostrarComprasPorItem() {
        if (tbl_producto.getRowCount() == 0 || tbl_producto.getSelectedRow() < 0) {
            return;
        }
        int visibleRowIndex = tbl_producto.getSelectedRow();
        int realRowIndex = tbl_producto.convertRowIndexToModel(visibleRowIndex);
        BeanItem producto = mdl_producto.getItem(realRowIndex);
        FormComprasPorItem formCompras = new FormComprasPorItem(this.frm, path, producto);
        formCompras.setVisible(true);
    }

    private void eventListener() {
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

    private BeanTipoCambio getBeanTipoCambio(String idMoneda, Date fecha) throws Exception {
        RnTipoCambio logTC = new RnTipoCambio(path);
        if (tipoCambioFecha == null) {
            tipoCambioFecha = logTC.getBeanTipoCambio(new java.sql.Date(fecha.getTime()), idMoneda);
            return tipoCambioFecha;
        }
        if (UtilDate.getStrFecha(tipoCambioFecha.getFecha()).equals(UtilDate.getStrFecha(fecha))) {
            return tipoCambioFecha;
        }
        tipoCambioFecha = logTC.getBeanTipoCambio(new java.sql.Date(fecha.getTime()), idMoneda);
        return tipoCambioFecha;
    }

    private void changeFechaEmision() {
        try {
            //dc_fvencimiento.setDate(dc_femision.getDate());
            calcFVenc();
            dc_fdespacho.setDate(dc_femision.getDate());
            BeanTipoCambio bean = this.getBeanTipoCambio(MonedaEnum.SOLES.getValue(), dc_femision.getDate());
            txt_tipocambio.setText(bean.getMontoventa().toString());
            if (!this.isCondCredito()) {
                txt_diaspago.setText("0");
            }
        } catch (Exception ex) {
            try {
                Date fechaEmision = new Date(Main.fechaActualServer.getTime());
                dc_fvencimiento.setDate(fechaEmision);
                dc_fdespacho.setDate(fechaEmision);
                /*BeanTipoCambio bean = logTC.getBeanTipoCambio(new java.sql.Date(fechaEmision.getTime()),
                        MonedaEnum.SOLES.getValue());*/
                BeanTipoCambio bean = this.getBeanTipoCambio(MonedaEnum.SOLES.getValue(), fechaEmision);
                if (bean != null) {
                    txt_tipocambio.setText(bean.getMontoventa().toString());
                } else {
                    txt_tipocambio.setText("0");
                }
                if (!this.isCondCredito()) {
                    txt_diaspago.setText("0");
                }
            } catch (ClassNotFoundException ex1) {
                JOptionPane.showMessageDialog(null, ex1.getMessage());
            } catch (InstantiationException ex1) {
                JOptionPane.showMessageDialog(null, ex1.getMessage());
            } catch (IllegalAccessException ex1) {
                JOptionPane.showMessageDialog(null, ex1.getMessage());
            } catch (Exception ex1) {
                JOptionPane.showMessageDialog(null, ex1.getMessage());
            }
        }
    }

    private void changeCotizacion() {
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

    private void changePedido() {
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

    private void insertarContacto() {
        if (txtContacto.getText().trim().length() == 0) {
            JOptionPane.showMessageDialog(this, "Ingrese Contacto");
            return;
        }
        BeanPedidoContacto bean = new BeanPedidoContacto();
        bean.setContacto(txtContacto.getText());
        bean.setTelef(txtTelef.getText());
        bean.setCorreo(txtCorreo.getText());
        bean.setContacto(txtContacto.getText());
        txtContacto.setText("");
        txtCorreo.setText("");
        txtTelef.setText("");
        modeltableContacto.addContacto(bean);
        tableContacto.setAllColumnPreferredWidthNvo(10);
    }

    private void quitarContacto() {
        if (tableContacto.getRowCount() == 0 || tableContacto.getSelectedRow() < 0) {
            return;
        }
        int visibleRowIndex = tableContacto.getSelectedRow();
        if (visibleRowIndex < 0) {
            return;
        }
        int realRowIndex = tableContacto.convertRowIndexToModel(visibleRowIndex);
        int xres = JOptionPane.showConfirmDialog(this, "Seguro que desea Quitar Contacto", "Quitar Contacto", JOptionPane.OK_CANCEL_OPTION, JOptionPane.QUESTION_MESSAGE);
        if (xres == JOptionPane.OK_OPTION) {
            modeltableContacto.deleteContacto(realRowIndex);
            tableContacto.setAllColumnPreferredWidthNvo(10);
        }
    }

    public void setListConversion(List<BeanVentaConversion> listConversion) {
        this.listConversion = listConversion;
    }

    private void configTableVenta(boolean swCotPed) {
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

    private void valorCodItem() {
        String codItem = txt_iditem.getText().trim();
        int longitud = codItem.length();
        if (longitud <= 6) {
            for (int i = 0; i < 6 - longitud; i++) {
                codItem = "0" + codItem;
            }
            txt_iditem.setText(codItem);
        } else {
            JOptionPane.showMessageDialog(null, "Numero de caracteres debe ser menor o igual a 6");
        }
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
        try {
            loadTipoDocumento();
            cargarMoneda();
            porcIgv = LoadDataGenerica.getPorcIgv(path, usuario);
            maxProd = LoadDataGenerica.getMaxProd(path, usuario);
            txtMaximoProductos.setText(String.valueOf(maxProd));
            paramValorBoletaDNI = LoadDataGenerica.getMontoBoletaDni(path, usuario);
            paramValorPercepcion = LoadDataGenerica.getValorPercepcion(path, usuario);
            numeroDecimales = LoadDataGenerica.getNumeroDecimales(path, usuario);
            loadCondPago();
            cargarTabla();
            txt_iditem.setText("");
            txt_descripcion.setText("");
            txt_cantidad.setText("0.0");
            cboPrecio.getEditor().setItem("0.0");
            setFechas();
            chk_publicogeneral.setSelected(true);
            limpiarVenta();
        } catch (Exception e) {
            ExceptionHandler.handleException(e, logger);
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }

    private void loadCondPago() {
        cboCondPago.addItem("CONTADO");
        cboCondPago.addItem("CREDITO");
        cboCondPago.addItem("TARJETA");
        cboCondPago.addItem("OPERACION BANCARIA");
    }

    private void loadDepartamento() {
        try {
            LoadCombo.loadUbigeo(cboDepartamento, "", true, path);
        } catch (Exception e) {
            ExceptionHandler.handleException(e, logger);
            JOptionPane.showMessageDialog(this, "Error: " + e.getMessage(), "Sistema", JOptionPane.OK_OPTION);
        }
    }

    private void changeDepartamento() throws Exception {
        try {
            String idUbigeo = LoadComboItem.getIdCombo(cboDepartamento);
            cboProvincia.removeAllItems();
            if (Util.isBlank(idUbigeo)) {
                cboProvincia.setEnabled(false);
                return;
            }
            cboProvincia.setEnabled(true);
            LoadCombo.loadUbigeo(cboProvincia, idUbigeo, true, path);
        } catch (Exception e) {
            throw e;
        }
    }

    private void changeProvincia() throws Exception {
        try {
            String idUbigeo = LoadComboItem.getIdCombo(cboProvincia);
            cboDistrito.removeAllItems();
            if (Util.isBlank(idUbigeo)) {
                cboDistrito.setEnabled(false);
                return;
            }
            cboDistrito.setEnabled(true);
            LoadCombo.loadUbigeo(cboDistrito, idUbigeo, true, path);
        } catch (Exception e) {
            throw e;
        }
    }

    private void changeDistrito() throws Exception {
        try {
            String idUbigeo = LoadComboItem.getIdCombo(cboDistrito);
            cboZona.removeAllItems();
            if (Util.isBlank(idUbigeo)) {
                cboZona.setEnabled(false);
                return;
            }
            cboZona.setEnabled(true);
            LoadCombo.loadZona(idUbigeo, cboZona, path);
        } catch (Exception e) {
            throw e;
        }
    }

    private void cargarMoneda() throws Exception {
        try {
            xMoneda = new ArrayList();
            SingletonCombo singCombo = SingletonCombo.Instance(path);
            xMoneda.addAll(singCombo.getListMoneda());
            LoadCombo.loadMoneda(xMoneda, cbo_moneda);
            LoadCombo.loadMoneda(xMoneda, cbo_cancelaen);
            LoadCombo.loadMoneda(xMoneda, cboMoneda);
        } catch (Exception e) {
            throw e;
        }
    }

    private void limpiarVenta() {
        chkCotizacion.setSelected(false);
        chkPedido.setSelected(false);
        txt_iditem.setText("");
        txt_descripcion.setText("");
        txtAfecto.setText("0.0");
        txtPercepcion.setText("0.0");
        txtNoafecto.setText("0.0");
        txtIgv.setText("0.0");
        txtMonto.setText("0.0");
        txtPesoTotal.setText("0.0");
        mdl_venta.clearTable();
        CTableFx.setAllColumnPreferredWidth(tbl_venta);
        cboCondPago.setSelectedIndex(0);
        txt_descripcion.requestFocus();
        loadPublicGeneral();
    }

    private void setFechas() {
        try {
            Date fechaEmision = new Date(Main.fechaActualServer.getTime());
            dc_femision.setDate(fechaEmision);
            dc_fvencimiento.setDate(fechaEmision);
            dc_fdespacho.setDate(fechaEmision);
            dc_femision.setSelectableDateRange(frm.getFechaInicio(), fechaEmision);
            //RnTipoCambio logicTc = new RnTipoCambio(path);
            //BeanTipoCambio tc = logicTc.getBeanTipoCambio(new java.sql.Date(dc_femision.getDate().getTime()), MonedaEnum.DOLARES.getValue());
            BeanTipoCambio tc = this.getBeanTipoCambio(MonedaEnum.DOLARES.getValue(), dc_femision.getDate());
            if (tc != null) {
                txt_tipocambio.setText(tc.getMontoventa().toString());
            }
        } catch (Exception ex) {
            JOptionPane.showMessageDialog(null, ex.getMessage());
        }
    }

    private String getIdMoneda() {
        return xMoneda.get(cboMoneda.getSelectedIndex()).getIdMoneda();
    }

    private void agregarItem(double num, boolean swButton) {
        try {
            if (!verificarMoneda(this.getIdMoneda())) {
                JOptionPane.showMessageDialog(null, "Error al ingresar Item: \nTodos los Item deben tener misma moneda");
                return;
            }
            BeanItem productoNew = mdl_producto.getItem(tbl_producto.convertRowIndexToModel(tbl_producto.getSelectedRow()));
            BeanItem producto = (BeanItem) productoNew.cloneSuperficial();
            if (this.cboTipoOperIgv.getSelectedItem().toString().equalsIgnoreCase("GRATUITA")) {
                if (productoNew.getTipoOperacionIgv().equalsIgnoreCase("AFECTO")) {
                    producto.setTipoAfectacionIgv(13);
                } else if (productoNew.getTipoOperacionIgv().equalsIgnoreCase("INAFECTO")) {
                    producto.setTipoAfectacionIgv(32);
                } else if (productoNew.getTipoOperacionIgv().equalsIgnoreCase("EXONERADO")) {
                    producto.setTipoAfectacionIgv(21);
                }
            } else if (this.cboTipoOperIgv.getSelectedItem().toString().equalsIgnoreCase("INAFECTO_MUESTRA_MEDICA")) {
                producto.setFlagIgv("N");
                producto.setTipoOperacionIgv("INAFECTO");
                producto.setTipoAfectacionIgv(33);
            } else if (this.cboTipoOperIgv.getSelectedItem().toString().equalsIgnoreCase("EXPORTACION")) {
                producto.setFlagIgv("N");
                producto.setTipoOperacionIgv("INAFECTO");
                producto.setTipoAfectacionIgv(40);
            } else if (this.cboTipoOperIgv.getSelectedItem().toString().equalsIgnoreCase("EXONERADA") && producto.getFlagIgv().equals("S")) {
                producto.setFlagIgv("N");
                producto.setTipoOperacionIgv("EXONERADO");
                producto.setTipoAfectacionIgv(20);
            } else if (productoNew.getTipoOperacionIgv().equalsIgnoreCase("AFECTO")) {
                producto.setTipoAfectacionIgv(10);
            } else if (productoNew.getTipoOperacionIgv().equalsIgnoreCase("INAFECTO")) {
                producto.setTipoAfectacionIgv(30);
            } else if (productoNew.getTipoOperacionIgv().equalsIgnoreCase("EXONERADO")) {
                producto.setTipoAfectacionIgv(20);
            }
            BigDecimal cantidad;
            if (Constans.SWCODEBARRA && !swButton) {
                cantidad = BigDecimal.ONE;
            } else {
                cantidad = new BigDecimal(txt_cantidad.getText().trim());
            }
            BigDecimal precio = new BigDecimal(cboPrecio.getSelectedItem().toString().trim());
            BeanStock almacen = mdl_almacen.getStock(tbl_almacen.convertRowIndexToModel(tbl_almacen.getSelectedRow()));

            if (num != -1) {
                cantidad = cantidad.add(new BigDecimal(num));
            }
            if (Constans.ISBOTICA) {
                if (!this.validateCantidad(cantidad, almacen.getDisponible())) {
                    if (JOptionPane.showConfirmDialog(null, "no cuenta con stock suficiente para agregar item\nDesea agregar stock al item", "Alerta", JOptionPane.YES_NO_OPTION) == JOptionPane.YES_OPTION) {
                        JDialog dialogConversion = new JDialog(Main.frmSoftcommerce);
                        dialogConversion.setModal(true);
                        dialogConversion.setTitle("Proceso de Conversion de Item");
                        FormConversion form = new FormConversion(this.usuario, dialogConversion);
                        form.setAlmacenItem(almacen.getBeanAlmacen());
                        form.setLoadItemsOrigen(producto.getIdItem());
                        producto.setStockActual(almacen.getDisponible());
                        form.setLoadItemsDestino(producto);
                        dialogConversion.getContentPane().add(form);
                        dialogConversion.pack();
                        dialogConversion.setLocationRelativeTo(null);
                        dialogConversion.setVisible(true);
                        procesoCargarAlmacen();
                    }
                    return;
                }
            }
            BigDecimal monto;
            BigDecimal pigv = new BigDecimal(BigInteger.ZERO);
            BigDecimal migv = new BigDecimal(BigInteger.ZERO);
            BigDecimal mafecto = new BigDecimal(BigInteger.ZERO);
            BigDecimal mnoafecto = new BigDecimal(BigInteger.ZERO);
            monto = cantidad.multiply(precio).setScale(numeroDecimales, RoundingMode.HALF_UP);
            if (producto.getFlagIgv().equals("S")) {
                pigv = producto.getPigv().divide(new BigDecimal("100"));
                mafecto = monto.divide(pigv.add(BigDecimal.ONE), numeroDecimales, RoundingMode.HALF_UP);
                migv = monto.subtract(mafecto);
            } else {
                mnoafecto = monto;
            }
            BeanRegcontaItem beanRci = new BeanRegcontaItem();
            beanRci.setBeanItem(producto);
            beanRci.setBeanAlmacen(almacen.getBeanAlmacen());
            beanRci.setCantidad(cantidad);
            beanRci.setCantPendiente(BigDecimal.ZERO);
            beanRci.setPrecio(precio);
            beanRci.setPrecioMinimo(this.validPrecio.getPrecioMinimo());
            beanRci.setMafecto(mafecto);
            beanRci.setMnoafecto(mnoafecto);
            beanRci.setPigv(pigv);
            beanRci.setMigv(migv);
            beanRci.setMonto(monto);
            beanRci.setPpercepcion(usuario.getFlagpercepcion().equals("S") ? (producto.getFlagPercepcion().equals("S") ? new BigDecimal("2") : BigDecimal.ZERO) : BigDecimal.ZERO);
            beanRci.setMpercepcion(beanRci.getMonto().multiply(beanRci.getPpercepcion()).setScale(numeroDecimales, RoundingMode.HALF_UP));
            beanRci.setTotal(beanRci.getMonto().add(beanRci.getMpercepcion()));
            beanRci.setPesototal(producto.getPesobruto().multiply(cantidad));
            String idMoneda = this.getIdMoneda();
            beanRci.setFlagAutorizado(checkAutorizado.isSelected() ? "N" : "S");
            beanRci.setModelAlmacen(this.getComboModelAlmacen(almacen.getBeanAlmacen()));
            if (verificarMoneda(idMoneda)) {
                if (verificarItemPercepcion(beanRci.getBeanItem().getFlagPercepcion())) {
                    mdl_venta.agregarRci(beanRci);
                    mdl_venta.fireTableDataChanged();
                } else {
                    JOptionPane.showMessageDialog(null, "Error al ingresar Item: \nVerifique estados de S/N de percepcion");
                }
            } else {
                JOptionPane.showMessageDialog(null, "Error al ingresar Item: \nTodos los Item deben tener misma moneda");
            }
            CTableFx.setAllColumnPreferredWidth(tbl_venta);
            txt_descripcion.requestFocus();
        } catch (CloneNotSupportedException ex) {
            java.util.logging.Logger.getLogger(UiRegisterVentaDirecta.class.getName()).log(Level.SEVERE, null, ex);
        }
    }

    private boolean validateCantidad(BigDecimal cantidad, BigDecimal disponible) {
        if (!Constans.ISBOTICA) {
            return true;
        }
        return cantidad.compareTo(disponible) != 1;
    }

    private ComboModelAlmacen getComboModelAlmacen(BeanAlmacen beanAlmacen) {
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

    private void generarVenta() {
        try {
            registerTipoCambio();
            tabb.setEnabledAt(1, true);
            tabb.setEnabledAt(2, true);
            tabb.setSelectedIndex(1);
            calcularpercepcion();
            chk_promocion.setSelected(flagPromocion());
            String idTipoDoc = TipoDocVentaEnum.TICKET.getValue();
            if (beanCotizacion != null) {
                if (beanCotizacion.getBeanCliente().getNumero().trim().length() > 8) {
                    idTipoDoc = TipoDocVentaEnum.FACTURA.getValue();
                }
            }
            if (beanPedido != null) {
                if (beanPedido.getBeanCliente().getNumero().trim().length() > 8) {
                    idTipoDoc = TipoDocVentaEnum.FACTURA.getValue();
                }
            }
            int posTipoDoc = 0;
            for (int i = 0; i < xTipoDocVenta.size(); i++) {
                if (xTipoDocVenta.get(i).getIdTipoDoc().equals(idTipoDoc)) {
                    posTipoDoc = i;
                    //cboTipoDocumento.setSelectedIndex(i);
                    break;
                }
            }
            cboTipoDocumento.setSelectedIndex(posTipoDoc);
            actualizarCorrelativo();
            mostrarPreimpreso();
            this.calcularMontoRetencion();
            this.btnGuardar.requestFocus();
        } catch (Exception e) {
            ExceptionHandler.handleException(e, logger);
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }

    private boolean flagPromocion() {
        for (int i = 0; i < mdl_venta.getRowCount(); i++) {
            if (mdl_venta.getRci(i).getBeanItem().getFlagPromocion().equals("S")) {
                return true;
            }
        }
        return false;
    }

    private void calcularpercepcion() {
        if (blnClickAceptar) {
            return;
        }
        this.calcPercepcion();
    }

    private void calcPercepcion() {
        BigDecimal monto_percepcion = BigDecimal.ZERO;
        for (int i = 0; i < mdl_venta.getRowCount(); i++) {
            monto_percepcion = monto_percepcion.add(mdl_venta.getRci(i).getMonto());
        }

        BigDecimal m_percepcion = BigDecimal.ZERO;
        BigDecimal monto = BigDecimal.ZERO;
        BigDecimal m_afecto = BigDecimal.ZERO;
        BigDecimal m_noafecto = BigDecimal.ZERO;
        BigDecimal m_igv = BigDecimal.ZERO;
        BigDecimal m_descuento = BigDecimal.ZERO;

        for (int i = 0; i < mdl_venta.getRowCount(); i++) {
            if (mdl_venta.getRci(i).getBeanItem().getFlagPercepcion().equals("S")) {
                if (xTipoDocVenta.get(cboTipoDocumento.getSelectedIndex()).getIdTipoDoc().equals(TipoDocVentaEnum.FACTURA.getValue())) {
                    switch (numero) {
                        case 1:
                        case 2:
                            mdl_venta.getRci(i).setPpercepcion(BigDecimal.ZERO);
                            break;
                        case 3:
                            mdl_venta.getRci(i).setPpercepcion(new BigDecimal("0.005"));
                            break;
                        default:
                            mdl_venta.getRci(i).setPpercepcion(new BigDecimal("0.02"));
                            break;
                    }
                } else if (xTipoDocVenta.get(cboTipoDocumento.getSelectedIndex()).getIdTipoDoc().equals(TipoDocVentaEnum.BOLETA.getValue())) {
                    BigDecimal valorPercepcion = paramValorPercepcion;
                    if (this.getIdMoneda().trim().equalsIgnoreCase(MonedaEnum.DOLARES.getValue())) {
                        try {
                            //RnTipoCambio logicTc = new RnTipoCambio(path);
                            Date fechaEmision = new Date(dc_femision.getDate() == null
                                    ? Main.fechaActualServer.getTime() : dc_femision.getDate().getTime());
                            /*BeanTipoCambio tc = logicTc.getBeanTipoCambio(new java.sql.Date(fechaEmision.getTime()),
                                    MonedaEnum.DOLARES.getValue());*/
                            BeanTipoCambio tc = this.getBeanTipoCambio(MonedaEnum.DOLARES.getValue(), fechaEmision);
                            if (tc != null) {
                                valorPercepcion = valorPercepcion.divide(tc.getMontocompra(), numeroDecimales, RoundingMode.HALF_UP);
                            }
                        } catch (Exception ex) {
                        }
                    }
                    if (monto_percepcion.compareTo(valorPercepcion) == 1) {
                        mdl_venta.getRci(i).setPpercepcion(new BigDecimal("0.02"));
                    } else {
                        mdl_venta.getRci(i).setPpercepcion(BigDecimal.ZERO);
                    }
                }
            } else {
                mdl_venta.getRci(i).setPpercepcion(BigDecimal.ZERO);
            }
            if (usuario.getFlagpercepcion().equals("S")) {
                if (mdl_venta.getRci(i).getBeanItem().getFlagPercepcion().equals("S")) {
                    mdl_venta.getRci(i).setMpercepcion(mdl_venta.getRci(i).getMonto().multiply(mdl_venta.getRci(i).getPpercepcion()).setScale(numeroDecimales, RoundingMode.HALF_UP));
                }
            }

            m_percepcion = m_percepcion.add(mdl_venta.getRci(i).getMpercepcion());
            monto = monto.add(mdl_venta.getRci(i).getMonto());
            m_afecto = m_afecto.add(mdl_venta.getRci(i).getMafecto());
            m_noafecto = m_noafecto.add(mdl_venta.getRci(i).getMnoafecto());
            m_igv = m_igv.add(mdl_venta.getRci(i).getMigv());
            m_descuento = m_descuento.add(BigDecimal.ZERO);

            BigDecimal valorVenta = monto.subtract(m_igv);
            txt_valorventa.setText(valorVenta.toString());
            txt_igv.setText(m_igv.toString());
            txt_descuento.setText(m_descuento.toString());
            txt_afecto.setText(m_afecto.toString());
            txt_noafecto.setText(m_noafecto.toString());
            txt_total.setText(monto.toString());
            BigDecimal valorRecibo = monto.add(m_percepcion);
            txt_recibo.setText(valorRecibo.toString());
            txt_percepcion.setText(m_percepcion.toString());
            BigDecimal valorCobrar = monto.add(m_percepcion);
            txtTotalCobrar.setText(valorCobrar.toString());
            txt_vuelto.setText("0.0");
        }
    }

    private void loadTipoDocumento() throws Exception {
        try {
            if (xTipoDocVenta != null) {
                xTipoDocVenta.clear();
            } else {
                xTipoDocVenta = new ArrayList();
            }
            xTipoDocVenta.addAll(SingletonTipoDocVenta.Instance(path).getListTipoDocVenta());
            cboTipoDocumento.removeAllItems();
            for (int i = 0; i < xTipoDocVenta.size(); i++) {
                if (xTipoDocVenta.get(i).getIdTipoDoc().equals("CO")) {
                    xTipoDocVenta.remove(i);
                }
                cboTipoDocumento.addItem(xTipoDocVenta.get(i).getDescripcion());
            }

            if (xTipoDocVenta.size() > 0) {
                cboTipoDocumento.setSelectedIndex(0);
                //actualizarCorrelativo();
                //mostrarPreimpreso();
            }
        } catch (Exception e) {
            throw e;
        }
    }

    private boolean verificarMoneda(String idMoneda) {
        boolean valor = true;
        List<BeanRegcontaItem> lista = mdl_venta.getData();
        Iterator<BeanRegcontaItem> i = lista.iterator();
        while (i.hasNext()) {
            BeanRegcontaItem item = i.next();
            if (!item.getBeanItem().getIdMoneda().equalsIgnoreCase(idMoneda)) {
                valor = false;
                break;
            }
        }
        return valor;
    }

    private boolean verificarItemPercepcion(String perc) {
        boolean valor = true;
        List<BeanRegcontaItem> lista = mdl_venta.getData();
        Iterator<BeanRegcontaItem> i = lista.iterator();
        while (i.hasNext()) {
            BeanRegcontaItem item = i.next();
            if (!item.getBeanItem().getFlagPercepcion().equalsIgnoreCase(perc)) {
                valor = false;
                break;
            }
        }
        return valor;
    }

    private void cargarTabla() throws Exception {
        try {
            this.idItem = "";
            RnItem logic = new RnItem(path);
            mdl_producto.clearTable();
            List<BeanItem> lista;
            lista = logic.listarProductoVenta(usuario.getCodlocalidad());
            mdl_producto.agregarListItem(lista);
            tbl_producto.setAllColumnPreferredWidthNvo(5);
            cargarProductoPrecioAll();
            mdl_almacen.clearTable();
            tbl_almacen.setAllColumnPreferredWidthNvo(5);
        } catch (Exception e) {
            throw e;
        }
    }

    private void cargarProductoPrecioAll() throws Exception {
        try {
            RnItem logic = new RnItem(path);
            List<BeanPrecioItem> lista;
            lista = logic.listarProductoPrecioVenta(usuario.getCodlocalidad(), "");
            mapPrecio = new HashMap();
            for (int i = 0; i < lista.size(); i++) {
                BeanPrecioItem beanPrecioItem = (BeanPrecioItem) lista.get(i);
                mapPrecio.put(beanPrecioItem.getIdItem(), beanPrecioItem);
            }
        } catch (Exception e) {
            throw e;
        }
    }

    private void cargarPrecios(String id_item) {
        cboPrecio.removeAllItems();
        BeanPrecioItem beanPrecioItem = mapPrecio.get(id_item);
        Set precios = new HashSet();
        if (cboMoneda.getSelectedIndex() == 0) {
            if (beanPrecioItem.getPrecio1().compareTo(BigDecimal.ZERO) == 0 && beanPrecioItem.getPrecio2().compareTo(BigDecimal.ZERO) == 0 && beanPrecioItem.getPrecio3().compareTo(BigDecimal.ZERO) == 0) {
                precios.add(beanPrecioItem.getPrecio1());
            } else {
                if (beanPrecioItem.getPrecio1().compareTo(BigDecimal.ZERO) == 1) {
                    precios.add(beanPrecioItem.getPrecio1());
                }
                if (beanPrecioItem.getPrecio2().compareTo(BigDecimal.ZERO) == 1) {
                    precios.add(beanPrecioItem.getPrecio2());
                }
                if (beanPrecioItem.getPrecio3().compareTo(BigDecimal.ZERO) == 1) {
                    precios.add(beanPrecioItem.getPrecio3());
                }
            }
        } else if (beanPrecioItem.getPrecio4().compareTo(BigDecimal.ZERO) == 0 && beanPrecioItem.getPrecio5().compareTo(BigDecimal.ZERO) == 0 && beanPrecioItem.getPrecio6().compareTo(BigDecimal.ZERO) == 0) {
            precios.add(beanPrecioItem.getPrecio4());
        } else {
            if (beanPrecioItem.getPrecio4().compareTo(BigDecimal.ZERO) == 1) {
                precios.add(beanPrecioItem.getPrecio4());
            }
            if (beanPrecioItem.getPrecio5().compareTo(BigDecimal.ZERO) == 1) {
                precios.add(beanPrecioItem.getPrecio5());
            }
            if (beanPrecioItem.getPrecio6().compareTo(BigDecimal.ZERO) == 1) {
                precios.add(beanPrecioItem.getPrecio6());
            }
        }

        cboModelPrecio = new ComboModelPrecio(precios);
        cboPrecio.setModel(cboModelPrecio);
        this.validPrecio.setPrecioMinimo(this.getPrecioMinimo(beanPrecioItem));
        if (cboPrecio.getItemCount() > 0) {
            if (cboMoneda.getSelectedIndex() == 0) {
                if (beanPrecioItem.getPrecio1().compareTo(BigDecimal.ZERO) == 0 && beanPrecioItem.getPrecio2().compareTo(BigDecimal.ZERO) == 0 && beanPrecioItem.getPrecio3().compareTo(BigDecimal.ZERO) == 0) {
                    cboPrecio.getEditor().setItem(beanPrecioItem.getPrecio1());
                } else if (beanPrecioItem.getPrecio1().compareTo(BigDecimal.ZERO) == 1) {
                    cboPrecio.getEditor().setItem(beanPrecioItem.getPrecio1());
                } else if (beanPrecioItem.getPrecio2().compareTo(BigDecimal.ZERO) == 1) {
                    cboPrecio.getEditor().setItem(beanPrecioItem.getPrecio2());
                } else {
                    cboPrecio.getEditor().setItem(beanPrecioItem.getPrecio3());
                }
            } else if (beanPrecioItem.getPrecio4().compareTo(BigDecimal.ZERO) == 0 && beanPrecioItem.getPrecio5().compareTo(BigDecimal.ZERO) == 0 && beanPrecioItem.getPrecio6().compareTo(BigDecimal.ZERO) == 0) {
                cboPrecio.getEditor().setItem(beanPrecioItem.getPrecio4());
            } else if (beanPrecioItem.getPrecio1().compareTo(BigDecimal.ZERO) == 1) {
                cboPrecio.getEditor().setItem(beanPrecioItem.getPrecio1());
            } else if (beanPrecioItem.getPrecio2().compareTo(BigDecimal.ZERO) == 1) {
                cboPrecio.getEditor().setItem(beanPrecioItem.getPrecio2());
            } else {
                cboPrecio.getEditor().setItem(beanPrecioItem.getPrecio3());
            }

        }
    }

    private BigDecimal getPrecioMinimo(BeanPrecioItem beanPrecioItem) {
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

    private void addProductBarCode() {
        if (!Constans.SWCODEBARRA) {
            return;
        }
        if (tbl_producto.getRowCount() != 1) {
            return;
        }
        if (tbl_producto.getSelectedRow() == -1) {
            JOptionPane.showMessageDialog(frm, "Debe seleccionar el Item a agregar",
                    "Seleccionar Item", JOptionPane.INFORMATION_MESSAGE);
            return;
        }
        if (tbl_almacen.getRowCount() == 0) {
            JOptionPane.showMessageDialog(frm, "El item no se encuentra disponible en ningun almacen",
                    "No tiene almacen", JOptionPane.INFORMATION_MESSAGE);
            return;
        }
        String clave = mdl_producto.getItem(tbl_producto.convertRowIndexToModel(tbl_producto.getSelectedRow())).getIdItem()
                + mdl_almacen.getStock(tbl_almacen.convertRowIndexToModel(tbl_almacen.getSelectedRow())).getBeanAlmacen().getIdAlmacen();
        if (!mdl_venta.existeItem(clave)) {
            this.agregarItem(-1, false);
        } else {
            this.agregarItem(mdl_venta.getCantidad(clave), false);
        }

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

    private void procesoVerificar() {
        tbl_producto.editCellAt(-1, -1);
        tbl_venta.editCellAt(-1, -1);

        if (tbl_producto.getSelectedRow() == -1) {
            JOptionPane.showMessageDialog(frm, "Debe seleccionar el Item a agregar", "Seleccionar Item", JOptionPane.INFORMATION_MESSAGE);
        } else if ((txt_cantidad.getText().trim().length() > 0) && (Double.valueOf(txt_cantidad.getText().trim()) > 0)) {
            if (tbl_almacen.getRowCount() > 0) {
                if (tbl_almacen.getSelectedRow() == -1) {
                    tbl_almacen.setRowSelectionInterval(0, 0);
                    tbl_almacen.requestFocus();
                } else {
                    tbl_almacen.requestFocus();
                }
            } else {
                JOptionPane.showMessageDialog(frm, "El item no se encuentra disponible en ningun almacen", "No tiene almacen", JOptionPane.INFORMATION_MESSAGE);
            }
        } else {
            JOptionPane.showMessageDialog(frm, "Debe especificar la cantidad del Item", "Espeficicar Cantidad", JOptionPane.INFORMATION_MESSAGE);
            this.txt_cantidad.requestFocus();
            this.txt_cantidad.selectAll();
        }
    }

    private int getMaximoProductos() {
        if (!Constans.ISBOTICA) {
            return maxProd;
        }
        return Integer.parseInt(txtMaximoProductos.getText().trim());
    }

    private void procesoAgregar() {
        try {
            tbl_producto.editCellAt(-1, -1);
            tbl_venta.editCellAt(-1, -1);

            if (tbl_producto.getSelectedRow() == -1) {
                JOptionPane.showMessageDialog(frm, "Debe seleccionar el Item a agregar", "Seleccionar Item", JOptionPane.INFORMATION_MESSAGE);
                return;
            }
            if (!this.validateCantidad()) {
                JOptionPane.showMessageDialog(frm, "Debe especificar la cantidad del Item",
                        "Especificar Cantidad",
                        JOptionPane.INFORMATION_MESSAGE);
                return;
            }
            if (tbl_almacen.getRowCount() == 0) {
                JOptionPane.showMessageDialog(frm, "El item no se encuentra disponible en ningun almacen",
                        "No tiene almacen",
                        JOptionPane.INFORMATION_MESSAGE);
                return;
            }
            int maximoProductos = this.getMaximoProductos();
            if (mdl_venta.getRowCount() >= maximoProductos) {
                JOptionPane.showMessageDialog(frm, "No puede registrar mas de " + maximoProductos + " items.", "Numero maximo de Items", JOptionPane.INFORMATION_MESSAGE);
                return;
            }
            String clave = mdl_producto.getItem(tbl_producto.convertRowIndexToModel(tbl_producto.getSelectedRow())).getIdItem() + mdl_almacen.getStock(tbl_almacen.convertRowIndexToModel(tbl_almacen.getSelectedRow())).getBeanAlmacen().getIdAlmacen();
            if (!mdl_venta.existeItem(clave)) {
                agregarItem(-1, true);
            } else {
                int xres = JOptionPane.showConfirmDialog(this, "El producto ya esta agregado.\n - SI para REEMPLAZAR el producto.\n - NO para AUMENTAR la cantidad al producto.\n - CANCELAR si no desea ninguna opcion anterior.", "Agregar Item.", JOptionPane.YES_NO_CANCEL_OPTION, JOptionPane.INFORMATION_MESSAGE);
                if (xres == JOptionPane.OK_OPTION) {
                    agregarItem(-1, true);
                }
                if (xres == JOptionPane.NO_OPTION) {
                    agregarItem(mdl_venta.getCantidad(clave), true);
                }
            }
            checkAutorizado.setSelected(false);
            try {
                cboPrecio.setSelectedIndex(1);
                cboPrecio.getEditor().setItem(cboPrecio.getSelectedItem());
            } catch (Exception ex) {
            }
        } catch (HeadlessException e) {
            JOptionPane.showMessageDialog(this, e.getMessage());
        } catch (NumberFormatException e) {
            this.txt_cantidad.setText("1");
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, e.getMessage());
            this.txt_cantidad.setText("1");
        }
    }

    private boolean validateCantidad() {
        if (txt_cantidad.getText().trim().length() == 0) {
            return false;
        }
        return Double.valueOf(txt_cantidad.getText().trim()) > 0;
    }

    private void cargarCostoUltimaCompra() {
        if (!Constans.IS_COSTO_COMPRA_ITEM) {
            return;
        }
        NumberFormat formatter = NumberFormat.getInstance(new Locale("en_US"));
        RnItem rnItem = new RnItem(this.path);
        txtCostoCompra.setText(FormatObject.formatNumber(formatter.format(rnItem.getCostoUltimaCompraByItem(idItem).setScale(numeroDecimales, RoundingMode.HALF_UP)), 2));
    }

    private void procesoCargarAlmacen() {
        try {
            if (tbl_producto.getSelectedRow() >= 0) {
                if (mdl_producto.getItem(tbl_producto.convertRowIndexToModel(tbl_producto.getSelectedRow())).getIdItem().equals(idItem)) {
                    return;
                }
                idItem = mdl_producto.getItem(tbl_producto.convertRowIndexToModel(tbl_producto.getSelectedRow())).getIdItem();
                mdl_almacen.clearTable();
                RnStock regla = new RnStock(path);
                List<BeanStock> lista = regla.listarStockVentas(usuario.getCodempresa(), usuario.getCodpuntoventa(), mdl_producto.getItem(tbl_producto.convertRowIndexToModel(tbl_producto.getSelectedRow())).getIdItem(), usuario.getCodlocalidad(), "S");
                mdl_almacen.agregarListStock(lista);
                tbl_almacen.setAllColumnPreferredWidthNvo(5);
                cargarPrecios(mdl_producto.getItem(tbl_producto.convertRowIndexToModel(tbl_producto.getSelectedRow())).getIdItem());
                if (tbl_almacen.getRowCount() > 0) {
                    tbl_almacen.setRowSelectionInterval(0, 0);
                    if (tbl_venta.getRowCount() > 0) {
                        String id_almacen = mdl_venta.getRci(tbl_venta.getRowCount() - 1).getBeanAlmacen().getIdAlmacen();
                        for (int i = 0; i < tbl_almacen.getRowCount(); i++) {
                            if (id_almacen.equals(mdl_almacen.getStock(i).getBeanAlmacen().getIdAlmacen())) {
                                tbl_almacen.setRowSelectionInterval(i, i);
                                break;
                            }
                        }
                    }
                }
                this.cargarCostoUltimaCompra();
            } else if (tbl_almacen.getRowCount() > 0) {
                mdl_almacen.clearTable();
            }
        } catch (Exception e) {
            ExceptionHandler.handleException(e, logger);
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
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

    private void nuevo() {
        try {
            chk_publicogeneral.setSelected(true);
            txtClienteTemporal.setText("PUBLICO GENERAL PG");
            limpiarVenta();
            modeltableContacto.clearTable();
            setFechas();
            beanCotizacion = null;
            beanPedido = null;
            txt_descripcion.requestFocus();
            this.cargarTabla();
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, e.getMessage());
            ExceptionHandler.handleException(e, logger);
        }
    }

    private void filtrarTablaProducto() {
        modeloOrdenadoProducto.setRowFilter(getFilterProducto());
        tbl_producto.setAllColumnPreferredWidthNvo(5);
        if (tbl_producto.getRowCount() > 0) {
            tbl_producto.setRowSelectionInterval(0, 0);
            procesoCargarAlmacen();
        }
    }

    private RowFilter getFilterProducto() {
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
        if (comp == btnCotizacion) {
            if (chkCotizacion.isSelected()) {
                beanCotizacion = (BeanCotizacionCab) valor;
                cargarCotizacion();
                this.txt_descripcion.requestFocus();
            }
            if (chkPedido.isSelected()) {
                beanPedido = (BeanPedidoCab) valor;
                cargarPedido();
                this.txt_descripcion.requestFocus();
            }
        }
        if (comp == btnCopia) {
            this.cargarVenta((BeanRegcontaCab) valor);
            this.txt_descripcion.requestFocus();
        }
        if (comp == btn_buscarcliente) {
            flag = true;
            Anexo a = new Anexo();
            a.setIdAnexo(valor.toString());
            cargarCliente(getClientes(a));
            chk_publicogeneral.setSelected((txt_cliente.getText().trim().equals("PUBLICO GENERAL")));
            flag = false;
        }
    }

    private void cargarCotizacion() {
        try {
            TIPOOPERIGV.setText(beanCotizacion.getTipoOperacionIgv());
            this.cboTipoOperIgv.setSelectedItem(beanCotizacion.getTipoOperacionIgv());
            flag = true;
            Anexo a = new Anexo();
            a.setIdAnexo(beanCotizacion.getBeanCliente().getIdCliente());
            cargarCliente(getClientes(a));
            chk_publicogeneral.setSelected((txt_cliente.getText().trim().equals("PUBLICO GENERAL")));
            flag = false;
            int pos = -1;
            for (int i = 0; i < cboCondPago.getItemCount(); i++) {
                cboCondPago.setSelectedIndex(i);
                if (cboCondPago.getSelectedItem().toString().substring(0, 2).equals(beanCotizacion.getCondPago())) {
                    pos = i;
                    break;
                }
            }
            if (pos > -1) {
                cboCondPago.setSelectedIndex(pos);
            } else {
                cboCondPago.setSelectedIndex(0);
            }
            for (int i = 0; i < cboModVta.getItemCount(); i++) {
                cboModVta.setSelectedIndex(i);
                if (cboModVta.getSelectedItem().toString().substring(0, 1).equals(beanCotizacion.getModVenta())) {
                    break;
                }
            }
            txtObser1.setText(beanCotizacion.getObserv1());
            txtObser2.setText(beanCotizacion.getObserv2());
            mdl_venta.clearTable();
            RnCotizacionCab logic = new RnCotizacionCab(path);
            List<BeanCotizacionDet> listaDet = logic.detalleCotizacion(beanCotizacion.getIdCotizacion());
            for (int i = 0; i < listaDet.size(); i++) {
                BeanCotizacionDet bean = (BeanCotizacionDet) listaDet.get(i);
                if (bean.getCantidad().subtract(bean.getCantDesp()).compareTo(BigDecimal.ZERO) == 0) {
                    continue;
                }
                BeanRegcontaItem beanRci = new BeanRegcontaItem();
                beanRci.setBeanItem(bean.getBeanItem());
                beanRci.setBeanAlmacen(bean.getBeanAlmacen());
                beanRci.setCantidad(bean.getCantidad().subtract(bean.getCantDesp()));
                beanRci.setCantPendiente(bean.getCantidad().subtract(bean.getCantDesp()));
                beanRci.setPrecio(bean.getPrecio());
                beanRci.setMafecto(bean.getAfecto().multiply(beanRci.getCantidad()).divide(bean.getCantidad(), numeroDecimales, RoundingMode.HALF_UP));
                beanRci.setMnoafecto(bean.getNoafecto().multiply(beanRci.getCantidad()).divide(bean.getCantidad(), numeroDecimales, RoundingMode.HALF_UP));
                beanRci.setPigv(bean.getPIgv());
                beanRci.setMigv(bean.getIgv().multiply(beanRci.getCantidad()).divide(bean.getCantidad(), numeroDecimales, RoundingMode.HALF_UP));
                beanRci.setMonto(bean.getMonto().multiply(beanRci.getCantidad()).divide(bean.getCantidad(), numeroDecimales, RoundingMode.HALF_UP));
                beanRci.setPpercepcion(usuario.getFlagpercepcion().equals("S") ? (bean.getBeanItem().getFlagPercepcion().equals("S") ? new BigDecimal("2") : BigDecimal.ZERO) : BigDecimal.ZERO);
                beanRci.setMpercepcion(beanRci.getMonto().multiply(beanRci.getPpercepcion()).setScale(numeroDecimales, RoundingMode.HALF_UP));
                beanRci.setTotal(beanRci.getMonto().add(beanRci.getMpercepcion()));
                beanRci.setPesototal(beanRci.getCantPendiente().multiply(beanRci.getBeanItem().getPesobruto()));
                beanRci.setFlagAutorizado(bean.getFlagAutorizado());
                beanRci.setId_cotizacion_det(bean.getIdCotizacionDet());
                beanRci.getBeanItem().setIdMoneda(beanCotizacion.getBeanMoneda().getIdMoneda());
                mdl_venta.agregarRci(beanRci);
            }
            CTableFx.setAllColumnPreferredWidth(tbl_venta);
            if (Constans.ISCOTIZACIONEDIT) {
                beanCotizacion = null;
            }
        } catch (Exception e) {
            ExceptionHandler.handleException(e, logger);
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }

    private void cargarVenta(BeanRegcontaCab beanRcc) {
        try {
            flag = true;
            Anexo a = new Anexo();
            a.setIdAnexo(beanRcc.getBeanAnexo().getIdAnexo());
            cargarCliente(getClientes(a));
            chk_publicogeneral.setSelected((txt_cliente.getText().trim().equals("PUBLICO GENERAL")));
            flag = false;
            for (int i = 0; i < cboModVta.getItemCount(); i++) {
                cboModVta.setSelectedIndex(i);
                if (cboModVta.getSelectedItem().toString().substring(0, 1).equals(beanRcc.getModVenta())) {
                    break;
                }
            }
            mdl_venta.clearTable();
            RnConsultas logic = new RnConsultas(path);
            List<BeanRegcontaItem> listaDet = logic.detalleVenta(beanRcc.getIdRegconta());
            for (int i = 0; i < listaDet.size(); i++) {
                BeanRegcontaItem beanRci = listaDet.get(i);
                beanRci.setPpercepcion(usuario.getFlagpercepcion().equals("S") ? (beanRci.getBeanItem().getFlagPercepcion().equals("S") ? new BigDecimal("2") : BigDecimal.ZERO) : BigDecimal.ZERO);
                beanRci.setMpercepcion(beanRci.getMonto().multiply(beanRci.getPpercepcion()).setScale(numeroDecimales, RoundingMode.HALF_UP));
                beanRci.setTotal(beanRci.getMonto().add(beanRci.getMpercepcion()));
                beanRci.getBeanItem().setIdMoneda(beanRcc.getBeanMoneda().getIdMoneda());
                beanRci.setCantPendiente(beanRci.getCantidad());
                mdl_venta.agregarRci(beanRci);
            }
            CTableFx.setAllColumnPreferredWidth(tbl_venta);
        } catch (Exception e) {
            ExceptionHandler.handleException(e, logger);
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }

    private void cargarPedido() {
        try {
            flag = true;
            Anexo a = new Anexo();
            a.setIdAnexo(beanPedido.getBeanCliente().getIdCliente());
            cargarCliente(getClientes(a));
            chk_publicogeneral.setSelected((txt_cliente.getText().trim().equals("PUBLICO GENERAL")));
            flag = false;
            int pos = -1;
            for (int i = 0; i < cboCondPago.getItemCount(); i++) {
                cboCondPago.setSelectedIndex(i);
                if (cboCondPago.getSelectedItem().toString().substring(0, 2).equals(beanPedido.getCond_pago())) {
                    pos = i;
                    break;
                }
            }
            if (pos > -1) {
                cboCondPago.setSelectedIndex(pos);
            } else {
                cboCondPago.setSelectedIndex(0);
            }
            for (int i = 0; i < cboModVta.getItemCount(); i++) {
                cboModVta.setSelectedIndex(i);
                if (cboModVta.getSelectedItem().toString().substring(0, 1).equals(beanPedido.getModVenta())) {
                    break;
                }
            }
            txtObser1.setText(beanPedido.getObserv1());
            txtObser2.setText(beanPedido.getObserv2());
            mdl_venta.clearTable();
            RnPedidoCab logic = new RnPedidoCab(path);
            List<BeanPedidoDet> listaDet = logic.detallePedido(beanPedido.getId_pedido());
            for (int i = 0; i < listaDet.size(); i++) {
                BeanPedidoDet bean = (BeanPedidoDet) listaDet.get(i);
                if (bean.getCantidad().subtract(bean.getCantDesp()).compareTo(BigDecimal.ZERO) == 0) {
                    continue;
                }
                if (bean.getFlagCerrado().equals("S")) {
                    continue;
                }
                BeanRegcontaItem beanRci = new BeanRegcontaItem();
                beanRci.setBeanItem(bean.getBeanItem());
                beanRci.setBeanAlmacen(bean.getBeanAlmacen());
                beanRci.setCantidad(bean.getCantidad().subtract(bean.getCantDesp()));
                beanRci.setCantPendiente(bean.getCantidad().subtract(bean.getCantDesp()));
                beanRci.setPrecio(bean.getPrecio());
                beanRci.setMafecto(bean.getAfecto().multiply(beanRci.getCantidad()).divide(bean.getCantidad(), numeroDecimales, RoundingMode.HALF_UP));
                beanRci.setMnoafecto(bean.getNoafecto().multiply(beanRci.getCantidad()).divide(bean.getCantidad(), numeroDecimales, RoundingMode.HALF_UP));
                beanRci.setPigv(bean.getP_igv());
                beanRci.setMigv(bean.getIgv().multiply(beanRci.getCantidad()).divide(bean.getCantidad(), numeroDecimales, RoundingMode.HALF_UP));
                beanRci.setMonto(bean.getMonto().multiply(beanRci.getCantidad()).divide(bean.getCantidad(), numeroDecimales, RoundingMode.HALF_UP));
                beanRci.setPpercepcion(usuario.getFlagpercepcion().equals("S") ? (bean.getBeanItem().getFlagPercepcion().equals("S") ? new BigDecimal("2") : BigDecimal.ZERO) : BigDecimal.ZERO);
                beanRci.setMpercepcion(beanRci.getMonto().multiply(beanRci.getPpercepcion()));
                beanRci.setTotal(beanRci.getMonto().add(beanRci.getMpercepcion()));
                beanRci.setPesototal(beanRci.getCantPendiente().multiply(beanRci.getBeanItem().getPesobruto()));
                beanRci.setFlagAutorizado(bean.getFlagAutorizado());
                beanRci.setId_pedido_det(bean.getId_pedido_det());
                mdl_venta.agregarRci(beanRci);
            }
            CTableFx.setAllColumnPreferredWidth(tbl_venta);
        } catch (Exception e) {
            ExceptionHandler.handleException(e, logger);
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }

    private boolean isCondCredito() {
        return cboCondPago.getSelectedItem().equals("CREDITO");
    }

    private void loadVendedor() throws SQLException {
        BeanVendedor vend = new BeanVendedor();
        String flags = cboCondPago.getSelectedItem().toString();
        if (flags.equals("CONTADO")) {
            vend.setFLAG_CONTADO("S");
        } else {
            vend.setFLAG_CREDITO("S");
        }
        RnVendedor regla = new RnVendedor(path);
        listaV = regla.listarVendedor2(vend);

        cbo_idvendedor.removeAllItems();
        for (int i = 0; i < listaV.size(); i++) {
            cbo_idvendedor.addItem(listaV.get(i).getNOMBRES());
        }
        cbo_idvendedor.setSelectedItem("SIN VENDEDOR");
    }

    private void eventCondPago() throws Exception {
        try {
            if (cboCondPago.getItemCount() == 0) {
                return;
            }
            String condPago = cboCondPago.getSelectedItem().toString().trim();
            txt_diaspago.setText("0");
            //RnTipoCambio logTC = new RnTipoCambio(path);
            try {
                loadVendedor();
                dc_fvencimiento.setDate(dc_femision.getDate());
                dc_fdespacho.setDate(dc_femision.getDate());
                /*BeanTipoCambio bean = logTC.getBeanTipoCambio(new java.sql.Date(dc_femision.getDate().getTime()),
                        MonedaEnum.SOLES.getValue());*/
                BeanTipoCambio bean = this.getBeanTipoCambio(MonedaEnum.SOLES.getValue(), dc_femision.getDate());
                txt_tipocambio.setText(bean.getMontoventa().toString());
            } catch (Exception ex) {
                try {
                    Date fechaEmision = new Date(Main.fechaActualServer.getTime());
                    dc_fvencimiento.setDate(fechaEmision);
                    dc_fdespacho.setDate(fechaEmision);
                    /*BeanTipoCambio bean = logTC.getBeanTipoCambio(new java.sql.Date(fechaEmision.getTime()),
                            MonedaEnum.SOLES.getValue());*/
                    BeanTipoCambio bean = this.getBeanTipoCambio(MonedaEnum.SOLES.getValue(), fechaEmision);
                    if (bean != null) {
                        txt_tipocambio.setText(bean.getMontoventa().toString());
                    } else {
                        txt_tipocambio.setText("0");
                    }
                } catch (Exception ex1) {
                }
            }

            txt_diaspago.setEnabled((!cboCondPago.getSelectedItem().equals("CONTADO") && !cboCondPago.getSelectedItem().equals("TARJETA") && !cboCondPago.getSelectedItem().equals("OPERACION BANCARIA")));
            cbo_mediopago.removeAllItems();
            cbo_mediopago.setEnabled((cboCondPago.getSelectedItem().equals("TARJETA") || cboCondPago.getSelectedItem().equals("CONTADO")));

            if (cboCondPago.getSelectedItem().equals("TARJETA")) {
                cbo_mediopago.addItem("TARJETA DINNER");
                cbo_mediopago.addItem("TARJETA MC PROCESS");
                cbo_mediopago.addItem("TARJETA VISA");
                cbo_mediopago.setSelectedItem("TARJETA VISA");
            }

            if (cboCondPago.getSelectedItem().equals("CONTADO")) {
                cbo_mediopago.addItem("EFECTIVO MN");
                cbo_mediopago.setSelectedItem("EFECTIVO MN");
            }
            /*TipoOperacion t = new TipoOperacion();
                t.setTasa_p(-1);
                t.setNumero(-1);
                t.setTasa_d(-1);
                t.setTasa(-1);
                t.setId_empresa(usuario.getCodempresa());

                RnTipoOperacion regla = new RnTipoOperacion(path);
                List<TipoOperacion> lst_to;
                String tipoOperacion;

                if (this.getIdMoneda().equalsIgnoreCase(MonedaEnum.SOLES.getValue())) {
                    t.setDescripcion(this.isCondCredito() ? "VENTA MN EN OFICINA CREDITO" : "VENTA MN EN OFICINA CONTADO");
                } else if (this.getIdMoneda().equalsIgnoreCase(MonedaEnum.DOLARES.getValue())) {
                    t.setDescripcion(this.isCondCredito() ? "VENTA USD EN OFICINA CREDITO" : "VENTA USD EN OFICINA CONTADO");
                } else {
                    JOptionPane.showMessageDialog(null, "Error al establecer condicion de pago");
                }
                lst_to = regla.listarTipoOperacion(t);

                if ((lst_to != null) && (lst_to.size() > 0)) {
                    tipoOperacion = lst_to.get(0).getCodigo();
                } else {
                    tipoOperacion = "";
                }*/
            tipoOperacionVenta = LoadDataGenerica.getTipoOperacionVenta(path, usuario, this.getIdMoneda(), condPago);
            String tipoOpStr = "";
            if (tipoOperacionVenta != null) {
                tipoOpStr = tipoOperacionVenta.getCodigo();
            }
            idTipoOperacion = tipoOpStr;
            txt_diaspago.setText((cboCondPago.getSelectedItem().equals("CONTADO")
                    || cboCondPago.getSelectedItem().equals("TARJETA")
                    || cboCondPago.getSelectedItem().equals("OPERACION BANCARIA")) ? "0" : "0");
        } catch (Exception e) {
            throw e;
        }
    }

    private void calcFVenc() {
        if (Integer.parseInt(txt_diaspago.getText()) >= 0) {
            int numDias = Integer.parseInt(txt_diaspago.getText());
            Calendar hoy = Calendar.getInstance();
            try {
                hoy.setTime(dc_femision.getDate());
            } catch (Exception ex) {
                try {
                    Date fechaEmision = new Date(Main.fechaActualServer.getTime());
                    hoy.setTime(fechaEmision);
                } catch (Exception ex1) {
                    JOptionPane.showMessageDialog(null, ex.getMessage());
                }
            }
            hoy.add(Calendar.DATE, numDias);
            dc_fvencimiento.setDate(hoy.getTime());
        } else {
            dc_fvencimiento.setDate(dc_femision.getDate());
        }
    }

    private boolean verificarCliente(String opcion) {
        Anexo a = new Anexo();
        a.setNumerodoc(opcion.equals("1") ? txt_rucreal.getText().trim() : "");
        a.setDescripcion(opcion.equals("1") ? "" : txt_cliente.getText().trim());
        a.setIdEmpresa(usuario.getCodempresa());
        a.setIdTipoAnexo("2");

        List<Anexo> anexo = getClientes(a);

        if ((anexo == null) || (anexo.isEmpty())) {
            int xRes = JOptionPane.showConfirmDialog(this, "El Cliente con el N° Documento " + txt_rucreal.getText().trim() + " no existe. Desea Ingresar el Cliente?", "Cliente No Ingresado", JOptionPane.YES_NO_OPTION, JOptionPane.INFORMATION_MESSAGE);

            if (xRes == JOptionPane.OK_OPTION) {
                this.nuevoCliente();
            } else {
                txt_rucreal.requestFocus();
            }
            return false;
        } else if (anexo.size() == 1) {
            cargarCliente(anexo);
            return true;
        } else {
            JOptionPane.showMessageDialog(null, "Puede que Exista dos ó más clientes con el \n mismo numero de documento \n comuniquese con el Supervisor");
            BuscarCliente search = new BuscarCliente(frm, this, path, "venta");
            search.cargarTabla(a, btn_buscarcliente, 0);
            return false;
        }
    }

    private void nuevoCliente() {
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

    private void buscarCliente() {
        Anexo a = new Anexo();
        a.setIdEmpresa(usuario.getCodempresa());
        a.setIdTipoAnexo("2");
        a.setDescripcion("");
        a.setNumerodoc("");

        BuscarCliente search = new BuscarCliente(frm, this, path, "venta");
        search.cargarTabla(a, btn_buscarcliente, 0);
    }

    private boolean isRegisterValid() throws Exception {
        try {
            JTextField txt = new JTextField();
            cboTipoDocumento.setBorder(txt.getBorder());
            cboSerie.setBorder(txt.getBorder());
            txt_preimpreso.setBorder(txt.getBorder());
            dc_femision.setBorder(new JDateChooser().getBorder());
            cboCondPago.setBorder(txt.getBorder());
            cbo_moneda.setBorder(txt.getBorder());
            txt_diaspago.setBorder(txt.getBorder());
            txt_cliente.setBorder(txt.getBorder());
            txt_rucreal.setBorder(txt.getBorder());
            cbo_clienteficticio.setBorder(txt.getBorder());
            txt_trabajador.setBorder(txt.getBorder());
            txt_igv.setBorder(txt.getBorder());
            cbo_cancelaen.setBorder(txt.getBorder());
            cbo_mediopago.setBorder(txt.getBorder());
            txt_recibo.setBorder(txt.getBorder());

            if (!(cboSerie.getSelectedIndex() >= 0)) {
                JOptionPane.showMessageDialog(this, "Para generar un Documento, debes especificar su Serie.", "Datos incompletos.", JOptionPane.OK_OPTION);
                cboSerie.setBorder(new LineBorder(Color.RED));
                cboSerie.requestFocus();
                return false;
            }

            if (txt_preimpreso.getText().trim().length() == 0) {
                JOptionPane.showMessageDialog(this, "Para generar un Documento, debes especificar su Pre-Impreso.", "Datos incompletos.", JOptionPane.CANCEL_OPTION);
                txt_preimpreso.setBorder(new LineBorder(Color.RED));
                txt_preimpreso.requestFocus();
                txt_preimpreso.selectAll();
                return false;
            }

            if ((txt_preimpreso.getText().length() > 0) && (txt_preimpreso.getText().length() < 10)) {
                JOptionPane.showMessageDialog(this, "El número de Pre-Impreso que has especificado no es válida. Compruébala e inténtalo de nuevo.", "Datos incompletos", 2);
                txt_preimpreso.setBorder(new LineBorder(Color.RED));
                txt_preimpreso.requestFocus();
                txt_preimpreso.selectAll();
                return false;
            }
            if (((JTextFieldDateEditor) dc_femision.getDateEditor()).getText().equals("__/__/____")
                    || !DateTime.isValidDate(((JTextFieldDateEditor) dc_femision.getDateEditor()).getText())) {
                JOptionPane.showMessageDialog(this, "La fecha de Emision que has especificado no es válida. Compruébala e inténtalo de nuevo.", "Datos incompletos", 2);
                dc_femision.setBorder(new LineBorder(Color.RED));
                dc_femision.requestFocus();
                return false;
            }

            if (xTipoDocVenta.get(cboTipoDocumento.getSelectedIndex()).getIdTipoDoc().equals(TipoDocVentaEnum.FACTURA.getValue())) {
                if (txt_cliente.getText().trim().length() == 0) {
                    JOptionPane.showMessageDialog(this, "Para generar una Factura, debes especificar el Nombre del Cliente.", "Datos incompletos.", JOptionPane.OK_OPTION);
                    txt_cliente.setBorder(new LineBorder(Color.RED));
                    txt_cliente.requestFocus();
                    txt_cliente.selectAll();
                    return false;
                }
                if (txt_rucreal.getText().trim().length() == 0) {
                    JOptionPane.showMessageDialog(this, "Para generar una Factura, debes especificar el RUC del Cliente.", "Datos incompletos", 2);
                    txt_rucreal.setBorder(new LineBorder(Color.RED));
                    txt_rucreal.requestFocus();
                    txt_rucreal.selectAll();
                    return false;
                }

                if ((txt_rucficticio.getText().length() > 0) && (txt_rucficticio.getText().length() < 11)) {
                    JOptionPane.showMessageDialog(this, "El número de RUC que has especificado no es válida. Compruébala e inténtalo de nuevo.", "Datos incompletos", 2);
                    txt_rucficticio.setBorder(new LineBorder(Color.RED));
                    txt_rucficticio.requestFocus();
                    txt_rucficticio.selectAll();
                    return false;
                }
            }
            if (xTipoDocVenta.get(cboTipoDocumento.getSelectedIndex()).getIdTipoDoc().equals(TipoDocVentaEnum.BOLETA.getValue())) {
                if (txt_rucreal.getText().trim().length() == 0) {
                    JOptionPane.showMessageDialog(this, "Para generar una Boleta, debes especificar el DNI del Cliente.", "Datos incompletos", 2);
                    txt_rucreal.setBorder(new LineBorder(Color.RED));
                    txt_rucreal.requestFocus();
                    txt_rucreal.selectAll();
                    return false;
                }

                if ((txt_rucreal.getText().length() > 0) && (txt_rucreal.getText().length() < 8)) {
                    JOptionPane.showMessageDialog(this, "El número de DNI que has especificado no es válida. Compruébala e inténtalo de nuevo.", "Datos incompletos", 2);
                    txt_rucreal.setBorder(new LineBorder(Color.RED));
                    txt_rucreal.requestFocus();
                    txt_rucreal.selectAll();
                    return false;
                }

                if (!txt_rucficticio.getText().trim().equals("00000000")) {
                    if (txt_rucficticio.getText().trim().length() == 0) {
                        JOptionPane.showMessageDialog(this, "Para generar una Boleta, debes especificar el DNI de Facturacion del Cliente.", "Datos incompletos", 2);
                        txt_rucficticio.setBorder(new LineBorder(Color.RED));
                        txt_rucficticio.requestFocus();
                        txt_rucficticio.selectAll();
                        return false;
                    }

                    if ((txt_rucficticio.getText().length() > 0) && (txt_rucficticio.getText().length() < 8)) {
                        JOptionPane.showMessageDialog(this, "El número de DNI de Facturacion que has especificado no es válida. Compruébala e inténtalo de nuevo.", "Datos incompletos", 2);
                        txt_rucficticio.setBorder(new LineBorder(Color.RED));
                        txt_rucficticio.requestFocus();
                        txt_rucficticio.selectAll();
                        return false;
                    }
                }

                BigDecimal valorPercepcion = paramValorPercepcion;
                if (xMoneda.get(cbo_moneda.getSelectedIndex()).getIdMoneda().trim().equalsIgnoreCase(MonedaEnum.DOLARES.getValue())) {
                    try {
                        //RnTipoCambio logicTc = new RnTipoCambio(path);
                        Date fechaEmision = new Date(dc_femision.getDate() == null
                                ? Main.fechaActualServer.getTime() : dc_femision.getDate().getTime());
                        /*BeanTipoCambio tc = logicTc.getBeanTipoCambio(new java.sql.Date(fechaEmision.getTime()),
                                MonedaEnum.DOLARES.getValue());*/
                        BeanTipoCambio tc = this.getBeanTipoCambio(MonedaEnum.DOLARES.getValue(), fechaEmision);
                        if (tc != null) {
                            valorPercepcion = valorPercepcion.divide(tc.getMontocompra(), RoundingMode.HALF_UP);
                        }
                    } catch (Exception ex) {
                    }
                }
                BigDecimal valorBoletaDNI = paramValorBoletaDNI;
                if (Double.parseDouble(txt_total.getText().trim()) >= valorBoletaDNI.doubleValue()) {
                    if (txt_rucficticio.getText().trim().equals("00000000")) {
                        JOptionPane.showMessageDialog(this, "Debe ingresar el nombre del cliente.", "Datos incompletos.", JOptionPane.OK_OPTION);
                        txt_cliente.requestFocus();
                        return false;
                    }

                    if (txt_cliente.getText().trim().length() == 0) {
                        JOptionPane.showMessageDialog(this, "Para generar una Boleta, debes especificar el Nombre del Cliente.", "Datos incompletos.", JOptionPane.OK_OPTION);
                        txt_cliente.setBorder(new LineBorder(Color.RED));
                        txt_cliente.requestFocus();
                        txt_cliente.selectAll();
                        return false;
                    }
                }
                if (Double.parseDouble(txt_total.getText().trim()) > valorPercepcion.doubleValue()) {
                    if (txt_cliente.getText().trim().length() == 0) {
                        JOptionPane.showMessageDialog(this, "Para generar una Boleta, debes especificar el Nombre del Cliente.", "Datos incompletos.", JOptionPane.OK_OPTION);
                        txt_cliente.setBorder(new LineBorder(Color.RED));
                        txt_cliente.requestFocus();
                        txt_cliente.selectAll();
                        return false;
                    }

                    if (txt_rucreal.getText().trim().length() == 0) {
                        JOptionPane.showMessageDialog(this, "Para generar una Boleta, debes especificar el DNI del Cliente.", "Datos incompletos", 2);
                        txt_rucreal.setBorder(new LineBorder(Color.RED));
                        txt_rucreal.requestFocus();
                        txt_rucreal.selectAll();
                        return false;
                    }

                    if ((txt_rucreal.getText().length() > 0) && (txt_rucreal.getText().length() < 8)) {
                        JOptionPane.showMessageDialog(this, "El número de DNI que has especificado no es válida. Compruébala e inténtalo de nuevo.", "Datos incompletos", 2);
                        txt_rucreal.setBorder(new LineBorder(Color.RED));
                        txt_rucreal.requestFocus();
                        txt_rucreal.selectAll();
                        return false;
                    }

                    if (txt_rucficticio.getText().trim().length() == 0) {
                        JOptionPane.showMessageDialog(this, "Para generar una Boleta, debes especificar el DNI de Facturacion del Cliente.", "Datos incompletos", 2);
                        txt_rucficticio.setBorder(new LineBorder(Color.RED));
                        txt_rucficticio.requestFocus();
                        txt_rucficticio.selectAll();
                        return false;
                    }

                    if ((txt_rucficticio.getText().length() > 0) && (txt_rucficticio.getText().length() < 8)) {
                        JOptionPane.showMessageDialog(this, "El número de DNI de Facturacion que has especificado no es válida. Compruébala e inténtalo de nuevo.", "Datos incompletos", 2);
                        txt_rucficticio.setBorder(new LineBorder(Color.RED));
                        txt_rucficticio.requestFocus();
                        txt_rucficticio.selectAll();
                        return false;
                    }
                }
            }

            if (txt_idclientereal.getText().trim().length() == 0) {
                JOptionPane.showMessageDialog(this, "Para generar un documento, debes especificar el Cliente - El registro no contiene codigo de cliente.", "Datos incompletos.", JOptionPane.OK_OPTION);
                btn_buscarcliente.requestFocus();
                return false;
            }

            if (this.isCondCredito()) {
                if (Integer.parseInt(txt_diaspago.getText()) <= 0) {
                    JOptionPane.showMessageDialog(this, "Para generar un Documento, debes especificar su Tiempo de Pago.", "Datos incompletos.", JOptionPane.CANCEL_OPTION);
                    txt_diaspago.setBorder(new LineBorder(Color.RED));
                    txt_diaspago.requestFocus();
                    return false;
                }
            }

            if (cbo_moneda.getSelectedIndex() < 0) {
                JOptionPane.showMessageDialog(this, "Para gerenerar un Documento, debes especificar su Moneda.", "Datos incompletos.", JOptionPane.CANCEL_OPTION);
                cbo_moneda.setBorder(new LineBorder(Color.RED));
                cbo_moneda.requestFocus();
                return false;
            }

            if (cboCondPago.getSelectedItem().equals("CONTADO")) {
                if (cbo_mediopago.getSelectedIndex() < 0) {
                    JOptionPane.showMessageDialog(this, "Para generar un Documento al contado, debes especificar su Tipo de Pago.", "Datos incompletos.", JOptionPane.OK_OPTION);
                    cbo_mediopago.setBorder(new LineBorder(Color.RED));
                    cbo_mediopago.requestFocus();
                    return false;
                }
            }

            if (cbo_cancelaen.getSelectedIndex() < 0) {
                JOptionPane.showMessageDialog(this, "Para gerenerar un Documento, debes especificar la moneda de pago de la venta.", "Datos incompletos.", JOptionPane.CANCEL_OPTION);
                cbo_cancelaen.setBorder(new LineBorder(Color.RED));
                cbo_cancelaen.requestFocus();
                return false;
            }
            if (txt_recibo.getText().trim().length() == 0) {
                JOptionPane.showMessageDialog(this, "Para gerenerar un Documento, debes especificar el Monto Recibido.", "Datos incompletos.", JOptionPane.CANCEL_OPTION);
                txt_recibo.setBorder(new LineBorder(Color.RED));
                txt_recibo.requestFocus();
                txt_recibo.selectAll();
                return false;
            }

            if (Double.valueOf(txt_recibo.getText().trim()) < Double.valueOf(txt_total.getText().trim())) {
                JOptionPane.showMessageDialog(this, "El monto recibido que has especificado debe ser mayor o igual al total de la Venta. Compruébala e inténtalo de nuevo.", "Datos incompletos.", JOptionPane.CANCEL_OPTION);
                txt_recibo.setBorder(new LineBorder(Color.RED));
                txt_recibo.requestFocus();
                txt_recibo.selectAll();
                return false;
            }

            RnRegconta logic = new RnRegconta(path);
            String rpta = logic.estadoPeriodoAuxiliar(Util.getIdPeriodoMensual(dc_femision.getDate()), AuxiliarEnum.VENTA.getValue());
            if (rpta.trim().substring(0, 1).equals("*")) {
                JOptionPane.showMessageDialog(this, rpta);
                return false;
            }

            if (!logic.existsRegistroRcc(AuxiliarEnum.VENTA.getValue(), null,
                    xTipoDocVenta.get(cboTipoDocumento.getSelectedIndex()).getIdTipoDoc(),
                    cboSerie.getSelectedItem().toString(), txt_preimpreso.getText().trim())) {
                JOptionPane.showMessageDialog(this, "DOCUMENTO YA SE ENCUENTRA REGISTRADO");
                return false;
            }
            return true;
        } catch (Exception e) {
            throw e;
        }
    }

    private void insertDocumento(boolean swDespacho) throws Exception {
        try {
            logger.info("UiRegisterVentaDirecta insertDocumento inicio");
            this.calcularpercepcion();
            BeanRegcontaCab beanRcc = this.getRcc();
            RnRegconta logic = new RnRegconta(path);
            Map<String, String> mapCta = new HashMap();
            String xmlItem = this.getXmlItem(mapCta);
            String xmlCta = this.getXmlCuenta(mapCta);
            String xmlContacto = this.getXmlContacto();
            BeanPedidoCab beanPed = this.getPedido();
            this.validateMontoCabDet(beanRcc);
            BeanRptaVenta beanRptaVenta = logic.insertVenta(beanRcc, xmlItem, xmlCta, xmlContacto,
                    this.getIdCotizacion(), beanPed, swDespacho, this.listConversion);
            this.updateCorreoCliente(logic, beanRptaVenta.getIdRegconta());
            String msgRpta = "";
            if (Constans.SWDESPACHO) {
                msgRpta = this.getMsgDespacho(beanRptaVenta, swDespacho);
            }
            if (Util.isDocumentoSunat(beanRcc.getBeanTipoDocVenta().getIdTipoDoc(), beanRcc.getSerie())) {
                logger.info("Documento para envio Sunat");
                if (Util.isBlank(msgRpta)) {
                    msgRpta += "Documento guardado correctamente";
                }
                msgRpta += "\n";
                msgRpta += "¿Desea enviar el documento a Sunat?";
                int xres = JOptionPane.showConfirmDialog(this, msgRpta,
                        "Envio a Sunat", JOptionPane.OK_CANCEL_OPTION);
                if (xres == JOptionPane.OK_OPTION) {
                    logger.info("Documento para enviar a sunat");
                    this.enviarDocumentoSunat(beanRptaVenta.getIdRegconta());
                }
            } else {
                logger.info("Documento no se envia a Sunat");
                if (!Util.isBlank(msgRpta)) {
                    JOptionPane.showMessageDialog(this, msgRpta);
                }
                this.imprimirDocumentoNotSunat(beanRcc, beanRptaVenta.getIdRegconta());
            }
            logger.info("msgRpta: " + msgRpta);
            nuevo();
            tabb.setSelectedIndex(0);
        } catch (Exception e) {
            throw e;
        } finally {
            logger.info("UiRegisterVentaDirecta insertDocumento fin");
        }
    }

    private void enviarDocumentoSunat(String idRegconta) {
        try {
            logger.info("enviarDocumentoSunat inicio");
            RnRegconta logic = new RnRegconta(path);
            ConvertDataSunat sunat = new ConvertDataSunat(path, usuario);
            ContaCab contaCab = logic.detalleVentaFe(idRegconta);
            ResultSfs resultSfs = sunat.sendDataSunat(idRegconta, contaCab);
            String urlRpt = null;
            String urlImgQr = null;
            if (resultSfs != null) {
                urlRpt = resultSfs.getUrlPdf();
                urlImgQr = resultSfs.getUrlImgQR();
            }
            this.impresionDocumentoSunat(contaCab, idRegconta, contaCab.getIdTipoDoc(), urlRpt, urlImgQr);
        } catch (Exception e) {
            ExceptionHandler.handleException(e, logger);
            JOptionPane.showMessageDialog(this, e.getMessage());
        } finally {
            logger.info("enviarDocumentoSunat fin");
        }
    }

    private void impresionDocumentoSunat(ContaCab beanRcc, String idRegconta, String idTipoDoc,
            String urlRpt, String urlImgQr) throws Exception {
        try {
            logger.info("impresionDocumentoSunat inicio");
            String rutaJasper = Util.getRutaJasperFE(idTipoDoc,
                    beanRcc.getSerie());
            logger.info("rutaJasper: " + rutaJasper);
            Map parameters = new HashMap();
            ConvertNumberToLetter conv = new ConvertNumberToLetter();
            parameters.put(JRParameter.REPORT_LOCALE, Locale.US);
            Exportar exportar;
            DataSourceVenta dataSource = new DataSourceVenta();
            RnConsultas logic = new RnConsultas(path);
            List<BeanRegcontaItem> list = logic.listarVentaReporte(idRegconta);
            for (int i = 0; i < list.size(); i++) {
                BeanRegcontaItem beanRci = list.get(i);
                dataSource.add(beanRci);
            }
            String montoLetras = "";
            if (!list.isEmpty()) {
                montoLetras = conv.convertir(Double.parseDouble(list.get(0).getBeanRegcontaCab().getMonto().toString()),
                        list.get(0).getBeanRegcontaCab().getBeanMoneda().getIdMoneda());
            }
            parameters.put("MONTOLETRAS", montoLetras);
            parameters.put("P_NOMBRE_EMPRESA", usuario.getDescriempresa());
            parameters.put("P_DIRECCION_EMPRESA", usuario.getDireccion());
            parameters.put("P_RUC_EMPRESA", usuario.getRuc());
            parameters.put("P_TIPO_DOC", idTipoDoc);
            parameters.put("P_AUTORIZACION", beanRcc.getNumeroAutorizacion());
            parameters.put("P_CODIGO_MAQUINA", beanRcc.getCodigoMaquina());
            parameters.put("P_HORA_EMISION", UtilCenter.getHoraImpresion(idTipoDoc, idRegconta, path, logger));
            parameters.put("ABREV_MONEDA", UtilCenter.getMonedaRpt(beanRcc.getIdMoneda()));
            //parameters.put("CONDICION_PAGO", UtilCenter.getCondicionPago(beanRcc));
            //parameters.put("CONDICION_PAGO", "condicion pago");
            parameters.put("URLRPT", urlRpt);
            parameters.put("P_URLIMGQR", Util.getUrlImgQr(urlImgQr));
            parameters.put("P_IMGLOGO", this.getClass().getResourceAsStream(Constans.PATH_LOGO_VENTA));
            exportar = new Exportar(parameters, dataSource, rutaJasper);
            exportar.vistaPrevia(true);
        } catch (Exception e) {
            throw e;
        } finally {
            logger.info("impresionDocumentoSunat fin");
        }
    }

    private void validateMontoCabDet(BeanRegcontaCab beanRcc) {
        try {
            if (!Constans.IS_VALIDATE_MONTO_VENTA) {
                return;
            }
            BigDecimal montoItem = BigDecimal.ZERO;
            for (int i = 0; i < mdl_venta.getRowCount(); i++) {
                BeanRegcontaItem beanRci = (BeanRegcontaItem) mdl_venta.getRci(i);
                montoItem = montoItem.add(beanRci.getMonto());
            }
            logger.info("monto Cab: " + beanRcc.getMonto());
            logger.info("monto Item: " + montoItem);
            if (beanRcc.getMonto().intValue() == montoItem.intValue()) {
                return;
            }
            logger.error("Montos no coinciden");
            JOptionPane.showMessageDialog(this, "Se recalculara los montos");
            this.calcPercepcion();
        } catch (Exception e) {
            ExceptionHandler.handleException(e, logger);
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }

    private void updateCorreoCliente(RnRegconta logic, String idRegconta) {
        try {
            if (!Constans.IS_FACTURADOR_SUNAT) {
                return;
            }
            String correoCliente = txtCorreoCliente.getText();
            if (Util.isBlank(correoCliente)) {
                return;
            }
            logic.updateCorreoCliente(idRegconta, correoCliente);
        } catch (Exception e) {
            ExceptionHandler.handleException(e, logger);
        }
    }

    private int getIdCotizacion() {
        if (beanCotizacion == null) {
            return 0;
        }
        return beanCotizacion.getIdCotizacion();
    }

    private String getMsgDespacho(BeanRptaVenta beanRptaVenta, boolean swDespacho) {
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

    private String getXmlCuenta(Map<String, String> mapCta) throws Exception {
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

    private String getXmlItem(Map<String, String> mapCta) {
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

    private String getDescripcionItem(BeanRegcontaItem beanRci) {
        if (Constans.IS_EDIT_DESCRIPCION_ITEM_VENTA) {
            return beanRci.getBeanItem().getDescripcion();
        }
        return "";
    }

    private BeanRegcontaCab getRcc() {
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

    private BigDecimal getMontoRetencion() {
        if (!Constans.IS_RETENCION_VENTA_CLIENTE) {
            return BigDecimal.ZERO;
        }
        if (!chkAgRetencion.isSelected()) {
            return BigDecimal.ZERO;
        }
        BigDecimal mRetencion = new BigDecimal(txtTotalRetencion.getText().trim());
        return mRetencion;
    }

    private void changeTipoOperIgv() {
        String actualTipoOperIgv = this.cboTipoOperIgv.getSelectedItem().toString();
        if (!actualTipoOperIgv.equalsIgnoreCase(TIPOOPERIGV.getText()) && (actualTipoOperIgv.equalsIgnoreCase("EXPORTACION") || actualTipoOperIgv.equalsIgnoreCase("EXONERADA"))) {
            this.limpiarVenta();
        } else if (!actualTipoOperIgv.equalsIgnoreCase(TIPOOPERIGV.getText()) && (TIPOOPERIGV.getText().equalsIgnoreCase("EXPORTACION") || TIPOOPERIGV.getText().equalsIgnoreCase("EXONERADA")) && (actualTipoOperIgv.equalsIgnoreCase("NORMAL") || actualTipoOperIgv.equalsIgnoreCase("GRATUITA") || actualTipoOperIgv.equalsIgnoreCase("INAFECTO_MUESTRA_MEDICA"))) {
            this.limpiarVenta();
        }
        TIPOOPERIGV.setText(this.cboTipoOperIgv.getSelectedItem().toString());
    }

    private UsuarioCorrelativo getUsuarioCorrelativo() {
        if (cboSerie.getSelectedIndex() >= 0) {
            return xCorrelativo.get(cboSerie.getSelectedIndex());
        }
        return null;
    }

    private void imprimirDocumentoNotSunat(BeanRegcontaCab beanRcc, String idRegconta) throws Exception {
        try {
            if (beanRcc.getLineaImpresion() < 1) {
                return;
            }
            /*if (!this.isImpresion(beanRcc)) {
                return;
            }*/
            String idTipoDoc = xTipoDocVenta.get(cboTipoDocumento.getSelectedIndex()).getIdTipoDoc();
            if (Util.isImpresionContinua(idTipoDoc)) {
                this.impresionContinua(idRegconta, idTipoDoc);
            } else {
                this.impresionNormal(beanRcc, idRegconta, idTipoDoc);
            }
        } catch (Exception e) {
            ExceptionHandler.handleException(e, logger);
            JOptionPane.showMessageDialog(null, e.getMessage());
        }
    }

    private boolean isImpresion(BeanRegcontaCab beanRcc) {
        if (!Constans.IS_FACTURADOR_SUNAT) {
            return true;
        }
        String digitSerie = beanRcc.getSerie().substring(0, 1);
        return Util.isNumber(digitSerie);
    }

    private void impresionContinua(String idRegconta, String idTipoDoc) throws Exception {
        try {
            int maxProduct = 0;
            if (idTipoDoc.equals(TipoDocVentaEnum.BOLETA.getValue())) {
                maxProduct = LoadDataGenerica.getMaxProdBoleta(path, usuario);
            }
            if (idTipoDoc.equals(TipoDocVentaEnum.FACTURA.getValue())) {
                maxProduct = LoadDataGenerica.getMaxProdFactura(path, usuario);
            }
            if (maxProduct == 0) {
                JOptionPane.showMessageDialog(null, "Configurar maximo de productos Boleta/Factura");
                return;
            }
            RptVenta rptVenta = new RptVenta(this.path, this.usuario);
            rptVenta.createReport(idRegconta, idTipoDoc, maxProduct, this.txtClienteTemporal.getText());
        } catch (Exception e) {
            throw e;
        }
    }

    private void impresionNormal(BeanRegcontaCab beanRcc, String idRegconta, String idTipoDoc)
            throws Exception {
        try {
            String rutaJasper = Util.getRutaJasper(idTipoDoc);
            if (rutaJasper == null) {
                JOptionPane.showMessageDialog(this, "No se encuentra configurado reporte para " + cboTipoDocumento.getSelectedItem());
                return;
            }
            Map parameters = new HashMap();
            ConvertNumberToLetter conv = new ConvertNumberToLetter();
            String montoLetras = conv.convertir(Double.parseDouble(beanRcc.getMonto().toString()), beanRcc.getBeanMoneda().getIdMoneda());
            parameters.put("P_NOMBRE_EMPRESA", usuario.getDescriempresa());
            parameters.put("P_DIRECCION_EMPRESA", usuario.getDireccion());
            parameters.put("P_RUC_EMPRESA", usuario.getRuc());
            parameters.put("P_TIPO_DOC", idTipoDoc);
            parameters.put("MONTOLETRAS", montoLetras);
            parameters.put("P_AUTORIZACION", beanRcc.getNumeroAutorizacion());
            parameters.put("P_CODIGO_MAQUINA", beanRcc.getCodigoMaquina());
            parameters.put("P_HORA_EMISION", UtilCenter.getHoraImpresion(idTipoDoc, idRegconta, path, logger));
            parameters.put(JRParameter.REPORT_LOCALE, Locale.US);
            Exportar exportar;
            DataSourceVenta dataSource = this.getDataSourceVenta(beanRcc);
            exportar = new Exportar(parameters, dataSource, rutaJasper);
            exportar.vistaPrevia(false);
        } catch (Exception e) {
            throw e;
        }
    }

    private DataSourceVenta getDataSourceVenta(BeanRegcontaCab beanRcc) {
        if (Constans.SWCONVERSION) {
            return this.getDataSourceVentaConversion(beanRcc);
        }
        return this.getDataSourceVentaNormal(beanRcc);
    }

    private DataSourceVenta getDataSourceVentaConversion(BeanRegcontaCab beanRcc) {
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

    private DataSourceVenta getDataSourceVentaNormal(BeanRegcontaCab beanRcc) {
        DataSourceVenta dataSource = new DataSourceVenta();
        for (int i = 0; i < mdl_venta.getRowCount(); i++) {
            BeanRegcontaItem beanRci = mdl_venta.getRci(i);
            beanRci.setBeanRegcontaCab(beanRcc);
            dataSource.add(beanRci);
        }
        return dataSource;
    }

    private String getXmlContacto() {
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

    private BeanPedidoCab getPedido() {
        BeanPedidoCab beanPed = new BeanPedidoCab();
        if (beanPedido != null) {
            beanPed.setId_pedido(beanPedido.getId_pedido());
        }
        beanPed.setModVenta(cboModVta.getSelectedItem().toString().substring(0, 1));
        beanPed.setModDespacho(cboModDespacho.getSelectedIndex() == 0 ? "E" : "P");
        beanPed.setF_despacho(dc_fdespacho.getDate());
        beanPed.setObserv1(txtObser1.getText());
        beanPed.setObserv2(txtObser2.getText());
        beanPed.setDireccion(txtDireccionDespacho.getText().trim());
        Zona beanZona = new Zona();
        beanZona.setId_zona(Util.getNumberInteger(LoadComboItem.getIdCombo(cboZona)));
        beanPed.setBeanZona(beanZona);
        return beanPed;
    }

    private boolean isEmptyDocument(String idTipoDoc) throws Exception {
        try {
            RnCorrelativo regla_correlativo = new RnCorrelativo(path);
            List<UsuarioCorrelativo> list = regla_correlativo.listarCorrelativo(usuario.getId_usuario(), usuario.getCodpuntoventa(), idTipoDoc);
            return list.isEmpty();
        } catch (Exception e) {
            throw e;
        }
    }

    private void guardarDocumento() {
        blnClickAceptar = true;
        try {
            if (!isRegisterValid()) {
                return;
            }
            if (!this.continuePedido()) {
                return;
            }
            Map<String, Boolean> mapRpta = this.continueDespacho();
            Boolean swDespacho = mapRpta.get("despacho");
            Boolean swRpta = mapRpta.get("respuesta");
            if (!swRpta) {
                return;
            }
            this.validateDocumento(swDespacho);
        } catch (Exception ex) {
            ExceptionHandler.handleException(ex, logger);
            JOptionPane.showMessageDialog(this, "Error de Sistema: " + ex.getMessage());
        }
        blnClickAceptar = false;
    }

    private void validateDocumento(boolean swDespacho) throws Exception {
        try {
            if (!this.pregDocumento()) {
                return;
            }
            if (!this.swAutorizarDocumento()) {
                return;
            }
            if (Constans.SWCONVERSION) {
                this.agregarVentaConversion();
            }
            insertDocumento(swDespacho);
        } catch (Exception e) {
            throw e;
        }
    }

    private boolean swAutorizarDocumento() {
        if (!this.swAutorizado()) {
            FormAutorizar formAutorizar = new FormAutorizar(frm, xCorrelativo.get(cboSerie.getSelectedIndex()).getIdCorrelativo(), path);
            formAutorizar.setVisible(true);
            return formAutorizar.isSwAutorizar();
        }
        return true;
    }

    private boolean swAutorizado() {
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

    private boolean pregDocumento() {
        String msgRetencion = "";
        if (Constans.IS_RETENCION_VENTA_CLIENTE) {
            BigDecimal montoRetencion = this.getMontoRetencion();
            if (montoRetencion.compareTo(BigDecimal.ZERO) == 1) {
                msgRetencion = "\nSe guardará el monto de Retención";
            }
        }
        int xres = JOptionPane.showConfirmDialog(this, "Desea Generar el documento " + cboTipoDocumento.getSelectedItem()
                + " N° " + cboSerie.getSelectedItem() + "-" + txt_preimpreso.getText().trim() + msgRetencion,
                "Generar Documento", JOptionPane.OK_CANCEL_OPTION);
        return xres == JOptionPane.OK_OPTION;
    }

    private boolean continuePedido() throws Exception {
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

    private void agregarVentaConversion() {
        int xres = JOptionPane.showConfirmDialog(this, "Desea mostrar otros item a la venta",
                "Sistema", JOptionPane.OK_CANCEL_OPTION, JOptionPane.QUESTION_MESSAGE);
        listConversion = new ArrayList();
        if (xres == JOptionPane.OK_OPTION) {
            String total = "0";
            if (txtTotalCobrar.getText().trim().length() > 0) {
                total = txtTotalCobrar.getText().trim();
            }
            BigDecimal btotal = new BigDecimal(total);
            FormVentaConversion form = new FormVentaConversion(this.frm, this, btotal);
            form.setTitle("Venta Conversion");
            form.pack();
            form.setLocationRelativeTo(null);
            form.setVisible(true);
        }
    }

    private Map<String, Boolean> continueDespacho() throws Exception {
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

    private boolean pregContinue(String preg) {
        int rpta = JOptionPane.showConfirmDialog(this, preg,
                "Documento Venta", JOptionPane.YES_NO_OPTION);
        return rpta != JOptionPane.NO_OPTION;
    }

    private void guardarVentaF5() {
        if (tbl_venta.getRowCount() <= 0) {
            JOptionPane.showMessageDialog(this, "Para generar un Documento, debes especificar al menos un Item.", "Datos incompletos.", JOptionPane.INFORMATION_MESSAGE);
            txt_descripcion.requestFocus();
            return;
        }
        if (Constans.SWCODEBARRA) {
            if (!mdl_venta.validateItemAlmacen()) {
                JOptionPane.showMessageDialog(null, "Hay Filas repetidas con producto y almacen");
                return;
            }
        }
        List<BeanRegcontaItem> listaItem = mdl_venta.getData();
        HashSet<String> monedas = new HashSet();
        Iterator<BeanRegcontaItem> i = listaItem.iterator();
        while (i.hasNext()) {
            monedas.add(i.next().getBeanItem().getIdMoneda());
        }
        if (monedas.size() == 1) {
            generarVenta();
        } else {
            JOptionPane.showMessageDialog(null, "La lista de Items tiene monedas distintas");
        }

    }

    private void cotizacion() {
        if (chkCotizacion.isSelected()) {
            PnlCotizacionBuscar pnlCotizacion = new PnlCotizacionBuscar(frm, usuario, path, this, btnCotizacion, "venta");
            pnlCotizacion.setFecha(frm.getFechaInicio(), frm.getFechaFin());
            pnlCotizacion.setVisible(true);
        } else if (chkPedido.isSelected()) {
            PnlPedidoBuscar pnlCotizacion = new PnlPedidoBuscar(frm, usuario, path, this, btnCotizacion, "venta");
            pnlCotizacion.setFecha(frm.getFechaInicio(), frm.getFechaFin());
            pnlCotizacion.setVisible(true);
        } else {
            JOptionPane.showMessageDialog(this, "Seleccione Pedido o Cotizacion");
        }
    }

    private void buscarVenta() {
        PnlVentaBuscar pnlVenta = new PnlVentaBuscar(frm, usuario, path, this, btnCopia);
        pnlVenta.setFecha(frm.getFechaInicio(), frm.getFechaFin());
        pnlVenta.setVisible(true);
    }

    public void registerTipoCambio() {
        try {
            RnTipoCambio logicTc = new RnTipoCambio(Main.path);
            BeanTipoCambio t = new BeanTipoCambio();
            t.setIdEmpresa(Main.usuario.getCodempresa());
            BeanMoneda beanMoneda = new BeanMoneda();
            beanMoneda.setIdMoneda(MonedaEnum.DOLARES.getValue());
            t.setBeanMoneda(beanMoneda);
            Main.fechaActualServer = this.getFechaServer();
            t.setFecha(new java.util.Date(Main.fechaActualServer.getTime()));
            if (!logicTc.existeTipoCambio(t)) {
                setCursor(new Cursor(Cursor.WAIT_CURSOR));
                BeanTipoCambio tc = new BeanTipoCambio();
                tc.setIdEmpresa(usuario.getCodempresa());
                tc.setBeanMoneda(beanMoneda);
                tc.setFecha(DateTime.getStringDia().equals("Lunes")
                        ? DateTime.getDateMinusOrPlus(new Date(), -2)
                        : DateTime.getDateMinusOrPlus(new Date(), -1));
                RegisterTipoCambio register = new RegisterTipoCambio(frm, usuario);
                register.setPath(path);
                register.setObject(tc);
                register.setModeRegister(Register.CLONE_OBJECT);
                register.setVisible(true);
                setCursor(new Cursor(Cursor.DEFAULT_CURSOR));
            }
        } catch (Exception ex) {
            JOptionPane.showMessageDialog(null, ex.getMessage() + "/nRevisar el tipo de cambio del dia");
        }
    }

    private java.sql.Date getFechaServer() throws InstantiationException, IllegalAccessException, Exception {
        Propiedad p = new Propiedad();
        java.sql.Date fechaServer = (new LogicConfiguracion(Main.path)).fechaServer();
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(new Date(fechaServer.getTime()));
        calendar.set(Calendar.HOUR_OF_DAY, 0);
        calendar.set(Calendar.MINUTE, 0);
        calendar.set(Calendar.SECOND, 0);
        calendar.set(Calendar.MILLISECOND, 0);
        Date newDate = calendar.getTime();
        java.sql.Date test = new java.sql.Date(newDate.getTime());
        return test;
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

    private void actualizarCorrelativo() {
        try {
            cboSerie.removeAllItems();
            txt_preimpreso.setText("0000000000");
            loadSerieCorrelativo(xTipoDocVenta.get(cboTipoDocumento.getSelectedIndex()).getIdTipoDoc());
            String numDoc = (beanCotizacion != null ? beanCotizacion.getBeanCliente().getNumero() : (beanPedido != null ? beanPedido.getBeanCliente().getNumero() : txt_rucreal.getText()));
            txt_rucreal.setDocument(cboTipoDocumento.getSelectedItem().equals("FACTURA") ? (new IntegerDocument(11)) : (cboTipoDocumento.getSelectedItem().equals("BOLETA") ? (new IntegerDocument(11)) : (new UpperCaseNumberDocument(20))));
            txt_rucreal.setText(numDoc);
            calcularpercepcion();
        } catch (Exception ex) {
            JOptionPane.showMessageDialog(null, "Error al cargar correlativo: /n" + ex.getMessage());
        }
    }

    private void mostrarPreimpreso() {
        if (xCorrelativo.size() > 0) {
            String preimpreso = xCorrelativo.get(cboSerie.getSelectedIndex()).getPreimpreso();
            int pre = Integer.parseInt(preimpreso);
            pre += 1;
            preimpreso = "0000000000" + pre;
            preimpreso = preimpreso.substring(preimpreso.length() - 10, preimpreso.length());
            txt_preimpreso.setText(String.valueOf(preimpreso));
        } else {
            JOptionPane.showMessageDialog(null, "No tien asignado correlativo al usuario");
        }
    }

    private void loadSerieCorrelativo(String ls_IdTipoDoc) throws Exception {
        try {
            RnCorrelativo regla_correlativo = new RnCorrelativo(path);
            if (xCorrelativo != null) {
                xCorrelativo.clear();
            } else {
                xCorrelativo = new ArrayList();
            }

            xCorrelativo.addAll(regla_correlativo.listarCorrelativo(usuario.getId_usuario(), usuario.getCodpuntoventa(), ls_IdTipoDoc));
            cboSerie.removeAllItems();
            for (int i = 0; i < xCorrelativo.size(); i++) {
                cboSerie.addItem(xCorrelativo.get(i).getSerie());
            }

            if (cboSerie.getItemCount() > 0) {
                cboSerie.setSelectedIndex(0);
            }
        } catch (Exception e) {
            throw e;
        }
    }

    private void calcularImportes() {
        BigDecimal descuentoPedido = BigDecimal.ZERO;
        BigDecimal noafectoPedido = BigDecimal.ZERO;
        BigDecimal afecto = BigDecimal.ZERO;
        BigDecimal igvPedido = BigDecimal.ZERO;
        BigDecimal percepcionPedido = BigDecimal.ZERO;
        BigDecimal monto = BigDecimal.ZERO;
        BigDecimal peso = BigDecimal.ZERO;
        BigDecimal mInafecto = BigDecimal.ZERO;
        BigDecimal mExonerado = BigDecimal.ZERO;
        NumberFormat formatter = NumberFormat.getInstance(new Locale("en_US"));

        for (int i = 0; i < mdl_venta.getRowCount(); i++) {
            BeanRegcontaItem beanrci = mdl_venta.getRci(i);

            monto = monto.add(beanrci.getMonto());
            peso = peso.add(beanrci.getPesototal());
            if (beanrci.getBeanItem().getTipoOperacionIgv().equalsIgnoreCase("EXONERADO")) {
                mExonerado = mExonerado.add(beanrci.getMnoafecto());
            } else if (beanrci.getBeanItem().getTipoOperacionIgv().equalsIgnoreCase("INAFECTO")) {
                mInafecto = mInafecto.add(beanrci.getMnoafecto());
            }
            noafectoPedido = noafectoPedido.add(beanrci.getMnoafecto());
            afecto = afecto.add(beanrci.getMafecto());
            descuentoPedido = new BigDecimal(BigInteger.ZERO);
            igvPedido = igvPedido.add(beanrci.getMigv());
            percepcionPedido = percepcionPedido.add(beanrci.getMpercepcion());
        }
        txtMontoInafecto.setText(mInafecto.setScale(numeroDecimales, RoundingMode.HALF_UP).toString());
        txtMontoExonerado.setText(mExonerado.setScale(numeroDecimales, RoundingMode.HALF_UP).toString());
        txtMonto.setText(FormatObject.formatNumber(formatter.format(monto.setScale(numeroDecimales, RoundingMode.HALF_UP)), 2));
        txtPesoTotal.setText(FormatObject.formatNumber(formatter.format(peso.setScale(numeroDecimales, RoundingMode.HALF_UP)), 2));
        txtIgv.setText(FormatObject.formatNumber(formatter.format(igvPedido.setScale(numeroDecimales, RoundingMode.HALF_UP)), 2));
        txtNoafecto.setText(FormatObject.formatNumber(formatter.format(noafectoPedido.setScale(numeroDecimales, RoundingMode.HALF_UP)), 2));
        txtAfecto.setText(FormatObject.formatNumber(formatter.format(afecto.setScale(numeroDecimales, RoundingMode.HALF_UP)), 2));
        txtPercepcion.setText(FormatObject.formatNumber(formatter.format(percepcionPedido.setScale(numeroDecimales, RoundingMode.HALF_UP)), 2));
        txtDescuento.setText(FormatObject.formatNumber(formatter.format(descuentoPedido.setScale(numeroDecimales, RoundingMode.HALF_UP)), 2));
    }

    private void cotPed() {
        boolean swCotPed = (chkCotizacion.isSelected() || chkPedido.isSelected());
        btnCotizacion.setVisible(swCotPed);
        cboMoneda.setEnabled(!swCotPed);
        btn_agregar.setEnabled(!swCotPed || Constans.ISCOTIZACIONEDIT);
        mdl_venta.setSwCotizacionPedido(swCotPed && !Constans.ISCOTIZACIONEDIT);
        this.configTableVenta(swCotPed && !Constans.ISCOTIZACIONEDIT);
        CTableFx.setAllColumnPreferredWidth(tbl_venta);
    }

    private void loadPublicGeneral() {
        Anexo c = new Anexo();
        c.setNumerodoc("00000000");
        List<Anexo> an = getClientes(c);

        if ((an != null) && (an.size() > 0)) {
            cargarCliente(an);
            if (com.softcommerce.util.Constans.ISPG) {
                this.txtClienteTemporal.setVisible(true);
                this.cbo_clienteficticio.setVisible(false);
            }
        }
    }

    private void changedTipoDoc() {
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

    private void changeAgRetencion(Anexo cliente) {
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

    private void calcularMontoRetencion() {
        if (chkAgRetencion.isSelected()) {
            BigDecimal totalCobrar = new BigDecimal(txtTotalCobrar.getText().trim());
            BigDecimal retencion; //= BigDecimal.ZERO;
            //if (totalCobrar.compareTo(new BigDecimal("700")) >= 0) {
            retencion = totalCobrar.multiply(Constans.PORC_RETENCION).setScale(numeroDecimales, RoundingMode.HALF_UP);
            //}
            txtTotalRetencion.setText(retencion.toString());
        } else {
            txtTotalRetencion.setText("0.0");
        }
    }

    private boolean cargarCliente(List<Anexo> reg) {
        try {
            numero = -1;
            if (reg != null && reg.size() > 0) {
                Anexo cliente = reg.get(0);
                txt_idclientereal.setText(cliente.getIdAnexo());
                txt_cliente.setText(cliente.getDescripcion());
                txt_rucreal.setText(cliente.getNumerodoc());
                txtDireccionReal.setText(cliente.getDireccion());
                txtCorreoCliente.setText(cliente.getEmail());
                this.changeAgRetencion(cliente);
                RnAnexo rg = new RnAnexo(path);

                if (lst_anexogrupo != null) {
                    lst_anexogrupo.clear();
                } else {
                    lst_anexogrupo = new ArrayList();
                }

                lst_anexogrupo.addAll(reg);

                List<Anexo> m = rg.listar("", cliente.getIdAnexo(), "");

                if (m != null && m.size() > 0) {
                    lst_anexogrupo.addAll(m);
                }

                cbo_clienteficticio.removeAllItems();
                for (int i = 0; i < lst_anexogrupo.size(); i++) {
                    cbo_clienteficticio.addItem(lst_anexogrupo.get(i).getDescripcion());
                }

                cbo_clienteficticio.setSelectedItem(cliente.getDescripcion());
                txtClienteTemporal.setText(cliente.getDescripcion());
                if (cliente.getFlagExceptuado().equalsIgnoreCase("S")) {
                    numero = 1;
                } else if (cliente.getFlagretencion().equalsIgnoreCase("S")) {
                    numero = 2;
                } else if (cliente.getFlagpercepcion().equalsIgnoreCase("S")) {
                    numero = 3;
                } else {
                    numero = -1;
                }
                calcularpercepcion();
                if (com.softcommerce.util.Constans.ISPG) {
                    this.txtClienteTemporal.setVisible(true);
                    this.cbo_clienteficticio.setVisible(false);
                } else {
                    this.txtClienteTemporal.setVisible(false);
                    this.cbo_clienteficticio.setVisible(true);
                }
                return true;
            }

            return false;
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, e.getMessage());
            return false;
        }
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
