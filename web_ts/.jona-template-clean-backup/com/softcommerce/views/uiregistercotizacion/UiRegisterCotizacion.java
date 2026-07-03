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

    protected JLabel TIPOOPERIGV = new JLabel("NORMAL");
    protected Main frm;
    protected JComboBox cboTipoOperIgv;
    protected Usuario beanUsuario;
    protected JCheckBox checkAutorizado;
    protected JComboBox cboMoneda;
    protected JTextField txt_descripcion;
    protected JTextField txt_iditem;
    protected JButton btn_buscar;
    protected JButton btnRefrescar;
    protected CButton btn_guardar;
    protected JButton btnGuardar;
    protected JButton btnCancelar;
    protected CButton btn_nuevo;
    protected CButton btn_agregar;
    protected JButton btn_quitar;
    protected TableModelItemVenta mdl_producto;
    protected TableRowSorter<TableModelItemVenta> modeloOrdenadoProducto;
    protected CTable tbl_producto;
    protected JTextField txt_cantidad;
    protected JComboBox cbo_precio;
    protected PrecioMinimo validPrecio;
    protected ComboBoxEditorPrecio editorPrecio;
    protected TableModelItemAlmacen mdl_almacen;
    protected CTable tbl_almacen;
    protected TableModelCotizacionDet mdl_venta;
    protected CTable tbl_venta;
    protected JTextField txtPesoTotal;
    protected JTextField txtPercepcion;
    protected JTextField txtAfecto;
    protected JTextField txtNoafecto;
    protected JTextField txtIgv;
    protected JTextField txtDescuento;
    protected JTextField txtMonto;
    protected List<BeanMoneda> xMoneda;
    protected Map<String, BeanPrecioItem> mapPrecio;
    protected ComboModelPrecio cboModelPrecio;
    protected java.net.URL path;
    protected JTabbedPane tabb;
    protected JComboBox cbo_tipodocumento;
    protected JComboBox cbo_serie;
    protected JTextField txt_preimpreso;
    protected JDateChooser dc_femision;
    protected JDateChooser dc_fvencimiento;
    protected JTextField txt_diaspago;
    protected JComboBox cbo_moneda;
    protected JTextField txt_tipocambio;
    protected JComboBox cbo_idvendedor;
    protected JTextField txt_idtrabajador;
    protected JTextField txt_trabajador;
    protected JTextField txt_valorventa;
    protected JTextField txt_descuento;
    protected JTextField txt_afecto;
    protected JTextField txt_noafecto;
    protected JTextField txt_igv;
    protected JTextField txt_total;
    protected boolean flag = false;
    protected JButton btn_buscarcliente;
    protected JButton btn_nuevocliente;
    protected Gif gif;
    protected JTextField txt_idclientereal;
    protected JTextField txt_cliente;
    protected JTextField txt_rucreal;
    protected JTextField txt_direccionreal;
    protected JComboBox cboModVta;
    protected JComboBox cboCondPago;
    protected List<UsuarioCorrelativo> xCorrelativo;
    protected boolean blnClickAceptar = false;
    protected List<BeanVendedor> xVendedor;
    //private int numero = -1;
    protected JTextField txtObser1;
    protected JTextField txtObser2;
    protected List<BeanBanco> xBanco;
    protected List<BeanEmpresaCuenta> xEmpresaCuenta;
    protected JComboBox cboMonedaCta;
    protected JComboBox cboBanco;
    protected JComboBox cboCuenta;
    protected JButton btnAgregarCuenta;
    protected CTable tableCuenta;
    protected EmpresaCuentaTableModel modeltableCuenta;
    protected String id_item = "";
    protected int numeroDecimales;
    protected JCheckBox chk_publicogeneral;

    public UiRegisterCotizacion(Main frm, String title, Usuario usuario, java.net.URL path) {
        super(title);
        this.frm = frm;
        this.beanUsuario = usuario;
        this.path = path;
        inicialize();
        initListener();
    }

    protected void inicialize() {
    }

    protected JPanel getPnlCab() {
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

    protected JPanel getPnlNorth() {
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

    protected JPanel getPnlCenter() {
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

    protected JPanel getPnlSouth() {
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

    protected JPanel getPnlOtrosDatos() {
        JPanel pnl = new JPanel();
        pnl.setLayout(new BorderLayout());
        pnl.add(getPnlObserv(), BorderLayout.NORTH);
        pnl.add(getPnlEmpresaCta(), BorderLayout.CENTER);
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

    protected JPanel getPnlEmpresaCta() {
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
    }

    protected void buscarCliente() {
    }

    protected void nuevoCliente() {
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

    protected boolean clienteValido(String opcion) {
        return false;
    }

    protected boolean cargarClienteValido(List<Anexo> reg) {
        return false;
    }

    protected boolean cargarCliente(List<Anexo> reg) {
        return false;
    }

    protected void initListener() {
    }

    protected void loadTipoDocumento() throws Exception {
    }

    public void selectInternalFrame() {
        try {
            setSelected(true);
        } catch (PropertyVetoException e) {
        }
    }

    protected void loadVendedor() {
    }

    protected String getParametroSistema(String idParametro) {
        return null;
    }

    public void cargarDatos() {
    }

    protected void cargarTabla() throws Exception {
    }

    protected void cargarProductoPrecioAll() throws Exception {
    }

    protected void filtrarTablaProducto() {
    }

    protected void procesoCargarAlmacen() {
    }

    protected void cargarPrecios(String id_item) {
    }

    protected void calcularpercepcion() {
    }

    protected RowFilter getFilterProducto() {
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

    protected void mostrarPreimpreso() {
    }

    protected void limpiarVenta() {
    }

    protected void cargarMoneda() throws Exception {
    }

    protected void loadBanco() throws Exception {
    }

    protected void loadCuenta() throws Exception {
    }

    protected void valorCodItem() {
    }

    protected void procesoVerificar() {
    }

    protected void procesoAgregar() {
    }
    
    protected BigDecimal getPrecioItem() {
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

    protected void agregarItem(double num) throws CloneNotSupportedException {
    }

    protected boolean verificarMoneda(String idMoneda) {
        return false;
    }

    protected boolean verificarItemPercepcion(String perc) {
        return false;
    }

    protected boolean verificarCliente(String opcion) {
        return false;
    }

    protected List<Anexo> Clientes(Anexo c) {
        return null;
    }

    protected void loadSerieCorrelativo(String ls_IdTipoDoc) {
    }

    protected void generarCot() {
    }

    protected boolean isRegisterValid() {
        return false;
    }

    protected void guardarDocumento() {
    }

    protected BeanCotizacionCab getCotizacionCab() throws Exception {
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

    protected void insertDocumento() throws Exception {
    }

    protected void insertarCuenta() {
    }

    protected boolean verificarCuenta(String id_cuenta) {
        return false;
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

    protected void guardarVentaF5() {
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

    protected void setFechas() {
        dc_femision.setDate(new Date());
        dc_fvencimiento.setDate(new Date());
        dc_femision.setSelectableDateRange(frm.getFechaInicio(), new Date());
    }

    protected void calcularImportes() {
    }

    protected void nuevo() {
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

    protected void changeTipoOperIgv() {
        String actualTipoOperIgv = this.cboTipoOperIgv.getSelectedItem().toString();
        if (!actualTipoOperIgv.equalsIgnoreCase(TIPOOPERIGV.getText()) && (actualTipoOperIgv.equalsIgnoreCase("EXPORTACION") || actualTipoOperIgv.equalsIgnoreCase("EXONERADA"))) {
            this.limpiarVenta();
        } else if (!actualTipoOperIgv.equalsIgnoreCase(TIPOOPERIGV.getText()) && (TIPOOPERIGV.getText().equalsIgnoreCase("EXPORTACION") || TIPOOPERIGV.getText().equalsIgnoreCase("EXONERADA")) && (actualTipoOperIgv.equalsIgnoreCase("NORMAL") || actualTipoOperIgv.equalsIgnoreCase("GRATUITA"))) {
            this.limpiarVenta();
        }
        TIPOOPERIGV.setText(this.cboTipoOperIgv.getSelectedItem().toString());
    }
}
