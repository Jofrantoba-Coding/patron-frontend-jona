package com.softcommerce.views.uiregisterventalote;


import com.softcommerce.formularios.*;
import com.softcommerce.beans.Anexo;
import com.softcommerce.beans.BeanAnexo;
import com.softcommerce.beans.BeanCondicionPago;
import com.softcommerce.beans.BeanCotizacionCab;
import com.softcommerce.beans.BeanCotizacionDet;
import com.softcommerce.beans.BeanEstadoDocumento;
import com.softcommerce.beans.BeanItem;
import com.softcommerce.beans.BeanMoneda;
import com.softcommerce.beans.BeanPedidoCab;
import com.softcommerce.beans.BeanPedidoContacto;
import com.softcommerce.beans.BeanPrecioItem;
import com.softcommerce.beans.BeanPuntoVenta;
import com.softcommerce.beans.BeanRegcontaAdicional;
import com.softcommerce.beans.BeanRegcontaCab;
import com.softcommerce.beans.BeanRegcontaItem;
import com.softcommerce.beans.BeanRptaVenta;
import com.softcommerce.beans.BeanStock;
import com.softcommerce.beans.BeanTipoAnexo;
import com.softcommerce.beans.BeanTipoCambio;
import com.softcommerce.beans.BeanTipoDocVenta;
import com.softcommerce.beans.BeanTrabajador;
import com.softcommerce.beans.BeanVendedor;
import com.softcommerce.beans.ClienteDireccion;
import com.softcommerce.beans.TipoOperacion;
import com.softcommerce.beans.Usuario;
import com.softcommerce.beans.UsuarioCorrelativo;
import com.softcommerce.beans.Zona;
import com.softcommerce.comboboxmodel.ComboModelPrecio;
import com.softcommerce.datasource.DataSourceVenta;
import com.softcommerce.enums.AuxiliarEnum;
import com.softcommerce.enums.MonedaEnum;
import com.softcommerce.enums.TipoAnexoEnum;
import com.softcommerce.enums.TipoDocVentaEnum;
import com.softcommerce.general.controles.CButton;
import com.softcommerce.general.controles.CLabel;
import com.softcommerce.general.controles.CTable;
import com.softcommerce.general.controles.CuadroMensaje;
import com.softcommerce.general.controles.DoubleDocument;
import com.softcommerce.general.controles.IntegerDocument;
import com.softcommerce.general.controles.Register;
import com.softcommerce.general.controles.UpperCaseNumberDocument;
import com.softcommerce.general.herramientas.CFunciones;
import com.softcommerce.general.herramientas.CTableFx;
import com.softcommerce.general.herramientas.DateTime;
import com.softcommerce.general.tablas.PedidoContactoTableModel;
import com.softcommerce.general.tablas.TableModelItemAlmacen;
import com.softcommerce.general.tablas.TableModelItemVenta;
import com.softcommerce.general.tablas.TableModelRegcontaItem;
import com.softcommerce.iconos.Gif;
import com.softcommerce.logic.LogicConfiguracion;
import com.softcommerce.reglasnegocio.RnCotizacionCab;
import com.softcommerce.reglasnegocio.RnRegconta;
import com.softcommerce.reglasnegocio.RnTipoDocVenta;
import com.softcommerce.reglasnegocio.RnVendedor;
import com.softcommerce.reglasnegocio.RnAnexo;
import com.softcommerce.reglasnegocio.RnCliente;
import com.softcommerce.reglasnegocio.RnConsultas;
import com.softcommerce.reglasnegocio.RnCorrelativo;
import com.softcommerce.reglasnegocio.RnItem;
import com.softcommerce.reglasnegocio.RnStock;
import com.softcommerce.reglasnegocio.RnTipoCambio;
import com.softcommerce.reglasnegocio.RnTipoOperacion;
import com.softcommerce.reglasnegocio.RnRegContaCab;
import com.softcommerce.report.ConvertNumberToLetter;
import com.softcommerce.util.editor.CellEditorBtnLoteVenta;
import com.softcommerce.util.render.CellRenderer;
import com.softcommerce.util.editor.ComboBoxEditorPrecio;
import com.softcommerce.util.Constans;
import com.softcommerce.util.ExcelAdapter;
import com.softcommerce.util.ExceptionHandler;
import com.softcommerce.util.Exportar;
import com.softcommerce.util.FEtxt;
import com.softcommerce.util.FormatObject;
import com.softcommerce.util.combo.LoadCombo;
import com.softcommerce.util.LoadDataGenerica;
import com.softcommerce.util.Propiedad;
import com.softcommerce.util.combo.SingletonCombo;
import com.softcommerce.util.Util;
import com.softcommerce.util.VerificarEnteroMayorCero;
import com.softcommerce.util.VerificarEntreFechas;
import com.softcommerce.util.combo.LoadComboItem;
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
import javax.swing.event.TableModelEvent;
import javax.swing.event.TableModelListener;
import javax.swing.table.TableRowSorter;
import javax.swing.text.JTextComponent;
import net.sf.jasperreports.engine.JRParameter;
import java.net.URL;
import java.util.logging.Level;
import org.apache.log4j.Logger;

