package com.softcommerce.formularios;

import com.softcommerce.reportes.jheyson.RptVenta;
import com.softcommerce.beans.Anexo;
import com.softcommerce.beans.BeanAlmacen;
import com.softcommerce.beans.BeanAnexo;
import com.softcommerce.beans.BeanCondicionPago;
import com.softcommerce.beans.BeanEstadoDocumento;
import com.softcommerce.beans.BeanItem;
import com.softcommerce.beans.BeanMoneda;
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
import com.softcommerce.beans.BeanVendedor;
import com.softcommerce.beans.TipoOperacion;
import com.softcommerce.beans.Usuario;
import com.softcommerce.beans.UsuarioCorrelativo;
import com.softcommerce.comboboxmodel.ComboModelAlmacen;
import com.softcommerce.comboboxmodel.ComboModelPrecio;
import com.softcommerce.datasource.DataSourceVenta;
import com.softcommerce.enums.AuxiliarEnum;
import com.softcommerce.enums.MonedaEnum;
import com.softcommerce.enums.CboCondPagoEnum;
import com.softcommerce.enums.CondicionPagoEnum;
import com.softcommerce.enums.TipoDocVentaEnum;
import com.softcommerce.enums.TipoPagoEnum;
import com.softcommerce.general.controles.CButton;
import com.softcommerce.general.controles.CLabel;
import com.softcommerce.general.controles.CTable;
import com.softcommerce.general.controles.DoubleDocument;
import com.softcommerce.general.controles.IntegerDocument;
import com.softcommerce.general.controles.ObjectItem;
import com.softcommerce.general.controles.Register;
import com.softcommerce.general.controles.UpperCaseNumberDocument;
import com.softcommerce.general.herramientas.CFunciones;
import com.softcommerce.general.herramientas.CTableFx;
import com.softcommerce.general.herramientas.DateTime;
import com.softcommerce.general.tablas.TableModelItemAlmacen;
import com.softcommerce.general.tablas.TableModelItemVenta;
import com.softcommerce.general.tablas.TableModelRegcontaItem;
import com.softcommerce.gui.FormConversion;
import com.softcommerce.iconos.Gif;
import com.softcommerce.logic.LogicConfiguracion;
import com.softcommerce.reglasnegocio.RnRegconta;
import com.softcommerce.reglasnegocio.RnTipoDocVenta;
import com.softcommerce.reglasnegocio.RnVendedor;
import com.softcommerce.reglasnegocio.RnAnexo;
import com.softcommerce.reglasnegocio.RnConsultas;
import com.softcommerce.reglasnegocio.RnCorrelativo;
import com.softcommerce.reglasnegocio.RnItem;
import com.softcommerce.reglasnegocio.RnStock;
import com.softcommerce.reglasnegocio.RnTipoCambio;
import com.softcommerce.reglasnegocio.RnTipoOperacion;
import com.softcommerce.reglasnegocio.RnPreciosCab;
import com.softcommerce.report.ConvertNumberToLetter;
import com.softcommerce.util.editor.CellEditorCbAlmacen;
import com.softcommerce.util.render.CellRenderer;
import com.softcommerce.util.Constans;
import com.softcommerce.util.ExceptionHandler;
import com.softcommerce.util.Exportar;
import com.softcommerce.util.FactElectTxt;
import com.softcommerce.util.FormatObject;
import com.softcommerce.util.combo.LoadCombo;
import com.softcommerce.util.LoadDataGenerica;
import com.softcommerce.util.Propiedad;
import com.softcommerce.util.combo.SingletonCombo;
import com.softcommerce.util.Util;
import com.softcommerce.util.VerificarEnteroMayorCero;
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
import java.awt.event.KeyAdapter;
import java.awt.event.KeyEvent;
import java.awt.event.KeyListener;
import java.awt.event.MouseEvent;
import java.awt.event.MouseListener;
import java.beans.PropertyVetoException;
import java.math.BigDecimal;
import java.math.BigInteger;
import java.math.RoundingMode;
import java.text.NumberFormat;
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
import javax.swing.KeyStroke;
import javax.swing.ListSelectionModel;
import javax.swing.RowFilter;
import javax.swing.SwingConstants;
import javax.swing.border.Border;
import javax.swing.border.LineBorder;
import javax.swing.border.TitledBorder;
import javax.swing.event.ChangeEvent;
import javax.swing.event.ChangeListener;
import javax.swing.event.TableModelEvent;
import javax.swing.event.TableModelListener;
import javax.swing.table.TableRowSorter;
import net.sf.jasperreports.engine.JRParameter;
import org.apache.log4j.Logger;

