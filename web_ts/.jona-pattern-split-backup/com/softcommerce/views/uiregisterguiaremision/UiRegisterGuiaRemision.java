package com.softcommerce.views.uiregisterguiaremision;

import com.softcommerce.views.uipaneltfguiaremision.UiPanelTFGuiaRemision;


import com.softcommerce.formularios.*;
import com.softcommerce.beans.Almacen;
import com.softcommerce.beans.Anexo;
import com.softcommerce.beans.BeanAlmacen;
import com.softcommerce.beans.BeanAnexo;
import com.softcommerce.beans.BeanGuiaReporte;
import com.softcommerce.beans.BeanItem;
import com.softcommerce.beans.MotivoTraslado;
import com.softcommerce.beans.ContaItem;
import com.softcommerce.beans.PuntoVenta;
import com.softcommerce.beans.ContaCab;
import com.softcommerce.beans.RegContaCab;
import com.softcommerce.beans.SolicitudDevolucion;
import com.softcommerce.beans.Usuario;
import com.softcommerce.beans.UsuarioCorrelativo;
import com.softcommerce.beans.BeanVehiculo;
import com.softcommerce.beans.Lote;
import com.softcommerce.compras.formularios.FormBuscarItem;
import com.softcommerce.conta.formularios.FormBuscarAnexo;
import com.softcommerce.datasource.DataSourceGuia;
import com.softcommerce.entity.ControlDoc;
import com.softcommerce.enums.MotivoTrasladoEnum;
import com.softcommerce.enums.TipoDocVentaEnum;
import com.toedter.calendar.JDateChooser;
import com.softcommerce.general.controles.JHInternal;
import com.softcommerce.general.controles.CTable;
import com.softcommerce.general.controles.DigitTextFieldCellEditor;
import com.softcommerce.general.controles.EnumClass;
import com.softcommerce.general.controles.ObjectItem;
import com.softcommerce.general.controles.UpperCaseNumberDocument;
import com.softcommerce.iconos.Gif;
import com.softcommerce.general.controles.Register;
import java.awt.BorderLayout;
import java.awt.Color;
import java.awt.Component;
import java.awt.Cursor;
import java.awt.Dimension;
import java.awt.Font;
import java.awt.Toolkit;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.FocusEvent;
import java.awt.event.FocusListener;
import java.awt.event.ItemEvent;
import java.awt.event.ItemListener;
import java.awt.event.KeyEvent;
import java.awt.event.KeyListener;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import javax.swing.BorderFactory;
import javax.swing.JButton;
import javax.swing.JCheckBox;
import javax.swing.JComboBox;
import javax.swing.JComponent;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import javax.swing.JTabbedPane;
import javax.swing.JTextField;
import javax.swing.JToolBar;
import javax.swing.KeyStroke;
import javax.swing.SwingConstants;
import javax.swing.border.Border;
import javax.swing.border.LineBorder;
import javax.swing.border.TitledBorder;
import com.softcommerce.reglasnegocio.RnAlmacen;
import com.softcommerce.reglasnegocio.RnAnexo;
import com.softcommerce.reglasnegocio.RnMotivoTraslado;
import com.softcommerce.reglasnegocio.RnPuntoVenta;
import com.softcommerce.reglasnegocio.RnRegContaCab;
import com.softcommerce.reglasnegocio.RnCorrelativo;
import com.softcommerce.report.Reporte;
import com.softcommerce.general.tablas.GuiaDevolucionProveedorTableModel;
import com.softcommerce.general.tablas.GuiaVentaTableModel;
import com.softcommerce.general.tablas.GuiaTransferenciaTableModel;
import com.softcommerce.general.herramientas.DateTime;
import com.softcommerce.logic.LogicConfigItemAlmacen;
import com.softcommerce.logic.LogicControlDoc;
import com.softcommerce.logic.LogicLote;
import com.softcommerce.logic.LogicSolicitudDev;
import com.softcommerce.logic.LogicStock;
import com.softcommerce.reglasnegocio.RnConsultas;
import com.softcommerce.reglasnegocio.RnMovInventarioCab;
import com.softcommerce.reglasnegocio.RnPeriodoMensual;
import com.softcommerce.util.editor.CellEditorBtnLoteSalida;
import com.softcommerce.util.editor.CellEditorBtnLoteTransferencia;
import com.softcommerce.util.editor.CellEditorBtnLoteVenta;
import com.softcommerce.util.render.CellRenderer;
import com.softcommerce.util.Constans;
import com.softcommerce.util.ExceptionHandler;
import com.softcommerce.util.Exportar;
import com.softcommerce.util.FactElectTxt;
import com.softcommerce.util.FormatObject;
import com.softcommerce.util.FxTipoDocVenta;
import com.softcommerce.util.LayoutUtil;
import com.softcommerce.util.Util;
import java.awt.CardLayout;
import java.awt.FlowLayout;
import java.awt.GridBagConstraints;
import java.awt.GridBagLayout;
import java.math.BigDecimal;
import java.util.Calendar;
import java.util.GregorianCalendar;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Locale;
import java.util.Map;
import javax.swing.JScrollPane;
import net.sf.jasperreports.engine.JRParameter;
import org.apache.log4j.Logger;