public class UiRegisterVentaLote
        extends JInternalFrame
        implements InterUiRegisterVentaLote, KeyListener, ActionListener, MouseListener, FocusListener,
        TableModelListener, ItemListener, DocumentListener, ChangeListener {

    private final Main frm;
    private JComboBox cboTipoOperIgv;
    private JComboBox cboPrecio;
    private JComboBox cboMoneda;
    private CButton btn_guardar;
    private CButton btnNuevo;
    private JButton btnBuscar;
    private JButton btnRefrescar;
    private CButton btnAgregar;
    private CButton btnQuitar;
    private ExcelAdapter adapterVenta;
    private JTable tblVenta;
    private TableModelRegcontaItem mdlVenta;
    private CTable tblProducto;
    private TableModelItemVenta mdlProducto;
    private TableRowSorter<TableModelItemVenta> modeloOrdenadoProducto;
    private CTable tblAlmacen;
    private TableModelItemAlmacen mdlAlmacen;
    private JTextField txtDescripcion;
    private JTextField txtIdItem;
    private JTextField txtMaximoProductos;
    private JTextField txtAfecto;
    private JTextField txtNoafecto;
    private JTextField txtMontoInafecto = new JTextField(BigDecimal.ZERO.toString());
    private JTextField txtMontoExonerado = new JTextField(BigDecimal.ZERO.toString());
    private JTextField txtIgv;
    private JTextField txtDescuento;
    private JTextField txtMonto;
    private JTextField txtPercepcion;
    private JTextField txtCantidad;
    private final Usuario usuario;
    private final URL path;
    private ComboBoxEditorPrecio editorPrecio;
    private ComboModelPrecio cboModelPrecio;
    private final CuadroMensaje cuadro;
    private JTextField txtPesoTotal;
    private Map<String, BeanPrecioItem> mapPrecio;
    private JCheckBox chkCotizacion;
    private JButton btnCotizacion;
    private BeanCotizacionCab beanCotizacion;
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
    private JTextField txtPreimpreso;
    private JDateChooser dcFechaEmision;
    private JTextField txtDiasPago;
    private JDateChooser dcFechaVence;
    private JComboBox cboCondPago;
    private JTextField txtTipoCambio;
    private JComboBox cbo_moneda;
    private JComboBox cbo_cancelaen;
    private JComboBox cboMedioPago;
    private JCheckBox chkPublicoGeneral;
    private JButton btnNuevocliente;
    private JTextField txtIdCliente;
    private JComboBox cboDireccion;
    private JButton btnBuscarcliente;
    private Gif gif;
    private JCheckBox chkPromocion;
    private JTextField txtCliente;
    private JTextField txtNumDocCliente;
    private JTextField txtRecibo;
    private JTextField txtVuelto;
    private JButton btn_cancelar;
    private JButton btnGuardar;
    private JComboBox cboVendedor;
    private JTextField txt_igv;
    private JTextField txt_trabajador;
    private JTextField txt_total;
    private JTextField txt_valorventa;
    private JTextField txt_descuento;
    private JTextField txt_afecto;
    private JTextField txt_noafecto;
    private JTextField txt_percepcion;
    private JTextField txt_totalcobrar;
    private List<BeanTipoDocVenta> xTipoDocVenta;
    private boolean blnClickAceptar = false;
    private int numero = -1;
    private List<UsuarioCorrelativo> xCorrelativo;
    private List<BeanVendedor> listaV;
    private String id_tipo_operacion;
    private boolean flag = false;
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
    private final Logger logger = Logger.getLogger(UiRegisterVentaLote.class);
    private CellEditorBtnLoteVenta editorLote;
    private JLabel TIPOOPERIGV = new JLabel("NORMAL");
    private JTextField txtSerieOc;
    private JTextField txtPreimpresoOc;
    private JTextField txtSerieGuia;
    private JTextField txtPreimpresoGuia;
    private JCheckBox chkProgramar;
    private JCheckBox chkNoImprimeTxt;

    public UiRegisterVentaLote(Main frm, String title, Usuario usuario, URL path) {
        super(title);
        cuadro = new CuadroMensaje(usuario);
        this.path = path;
        this.frm = frm;
        this.usuario = usuario;
        inicialize();
        initListener();
    }

    private void inicialize() {
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
        //pnlSouth.add(this.getPnlVenta(), BorderLayout.CENTER);
        return pnlSouth;
    }

    private JPanel getPnlProductoNorth() {
        JPanel pnlNorth = new JPanel();
        pnlNorth.setLayout(new BorderLayout());
        pnlNorth.setBackground(new Color(245, 245, 245));

        pnlNorth.add(this.getPnlFiltro(), BorderLayout.WEST);
        btnRefrescar = new JButton(gif.REFRESH16);
        btnRefrescar.setToolTipText("Refrescar");
        btnRefrescar.setFont(new Font("Helvetica", Font.BOLD, 13));
        btnRefrescar.setHorizontalTextPosition(SwingConstants.LEFT);
        btnRefrescar.setOpaque(false);
        btnRefrescar.setFocusPainted(false);
        btnRefrescar.setContentAreaFilled(true);
        btnRefrescar.setBorderPainted(true);
        JPanel pnlEast = new JPanel();
        JLabel lblMaxProd = new JLabel("Max Productos");
        txtMaximoProductos = new JTextField();
        txtMaximoProductos.setColumns(2);
        txtMaximoProductos.addFocusListener(this);
        txtMaximoProductos.setDocument(new IntegerDocument(2));
        txtMaximoProductos.setFont(new Font("Helvetica", Font.BOLD, 13));
        pnlEast.add(lblMaxProd);
        pnlEast.add(txtMaximoProductos);
        pnlEast.add(btnRefrescar);
        pnlNorth.add(pnlEast, BorderLayout.EAST);
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

        txtIdItem = new JTextField();
        txtIdItem.addKeyListener(this);
        txtIdItem.setColumns(5);
        txtIdItem.addFocusListener(this);
        if (Constans.IS_BUSQUEDA_ITEM_ALTERNO) {
            txtIdItem.setDocument(new UpperCaseNumberDocument(30));
        } else {
            txtIdItem.setDocument(new IntegerDocument(6));
        }
        txtIdItem.setFont(new Font("Helvetica", Font.BOLD, 13));
        gbc.gridx = 1;
        pnlFiltro.add(txtIdItem, gbc);

        JLabel lblItem = new JLabel("DESC");
        lblItem.setFont(new Font("Helvetica", Font.BOLD, 13));
        gbc.gridx = 2;
        pnlFiltro.add(lblItem, gbc);

        txtDescripcion = new JTextField();
        txtDescripcion.setFont(new Font("Helvetica", Font.BOLD, 13));
        txtDescripcion.setDocument(new UpperCaseNumberDocument());
        txtDescripcion.addFocusListener(this);
        txtDescripcion.addKeyListener(this);
        txtDescripcion.setColumns(15);
        gbc.gridx = 3;
        pnlFiltro.add(txtDescripcion, gbc);

        JLabel lblMarca = new JLabel("MONEDA");
        lblMarca.setFont(new Font("Helvetica", Font.BOLD, 13));
        gbc.gridx = 4;
        pnlFiltro.add(lblMarca, gbc);

        cboMoneda = new JComboBox();
        cboMoneda.setFont(new Font("Helvetica", Font.BOLD, 13));
        gbc.gridx = 5;
        pnlFiltro.add(cboMoneda, gbc);

        btnBuscar = new JButton(gif.BUSCAR);
        btnBuscar.setFont(new Font("Helvetica", Font.BOLD, 13));
        btnBuscar.setHorizontalTextPosition(SwingConstants.LEFT);
        btnBuscar.setToolTipText("Buscar");
        btnBuscar.setContentAreaFilled(true);
        btnBuscar.setBorderPainted(true);
        btnBuscar.setFocusable(true);
        btnBuscar.setFocusPainted(false);
        btnBuscar.addActionListener(this);
        btnBuscar.addKeyListener(this);
        btnBuscar.registerKeyboardAction(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                btnAgregar.requestFocus();
            }
        }, KeyStroke.getKeyStroke(KeyEvent.VK_ENTER, 0, false), JComponent.WHEN_FOCUSED);
        gbc.gridx = 6;
        pnlFiltro.add(this.btnBuscar, gbc);

        gbc.gridx = 7;
        gbc.gridx = 8;
        gbc.gridx = 9;
        cboTipoOperIgv = new JComboBox();
        cboTipoOperIgv.addItem("NORMAL");
        cboTipoOperIgv.addItem("GRATUITA");
        cboTipoOperIgv.addItem("EXPORTACION");
        cboTipoOperIgv.addItem("EXONERADA");
        cboTipoOperIgv.addItem("INAFECTO_MUESTRA_MEDICA");
        cboTipoOperIgv.setFont(new Font("Helvetica", Font.BOLD, 13));
        gbc.gridx = 10;
        pnlFiltro.add(cboTipoOperIgv, gbc);
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

        btnCotizacion = new JButton("", gif.SEARCH16);
        gbc.gridx = 8;
        btnCotizacion.setVisible(false);
        btnCotizacion.setToolTipText("Buscar Cotizacion");
        pnlFiltro.add(btnCotizacion, gbc);
        return pnlFiltro;
    }

    private JPanel getPnlVenta() {
        JPanel pnlVenta = new JPanel();
        pnlVenta.setLayout(new BorderLayout());
        pnlVenta.setOpaque(false);

        mdlVenta = new TableModelRegcontaItem();
        mdlVenta.addTableModelListener(this);
        editorLote = new CellEditorBtnLoteVenta(mdlVenta, this);
        tblVenta = new JTable();
        tblVenta.getTableHeader().setFont(new Font(Font.SANS_SERIF, 1, 11));
        tblVenta.setFont(new Font("Helvetica", Font.BOLD, 14));
        tblVenta.setModel(mdlVenta);
        tblVenta.setAutoResizeMode(JTable.AUTO_RESIZE_OFF);
        tblVenta.getColumnModel().getColumn(7).setMinWidth(0);
        tblVenta.getColumnModel().getColumn(7).setMaxWidth(0);
        tblVenta.getColumnModel().getColumn(11).setMinWidth(0);
        tblVenta.getColumnModel().getColumn(11).setMaxWidth(0);
        tblVenta.getColumnModel().getColumn(12).setMinWidth(0);
        tblVenta.getColumnModel().getColumn(12).setMaxWidth(0);
        tblVenta.getColumnModel().getColumn(13).setMinWidth(0);
        tblVenta.getColumnModel().getColumn(13).setMaxWidth(0);
        tblVenta.getColumnModel().getColumn(14).setMinWidth(0);
        tblVenta.getColumnModel().getColumn(14).setMaxWidth(0);
        tblVenta.getColumnModel().getColumn(15).setMinWidth(0);
        tblVenta.getColumnModel().getColumn(15).setMaxWidth(0);
        tblVenta.getColumnModel().getColumn(16).setMinWidth(0);
        tblVenta.getColumnModel().getColumn(16).setMaxWidth(0);
        this.configTableVenta(false);
        CTableFx.setAllColumnPreferredWidth(tblVenta);
        tblVenta.setSelectionMode(ListSelectionModel.SINGLE_SELECTION);
        CellRenderer CellRenderer = new CellRenderer();
        tblVenta.setDefaultRenderer(String.class, CellRenderer);
        tblVenta.setDefaultRenderer(BigDecimal.class, CellRenderer);
        tblVenta.getColumnModel().getColumn(4).setCellEditor(editorLote);
        tblVenta.getColumnModel().getColumn(4).setCellRenderer(editorLote);
        tblVenta.setAutoCreateRowSorter(true);
        JScrollPane scrollViewVenta = new JScrollPane(tblVenta);
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

        mdlProducto = new TableModelItemVenta();
        modeloOrdenadoProducto = new TableRowSorter(mdlProducto);
        tblProducto = new CTable();
        tblProducto.addKeyListener(this);
        tblProducto.addMouseListener(this);

        tblProducto.getTableHeader().setFont(new Font(Font.SANS_SERIF, 1, 11));
        tblProducto.setFont(new Font("Helvetica", Font.BOLD, 13));
        tblProducto.setRowSorter(modeloOrdenadoProducto);
        tblProducto.setModel(mdlProducto);
        tblProducto.registerKeyboardAction(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                txtCantidad.requestFocus();
            }
        }, KeyStroke.getKeyStroke(KeyEvent.VK_ENTER, 0, false), JComponent.WHEN_ANCESTOR_OF_FOCUSED_COMPONENT);

        tblProducto.setAllColumnNoResizable();
        tblProducto.setRendererColumnZero();
        tblProducto.setAllTableNoEditable();
        tblProducto.setNoVisibleColumn(4);
        tblProducto.setNoVisibleColumn(6);
        tblProducto.setNoVisibleColumn(9);
        tblProducto.setNoVisibleColumn(10);
        tblProducto.setNoVisibleColumn(11);
        tblProducto.setNoVisibleColumn(12);
        tblProducto.setNoVisibleColumn(13);
        tblProducto.setNoVisibleColumn(14);
        tblProducto.setNoVisibleColumn(16);
        tblProducto.setAllColumnPreferredWidthNvo(5);

        JScrollPane scrollViewProducto = new JScrollPane(tblProducto);
        scrollViewProducto.setPreferredSize(new Dimension(600, 100));
        pnlProducto.add(scrollViewProducto, BorderLayout.CENTER);
        return pnlProducto;
    }

    private JPanel getPnlProductoAlmacen() {
        JPanel pnlAlmacen = new JPanel();
        pnlAlmacen.setLayout(new BorderLayout());
        pnlAlmacen.setBackground(new Color(245, 245, 245));

        mdlAlmacen = new TableModelItemAlmacen();
        tblAlmacen = new CTable();
        tblAlmacen.getTableHeader().setFont(new Font(Font.SANS_SERIF, 1, 11));
        tblAlmacen.setFont(new Font("Helvetica", Font.BOLD, 13));
        tblAlmacen.setModel(mdlAlmacen);
        tblAlmacen.addKeyListener(this);
        tblAlmacen.addMouseListener(this);
        tblAlmacen.setAllColumnNoResizable();
        tblAlmacen.setAllTableNoEditable();
        CTableFx.alignRightColumnTable(tblAlmacen, 1);
        CTableFx.alignRightColumnTable(tblAlmacen, 2);
        tblAlmacen.setAllColumnPreferredWidthNvo(5);
        tblAlmacen.registerKeyboardAction(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                procesoAgregar();
            }
        }, KeyStroke.getKeyStroke(KeyEvent.VK_ENTER, 0, false), JComponent.WHEN_ANCESTOR_OF_FOCUSED_COMPONENT);

        JScrollPane scrollViewAlmacen = new JScrollPane(tblAlmacen);
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

        btnAgregar = new CButton("(F8) Agregar Item", gif.ADDORANGE, "Agregar Item", 'B');
        btnQuitar = new CButton("(F9) Quitar Item", gif.DELETERED, "Quitar Item", 'B');
        btn_guardar = new CButton("(↑Shift) Guardar Venta", gif.SAVE16, "Guardar Venta", 'B');
        btnNuevo = new CButton("(F6) Limpiar Venta", gif.NEW16, "Limpiar Venta", 'B');

        btnAgregar.registerKeyboardAction(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                btnQuitar.requestFocus();
            }
        }, KeyStroke.getKeyStroke(KeyEvent.VK_ENTER, 0, false), JComponent.WHEN_FOCUSED);
        btnQuitar.registerKeyboardAction(new ActionListener() {
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
                txtDescripcion.requestFocus();
            }
        }, KeyStroke.getKeyStroke(KeyEvent.VK_ENTER, 0, false), JComponent.WHEN_FOCUSED);

        pnl_botones.add(btnAgregar);
        pnl_botones.add(btnQuitar);
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

        txtCantidad = new JTextField();
        txtCantidad.addKeyListener(this);
        txtCantidad.addFocusListener(this);
        txtCantidad.setDocument(new DoubleDocument());
        txtCantidad.setColumns(7);
        txtCantidad.setFont(new Font("Helvetica", Font.BOLD, 13));
        pnlProductoSouth.add(txtCantidad);

        JLabel lbl_precio = new JLabel("PRECIO");
        lbl_precio.setFont(new Font("Helvetica", Font.BOLD, 13));
        pnlProductoSouth.add(lbl_precio);
        cboPrecio = new JComboBox();
        cboPrecio.setPreferredSize(new Dimension(70, 25));
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
                txtDescripcion.requestFocus();
            }
        }, KeyStroke.getKeyStroke(KeyEvent.VK_ENTER, 0, false), JComponent.WHEN_ANCESTOR_OF_FOCUSED_COMPONENT);
        pnlProductoSouth.add(cboPrecio);
        cboPrecio.addItemListener(itemListener);
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
        txtPreimpreso = new JTextField();
        txtPreimpreso.setEditable(false);
        txtPreimpreso.setColumns(10);
        pnlDocumento.add(txtPreimpreso, gbc);

        gbc.gridx = 0;
        gbc.gridy = 2;
        JLabel lblFEmision = new JLabel("F Emision");
        pnlDocumento.add(lblFEmision, gbc);

        gbc.gridx = 1;
        gbc.gridwidth = 2;
        dcFechaEmision = new JDateChooser("dd/MM/yyyy", "##/##/####", '_');
        try {
            ((JTextFieldDateEditor) dcFechaEmision.getDateEditor()).setInputVerifier(new VerificarEntreFechas(frm.getFechaInicio(), this.getFechaFinal(new Date(Main.fechaActualServer.getTime()))));
        } catch (Exception ex1) {
            System.out.println("ex1 = " + ex1.getMessage());
        }
        pnlDocumento.add(dcFechaEmision, gbc);

        gbc.gridx = 1;
        gbc.gridy = 3;

        chkProgramar = new JCheckBox("Programar");
        pnlDocumento.add(chkProgramar, gbc);

        gbc.gridx = 2;
        gbc.gridy = 3;
        chkNoImprimeTxt = new JCheckBox("No imprime TXT");
        pnlDocumento.add(chkNoImprimeTxt, gbc);
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
        gbc.gridwidth = 2;
        pnlFormaPago.add(cboCondPago, gbc);
        gbc.gridwidth = 1;

        gbc.gridx = 3;
        JLabel lblDias = new JLabel("T Dias");
        pnlFormaPago.add(lblDias, gbc);

        gbc.gridx = 4;
        txtDiasPago = new JTextField();
        txtDiasPago.setDocument(new IntegerDocument(3));
        txtDiasPago.setColumns(3);
        txtDiasPago.setEnabled(false);
        txtDiasPago.setInputVerifier(new VerificarEnteroMayorCero());
        pnlFormaPago.add(txtDiasPago, gbc);

        gbc.gridx = 5;
        JLabel lblVence = new JLabel("F Vence");
        pnlFormaPago.add(lblVence, gbc);

        gbc.gridx = 6;
        dcFechaVence = new JDateChooser("dd/MM/yyyy", "##/##/####", '_');
        dcFechaVence.setEnabled(false);
        pnlFormaPago.add(dcFechaVence, gbc);

        gbc.gridx = 0;
        gbc.gridy = 1;
        JLabel lblMoneda = new JLabel("Moneda");
        pnlFormaPago.add(lblMoneda, gbc);

        gbc.gridx = 1;
        cbo_moneda = new JComboBox();
        cbo_moneda.setEnabled(false);
        gbc.gridwidth = 2;
        pnlFormaPago.add(cbo_moneda, gbc);
        gbc.gridwidth = 1;

        gbc.gridx = 3;
        JLabel lblTCambio = new JLabel("T Cambio");
        pnlFormaPago.add(lblTCambio, gbc);

        gbc.gridx = 4;
        txtTipoCambio = new JTextField();
        //txtTipoCambio.setEditable(false);
        pnlFormaPago.add(txtTipoCambio, gbc);
        gbc.fill = GridBagConstraints.NONE;

        gbc.gridx = 5;
        JLabel lblDespacho = new JLabel("F Despacho");
        pnlFormaPago.add(lblDespacho, gbc);

        gbc.gridx = 6;
        dc_fdespacho = new JDateChooser("dd/MM/yyyy", "##/##/####", '_');
        dc_fdespacho.setEnabled(false);
        pnlFormaPago.add(dc_fdespacho, gbc);

        gbc.gridx = 0;
        gbc.gridy = 2;
        JLabel lblTPago = new JLabel("T Pago");
        pnlFormaPago.add(lblTPago, gbc);

        gbc.gridx = 1;
        gbc.fill = GridBagConstraints.HORIZONTAL;
        cboMedioPago = new JComboBox();
        gbc.gridwidth = 2;
        pnlFormaPago.add(cboMedioPago, gbc);
        gbc.gridwidth = 1;

        gbc.gridx = 3;
        JLabel lblCancela = new JLabel("Cancela en");
        pnlFormaPago.add(lblCancela, gbc);

        gbc.gridwidth = 3;
        gbc.gridx = 4;
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
        gbc.gridwidth = 2;
        pnlFormaPago.add(cboModVta, gbc);
        gbc.gridwidth = 1;
        JLabel lblModDespacho = new JLabel("Despacho");
        gbc.gridx = 3;
        pnlFormaPago.add(lblModDespacho, gbc);

        cboModDespacho = new JComboBox();
        cboModDespacho.addItem("Almacen Empresa");
        cboModDespacho.addItem("Almacen Proveedor");
        cboModDespacho.setEnabled(false);
        gbc.gridx = 4;
        gbc.gridwidth = 3;
        pnlFormaPago.add(cboModDespacho, gbc);
        gbc.gridwidth = 1;
        gbc.fill = GridBagConstraints.NONE;

        gbc.gridy = 4;
        JLabel lblOc = new JLabel("Oc");
        JLabel lblGuia = new JLabel("Guia");
        txtSerieOc = new JTextField();
        txtPreimpresoOc = new JTextField();
        txtSerieGuia = new JTextField();
        txtPreimpresoGuia = new JTextField();
        if (Constans.IS_ADICIONALES_VENTA) {
            gbc.gridx = 0;
            pnlFormaPago.add(lblOc, gbc);
            gbc.gridx = 1;
            FormatObject.formatJTextFieldSerie(txtSerieOc);
            gbc.insets = new Insets(2, 2, 2, 0);
            pnlFormaPago.add(txtSerieOc, gbc);
            gbc.gridx = 2;
            FormatObject.formatJTextFieldPreimpreso(txtPreimpresoOc);
            gbc.insets = new Insets(2, 0, 2, 2);
            pnlFormaPago.add(txtPreimpresoOc, gbc);
            gbc.insets = new Insets(2, 2, 2, 2);
            gbc.gridx = 3;
            pnlFormaPago.add(lblGuia, gbc);
            gbc.gridx = 4;
            FormatObject.formatJTextFieldSerie(txtSerieGuia);
            gbc.insets = new Insets(2, 2, 2, 0);
            pnlFormaPago.add(txtSerieGuia, gbc);
            gbc.gridx = 5;
            FormatObject.formatJTextFieldPreimpreso(txtPreimpresoGuia);
            gbc.insets = new Insets(2, 0, 2, 2);
            gbc.gridwidth = 2;
            pnlFormaPago.add(txtPreimpresoGuia, gbc);
            gbc.gridwidth = 1;
        }
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
        txtIdCliente = new JTextField();
        txtIdCliente.setEditable(false);
        txtIdCliente.setColumns(7);
        gbc.fill = GridBagConstraints.HORIZONTAL;
        pnlCliente.add(txtIdCliente, gbc);
        gbc.fill = GridBagConstraints.NONE;

        gbc.gridx = 2;
        txtCliente = new JTextField();
        txtCliente.setDocument(new UpperCaseNumberDocument(255));
        txtCliente.setColumns(20);
        pnlCliente.add(txtCliente, gbc);

        gbc.gridx = 3;
        JLabel lblRucCliente = new JLabel("RUC/DNI");
        lblRucCliente.setFont(new Font("Arial", 0, 10));
        pnlCliente.add(lblRucCliente, gbc);
        gbc.gridx = 4;
        txtNumDocCliente = new JTextField();
        txtNumDocCliente.setDocument(new UpperCaseNumberDocument(20));
        txtNumDocCliente.setColumns(7);
        pnlCliente.add(txtNumDocCliente, gbc);

        gbc.gridx = 0;
        gbc.gridy = 1;
        JLabel lbl_direccionreal = new JLabel("Direccion");
        lbl_direccionreal.setFont(new Font("Arial", 0, 11));
        pnlCliente.add(lbl_direccionreal, gbc);

        gbc.gridx = 1;
        gbc.gridwidth = 4;
        gbc.fill = GridBagConstraints.HORIZONTAL;
        cboDireccion = new JComboBox();
        pnlCliente.add(cboDireccion, gbc);
        gbc.gridwidth = 1;
        return pnlCliente;
    }

    private JPanel getPnlOpcCenter() {
        JPanel pnlOpc = new JPanel(new FlowLayout(FlowLayout.LEFT, 5, 5));
        chkPublicoGeneral = new JCheckBox("PUBLICO GENERAL");
        chkPublicoGeneral.setOpaque(false);
        pnlOpc.add(chkPublicoGeneral);

        JLabel lblbuscar = new JLabel("F7");
        lblbuscar.setFont(new Font(Font.SANS_SERIF, 0, 9));
        lblbuscar.setForeground(Color.BLUE);
        pnlOpc.add(lblbuscar);

        btnBuscarcliente = new JButton(gif.SEARCH16);
        btnBuscarcliente.setToolTipText("Buscar");
        btnBuscarcliente.setContentAreaFilled(true);
        btnBuscarcliente.setBorderPainted(true);
        btnBuscarcliente.setFocusable(true);
        btnBuscarcliente.setFocusPainted(false);
        pnlOpc.add(this.btnBuscarcliente);

        JLabel lblnuevo = new JLabel("F8");
        lblnuevo.setFont(new Font(Font.SANS_SERIF, 1, 9));
        lblnuevo.setForeground(Color.BLUE);
        pnlOpc.add(lblnuevo);

        btnNuevocliente = new JButton(gif.ADDORANGE);
        btnNuevocliente.setToolTipText("Nuevo");
        btnNuevocliente.setFocusPainted(false);
        pnlOpc.add(this.btnNuevocliente);

        chkPromocion = new JCheckBox("PROMOCION");
        chkPromocion.setOpaque(false);
        chkPromocion.setEnabled(false);
        pnlOpc.add(chkPromocion);
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
        txtRecibo = new JTextField();
        txtRecibo.setFont(new Font("Arial", 1, 17));
        txtRecibo.setColumns(7);
        txtRecibo.setDocument(new DoubleDocument());
        pnlRecibo.add(txtRecibo, gbc);

        gbc.gridx = 2;
        gbc.fill = GridBagConstraints.HORIZONTAL;
        btnGuardar = new JButton("(↑Shift) Guardar", gif.SAVE16);
        btnGuardar.setOpaque(false);
        pnlRecibo.add(btnGuardar, gbc);

        gbc.gridx = 0;
        gbc.gridy = 1;
        JLabel lblVuelto = new JLabel("Vuelto");
        lblVuelto.setForeground(new Color(10, 52, 10));
        lblVuelto.setFont(new Font("Arial", 1, 11));
        pnlRecibo.add(lblVuelto, gbc);

        gbc.gridx = 1;
        txtVuelto = new JTextField();
        txtVuelto.setFont(new Font("Arial", 1, 17));
        txtVuelto.setForeground(new Color(9, 26, 0));
        txtVuelto.setEditable(false);
        pnlRecibo.add(txtVuelto, gbc);

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

        cboVendedor = new JComboBox();
        pnlNorth.add(cboVendedor);

        JLabel lbl_trabajador = new JLabel("Usuario");
        lbl_trabajador.setFont(new Font("Arial", 0, 11));
        pnlNorth.add(lbl_trabajador);

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

        txt_totalcobrar = new JTextField();
        txt_totalcobrar.setFont(new Font("Arial", 1, 12));
        txt_totalcobrar.setForeground(Color.RED);
        txt_totalcobrar.setEditable(false);
        txt_totalcobrar.setColumns(9);
        pnlSouth.add(txt_totalcobrar);

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
        btnCotizacion.addActionListener(this);
        cboMoneda.addKeyListener(this);
        cboMoneda.addActionListener(this);
        cboMoneda.addItemListener(this);
        cboTipoDocumento.addActionListener(this);
        cboTipoDocumento.addKeyListener(this);
        cboSerie.addActionListener(this);
        cboSerie.addKeyListener(this);
        btnAgregar.addActionListener(this);
        btnQuitar.addActionListener(this);
        btn_guardar.addActionListener(this);
        btnNuevo.addActionListener(this);

        btnAgregar.addKeyListener(this);
        btnQuitar.addKeyListener(this);
        btn_guardar.addKeyListener(this);
        btnNuevo.addKeyListener(this);

        dcFechaEmision.getJCalendar().addMouseListener(this);
        dcFechaEmision.getJCalendar().addFocusListener(this);
        dcFechaEmision.getJCalendar().addKeyListener(this);
        dcFechaEmision.getCalendarButton().addMouseListener(this);
        dcFechaEmision.getCalendarButton().addActionListener(this);
        dcFechaEmision.addMouseListener(this);
        dcFechaEmision.addKeyListener(this);
        dcFechaEmision.addFocusListener(this);
        cboCondPago.addKeyListener(this);
        cboCondPago.addActionListener(this);
        txtDiasPago.addKeyListener(this);
        txtDiasPago.addActionListener(this);
        txtDiasPago.addFocusListener(this);
        chkPublicoGeneral.addKeyListener(this);
        chkPublicoGeneral.addActionListener(this);
        chkPublicoGeneral.addItemListener(this);
        btnBuscarcliente.addActionListener(this);
        btnBuscarcliente.addKeyListener(this);
        btnNuevocliente.addActionListener(this);
        btnNuevocliente.addKeyListener(this);
        txtCliente.addFocusListener(this);
        txtCliente.addKeyListener(this);
        txtNumDocCliente.addFocusListener(this);
        txtNumDocCliente.addKeyListener(this);
        txtRecibo.addKeyListener(this);
        txtRecibo.addFocusListener(this);
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
        txtCliente.getDocument().addDocumentListener(this);
        btnAgregarContacto.addActionListener(this);
        btnQuitarContacto.addActionListener(this);
        this.txtPreimpreso.addKeyListener(this);
        ((JTextFieldDateEditor) dcFechaEmision.getDateEditor()).addKeyListener(this);
        this.txtTipoCambio.addKeyListener(this);
        ((JTextFieldDateEditor) dc_fdespacho.getDateEditor()).addKeyListener(this);
        this.cboModVta.addKeyListener(this);
        this.cboMedioPago.addKeyListener(this);
        this.txtIdCliente.addKeyListener(this);
        this.txtVuelto.addKeyListener(this);
        this.cboVendedor.addKeyListener(this);
        this.btnGuardar.addKeyListener(this);
        tabb.addChangeListener(this);
        cboDireccion.addItemListener(this);
        tblVenta.addFocusListener(this);
        tblVenta.addKeyListener(this);
        tblVenta.addMouseListener(this);
        tblVenta.setCellSelectionEnabled(true);    
        adapterVenta=new ExcelAdapter(tblVenta);
        cboTipoOperIgv.addItemListener(this);
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

    private void eventListener() {
        ((JTextFieldDateEditor) dcFechaEmision.getDateEditor()).addFocusListener(new FocusListener() {
            @Override
            public void focusGained(FocusEvent e) {
            }

            @Override
            public void focusLost(FocusEvent e) {
                changeFechaEmision();
                calcFVenc();
            }
        });
        dcFechaEmision.getDateEditor().addPropertyChangeListener(new PropertyChangeListener() {
            @Override
            public void propertyChange(PropertyChangeEvent e) {
                if ("date".equals(e.getPropertyName())) {
                    cboCondPago.requestFocus();
                    changeFechaEmision();
                }
            }
        });
        ((JTextField) dcFechaEmision.getDateEditor()).registerKeyboardAction(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                cboCondPago.requestFocus();
                changeFechaEmision();
            }
        }, KeyStroke.getKeyStroke(KeyEvent.VK_ENTER, 0, false), JComponent.WHEN_FOCUSED);
        ((JTextField) dcFechaEmision.getDateEditor()).registerKeyboardAction(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                dcFechaEmision.getCalendarButton().doClick();
            }
        }, KeyStroke.getKeyStroke(KeyEvent.VK_SPACE, 0, false), JComponent.WHEN_FOCUSED);
    }

    private void changeFechaEmision() {
        logger.info("changeFechaEmision()");
        RnTipoCambio logTC = new RnTipoCambio(path);
        try {
            chkProgramar.setSelected(this.isFechaEmisionMajorServer());
            dcFechaVence.setDate(dcFechaEmision.getDate());
            dc_fdespacho.setDate(dcFechaEmision.getDate());
            BeanTipoCambio bean = logTC.getBeanTipoCambio(new java.sql.Date(dcFechaEmision.getDate().getTime()),
                    MonedaEnum.SOLES.getValue());
            txtTipoCambio.setText(bean.getMontoventa().toString());
            txtDiasPago.setText("0");
        } catch (Exception ex) {
            try {
                Date fechaEmision = new Date(Main.fechaActualServer.getTime());
                //dcFechaVence.setDate(fechaEmision);
                //dc_fdespacho.setDate(fechaEmision);
                BeanTipoCambio bean = logTC.getBeanTipoCambio(new java.sql.Date(fechaEmision.getTime()),
                        MonedaEnum.SOLES.getValue());
                if (bean != null) {
                    txtTipoCambio.setText(bean.getMontoventa().toString());
                } else {
                    txtTipoCambio.setText("0");
                }
                txtDiasPago.setText("0");
            } catch (ClassNotFoundException ex1) {
                JOptionPane.showMessageDialog(null, ex.getMessage());
            } catch (InstantiationException ex1) {
                JOptionPane.showMessageDialog(null, ex.getMessage());
            } catch (IllegalAccessException ex1) {
                JOptionPane.showMessageDialog(null, ex.getMessage());
            } catch (Exception ex1) {
                JOptionPane.showMessageDialog(null, ex.getMessage());
            }
        }
    }

    private boolean isFechaEmisionMajorServer() {
        Date fechaServer = new Date(Main.fechaActualServer.getTime());
        Date fechaEmision = dcFechaEmision.getDate();
        return fechaEmision.after(fechaServer);
    }

    private Date getZeroTimeDate(Date date) {
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(date);
        calendar.set(Calendar.HOUR_OF_DAY, 0);
        calendar.set(Calendar.MINUTE, 0);
        calendar.set(Calendar.SECOND, 0);
        calendar.set(Calendar.MILLISECOND, 0);
        date = calendar.getTime();
        return date;
    }

    private void changeCotizacion() {
        boolean sw = chkCotizacion.isSelected();
        if (!sw) {
            if (beanCotizacion != null) {
                mdlVenta.clearTable();
                beanCotizacion = null;
                chkPublicoGeneral.setSelected(true);
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

    private void configTableVenta(boolean swCotPed) {
        tblVenta.getColumnModel().getColumn(9).setMinWidth(100);
        tblVenta.getColumnModel().getColumn(9).setMaxWidth(500);
        tblVenta.getColumnModel().getColumn(10).setMinWidth(0);
        tblVenta.getColumnModel().getColumn(10).setMaxWidth(0);
        if (swCotPed) {
            tblVenta.getColumnModel().getColumn(17).setMinWidth(100);
            tblVenta.getColumnModel().getColumn(17).setMaxWidth(500);
        } else {
            tblVenta.getColumnModel().getColumn(17).setMinWidth(0);
            tblVenta.getColumnModel().getColumn(17).setMaxWidth(0);
        }

    }

    @Override
    public void focusGained(FocusEvent e) {
        if (e.getSource() == txtIdItem) {
            txtIdItem.selectAll();
        }
        if (((JTextFieldDateEditor) dcFechaEmision.getDateEditor()) == e.getSource()) {
            ((JTextFieldDateEditor) dcFechaEmision.getDateEditor()).selectAll();
        }

        if (e.getSource() == txtDescripcion) {
            txtDescripcion.selectAll();
        }

        if (e.getSource() == txtCantidad) {
            txtCantidad.selectAll();
        }

        if (e.getSource() == cboPrecio.getEditor().getEditorComponent()) {
            cboPrecio.getEditor().selectAll();
        }
        if (txtCliente == e.getSource()) {
            txtCliente.selectAll();
        }
        if (txtNumDocCliente == e.getSource()) {
            txtNumDocCliente.selectAll();
        }
        if (txtRecibo == e.getSource()) {
            txtRecibo.selectAll();
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
        String codItem = txtIdItem.getText().trim();
        if (Constans.IS_BUSQUEDA_ITEM_ALTERNO) {
            txtIdItem.setText(codItem);
        } else {
            int longitud = codItem.length();
            for (int i = 0; i < 6 - longitud; i++) {
                codItem = "0" + codItem;
            }
            txtIdItem.setText(codItem);
        }

    }

    @Override
    public void focusLost(FocusEvent e) {
        if (e.getSource() == txtIdItem && txtIdItem.getText().trim().length() > 0) {
            valorCodItem();
        }
        if (e.getSource() == txtCantidad && txtCantidad.getText().trim().length() == 0) {
            txtCantidad.setText("0.0");
        }
        if (e.getSource().equals(txtDiasPago)) {
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
            txtIdItem.setText("");
            txtDescripcion.setText("");
            txtCantidad.setText("0.0");
            cboPrecio.getEditor().setItem("0.0");
            setFechas();
            chkPublicoGeneral.setSelected(true);
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
        txtIdItem.setText("");
        txtDescripcion.setText("");
        txtAfecto.setText("0.0");
        txtPercepcion.setText("0.0");
        txtNoafecto.setText("0.0");
        txtIgv.setText("0.0");
        txtMonto.setText("0.0");
        txtPesoTotal.setText("0.0");
        mdlVenta.clearTable();
        CTableFx.setAllColumnPreferredWidth(tblVenta);
        cboCondPago.setSelectedIndex(0);
        txtDescripcion.requestFocus();
        loadPublicGeneral();
    }

    private Date getFechaFinal(Date fechaEmision) {
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(fechaEmision);
        calendar.add(Calendar.DAY_OF_YEAR, 15);
        return calendar.getTime();
    }

    private void setFechas() {
        try {
            Date fechaEmision = new Date(Main.fechaActualServer.getTime());
            dcFechaEmision.setDate(fechaEmision);
            dcFechaVence.setDate(fechaEmision);
            dc_fdespacho.setDate(fechaEmision);
            dcFechaEmision.setSelectableDateRange(frm.getFechaInicio(), this.getFechaFinal(fechaEmision));
            RnTipoCambio logicTc = new RnTipoCambio(path);

            BeanTipoCambio tc = logicTc.getBeanTipoCambio(new java.sql.Date(dcFechaEmision.getDate().getTime()), "00004");
            if (tc != null) {
                txtTipoCambio.setText(tc.getMontoventa().toString());
            }
        } catch (Exception ex) {
            JOptionPane.showMessageDialog(null, ex.getMessage());
        }
    }

    private String getIdMoneda() {
        return xMoneda.get(cboMoneda.getSelectedIndex()).getIdMoneda();
    }

    private BigDecimal getPrecioItem() {
        BigDecimal precio = new BigDecimal(cboPrecio.getSelectedItem().toString().trim());
        BeanItem productoNew = mdlProducto.getItem(tblProducto.convertRowIndexToModel(tblProducto.getSelectedRow()));
        if (Constans.IS_PRECIO_INCLUYEIGV) {
            return precio;
        }
        if (this.cboTipoOperIgv.getSelectedItem().toString().equalsIgnoreCase("INAFECTO_MUESTRA_MEDICA")
                || this.cboTipoOperIgv.getSelectedItem().toString().equalsIgnoreCase("EXPORTACION")
                || this.cboTipoOperIgv.getSelectedItem().toString().equalsIgnoreCase("EXONERADA")) {
            return precio;
        } else if (productoNew.getTipoOperacionIgv().equalsIgnoreCase("AFECTO")) {
            BigDecimal mult;
            try {
                mult = BigDecimal.ONE.add(LoadDataGenerica.getPorcIgvDec(path, usuario));
            } catch (Exception e) {
                mult = new BigDecimal("1.18");
            }
            return precio.multiply(mult);
        } else {
            return precio;
        }
    }

    private void agregarItem() {
        try {
            if (!verificarMoneda(this.getIdMoneda())) {
                JOptionPane.showMessageDialog(null, "Error al ingresar Item: \nTodos los Item deben tener misma moneda");
                return;
            }
            BeanItem productoNew = mdlProducto.getItem(tblProducto.convertRowIndexToModel(tblProducto.getSelectedRow()));
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
            cantidad = new BigDecimal(txtCantidad.getText().trim());
            //BigDecimal precio = new BigDecimal(cboPrecio.getSelectedItem().toString().trim());
            BigDecimal precio = this.getPrecioItem();
            BeanStock almacen = mdlAlmacen.getStock(tblAlmacen.convertRowIndexToModel(tblAlmacen.getSelectedRow()));
            if (producto.getTipoItem().equalsIgnoreCase("P") && !this.validateCantidad(cantidad, almacen.getDisponible())) {
                JOptionPane.showMessageDialog(this, "no cuenta con stock suficiente para agregar item");
                return;
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
            //beanRci.setPrecioMinimo(this.validPrecio.getPrecioMinimo());
            beanRci.setMafecto(mafecto);
            beanRci.setMnoafecto(mnoafecto);
            beanRci.setPigv(pigv);
            beanRci.setMigv(migv);
            beanRci.setMonto(monto);
            beanRci.setPpercepcion(usuario.getFlagpercepcion().equals("S") ? (producto.getFlagPercepcion().equals("S") ? new BigDecimal("2") : BigDecimal.ZERO) : BigDecimal.ZERO);
            beanRci.setMpercepcion(beanRci.getMonto().multiply(beanRci.getPpercepcion()).setScale(numeroDecimales, RoundingMode.HALF_UP));
            beanRci.setTotal(beanRci.getMonto().add(beanRci.getMpercepcion()));
            beanRci.setPesototal(producto.getPesobruto().multiply(cantidad));
            beanRci.setFlagAutorizado("S");
            //beanRci.setModelAlmacen(this.getComboModelAlmacen(almacen.getBeanAlmacen()));
            if (!verificarItemPercepcion(beanRci.getBeanItem().getFlagPercepcion())) {
                JOptionPane.showMessageDialog(null, "Error al ingresar Item: \nVerifique estados de S/N de percepcion");
                return;
            }
            if (producto.getTipoItem().equalsIgnoreCase("P")) {
                FormLoteVenta formLote = new FormLoteVenta(this.frm, this.path, beanRci, this, btnAgregar);
                formLote.loadData();
                formLote.setCantidadIngreso(beanRci.getCantidad());
                formLote.setLocationRelativeTo(null);
                formLote.setVisible(true);
            } else {
                BigDecimal cantIngreso = beanRci.getCantPendiente();
                beanRci.setCantPendiente(BigDecimal.ZERO);
                mdlVenta.agregarRci(beanRci);
                mdlVenta.setValueCantidad(beanRci, mdlVenta.getRowCount() - 1, cantIngreso.toString());
                CTableFx.setAllColumnPreferredWidth(tblVenta);
                txtDescripcion.requestFocus();
            }
        } catch (CloneNotSupportedException ex) {
            java.util.logging.Logger.getLogger(UiRegisterVentaLote.class.getName()).log(Level.SEVERE, null, ex);
        }
    }

    private boolean validateCantidad(BigDecimal cantidad, BigDecimal disponible) {
        return cantidad.compareTo(disponible) != 1;
    }

    private void generarVenta() {
        try {
            registerTipoCambio();
            tabb.setEnabledAt(1, true);
            tabb.setEnabledAt(2, true);
            tabb.setSelectedIndex(1);
            calcularpercepcion();
            chkPromocion.setSelected(flagPromocion());
            String id_tipo_doc = "TI";
            if (beanCotizacion != null) {
                if (beanCotizacion.getBeanCliente().getNumero().trim().length() > 8) {
                    id_tipo_doc = "01";
                }
            }
            for (int i = 0; i < xTipoDocVenta.size(); i++) {
                if (xTipoDocVenta.get(i).getIdTipoDoc().equals(id_tipo_doc)) {
                    cboTipoDocumento.setSelectedIndex(i);
                    break;
                } else {
                    cboTipoDocumento.setSelectedIndex(0);
                }
            }
            actualizarCorrelativo();
            mostrarPreimpreso();
            this.btnGuardar.requestFocus();
        } catch (Exception e) {
            ExceptionHandler.handleException(e, logger);
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }

    private boolean flagPromocion() {
        for (int i = 0; i < mdlVenta.getRowCount(); i++) {
            if (mdlVenta.getRci(i).getBeanItem().getFlagPromocion().equals("S")) {
                return true;
            }
        }
        return false;
    }

    private void calcularpercepcion() {
        if (!blnClickAceptar) {
            BigDecimal monto_percepcion = BigDecimal.ZERO;
            for (int i = 0; i < mdlVenta.getRowCount(); i++) {
                monto_percepcion = monto_percepcion.add(mdlVenta.getRci(i).getMonto());
            }

            BigDecimal m_percepcion = BigDecimal.ZERO;
            BigDecimal monto = BigDecimal.ZERO;
            BigDecimal m_afecto = BigDecimal.ZERO;
            BigDecimal m_noafecto = BigDecimal.ZERO;
            BigDecimal m_igv = BigDecimal.ZERO;
            BigDecimal m_descuento = BigDecimal.ZERO;

            for (int i = 0; i < mdlVenta.getRowCount(); i++) {
                if (mdlVenta.getRci(i).getBeanItem().getFlagPercepcion().equals("S")) {
                    if (xTipoDocVenta.get(cboTipoDocumento.getSelectedIndex()).getIdTipoDoc().equals("01")) {
                        switch (numero) {
                            case 1:
                            case 2:
                                mdlVenta.getRci(i).setPpercepcion(BigDecimal.ZERO);
                                break;
                            case 3:
                                mdlVenta.getRci(i).setPpercepcion(new BigDecimal("0.005"));
                                break;
                            default:
                                mdlVenta.getRci(i).setPpercepcion(new BigDecimal("0.02"));
                                break;
                        }
                    } else if (xTipoDocVenta.get(cboTipoDocumento.getSelectedIndex()).getIdTipoDoc().equals("03")) {
                        BigDecimal valorPercepcion = paramValorPercepcion;//new BigDecimal("1500");
                        if (this.getIdMoneda().trim().equalsIgnoreCase(MonedaEnum.DOLARES.getValue())) {
                            try {
                                RnTipoCambio logicTc = new RnTipoCambio(path);
                                Date fechaEmision = new Date(dcFechaEmision.getDate() == null
                                        ? Main.fechaActualServer.getTime() : dcFechaEmision.getDate().getTime());
                                BeanTipoCambio tc = logicTc.getBeanTipoCambio(new java.sql.Date(fechaEmision.getTime()),
                                        "00004");
                                if (tc != null) {
                                    valorPercepcion = valorPercepcion.divide(tc.getMontocompra(), numeroDecimales, RoundingMode.HALF_UP);
                                }
                            } catch (Exception ex) {
                            }
                        }
                        if (monto_percepcion.compareTo(valorPercepcion) == 1) {
                            mdlVenta.getRci(i).setPpercepcion(new BigDecimal("0.02"));
                        } else {
                            mdlVenta.getRci(i).setPpercepcion(BigDecimal.ZERO);
                        }
                    }
                } else {
                    mdlVenta.getRci(i).setPpercepcion(BigDecimal.ZERO);
                }
                if (usuario.getFlagpercepcion().equals("S")) {
                    if (mdlVenta.getRci(i).getBeanItem().getFlagPercepcion().equals("S")) {
                        mdlVenta.getRci(i).setMpercepcion(mdlVenta.getRci(i).getMonto().multiply(mdlVenta.getRci(i).getPpercepcion()).setScale(numeroDecimales, RoundingMode.HALF_UP));
                    }
                }

                m_percepcion = m_percepcion.add(mdlVenta.getRci(i).getMpercepcion());
                monto = monto.add(mdlVenta.getRci(i).getMonto());
                m_afecto = m_afecto.add(mdlVenta.getRci(i).getMafecto());
                m_noafecto = m_noafecto.add(mdlVenta.getRci(i).getMnoafecto());
                m_igv = m_igv.add(mdlVenta.getRci(i).getMigv());
                m_descuento = m_descuento.add(BigDecimal.ZERO);

                BigDecimal valorVenta = monto.subtract(m_igv);
                txt_valorventa.setText(valorVenta.toString());
                txt_igv.setText(m_igv.toString());
                txt_descuento.setText(m_descuento.toString());
                txt_afecto.setText(m_afecto.toString());
                txt_noafecto.setText(m_noafecto.toString());
                txt_total.setText(monto.toString());
                BigDecimal valorRecibo = monto.add(m_percepcion);
                txtRecibo.setText(valorRecibo.toString());
                txt_percepcion.setText(m_percepcion.toString());
                BigDecimal valorCobrar = monto.add(m_percepcion);
                txt_totalcobrar.setText(valorCobrar.toString());
                txtVuelto.setText("0.0");
            }
        }
    }

    private void loadTipoDocumento() throws Exception {
        try {
            RnTipoDocVenta regla_TipoDoc = new RnTipoDocVenta(path);
            if (xTipoDocVenta != null) {
                xTipoDocVenta.clear();
            } else {
                xTipoDocVenta = new ArrayList();
            }

            xTipoDocVenta.addAll(regla_TipoDoc.listarTipoDocVenta("", "", "", "A", "VE", "", ""));
            cboTipoDocumento.removeAllItems();
            for (int i = 0; i < xTipoDocVenta.size(); i++) {
                if (xTipoDocVenta.get(i).getIdTipoDoc().equals("CO")) {
                    xTipoDocVenta.remove(i);
                }
                cboTipoDocumento.addItem(xTipoDocVenta.get(i).getDescripcion());
            }

            if (xTipoDocVenta.size() > 0) {
                cboTipoDocumento.setSelectedIndex(0);
                actualizarCorrelativo();
                mostrarPreimpreso();
            }
        } catch (Exception e) {
            throw e;
        }
    }

    private boolean verificarMoneda(String idMoneda) {
        boolean valor = true;
        List<BeanRegcontaItem> lista = mdlVenta.getData();
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
        List<BeanRegcontaItem> lista = mdlVenta.getData();
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
            mdlProducto.clearTable();
            List<BeanItem> lista;
            lista = logic.listarProductoVenta(usuario.getCodlocalidad());
            mdlProducto.agregarListItem(lista);
            tblProducto.setAllColumnPreferredWidthNvo(5);
            cargarProductoPrecioAll();
            mdlAlmacen.clearTable();
            tblAlmacen.setAllColumnPreferredWidthNvo(5);
        } catch (Exception e) {
            throw e;
        }
    }

    private void cargarProductoPrecioAll() throws Exception {
        try {
            RnItem logic = new RnItem(path);
            List<BeanPrecioItem> lista;
            lista = logic.listarProductoPrecioVenta(usuario.getCodlocalidad(), "");
            mapPrecio = new HashMap<String, BeanPrecioItem>();
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
        cboModelPrecio = new ComboModelPrecio(this.obtenerPrecios(beanPrecioItem));
        cboPrecio.setModel(cboModelPrecio);
        if (cboPrecio.getItemCount() > 0) {
            cboPrecio.getEditor().setItem(this.getPrecioEditor(beanPrecioItem));
        }
    }

    private Set obtenerPrecios(BeanPrecioItem beanPrecioItem) {
        Set precios = new HashSet();
        if (this.getIdMoneda().equals(MonedaEnum.SOLES.getValue())) {
            if (beanPrecioItem.getPrecio1().compareTo(BigDecimal.ZERO) == 1) {
                precios.add(beanPrecioItem.getPrecio1());
            }
            if (beanPrecioItem.getPrecio2().compareTo(BigDecimal.ZERO) == 1) {
                precios.add(beanPrecioItem.getPrecio2());
            }
            if (beanPrecioItem.getPrecio3().compareTo(BigDecimal.ZERO) == 1) {
                precios.add(beanPrecioItem.getPrecio3());
            }
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
        if (precios.isEmpty()) {
            precios.add(BigDecimal.ZERO);
        }
        return precios;
    }

    private BigDecimal getPrecioEditor(BeanPrecioItem beanPrecioItem) {
        if (this.getIdMoneda().equals(MonedaEnum.SOLES.getValue())) {
            if (beanPrecioItem.getPrecio1().compareTo(BigDecimal.ZERO) == 1) {
                return beanPrecioItem.getPrecio1();
            }
            if (beanPrecioItem.getPrecio2().compareTo(BigDecimal.ZERO) == 1) {
                return beanPrecioItem.getPrecio2();
            }
            if (beanPrecioItem.getPrecio3().compareTo(BigDecimal.ZERO) == 1) {
                return beanPrecioItem.getPrecio3();
            }
            return BigDecimal.ZERO;
        }
        if (beanPrecioItem.getPrecio4().compareTo(BigDecimal.ZERO) == 1) {
            return beanPrecioItem.getPrecio4();
        }
        if (beanPrecioItem.getPrecio5().compareTo(BigDecimal.ZERO) == 1) {
            return beanPrecioItem.getPrecio5();
        }
        if (beanPrecioItem.getPrecio6().compareTo(BigDecimal.ZERO) == 1) {
            return beanPrecioItem.getPrecio6();
        }
        return BigDecimal.ZERO;
    }

    @Override
    public void keyPressed(KeyEvent e) {

        if (KeyEvent.VK_SHIFT == e.getKeyCode() && tabb.getSelectedIndex() == 0) {
            tblProducto.editCellAt(-1, -1);
            tblVenta.editCellAt(-1, -1);
            btn_guardar.requestFocus();
            btn_guardar.doClick();
            return;
        }
        if (KeyEvent.VK_ALT == e.getKeyCode() && tabb.getSelectedIndex() == 0) {
            txtDescripcion.requestFocus();
            txtDescripcion.selectAll();
            return;
        }

        if (KeyEvent.VK_ALT == e.getKeyCode() && tabb.getSelectedIndex() == 1) {
            this.cboTipoDocumento.requestFocus();
            return;
        }

        if (KeyEvent.VK_SHIFT == e.getKeyCode() && tabb.getSelectedIndex() == 1) {
            guardarDocumento();
            return;
        }
        if (e.getKeyCode() == KeyEvent.VK_F10) {
            cargarDatos();
            return;
        }

        if (e.getKeyCode() == KeyEvent.VK_F9) {
            tblProducto.editCellAt(-1, -1);
            tblVenta.editCellAt(-1, -1);
            btnQuitar.requestFocus();
            btnQuitar.doClick();
            return;
        }

        if (e.getKeyCode() == KeyEvent.VK_F8) {
            tblProducto.editCellAt(-1, -1);
            tblVenta.editCellAt(-1, -1);
            btnAgregar.requestFocus();
            btnAgregar.doClick();
            return;
        }

        if (e.getKeyCode() == KeyEvent.VK_F6) {
            tblProducto.editCellAt(-1, -1);
            tblVenta.editCellAt(-1, -1);
            btnNuevo.requestFocus();
            btnNuevo.doClick();
            return;
        }

        if ((e.getSource() == txtDescripcion)
                || (e.getSource() == txtIdItem)) {
            filtrarTablaProducto();
            if (e.getKeyChar() == '\n') {
                tblProducto.requestFocus();
            }
        }
        if (e.getKeyChar() == '\n') {
            if (e.getSource() == cboMoneda) {
                btnBuscar.requestFocus();
            }
            if ((e.getSource() == txtDescripcion)
                    || (e.getSource() == txtIdItem)) {
                if (txtIdItem.getText().trim().length() > 0) {
                    valorCodItem();
                    filtrarTablaProducto();
                }
            }

            if (e.getSource() == txtCantidad) {
                cboPrecio.getEditor().getEditorComponent().requestFocus();
            }
            if (e.getSource() == txtCliente) {
                if (txtCliente.getText().trim().length() > 0) {
                    verificarCliente(false);
                } else {
                    txtNumDocCliente.requestFocus();
                }
            }

            if (e.getSource() == txtNumDocCliente) {
                if (txtNumDocCliente.getText().trim().length() > 0) {
                    verificarCliente(true);
                }
            }

        }

    }

    private void procesoVerificar() {
        tblProducto.editCellAt(-1, -1);
        tblVenta.editCellAt(-1, -1);

        if (tblProducto.getSelectedRow() == -1) {
            JOptionPane.showMessageDialog(frm, "Debe seleccionar el Item a agregar", "Seleccionar Item", JOptionPane.INFORMATION_MESSAGE);
        } else if ((txtCantidad.getText().trim().length() > 0) && (Double.valueOf(txtCantidad.getText().trim()) > 0)) {
            if (tblAlmacen.getRowCount() > 0) {
                if (tblAlmacen.getSelectedRow() == -1) {
                    tblAlmacen.setRowSelectionInterval(0, 0);
                    tblAlmacen.requestFocus();
                } else {
                    tblAlmacen.requestFocus();
                }
            } else {
                JOptionPane.showMessageDialog(frm, "El item no se encuentra disponible en ningun almacen", "No tiene almacen", JOptionPane.INFORMATION_MESSAGE);
            }
        } else {
            JOptionPane.showMessageDialog(frm, "Debe especificar la cantidad del Item", "Espeficicar Cantidad", JOptionPane.INFORMATION_MESSAGE);
            this.txtCantidad.requestFocus();
            this.txtCantidad.selectAll();
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
            tblProducto.editCellAt(-1, -1);
            tblVenta.editCellAt(-1, -1);

            if (tblProducto.getSelectedRow() == -1) {
                JOptionPane.showMessageDialog(frm, "Debe seleccionar el Item a agregar", "Seleccionar Item", JOptionPane.INFORMATION_MESSAGE);
                return;
            }
            if (!this.validateCantidad()) {
                JOptionPane.showMessageDialog(frm, "Debe especificar la cantidad del Item",
                        "Especificar Cantidad",
                        JOptionPane.INFORMATION_MESSAGE);
                return;
            }
            if (tblAlmacen.getRowCount() == 0) {
                JOptionPane.showMessageDialog(frm, "El item no se encuentra disponible en ningun almacen",
                        "No tiene almacen",
                        JOptionPane.INFORMATION_MESSAGE);
                return;
            }
            int maximoProductos = this.getMaximoProductos();
            if (mdlVenta.getRowCount() >= maximoProductos) {
                JOptionPane.showMessageDialog(frm, "No puede registrar mas de " + maximoProductos + " items.", "Numero maximo de Items", JOptionPane.INFORMATION_MESSAGE);
                return;
            }
            String clave = mdlProducto.getItem(tblProducto.convertRowIndexToModel(tblProducto.getSelectedRow())).getIdItem() + mdlAlmacen.getStock(tblAlmacen.convertRowIndexToModel(tblAlmacen.getSelectedRow())).getBeanAlmacen().getIdAlmacen();
            if (mdlVenta.existeItem(clave)) {
                JOptionPane.showMessageDialog(this, "El producto ya está agregado");
                return;
            }
            this.agregarItem();
            try {
                cboPrecio.setSelectedIndex(1);
                cboPrecio.getEditor().setItem(cboPrecio.getSelectedItem());
            } catch (Exception ex) {
            }
        } catch (HeadlessException e) {
            JOptionPane.showMessageDialog(this, e.getMessage());
        } catch (NumberFormatException e) {
            this.txtCantidad.setText("1");
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, e.getMessage());
            this.txtCantidad.setText("1");
        }
    }

    private boolean validateCantidad() {
        if (txtCantidad.getText().trim().length() == 0) {
            return false;
        }
        return Double.valueOf(txtCantidad.getText().trim()) > 0;
    }

    private void procesoCargarAlmacen() {
        try {
            if (tblProducto.getSelectedRow() >= 0) {
                if (mdlProducto.getItem(tblProducto.convertRowIndexToModel(tblProducto.getSelectedRow())).getIdItem().equals(idItem)) {
                    return;
                }
                idItem = mdlProducto.getItem(tblProducto.convertRowIndexToModel(tblProducto.getSelectedRow())).getIdItem();
                mdlAlmacen.clearTable();
                RnStock regla = new RnStock(path);
                /*List<BeanStock> lista = regla.listarStockVentas(usuario.getCodempresa(), usuario.getCodpuntoventa(), 
                        mdlProducto.getItem(tblProducto.convertRowIndexToModel(tblProducto.getSelectedRow())).getIdItem(), 
                        usuario.getCodlocalidad(), "S");*/
                List<BeanStock> lista = regla.listarStockVentasLote(usuario.getCodpuntoventa(),
                        mdlProducto.getItem(tblProducto.convertRowIndexToModel(tblProducto.getSelectedRow())).getIdItem(),
                        usuario.getCodlocalidad(), "S", Main.anio);
                mdlAlmacen.agregarListStock(lista);
                tblAlmacen.setAllColumnPreferredWidthNvo(5);
                cargarPrecios(mdlProducto.getItem(tblProducto.convertRowIndexToModel(tblProducto.getSelectedRow())).getIdItem());
                if (tblAlmacen.getRowCount() > 0) {
                    tblAlmacen.setRowSelectionInterval(0, 0);
                    if (tblVenta.getRowCount() > 0) {
                        String id_almacen = mdlVenta.getRci(tblVenta.getRowCount() - 1).getBeanAlmacen().getIdAlmacen();
                        for (int i = 0; i < tblAlmacen.getRowCount(); i++) {
                            if (id_almacen.equals(mdlAlmacen.getStock(i).getBeanAlmacen().getIdAlmacen())) {
                                tblAlmacen.setRowSelectionInterval(i, i);
                                break;
                            }
                        }
                    }
                }
            } else if (tblAlmacen.getRowCount() > 0) {
                mdlAlmacen.clearTable();
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
            tblProducto.editCellAt(-1, -1);
            tblVenta.editCellAt(-1, -1);

            if (e.getSource() == tblProducto) {
                procesoCargarAlmacen();
            }
        }
        if ((e.getSource() == txtCliente && txtCliente.getText().trim().length() == 0)
                || (e.getSource() == txtNumDocCliente && txtNumDocCliente.getText().trim().length() == 0)) {
            chkPublicoGeneral.setSelected(false);
        }
        if (txtRecibo == e.getSource()) {
            if (txtRecibo.getText().length() > 0
                    && Character.isDigit(txtRecibo.getText().charAt(0))) {
                double vuelto = Double.valueOf(txtRecibo.getText().trim()) - Double.valueOf(txt_totalcobrar.getText().trim());
                double vueltoRedondeado = CFunciones.redondea(vuelto, 2);
                txtVuelto.setText(String.valueOf(vueltoRedondeado));
            } else {
                txtVuelto.setText(String.valueOf(0.0));
            }
        }
    }

    @Override
    public void mouseClicked(MouseEvent e) {
        if (e.getClickCount() == 1) {
            tblProducto.editCellAt(-1, -1);
            tblVenta.editCellAt(-1, -1);

            if (e.getSource() == tblProducto) {
                procesoCargarAlmacen();
            }
        }

        if (e.getClickCount() == 2) {
            tblProducto.editCellAt(-1, -1);
            tblVenta.editCellAt(-1, -1);

            if (e.getSource() == tblProducto) {
                int fila = tblProducto.rowAtPoint(e.getPoint());
                int columna = tblProducto.columnAtPoint(e.getPoint());

                if ((fila >= 0) && (columna == 5 || columna == 4)) {
                } else {
                    procesoAgregar();
                }
            }

            if (e.getSource() == tblAlmacen) {
                procesoAgregar();
            }
        }
        if (e.getSource().equals(dcFechaEmision.getCalendarButton())) {
            ((JTextField) dcFechaEmision.getDateEditor()).requestFocus();
        }
    }

    @Override
    public void mouseReleased(MouseEvent e) {
        if (e.getSource() == tblProducto) {
            tblVenta.editCellAt(-1, -1);
            procesoCargarAlmacen();
        }

        if (e.getSource() == tblVenta) {
            tblProducto.editCellAt(-1, -1);
        }
    }

    @Override
    public void tableChanged(TableModelEvent e) {
        if (e.getSource() == mdlVenta) {
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
            chkPublicoGeneral.setSelected(true);
            limpiarVenta();
            modeltableContacto.clearTable();
            setFechas();
            beanCotizacion = null;
            txtDescripcion.requestFocus();
            this.cargarTabla();
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, e.getMessage());
            ExceptionHandler.handleException(e, logger);
        }
    }

    private void filtrarTablaProducto() {
        modeloOrdenadoProducto.setRowFilter(getFilterProducto());
        tblProducto.setAllColumnPreferredWidthNvo(5);
        if (tblProducto.getRowCount() > 0) {
            tblProducto.setRowSelectionInterval(0, 0);
            procesoCargarAlmacen();
        }
    }

    private RowFilter getFilterProducto() {
        List filters = new ArrayList();
        if (cboMoneda.getSelectedIndex() >= 0) {
            filters.add(RowFilter.regexFilter(".*" + this.getIdMoneda() + ".*", 6));
        }
        if (txtIdItem.getText().trim().length() > 0) {
            filters.add(RowFilter.regexFilter(".*" + txtIdItem.getText().trim() + ".*", 0));
        }
        if (txtDescripcion.getText().trim().length() > 0) {
            filters.add(RowFilter.regexFilter(".*" + txtDescripcion.getText().trim() + ".*", 1));
        }
        RowFilter fooBarFilter = RowFilter.andFilter(filters);
        return fooBarFilter;
    }

    public void setValueSearch(Object valor, Component comp) {
        if (comp == btnCotizacion) {
            if (chkCotizacion.isSelected()) {
                beanCotizacion = (BeanCotizacionCab) valor;
                cargarCotizacion();
                this.txtDescripcion.requestFocus();
            }
        }
        if (comp == btnBuscarcliente) {
            flag = true;
            Anexo a = new Anexo();
            a.setIdAnexo(valor.toString());
            cargarCliente(getClientes(a));
            chkPublicoGeneral.setSelected((txtCliente.getText().trim().equals("PUBLICO GENERAL")));
            flag = false;
        }
        if (comp.equals(btnAgregar)) {
            BeanRegcontaItem bean = (BeanRegcontaItem) valor;
            BigDecimal cantIngreso = bean.getCantPendiente();
            bean.setCantPendiente(BigDecimal.ZERO);
            mdlVenta.agregarRci(bean);
            mdlVenta.setValueCantidad(bean, mdlVenta.getRowCount() - 1, cantIngreso.toString());
            txtDescripcion.requestFocus();
            mdlVenta.fireTableDataChanged();
            CTableFx.setAllColumnPreferredWidth(tblVenta);
        }
        if (comp.equals(btnRefrescar)) {
            editorLote.stopCellEditing();
            BeanRegcontaItem beanRci = (BeanRegcontaItem) valor;
            mdlVenta.reloadLotes(beanRci);
            mdlVenta.fireTableDataChanged();
            CTableFx.setAllColumnPreferredWidth(tblVenta);
        }
    }

    private void cargarCotizacion() {
        try {
            TIPOOPERIGV.setText(beanCotizacion.getTipoOperacionIgv());
            this.cboTipoOperIgv.setSelectedItem(beanCotizacion.getTipoOperacionIgv());
            this.cboMoneda.setSelectedItem(beanCotizacion.getBeanMoneda().getDescripcion());
            flag = true;
            Anexo a = new Anexo();
            a.setIdAnexo(beanCotizacion.getBeanCliente().getIdCliente());
            cargarCliente(getClientes(a));
            chkPublicoGeneral.setSelected((txtCliente.getText().trim().equals("PUBLICO GENERAL")));
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
            mdlVenta.clearTable();
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
                beanRci.setListLoteVenta(new ArrayList());
                beanRci.setCantPendiente(BigDecimal.ZERO);
                beanRci.getBeanItem().setTipoItem("P");
                mdlVenta.agregarRci(beanRci);
            }
            CTableFx.setAllColumnPreferredWidth(tblVenta);
            if (Constans.ISCOTIZACIONEDIT) {
                beanCotizacion = null;
            }
        } catch (Exception e) {
            ExceptionHandler.handleException(e, logger);
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }

    private void eventCondPago() throws Exception {
        try {
            if (cboCondPago.getItemCount() > 0) {
                txtDiasPago.setText("0");
                RnTipoCambio logTC = new RnTipoCambio(path);
                try {
                    dcFechaVence.setDate(dcFechaEmision.getDate());
                    dc_fdespacho.setDate(dcFechaEmision.getDate());
                    BeanTipoCambio bean = logTC.getBeanTipoCambio(new java.sql.Date(dcFechaEmision.getDate().getTime()),
                            MonedaEnum.SOLES.getValue());
                    txtTipoCambio.setText(bean.getMontoventa().toString());
                    BeanVendedor vend = new BeanVendedor();
                    String flags = cboCondPago.getSelectedItem().toString();
                    if (flags.equals("CONTADO")) {
                        vend.setFLAG_CONTADO("S");
                    } else {
                        vend.setFLAG_CREDITO("S");
                    }
                    RnVendedor regla = new RnVendedor(path);
                    listaV = regla.listarVendedor2(vend);

                    cboVendedor.removeAllItems();
                    for (int i = 0; i < listaV.size(); i++) {
                        cboVendedor.addItem(listaV.get(i).getNOMBRES());
                    }
                    cboVendedor.setSelectedItem("SIN VENDEDOR");
                } catch (Exception ex) {
                    try {
                        Date fechaEmision = new Date(Main.fechaActualServer.getTime());
                        dcFechaVence.setDate(fechaEmision);
                        dc_fdespacho.setDate(fechaEmision);
                        BeanTipoCambio bean = logTC.getBeanTipoCambio(new java.sql.Date(fechaEmision.getTime()),
                                MonedaEnum.SOLES.getValue());
                        if (bean != null) {
                            txtTipoCambio.setText(bean.getMontoventa().toString());
                        } else {
                            txtTipoCambio.setText("0");
                        }
                    } catch (ClassNotFoundException ex1) {
                    } catch (InstantiationException ex1) {
                    } catch (IllegalAccessException ex1) {
                    } catch (Exception ex1) {
                    }
                }

                txtDiasPago.setEnabled((!cboCondPago.getSelectedItem().equals("CONTADO") && !cboCondPago.getSelectedItem().equals("TARJETA") && !cboCondPago.getSelectedItem().equals("OPERACION BANCARIA")));
                cboMedioPago.removeAllItems();
                cboMedioPago.setEnabled((cboCondPago.getSelectedItem().equals("TARJETA") || cboCondPago.getSelectedItem().equals("CONTADO")));

                if (cboCondPago.getSelectedItem().equals("TARJETA")) {
                    cboMedioPago.addItem("TARJETA DINNER");
                    cboMedioPago.addItem("TARJETA MC PROCESS");
                    cboMedioPago.addItem("TARJETA VISA");
                    cboMedioPago.setSelectedItem("TARJETA VISA");
                }

                if (cboCondPago.getSelectedItem().equals("CONTADO")) {
                    cboMedioPago.addItem("EFECTIVO MN");
                    cboMedioPago.setSelectedItem("EFECTIVO MN");
                }
                TipoOperacion t = new TipoOperacion();
                t.setTasa_p(-1);
                t.setNumero(-1);
                t.setTasa_d(-1);
                t.setTasa(-1);
                t.setId_empresa(usuario.getCodempresa());

                RnTipoOperacion regla = new RnTipoOperacion(path);
                List<TipoOperacion> lst_to;

                t.setDescripcion(cboCondPago.getSelectedItem().equals("CREDITO") ? "VENTA EN OFICINA CREDITO" : "VENTA EN OFICINA CONTADO");
                lst_to = regla.listarTipoOperacion(t);

                String tipo_operacion;

                if ((lst_to != null) && (lst_to.size() > 0)) {
                    tipo_operacion = lst_to.get(0).getCodigo();
                } else {
                    if (this.getIdMoneda().equalsIgnoreCase(MonedaEnum.SOLES.getValue())) {
                        t.setDescripcion(cboCondPago.getSelectedItem().equals("CREDITO") ? "VENTA MN EN OFICINA CREDITO" : "VENTA MN EN OFICINA CONTADO");
                    } else if (this.getIdMoneda().equalsIgnoreCase(MonedaEnum.DOLARES.getValue())) {
                        t.setDescripcion(cboCondPago.getSelectedItem().equals("CREDITO") ? "VENTA USD EN OFICINA CREDITO" : "VENTA USD EN OFICINA CONTADO");
                    } else {
                        JOptionPane.showMessageDialog(null, "Error al establecer condicion de pago");
                    }
                    lst_to = regla.listarTipoOperacion(t);

                    if ((lst_to != null) && (lst_to.size() > 0)) {
                        tipo_operacion = lst_to.get(0).getCodigo();
                    } else {
                        tipo_operacion = "";
                    }
                }
                id_tipo_operacion = tipo_operacion == null ? "" : tipo_operacion;
                txtDiasPago.setText((cboCondPago.getSelectedItem().equals("CONTADO")
                        || cboCondPago.getSelectedItem().equals("TARJETA")
                        || cboCondPago.getSelectedItem().equals("OPERACION BANCARIA")) ? "0" : "0");
            }
        } catch (Exception e) {
            throw e;
        }
    }

    private void calcFVenc() {
        if (Integer.parseInt(txtDiasPago.getText()) >= 0) {
            int numDias = Integer.parseInt(txtDiasPago.getText());
            Calendar hoy = Calendar.getInstance();
            try {
                hoy.setTime(dcFechaEmision.getDate());
            } catch (Exception ex) {
                try {
                    Date fechaEmision = new Date(Main.fechaActualServer.getTime());
                    hoy.setTime(fechaEmision);
                } catch (Exception ex1) {
                    JOptionPane.showMessageDialog(null, ex.getMessage());
                }
            }
            hoy.add(Calendar.DATE, numDias);
            dcFechaVence.setDate(hoy.getTime());
        } else {
            dcFechaVence.setDate(dcFechaEmision.getDate());
        }
    }

    private boolean verificarCliente(boolean isNumeroDoc) {
        Anexo a = new Anexo();
        a.setNumerodoc(isNumeroDoc ? txtNumDocCliente.getText().trim() : "");
        a.setDescripcion(isNumeroDoc ? "" : txtCliente.getText().trim());
        a.setIdEmpresa(usuario.getCodempresa());
        a.setIdTipoAnexo("2");

        List<Anexo> anexo = getClientes(a);

        if ((anexo == null) || (anexo.isEmpty())) {
            int xRes = JOptionPane.showConfirmDialog(this, "El Cliente con el N° Documento " + txtNumDocCliente.getText().trim()
                    + " no existe. Desea Ingresar el Cliente?", "Cliente No Ingresado",
                    JOptionPane.YES_NO_OPTION, JOptionPane.INFORMATION_MESSAGE);

            if (xRes == JOptionPane.OK_OPTION) {
                this.nuevoCliente();
            } else {
                txtNumDocCliente.requestFocus();
            }
            return false;
        }
        if (anexo.size() == 1) {
            cargarCliente(anexo);
            return true;
        }
        JOptionPane.showMessageDialog(null, "Puede que Exista dos ó más clientes con el \n mismo numero de documento \n comuniquese con el Supervisor");
        BuscarCliente search = new BuscarCliente(frm, this, path, "ventaLote");
        search.cargarTabla(a, btnBuscarcliente, 0);
        return false;
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

        BuscarCliente search = new BuscarCliente(frm, this, path, "ventaLote");
        search.cargarTabla(a, btnBuscarcliente, 0);
    }

    private boolean isRegisterValid() throws Exception {
        try {
            JTextField txt = new JTextField();
            cboTipoDocumento.setBorder(txt.getBorder());
            cboSerie.setBorder(txt.getBorder());
            txtPreimpreso.setBorder(txt.getBorder());
            dcFechaEmision.setBorder(new JDateChooser().getBorder());
            cboCondPago.setBorder(txt.getBorder());
            cbo_moneda.setBorder(txt.getBorder());
            txtDiasPago.setBorder(txt.getBorder());
            txtCliente.setBorder(txt.getBorder());
            txtNumDocCliente.setBorder(txt.getBorder());
            txt_trabajador.setBorder(txt.getBorder());
            txt_igv.setBorder(txt.getBorder());
            cbo_cancelaen.setBorder(txt.getBorder());
            cboMedioPago.setBorder(txt.getBorder());
            txtRecibo.setBorder(txt.getBorder());

            if (!(cboSerie.getSelectedIndex() >= 0)) {
                JOptionPane.showMessageDialog(this, "Para generar un Documento, debes especificar su Serie.", "Datos incompletos.", JOptionPane.OK_OPTION);
                cboSerie.setBorder(new LineBorder(Color.RED));
                cboSerie.requestFocus();
                return false;
            }

            if (txtPreimpreso.getText().trim().length() == 0) {
                JOptionPane.showMessageDialog(this, "Para generar un Documento, debes especificar su Pre-Impreso.", "Datos incompletos.", JOptionPane.CANCEL_OPTION);
                txtPreimpreso.setBorder(new LineBorder(Color.RED));
                txtPreimpreso.requestFocus();
                txtPreimpreso.selectAll();
                return false;
            }

            if ((txtPreimpreso.getText().length() > 0) && (txtPreimpreso.getText().length() < 10)) {
                JOptionPane.showMessageDialog(this, "El número de Pre-Impreso que has especificado no es válida. Compruébala e inténtalo de nuevo.", "Datos incompletos", 2);
                txtPreimpreso.setBorder(new LineBorder(Color.RED));
                txtPreimpreso.requestFocus();
                txtPreimpreso.selectAll();
                return false;
            }
            if (((JTextFieldDateEditor) dcFechaEmision.getDateEditor()).getText().equals("__/__/____")
                    || !DateTime.isValidDate(((JTextFieldDateEditor) dcFechaEmision.getDateEditor()).getText())) {
                JOptionPane.showMessageDialog(this, "La fecha de Emision que has especificado no es válida. Compruébala e inténtalo de nuevo.", "Datos incompletos", 2);
                dcFechaEmision.setBorder(new LineBorder(Color.RED));
                dcFechaEmision.requestFocus();
                return false;
            }

            if (xTipoDocVenta.get(cboTipoDocumento.getSelectedIndex()).getIdTipoDoc().equals("01")) {
                if (txtCliente.getText().trim().length() == 0) {
                    JOptionPane.showMessageDialog(this, "Para generar una Factura, debes especificar el Nombre del Cliente.", "Datos incompletos.", JOptionPane.OK_OPTION);
                    txtCliente.setBorder(new LineBorder(Color.RED));
                    txtCliente.requestFocus();
                    txtCliente.selectAll();
                    return false;
                }
                if (txtNumDocCliente.getText().trim().length() == 0) {
                    JOptionPane.showMessageDialog(this, "Para generar una Factura, debes especificar el RUC del Cliente.", "Datos incompletos", 2);
                    txtNumDocCliente.setBorder(new LineBorder(Color.RED));
                    txtNumDocCliente.requestFocus();
                    txtNumDocCliente.selectAll();
                    return false;
                }
            }
            if (xTipoDocVenta.get(cboTipoDocumento.getSelectedIndex()).getIdTipoDoc().equals("03")) {
                if (txtNumDocCliente.getText().trim().length() == 0) {
                    JOptionPane.showMessageDialog(this, "Para generar una Boleta, debes especificar el DNI del Cliente.", "Datos incompletos", 2);
                    txtNumDocCliente.setBorder(new LineBorder(Color.RED));
                    txtNumDocCliente.requestFocus();
                    txtNumDocCliente.selectAll();
                    return false;
                }

                if ((txtNumDocCliente.getText().length() > 0) && (txtNumDocCliente.getText().length() < 8)) {
                    JOptionPane.showMessageDialog(this, "El número de DNI que has especificado no es válida. Compruébala e inténtalo de nuevo.", "Datos incompletos", 2);
                    txtNumDocCliente.setBorder(new LineBorder(Color.RED));
                    txtNumDocCliente.requestFocus();
                    txtNumDocCliente.selectAll();
                    return false;
                }

                BigDecimal valorPercepcion = paramValorPercepcion;//new BigDecimal("1500");//BigDecimal.valueOf(Double.valueOf(getParametro("MONTO BOLETA PERCEPCION", usuario.getCodempresa())).doubleValue());
                if (xMoneda.get(cbo_moneda.getSelectedIndex()).getIdMoneda().trim().equalsIgnoreCase("00004")) {
                    try {
                        RnTipoCambio logicTc = new RnTipoCambio(path);
                        Date fechaEmision = new Date(dcFechaEmision.getDate() == null
                                ? Main.fechaActualServer.getTime() : dcFechaEmision.getDate().getTime());
                        BeanTipoCambio tc = logicTc.getBeanTipoCambio(new java.sql.Date(fechaEmision.getTime()),
                                "00004");
                        if (tc != null) {
                            valorPercepcion = valorPercepcion.divide(tc.getMontocompra(), RoundingMode.HALF_UP);
                        }
                    } catch (Exception ex) {
                    }
                }
                BigDecimal valorBoletaDNI = paramValorBoletaDNI;//new BigDecimal("700");//BigDecimal.valueOf(Double.valueOf(getParametro("MONTO BOLETA DNI", usuario.getCodempresa())).doubleValue());
                if (Double.parseDouble(txt_total.getText().trim()) >= valorBoletaDNI.doubleValue()) {
                    if (txtCliente.getText().trim().length() == 0) {
                        JOptionPane.showMessageDialog(this, "Para generar una Boleta, debes especificar el Nombre del Cliente.", "Datos incompletos.", JOptionPane.OK_OPTION);
                        txtCliente.setBorder(new LineBorder(Color.RED));
                        txtCliente.requestFocus();
                        txtCliente.selectAll();
                        return false;
                    }
                }
                if (Double.parseDouble(txt_total.getText().trim()) > valorPercepcion.doubleValue()) {
                    if (txtCliente.getText().trim().length() == 0) {
                        JOptionPane.showMessageDialog(this, "Para generar una Boleta, debes especificar el Nombre del Cliente.", "Datos incompletos.", JOptionPane.OK_OPTION);
                        txtCliente.setBorder(new LineBorder(Color.RED));
                        txtCliente.requestFocus();
                        txtCliente.selectAll();
                        return false;
                    }

                    if (txtNumDocCliente.getText().trim().length() == 0) {
                        JOptionPane.showMessageDialog(this, "Para generar una Boleta, debes especificar el DNI del Cliente.", "Datos incompletos", 2);
                        txtNumDocCliente.setBorder(new LineBorder(Color.RED));
                        txtNumDocCliente.requestFocus();
                        txtNumDocCliente.selectAll();
                        return false;
                    }

                    if ((txtNumDocCliente.getText().length() > 0) && (txtNumDocCliente.getText().length() < 8)) {
                        JOptionPane.showMessageDialog(this, "El número de DNI que has especificado no es válida. Compruébala e inténtalo de nuevo.", "Datos incompletos", 2);
                        txtNumDocCliente.setBorder(new LineBorder(Color.RED));
                        txtNumDocCliente.requestFocus();
                        txtNumDocCliente.selectAll();
                        return false;
                    }
                }
            }

            if (txtIdCliente.getText().trim().length() == 0) {
                JOptionPane.showMessageDialog(this, "Para generar un documento, debes especificar el Cliente - El registro no contiene codigo de cliente.", "Datos incompletos.", JOptionPane.OK_OPTION);
                btnBuscarcliente.requestFocus();
                return false;
            }

            if (cboCondPago.getSelectedItem().equals("CREDITO")) {
                if (Integer.parseInt(txtDiasPago.getText()) <= 0) {
                    JOptionPane.showMessageDialog(this, "Para generar un Documento, debes especificar su Tiempo de Pago.", "Datos incompletos.", JOptionPane.CANCEL_OPTION);
                    txtDiasPago.setBorder(new LineBorder(Color.RED));
                    txtDiasPago.requestFocus();
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
                if (cboMedioPago.getSelectedIndex() < 0) {
                    JOptionPane.showMessageDialog(this, "Para generar un Documento al contado, debes especificar su Tipo de Pago.", "Datos incompletos.", JOptionPane.OK_OPTION);
                    cboMedioPago.setBorder(new LineBorder(Color.RED));
                    cboMedioPago.requestFocus();
                    return false;
                }
            }

            if (cbo_cancelaen.getSelectedIndex() < 0) {
                JOptionPane.showMessageDialog(this, "Para gerenerar un Documento, debes especificar la moneda de pago de la venta.", "Datos incompletos.", JOptionPane.CANCEL_OPTION);
                cbo_cancelaen.setBorder(new LineBorder(Color.RED));
                cbo_cancelaen.requestFocus();
                return false;
            }
            if (txtRecibo.getText().trim().length() == 0) {
                JOptionPane.showMessageDialog(this, "Para gerenerar un Documento, debes especificar el Monto Recibido.", "Datos incompletos.", JOptionPane.CANCEL_OPTION);
                txtRecibo.setBorder(new LineBorder(Color.RED));
                txtRecibo.requestFocus();
                txtRecibo.selectAll();
                return false;
            }

            if (Double.valueOf(txtRecibo.getText().trim()) < Double.valueOf(txt_total.getText().trim())) {
                JOptionPane.showMessageDialog(this, "El monto recibido que has especificado debe ser mayor o igual al total de la Venta. Compruébala e inténtalo de nuevo.", "Datos incompletos.", JOptionPane.CANCEL_OPTION);
                txtRecibo.setBorder(new LineBorder(Color.RED));
                txtRecibo.requestFocus();
                txtRecibo.selectAll();
                return false;
            }

            RnRegconta logic = new RnRegconta(path);
            String rpta = logic.estadoPeriodoAuxiliar(Util.getIdPeriodoMensual(dcFechaEmision.getDate()), AuxiliarEnum.VENTA.getValue());
            if (rpta.trim().substring(0, 1).equals("*")) {
                JOptionPane.showMessageDialog(this, rpta);
                return false;
            }

            if (!logic.existsRegistroRcc(AuxiliarEnum.VENTA.getValue(), null,
                    xTipoDocVenta.get(cboTipoDocumento.getSelectedIndex()).getIdTipoDoc(),
                    cboSerie.getSelectedItem().toString(), txtPreimpreso.getText().trim())) {
                JOptionPane.showMessageDialog(this, "DOCUMENTO YA SE ENCUENTRA REGISTRADO");
                return false;
            }

            if (txtNumDocCliente.getText().trim().length() == 0) {
                chkPublicoGeneral.setSelected(true);
            } else if (txtNumDocCliente.getText().trim().length() > 0) {
                return verificarCliente(true);
            }
            return true;
        } catch (Exception e) {
            throw e;
        }
    }

    private void insertDocumento() throws Exception {
        try {
            BeanRegcontaCab beanRcc = this.getRcc();
            RnRegconta logic = new RnRegconta(path);
            Map<String, String> mapCta = new HashMap();
            String xmlItem = this.getXmlItem(mapCta);
            String xmlCta = this.getXmlCuenta(mapCta);
            String xmlContacto = this.getXmlContacto();
            String xmlLote = mdlVenta.getXmlLote();
            BeanPedidoCab beanPed = this.getPedido();
            BeanRptaVenta beanRptaVenta = logic.insertVentaLote(beanRcc, xmlItem, xmlCta, xmlContacto,
                    this.getIdCotizacion(), beanPed, xmlLote, this.getRccAdicional());
            boolean isProgramado = chkProgramar.isSelected();
            boolean isImpresion = true;
            if (isProgramado) {
                isImpresion = !this.updateVentaProgramado(beanRptaVenta.getIdRegconta(), isProgramado);
            }
            if (beanRcc.getLineaImpresion() >= 1 && isImpresion) {
                this.imprimirDocumento(beanRcc, beanRptaVenta.getIdRegconta());
            }
            nuevo();
            tabb.setSelectedIndex(0);
        } catch (Exception e) {
            throw e;
        }
    }

    private boolean updateVentaProgramado(String idRegconta, boolean isProgramado) {
        try {
            RnRegContaCab logic = new RnRegContaCab(path);
            logic.updateProgramadoRccVenta(idRegconta, isProgramado ? 1 : 0);
            return true;
        } catch (Exception e) {
            ExceptionHandler.handleException(e, logger);
            JOptionPane.showMessageDialog(null, e.getMessage());
            return false;
        }
    }

    private BeanRegcontaAdicional getRccAdicional() {
        if (!Constans.IS_ADICIONALES_VENTA) {
            return null;
        }
        BeanRegcontaAdicional bean = new BeanRegcontaAdicional();
        bean.setSerieOc(txtSerieOc.getText().trim());
        bean.setPreimpresoOc(txtPreimpresoOc.getText().trim());
        bean.setSerieGuia(txtSerieGuia.getText().trim());
        bean.setPreimpresoGuia(txtPreimpresoGuia.getText().trim());
        return bean;
    }

    private int getIdCotizacion() {
        if (beanCotizacion == null) {
            return 0;
        }
        return beanCotizacion.getIdCotizacion();
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
            System.out.println("xmlCta = " + xmlCta);
            return xmlCta;
        } catch (Exception e) {
            throw e;
        }
    }

    private String getXmlItem(Map<String, String> mapCta) {
        String xmlItem = "<?xml version=\"1.0\" ?> ";
        xmlItem += "<ITEMS>";
        for (int i = 0; i < mdlVenta.getRowCount(); i++) {
            BeanRegcontaItem beanRci = (BeanRegcontaItem) mdlVenta.getRci(i);
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
            xmlItem += "<DESC_ITEM_FACT>" + beanRci.getBeanItem().getDescripcion() + "</DESC_ITEM_FACT>";
            xmlItem += "</ITEM>";
            mapCta.put((xMoneda.get(cbo_moneda.getSelectedIndex()).getIdMoneda().equals(MonedaEnum.SOLES.getValue())
                    ? beanRci.getBeanItem().getCtaVta().trim() : beanRci.getBeanItem().getCtaVtaDolar().trim()), "");
        }
        xmlItem += "</ITEMS>";
        System.out.println("xmlItem = " + xmlItem);
        return xmlItem;
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
        beanAnexo.setIdAnexo(txtIdCliente.getText().trim());
        beanTipoAnexo.setIdTipoAnexo(TipoAnexoEnum.CLIENTE.getValue());
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
        beanRcc.setPreimpreso(txtPreimpreso.getText().toLowerCase());
        beanAnexo.setDescripcion(this.txtCliente.getText());
        String direccion = this.getDireccionCliente();
        beanAnexo.setDireccion(direccion);
        beanAnexo.setNumero(txtNumDocCliente.getText().trim());
        beanRcc.setTipoCambio(new BigDecimal(txtTipoCambio.getText().trim()));
        beanRcc.setBeanAnexo(beanAnexo);
        beanRcc.setAfecto(new BigDecimal(txt_afecto.getText().trim()));
        beanRcc.setNoafecto(new BigDecimal(txt_noafecto.getText().trim()));
        beanRcc.setPIgv(porcIgv);
        beanRcc.setMIgv(new BigDecimal(txt_igv.getText().trim()));
        beanRcc.setMonto(new BigDecimal(txt_total.getText().trim()));
        beanRcc.setMontoInafecto(new BigDecimal(txtMontoInafecto.getText().trim()));
        beanRcc.setMontoExonerado(new BigDecimal(txtMontoExonerado.getText().trim()));
        beanRcc.setPPercepcion(new BigDecimal(txt_percepcion.getText().trim()).divide(new BigDecimal(txt_total.getText().trim()), numeroDecimales, RoundingMode.HALF_UP));
        beanRcc.setMPercepcion(new BigDecimal(txt_percepcion.getText().trim()));
        beanRcc.setFEmision(dcFechaEmision.getDate());
        beanRcc.setFVencimiento(dcFechaVence.getDate());
        beanRcc.setIdAuxiliar(AuxiliarEnum.VENTA.getValue());
        SimpleDateFormat formatoMes = new SimpleDateFormat("MM");
        SimpleDateFormat formatoAnio = new SimpleDateFormat("yyyy");
        beanRcc.setAnio(formatoAnio.format(dcFechaEmision.getDate()));
        beanRcc.setMes(formatoMes.format(dcFechaEmision.getDate()));
        beanRcc.setIdTipoOperacion(id_tipo_operacion);
        BeanEstadoDocumento beanEstadoDocumento = new BeanEstadoDocumento();
        beanEstadoDocumento.setIdEstado("003");
        beanRcc.setBeanEstadoDocumento(beanEstadoDocumento);
        beanRcc.setEstado("A");
        beanRcc.setIdTipoPago((cboMedioPago.getItemCount() == 0 ? "" : (cboMedioPago.getSelectedItem().equals("EFECTIVO MN") ? "001" : (cboMedioPago.getSelectedItem().equals("TARJETA DINNER") ? "004" : (cboMedioPago.getSelectedItem().equals("TARJETA MC PROCESS") ? "005" : (cboMedioPago.getSelectedItem().equals("TARJETA VISA") ? "002" : ""))))));
        beanAnexoRef.setIdAnexo(txtIdCliente.getText().trim());
        beanAnexoRef.setDescripcion(txtCliente.getText().trim());
        beanAnexoRef.setDireccion(direccion);
        beanAnexoRef.setNumero(txtNumDocCliente.getText().trim());
        beanRcc.setBeanAnexoRef(beanAnexoRef);
        beanRcc.setIdVendedor(listaV.get(cboVendedor.getSelectedIndex()).getID_VENDEDOR());
        beanRcc.setIdUsuario(usuario.getId_usuario());
        beanRcc.setIdUsuarioAutoriza("");
        beanRcc.setTipoOperacionIgv(TIPOOPERIGV.getText());
        UsuarioCorrelativo userCorre = (UsuarioCorrelativo) xCorrelativo.get(cboSerie.getSelectedIndex());
        beanRcc.setIdCorrelativo(userCorre.getIdCorrelativo());
        beanRcc.setLineaImpresion(userCorre.getLineaImpresion());
        beanRcc.setFlagPromocion((chkPromocion.isSelected() ? "S" : "N"));
        UsuarioCorrelativo uCorrelativo = this.getUsuarioCorrelativo();
        beanRcc.setNumeroAutorizacion(uCorrelativo != null ? uCorrelativo.getNumeroAutorizacion() : "");
        beanRcc.setCodigoMaquina(uCorrelativo != null ? uCorrelativo.getCodigoMaquina() : "");
        return beanRcc;
    }

    private String getDireccionCliente() {
        if (cboDireccion.getItemCount() > 0) {
            return cboDireccion.getSelectedItem().toString();
        }
        return "";
    }

    private UsuarioCorrelativo getUsuarioCorrelativo() {
        if (cboSerie.getSelectedIndex() >= 0) {
            return xCorrelativo.get(cboSerie.getSelectedIndex());
        }
        return null;
    }

    private void imprimirDocumento(BeanRegcontaCab beanRcc, String idRegconta) {
        try {
            String idTipoDoc = xTipoDocVenta.get(cboTipoDocumento.getSelectedIndex()).getIdTipoDoc();
            if (!Constans.ISIMPRESIONVENTA) {
                this.exportarTxt(idTipoDoc, beanRcc);
                return;
            }
            this.impresionNormal(beanRcc, idRegconta, idTipoDoc);
        } catch (Exception e) {
            ExceptionHandler.handleException(e, logger);
            JOptionPane.showMessageDialog(null, e.getMessage());
        }
    }

    private void exportarTxt(String idTipoDoc, BeanRegcontaCab beanRcc) throws Exception {
        try {
            if (!chkNoImprimeTxt.isSelected()) {
                FEtxt feTxt = new FEtxt(path, this.getNameFile(idTipoDoc, beanRcc));
                feTxt.exportarTxt(idTipoDoc, beanRcc.getSerie(), beanRcc.getPreimpreso());
                JOptionPane.showMessageDialog(null, "Comprobante electrónico fue generado");
            }else{
                JOptionPane.showMessageDialog(null, "Comprobante fue generado, pero no generó TXT");
            }
        } catch (Exception e) {
            throw e;
        }
    }

    private String getNameFile(String idTipoDoc, BeanRegcontaCab beanRcc) {
        return this.usuario.getRuc() + "-" + idTipoDoc + "-" + beanRcc.getSerie() + "-" + beanRcc.getPreimpreso8Digs();
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
            parameters.put("P_HORA_EMISION", this.getHoraImpresion(idTipoDoc, idRegconta));
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
        return this.getDataSourceVentaNormal(beanRcc);
    }

    private DataSourceVenta getDataSourceVentaNormal(BeanRegcontaCab beanRcc) {
        DataSourceVenta dataSource = new DataSourceVenta();
        for (int i = 0; i < mdlVenta.getRowCount(); i++) {
            BeanRegcontaItem beanRci = mdlVenta.getRci(i);
            beanRci.setBeanRegcontaCab(beanRcc);
            dataSource.add(beanRci);
        }
        return dataSource;
    }

    private String getHoraImpresion(String idTipoDoc, String idRegconta) {
        try {
            if (idTipoDoc.equalsIgnoreCase(TipoDocVentaEnum.TICKET.getValue())) {
                RnConsultas logic = new RnConsultas(path);
                return logic.getHoraImpresionTicket(idRegconta);
            }
        } catch (Exception e) {
            ExceptionHandler.handleException(e, logger);
        }
        return "";
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
        return xmlContacto;
    }

    private BeanPedidoCab getPedido() {
        BeanPedidoCab beanPed = new BeanPedidoCab();
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

    private void guardarDocumento() {
        blnClickAceptar = true;
        try {
            if (!isRegisterValid()) {
                return;
            }
            this.validateDocumento();
        } catch (Exception ex) {
            ExceptionHandler.handleException(ex, logger);
            JOptionPane.showMessageDialog(this, "Error de Sistema: " + ex.getMessage());
        }
        blnClickAceptar = false;
    }

    private void validateDocumento() throws Exception {
        try {
            if (!this.pregDocumento()) {
                return;
            }
            if (!this.swAutorizarDocumento()) {
                return;
            }
            insertDocumento();
        } catch (Exception e) {
            throw e;
        }
    }

    private boolean swAutorizarDocumento() {
        if (!Constans.IS_AUTORIZAR_PRECIO) {
            return true;
        }
        if (!this.swAutorizado()) {
            FormAutorizar formAutorizar = new FormAutorizar(frm, xCorrelativo.get(cboSerie.getSelectedIndex()).getIdCorrelativo(), path);
            formAutorizar.setVisible(true);
            return formAutorizar.isSwAutorizar();
        }
        return true;
    }

    private boolean swAutorizado() {
        Iterator<BeanRegcontaItem> iterador = mdlVenta.getData().iterator();
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
        int xres = JOptionPane.showConfirmDialog(this, "Desea Generar el documento " + cboTipoDocumento.getSelectedItem()
                + " N° " + cboSerie.getSelectedItem() + "-" + txtPreimpreso.getText().trim(),
                "Generar Documento", JOptionPane.OK_CANCEL_OPTION);
        return xres == JOptionPane.OK_OPTION;
    }

    private void guardarVentaF5() {
        if (tblVenta.getRowCount() <= 0) {
            JOptionPane.showMessageDialog(this, "Para generar un Documento, debes especificar al menos un Item.", "Datos incompletos.", JOptionPane.INFORMATION_MESSAGE);
            txtDescripcion.requestFocus();
            return;
        }
        List<BeanRegcontaItem> listaItem = mdlVenta.getData();
        HashSet<String> monedas = new HashSet();
        Iterator<BeanRegcontaItem> i = listaItem.iterator();
        while (i.hasNext()) {
            monedas.add(i.next().getBeanItem().getIdMoneda());
        }
        if (monedas.size() != 1) {
            JOptionPane.showMessageDialog(null, "La lista de Items tiene monedas distintas");
            return;
        }
        if (!mdlVenta.validateItemLotes()) {
            JOptionPane.showMessageDialog(this, "La cantidad de lotes no cuadra con la cantidad de items");
            return;
        }
        generarVenta();
    }

    private void cotizacion() {
        if (chkCotizacion.isSelected()) {
            PnlCotizacionBuscar pnlCotizacion = new PnlCotizacionBuscar(frm, usuario, path, this, btnCotizacion, "venta");
            pnlCotizacion.setFecha(frm.getFechaInicio(), frm.getFechaFin());
            pnlCotizacion.setVisible(true);
        } else {
            JOptionPane.showMessageDialog(this, "Seleccione Cotizacion");
        }
    }

    public void registerTipoCambio() {
        try {
            RnTipoCambio logicTc = new RnTipoCambio(Main.path);
            BeanTipoCambio t = new BeanTipoCambio();
            t.setIdEmpresa(Main.usuario.getCodempresa());
            BeanMoneda beanMoneda = new BeanMoneda();
            beanMoneda.setIdMoneda("00004");
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

    private void quitarItem() {
        if (tblVenta.getSelectedRow() >= 0) {
            int xres = JOptionPane.showConfirmDialog(this, "Desea eliminar el item?", "Eliminar Item", JOptionPane.OK_CANCEL_OPTION);
            if (xres == JOptionPane.OK_OPTION) {
                editorLote.stopCellEditing();
                mdlVenta.eliminarRci(tblVenta.convertRowIndexToModel(tblVenta.getSelectedRow()));
                CTableFx.setAllColumnPreferredWidth(tblVenta);
            }
        } else {
            JOptionPane.showMessageDialog(frm, "Para eliminar un item primero debe seleccionar la fila.",
                    "Eliminar Item", JOptionPane.INFORMATION_MESSAGE);
        }
        this.txtDescripcion.requestFocus();
    }

    @Override
    public void actionPerformed(ActionEvent e) {
        try {
            if (e.getSource().equals(btnCotizacion)) {
                this.cotizacion();
            }
            if (cboCondPago == e.getSource()) {
                eventCondPago();
            }
            if (btn_guardar == e.getSource()) {
                guardarVentaF5();
            }

            if (btnQuitar == e.getSource()) {
                this.quitarItem();
            }

            if (e.getSource().equals(btnRefrescar)) {
                cargarTabla();
            }

            if (e.getSource() == btnNuevo) {
                if (tblVenta.getRowCount() == 0) {
                    JOptionPane.showMessageDialog(this, "La venta ya esta limpia.", "Limpiar Venta", JOptionPane.INFORMATION_MESSAGE);
                    txtDescripcion.requestFocus();
                } else {
                    int xres = JOptionPane.showConfirmDialog(this, "Desea limpiar la venta?", "Limpiar venta", JOptionPane.OK_CANCEL_OPTION);

                    if (xres == JOptionPane.OK_OPTION) {
                        limpiarVenta();
                    }
                }
            }

            if (e.getSource() == btnAgregar) {
                procesoAgregar();
            }

            if (e.getSource() == btnBuscar) {
                filtrarTablaProducto();
            }
            if (cboTipoDocumento == e.getSource()) {
                if (cboTipoDocumento.getItemCount() > 0) {
                    actualizarCorrelativo();
                }
            }
            if (cboSerie == e.getSource()) {
                if (cboSerie.getItemCount() > 0) {
                    mostrarPreimpreso();
                }
            }
            if (txtDiasPago == e.getSource()) {
                calcFVenc();
            }
            if (btnBuscarcliente == e.getSource()) {
                buscarCliente();
            }
            if (btnNuevocliente == e.getSource()) {
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
            txtPreimpreso.setText("0000000000");
            loadSerieCorrelativo(xTipoDocVenta.get(cboTipoDocumento.getSelectedIndex()).getIdTipoDoc());
            String numDoc = (beanCotizacion != null ? beanCotizacion.getBeanCliente().getNumero() : txtNumDocCliente.getText());
            txtNumDocCliente.setDocument(cboTipoDocumento.getSelectedItem().equals("FACTURA") ? (new IntegerDocument(11)) : (cboTipoDocumento.getSelectedItem().equals("BOLETA") ? (new IntegerDocument(11)) : (new UpperCaseNumberDocument(20))));
            txtNumDocCliente.setText(numDoc);
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
            txtPreimpreso.setText(String.valueOf(preimpreso));
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
                xCorrelativo = new ArrayList<UsuarioCorrelativo>();
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

        for (int i = 0; i < mdlVenta.getRowCount(); i++) {
            BeanRegcontaItem beanrci = mdlVenta.getRci(i);

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
        boolean swCotPed = chkCotizacion.isSelected();
        btnCotizacion.setVisible(swCotPed);
        cboMoneda.setEnabled(!swCotPed);
        btnAgregar.setEnabled(!swCotPed || Constans.ISCOTIZACIONEDIT);
        mdlVenta.setSwCotizacionPedido(swCotPed && !Constans.ISCOTIZACIONEDIT);
        this.configTableVenta(swCotPed && !Constans.ISCOTIZACIONEDIT);
        CTableFx.setAllColumnPreferredWidth(tblVenta);
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

    private void loadPublicGeneral() {
        Anexo c = new Anexo();
        c.setNumerodoc("00000000");
        List<Anexo> an = getClientes(c);
        cargarCliente(an);
    }

    @Override
    public void itemStateChanged(ItemEvent e) {
        try {

            if (e.getSource().equals(cboTipoOperIgv)) {
                changeTipoOperIgv();
            }
            if (e.getSource().equals(chkCotizacion)) {
                changeCotizacion();
                cotPed();
            }
            if (e.getSource().equals(cboMoneda)) {
                filtrarTablaProducto();
                cboPrecio.removeAllItems();
                cboPrecio.updateUI();
                cbo_moneda.setSelectedIndex(cboMoneda.getSelectedIndex());
                cbo_cancelaen.setSelectedIndex(cboMoneda.getSelectedIndex());
            }
            if (e.getSource().equals(chkPublicoGeneral)) {
                if (!flag) {
                    if (chkPublicoGeneral.isSelected()) {
                        loadPublicGeneral();
                    } else {
                        txtIdCliente.setText("");
                        txtCliente.setText("");
                        txtNumDocCliente.setText("");
                        cboDireccion.removeAllItems();
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
            if (e.getSource().equals(cboDireccion)) {
                txtDireccionDespacho.setText(this.getDireccionCliente());
            }
        } catch (Exception ex) {
            ExceptionHandler.handleException(ex, logger);
            JOptionPane.showMessageDialog(this, ex.getMessage());
        }
    }

    private boolean cargarCliente(List<Anexo> reg) {
        try {
            numero = -1;
            if (reg == null || reg.isEmpty()) {
                return false;
            }
            Anexo cliente = reg.get(0);
            txtIdCliente.setText(cliente.getIdAnexo());
            txtCliente.setText(cliente.getDescripcion());
            txtNumDocCliente.setText(cliente.getNumerodoc());
            this.loadDireccionCliente(cliente);
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
            return true;

        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, e.getMessage());
            return false;
        }
    }

    private void loadDireccionCliente(Anexo cliente) throws Exception {
        try {
            cboDireccion.removeAllItems();
            List<ClienteDireccion> lista = (new RnCliente(path)).listarClienteDireccion(cliente.getIdAnexo());
            if (lista.isEmpty()) {
                cboDireccion.addItem(cliente.getDireccion());
                return;
            }
            for (ClienteDireccion dir : lista) {
                cboDireccion.addItem(dir.getDireccion());
            }
        } catch (Exception e) {
        }
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
        if (e.getDocument().equals(txtCliente.getDocument())) {
            txtContacto.setText(txtCliente.getText());
        }
    }

    @Override
    public void removeUpdate(DocumentEvent e) {
        if (e.getDocument().equals(txtCliente.getDocument())) {
            txtContacto.setText(txtCliente.getText());
        }
    }

    @Override
    public void changedUpdate(DocumentEvent e) {
        if (e.getDocument().equals(txtCliente.getDocument())) {
            txtContacto.setText(txtCliente.getText());
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
        return txtDescripcion;
    }

    public JButton getBtnRefrescar() {
        return btnRefrescar;
    }

}