public class RegisterVentaCosto
        extends JInternalFrame
        implements KeyListener, ActionListener, MouseListener, FocusListener,
        TableModelListener, ItemListener,
        ChangeListener {

    private final Logger logger = Logger.getLogger(RegisterVentaCosto.class);
    private static final long serialVersionUID = 1L;
    private Main frm;
    private JComboBox cbo_precio;
    private JComboBox cboMoneda;
    private CButton btn_guardar;
    private CButton btn_nuevo;
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
    private Usuario usuario;
    private java.net.URL path;
    private ComboModelPrecio cboModelPrecio;
    private JTextField txtPesoTotal;
    private Map<String, BeanPrecioItem> mapPrecio;
    private BigDecimal porcIgv;
    private int maxProd;
    private BigDecimal paramValorBoletaDNI;
    private BigDecimal paramValorPercepcion;
    private int numeroDecimales;
    private String idItem = "";
    private List<BeanMoneda> xMoneda;
    private JTabbedPane tabb;
    private JComboBox cbo_tipodocumento;
    private JComboBox cbo_serie;
    private JTextField txt_preimpreso;
    private JDateChooser dc_femision;
    private JTextField txt_diaspago;
    private JDateChooser dc_fvencimiento;
    private JComboBox cboCondPago;
    private JTextField txt_tipocambio;
    private JComboBox cbo_moneda;
    private JComboBox cbo_mediopago;
    private JCheckBox chk_publicogeneral;
    private JButton btn_nuevocliente;
    private JTextField txt_idclientereal;
    private JTextField txt_direccionreal;
    private JButton btn_buscarcliente;
    private Gif gif;
    private JTextField txt_cliente;
    private JTextField txt_rucreal;
    private JTextField txt_recibo;
    private JTextField txt_vuelto;
    private JButton btn_cancelar;
    private JButton btnGuardar;
    private JButton btnVista;
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
    private JTextField txt_totalcobrar;
    private List<BeanTipoDocVenta> xTipoDocVenta;
    private boolean blnClickAceptar = false;
    private int numero = -1;
    private List<UsuarioCorrelativo> xCorrelativo;
    private List<BeanVendedor> listaV;
    private String id_tipo_operacion;
    private boolean flag = false;
    private JLabel lblLetra;
    private JTextField txtLetra;
    private JLabel lblOc;
    private JTextField txtOc;
    private JLabel lblGuia;
    private JTextField txtNumGuia;

    public RegisterVentaCosto(Main frm, String title, Usuario usuario, java.net.URL path) {
        super(title);
        this.path = path;
        this.frm = frm;
        this.usuario = usuario;
        inicialize();
        initListener();
    }

    private void inicialize() {
        gif = new Gif();

        JPanel pnl = new JPanel();
        pnl.setLayout(new BorderLayout());

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
        if (Constans.ISBOTICA) {
            pnlEast.add(lblMaxProd);
            pnlEast.add(txtMaximoProductos);
        }
        pnlEast.add(btnRefrescar);
        pnlNorth.add(pnlEast, BorderLayout.EAST);

        mdl_producto = new TableModelItemVenta();
        modeloOrdenadoProducto = new TableRowSorter(mdl_producto);
        tbl_producto = new CTable();
        //tbl_producto.getSelectionModel().addListSelectionListener(this);
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
        tbl_producto.setNoVisibleColumn(2);
        tbl_producto.setNoVisibleColumn(4);
        tbl_producto.setNoVisibleColumn(6);
        if (Constans.ISBOTICA) {
            tbl_producto.moveColumn(5, 2);
        } else {
            tbl_producto.setNoVisibleColumn(5);
            tbl_producto.setNoVisibleColumn(7);
        }
        tbl_producto.setNoVisibleColumn(15);
        tbl_producto.setNoVisibleColumn(16);
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
        scrollViewProducto.setPreferredSize(new Dimension(600, 100));
        pnlProducto.add(scrollViewProducto, BorderLayout.CENTER);

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
        cbo_precio = new JComboBox();
        cbo_precio.setPreferredSize(new Dimension(70, 25));
        cbo_precio.addKeyListener(this);
        cbo_precio.addKeyListener(new KeyAdapter() {
            @Override
            public void keyPressed(KeyEvent arg0) {
                String valor = cbo_precio.getSelectedIndex() >= 0 ? cbo_precio.getSelectedItem().toString() : "";
                if (valor.isEmpty() == false) {
                    if (KeyEvent.VK_ENTER == arg0.getKeyChar()) {
                        procesoVerificar();
                    }
                    if (KeyEvent.VK_CONTROL == arg0.getKeyCode() && tabb.getSelectedIndex() == 0) {
                        tbl_producto.editCellAt(-1, -1);
                        tbl_venta.editCellAt(-1, -1);
                        btn_guardar.requestFocus();
                        btn_guardar.doClick();
                    }

                }

                if (KeyEvent.VK_ALT == arg0.getKeyCode() && tabb.getSelectedIndex() == 0) {
                    txt_descripcion.requestFocus();
                    txt_descripcion.selectAll();
                }

            }

            @Override
            public void keyTyped(KeyEvent evt) {
            }
        });

        cbo_precio.setFont(new Font("Helvetica", Font.BOLD, 13));
        cbo_precio.addActionListener(this);

        pnlProductoSouth.add(cbo_precio);

        mdl_almacen = new TableModelItemAlmacen();
        tbl_almacen = new CTable();
        tbl_almacen.getTableHeader().setFont(new Font(Font.SANS_SERIF, 1, 11));
        tbl_almacen.setFont(new Font("Helvetica", Font.BOLD, 13));
        tbl_almacen.setModel(mdl_almacen);
        //tbl_almacen.getSelectionModel().addListSelectionListener(this);
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
        scrollViewAlmacen.setPreferredSize(new Dimension(100, 100));

        pnlAlmacen.add(scrollViewAlmacen, BorderLayout.CENTER);

        JPanel pnlVenta = new JPanel();
        pnlVenta.setLayout(new BorderLayout());
        pnlVenta.setOpaque(false);

        mdl_venta = new TableModelRegcontaItem();
        mdl_venta.addTableModelListener(this);
        tbl_venta = new JTable();
        tbl_venta.getTableHeader().setFont(new Font(Font.SANS_SERIF, 1, 11));
        tbl_venta.setFont(new Font("Helvetica", Font.BOLD, 14));
        tbl_venta.setModel(mdl_venta);
        //tbl_venta.getSelectionModel().addListSelectionListener(this);
        tbl_venta.addFocusListener(this);
        tbl_venta.addKeyListener(this);
        tbl_venta.addMouseListener(this);
        tbl_venta.setAutoResizeMode(JTable.AUTO_RESIZE_OFF);
        tbl_venta.getColumnModel().getColumn(2).setMinWidth(0);
        tbl_venta.getColumnModel().getColumn(2).setMaxWidth(0);
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
        tbl_venta.getColumnModel().getColumn(18).setMinWidth(0);
        tbl_venta.getColumnModel().getColumn(18).setMaxWidth(0);
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
        btn_nuevo = new CButton("(F6) Limpiar Venta", gif.NEW16, "Limpiar Venta", 'B');

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
                btn_nuevo.requestFocus();
            }
        }, KeyStroke.getKeyStroke(KeyEvent.VK_ENTER, 0, false), JComponent.WHEN_FOCUSED);
        btn_nuevo.registerKeyboardAction(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                txt_descripcion.requestFocus();
            }
        }, KeyStroke.getKeyStroke(KeyEvent.VK_ENTER, 0, false), JComponent.WHEN_FOCUSED);

        pnl_botones.add(btn_agregar);
        pnl_botones.add(btn_quitar);
        pnl_botones.add(btn_guardar);
        pnl_botones.add(btn_nuevo);
        gbc.gridx = 7;
        gbc.gridx = 8;
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

        pnlVenta.add(pnlMontos, BorderLayout.SOUTH);
        JPanel pnlPrincipal = new JPanel();
        pnlPrincipal.setLayout(new BorderLayout());

        tabb = new JTabbedPane();

        pnlPrincipal.add(tabb, BorderLayout.CENTER);
        tabb.add("PRODUCTOS", pnl);
        JScrollPane scrollCab = new JScrollPane(getPnlCab());
        tabb.add("GENERAL", scrollCab);
        tabb.setEnabledAt(1, false);
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
        pnlLeft.add(getPnlNorth(), BorderLayout.NORTH);
        pnlLeft.add(getPnlCenter(), BorderLayout.CENTER);
        JPanel pnlSouth = new JPanel();
        pnlSouth.setLayout(new BorderLayout());
        pnlLeft.add(pnlSouth, BorderLayout.SOUTH);
        pnlSouth.add(getPnlSouth(), BorderLayout.CENTER);
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
            //Date fechaActual = new Date(Main.fechaActualServer.getTime());
            //Calendar calendar = Calendar.getInstance();
            //calendar.setTime(fechaActual);
            //calendar.add(Calendar.DAY_OF_YEAR, );
            ((JTextFieldDateEditor) dc_femision.getDateEditor()).setInputVerifier(new VerificarEntreFechas(frm.getFechaInicio(), frm.getFechaFin()));
        } catch (Exception ex1) {
            ExceptionHandler.handleException(ex1, logger);
        }
        pnlDocumento.add(dc_femision, gbc);

        gbc.gridwidth = 1;
        gbc.gridx = 0;
        gbc.gridy = 0;
        JLabel lblCPago = new JLabel("C Pago");
        pnlFormaPago.add(lblCPago, gbc);

        gbc.gridx = 1;
        gbc.fill = GridBagConstraints.HORIZONTAL;
        gbc.gridwidth = 2;
        cboCondPago = new JComboBox();
        pnlFormaPago.add(cboCondPago, gbc);
        gbc.gridwidth = 1;

        gbc.gridx = 3;
        JLabel lblDias = new JLabel("T Dias");
        pnlFormaPago.add(lblDias, gbc);

        gbc.gridx = 4;
        txt_diaspago = new JTextField();
        txt_diaspago.setDocument(new IntegerDocument(3));
        txt_diaspago.setColumns(3);
        txt_diaspago.setEnabled(false);
        txt_diaspago.setInputVerifier(new VerificarEnteroMayorCero());
        pnlFormaPago.add(txt_diaspago, gbc);

        gbc.gridx = 5;
        JLabel lblVence = new JLabel("F Vence");
        pnlFormaPago.add(lblVence, gbc);

        gbc.gridx = 6;
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
        gbc.gridwidth = 2;
        pnlFormaPago.add(cbo_moneda, gbc);
        gbc.gridwidth = 1;

        gbc.gridx = 3;
        JLabel lblTCambio = new JLabel("T Cambio");
        pnlFormaPago.add(lblTCambio, gbc);

        gbc.gridx = 4;
        txt_tipocambio = new JTextField();
        //txt_tipocambio.setEditable(false);
        txt_tipocambio.setDocument(new DoubleDocument());
        pnlFormaPago.add(txt_tipocambio, gbc);
        gbc.fill = GridBagConstraints.NONE;

        gbc.gridx = 0;
        gbc.gridy = 2;
        JLabel lblTPago = new JLabel("T Pago");
        pnlFormaPago.add(lblTPago, gbc);

        gbc.gridx = 1;
        gbc.fill = GridBagConstraints.HORIZONTAL;
        cbo_mediopago = new JComboBox();
        gbc.gridwidth = 2;
        pnlFormaPago.add(cbo_mediopago, gbc);
        gbc.gridwidth = 1;

        gbc.gridx = 3;
        lblLetra = new JLabel("N° Letra");
        pnlFormaPago.add(lblLetra, gbc);
        lblLetra.setVisible(false);
        gbc.gridx = 4;
        gbc.gridwidth = 3;
        txtLetra = new JTextField();
        txtLetra.setColumns(15);
        txtLetra.setDocument(new UpperCaseNumberDocument(20));
        pnlFormaPago.add(txtLetra, gbc);
        txtLetra.setVisible(false);
        gbc.gridwidth = 1;

        gbc.gridy = 3;
        gbc.gridx = 0;
        lblGuia = new JLabel("Guia Remision");
        pnlFormaPago.add(lblGuia, gbc);

        gbc.gridx = 1;
        gbc.gridwidth = 2;
        txtNumGuia = new JTextField();
        txtNumGuia.setColumns(15);
        txtNumGuia.setDocument(new UpperCaseNumberDocument(50));
        pnlFormaPago.add(txtNumGuia, gbc);
        gbc.gridwidth = 1;

        gbc.gridx = 3;
        lblOc = new JLabel("N° OC");
        pnlFormaPago.add(lblOc, gbc);
        gbc.gridx = 4;
        gbc.gridwidth = 3;
        txtOc = new JTextField();
        txtOc.setColumns(15);
        txtOc.setDocument(new UpperCaseNumberDocument(20));
        pnlFormaPago.add(txtOc, gbc);
        gbc.gridwidth = 1;

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
        btn_cancelar.setToolTipText("Ruta Txt: " + Constans.PATH_DIRECT_TXT);
        btn_cancelar.setOpaque(false);
        pnlRecibo.add(btn_cancelar, gbc);
        gbc.gridx = 2;
        gbc.gridy = 2;
        btnVista = new JButton("Vista Previa", gif.PRINT16);
        btnVista.setOpaque(false);
        pnlRecibo.add(btnVista, gbc);
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

        txt_totalcobrar = new JTextField();
        txt_totalcobrar.setFont(new Font("Arial", 1, 12));
        txt_totalcobrar.setForeground(Color.RED);
        txt_totalcobrar.setEditable(false);
        txt_totalcobrar.setColumns(9);
        pnlSouth.add(txt_totalcobrar);

        return pnl;
    }

    private void initListener() {
        addKeyListener(this);
        addFocusListener(this);
        btnRefrescar.addActionListener(this);
        cboMoneda.addKeyListener(this);
        cboMoneda.addActionListener(this);
        cboMoneda.addItemListener(this);
        cbo_tipodocumento.addActionListener(this);
        cbo_tipodocumento.addKeyListener(this);
        cbo_serie.addActionListener(this);
        cbo_serie.addKeyListener(this);
        btn_agregar.addActionListener(this);
        btn_quitar.addActionListener(this);
        btn_guardar.addActionListener(this);
        btn_nuevo.addActionListener(this);

        btn_agregar.addKeyListener(this);
        btn_quitar.addKeyListener(this);
        btn_guardar.addKeyListener(this);
        btn_nuevo.addKeyListener(this);

        dc_femision.getJCalendar().addMouseListener(this);
        dc_femision.getJCalendar().addFocusListener(this);
        dc_femision.getJCalendar().addKeyListener(this);
        dc_femision.getCalendarButton().addMouseListener(this);
        dc_femision.getCalendarButton().addActionListener(this);
        dc_femision.addMouseListener(this);
        dc_femision.addKeyListener(this);
        dc_femision.addFocusListener(this);
        cboCondPago.addKeyListener(this);
        cboCondPago.addActionListener(this);
        txt_diaspago.addKeyListener(this);
        txt_diaspago.addActionListener(this);
        txt_diaspago.addFocusListener(this);
        chk_publicogeneral.addKeyListener(this);
        chk_publicogeneral.addActionListener(this);
        chk_publicogeneral.addItemListener(this);
        btn_buscarcliente.addActionListener(this);
        btn_buscarcliente.addKeyListener(this);
        btn_nuevocliente.addActionListener(this);
        btn_nuevocliente.addKeyListener(this);
        txt_cliente.addFocusListener(this);
        txt_cliente.addKeyListener(this);
        txt_rucreal.addFocusListener(this);
        txt_rucreal.addKeyListener(this);
        txt_recibo.addKeyListener(this);
        txt_recibo.addFocusListener(this);
        btnGuardar.addActionListener(this);
        btn_cancelar.addActionListener(this);
        eventListener();
        this.txt_preimpreso.addKeyListener(this);
        ((JTextFieldDateEditor) dc_femision.getDateEditor()).addKeyListener(this);
        this.txt_tipocambio.addKeyListener(this);
        this.cbo_mediopago.addKeyListener(this);
        this.cbo_mediopago.addItemListener(this);
        this.txt_idclientereal.addKeyListener(this);
        this.txt_direccionreal.addKeyListener(this);
        this.txt_vuelto.addKeyListener(this);
        this.cbo_idvendedor.addKeyListener(this);
        this.btnGuardar.addKeyListener(this);
        tabb.addChangeListener(this);
        btnVista.addActionListener(this);
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
        ((JTextFieldDateEditor) dc_femision.getDateEditor()).addFocusListener(new FocusListener() {
            @Override
            public void focusGained(FocusEvent e) {
            }

            @Override
            public void focusLost(FocusEvent e) {
                RnTipoCambio logTC = new RnTipoCambio(path);
                try {
                    dc_fvencimiento.setDate(dc_femision.getDate());
                    BeanTipoCambio bean = logTC.getBeanTipoCambio(new java.sql.Date(dc_femision.getDate().getTime()),
                            MonedaEnum.SOLES.getValue());
                    txt_tipocambio.setText(bean.getMontoventa().toString());
                    txt_diaspago.setText("0");
                    calcularpercepcion();
                } catch (Exception ex) {
                    try {
                        Date fechaEmision = new Date(Main.fechaActualServer.getTime());
                        dc_fvencimiento.setDate(fechaEmision);
                        BeanTipoCambio bean = logTC.getBeanTipoCambio(new java.sql.Date(fechaEmision.getTime()),
                                MonedaEnum.SOLES.getValue());
                        if (bean != null) {
                            txt_tipocambio.setText(bean.getMontoventa().toString());
                        } else {
                            txt_tipocambio.setText("0");
                        }
                        txt_diaspago.setText("0");
                        calcularpercepcion();
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
                calcFVenc();
            }
        });
        ((JTextField) dc_femision.getDateEditor()).registerKeyboardAction(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                cboCondPago.requestFocus();
                RnTipoCambio logTC = new RnTipoCambio(path);
                try {
                    dc_fvencimiento.setDate(dc_femision.getDate());
                    BeanTipoCambio bean = logTC.getBeanTipoCambio(new java.sql.Date(dc_femision.getDate().getTime()),
                            MonedaEnum.SOLES.getValue());
                    txt_tipocambio.setText(bean.getMontoventa().toString());
                    txt_diaspago.setText("0");
                } catch (Exception ex) {
                    try {
                        Date fechaEmision = new Date(Main.fechaActualServer.getTime());
                        dc_fvencimiento.setDate(fechaEmision);
                        BeanTipoCambio bean = logTC.getBeanTipoCambio(new java.sql.Date(fechaEmision.getTime()),
                                MonedaEnum.SOLES.getValue());
                        if (bean != null) {
                            txt_tipocambio.setText(bean.getMontoventa().toString());
                        } else {
                            txt_tipocambio.setText("0");
                        }
                        txt_diaspago.setText("0");
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
        }, KeyStroke.getKeyStroke(KeyEvent.VK_ENTER, 0, false), JComponent.WHEN_FOCUSED);
        ((JTextField) dc_femision.getDateEditor()).registerKeyboardAction(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                dc_femision.getCalendarButton().doClick();
            }
        }, KeyStroke.getKeyStroke(KeyEvent.VK_SPACE, 0, false), JComponent.WHEN_FOCUSED);
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
        if (txt_cliente == e.getSource()) {
            txt_cliente.selectAll();
        }

        if (txt_rucreal == e.getSource()) {
            txt_rucreal.selectAll();
        }

        if (txt_direccionreal == e.getSource()) {
            txt_direccionreal.selectAll();
        }
        if (txt_recibo == e.getSource()) {
            txt_recibo.selectAll();
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
            //cbo_precio.getEditor().setItem("0.0");
            setFechas();
            this.loadVendedor();
            chk_publicogeneral.setSelected(true);
            limpiarVenta();
        } catch (Exception e) {
            ExceptionHandler.handleException(e, logger);
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }

    private void loadVendedor() throws Exception {
        try {
            BeanVendedor vend = new BeanVendedor();
            String flags = cboCondPago.getSelectedItem().toString();
            if (flags.equals(CboCondPagoEnum.CREDITO.getValue())) {
                vend.setFLAG_CREDITO("S");
            } else {
                vend.setFLAG_CONTADO("S");
            }
            RnVendedor regla = new RnVendedor(path);
            listaV = regla.listarVendedor2(vend);

            cbo_idvendedor.removeAllItems();
            for (int i = 0; i < listaV.size(); i++) {
                cbo_idvendedor.addItem(listaV.get(i).getNOMBRES());
            }
            cbo_idvendedor.setSelectedItem("SIN VENDEDOR");
        } catch (Exception e) {
            throw e;
        }
    }

    private void loadCondPago() {
        cboCondPago.addItem(CboCondPagoEnum.CONTADO.getValue());
        cboCondPago.addItem(CboCondPagoEnum.CREDITO.getValue());
        cboCondPago.addItem(CboCondPagoEnum.TARJETA.getValue());
        cboCondPago.addItem(CboCondPagoEnum.OPERACION_BANCARIA.getValue());
    }

    private void cargarMoneda() throws Exception {
        try {
            xMoneda = new ArrayList();
            SingletonCombo singCombo = SingletonCombo.Instance(path);
            xMoneda.addAll(singCombo.getListMoneda());
            LoadCombo.loadMoneda(xMoneda, cbo_moneda);
            LoadCombo.loadMoneda(xMoneda, cboMoneda);
        } catch (Exception e) {
            throw e;
        }
    }

    private void limpiarVenta() {
        txt_iditem.setText("");
        txt_descripcion.setText("");
        txtNumGuia.setText("");
        txtOc.setText("");
        txtLetra.setText("");
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
            /*Calendar calendar = Calendar.getInstance();
            calendar.setTime(fechaEmision);
            calendar.add(Calendar.DAY_OF_YEAR, 2);*/
            dc_femision.setSelectableDateRange(frm.getFechaInicio(), frm.getFechaFin());
            RnTipoCambio logicTc = new RnTipoCambio(path);

            BeanTipoCambio tc = logicTc.getBeanTipoCambio(new java.sql.Date(dc_femision.getDate().getTime()), "00004");
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

    private BigDecimal getPrecioItem() {
        BigDecimal precio = new BigDecimal(cbo_precio.getSelectedItem().toString().trim());
        if (Constans.IS_PRECIO_INCLUYEIGV) {
            return precio;
        }
        BigDecimal mult;
        try {
            mult = BigDecimal.ONE.add(LoadDataGenerica.getPorcIgvDec(path, usuario));
        } catch (Exception e) {
            mult = new BigDecimal("1.18");
        }
        return precio.multiply(mult);
    }

    private boolean continueVentaMoneda(String monedaItem) {
        MonedaEnum monedaVenta = MonedaEnum.get(this.getIdMoneda());
        String mensaje = "El precio configurado de este producto esta en " + monedaItem
                + " y la venta esta en " + monedaVenta.name() + "\nDesea convertir a " + monedaVenta.name();
        return JOptionPane.showConfirmDialog(this, mensaje, "Alerta", JOptionPane.YES_NO_OPTION) == JOptionPane.YES_OPTION;
    }

    private void agregarItem(double num, boolean swButton) {
        BeanItem producto = mdl_producto.getItem(tbl_producto.convertRowIndexToModel(tbl_producto.getSelectedRow()));
        String idMonedaProd = producto.getComposicion();
        if (!idMonedaProd.equals(this.getIdMoneda())) {
            if (!this.continueVentaMoneda(producto.getMoneda(idMonedaProd))) {
                return;
            }
        }
        BigDecimal cantidad;
        if (Constans.SWCODEBARRA && !swButton) {
            cantidad = BigDecimal.ONE;
        } else {
            cantidad = new BigDecimal(txt_cantidad.getText().trim());
        }
        //BigDecimal precio = new BigDecimal(cbo_precio.getSelectedItem().toString().trim());
        BigDecimal precio = this.getPrecioItem();
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
                    procesoCargarAlmacen(false);
                }
                return;
            }
        }
        //Calcular
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
        beanRci.setPrecioMinimo(precio);
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
        beanRci.setFlagAutorizado("S");
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
            //registerTipoCambio();
            tabb.setEnabledAt(1, true);
            tabb.setSelectedIndex(1);
            calcularpercepcion();
            String idTipoDoc = "TI";
            for (int i = 0; i < xTipoDocVenta.size(); i++) {
                if (xTipoDocVenta.get(i).getIdTipoDoc().equals(idTipoDoc)) {
                    cbo_tipodocumento.setSelectedIndex(i);
                    break;
                } else {
                    cbo_tipodocumento.setSelectedIndex(0);
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

    private void calcularpercepcion() {
        if (!blnClickAceptar) {
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
                    if (xTipoDocVenta.get(cbo_tipodocumento.getSelectedIndex()).getIdTipoDoc().equals("01")) {
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
                    } else if (xTipoDocVenta.get(cbo_tipodocumento.getSelectedIndex()).getIdTipoDoc().equals("03")) {
                        BigDecimal valorPercepcion = paramValorPercepcion;//new BigDecimal("1500");
                        if (this.getIdMoneda().trim().equalsIgnoreCase(MonedaEnum.DOLARES.getValue())) {
                            try {
                                RnTipoCambio logicTc = new RnTipoCambio(path);
                                Date fechaEmision = new Date(dc_femision.getDate() == null
                                        ? Main.fechaActualServer.getTime() : dc_femision.getDate().getTime());
                                BeanTipoCambio tc = logicTc.getBeanTipoCambio(new java.sql.Date(fechaEmision.getTime()),
                                        "00004");
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
                BigDecimal valorAfecto = monto.subtract(m_igv);
                txt_afecto.setText(valorAfecto.toString());
                txt_noafecto.setText(m_noafecto.toString());
                txt_total.setText(monto.toString());
                BigDecimal valorRecibo = monto.add(m_percepcion);
                txt_recibo.setText(valorRecibo.toString());
                txt_percepcion.setText(m_percepcion.toString());
                BigDecimal valorCobrar = monto.add(m_percepcion);
                txt_totalcobrar.setText(valorCobrar.toString());
                txt_vuelto.setText("0.0");
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
            cbo_tipodocumento.removeAllItems();
            for (int i = 0; i < xTipoDocVenta.size(); i++) {
                if (xTipoDocVenta.get(i).getIdTipoDoc().equals("CO")) {
                    xTipoDocVenta.remove(i);
                }
                cbo_tipodocumento.addItem(xTipoDocVenta.get(i).getDescripcion());
            }

            if (xTipoDocVenta.size() > 0) {
                cbo_tipodocumento.setSelectedIndex(0);
                actualizarCorrelativo();
                mostrarPreimpreso();
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
            this.setPrecioToItem(lista);
            mdl_producto.agregarListItem(lista);
            tbl_producto.setAllColumnPreferredWidthNvo(5);
            cargarProductoPrecioAll();
            mdl_almacen.clearTable();
            tbl_almacen.setAllColumnPreferredWidthNvo(5);
        } catch (Exception e) {
            throw e;
        }
    }

    private void setPrecioToItem(List<BeanItem> listaItem) throws Exception {
        try {
            RnPreciosCab regla = new RnPreciosCab(path);
            List<BeanPrecioItem> listaPrecio = regla.listarPrecios(usuario.getCodempresa(), usuario.getCodlocalidad());
            for (BeanItem beanItem : listaItem) {
                beanItem.setBeanPrecioItem(this.getPrecioItem(listaPrecio, beanItem.getIdItem()));
            }
        } catch (Exception e) {
            throw e;
        }
    }

    private BeanPrecioItem getPrecioItem(List<BeanPrecioItem> listaPrecio, String idItem) {
        Iterator<BeanPrecioItem> i = listaPrecio.iterator();
        while (i.hasNext()) {
            BeanPrecioItem precio = i.next();
            if (precio.getIdItem().equals(idItem)) {
                return precio;
            }
        }
        return new BeanPrecioItem();
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
        if (cbo_precio.getItemCount() > 0) {
            cbo_precio.setSelectedIndex(0);
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
            this.cbo_tipodocumento.requestFocus();
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
            btn_nuevo.requestFocus();
            btn_nuevo.doClick();
            return;
        }

        if ((e.getSource() == txt_descripcion)
                || (e.getSource() == txt_iditem)) {
            filtrarTablaProducto(false);
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
                    filtrarTablaProducto(false);
                    this.addProductBarCode();
                }
            }

            if (e.getSource() == txt_cantidad) {
                cbo_precio.requestFocus();
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

    }

    private void procesoVerificar() {
        tbl_producto.editCellAt(-1, -1);
        tbl_venta.editCellAt(-1, -1);

        if (tbl_producto.getSelectedRow() == -1) {
            JOptionPane.showMessageDialog(frm, "Debe seleccionar el Item a agregar", "Seleccionar Item", JOptionPane.INFORMATION_MESSAGE);
        } else if ((txt_cantidad.getText().trim().length() > 0) && (Double.parseDouble(txt_cantidad.getText().trim()) > 0)) {
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
            try {
                cbo_precio.setSelectedIndex(1);
                cbo_precio.getEditor().setItem(cbo_precio.getSelectedItem());
            } catch (Exception ex) {
            }
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

    private void procesoCargarAlmacen(boolean isMoneda) {
        try {
            if (tbl_producto.getSelectedRow() < 0) {
                if (tbl_almacen.getRowCount() > 0) {
                    mdl_almacen.clearTable();
                }
                return;
            }
            String idItemTable = mdl_producto.getItem(tbl_producto.convertRowIndexToModel(tbl_producto.getSelectedRow())).getIdItem();
            if (idItemTable.equals(idItem) && !isMoneda) {
                return;
            }
            idItem = idItemTable;
            mdl_almacen.clearTable();
            RnStock regla = new RnStock(path);
            List<BeanStock> lista = regla.listarStockVentas(usuario.getCodempresa(), usuario.getCodpuntoventa(), mdl_producto.getItem(tbl_producto.convertRowIndexToModel(tbl_producto.getSelectedRow())).getIdItem(), usuario.getCodlocalidad(), "S");
            mdl_almacen.agregarListStock(lista);
            tbl_almacen.setAllColumnPreferredWidthNvo(5);
            cargarPrecios(mdl_producto.getItem(tbl_producto.convertRowIndexToModel(tbl_producto.getSelectedRow())).getIdItem());
            if (tbl_almacen.getRowCount() == 0) {
                return;
            }
            tbl_almacen.setRowSelectionInterval(0, 0);
            if (tbl_venta.getRowCount() == 0) {
                return;
            }
            String idAlmacen = mdl_venta.getRci(tbl_venta.getRowCount() - 1).getBeanAlmacen().getIdAlmacen();
            for (int i = 0; i < tbl_almacen.getRowCount(); i++) {
                if (idAlmacen.equals(mdl_almacen.getStock(i).getBeanAlmacen().getIdAlmacen())) {
                    tbl_almacen.setRowSelectionInterval(i, i);
                    break;
                }
            }
        } catch (Exception e) {
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
                procesoCargarAlmacen(false);
            }
        }
        if ((e.getSource() == txt_cliente && txt_cliente.getText().trim().length() == 0)
                || (e.getSource() == txt_rucreal && txt_rucreal.getText().trim().length() == 0)) {
            chk_publicogeneral.setSelected(false);
        }
        if (txt_recibo == e.getSource()) {
            if (txt_recibo.getText().length() > 0
                    && Character.isDigit(txt_recibo.getText().charAt(0))) {
                double vuelto = Double.valueOf(txt_recibo.getText().trim()) - Double.valueOf(txt_totalcobrar.getText().trim());
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
                procesoCargarAlmacen(false);
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
            procesoCargarAlmacen(false);
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
            limpiarVenta();
            setFechas();
            txt_descripcion.requestFocus();
            this.cargarTabla();
        } catch (Exception e) {
            ExceptionHandler.handleException(e, logger);
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }

    private void filtrarTablaProducto(boolean isMoneda) {
        modeloOrdenadoProducto.setRowFilter(getFilterProducto());
        tbl_producto.setAllColumnPreferredWidthNvo(5);
        if (tbl_producto.getRowCount() > 0) {
            tbl_producto.setRowSelectionInterval(0, 0);
            procesoCargarAlmacen(isMoneda);
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
        if (comp == btn_buscarcliente) {
            flag = true;
            Anexo a = new Anexo();
            a.setIdAnexo(valor.toString());
            cargarCliente(getClientes(a));
            chk_publicogeneral.setSelected((txt_cliente.getText().trim().equals("PUBLICO GENERAL")));
            flag = false;
        }
    }

    private void eventCondPago() throws Exception {
        try {
            if (cboCondPago.getItemCount() > 0) {
                txt_diaspago.setText("0");
                RnTipoCambio logTC = new RnTipoCambio(path);
                try {
                    dc_fvencimiento.setDate(dc_femision.getDate());
                    BeanTipoCambio bean = logTC.getBeanTipoCambio(new java.sql.Date(dc_femision.getDate().getTime()),
                            MonedaEnum.SOLES.getValue());
                    txt_tipocambio.setText(bean.getMontoventa().toString());
                } catch (Exception ex) {
                    try {
                        Date fechaEmision = new Date(Main.fechaActualServer.getTime());
                        dc_fvencimiento.setDate(fechaEmision);
                        BeanTipoCambio bean = logTC.getBeanTipoCambio(new java.sql.Date(fechaEmision.getTime()),
                                MonedaEnum.SOLES.getValue());
                        if (bean != null) {
                            txt_tipocambio.setText(bean.getMontoventa().toString());
                        } else {
                            txt_tipocambio.setText("0");
                        }
                    } catch (ClassNotFoundException ex1) {
                    } catch (InstantiationException ex1) {
                    } catch (IllegalAccessException ex1) {
                    } catch (Exception ex1) {
                    }
                }

                txt_diaspago.setEnabled(this.isEnabledDiasPago());
                this.loadMedioPago();
                id_tipo_operacion = this.getIdTipoOperacion();
                txt_diaspago.setText("0");
            }
        } catch (Exception e) {
            throw e;
        }
    }

    private String getIdTipoOperacion() throws Exception {
        try {
            RnTipoOperacion regla = new RnTipoOperacion(path);
            List<TipoOperacion> list = regla.listarTipoOperacion(this.getTipoOperacion());
            if (list.isEmpty()) {
                return "";
            }
            return list.get(0).getCodigo();
        } catch (Exception e) {
            throw e;
        }
    }

    private TipoOperacion getTipoOperacion() {
        TipoOperacion tipoOperacion = new TipoOperacion();
        tipoOperacion.setTasa_p(-1);
        tipoOperacion.setNumero(-1);
        tipoOperacion.setTasa_d(-1);
        tipoOperacion.setTasa(-1);
        tipoOperacion.setId_empresa(usuario.getCodempresa());
        tipoOperacion.setDescripcion(this.getDescripcionTipoOp());
        return tipoOperacion;
    }

    private String getDescripcionTipoOp() {
        if (this.getIdMoneda().equalsIgnoreCase(MonedaEnum.DOLARES.getValue())) {
            return cboCondPago.getSelectedItem().equals(CboCondPagoEnum.CREDITO.getValue()) ? "VENTA USD EN OFICINA CREDITO" : "VENTA USD EN OFICINA CONTADO";
        }
        return cboCondPago.getSelectedItem().equals(CboCondPagoEnum.CREDITO.getValue()) ? "VENTA MN EN OFICINA CREDITO" : "VENTA MN EN OFICINA CONTADO";
    }

    private void loadMedioPago() {
        cbo_mediopago.removeAllItems();
        cbo_mediopago.setEnabled(this.isEnabledMedioPago());
        if (cboCondPago.getSelectedItem().equals(CboCondPagoEnum.TARJETA.getValue())) {
            cbo_mediopago.addItem(new ObjectItem(TipoPagoEnum.TARJETA_VISA.getValue().getDescription(),
                    TipoPagoEnum.TARJETA_VISA.getValue().getId()));
            cbo_mediopago.addItem(new ObjectItem(TipoPagoEnum.TARJETA_MC_PROCESS.getValue().getDescription(),
                    TipoPagoEnum.TARJETA_MC_PROCESS.getValue().getId()));
            cbo_mediopago.addItem(new ObjectItem(TipoPagoEnum.TARJETA_DINNER.getValue().getDescription(),
                    TipoPagoEnum.TARJETA_DINNER.getValue().getId()));
        } else if (cboCondPago.getSelectedItem().equals(CboCondPagoEnum.CONTADO.getValue())) {
            cbo_mediopago.addItem(new ObjectItem(TipoPagoEnum.EFECTIVO.getValue().getDescription(),
                    TipoPagoEnum.EFECTIVO.getValue().getId()));
            cbo_mediopago.addItem(new ObjectItem(TipoPagoEnum.TRANSFERENCIA.getValue().getDescription(),
                    TipoPagoEnum.TRANSFERENCIA.getValue().getId()));
        } else if (cboCondPago.getSelectedItem().equals(CboCondPagoEnum.CREDITO.getValue())) {
            cbo_mediopago.addItem(new ObjectItem(TipoPagoEnum.EFECTIVO.getValue().getDescription(),
                    TipoPagoEnum.EFECTIVO.getValue().getId()));
            cbo_mediopago.addItem(new ObjectItem(TipoPagoEnum.LETRA.getValue().getDescription(),
                    TipoPagoEnum.LETRA.getValue().getId()));
            cbo_mediopago.addItem(new ObjectItem(TipoPagoEnum.FACTURA.getValue().getDescription(),
                    TipoPagoEnum.FACTURA.getValue().getId()));
        }
    }

    private boolean isEnabledMedioPago() {
        return cboCondPago.getSelectedItem().equals(CboCondPagoEnum.CONTADO.getValue())
                || cboCondPago.getSelectedItem().equals(CboCondPagoEnum.TARJETA.getValue())
                || cboCondPago.getSelectedItem().equals(CboCondPagoEnum.CREDITO.getValue());
    }

    private boolean isEnabledDiasPago() {
        return !(cboCondPago.getSelectedItem().equals(CboCondPagoEnum.CONTADO.getValue())
                || cboCondPago.getSelectedItem().equals(CboCondPagoEnum.TARJETA.getValue())
                || cboCondPago.getSelectedItem().equals(CboCondPagoEnum.OPERACION_BANCARIA.getValue()));
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
            BuscarCliente search = new BuscarCliente(frm, this, path, "ventaCosto");
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

    private boolean clienteValido(String opcion) {
        Anexo a = new Anexo();
        a.setNumerodoc(opcion.equals("1") ? txt_rucreal.getText().trim() : "");
        a.setDescripcion(opcion.equals("1") ? "" : txt_cliente.getText().trim());
        a.setIdEmpresa(usuario.getCodempresa());
        a.setIdTipoAnexo("2");

        List<Anexo> anexo = getClientes(a);

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
            BuscarCliente search = new BuscarCliente(frm, this, path, "ventaCosto");
            search.cargarTabla(a, btn_buscarcliente, 0);
            return false;
        }
    }

    private boolean cargarClienteValido(List<Anexo> reg) {
        numero = -1;

        if (reg != null && reg.size() > 0) {
            Anexo cliente = reg.get(0);

            txt_idclientereal.setText(cliente.getIdAnexo());
            txt_cliente.setText(cliente.getDescripcion());
            txt_rucreal.setText(cliente.getNumerodoc());
            txt_direccionreal.setText(cliente.getDireccion());

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
        }

        return false;
    }

    private void buscarCliente() {
        Anexo a = new Anexo();
        a.setIdEmpresa(usuario.getCodempresa());
        a.setIdTipoAnexo("2");
        a.setDescripcion("");
        a.setNumerodoc("");

        BuscarCliente search = new BuscarCliente(frm, this, path, "ventaCosto");
        search.cargarTabla(a, btn_buscarcliente, 0);
    }

    private boolean isRegisterValid() throws Exception {
        try {
            JTextField txt = new JTextField();
            cbo_tipodocumento.setBorder(txt.getBorder());
            cbo_serie.setBorder(txt.getBorder());
            txt_preimpreso.setBorder(txt.getBorder());
            dc_femision.setBorder(new JDateChooser().getBorder());
            cboCondPago.setBorder(txt.getBorder());
            cbo_moneda.setBorder(txt.getBorder());
            txt_diaspago.setBorder(txt.getBorder());
            txt_cliente.setBorder(txt.getBorder());
            txt_rucreal.setBorder(txt.getBorder());
            txt_trabajador.setBorder(txt.getBorder());
            txt_igv.setBorder(txt.getBorder());
            cbo_mediopago.setBorder(txt.getBorder());
            txt_recibo.setBorder(txt.getBorder());

            if (!(cbo_serie.getSelectedIndex() >= 0)) {
                JOptionPane.showMessageDialog(this, "Para generar un Documento, debes especificar su Serie.", "Datos incompletos.", JOptionPane.OK_OPTION);
                cbo_serie.setBorder(new LineBorder(Color.RED));
                cbo_serie.requestFocus();
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

            if (xTipoDocVenta.get(cbo_tipodocumento.getSelectedIndex()).getIdTipoDoc().equals("01")) {
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
            }

            if (xTipoDocVenta.get(cbo_tipodocumento.getSelectedIndex()).getIdTipoDoc().equals("03")) {
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

                BigDecimal valorPercepcion = paramValorPercepcion;//new BigDecimal("1500");//BigDecimal.valueOf(Double.valueOf(getParametro("MONTO BOLETA PERCEPCION", usuario.getCodempresa())).doubleValue());
                if (xMoneda.get(cbo_moneda.getSelectedIndex()).getIdMoneda().trim().equalsIgnoreCase("00004")) {
                    try {
                        RnTipoCambio logicTc = new RnTipoCambio(path);
                        Date fechaEmision = new Date(dc_femision.getDate() == null
                                ? Main.fechaActualServer.getTime() : dc_femision.getDate().getTime());
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
                }
            }

            if (txt_idclientereal.getText().trim().length() == 0) {
                JOptionPane.showMessageDialog(this, "Para generar un documento, debes especificar el Cliente - El registro no contiene codigo de cliente.", "Datos incompletos.", JOptionPane.OK_OPTION);
                btn_buscarcliente.requestFocus();
                return false;
            }

            if (cboCondPago.getSelectedItem().equals("CREDITO")) {
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
                    xTipoDocVenta.get(cbo_tipodocumento.getSelectedIndex()).getIdTipoDoc(),
                    cbo_serie.getSelectedItem().toString(), txt_preimpreso.getText().trim())) {
                JOptionPane.showMessageDialog(this, "DOCUMENTO YA SE ENCUENTRA REGISTRADO");
                return false;
            }

            if (txt_rucreal.getText().trim().length() == 0) {
                chk_publicogeneral.setSelected(true);
            } else if (txt_rucreal.getText().trim().length() > 0) {
                return clienteValido("1");
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
            BeanRptaVenta beanRptaVenta = logic.insertVentaResumen(beanRcc, xmlItem, xmlCta, null);
            logic.updateRccSeriePreimpresoGuia(beanRptaVenta.getIdRegconta(), beanRcc.getNumeroGuia());
            if (com.softcommerce.util.Constans.SWDESPACHO) {
                JOptionPane.showMessageDialog(this, this.getMsg(beanRptaVenta));
            }
            if (beanRcc.getLineaImpresion() >= 1) {
                this.imprimirDocumento(beanRcc, beanRptaVenta.getIdRegconta());
            }
            nuevo();
            tabb.setSelectedIndex(0);
        } catch (Exception e) {
            throw e;
        }
    }

    private String getMsg(BeanRptaVenta beanRptaVenta) {
        String msg = "Documento Generado: " + beanRptaVenta.getVoucher();
        return msg;
    }

    private String getXmlCuenta(Map<String, String> mapCta) throws Exception {
        try {
            Iterator<String> iterador = mapCta.keySet().iterator();
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
            //System.out.println("xmlCta = " + xmlCta);
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
            xmlItem += "<M_AFECTO>" + Util.getValorSeparadorDecimal(beanRci.getMafecto().toString()) + "</M_AFECTO>";
            xmlItem += "<M_NOAFECTO>" + Util.getValorSeparadorDecimal(beanRci.getMnoafecto().toString()) + "</M_NOAFECTO>";
            xmlItem += "<P_IGV>" + Util.getValorSeparadorDecimal(beanRci.getPigv().toString()) + "</P_IGV>";
            xmlItem += "<M_IGV>" + Util.getValorSeparadorDecimal(beanRci.getMigv().toString()) + "</M_IGV>";
            xmlItem += "<MONTO>" + Util.getValorSeparadorDecimal(beanRci.getMonto().toString()) + "</MONTO>";
            xmlItem += "<P_PERCEPCION>" + Util.getValorSeparadorDecimal(beanRci.getPpercepcion().toString()) + "</P_PERCEPCION>";
            xmlItem += "<M_PERCEPCION>" + Util.getValorSeparadorDecimal(beanRci.getMpercepcion().toString()) + "</M_PERCEPCION>";
            xmlItem += "<CANTIDAD>" + Util.getValorSeparadorDecimal(beanRci.getCantidad().toString()) + "</CANTIDAD>";
            xmlItem += "<ID_ALMACEN>" + beanRci.getBeanAlmacen().getIdAlmacen() + "</ID_ALMACEN>";
            xmlItem += "<PRECIO>" + Util.getValorSeparadorDecimal(beanRci.getPrecio().toString()) + "</PRECIO>";
            xmlItem += "<FLAG_AUTORIZADO>" + beanRci.getFlagAutorizado() + "</FLAG_AUTORIZADO>";
            xmlItem += "<ID_UM>" + beanRci.getBeanItem().getBeanUmStock().getIdUm() + "</ID_UM>";
            xmlItem += "<ID_COTIZACION_DET>" + beanRci.getId_cotizacion_det() + "</ID_COTIZACION_DET>";
            xmlItem += "<ID_PEDIDO_DET>" + beanRci.getId_pedido_det() + "</ID_PEDIDO_DET>";
            xmlItem += "</ITEM>";
            mapCta.put((xMoneda.get(cbo_moneda.getSelectedIndex()).getIdMoneda().equals(MonedaEnum.SOLES.getValue())
                    ? beanRci.getBeanItem().getCtaVta().trim() : beanRci.getBeanItem().getCtaVtaDolar().trim()), "");
        }
        xmlItem += "</ITEMS>";
        //System.out.println("xmlItem = " + xmlItem);
        logger.info("xmlItem = " + xmlItem);
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
        beanAnexo.setIdAnexo(txt_idclientereal.getText().trim());
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
        beanRcc.setIdCondicionVenta(this.getIdCondicionVenta());
        beanMoneda.setIdMoneda(xMoneda.get(cbo_moneda.getSelectedIndex()).getIdMoneda());
        beanRcc.setBeanMoneda(beanMoneda);
        beanTipoDocVenta.setIdTipoDoc(xTipoDocVenta.get(cbo_tipodocumento.getSelectedIndex()).getIdTipoDoc());
        beanRcc.setBeanTipoDocVenta(beanTipoDocVenta);
        beanRcc.setSerie(cbo_serie.getSelectedItem().toString());
        beanRcc.setPreimpreso(txt_preimpreso.getText().toLowerCase());
        beanAnexo.setDescripcion(this.txt_cliente.getText());
        beanAnexo.setDireccion(txt_direccionreal.getText().trim());
        beanAnexo.setNumero(txt_rucreal.getText().trim());
        beanRcc.setTipoCambio(new BigDecimal(txt_tipocambio.getText().trim().replace(",", "")));
        beanRcc.setBeanAnexo(beanAnexo);
        beanRcc.setAfecto(new BigDecimal(txt_afecto.getText().trim().replace(",", "")));
        beanRcc.setNoafecto(new BigDecimal(txt_noafecto.getText().trim().replace(",", "")));
        beanRcc.setPIgv(porcIgv);
        beanRcc.setMIgv(new BigDecimal(txt_igv.getText().trim().replace(",", "")));
        beanRcc.setMonto(new BigDecimal(txt_total.getText().trim().replace(",", "")));
        beanRcc.setPPercepcion(new BigDecimal(txt_percepcion.getText().trim().replace(",", "")).divide(new BigDecimal(txt_total.getText().trim().replace(",", "")), numeroDecimales, RoundingMode.HALF_UP));
        beanRcc.setMPercepcion(new BigDecimal(txt_percepcion.getText().trim().replace(",", "")));
        beanRcc.setFEmision(dc_femision.getDate());
        beanRcc.setFVencimiento(dc_fvencimiento.getDate());
        beanRcc.setIdAuxiliar(AuxiliarEnum.VENTA.getValue());
        beanRcc.setAnio(Util.getAnio(dc_femision.getDate()));
        beanRcc.setMes(Util.getMes(dc_femision.getDate()));
        beanRcc.setIdTipoOperacion(id_tipo_operacion);
        BeanEstadoDocumento beanEstadoDocumento = new BeanEstadoDocumento();
        beanEstadoDocumento.setIdEstado("003");
        beanRcc.setBeanEstadoDocumento(beanEstadoDocumento);
        beanRcc.setEstado("A");
        beanRcc.setIdTipoPago(this.getIdTipoPago());
        beanAnexoRef.setIdAnexo(txt_idclientereal.getText().trim());
        beanAnexoRef.setDescripcion(txt_cliente.getText().trim());
        beanAnexoRef.setDireccion(txt_direccionreal.getText().trim());
        beanAnexoRef.setNumero(txt_rucreal.getText().trim());
        beanRcc.setBeanAnexoRef(beanAnexoRef);
        beanRcc.setIdVendedor(listaV.get(cbo_idvendedor.getSelectedIndex()).getID_VENDEDOR());
        beanRcc.setIdUsuario(usuario.getId_usuario());
        beanRcc.setIdUsuarioAutoriza("");
        UsuarioCorrelativo userCorre = (UsuarioCorrelativo) xCorrelativo.get(cbo_serie.getSelectedIndex());
        beanRcc.setIdCorrelativo(userCorre.getIdCorrelativo());
        beanRcc.setLineaImpresion(userCorre.getLineaImpresion());
        beanRcc.setNumeroAutorizacion(txtOc.getText().trim());
        beanRcc.setCodigoMaquina(txtLetra.getText().trim());
        beanRcc.setNumeroGuia(txtNumGuia.getText().trim());
        return beanRcc;
    }

    private String getIdTipoPago() {
        if (cbo_mediopago.getItemCount() == 0) {
            return "";
        }
        ObjectItem obj = (ObjectItem) cbo_mediopago.getSelectedItem();
        return obj.getObjItem().toString();
    }

    private String getIdCondicionVenta() {
        String condicion = cboCondPago.getSelectedItem().toString().trim();
        if (condicion.equals(CboCondPagoEnum.CONTADO.getValue())) {
            return CondicionPagoEnum.CONTADO.getValue();
        }
        if (condicion.equals(CboCondPagoEnum.CREDITO.getValue())) {
            return CondicionPagoEnum.CREDITO.getValue();
        }
        if (condicion.equals(CboCondPagoEnum.OPERACION_BANCARIA.getValue())) {
            return "26";
        }
        return "27";
    }

    private void imprimirDocumento(BeanRegcontaCab beanRcc, String idRegconta) throws Exception {
        try {
            String idTipoDoc = xTipoDocVenta.get(cbo_tipodocumento.getSelectedIndex()).getIdTipoDoc();
            if (!Constans.ISIMPRESIONVENTA) {
                (new FactElectTxt(this.path, idRegconta, idTipoDoc, this.usuario)).exportTxt();
                return;
            }
            if (Util.isImpresionContinua(idTipoDoc)) {
                this.impresionContinua(idRegconta, idTipoDoc);
            } else {
                this.impresionNormal(beanRcc, idRegconta, idTipoDoc);
            }
        } catch (Exception e) {
            JOptionPane.showMessageDialog(null, e.getMessage());
        }
    }

    private void impresionContinua(String idRegconta, String idTipoDoc) throws Exception {
        try {
            int maxProduc = 0;
            if (idTipoDoc.equals(TipoDocVentaEnum.BOLETA.getValue())) {
                maxProduc = LoadDataGenerica.getMaxProdBoleta(path, usuario);
            }
            if (idTipoDoc.equals(TipoDocVentaEnum.FACTURA.getValue())) {
                maxProduc = LoadDataGenerica.getMaxProdFactura(path, usuario);
            }
            if (maxProduc == 0) {
                JOptionPane.showMessageDialog(null, "Configurar maximo de productos Boleta/Factura");
                return;
            }
            RptVenta rptVenta = new RptVenta(this.path, this.usuario);
            rptVenta.createReport(idRegconta, idTipoDoc, maxProduc, this.txt_cliente.getText());
        } catch (Exception e) {
            throw e;
        }
    }

    private void impresionNormal(BeanRegcontaCab beanRcc, String idRegconta, String idTipoDoc)
            throws Exception {
        try {
            String rutaJasper = Util.getRutaJasper(idTipoDoc);
            if (rutaJasper == null) {
                JOptionPane.showMessageDialog(this, "No se encuentra configurado reporte para " + cbo_tipodocumento.getSelectedItem());
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
            DataSourceVenta dataSource = new DataSourceVenta();
            for (int i = 0; i < mdl_venta.getRowCount(); i++) {
                BeanRegcontaItem beanRci = mdl_venta.getRci(i);
                beanRci.setBeanRegcontaCab(beanRcc);
                dataSource.add(beanRci);
            }
            exportar = new Exportar(parameters, dataSource, rutaJasper);
            exportar.vistaPrevia(false);
        } catch (Exception e) {
            throw e;
        }
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
        if (!this.swAutorizado()) {
            FormAutorizar formAutorizar = new FormAutorizar(frm, xCorrelativo.get(cbo_serie.getSelectedIndex()).getIdCorrelativo(), path);
            formAutorizar.setVisible(true);
            return formAutorizar.isSwAutorizar();
        }
        return true;
    }

    private boolean swAutorizado() {
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
        int xres = JOptionPane.showConfirmDialog(this, "Desea Generar el documento " + cbo_tipodocumento.getSelectedItem()
                + " N° " + cbo_serie.getSelectedItem() + "-" + txt_preimpreso.getText().trim(),
                "Generar Documento", JOptionPane.OK_CANCEL_OPTION);
        return xres == JOptionPane.OK_OPTION;
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

    /*public void registerTipoCambio() {
        try {
            RnTipoCambio reg = new RnTipoCambio(Main.path);
            BeanTipoCambio t = new BeanTipoCambio();
            t.setId_empresa(Main.usuario.getCodempresa());
            BeanMoneda beanMoneda = new BeanMoneda();
            beanMoneda.setId_moneda("00004");
            t.setBeanMoneda(beanMoneda);
            Main.fechaActualServer = this.getFechaServer();
            t.setFecha(new Date(Main.fechaActualServer.getTime()));
            boolean flagLocal = reg.getExisteTipoCambio(t);
            if (!flagLocal) {
                setCursor(new Cursor(Cursor.WAIT_CURSOR));
                BeanTipoCambio tc = new BeanTipoCambio();
                tc.setId_empresa(usuario.getCodempresa());
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
    }*/
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

    private void vistaPrevia() throws Exception {
        try {
            BeanRegcontaCab beanRcc = this.getRcc();
            String rutaJasper = Constans.PATH_RPT_VISTA_PREVIA;
            if (rutaJasper == null) {
                JOptionPane.showMessageDialog(this, "No se encuentra configurado reporte para " + cbo_tipodocumento.getSelectedItem());
                return;
            }
            Map parameters = new HashMap();
            ConvertNumberToLetter conv = new ConvertNumberToLetter();
            String montoLetras = conv.convertir(Double.parseDouble(beanRcc.getMonto().toString()), beanRcc.getBeanMoneda().getIdMoneda());
            parameters.put("P_NOMBRE_EMPRESA", usuario.getDescriempresa());
            parameters.put("P_DIRECCION_EMPRESA", usuario.getDireccion());
            parameters.put("P_RUC_EMPRESA", usuario.getRuc());
            parameters.put("P_TIPO_DOC", beanRcc.getBeanTipoDocVenta().getIdTipoDoc());
            parameters.put("MONTOLETRAS", montoLetras);
            parameters.put("NUM_OC", txtOc.getText().trim());
            parameters.put("NUM_LETRA", txtLetra.getText().trim());
            parameters.put("NUM_GUIA", txtNumGuia.getText().trim());
            parameters.put("ABREV_MONEDA", this.getAbrevMonedaRpt());
            parameters.put("CONDICION", this.getCondicionRpt());
            parameters.put(JRParameter.REPORT_LOCALE, Locale.US);
            Exportar exportar;
            DataSourceVenta dataSource = new DataSourceVenta();
            for (int i = 0; i < mdl_venta.getRowCount(); i++) {
                BeanRegcontaItem beanRci = mdl_venta.getRci(i);
                beanRci.setBeanRegcontaCab(beanRcc);
                dataSource.add(beanRci);
            }
            exportar = new Exportar(parameters, dataSource, rutaJasper);
            exportar.vistaPrevia(true);
        } catch (Exception e) {
            throw e;
        }
    }

    private String getCondicionRpt() {
        String condicion = cboCondPago.getSelectedItem().toString();
        if (cbo_mediopago.getItemCount() > 0) {
            condicion += " - " + cbo_mediopago.getSelectedItem().toString();
        }
        int dias = Integer.parseInt(txt_diaspago.getText());
        if (dias > 0) {
            condicion += " " + dias + " DIAS";
        }
        return condicion;
    }

    private String getAbrevMonedaRpt() {
        if (this.getIdMoneda().equals(MonedaEnum.SOLES.getValue())) {
            return "S/. ";
        }
        return "$ ";
    }

    @Override
    public void actionPerformed(ActionEvent e) {
        try {
            if (e.getSource().equals(btnVista)) {
                this.vistaPrevia();
            }
            if (cboCondPago == e.getSource()) {
                eventCondPago();
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

            if (e.getSource() == btn_nuevo) {
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
                filtrarTablaProducto(false);
            }
            if (cbo_tipodocumento == e.getSource()) {
                if (cbo_tipodocumento.getItemCount() > 0) {
                    actualizarCorrelativo();
                }
            }
            if (cbo_serie == e.getSource()) {
                if (cbo_serie.getItemCount() > 0) {
                    mostrarPreimpreso();
                }
            }
            if (txt_diaspago == e.getSource()) {
                calcFVenc();
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
        } catch (Exception ex) {
            ExceptionHandler.handleException(ex, logger);
            JOptionPane.showMessageDialog(this, ex.getMessage());
        }
    }

    private void actualizarCorrelativo() {
        try {
            cbo_serie.removeAllItems();
            txt_preimpreso.setText("0000000000");
            loadSerieCorrelativo(xTipoDocVenta.get(cbo_tipodocumento.getSelectedIndex()).getIdTipoDoc());
            String numDoc = txt_rucreal.getText();
            txt_rucreal.setDocument(cbo_tipodocumento.getSelectedItem().equals("FACTURA") ? (new IntegerDocument(11)) : (cbo_tipodocumento.getSelectedItem().equals("BOLETA") ? (new IntegerDocument(11)) : (new UpperCaseNumberDocument(20))));
            txt_rucreal.setText(numDoc);
            calcularpercepcion();
        } catch (Exception ex) {
            JOptionPane.showMessageDialog(null, "Error al cargar correlativo: /n" + ex.getMessage());
        }
    }

    private void mostrarPreimpreso() {
        if (xCorrelativo.size() > 0) {
            String preimpreso = xCorrelativo.get(cbo_serie.getSelectedIndex()).getPreimpreso();
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
            cbo_serie.removeAllItems();
            for (int i = 0; i < xCorrelativo.size(); i++) {
                cbo_serie.addItem(xCorrelativo.get(i).getSerie());
            }

            if (cbo_serie.getItemCount() > 0) {
                cbo_serie.setSelectedIndex(0);
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
        NumberFormat formatter = NumberFormat.getInstance(new Locale("en_US"));

        for (int i = 0; i < mdl_venta.getRowCount(); i++) {
            BeanRegcontaItem beanrci = mdl_venta.getRci(i);

            monto = monto.add(beanrci.getMonto());
            peso = peso.add(beanrci.getPesototal());
            noafectoPedido = noafectoPedido.add(beanrci.getMnoafecto());
            afecto = afecto.add(beanrci.getMafecto());
            descuentoPedido = new BigDecimal(BigInteger.ZERO);
            igvPedido = igvPedido.add(beanrci.getMigv());
            percepcionPedido = percepcionPedido.add(beanrci.getMpercepcion());
        }

        txtMonto.setText(FormatObject.formatNumber(formatter.format(monto.setScale(numeroDecimales, RoundingMode.HALF_UP)), 2));
        txtPesoTotal.setText(FormatObject.formatNumber(formatter.format(peso.setScale(numeroDecimales, RoundingMode.HALF_UP)), 2));
        txtIgv.setText(FormatObject.formatNumber(formatter.format(igvPedido.setScale(numeroDecimales, RoundingMode.HALF_UP)), 2));
        txtNoafecto.setText(FormatObject.formatNumber(formatter.format(noafectoPedido.setScale(numeroDecimales, RoundingMode.HALF_UP)), 2));
        txtAfecto.setText(FormatObject.formatNumber(formatter.format(afecto.setScale(numeroDecimales, RoundingMode.HALF_UP)), 2));
        txtPercepcion.setText(FormatObject.formatNumber(formatter.format(percepcionPedido.setScale(numeroDecimales, RoundingMode.HALF_UP)), 2));
        txtDescuento.setText(FormatObject.formatNumber(formatter.format(descuentoPedido.setScale(numeroDecimales, RoundingMode.HALF_UP)), 2));
    }

    private void loadPublicGeneral() {
        Anexo c = new Anexo();
        c.setNumerodoc("00000000");
        List<Anexo> an = getClientes(c);

        if ((an != null) && (an.size() > 0)) {
            cargarCliente(an);
        }
    }

    private void showPrecioMoneda() {
        if (this.getIdMoneda().equals(MonedaEnum.SOLES.getValue())) {
            tbl_producto.setVisibleColumn(9);
            tbl_producto.setVisibleColumn(10);
            tbl_producto.setVisibleColumn(11);
            tbl_producto.setNoVisibleColumn(12);
            tbl_producto.setNoVisibleColumn(13);
            tbl_producto.setNoVisibleColumn(14);
        } else {
            tbl_producto.setNoVisibleColumn(9);
            tbl_producto.setNoVisibleColumn(10);
            tbl_producto.setNoVisibleColumn(11);
            tbl_producto.setVisibleColumn(12);
            tbl_producto.setVisibleColumn(13);
            tbl_producto.setVisibleColumn(14);
        }
    }

    @Override
    public void itemStateChanged(ItemEvent e) {
        if (e.getSource().equals(cboMoneda)) {
            filtrarTablaProducto(true);
            cbo_precio.removeAllItems();
            cbo_precio.updateUI();
            cbo_moneda.setSelectedIndex(cboMoneda.getSelectedIndex());
            this.showPrecioMoneda();
        }
        if (e.getSource().equals(chk_publicogeneral)) {
            if (!flag) {
                if (chk_publicogeneral.isSelected()) {
                    loadPublicGeneral();
                } else {
                    txt_idclientereal.setText("");
                    txt_cliente.setText("");
                    txt_rucreal.setText("");
                    txt_direccionreal.setText("");
                }
            }
        }
        if (e.getSource().equals(cbo_mediopago)) {
            boolean sw = cbo_mediopago.getSelectedItem() == null ? false : cbo_mediopago.getSelectedItem().toString().equals("LETRA");
            lblLetra.setVisible(sw);
            txtLetra.setVisible(sw);
            if (!sw) {
                txtLetra.setText("");
            }
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
                txt_direccionreal.setText(cliente.getDireccion());
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
            }

            return false;
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, e.getMessage());
            return false;
        }
    }

    /*@Override
    public void valueChanged(ListSelectionEvent e) {
    }*/
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
    public void stateChanged(ChangeEvent e) {
        if (e.getSource() == tabb) {
            if (tabb.getSelectedIndex() == 0) {
                tabb.setEnabledAt(1, false);
            }
        }
    }

    public JTextField getTxt_descripcion() {
        return txt_descripcion;
    }

}
