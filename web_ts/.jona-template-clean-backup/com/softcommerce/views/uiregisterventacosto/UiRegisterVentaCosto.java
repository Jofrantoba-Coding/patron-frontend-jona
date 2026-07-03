package com.softcommerce.views.uiregisterventacosto;


import com.softcommerce.formularios.*;
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

public class UiRegisterVentaCosto
        extends JInternalFrame
        implements InterUiRegisterVentaCosto, KeyListener, ActionListener, MouseListener, FocusListener,
        TableModelListener, ItemListener,
        ChangeListener {

    protected final Logger logger = Logger.getLogger(UiRegisterVentaCosto.class);
    private static final long serialVersionUID = 1L;
    protected Main frm;
    protected JComboBox cbo_precio;
    protected JComboBox cboMoneda;
    protected CButton btn_guardar;
    protected CButton btn_nuevo;
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
    protected Usuario usuario;
    protected java.net.URL path;
    protected ComboModelPrecio cboModelPrecio;
    protected JTextField txtPesoTotal;
    protected Map<String, BeanPrecioItem> mapPrecio;
    protected BigDecimal porcIgv;
    protected int maxProd;
    protected BigDecimal paramValorBoletaDNI;
    protected BigDecimal paramValorPercepcion;
    protected int numeroDecimales;
    protected String idItem = "";
    protected List<BeanMoneda> xMoneda;
    protected JTabbedPane tabb;
    protected JComboBox cbo_tipodocumento;
    protected JComboBox cbo_serie;
    protected JTextField txt_preimpreso;
    protected JDateChooser dc_femision;
    protected JTextField txt_diaspago;
    protected JDateChooser dc_fvencimiento;
    protected JComboBox cboCondPago;
    protected JTextField txt_tipocambio;
    protected JComboBox cbo_moneda;
    protected JComboBox cbo_mediopago;
    protected JCheckBox chk_publicogeneral;
    protected JButton btn_nuevocliente;
    protected JTextField txt_idclientereal;
    protected JTextField txt_direccionreal;
    protected JButton btn_buscarcliente;
    protected Gif gif;
    protected JTextField txt_cliente;
    protected JTextField txt_rucreal;
    protected JTextField txt_recibo;
    protected JTextField txt_vuelto;
    protected JButton btn_cancelar;
    protected JButton btnGuardar;
    protected JButton btnVista;
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
    protected JTextField txt_totalcobrar;
    protected List<BeanTipoDocVenta> xTipoDocVenta;
    protected boolean blnClickAceptar = false;
    protected int numero = -1;
    protected List<UsuarioCorrelativo> xCorrelativo;
    protected List<BeanVendedor> listaV;
    protected String id_tipo_operacion;
    protected boolean flag = false;
    protected JLabel lblLetra;
    protected JTextField txtLetra;
    protected JLabel lblOc;
    protected JTextField txtOc;
    protected JLabel lblGuia;
    protected JTextField txtNumGuia;

    public UiRegisterVentaCosto(Main frm, String title, Usuario usuario, java.net.URL path) {
        super(title);
        this.path = path;
        this.frm = frm;
        this.usuario = usuario;
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

    protected void initListener() {
    }

    protected List<Anexo> getClientes(Anexo c) {
        return null;
    }

    protected void eventListener() {
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

    protected void loadVendedor() throws Exception {
    }

    protected void loadCondPago() {
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

    protected BigDecimal getPrecioItem() {
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

    protected boolean continueVentaMoneda(String monedaItem) {
        return false;
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

    protected void setPrecioToItem(List<BeanItem> listaItem) throws Exception {
    }

    protected BeanPrecioItem getPrecioItem(List<BeanPrecioItem> listaPrecio, String idItem) {
        Iterator<BeanPrecioItem> i = listaPrecio.iterator();
        while (i.hasNext()) {
            BeanPrecioItem precio = i.next();
            if (precio.getIdItem().equals(idItem)) {
                return precio;
            }
        }
        return new BeanPrecioItem();
    }

    protected void cargarProductoPrecioAll() throws Exception {
    }

    protected void cargarPrecios(String id_item) {
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

    protected void procesoCargarAlmacen(boolean isMoneda) {
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

    protected void nuevo() {
    }

    protected void filtrarTablaProducto(boolean isMoneda) {
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

    protected void eventCondPago() throws Exception {
    }

    protected String getIdTipoOperacion() throws Exception {
        return null;
    }

    protected TipoOperacion getTipoOperacion() {
        TipoOperacion tipoOperacion = new TipoOperacion();
        tipoOperacion.setTasa_p(-1);
        tipoOperacion.setNumero(-1);
        tipoOperacion.setTasa_d(-1);
        tipoOperacion.setTasa(-1);
        tipoOperacion.setId_empresa(usuario.getCodempresa());
        tipoOperacion.setDescripcion(this.getDescripcionTipoOp());
        return tipoOperacion;
    }

    protected String getDescripcionTipoOp() {
        if (this.getIdMoneda().equalsIgnoreCase(MonedaEnum.DOLARES.getValue())) {
            return cboCondPago.getSelectedItem().equals(CboCondPagoEnum.CREDITO.getValue()) ? "VENTA USD EN OFICINA CREDITO" : "VENTA USD EN OFICINA CONTADO";
        }
        return cboCondPago.getSelectedItem().equals(CboCondPagoEnum.CREDITO.getValue()) ? "VENTA MN EN OFICINA CREDITO" : "VENTA MN EN OFICINA CONTADO";
    }

    protected void loadMedioPago() {
    }

    protected boolean isEnabledMedioPago() {
        return cboCondPago.getSelectedItem().equals(CboCondPagoEnum.CONTADO.getValue())
                || cboCondPago.getSelectedItem().equals(CboCondPagoEnum.TARJETA.getValue())
                || cboCondPago.getSelectedItem().equals(CboCondPagoEnum.CREDITO.getValue());
    }

    protected boolean isEnabledDiasPago() {
        return !(cboCondPago.getSelectedItem().equals(CboCondPagoEnum.CONTADO.getValue())
                || cboCondPago.getSelectedItem().equals(CboCondPagoEnum.TARJETA.getValue())
                || cboCondPago.getSelectedItem().equals(CboCondPagoEnum.OPERACION_BANCARIA.getValue()));
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

    protected boolean clienteValido(String opcion) {
        return false;
    }

    protected boolean cargarClienteValido(List<Anexo> reg) {
        return false;
    }

    protected void buscarCliente() {
    }

    protected boolean isRegisterValid() throws Exception {
        return false;
    }

    protected void insertDocumento() throws Exception {
    }

    protected String getMsg(BeanRptaVenta beanRptaVenta) {
        String msg = "Documento Generado: " + beanRptaVenta.getVoucher();
        return msg;
    }

    protected String getXmlCuenta(Map<String, String> mapCta) throws Exception {
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

    protected String getXmlItem(Map<String, String> mapCta) {
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

    protected String getIdTipoPago() {
        if (cbo_mediopago.getItemCount() == 0) {
            return "";
        }
        ObjectItem obj = (ObjectItem) cbo_mediopago.getSelectedItem();
        return obj.getObjItem().toString();
    }

    protected String getIdCondicionVenta() {
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

    protected void imprimirDocumento(BeanRegcontaCab beanRcc, String idRegconta) throws Exception {
    }

    protected void impresionContinua(String idRegconta, String idTipoDoc) throws Exception {
    }

    protected void impresionNormal(BeanRegcontaCab beanRcc, String idRegconta, String idTipoDoc)
            throws Exception {
    }

    protected String getHoraImpresion(String idTipoDoc, String idRegconta) {
        return null;
    }

    protected void guardarDocumento() {
    }

    protected void validateDocumento() throws Exception {
    }

    protected boolean swAutorizarDocumento() {
        if (!this.swAutorizado()) {
            FormAutorizar formAutorizar = new FormAutorizar(frm, xCorrelativo.get(cbo_serie.getSelectedIndex()).getIdCorrelativo(), path);
            formAutorizar.setVisible(true);
            return formAutorizar.isSwAutorizar();
        }
        return true;
    }

    protected boolean swAutorizado() {
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

    protected void guardarVentaF5() {
    }    /*public void registerTipoCambio() {
    }*/

    protected void vistaPrevia() throws Exception {
    }

    protected String getCondicionRpt() {
        return null;
    }

    protected String getAbrevMonedaRpt() {
        return null;
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

    protected void actualizarCorrelativo() {
    }

    protected void mostrarPreimpreso() {
    }

    protected void loadSerieCorrelativo(String ls_IdTipoDoc) throws Exception {
    }

    protected void calcularImportes() {
    }

    protected void loadPublicGeneral() {
    }

    protected void showPrecioMoneda() {
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

    protected boolean cargarCliente(List<Anexo> reg) {
        return false;
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