public class UiRegisterGuiaRemision
        extends JHInternal
        implements InterUiRegisterGuiaRemision, ActionListener, ItemListener, KeyListener, FocusListener {

    private JTextField txtTipoDoc;
    private JTextField txtTipoDocDesc;
    private JTextField txtDireccionllegada;
    private JTextField txtIdanexo;
    private JTextField txtIdTipoDocRef;
    private JTextField txtCliente;
    private JTextField txtRucCliente;
    private JLabel lblReferencia;
    private JTextField txtIdSolicitud;
    private JTextField txtIdRegconta;
    private JTextField txtSerieRegconta;
    private JTextField txtPreimpresoRegconta;
    private JTextField txtIdtransportista;
    private JTextField txtRucTransportista;
    private JTextField txtTransportista;
    private JTextField txtMarcacarro;
    private JTextField txtIdlocalidadllegada;
    private JTextField txtConductor;
    private JTextField txtIdconductor;
    private JTextField txtPlacacarro;
    private JTextField txtNumerolicencia;
    private JTextField txtConstanciainscripcion;
    private JTextField txtModelocarro;
    private JTextField txtIdvehiculo;
    private JTextField txtIdestado;
    private JTextField txtIdMovimientoOrigen;
    private JTextField txtIdMovimientoDestino;
    private JTextField txtSerieSol;
    private JTextField txtPreimpresoSol;
    private JTextField txtPreimpreso;
    private JTextField txtMigv;
    private JTextField txtAfecto;
    private JTextField txtNoafecto;
    private JTextField txtMonto;
    private JTextField txtMpercepcion;
    private JTextField txtFlagigv;
    private JTextField txtTipocambio;
    private JTextField txtIdmoneda;
    private JCheckBox chkSeleccionar;
    private JButton btnBuscarTransp;
    private JButton btnQuitarItem;
    private JButton btnAgregarItem;
    private JButton btnNuevoTransportista;
    private JButton btnNuevoConductor;
    private JButton btnBuscarConductor;
    private JButton btnBuscar;
    private JLabel lblRegconta;
    private JComboBox cboMotivoTraslado;
    private List<MotivoTraslado> xMotivotraslado;
    private JComboBox cboSerie;
    private JTextField txtSerie;
    private JComboBox cboAlmacenPartida;
    private List<Almacen> xAlmacenPartida;
    private JComboBox cboAlmacenLlegada;
    private List<Almacen> xAlmacenLlegada;
    private JComboBox cboPuntoVenta;
    private List<PuntoVenta> xpuntoventa;
    private final Usuario usuario;
    private CTable tbltransferencia;
    private CTable tblTransLote;
    private CTable tblVenta;
    private CTable tblDevolucion;
    private GuiaTransferenciaTableModel mdlGuiaTransferencia;
    private GuiaTransferenciaTableModel mdlGuiaTransLote;
    private GuiaVentaTableModel mdlGuiaVenta;
    private GuiaDevolucionProveedorTableModel modelTblDevolucionProveedor;
    public static CellEditorBtnLoteSalida editorDevolucion;
    public static CellEditorBtnLoteSalida editorTransferencia;
    public static CellEditorBtnLoteTransferencia editorTransLote;
    private JDateChooser dcFechaEmision;
    private JDateChooser dcFechatraslado;
    private final UiPanelTFGuiaRemision pnltf;
    private final JFrame frm;
    private String idTipoAnexo = null;
    private JTextField txtAlmacen = null;
    private JTextField txtIdAlmacen = null;
    private String idSolicitud;
    private Gif gif;
    private CardLayout cardLayout;
    private JPanel pnlTable;
    private final Logger logger = Logger.getLogger(UiRegisterGuiaRemision.class);
    private CellEditorBtnLoteVenta editorLote;
    private JPanel pnlTransportista;
    private JLabel lblBuscarDocumento;
    private JCheckBox chkSinTransporte;

    public UiRegisterGuiaRemision(UiPanelTFGuiaRemision pnltf, String title, Usuario usuario, JFrame frm) {
        this.usuario = usuario;
        this.frm = frm;
        this.pnltf = pnltf;
        inicialize();
    }

    private void inicialize() {
        super.pnlRegister.setPreferredSize(new Dimension(1100, 485));
        gif = new Gif();
        JPanel pnlDialog = new JPanel(new BorderLayout());
        pnlDialog.setBackground(new Color(245, 245, 245));
        pnlDialog.add(this.getPnlNorth(), BorderLayout.NORTH);
        pnlDialog.add(this.getTabbedPane(), BorderLayout.CENTER);

        txtMigv = new JTextField();
        txtAfecto = new JTextField();
        txtNoafecto = new JTextField();
        txtMonto = new JTextField();
        txtMpercepcion = new JTextField();
        txtFlagigv = new JTextField();
        txtTipocambio = new JTextField();
        txtIdmoneda = new JTextField();

        txtIdMovimientoDestino = new JTextField();
        txtIdMovimientoOrigen = new JTextField();
        setRegister(pnlDialog);
        this.initListener();
        this.pack();
        super.setLocation(((Toolkit.getDefaultToolkit().getScreenSize().width - getSize().width) / 2), (Toolkit.getDefaultToolkit().getScreenSize().height - getSize().height) / 20);
    }

    private void initListener() {
        btnQuitarItem.addActionListener(this);
        btnAgregarItem.addActionListener(this);
        cboMotivoTraslado.addItemListener(this);
        btnBuscar.addFocusListener(this);
        btnBuscar.addActionListener(this);
        btnBuscar.addKeyListener(this);
        btnBuscar.registerKeyboardAction(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                dcFechaEmision.requestFocus();
            }
        }, KeyStroke.getKeyStroke(KeyEvent.VK_ENTER, 0, false), JComponent.WHEN_FOCUSED);
        txtIdSolicitud.addKeyListener(this);
        txtIdSolicitud.addFocusListener(this);
        txtSerieSol.addFocusListener(this);
        txtPreimpresoSol.addKeyListener(this);
        txtPreimpresoSol.addFocusListener(this);
        txtIdRegconta.addKeyListener(this);
        txtIdRegconta.addFocusListener(this);
        txtSerieRegconta.addKeyListener(this);
        txtSerieRegconta.addFocusListener(this);
        txtPreimpresoRegconta.addKeyListener(this);
        txtPreimpresoRegconta.addFocusListener(this);
        cboSerie.addItemListener(this);
        txtPreimpreso.addKeyListener(this);
        txtPreimpreso.addFocusListener(this);
        dcFechaEmision.getJCalendar().addFocusListener(this);
        dcFechaEmision.getJCalendar().addKeyListener(this);
        dcFechaEmision.getCalendarButton().addActionListener(this);
        dcFechaEmision.addKeyListener(this);
        dcFechaEmision.addFocusListener(this);
        dcFechatraslado.getJCalendar().addFocusListener(this);
        dcFechatraslado.getJCalendar().addKeyListener(this);
        dcFechatraslado.getCalendarButton().addActionListener(this);
        dcFechatraslado.addKeyListener(this);
        dcFechatraslado.addFocusListener(this);
        txtAlmacen.addKeyListener(this);
        txtAlmacen.addActionListener(this);
        txtIdAlmacen.addKeyListener(this);
        txtIdAlmacen.addActionListener(this);
        cboAlmacenPartida.addItemListener(this);
        cboPuntoVenta.addActionListener(this);
        cboPuntoVenta.addKeyListener(this);
        cboAlmacenLlegada.addItemListener(this);
        txtDireccionllegada.addFocusListener(this);
        txtDireccionllegada.addKeyListener(this);
        txtCliente.addFocusListener(this);
        txtCliente.addFocusListener(this);
        txtCliente.addKeyListener(this);
        txtRucCliente.addFocusListener(this);
        txtRucCliente.addKeyListener(this);
        txtTransportista.addFocusListener(this);
        txtTransportista.addFocusListener(this);
        txtTransportista.addKeyListener(this);
        txtRucTransportista.addFocusListener(this);
        txtRucTransportista.addKeyListener(this);
        btnBuscarTransp.addActionListener(this);
        btnBuscarTransp.addKeyListener(this);
        btnBuscarTransp.registerKeyboardAction(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                txtRucCliente.requestFocus();
            }
        }, KeyStroke.getKeyStroke(KeyEvent.VK_ENTER, 0, false), JComponent.WHEN_FOCUSED);
        btnNuevoTransportista.addActionListener(this);
        btnNuevoTransportista.addKeyListener(this);
        btnNuevoTransportista.setFocusPainted(false);
        btnNuevoTransportista.registerKeyboardAction(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                txtRucCliente.requestFocus();
            }
        }, KeyStroke.getKeyStroke(KeyEvent.VK_ENTER, 0, false), JComponent.WHEN_FOCUSED);
        txtPlacacarro.addFocusListener(this);
        txtPlacacarro.addKeyListener(this);
        txtMarcacarro.addFocusListener(this);
        txtMarcacarro.addKeyListener(this);
        txtConstanciainscripcion.addFocusListener(this);
        txtConstanciainscripcion.addKeyListener(this);
        txtConductor.addFocusListener(this);
        txtConductor.addKeyListener(this);
        btnBuscarConductor.addActionListener(this);
        btnBuscarConductor.addKeyListener(this);
        btnBuscarConductor.registerKeyboardAction(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                txtRucCliente.requestFocus();
            }
        }, KeyStroke.getKeyStroke(KeyEvent.VK_ENTER, 0, false), JComponent.WHEN_FOCUSED);
        btnNuevoConductor.addActionListener(this);
        btnNuevoConductor.addKeyListener(this);
        btnNuevoConductor.registerKeyboardAction(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                txtRucCliente.requestFocus();
            }
        }, KeyStroke.getKeyStroke(KeyEvent.VK_ENTER, 0, false), JComponent.WHEN_FOCUSED);
        txtNumerolicencia.addFocusListener(this);
        txtNumerolicencia.addKeyListener(this);
    }

    private JPanel getPnlCenter() {
        JPanel pnlPrinc = new JPanel(new BorderLayout());
        pnlPrinc.add(this.getPnlDatos(), BorderLayout.WEST);
        pnlTransportista = this.getPnlTransportista();
        pnlPrinc.add(pnlTransportista, BorderLayout.CENTER);
        return pnlPrinc;
    }

    private JTabbedPane getTabbedPane() {
        JTabbedPane tabb = new JTabbedPane();
        tabb.addTab("Item", this.getPnlItem());
        return tabb;
    }

    private JPanel getPnlItem() {
        JPanel pnlPrinc = new JPanel(new BorderLayout());
        pnlPrinc.add(this.getToolBar(), BorderLayout.NORTH);
        pnlPrinc.add(this.getPnlTable(), BorderLayout.CENTER);
        return pnlPrinc;
    }

    private JPanel getPnlTable() {
        pnlTable = new JPanel();
        cardLayout = new CardLayout();
        pnlTable.setLayout(cardLayout);
        pnlTable.setBackground(new Color(245, 245, 245));
        CellRenderer render = new CellRenderer();
        pnlTable.add(this.getPnlTransferencia(render), "trans");
        pnlTable.add(this.getPnlTransferenciaLote(render), "transLote");
        pnlTable.add(this.getPnlVenta(render), "venta");
        pnlTable.add(this.getPnlDevol(render), "devol");

        return pnlTable;
    }

    private JPanel getPnlTransferencia(CellRenderer render) {
        mdlGuiaTransferencia = new GuiaTransferenciaTableModel();
        editorTransferencia = new CellEditorBtnLoteSalida(this, mdlGuiaTransferencia);
        tbltransferencia = new CTable();
        tbltransferencia.setDefaultRenderer(Double.class, render);
        tbltransferencia.setDefaultRenderer(String.class, render);
        tbltransferencia.setModel(mdlGuiaTransferencia);
        tbltransferencia.setAllColumnPreferredWidth();
        tbltransferencia.setAllColumnNoResizable();
        tbltransferencia.setAllTableNoEditable();
        tbltransferencia.getColumnModel().getColumn(4).setCellEditor(new DigitTextFieldCellEditor(EnumClass.TipoDatoEditor.DOUBLE_EDITOR).cellEditor);
        JScrollPane scrollTableguiaventa = new JScrollPane(tbltransferencia);
        scrollTableguiaventa.setPreferredSize(new Dimension(500, 40));
        JPanel pnlTrans = new JPanel(new BorderLayout());
        pnlTrans.add(scrollTableguiaventa, BorderLayout.CENTER);
        return pnlTrans;
    }

    private JPanel getPnlTransferenciaLote(CellRenderer render) {
        mdlGuiaTransLote = new GuiaTransferenciaTableModel();
        editorTransLote = new CellEditorBtnLoteTransferencia(this, mdlGuiaTransLote);
        tblTransLote = new CTable();
        tblTransLote.setDefaultRenderer(Double.class, render);
        tblTransLote.setDefaultRenderer(String.class, render);
        tblTransLote.setModel(mdlGuiaTransLote);
        tblTransLote.setAllColumnPreferredWidth();
        tblTransLote.setAllColumnNoResizable();
        tblTransLote.setAllTableNoEditable();
        JScrollPane scrollTableguiaventa = new JScrollPane(tblTransLote);
        scrollTableguiaventa.setPreferredSize(new Dimension(500, 40));
        JPanel pnlTrans = new JPanel(new BorderLayout());
        pnlTrans.add(scrollTableguiaventa, BorderLayout.CENTER);
        return pnlTrans;
    }

    private JPanel getPnlVenta(CellRenderer render) {
        mdlGuiaVenta = new GuiaVentaTableModel();
        editorLote = new CellEditorBtnLoteVenta(mdlGuiaVenta, this);
        tblVenta = new CTable();
        tblVenta.setDefaultRenderer(Double.class, render);
        tblVenta.setDefaultRenderer(String.class, render);
        tblVenta.setModel(mdlGuiaVenta);
        tblVenta.setAllColumnPreferredWidth();
        tblVenta.setAllColumnNoResizable();
        tblVenta.setAllTableNoEditable();
        tblVenta.setColumnEditable(2);
        tblVenta.getColumnModel().getColumn(4).setCellEditor(new DigitTextFieldCellEditor(EnumClass.TipoDatoEditor.DOUBLE_EDITOR).cellEditor);
        tblVenta.setVisibleColumn(11);
        JScrollPane scrolltblVenta = new JScrollPane(tblVenta);
        scrolltblVenta.setPreferredSize(new Dimension(500, 40));
        JPanel pnlVenta = new JPanel(new BorderLayout());
        pnlVenta.add(scrolltblVenta, BorderLayout.CENTER);
        return pnlVenta;
    }

    private JPanel getPnlDevol(CellRenderer render) {
        modelTblDevolucionProveedor = new GuiaDevolucionProveedorTableModel();
        editorDevolucion = new CellEditorBtnLoteSalida(this, modelTblDevolucionProveedor);
        tblDevolucion = new CTable();
        tblDevolucion.setDefaultRenderer(Double.class, render);
        tblDevolucion.setDefaultRenderer(String.class, render);
        tblDevolucion.setModel(modelTblDevolucionProveedor);
        tblDevolucion.setAllColumnPreferredWidth();
        tblDevolucion.setAllColumnNoResizable();
        tblDevolucion.setAllTableNoEditable();
        tblDevolucion.getColumnModel().getColumn(1).setCellEditor(new DigitTextFieldCellEditor(EnumClass.TipoDatoEditor.DOUBLE_EDITOR).cellEditor);
        tblDevolucion.getColumnModel().getColumn(5).setCellEditor(new DigitTextFieldCellEditor(EnumClass.TipoDatoEditor.DOUBLE_EDITOR).cellEditor);
        JScrollPane scrolltblDevolucion = new JScrollPane(tblDevolucion);
        scrolltblDevolucion.setPreferredSize(new Dimension(500, 40));
        JPanel pnlDevol = new JPanel(new BorderLayout());
        pnlDevol.add(scrolltblDevolucion, BorderLayout.CENTER);
        return pnlDevol;
    }

    private JToolBar getToolBar() {
        JToolBar toolbar = new JToolBar();
        toolbar.setBackground(new Color(245, 245, 245));
        btnAgregarItem = new JButton("Agregar", gif.ADD16);
        btnAgregarItem.setMnemonic('Q');
        btnAgregarItem.setHorizontalAlignment(SwingConstants.LEFT);
        btnAgregarItem.setIconTextGap(10);
        btnAgregarItem.setOpaque(false);
        btnAgregarItem.addKeyListener(this);
        btnAgregarItem.setFocusPainted(false);
        btnAgregarItem.setFont(new Font("Comic Sans MS", 0, 11));
        toolbar.add(btnAgregarItem);
        toolbar.add(new JLabel("|"));

        btnQuitarItem = new JButton("Quitar", gif.ELIMINATE16);
        btnQuitarItem.setMnemonic('Q');
        btnQuitarItem.setHorizontalAlignment(SwingConstants.LEFT);
        btnQuitarItem.setIconTextGap(10);
        btnQuitarItem.setOpaque(false);
        btnQuitarItem.addKeyListener(this);
        btnQuitarItem.setFocusPainted(false);
        btnQuitarItem.setFont(new Font("Comic Sans MS", 0, 11));
        toolbar.add(btnQuitarItem);
        toolbar.add(new JLabel("|"));
        chkSeleccionar = new JCheckBox("Seleccionar Todo");
        chkSeleccionar.addItemListener(this);
        chkSeleccionar.setFont(new Font("Verdana", 1, 11));
        chkSeleccionar.addKeyListener(this);
        chkSeleccionar.setHorizontalTextPosition(SwingConstants.LEFT);
        chkSeleccionar.addFocusListener(this);
        chkSeleccionar.setOpaque(false);
        toolbar.add(chkSeleccionar);
        return toolbar;
    }

    private JPanel getPnlNorth() {
        JPanel pnlPrinc = new JPanel(new BorderLayout());
        pnlPrinc.add(this.getPnlGral(), BorderLayout.NORTH);
        pnlPrinc.add(this.getPnlCenter(), BorderLayout.CENTER);
        return pnlPrinc;
    }

    private JPanel getPnlGral() {
        JPanel pnlPrinc = new JPanel(new FlowLayout(FlowLayout.LEADING, 2, 5));
        JLabel lblTipoGuia = new JLabel("Tipo GuÃ­a");
        pnlPrinc.add(lblTipoGuia);
        cboMotivoTraslado = new JComboBox();
        cboMotivoTraslado.setFont(new Font(Font.SANS_SERIF, 0, 9));
        pnlPrinc.add(cboMotivoTraslado);

        lblBuscarDocumento = new JLabel("Buscar Documento");
        pnlPrinc.add(lblBuscarDocumento);

        btnBuscar = new JButton("F5", gif.SEARCH16);
        btnBuscar.setMnemonic('B');
        btnBuscar.setFont(new Font(Font.SANS_SERIF, 0, 9));
        btnBuscar.setOpaque(false);
        btnBuscar.setIconTextGap(10);
        btnBuscar.setToolTipText("Buscar Solicitud");
        btnBuscar.setHorizontalAlignment(SwingConstants.LEFT);
        btnBuscar.setContentAreaFilled(true);
        btnBuscar.setBorderPainted(true);
        btnBuscar.setFocusable(true);
        btnBuscar.setFocusPainted(false);
        pnlPrinc.add(this.btnBuscar);

        lblReferencia = new JLabel("Doc Referencia");
        pnlPrinc.add(lblReferencia);

        txtIdSolicitud = new JTextField();
        txtIdSolicitud.setFont(new Font(Font.SANS_SERIF, 0, 11));
        txtIdSolicitud.setForeground(Color.BLACK);
        txtIdSolicitud.setEnabled(false);
        FormatObject.formatJTextFieldPreimpreso(txtIdSolicitud);
        pnlPrinc.add(txtIdSolicitud);

        txtSerieSol = new JTextField();
        txtSerieSol.addKeyListener(this);
        txtSerieSol.setFont(new Font(Font.SANS_SERIF, 0, 11));
        FormatObject.formatJTextFieldSerie(txtSerieSol);
        txtSerieSol.setForeground(Color.BLACK);
        txtSerieSol.setEnabled(false);
        pnlPrinc.add(txtSerieSol);

        txtPreimpresoSol = new JTextField();
        txtPreimpresoSol.setFont(new Font(Font.SANS_SERIF, 0, 11));
        txtPreimpresoSol.setForeground(Color.BLACK);
        txtPreimpresoSol.setEnabled(false);
        FormatObject.formatJTextFieldPreimpreso(txtPreimpresoSol);
        pnlPrinc.add(txtPreimpresoSol);
        lblRegconta = new JLabel("NÂ° Fact");
        pnlPrinc.add(lblRegconta);

        txtIdRegconta = new JTextField();
        txtIdRegconta.setFont(new Font(Font.SANS_SERIF, 0, 11));
        txtIdRegconta.setForeground(Color.BLACK);
        txtIdRegconta.setVisible(false);
        FormatObject.formatJTextFieldPreimpreso(txtIdRegconta);
        pnlPrinc.add(txtIdRegconta);

        txtSerieRegconta = new JTextField();
        txtSerieRegconta.setFont(new Font(Font.SANS_SERIF, 0, 11));
        FormatObject.formatJTextFieldSerie(txtSerieRegconta);
        txtSerieRegconta.setForeground(Color.BLACK);
        pnlPrinc.add(txtSerieRegconta);

        txtPreimpresoRegconta = new JTextField();
        txtPreimpresoRegconta.setFont(new Font(Font.SANS_SERIF, 0, 11));
        FormatObject.formatJTextFieldPreimpreso(txtPreimpresoRegconta);
        txtPreimpresoRegconta.setForeground(Color.BLACK);
        pnlPrinc.add(txtPreimpresoRegconta);
        return pnlPrinc;
    }

    private JPanel getPnlDatos() {
        Border border = BorderFactory.createTitledBorder(null, "Datos Generales", TitledBorder.LEFT, TitledBorder.DEFAULT_POSITION, new Font("Comic Sans MS", 0, 11), Color.BLACK);

        JPanel pnl = new JPanel(new GridBagLayout());
        pnl.setBackground(new Color(245, 245, 245));
        pnl.setBorder(border);
        GridBagConstraints gbc = LayoutUtil.getGbc();

        JLabel lblTipoDoc = new JLabel("Tipo Doc");
        pnl.add(lblTipoDoc, gbc);

        gbc.gridx = 1;
        gbc.gridwidth = 5;
        JPanel pnlDoc = new JPanel(new FlowLayout(FlowLayout.LEADING, 0, 0));
        pnl.add(pnlDoc, gbc);
        txtTipoDoc = new JTextField();
        txtTipoDoc.setColumns(2);
        txtTipoDoc.setEnabled(false);
        pnlDoc.add(txtTipoDoc);
        txtTipoDocDesc = new JTextField();
        txtTipoDocDesc.setEnabled(false);
        txtTipoDocDesc.setColumns(25);
        pnlDoc.add(txtTipoDocDesc);
        gbc.gridwidth = 1;

        gbc.gridx = 0;
        gbc.gridy = 1;
        JLabel lblSerie = new JLabel("N Guia");
        pnl.add(lblSerie, gbc);

        gbc.gridx = 1;
        cboSerie = new JComboBox();
        pnl.add(cboSerie, gbc);

        txtSerie = new JTextField();
        FormatObject.formatJTextFieldSerie(txtSerie);
        txtSerie.setEnabled(false);
        pnl.add(txtSerie, gbc);

        gbc.gridx = 2;
        txtPreimpreso = new JTextField();
        txtPreimpreso.setFont(new Font(Font.SANS_SERIF, Font.BOLD | Font.ITALIC, 12));
        txtPreimpreso.setForeground(Color.BLACK);
        FormatObject.formatJTextFieldPreimpreso(txtPreimpreso);
        txtPreimpreso.setEnabled(false);
        pnl.add(txtPreimpreso, gbc);

        gbc.gridx = 3;
        JLabel lblFechaEmision = new JLabel("F Emi");
        lblFechaEmision.setDisplayedMnemonic('c');
        pnl.add(lblFechaEmision, gbc);

        gbc.gridx = 4;
        dcFechaEmision = new JDateChooser("dd/MM/yyyy", "##/##/####", '_');
        pnl.add(dcFechaEmision, gbc);

        gbc.gridx = 5;
        JLabel lblFechaIniTraslado = new JLabel("F Tras");
        lblFechaIniTraslado.setDisplayedMnemonic('c');
        pnl.add(lblFechaIniTraslado, gbc);

        gbc.gridx = 6;
        dcFechatraslado = new JDateChooser("dd/MM/yyyy", "##/##/####", '_');
        pnl.add(dcFechatraslado, gbc);

        gbc.gridx = 0;
        gbc.gridy = 2;
        JLabel lblAlmacenPartida = new JLabel("Partida");
        pnl.add(lblAlmacenPartida, gbc);

        gbc.gridx = 1;
        txtAlmacen = new JTextField();
        txtAlmacen.setColumns(30);
        gbc.gridwidth = 6;
        gbc.fill = GridBagConstraints.HORIZONTAL;
        pnl.add(txtAlmacen, gbc);
        gbc.fill = GridBagConstraints.NONE;

        txtIdAlmacen = new JTextField();
        txtIdAlmacen.setVisible(false);

        cboAlmacenPartida = new JComboBox();
        pnl.add(cboAlmacenPartida, gbc);
        gbc.gridwidth = 1;

        gbc.gridx = 0;
        gbc.gridy = 3;
        JLabel lblLocalDespacho = new JLabel("Llegada");
        pnl.add(lblLocalDespacho, gbc);

        gbc.gridx = 1;
        gbc.gridwidth = 3;
        cboPuntoVenta = new JComboBox();
        pnl.add(cboPuntoVenta, gbc);
        gbc.gridwidth = 1;

        gbc.gridx = 4;
        cboAlmacenLlegada = new JComboBox();
        cboAlmacenLlegada.setEnabled(false);
        gbc.gridwidth = 3;
        pnl.add(cboAlmacenLlegada, gbc);
        gbc.gridwidth = 1;

        gbc.gridx = 1;
        gbc.gridwidth = 4;
        txtDireccionllegada = new JTextField();
        txtDireccionllegada.setColumns(25);
        gbc.fill = GridBagConstraints.HORIZONTAL;
        pnl.add(txtDireccionllegada, gbc);
        gbc.gridwidth = 1;

        gbc.gridx = 0;
        gbc.gridy = 4;
        JLabel lblRazonSocial = new JLabel("R Social");
        lblRazonSocial.setFont(new Font("Verdana", 0, 11));
        pnl.add(lblRazonSocial, gbc);

        gbc.gridx = 1;
        gbc.gridwidth = 4;
        txtCliente = new JTextField();
        txtCliente.setEditable(false);
        txtCliente.setColumns(25);
        pnl.add(txtCliente, gbc);
        gbc.gridwidth = 1;

        gbc.gridx = 5;
        JLabel lblRucProveedor = new JLabel("N Doc");
        lblRucProveedor.setFont(new Font("Verdana", 0, 11));
        pnl.add(lblRucProveedor, gbc);

        gbc.gridx = 6;
        txtRucCliente = new JTextField();
        txtRucCliente.setEditable(false);
        txtRucCliente.setColumns(8);
        pnl.add(txtRucCliente, gbc);

        txtIdanexo = new JTextField();
        txtIdanexo.setVisible(false);

        txtIdTipoDocRef = new JTextField();
        txtIdTipoDocRef.setVisible(false);

        txtIdlocalidadllegada = new JTextField();
        txtIdlocalidadllegada.setVisible(false);

        txtIdestado = new JTextField();
        txtIdestado.setVisible(false);

        txtIdtransportista = new JTextField();
        txtIdtransportista.setVisible(false);
        return pnl;
    }

    private JPanel getPnlTransportista() {
        JPanel pnlPrinc = new JPanel(new BorderLayout());
        Border border = BorderFactory.createTitledBorder(null, "Empresa Transportista - Unidad de Transporte y Conductor",
                TitledBorder.LEFT, TitledBorder.DEFAULT_POSITION, new Font("Comic Sans MS", 0, 11), Color.BLACK);
        JPanel pnlTransport = new JPanel(new GridBagLayout());
        pnlPrinc.setBackground(new Color(245, 245, 245));
        pnlTransport.setBackground(new Color(245, 245, 245));
        pnlPrinc.setBorder(border);
        pnlPrinc.add(pnlTransport, BorderLayout.WEST);

        GridBagConstraints gbc = LayoutUtil.getGbc();
        gbc.gridx = 0;
        gbc.gridy = 0;
        gbc.gridwidth = 2;
        chkSinTransporte = new JCheckBox("Omitir Transporte");
        pnlTransport.add(chkSinTransporte, gbc);

        gbc.gridx = 0;
        gbc.gridy = 1;
        gbc.gridwidth = 1;
        JLabel lblRazonSocialTransp = new JLabel("R Social");
        lblRazonSocialTransp.setFont(new Font("Verdana", 0, 11));
        pnlTransport.add(lblRazonSocialTransp, gbc);

        gbc.gridx = 1;
        gbc.gridy = 1;
        txtTransportista = new JTextField();
        txtTransportista.setEditable(false);
        txtTransportista.setColumns(30);
        gbc.gridwidth = 3;
        pnlTransport.add(txtTransportista, gbc);
        gbc.gridwidth = 1;

        gbc.gridx = 4;
        gbc.gridy = 1;
        btnBuscarTransp = new JButton(gif.SEARCH16);
        btnBuscarTransp.setToolTipText("Buscar Proveedor");
        btnBuscarTransp.setContentAreaFilled(true);
        btnBuscarTransp.setBorderPainted(true);
        btnBuscarTransp.setFocusable(true);
        btnBuscarTransp.setFocusPainted(false);
        pnlTransport.add(this.btnBuscarTransp, gbc);

        gbc.gridx = 5;
        gbc.gridy = 1;
        btnNuevoTransportista = new JButton(gif.ADDORANGE);
        btnNuevoTransportista.setToolTipText("Nuevo Proveedor");
        pnlTransport.add(this.btnNuevoTransportista, gbc);

        gbc.gridx = 0;
        gbc.gridy = 2;
        JLabel lblRucTransp = new JLabel("RUC/DNI");
        lblRucTransp.setFont(new Font("Verdana", 0, 11));
        pnlTransport.add(lblRucTransp, gbc);

        gbc.gridx = 1;
        txtRucTransportista = new JTextField();
        txtRucTransportista.setEditable(false);
        txtRucTransportista.setColumns(8);
        pnlTransport.add(txtRucTransportista, gbc);

        gbc.gridx = 2;
        JLabel lblPlaca = new JLabel("N Placa");
        lblPlaca.setFont(new Font("Verdana", 0, 11));
        pnlTransport.add(lblPlaca, gbc);

        gbc.gridx = 3;
        txtPlacacarro = new JTextField();
        txtPlacacarro.setEditable(false);
        txtPlacacarro.setDocument(new UpperCaseNumberDocument(100));
        txtPlacacarro.setColumns(8);
        pnlTransport.add(txtPlacacarro, gbc);

        gbc.gridy = 3;
        gbc.gridx = 0;
        JLabel lblMarca = new JLabel("Marca/Modelo");
        lblMarca.setFont(new Font("Verdana", 0, 11));
        pnlTransport.add(lblMarca, gbc);

        gbc.gridx = 1;
        txtMarcacarro = new JTextField();
        txtMarcacarro.setEditable(false);
        txtMarcacarro.setColumns(8);
        pnlTransport.add(txtMarcacarro, gbc);

        gbc.gridx = 2;
        JLabel lblConstInscrip = new JLabel("C Inscripcion");
        lblConstInscrip.setFont(new Font("Verdana", 0, 11));
        pnlTransport.add(lblConstInscrip, gbc);

        gbc.gridx = 3;
        txtConstanciainscripcion = new JTextField();
        txtConstanciainscripcion.setEditable(false);
        txtConstanciainscripcion.setColumns(8);
        pnlTransport.add(txtConstanciainscripcion, gbc);

        gbc.gridx = 0;
        gbc.gridy = 4;
        JLabel lblChofer = new JLabel("Conductor");
        lblChofer.setFont(new Font("Verdana", 0, 11));
        pnlTransport.add(lblChofer, gbc);

        gbc.gridx = 1;
        txtConductor = new JTextField();
        txtConductor.setEditable(false);
        txtConductor.setColumns(25);
        gbc.gridwidth = 3;
        pnlTransport.add(txtConductor, gbc);
        gbc.gridwidth = 1;

        gbc.gridx = 4;
        btnBuscarConductor = new JButton(gif.SEARCH16);
        btnBuscarConductor.setToolTipText("Buscar Proveedor");
        btnBuscarConductor.setContentAreaFilled(true);
        btnBuscarConductor.setBorderPainted(true);
        btnBuscarConductor.setFocusable(true);
        btnBuscarConductor.setFocusPainted(false);
        pnlTransport.add(btnBuscarConductor, gbc);

        gbc.gridx = 5;
        btnNuevoConductor = new JButton(gif.ADDORANGE);
        btnNuevoConductor.setToolTipText("Nuevo Proveedor");
        btnNuevoConductor.setFocusPainted(false);
        pnlTransport.add(btnNuevoConductor, gbc);

        gbc.gridx = 0;
        gbc.gridy = 5;
        JLabel lblNLicencia = new JLabel("N Licencia");
        lblNLicencia.setFont(new Font("Verdana", 0, 11));
        pnlTransport.add(lblNLicencia, gbc);

        gbc.gridx = 1;
        txtNumerolicencia = new JTextField();
        txtNumerolicencia.setEditable(false);
        txtNumerolicencia.setColumns(8);
        pnlTransport.add(txtNumerolicencia, gbc);

        txtIdvehiculo = new JTextField();
        txtModelocarro = new JTextField();
        txtIdconductor = new JTextField();
        return pnlPrinc;
    }

    @Override
    public void newRegister() {
        JTextField txt = new JTextField();
        txtPreimpreso.setBorder(txt.getBorder());
        txtSerieSol.setBorder(txt.getBorder());
        txtPreimpresoSol.setBorder(txt.getBorder());
        dcFechaEmision.setBorder(dcFechaEmision.getBorder());
        dcFechatraslado.setBorder(dcFechatraslado.getBorder());
        cboAlmacenPartida.setBorder(txt.getBorder());
        txtDireccionllegada.setBorder(txt.getBorder());
        cboAlmacenLlegada.setBorder(txt.getBorder());
        cboPuntoVenta.setBorder(txt.getBorder());
        txtConductor.setText("");
        txtIdconductor.setText("");
        txtIdvehiculo.setText("");
        txtIdtransportista.setText("");
        txtConstanciainscripcion.setText("");
        txtMarcacarro.setText("");
        txtModelocarro.setText("");
        txtNumerolicencia.setText("");
        txtPlacacarro.setText("");
        txtCliente.setText("");
        txtTransportista.setText("");
        txtRucCliente.setText("");
        txtRucTransportista.setText("");
        txtSerieSol.setText("");
        txtPreimpresoSol.setText("");
        txtPreimpresoRegconta.setText("");
        txtSerieRegconta.setText("");
        txtIdAlmacen.setText("");
        txtAlmacen.setText("");
        txtIdRegconta.setText("");
        txtIdestado.setText("005");

        txtIdlocalidadllegada.setText("");
        txtIdanexo.setText("");
        txtIdSolicitud.setText("");
        txtIdTipoDocRef.setText("");
        txtDireccionllegada.setText("");

        mdlGuiaTransferencia.clearTable();
        mdlGuiaTransLote.clearTable();
        mdlGuiaVenta.clearTable();
        tbltransferencia.setAllColumnPreferredWidth();
        tblTransLote.setAllColumnPreferredWidth();
        tblVenta.setAllColumnPreferredWidth();

        cargarConductor("0000027231");
        if (cboAlmacenPartida.getItemCount() > 0) {
            cboAlmacenPartida.setSelectedIndex(1);
        }
        if (cboPuntoVenta.getItemCount() > 0) {
            cboPuntoVenta.setSelectedIndex(1);
        }
        if (cboAlmacenLlegada.getItemCount() > 0) {
            cboAlmacenLlegada.setSelectedIndex(1);
        }

        dcFechaEmision.requestFocus();
        boolean isMotivoTransferencia = this.isMotivoTransferencia(this.getIdMotivoTraslado());
        txtCliente.setText(isMotivoTransferencia ? usuario.getDescriempresa() : "");
        txtRucCliente.setText(isMotivoTransferencia ? usuario.getRuc() : "");
    }

    private String getIdMotivoTraslado() {
        if (cboMotivoTraslado.getItemCount() > 0) {
            return xMotivotraslado.get(cboMotivoTraslado.getSelectedIndex()).getCodigo();
        }
        return "";
    }

    private void loadRegisterGuiaVenta(ContaCab guiaremision, String idMotivoTranslado, CellRenderer render) throws Exception {
        try {
            txtIdMovimientoOrigen.setText(guiaremision.getIdMovimiento());
            cargarTipoGuia(idMotivoTranslado);
            txtMarcacarro.setText(guiaremision.getMarcaModelo());
            txtPlacacarro.setText(guiaremision.getPlaca());
            txtTransportista.setText(guiaremision.getEmpresaTransportista());
            txtConductor.setText(guiaremision.getChofer());
            txtConstanciainscripcion.setText(guiaremision.getConstanciaInscripcion());
            txtNumerolicencia.setText(guiaremision.getNroLicencia());
            txtRucTransportista.setText(guiaremision.getRucEmpresaTransportista());
            txtPreimpreso.setText(guiaremision.getSeriePreimpresoGuiaRef().substring(4, 14).trim());
            txtSerie.setText(guiaremision.getSerieRef());
            dcFechaEmision.setDate(guiaremision.getFEmision());
            dcFechatraslado.setDate(guiaremision.getFTraslado());
            txtCliente.setText(guiaremision.getAnTmpanexo());
            txtRucCliente.setText(guiaremision.getAnTmpruc());
            txtDireccionllegada.setText(guiaremision.getDireccionllegada());
            txtSerieSol.setText(guiaremision.getSerieRef1());
            txtPreimpresoSol.setText(guiaremision.getPreimpresoRef1());
            cargarAlmacenPartida(guiaremision.getIdAlmacen());
            cargarPuntoVenta(guiaremision.getIdPvDestino());
            cargarAlmacenLlegada(guiaremision.getIdAlmacenDestino());

            RnRegContaCab reglaDet = new RnRegContaCab(path);
            mdlGuiaVenta.agregarVectorGuiaTransferencia(reglaDet.BuscaDetalleMovimiento(guiaremision.getIdMovimiento(), "S", ""));
            tblVenta.setNoVisibleColumn(9);
            tblVenta.setNoVisibleColumn(10);
            tblVenta.setNoVisibleColumn(11);
            tblVenta.setAllColumnPreferredWidth();
            tblVenta.setDefaultRenderer(Double.class, render);
            tblVenta.setDefaultRenderer(String.class, render);
        } catch (Exception e) {
            throw e;
        }
    }

    private void loadRegisterGuiaTraslado(ContaCab guiaremision, String idMotivoTranslado, CellRenderer render) throws Exception {
        try {
            txtIdMovimientoOrigen.setText(guiaremision.getIdMovimiento());
            txtIdMovimientoDestino.setText(guiaremision.getIdMovimientoDestino());
            cargarTipoGuia(idMotivoTranslado);
            txtMarcacarro.setText(guiaremision.getMarcaModelo());
            txtPlacacarro.setText(guiaremision.getPlaca());
            txtTransportista.setText(guiaremision.getEmpresaTransportista());
            txtConductor.setText(guiaremision.getChofer());
            txtConstanciainscripcion.setText(guiaremision.getConstanciaInscripcion());
            txtNumerolicencia.setText(guiaremision.getNroLicencia());
            txtRucTransportista.setText(guiaremision.getRucEmpresaTransportista());
            txtPreimpreso.setText(guiaremision.getSeriePreimpresoGuiaRef().substring(4, 14).trim());
            txtSerie.setText(guiaremision.getSerieRef());
            dcFechaEmision.setDate(guiaremision.getFEmision());
            dcFechatraslado.setDate(guiaremision.getFTraslado());
            txtCliente.setText(guiaremision.getEmpresa());
            txtRucCliente.setText(guiaremision.getRucempresa());
            txtDireccionllegada.setText(guiaremision.getDireccionllegada());
            txtSerieSol.setText(guiaremision.getSerieRef1());
            txtPreimpresoSol.setText(guiaremision.getPreimpresoRef1());
            txtIdSolicitud.setText(guiaremision.getIdSolicitud());

            cargarAlmacenPartida(guiaremision.getIdAlmacen());
            cargarPuntoVenta(guiaremision.getIdPvDestino());
            cargarAlmacenLlegada(guiaremision.getIdAlmacenDestino());

            RnRegContaCab reglaDet = new RnRegContaCab(path);
            mdlGuiaTransferencia.agregarVectorGuia(reglaDet.BuscaDetalleMovimiento(guiaremision.getIdMovimiento(), "S", ""));
            tbltransferencia.setAllColumnPreferredWidth();
            tbltransferencia.setDefaultRenderer(Double.class, render);
            tbltransferencia.setDefaultRenderer(String.class, render);
        } catch (Exception e) {
            throw e;
        }
    }

    private void loadRegisterTransferenciaInterna(ContaCab guiaremision, String idMotivoTranslado, CellRenderer render) throws Exception {
        try {
            txtIdMovimientoOrigen.setText(guiaremision.getIdMovimiento());
            txtIdMovimientoDestino.setText(guiaremision.getIdMovimientoDestino());
            cargarTipoGuia(idMotivoTranslado);
            txtPreimpreso.setText(guiaremision.getSeriePreimpresoGuiaRef().substring(4, 14).trim());
            txtSerie.setText(guiaremision.getSerieRef());
            dcFechaEmision.setDate(guiaremision.getFEmision());
            dcFechatraslado.setDate(guiaremision.getFTraslado());
            txtCliente.setText(guiaremision.getEmpresa());
            txtRucCliente.setText(guiaremision.getRucempresa());
            txtDireccionllegada.setText(guiaremision.getDireccionllegada());
            cargarAlmacenPartida(guiaremision.getIdAlmacen());
            cargarPuntoVenta(guiaremision.getIdPvDestino());
            cargarAlmacenLlegada(guiaremision.getIdAlmacenDestino());
            RnRegContaCab reglaDet = new RnRegContaCab(path);
            mdlGuiaTransLote.agregarVectorGuia(reglaDet.BuscaDetalleMovimiento(guiaremision.getIdMovimiento(), "S", ""));
            tblTransLote.setAllColumnPreferredWidth();
            tblTransLote.setDefaultRenderer(Double.class, render);
            tblTransLote.setDefaultRenderer(String.class, render);
        } catch (Exception e) {
            throw e;
        }
    }

    private void loadRegisterGuiaDevolucion(ContaCab guiaremision, String idMotivoTranslado, CellRenderer render) throws Exception {
        try {
            txtIdMovimientoOrigen.setText(guiaremision.getIdMovimiento());
            txtIdMovimientoDestino.setText(guiaremision.getIdMovimientoDestino());
            cargarTipoGuia(idMotivoTranslado);
            txtMarcacarro.setText(guiaremision.getMarcaModelo());
            txtPlacacarro.setText(guiaremision.getPlaca());
            txtTransportista.setText(guiaremision.getEmpresaTransportista());
            txtConductor.setText(guiaremision.getChofer());
            txtConstanciainscripcion.setText(guiaremision.getConstanciaInscripcion());
            txtNumerolicencia.setText(guiaremision.getNroLicencia());
            txtRucTransportista.setText(guiaremision.getRucEmpresaTransportista());
            txtPreimpreso.setText(guiaremision.getSeriePreimpresoGuiaRef().substring(4, 14).trim());
            txtSerie.setText(guiaremision.getSerieRef());
            dcFechaEmision.setDate(guiaremision.getFEmision());
            dcFechatraslado.setDate(guiaremision.getFTraslado());
            txtCliente.setText(guiaremision.getAnTmpanexo());
            txtRucCliente.setText(guiaremision.getAnTmpruc());
            txtDireccionllegada.setText(guiaremision.getDireccionllegada());
            txtSerieSol.setText(guiaremision.getSerieRef1());
            txtPreimpresoSol.setText(guiaremision.getPreimpresoRef1());
            cargarPuntoVenta(guiaremision.getIdPvDestino());
            RnRegContaCab reglaDet = new RnRegContaCab(path);
            modelTblDevolucionProveedor.agregarVectorGuiaTransferencia(reglaDet.BuscaDetalleMovimiento(guiaremision.getIdMovimiento(), "S", ""));
            tblDevolucion.setAllColumnPreferredWidth();
            tblDevolucion.setDefaultRenderer(Double.class, render);
            tblDevolucion.setDefaultRenderer(String.class, render);
        } catch (Exception e) {
            throw e;
        }
    }

    private void loadRegisterGuiaDevolucionPaquete(ContaCab guiaremision, String idMotivoTranslado, CellRenderer render) throws Exception {
        try {
            txtIdMovimientoOrigen.setText(guiaremision.getIdMovimiento());
            txtIdMovimientoDestino.setText(guiaremision.getIdMovimientoDestino());
            cargarTipoGuia(idMotivoTranslado);
            txtMarcacarro.setText(guiaremision.getMarcaModelo());
            txtPlacacarro.setText(guiaremision.getPlaca());
            txtTransportista.setText(guiaremision.getEmpresaTransportista());
            txtConductor.setText(guiaremision.getChofer());
            txtConstanciainscripcion.setText(guiaremision.getConstanciaInscripcion());
            txtNumerolicencia.setText(guiaremision.getNroLicencia());
            txtRucTransportista.setText(guiaremision.getRucEmpresaTransportista());
            txtPreimpreso.setText(guiaremision.getSeriePreimpresoGuiaRef().substring(4, 14).trim());
            txtSerie.setText(guiaremision.getSerieRef());
            dcFechaEmision.setDate(guiaremision.getFEmision());
            dcFechatraslado.setDate(guiaremision.getFTraslado());
            txtCliente.setText(guiaremision.getAnTmpanexo());
            txtRucCliente.setText(guiaremision.getAnTmpruc());
            txtDireccionllegada.setText(guiaremision.getDireccionllegada());

            txtSerieSol.setText(guiaremision.getSerieRef1());
            txtPreimpresoSol.setText(guiaremision.getPreimpresoRef1());
            cargarPuntoVenta(guiaremision.getIdPvDestino());
            RnRegContaCab reglaDet = new RnRegContaCab(path);
            modelTblDevolucionProveedor.agregarVectorGuiaTransferencia(reglaDet.BuscaDetalleMovimiento(guiaremision.getIdMovimiento(), "S", ""));
            tblDevolucion.setAllColumnPreferredWidth();
            tblDevolucion.setDefaultRenderer(Double.class, render);
            tblDevolucion.setDefaultRenderer(String.class, render);
        } catch (Exception e) {
            throw e;
        }
    }

    @Override
    public boolean loadRegister() {
        try {
            ContaCab contaCab = pnltf.getGuiaSelected();
            RnRegContaCab regla = new RnRegContaCab(path);
            List<ContaCab> reg = regla.listar(usuario.getCodempresa(), usuario.getCodlocalidad(),
                    contaCab.getIdTipoDocRef(), contaCab.getSerieRef(),
                    contaCab.getPreimpresoRef(), "",
                    DateTime.format(0, 0, 0), "", "", "", "", "", "", "",
                    DateTime.format(0, 0, 0), "", "", "", DateTime.format(1901, 0, 1), DateTime.format(1901, 0, 1));

            if (reg.isEmpty()) {
                return false;
            }
            ContaCab guiaremision = reg.get(0);
            String idMotivoTranslado = contaCab.getIdMotivoTraslado();
            CellRenderer render = new CellRenderer();
            if (idMotivoTranslado.equals(MotivoTrasladoEnum.VENTA.getValue())) {
                this.loadRegisterGuiaVenta(guiaremision, idMotivoTranslado, render);
                return true;
            }
            if (idMotivoTranslado.equals(MotivoTrasladoEnum.TRASLADO.getValue())) {
                this.loadRegisterGuiaTraslado(guiaremision, idMotivoTranslado, render);
                return true;
            }
            if (idMotivoTranslado.equals(MotivoTrasladoEnum.TRANSFERENCIA_LOTE.getValue())) {
                this.loadRegisterTransferenciaInterna(guiaremision, idMotivoTranslado, render);
                return true;
            }

            if (idMotivoTranslado.equals(MotivoTrasladoEnum.DEVOLUCION.getValue())) {
                this.loadRegisterGuiaDevolucion(guiaremision, idMotivoTranslado, render);
                return true;
            }
            if (idMotivoTranslado.equals(MotivoTrasladoEnum.DEVOLUCION_PAQUETE.getValue())) {
                this.loadRegisterGuiaDevolucionPaquete(guiaremision, idMotivoTranslado, render);
                return true;
            }
            return true;
        } catch (Exception e) {
            ExceptionHandler.handleException(e, logger);
            return false;
        }
    }

    @Override
    public boolean isRegisterValid() {
        try {
            tbltransferencia.editCellAt(-1, -1);
            tblTransLote.editCellAt(-1, -1);
            tblVenta.editCellAt(-1, -1);

            JTextField txt = new JTextField();
            cboAlmacenPartida.setBorder(txt.getBorder());
            cboPuntoVenta.setBorder(txt.getBorder());
            cboAlmacenLlegada.setBorder(txt.getBorder());
            cboSerie.setBorder(txt.getBorder());
            String idMotivoTraslado = this.getIdMotivoTraslado();
            String idAlmacen = this.getIdAlmacenPartida();
            String res = "";
            RnAlmacen reglaAlmacen = new RnAlmacen(path);
            try {
                res = reglaAlmacen.validarDespacho(idAlmacen);
            } catch (Exception e) {
                ExceptionHandler.handleException(e, logger);
                JOptionPane.showMessageDialog(this, e.toString());
            }

            if (res.equals("N")) {
                JOptionPane.showMessageDialog(this, "Este almacen no esta habilitado para despachar, "
                        + "por favor direccione el documento",
                        "Error en almacen de despacho.", JOptionPane.CANCEL_OPTION);
                cboSerie.setBorder(new LineBorder(Color.RED));
                cboSerie.requestFocus();
                return false;
            }
            if (!idMotivoTraslado.equals(MotivoTrasladoEnum.TRANSFERENCIA_LOTE.getValue()) && !chkSinTransporte.isSelected()) {
                if (txtIdvehiculo.getText().trim().length() == 0) {
                    JOptionPane.showMessageDialog(this, "Ingrese Vehiculo");
                    return false;
                }
                if (txtIdconductor.getText().trim().length() == 0) {
                    JOptionPane.showMessageDialog(this, "Ingrese Conductor");
                    return false;
                }
                if (txtIdtransportista.getText().trim().length() == 0) {
                    JOptionPane.showMessageDialog(this, "Ingrese Transportista");
                    return false;
                }
            }
            if (cboSerie.getSelectedIndex() < 0) {
                JOptionPane.showMessageDialog(this, "Serie de Guia de Remision es incorrecto,Por favor verifique la Serie de Guia.", "Datos incompletos de Guia de Remision.", JOptionPane.CANCEL_OPTION);
                cboSerie.setBorder(new LineBorder(Color.RED));
                cboSerie.requestFocus();
                return false;
            }

            if (!(txtPreimpreso.getText().trim().length() == 10)) {
                JOptionPane.showMessageDialog(this, "El numero de Guia de Remision es incorrecto,Por favor verifique el numero de Guia.", "Datos incompletos de Guia de Remision.", JOptionPane.CANCEL_OPTION);
                txtPreimpreso.setBorder(new LineBorder(Color.RED));
                txtPreimpreso.requestFocus();
                return false;
            }

            RnRegContaCab regla = new RnRegContaCab(path);
            ContaCab m = new ContaCab();
            m.setIdPuntoventa(usuario.getCodpuntoventa());
            m.setIdTipoDoc(txtTipoDoc.getText().trim());
            m.setSerie(this.getUsuarioCorrelativo().getSerie());
            m.setPreimpreso(txtPreimpreso.getText().substring(0, 10).trim());
            boolean flag = regla.existeGuiaRemision(m).trim().equals("S");

            if (flag) {
                JOptionPane.showMessageDialog(this, "El numero de Guia de Remision ya se encuentra registrado,Por favor especifique otro numero.", "Datos incompletos de Guia de Remision.", JOptionPane.CANCEL_OPTION);
                txtPreimpreso.setBorder(new LineBorder(Color.RED));
                txtPreimpreso.requestFocus();
                return false;
            }

            if (idMotivoTraslado.equals(MotivoTrasladoEnum.TRASLADO.getValue())) {
                if (cboAlmacenPartida.getSelectedIndex() == 0) {
                    JOptionPane.showMessageDialog(this, "Para " + namemode + " una Guia de Remision x " + cboMotivoTraslado.getSelectedItem().toString() + " debe  elegir un Almacen de Partida.", "Datos incompletos de Guia de Remision.", JOptionPane.CANCEL_OPTION);
                    cboAlmacenPartida.setBorder(new LineBorder(Color.RED));
                    cboAlmacenPartida.requestFocus();
                    return false;
                }

                if (cboPuntoVenta.getSelectedIndex() == 0) {
                    JOptionPane.showMessageDialog(this, "Para " + namemode + " una Guia de Remision x " + cboMotivoTraslado.getSelectedItem().toString() + " debe  elegir un Punto de Venta de Llegada.", "Datos incompletos de Guia de Remision.", JOptionPane.CANCEL_OPTION);
                    cboPuntoVenta.setBorder(new LineBorder(Color.RED));
                    cboPuntoVenta.requestFocus();
                    return false;
                }

                if (cboAlmacenLlegada.getSelectedIndex() == 0) {
                    JOptionPane.showMessageDialog(this, "Para " + namemode + " una Guia de Remision x " + cboMotivoTraslado.getSelectedItem().toString() + " debe  elegir un Almacen de Llegada.", "Datos incompletos de Guia de Remision.", JOptionPane.CANCEL_OPTION);
                    cboAlmacenLlegada.setBorder(new LineBorder(Color.RED));
                    cboAlmacenLlegada.requestFocus();
                    return false;
                }
                if (mdlGuiaTransferencia.getRowCount() == 0) {
                    JOptionPane.showMessageDialog(this, "Debe Ingresar Productos");
                    return false;
                }
                BigDecimal cantidad;
                for (int i = 0; i < mdlGuiaTransferencia.getRowCount(); i++) {
                    String cant = mdlGuiaTransferencia.getGuia(i).getCant_string();
                    if (cant.trim().length() == 0) {
                        cant = "0";
                    }
                    cantidad = new BigDecimal(cant);
                    if (!(cantidad.compareTo(BigDecimal.ZERO) == 1)) {
                        JOptionPane.showMessageDialog(this, "Ingrese Cantidades correctamente");
                        return false;
                    }
                }
            }
            if (idMotivoTraslado.equals(MotivoTrasladoEnum.DEVOLUCION.getValue()) && Constans.ISBOTICA) {
                if (!validateItemDevolucion()) {
                    return false;
                }
            }
            RnPeriodoMensual logic = new RnPeriodoMensual(path);
            String rpta = logic.estadoPeriodoInventario(Util.getIdPeriodoMensual(dcFechaEmision.getDate()));
            if (rpta.trim().substring(0, 1).equals("*")) {
                JOptionPane.showMessageDialog(this, rpta);
                return false;
            }
            return true;
        } catch (Exception e) {
            ExceptionHandler.handleException(e, logger);
            JOptionPane.showMessageDialog(this, e.getMessage());
            return false;
        }
    }

    private UsuarioCorrelativo getUsuarioCorrelativo() {
        ObjectItem obj = (ObjectItem) cboSerie.getSelectedItem();
        if (obj == null) {
            return null;
        }
        return (UsuarioCorrelativo) obj.getObjItem();
    }

    private boolean validateItemDevolucion() {
        for (int i = 0; i < modelTblDevolucionProveedor.getRowCount(); i++) {
            ContaItem contaItem = modelTblDevolucionProveedor.getGuiaTransferencia(i);
            if (contaItem.getCantidadLoteSalida().compareTo(this.getCantidadDevolver(contaItem)) != 0) {
                JOptionPane.showMessageDialog(this, "Debe Ingresar Lote, item " + (i + 1));
                return false;
            }
        }
        return true;
    }

    private BigDecimal getCantidadDevolver(ContaItem contaItem) {
        return Util.getNumberBigDecimal(contaItem.getCant_a_devolver());
    }

    private void agregarItemTransferenciaLote(BeanItem beanItem) {
        ContaItem contaItem = new ContaItem();
        contaItem.setId_item(beanItem.getIdItem());
        contaItem.setIdAlterno(beanItem.getIdAlterno());
        contaItem.setItem_descripcion(beanItem.getDescripcion());
        contaItem.setMarca(beanItem.getBeanMarca().getDescripcion());
        contaItem.setAbrev_um(beanItem.getBeanUmStock().getAbreviatura());
        contaItem.setCantidad_string("0");
        contaItem.setPesobruto(1);
        contaItem.setPesototal(0);
        contaItem.setId_um(beanItem.getBeanUmStock().getIdUm());
        contaItem.setCantidad_item(0);
        contaItem.setId_almacen(this.getIdAlmacenPartida());
        contaItem.setAlmacen(cboAlmacenPartida.getSelectedItem().toString());
        contaItem.setBeanAlmacenDestino(new BeanAlmacen(this.getIdAlmacenLlegada(),
                cboAlmacenLlegada.getSelectedItem().toString()));
        mdlGuiaTransLote.agregarGuia(contaItem);
        tblTransLote.setAllColumnPreferredWidth();
    }

    @Override
    @SuppressWarnings("unchecked")
    public void setValueSearch(Object valor, Component comp) {
        try {
            if (comp == btnBuscarConductor) {
                cargarConductor((BeanAnexo) valor);
                return;
            }
            if (comp == btnBuscarTransp) {
                cargarVehiculo((BeanVehiculo) valor);
                return;
            }
            if (comp.equals(btnBuscar)) {
                String idMotivoTraslado = this.getIdMotivoTraslado();
                if (idMotivoTraslado.equals(MotivoTrasladoEnum.TRASLADO.getValue())) {
                    cargarSolicitudTransferencia((ContaCab) valor);
                } else if (idMotivoTraslado.equals(MotivoTrasladoEnum.VENTA.getValue())) {
                    cargarGuiaVenta((List<ContaItem>) valor);
                } else if (idMotivoTraslado.equals(MotivoTrasladoEnum.DEVOLUCION.getValue())) {
                    cargarDocumentoReferencia(valor.toString().trim(), "", "");
                } else if (idMotivoTraslado.equals(MotivoTrasladoEnum.DEVOLUCION_PAQUETE.getValue())) {
                    cargarDocumentoReferencia(valor.toString().trim(), "", "");
                }
                return;
            }
            if (comp.equals(btnQuitarItem)) {
                editorLote.stopCellEditing();
                String idSecuencia = valor.toString();
                mdlGuiaVenta.reloadLotesSecuencia(idSecuencia);
                tblVenta.setAllColumnPreferredWidth();
                return;
            }
            if (comp.equals(btnAgregarItem)) {
                this.agregarItemTransferenciaLote((BeanItem) valor);
            }
        } catch (Exception e) {
            ExceptionHandler.handleException(e, logger);
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }

    private String getPrint(String codigo) {
        RnRegContaCab reg = new RnRegContaCab(path);
        String idTipoMov = reg.getIdTipoMov(codigo);

        String parametro = "SELECT "
                + " (CASE WHEN M.ID_MOTIVO_TRASLADO='001' THEN M.DIRECCION_LLEGADA ELSE NVL(A2.DIRECCION,M.DIRECCION_LLEGADA)  END)                 AS PV_DESTINO_DIRECCION "
                + " ,NVL(AL.DIRECCION,'')                                   as PV_ORIGEN_DIRECCION "
                + " ,(CASE WHEN M.ID_ESTADO = '001' THEN 'DOCUMENTO ANULADO' ELSE NVL(RC.TMP_ANEXO,(CASE WHEN M.ID_TIPO_MOV = '011' THEN M.TMP_ANEXO ELSE E.NOMBRE END)) END) AS EMPRESA "
                + " ,(CASE WHEN M.ID_ESTADO = '001' THEN 'NT' ELSE NVL(RC.TMP_RUC,(CASE WHEN M.ID_TIPO_MOV = '011' THEN M.TMP_RUC ELSE E.RUC END)) END) AS RUC_EMPRESA              "
                + " ,NVL(M.FECHA_EMISION, TO_DATE('20020101','YYYYMMDD'))     AS FECHA_EMISION "
                + " ,NVL(M.FEC_INI_TRASLADO, TO_DATE('20020101','YYYYMMDD'))  AS FEC_INI_TRASLADO "
                + " ,NVL(AN2.DESCRIPCION,'')                                  AS EMPRESA_TRANSPORTISTA "
                + " ,NVL(AN2.NUMERO,'')                                       as RUC_EMPRESA_TRANSPORTISTA "
                + " ,(CASE WHEN M.SERIE_REF1 IS NULL OR M.PREIMPRESO_REF1 IS NULL OR M.ID_TIPO_DOC_REF1 IS NULL THEN '' ELSE M.ID_TIPO_DOC_REF1 || \'/\' ||  M.SERIE_REF1 || TO_CHAR(CHR(45)) || M.PREIMPRESO_REF1 END) AS SERIE_PREIMPRESO_DOCVEN_REF "
                + " ,(CASE WHEN MAV.DESCRIPCION IS NULL OR MOV.DESCRIPCION IS NULL THEN '' ELSE MAV.DESCRIPCION || TO_CHAR(CHR(45)) || MOV.DESCRIPCION END) AS MARCA_MODELO "
                + " ,NVL(V.CONSTANCIA_INSCRIPCION,'')                         AS CONSTANCIA_INSCRIPCION "
                + " ,NVL(AN3.NRO_LICENCIA,'')                                 AS NRO_LICENCIA "
                + " ,NVL(M.ID_MOTIVO_TRASLADO,'')                             AS ID_MOTIVO_TRASLADO "
                + " ,NVL(AN3.DESCRIPCION,'')                                  AS CHOFER "
                + " ,(CASE WHEN M.SERIE_REF IS NULL OR M.PREIMPRESO_REF IS NULL THEN '' ELSE M.SERIE_REF || TO_CHAR(CHR(45)) || M.PREIMPRESO_REF END) AS SERIE_PREIMPRESO_GUIA_REF "
                + " ,NVL(V.PLACA,'')                                          AS PLACA "
                + " FROM MOV_INVENTARIO_CAB M "
                + " LEFT JOIN MOV_INVENTARIO_CAB M2 ON M.ID_TIPO_DOC_REF = M2.ID_TIPO_DOC_REF AND M.SERIE_REF = M2.SERIE_REF AND M.PREIMPRESO_REF = M2.PREIMPRESO_REF AND M2.TIPO = 'E' AND (M2.\"_ESTADO\" IS NULL OR M2.\"_ESTADO\" = 'A') ";

        if (idTipoMov.equals("010")) {
            parametro = parametro + " And (M2.Id_Tipo_Doc Is Null And M2.Serie Is Null And M2.Preimpreso Is Null) ";
        }

        parametro = parametro + " LEFT JOIN ALMACEN AL ON M.ID_ALMACEN = AL.ID_ALMACEN "
                + " LEFT JOIN ALMACEN A2 ON M2.ID_ALMACEN = A2.ID_ALMACEN "
                + " LEFT JOIN PUNTO_VENTA PVO ON AL.ID_PUNTO_VENTA = PVO.ID_PUNTO_VENTA "
                + " LEFT JOIN PUNTO_VENTA PVD ON A2.ID_PUNTO_VENTA = PVD.ID_PUNTO_VENTA "
                + " LEFT JOIN REGCONTA_CAB RC ON M.ID_REGCONTA_DOC1 = RC.ID_REGCONTA "
                + " LEFT JOIN ANEXO AN2 ON M.ID_ANEXO_EMPRESA_TRANSPORTISTA = AN2.ID_ANEXO "
                + " left join VEHICULO V on M.ID_VEHICULO = V.ID_VEHICULO "
                + " left join MARCA_VEHICULO MAV on V.ID_MARCA = MAV.ID_MARCA "
                + " LEFT JOIN MODELO_VEHICULO MOV ON V.ID_MODELO = MOV.ID_MODELO "
                + " LEFT JOIN ANEXO AN3 ON M.ID_ANEXO_TRANSPORTISTA = AN3.ID_ANEXO "
                + " LEFT JOIN EMPRESA E ON M.ID_EMPRESA = E.ID_EMPRESA "
                + " LEFT JOIN ANEXO AN4 ON M.ID_ANEXO = AN4.ID_ANEXO "
                + "  WHERE 1 = 1 "
                + " AND M.ID_TIPO_DOC_REF = '09' "
                + " AND M.TIPO = 'S' "
                + " AND M.\"_ESTADO\" = 'A' "
                + " AND M.ID_MOVIMIENTO = \'" + codigo + "\' ";

        return parametro;
    }

    private String getPrintSubreport(String codigo) {
        String parametro = " SELECT "
                + "  M.ID_MOVIMIENTO_DET              "
                + " ,M.ID_MOVIMIENTO                  "
                + " ,M.TIPO                           "
                + " ,M.ID_TIPO_MOVIMIENTO             "
                + " ,M.ID_EMPRESA                     "
                + " ,M.ID_LOCALIDAD                   "
                + " ,M.ID_ALMACEN                     "
                + " ,M.ID_TIPO_DOC                    "
                + " ,M.SERIE                          "
                + " ,M.PREIMPRESO                     "
                + " ,M.ID_ITEM                        "
                + " ,M.PRECIO_ITEM                    "
                + " ,M.CANTIDAD                       "
                + " ,M.DESCUENTO                      "
                + " ,M.AFECTO                         "
                + " ,M.NOAFECTO                       "
                + " ,M.IGV                            "
                + " ,M.MONTO                          "
                + " ,M.ID_UM                          "
                + " ,M.FLAGTIPOPROD                   "
                + " ,M.PESO_TOTAL                     "
                + " ,M.AFECTO + M.NOAFECTO AS VALORVENTA "
                + " ,M.AFECTO + M.NOAFECTO + M.IGV AS PRECIOVENTA "
                + " ,I.DESCRIPCION AS ITEM           "
                + " ,I.UM_COMPRA                     "
                + " ,I.ID_ALTERNO "
                + " ,UM.DESCRIPCION AS UNIDADMEDIDA  "
                + " ,UM.ABREV AS ABREV_UM   "
                + " ,I.ID_MARCA                       "
                + " ,MAR.DESCRIPCION AS MARCA         "
                + " ,MC.ID_ANEXO AS ID_ANEXO          "
                + " ,AN.DESCRIPCION AS ANEXO          "
                + " ,MC.FECHA_EMISION                 "
                + " ,AL.DESCRIPCION AS ALMACEN            "
                + " FROM MOV_INVENTARIO_DET M "
                + " LEFT JOIN ITEM I ON M.ID_ITEM = I.ID_ITEM "
                + " LEFT JOIN UNIDAD_MEDIDA UM ON UM.ID_UM = I.UM_COMPRA "
                + " LEFT JOIN MARCA MAR ON MAR.ID_MARCA = I.ID_MARCA "
                + " LEFT JOIN MOV_INVENTARIO_CAB MC ON M.ID_MOVIMIENTO = MC.ID_MOVIMIENTO AND M.SERIE = MC.SERIE AND M.PREIMPRESO = MC.PREIMPRESO AND M.ID_TIPO_DOC = MC.ID_TIPO_DOC "
                + " LEFT JOIN ANEXO AN ON MC.ID_ANEXO = AN.ID_ANEXO "
                + " left join ALMACEN AL on M.ID_ALMACEN = AL.ID_ALMACEN "
                + " where  M.ID_MOVIMIENTO = \'" + codigo + "\' "
                + " and M.\"_ESTADO\" = 'A' "
                + " ORDER BY I.DESCRIPCION ";

        return parametro;
    }

    @Override
    public void showMessagePrint(String codigo) {
        try {
            if (!Constans.ISIMPRESIONVENTA) {
                (new FactElectTxt(this.path, codigo, TipoDocVentaEnum.GUIA_REMISION_REMITENTE.getValue(), this.usuario)).exportTxt();
                return;
            }
            Reporte report = new Reporte(path);
            String idMotivoTraslado = this.getIdMotivoTraslado();
            if (idMotivoTraslado.equals(MotivoTrasladoEnum.VENTA.getValue())) {
                System.out.println("codigo = " + codigo);
                String rutaJasper;
                rutaJasper = Constans.PATH_RPT_GUIA;
                Map parameters = new HashMap();
                parameters.put(JRParameter.REPORT_LOCALE, Locale.US);
                Exportar exportar;
                DataSourceGuia dataSource = new DataSourceGuia();
                RnConsultas logic = new RnConsultas(path);
                List<BeanGuiaReporte> list = logic.listarGuiaReporte(codigo, "SP_LISTAR_GUIA_REPORTE");
                for (int i = 0; i < list.size(); i++) {
                    BeanGuiaReporte beanRci = list.get(i);
                    dataSource.add(beanRci);
                }
                exportar = new Exportar(parameters, dataSource, rutaJasper);
                exportar.vistaPrevia(true);
            } else {
                report.generarReporte("GuiaRemisionSys", getPrint(codigo), "", "", "",
                        getPrintSubreport(codigo), "", true, false, "Reporte GuÃ­as de RemisiÃ³n");
            }
        } catch (Exception ex) {
            ExceptionHandler.handleException(ex, logger);
            JOptionPane.showMessageDialog(this, ex.getMessage());
        }
    }

    private void changeMotivoTraslado() throws Exception {
        try {
            String idMotivoTraslado = this.getIdMotivoTraslado();
            this.changeTipoDoc(idMotivoTraslado);
            this.setVisibleComponents(idMotivoTraslado);
            newRegister();
        } catch (Exception e) {
            throw e;
        }
    }

    private void changeTipoDoc(String idMotivoTraslado) throws Exception {
        try {
            String idTipoDoc = txtTipoDoc.getText().trim();
            String idTipoDocNew;
            if (idMotivoTraslado.equals(MotivoTrasladoEnum.TRANSFERENCIA_LOTE.getValue())) {
                idTipoDocNew = TipoDocVentaEnum.TRANSFERENCIA_INTERNA_LOTE.getValue();
            } else {
                idTipoDocNew = TipoDocVentaEnum.GUIA_REMISION_REMITENTE.getValue();
            }
            if (idTipoDoc.equals(idTipoDocNew)) {
                return;
            }
            txtTipoDoc.setText(idTipoDocNew);
            loadSerieCorrelativo(idTipoDocNew);
        } catch (Exception e) {
            throw e;
        }
    }

    private void nuevoTransportista() {
        setCursor(new Cursor(Cursor.WAIT_CURSOR));
        RegisterTransportistaNuevo register = new RegisterTransportistaNuevo(frm, usuario);
        register.setPath(path);
        register.setModeRegister(Register.INSERT);
        register.setVisible(true);
        setCursor(new Cursor(Cursor.DEFAULT_CURSOR));
        String codigo = register.getResultado();
        if ((codigo != null) && !codigo.equals("")) {
            cargarConductor(codigo);
        }
    }

    private void nuevoConductor() {
        setCursor(new Cursor(Cursor.WAIT_CURSOR));

        RegisterChofer register = new RegisterChofer(frm, usuario);
        register.setPath(path);
        register.setModeRegister(Register.INSERT);
        register.setVisible(true);

        setCursor(new Cursor(Cursor.DEFAULT_CURSOR));

        String codigo = register.getResultado();

        if ((codigo != null) && !codigo.equals("")) {
            cargarConductor(codigo);
        }
    }

    private void quitarItem() {
        if (this.getIdMotivoTraslado().equals(MotivoTrasladoEnum.VENTA.getValue())) {
            this.quitarItemVenta();
        } else if (this.getIdMotivoTraslado().equals(MotivoTrasladoEnum.TRANSFERENCIA_LOTE.getValue())) {
            this.quitarItemTransferenciaLote();
        }
    }

    private void quitarItemVenta() {
        if (tblVenta.getSelectedRow() < 0) {
            return;
        }
        int xres = JOptionPane.showConfirmDialog(this, "Desea eliminar el item?", "Eliminar Item", JOptionPane.OK_CANCEL_OPTION);

        if (xres == JOptionPane.OK_OPTION) {
            int visibleRowIndex = tblVenta.getSelectedRow();
            int realRowIndex = tblVenta.convertRowIndexToModel(visibleRowIndex);

            mdlGuiaVenta.eliminarGuiaTransferencia(realRowIndex);
            tblVenta.setAllColumnPreferredWidth();
        }
    }

    private void quitarItemTransferenciaLote() {
        if (tblTransLote.getSelectedRow() < 0) {
            return;
        }
        int xres = JOptionPane.showConfirmDialog(this, "Desea eliminar el item?", "Eliminar Item", JOptionPane.OK_CANCEL_OPTION);

        if (xres == JOptionPane.OK_OPTION) {
            int visibleRowIndex = tblTransLote.getSelectedRow();
            int realRowIndex = tblTransLote.convertRowIndexToModel(visibleRowIndex);

            mdlGuiaTransLote.eliminarGuia(realRowIndex);
            tbltransferencia.setAllColumnPreferredWidth();
        }
    }

    private void buscarDocumento() {
        String idMotivoTraslado = this.getIdMotivoTraslado();
        if (idMotivoTraslado.equals(MotivoTrasladoEnum.TRASLADO.getValue())) {
            BuscarSolicitudTransferencia buscardoc = new BuscarSolicitudTransferencia(frm, this, usuario, path);
            buscardoc.cargarTabla(btnBuscar);
        } else if (idMotivoTraslado.equals(MotivoTrasladoEnum.VENTA.getValue())) {
            BuscarOrdenRecojo buscarOrdenRecojo = new BuscarOrdenRecojo(frm, this, usuario, path);
            buscarOrdenRecojo.cargarTabla(btnBuscar);
        } else if (idMotivoTraslado.equals(MotivoTrasladoEnum.DEVOLUCION.getValue())
                || idMotivoTraslado.equals(MotivoTrasladoEnum.DEVOLUCION_PAQUETE.getValue())) {
            BuscarNCEntregadoProveedor buscardoc = new BuscarNCEntregadoProveedor(frm, this, usuario, path);
            buscardoc.cargarTabla(btnBuscar, idMotivoTraslado);
        }
    }

    private void changePuntoVenta() {
        if (cboPuntoVenta.getItemCount() == 0) {
            return;
        }
        if (cboPuntoVenta.getSelectedIndex() == 0) {
            cboAlmacenLlegada.removeAllItems();
            cboAlmacenLlegada.setEnabled(false);
            txtIdlocalidadllegada.setText("");
        } else {
            if (mode == UPDATE || mode == INSERT || mode == CLONE) {
                cboAlmacenLlegada.setEnabled(true);
            }
            txtIdlocalidadllegada.setText(xpuntoventa.get(cboPuntoVenta.getSelectedIndex() - 1).getId_localidad());
            loadAlmacenLlegada(this.getIdPuntoVenta());
        }
    }

    private void formAgregarItem() {
        if (this.getIdAlmacenPartida().isEmpty()) {
            JOptionPane.showMessageDialog(this, "Seleccione almacen de Partida");
            return;
        }
        if (this.getIdAlmacenLlegada().isEmpty()) {
            JOptionPane.showMessageDialog(this, "Seleccione almacen de Llegada");
            return;
        }
        FormBuscarItem objBuscarItem = new FormBuscarItem(this.frm, this, path, btnAgregarItem,
                usuario, true, this.getIdAlmacenPartida());
        objBuscarItem.setVisible(true);
    }

    @Override
    public void actionPerformed(ActionEvent e) {
        if (e.getSource().equals(btnNuevoTransportista)) {
            this.nuevoTransportista();
        }
        if (e.getSource().equals(btnNuevoConductor)) {
            this.nuevoConductor();
        }
        if (e.getSource().equals(btnQuitarItem)) {
            this.quitarItem();
        }
        if (e.getSource().equals(btnBuscar)) {
            this.buscarDocumento();
        }

        if (e.getSource().equals(btnBuscarConductor)) {
            FormBuscarAnexo objBuscarAnexo = new FormBuscarAnexo(frm, this, path, btnBuscarConductor, usuario, "7");
            objBuscarAnexo.setVisible(true);
        }

        if (e.getSource().equals(btnBuscarTransp)) {
            FormBuscarVehiculo objBuscar = new FormBuscarVehiculo(frm, this, path, btnBuscarTransp, usuario);
            objBuscar.setVisible(true);
        }
        if (e.getSource().equals(cboPuntoVenta)) {
            this.changePuntoVenta();
        }
        if (e.getSource().equals(btnAgregarItem)) {
            this.formAgregarItem();
        }
    }

    private boolean isMotivoDevoluciones(String idMotivoTraslado) {
        return idMotivoTraslado.equals(MotivoTrasladoEnum.DEVOLUCION.getValue())
                || idMotivoTraslado.equals(MotivoTrasladoEnum.DEVOLUCION_PAQUETE.getValue());
    }

    private boolean isMotivoTransferencia(String idMotivoTraslado) {
        return idMotivoTraslado.equals(MotivoTrasladoEnum.TRASLADO.getValue())
                || idMotivoTraslado.equals(MotivoTrasladoEnum.TRANSFERENCIA_LOTE.getValue());
    }

    public void setVisibleComponents(String idMotivoTraslado) {
        boolean isMotivoTransferencia = this.isMotivoTransferencia(idMotivoTraslado);
        boolean isMotivoDevoluciones = this.isMotivoDevoluciones(idMotivoTraslado);
        boolean isMotivoVenta = idMotivoTraslado.equals(MotivoTrasladoEnum.VENTA.getValue());
        chkSeleccionar.setVisible(isMotivoVenta);
        txtIdRegconta.setVisible(isMotivoDevoluciones);
        txtSerieRegconta.setVisible(isMotivoDevoluciones);
        lblRegconta.setVisible(isMotivoDevoluciones);
        txtPreimpresoRegconta.setVisible(isMotivoDevoluciones);
        this.cboAlmacenPartida.setVisible(!isMotivoDevoluciones);
        this.txtAlmacen.setVisible(isMotivoDevoluciones);
        boolean isMotivoTransLote = idMotivoTraslado.equals(MotivoTrasladoEnum.TRANSFERENCIA_LOTE.getValue());
        btnQuitarItem.setVisible(isMotivoVenta || isMotivoTransLote);
        cboPuntoVenta.setVisible(isMotivoTransferencia);
        cboAlmacenLlegada.setVisible(isMotivoTransferencia);
        txtDireccionllegada.setVisible(!isMotivoTransferencia);
        lblReferencia.setVisible(!isMotivoTransLote);
        txtIdSolicitud.setVisible(!isMotivoTransLote);
        txtSerieSol.setVisible(!isMotivoTransLote);
        txtPreimpresoSol.setVisible(!isMotivoTransLote);
        pnlTransportista.setVisible(!isMotivoTransLote);
        lblBuscarDocumento.setVisible(!isMotivoTransLote);
        btnBuscar.setVisible(!isMotivoTransLote);
        btnAgregarItem.setVisible(isMotivoTransLote);
        if (idMotivoTraslado.equals(MotivoTrasladoEnum.VENTA.getValue())) {
            cardLayout.show(pnlTable, "venta");
        } else if (idMotivoTraslado.equals(MotivoTrasladoEnum.TRASLADO.getValue())) {
            cardLayout.show(pnlTable, "trans");
        } else if (idMotivoTraslado.equals(MotivoTrasladoEnum.TRANSFERENCIA_LOTE.getValue())) {
            cardLayout.show(pnlTable, "transLote");
        } else {
            cardLayout.show(pnlTable, "devol");
        }
    }

    private String getIdAnexoPorNumeroDoc(String numeroDoc) {
        try {
            RnAnexo logicAnexo = new RnAnexo(path);
            BeanAnexo beanAnexo = logicAnexo.beanAnexoImp("1", "", "", numeroDoc, "");
            if (beanAnexo == null) {
                return "";
            }
            return beanAnexo.getIdAnexo();
        } catch (Exception e) {
            ExceptionHandler.handleException(e, logger);
            return "";
        }
    }

    private String insertarGuiaTransferencia() throws Exception {
        try {
            boolean isTransferencia = this.getIdMotivoTraslado().equals(MotivoTrasladoEnum.TRASLADO.getValue());
            System.out.println("ALMACEN DESTINO " + this.getIdAlmacenLlegada());
            ContaCab rcc = new ContaCab();
            UsuarioCorrelativo userCorrelativo = this.getUsuarioCorrelativo();
            rcc.setIdTipoDocRef(txtTipoDoc.getText().trim());
            rcc.setSerieRef(userCorrelativo.getSerie());
            rcc.setPreimpresoRef(txtPreimpreso.getText().trim());
            rcc.setStIdsolicitud(txtIdSolicitud.getText().trim());
            rcc.setStIdtipodoc(isTransferencia ? "ST" : "");
            rcc.setStSerie(txtSerieSol.getText().trim());
            rcc.setStPreimpreso(txtPreimpresoSol.getText().trim());
            rcc.setIdEmpresa(usuario.getCodempresa());
            rcc.setIdLocalidad(usuario.getCodlocalidad());
            rcc.setIdAlmacen(this.getIdAlmacenPartida());
            rcc.setIdLocalidadDestino(txtIdlocalidadllegada.getText().trim());
            rcc.setIdAlmacenDestino(this.getIdAlmacenLlegada());
            rcc.setAnIdanexo(this.getIdAnexoPorNumeroDoc(txtRucCliente.getText().trim()));
            rcc.setFEmision(dcFechaEmision.getDate());
            rcc.setIdRegcontaDoc1(txtIdSolicitud.getText().trim());
            rcc.setIdTipoDocRef1(txtIdTipoDocRef.getText().trim());
            rcc.setSerieRef1(txtSerieSol.getText().trim());
            rcc.setPreimpresoRef1(txtPreimpresoSol.getText().trim());
            rcc.setIdVehiculo(txtIdvehiculo.getText().trim());
            rcc.setIdAnexoTransportista(txtIdconductor.getText().trim());
            rcc.setIdAnexoEmpresaTransportista(txtIdtransportista.getText().trim());
            rcc.setFTraslado(dcFechatraslado.getDate());
            rcc.setIdEstado(txtIdestado.getText().trim());
            rcc.setIdUsuario(usuario.getId_usuario());
            rcc.setIdMotivoTraslado(this.getIdMotivoTraslado());
            rcc.setMovDet(isTransferencia ? mdlGuiaTransferencia.getData() : mdlGuiaTransLote.getData());
            rcc.setIdPuntoventa(usuario.getCodpuntoventa());
            rcc.setDireccionllegada(txtDireccionllegada.getText().trim());
            rcc.setIdPuntoventaDestino(this.getIdPuntoVenta());
            rcc.setTipoTransferencia("");
            rcc.setAnTmpanexo(txtCliente.getText().trim());
            rcc.setAnTmpruc(usuario.getRuc());
            rcc.setIdCorrelativo(userCorrelativo.getIdCorrelativo());
            RnMovInventarioCab logic = new RnMovInventarioCab(path);
            return logic.insertarGuiaTransferencia(rcc);
        } catch (Exception e) {
            throw e;
        }
    }

    private String getIdPuntoVenta() {
        if (cboPuntoVenta.getSelectedIndex() > 0) {
            return xpuntoventa.get(cboPuntoVenta.getSelectedIndex() - 1).getId_punto_venta();
        }
        return "";
    }

    private String getIdAlmacenPartida() {
        if (cboAlmacenPartida.getSelectedIndex() > 0) {
            return xAlmacenPartida.get(cboAlmacenPartida.getSelectedIndex() - 1).getIdAlmacen();
        }
        return "";
    }

    private String getIdAlmacenLlegada() {
        if (cboAlmacenLlegada.getSelectedIndex() > 0) {
            return xAlmacenLlegada.get(cboAlmacenLlegada.getSelectedIndex() - 1).getIdAlmacen();
        }
        return "";
    }

    private String insertarGuiaVenta() throws Exception {
        try {
            UsuarioCorrelativo userCorrelativo = this.getUsuarioCorrelativo();
            ContaCab r = new ContaCab();
            r.setIdEmpresa(usuario.getCodempresa());
            r.setIdLocalidad(usuario.getCodlocalidad());
            r.setIdAlmacen(this.getIdAlmacenPartida());
            r.setDireccionllegada(txtDireccionllegada.getText().trim());
            r.setIdPuntoventa(usuario.getCodpuntoventa());
            r.setIdUsuario(usuario.getId_usuario());
            r.setAnIdanexo(txtIdanexo.getText().trim());
            r.setFEmision(dcFechaEmision.getDate());
            r.setFTraslado(dcFechatraslado.getDate());
            r.setSerie(userCorrelativo.getSerie());
            r.setPreimpreso(txtPreimpreso.getText().trim());
            r.setIdTipoDoc(txtTipoDoc.getText().trim());
            r.setIdRegcontaDoc1(txtIdSolicitud.getText().trim());
            r.setSerieRef1(this.getIdMotivoTraslado().equals(MotivoTrasladoEnum.VENTA.getValue()) ? txtSerieSol.getText().trim() : "");
            r.setIdTipoDocRef1(txtIdTipoDocRef.getText().trim());
            r.setPreimpresoRef1(this.getIdMotivoTraslado().equals(MotivoTrasladoEnum.VENTA.getValue()) ? ((txtPreimpresoSol.getText().trim().length() == 10) ? txtPreimpresoSol.getText().trim() : "") : "");
            r.setIdVehiculo(txtIdvehiculo.getText().trim());
            r.setIdAnexoTransportista(txtIdconductor.getText().trim());
            r.setIdAnexoEmpresaTransportista(txtIdtransportista.getText().trim());
            r.setAnTmpanexo(txtCliente.getText().trim());
            r.setAnTmpruc(txtRucCliente.getText().trim());
            r.setIdCorrelativo(userCorrelativo.getIdCorrelativo());

            List<ContaItem> lista = this.getListGuiaVenta();
            if (lista.isEmpty()) {
                JOptionPane.showMessageDialog(null, "Seleccione items a despachar");
                return "";
            }
            ContaItem docBean = lista.get(0);
            if (!validarFechas(docBean.getF_emision(), r.getFEmision())) {
                return "errorFechaRecojo";
            }
            if (!this.isValidGuiaVenta(lista, docBean)) {
                return "";
            }
            String codigoMovCab;
            r.setMovDet(lista);
            RnMovInventarioCab logic = new RnMovInventarioCab(path);
            codigoMovCab = logic.insertarGuiaVenta(r);
            LogicControlDoc log = new LogicControlDoc(path);
            ContaItem beanItemFirst = r.getMovDet().get(0);
            String msg = log.regularizarEstadoXDocAtendido(beanItemFirst.getId_tipo_doc(), beanItemFirst.getSerie(), beanItemFirst.getPreimpreso());
            msg = msg + "\n" + codigoMovCab + "\n";
            msg = msg + "Tipo Doc: " + beanItemFirst.getId_tipo_doc() + "\n";
            msg = msg + "Serie: " + beanItemFirst.getSerie() + "\n";
            msg = msg + "PreImpreso: " + beanItemFirst.getPreimpreso();
            JOptionPane.showMessageDialog(this, msg);
            return codigoMovCab;
        } catch (Exception e) {
            throw e;
        }
    }

    private boolean isValidGuiaVenta(List<ContaItem> lista, ContaItem docBean) throws Exception {
        try {
            List<ControlDoc> listaValida = (new LogicControlDoc(path)).listaItemDocAlmacenDespacho(docBean.getId_tipo_doc(), docBean.getSerie(), docBean.getPreimpreso());
            for (int i = 0; i < lista.size(); i++) {
                ContaItem item = lista.get(i);
                for (int j = 0; j < listaValida.size(); j++) {
                    ControlDoc doc = listaValida.get(j);
                    if (item.getId_item().equalsIgnoreCase(doc.getIdItemVenta()) && item.getId_almacen().equalsIgnoreCase(doc.getIdAlmacenVenta())) {
                        BigDecimal cantidadADespachar = BigDecimal.valueOf(Double.valueOf(item.getCantidad_despachar()));
                        BigDecimal xdespachar = doc.getResultado();
                        if (xdespachar.compareTo(cantidadADespachar) == -1) {
                            JOptionPane.showMessageDialog(null, "Error al validar Ingreso, \n Quiza el Documento se atendio totalmente");
                            return false;
                        }
                        if ((new LogicConfigItemAlmacen(path)).isValidaConfig(item.getId_item(), item.getId_almacen(), "DESPACHO")) {
                            JOptionPane.showConfirmDialog(null, "Comuniquese con Logistica \n Item: " + item.getId_item() + " desactivado en \n almacen: " + item.getAlmacen() + " \n activese la configuraciÃ³n para Despacho", "Alerta", JOptionPane.WARNING_MESSAGE);
                            return false;
                        }
                    }
                }
            }
            return true;
        } catch (Exception e) {
            throw e;
        }
    }

    private List<ContaItem> getListGuiaVenta() {
        List<ContaItem> listaItem = mdlGuiaVenta.getData();
        List<ContaItem> lista = new ArrayList();
        Iterator<ContaItem> iterLista = listaItem.iterator();
        while (iterLista.hasNext()) {
            ContaItem contItem = iterLista.next();
            if (contItem.isSeleccionado()) {
                lista.add(contItem);
            }
        }
        return lista;
    }

    @Override
    public String executeInsert() {
        editorLote.stopCellEditing();
        editorDevolucion.stopCellEditing();
        editorTransferencia.stopCellEditing();
        editorTransLote.stopCellEditing();
        try {
            String idMotivoTraslado = this.getIdMotivoTraslado();
            if (idMotivoTraslado.equals(MotivoTrasladoEnum.TRASLADO.getValue())
                    || idMotivoTraslado.equals(MotivoTrasladoEnum.TRANSFERENCIA_LOTE.getValue())) {
                return this.insertarGuiaTransferencia();
            } else if (idMotivoTraslado.equals(MotivoTrasladoEnum.VENTA.getValue())) {
                return this.insertarGuiaVenta();
            } else if (idMotivoTraslado.equals(MotivoTrasladoEnum.DEVOLUCION.getValue())
                    || idMotivoTraslado.equals(MotivoTrasladoEnum.DEVOLUCION_PAQUETE.getValue())) {
                return this.insertDevolucion();
            }

            return "";
        } catch (Exception ex) {
            JOptionPane.showMessageDialog(this, ex.getMessage());
            ExceptionHandler.handleException(ex, logger);
            return "";
        } finally {
            try {
                (new LogicStock(path)).regularizarStock(Main.anio);
                System.out.println(Main.anio);
            } catch (ClassNotFoundException ex) {
                ExceptionHandler.handleException(ex, logger);
            } catch (InstantiationException ex) {
                ExceptionHandler.handleException(ex, logger);
            } catch (IllegalAccessException ex) {
                ExceptionHandler.handleException(ex, logger);
            } catch (Exception ex) {
                ExceptionHandler.handleException(ex, logger);
            }
        }

    }

    private String insertDevolucion() throws Exception {
        try {
            UsuarioCorrelativo userCorrelativo = this.getUsuarioCorrelativo();
            ContaCab m = new ContaCab();
            m.setIdEmpresa(usuario.getCodempresa());
            m.setIdLocalidad(usuario.getCodlocalidad());
            m.setIdPuntoventa(usuario.getCodpuntoventa());
            m.setIdAlmacen(txtIdAlmacen.getText());
            m.setIdRegcontaDoc1(txtIdRegconta.getText().trim());
            m.setIdTipoDocRef1(txtIdTipoDocRef.getText().trim());
            m.setSerieRef1(txtSerieRegconta.getText().trim());
            m.setPreimpresoRef1(txtPreimpresoRegconta.getText().trim());
            m.setIdTipoDocRef(txtTipoDoc.getText().trim());
            m.setSerieRef(userCorrelativo.getSerie());
            m.setPreimpresoRef(txtPreimpreso.getText().trim());
            m.setAnIdanexo(txtIdanexo.getText().trim());
            m.setFEmision(dcFechaEmision.getDate());
            m.setIdTipoMov("012");
            m.setIdAnexoTransportista(txtIdconductor.getText().trim());
            m.setDireccionllegada(txtDireccionllegada.getText().trim());
            m.setIdVehiculo(txtIdvehiculo.getText().trim());
            m.setIdEstado(txtIdestado.getText().trim());
            m.setFTraslado(dcFechatraslado.getDate());
            m.setIdUsuario(usuario.getId_usuario());
            m.setMovDet(modelTblDevolucionProveedor.getData());

            m.setIdMotivoTraslado(this.getIdMotivoTraslado());
            m.setIdAnexoEmpresaTransportista(txtIdtransportista.getText().trim());
            m.setMNoafecto(Double.valueOf(txtNoafecto.getText().trim()));
            m.setMAfecto(Double.parseDouble(txtAfecto.getText().trim()));
            m.setMIgv(Double.parseDouble(txtMigv.getText().trim()));
            m.setMonto(Double.valueOf(txtMonto.getText().trim()));
            m.setFlagigv(txtFlagigv.getText().trim());
            m.setMTipoCambio(Double.valueOf(txtTipocambio.getText().trim()));
            m.setIdMoneda(txtIdmoneda.getText().trim());
            m.setAnIdtipoanexo(idTipoAnexo);
            m.setIdSolicitud(this.idSolicitud);
            m.setIdCorrelativo(userCorrelativo.getIdCorrelativo());

            idTipoAnexo = null;
            RnMovInventarioCab logic = new RnMovInventarioCab(path);
            return logic.insertarSalidaProductosDevolucion(m);
        } catch (Exception e) {
            throw e;
        }
    }

    private boolean validarFechas(Date fechaInicio, Date fechaFin) {
        Calendar calendarIni = new GregorianCalendar();
        Calendar calendarFin = new GregorianCalendar();
        calendarIni.setTime(fechaInicio);
        calendarFin.setTime(fechaFin);
        int annoInicio = calendarIni.get(Calendar.YEAR);
        int mesInicio = calendarIni.get(Calendar.MONTH);
        int diaInicio = calendarIni.get(Calendar.DAY_OF_MONTH);
        int annoFin = calendarFin.get(Calendar.YEAR);
        int mesFin = calendarFin.get(Calendar.MONTH);
        int diaFin = calendarFin.get(Calendar.DAY_OF_MONTH);
        if (annoFin == annoInicio) {
            if (mesFin == mesInicio) {
                return diaFin >= diaInicio;
            }
            return mesFin > mesInicio;
        }
        return annoFin > annoInicio;
    }

    @Override
    public boolean executeDelete() {
        try {
            RnRegContaCab regla_guia = new RnRegContaCab(path);

            ContaCab m = new ContaCab();
            m.setIdMovimiento(txtIdMovimientoOrigen.getText().trim());
            m.setIdMovimientoDestino(txtIdMovimientoDestino.getText().trim());
            m.setIdUsuario(usuario.getId_usuario());
            m.setIdMotivoTraslado(this.getIdMotivoTraslado());
            System.out.println(txtIdMovimientoOrigen.getText().trim());

            if (this.getIdMotivoTraslado().equals(MotivoTrasladoEnum.VENTA.getValue())) {
                return regla_guia.eliminarSalidaGuiaVenta(m);
            } else if (this.getIdMotivoTraslado().equals(MotivoTrasladoEnum.DEVOLUCION_PAQUETE.getValue()) || this.getIdMotivoTraslado().equals(MotivoTrasladoEnum.DEVOLUCION.getValue())) {
                return regla_guia.eliminarSalidaGuiaReposicion(m);
            }
            return true;
        } catch (Exception ex) {
            ExceptionHandler.handleException(ex, logger);
            JOptionPane.showMessageDialog(null, ex.getLocalizedMessage());
            return false;
        } finally {
            try {
                (new LogicStock(path)).regularizarStock(Main.anio);
                System.out.println(Main.anio);
            } catch (ClassNotFoundException ex) {
                ExceptionHandler.handleException(ex, logger);
            } catch (InstantiationException ex) {
                ExceptionHandler.handleException(ex, logger);
            } catch (IllegalAccessException ex) {
                ExceptionHandler.handleException(ex, logger);
            } catch (Exception ex) {
                ExceptionHandler.handleException(ex, logger);
            }
        }
    }

    private void changeChkSeleccionar(ItemEvent e) {
        editorLote.stopCellEditing();
        editorDevolucion.stopCellEditing();
        editorTransferencia.stopCellEditing();
        editorTransLote.stopCellEditing();
        boolean isSelect;

        isSelect = (e.getStateChange() == ItemEvent.SELECTED);

        if (e.getItemSelectable() == chkSeleccionar) {
            for (int i = 0; i < mdlGuiaVenta.getRowCount(); i++) {
                mdlGuiaVenta.getGuiaTransferencia(i).setSeleccionado(isSelect);
                mdlGuiaVenta.getGuiaTransferencia(i).setCantidad_despachar(mdlGuiaVenta.getGuiaTransferencia(i).isSeleccionado() ? String.valueOf(mdlGuiaVenta.getGuiaTransferencia(i).getCant_pordespachar_cliente()).trim() : "");
                mdlGuiaVenta.getGuiaTransferencia(i).setPesototal(Double.valueOf(mdlGuiaVenta.getGuiaTransferencia(i).getCantidad_despachar().trim().length() > 0 ? mdlGuiaVenta.getGuiaTransferencia(i).getCantidad_despachar().trim() : "0.0") * mdlGuiaVenta.getGuiaTransferencia(i).getPesobruto());
            }

            mdlGuiaVenta.fireTableDataChanged();
        }
    }

    @Override
    public void itemStateChanged(ItemEvent e) {
        try {
            if (e.getSource().equals(chkSeleccionar)) {
                this.changeChkSeleccionar(e);
                return;
            }
            if (e.getSource().equals(cboSerie)) {
                if (this.isModeInsert()) {
                    txtPreimpreso.setText(this.getPreimpresoSerie());
                }
            }
            if (e.getSource().equals(cboMotivoTraslado)) {
                this.changeMotivoTraslado();
            }
            if (e.getSource().equals(cboAlmacenPartida) || e.getSource().equals(cboAlmacenLlegada)) {
                if (this.isModeInsert() && this.getIdMotivoTraslado().equals(MotivoTrasladoEnum.TRANSFERENCIA_LOTE.getValue())) {
                    mdlGuiaTransLote.clearTable();
                    tblTransLote.setAllColumnPreferredWidth();
                }
            }
        } catch (Exception ex) {
            ExceptionHandler.handleException(ex, logger);
            JOptionPane.showMessageDialog(this, ex.getMessage());
        }
    }

    @Override
    public String executeUpdate() {
        return "";
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
    public void showMessageErrorInsert() {
    }

    @Override
    public void showMessageErrorUpdate() {
    }

    @Override
    public void showMessageErrorDelete() {
    }

    @Override
    public boolean executeSelect() {
        return true;
    }

    @Override
    public void keyTyped(KeyEvent e) {
    }

    @Override
    public void keyReleased(KeyEvent e) {
    }

    @Override
    public void focusGained(FocusEvent e) {
    }

    @Override
    public void setRegisterEnabled(boolean e) {
        cboMotivoTraslado.setEnabled(e);
        cboSerie.setVisible(e);
        txtSerie.setVisible(!e);
        cboAlmacenPartida.setEnabled(e);
        cboPuntoVenta.setEnabled(e);
        btnQuitarItem.setEnabled(e);
        btnAgregarItem.setEnabled(e);
        tbltransferencia.setEnabled(e);
        tblTransLote.setEnabled(e);
        tblVenta.setEnabled(e);
        btnNuevoConductor.setEnabled(e);
        btnNuevoTransportista.setEnabled(e);
        btnBuscarConductor.setEnabled(e);
        btnBuscarTransp.setEnabled(e);
        btnBuscar.setEnabled(e);
        dcFechaEmision.setEnabled(e);
        dcFechatraslado.setEnabled(e);
        chkSeleccionar.setEnabled(e);
    }

    @Override
    public void setRegisterEditable(boolean e) {
        tbltransferencia.setColumnEditable(4, e);
        tbltransferencia.setColumnEditable(5, e);
        tblTransLote.setColumnEditable(4, e);
        tblTransLote.setColumnEditable(5, e);
        tblDevolucion.setColumnEditable(0, e);
        tblDevolucion.setColumnEditable(15, e);
        tblVenta.setColumnEditable(0, e);
        tblVenta.setColumnEditable(6, e);
        tblVenta.setColumnEditable(11, e);
        txtPreimpreso.setEditable(e);
        txtSerieSol.setEditable(e);
        txtPreimpresoSol.setEditable(e);
        txtDireccionllegada.setEditable(e);
        if (Constans.ISBOTICA) {
            tblDevolucion.setColumnEditable(6, e);
            tblDevolucion.setSpecificCellEditor(0, 6, editorDevolucion);
            tblDevolucion.getColumnModel().getColumn(6).setCellRenderer(editorDevolucion);
            tbltransferencia.setColumnEditable(5, e);
            tbltransferencia.setSpecificCellEditor(0, 5, editorTransferencia);
            tbltransferencia.getColumnModel().getColumn(5).setCellRenderer(editorTransferencia);
            tblTransLote.setSpecificCellEditor(0, 5, editorTransLote);
            tblTransLote.getColumnModel().getColumn(5).setCellRenderer(editorTransLote);
            if (Constans.IS_LOTE_RESERVA) {
                tblVenta.getColumnModel().getColumn(11).setCellEditor(editorLote);
                tblVenta.getColumnModel().getColumn(11).setCellRenderer(editorLote);
            }
        }
    }

    private void loadTipoGuia() {
        RnMotivoTraslado regla_motivo = new RnMotivoTraslado(path);
        if (xMotivotraslado != null) {
            xMotivotraslado.clear();
        } else {
            xMotivotraslado = new ArrayList();
        }
        xMotivotraslado.addAll(regla_motivo.BuscaMotivoTraslado(0, "", "S"));

        cboMotivoTraslado.removeAllItems();

        for (int i = 0; i < xMotivotraslado.size(); i++) {
            cboMotivoTraslado.addItem(xMotivotraslado.get(i).getDescripcion());
        }

        cargarTipoGuia(MotivoTrasladoEnum.VENTA.getValue());
    }

    private void loadAlmacenPartida(String xcodPuntoVenta) {
        try {
            RnAlmacen reglaAlmacen = new RnAlmacen(path);
            if (xAlmacenPartida != null) {
                xAlmacenPartida.clear();
            } else {
                xAlmacenPartida = new ArrayList();
            }
            xAlmacenPartida.addAll(reglaAlmacen.listar("", "", xcodPuntoVenta));

            cboAlmacenPartida.removeAllItems();
            cboAlmacenPartida.addItem("--- Seleccione un Almacen ---");

            for (int i = 0; i < xAlmacenPartida.size(); i++) {
                cboAlmacenPartida.addItem(xAlmacenPartida.get(i).getDescripcion());
            }

            cboAlmacenPartida.setSelectedIndex(0);
        } catch (Exception e) {
            ExceptionHandler.handleException(e, logger);
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }

    private void loadPuntoVenta(String id_empresa) {
        try {
            RnPuntoVenta regla_PuntoVenta = new RnPuntoVenta(path);

            if (xpuntoventa != null) {
                xpuntoventa.clear();
            } else {
                xpuntoventa = new ArrayList();
            }
            xpuntoventa.addAll(regla_PuntoVenta.listar(id_empresa, "", "", "", "", "", "", ""));

            cboPuntoVenta.removeAllItems();
            cboPuntoVenta.addItem("Seleccione un Punto de Venta");

            for (int i = 0; i < xpuntoventa.size(); i++) {
                cboPuntoVenta.addItem(xpuntoventa.get(i).getDescripcion_puntoventa());
            }

            cboPuntoVenta.setSelectedIndex(0);
        } catch (Exception e) {
            ExceptionHandler.handleException(e, logger);
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }

    private void loadAlmacenLlegada(String xcodPuntoVenta) {
        try {
            RnAlmacen reglaAlmacen = new RnAlmacen(path);
            if (xAlmacenLlegada != null) {
                xAlmacenLlegada.clear();
            } else {
                xAlmacenLlegada = new ArrayList();
            }
            xAlmacenLlegada.addAll(reglaAlmacen.listar("", "", xcodPuntoVenta));
            cboAlmacenLlegada.removeAllItems();
            cboAlmacenLlegada.addItem("--- Seleccione un Almacen ---");

            for (int i = 0; i < xAlmacenLlegada.size(); i++) {
                cboAlmacenLlegada.addItem(xAlmacenLlegada.get(i).getDescripcion());
            }

            cboAlmacenLlegada.setSelectedIndex(0);
        } catch (Exception e) {
            ExceptionHandler.handleException(e, logger);
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }

    private void cargarTipoGuia(String codTipoGuia) {
        if (xMotivotraslado != null) {
            for (int i = 0; i < xMotivotraslado.size(); i++) {
                if (xMotivotraslado.get(i).getCodigo().equals(codTipoGuia)) {
                    cboMotivoTraslado.setSelectedIndex(i);
                    break;
                }
            }
        }
    }

    private void cargarAlmacenPartida(String xcodiEmpresa) {
        if (xAlmacenPartida != null) {
            for (int i = 0; i < xAlmacenPartida.size(); i++) {
                if (xAlmacenPartida.get(i).getIdAlmacen().equals(xcodiEmpresa)) {
                    cboAlmacenPartida.setSelectedIndex(i + 1);
                    break;
                }
            }
        }
    }

    private void cargarAlmacenLlegada(String xcodiEmpresa) {
        if (xAlmacenLlegada != null) {
            for (int i = 0; i < xAlmacenLlegada.size(); i++) {
                if (xAlmacenLlegada.get(i).getIdAlmacen().equals(xcodiEmpresa)) {
                    cboAlmacenLlegada.setSelectedIndex(i + 1);
                    break;
                }
            }
        }
    }

    private void cargarPuntoVenta(String codPuntoVenta) {
        if (xpuntoventa != null && !codPuntoVenta.equals("")) {
            for (int i = 0; i < xpuntoventa.size(); i++) {
                if (xpuntoventa.get(i).getId_punto_venta().equals(codPuntoVenta)) {
                    cboPuntoVenta.setSelectedIndex(i + 1);
                    break;
                }
            }
        }
    }

    @Override
    public boolean executeAnular() {
        try {
            RnRegContaCab regla_guia = new RnRegContaCab(path);
            ContaCab m = new ContaCab();
            m.setIdMovimiento(txtIdMovimientoOrigen.getText().trim());
            m.setIdMotivoTraslado(this.getIdMotivoTraslado());
            m.setIdUsuario(usuario.getId_usuario());
            String idMotivoTraslado = this.getIdMotivoTraslado();
            RnMovInventarioCab logic = new RnMovInventarioCab(path);
            if (idMotivoTraslado.equals(MotivoTrasladoEnum.VENTA.getValue())) {
                return logic.anularSalidaGuiaVenta(m);
            }
            if (idMotivoTraslado.equals(MotivoTrasladoEnum.TRANSFERENCIA_LOTE.getValue())) {
                return logic.anularGuiaTransferenciaLote(txtIdMovimientoOrigen.getText().trim(),
                        txtIdMovimientoDestino.getText().trim(), usuario.getId_usuario());
            }
            if (idMotivoTraslado.equals(MotivoTrasladoEnum.DEVOLUCION_PAQUETE.getValue()) || idMotivoTraslado.equals(MotivoTrasladoEnum.DEVOLUCION.getValue())) {
                return regla_guia.anularReposicionDevRep(m);
            }
            return regla_guia.anular(txtTipoDoc.getText().trim(), txtSerie.getText(), txtPreimpreso.getText().trim(), this.getIdMotivoTraslado(),
                    this.getIdAlmacenPartida(), this.getIdAlmacenLlegada(), usuario.getCodempresa(), usuario.getId_usuario());
        } catch (Exception ex) {
            ExceptionHandler.handleException(ex, logger);
            JOptionPane.showMessageDialog(null, ex.getMessage());
            return false;
        } finally {
            this.regularizarStock();
        }
    }

    private void regularizarStock() {
        try {
            (new LogicStock(path)).regularizarStock(Main.anio);
        } catch (InstantiationException ex) {
            ExceptionHandler.handleException(ex, logger);
            JOptionPane.showMessageDialog(this, ex.getMessage());
        } catch (IllegalAccessException ex) {
            ExceptionHandler.handleException(ex, logger);
            JOptionPane.showMessageDialog(this, ex.getMessage());
        } catch (Exception ex) {
            ExceptionHandler.handleException(ex, logger);
            JOptionPane.showMessageDialog(this, ex.getMessage());
        }
    }

    @Override
    public void setFecha(Date fechaInicio, Date fechaFin) {
        super.fechaFin = fechaFin;
        super.fechaInicio = fechaInicio;

        dcFechaEmision.setSelectableDateRange(fechaInicio, fechaFin);
        dcFechatraslado.setSelectableDateRange(fechaInicio, fechaFin);

        if ((fechaInicio.getMonth() == new Date().getMonth())
                && (fechaInicio.getYear() == new Date().getYear())) {
            dcFechaEmision.setDate(Util.getDateNow());
            dcFechatraslado.setDate(Util.getDateNow());
        } else {
            dcFechaEmision.setDate(fechaInicio);
            dcFechatraslado.setDate(fechaInicio);
        }
    }

    @Override
    public void keyPressed(KeyEvent e) {
        if (e.getKeyCode() == KeyEvent.VK_F5) {
            btnBuscar.requestFocus();
            btnBuscar.doClick();
        }
    }

    @Override
    public void focusLost(FocusEvent e) {
        if (e.getSource() == txtPreimpreso && txtPreimpreso.getText().trim().length() > 0) {
            String preimpreso = "0000000000" + txtPreimpreso.getText().trim();
            String nuevapreimpreso = preimpreso.substring(preimpreso.length() - 10, preimpreso.length());
            txtPreimpreso.setText(nuevapreimpreso);
        }
    }

    @Override
    public void loadCombo() {
        try {
            loadTipoGuia();
            txtTipoDoc.setText(TipoDocVentaEnum.GUIA_REMISION_REMITENTE.getValue());
            FxTipoDocVenta.buscarTipoDocVenta(txtTipoDoc, txtTipoDocDesc, false, (Main) frm, path, this);
            loadSerieCorrelativo(txtTipoDoc.getText());
            loadAlmacenPartida(usuario.getCodpuntoventa());
            loadPuntoVenta(usuario.getCodempresa());
        } catch (Exception e) {
            ExceptionHandler.handleException(e, logger);
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }

    private boolean isModeInsert() {
        return this.mode == INSERT;
    }

    private void cargarDocumentoReferencia(String id_regconta, String serie, String preimpreso) {
        try {
            ContaCab r = new ContaCab();
            r.setRcIdregconta(id_regconta);
            this.idSolicitud = id_regconta;
            r.setSerie(serie);
            r.setPreimpreso(preimpreso);
            r.setFEmision(DateTime.format(1901, 0, 1));
            r.setFInicial(DateTime.format(1901, 0, 1));
            r.setFFinal(DateTime.format(1901, 0, 1));
            List<ContaItem> list;
            LogicSolicitudDev logicDev = new LogicSolicitudDev(path);
            modelTblDevolucionProveedor.clearTable();
            if (this.getIdMotivoTraslado().equals(MotivoTrasladoEnum.DEVOLUCION.getValue())) {
                list = logicDev.listarDetalleSolicitud(id_regconta);
            } else {
                list = logicDev.listarDetalleSolicitudPq(id_regconta);
            }
            if (!list.isEmpty()) {
                r.setIdPuntoventa(usuario.getCodpuntoventa());
                r.setTieneCantPordevolverProveedor("SI");
                modelTblDevolucionProveedor.agregarVectorGuiaTransferencia(list);
                idTipoAnexo = "1";
                List listaReg = logicDev.buscarSolicitud(id_regconta);
                SolicitudDevolucion sol = (SolicitudDevolucion) listaReg.get(0);
                RegContaCab regContaCab;
                regContaCab = sol.getRegcontaCab();
                txtIdSolicitud.setText(sol.getIdSolicitud().toString());
                txtIdRegconta.setText(regContaCab.getId_regconta());
                txtSerieSol.setText(sol.getSerie());
                txtPreimpresoSol.setText(sol.getPreimpreso());
                txtIdTipoDocRef.setText(regContaCab.getId_tipo_doc());
                txtSerieRegconta.setText(regContaCab.getSerie());
                txtPreimpresoRegconta.setText(regContaCab.getPreimpreso());
                txtIdanexo.setText(regContaCab.getId_anexo());
                txtDireccionllegada.setText(regContaCab.getTmp_direccion());
                txtCliente.setText(regContaCab.getTmp_anexo());
                txtRucCliente.setText(regContaCab.getTmp_ruc());
                txtMigv.setText(String.valueOf(regContaCab.getM_igv()));
                txtMonto.setText(String.valueOf(regContaCab.getM_monto()));
                txtNoafecto.setText(String.valueOf(regContaCab.getM_afecto()));
                txtAfecto.setText(String.valueOf(regContaCab.getM_noafecto()));
                txtTipocambio.setText(String.valueOf(regContaCab.getM_tipocambio()));
                System.out.println("tc = " + txtTipocambio.getText());
                txtIdmoneda.setText(String.valueOf(regContaCab.getId_moneda()));
                txtAlmacen.setText(sol.getAlmacenDescripcion());
                txtIdAlmacen.setText(sol.getIdAlmacen());
                tblDevolucion.setAllColumnPreferredWidth();

            } else {
                JOptionPane.showMessageDialog(new JFrame(), "No se encontrÃ³ documento", usuario.getDescriempresa(), JOptionPane.WARNING_MESSAGE);
            }
        } catch (Exception e) {
            ExceptionHandler.handleException(e, logger);
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }

    private String getPreimpresoSerie() {
        ObjectItem obj = (ObjectItem) cboSerie.getSelectedItem();
        if (obj == null) {
            return "";
        }
        UsuarioCorrelativo uc = (UsuarioCorrelativo) obj.getObjItem();
        return Util.getPreimpresoCorrelativo(uc.getPreimpreso());
    }

    private void cargarGuiaVenta(List<ContaItem> m) {
        try {
            ContaCab r = new ContaCab();
            r.setRcIdregconta(m.get(0).getId_regcontacab());
            r.setFEmision(DateTime.format(1901, 0, 1));
            r.setFInicial(DateTime.format(1901, 0, 1));
            r.setFFinal(DateTime.format(1901, 0, 1));
            List<ContaCab> listVenta = (new RnRegContaCab(path)).listarDocumentosVenta(r);
            if (listVenta.isEmpty()) {
                return;
            }
            ContaCab regContaCab = listVenta.get(0);
            txtIdSolicitud.setText(regContaCab.getRcIdregconta());
            txtIdTipoDocRef.setText(regContaCab.getIdTipoDoc());
            txtSerieSol.setText(regContaCab.getSerie());
            txtPreimpresoSol.setText(regContaCab.getPreimpreso());
            txtIdanexo.setText(regContaCab.getAnIdanexo());
            txtDireccionllegada.setText(regContaCab.getAnTmpdireccion());
            txtCliente.setText(regContaCab.getAnTmpanexo());
            txtRucCliente.setText(regContaCab.getAnTmpruc());
            txtMigv.setText(String.valueOf(regContaCab.getMIgv()));
            txtMonto.setText(String.valueOf(regContaCab.getMonto()));
            txtNoafecto.setText(String.valueOf(regContaCab.getMNoafecto()));
            txtAfecto.setText(String.valueOf(regContaCab.getMAfecto()));
            txtMpercepcion.setText(String.valueOf(regContaCab.getMPercepcion()));
            txtTipocambio.setText(String.valueOf(regContaCab.getMTipoCambio()));
            txtIdmoneda.setText(String.valueOf(regContaCab.getIdMoneda()));
            txtFlagigv.setText(regContaCab.getFlagigv());
            cargarAlmacenPartida(m.get(0).getId_almacen());
            dcFechaEmision.setDate(Util.getDateNow());
            dcFechatraslado.setDate(Util.getDateNow());

            r.setIdPuntoventa(usuario.getCodpuntoventa());
            r.setTieneCantPordespacharCliente("SI");
            r.setIdAlmacen(m.get(0).getId_almacen());
            mdlGuiaVenta.clearTable();
            chkSeleccionar.setSelected(false);
            mdlGuiaVenta.agregarVectorGuiaTransferencia(this.getItemsPorVenta(r));
            chkSeleccionar.setSelected(true);
            tblVenta.setAllColumnPreferredWidth();
            chkSeleccionar.requestFocus();
        } catch (Exception e) {
            ExceptionHandler.handleException(e, logger);
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }

    private List<ContaItem> getItemsPorVenta(ContaCab r) throws Exception {
        try {
            RnRegContaCab regla = new RnRegContaCab(path);
            List<ContaItem> listDetatle = regla.listarRegContaDet(r);
            if (Constans.ISBOTICA && Constans.IS_LOTE_RESERVA) {
                this.setLotesItemReserva(listDetatle, r.getRcIdregconta());
            }
            return listDetatle;
        } catch (Exception e) {
            throw e;
        }
    }

    private void setLotesItemReserva(List<ContaItem> listDetatle, String idRegconta) throws Exception {
        try {
            LogicLote logicLote = new LogicLote(path);
            List<Lote> lotes = logicLote.lotesPorVenta(idRegconta);
            for (ContaItem item : listDetatle) {
                item.setListaLotes(this.getLotesBySecuencia(lotes, item.getId_secuencia()));
                item.setCantidadDespacharLote();
            }
        } catch (Exception e) {
            throw e;
        }
    }

    private ArrayList<Lote> getLotesBySecuencia(List<Lote> lotes, String idSecuencia) {
        ArrayList<Lote> result = new ArrayList();
        for (Lote lote : lotes) {
            if (lote.getIdSecuencia().equals(idSecuencia)) {
                result.add(lote);
            }
        }
        return result;
    }

    private void cargarSolicitudTransferencia(ContaCab bean) throws Exception {
        try {
            RnRegContaCab regla = new RnRegContaCab(path);
            cargarAlmacenPartida(bean.getIdAlmacen());
            cargarPuntoVenta(bean.getIdPuntoventaDestino());
            cargarAlmacenLlegada(bean.getIdAlmacenDestino());
            this.cboAlmacenLlegada.setEnabled(false);
            this.cboAlmacenPartida.setEnabled(false);
            this.cboPuntoVenta.setEnabled(false);
            txtIdSolicitud.setText(bean.getStIdsolicitud());
            txtIdTipoDocRef.setText(bean.getStIdtipodoc());
            txtSerieSol.setText(bean.getStSerie());
            txtPreimpresoSol.setText(bean.getStPreimpreso());
            List<ContaItem> v = new ArrayList();
            v.addAll(regla.listarDetalleSolicitudTransferencia(bean.getStIdsolicitud()));
            for (ContaItem contaItem : v) {
                contaItem.setId_almacen(bean.getIdAlmacen());
            }
            mdlGuiaTransferencia.clearTable();
            mdlGuiaTransferencia.agregarVectorGuia(v);
            tbltransferencia.setAllColumnPreferredWidth();
        } catch (Exception e) {
            throw e;
        }
    }

    private void cargarVehiculo(BeanVehiculo beanVehiculo) {
        try {
            txtTransportista.setText(beanVehiculo.getEmpresa());
            txtRucTransportista.setText(beanVehiculo.getNumerodoc());
            txtPlacacarro.setText(beanVehiculo.getPlaca());
            txtConstanciainscripcion.setText(beanVehiculo.getConstanciainscripcion());
            txtIdvehiculo.setText(beanVehiculo.getId_vehiculo());
            txtMarcacarro.setText(beanVehiculo.getBeanMarcaVehiculo().getDescripcion());
            txtModelocarro.setText(beanVehiculo.getBeanModeloVehiculo().getDescripcion());
            txtIdtransportista.setText(beanVehiculo.getId_anexo_empresa_transportista());
        } catch (Exception e) {
            ExceptionHandler.handleException(e, logger);
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }

    private void cargarConductor(String codigo) {
        try {
            Anexo a = new Anexo();
            a.setIdAnexo(codigo);
            a.setNumeroInicial(-1);
            a.setNumeroFinal(-1);
            a.setIdTipoAnexo("7");

            RnAnexo regla = new RnAnexo(path);
            List<Anexo> reg = regla.listarAnexo(a);

            if (reg != null && reg.size() > 0) {
                txtIdconductor.setText(reg.get(0).getIdAnexo());
                txtConductor.setText(reg.get(0).getDescripcion());
                txtNumerolicencia.setText(reg.get(0).getNrolicencia());
            }
        } catch (Exception e) {
            ExceptionHandler.handleException(e, logger);
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }

    private void cargarConductor(BeanAnexo beanConductor) {
        try {
            txtIdconductor.setText(beanConductor.getIdAnexo());
            txtConductor.setText(beanConductor.getDescripcion());
            txtNumerolicencia.setText(beanConductor.getLicencia());
        } catch (Exception e) {
            ExceptionHandler.handleException(e, logger);
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }

    private void loadSerieCorrelativo(String idTipoDoc) throws Exception {
        try {
            if (!this.isModeInsert()) {
                return;
            }
            cboSerie.removeAllItems();
            RnCorrelativo logic = new RnCorrelativo(this.path);
            List<UsuarioCorrelativo> list = logic.listarCorrelativo(usuario.getId_usuario(), usuario.getCodpuntoventa(), idTipoDoc);
            for (UsuarioCorrelativo uc : list) {
                cboSerie.addItem(new ObjectItem(uc.getSerie(), uc));
            }
        } catch (Exception e) {
            throw e;
        }
    }

    public JComboBox getCbo_serie() {
        return cboSerie;
    }

    @Override
    public void onPressEsc() {
    }

    public JButton getBtnQuitarVenta() {
        return btnQuitarItem;
    }
}

