package com.softcommerce.views.uiregistercotizacion;


import com.softcommerce.formularios.*;
import com.softcommerce.beans.Anexo;
import com.softcommerce.beans.BeanBanco;
import com.softcommerce.beans.BeanCliente;
import com.softcommerce.beans.BeanCotizacionCab;
import com.softcommerce.beans.BeanCotizacionDet;
import com.softcommerce.beans.BeanEmpresaCuenta;
import com.softcommerce.beans.BeanEstadoDocumento;
import com.softcommerce.beans.BeanItem;
import com.softcommerce.beans.BeanMoneda;
import com.softcommerce.beans.BeanParametro;
import com.softcommerce.beans.BeanPrecioItem;
import com.softcommerce.beans.BeanPuntoVenta;
import com.softcommerce.beans.BeanStock;
import com.softcommerce.beans.BeanTipoCambio;
import com.softcommerce.beans.BeanTipoDocVenta;
import com.softcommerce.beans.BeanVendedor;
import com.softcommerce.beans.Usuario;
import com.softcommerce.beans.UsuarioCorrelativo;
import com.softcommerce.comboboxmodel.ComboModelPrecio;
import com.softcommerce.general.controles.CButton;
import com.softcommerce.general.controles.CTable;
import com.softcommerce.general.controles.DoubleDocument;
import com.softcommerce.general.controles.IntegerDocument;
import com.softcommerce.general.controles.Register;
import com.softcommerce.general.controles.UpperCaseNumberDocument;
import com.softcommerce.general.herramientas.CTableFx;
import com.softcommerce.general.herramientas.DateTime;
import com.softcommerce.general.tablas.EmpresaCuentaTableModel;
import com.softcommerce.general.tablas.TableModelCotizacionDet;
import com.softcommerce.general.tablas.TableModelItemAlmacen;
import com.softcommerce.general.tablas.TableModelItemVenta;
import com.softcommerce.iconos.Gif;
import com.softcommerce.inputvalidator.PrecioMinimo;
import com.softcommerce.reglasnegocio.RnBanco;
import com.softcommerce.reglasnegocio.RnCotizacionCab;
import com.softcommerce.reglasnegocio.RnEmpresaCuenta;
import com.softcommerce.reglasnegocio.RnParametro;
import com.softcommerce.reglasnegocio.RnVendedor;
import com.softcommerce.reglasnegocio.RnAnexo;
import com.softcommerce.reglasnegocio.RnCorrelativo;
import com.softcommerce.reglasnegocio.RnItem;
import com.softcommerce.reglasnegocio.RnStock;
import com.softcommerce.reglasnegocio.RnTipoCambio;
import com.softcommerce.report.ConvertNumberToLetter;
import com.softcommerce.util.render.CellRenderer;
import com.softcommerce.util.editor.ComboBoxEditorPrecio;
import com.softcommerce.util.Constans;
import com.softcommerce.util.Exportar;
import com.softcommerce.util.FormatObject;
import com.softcommerce.util.LoadDataGenerica;
import com.softcommerce.util.combo.LoadCombo;
import com.softcommerce.util.OrdenarUsuarioCorrelativoAsc;
import com.softcommerce.util.combo.SingletonCombo;
import com.softcommerce.util.VerificarEntreFechas;
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
import java.awt.Insets;
import java.awt.Toolkit;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.FocusEvent;
import java.awt.event.FocusListener;
import java.awt.event.ItemEvent;
import java.awt.event.ItemListener;
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
import java.sql.SQLException;
import java.text.NumberFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collections;
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
import javax.swing.JTextField;
import javax.swing.KeyStroke;
import javax.swing.RowFilter;
import javax.swing.SwingConstants;
import javax.swing.border.Border;
import javax.swing.border.LineBorder;
import javax.swing.border.TitledBorder;
import javax.swing.event.ChangeEvent;
import javax.swing.event.ChangeListener;
import javax.swing.event.InternalFrameEvent;
import javax.swing.event.InternalFrameListener;
import javax.swing.event.ListSelectionEvent;
import javax.swing.event.ListSelectionListener;
import javax.swing.event.TableModelEvent;
import javax.swing.event.TableModelListener;
import javax.swing.table.TableRowSorter;
import javax.swing.text.JTextComponent;
import net.sf.jasperreports.engine.JRParameter;
import net.sf.jasperreports.engine.data.JRBeanCollectionDataSource;

/**
 *
 * @author Team Develtrex
 */
