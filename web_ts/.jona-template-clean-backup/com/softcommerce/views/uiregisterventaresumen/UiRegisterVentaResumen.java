package com.softcommerce.views.uiregisterventaresumen;


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
import com.softcommerce.general.tablas.TableModelItemAlmacen;
import com.softcommerce.general.tablas.TableModelItemVenta;
import com.softcommerce.general.tablas.TableModelRegcontaItem;
import com.softcommerce.iconos.Gif;
import com.softcommerce.logic.LogicConfiguracion;
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
import com.softcommerce.report.ConvertNumberToLetter;
import com.softcommerce.util.editor.CellEditorCbAlmacen;
import com.softcommerce.util.render.CellRenderer;
import com.softcommerce.util.editor.ComboBoxEditorPrecio;
import com.softcommerce.util.Constans;
import com.softcommerce.util.ExceptionHandler;
import com.softcommerce.util.Exportar;
import com.softcommerce.util.FEtxt;
import com.softcommerce.util.FormatObject;
import com.softcommerce.util.LayoutUtil;
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
import javax.swing.event.ListSelectionEvent;
import javax.swing.event.ListSelectionListener;
import javax.swing.event.TableModelEvent;
import javax.swing.event.TableModelListener;
import javax.swing.table.TableRowSorter;
import javax.swing.text.JTextComponent;
import net.sf.jasperreports.engine.JRParameter;
import java.net.URL;
import javax.swing.event.DocumentEvent;
import javax.swing.event.DocumentListener;
import org.apache.log4j.Logger;

