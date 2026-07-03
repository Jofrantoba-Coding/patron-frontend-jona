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

    protected JTextField txtTipoDoc;
    protected JTextField txtTipoDocDesc;
    protected JTextField txtDireccionllegada;
    protected JTextField txtIdanexo;
    protected JTextField txtIdTipoDocRef;
    protected JTextField txtCliente;
    protected JTextField txtRucCliente;
    protected JLabel lblReferencia;
    protected JTextField txtIdSolicitud;
    protected JTextField txtIdRegconta;
    protected JTextField txtSerieRegconta;
    protected JTextField txtPreimpresoRegconta;
    protected JTextField txtIdtransportista;
    protected JTextField txtRucTransportista;
    protected JTextField txtTransportista;
    protected JTextField txtMarcacarro;
    protected JTextField txtIdlocalidadllegada;
    protected JTextField txtConductor;
    protected JTextField txtIdconductor;
    protected JTextField txtPlacacarro;
    protected JTextField txtNumerolicencia;
    protected JTextField txtConstanciainscripcion;
    protected JTextField txtModelocarro;
    protected JTextField txtIdvehiculo;
    protected JTextField txtIdestado;
    protected JTextField txtIdMovimientoOrigen;
    protected JTextField txtIdMovimientoDestino;
    protected JTextField txtSerieSol;
    protected JTextField txtPreimpresoSol;
    protected JTextField txtPreimpreso;
    protected JTextField txtMigv;
    protected JTextField txtAfecto;
    protected JTextField txtNoafecto;
    protected JTextField txtMonto;
    protected JTextField txtMpercepcion;
    protected JTextField txtFlagigv;
    protected JTextField txtTipocambio;
    protected JTextField txtIdmoneda;
    protected JCheckBox chkSeleccionar;
    protected JButton btnBuscarTransp;
    protected JButton btnQuitarItem;
    protected JButton btnAgregarItem;
    protected JButton btnNuevoTransportista;
    protected JButton btnNuevoConductor;
    protected JButton btnBuscarConductor;
    protected JButton btnBuscar;
    protected JLabel lblRegconta;
    protected JComboBox cboMotivoTraslado;
    protected List<MotivoTraslado> xMotivotraslado;
    protected JComboBox cboSerie;
    protected JTextField txtSerie;
    protected JComboBox cboAlmacenPartida;
    protected List<Almacen> xAlmacenPartida;
    protected JComboBox cboAlmacenLlegada;
    protected List<Almacen> xAlmacenLlegada;
    protected JComboBox cboPuntoVenta;
    protected List<PuntoVenta> xpuntoventa;
    protected final Usuario usuario;
    protected CTable tbltransferencia;
    protected CTable tblTransLote;
    protected CTable tblVenta;
    protected CTable tblDevolucion;
    protected GuiaTransferenciaTableModel mdlGuiaTransferencia;
    protected GuiaTransferenciaTableModel mdlGuiaTransLote;
    protected GuiaVentaTableModel mdlGuiaVenta;
    protected GuiaDevolucionProveedorTableModel modelTblDevolucionProveedor;
    public static CellEditorBtnLoteSalida editorDevolucion;
    public static CellEditorBtnLoteSalida editorTransferencia;
    public static CellEditorBtnLoteTransferencia editorTransLote;
    protected JDateChooser dcFechaEmision;
    protected JDateChooser dcFechatraslado;
    protected final UiPanelTFGuiaRemision pnltf;
    protected final JFrame frm;
    protected String idTipoAnexo = null;
    protected JTextField txtAlmacen = null;
    protected JTextField txtIdAlmacen = null;
    protected String idSolicitud;
    protected Gif gif;
    protected CardLayout cardLayout;
    protected JPanel pnlTable;
    protected final Logger logger = Logger.getLogger(UiRegisterGuiaRemision.class);
    protected CellEditorBtnLoteVenta editorLote;
    protected JPanel pnlTransportista;
    protected JLabel lblBuscarDocumento;
    protected JCheckBox chkSinTransporte;

    public UiRegisterGuiaRemision(UiPanelTFGuiaRemision pnltf, String title, Usuario usuario, JFrame frm) {
        this.usuario = usuario;
        this.frm = frm;
        this.pnltf = pnltf;
        inicialize();
    }

    protected void inicialize() {
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

    protected void initListener() {
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

    protected JPanel getPnlCenter() {
        JPanel pnlPrinc = new JPanel(new BorderLayout());
        pnlPrinc.add(this.getPnlDatos(), BorderLayout.WEST);
        pnlTransportista = this.getPnlTransportista();
        pnlPrinc.add(pnlTransportista, BorderLayout.CENTER);
        return pnlPrinc;
    }

    protected JTabbedPane getTabbedPane() {
        JTabbedPane tabb = new JTabbedPane();
        tabb.addTab("Item", this.getPnlItem());
        return tabb;
    }

    protected JPanel getPnlItem() {
        JPanel pnlPrinc = new JPanel(new BorderLayout());
        pnlPrinc.add(this.getToolBar(), BorderLayout.NORTH);
        pnlPrinc.add(this.getPnlTable(), BorderLayout.CENTER);
        return pnlPrinc;
    }

    protected JPanel getPnlTable() {
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

    protected JPanel getPnlTransferencia(CellRenderer render) {
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

    protected JPanel getPnlTransferenciaLote(CellRenderer render) {
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

    protected JPanel getPnlVenta(CellRenderer render) {
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

    protected JPanel getPnlDevol(CellRenderer render) {
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

    protected JToolBar getToolBar() {
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

    protected JPanel getPnlNorth() {
        JPanel pnlPrinc = new JPanel(new BorderLayout());
        pnlPrinc.add(this.getPnlGral(), BorderLayout.NORTH);
        pnlPrinc.add(this.getPnlCenter(), BorderLayout.CENTER);
        return pnlPrinc;
    }

    protected JPanel getPnlGral() {
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

    protected JPanel getPnlDatos() {
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

    protected JPanel getPnlTransportista() {
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
    }

    protected String getIdMotivoTraslado() {
        if (cboMotivoTraslado.getItemCount() > 0) {
            return xMotivotraslado.get(cboMotivoTraslado.getSelectedIndex()).getCodigo();
        }
        return "";
    }

    protected void loadRegisterGuiaVenta(ContaCab guiaremision, String idMotivoTranslado, CellRenderer render) throws Exception {
    }

    protected void loadRegisterGuiaTraslado(ContaCab guiaremision, String idMotivoTranslado, CellRenderer render) throws Exception {
    }

    protected void loadRegisterTransferenciaInterna(ContaCab guiaremision, String idMotivoTranslado, CellRenderer render) throws Exception {
    }

    protected void loadRegisterGuiaDevolucion(ContaCab guiaremision, String idMotivoTranslado, CellRenderer render) throws Exception {
    }

    protected void loadRegisterGuiaDevolucionPaquete(ContaCab guiaremision, String idMotivoTranslado, CellRenderer render) throws Exception {
    }

    @Override
    public boolean loadRegister() {
        return false;
    }

    @Override
    public boolean isRegisterValid() {
        return false;
    }

    protected UsuarioCorrelativo getUsuarioCorrelativo() {
        ObjectItem obj = (ObjectItem) cboSerie.getSelectedItem();
        if (obj == null) {
            return null;
        }
        return (UsuarioCorrelativo) obj.getObjItem();
    }

    protected boolean validateItemDevolucion() {
        return false;
    }

    protected BigDecimal getCantidadDevolver(ContaItem contaItem) {
        return Util.getNumberBigDecimal(contaItem.getCant_a_devolver());
    }

    protected void agregarItemTransferenciaLote(BeanItem beanItem) {
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

    protected String getPrint(String codigo) {
        return null;
    }

    protected String getPrintSubreport(String codigo) {
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
    }

    protected void changeMotivoTraslado() throws Exception {
        try {
            String idMotivoTraslado = this.getIdMotivoTraslado();
            this.changeTipoDoc(idMotivoTraslado);
            this.setVisibleComponents(idMotivoTraslado);
            newRegister();
        } catch (Exception e) {
            throw e;
        }
    }

    protected void changeTipoDoc(String idMotivoTraslado) throws Exception {
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

    protected void nuevoTransportista() {
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

    protected void nuevoConductor() {
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

    protected void quitarItem() {
    }

    protected void quitarItemVenta() {
    }

    protected void quitarItemTransferenciaLote() {
    }

    protected void buscarDocumento() {
    }

    protected void changePuntoVenta() {
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

    protected void formAgregarItem() {
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

    protected boolean isMotivoDevoluciones(String idMotivoTraslado) {
        return idMotivoTraslado.equals(MotivoTrasladoEnum.DEVOLUCION.getValue())
                || idMotivoTraslado.equals(MotivoTrasladoEnum.DEVOLUCION_PAQUETE.getValue());
    }

    protected boolean isMotivoTransferencia(String idMotivoTraslado) {
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

    protected String getIdAnexoPorNumeroDoc(String numeroDoc) {
        return null;
    }

    protected String insertarGuiaTransferencia() throws Exception {
        return null;
    }

    protected String getIdPuntoVenta() {
        if (cboPuntoVenta.getSelectedIndex() > 0) {
            return xpuntoventa.get(cboPuntoVenta.getSelectedIndex() - 1).getId_punto_venta();
        }
        return "";
    }

    protected String getIdAlmacenPartida() {
        if (cboAlmacenPartida.getSelectedIndex() > 0) {
            return xAlmacenPartida.get(cboAlmacenPartida.getSelectedIndex() - 1).getIdAlmacen();
        }
        return "";
    }

    protected String getIdAlmacenLlegada() {
        if (cboAlmacenLlegada.getSelectedIndex() > 0) {
            return xAlmacenLlegada.get(cboAlmacenLlegada.getSelectedIndex() - 1).getIdAlmacen();
        }
        return "";
    }

    protected String insertarGuiaVenta() throws Exception {
        return null;
    }

    protected boolean isValidGuiaVenta(List<ContaItem> lista, ContaItem docBean) throws Exception {
        return false;
    }

    protected List<ContaItem> getListGuiaVenta() {
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
        return null;
    }

    protected String insertDevolucion() throws Exception {
        return null;
    }

    protected boolean validarFechas(Date fechaInicio, Date fechaFin) {
        return false;
    }

    @Override
    public boolean executeDelete() {
        return false;
    }

    protected void changeChkSeleccionar(ItemEvent e) {
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
        return null;
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
        return false;
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

    protected void loadTipoGuia() {
    }

    protected void loadAlmacenPartida(String xcodPuntoVenta) {
    }

    protected void loadPuntoVenta(String id_empresa) {
    }

    protected void loadAlmacenLlegada(String xcodPuntoVenta) {
    }

    protected void cargarTipoGuia(String codTipoGuia) {
    }

    protected void cargarAlmacenPartida(String xcodiEmpresa) {
    }

    protected void cargarAlmacenLlegada(String xcodiEmpresa) {
    }

    protected void cargarPuntoVenta(String codPuntoVenta) {
    }

    @Override
    public boolean executeAnular() {
        return false;
    }

    protected void regularizarStock() {
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
    }

    protected boolean isModeInsert() {
        return this.mode == INSERT;
    }

    protected void cargarDocumentoReferencia(String id_regconta, String serie, String preimpreso) {
    }

    protected String getPreimpresoSerie() {
        ObjectItem obj = (ObjectItem) cboSerie.getSelectedItem();
        if (obj == null) {
            return "";
        }
        UsuarioCorrelativo uc = (UsuarioCorrelativo) obj.getObjItem();
        return Util.getPreimpresoCorrelativo(uc.getPreimpreso());
    }

    protected void cargarGuiaVenta(List<ContaItem> m) {
    }

    protected List<ContaItem> getItemsPorVenta(ContaCab r) throws Exception {
        return null;
    }

    protected void setLotesItemReserva(List<ContaItem> listDetatle, String idRegconta) throws Exception {
    }

    protected ArrayList<Lote> getLotesBySecuencia(List<Lote> lotes, String idSecuencia) {
        ArrayList<Lote> result = new ArrayList();
        for (Lote lote : lotes) {
            if (lote.getIdSecuencia().equals(idSecuencia)) {
                result.add(lote);
            }
        }
        return result;
    }

    protected void cargarSolicitudTransferencia(ContaCab bean) throws Exception {
    }

    protected void cargarVehiculo(BeanVehiculo beanVehiculo) {
    }

    protected void cargarConductor(String codigo) {
    }

    protected void cargarConductor(BeanAnexo beanConductor) {
    }

    protected void loadSerieCorrelativo(String idTipoDoc) throws Exception {
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