public class UiRegisterCotizacion
        extends JInternalFrame
        implements InterUiRegisterCotizacion, KeyListener, FocusListener, InternalFrameListener, ActionListener,
        ItemListener, MouseListener, TableModelListener, ListSelectionListener, PropertyChangeListener, ChangeListener {

    private JLabel TIPOOPERIGV = new JLabel("NORMAL");
    private Main frm;
    private JComboBox cboTipoOperIgv;
    private Usuario beanUsuario;
    private JCheckBox checkAutorizado;
    private JComboBox cboMoneda;
    private JTextField txt_descripcion;
    private JTextField txt_iditem;
    private JButton btn_buscar;
    private JButton btnRefrescar;
    private CButton btn_guardar;
    private JButton btnGuardar;
    private JButton btnCancelar;
    private CButton btn_nuevo;
    private CButton btn_agregar;
    private JButton btn_quitar;
    private TableModelItemVenta mdl_producto;
    private TableRowSorter<TableModelItemVenta> modeloOrdenadoProducto;
    private CTable tbl_producto;
    private JTextField txt_cantidad;
    private JComboBox cbo_precio;
    private PrecioMinimo validPrecio;
    private ComboBoxEditorPrecio editorPrecio;
    private TableModelItemAlmacen mdl_almacen;
    private CTable tbl_almacen;
    private TableModelCotizacionDet mdl_venta;
    private CTable tbl_venta;
    private JTextField txtPesoTotal;
    private JTextField txtPercepcion;
    private JTextField txtAfecto;
    private JTextField txtNoafecto;
    private JTextField txtIgv;
    private JTextField txtDescuento;
    private JTextField txtMonto;
    private List<BeanMoneda> xMoneda;
    private Map<String, BeanPrecioItem> mapPrecio;
    private ComboModelPrecio cboModelPrecio;
    private java.net.URL path;
    private JTabbedPane tabb;
    private JComboBox cbo_tipodocumento;
    private JComboBox cbo_serie;
    private JTextField txt_preimpreso;
    private JDateChooser dc_femision;
    private JDateChooser dc_fvencimiento;
    private JTextField txt_diaspago;
    private JComboBox cbo_moneda;
    private JTextField txt_tipocambio;
    private JComboBox cbo_idvendedor;
    private JTextField txt_idtrabajador;
    private JTextField txt_trabajador;
    private JTextField txt_valorventa;
    private JTextField txt_descuento;
    private JTextField txt_afecto;
    private JTextField txt_noafecto;
    private JTextField txt_igv;
    private JTextField txt_total;
    private boolean flag = false;
    private JButton btn_buscarcliente;
    private JButton btn_nuevocliente;
    private Gif gif;
    private JTextField txt_idclientereal;
    private JTextField txt_cliente;
    private JTextField txt_rucreal;
    private JTextField txt_direccionreal;
    private JComboBox cboModVta;
    private JComboBox cboCondPago;
    private List<UsuarioCorrelativo> xCorrelativo;
    private boolean blnClickAceptar = false;
    private List<BeanVendedor> xVendedor;
    //private int numero = -1;
    private JTextField txtObser1;
    private JTextField txtObser2;
    private List<BeanBanco> xBanco;
    private List<BeanEmpresaCuenta> xEmpresaCuenta;
    private JComboBox cboMonedaCta;
    private JComboBox cboBanco;
    private JComboBox cboCuenta;
    private JButton btnAgregarCuenta;
    private CTable tableCuenta;
    private EmpresaCuentaTableModel modeltableCuenta;
    private String id_item = "";
    private int numeroDecimales;
    private JCheckBox chk_publicogeneral;

    public UiRegisterCotizacion(Main frm, String title, Usuario usuario, java.net.URL path) {
        super(title);
        this.frm = frm;
        this.beanUsuario = usuario;
        this.path = path;
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

        JPanel pnl = new JPanel();
        pnl.setLayout(new BorderLayout());

        tabb.add("PRODUCTOS", pnl);
        JScrollPane scrollCab = new JScrollPane(getPnlCab());
        tabb.add("GENERAL", scrollCab);
        tabb.setEnabledAt(1, false);
        JPanel pnlNorth = new JPanel();
        pnlNorth.setLayout(new BorderLayout());
        pnlNorth.setBackground(new Color(245, 245, 245));
        JPanel pnlSouth = new JPanel();
        pnlSouth.setLayout(new BorderLayout());
        pnlSouth.setBackground(new Color(245, 245, 245));

        JPanel pnlFiltro = new JPanel();
        pnlNorth.add(pnlFiltro, BorderLayout.WEST);
        pnlFiltro.setLayout(new GridBagLayout());
        pnlFiltro.setBackground(new Color(245, 245, 245));
        GridBagConstraints gbc = new GridBagConstraints();
        gbc.gridx = 0;
        gbc.gridy = 0;
        gbc.insets = new Insets(2, 2, 2, 2);

        pnl.add(pnlNorth, BorderLayout.NORTH);
        pnl.add(pnlSouth, BorderLayout.SOUTH);

        JLabel lbl_CodigoAlterno = new JLabel("COD");
        lbl_CodigoAlterno.setFont(new Font("Helvetica", Font.BOLD, 13));
        pnlFiltro.add(lbl_CodigoAlterno, gbc);

        txt_iditem = new JTextField();
        txt_iditem.setColumns(5);
        if (Constans.IS_BUSQUEDA_ITEM_ALTERNO) {
            txt_iditem.setDocument(new UpperCaseNumberDocument(30));
        } else {
            txt_iditem.setDocument(new IntegerDocument(6));
        }
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
        txt_descripcion.setColumns(15);
        gbc.gridx = 3;
        pnlFiltro.add(txt_descripcion, gbc);

        JLabel lblMoneda = new JLabel("MONEDA");
        lblMoneda.setFont(new Font("Helvetica", Font.BOLD, 13));
        gbc.gridx = 4;
        pnlFiltro.add(lblMoneda, gbc);

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
        gbc.gridx = 6;
        pnlFiltro.add(this.btn_buscar, gbc);

        cboTipoOperIgv = new JComboBox();
        cboTipoOperIgv.addItem("NORMAL");
        cboTipoOperIgv.addItem("EXPORTACION");
        cboTipoOperIgv.addItem("EXONERADA");
        cboTipoOperIgv.setFont(new Font("Helvetica", Font.BOLD, 13));
        gbc.gridx = 7;
        pnlFiltro.add(cboTipoOperIgv, gbc);

        btnRefrescar = new JButton(gif.REFRESH16);
        btnRefrescar.setToolTipText("Refrescar");
        btnRefrescar.setFont(new Font("Helvetica", Font.BOLD, 13));
        btnRefrescar.setHorizontalTextPosition(SwingConstants.LEFT);
        btnRefrescar.setOpaque(false);
        btnRefrescar.setFocusPainted(false);
        btnRefrescar.setContentAreaFilled(true);
        btnRefrescar.setBorderPainted(true);
        pnlNorth.add(btnRefrescar, BorderLayout.EAST);

        mdl_producto = new TableModelItemVenta();
        modeloOrdenadoProducto = new TableRowSorter(mdl_producto);
        tbl_producto = new CTable();

        tbl_producto.getTableHeader().setFont(new Font(Font.SANS_SERIF, 1, 11));
        tbl_producto.setFont(new Font("Helvetica", Font.BOLD, 13));
        tbl_producto.setRowSorter(modeloOrdenadoProducto);
        tbl_producto.setModel(mdl_producto);
        tbl_producto.setNoVisibleColumn(4);
        tbl_producto.setNoVisibleColumn(6);
        tbl_producto.registerKeyboardAction(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                txt_cantidad.requestFocus();
            }
        }, KeyStroke.getKeyStroke(KeyEvent.VK_ENTER, 0, false), JComponent.WHEN_ANCESTOR_OF_FOCUSED_COMPONENT);

        tbl_producto.setAllColumnNoResizable();
        tbl_producto.setRendererColumnZero();
        tbl_producto.setAllTableNoEditable();
        tbl_producto.setAllColumnPreferredWidthNvo(5);

        JPanel pnlCenter = new JPanel();
        pnlCenter.setLayout(new BorderLayout());
        pnlCenter.setBackground(new Color(245, 245, 245));

        pnl.add(pnlCenter, BorderLayout.CENTER);

        JPanel pnlProducto = new JPanel();
        pnlProducto.setLayout(new BorderLayout());
        pnlProducto.setBackground(new Color(245, 245, 245));
        JPanel pnlAlmacen = new JPanel();
        pnlAlmacen.setLayout(new BorderLayout());
        pnlAlmacen.setBackground(new Color(245, 245, 245));

        JPanel pnlProductoSouth = new JPanel(new FlowLayout(FlowLayout.LEADING, 14, 5));
        pnlProductoSouth.setBackground(new Color(245, 245, 245));

        pnlCenter.add(pnlProducto, BorderLayout.CENTER);
        pnlCenter.add(pnlAlmacen, BorderLayout.EAST);

        JScrollPane scrollViewProducto = new JScrollPane(tbl_producto);
        pnlProducto.add(scrollViewProducto, BorderLayout.CENTER);

        JLabel lbl_cantidad = new JLabel("CANT");
        lbl_cantidad.setFont(new Font("Helvetica", Font.BOLD, 13));
        pnlProductoSouth.add(lbl_cantidad);

        txt_cantidad = new JTextField();
        txt_cantidad.setDocument(new DoubleDocument());
        txt_cantidad.setColumns(7);
        txt_cantidad.setFont(new Font("Helvetica", Font.BOLD, 13));
        pnlProductoSouth.add(txt_cantidad);

        JLabel lbl_precio = new JLabel("PRECIO");
        lbl_precio.setFont(new Font("Helvetica", Font.BOLD, 13));
        pnlProductoSouth.add(lbl_precio);
        cbo_precio = new JComboBox();
        validPrecio = new PrecioMinimo(checkAutorizado, cbo_precio);
        cbo_precio.setEditable(true);
        editorPrecio = new ComboBoxEditorPrecio();
        cbo_precio.setEditor(editorPrecio);
        ((JTextComponent) cbo_precio.getEditor().getEditorComponent()).setDocument(new DoubleDocument());
        ((JTextComponent) cbo_precio.getEditor().getEditorComponent()).setInputVerifier(validPrecio);
        pnlProductoSouth.add(cbo_precio);
        checkAutorizado.setForeground(Color.BLUE);
        checkAutorizado.setFont(new Font("Helvetica", Font.BOLD, 12));
        pnlProductoSouth.add(checkAutorizado);
        mdl_almacen = new TableModelItemAlmacen();
        tbl_almacen = new CTable();
        tbl_almacen.getTableHeader().setFont(new Font(Font.SANS_SERIF, 1, 11));
        tbl_almacen.setFont(new Font("Helvetica", Font.BOLD, 13));
        tbl_almacen.setModel(mdl_almacen);
        tbl_almacen.setAllColumnNoResizable();
        tbl_almacen.setAllTableNoEditable();
        CTableFx.alignRightColumnTable(tbl_almacen, 1);
        tbl_almacen.setAllColumnPreferredWidthNvo(5);

        JScrollPane scrollViewAlmacen = new JScrollPane(tbl_almacen);
        scrollViewAlmacen.setPreferredSize(new Dimension(400, 100));

        pnlAlmacen.add(scrollViewAlmacen, BorderLayout.CENTER);

        JPanel pnlVenta = new JPanel();
        pnlVenta.setLayout(new BorderLayout());
        pnlVenta.setOpaque(false);

        mdl_venta = new TableModelCotizacionDet();
        tbl_venta = new CTable();
        tbl_venta.getTableHeader().setFont(new Font(Font.SANS_SERIF, 1, 11));
        tbl_venta.setFont(new Font("Helvetica", Font.BOLD, 14));
        tbl_venta.setModel(mdl_venta);
        tbl_venta.setNoVisibleColumn(0);
        tbl_venta.addFocusListener(this);
        tbl_venta.addKeyListener(this);
        tbl_venta.addMouseListener(this);
        tbl_venta.setAllColumnNoResizable();
        tbl_venta.setAllTableNoEditable();
        tbl_venta.setRendererColumnZero();
        tbl_venta.setAllColumnPreferredWidth();
        if (Constans.SWCODEBARRA) {
            tbl_venta.setColumnEditable(4);
            tbl_venta.setColumnEditable(5);
        }
        if (Constans.IS_EDIT_MONTO_VENTA) {
            tbl_venta.setColumnEditable(8);
        }
        CellRenderer CellRenderer = new CellRenderer();
        tbl_venta.setDefaultRenderer(String.class, CellRenderer);
        tbl_venta.setDefaultRenderer(BigDecimal.class, CellRenderer);
        JScrollPane scrollViewVenta = new JScrollPane(tbl_venta);
        scrollViewVenta.setPreferredSize(new Dimension(698, 220));
        pnlVenta.add(scrollViewVenta, BorderLayout.CENTER);

        JPanel pnlOpc = new JPanel();
        pnlOpc.setLayout(new BorderLayout());
        pnlOpc.setOpaque(false);

        JPanel pnl_botones = new JPanel(new FlowLayout(FlowLayout.LEFT, 14, 5));
        pnlOpc.add(pnl_botones, BorderLayout.CENTER);
        pnlOpc.add(pnlProductoSouth, BorderLayout.WEST);
        pnl_botones.setOpaque(false);

        btn_agregar = new CButton("(F8) Agregar Item", gif.ADDORANGE, "Agregar Item", 'B');
        btn_quitar = new CButton("(F9) Quitar Item", gif.DELETERED, "Quitar Item", 'B');
        btn_guardar = new CButton("(Ctrl) Guardar Venta", gif.SAVE16, "Guardar Venta", 'B');
        btn_nuevo = new CButton("(F6) Limpiar", gif.NEW16, "Limpiar", 'B');

        pnl_botones.add(btn_agregar);
        pnl_botones.add(btn_quitar);
        pnl_botones.add(btn_guardar);
        pnl_botones.add(btn_nuevo);
        gbc.gridx = 9;
        pnlVenta.add(pnlOpc, BorderLayout.NORTH);
        pnlSouth.add(pnlVenta, BorderLayout.CENTER);

        JPanel pnlMontos = new JPanel();
        pnlMontos.setOpaque(false);

        JLabel lblMPercepcion = new JLabel("PERCEPCION");
        lblMPercepcion.setFont(new Font(Font.SANS_SERIF, 0, 9));
        lblMPercepcion.setForeground(Color.BLACK);
        lblMPercepcion.setVisible(false);
        pnlMontos.add(lblMPercepcion);

        txtPercepcion = new JTextField();
        txtPercepcion.setHorizontalAlignment(SwingConstants.RIGHT);
        txtPercepcion.addKeyListener(this);
        txtPercepcion.setFont(new Font(Font.SANS_SERIF, 1, 13));
        txtPercepcion.setEditable(false);
        txtPercepcion.setText("0.0");
        txtPercepcion.setVisible(false);
        pnlMontos.add(txtPercepcion);

        JLabel lblMAfecto = new JLabel("AFECTO");
        pnlMontos.add(lblMAfecto);

        txtAfecto = new JTextField();
        txtAfecto.setColumns(7);
        txtAfecto.setHorizontalAlignment(SwingConstants.RIGHT);
        txtAfecto.addKeyListener(this);
        txtAfecto.setFont(new Font(Font.SANS_SERIF, 1, 13));
        txtAfecto.setEditable(false);
        txtAfecto.setText("0.0");
        pnlMontos.add(txtAfecto);

        JLabel lblMNoAfecto = new JLabel("NO AFECTO");
        pnlMontos.add(lblMNoAfecto);

        txtNoafecto = new JTextField();
        txtNoafecto.setHorizontalAlignment(SwingConstants.RIGHT);
        txtNoafecto.addKeyListener(this);
        txtNoafecto.setEditable(false);
        txtNoafecto.setText("0.0");
        txtNoafecto.setColumns(7);
        txtNoafecto.setFont(new Font(Font.SANS_SERIF, 1, 13));
        pnlMontos.add(txtNoafecto);

        JLabel lblMIgv = new JLabel("IGV");
        pnlMontos.add(lblMIgv);

        txtIgv = new JTextField();
        txtIgv.setHorizontalAlignment(SwingConstants.RIGHT);
        txtIgv.addKeyListener(this);
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

        JLabel lblMonto = new JLabel("MONTO");
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

        JLabel lblPeso = new JLabel("PESO TOTAL");
        pnlMontos.add(lblPeso);

        txtPesoTotal = new JTextField();
        txtPesoTotal.addKeyListener(this);
        txtPesoTotal.setEditable(false);
        txtPesoTotal.setText("0.0");
        txtPesoTotal.setForeground(Color.blue);
        txtPesoTotal.setFont(new Font(Font.SANS_SERIF, 1, 13));
        txtPesoTotal.setHorizontalAlignment(SwingConstants.RIGHT);
        txtPesoTotal.setColumns(7);
        pnlMontos.add(txtPesoTotal);
        pnlVenta.add(pnlMontos, BorderLayout.SOUTH);

        getContentPane().add(pnlPrincipal);

        setMaximizable(true);
        setResizable(true);
        setClosable(true);
        setSize(1020, 545);
        setIconifiable(true);
        setLocation(((Toolkit.getDefaultToolkit().getScreenSize().width - getSize().width) / 2), (Toolkit.getDefaultToolkit().getScreenSize().height - getSize().height) / 20);

    }

    private JPanel getPnlCab() {
        JPanel pnlPrincipal = new JPanel();
        pnlPrincipal.setLayout(new BorderLayout());
        JPanel pnl = new JPanel();
        pnl.setLayout(new BorderLayout());
        JPanel pnlLeft = new JPanel();
        pnlLeft.setLayout(new BorderLayout());
        JPanel pnlCenter = new JPanel();
        pnlCenter.setLayout(new BorderLayout());
        pnlLeft.add(getPnlNorth(), BorderLayout.NORTH);
        pnlLeft.add(pnlCenter, BorderLayout.CENTER);
        pnlLeft.add(getPnlOtrosDatos(), BorderLayout.SOUTH);
        pnlCenter.add(getPnlCenter(), BorderLayout.CENTER);
        pnlCenter.add(getPnlSouth(), BorderLayout.SOUTH);
        pnlPrincipal.add(pnl, BorderLayout.NORTH);
        pnl.add(pnlLeft, BorderLayout.WEST);
        return pnlPrincipal;
    }

    private JPanel getPnlNorth() {
        JPanel pnl = new JPanel();
        pnl.setLayout(new BorderLayout());
        JPanel pnlDocumento = new JPanel();
        pnlDocumento.setLayout(new GridBagLayout());
        pnlDocumento.setBorder(BorderFactory.createTitledBorder(null, "", TitledBorder.LEFT, TitledBorder.DEFAULT_POSITION, new Font("Comic Sans MS", 0, 12), Color.BLACK));
        pnl.add(pnlDocumento, BorderLayout.WEST);
        JPanel pnlFormaPago = new JPanel();
        pnlFormaPago.setLayout(new GridBagLayout());
        JPanel pnlForma = new JPanel();
        pnlForma.setLayout(new BorderLayout());
        pnlForma.setBorder(BorderFactory.createTitledBorder(null, "", TitledBorder.LEFT, TitledBorder.DEFAULT_POSITION, new Font("Comic Sans MS", 0, 12), Color.BLACK));
        pnl.add(pnlForma, BorderLayout.CENTER);
        pnlForma.add(pnlFormaPago, BorderLayout.WEST);
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
        cbo_tipodocumento = new JComboBox();
        pnlDocumento.add(cbo_tipodocumento, gbc);
        gbc.gridwidth = 1;
        gbc.fill = GridBagConstraints.NONE;

        gbc.gridx = 0;
        gbc.gridy = 1;
        JLabel lblDoc = new JLabel("N° Documento");
        pnlDocumento.add(lblDoc, gbc);

        gbc.gridx = 1;
        cbo_serie = new JComboBox();
        cbo_serie.setPreferredSize(new Dimension(80, 20));
        pnlDocumento.add(cbo_serie, gbc);

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
        }
        pnlDocumento.add(dc_femision, gbc);

        gbc.gridwidth = 1;
        gbc.gridx = 0;
        gbc.gridy = 0;

        JLabel lblDias = new JLabel("T Dias");
        pnlFormaPago.add(lblDias, gbc);

        gbc.gridx = 1;
        txt_diaspago = new JTextField();
        txt_diaspago.setDocument(new IntegerDocument(3));
        txt_diaspago.setColumns(3);
        pnlFormaPago.add(txt_diaspago, gbc);

        gbc.gridx = 2;
        JLabel lblVence = new JLabel("F Vence");
        pnlFormaPago.add(lblVence, gbc);

        gbc.gridx = 3;
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
        txt_tipocambio.setColumns(4);
        pnlFormaPago.add(txt_tipocambio, gbc);
        gbc.fill = GridBagConstraints.NONE;

        gbc.gridx = 0;
        gbc.gridy = 2;
        JLabel lblPago = new JLabel("Cond Pago");
        pnlFormaPago.add(lblPago, gbc);

        gbc.gridx = 1;
        cboCondPago = new JComboBox();
        cboCondPago.addItem("CONTADO");
        cboCondPago.addItem("CREDITO");
        pnlFormaPago.add(cboCondPago, gbc);

        return pnl;
    }

    private JPanel getPnlCenter() {
        JPanel pnl = new JPanel();
        pnl.setLayout(new BorderLayout());
        JPanel pnlWest = new JPanel();
        pnlWest.setLayout(new BorderLayout());
        JPanel pnlCliente = new JPanel();
        JPanel pnlOpc = new JPanel(new FlowLayout(FlowLayout.LEFT, 5, 5));
        pnlCliente.setLayout(new GridBagLayout());
        pnlWest.setBorder(BorderFactory.createTitledBorder(null, "", TitledBorder.LEFT, TitledBorder.DEFAULT_POSITION, new Font("Comic Sans MS", 0, 12), Color.BLACK));
        GridBagConstraints gbc = new GridBagConstraints();
        pnl.add(pnlWest, BorderLayout.WEST);
        pnlWest.add(pnlCliente, BorderLayout.CENTER);
        pnlWest.add(pnlOpc, BorderLayout.NORTH);
        JPanel pnlRecibo = new JPanel();
        pnlRecibo.setLayout(new GridBagLayout());
        pnl.add(pnlRecibo, BorderLayout.CENTER);

        JLabel lblModVta = new JLabel("Mod. Vta");
        lblModVta.setFont(new Font(Font.SANS_SERIF, 0, 9));
        pnlOpc.add(lblModVta);

        cboModVta = new JComboBox();
        cboModVta.addItem("Cliente Recoge");
        cboModVta.addItem("Despacho al Cliente");
        pnlOpc.add(cboModVta);

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

        chk_publicogeneral = new JCheckBox("PUBLICO GENERAL");
        chk_publicogeneral.setOpaque(false);
        pnlOpc.add(chk_publicogeneral);

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
        txt_direccionreal = new JTextField();
        txt_direccionreal.setDocument(new UpperCaseNumberDocument(300));
        pnlCliente.add(txt_direccionreal, gbc);
        gbc.gridwidth = 1;

        gbc.gridx = 0;
        gbc.gridy = 0;
        gbc.fill = GridBagConstraints.HORIZONTAL;
        btnGuardar = new JButton("(Ctrl) Guardar", gif.SAVE16);
        btnGuardar.setOpaque(false);
        pnlRecibo.add(btnGuardar, gbc);

        gbc.gridy = 1;
        btnCancelar = new JButton("Cancelar", gif.CANCEL16);
        btnCancelar.setOpaque(false);
        pnlRecibo.add(btnCancelar, gbc);
        return pnl;
    }

    private JPanel getPnlSouth() {
        JPanel pnl = new JPanel();
        pnl.setLayout(new BorderLayout());
        JPanel pnlNorth = new JPanel(new FlowLayout(FlowLayout.LEFT, 5, 5));
        JPanel pnlSouth = new JPanel();
        Border border = BorderFactory.createTitledBorder(null, "Cobranza", TitledBorder.LEFT, TitledBorder.DEFAULT_POSITION, new Font("Comic Sans MS", 0, 12), Color.BLACK);
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
        txt_idtrabajador.setText(beanUsuario.getId_trabajador());
        pnlNorth.add(txt_idtrabajador);

        txt_trabajador = new JTextField();
        txt_trabajador.setFont(new Font("Comic Sans Serif", Font.PLAIN, 12));
        txt_trabajador.setEditable(false);
        txt_trabajador.setColumns(20);
        txt_trabajador.setText(beanUsuario.getTrabajador());
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

        return pnl;
    }

    private JPanel getPnlOtrosDatos() {
        JPanel pnl = new JPanel();
        pnl.setLayout(new BorderLayout());
        pnl.add(getPnlObserv(), BorderLayout.NORTH);
        pnl.add(getPnlEmpresaCta(), BorderLayout.CENTER);
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

    private JPanel getPnlEmpresaCta() {
        JPanel pnlPrinc = new JPanel();
        pnlPrinc.setLayout(new BorderLayout());
        JPanel pnlGral = new JPanel();
        pnlGral.setLayout(new BorderLayout());
        JPanel pnl = new JPanel();
        pnl.setLayout(new GridBagLayout());
        pnlPrinc.add(pnlGral, BorderLayout.NORTH);
        pnlGral.add(pnl, BorderLayout.WEST);
        pnlPrinc.setBorder(BorderFactory.createTitledBorder(null, "Cuentas de Empresa", TitledBorder.LEFT, TitledBorder.DEFAULT_POSITION, new Font("Comic Sans MS", 0, 12), Color.BLACK));
        GridBagConstraints gbc = new GridBagConstraints();
        gbc.gridx = 0;
        gbc.gridy = 0;
        gbc.insets = new Insets(2, 2, 2, 2);
        gbc.anchor = GridBagConstraints.WEST;
        JLabel lblMoneda = new JLabel("Moneda");
        pnl.add(lblMoneda, gbc);
        gbc.gridx = 1;
        cboMonedaCta = new JComboBox();
        pnl.add(cboMonedaCta, gbc);
        gbc.gridx = 0;
        gbc.gridy = 1;
        JLabel lblBanco = new JLabel("Banco");
        pnl.add(lblBanco, gbc);
        gbc.gridx = 1;
        cboBanco = new JComboBox();
        pnl.add(cboBanco, gbc);
        gbc.gridx = 2;
        JLabel lblCuenta = new JLabel("Cuenta");
        pnl.add(lblCuenta, gbc);
        gbc.gridx = 3;
        cboCuenta = new JComboBox();
        pnl.add(cboCuenta, gbc);
        gbc.gridx = 4;
        btnAgregarCuenta = new JButton("Agregar", gif.ADD16);
        btnAgregarCuenta.setMnemonic('A');
        btnAgregarCuenta.setHorizontalAlignment(SwingConstants.LEFT);
        btnAgregarCuenta.setIconTextGap(10);
        btnAgregarCuenta.setOpaque(false);
        btnAgregarCuenta.setFocusPainted(false);
        btnAgregarCuenta.setFont(new Font(Font.SANS_SERIF, 0, 11));
        pnl.add(btnAgregarCuenta, gbc);

        modeltableCuenta = new EmpresaCuentaTableModel();
        tableCuenta = new CTable();
        tableCuenta.setModel(modeltableCuenta);
        tableCuenta.setAllTableNoEditable();
        tableCuenta.setAllColumnNoResizable();
        tableCuenta.setRendererColumnZero();
        tableCuenta.setAllColumnPreferredWidth();
        tableCuenta.setNoVisibleColumn(0);
        tableCuenta.setNoVisibleColumn(1);
        tableCuenta.setNoVisibleColumn(3);
        tableCuenta.setNoVisibleColumn(6);
        tableCuenta.setNoVisibleColumn(7);
        JScrollPane scrollCuenta = new JScrollPane(tableCuenta);
        scrollCuenta.setPreferredSize(new Dimension(400, 100));

        pnlPrinc.add(scrollCuenta, BorderLayout.CENTER);
        return pnlPrinc;
    }

    public void setValueSearch(Object valor, Component comp) {
        if (comp == btn_buscarcliente) {
            flag = true;
            Anexo a = new Anexo();
            a.setIdAnexo(valor.toString());
            cargarCliente(Clientes(a));
            chk_publicogeneral.setSelected((txt_cliente.getText().trim().equals("PUBLICO GENERAL")));
            flag = false;
        }
    }

    private void buscarCliente() {
        Anexo a = new Anexo();
        a.setIdEmpresa(beanUsuario.getCodempresa());
        a.setIdTipoAnexo("2");
        a.setDescripcion(txt_cliente.getText().trim());
        a.setNumerodoc(txt_rucreal.getText().trim());

        BuscarCliente search = new BuscarCliente(frm, this, path, "cotizacion");
        search.cargarTabla(a, btn_buscarcliente, 0);
    }

    private void nuevoCliente() {
        setCursor(new Cursor(Cursor.WAIT_CURSOR));
        RegisterClienteNuevo register = new RegisterClienteNuevo(frm, beanUsuario);
        register.setPath(path);
        register.setModeRegister(Register.INSERT);
        register.setVisible(true);

        setCursor(new Cursor(Cursor.DEFAULT_CURSOR));

        String codigo = register.getResultado();

        if ((codigo != null) && !codigo.equals("")) {
            Anexo a = new Anexo();
            a.setIdAnexo(codigo);

            cargarCliente(Clientes(a));
        }
    }

    private boolean clienteValido(String opcion) {
        Anexo a = new Anexo();
        a.setNumerodoc(opcion.equals("1") ? txt_rucreal.getText().trim() : "");
        a.setDescripcion(opcion.equals("1") ? "" : txt_cliente.getText().trim());
        a.setIdEmpresa(beanUsuario.getCodempresa());
        a.setIdTipoAnexo("2");

        List<Anexo> anexo = Clientes(a);

        if ((anexo == null) || (anexo.isEmpty())) {
            int xRes = JOptionPane.showConfirmDialog(this, "El Cliente con el N° Documento " + txt_rucreal.getText().trim() + " no existe. Desea Ingresar el Cliente?", "Cliente No Ingresado", JOptionPane.YES_NO_OPTION, JOptionPane.INFORMATION_MESSAGE);

            if (xRes == JOptionPane.OK_OPTION) {
                nuevoCliente();
                btn_nuevocliente.requestFocus();
                btn_nuevocliente.doClick();
            } else {
                txt_rucreal.requestFocus();
            }
            return false;
        } else if (anexo.size() == 1) {
            return cargarClienteValido(anexo);
        } else {
            JOptionPane.showMessageDialog(null, "Puede que Exista dos ó más clientes con el \n mismo numero de documento \n comuniquese con el Supervisor");
            return false;
        }
    }

    private boolean cargarClienteValido(List<Anexo> reg) {
        //numero = -1;
        if (reg != null && reg.size() > 0) {
            Anexo cliente = reg.get(0);

            txt_idclientereal.setText(cliente.getIdAnexo());
            txt_cliente.setText(cliente.getDescripcion());
            txt_rucreal.setText(cliente.getNumerodoc());
            txt_direccionreal.setText(cliente.getDireccion());

            /*if (cliente.getFlag_exceptuado().equalsIgnoreCase("S")) {
                numero = 1;
            } else if (cliente.getFlagretencion().equalsIgnoreCase("S")) {
                numero = 2;
            } else if (cliente.getFlagpercepcion().equalsIgnoreCase("S")) {
                numero = 3;
            } else {
                numero = -1;
            }*/
            calcularpercepcion();

            return true;
        }

        return false;
    }

    private boolean cargarCliente(List<Anexo> reg) {
        try {
            //numero = -1;
            if (reg != null && reg.size() > 0) {
                Anexo cliente = reg.get(0);

                txt_idclientereal.setText(cliente.getIdAnexo());
                txt_cliente.setText(cliente.getDescripcion());
                txt_rucreal.setText(cliente.getNumerodoc());
                txt_direccionreal.setText(cliente.getDireccion());
                /*if (cliente.getFlag_exceptuado().equalsIgnoreCase("S")) {
                    numero = 1;
                } else if (cliente.getFlagretencion().equalsIgnoreCase("S")) {
                    numero = 2;
                } else if (cliente.getFlagpercepcion().equalsIgnoreCase("S")) {
                    numero = 3;
                } else {
                    numero = -1;
                }*/
                calcularpercepcion();
                return true;
            }
            return false;
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, e.getMessage());
            return false;
        }
    }

    private void initListener() {
        cboTipoOperIgv.addItemListener(this);
        addKeyListener(this);
        addFocusListener(this);
        addInternalFrameListener(this);
        btnAgregarCuenta.addActionListener(this);
        tableCuenta.addKeyListener(this);
        cboBanco.addActionListener(this);
        cboMonedaCta.addActionListener(this);
        txtObser1.addFocusListener(this);
        txtObser2.addFocusListener(this);
        cbo_precio.addKeyListener(this);
        cbo_precio.addFocusListener(this);
        cbo_precio.addItemListener(itemListener);
        btn_buscarcliente.addActionListener(this);
        btn_nuevocliente.addActionListener(this);
        txt_cliente.addFocusListener(this);
        txt_cliente.addKeyListener(this);
        txt_rucreal.addFocusListener(this);
        txt_rucreal.addKeyListener(this);
        txt_diaspago.addKeyListener(this);
        txt_diaspago.addActionListener(this);
        txt_iditem.addFocusListener(this);
        txt_iditem.addKeyListener(this);
        txt_descripcion.addFocusListener(this);
        txt_descripcion.addKeyListener(this);
        cboMoneda.addKeyListener(this);
        cboMoneda.addActionListener(this);
        btn_buscar.addActionListener(this);
        btnRefrescar.addActionListener(this);
        btn_buscar.addKeyListener(this);
        tbl_producto.addKeyListener(this);
        txt_cantidad.addKeyListener(this);
        txt_cantidad.addFocusListener(this);
        cbo_precio.addKeyListener(this);
        cbo_precio.addFocusListener(this);
        cbo_precio.setFont(new Font("Helvetica", Font.BOLD, 13));
        cbo_precio.addActionListener(this);
        tbl_almacen.addKeyListener(this);
        tbl_almacen.addMouseListener(this);
        cboMoneda.addItemListener(this);
        mdl_venta.addTableModelListener(this);
        tbl_venta.getSelectionModel().addListSelectionListener(this);
        tbl_producto.getSelectionModel().addListSelectionListener(this);
        cbo_precio.addItemListener(this);
        tbl_almacen.getSelectionModel().addListSelectionListener(this);
        tbl_producto.addMouseListener(this);
        ((JTextComponent) cbo_precio.getEditor().getEditorComponent()).addKeyListener(this);
        btn_agregar.addActionListener(this);
        btn_quitar.addActionListener(this);
        btnGuardar.addActionListener(this);
        btn_guardar.addActionListener(this);
        btn_nuevo.addActionListener(this);
        tabb.addChangeListener(this);
        btn_agregar.addKeyListener(this);
        btn_quitar.addKeyListener(this);
        btn_guardar.addKeyListener(this);
        btn_nuevo.addKeyListener(this);
        tbl_almacen.registerKeyboardAction(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                procesoAgregar();
            }
        }, KeyStroke.getKeyStroke(KeyEvent.VK_ENTER, 0, false), JComponent.WHEN_ANCESTOR_OF_FOCUSED_COMPONENT);
        cbo_tipodocumento.addActionListener(this);
        cbo_tipodocumento.addKeyListener(this);
        cbo_serie.addActionListener(this);
        cbo_serie.addKeyListener(this);
        cbo_serie.addKeyListener(this);
        dc_femision.getJCalendar().addMouseListener(this);
        dc_femision.getJCalendar().addFocusListener(this);
        dc_femision.getJCalendar().addKeyListener(this);
        dc_femision.getCalendarButton().addActionListener(this);
        dc_femision.getCalendarButton().addMouseListener(this);
        dc_femision.addPropertyChangeListener(this);
        dc_femision.addMouseListener(this);
        dc_femision.addKeyListener(this);
        dc_femision.addFocusListener(this);
        chk_publicogeneral.addKeyListener(this);
        chk_publicogeneral.addActionListener(this);
        chk_publicogeneral.addItemListener(this);
        ((JTextFieldDateEditor) dc_femision.getDateEditor()).addFocusListener(this);
        ((JTextField) dc_femision.getDateEditor()).registerKeyboardAction(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                try {
                    dc_fvencimiento.setDate(dc_femision.getDate());
                    Date fechaEmision = new Date();
                    RnTipoCambio logic = new RnTipoCambio(path);
                    BeanTipoCambio beanTipoCambio = logic.getBeanTipoCambio(new java.sql.Date(dc_femision.getDate() == null ? fechaEmision.getTime() : dc_femision.getDate().getTime()), xMoneda.get(cbo_moneda.getSelectedIndex()).getIdMoneda());
                    txt_tipocambio.setText((beanTipoCambio == null ? BigDecimal.ZERO : beanTipoCambio.getMontocompra()).toString());
                    txt_diaspago.setText("0");
                } catch (Exception ex) {
                    ex.printStackTrace();
                }
            }
        }, KeyStroke.getKeyStroke(KeyEvent.VK_ENTER, 0, false), JComponent.WHEN_FOCUSED);
        ((JTextField) dc_femision.getDateEditor()).registerKeyboardAction(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                dc_femision.getCalendarButton().doClick();
            }
        }, KeyStroke.getKeyStroke(KeyEvent.VK_SPACE, 0, false), JComponent.WHEN_FOCUSED);
        ((JTextFieldDateEditor) dc_femision.getDateEditor()).addFocusListener(new FocusListener() {
            @Override
            public void focusGained(FocusEvent e) {
            }

            @Override
            public void focusLost(FocusEvent e) {
                try {
                    dc_fvencimiento.setDate(dc_femision.getDate());
                    Date fechaEmision = new Date();
                    RnTipoCambio logic = new RnTipoCambio(path);
                    BeanTipoCambio beanTipoCambio = logic.getBeanTipoCambio(new java.sql.Date(dc_femision.getDate() == null ? fechaEmision.getTime() : dc_femision.getDate().getTime()), xMoneda.get(cbo_moneda.getSelectedIndex()).getIdMoneda());
                    txt_tipocambio.setText((beanTipoCambio == null ? BigDecimal.ZERO : beanTipoCambio.getMontocompra()).toString());
                    txt_diaspago.setText("0");
                } catch (Exception ex) {
                    ex.printStackTrace();
                }
            }
        });
    }

    private void loadTipoDocumento() throws Exception {
        try {
            cbo_tipodocumento.addItem("COTIZACION");
        } catch (Exception e) {
            throw e;
        }
    }

    public void selectInternalFrame() {
        try {
            setSelected(true);
        } catch (PropertyVetoException e) {
        }
    }

    private void loadVendedor() {
        try {
            if (xVendedor != null) {
                xVendedor.clear();
            } else {
                xVendedor = new ArrayList<BeanVendedor>();
            }
            BeanVendedor vend = new BeanVendedor();
            RnVendedor regla = new RnVendedor(path);
            xVendedor = regla.listarVendedor2(vend);
            cbo_idvendedor.removeAllItems();
            for (int i = 0; i < xVendedor.size(); i++) {
                cbo_idvendedor.addItem(xVendedor.get(i).getNOMBRES());
            }
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }

    private String getParametroSistema(String idParametro) {
        try {
            RnParametro regla = new RnParametro(path);
            List<BeanParametro> listaBeanParametro = regla.listarParametro(idParametro, "A");
            if (listaBeanParametro.isEmpty()) {
                throw new Exception("Parámetro " + idParametro + " no existe");
            } else {
                BeanParametro bean = listaBeanParametro.get(0);
                return bean.getValor();
            }
        } catch (SQLException ex) {
            JOptionPane.showMessageDialog(null, ex.getMessage());
        } catch (Exception e) {
            JOptionPane.showMessageDialog(null, e.getMessage());
        }
        return null;
    }

    public void cargarDatos() {
        try {
            cargarMoneda();
            loadBanco();
            cargarTabla();
            loadTipoDocumento();
            setFechas();
            loadVendedor();
            numeroDecimales = Integer.parseInt(getParametroSistema("00120"));
            txt_iditem.setText("");
            txt_descripcion.setText("");
            txt_cantidad.setText("0.0");
            cbo_precio.getEditor().setItem("0.0");
            txt_diaspago.setText("0");
            RnTipoCambio logic = new RnTipoCambio(path);
            BeanTipoCambio beanTipoCambio = logic.getBeanTipoCambio(new java.sql.Date((dc_femision.getDate() == null ? new Date().getTime() : dc_femision.getDate().getTime())), "00001");
            txt_tipocambio.setText(beanTipoCambio == null ? "" : beanTipoCambio.getMontoventa().toString());
            chk_publicogeneral.setSelected(true);
            limpiarVenta();
        } catch (Exception e) {
            e.printStackTrace();
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }

    private void cargarTabla() throws Exception {
        try {
            RnItem logic = new RnItem(path);
            mdl_producto.clearTable();
            List<BeanItem> lista;
            lista = logic.listarProductoVenta(beanUsuario.getCodlocalidad());
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
            lista = logic.listarProductoPrecioVenta(beanUsuario.getCodlocalidad(), "");
            mapPrecio = new HashMap<String, BeanPrecioItem>();
            for (int i = 0; i < lista.size(); i++) {
                BeanPrecioItem beanPrecioItem = (BeanPrecioItem) lista.get(i);
                mapPrecio.put(beanPrecioItem.getIdItem(), beanPrecioItem);
            }
        } catch (Exception e) {
            throw e;
        }
    }

    private void filtrarTablaProducto() {
        modeloOrdenadoProducto.setRowFilter(getFilterProducto());
        tbl_producto.setAllColumnPreferredWidthNvo(5);
        if (tbl_producto.getRowCount() > 0) {
            tbl_producto.setRowSelectionInterval(0, 0);
            procesoCargarAlmacen();
            //tbl_producto.requestFocus();
        }
    }

    private void procesoCargarAlmacen() {
        try {
            if (tbl_producto.getSelectedRow() >= 0) {
                if (mdl_producto.getItem(tbl_producto.convertRowIndexToModel(tbl_producto.getSelectedRow())).getIdItem().equals(id_item)) {
                    return;
                }
                id_item = mdl_producto.getItem(tbl_producto.convertRowIndexToModel(tbl_producto.getSelectedRow())).getIdItem();
                mdl_almacen.clearTable();
                RnStock regla = new RnStock(path);
                List<BeanStock> lista;
                if(com.softcommerce.util.Constans.ISBOTICA){
                    lista = regla.listarStockVentasLote(beanUsuario.getCodpuntoventa(),
                        mdl_producto.getItem(tbl_producto.convertRowIndexToModel(tbl_producto.getSelectedRow())).getIdItem(),
                        beanUsuario.getCodlocalidad(), "S", Main.anio);
                }else{
                    lista = regla.listarStockVentas(beanUsuario.getCodempresa(), beanUsuario.getCodpuntoventa(), mdl_producto.getItem(tbl_producto.convertRowIndexToModel(tbl_producto.getSelectedRow())).getIdItem(), beanUsuario.getCodlocalidad(), "S");
                }                                
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
            } else if (tbl_almacen.getRowCount() > 0) {
                mdl_almacen.clearTable();
            }
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }

    private void cargarPrecios(String id_item) {
        cbo_precio.removeAllItems();
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
        cbo_precio.setModel(cboModelPrecio);
        if (cboMoneda.getSelectedIndex() == 0) {
            validPrecio.setPrecioMinimo((beanPrecioItem.getPrecio3()));
        } else {
            validPrecio.setPrecioMinimo((beanPrecioItem.getPrecio6()));
        }
        if (cbo_precio.getItemCount() > 0) {
            if (cboMoneda.getSelectedIndex() == 0) {
                if (beanPrecioItem.getPrecio1().compareTo(BigDecimal.ZERO) == 0 && beanPrecioItem.getPrecio2().compareTo(BigDecimal.ZERO) == 0 && beanPrecioItem.getPrecio3().compareTo(BigDecimal.ZERO) == 0) {
                    cbo_precio.getEditor().setItem(beanPrecioItem.getPrecio1());
                } else if (beanPrecioItem.getPrecio1().compareTo(BigDecimal.ZERO) == 1) {
                    cbo_precio.getEditor().setItem(beanPrecioItem.getPrecio1());
                } else if (beanPrecioItem.getPrecio2().compareTo(BigDecimal.ZERO) == 1) {
                    cbo_precio.getEditor().setItem(beanPrecioItem.getPrecio2());
                } else {
                    cbo_precio.getEditor().setItem(beanPrecioItem.getPrecio3());
                }
            } else if (beanPrecioItem.getPrecio4().compareTo(BigDecimal.ZERO) == 0 && beanPrecioItem.getPrecio5().compareTo(BigDecimal.ZERO) == 0 && beanPrecioItem.getPrecio6().compareTo(BigDecimal.ZERO) == 0) {
                cbo_precio.getEditor().setItem(beanPrecioItem.getPrecio4());
            } else if (beanPrecioItem.getPrecio1().compareTo(BigDecimal.ZERO) == 1) {
                cbo_precio.getEditor().setItem(beanPrecioItem.getPrecio1());
            } else if (beanPrecioItem.getPrecio2().compareTo(BigDecimal.ZERO) == 1) {
                cbo_precio.getEditor().setItem(beanPrecioItem.getPrecio2());
            } else {
                cbo_precio.getEditor().setItem(beanPrecioItem.getPrecio3());
            }

        }
    }

    private void calcularpercepcion() {
        if (!blnClickAceptar) {
            BigDecimal monto_percepcion = BigDecimal.ZERO;

            for (int i = 0; i < mdl_venta.getRowCount(); i++) {
                monto_percepcion = monto_percepcion.add(mdl_venta.getRci(i).getMonto());
            }

            BigDecimal monto = BigDecimal.ZERO;
            BigDecimal m_afecto = BigDecimal.ZERO;
            BigDecimal m_noafecto = BigDecimal.ZERO;
            BigDecimal m_igv = BigDecimal.ZERO;
            BigDecimal m_descuento = BigDecimal.ZERO;

            for (int i = 0; i < mdl_venta.getRowCount(); i++) {
                monto = monto.add(mdl_venta.getRci(i).getMonto());
                m_afecto = m_afecto.add(mdl_venta.getRci(i).getAfecto());
                m_noafecto = m_noafecto.add(mdl_venta.getRci(i).getNoafecto());
                m_igv = m_igv.add(mdl_venta.getRci(i).getIgv());
                m_descuento = m_descuento.add(BigDecimal.ZERO);

                BigDecimal valorVenta = monto.subtract(m_igv);
                txt_valorventa.setText(valorVenta.toString());
                txt_igv.setText(m_igv.toString());
                txt_descuento.setText(m_descuento.toString());
                //BigDecimal valorAfecto = monto.subtract(m_igv);
                txt_afecto.setText(m_afecto.toString());
                txt_noafecto.setText(m_noafecto.toString());
                txt_total.setText(monto.toString());
            }
        }
    }

    private RowFilter getFilterProducto() {
        List filters = new ArrayList();
        if (cboMoneda.getSelectedIndex() >= 0) {
            filters.add(RowFilter.regexFilter(".*" + xMoneda.get(cboMoneda.getSelectedIndex()).getIdMoneda() + ".*", 6));
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

    private void mostrarPreimpreso() {
        String preimpreso = xCorrelativo.get(cbo_serie.getSelectedIndex()).getPreimpreso();
        int pre = Integer.parseInt(preimpreso);
        pre += 1;
        preimpreso = "0000000000" + pre;
        preimpreso = preimpreso.substring(preimpreso.length() - 10, preimpreso.length());
        txt_preimpreso.setText(String.valueOf(preimpreso));
    }

    private void limpiarVenta() {
        txtAfecto.setText("0.0");
        txtPercepcion.setText("0.0");
        txtNoafecto.setText("0.0");
        txtIgv.setText("0.0");
        txtMonto.setText("0.0");
        txtPesoTotal.setText("0.0");
        mdl_venta.clearTable();
        tbl_venta.setAllColumnPreferredWidth();
    }

    private void cargarMoneda() throws Exception {
        try {
            xMoneda = new ArrayList<BeanMoneda>();
            SingletonCombo singCombo = SingletonCombo.Instance(path);
            xMoneda.addAll(singCombo.getListMoneda());
            LoadCombo.loadMoneda(xMoneda, cbo_moneda);
            LoadCombo.loadMoneda(xMoneda, cboMoneda);
            LoadCombo.loadMoneda(xMoneda, cboMonedaCta);
        } catch (Exception e) {
            throw e;
        }
    }

    private void loadBanco() throws Exception {
        try {
            if (xBanco != null) {
                xBanco.clear();
            } else {
                xBanco = new ArrayList<BeanBanco>();
            }
            RnBanco logic = new RnBanco(path);
            xBanco.addAll(logic.listarBanco("003"));
            for (int i = 0; i < xBanco.size(); i++) {
                cboBanco.addItem(xBanco.get(i).getDescripcion());
            }
            if (cboBanco.getItemCount() > 0) {
                cboBanco.setSelectedIndex(0);
            }
        } catch (Exception e) {
            throw e;
        }
    }

    private void loadCuenta() throws Exception {
        try {
            if (xEmpresaCuenta != null) {
                xEmpresaCuenta.clear();
            } else {
                xEmpresaCuenta = new ArrayList<BeanEmpresaCuenta>();
            }
            RnEmpresaCuenta logic = new RnEmpresaCuenta(path);
            String id_banco = cboBanco.getSelectedIndex() >= 0 ? xBanco.get(cboBanco.getSelectedIndex()).getIdBanco() : "";
            String id_moneda = cboMoneda.getSelectedIndex() >= 0 ? xMoneda.get(cboMonedaCta.getSelectedIndex()).getIdMoneda() : "";
            if (id_moneda.length() > 0 & id_banco.length() > 0) {
                xEmpresaCuenta.addAll(logic.listarEmpresaCuenta("", id_moneda, id_banco, ""));
            }
            cboCuenta.removeAllItems();
            for (int i = 0; i < xEmpresaCuenta.size(); i++) {
                cboCuenta.addItem(xEmpresaCuenta.get(i).getNumeroCuenta());
            }
            if (cboCuenta.getItemCount() > 0) {
                cboCuenta.setSelectedIndex(0);
            }
        } catch (Exception e) {
            throw e;
        }
    }

    private void valorCodItem() {
        String codItem = txt_iditem.getText().trim();
        if (Constans.IS_BUSQUEDA_ITEM_ALTERNO) {
            txt_iditem.setText(codItem);
        } else {
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
    }

    private void procesoVerificar() {
        tbl_producto.editCellAt(-1, -1);
        tbl_venta.editCellAt(-1, -1);

        if (tbl_producto.getSelectedRow() == -1) {
            JOptionPane.showMessageDialog(frm, "Debe seleccionar el Item a agregar", "Seleccionar Item", JOptionPane.INFORMATION_MESSAGE);
        } else if ((txt_cantidad.getText().trim().length() > 0) && (Double.valueOf(txt_cantidad.getText().trim()).doubleValue() > 0)) {
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
        }
    }

    private void procesoAgregar() {
        try {
            tbl_producto.editCellAt(-1, -1);
            tbl_venta.editCellAt(-1, -1);

            if (tbl_producto.getSelectedRow() == -1) {
                JOptionPane.showMessageDialog(frm, "Debe seleccionar el Item a agregar", "Seleccionar Item", JOptionPane.INFORMATION_MESSAGE);
            }
            if ((txt_cantidad.getText().trim().length() > 0) && (Double.valueOf(txt_cantidad.getText().trim()).doubleValue() > 0)) {
                if (tbl_almacen.getRowCount() > 0) {
                    if (mdl_venta.getRowCount() == 10) {
                        JOptionPane.showMessageDialog(frm, "No puede registrar mas de " + 10 + " items.", "Numero maximo de Items", JOptionPane.INFORMATION_MESSAGE);
                    } else {
                        String clave = mdl_producto.getItem(tbl_producto.convertRowIndexToModel(tbl_producto.getSelectedRow())).getIdItem() + mdl_almacen.getStock(tbl_almacen.convertRowIndexToModel(tbl_almacen.getSelectedRow())).getBeanAlmacen().getIdAlmacen();

                        if (!mdl_venta.existeItem(clave)) {
                            agregarItem(-1);
                        } else {
                            int xres = JOptionPane.showConfirmDialog(this, "El producto ya esta agregado.\n - SI para REEMPLAZAR el producto.\n - NO para AUMENTAR la cantidad al producto.\n - CANCELAR si no desea ninguna opcion anterior.", "Agregar Item.", JOptionPane.YES_NO_CANCEL_OPTION, JOptionPane.INFORMATION_MESSAGE);

                            if (xres == JOptionPane.OK_OPTION) {
                                agregarItem(-1);
                            }

                            if (xres == JOptionPane.NO_OPTION) {
                                agregarItem(mdl_venta.getCantidad(clave));
                            }
                        }
                        checkAutorizado.setSelected(false);
                        try {
                            cbo_precio.setSelectedIndex(1);
                            cbo_precio.getEditor().setItem(cbo_precio.getSelectedItem());
                        } catch (Exception ex) {
                        }
                    }
                } else {
                    JOptionPane.showMessageDialog(frm, "El item no se encuentra disponible en ningun almacen", "No tiene almacen", JOptionPane.INFORMATION_MESSAGE);
                }
            } else {
                JOptionPane.showMessageDialog(frm, "Debe especificar la cantidad del Item", "Espeficicar Cantidad", JOptionPane.INFORMATION_MESSAGE);
            }
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }
    
    private BigDecimal getPrecioItem() {
        BigDecimal precio = new BigDecimal(cbo_precio.getSelectedItem().toString().trim());
        if (Constans.IS_PRECIO_INCLUYEIGV) {
            return precio;
        }
        if (this.cboTipoOperIgv.getSelectedItem().toString().equalsIgnoreCase("INAFECTO_MUESTRA_MEDICA")
                || this.cboTipoOperIgv.getSelectedItem().toString().equalsIgnoreCase("EXPORTACION")
                || this.cboTipoOperIgv.getSelectedItem().toString().equalsIgnoreCase("EXONERADA")) {
            return precio;
        }
        BeanItem productoNew = mdl_producto.getItem(tbl_producto.convertRowIndexToModel(tbl_producto.getSelectedRow()));
        if (!productoNew.getTipoOperacionIgv().equalsIgnoreCase("AFECTO")) {
            return precio;
        }
        BigDecimal mult;
        try {
            mult = BigDecimal.ONE.add(LoadDataGenerica.getPorcIgvDec(path, beanUsuario));
        } catch (Exception e) {
            mult = new BigDecimal("1.18");
        }
        return precio.multiply(mult);
    }

    private void agregarItem(double num) throws CloneNotSupportedException {
        BeanItem productoNew = mdl_producto.getItem(tbl_producto.convertRowIndexToModel(tbl_producto.getSelectedRow()));
        BeanItem producto = (BeanItem) productoNew.cloneSuperficial();
        if (this.cboTipoOperIgv.getSelectedItem().toString().equalsIgnoreCase("EXPORTACION")) {
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
        BigDecimal cantidad = new BigDecimal(txt_cantidad.getText().trim());
        BigDecimal precio = this.getPrecioItem();   
        BeanStock almacen = mdl_almacen.getStock(tbl_almacen.convertRowIndexToModel(tbl_almacen.getSelectedRow()));

        if (num != -1) {
            cantidad = cantidad.add(new BigDecimal(num));
        }
        BigDecimal monto = new BigDecimal(BigInteger.ZERO);
        BigDecimal pigv = new BigDecimal(BigInteger.ZERO);
        BigDecimal migv = new BigDecimal(BigInteger.ZERO);
        BigDecimal mafecto = new BigDecimal(BigInteger.ZERO);
        BigDecimal mnoafecto = new BigDecimal(BigInteger.ZERO);
        monto = cantidad.multiply(precio).setScale(numeroDecimales, RoundingMode.HALF_UP);;
        if (producto.getFlagIgv().equals("S")) {
            pigv = producto.getPigv().divide(new BigDecimal("100"));
            //mafecto = monto.divide(pigv.add(BigDecimal.ONE), 2, RoundingMode.HALF_DOWN);
            mafecto = monto.divide(pigv.add(BigDecimal.ONE), numeroDecimales, RoundingMode.HALF_UP);
            migv = monto.subtract(mafecto);
        } else {
            mnoafecto = monto;
        }
        BeanCotizacionDet beanCot = new BeanCotizacionDet();
        beanCot.setBeanItem(producto);
        beanCot.setBeanAlmacen(almacen.getBeanAlmacen());
        beanCot.setCantidad(cantidad);
        beanCot.setPrecio(precio);
        beanCot.setAfecto(mafecto);
        beanCot.setNoafecto(mnoafecto);
        beanCot.setPIgv(pigv);
        beanCot.setIgv(migv);
        beanCot.setMonto(monto);
        beanCot.setPesototal(producto.getPesobruto().multiply(cantidad));
        String idMoneda = xMoneda.get(cboMoneda.getSelectedIndex()).getIdMoneda();
        beanCot.setFlagAutorizado(checkAutorizado.isSelected() ? "S" : "N");
        if (verificarMoneda(idMoneda)) {
            if (verificarItemPercepcion(beanCot.getBeanItem().getFlagPercepcion())) {
                mdl_venta.agregarRci(beanCot);
            } else {
                JOptionPane.showMessageDialog(null, "Error al ingresar Item: \nVerifique estados de S/N de percepcion");
            }
        } else {
            JOptionPane.showMessageDialog(null, "Error al ingresar Item: \nTodos los Item deben tener misma moneda");
        }
        tbl_venta.setAllColumnPreferredWidth();
        txt_descripcion.requestFocus();
    }

    private boolean verificarMoneda(String idMoneda) {
        boolean valor = true;
        List<BeanCotizacionDet> lista = mdl_venta.getData();
        Iterator<BeanCotizacionDet> i = lista.iterator();
        while (i.hasNext()) {
            BeanCotizacionDet item = i.next();
            if (!item.getBeanItem().getIdMoneda().equalsIgnoreCase(idMoneda)) {
                valor = false;
                break;
            }
        }
        return valor;
    }

    private boolean verificarItemPercepcion(String perc) {
        boolean valor = true;
        List<BeanCotizacionDet> lista = mdl_venta.getData();
        Iterator<BeanCotizacionDet> i = lista.iterator();
        while (i.hasNext()) {
            BeanCotizacionDet item = i.next();
            if (!item.getBeanItem().getFlagPercepcion().equalsIgnoreCase(perc)) {
                valor = false;
                break;
            }
        }
        return valor;
    }

    private boolean verificarCliente(String opcion) {
        Anexo a = new Anexo();
        a.setNumerodoc(opcion.equals("1") ? txt_rucreal.getText().trim() : "");
        a.setDescripcion(opcion.equals("1") ? "" : txt_cliente.getText().trim());
        a.setIdEmpresa(beanUsuario.getCodempresa());
        a.setIdTipoAnexo("2");

        List<Anexo> anexo = Clientes(a);

        if ((anexo == null) || (anexo.isEmpty())) {
            int xRes = JOptionPane.showConfirmDialog(this, "El Cliente con el N° Documento " + txt_rucreal.getText().trim() + " no existe. Desea Ingresar el Cliente?", "Cliente No Ingresado", JOptionPane.YES_NO_OPTION, JOptionPane.INFORMATION_MESSAGE);

            if (xRes == JOptionPane.OK_OPTION) {
                JOptionPane.showMessageDialog(null, "Comuniquese con la área contable");
            } else {
                txt_rucreal.requestFocus();
            }
            return false;
        } else if (anexo.size() == 1) {
            cargarCliente(anexo);
            return true;
        } else {
            JOptionPane.showMessageDialog(null, "Puede que Exista dos ó más clientes con el \n mismo numero de documento \n comuniquese con el Supervisor");
            return false;
        }
    }

    private List<Anexo> Clientes(Anexo c) {
        try {
            RnAnexo regla = new RnAnexo(path);
            return regla.listAnexo("2", c.getIdAnexo(), c.getNumerodoc(), c.getDescripcion(), "A");
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, e.getMessage());
            return null;
        }
    }

    private void loadSerieCorrelativo(String ls_IdTipoDoc) {
        try {
            RnCorrelativo regla_correlativo = new RnCorrelativo(path);
            if (xCorrelativo != null) {
                xCorrelativo.clear();
            } else {
                xCorrelativo = new ArrayList<UsuarioCorrelativo>();
            }

            xCorrelativo.addAll(regla_correlativo.listarCorrelativo(beanUsuario.getId_usuario(), beanUsuario.getCodpuntoventa(), ls_IdTipoDoc));
            cbo_serie.removeAllItems();
            Collections.sort(xCorrelativo, new OrdenarUsuarioCorrelativoAsc());
            for (int i = 0; i < xCorrelativo.size(); i++) {
                cbo_serie.addItem(xCorrelativo.get(i).getSerie());
            }

            if (cbo_serie.getItemCount() > 0) {
                cbo_serie.setSelectedIndex(0);
            }
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }

    private void generarCot() {
        try {
            tabb.setSelectedIndex(1);
            loadSerieCorrelativo("CO");
            calcularpercepcion();
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }

    private boolean isRegisterValid() {

        JTextField txt = new JTextField();
        cbo_tipodocumento.setBorder(txt.getBorder());
        cbo_serie.setBorder(txt.getBorder());
        txt_preimpreso.setBorder(txt.getBorder());
        dc_femision.setBorder(new JDateChooser().getBorder());
        cbo_moneda.setBorder(txt.getBorder());
        txt_diaspago.setBorder(txt.getBorder());
        txt_cliente.setBorder(txt.getBorder());
        txt_rucreal.setBorder(txt.getBorder());
        txt_trabajador.setBorder(txt.getBorder());
        txt_igv.setBorder(txt.getBorder());

        if (!(cbo_serie.getSelectedIndex() >= 0)) {
            JOptionPane.showMessageDialog(this, "Para generar un Documento, debes especificar su Serie.", "Datos incompletos.", JOptionPane.OK_OPTION);
            cbo_serie.setBorder(new LineBorder(Color.RED));
            cbo_serie.requestFocus();
            return false;
        }

        if (txt_preimpreso.getText().toString().trim().length() == 0) {
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

        if (txt_idclientereal.getText().trim().length() == 0) {
            JOptionPane.showMessageDialog(this, "Para generar un documento, debes especificar el Cliente - El registro no contiene codigo de cliente.", "Datos incompletos.", JOptionPane.OK_OPTION);
            btn_buscarcliente.requestFocus();
            return false;
        }

        if (cbo_moneda.getSelectedIndex() < 0) {
            JOptionPane.showMessageDialog(this, "Para gerenerar un Documento, debes especificar su Moneda.", "Datos incompletos.", JOptionPane.CANCEL_OPTION);
            cbo_moneda.setBorder(new LineBorder(Color.RED));
            cbo_moneda.requestFocus();
            return false;
        }

        String tc = "0";
        if (txt_tipocambio.getText().length() > 0) {
            tc = txt_tipocambio.getText();
        }
        BigDecimal btc = new BigDecimal(tc);
        if (!(btc.compareTo(BigDecimal.ZERO) == 1)) {
            JOptionPane.showMessageDialog(this, "Ingrese Tipo de Cambio", "Datos incompletos.", JOptionPane.CANCEL_OPTION);
            txt_tipocambio.setBorder(new LineBorder(Color.RED));
            return false;
        }

        if (txt_rucreal.getText().trim().length() == 0) {
            chk_publicogeneral.setSelected(true);
        } else if (txt_rucreal.getText().trim().length() > 0) {
            return clienteValido("1");
        }

        return true;
    }

    private void guardarDocumento() {
        blnClickAceptar = true;
        try {
            if (isRegisterValid()) {
                int xres = JOptionPane.showConfirmDialog(this, "Desea Generar el documento " + cbo_tipodocumento.getSelectedItem() + " N° " + cbo_serie.getSelectedItem() + "-" + txt_preimpreso.getText().trim(), "Generar Documento", JOptionPane.OK_CANCEL_OPTION);

                if (xres == JOptionPane.OK_OPTION) {
                    insertDocumento();
                }
            }
        } catch (Exception ex) {
            JOptionPane.showMessageDialog(this, "Error de Sistema: " + ex.getMessage());
        }
        blnClickAceptar = false;
    }

    private BeanCotizacionCab getCotizacionCab() throws Exception {
        try {
            String xmlItem = "";
            xmlItem = "<?xml version=\"1.0\" ?> ";
            xmlItem += "<ITEMS>";
            String flag_autorizado = "S";
            for (int i = 0; i < mdl_venta.getRowCount(); i++) {
                BeanCotizacionDet beanDet = mdl_venta.getRci(i);
                xmlItem += "<ITEM>";
                xmlItem += "<ID_ITEM>" + beanDet.getBeanItem().getIdItem() + "</ID_ITEM>";
                xmlItem += "<M_AFECTO>" + beanDet.getAfecto().toString().replace(".", ",") + "</M_AFECTO>";
                xmlItem += "<M_NOAFECTO>" + beanDet.getNoafecto().toString().replace(".", ",") + "</M_NOAFECTO>";
                xmlItem += "<P_IGV>" + beanDet.getPIgv().toString().replace(".", ",") + "</P_IGV>";
                xmlItem += "<M_IGV>" + beanDet.getIgv().toString().replace(".", ",") + "</M_IGV>";
                xmlItem += "<MONTO>" + beanDet.getMonto().toString().replace(".", ",") + "</MONTO>";
                xmlItem += "<CANTIDAD>" + beanDet.getCantidad().toString().replace(".", ",") + "</CANTIDAD>";
                xmlItem += "<ID_ALMACEN>" + beanDet.getBeanAlmacen().getIdAlmacen() + "</ID_ALMACEN>";
                xmlItem += "<PRECIO>" + beanDet.getPrecio().toString().replace(".", ",") + "</PRECIO>";
                xmlItem += "<FLAG_AUTORIZADO>" + (beanDet.getFlagAutorizado().equals("S") ? "N" : "S") + "</FLAG_AUTORIZADO>";
                if (beanDet.getFlagAutorizado().equals("S")) {
                    flag_autorizado = "N";
                }
                xmlItem += "<TIPO_OPERACION_IGV>" + beanDet.getBeanItem().getTipoOperacionIgv() + "</TIPO_OPERACION_IGV>";
                xmlItem += "<TIPO_AFECTACION_IGV>" + beanDet.getBeanItem().getTipoAfectacionIgv() + "</TIPO_AFECTACION_IGV>";
                xmlItem += "</ITEM>";
            }
            xmlItem += "</ITEMS>";
            String xmlCuenta = "";
            xmlCuenta = "<?xml version=\"1.0\" ?> ";
            xmlCuenta += "<CUENTAS>";
            for (int i = 0; i < modeltableCuenta.getRowCount(); i++) {
                xmlCuenta += "<CUENTA>";
                xmlCuenta += "<ID_CUENTA>" + modeltableCuenta.getEmpresaCuenta(i).getIdCuenta() + "</ID_CUENTA>";
                xmlCuenta += "</CUENTA>";
            }
            xmlCuenta += "</CUENTAS>";
            BeanCotizacionCab beanCot = new BeanCotizacionCab();
            BeanTipoDocVenta beanTdv = new BeanTipoDocVenta();
            beanTdv.setIdTipoDoc("CO");
            beanCot.setBeanTipoDocVenta(beanTdv);
            beanCot.setSerie(cbo_serie.getSelectedItem().toString());
            beanCot.setPreimpreso(txt_preimpreso.getText());
            beanCot.setFEmision(dc_femision.getDate());
            beanCot.setFVence(dc_fvencimiento.getDate());
            BeanCliente beanCliente = new BeanCliente();
            beanCliente.setIdCliente(txt_idclientereal.getText());
            beanCot.setBeanCliente(beanCliente);
            BeanMoneda beanMoneda = new BeanMoneda();
            beanMoneda.setIdMoneda(xMoneda.get(cboMoneda.getSelectedIndex()).getIdMoneda());
            beanCot.setBeanMoneda(beanMoneda);
            beanCot.setTipoCambio(new BigDecimal(txt_tipocambio.getText()));
            BeanVendedor beanVendedor = new BeanVendedor();
            beanVendedor.setID_VENDEDOR(xVendedor.get(cbo_idvendedor.getSelectedIndex()).getID_VENDEDOR());
            beanCot.setBeanVendedor(beanVendedor);
            beanCot.setModVenta(cboModVta.getSelectedItem().toString().substring(0, 1));
            BeanEstadoDocumento beanEstado = new BeanEstadoDocumento();
            beanEstado.setIdEstado("003");
            beanCot.setBeanEstadoDocumento(beanEstado);
            beanCot.setFlagAutorizado(flag_autorizado);
            BeanPuntoVenta beanPtoVta = new BeanPuntoVenta();
            beanPtoVta.setId_punto_venta(beanUsuario.getCodpuntoventa());
            beanCot.setBeanPuntoVenta(beanPtoVta);
            beanCot.setObserv1(txtObser1.getText());
            beanCot.setObserv2(txtObser2.getText());
            beanCot.setCondPago(cboCondPago.getSelectedItem().toString().substring(0, 2));
            beanCot.setAfecto(new BigDecimal(txt_afecto.getText()));
            beanCot.setNoafecto(new BigDecimal(txt_noafecto.getText()));
            beanCot.setIgv(new BigDecimal(txt_igv.getText()));
            beanCot.setMonto(new BigDecimal(txt_total.getText()));
            beanCot.setPIgv(new BigDecimal("0.18"));
            beanCot.setEstado("A");
            beanCot.setIdUsuario(beanUsuario.getId_usuario());
            beanCot.setIdCorrelativo(xCorrelativo.get(cbo_serie.getSelectedIndex()).getIdCorrelativo());
            beanCot.setXmlCotizacionDet(xmlItem);
            beanCot.setXmlCuenta(xmlCuenta);
            beanCot.setTipoOperacionIgv(TIPOOPERIGV.getText());
            return beanCot;
        } catch (Exception e) {
            throw e;
        }
    }

    private void insertDocumento() throws Exception {
        try {
            BeanCotizacionCab bean = getCotizacionCab();
            RnCotizacionCab logic = new RnCotizacionCab(path);
            List<String> rpta = logic.insertCotizacion(bean);
            if (rpta.get(0).substring(0, 1).equals("*")) {
                throw new Exception(rpta.get(0));
            }
            int xres = JOptionPane.showConfirmDialog(this, rpta.get(0) + "\nDesea Imprimir Documento?", "Generar Documento", JOptionPane.OK_CANCEL_OPTION);
            if (xres == JOptionPane.OK_OPTION) {
                int xres1 = JOptionPane.showConfirmDialog(this, "Que Formato Desea Imprimir.\n - SI para Formato Especial.\n - NO para Formato Simple.", "Cotizacion.", JOptionPane.YES_NO_OPTION, JOptionPane.INFORMATION_MESSAGE);
                String formato = "";
                if (xres1 == JOptionPane.YES_OPTION) {
                    formato = "E";
                }
                if (xres1 == JOptionPane.NO_OPTION) {
                    formato = "S";
                }
                List listaRpt;
                Map parameters = new HashMap();
                JRBeanCollectionDataSource dataSource;
                String cta1 = "";
                String cta2 = "";
                String cta3 = "";
                for (int i = 0; i < modeltableCuenta.getRowCount(); i++) {
                    if (i == 0) {
                        cta1 = "(*)" + modeltableCuenta.getEmpresaCuenta(i).getBeanBanco().getDescripcion() + " - " + modeltableCuenta.getEmpresaCuenta(i).getNumeroCuenta() + " - " + modeltableCuenta.getEmpresaCuenta(i).getBeanMoneda().getDescripcion();
                    }
                    if (i == 1) {
                        cta2 = "(*)" + modeltableCuenta.getEmpresaCuenta(i).getBeanBanco().getDescripcion() + " - " + modeltableCuenta.getEmpresaCuenta(i).getNumeroCuenta() + " - " + modeltableCuenta.getEmpresaCuenta(i).getBeanMoneda().getDescripcion();
                    }
                    if (i == 2) {
                        cta3 = "(*)" + modeltableCuenta.getEmpresaCuenta(i).getBeanBanco().getDescripcion() + " - " + modeltableCuenta.getEmpresaCuenta(i).getNumeroCuenta() + " - " + modeltableCuenta.getEmpresaCuenta(i).getBeanMoneda().getDescripcion();
                    }
                }
                String rutaJasper = "";
                parameters.put("NOMBRE_EMPRESA", beanUsuario.getDescriempresa());
                parameters.put("DIRECCION", beanUsuario.getDireccion());
                parameters.put("RUC", beanUsuario.getRuc());
                parameters.put("FORMATO", formato);
                parameters.put("CTA1", cta1);
                parameters.put("CTA2", cta2);
                parameters.put("CTA3", cta3);
                ConvertNumberToLetter conv = new ConvertNumberToLetter();
                String montoLetras = conv.convertir(Double.parseDouble(txt_total.getText()), xMoneda.get(cboMoneda.getSelectedIndex()).getIdMoneda());
                parameters.put("MONTOLETRAS", montoLetras);
                parameters.put("paramImagen", this.getClass().getResourceAsStream(Main.strLogo));
                parameters.put(JRParameter.REPORT_LOCALE, Locale.US);
                listaRpt = logic.reportCotizacion(Integer.parseInt(rpta.get(1)));
                rutaJasper = Constans.PATH_RPT_COTIZACION;
                dataSource = new JRBeanCollectionDataSource(listaRpt);
                Exportar exportar = new Exportar(parameters, dataSource, rutaJasper);
                exportar.vistaPrevia(true);
            }
            nuevo();
            tabb.setSelectedIndex(0);
        } catch (Exception e) {
            e.printStackTrace();
            throw e;
        }
    }

    private void insertarCuenta() {
        if (cboCuenta.getSelectedIndex() < 0) {
            return;
        }
        if (modeltableCuenta.getRowCount() == 3) {
            JOptionPane.showMessageDialog(this, "Solo se pueden ingresar 3 Cuentas");
            return;
        }
        BeanEmpresaCuenta beanCuenta = xEmpresaCuenta.get(cboCuenta.getSelectedIndex());
        if (!verificarCuenta(beanCuenta.getIdCuenta())) {
            JOptionPane.showMessageDialog(this, "Cuenta ya esta agregada a la lista");
            return;
        }
        modeltableCuenta.addEmpresaCuenta(beanCuenta);
        tableCuenta.setAllColumnPreferredWidthNvo(10);
    }

    private boolean verificarCuenta(String id_cuenta) {
        for (int i = 0; i < modeltableCuenta.getRowCount(); i++) {
            if (modeltableCuenta.getEmpresaCuenta(i).getIdCuenta().equals(id_cuenta)) {
                return false;
            }
        }
        return true;
    }

    @Override
    public void keyTyped(KeyEvent e) {
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
            this.cbo_tipodocumento.requestFocus();
            return;
        }

        if (KeyEvent.VK_CONTROL == e.getKeyCode() && tabb.getSelectedIndex() == 1) {
            guardarDocumento();
            return;
        }
        if ((e.getSource() == txt_descripcion)
                || (e.getSource() == txt_iditem)) {
            filtrarTablaProducto();
            if (e.getKeyChar() == '\n') {
                tbl_producto.requestFocus();
            }
        }

        if (e.getKeyChar() == '\n') {
            if (e.getSource().equals(cbo_precio)) {
                txt_descripcion.requestFocus();
            }
            if (e.getSource() == cboMoneda) {
                btn_buscar.requestFocus();
            }
            if (e.getSource() == btn_buscar) {
                btn_agregar.requestFocus();
            }
            if ((e.getSource() == txt_descripcion)
                    || (e.getSource() == txt_iditem)) {
                if (txt_iditem.getText().trim().length() > 0) {
                    valorCodItem();
                    filtrarTablaProducto();
                }
            }

            if (e.getSource() == txt_cantidad) {
                cbo_precio.getEditor().getEditorComponent().requestFocus();
            }

            if (e.getSource() == cbo_precio.getEditor().getEditorComponent()) {
            }
            if (e.getSource().equals(btn_agregar)) {
                btn_quitar.requestFocus();
            }
            /*if (e.getSource().equals(btn_quitar)) {
                btn_guardar.requestFocus();
            }
            if (e.getSource().equals(btn_guardar)) {
                btn_nuevo.requestFocus();
            }*/
            if (e.getSource().equals(btn_nuevo)) {
                txt_descripcion.requestFocus();
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
                    txt_direccionreal.requestFocus();
                }
            }

        }

        if (e.getKeyCode() == KeyEvent.VK_ESCAPE) {
            dispose();
            doDefaultCloseAction();
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

        /*if (e.getKeyCode() == KeyEvent.VK_F5) {
            tbl_producto.editCellAt(-1, -1);
            tbl_venta.editCellAt(-1, -1);
            btn_guardar.requestFocus();
            btn_guardar.doClick();
        }*/
        if (e.getKeyCode() == KeyEvent.VK_F6) {
            tbl_producto.editCellAt(-1, -1);
            tbl_venta.editCellAt(-1, -1);
            btn_nuevo.requestFocus();
            btn_nuevo.doClick();
            return;
        }

        /*if (e.getKeyCode() == KeyEvent.VK_F7) {
            tbl_producto.editCellAt(-1, -1);
            tbl_venta.editCellAt(-1, -1);
            btn_buscar.doClick();
        }*/
        if (e.getSource().equals((JTextComponent) cbo_precio.getEditor().getEditorComponent())) {
            if (KeyEvent.VK_ENTER == e.getKeyChar()) {
                procesoVerificar();
            }
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
        if (e.getSource().equals(tableCuenta)) {
            if (e.getKeyCode() == 127) {
                if (tableCuenta.getSelectedRow() >= 0) {
                    int xres = JOptionPane.showConfirmDialog(this, "Seguro que desea Eliminar Cuenta?", "Cuenta", JOptionPane.OK_CANCEL_OPTION);
                    if (xres == JOptionPane.OK_OPTION) {
                        modeltableCuenta.deleteEmpresaCuenta(tableCuenta.convertRowIndexToModel(tableCuenta.getSelectedRow()));
                        tableCuenta.setAllColumnPreferredWidth();
                    }
                } else {
                    JOptionPane.showMessageDialog(frm, "Seleccionar Cuenta", "Eliminar Cuenta", JOptionPane.INFORMATION_MESSAGE);
                }
            }
        }
    }

    @Override
    public void focusGained(FocusEvent e) {
        if (((JTextFieldDateEditor) dc_femision.getDateEditor()) == e.getSource()) {
            ((JTextFieldDateEditor) dc_femision.getDateEditor()).selectAll();
        }
        if (e.getSource().equals(cbo_precio)) {
            cbo_precio.getEditor().selectAll();
        }

        if (e.getSource() == txtObser1) {
            txtObser1.selectAll();
        }
        if (e.getSource() == txtObser2) {
            txtObser2.selectAll();
        }
        if (e.getSource() == txt_iditem) {
            txt_iditem.selectAll();
        }

        if (e.getSource() == txt_descripcion) {
            txt_descripcion.selectAll();
        }

        if (e.getSource() == txt_cantidad) {
            txt_cantidad.selectAll();
        }

        if (e.getSource() == cbo_precio.getEditor().getEditorComponent()) {
            cbo_precio.getEditor().selectAll();
        }
    }

    @Override
    public void focusLost(FocusEvent e) {
        if (e.getSource().equals(((JTextFieldDateEditor) dc_femision.getDateEditor()))) {
            try {
                RnTipoCambio logic = new RnTipoCambio(path);
                Date fechaEmision = new Date();
                BeanTipoCambio beanTipoCambio = logic.getBeanTipoCambio(new java.sql.Date(dc_femision.getDate() == null ? fechaEmision.getTime() : dc_femision.getDate().getTime()), xMoneda.get(cbo_moneda.getSelectedIndex()).getIdMoneda());
                dc_fvencimiento.setDate(dc_femision.getDate());
                txt_tipocambio.setText((beanTipoCambio == null ? BigDecimal.ZERO : beanTipoCambio.getMontocompra()).toString());
                txt_diaspago.setText("0");
            } catch (Exception ex) {
            }
        }
        if (e.getSource() == txt_iditem && txt_iditem.getText().trim().length() > 0) {
            valorCodItem();
        }
        if (e.getSource() == txt_cantidad && txt_cantidad.getText().trim().length() == 0) {
            txt_cantidad.setText("0.0");
        }
        if (e.getSource().equals(cbo_precio)) {
            String valor = ((JTextComponent) cbo_precio.getEditor().getEditorComponent()).getText();
            int punto = valor.indexOf(".");
            if (valor.substring(punto).length() > 2) {
                JOptionPane.showMessageDialog(this, "Debe registrar máximo 2 dígitos decimales", "Sistema", JOptionPane.WARNING_MESSAGE);
                cbo_precio.requestFocus();
            }
        }
    }

    private void guardarVentaF5() {
        if (tbl_venta.getRowCount() <= 0) {
            JOptionPane.showMessageDialog(this, "Para generar un Documento, debes especificar al menos un Item.", "Datos incompletos.", JOptionPane.INFORMATION_MESSAGE);
            txt_descripcion.requestFocus();
            return;
        }
        //int xres = JOptionPane.showConfirmDialog(this, "Desea Generar Documento?", "Generar Documento", JOptionPane.OK_CANCEL_OPTION);
        //if (xres == JOptionPane.OK_OPTION) {
        List<BeanCotizacionDet> listaItem = mdl_venta.getData();
        HashSet<String> monedas = new HashSet();
        Iterator<BeanCotizacionDet> i = listaItem.iterator();
        while (i.hasNext()) {
            monedas.add(i.next().getBeanItem().getIdMoneda());
        }
        if (monedas.size() == 1) {
            generarCot();
        } else {
            JOptionPane.showMessageDialog(null, "La lista de Items tiene monedas distintas");
        }
        //}
    }

    @Override
    public void internalFrameOpened(InternalFrameEvent e) {
    }

    @Override
    public void internalFrameClosing(InternalFrameEvent e) {
    }

    @Override
    public void internalFrameClosed(InternalFrameEvent e) {
    }

    @Override
    public void internalFrameIconified(InternalFrameEvent e) {
    }

    @Override
    public void internalFrameDeiconified(InternalFrameEvent e) {
    }

    @Override
    public void internalFrameActivated(InternalFrameEvent e) {
    }

    @Override
    public void internalFrameDeactivated(InternalFrameEvent e) {
    }

    @Override
    public void actionPerformed(ActionEvent e) {
        try {
            if (e.getSource().equals(btnAgregarCuenta)) {
                insertarCuenta();
            }
            if (e.getSource().equals(cboBanco)) {
                loadCuenta();
            }
            if (e.getSource().equals(cboMonedaCta)) {
                loadCuenta();
            }
            if (cbo_tipodocumento == e.getSource()) {
                if (cbo_tipodocumento.getItemCount() > 0) {
                    cbo_serie.removeAllItems();
                    txt_preimpreso.setText("0000000000");
                    loadSerieCorrelativo("CO");
                    String ruc = txt_rucreal.getText();
                    txt_rucreal.setDocument(new IntegerDocument(11));
                    txt_rucreal.setText(ruc);
                    calcularpercepcion();
                }
            }
            if (cbo_serie == e.getSource()) {
                if (cbo_serie.getItemCount() > 0) {
                    mostrarPreimpreso();
                }
            }
            if (btn_guardar == e.getSource()) {
                this.guardarVentaF5();
            }

            if (txt_diaspago == e.getSource()) {
                if (Integer.parseInt(txt_diaspago.getText()) >= 0) {
                    int numDias = Integer.parseInt(txt_diaspago.getText());
                    Calendar hoy = Calendar.getInstance();
                    try {
                        hoy.setTime(dc_femision.getDate());
                    } catch (Exception ex) {
                        try {
                            Date fechaEmision = new Date();
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

            if (btn_quitar == e.getSource()) {
                if (tbl_venta.getSelectedRow() >= 0) {
                    int xres = JOptionPane.showConfirmDialog(this, "Desea eliminar el item?", "Eliminar Item", JOptionPane.OK_CANCEL_OPTION);

                    if (xres == JOptionPane.OK_OPTION) {
                        mdl_venta.eliminarRci(tbl_venta.convertRowIndexToModel(tbl_venta.getSelectedRow()));
                        tbl_venta.setAllColumnPreferredWidth();
                    }
                } else {
                    JOptionPane.showMessageDialog(frm, "Para eliminar un item primero debe seleccionar la fila.", "Eliminar Item", JOptionPane.INFORMATION_MESSAGE);
                }
            }
            if (e.getSource() == btn_nuevo) {
                if (tbl_venta.getRowCount() == 0) {
                    JOptionPane.showMessageDialog(this, "La venta ya esta limpia.", "Limpiar Venta", JOptionPane.INFORMATION_MESSAGE);
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
            if (e.getSource().equals(btnRefrescar)) {
                cargarTabla();
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
        } catch (Exception ex) {
            ex.printStackTrace();
            JOptionPane.showMessageDialog(this, ex.getMessage());
        }
    }

    private void setFechas() {
        dc_femision.setDate(new Date());
        dc_fvencimiento.setDate(new Date());
        dc_femision.setSelectableDateRange(frm.getFechaInicio(), new Date());
    }

    private void calcularImportes() {
        BigDecimal descuentoPedido = BigDecimal.ZERO;
        BigDecimal noafectoPedido = BigDecimal.ZERO;
        BigDecimal igvPedido = BigDecimal.ZERO;
        BigDecimal percepcionPedido = BigDecimal.ZERO;
        BigDecimal monto = BigDecimal.ZERO;
        BigDecimal peso = BigDecimal.ZERO;
        NumberFormat formatter = NumberFormat.getInstance(new Locale("en_US"));

        for (int i = 0; i < mdl_venta.getRowCount(); i++) {
            BeanCotizacionDet beanrci = mdl_venta.getRci(i);

            monto = monto.add(beanrci.getMonto());
            peso = peso.add(beanrci.getPesototal());
            noafectoPedido = noafectoPedido.add(beanrci.getNoafecto());
            descuentoPedido = new BigDecimal(BigInteger.ZERO);
            igvPedido = igvPedido.add(beanrci.getIgv());
        }

        txtMonto.setText(FormatObject.formatNumber(formatter.format(monto.setScale(2, RoundingMode.HALF_DOWN)), 2));
        txtPesoTotal.setText(FormatObject.formatNumber(formatter.format(peso.setScale(2, RoundingMode.HALF_DOWN)), 2));
        txtIgv.setText(FormatObject.formatNumber(formatter.format(igvPedido.setScale(2, RoundingMode.HALF_DOWN)), 2));
        txtNoafecto.setText(FormatObject.formatNumber(formatter.format(noafectoPedido.setScale(2, RoundingMode.HALF_DOWN)), 2));
        BigDecimal valorAfecto = monto.setScale(2, RoundingMode.HALF_DOWN).subtract(igvPedido.setScale(2, RoundingMode.HALF_DOWN)).subtract(noafectoPedido.setScale(2, RoundingMode.HALF_DOWN));
        txtAfecto.setText(FormatObject.formatNumber(formatter.format(valorAfecto.setScale(2, RoundingMode.HALF_DOWN)), 2));
        txtPercepcion.setText(FormatObject.formatNumber(formatter.format(percepcionPedido.setScale(2, RoundingMode.HALF_DOWN)), 2));
        txtDescuento.setText(FormatObject.formatNumber(formatter.format(descuentoPedido.setScale(2, RoundingMode.HALF_DOWN)), 2));
    }

    private void nuevo() {
        limpiarVenta();
        setFechas();
        txt_idclientereal.setText("");
        txt_cliente.setText("");
        txt_rucreal.setText("");
        txt_direccionreal.setText("");
        txt_diaspago.setText("0");
        txtObser1.setText("");
        txtObser2.setText("");
        modeltableCuenta.clearTable();
        txt_descripcion.requestFocus();
        chk_publicogeneral.setSelected(true);
    }

    @Override
    public void itemStateChanged(ItemEvent e) {
        if (e.getSource().equals(cboTipoOperIgv)) {
            changeTipoOperIgv();
        }
        if (e.getSource().equals(cboMoneda)) {
            filtrarTablaProducto();
            cbo_precio.removeAllItems();
            cbo_precio.updateUI();
            cbo_moneda.setSelectedIndex(cboMoneda.getSelectedIndex());
        }
        if (e.getSource().equals(cbo_precio)) {
            cbo_precio.getEditor().setItem(cbo_precio.getSelectedItem());
        }
        if (e.getSource().equals(chk_publicogeneral)) {
            if (!flag) {
                if (chk_publicogeneral.isSelected()) {
                    Anexo c = new Anexo();
                    c.setNumerodoc("00000000");
                    List<Anexo> an = Clientes(c);

                    if ((an != null) && (an.size() > 0)) {
                        cargarCliente(an);
                    }
                } else {
                    txt_idclientereal.setText("");
                    txt_cliente.setText("");
                    txt_rucreal.setText("");
                    txt_direccionreal.setText("");
                }
            }
        }
    }

    @Override
    public void mouseClicked(MouseEvent e) {
        if (e.getSource().equals(dc_femision.getCalendarButton())) {
            ((JTextField) dc_femision.getDateEditor()).requestFocus();
        }
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
    }

    @Override
    public void mousePressed(MouseEvent e) {
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
    public void mouseEntered(MouseEvent e) {
    }

    @Override
    public void mouseExited(MouseEvent e) {
    }

    @Override
    public void tableChanged(TableModelEvent e) {
        if (e.getSource() == mdl_venta) {
            calcularImportes();
        }
    }

    @Override
    public void valueChanged(ListSelectionEvent e) {
    }

    @Override
    public void propertyChange(PropertyChangeEvent evt) {
    }

    @Override
    public void stateChanged(ChangeEvent e) {
        if (e.getSource() == tabb) {
        }
    }
    ItemListener itemListener = new ItemListener() {
        @Override
        public void itemStateChanged(ItemEvent e) {
            cbo_precio.getEditor().setItem(cbo_precio.getSelectedItem());
        }
    };

    private void changeTipoOperIgv() {
        String actualTipoOperIgv = this.cboTipoOperIgv.getSelectedItem().toString();
        if (!actualTipoOperIgv.equalsIgnoreCase(TIPOOPERIGV.getText()) && (actualTipoOperIgv.equalsIgnoreCase("EXPORTACION") || actualTipoOperIgv.equalsIgnoreCase("EXONERADA"))) {
            this.limpiarVenta();
        } else if (!actualTipoOperIgv.equalsIgnoreCase(TIPOOPERIGV.getText()) && (TIPOOPERIGV.getText().equalsIgnoreCase("EXPORTACION") || TIPOOPERIGV.getText().equalsIgnoreCase("EXONERADA")) && (actualTipoOperIgv.equalsIgnoreCase("NORMAL") || actualTipoOperIgv.equalsIgnoreCase("GRATUITA"))) {
            this.limpiarVenta();
        }
        TIPOOPERIGV.setText(this.cboTipoOperIgv.getSelectedItem().toString());
    }
}