public class UiRegisterVentaResumen
        extends JInternalFrame
        implements InterUiRegisterVentaResumen, KeyListener, ActionListener, ListSelectionListener, MouseListener, FocusListener,
        TableModelListener, ItemListener,
        ChangeListener, DocumentListener {

    private static final long serialVersionUID = 1L;
    protected final Main frm;
    protected JComboBox cboTipoOperIgv;
    protected JComboBox cboPrecio;
    protected JComboBox cboMoneda;
    protected CButton btn_guardar;
    protected CButton btn_nuevo;
    protected JButton btnBuscar;
    protected JButton btnRefrescar;
    protected CButton btn_agregar;
    protected CButton btn_quitar;
    protected JTable tbl_venta;
    protected TableModelRegcontaItem mdlVenta;
    protected CTable tblProducto;
    protected TableModelItemVenta mdlProducto;
    protected TableRowSorter<TableModelItemVenta> modeloOrdenadoProducto;
    protected CTable tblAlmacen;
    protected TableModelItemAlmacen mdlAlmacen;
    protected JTextField txt_descripcion;
    protected JTextField txtClienteItem;
    protected JTextField txt_iditem;
    protected JTextField txtMaximoProductos;
    protected JTextField txtAfecto;
    protected JTextField txtNoafecto;
    protected JTextField txtMontoInafecto = new JTextField(BigDecimal.ZERO.toString());
    protected JTextField txtMontoExonerado = new JTextField(BigDecimal.ZERO.toString());
    protected JTextField txtIgv;
    protected JTextField txtDescuento;
    protected JTextField txtMonto;
    protected JTextField txtPercepcion;
    protected JTextField txt_cantidad;
    protected final Usuario usuario;
    protected final URL path;
    protected ComboBoxEditorPrecio editorPrecio;
    protected ComboModelPrecio cboModelPrecio;
    protected final CuadroMensaje cuadro;
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
    protected JComboBox cboSerie;
    protected JTextField txtPreimpreso;
    protected JTextField txtSerieOc;
    protected JTextField txtPreimpresoOc;
    protected JTextField txtSerieGuia;
    protected JTextField txtPreimpresoGuia;
    protected JDateChooser dc_femision;
    protected JTextField txt_diaspago;
    protected JDateChooser dc_fvencimiento;
    protected JComboBox cboCondPago;
    protected JTextField txt_tipocambio;
    protected JComboBox cbo_moneda;
    protected JComboBox cbo_mediopago;
    protected JCheckBox chk_publicogeneral;
    protected JButton btnNuevoCliente;
    protected JTextField txtIdCliente;
    protected JTextField txtDireccion;
    protected JButton btnBuscarcliente;
    protected Gif gif;
    protected JTextField txtCliente;
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
    protected final Logger logger = Logger.getLogger(UiRegisterVentaResumen.class);
    protected JTextField txtObservacion;
    protected JLabel TIPOOPERIGV = new JLabel("NORMAL");

    public UiRegisterVentaResumen(Main frm, String title, Usuario usuario, URL path) {
        super(title);
        cuadro = new CuadroMensaje(usuario);
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
        dc_femision = new JDateChooser("dd/MM/yyyy", "##/##/####", '_');
        try {
            Date fechaActual = new Date();
            ((JTextFieldDateEditor) dc_femision.getDateEditor()).setInputVerifier(new VerificarEntreFechas(frm.getFechaInicio(), fechaActual));
        } catch (Exception ex1) {
            System.out.println("ex1 = " + ex1.getMessage());
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
        txt_tipocambio.setEditable(false);
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
        gbc.fill = GridBagConstraints.NONE;

        gbc.gridy = 3;
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
        return pnl;
    }

    protected JPanel getPnlCenter() {
        JPanel pnl = new JPanel();
        pnl.setLayout(new BorderLayout());
        JPanel pnlWest = new JPanel();
        pnlWest.setLayout(new BorderLayout());
        pnlWest.setBorder(BorderFactory.createTitledBorder(null, "", TitledBorder.LEFT, TitledBorder.DEFAULT_POSITION, new Font("Comic Sans MS", 0, 12), Color.BLACK));
        pnl.add(pnlWest, BorderLayout.WEST);
        pnlWest.add(this.getPnlCliente(), BorderLayout.CENTER);
        pnlWest.add(this.getPnlOpcionesCliente(), BorderLayout.NORTH);
        pnl.add(this.getPnlRecibo(), BorderLayout.CENTER);
        return pnl;
    }

    protected JPanel getPnlCliente() {
        JPanel pnlCliente = new JPanel();
        pnlCliente.setLayout(new GridBagLayout());
        GridBagConstraints gbc = LayoutUtil.getGbc();
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
        txtDireccion = new JTextField();
        txtDireccion.setDocument(new UpperCaseNumberDocument(300));
        pnlCliente.add(txtDireccion, gbc);
        gbc.gridwidth = 1;

        JLabel lblObservacion = new JLabel("Observacion");
        lblObservacion.setFont(new Font("Arial", 0, 11));

        txtObservacion = new JTextField();
        txtObservacion.setDocument(new UpperCaseNumberDocument(300));
        if (Constans.IS_ADICIONALES_VENTA) {
            gbc.gridx = 0;
            gbc.gridy = 2;
            pnlCliente.add(lblObservacion, gbc);
            gbc.gridx = 1;
            gbc.gridwidth = 4;
            gbc.fill = GridBagConstraints.HORIZONTAL;
            pnlCliente.add(txtObservacion, gbc);
            gbc.gridwidth = 1;
        }
        return pnlCliente;
    }

    protected JPanel getPnlOpcionesCliente() {
        JPanel pnlOpc = new JPanel(new FlowLayout(FlowLayout.LEFT, 5, 5));
        chk_publicogeneral = new JCheckBox("PUBLICO GENERAL");
        chk_publicogeneral.setOpaque(false);
        pnlOpc.add(chk_publicogeneral);

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

        btnNuevoCliente = new JButton(gif.ADDORANGE);
        btnNuevoCliente.setToolTipText("Nuevo");
        btnNuevoCliente.setFocusPainted(false);
        pnlOpc.add(this.btnNuevoCliente);
        return pnlOpc;
    }

    protected JPanel getPnlRecibo() {
        JPanel pnlRecibo = new JPanel();
        pnlRecibo.setLayout(new GridBagLayout());
        GridBagConstraints gbc = LayoutUtil.getGbc();
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
        gbc.gridx = 2;
        gbc.gridy = 2;
        btnVista = new JButton("Vista Previa", gif.PRINT16);
        btnVista.setOpaque(false);
        pnlRecibo.add(btnVista, gbc);
        return pnlRecibo;
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
        if (e.getSource() instanceof JTextField) {
            ((JTextField) e.getSource()).selectAll();
        }
        if (((JTextFieldDateEditor) dc_femision.getDateEditor()) == e.getSource()) {
            ((JTextFieldDateEditor) dc_femision.getDateEditor()).selectAll();
        }
        if (e.getSource() == cboPrecio.getEditor().getEditorComponent()) {
            cboPrecio.getEditor().selectAll();
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
        if (e.getSource().equals(txtPreimpresoGuia)) {
            if (!Util.isBlank(txtPreimpresoGuia.getText().trim())) {
                txtPreimpresoGuia.setText(Util.getValueRelleno(txtPreimpresoGuia.getText(), Constans.DIG_PREIMPRESO));
            }
        }
        if (e.getSource().equals(txtPreimpresoOc)) {
            if (!Util.isBlank(txtPreimpresoOc.getText().trim())) {
                txtPreimpresoOc.setText(Util.getValueRelleno(txtPreimpresoOc.getText(), Constans.DIG_PREIMPRESO));
            }
        }
    }

    public void cargarDatos() {
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
        BigDecimal precio = new BigDecimal(cboPrecio.getSelectedItem().toString().trim());
        if (Constans.IS_PRECIO_INCLUYEIGV) {
            return precio;
        }
        if (this.cboTipoOperIgv.getSelectedItem().toString().equalsIgnoreCase("INAFECTO_MUESTRA_MEDICA")
                || this.cboTipoOperIgv.getSelectedItem().toString().equalsIgnoreCase("EXPORTACION")
                || this.cboTipoOperIgv.getSelectedItem().toString().equalsIgnoreCase("EXONERADA")) {
            return precio;
        }
        BeanItem productoNew = mdlProducto.getItem(tblProducto.convertRowIndexToModel(tblProducto.getSelectedRow()));
        if (!productoNew.getTipoOperacionIgv().equalsIgnoreCase("AFECTO")) {
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

    protected void agregarItem(double num) {
    }

    protected ComboModelAlmacen getComboModelAlmacen(BeanAlmacen beanAlmacen) {
        mdlAlmacen.getData();
        ArrayList<BeanAlmacen> listAlmacen = new ArrayList();
        for (BeanStock stock : mdlAlmacen.getData()) {
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

        if (KeyEvent.VK_CONTROL == e.getKeyCode() && tabb.getSelectedIndex() == 0) {
            tblProducto.editCellAt(-1, -1);
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
            tblProducto.editCellAt(-1, -1);
            tbl_venta.editCellAt(-1, -1);
            btn_quitar.requestFocus();
            btn_quitar.doClick();
            return;
        }

        if (e.getKeyCode() == KeyEvent.VK_F8) {
            tblProducto.editCellAt(-1, -1);
            tbl_venta.editCellAt(-1, -1);
            btn_agregar.requestFocus();
            btn_agregar.doClick();
            return;
        }

        if (e.getKeyCode() == KeyEvent.VK_F6) {
            tblProducto.editCellAt(-1, -1);
            tbl_venta.editCellAt(-1, -1);
            btn_nuevo.requestFocus();
            btn_nuevo.doClick();
            return;
        }

        if ((e.getSource() == txt_descripcion)
                || (e.getSource() == txt_iditem) || (e.getSource() == txtClienteItem)) {
            filtrarTablaProducto();
            if (e.getKeyChar() == '\n') {
                tblProducto.requestFocus();
            }
        }

        if (e.getKeyChar() == '\n') {
            if (e.getSource() == cboMoneda) {
                btnBuscar.requestFocus();
            }

            if ((e.getSource() == txt_descripcion)
                    || (e.getSource() == txt_iditem)) {
                if (txt_iditem.getText().trim().length() > 0) {
                    valorCodItem();
                    filtrarTablaProducto();
                }
            }

            if (e.getSource() == txt_cantidad) {
                cboPrecio.getEditor().getEditorComponent().requestFocus();
            }

            if (e.getSource() == cboPrecio.getEditor().getEditorComponent()) {
            }
            if (e.getSource() == txtCliente) {
                if (txtCliente.getText().trim().length() > 0) {
                    verificarCliente("2");
                } else {
                    txt_rucreal.requestFocus();
                }
            }

            if (e.getSource() == txt_rucreal) {
                if (txt_rucreal.getText().trim().length() > 0) {
                    verificarCliente("1");
                } else {
                    txtDireccion.requestFocus();
                }
            }

        }

    }

    protected void procesoVerificar() {
    }

    protected int getMaximoProductos() {
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

    protected void procesoCargarAlmacen() {
    }

    @Override
    public void keyReleased(KeyEvent e) {
        if ((e.getKeyCode() == KeyEvent.VK_DOWN)
                || (e.getKeyCode() == KeyEvent.VK_UP)
                || (e.getKeyCode() == KeyEvent.VK_PAGE_DOWN)
                || (e.getKeyCode() == KeyEvent.VK_PAGE_UP)) {
            tblProducto.editCellAt(-1, -1);
            tbl_venta.editCellAt(-1, -1);

            if (e.getSource() == tblProducto) {
                procesoCargarAlmacen();
            }
        }
        if ((e.getSource() == txtCliente && txtCliente.getText().trim().length() == 0)
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
            tblProducto.editCellAt(-1, -1);
            tbl_venta.editCellAt(-1, -1);

            if (e.getSource() == tblProducto) {
                procesoCargarAlmacen();
            }
        }

        if (e.getClickCount() == 2) {
            tblProducto.editCellAt(-1, -1);
            tbl_venta.editCellAt(-1, -1);

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
        if (e.getSource().equals(dc_femision.getCalendarButton())) {
            ((JTextField) dc_femision.getDateEditor()).requestFocus();
        }
    }

    @Override
    public void mouseReleased(MouseEvent e) {
        if (e.getSource() == tblProducto) {
            tbl_venta.editCellAt(-1, -1);
            procesoCargarAlmacen();
        }

        if (e.getSource() == tbl_venta) {
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
        if (txt_iditem.getText().trim().length() > 0) {
            filters.add(RowFilter.regexFilter(".*" + txt_iditem.getText().trim() + ".*", 0));
        }
        if (txt_descripcion.getText().trim().length() > 0) {
            filters.add(RowFilter.regexFilter(".*" + txt_descripcion.getText().trim() + ".*", 1));
        }
        if (txtClienteItem.getText().trim().length() > 0) {
            filters.add(RowFilter.regexFilter(".*" + txtClienteItem.getText().trim() + ".*", 16));
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
                || cboCondPago.getSelectedItem().equals(CboCondPagoEnum.TARJETA.getValue());
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

    protected BeanRegcontaAdicional getRccAdicional() {
        if (!Constans.IS_ADICIONALES_VENTA) {
            return null;
        }
        BeanRegcontaAdicional bean = new BeanRegcontaAdicional();
        bean.setSerieOc(txtSerieOc.getText().trim());
        bean.setPreimpresoOc(txtPreimpresoOc.getText().trim());
        bean.setSerieGuia(txtSerieGuia.getText().trim());
        bean.setPreimpresoGuia(txtPreimpresoGuia.getText().trim());
        bean.setObservacion(txtObservacion.getText().trim());
        return bean;
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
        beanRcc.setSerie(cboSerie.getSelectedItem().toString());
        beanRcc.setPreimpreso(txtPreimpreso.getText().toLowerCase());
        beanAnexo.setDescripcion(this.txtCliente.getText());
        beanAnexo.setDireccion(txtDireccion.getText().trim());
        beanAnexo.setNumero(txt_rucreal.getText().trim());
        beanRcc.setTipoCambio(new BigDecimal(txt_tipocambio.getText().trim()));
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
        beanAnexoRef.setIdAnexo(txtIdCliente.getText().trim());
        beanAnexoRef.setDescripcion(txtCliente.getText().trim());
        beanAnexoRef.setDireccion(txtDireccion.getText().trim());
        beanAnexoRef.setNumero(txt_rucreal.getText().trim());
        beanRcc.setBeanAnexoRef(beanAnexoRef);
        beanRcc.setIdVendedor(listaV.get(cbo_idvendedor.getSelectedIndex()).getID_VENDEDOR());
        beanRcc.setIdUsuario(usuario.getId_usuario());
        beanRcc.setIdUsuarioAutoriza("");
        beanRcc.setTipoOperacionIgv(TIPOOPERIGV.getText());
        UsuarioCorrelativo userCorre = (UsuarioCorrelativo) xCorrelativo.get(cboSerie.getSelectedIndex());
        beanRcc.setIdCorrelativo(userCorre.getIdCorrelativo());
        beanRcc.setLineaImpresion(userCorre.getLineaImpresion());
        UsuarioCorrelativo uCorrelativo = this.getUsuarioCorrelativo();
        beanRcc.setNumeroAutorizacion(uCorrelativo != null ? uCorrelativo.getNumeroAutorizacion() : "");
        beanRcc.setCodigoMaquina(uCorrelativo != null ? uCorrelativo.getCodigoMaquina() : "");
        return beanRcc;
    }

    protected String getIdTipoPago() {
        if (cbo_mediopago.getItemCount() == 0) {
            return "";
        }
        if (cbo_mediopago.getSelectedItem().equals("EFECTIVO MN")) {
            return "001";
        }
        if (cbo_mediopago.getSelectedItem().equals("TARJETA DINNER")) {
            return "004";
        }
        if (cbo_mediopago.getSelectedItem().equals("TARJETA MC PROCESS")) {
            return "005";
        }
        if (cbo_mediopago.getSelectedItem().equals("TARJETA VISA")) {
            return "002";
        }
        return "";
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

    protected UsuarioCorrelativo getUsuarioCorrelativo() {
        if (cboSerie.getSelectedIndex() >= 0) {
            return xCorrelativo.get(cboSerie.getSelectedIndex());
        }
        return null;
    }

    protected void imprimirDocumento(BeanRegcontaCab beanRcc, String idRegconta) throws Exception {
    }

    protected void exportarTxt(String idTipoDoc, BeanRegcontaCab beanRcc) throws Exception {
    }

    protected String getNameFile(String idTipoDoc, BeanRegcontaCab beanRcc) {
        return this.usuario.getRuc() + "-" + idTipoDoc + "-" + beanRcc.getSerie() + "-" + beanRcc.getPreimpreso8Digs();
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

    protected boolean pregDocumento() {
        return false;
    }

    protected void guardarVentaF5() {
    }

    public void registerTipoCambio() {
    }

    protected java.sql.Date getFechaServer() throws InstantiationException, IllegalAccessException, Exception {
        return null;
    }

    protected void vistaPrevia() throws Exception {
    }

    protected String getNumReferencia(JTextField txtSerieRef, JTextField txtPreimpresoRef) {
        if (Util.isBlank(txtSerieRef.getText()) && Util.isBlank(txtPreimpresoRef.getText())) {
            return "";
        }
        if (Util.isBlank(txtPreimpresoRef.getText())) {
            return "";
        }
        return txtSerieRef.getText().trim() + "-" + txtPreimpresoRef.getText().trim();
    }

    protected String getCondicionRpt() {
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

    protected String getAbrevMonedaRpt() {
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
                        mdlVenta.eliminarRci(tbl_venta.convertRowIndexToModel(tbl_venta.getSelectedRow()));
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

            if (e.getSource() == btnBuscar) {
                filtrarTablaProducto();
            }
            if (cbo_tipodocumento == e.getSource()) {
                if (cbo_tipodocumento.getItemCount() > 0) {
                    actualizarCorrelativo();
                }
            }
            if (cboSerie == e.getSource()) {
                if (cboSerie.getItemCount() > 0) {
                    mostrarPreimpreso();
                }
            }
            if (txt_diaspago == e.getSource()) {
                calcFVenc();
            }
            if (btnBuscarcliente == e.getSource()) {
                buscarCliente();
            }
            if (btnNuevoCliente == e.getSource()) {
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

    protected void changeTipoOperIgv() {
        this.limpiarVenta();
        TIPOOPERIGV.setText(this.cboTipoOperIgv.getSelectedItem().toString());
    }

    protected void loadPublicGeneral() {
    }

    @Override
    public void itemStateChanged(ItemEvent e) {
        if (e.getSource().equals(cboTipoOperIgv)) {
            changeTipoOperIgv();
        }
        if (e.getSource().equals(cboMoneda)) {
            filtrarTablaProducto();
            cboPrecio.removeAllItems();
            cboPrecio.updateUI();
            cbo_moneda.setSelectedIndex(cboMoneda.getSelectedIndex());
        }
        if (e.getSource().equals(chk_publicogeneral)) {
            if (!flag) {
                if (chk_publicogeneral.isSelected()) {
                    loadPublicGeneral();
                } else {
                    txtIdCliente.setText("");
                    txtCliente.setText("");
                    txt_rucreal.setText("");
                    txtDireccion.setText("");
                }
            }
        }
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

    protected void loadCondicionPagoCliente() throws Exception {
    }

    @Override
    public void insertUpdate(DocumentEvent e) {
        try {
            if (e.getDocument().equals(txtIdCliente.getDocument())) {
                this.loadCondicionPagoCliente();
            }
        } catch (Exception ex) {
            ExceptionHandler.handleException(ex, logger);
            JOptionPane.showMessageDialog(this, ex.getMessage());
        }
    }

    @Override
    public void removeUpdate(DocumentEvent e) {
    }

    @Override
    public void changedUpdate(DocumentEvent e) {
    }

}
