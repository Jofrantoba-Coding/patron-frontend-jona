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

    protected final Main frm;
    protected JComboBox cboTipoOperIgv;
    protected JComboBox cboPrecio;
    protected JComboBox cboMoneda;
    protected CButton btn_guardar;
    protected CButton btnNuevo;
    protected JButton btnBuscar;
    protected JButton btnRefrescar;
    protected CButton btnAgregar;
    protected CButton btnQuitar;
    protected ExcelAdapter adapterVenta;
    protected JTable tblVenta;
    protected TableModelRegcontaItem mdlVenta;
    protected CTable tblProducto;
    protected TableModelItemVenta mdlProducto;
    protected TableRowSorter<TableModelItemVenta> modeloOrdenadoProducto;
    protected CTable tblAlmacen;
    protected TableModelItemAlmacen mdlAlmacen;
    protected JTextField txtDescripcion;
    protected JTextField txtIdItem;
    protected JTextField txtMaximoProductos;
    protected JTextField txtAfecto;
    protected JTextField txtNoafecto;
    protected JTextField txtMontoInafecto = new JTextField(BigDecimal.ZERO.toString());
    protected JTextField txtMontoExonerado = new JTextField(BigDecimal.ZERO.toString());
    protected JTextField txtIgv;
    protected JTextField txtDescuento;
    protected JTextField txtMonto;
    protected JTextField txtPercepcion;
    protected JTextField txtCantidad;
    protected final Usuario usuario;
    protected final URL path;
    protected ComboBoxEditorPrecio editorPrecio;
    protected ComboModelPrecio cboModelPrecio;
    protected final CuadroMensaje cuadro;
    protected JTextField txtPesoTotal;
    protected Map<String, BeanPrecioItem> mapPrecio;
    protected JCheckBox chkCotizacion;
    protected JButton btnCotizacion;
    protected BeanCotizacionCab beanCotizacion;
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
    protected JTextField txtPreimpreso;
    protected JDateChooser dcFechaEmision;
    protected JTextField txtDiasPago;
    protected JDateChooser dcFechaVence;
    protected JComboBox cboCondPago;
    protected JTextField txtTipoCambio;
    protected JComboBox cbo_moneda;
    protected JComboBox cbo_cancelaen;
    protected JComboBox cboMedioPago;
    protected JCheckBox chkPublicoGeneral;
    protected JButton btnNuevocliente;
    protected JTextField txtIdCliente;
    protected JComboBox cboDireccion;
    protected JButton btnBuscarcliente;
    protected Gif gif;
    protected JCheckBox chkPromocion;
    protected JTextField txtCliente;
    protected JTextField txtNumDocCliente;
    protected JTextField txtRecibo;
    protected JTextField txtVuelto;
    protected JButton btn_cancelar;
    protected JButton btnGuardar;
    protected JComboBox cboVendedor;
    protected JTextField txt_igv;
    protected JTextField txt_trabajador;
    protected JTextField txt_total;
    protected JTextField txt_valorventa;
    protected JTextField txt_descuento;
    protected JTextField txt_afecto;
    protected JTextField txt_noafecto;
    protected JTextField txt_percepcion;
    protected JTextField txt_totalcobrar;
    protected List<BeanTipoDocVenta> xTipoDocVenta;
    protected boolean blnClickAceptar = false;
    protected int numero = -1;
    protected List<UsuarioCorrelativo> xCorrelativo;
    protected List<BeanVendedor> listaV;
    protected String id_tipo_operacion;
    protected boolean flag = false;
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
    protected final Logger logger = Logger.getLogger(UiRegisterVentaLote.class);
    protected CellEditorBtnLoteVenta editorLote;
    protected JLabel TIPOOPERIGV = new JLabel("NORMAL");
    protected JTextField txtSerieOc;
    protected JTextField txtPreimpresoOc;
    protected JTextField txtSerieGuia;
    protected JTextField txtPreimpresoGuia;
    protected JCheckBox chkProgramar;
    protected JCheckBox chkNoImprimeTxt;

    public UiRegisterVentaLote(Main frm, String title, Usuario usuario, URL path) {
        super(title);
        cuadro = new CuadroMensaje(usuario);
        this.path = path;
        this.frm = frm;
        this.usuario = usuario;
        inicialize();
        initListener();
    }

    protected void inicialize() {
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
        //pnlSouth.add(this.getPnlVenta(), BorderLayout.CENTER);
        return pnlSouth;
    }

    protected JPanel getPnlProductoNorth() {
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

    protected JPanel getPnlVenta() {
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

    protected JPanel getPnlProductoAlmacen() {
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

    protected JPanel getPnlOpcCenter() {
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

    protected void eventListener() {
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

    protected void changeFechaEmision() {
    }

    protected boolean isFechaEmisionMajorServer() {
        Date fechaServer = new Date(Main.fechaActualServer.getTime());
        Date fechaEmision = dcFechaEmision.getDate();
        return fechaEmision.after(fechaServer);
    }

    protected Date getZeroTimeDate(Date date) {
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(date);
        calendar.set(Calendar.HOUR_OF_DAY, 0);
        calendar.set(Calendar.MINUTE, 0);
        calendar.set(Calendar.SECOND, 0);
        calendar.set(Calendar.MILLISECOND, 0);
        date = calendar.getTime();
        return date;
    }

    protected void changeCotizacion() {
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

    protected void insertarContacto() {
    }

    protected void quitarContacto() {
    }

    protected void configTableVenta(boolean swCotPed) {
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

    protected void valorCodItem() {
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

    protected Date getFechaFinal(Date fechaEmision) {
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(fechaEmision);
        calendar.add(Calendar.DAY_OF_YEAR, 15);
        return calendar.getTime();
    }

    protected void setFechas() {
    }

    protected String getIdMoneda() {
        return xMoneda.get(cboMoneda.getSelectedIndex()).getIdMoneda();
    }

    protected BigDecimal getPrecioItem() {
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

    protected void agregarItem() {
    }

    protected boolean validateCantidad(BigDecimal cantidad, BigDecimal disponible) {
        return cantidad.compareTo(disponible) != 1;
    }

    protected void generarVenta() {
    }

    protected boolean flagPromocion() {
        for (int i = 0; i < mdlVenta.getRowCount(); i++) {
            if (mdlVenta.getRci(i).getBeanItem().getFlagPromocion().equals("S")) {
                return true;
            }
        }
        return false;
    }

    protected void calcularpercepcion() {
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

    protected Set obtenerPrecios(BeanPrecioItem beanPrecioItem) {
        return null;
    }

    protected BigDecimal getPrecioEditor(BeanPrecioItem beanPrecioItem) {
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
        if (txtCantidad.getText().trim().length() == 0) {
            return false;
        }
        return Double.valueOf(txtCantidad.getText().trim()) > 0;
    }

    protected void procesoCargarAlmacen() {
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

    protected void nuevo() {
    }

    protected void filtrarTablaProducto() {
    }

    protected RowFilter getFilterProducto() {
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
    }

    protected void cargarCotizacion() {
    }

    protected void eventCondPago() throws Exception {
    }

    protected void calcFVenc() {
    }

    protected boolean verificarCliente(boolean isNumeroDoc) {
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

    protected void insertDocumento() throws Exception {
    }

    protected boolean updateVentaProgramado(String idRegconta, boolean isProgramado) {
        return false;
    }

    protected BeanRegcontaAdicional getRccAdicional() {
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

    protected int getIdCotizacion() {
        if (beanCotizacion == null) {
            return 0;
        }
        return beanCotizacion.getIdCotizacion();
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
            System.out.println("xmlCta = " + xmlCta);
            return xmlCta;
        } catch (Exception e) {
            throw e;
        }
    }

    protected String getXmlItem(Map<String, String> mapCta) {
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

    protected String getDireccionCliente() {
        if (cboDireccion.getItemCount() > 0) {
            return cboDireccion.getSelectedItem().toString();
        }
        return "";
    }

    protected UsuarioCorrelativo getUsuarioCorrelativo() {
        if (cboSerie.getSelectedIndex() >= 0) {
            return xCorrelativo.get(cboSerie.getSelectedIndex());
        }
        return null;
    }

    protected void imprimirDocumento(BeanRegcontaCab beanRcc, String idRegconta) {
    }

    protected void exportarTxt(String idTipoDoc, BeanRegcontaCab beanRcc) throws Exception {
    }

    protected String getNameFile(String idTipoDoc, BeanRegcontaCab beanRcc) {
        return this.usuario.getRuc() + "-" + idTipoDoc + "-" + beanRcc.getSerie() + "-" + beanRcc.getPreimpreso8Digs();
    }

    protected void impresionNormal(BeanRegcontaCab beanRcc, String idRegconta, String idTipoDoc)
            throws Exception {
    }

    protected DataSourceVenta getDataSourceVenta(BeanRegcontaCab beanRcc) {
        return this.getDataSourceVentaNormal(beanRcc);
    }

    protected DataSourceVenta getDataSourceVentaNormal(BeanRegcontaCab beanRcc) {
        DataSourceVenta dataSource = new DataSourceVenta();
        for (int i = 0; i < mdlVenta.getRowCount(); i++) {
            BeanRegcontaItem beanRci = mdlVenta.getRci(i);
            beanRci.setBeanRegcontaCab(beanRcc);
            dataSource.add(beanRci);
        }
        return dataSource;
    }

    protected String getHoraImpresion(String idTipoDoc, String idRegconta) {
        return null;
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
        return xmlContacto;
    }

    protected BeanPedidoCab getPedido() {
        return null;
    }

    protected void guardarDocumento() {
    }

    protected void validateDocumento() throws Exception {
    }

    protected boolean swAutorizarDocumento() {
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

    protected boolean swAutorizado() {
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

    protected boolean pregDocumento() {
        return false;
    }

    protected void guardarVentaF5() {
    }

    protected void cotizacion() {
    }

    public void registerTipoCambio() {
    }

    protected java.sql.Date getFechaServer() throws InstantiationException, IllegalAccessException, Exception {
        return null;
    }

    protected void quitarItem() {
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

    protected void actualizarCorrelativo() {
    }

    protected void mostrarPreimpreso() {
    }

    protected void loadSerieCorrelativo(String ls_IdTipoDoc) throws Exception {
    }

    protected void calcularImportes() {
    }

    protected void cotPed() {
        boolean swCotPed = chkCotizacion.isSelected();
        btnCotizacion.setVisible(swCotPed);
        cboMoneda.setEnabled(!swCotPed);
        btnAgregar.setEnabled(!swCotPed || Constans.ISCOTIZACIONEDIT);
        mdlVenta.setSwCotizacionPedido(swCotPed && !Constans.ISCOTIZACIONEDIT);
        this.configTableVenta(swCotPed && !Constans.ISCOTIZACIONEDIT);
        CTableFx.setAllColumnPreferredWidth(tblVenta);
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

    protected void loadPublicGeneral() {
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

    protected boolean cargarCliente(List<Anexo> reg) {
        return false;
    }

    protected void loadDireccionCliente(Anexo cliente) throws Exception {
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
