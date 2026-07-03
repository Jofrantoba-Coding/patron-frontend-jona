package com.softcommerce.views.uiregisteringreso;

import com.softcommerce.views.uipaneltfingreso.UiPanelTFIngreso;


import com.softcommerce.formularios.*;
import com.softcommerce.beans.Almacen;
import com.softcommerce.beans.Anexo;
import com.softcommerce.beans.BeanItem;
import com.softcommerce.beans.Localidad;
import com.softcommerce.beans.BeanMoneda;
import com.softcommerce.beans.ContaItem;
import com.softcommerce.beans.PuntoVenta;
import com.softcommerce.beans.ContaCab;
import com.softcommerce.beans.BeanParametro;
import com.softcommerce.beans.Lote;
import com.softcommerce.beans.TipoMovInventario;
import com.softcommerce.beans.Usuario;
import com.softcommerce.beans.UsuarioCorrelativo;
import com.softcommerce.enums.TipoDocVentaEnum;
import com.softcommerce.enums.TipoMovInventarioEnum;
import com.toedter.calendar.JDateChooser;
import com.toedter.calendar.JTextFieldDateEditor;
import com.softcommerce.general.controles.JHInternal;
import java.util.logging.Level;
import java.util.logging.Logger;
import com.softcommerce.general.herramientas.CFunciones;
import com.softcommerce.general.herramientas.DateTime;
import com.softcommerce.iconos.Gif;
import java.awt.Component;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.FocusEvent;
import java.awt.event.ItemEvent;
import java.awt.event.KeyEvent;
import java.awt.event.KeyListener;
import java.awt.Color;
import java.awt.Font;
import java.util.Date;
import javax.swing.JButton;
import javax.swing.JComponent;
import javax.swing.JTextField;
import javax.swing.KeyStroke;
import javax.swing.SwingConstants;
import javax.swing.event.TableModelEvent;
import com.softcommerce.general.controles.DigitTextFieldCellEditor;
import javax.swing.JPanel;
import com.softcommerce.general.controles.CTable;
import com.softcommerce.general.controles.EnumClass;
import com.softcommerce.general.controles.IntegerDocument;
import com.softcommerce.general.controles.ItemObject;
import java.awt.BorderLayout;
import java.awt.Dimension;
import java.awt.Toolkit;
import java.awt.event.FocusListener;
import java.awt.event.ItemListener;
import java.util.ArrayList;
import java.util.List;
import javax.swing.JCheckBox;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.JScrollPane;
import javax.swing.JTabbedPane;
import javax.swing.JToolBar;
import javax.swing.border.LineBorder;
import javax.swing.event.TableModelListener;
import com.softcommerce.reglasnegocio.RnAlmacen;
import com.softcommerce.reglasnegocio.RnAnexo;
import com.softcommerce.reglasnegocio.RnLocalidad;
import com.softcommerce.reglasnegocio.RnPuntoVenta;
import com.softcommerce.reglasnegocio.RnRegContaCab;
import com.softcommerce.reglasnegocio.RnTipoMovInventario;
import com.softcommerce.reglasnegocio.RnCorrelativo;
import com.softcommerce.report.Reporte;
import com.softcommerce.general.tablas.DocumentoVentaDetalleTableModel;
import com.softcommerce.general.tablas.GuiaTransferenciaDetalleTableModel;
import com.softcommerce.general.tablas.IngresoDevolucionDespachadoTableModel;
import com.softcommerce.general.tablas.OrdenCompraDetalleTableModel;
import com.softcommerce.gui.FormConversion;
import com.softcommerce.gui.FormConversionVarios;
import com.softcommerce.logic.LogicLote;
import com.softcommerce.logic.LogicRegContaCab;
import com.softcommerce.logic.LogicStock;
import com.softcommerce.logic.LogicTransitoCab;
import com.softcommerce.logic.LogicTransitoDet;
import com.softcommerce.logic.LogicUsuario;
import com.softcommerce.reglasnegocio.RnMovInventarioCab;
import com.softcommerce.reglasnegocio.RnParametro;
import com.softcommerce.util.editor.CellEditorBtnLote;
import com.softcommerce.util.Constans;
import com.softcommerce.util.FormatObject;
import com.softcommerce.util.ExceptionHandler;
import com.softcommerce.util.combo.LoadCombo;
import com.softcommerce.util.Util;
import com.softcommerce.util.UtilDate;
import java.awt.FlowLayout;
import java.awt.GridBagConstraints;
import java.awt.GridBagLayout;
import java.awt.HeadlessException;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.sql.SQLException;
import java.text.NumberFormat;
import java.util.*;
import javax.swing.BorderFactory;
import javax.swing.JComboBox;
import javax.swing.JFormattedTextField;
import javax.swing.text.DefaultFormatterFactory;
import javax.swing.text.NumberFormatter;

public class UiRegisterIngreso
        extends JHInternal
        implements InterUiRegisterIngreso, ActionListener, ItemListener, KeyListener, FocusListener, TableModelListener {

    private String almacenDevolucion = null;
    private static final long serialVersionUID = 1L;
    private JComboBox cboMoneda;
    private List<BeanMoneda> xmoneda;
    private JComboBox cboPuntoVenta;
    private JComboBox cboLocalidad;
    private JComboBox cboAlmacen;
    private JComboBox cboEmpresaTrans;
    private List<Anexo> xEmpresaTransportista;
    private JComboBox cboTipoDocRef;
    public JComboBox cboSerie;
    private List<UsuarioCorrelativo> xserie;
    public JComboBox cboTipoMov;
    private List<TipoMovInventario> xTipoMov;
    private JDateChooser dcFechaEmision;
    //INGRESO POR INVENTARIO INICIAL
    private JTabbedPane tabbInventarioinicial;
    private OrdenCompraDetalleTableModel mdlInventarioinicial;
    private CTable tblInventarioinicial;
    //INGRESO POR COMPRA DE MERCADERIA
    private JTabbedPane tabbOrdencompra;
    private OrdenCompraDetalleTableModel mdlOrdencompra;
    private CTable tblOrdenCompra;
    private JButton btnAgregar;
    private JButton btnQuitar;
    //INGRESO POR TRANSFERENCIA
    private JTabbedPane tabbGuiatransferencia;
    private GuiaTransferenciaDetalleTableModel mdlGuiatransferencia;
    private CTable tblGuiatransferencia;
    //INGRESO POR DEVOLUCION DE CLIENTES
    private JTabbedPane tabbDevolucionclienteDespachado;
    private IngresoDevolucionDespachadoTableModel mdlDevolucionClienteDespachado;
    private CTable tblDevolucionclienteDespachado;
    private JTabbedPane tabbNotaSalida;
    private DocumentoVentaDetalleTableModel mdlNotaSalida;
    private CTable tblNotaSalida;
    private JButton btnBuscarDocumento;
    private Gif gif;
    private JLabel lblIdmovinventario;
    private JLabel lblTmpanexo;
    private JLabel lblTmpruc;
    private JLabel lblNumguiatransportista;
    private JLabel lblIdempresaTransportista;
    private JLabel lblNumdocreferencia;
    private JLabel lblNumguiareferencia;
    private JLabel lblFechaemision;
    private JTextField txtSerieNumDocReferencia;
    private JTextField txtPreimpresoNumDocReferencia;
    private JTextField txtSerieGuiaReferencia;
    private JTextField txtPreimpresoGuiaReferencia;
    private JTextField txtSerieGuiaTrans;
    private JTextField txtPreimpresoGuiaTrans;
    private JTextField txtIdestado;
    private JTextField txtTipocambio;
    private JTextField txtPreimpreso;
    private JTextField txtIdMovimientoOrigen;
    private JTextField txtIdmovimientodestino;
    private JTextField txtTmpAnexo;
    private JTextField txtCodCliente;
    private JTextField txtTmpRuc;
    private JTextField txtCodigodoc;
    private JTextField txtIdauxiliar;
    private JTextField txtCodRegContaCab;
    private JTextField txtFlagdescuento;
    private JFormattedTextField txtTotal;
    private JTextField txtPercepcion;
    private JFormattedTextField txtNoafecto;
    private JTextField txtDescuento;
    private JTextField txtIgv;
    private JFormattedTextField txtAfecto;
    private JFormattedTextField txtMonto;
    private JTextField txtFlagdetigv;
    private final Usuario usuario;
    private final Main frm;
    private JCheckBox chkSeleccionar;
    private String idCondicionventa;
    private ContaCab ordenCompra;
    private JTextField txtGuiaRemision;
    public JLabel lblMovimiento;
    public static List<Lote> listaLotes = null;
    public static CellEditorBtnLote editorCompra;
    public static CellEditorBtnLote editorDevolucion;
    public static CellEditorBtnLote editorEntrada;
    public JLabel lblSerie = new JLabel("NÂ° INGRESO");
    public static JScrollPane contenidoScrollPane = new JScrollPane(JScrollPane.VERTICAL_SCROLLBAR_AS_NEEDED, JScrollPane.HORIZONTAL_SCROLLBAR_AS_NEEDED);
    public static final Font fuente = new Font(Font.SANS_SERIF, Font.PLAIN, 12);
    private JScrollPane scrollTableguiaventa;
    private JScrollPane scrollDevolucionclienteDespachado;
    private JScrollPane scrollTableguiaventa6;
    private JScrollPane scrollTableguiaventa7;
    private JScrollPane scrollTableGuiaTraDetalle;
    private final org.apache.log4j.Logger logger = org.apache.log4j.Logger.getLogger(UiRegisterIngreso.class);
    private FormConversionVarios pnlConversionVarios;

    public UiRegisterIngreso(UiPanelTFIngreso pnltf, String title, Usuario usuario, Main frm) {
        super(title);
        this.usuario = usuario;
        this.frm = frm;
        inicialize();
    }

    public JPanel getPanelIngresoConversion() {
        if (Constans.IS_ITEM_DESTINO_MULTIPLE) {
            pnlConversionVarios = new FormConversionVarios(this.path, this.frm, this.usuario, this);
            pnlConversionVarios.loadDatos();
            return pnlConversionVarios;
        }
        FormConversion pnlConversion = new FormConversion(Main.usuario);
        pnlConversion.loadAlmacen();
        return pnlConversion;
    }

    public JPanel getPanelIngresoPorTransferencia() {
        JPanel pnlIngresoPorTransferencia = new JPanel();
        pnlIngresoPorTransferencia.setLayout(new BorderLayout());
        JPanel pnlDatos = new JPanel();
        pnlDatos.setLayout(new GridBagLayout());
        JPanel pnlTable = new JPanel();
        pnlIngresoPorTransferencia.add(pnlDatos, BorderLayout.NORTH);
        pnlIngresoPorTransferencia.add(pnlTable, BorderLayout.CENTER);
        GridBagConstraints gridBagConstraints1 = new GridBagConstraints();
        gridBagConstraints1.gridx = 0;
        gridBagConstraints1.gridy = 0;
        gridBagConstraints1.fill = java.awt.GridBagConstraints.BOTH;
        gridBagConstraints1.insets = new java.awt.Insets(5, 5, 5, 5);
        lblSerie.setFont(fuente);
        pnlDatos.add(lblSerie, gridBagConstraints1);
        gridBagConstraints1.gridx = 1;
        gridBagConstraints1.gridy = 0;
        gridBagConstraints1.fill = java.awt.GridBagConstraints.BOTH;
        gridBagConstraints1.insets = new java.awt.Insets(5, 5, 5, 5);
        cboSerie.setFont(fuente);
        pnlDatos.add(this.cboSerie, gridBagConstraints1);
        gridBagConstraints1.gridx = 2;
        gridBagConstraints1.gridy = 0;
        gridBagConstraints1.fill = java.awt.GridBagConstraints.BOTH;
        gridBagConstraints1.insets = new java.awt.Insets(5, 5, 5, 5);
        txtPreimpreso.setFont(fuente);
        pnlDatos.add(this.txtPreimpreso, gridBagConstraints1);
        gridBagConstraints1.gridx = 3;
        gridBagConstraints1.gridy = 0;
        gridBagConstraints1.fill = java.awt.GridBagConstraints.BOTH;
        gridBagConstraints1.insets = new java.awt.Insets(5, 5, 5, 5);
        cboTipoDocRef.setFont(fuente);
        pnlDatos.add(cboTipoDocRef, gridBagConstraints1);
        gridBagConstraints1.gridx = 4;
        gridBagConstraints1.gridy = 0;
        gridBagConstraints1.fill = java.awt.GridBagConstraints.BOTH;
        gridBagConstraints1.insets = new java.awt.Insets(5, 5, 5, 5);
        lblNumdocreferencia.setFont(fuente);
        pnlDatos.add(lblNumdocreferencia, gridBagConstraints1);
        gridBagConstraints1.gridx = 5;
        gridBagConstraints1.gridy = 0;
        gridBagConstraints1.fill = java.awt.GridBagConstraints.BOTH;
        gridBagConstraints1.insets = new java.awt.Insets(5, 5, 5, 5);
        txtSerieNumDocReferencia.setFont(fuente);
        pnlDatos.add(txtSerieNumDocReferencia, gridBagConstraints1);
        gridBagConstraints1.gridx = 6;
        gridBagConstraints1.gridy = 0;
        gridBagConstraints1.fill = java.awt.GridBagConstraints.BOTH;
        gridBagConstraints1.insets = new java.awt.Insets(5, 5, 5, 5);
        txtPreimpresoNumDocReferencia.setFont(fuente);
        pnlDatos.add(txtPreimpresoNumDocReferencia, gridBagConstraints1);
        gridBagConstraints1.gridx = 0;
        gridBagConstraints1.gridy = 1;
        gridBagConstraints1.gridwidth = 2;
        gridBagConstraints1.fill = java.awt.GridBagConstraints.BOTH;
        gridBagConstraints1.insets = new java.awt.Insets(5, 5, 5, 5);
        cboLocalidad.setPreferredSize(new Dimension(160, 0));
        cboLocalidad.setFont(fuente);
        pnlDatos.add(this.cboLocalidad, gridBagConstraints1);
        gridBagConstraints1.gridx = 2;
        gridBagConstraints1.gridy = 1;
        gridBagConstraints1.gridwidth = 1;
        gridBagConstraints1.fill = java.awt.GridBagConstraints.BOTH;
        gridBagConstraints1.insets = new java.awt.Insets(5, 5, 5, 5);
        cboPuntoVenta.setFont(fuente);
        cboPuntoVenta.setPreferredSize(new Dimension(160, 0));
        pnlDatos.add(this.cboPuntoVenta, gridBagConstraints1);
        gridBagConstraints1.gridx = 3;
        gridBagConstraints1.gridy = 1;
        gridBagConstraints1.gridwidth = 1;
        gridBagConstraints1.fill = java.awt.GridBagConstraints.BOTH;
        gridBagConstraints1.insets = new java.awt.Insets(5, 5, 5, 5);
        cboAlmacen.setPreferredSize(new Dimension(220, 0));
        cboAlmacen.setFont(fuente);
        pnlDatos.add(this.cboAlmacen, gridBagConstraints1);
        gridBagConstraints1.gridx = 4;
        gridBagConstraints1.gridy = 1;
        gridBagConstraints1.gridwidth = 2;
        gridBagConstraints1.fill = java.awt.GridBagConstraints.BOTH;
        gridBagConstraints1.insets = new java.awt.Insets(5, 5, 5, 5);
        lblFechaemision.setFont(fuente);
        lblFechaemision.setHorizontalAlignment(SwingConstants.RIGHT);
        pnlDatos.add(this.lblFechaemision, gridBagConstraints1);
        gridBagConstraints1.gridx = 6;
        gridBagConstraints1.gridy = 1;
        gridBagConstraints1.gridwidth = 1;
        gridBagConstraints1.fill = java.awt.GridBagConstraints.BOTH;
        gridBagConstraints1.insets = new java.awt.Insets(5, 5, 5, 5);
        dcFechaEmision.setFont(fuente);
        pnlDatos.add(this.dcFechaEmision, gridBagConstraints1);
        JPanel pnlGuiaRe = new JPanel();
        FlowLayout flowLayout = new FlowLayout();
        flowLayout.setAlignment(FlowLayout.LEFT);
        pnlGuiaRe.setLayout(flowLayout);
        lblTmpanexo.setFont(fuente);
        txtTmpAnexo.setFont(fuente);
        lblTmpruc.setFont(fuente);
        txtTmpRuc.setFont(fuente);
        lblNumguiareferencia.setFont(fuente);
        txtSerieGuiaReferencia.setFont(fuente);
        txtPreimpresoGuiaReferencia.setFont(fuente);
        pnlGuiaRe.add(lblTmpanexo);
        pnlGuiaRe.add(txtTmpAnexo);
        pnlGuiaRe.add(lblTmpruc);
        pnlGuiaRe.add(txtTmpRuc);
        pnlGuiaRe.add(lblNumguiareferencia);
        pnlGuiaRe.add(txtSerieGuiaReferencia);
        pnlGuiaRe.add(txtPreimpresoGuiaReferencia);
        gridBagConstraints1.gridx = 0;
        gridBagConstraints1.gridy = 2;
        gridBagConstraints1.gridwidth = 7;
        gridBagConstraints1.fill = java.awt.GridBagConstraints.BOTH;
        gridBagConstraints1.insets = new java.awt.Insets(5, 5, 5, 5);
        pnlDatos.add(pnlGuiaRe, gridBagConstraints1);
        JPanel pnlGuiaTrans = new JPanel();
        pnlGuiaTrans.setLayout(flowLayout);
        pnlGuiaTrans.add(this.lblIdempresaTransportista);
        pnlGuiaTrans.add(this.cboEmpresaTrans);
        pnlGuiaTrans.add(this.lblNumguiatransportista);
        pnlGuiaTrans.add(this.txtSerieGuiaTrans);
        pnlGuiaTrans.add(this.txtPreimpresoGuiaTrans);
        gridBagConstraints1.gridx = 0;
        gridBagConstraints1.gridy = 3;
        gridBagConstraints1.gridwidth = 7;
        gridBagConstraints1.fill = java.awt.GridBagConstraints.BOTH;
        gridBagConstraints1.insets = new java.awt.Insets(5, 5, 5, 5);
        pnlDatos.add(pnlGuiaTrans, gridBagConstraints1);
        pnlTable.setBorder(BorderFactory.createEtchedBorder());
        pnlTable.setLayout(new BorderLayout());
        JPanel pnlToolbar = new JPanel();
        pnlToolbar.setLayout(flowLayout);
        pnlTable.add(pnlToolbar, BorderLayout.NORTH);
        pnlTable.add(scrollTableGuiaTraDetalle, BorderLayout.CENTER);
        pnlToolbar.add(this.chkSeleccionar);

        return pnlIngresoPorTransferencia;
    }

    public JPanel getPanelIngresoPorInventarioInicial() {
        JPanel pnlIngresoPorInventarioInicial = new JPanel();
        pnlIngresoPorInventarioInicial.setLayout(new BorderLayout());
        JPanel pnlDatos = new JPanel();
        pnlDatos.setLayout(new GridBagLayout());
        JPanel pnlTable = new JPanel();
        pnlIngresoPorInventarioInicial.add(pnlDatos, BorderLayout.NORTH);
        pnlIngresoPorInventarioInicial.add(pnlTable, BorderLayout.CENTER);
        GridBagConstraints gridBagConstraints1 = new GridBagConstraints();
        gridBagConstraints1.gridx = 0;
        gridBagConstraints1.gridy = 0;
        gridBagConstraints1.fill = java.awt.GridBagConstraints.BOTH;
        gridBagConstraints1.insets = new java.awt.Insets(5, 5, 5, 5);
        lblSerie.setFont(fuente);
        pnlDatos.add(lblSerie, gridBagConstraints1);
        gridBagConstraints1.gridx = 1;
        gridBagConstraints1.gridy = 0;
        gridBagConstraints1.fill = java.awt.GridBagConstraints.BOTH;
        gridBagConstraints1.insets = new java.awt.Insets(5, 5, 5, 5);
        cboSerie.setFont(fuente);
        pnlDatos.add(this.cboSerie, gridBagConstraints1);
        gridBagConstraints1.gridx = 2;
        gridBagConstraints1.gridy = 0;
        gridBagConstraints1.fill = java.awt.GridBagConstraints.BOTH;
        gridBagConstraints1.insets = new java.awt.Insets(5, 5, 5, 5);
        txtPreimpreso.setFont(fuente);
        pnlDatos.add(this.txtPreimpreso, gridBagConstraints1);
        gridBagConstraints1.gridx = 3;
        gridBagConstraints1.gridy = 0;
        gridBagConstraints1.fill = java.awt.GridBagConstraints.BOTH;
        gridBagConstraints1.insets = new java.awt.Insets(5, 5, 5, 5);
        cboTipoDocRef.setFont(fuente);
        pnlDatos.add(cboTipoDocRef, gridBagConstraints1);
        gridBagConstraints1.gridx = 4;
        gridBagConstraints1.gridy = 0;
        gridBagConstraints1.fill = java.awt.GridBagConstraints.BOTH;
        gridBagConstraints1.insets = new java.awt.Insets(5, 5, 5, 5);
        lblNumdocreferencia.setFont(fuente);
        pnlDatos.add(lblNumdocreferencia, gridBagConstraints1);
        gridBagConstraints1.gridx = 5;
        gridBagConstraints1.gridy = 0;
        gridBagConstraints1.fill = java.awt.GridBagConstraints.BOTH;
        gridBagConstraints1.insets = new java.awt.Insets(5, 5, 5, 5);
        txtSerieNumDocReferencia.setFont(fuente);
        pnlDatos.add(txtSerieNumDocReferencia, gridBagConstraints1);
        gridBagConstraints1.gridx = 6;
        gridBagConstraints1.gridy = 0;
        gridBagConstraints1.fill = java.awt.GridBagConstraints.BOTH;
        gridBagConstraints1.insets = new java.awt.Insets(5, 5, 5, 5);
        txtPreimpresoNumDocReferencia.setFont(fuente);
        pnlDatos.add(txtPreimpresoNumDocReferencia, gridBagConstraints1);
        gridBagConstraints1.gridx = 0;
        gridBagConstraints1.gridy = 1;
        gridBagConstraints1.gridwidth = 2;
        gridBagConstraints1.fill = java.awt.GridBagConstraints.BOTH;
        gridBagConstraints1.insets = new java.awt.Insets(5, 5, 5, 5);
        cboLocalidad.setPreferredSize(new Dimension(160, 0));
        cboLocalidad.setFont(fuente);
        pnlDatos.add(this.cboLocalidad, gridBagConstraints1);
        gridBagConstraints1.gridx = 2;
        gridBagConstraints1.gridy = 1;
        gridBagConstraints1.gridwidth = 1;
        gridBagConstraints1.fill = java.awt.GridBagConstraints.BOTH;
        gridBagConstraints1.insets = new java.awt.Insets(5, 5, 5, 5);
        cboPuntoVenta.setFont(fuente);
        cboPuntoVenta.setPreferredSize(new Dimension(160, 0));
        pnlDatos.add(this.cboPuntoVenta, gridBagConstraints1);
        gridBagConstraints1.gridx = 3;
        gridBagConstraints1.gridy = 1;
        gridBagConstraints1.gridwidth = 1;
        gridBagConstraints1.fill = java.awt.GridBagConstraints.BOTH;
        gridBagConstraints1.insets = new java.awt.Insets(5, 5, 5, 5);
        cboAlmacen.setPreferredSize(new Dimension(220, 0));
        cboAlmacen.setFont(fuente);
        pnlDatos.add(this.cboAlmacen, gridBagConstraints1);
        gridBagConstraints1.gridx = 4;
        gridBagConstraints1.gridy = 1;
        gridBagConstraints1.gridwidth = 2;
        gridBagConstraints1.fill = java.awt.GridBagConstraints.BOTH;
        gridBagConstraints1.insets = new java.awt.Insets(5, 5, 5, 5);
        lblFechaemision.setFont(fuente);
        lblFechaemision.setHorizontalAlignment(SwingConstants.RIGHT);
        pnlDatos.add(this.lblFechaemision, gridBagConstraints1);
        gridBagConstraints1.gridx = 6;
        gridBagConstraints1.gridy = 1;
        gridBagConstraints1.gridwidth = 1;
        gridBagConstraints1.fill = java.awt.GridBagConstraints.BOTH;
        gridBagConstraints1.insets = new java.awt.Insets(5, 5, 5, 5);
        dcFechaEmision.setFont(fuente);
        pnlDatos.add(this.dcFechaEmision, gridBagConstraints1);
        JPanel pnlGuiaRe = new JPanel();
        FlowLayout flowLayout = new FlowLayout();
        flowLayout.setAlignment(FlowLayout.LEFT);
        pnlGuiaRe.setLayout(flowLayout);
        lblTmpanexo.setFont(fuente);
        txtTmpAnexo.setFont(fuente);
        lblTmpruc.setFont(fuente);
        txtTmpRuc.setFont(fuente);
        lblNumguiareferencia.setFont(fuente);
        txtSerieGuiaReferencia.setFont(fuente);
        txtPreimpresoGuiaReferencia.setFont(fuente);
        pnlGuiaRe.add(lblTmpanexo);
        pnlGuiaRe.add(txtTmpAnexo);
        pnlGuiaRe.add(lblTmpruc);
        pnlGuiaRe.add(txtTmpRuc);
        pnlGuiaRe.add(lblNumguiareferencia);
        pnlGuiaRe.add(txtSerieGuiaReferencia);
        pnlGuiaRe.add(txtPreimpresoGuiaReferencia);
        gridBagConstraints1.gridx = 0;
        gridBagConstraints1.gridy = 2;
        gridBagConstraints1.gridwidth = 7;
        gridBagConstraints1.fill = java.awt.GridBagConstraints.BOTH;
        gridBagConstraints1.insets = new java.awt.Insets(5, 5, 5, 5);
        pnlDatos.add(pnlGuiaRe, gridBagConstraints1);
        JPanel pnlGuiaTrans = new JPanel();
        pnlGuiaTrans.setLayout(flowLayout);
        pnlGuiaTrans.add(this.lblIdempresaTransportista);
        pnlGuiaTrans.add(this.cboEmpresaTrans);
        pnlGuiaTrans.add(this.lblNumguiatransportista);
        pnlGuiaTrans.add(this.txtSerieGuiaTrans);
        pnlGuiaTrans.add(this.txtPreimpresoGuiaTrans);
        gridBagConstraints1.gridx = 0;
        gridBagConstraints1.gridy = 3;
        gridBagConstraints1.gridwidth = 7;
        gridBagConstraints1.fill = java.awt.GridBagConstraints.BOTH;
        gridBagConstraints1.insets = new java.awt.Insets(5, 5, 5, 5);
        pnlDatos.add(pnlGuiaTrans, gridBagConstraints1);
        pnlTable.setBorder(BorderFactory.createEtchedBorder());
        pnlTable.setLayout(new BorderLayout());
        JPanel pnlToolbar = new JPanel();
        pnlToolbar.setLayout(flowLayout);
        pnlTable.add(pnlToolbar, BorderLayout.NORTH);
        pnlTable.add(scrollTableguiaventa7, BorderLayout.CENTER);
        pnlToolbar.add(this.chkSeleccionar);

        return pnlIngresoPorInventarioInicial;
    }

    public JPanel getPanelIngresoPorDevolucion() {
        JPanel pnlIngresoPorDevolucion = new JPanel();
        pnlIngresoPorDevolucion.setLayout(new BorderLayout());
        JPanel pnlDatos = new JPanel();
        pnlDatos.setLayout(new GridBagLayout());
        JPanel pnlTable = new JPanel();
        pnlIngresoPorDevolucion.add(pnlDatos, BorderLayout.NORTH);
        pnlIngresoPorDevolucion.add(pnlTable, BorderLayout.CENTER);
        GridBagConstraints gridBagConstraints1 = new GridBagConstraints();
        gridBagConstraints1.gridx = 0;
        gridBagConstraints1.gridy = 0;
        gridBagConstraints1.fill = java.awt.GridBagConstraints.BOTH;
        gridBagConstraints1.insets = new java.awt.Insets(5, 5, 5, 5);
        lblSerie.setFont(fuente);
        pnlDatos.add(lblSerie, gridBagConstraints1);
        gridBagConstraints1.gridx = 1;
        gridBagConstraints1.gridy = 0;
        gridBagConstraints1.fill = java.awt.GridBagConstraints.BOTH;
        gridBagConstraints1.insets = new java.awt.Insets(5, 5, 5, 5);
        cboSerie.setFont(fuente);
        pnlDatos.add(this.cboSerie, gridBagConstraints1);
        gridBagConstraints1.gridx = 2;
        gridBagConstraints1.gridy = 0;
        gridBagConstraints1.fill = java.awt.GridBagConstraints.BOTH;
        gridBagConstraints1.insets = new java.awt.Insets(5, 5, 5, 5);
        txtPreimpreso.setFont(fuente);
        pnlDatos.add(this.txtPreimpreso, gridBagConstraints1);
        gridBagConstraints1.gridx = 3;
        gridBagConstraints1.gridy = 0;
        gridBagConstraints1.fill = java.awt.GridBagConstraints.BOTH;
        gridBagConstraints1.insets = new java.awt.Insets(5, 5, 5, 5);
        cboTipoDocRef.setFont(fuente);
        pnlDatos.add(cboTipoDocRef, gridBagConstraints1);
        gridBagConstraints1.gridx = 4;
        gridBagConstraints1.gridy = 0;
        gridBagConstraints1.fill = java.awt.GridBagConstraints.BOTH;
        gridBagConstraints1.insets = new java.awt.Insets(5, 5, 5, 5);
        lblNumdocreferencia.setFont(fuente);
        pnlDatos.add(lblNumdocreferencia, gridBagConstraints1);
        gridBagConstraints1.gridx = 5;
        gridBagConstraints1.gridy = 0;
        gridBagConstraints1.fill = java.awt.GridBagConstraints.BOTH;
        gridBagConstraints1.insets = new java.awt.Insets(5, 5, 5, 5);
        txtSerieNumDocReferencia.setFont(fuente);
        pnlDatos.add(txtSerieNumDocReferencia, gridBagConstraints1);
        gridBagConstraints1.gridx = 6;
        gridBagConstraints1.gridy = 0;
        gridBagConstraints1.fill = java.awt.GridBagConstraints.BOTH;
        gridBagConstraints1.insets = new java.awt.Insets(5, 5, 5, 5);
        txtPreimpresoNumDocReferencia.setFont(fuente);
        pnlDatos.add(txtPreimpresoNumDocReferencia, gridBagConstraints1);
        gridBagConstraints1.gridx = 0;
        gridBagConstraints1.gridy = 1;
        gridBagConstraints1.gridwidth = 2;
        gridBagConstraints1.fill = java.awt.GridBagConstraints.BOTH;
        gridBagConstraints1.insets = new java.awt.Insets(5, 5, 5, 5);
        cboLocalidad.setPreferredSize(new Dimension(160, 0));
        cboLocalidad.setFont(fuente);
        pnlDatos.add(this.cboLocalidad, gridBagConstraints1);
        gridBagConstraints1.gridx = 2;
        gridBagConstraints1.gridy = 1;
        gridBagConstraints1.gridwidth = 1;
        gridBagConstraints1.fill = java.awt.GridBagConstraints.BOTH;
        gridBagConstraints1.insets = new java.awt.Insets(5, 5, 5, 5);
        cboPuntoVenta.setFont(fuente);
        cboPuntoVenta.setPreferredSize(new Dimension(160, 0));
        pnlDatos.add(this.cboPuntoVenta, gridBagConstraints1);
        gridBagConstraints1.gridx = 3;
        gridBagConstraints1.gridy = 1;
        gridBagConstraints1.gridwidth = 1;
        gridBagConstraints1.fill = java.awt.GridBagConstraints.BOTH;
        gridBagConstraints1.insets = new java.awt.Insets(5, 5, 5, 5);
        cboAlmacen.setPreferredSize(new Dimension(220, 0));
        cboAlmacen.setFont(fuente);
        pnlDatos.add(this.cboAlmacen, gridBagConstraints1);
        gridBagConstraints1.gridx = 4;
        gridBagConstraints1.gridy = 1;
        gridBagConstraints1.gridwidth = 2;
        gridBagConstraints1.fill = java.awt.GridBagConstraints.BOTH;
        gridBagConstraints1.insets = new java.awt.Insets(5, 5, 5, 5);
        lblFechaemision.setFont(fuente);
        lblFechaemision.setHorizontalAlignment(SwingConstants.RIGHT);
        pnlDatos.add(this.lblFechaemision, gridBagConstraints1);
        gridBagConstraints1.gridx = 6;
        gridBagConstraints1.gridy = 1;
        gridBagConstraints1.gridwidth = 1;
        gridBagConstraints1.fill = java.awt.GridBagConstraints.BOTH;
        gridBagConstraints1.insets = new java.awt.Insets(5, 5, 5, 5);
        dcFechaEmision.setFont(fuente);
        pnlDatos.add(this.dcFechaEmision, gridBagConstraints1);
        JPanel pnlGuiaRe = new JPanel();
        FlowLayout flowLayout = new FlowLayout();
        flowLayout.setAlignment(FlowLayout.LEFT);
        pnlGuiaRe.setLayout(flowLayout);
        lblTmpanexo.setFont(fuente);
        txtTmpAnexo.setFont(fuente);
        lblTmpruc.setFont(fuente);
        txtTmpRuc.setFont(fuente);
        lblNumguiareferencia.setFont(fuente);
        txtSerieGuiaReferencia.setFont(fuente);
        txtPreimpresoGuiaReferencia.setFont(fuente);
        pnlGuiaRe.add(lblTmpanexo);
        pnlGuiaRe.add(txtTmpAnexo);
        pnlGuiaRe.add(lblTmpruc);
        pnlGuiaRe.add(txtTmpRuc);
        pnlGuiaRe.add(lblNumguiareferencia);
        pnlGuiaRe.add(txtSerieGuiaReferencia);
        pnlGuiaRe.add(txtPreimpresoGuiaReferencia);
        gridBagConstraints1.gridx = 0;
        gridBagConstraints1.gridy = 2;
        gridBagConstraints1.gridwidth = 7;
        gridBagConstraints1.fill = java.awt.GridBagConstraints.BOTH;
        gridBagConstraints1.insets = new java.awt.Insets(5, 5, 5, 5);
        pnlDatos.add(pnlGuiaRe, gridBagConstraints1);
        JPanel pnlGuiaTrans = new JPanel();
        pnlGuiaTrans.setLayout(flowLayout);
        pnlGuiaTrans.add(this.lblIdempresaTransportista);
        pnlGuiaTrans.add(this.cboEmpresaTrans);
        pnlGuiaTrans.add(this.lblNumguiatransportista);
        pnlGuiaTrans.add(this.txtSerieGuiaTrans);
        pnlGuiaTrans.add(this.txtPreimpresoGuiaTrans);
        gridBagConstraints1.gridx = 0;
        gridBagConstraints1.gridy = 3;
        gridBagConstraints1.gridwidth = 7;
        gridBagConstraints1.fill = java.awt.GridBagConstraints.BOTH;
        gridBagConstraints1.insets = new java.awt.Insets(5, 5, 5, 5);
        pnlDatos.add(pnlGuiaTrans, gridBagConstraints1);
        pnlTable.setBorder(BorderFactory.createEtchedBorder());
        pnlTable.setLayout(new BorderLayout());
        JPanel pnlToolbar = new JPanel();
        pnlToolbar.setLayout(flowLayout);
        pnlTable.add(pnlToolbar, BorderLayout.NORTH);
        pnlTable.add(scrollDevolucionclienteDespachado, BorderLayout.CENTER);
        pnlToolbar.add(this.chkSeleccionar);

        return pnlIngresoPorDevolucion;
    }

    public JPanel getPanelIngresoPorAjusteInventario() {
        JPanel pnlIngresoPorAjuste = new JPanel();
        pnlIngresoPorAjuste.setLayout(new BorderLayout());
        JPanel pnlDatos = new JPanel();
        pnlDatos.setLayout(new GridBagLayout());
        JPanel pnlTable = new JPanel();
        pnlIngresoPorAjuste.add(pnlDatos, BorderLayout.NORTH);
        pnlIngresoPorAjuste.add(pnlTable, BorderLayout.CENTER);
        GridBagConstraints gridBagConstraints1 = new GridBagConstraints();
        gridBagConstraints1.gridx = 0;
        gridBagConstraints1.gridy = 0;
        gridBagConstraints1.fill = java.awt.GridBagConstraints.BOTH;
        gridBagConstraints1.insets = new java.awt.Insets(5, 5, 5, 5);
        lblSerie.setFont(fuente);
        pnlDatos.add(lblSerie, gridBagConstraints1);
        gridBagConstraints1.gridx = 1;
        gridBagConstraints1.gridy = 0;
        gridBagConstraints1.fill = java.awt.GridBagConstraints.BOTH;
        gridBagConstraints1.insets = new java.awt.Insets(5, 5, 5, 5);
        cboSerie.setFont(fuente);
        pnlDatos.add(this.cboSerie, gridBagConstraints1);
        gridBagConstraints1.gridx = 2;
        gridBagConstraints1.gridy = 0;
        gridBagConstraints1.fill = java.awt.GridBagConstraints.BOTH;
        gridBagConstraints1.insets = new java.awt.Insets(5, 5, 5, 5);
        txtPreimpreso.setFont(fuente);
        pnlDatos.add(this.txtPreimpreso, gridBagConstraints1);
        gridBagConstraints1.gridx = 3;
        gridBagConstraints1.gridy = 0;
        gridBagConstraints1.fill = java.awt.GridBagConstraints.BOTH;
        gridBagConstraints1.insets = new java.awt.Insets(5, 5, 5, 5);
        cboTipoDocRef.setFont(fuente);
        pnlDatos.add(cboTipoDocRef, gridBagConstraints1);
        gridBagConstraints1.gridx = 4;
        gridBagConstraints1.gridy = 0;
        gridBagConstraints1.fill = java.awt.GridBagConstraints.BOTH;
        gridBagConstraints1.insets = new java.awt.Insets(5, 5, 5, 5);
        lblNumdocreferencia.setFont(fuente);
        pnlDatos.add(lblNumdocreferencia, gridBagConstraints1);
        gridBagConstraints1.gridx = 5;
        gridBagConstraints1.gridy = 0;
        gridBagConstraints1.fill = java.awt.GridBagConstraints.BOTH;
        gridBagConstraints1.insets = new java.awt.Insets(5, 5, 5, 5);
        txtSerieNumDocReferencia.setFont(fuente);
        pnlDatos.add(txtSerieNumDocReferencia, gridBagConstraints1);
        gridBagConstraints1.gridx = 6;
        gridBagConstraints1.gridy = 0;
        gridBagConstraints1.fill = java.awt.GridBagConstraints.BOTH;
        gridBagConstraints1.insets = new java.awt.Insets(5, 5, 5, 5);
        txtPreimpresoNumDocReferencia.setFont(fuente);
        pnlDatos.add(txtPreimpresoNumDocReferencia, gridBagConstraints1);
        gridBagConstraints1.gridx = 0;
        gridBagConstraints1.gridy = 1;
        gridBagConstraints1.gridwidth = 2;
        gridBagConstraints1.fill = java.awt.GridBagConstraints.BOTH;
        gridBagConstraints1.insets = new java.awt.Insets(5, 5, 5, 5);
        cboLocalidad.setPreferredSize(new Dimension(160, 0));
        cboLocalidad.setFont(fuente);
        pnlDatos.add(this.cboLocalidad, gridBagConstraints1);
        gridBagConstraints1.gridx = 2;
        gridBagConstraints1.gridy = 1;
        gridBagConstraints1.gridwidth = 1;
        gridBagConstraints1.fill = java.awt.GridBagConstraints.BOTH;
        gridBagConstraints1.insets = new java.awt.Insets(5, 5, 5, 5);
        cboPuntoVenta.setFont(fuente);
        cboPuntoVenta.setPreferredSize(new Dimension(160, 0));
        pnlDatos.add(this.cboPuntoVenta, gridBagConstraints1);
        gridBagConstraints1.gridx = 3;
        gridBagConstraints1.gridy = 1;
        gridBagConstraints1.gridwidth = 1;
        gridBagConstraints1.fill = java.awt.GridBagConstraints.BOTH;
        gridBagConstraints1.insets = new java.awt.Insets(5, 5, 5, 5);
        cboAlmacen.setPreferredSize(new Dimension(220, 0));
        cboAlmacen.setFont(fuente);
        pnlDatos.add(this.cboAlmacen, gridBagConstraints1);
        gridBagConstraints1.gridx = 4;
        gridBagConstraints1.gridy = 1;
        gridBagConstraints1.gridwidth = 2;
        gridBagConstraints1.fill = java.awt.GridBagConstraints.BOTH;
        gridBagConstraints1.insets = new java.awt.Insets(5, 5, 5, 5);
        lblFechaemision.setFont(fuente);
        lblFechaemision.setHorizontalAlignment(SwingConstants.RIGHT);
        pnlDatos.add(this.lblFechaemision, gridBagConstraints1);
        gridBagConstraints1.gridx = 6;
        gridBagConstraints1.gridy = 1;
        gridBagConstraints1.gridwidth = 1;
        gridBagConstraints1.fill = java.awt.GridBagConstraints.BOTH;
        gridBagConstraints1.insets = new java.awt.Insets(5, 5, 5, 5);
        dcFechaEmision.setFont(fuente);
        pnlDatos.add(this.dcFechaEmision, gridBagConstraints1);
        JPanel pnlGuiaRe = new JPanel();
        FlowLayout flowLayout = new FlowLayout();
        flowLayout.setAlignment(FlowLayout.LEFT);
        pnlGuiaRe.setLayout(flowLayout);
        lblTmpanexo.setFont(fuente);
        txtTmpAnexo.setFont(fuente);
        lblTmpruc.setFont(fuente);
        txtTmpRuc.setFont(fuente);
        lblNumguiareferencia.setFont(fuente);
        txtSerieGuiaReferencia.setFont(fuente);
        txtPreimpresoGuiaReferencia.setFont(fuente);
        pnlGuiaRe.add(lblTmpanexo);
        pnlGuiaRe.add(txtTmpAnexo);
        pnlGuiaRe.add(lblTmpruc);
        pnlGuiaRe.add(txtTmpRuc);
        pnlGuiaRe.add(lblNumguiareferencia);
        pnlGuiaRe.add(txtSerieGuiaReferencia);
        pnlGuiaRe.add(txtPreimpresoGuiaReferencia);
        gridBagConstraints1.gridx = 0;
        gridBagConstraints1.gridy = 2;
        gridBagConstraints1.gridwidth = 7;
        gridBagConstraints1.fill = java.awt.GridBagConstraints.BOTH;
        gridBagConstraints1.insets = new java.awt.Insets(5, 5, 5, 5);
        pnlDatos.add(pnlGuiaRe, gridBagConstraints1);
        JPanel pnlGuiaTrans = new JPanel();
        pnlGuiaTrans.setLayout(flowLayout);
        pnlGuiaTrans.add(this.lblIdempresaTransportista);
        pnlGuiaTrans.add(this.cboEmpresaTrans);
        pnlGuiaTrans.add(this.lblNumguiatransportista);
        pnlGuiaTrans.add(this.txtSerieGuiaTrans);
        pnlGuiaTrans.add(this.txtPreimpresoGuiaTrans);
        gridBagConstraints1.gridx = 0;
        gridBagConstraints1.gridy = 3;
        gridBagConstraints1.gridwidth = 7;
        gridBagConstraints1.fill = java.awt.GridBagConstraints.BOTH;
        gridBagConstraints1.insets = new java.awt.Insets(5, 5, 5, 5);
        pnlDatos.add(pnlGuiaTrans, gridBagConstraints1);
        pnlTable.setBorder(BorderFactory.createEtchedBorder());
        pnlTable.setLayout(new BorderLayout());
        JPanel pnlToolbar = new JPanel();
        pnlToolbar.setLayout(flowLayout);
        pnlTable.add(pnlToolbar, BorderLayout.NORTH);
        pnlTable.add(scrollTableguiaventa6, BorderLayout.CENTER);
        pnlToolbar.add(this.chkSeleccionar);

        return pnlIngresoPorAjuste;
    }

    public JPanel getPanelIngresoCompra() {
        JPanel pnlIngresoCompra = new JPanel();
        pnlIngresoCompra.setLayout(new BorderLayout());
        JPanel pnlDatos = new JPanel();
        pnlDatos.setLayout(new GridBagLayout());
        JPanel pnlTable = new JPanel();
        pnlIngresoCompra.add(pnlDatos, BorderLayout.NORTH);
        pnlIngresoCompra.add(pnlTable, BorderLayout.CENTER);
        GridBagConstraints gridBagConstraints1 = new GridBagConstraints();
        gridBagConstraints1.gridx = 0;
        gridBagConstraints1.gridy = 0;
        gridBagConstraints1.fill = java.awt.GridBagConstraints.BOTH;
        gridBagConstraints1.insets = new java.awt.Insets(5, 5, 5, 5);
        lblSerie.setFont(fuente);
        pnlDatos.add(lblSerie, gridBagConstraints1);
        gridBagConstraints1.gridx = 1;
        gridBagConstraints1.gridy = 0;
        gridBagConstraints1.fill = java.awt.GridBagConstraints.BOTH;
        gridBagConstraints1.insets = new java.awt.Insets(5, 5, 5, 5);
        cboSerie.setFont(fuente);
        pnlDatos.add(this.cboSerie, gridBagConstraints1);
        gridBagConstraints1.gridx = 2;
        gridBagConstraints1.gridy = 0;
        gridBagConstraints1.fill = java.awt.GridBagConstraints.BOTH;
        gridBagConstraints1.insets = new java.awt.Insets(5, 5, 5, 5);
        txtPreimpreso.setFont(fuente);
        pnlDatos.add(this.txtPreimpreso, gridBagConstraints1);
        gridBagConstraints1.gridx = 3;
        gridBagConstraints1.gridy = 0;
        gridBagConstraints1.fill = java.awt.GridBagConstraints.BOTH;
        gridBagConstraints1.insets = new java.awt.Insets(5, 5, 5, 5);
        cboTipoDocRef.setFont(fuente);
        pnlDatos.add(cboTipoDocRef, gridBagConstraints1);
        gridBagConstraints1.gridx = 4;
        gridBagConstraints1.gridy = 0;
        gridBagConstraints1.fill = java.awt.GridBagConstraints.BOTH;
        gridBagConstraints1.insets = new java.awt.Insets(5, 5, 5, 5);
        lblNumdocreferencia.setFont(fuente);
        pnlDatos.add(lblNumdocreferencia, gridBagConstraints1);
        gridBagConstraints1.gridx = 5;
        gridBagConstraints1.gridy = 0;
        gridBagConstraints1.fill = java.awt.GridBagConstraints.BOTH;
        gridBagConstraints1.insets = new java.awt.Insets(5, 5, 5, 5);
        txtSerieNumDocReferencia.setFont(fuente);
        pnlDatos.add(txtSerieNumDocReferencia, gridBagConstraints1);
        gridBagConstraints1.gridx = 6;
        gridBagConstraints1.gridy = 0;
        gridBagConstraints1.fill = java.awt.GridBagConstraints.BOTH;
        gridBagConstraints1.insets = new java.awt.Insets(5, 5, 5, 5);
        txtPreimpresoNumDocReferencia.setFont(fuente);
        pnlDatos.add(txtPreimpresoNumDocReferencia, gridBagConstraints1);
        gridBagConstraints1.gridx = 0;
        gridBagConstraints1.gridy = 1;
        gridBagConstraints1.gridwidth = 2;
        gridBagConstraints1.fill = java.awt.GridBagConstraints.BOTH;
        gridBagConstraints1.insets = new java.awt.Insets(5, 5, 5, 5);
        cboLocalidad.setPreferredSize(new Dimension(160, 0));
        cboLocalidad.setFont(fuente);
        pnlDatos.add(this.cboLocalidad, gridBagConstraints1);
        gridBagConstraints1.gridx = 2;
        gridBagConstraints1.gridy = 1;
        gridBagConstraints1.gridwidth = 1;
        gridBagConstraints1.fill = java.awt.GridBagConstraints.BOTH;
        gridBagConstraints1.insets = new java.awt.Insets(5, 5, 5, 5);
        cboPuntoVenta.setFont(fuente);
        cboPuntoVenta.setPreferredSize(new Dimension(160, 0));
        pnlDatos.add(this.cboPuntoVenta, gridBagConstraints1);
        gridBagConstraints1.gridx = 3;
        gridBagConstraints1.gridy = 1;
        gridBagConstraints1.gridwidth = 1;
        gridBagConstraints1.fill = java.awt.GridBagConstraints.BOTH;
        gridBagConstraints1.insets = new java.awt.Insets(5, 5, 5, 5);
        cboAlmacen.setPreferredSize(new Dimension(220, 0));
        cboAlmacen.setFont(fuente);
        pnlDatos.add(this.cboAlmacen, gridBagConstraints1);
        gridBagConstraints1.gridx = 4;
        gridBagConstraints1.gridy = 1;
        gridBagConstraints1.gridwidth = 2;
        gridBagConstraints1.fill = java.awt.GridBagConstraints.BOTH;
        gridBagConstraints1.insets = new java.awt.Insets(5, 5, 5, 5);
        lblFechaemision.setFont(fuente);
        lblFechaemision.setHorizontalAlignment(SwingConstants.RIGHT);
        pnlDatos.add(this.lblFechaemision, gridBagConstraints1);
        gridBagConstraints1.gridx = 6;
        gridBagConstraints1.gridy = 1;
        gridBagConstraints1.gridwidth = 1;
        gridBagConstraints1.fill = java.awt.GridBagConstraints.BOTH;
        gridBagConstraints1.insets = new java.awt.Insets(5, 5, 5, 5);
        dcFechaEmision.setFont(fuente);
        pnlDatos.add(this.dcFechaEmision, gridBagConstraints1);
        JPanel pnlGuiaRe = new JPanel();
        FlowLayout flowLayout = new FlowLayout();
        flowLayout.setAlignment(FlowLayout.LEFT);
        pnlGuiaRe.setLayout(flowLayout);
        lblTmpanexo.setFont(fuente);
        txtTmpAnexo.setFont(fuente);
        lblTmpruc.setFont(fuente);
        txtTmpRuc.setFont(fuente);
        lblNumguiareferencia.setFont(fuente);
        txtSerieGuiaReferencia.setFont(fuente);
        txtPreimpresoGuiaReferencia.setFont(fuente);
        pnlGuiaRe.add(lblTmpanexo);
        pnlGuiaRe.add(txtTmpAnexo);
        pnlGuiaRe.add(lblTmpruc);
        pnlGuiaRe.add(txtTmpRuc);
        pnlGuiaRe.add(lblNumguiareferencia);
        pnlGuiaRe.add(txtSerieGuiaReferencia);
        pnlGuiaRe.add(txtPreimpresoGuiaReferencia);
        gridBagConstraints1.gridx = 0;
        gridBagConstraints1.gridy = 2;
        gridBagConstraints1.gridwidth = 7;
        gridBagConstraints1.fill = java.awt.GridBagConstraints.BOTH;
        gridBagConstraints1.insets = new java.awt.Insets(5, 5, 5, 5);
        pnlDatos.add(pnlGuiaRe, gridBagConstraints1);
        JPanel pnlGuiaTrans = new JPanel();
        pnlGuiaTrans.setLayout(flowLayout);
        pnlGuiaTrans.add(this.lblIdempresaTransportista);
        pnlGuiaTrans.add(this.cboEmpresaTrans);
        pnlGuiaTrans.add(this.lblNumguiatransportista);
        pnlGuiaTrans.add(this.txtSerieGuiaTrans);
        pnlGuiaTrans.add(this.txtPreimpresoGuiaTrans);
        gridBagConstraints1.gridx = 0;
        gridBagConstraints1.gridy = 3;
        gridBagConstraints1.gridwidth = 7;
        gridBagConstraints1.fill = java.awt.GridBagConstraints.BOTH;
        gridBagConstraints1.insets = new java.awt.Insets(5, 5, 5, 5);
        pnlDatos.add(pnlGuiaTrans, gridBagConstraints1);
        pnlTable.setBorder(BorderFactory.createEtchedBorder());
        pnlTable.setLayout(new BorderLayout());
        JPanel pnlToolbar = new JPanel();
        pnlToolbar.setLayout(flowLayout);
        pnlTable.add(pnlToolbar, BorderLayout.NORTH);
        pnlTable.add(scrollTableguiaventa, BorderLayout.CENTER);
        pnlToolbar.add(this.chkSeleccionar);

        return pnlIngresoCompra;
    }

    private void inicialize() {
        xmoneda = new ArrayList();
        NumberFormat dispFormat = NumberFormat.getNumberInstance(Locale.US);
        NumberFormatter dnFormat = new NumberFormatter(dispFormat);
        DefaultFormatterFactory currFactory = new DefaultFormatterFactory(dnFormat, dnFormat);

        super.pnlRegister.setPreferredSize(new Dimension(100, 485));
        super.setMaximizable(false);
        super.setSize(1030, 545);
        super.setLocation(((Toolkit.getDefaultToolkit().getScreenSize().width - getSize().width) / 2), (Toolkit.getDefaultToolkit().getScreenSize().height - getSize().height) / 20);

        gif = new Gif();

        JPanel pnlDialog = new JPanel();
        pnlDialog.setLayout(new javax.swing.BoxLayout(pnlDialog, javax.swing.BoxLayout.Y_AXIS));
        JPanel pnlMovimientos = new JPanel();
        pnlDialog.add(pnlMovimientos);
        FlowLayout flowLayout = new FlowLayout();
        flowLayout.setAlignment(FlowLayout.LEFT);
        pnlMovimientos.setLayout(flowLayout);
        lblMovimiento = new JLabel("MOVIMIENTO");
        lblMovimiento.setFont(fuente);
        pnlMovimientos.add(lblMovimiento);
        cboTipoMov = new JComboBox();
        cboTipoMov.setFont(fuente);
        cboTipoMov.addItemListener(this);
        cboTipoMov.addKeyListener(this);
        pnlMovimientos.add(cboTipoMov);

        btnBuscarDocumento = new JButton("F5", gif.SEARCH16);
        btnBuscarDocumento.setFont(fuente);
        btnBuscarDocumento.setMnemonic('B');
        btnBuscarDocumento.setOpaque(false);
        btnBuscarDocumento.setIconTextGap(10);
        btnBuscarDocumento.setToolTipText("Buscar Documento");
        btnBuscarDocumento.setHorizontalAlignment(SwingConstants.LEFT);
        btnBuscarDocumento.setContentAreaFilled(true);
        btnBuscarDocumento.setBorderPainted(true);
        btnBuscarDocumento.setFocusable(true);
        btnBuscarDocumento.setFocusPainted(false);
        btnBuscarDocumento.addFocusListener(this);
        btnBuscarDocumento.addActionListener(this);
        btnBuscarDocumento.addKeyListener(this);

        pnlMovimientos.add(btnBuscarDocumento);
        lblIdmovinventario = new JLabel("ID MOVIMIENTO");
        lblIdmovinventario.setFont(fuente);
        pnlMovimientos.add(lblIdmovinventario);

        txtIdMovimientoOrigen = new JTextField();
        txtIdMovimientoOrigen.setFont(fuente);
        txtIdMovimientoOrigen.setColumns(10);
        txtIdMovimientoOrigen.setEditable(false);
        pnlMovimientos.add(txtIdMovimientoOrigen);
        pnlDialog.add(contenidoScrollPane);
        lblNumdocreferencia = new JLabel("NÂ° DOC");
        lblTmpanexo = new JLabel("R. SOCIAL");
        lblTmpruc = new JLabel("RUC/DNI");
        lblNumguiareferencia = new JLabel("GUIA REMISION");
        lblNumguiareferencia.setVisible(true);
        lblFechaemision = new JLabel("FECHA DE INGRESO");
        lblFechaemision.setDisplayedMnemonic('c');
        lblIdempresaTransportista = new JLabel("EMP. TRANSPORTISTA");
        lblIdempresaTransportista.setFont(fuente);
        lblNumguiatransportista = new JLabel("GUIA TRANSPORTISTA");
        lblNumguiatransportista.setFont(fuente);
        cboSerie = new JComboBox();
        cboSerie.addItemListener(this);

        txtPreimpreso = new JTextField();
        txtPreimpreso.setEnabled(false);
        txtPreimpreso.setDocument(new IntegerDocument(10));
        txtPreimpreso.addFocusListener(this);
        txtPreimpreso.addKeyListener(this);

        cboTipoDocRef = new JComboBox();
        cboTipoDocRef.addKeyListener(this);

        txtSerieNumDocReferencia = new JTextField();
        FormatObject.formatJTextFieldSerie(txtSerieNumDocReferencia);
        txtSerieNumDocReferencia.setColumns(5);
        txtSerieNumDocReferencia.addKeyListener(this);
        txtSerieNumDocReferencia.addFocusListener(this);
        txtSerieNumDocReferencia.setForeground(Color.BLACK);

        txtPreimpresoNumDocReferencia = new JTextField();
        txtPreimpresoNumDocReferencia.setColumns(10);
        txtPreimpresoNumDocReferencia.addKeyListener(this);
        txtPreimpresoNumDocReferencia.addFocusListener(this);
        txtPreimpresoNumDocReferencia.setDocument(new IntegerDocument(10));

        cboLocalidad = new JComboBox();
        cboLocalidad.setEnabled(false);
        cboLocalidad.addItemListener(this);
        cboPuntoVenta = new JComboBox();
        cboPuntoVenta.setEnabled(false);
        cboPuntoVenta.addItemListener(this);

        cboAlmacen = new JComboBox();
        cboAlmacen.addItemListener(this);
        cboAlmacen.setEnabled(false);

        txtTmpAnexo = new JTextField();
        txtTmpAnexo.setColumns(20);
        txtTmpAnexo.addKeyListener(this);
        txtTmpAnexo.setEditable(false);

        txtTmpRuc = new JTextField();
        txtTmpRuc.setColumns(8);
        txtTmpRuc.addFocusListener(this);
        txtTmpRuc.setEditable(false);
        txtTmpRuc.addKeyListener(this);

        txtSerieGuiaReferencia = new JTextField();
        FormatObject.formatJTextFieldSerie(txtSerieGuiaReferencia);
        txtSerieGuiaReferencia.addKeyListener(this);
        txtSerieGuiaReferencia.addFocusListener(this);
        txtSerieGuiaReferencia.setForeground(Color.BLACK);

        txtPreimpresoGuiaReferencia = new JTextField();
        txtPreimpresoGuiaReferencia.setColumns(8);
        txtPreimpresoGuiaReferencia.addKeyListener(this);
        txtPreimpresoGuiaReferencia.addFocusListener(this);
        txtPreimpresoGuiaReferencia.setDocument(new IntegerDocument(10));
        txtPreimpresoGuiaReferencia.setForeground(Color.BLACK);

        dcFechaEmision = new JDateChooser("dd/MM/yyyy", "##/##/####", '_');
        dcFechaEmision.getJCalendar().addFocusListener(this);
        dcFechaEmision.getJCalendar().addKeyListener(this);
        dcFechaEmision.getCalendarButton().addActionListener(this);
        dcFechaEmision.addKeyListener(this);
        dcFechaEmision.addFocusListener(this);
        ((JTextField) dcFechaEmision.getDateEditor()).registerKeyboardAction(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                dcFechaEmision.getCalendarButton().doClick();
            }
        }, KeyStroke.getKeyStroke(KeyEvent.VK_SPACE, 0, false), JComponent.WHEN_FOCUSED);

        cboEmpresaTrans = new JComboBox();
        cboEmpresaTrans.setFont(fuente);
        cboEmpresaTrans.addKeyListener(this);

        txtSerieGuiaTrans = new JTextField();
        FormatObject.formatJTextFieldSerie(txtSerieGuiaTrans);
        txtSerieGuiaTrans.addKeyListener(this);
        txtSerieGuiaTrans.setFont(fuente);
        txtSerieGuiaTrans.addFocusListener(this);
        txtSerieGuiaTrans.setForeground(Color.BLACK);

        txtPreimpresoGuiaTrans = new JTextField();
        txtPreimpresoGuiaTrans.setColumns(8);
        txtPreimpresoGuiaTrans.setFont(fuente);
        txtPreimpresoGuiaTrans.addKeyListener(this);
        txtPreimpresoGuiaTrans.addFocusListener(this);
        txtPreimpresoGuiaTrans.setDocument(new IntegerDocument(10));
        txtPreimpresoGuiaTrans.setForeground(Color.BLACK);

        JPanel pnl = new JPanel(new BorderLayout());
        pnl.setBackground(new Color(245, 245, 245));
        mdlOrdencompra = new OrdenCompraDetalleTableModel();
        editorCompra = new CellEditorBtnLote(this, mdlOrdencompra);
        mdlOrdencompra.addTableModelListener(this);
        tblOrdenCompra = new CTable();
        tblOrdenCompra.setModel(mdlOrdencompra);
        tblOrdenCompra.setAllTableNoEditable();
        tblOrdenCompra.setAllColumnNoResizable();
        tblOrdenCompra.getColumnModel().getColumn(9).setCellEditor(new DigitTextFieldCellEditor(EnumClass.TipoDatoEditor.DOUBLE_EDITOR).cellEditor);
        tblOrdenCompra.setAllColumnPreferredWidth();

        tblOrdenCompra.setNoVisibleColumn(12);
        tblOrdenCompra.setNoVisibleColumn(13);
        tblOrdenCompra.setColumnMinWidth(0, 40);
        tblOrdenCompra.setColumnMaxWidth(0, 40);
        tblOrdenCompra.setColumnMinWidth(1, 50);
        tblOrdenCompra.setColumnMaxWidth(1, 50);

        scrollTableguiaventa = new JScrollPane(tblOrdenCompra);
        tabbOrdencompra = new JTabbedPane();
        JPanel pnlTabbOrdencompra = new JPanel(new BorderLayout());
        pnlTabbOrdencompra.setBackground(new Color(245, 245, 245));
        pnlTabbOrdencompra.add(pnl, BorderLayout.CENTER);
        JToolBar toolbar = new JToolBar();
        toolbar.setBackground(new Color(245, 245, 245));
        toolbar.setFloatable(false);
        toolbar.setPreferredSize(new Dimension(0, 30));
        btnAgregar = new JButton("Agregar", gif.ADD16);
        btnAgregar.setMnemonic('A');
        btnAgregar.setHorizontalAlignment(SwingConstants.LEFT);
        btnAgregar.setIconTextGap(10);
        btnAgregar.addActionListener(this);
        btnAgregar.setOpaque(false);
        btnAgregar.addKeyListener(this);
        btnAgregar.setFocusPainted(false);
        btnAgregar.setFont(new Font("Comic Sans MS", 0, 11));
        toolbar.add(btnAgregar);
        toolbar.addSeparator();
        btnQuitar = new JButton("Quitar", gif.ELIMINATE16);
        btnQuitar.setMnemonic('Q');
        btnQuitar.setHorizontalAlignment(SwingConstants.LEFT);
        btnQuitar.setIconTextGap(10);
        btnQuitar.addActionListener(this);
        btnQuitar.setOpaque(false);
        btnQuitar.addKeyListener(this);
        btnQuitar.setFocusPainted(false);
        btnQuitar.setFont(new Font("Comic Sans MS", 0, 11));
        toolbar.add(btnQuitar);
        pnlTabbOrdencompra.add(toolbar, BorderLayout.NORTH);
        tabbOrdencompra.addTab("", pnlTabbOrdencompra);
        tabbOrdencompra.setTitleAt(0, "Item");
        tabbOrdencompra.setBounds(13, 145, 970, 230);

        JPanel pnl6 = new JPanel(new BorderLayout());
        pnl6.setBackground(new Color(245, 245, 245));
        mdlNotaSalida = new DocumentoVentaDetalleTableModel();
        editorEntrada = new CellEditorBtnLote(this, mdlNotaSalida);
        mdlNotaSalida.addTableModelListener(this);
        tblNotaSalida = new CTable();
        tblNotaSalida.setModel(mdlNotaSalida);
        tblNotaSalida.setAllColumnNoResizable();
        tblNotaSalida.setAllTableNoEditable();
        tblNotaSalida.setColumnEditor(11, new DigitTextFieldCellEditor(EnumClass.TipoDatoEditor.DOUBLE_EDITOR).cellEditor);
        tblNotaSalida.setAllColumnPreferredWidth();
        scrollTableguiaventa6 = new JScrollPane(tblNotaSalida);
        pnl6.add(scrollTableguiaventa6, BorderLayout.CENTER);
        tabbNotaSalida = new JTabbedPane();
        JPanel pnlTabbNotaSalida = new JPanel(new BorderLayout());
        pnlTabbNotaSalida.setBackground(new Color(245, 245, 245));
        pnlTabbNotaSalida.add(pnl6, BorderLayout.CENTER);
        JToolBar toolbar7 = new JToolBar();
        toolbar7.setBackground(new Color(245, 245, 245));
        toolbar7.setFloatable(false);
        toolbar7.setPreferredSize(new Dimension(0, 30));
        toolbar7.addSeparator();
        pnlTabbNotaSalida.add(toolbar7, BorderLayout.NORTH);
        tabbNotaSalida.addTab("", pnlTabbNotaSalida);
        tabbNotaSalida.setTitleAt(0, "Item");
        tabbNotaSalida.setBounds(13, 145, 970, 230);

        JPanel pnl7 = new JPanel(new BorderLayout());
        pnl7.setBackground(new Color(245, 245, 245));
        mdlInventarioinicial = new OrdenCompraDetalleTableModel();
        mdlInventarioinicial.addTableModelListener(this);
        tblInventarioinicial = new CTable();
        tblInventarioinicial.setModel(mdlInventarioinicial);
        tblInventarioinicial.setAllColumnNoResizable();
        tblInventarioinicial.setAllTableNoEditable();
        tblInventarioinicial.setColumnEditor(11, new DigitTextFieldCellEditor(EnumClass.TipoDatoEditor.DOUBLE_EDITOR).cellEditor);
        tblInventarioinicial.setAllColumnPreferredWidth();
        scrollTableguiaventa7 = new JScrollPane(tblInventarioinicial);
        pnl7.add(scrollTableguiaventa7, BorderLayout.CENTER);
        tabbInventarioinicial = new JTabbedPane();
        JPanel pnltabbNotaSalida8 = new JPanel(new BorderLayout());
        pnltabbNotaSalida8.setBackground(new Color(245, 245, 245));
        pnltabbNotaSalida8.add(pnl7, BorderLayout.CENTER);
        JToolBar toolbar8 = new JToolBar();
        toolbar8.setBackground(new Color(245, 245, 245));
        toolbar8.setFloatable(false);
        toolbar8.setPreferredSize(new Dimension(0, 30));
        toolbar8.addSeparator();
        pnltabbNotaSalida8.add(toolbar8, BorderLayout.NORTH);
        tabbInventarioinicial.addTab("", pnltabbNotaSalida8);
        tabbInventarioinicial.setTitleAt(0, "Item");
        tabbInventarioinicial.setBounds(13, 145, 970, 230);

        chkSeleccionar = new JCheckBox("SELECCIONAR TODO");
        chkSeleccionar.addItemListener(this);
        chkSeleccionar.setFont(fuente);
        chkSeleccionar.addKeyListener(this);
        chkSeleccionar.setHorizontalTextPosition(SwingConstants.LEFT);
        chkSeleccionar.addFocusListener(this);
        chkSeleccionar.setOpaque(false);

        tabbGuiatransferencia = new JTabbedPane();
        JPanel pnltabbGuiatransferencia = new JPanel(new BorderLayout());
        pnltabbGuiatransferencia.setBackground(new Color(245, 245, 245));

        JPanel pnl3 = new JPanel(new BorderLayout());
        pnl3.setBackground(new Color(245, 245, 245));
        mdlGuiatransferencia = new GuiaTransferenciaDetalleTableModel();
        mdlGuiatransferencia.addTableModelListener(this);
        tblGuiatransferencia = new CTable();
        tblGuiatransferencia.setModel(mdlGuiatransferencia);
        tblGuiatransferencia.setAllTableNoEditable();
        tblGuiatransferencia.setAllColumnNoResizable();
        tblGuiatransferencia.setNoVisibleColumn(0);
        tblGuiatransferencia.setNoVisibleColumn(6);
        tblGuiatransferencia.setNoVisibleColumn(7);
        tblGuiatransferencia.setNoVisibleColumn(8);
        tblGuiatransferencia.setNoVisibleColumn(9);
        tblGuiatransferencia.setNoVisibleColumn(10);
        tblGuiatransferencia.setNoVisibleColumn(11);
        tblGuiatransferencia.setNoVisibleColumn(12);
        tblGuiatransferencia.setNoVisibleColumn(13);
        tblGuiatransferencia.setNoVisibleColumn(14);
        tblGuiatransferencia.setNoVisibleColumn(15);
        tblGuiatransferencia.setNoVisibleColumn(16);
        tblGuiatransferencia.setNoVisibleColumn(17);
        tblGuiatransferencia.setNoVisibleColumn(18);
        tblGuiatransferencia.setNoVisibleColumn(19);
        tblGuiatransferencia.setNoVisibleColumn(20);
        tblGuiatransferencia.setNoVisibleColumn(25);
        tblGuiatransferencia.setColumnEditable(8);
        tblGuiatransferencia.getColumnModel().getColumn(8).setCellEditor(new DigitTextFieldCellEditor(EnumClass.TipoDatoEditor.DOUBLE_EDITOR).cellEditor);
        tblGuiatransferencia.setAllColumnPreferredWidth();
        scrollTableGuiaTraDetalle = new JScrollPane(tblGuiatransferencia);
        pnl3.add(scrollTableGuiaTraDetalle, BorderLayout.CENTER);
        pnltabbGuiatransferencia.add(pnl3, BorderLayout.CENTER);

        tabbGuiatransferencia.addTab("", pnltabbGuiatransferencia);
        tabbGuiatransferencia.setTitleAt(0, "Item");
        tabbGuiatransferencia.setBounds(13, 200, 1150, 250);

        tabbDevolucionclienteDespachado = new JTabbedPane();
        JPanel pnltabbDevolucionclienteDespachado = new JPanel(new BorderLayout());
        pnltabbDevolucionclienteDespachado.setBackground(new Color(245, 245, 245));

        JPanel pnlDevolucionclienteDespachado = new JPanel(new BorderLayout());
        pnlDevolucionclienteDespachado.setBackground(new Color(245, 245, 245));
        mdlDevolucionClienteDespachado = new IngresoDevolucionDespachadoTableModel();
        editorDevolucion = new CellEditorBtnLote(this, mdlDevolucionClienteDespachado);
        mdlDevolucionClienteDespachado.addTableModelListener(this);
        tblDevolucionclienteDespachado = new CTable();
        tblDevolucionclienteDespachado.setModel(mdlDevolucionClienteDespachado);
        tblDevolucionclienteDespachado.setAllTableNoEditable();
        tblDevolucionclienteDespachado.setAllColumnNoResizable();
        tblDevolucionclienteDespachado.getColumnModel().getColumn(10).setCellEditor(new DigitTextFieldCellEditor(EnumClass.TipoDatoEditor.DOUBLE_EDITOR).cellEditor);
        tblDevolucionclienteDespachado.setAllColumnPreferredWidth();
        scrollDevolucionclienteDespachado = new JScrollPane(tblDevolucionclienteDespachado);
        pnlDevolucionclienteDespachado.add(scrollDevolucionclienteDespachado, BorderLayout.CENTER);
        pnltabbDevolucionclienteDespachado.add(pnlDevolucionclienteDespachado, BorderLayout.CENTER);

        JToolBar toolbarDevolucionclienteDespachado = new JToolBar();
        toolbarDevolucionclienteDespachado.setBackground(new Color(245, 245, 245));
        toolbarDevolucionclienteDespachado.setFloatable(false);
        toolbarDevolucionclienteDespachado.setPreferredSize(new Dimension(0, 30));

        tabbDevolucionclienteDespachado.addTab("", pnltabbDevolucionclienteDespachado);
        tabbDevolucionclienteDespachado.setTitleAt(0, "Item");
        tabbDevolucionclienteDespachado.setBounds(13, 115, 970, 260);
        txtAfecto = new JFormattedTextField();

        txtAfecto.setBounds(45, 385, 100, 20);

        txtAfecto.setHorizontalAlignment(SwingConstants.RIGHT);
        txtAfecto.setFont(new Font(Font.SANS_SERIF, 1, 13));
        txtAfecto.addKeyListener(this);
        txtAfecto.setEditable(false);
        txtAfecto.setFormatterFactory(currFactory);

        txtNoafecto = new JFormattedTextField();

        txtNoafecto.setBounds(230, 385, 100, 20);

        txtNoafecto.setHorizontalAlignment(SwingConstants.RIGHT);
        txtNoafecto.setFont(new Font(Font.SANS_SERIF, 1, 13));
        txtNoafecto.setFormatterFactory(currFactory);
        txtNoafecto.addKeyListener(this);
        txtNoafecto.setEditable(false);

        txtIgv = new JTextField();
        txtIgv.setBounds(380, 385, 100, 20);
        txtIgv.setHorizontalAlignment(SwingConstants.RIGHT);
        txtIgv.setFont(new Font(Font.SANS_SERIF, 1, 13));
        txtIgv.addKeyListener(this);
        txtIgv.setEditable(false);

        txtMonto = new JFormattedTextField();

        txtMonto.setBounds(550, 385, 100, 25);

        txtMonto.addKeyListener(this);
        txtMonto.setFont(new Font(Font.SANS_SERIF, 1, 16));
        txtMonto.setEditable(false);
        txtMonto.setHorizontalAlignment(SwingConstants.RIGHT);
        txtMonto.setForeground(Color.RED);
        txtMonto.setFormatterFactory(currFactory);

        txtPercepcion = new JTextField();

        txtPercepcion.setBounds(695, 385, 90, 25);

        txtPercepcion.setHorizontalAlignment(SwingConstants.RIGHT);
        txtPercepcion.addKeyListener(this);
        txtPercepcion.setForeground(Color.BLUE);
        txtPercepcion.setFont(new Font(Font.SANS_SERIF, 1, 16));
        txtPercepcion.setEditable(false);

        txtTotal = new JFormattedTextField();
        txtTotal.setBounds(835, 385, 100, 25);
        txtTotal.setHorizontalAlignment(SwingConstants.RIGHT);
        txtTotal.addKeyListener(this);
        txtTotal.setForeground(Color.darkGray);
        txtTotal.setFont(new Font(Font.SANS_SERIF, 1, 16));
        txtTotal.setEditable(false);
        txtTotal.setFormatterFactory(currFactory);

        txtGuiaRemision = new JTextField();
        txtFlagdescuento = new JTextField();
        txtIdestado = new JTextField();
        txtDescuento = new JTextField();
        txtCodigodoc = new JTextField();
        txtCodRegContaCab = new JTextField();
        txtIdmovimientodestino = new JTextField();
        txtCodCliente = new JTextField();
        cboMoneda = new JComboBox();
        txtTipocambio = new JTextField();
        txtIdauxiliar = new JTextField();
        txtFlagdetigv = new JTextField();

        setRegister(pnlDialog);
    }

    public void cargarDocumentoVenta(List<ContaItem> m) {
        if (m != null && m.size() > 0) {
            ContaItem regContaCab = m.get(0);
            if (com.softcommerce.util.Constans.ISBOTICA) {
                LogicLote logicLote = new LogicLote(path);
                listaLotes = logicLote.lotesRestantesPorDespachar(regContaCab.getId_regcontacab());
            }
            txtCodCliente.setText(regContaCab.getId_anexo());
            txtCodRegContaCab.setText(regContaCab.getId_regcontacab());
            System.out.println(regContaCab.getId_regcontacab());
            txtIdauxiliar.setText(regContaCab.getId_auxiliar());
            txtSerieNumDocReferencia.setText(regContaCab.getSerie());
            txtPreimpresoNumDocReferencia.setText(regContaCab.getPreimpreso());
            txtTmpAnexo.setText(regContaCab.getTmpanexo());
            txtTmpRuc.setText(regContaCab.getTmpruc());
            idCondicionventa = regContaCab.getId_condicion_venta();

            mdlDevolucionClienteDespachado.clearTable();
            chkSeleccionar.setSelected(false);
            mdlDevolucionClienteDespachado.agregarVectorVentaDirecta(m);

            chkSeleccionar.setSelected(true);
            tblDevolucionclienteDespachado.setAllColumnPreferredWidth();
            if (mdlDevolucionClienteDespachado.getRowCount() > 0) {
                cargarAlmacen(mdlDevolucionClienteDespachado.getVentaDirecta(0).getId_almacen());
                cargarAlmacen(m.get(0).getId_almacen());
            }
            LogicRegContaCab obj = new LogicRegContaCab(path);
            String Moneda = obj.RetornaMonedaNC(regContaCab.getId_regcontacab());
            System.out.print(Moneda);
            regContaCab.setIdMoneda(Moneda);

            cargarMoneda(regContaCab.getIdMoneda());
            if (regContaCab.getId_tipo_doc().equalsIgnoreCase("01")) {
                cboTipoDocRef.setSelectedIndex(0);
            } else if (regContaCab.getId_tipo_doc().equalsIgnoreCase("03")) {
                cboTipoDocRef.setSelectedIndex(1);
            } else if (regContaCab.getId_tipo_doc().equalsIgnoreCase("TI")) {
                cboTipoDocRef.setSelectedIndex(2);
            } else {
                JOptionPane.showMessageDialog(null, "Error :Comuniquese urgente con el servicio de mantenimiento");
            }
            almacenDevolucion = m.get(0).getId_almacen();
            chkSeleccionar.requestFocus();
        }
    }

    private String getXmlLotes(ArrayList<Lote> arrayLotes) {
        Iterator<Lote> iterador = arrayLotes.iterator();
        StringBuilder builder = new StringBuilder();
        builder.append("<?xml version=\"1.0\" ?> ");
        builder.append("<LOTES>");
        while (iterador.hasNext()) {
            Lote beanLote = iterador.next();
            builder.append("<LOTE>");
            builder.append("<IDLOTE>");
            builder.append(beanLote.getIdLote());
            builder.append("</IDLOTE>");
            builder.append("<NUMERO>");
            builder.append(beanLote.getNumero());
            builder.append("</NUMERO>");
            builder.append("<SERIE>");
            builder.append(beanLote.getSerie());
            builder.append("</SERIE>");
            builder.append("<CANTIDAD>");
            builder.append(Util.getNumberXml(beanLote.getCantidad()));
            builder.append("</CANTIDAD>");
            builder.append("<SALDO>");
            builder.append(Util.getNumberXml(beanLote.getSaldo()));
            builder.append("</SALDO>");
            builder.append("<FECHAFABRICACION>");
            builder.append(beanLote.getFechaFabricacion() != null ? UtilDate.getStrFecha(beanLote.getFechaFabricacion()) : null);
            builder.append("</FECHAFABRICACION>");
            builder.append("<FECHACADUCIDAD>");
            builder.append(UtilDate.getStrFecha(beanLote.getFechaCaducidad()));
            builder.append("</FECHACADUCIDAD>");
            builder.append("<IDLABORATORIO>");
            builder.append(beanLote.getIdLaboratorio());
            builder.append("</IDLABORATORIO>");
            builder.append("<IDUBICACION>");
            builder.append(beanLote.getIdUbicacion());
            builder.append("</IDUBICACION>");
            builder.append("<IDMOVIMIENTODEV>");
            builder.append(beanLote.getIdMovimientoDev());
            builder.append("</IDMOVIMIENTODEV>");
            builder.append("<EXPIRA>");
            builder.append(beanLote.isNoExpira() ? 'N' : 'S');
            builder.append("</EXPIRA>");
            builder.append("</LOTE>");
        }
        builder.append("</LOTES>");
        System.out.println(builder.toString());
        return builder.toString();
    }

    private void selectCheck(boolean isSelect) {
        if (this.getIdTipoMov().equals(TipoMovInventarioEnum.INGRESO_MERCADERIA.getValue()) || this.getIdTipoMov().equals(TipoMovInventarioEnum.INGRESO_TRANSITO.getValue())) {
            for (int i = 0; i < mdlOrdencompra.getRowCount(); i++) {
                if (com.softcommerce.util.Constans.ISBOTICA) {
                    if (!(mdlOrdencompra.getOrdenCompraDet(i).isSeleccionado() && isSelect)) {
                        mdlOrdencompra.getOrdenCompraDet(i).setCantidad_string(BigDecimal.ZERO.toString());
                        mdlOrdencompra.getOrdenCompraDet(i).getListaLotes().clear();
                    }
                    mdlOrdencompra.getOrdenCompraDet(i).setSeleccionado(isSelect);
                } else {
                    mdlOrdencompra.getOrdenCompraDet(i).setSeleccionado(isSelect);
                    mdlOrdencompra.getOrdenCompraDet(i).setCantidad_string(mdlOrdencompra.getOrdenCompraDet(i).isSeleccionado() ? String.valueOf(mdlOrdencompra.getOrdenCompraDet(i).getCantidad_double()) : "");
                }
            }
            mdlOrdencompra.fireTableDataChanged();
        }
        if (this.getIdTipoMov().equals(TipoMovInventarioEnum.INGRESO_DEVOLUCION_CLIENTE.getValue())) {
            for (int i = 0; i < mdlDevolucionClienteDespachado.getRowCount(); i++) {
                if (Constans.ISBOTICA) {
                    if (isSelect) {
                        mdlDevolucionClienteDespachado.getVentaDirecta(i).setSeleccionado(isSelect);
                        ContaItem bean = mdlDevolucionClienteDespachado.getVentaDirecta(i);
                        if (listaLotes != null) {
                            Iterator<Lote> iterador = listaLotes.iterator();
                            BigDecimal sumCantidadDevolver = BigDecimal.ZERO;
                            while (iterador.hasNext()) {
                                Lote lot = iterador.next();
                                if (bean.getId_movimiento().equals(lot.getIdMovimiento()) && bean.getId_item().equals(lot.getIdItem())) {
                                    lot.setEstadoOperacion("i");
                                    bean.getListaLotes().add(lot);
                                    sumCantidadDevolver = sumCantidadDevolver.add(lot.getCantidad());
                                }
                            }
                            bean.setXmlLotes(getXmlLotes(bean.getListaLotes()));
                            mdlDevolucionClienteDespachado.getVentaDirecta(i).setCant_a_devolver(sumCantidadDevolver.toString());
                        } else {
                            bean.setXmlLotes(null);
                            mdlDevolucionClienteDespachado.getVentaDirecta(i).setCant_a_devolver(mdlDevolucionClienteDespachado.getVentaDirecta(i).isSeleccionado() ? String.valueOf(mdlDevolucionClienteDespachado.getVentaDirecta(i).getCant_pordevolver_cliente()) : "");
                        }
                        mdlDevolucionClienteDespachado.getVentaDirecta(i).calcularMontos("C");
                    } else {
                        mdlDevolucionClienteDespachado.getVentaDirecta(i).setSeleccionado(isSelect);
                        mdlDevolucionClienteDespachado.getVentaDirecta(i).setCant_a_devolver(BigDecimal.ZERO.toString());
                        mdlDevolucionClienteDespachado.getVentaDirecta(i).calcularMontos("C");
                        mdlDevolucionClienteDespachado.getVentaDirecta(i).getListaLotes().clear();
                        mdlDevolucionClienteDespachado.getVentaDirecta(i).setXmlLotes(null);
                    }
                } else {
                    mdlDevolucionClienteDespachado.getVentaDirecta(i).setSeleccionado(isSelect);
                    mdlDevolucionClienteDespachado.getVentaDirecta(i).setCant_a_devolver(mdlDevolucionClienteDespachado.getVentaDirecta(i).isSeleccionado() ? String.valueOf(mdlDevolucionClienteDespachado.getVentaDirecta(i).getCant_pordevolver_cliente()) : "");
                    mdlDevolucionClienteDespachado.getVentaDirecta(i).calcularMontos("C");
                }
            }

            mdlDevolucionClienteDespachado.fireTableDataChanged();
        }

        if (this.getIdTipoMov().equals(TipoMovInventarioEnum.INGRESO_INVENTARIO_INICIAL.getValue())) {
            for (int i = 0; i < mdlInventarioinicial.getRowCount(); i++) {
                mdlInventarioinicial.getOrdenCompraDet(i).setSeleccionado(isSelect);
                mdlInventarioinicial.getOrdenCompraDet(i).setCantidad_string(mdlInventarioinicial.getOrdenCompraDet(i).isSeleccionado() ? String.valueOf(mdlInventarioinicial.getOrdenCompraDet(i).getCantidad_double()) : "");
            }

            mdlInventarioinicial.fireTableDataChanged();
        }

        if (this.getIdTipoMov().equals(TipoMovInventarioEnum.INGRESO_AJUSTE_INVENTARIO.getValue())) {
            for (int i = 0; i < mdlNotaSalida.getRowCount(); i++) {
                if (com.softcommerce.util.Constans.ISBOTICA) {
                    if (mdlNotaSalida.getDocumentoVentaDet(i).isSeleccionado() && isSelect) {

                    } else {
                        mdlNotaSalida.getDocumentoVentaDet(i).setCantidad_despachar(BigDecimal.ZERO.toString());
                        mdlNotaSalida.getDocumentoVentaDet(i).getListaLotes().clear();
                    }
                    mdlNotaSalida.getDocumentoVentaDet(i).setSeleccionado(isSelect);
                } else {
                    mdlNotaSalida.getDocumentoVentaDet(i).setSeleccionado(isSelect);
                    mdlNotaSalida.getDocumentoVentaDet(i).setCantidad_despachar(mdlNotaSalida.getDocumentoVentaDet(i).isSeleccionado() ? String.valueOf(mdlNotaSalida.getDocumentoVentaDet(i).getTransito()) : "");
                }
            }

            mdlNotaSalida.fireTableDataChanged();
        }
    }

    private void changeAlmacen() {
        if (!this.getIdTipoMov().equals(TipoMovInventarioEnum.INGRESO_DEVOLUCION_CLIENTE.getValue())) {
            return;
        }
        ItemObject itAlmacen = (ItemObject) cboAlmacen.getSelectedItem();
        mdlDevolucionClienteDespachado.changeAlmacen(itAlmacen.getId(), itAlmacen.getDescription());
    }

    @Override
    public void itemStateChanged(ItemEvent e) {
        editorCompra.stopCellEditing();
        editorDevolucion.stopCellEditing();
        editorEntrada.stopCellEditing();
        boolean isSelect = (e.getStateChange() == ItemEvent.SELECTED);
        if (e.getItemSelectable() == chkSeleccionar) {
            this.selectCheck(isSelect);
        }
        if (e.getSource().equals(cboTipoMov)) {
            setFormato(this.getIdTipoMov());
        }
        if (e.getSource().equals(cboPuntoVenta)) {
            loadAlmacen();
        }
        if (e.getSource().equals(cboLocalidad)) {
            loadPuntoVenta();
        }
        if (e.getSource().equals(cboAlmacen)) {
            changeAlmacen();
        }
        if (e.getSource().equals(cboSerie) && mode == INSERT) {
            if (cboSerie.getSelectedIndex() > -1) {
                mostrarPreimpreso();
            }
        }
    }

    @Override
    public void loadCombo() {
        try {
            loadLocalidad(usuario.getCodempresa());
            loadMovimiento();
            loadEmpresaTransportista();
            loadMoneda();
        } catch (Exception ex) {
            ExceptionHandler.handleException(ex, logger);
            JOptionPane.showMessageDialog(this, ex.getMessage());
        }
    }

    public void loadMovimiento() throws Exception {
        try {
            RnTipoMovInventario regla = new RnTipoMovInventario(path);
            if (xTipoMov != null) {
                xTipoMov.clear();
            } else {
                xTipoMov = new ArrayList();
            }
            TipoMovInventario t = new TipoMovInventario();
            t.setTipo("E");
            t.setHabNi("S");
            xTipoMov.addAll(regla.listar(t));
            cboTipoMov.removeAllItems();
            for (int i = 0; i < xTipoMov.size(); i++) {
                cboTipoMov.addItem(xTipoMov.get(i).getDescripcion());
            }
            if (cboTipoMov.getItemCount() > 0) {
                cboTipoMov.setSelectedItem("INGRESO POR COMPRA DE MERCADERIA");
            }
        } catch (Exception e) {
            throw e;
        }
    }

    public void loadEmpresaTransportista() throws Exception {
        try {
            Anexo a = new Anexo();
            a.setIdTipoAnexo("6");
            a.setNumeroInicial(-1);
            a.setNumeroFinal(-1);
            a.setIdEmpresa(usuario.getCodempresa());
            RnAnexo reglaAnexo = new RnAnexo(path);
            if (xEmpresaTransportista != null) {
                xEmpresaTransportista.clear();
            } else {
                xEmpresaTransportista = new ArrayList();
            }
            xEmpresaTransportista.addAll(reglaAnexo.listarAnexo(a));

            cboEmpresaTrans.removeAllItems();
            cboEmpresaTrans.addItem("--- Seleccione una Empresa de Transporte ---");

            for (int i = 0; i < xEmpresaTransportista.size(); i++) {
                cboEmpresaTrans.addItem(xEmpresaTransportista.get(i).getDescripcion());
            }

            cboEmpresaTrans.setSelectedIndex(0);
        } catch (Exception e) {
            throw e;
        }
    }

    private void loadMoneda() throws Exception {
        try {
            LoadCombo.loadMoneda(path, xmoneda, cboMoneda,
                    Constans.ITEM_INIT_MONEDA, 0);
        } catch (Exception ex) {
            throw ex;
        }
    }

    public void loadSerieCorrelativo(String idtipoDoc) {
        try {
            RnCorrelativo logicCorrelativo = new RnCorrelativo(path);
            if (xserie != null) {
                xserie.clear();
            } else {
                xserie = new ArrayList();
            }
            xserie.addAll(logicCorrelativo.listarCorrelativo(usuario.getId_usuario(), usuario.getCodpuntoventa(), idtipoDoc));
            cboSerie.removeAllItems();

            for (int i = 0; i < xserie.size(); i++) {
                cboSerie.addItem(xserie.get(i).getSerie());
            }

            if (cboSerie.getItemCount() > 0) {
                cboSerie.setSelectedIndex(0);
            }
        } catch (Exception e) {
            ExceptionHandler.handleException(e, logger);
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }

    private void mostrarPreimpreso() {
        try {
            RnCorrelativo logicCorrelativo = new RnCorrelativo(path);
            String preimpreso = logicCorrelativo.listarPreimpreso(xserie.get(cboSerie.getSelectedIndex()).getIdCorrelativo());
            txtPreimpreso.setText(preimpreso);
        } catch (Exception e) {
            ExceptionHandler.handleException(e, logger);
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }

    public void loadLocalidad(String xcodEmpres) throws Exception {
        try {
            RnLocalidad reglaLocalidad = new RnLocalidad(path);
            List<Localidad> xlocali = new ArrayList();
            xlocali.addAll(reglaLocalidad.listar("", xcodEmpres, "", "", ""));

            cboLocalidad.removeAllItems();
            cboLocalidad.addItem(new ItemObject("000", "--- Seleccione una Localidad ---"));

            for (int i = 0; i < xlocali.size(); i++) {
                cboLocalidad.addItem(new ItemObject(xlocali.get(i).getId_localidad().trim(), xlocali.get(i).getDescripcion()));
            }

            for (int i = 0; i < cboLocalidad.getItemCount(); i++) {
                ItemObject it = (ItemObject) cboLocalidad.getSelectedItem();
                if (it.getId().equals(usuario.getCodlocalidad()) == true) {
                    cboLocalidad.setSelectedIndex(i);
                    break;
                }
            }
        } catch (Exception e) {
            throw e;
        }
    }

    public void loadPuntoVenta() {
        try {
            cboPuntoVenta.removeAllItems();
            String idLocalidad = this.getIdLocalidad();
            if (Util.isBlank(idLocalidad)) {
                return;
            }
            RnPuntoVenta reglaPuntoVenta = new RnPuntoVenta(path);
            List<PuntoVenta> xpuntoventa = new ArrayList();
            xpuntoventa.addAll(reglaPuntoVenta.listar("", "", idLocalidad, "", "", "", "", ""));
            cboPuntoVenta.addItem(new ItemObject("000", "--- Seleccione un Punto de Venta ---"));

            for (int i = 0; i < xpuntoventa.size(); i++) {
                cboPuntoVenta.addItem(new ItemObject(xpuntoventa.get(i).getId_punto_venta(), xpuntoventa.get(i).getDescripcion_puntoventa()));
            }
            cboPuntoVenta.setSelectedIndex(0);
        } catch (Exception e) {
            ExceptionHandler.handleException(e, logger);
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }

    public void loadAlmacen() {
        try {
            String idPuntoVenta = this.getIdPuntoVenta();
            cboAlmacen.removeAllItems();
            if (Util.isBlank(idPuntoVenta)) {
                return;
            }
            RnAlmacen reglaAlmacen = new RnAlmacen(path);
            List<Almacen> xalmacen = new ArrayList();
            xalmacen.addAll(reglaAlmacen.listar("", "", idPuntoVenta));
            cboAlmacen.addItem(new ItemObject("000", "--- Seleccione un Almacen ---"));
            for (int i = 0; i < xalmacen.size(); i++) {
                cboAlmacen.addItem(new ItemObject(xalmacen.get(i).getIdAlmacen().trim(), xalmacen.get(i).getDescripcion()));
            }
            cboAlmacen.setSelectedIndex(0);
        } catch (Exception e) {
            ExceptionHandler.handleException(e, logger);
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }

    private String registerIngresoCompraMercaderia() throws Exception {
        try {
            Iterator<ContaItem> iterador = mdlOrdencompra.getData().iterator();
            List<ContaItem> lista = new ArrayList();
            while (iterador.hasNext()) {
                ContaItem bean = iterador.next();
                if (bean.isSeleccionado() && bean.getCant_string() != null && !bean.getCant_string().isEmpty() && Double.parseDouble(bean.getCant_string()) > 0) {
                    lista.add(bean);
                }
            }

            if (lista.isEmpty()) {
                throw new Exception("No se puede ingresar cantidades en cero");
            }

            ContaCab m = new ContaCab();

            m.setTipo("E");
            m.setIdTipoMov(this.getIdTipoMov());
            m.setIdEmpresa(usuario.getCodempresa());
            m.setIdLocalidad(this.getIdLocalidad());

            m.setIdAlmacen(lista.get(0).getId_almacen());
            m.setIdTipoDoc("NI");
            m.setSerie(xserie.get(cboSerie.getSelectedIndex()).getSerie());
            m.setPreimpreso(txtPreimpreso.getText().trim());
            m.setIdTipoDocRef("09");
            m.setSerieRef(txtSerieGuiaReferencia.getText().trim());
            m.setPreimpresoRef(txtPreimpresoGuiaReferencia.getText().trim());
            m.setAnIdanexo(txtCodCliente.getText().trim());
            m.setAnTmpanexo(txtTmpAnexo.getText().trim());
            m.setAnTmpruc(txtTmpRuc.getText().trim());
            m.setIdMoneda(cboMoneda.getSelectedIndex() > 0 ? xmoneda.get(cboMoneda.getSelectedIndex() - 1).getIdMoneda() : "");
            m.setMTipoCambio(txtTipocambio.getText().trim().equals("") ? 0.0 : Double.valueOf(txtTipocambio.getText().trim()));
            m.setMDescuento(Double.valueOf(txtDescuento.getText().trim()));
            m.setMAfecto(Double.valueOf(txtAfecto.getValue().toString().trim()));
            m.setMNoafecto(Double.valueOf(txtNoafecto.getValue().toString().trim()));
            m.setMIgv(Double.valueOf(txtIgv.getText().trim()));
            m.setMonto(Double.valueOf(txtMonto.getValue().toString().trim()));
            m.setFEmision(dcFechaEmision.getDate());
            m.setIdTipoDocGuiaTransportista((txtPreimpresoGuiaTrans.getText().trim().length() == 10) ? "31" : "");
            m.setSerieGuiaTransportista((txtPreimpresoGuiaTrans.getText().trim().length() == 10) ? txtSerieGuiaTrans.getText().trim() : "");
            m.setPreimpresoGuiaTransportista((txtPreimpresoGuiaTrans.getText().trim().length() == 10) ? txtPreimpresoGuiaTrans.getText().trim() : "");
            m.setFlagDescuento(txtFlagdescuento.getText().trim());
            m.setIdPuntoventa(usuario.getCodpuntoventa());
            m.setMovDet(lista);
            m.setIdUsuario(usuario.getId_usuario());
            m.setIdEstado(txtIdestado.getText().trim());
            m.setIdAnexoEmpresaTransportista(cboEmpresaTrans.getSelectedIndex() > 0 ? xEmpresaTransportista.get(cboEmpresaTrans.getSelectedIndex() - 1).getIdAnexo() : "");
            m.setOcIdordencompra(txtCodRegContaCab.getText().trim());
            m.setOcIdtipodoc(TipoDocVentaEnum.ORDEN_COMPRA.getValue());
            m.setOcSerie(txtSerieNumDocReferencia.getText().trim());
            m.setOcPreimpreso(txtPreimpresoNumDocReferencia.getText().trim());
            m.setIdCorrelativo(xserie.get(cboSerie.getSelectedIndex()).getIdCorrelativo());
            m.setFlagTransporte(flagTransporte);
            RnMovInventarioCab logic = new RnMovInventarioCab(path);
            String msg = logic.insertarIngresoCompraMercaderia(m);
            this.ordenCompra = null;
            JOptionPane.showMessageDialog(null, "Nota de Ingreso registrada Correctamente");
            return msg;
        } catch (Exception e) {
            throw e;
        }
    }

    private String getIdTipoMov() {
        if (cboTipoMov.getSelectedIndex() > -1) {
            return xTipoMov.get(cboTipoMov.getSelectedIndex()).getIdTipoMov();
        }
        return "";
    }

    private String getIdLocalidad() {
        if (cboLocalidad.getSelectedIndex() > 0) {
            ItemObject itLocalidad = (ItemObject) cboLocalidad.getSelectedItem();
            return itLocalidad.getId();
        }
        return "";
    }

    private String getIdPuntoVenta() {
        if (cboPuntoVenta.getSelectedIndex() > 0) {
            ItemObject itPuntoVenta = (ItemObject) cboPuntoVenta.getSelectedItem();
            return itPuntoVenta.getId();
        }
        return "";
    }

    private String getIdAlmacen() {
        if (cboAlmacen.getSelectedIndex() > 0) {
            ItemObject itPuntoVenta = (ItemObject) cboAlmacen.getSelectedItem();
            return itPuntoVenta.getId();
        }
        return "";
    }

    @Override
    public void newRegister() {
        try {
            JTextField txt = new JTextField();
            cboTipoMov.setBorder(txt.getBorder());
            txtPreimpreso.setBorder(txt.getBorder());
            dcFechaEmision.setBorder(new JDateChooser().getBorder());
            tabbOrdencompra.setBorder(txt.getBorder());
            tabbGuiatransferencia.setBorder(txt.getBorder());
            txtSerieNumDocReferencia.setBorder(txt.getBorder());
            txtPreimpresoNumDocReferencia.setBorder(txt.getBorder());
            txtSerieGuiaReferencia.setBorder(txt.getBorder());
            txtPreimpresoGuiaReferencia.setBorder(txt.getBorder());
            txtSerieGuiaTrans.setBorder(txt.getBorder());
            txtPreimpresoGuiaTrans.setBorder(txt.getBorder());
            txtGuiaRemision.setText("");
            cargarLocalidad(usuario.getCodlocalidad());
            cargarPuntoVenta(usuario.getCodpuntoventa());
            txtCodRegContaCab.setText("");
            txtSerieNumDocReferencia.setText("");
            txtPreimpresoNumDocReferencia.setText("");
            txtSerieGuiaReferencia.setText("");
            txtPreimpresoGuiaReferencia.setText("");
            txtPreimpresoGuiaTrans.setText("");
            txtSerieGuiaTrans.setText("");
            dcFechaEmision.setDate(new Date());
            txtIdMovimientoOrigen.setText("");
            txtTmpAnexo.setText("");
            txtCodCliente.setText("");
            txtTmpRuc.setText("");
            txtTipocambio.setText("");
            txtPreimpreso.setText("");
            txtAfecto.setValue(0.0);
            txtDescuento.setText("0.0");
            txtIgv.setText("0.0");
            txtNoafecto.setValue(0);
            txtMonto.setValue(0);
            txtIdestado.setText("005");

            if (mode == INSERT && cboTipoMov.getItemCount() > 0) {
                loadSerieCorrelativo("NI");
            }

            if (mode == INSERT && cboSerie.getItemCount() > 0) {
                this.mostrarPreimpreso();
            }

            cboMoneda.setSelectedIndex(cboMoneda.getItemCount() > 0 ? 0 : -1);

            mdlOrdencompra.clearTable();
            mdlGuiatransferencia.clearTable();
            mdlDevolucionClienteDespachado.clearTable();
            tblOrdenCompra.setAllColumnPreferredWidth();
            tblGuiatransferencia.setAllColumnPreferredWidth();
            tblDevolucionclienteDespachado.setAllColumnPreferredWidth();
        } catch (Exception e) {
            ExceptionHandler.handleException(e, logger);
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }

    private String insertarIngresoAjusteInventario() throws Exception {
        try {
            RnRegContaCab regla = new RnRegContaCab(path);
            ContaCab m = new ContaCab();
            Iterator<ContaItem> iterador = mdlNotaSalida.getData().iterator();
            List<ContaItem> lista = new ArrayList();
            while (iterador.hasNext()) {
                ContaItem bean = iterador.next();
                if (bean.isSeleccionado() && bean.getCantidad_despachar() != null && !bean.getCantidad_despachar().isEmpty() && Double.parseDouble(bean.getCantidad_despachar()) > 0) {
                    lista.add(bean);
                }
            }

            if (lista.isEmpty()) {
                throw new Exception("No se puede ingresar cantidades en cero");
            }

            m.setIdEmpresa(usuario.getCodempresa());
            m.setIdLocalidad(usuario.getCodlocalidad());
            m.setIdPuntoventa(usuario.getCodpuntoventa());
            m.setSerie(xserie.get(cboSerie.getSelectedIndex()).getSerie());
            m.setIdAlmacen(this.getIdAlmacen());
            m.setPreimpreso(txtPreimpreso.getText().trim());
            m.setFEmision(dcFechaEmision.getDate());
            m.setFTraslado(dcFechaEmision.getDate());
            m.setIdUsuario(usuario.getId_usuario());
            m.setAnIdanexo(txtCodCliente.getText().trim());
            m.setAnTmpanexo(txtTmpAnexo.getText().trim());
            m.setAnTmpruc(txtTmpRuc.getText().trim());
            m.setOcIdordencompra(txtCodRegContaCab.getText().trim());
            m.setOcSerie(txtSerieNumDocReferencia.getText().trim());
            m.setOcPreimpreso(txtPreimpresoNumDocReferencia.getText().trim());
            m.setMovDet(lista);
            m.setIdMoneda(cboMoneda.getSelectedIndex() > 0 ? xmoneda.get(cboMoneda.getSelectedIndex() - 1).getIdMoneda() : "");
            m.setMTipoCambio(txtTipocambio.getText().trim().equals("") ? 0.0 : Double.parseDouble(txtTipocambio.getText().trim()));
            m.setMAfecto(Double.valueOf(txtAfecto.getValue().toString()));
            m.setMNoafecto(Double.valueOf(txtNoafecto.getValue().toString()));
            m.setMonto(Double.valueOf(txtMonto.getValue().toString()));
            m.setTotal(Double.valueOf(txtTotal.getText().trim()));
            m.setMIgv(Double.valueOf(txtIgv.getText().trim()));
            m.setIdAnexoTransportista(cboEmpresaTrans.getSelectedIndex() > 0 ? xEmpresaTransportista.get(cboEmpresaTrans.getSelectedIndex() - 1).getIdAnexo() : "");
            m.setFlagDescuento(txtFlagdescuento.getText().trim());
            m.setFlagigv(txtFlagdetigv.getText().trim());
            m.setIdCorrelativo(xserie.get(cboSerie.getSelectedIndex()).getIdCorrelativo());
            String msg = regla.insertarEntradaAjusteInventario(m);
            ordenCompra = null;
            JOptionPane.showMessageDialog(null, "Nota de Ingreso registrada Correctamente");
            return msg;
        } catch (Exception e) {
            throw e;
        }
    }

    private String insertarIngresoMercaderiaTransito()
            throws Exception {
        try {
            RnRegContaCab regla = new RnRegContaCab(path);
            Iterator<ContaItem> iterador = mdlOrdencompra.getData().iterator();
            List<ContaItem> lista = new ArrayList();
            while (iterador.hasNext()) {
                ContaItem bean = iterador.next();
                if (bean.isSeleccionado() && bean.getCant_string() != null && !bean.getCant_string().isEmpty() && Double.parseDouble(bean.getCant_string()) > 0) {
                    lista.add(bean);
                }
            }

            if (lista.isEmpty()) {
                throw new Exception("No se puede ingresar cantidades en cero");
            }

            ContaCab m = new ContaCab();
            m.setTipo("E");
            m.setIdTipoMov(this.getIdTipoMov());
            m.setIdEmpresa(usuario.getCodempresa());
            String idLocalidad = this.getIdLocalidad();
            m.setIdLocalidad(idLocalidad);
            m.setIdAlmacen(lista.get(0).getId_almacen());
            LogicTransitoCab reglaTran = new LogicTransitoCab(path);
            List<ContaCab> regList;
            regList = reglaTran.listDocTransitoCab(txtCodRegContaCab.getText(), usuario.getCodempresa(), "", "", usuario.getCodpuntoventa());
            ContaCab cabeceraTransito = regList.get(0);
            m.setIdRegcontaDoc1(cabeceraTransito.getIdRegcontaDoc1());
            m.setIdTipoDocRef1(cabeceraTransito.getIdTipoDocRef1());
            m.setSerieRef1(cabeceraTransito.getSerieRef1());
            m.setPreimpresoRef1(cabeceraTransito.getPreimpresoRef1());
            m.setIdTransitoCab(cabeceraTransito.getOcIdordencompra());
            m.setOcIdordencompra(cabeceraTransito.getIdTransitoCab());
            m.setOcIdtipodoc(cabeceraTransito.getOcIdtipodoc());
            m.setOcSerie(cabeceraTransito.getOcSerie());
            m.setOcPreimpreso(cabeceraTransito.getOcPreimpreso());
            m.setIdTipoDoc("NI");
            m.setSerie(xserie.get(cboSerie.getSelectedIndex()).getSerie());
            m.setPreimpreso(txtPreimpreso.getText().trim());
            String idTipoMov = this.getIdTipoMov();
            m.setIdTipoDocRef((idTipoMov.equals("016") ? txtSerieGuiaReferencia.getText().trim().concat(txtPreimpresoGuiaReferencia.getText().trim()) : (idTipoMov.equals("003") ? txtSerieGuiaReferencia.getText().trim().concat(txtPreimpresoGuiaReferencia.getText().trim()) : "")).length() > 0 ? "09" : "");
            m.setSerieRef((idTipoMov.equals("016") ? txtSerieGuiaReferencia.getText().trim().concat(txtPreimpresoGuiaReferencia.getText().trim()) : (idTipoMov.equals("003") ? txtSerieGuiaReferencia.getText().trim().concat(txtPreimpresoGuiaReferencia.getText().trim()) : "")).length() > 0 ? txtSerieGuiaReferencia.getText().trim() : "");
            m.setPreimpresoRef((idTipoMov.equals("016") ? txtSerieGuiaReferencia.getText().trim().concat(txtPreimpresoGuiaReferencia.getText().trim()) : (idTipoMov.equals("003") ? txtSerieGuiaReferencia.getText().trim().concat(txtPreimpresoGuiaReferencia.getText().trim()) : "")).length() > 0 ? txtPreimpresoGuiaReferencia.getText().trim() : "");
            m.setAnIdanexo(txtCodCliente.getText().trim());
            m.setAnTmpanexo(txtTmpAnexo.getText().trim());
            m.setAnTmpruc(txtTmpRuc.getText().trim());
            m.setIdMoneda(cboMoneda.getSelectedIndex() > 0 ? xmoneda.get(cboMoneda.getSelectedIndex() - 1).getIdMoneda() : "");
            m.setMTipoCambio(txtTipocambio.getText().trim().equals("") ? 0.0 : Double.valueOf(txtTipocambio.getText().trim()));
            m.setMDescuento(Double.valueOf(txtDescuento.getText().trim()));
            m.setMAfecto(Double.valueOf(txtAfecto.getValue().toString().trim()));
            m.setMNoafecto(Double.valueOf(txtNoafecto.getValue().toString().trim()));
            m.setMIgv(Double.valueOf(txtIgv.getText().trim()));
            m.setMonto(Double.valueOf(txtMonto.getValue().toString().trim()));
            m.setFEmision(dcFechaEmision.getDate());
            m.setIdTipoDocGuiaTransportista((txtPreimpresoGuiaTrans.getText().trim().length() == 10) ? "31" : "");
            m.setSerieGuiaTransportista((txtPreimpresoGuiaTrans.getText().trim().length() == 10) ? txtSerieGuiaTrans.getText().trim() : "");
            m.setPreimpresoGuiaTransportista((txtPreimpresoGuiaTrans.getText().trim().length() == 10) ? txtPreimpresoGuiaTrans.getText().trim() : "");
            m.setFlagDescuento(txtFlagdescuento.getText().trim());
            m.setIdPuntoventa(usuario.getCodpuntoventa());
            m.setMovDet(lista);
            m.setIdUsuario(usuario.getId_usuario());
            m.setIdEstado(txtIdestado.getText().trim());
            m.setIdCorrelativo(xserie.get(cboSerie.getSelectedIndex()).getIdCorrelativo());
            m.setIdAnexoEmpresaTransportista(cboEmpresaTrans.getSelectedIndex() > 0 ? xEmpresaTransportista.get(cboEmpresaTrans.getSelectedIndex() - 1).getIdAnexo() : "");
            LogicUsuario logUser = new LogicUsuario(path);
            ArrayList<String> arraySeries = logUser.series(usuario.getId_usuario(), "TS");
            Iterator<String> i = arraySeries.iterator();
            boolean realizarOperacion = false;
            while (i.hasNext()) {
                if (i.next().equals(cabeceraTransito.getSerie())) {
                    realizarOperacion = true;
                    break;
                }
            }
            if (!realizarOperacion) {
                JOptionPane.showMessageDialog(null, "No tiene serie para salida de Transito");
            }
            ContaCab tran = new ContaCab();
            tran.setIdTipoMov("017");
            tran.setSerie(cabeceraTransito.getSerie());
            tran.setTipo("S");
            tran.setIdEmpresa(usuario.getCodempresa());
            tran.setIdLocalidad(idLocalidad);
            tran.setIdAlmacen(m.getIdAlmacen());
            tran.setIdRegcontaDoc1(cabeceraTransito.getIdRegcontaDoc1());
            tran.setIdTipoDocRef1(cabeceraTransito.getIdTipoDocRef1());
            tran.setSerieRef1(cabeceraTransito.getSerieRef1());
            tran.setPreimpresoRef1(cabeceraTransito.getPreimpresoRef1());
            tran.setIdTransitoCab(cabeceraTransito.getOcIdordencompra());
            tran.setOcIdordencompra(cabeceraTransito.getIdTransitoCab());
            tran.setOcIdtipodoc(cabeceraTransito.getOcIdtipodoc());
            tran.setOcSerie(cabeceraTransito.getOcSerie());
            tran.setOcPreimpreso(cabeceraTransito.getOcPreimpreso());
            tran.setIdTipoDoc("TS");
            tran.setPreimpreso(m.getPreimpreso());
            tran.setIdTipoDocRef(m.getIdTipoDocRef());
            tran.setSerieRef(m.getSerieRef());
            tran.setPreimpresoRef(m.getPreimpresoRef());
            tran.setAnIdanexo(m.getAnIdanexo());
            tran.setAnIdtipoanexo("1");
            tran.setAnTmpanexo(m.getAnTmpanexo());
            tran.setAnTmpruc(m.getAnTmpruc());
            tran.setIdMoneda(m.getIdMoneda());
            tran.setMTipoCambio(m.getMTipoCambio());
            tran.setMDescuento(m.getMDescuento());
            tran.setMAfecto(m.getMAfecto());
            tran.setMNoafecto(m.getMNoafecto());
            tran.setMIgv(m.getMIgv());
            tran.setMonto(m.getMonto());
            tran.setFEmision(m.getFEmision());
            tran.setIdTipoDocGuiaTransportista(m.getIdTipoDocGuiaTransportista());
            tran.setSerieGuiaTransportista(m.getSerieGuiaTransportista());
            tran.setPreimpresoGuiaTransportista(m.getPreimpresoGuiaTransportista());
            tran.setFlagDescuento(m.getFlagDescuento());
            tran.setIdPuntoventa(usuario.getCodpuntoventa());
            tran.setMovDet(lista);
            tran.setIdUsuario(usuario.getId_usuario());
            tran.setIdEstado(m.getIdEstado());
            tran.setIdAnexoEmpresaTransportista(m.getIdAnexoTransportista());
            tran.setIdTrabajador(usuario.getId_trabajador());
            tran.setIdAuxiliar("00068");
            Calendar calendarEmision = new GregorianCalendar();
            calendarEmision.setTime(m.getFEmision());
            int anno = calendarEmision.get(Calendar.YEAR);
            int mes = calendarEmision.get(Calendar.MONTH);
            tran.setAnio(String.valueOf(anno));
            tran.setMes(this.getPeriodoAnterior(mes));
            String msg = regla.insertarIngresoPorTransito(m, tran);
            ordenCompra = null;
            JOptionPane.showMessageDialog(null, "Nota de Ingreso registrada Correctamente");
            LogicTransitoCab logTran = new LogicTransitoCab(path);
            JOptionPane.showMessageDialog(null, logTran.changeTransitoAtendido(tran.getIdTransitoCab()));
            return msg;
        } catch (Exception e) {
            throw e;
        }
    }

    private String getPeriodoAnterior(int mes) {
        switch (mes) {
            case 0:
                return "01";
            case 1:
                return "02";
            case 2:
                return "03";
            case 3:
                return "04";
            case 4:
                return "05";
            case 5:
                return "06";
            case 6:
                return "07";
            case 7:
                return "08";
            case 8:
                return "09";
            case 9:
                return "10";
            case 10:
                return "11";
            case 11:
                return "12";
            default:
                return "";
        }
    }

    private String insertarIngresoInventarioInicial() throws Exception {
        try {
            RnRegContaCab regla = new RnRegContaCab(path);
            ContaCab m = new ContaCab();

            m.setTipo("E");
            String idTipoMov = this.getIdTipoMov();
            m.setIdTipoMov(idTipoMov);
            m.setIdEmpresa(usuario.getCodempresa());
            m.setIdLocalidad(this.getIdLocalidad());
            m.setIdAlmacen(this.getIdAlmacen());
            m.setIdTipoDoc("NI");
            m.setSerie(xserie.get(cboSerie.getSelectedIndex()).getSerie());
            m.setPreimpreso(txtPreimpreso.getText().trim());
            m.setIdTipoDocRef((idTipoMov.equals("001") ? txtSerieGuiaReferencia.getText().trim().concat(txtPreimpresoGuiaReferencia.getText().trim()) : (idTipoMov.equals("003") ? txtSerieGuiaReferencia.getText().trim().concat(txtPreimpresoGuiaReferencia.getText().trim()) : "")).length() > 0 ? "09" : "");
            m.setSerieRef((idTipoMov.equals("001") ? txtSerieGuiaReferencia.getText().trim().concat(txtPreimpresoGuiaReferencia.getText().trim()) : (idTipoMov.equals("003") ? txtSerieGuiaReferencia.getText().trim().concat(txtPreimpresoGuiaReferencia.getText().trim()) : "")).length() > 0 ? txtSerieGuiaReferencia.getText().trim() : "");
            m.setPreimpresoRef((idTipoMov.equals("001") ? txtSerieGuiaReferencia.getText().trim().concat(txtPreimpresoGuiaReferencia.getText().trim()) : (idTipoMov.equals("003") ? txtSerieGuiaReferencia.getText().trim().concat(txtPreimpresoGuiaReferencia.getText().trim()) : "")).length() > 0 ? txtPreimpresoGuiaReferencia.getText().trim() : "");
            m.setAnIdanexo(txtCodCliente.getText().trim());
            m.setAnTmpanexo(txtTmpAnexo.getText().trim());
            m.setAnTmpruc(txtTmpRuc.getText().trim());
            m.setIdMoneda(cboMoneda.getSelectedIndex() > 0 ? xmoneda.get(cboMoneda.getSelectedIndex() - 1).getIdMoneda() : "");
            m.setMTipoCambio(txtTipocambio.getText().trim().equals("") ? 0.0 : Double.valueOf(txtTipocambio.getText().trim()));
            m.setMDescuento(Double.valueOf(txtDescuento.getText().trim()));
            m.setMAfecto(Double.valueOf(txtAfecto.getValue().toString().trim()));
            m.setMNoafecto(Double.valueOf(txtNoafecto.getValue().toString().trim()));
            m.setMIgv(Double.valueOf(txtIgv.getText().trim()));
            m.setMonto(Double.valueOf(txtMonto.getValue().toString().trim()));
            m.setFEmision(dcFechaEmision.getDate());
            m.setIdTipoDocGuiaTransportista((txtPreimpresoGuiaTrans.getText().trim().length() == 10) ? "31" : "");
            m.setSerieGuiaTransportista((txtPreimpresoGuiaTrans.getText().trim().length() == 10) ? txtSerieGuiaTrans.getText().trim() : "");
            m.setPreimpresoGuiaTransportista((txtPreimpresoGuiaTrans.getText().trim().length() == 10) ? txtPreimpresoGuiaTrans.getText().trim() : "");
            m.setFlagDescuento(txtFlagdescuento.getText().trim());
            m.setIdPuntoventa(this.getIdPuntoVenta());
            m.setMovDet(mdlInventarioinicial.getData());
            m.setIdUsuario(usuario.getId_usuario());
            m.setIdEstado(txtIdestado.getText().trim());
            m.setIdAnexoEmpresaTransportista(cboEmpresaTrans.getSelectedIndex() > 0 ? xEmpresaTransportista.get(cboEmpresaTrans.getSelectedIndex() - 1).getIdAnexo() : "");
            m.setOcIdordencompra(txtCodRegContaCab.getText().trim());
            m.setOcSerie(txtSerieNumDocReferencia.getText().trim());
            m.setOcPreimpreso(txtPreimpresoNumDocReferencia.getText().trim());

            m.setIdCorrelativo(xserie.get(cboSerie.getSelectedIndex()).getIdCorrelativo());

            String msg = regla.insertarIngresoInventarioInicial(m);
            ordenCompra = null;
            JOptionPane.showMessageDialog(null, "Nota de Ingreso registrada Correctamente");
            return msg;
        } catch (Exception e) {
            throw e;
        }
    }

    private boolean validLotes(ContaItem beanItem) {
        Iterator<Lote> i = beanItem.getListaLotes().iterator();
        while (i.hasNext()) {
            Lote bean = i.next();
            if (Constans.ES_OBLIGATORIO_UBICACION) {
                if (bean.getIdUbicacion() == null) {
                    JOptionPane.showMessageDialog(null, "Complete las ubicaciones");
                    return false;
                }
            }
            if (bean.getCantidad() == null || bean.getCantidad().compareTo(BigDecimal.ZERO) == 0) {
                JOptionPane.showMessageDialog(null, "Complete cantidades mayores a cero");
                return false;
            }
        }
        return true;
    }

    private String insertarIngresoDevolucionCliente() throws Exception {
        try {
            RnRegContaCab regla = new RnRegContaCab(path);
            Iterator<ContaItem> iterador = mdlDevolucionClienteDespachado.getData().iterator();
            List<ContaItem> lista = new ArrayList();
            while (iterador.hasNext()) {
                ContaItem bean = iterador.next();
                if (bean.isSeleccionado() && bean.getCant_a_devolver() != null && !bean.getCant_a_devolver().isEmpty() && Double.parseDouble(bean.getCant_a_devolver()) > 0) {
                    lista.add(bean);
                    if (com.softcommerce.util.Constans.ISBOTICA && com.softcommerce.util.Constans.ES_OBLIGATORIO_UBICACION) {
                        if (!validLotes(bean)) {
                            throw new Exception("Seleccion la ubicaciÃ³n de sus lotes\ny edite las cantidades si es necesario");
                        }
                    }
                }
            }

            if (lista.isEmpty()) {
                throw new Exception("No se puede ingresar cantidades en cero");
            }

            ContaCab m = new ContaCab();

            m.setIdEmpresa(usuario.getCodempresa());
            m.setIdLocalidad(this.getIdLocalidad());
            m.setIdAlmacen(almacenDevolucion);
            m.setSerie(xserie.get(cboSerie.getSelectedIndex()).getSerie());
            m.setPreimpreso(txtPreimpreso.getText().trim());
            m.setIdAuxiliar(txtIdauxiliar.getText().trim());
            m.setIdRegcontaDoc1(txtCodRegContaCab.getText().trim());
            m.setIdTipoDocRef1(cboTipoDocRef.getSelectedItem().toString().trim().equals("FACTURA") ? "01" : cboTipoDocRef.getSelectedItem().toString().trim().equals("BOLETA") ? "03" : cboTipoDocRef.getSelectedItem().toString().trim().equals("TICKET") ? "TI" : "");
            m.setSerieRef1(txtSerieNumDocReferencia.getText().trim());
            m.setPreimpresoRef1(txtPreimpresoNumDocReferencia.getText().trim());
            m.setAnIdanexo(txtCodCliente.getText().trim());
            m.setIdMoneda(cboMoneda.getSelectedIndex() > 0 ? xmoneda.get(cboMoneda.getSelectedIndex() - 1).getIdMoneda() : "");
            m.setMTipoCambio(txtTipocambio.getText().trim().equals("") ? 0.0 : Double.valueOf(txtTipocambio.getText().trim()));
            m.setMDescuento(Double.valueOf(txtDescuento.getText().trim()));
            m.setMAfecto(Double.valueOf(txtAfecto.getValue().toString().trim()));
            m.setMNoafecto(Double.valueOf(txtNoafecto.getValue().toString().trim()));
            m.setMIgv(Double.valueOf(txtIgv.getText().trim()));
            m.setMonto(Double.valueOf(txtMonto.getValue().toString().trim()));
            m.setFEmision(dcFechaEmision.getDate());
            m.setIdPuntoventa(this.getIdPuntoVenta());
            m.setMovDet(lista);
            m.setIdUsuario(usuario.getId_usuario());
            m.setFTraslado(DateTime.format(1901, 0, 1));
            String idTipoMov = this.getIdTipoMov();
            m.setOcIdordencompra(idTipoMov.equals("001") ? txtCodRegContaCab.getText().trim() : (idTipoMov.equals("003") ? "" : ""));
            m.setIdCondicionVenta(idCondicionventa);
            m.setIdCorrelativo(xserie.get(cboSerie.getSelectedIndex()).getIdCorrelativo());
            almacenDevolucion = null;
            String msg = regla.insertarDevolucionClienteDespachado(m);
            ordenCompra = null;
            JOptionPane.showMessageDialog(null, "Nota de Ingreso registrada Correctamente");
            return msg;
        } catch (Exception e) {
            throw e;
        }
    }

    @Override
    public String executeInsert() {
        editorCompra.stopCellEditing();
        editorDevolucion.stopCellEditing();
        editorEntrada.stopCellEditing();
        try {
            String idTipoMov = this.getIdTipoMov();
            if (idTipoMov.equals(TipoMovInventarioEnum.INGRESO_AJUSTE_INVENTARIO.getValue())) {
                return this.insertarIngresoAjusteInventario();
            }
            if (idTipoMov.equals(TipoMovInventarioEnum.INGRESO_MERCADERIA.getValue())) {
                return this.registerIngresoCompraMercaderia();
            }
            if (idTipoMov.equals(TipoMovInventarioEnum.INGRESO_TRANSITO.getValue())) {
                return this.insertarIngresoMercaderiaTransito();
            }
            if (idTipoMov.equals(TipoMovInventarioEnum.INGRESO_INVENTARIO_INICIAL.getValue())) {
                return this.insertarIngresoInventarioInicial();
            }
            if (idTipoMov.equals(TipoMovInventarioEnum.INGRESO_DEVOLUCION_CLIENTE.getValue())) {
                return this.insertarIngresoDevolucionCliente();
            }
        } catch (Exception ex) {
            ExceptionHandler.handleException(ex, logger);
            JOptionPane.showMessageDialog(this, ex.getMessage());
        } finally {
            try {
                (new LogicStock(path)).regularizarStock(Main.anio);
                System.out.println(Main.anio);
            } catch (ClassNotFoundException ex) {
                System.err.println(ex.getLocalizedMessage());
            } catch (InstantiationException ex) {
                System.err.println(ex.getLocalizedMessage());
            } catch (IllegalAccessException ex) {
                System.err.println(ex.getLocalizedMessage());
            } catch (Exception ex) {
                System.err.println(ex.getLocalizedMessage());
            }
        }
        return "";
    }

    @Override
    public void focusGained(FocusEvent e) {
        if (e.getSource() == ((JTextFieldDateEditor) dcFechaEmision.getDateEditor())) {
            ((JTextFieldDateEditor) dcFechaEmision.getDateEditor()).selectAll();
        }

        if (e.getComponent() == txtPreimpreso) {
            txtPreimpreso.selectAll();
        }

        if (e.getComponent() == txtPreimpresoNumDocReferencia) {
            txtPreimpresoNumDocReferencia.selectAll();
        }

        if (e.getComponent() == txtSerieNumDocReferencia) {
            txtSerieNumDocReferencia.selectAll();
        }

        if (e.getComponent() == txtPreimpresoGuiaReferencia) {
            txtPreimpresoGuiaReferencia.selectAll();
        }

        if (e.getComponent() == txtSerieGuiaReferencia) {
            txtSerieGuiaReferencia.selectAll();
        }

        if (e.getComponent() == txtPreimpresoGuiaTrans) {
            txtPreimpresoGuiaTrans.selectAll();
        }

        if (e.getComponent() == txtSerieGuiaTrans) {
            txtSerieGuiaTrans.selectAll();
        }
    }

    @Override
    public void keyPressed(KeyEvent e) {
        if (e.getKeyChar() == '\n') {
            if ((e.getSource() == txtPreimpresoNumDocReferencia) || (e.getSource() == txtSerieNumDocReferencia)) {
                if (txtPreimpresoNumDocReferencia.getText().trim().length() > 0) {
                    String preimpreso = "0000000000" + txtPreimpresoNumDocReferencia.getText().trim();
                    String nuevapreimpreso = preimpreso.substring(preimpreso.length() - 10, preimpreso.length());

                    txtPreimpresoNumDocReferencia.setText(nuevapreimpreso);
                }
                String idTipoMov = this.getIdTipoMov();
                if (idTipoMov.equals("001")) {
                    cargarOrdenCompra("", txtSerieNumDocReferencia.getText().trim(), txtPreimpresoNumDocReferencia.getText().trim(), usuario.getCodpuntoventa());
                }

                if (idTipoMov.equals("003")) {
                    cargarGuiaRemision("", txtSerieNumDocReferencia.getText().trim(), txtPreimpresoNumDocReferencia.getText().trim(), usuario.getCodpuntoventa());
                }
            }
            if (e.getSource() == txtPreimpreso) {
                btnBuscarDocumento.requestFocus();
            }

            if (e.getSource() == txtSerieGuiaReferencia) {
                txtPreimpresoGuiaReferencia.requestFocus();
            }

            if (e.getSource() == txtPreimpresoGuiaReferencia) {
                ((JTextFieldDateEditor) dcFechaEmision.getDateEditor()).requestFocus();
            }

            if (e.getSource() == cboEmpresaTrans) {
                txtSerieGuiaTrans.requestFocus();
            }

            if (e.getSource() == txtSerieGuiaTrans) {
                txtPreimpresoGuiaTrans.requestFocus();
            }

            if (e.getSource() == txtPreimpresoGuiaTrans) {
                chkSeleccionar.requestFocus();
            }

            if (e.getSource() == chkSeleccionar) {
                setFocusAndClick();
            }
            if (e.getSource().equals(cboTipoMov)) {
                cboSerie.requestFocus();
            }
        }

        if (e.getKeyCode() == KeyEvent.VK_F6) {
            chkSeleccionar.requestFocus();
            chkSeleccionar.doClick();
        }

        if (e.getKeyCode() == KeyEvent.VK_F5) {
            btnBuscarDocumento.requestFocus();
            btnBuscarDocumento.doClick();
        }

        if (e.getKeyCode() == KeyEvent.VK_ESCAPE) {
            dispose();
            doDefaultCloseAction();
        }
    }

    @Override
    public boolean isRegisterValid() {
        JTextField txt = new JTextField();
        cboTipoMov.setBorder(txt.getBorder());
        txtPreimpreso.setBorder(txt.getBorder());
        dcFechaEmision.setBorder(new JDateChooser().getBorder());
        tabbOrdencompra.setBorder(txt.getBorder());
        tabbGuiatransferencia.setBorder(txt.getBorder());
        txtSerieNumDocReferencia.setBorder(txt.getBorder());
        txtPreimpresoNumDocReferencia.setBorder(txt.getBorder());
        txtSerieGuiaReferencia.setBorder(txt.getBorder());
        txtPreimpresoGuiaReferencia.setBorder(txt.getBorder());
        txtSerieGuiaTrans.setBorder(txt.getBorder());
        txtPreimpresoGuiaTrans.setBorder(txt.getBorder());

        if (cboTipoMov.getSelectedIndex() == -1) {
            JOptionPane.showMessageDialog(this, "Para " + namemode + " una Nota de Ingreso, debes especificar el Tipo de Movimiento.", "Datos incompletos de Nota de Ingreso.", JOptionPane.CANCEL_OPTION);
            cboTipoMov.setBorder(new LineBorder(Color.RED));
            cboTipoMov.requestFocus();
            return false;
        }

        if (cboSerie.getSelectedIndex() == -1) {
            JOptionPane.showMessageDialog(this, "Serie de Nota de Ingreso es incorrecto,Por favor verifique la Serie de Nota de Ingreso.", "Datos incompletos de Nota de Ingreso.", JOptionPane.CANCEL_OPTION);
            cboSerie.setBorder(new LineBorder(Color.RED));
            cboSerie.requestFocus();
            return false;
        }

        if (txtPreimpreso.getText().trim().length() < 10) {
            JOptionPane.showMessageDialog(this, "Para " + namemode + " un Nota de Ingreso, debes especificar el Preimpreso.", "Datos incompletos de Nota de Ingreso.", JOptionPane.INFORMATION_MESSAGE);
            txtPreimpreso.setBorder(new LineBorder(Color.RED));
            txtPreimpreso.requestFocus();
            return false;
        }
        if (txtPreimpresoNumDocReferencia.getText().trim().length() < 10 && txtPreimpresoNumDocReferencia.isVisible()) {
            JOptionPane.showMessageDialog(this, "El numero de Preimpreso de la Orden de Compra de Referencia que has especificado no es vÃ¡lida. CompruÃ©bala e intÃ©ntalo de nuevo.", "Datos incompletos de Nota de Ingreso.", JOptionPane.INFORMATION_MESSAGE);
            txtPreimpresoNumDocReferencia.setBorder(new LineBorder(Color.RED));
            txtPreimpresoNumDocReferencia.requestFocus();

            return false;
        }

        RnRegContaCab regla = new RnRegContaCab(path);
        ContaCab m = new ContaCab();
        m.setIdEmpresa(usuario.getCodempresa());
        m.setIdTipoDoc("NI");
        m.setSerie(cboSerie.getSelectedItem().toString().trim());
        m.setPreimpreso(txtPreimpreso.getText().trim());
        boolean flag = regla.existeMovimiento(m).equals("S");

        if (flag) {

            JOptionPane.showMessageDialog(this, "El numero de Nota de Ingreso ya se encuentra registrado, \nSe volvera a cargar el correlativo \nVolver a intentar guardar el documento",
                    "Datos incompletos de Nota de Ingreso",
                    JOptionPane.INFORMATION_MESSAGE);
            txtPreimpreso.setBorder(new LineBorder(Color.RED));
            txtPreimpreso.requestFocus();
            this.mostrarPreimpreso();
            return false;
        }
        String idTipoMov = this.getIdTipoMov();
        if ((!cboTipoMov.getSelectedItem().toString().trim().equals("INGRESO POR CONVERSION")) && (txtCodRegContaCab.getText().trim().length() == 0)) {
            JOptionPane.showMessageDialog(this, "Para " + namemode + " un Nota de Ingreso, debes especificar "
                    + (idTipoMov.equals("001") ? "la Orden de Compra " : (idTipoMov.equals("003") ? "la Guia de Remision " : " "))
                    + "a registrar.", "Datos incompletos de Nota de Ingreso.", JOptionPane.CANCEL_OPTION
            );
            btnBuscarDocumento.requestFocus();
            return false;
        }
        if (txtPreimpresoGuiaReferencia.getText().trim().length() < 10 && txtPreimpresoGuiaReferencia.isVisible()) {
            JOptionPane.showMessageDialog(this, "El numero de Preimpreso de Guia de Remision de Referencia que has especificado no es vÃ¡lida. CompruÃ©bala e intÃ©ntalo de nuevo.",
                    "Datos incompletos de Nota de Ingreso.", JOptionPane.INFORMATION_MESSAGE);
            txtPreimpresoGuiaReferencia.setBorder(new LineBorder(Color.RED));
            txtPreimpresoGuiaReferencia.requestFocus();

            return false;
        }

        if (((JTextFieldDateEditor) dcFechaEmision.getDateEditor()).getText().equals("__/__/____")
                || !DateTime.isValidDate(((JTextFieldDateEditor) dcFechaEmision.getDateEditor()).getText().replace("_", "0"))) {
            JOptionPane.showMessageDialog(this, "La fecha de Emision de la Nota de Ingreso que has especificado no es vÃ¡lida. CompruÃ©bala e intÃ©ntalo de nuevo.", "Datos incompletos de Nota de Ingreso", 2);
            dcFechaEmision.setBorder(new LineBorder(Color.RED));
            dcFechaEmision.requestFocus();

            return false;
        }

        if ((idTipoMov.equals("001") && tblOrdenCompra.getRowCount() == 0)
                || (idTipoMov.equals("003") && tblGuiatransferencia.getRowCount() == 0)) {
            JOptionPane.showMessageDialog(this, "Para " + namemode + " una Nota de Ingreso, debe registrar al menos un detalle.", "Datos incompletos de Nota de Ingreso.", JOptionPane.CANCEL_OPTION);

            if (idTipoMov.equals("001")) {
                tabbOrdencompra.setBorder(new LineBorder(Color.RED));
            }

            if (idTipoMov.equals("003")) {
                tabbGuiatransferencia.setBorder(new LineBorder(Color.RED));
            }

            return false;
        }

        return true;
    }

    @Override
    public boolean loadRegister() {
        try {
            ContaCab m = new ContaCab();
            m.setIdMovimiento(rowSelection.getSelectedValue(1).toString());
            m.setTipo("E");
            m.setFInicial(DateTime.format(1901, 0, 1));
            m.setFFinal(DateTime.format(1901, 0, 1));

            RnRegContaCab regla = new RnRegContaCab(path);
            List<ContaCab> reg = regla.listarOrdenRecojo(m);

            if (reg.isEmpty()) {
                return false;
            }
            ContaCab movintentarioCab = reg.get(0);
            ordenCompra = movintentarioCab;
            cargarTipoMovimiento(movintentarioCab.getIdTipoMov());
            cboSerie.addItem(movintentarioCab.getSerie());
            txtPreimpreso.setText(movintentarioCab.getPreimpreso());
            txtIdMovimientoOrigen.setText(movintentarioCab.getIdMovimiento());
            txtIdmovimientodestino.setText(movintentarioCab.getIdTipoMov().equals("013") ? movintentarioCab.getIdRegcontaDoc1() : "");
            txtCodCliente.setText(movintentarioCab.getAnIdanexo());
            txtCodRegContaCab.setText(movintentarioCab.getOcIdordencompra());
            dcFechaEmision.setDate(movintentarioCab.getFEmision());
            txtAfecto.setValue(movintentarioCab.getMAfecto());
            txtDescuento.setText(String.valueOf(movintentarioCab.getMDescuento()));
            txtIgv.setText(String.valueOf(movintentarioCab.getMIgv()));
            txtNoafecto.setValue(movintentarioCab.getMNoafecto());
            txtMonto.setValue(movintentarioCab.getMonto());
            txtTmpRuc.setText(movintentarioCab.getAnTmpruc());
            String idTipoMov = this.getIdTipoMov();
            txtSerieNumDocReferencia.setText(idTipoMov.equals("001") ? movintentarioCab.getOcSerie() : (idTipoMov.equals("003") ? movintentarioCab.getSerieRef() : ""));
            txtPreimpresoNumDocReferencia.setText(idTipoMov.equals("001") ? movintentarioCab.getOcPreimpreso() : (idTipoMov.equals("003") ? movintentarioCab.getPreimpresoRef() : ""));
            txtTmpAnexo.setText(idTipoMov.equals("001") ? movintentarioCab.getAnTmpanexo() : (idTipoMov.equals("003") ? movintentarioCab.getEmpresa() : ""));
            txtSerieGuiaReferencia.setText(movintentarioCab.getSerieRef());
            txtPreimpresoGuiaReferencia.setText(movintentarioCab.getPreimpresoRef());
            txtCodigodoc.setText(movintentarioCab.getIdTipoDocRef());
            txtTipocambio.setText(String.valueOf(movintentarioCab.getMTipoCambio()));
            cargarLocalidad(movintentarioCab.getIdLocalidad());
            cargarPuntoVenta(movintentarioCab.getIdPuntoventa());
            cargarAlmacen(movintentarioCab.getIdAlmacen());
            cargarEmpresaTransportista(movintentarioCab.getIdAnexoEmpresaTransportista());
            txtSerieGuiaTrans.setText(movintentarioCab.getSerieGuiaTransportista());
            txtPreimpresoGuiaTrans.setText(movintentarioCab.getPreimpresoGuiaTransportista());
            txtFlagdescuento.setText(movintentarioCab.getFlagDescuento());
            tblOrdenCompra.setVisibleColumn(6, (mode == UPDATE || mode == INSERT || mode == CLONE));
            tblOrdenCompra.setVisibleColumn(7, (mode == UPDATE || mode == INSERT || mode == CLONE));
            tblOrdenCompra.setVisibleColumn(8, (mode == UPDATE || mode == INSERT || mode == CLONE));
            tblOrdenCompra.setVisibleColumn(10, (mode == UPDATE || mode == INSERT || mode == CLONE));
            if (idTipoMov.equals(TipoMovInventarioEnum.INGRESO_CONVERSION.getValue())) {
                mdlInventarioinicial.agregarVectorRegContaItem(regla.BuscaDetalleMovimiento(movintentarioCab.getIdMovimiento(), "E", ""));
                tblInventarioinicial.setAllColumnPreferredWidth();
            }
            if (idTipoMov.equals(TipoMovInventarioEnum.INGRESO_AJUSTE_INVENTARIO.getValue())) {
                List<ContaItem> lista = regla.BuscaDetalleMovimiento(movintentarioCab.getIdMovimiento(), "E", "");
                mdlNotaSalida.agregarVectorRegContaItem(lista);
                tblNotaSalida.setAllColumnPreferredWidth();

            }
            if (idTipoMov.equals(TipoMovInventarioEnum.INGRESO_MERCADERIA.getValue())) {
                mdlOrdencompra.agregarVectorRegContaItem(regla.BuscaDetalleMovimiento(movintentarioCab.getIdMovimiento(), "E", ""));
                ordenCompra.setFlagOperGrabada(mdlOrdencompra.getData().get(0).getFlagOperGrabada());
                tblOrdenCompra.setAllColumnPreferredWidth();
            }
            if (idTipoMov.equals(TipoMovInventarioEnum.INGRESO_TRANSITO.getValue())) {
                mdlOrdencompra.agregarVectorRegContaItem(regla.BuscaDetalleMovimiento(movintentarioCab.getIdMovimiento(), "E", ""));
                ordenCompra.setFlagOperGrabada(mdlOrdencompra.getData().get(0).getFlagOperGrabada());
                tblOrdenCompra.setAllColumnPreferredWidth();
            }
            if (idTipoMov.equals(TipoMovInventarioEnum.INGRESO_INVENTARIO_INICIAL.getValue())) {
                mdlInventarioinicial.agregarVectorRegContaItem(regla.BuscaDetalleMovimiento(movintentarioCab.getIdMovimiento(), "E", ""));
                tblInventarioinicial.setAllColumnPreferredWidth();
            }
            if (idTipoMov.equals(TipoMovInventarioEnum.INGRESO_DEVOLUCION_CLIENTE.getValue())) {
                mdlDevolucionClienteDespachado.agregarVectorVentaDirecta(regla.BuscaDetalleMovimiento(movintentarioCab.getIdMovimiento(), "E", ""));
                tblDevolucionclienteDespachado.setAllColumnPreferredWidth();
            }
            if (idTipoMov.equals(TipoMovInventarioEnum.INGRESO_TRANSFERENCIA.getValue())) {
                mdlGuiatransferencia.agregarVectorRegContaItem(regla.BuscaDetalleMovimiento(movintentarioCab.getIdMovimiento(), "E", ""));
                tblGuiatransferencia.setAllColumnPreferredWidth();
            }
            chkSeleccionar.setSelected(true);
            return true;
        } catch (Exception e) {
            ExceptionHandler.handleException(e, logger);
            JOptionPane.showMessageDialog(this, e.getMessage());
            return false;
        }
    }

    public void cargarSerieCorrelativo(String lsSerie) {
        if (xserie != null) {
            for (int i = 0; i < xserie.size(); i++) {
                if (xserie.get(i).getSerie().equals(lsSerie)) {
                    cboSerie.setSelectedIndex(i);
                    break;
                }
            }
        }
    }

    public void cargarTipoMovimiento(String codTipoMov) {
        if (xTipoMov != null && !codTipoMov.equals("")) {
            for (int i = 0; i < xTipoMov.size(); i++) {
                if (xTipoMov.get(i).getIdTipoMov().equals(codTipoMov)) {
                    cboTipoMov.setSelectedIndex(i);
                    break;
                }
            }
        }
    }

    public void cargarLocalidad(String xcodiLocalidad) {
        for (int i = 0; i < cboLocalidad.getItemCount(); i++) {
            ItemObject it = (ItemObject) cboLocalidad.getItemAt(i);
            if (it.getId().equals(xcodiLocalidad.trim())) {
                cboLocalidad.setSelectedIndex(i);
                break;
            }
        }
    }

    public void cargarPuntoVenta(String codPuntoVenta) {
        for (int i = 0; i < cboPuntoVenta.getItemCount(); i++) {
            ItemObject it = (ItemObject) cboPuntoVenta.getItemAt(i);
            if (it.getId().equals(codPuntoVenta.trim())) {
                cboPuntoVenta.setSelectedIndex(i);
                break;
            }
        }
    }

    public void cargarAlmacen(String xcodiEmpresa) {
        for (int i = 0; i < cboAlmacen.getItemCount(); i++) {
            ItemObject it = (ItemObject) cboAlmacen.getItemAt(i);
            if (it.getId().equals(xcodiEmpresa.trim())) {
                cboAlmacen.setSelectedIndex(i);
                break;
            }
        }
    }

    public void cargarEmpresaTransportista(String codEmpresaTransportista) {
        try {
            if (xEmpresaTransportista != null && !codEmpresaTransportista.equals("")) {
                for (int i = 0; i < xEmpresaTransportista.size(); i++) {
                    if (xEmpresaTransportista.get(i).getIdAnexo().equals(codEmpresaTransportista)) {
                        cboEmpresaTrans.setSelectedIndex(i + 1);
                        break;
                    }
                }
            }
        } catch (Exception ex) {
            ExceptionHandler.handleException(ex, logger);
            JOptionPane.showMessageDialog(null, "No olvide seleccionar empresa transportista");
        }
    }

    public void cargarMoneda(String codMoneda) {
        if (xmoneda != null && !codMoneda.equals("")) {
            for (int i = 0; i < xmoneda.size(); i++) {
                if (xmoneda.get(i).getIdMoneda().equals(codMoneda)) {
                    cboMoneda.setSelectedIndex(i + 1);
                    break;
                }
            }
        }
    }

    @Override
    public boolean executeDelete() {
        try {
            RnRegContaCab regla = new RnRegContaCab(path);

            ContaCab m = new ContaCab();
            m.setIdMovimiento(txtIdMovimientoOrigen.getText().trim());
            m.setIdMovimientoDestino(txtIdmovimientodestino.getText().trim());
            m.setIdUsuario(usuario.getId_usuario());
            String idTipoMov = this.getIdTipoMov();
            if (idTipoMov.equals(TipoMovInventarioEnum.INGRESO_MERCADERIA.getValue())) {
                return regla.eliminarIngresoOrdenCompra(m);
            } else if (idTipoMov.equals(TipoMovInventarioEnum.INGRESO_INVENTARIO_INICIAL.getValue())) {
                return regla.eliminarIngresoInventarioInicial(m);
            }
            return false;
        } catch (Exception ex) {
            ExceptionHandler.handleException(ex, logger);
            JOptionPane.showMessageDialog(this, ex.getMessage());
            return false;
        } finally {
            try {
                (new LogicStock(path)).regularizarStock(Main.anio);
                System.out.println(Main.anio);
            } catch (ClassNotFoundException ex) {
                System.err.println(ex.getLocalizedMessage());
            } catch (InstantiationException ex) {
                System.err.println(ex.getLocalizedMessage());
            } catch (IllegalAccessException ex) {
                System.err.println(ex.getLocalizedMessage());
            } catch (Exception ex) {
                System.err.println(ex.getLocalizedMessage());
            }
        }

    }

    @Override
    public void setRegisterEnabled(boolean e) {
        cboSerie.setEnabled(e);
        chkSeleccionar.setEnabled(e);
        cboTipoMov.setEnabled(e);
        btnBuscarDocumento.setEnabled(e);
        cboEmpresaTrans.setEnabled(e);
        btnAgregar.setEnabled(e);
        btnQuitar.setEnabled(e);
        tblGuiatransferencia.setEnabled(e);
        dcFechaEmision.setEnabled(e);
    }

    @Override
    public void setRegisterEditable(boolean e) {
        tblDevolucionclienteDespachado.setColumnEditable(0, e);
        tblDevolucionclienteDespachado.setColumnEditable(17, e);
        tblOrdenCompra.setColumnEditable(0, e);
        tblOrdenCompra.setColumnEditable(10, e);
        tblNotaSalida.setColumnEditable(0, e);
        tblNotaSalida.setColumnEditable(11, e);
        if (com.softcommerce.util.Constans.ISBOTICA) {

            tblOrdenCompra.setSpecificCellEditor(0, 10, editorCompra);
            tblOrdenCompra.getColumnModel().getColumn(10).setCellRenderer(editorCompra);

            tblDevolucionclienteDespachado.setSpecificCellEditor(0, 17, editorDevolucion);
            tblDevolucionclienteDespachado.getColumnModel().getColumn(17).setCellRenderer(editorDevolucion);

            tblNotaSalida.setSpecificCellEditor(0, 11, editorEntrada);
            tblNotaSalida.getColumnModel().getColumn(11).setCellRenderer(editorEntrada);
        }

        tblOrdenCompra.setRowHeight(30);
        tblInventarioinicial.setColumnEditable(0, e);
        tblInventarioinicial.setColumnEditable(10, e);

        txtCodCliente.setEditable(e);
        txtCodRegContaCab.setEditable(e);
        txtIdestado.setEditable(e);
        txtPreimpresoNumDocReferencia.setEditable(e);
        txtSerieNumDocReferencia.setEditable(e);
        txtPreimpresoGuiaReferencia.setEditable(e);
        txtSerieGuiaReferencia.setEditable(e);
        txtPreimpresoGuiaTrans.setEditable(e);
        txtSerieGuiaTrans.setEditable(e);
        txtPreimpreso.setEditable(e);
        txtTipocambio.setEditable(e);
        txtTmpAnexo.setEditable(false);
        txtTmpRuc.setEditable(false);
        txtCodigodoc.setEditable(e);
    }

    @Override
    public void focusLost(FocusEvent e) {
        if (e.getSource() == txtPreimpreso && txtPreimpreso.getText().trim().length() > 0) {
            String preimpreso = "0000000000" + txtPreimpreso.getText();
            String nuevapreimpreso = preimpreso.substring(preimpreso.length() - 10, preimpreso.length());

            txtPreimpreso.setText(nuevapreimpreso);
        }
        if (e.getSource() == txtPreimpresoNumDocReferencia && txtPreimpresoNumDocReferencia.getText().trim().length() > 0) {
            String preimpreso = "0000000000" + txtPreimpresoNumDocReferencia.getText();
            String nuevapreimpreso = preimpreso.substring(preimpreso.length() - 10, preimpreso.length());

            txtPreimpresoNumDocReferencia.setText(nuevapreimpreso);
        }
        if (e.getSource() == txtPreimpresoGuiaReferencia && txtPreimpresoGuiaReferencia.getText().trim().length() > 0) {
            String preimpreso = "0000000000" + txtPreimpresoGuiaReferencia.getText();
            String nuevapreimpreso = preimpreso.substring(preimpreso.length() - 10, preimpreso.length());

            txtPreimpresoGuiaReferencia.setText(nuevapreimpreso);
        }
        if (e.getSource() == txtPreimpresoGuiaTrans && txtPreimpresoGuiaTrans.getText().trim().length() > 0) {
            String preimpreso = "0000000000" + txtPreimpresoGuiaTrans.getText();
            String nuevapreimpreso = preimpreso.substring(preimpreso.length() - 10, preimpreso.length());
            txtPreimpresoGuiaTrans.setText(nuevapreimpreso);
        }
    }

    @Override
    public void keyReleased(KeyEvent e) {
    }

    @Override
    public void showMessagePrint(String codigo) {
        try {
            Reporte report = new Reporte(path);
            report.generarReporte("Ingreso", codigo, "", "", "", "", "", true, false, "Reporte Notas de Ingreso");
            mostrarPreimpreso();
        } catch (Exception ex) {
            ExceptionHandler.handleException(ex, logger);
            JOptionPane.showMessageDialog(this, ex.toString());
        }
    }

    @Override
    public boolean executeAnular() {
        try {
            RnRegContaCab regla = new RnRegContaCab(path);
            ContaCab m = new ContaCab();
            m.setIdMovimiento(txtIdMovimientoOrigen.getText().trim());
            m.setTipo("E");
            m.setIdUsuario(usuario.getId_usuario());
            String idTipoMov = this.getIdTipoMov();
            if (idTipoMov.equals("001")) {
                JOptionPane.showMessageDialog(null, regla.anularIngresoOrdenCompra(m));
                return true;
            } else if (idTipoMov.equals("006")) {
                return regla.anularIngresoDevolucionCliente(m);
            } else if (idTipoMov.equals("016")) {
                return regla.anularIngresoMercaderiaTransito(m);
            } else if (idTipoMov.equals("013")) {
                return regla.anularConversion(m);
            } else {
                return regla.anular(m);
            }
        } catch (Exception ex) {
            ExceptionHandler.handleException(ex, logger);
            JOptionPane.showMessageDialog(null, ex.getMessage());
            return false;
        } finally {
            try {
                (new LogicStock(path)).regularizarStock(Main.anio);
                System.out.println(Main.anio);
            } catch (ClassNotFoundException ex) {
                System.err.println(ex.getLocalizedMessage());
            } catch (InstantiationException ex) {
                System.err.println(ex.getLocalizedMessage());
            } catch (IllegalAccessException ex) {
                System.err.println(ex.getLocalizedMessage());
            } catch (Exception ex) {
                System.err.println(ex.getLocalizedMessage());
            }
        }
    }

    @Override
    public String executeUpdate() {
        return "";
    }

    public void setFormato(String cod) {
        lblNumdocreferencia.setBounds(cod.equals("006") ? 820 : 780, cod.equals("006") ? 5 : 5, cod.equals("006") ? 40 : 40, cod.equals("006") ? 20 : 20);
        txtPreimpresoNumDocReferencia.setBounds(cod.equals("006") ? 900 : 860, cod.equals("006") ? 5 : 5, cod.equals("006") ? 80 : 80, cod.equals("006") ? 20 : 20);
        txtSerieNumDocReferencia.setBounds(cod.equals("006") ? 865 : 825, cod.equals("006") ? 5 : 5, cod.equals("006") ? 30 : 30, cod.equals("006") ? 20 : 20);
        lblFechaemision.setBounds((cod.equals("001") ? 755 : ((cod.equals("003") || cod.equals("006")) ? 575 : (cod.equals("013") ? 180 : 755))), ((cod.equals("001") || cod.equals("003")) ? 65 : (cod.equals("013") ? 35 : 65)), 70, 20);
        dcFechaEmision.setBounds((cod.equals("001") ? 820 : ((cod.equals("003") || cod.equals("006")) ? 640 : (cod.equals("013") ? 245 : 820))), ((cod.equals("001") || cod.equals("003")) ? 65 : (cod.equals("013") ? 35 : 65)), 90, 20);
        chkSeleccionar.setBounds(5, (cod.equals("006") ? 95 : 125), 150, 20);
        boolean isIngresoConversion = cod.equals(TipoMovInventarioEnum.INGRESO_CONVERSION.getValue());
        boolean isIngresoMercaderia = cod.equals(TipoMovInventarioEnum.INGRESO_MERCADERIA.getValue());
        boolean isIngresoTransito = cod.equals(TipoMovInventarioEnum.INGRESO_TRANSITO.getValue());
        boolean isIngresoInvInicial = cod.equals(TipoMovInventarioEnum.INGRESO_INVENTARIO_INICIAL.getValue());
        boolean isIngresoAjusteInv = cod.equals(TipoMovInventarioEnum.INGRESO_AJUSTE_INVENTARIO.getValue());
        boolean isIngresoTransferencia = cod.equals(TipoMovInventarioEnum.INGRESO_TRANSFERENCIA.getValue());
        boolean isIngresoDevolCliente = cod.equals(TipoMovInventarioEnum.INGRESO_DEVOLUCION_CLIENTE.getValue());
        cboPuntoVenta.setEnabled(isIngresoDevolCliente && Constans.ES_OBLIGATORIO_UBICACION);
        cboAlmacen.setEnabled(isIngresoDevolCliente && Constans.ES_OBLIGATORIO_UBICACION);
        lblTmpanexo.setVisible(!isIngresoConversion);
        lblTmpruc.setVisible(!isIngresoConversion);
        lblNumguiareferencia.setVisible(!(isIngresoTransferencia || isIngresoConversion || isIngresoDevolCliente));
        lblNumdocreferencia.setVisible(!isIngresoConversion);
        txtSerieNumDocReferencia.setVisible(!isIngresoConversion);
        txtPreimpresoNumDocReferencia.setVisible(!isIngresoConversion);
        txtSerieGuiaReferencia.setVisible(!(isIngresoTransferencia || isIngresoConversion || isIngresoDevolCliente));
        txtPreimpresoGuiaReferencia.setVisible(!(isIngresoTransferencia || isIngresoConversion || isIngresoDevolCliente));
        txtSerieGuiaTrans.setVisible(!isIngresoConversion);
        txtPreimpresoGuiaTrans.setVisible(!isIngresoConversion);
        txtTmpRuc.setVisible(!isIngresoConversion);
        txtTmpAnexo.setVisible(!isIngresoConversion);
        cboEmpresaTrans.setVisible(!(isIngresoConversion || isIngresoDevolCliente));
        lblNumguiatransportista.setVisible(!(isIngresoConversion || isIngresoDevolCliente));
        lblIdempresaTransportista.setVisible(!(isIngresoConversion || isIngresoDevolCliente));
        txtPreimpresoGuiaTrans.setVisible(!(isIngresoConversion || isIngresoDevolCliente));
        txtSerieGuiaTrans.setVisible(!(isIngresoConversion || isIngresoDevolCliente));
        btnBuscarDocumento.setVisible(!isIngresoConversion);
        chkSeleccionar.setVisible(!isIngresoConversion);
        cboTipoDocRef.setVisible(!isIngresoConversion);
        cboLocalidad.setVisible(!isIngresoConversion);
        cboPuntoVenta.setVisible(!isIngresoConversion);
        cboAlmacen.setVisible(!isIngresoConversion);
        tabbOrdencompra.setVisible(isIngresoMercaderia || isIngresoTransito);
        tabbInventarioinicial.setVisible(isIngresoInvInicial);
        tabbNotaSalida.setVisible(isIngresoAjusteInv);
        tabbDevolucionclienteDespachado.setVisible(isIngresoDevolCliente);
        cboTipoDocRef.setEnabled(false);
        txtSerieNumDocReferencia.setEditable(false);
        txtPreimpresoNumDocReferencia.setEditable(false);
        tabbGuiatransferencia.setVisible(mode == INSERT ? isIngresoTransferencia : false);
        cboTipoDocRef.removeAllItems();
        if (isIngresoMercaderia) {
            cboTipoDocRef.addItem("ORDEN DE COMPRA");
            newRegister();
            contenidoScrollPane.setViewportView(getPanelIngresoCompra());
            contenidoScrollPane.revalidate();
            contenidoScrollPane.repaint();
        }
        if (isIngresoTransferencia) {
            cboTipoDocRef.addItem("GUIA DE REMISION");
            contenidoScrollPane.setViewportView(getPanelIngresoPorTransferencia());
            contenidoScrollPane.revalidate();
            contenidoScrollPane.repaint();
        }

        if (isIngresoInvInicial) {
            cboTipoDocRef.addItem("ORDEN DE COMPRA");
            contenidoScrollPane.setViewportView(getPanelIngresoPorInventarioInicial());
            contenidoScrollPane.revalidate();
            contenidoScrollPane.repaint();
        }

        if (isIngresoAjusteInv) {
            cboTipoDocRef.addItem("ORDEN DE COMPRA");
            contenidoScrollPane.setViewportView(getPanelIngresoPorAjusteInventario());
            contenidoScrollPane.revalidate();
            contenidoScrollPane.repaint();
        }

        if (isIngresoDevolCliente) {
            cboTipoDocRef.addItem("FACTURA");
            cboTipoDocRef.addItem("BOLETA");
            cboTipoDocRef.addItem("TICKET");
            contenidoScrollPane.setViewportView(getPanelIngresoPorDevolucion());
            contenidoScrollPane.revalidate();
            contenidoScrollPane.repaint();
        }
        if (isIngresoTransito) {
            cboTipoDocRef.addItem("FACT. TRANSITO");
            newRegister();
            contenidoScrollPane.setViewportView(getPanelIngresoCompra());
            contenidoScrollPane.revalidate();
            contenidoScrollPane.repaint();
        }
        this.getPnlControl().setVisible(true);
        if (isIngresoConversion) {
            JPanel pnlConversion = getPanelIngresoConversion();
            contenidoScrollPane.setViewportView(pnlConversion);
            this.getPnlControl().setVisible(false);
            contenidoScrollPane.revalidate();
            contenidoScrollPane.repaint();
        }
    }

    @Override
    @SuppressWarnings({"unchk_seleccionared", "unchecked", "unchecked"})
    public void setValueSearch(Object codigo, Component comp) {
        try {
            if (comp == btnBuscarDocumento) {
                String idTipoMov = this.getIdTipoMov();
                if (idTipoMov.equals(TipoMovInventarioEnum.INGRESO_MERCADERIA.getValue())) {
                    cargarOrdenCompra(codigo.toString(), "", "", usuario.getCodpuntoventa());
                } else if (idTipoMov.equals(TipoMovInventarioEnum.INGRESO_TRANSFERENCIA.getValue())) {
                    cargarGuiaRemision(codigo.toString(), "", "", usuario.getCodpuntoventa());
                } else if (idTipoMov.equals(TipoMovInventarioEnum.INGRESO_AJUSTE_INVENTARIO.getValue())) {
                    cargarNotaSalida((List<ContaItem>) codigo);
                } else if (idTipoMov.equals(TipoMovInventarioEnum.INGRESO_INVENTARIO_INICIAL.getValue())) {
                    cargarInventarioInicial(codigo.toString(), "", "", usuario.getCodpuntoventa());
                } else if (idTipoMov.equals(TipoMovInventarioEnum.INGRESO_DEVOLUCION_CLIENTE.getValue())) {
                    cargarDocumentoVenta((List<ContaItem>) codigo);
                } else if (idTipoMov.equals(TipoMovInventarioEnum.INGRESO_TRANSITO.getValue())) {
                    cargarFacturaTransito(codigo.toString(), "", "", usuario.getCodpuntoventa());
                }
            }
            if (this.pnlConversionVarios != null) {
                if (comp == pnlConversionVarios.getBtnBuscarItem()) {
                    pnlConversionVarios.loadItemSearch((BeanItem) codigo);
                }
            }
        } catch (Exception ex) {
            ExceptionHandler.handleException(ex, logger);
            JOptionPane.showMessageDialog(this, ex.getMessage());
        }
    }

    public void cargarNotaSalida(List<ContaItem> m) {
        if (m != null && m.size() > 0) {
            txtTmpAnexo.setText(m.get(0).getContacab().getAnTmpanexo());
            txtTmpRuc.setText(m.get(0).getContacab().getAnTmpruc());
            txtCodRegContaCab.setText(m.get(0).getContacab().getRcIdregconta());
            txtSerieNumDocReferencia.setText(m.get(0).getContacab().getSerie());
            txtPreimpresoNumDocReferencia.setText(m.get(0).getContacab().getPreimpreso());
            txtCodCliente.setText(m.get(0).getContacab().getAnIdanexo());
            cargarAlmacen(m.get(0).getContacab().getIdAlmacen());
            cargarMoneda(m.get(0).getContacab().getIdMoneda());
            txtTipocambio.setText(String.valueOf(m.get(0).getContacab().getMTipoCambio()));
            txtAfecto.setValue(m.get(0).getContacab().getMAfecto());
            txtNoafecto.setValue(m.get(0).getContacab().getMNoafecto());
            txtMonto.setValue(m.get(0).getContacab().getMonto());
            txtTotal.setValue(m.get(0).getContacab().getTotal());
            txtIgv.setText(String.valueOf(m.get(0).getContacab().getMIgv()));
            cargarEmpresaTransportista(m.get(0).getContacab().getIdAnexoTransportista());
            txtFlagdescuento.setText(m.get(0).getContacab().getFlagDescuento());
            txtFlagdetigv.setText(m.get(0).getContacab().getFlagigv());

            mdlNotaSalida.clearTable();
            chkSeleccionar.setSelected(false);
            mdlNotaSalida.agregarVectorRegContaItem(m);
            chkSeleccionar.setSelected(true);
            tblNotaSalida.setAllColumnPreferredWidth();
            chkSeleccionar.requestFocus();
        }
    }

    public void cargarInventarioInicial(String codOrdenCompra, String serie, String preimpreso, String codPuntoVenta) {
        RnRegContaCab regla = new RnRegContaCab(path);
        List<ContaCab> reg = regla.listarInventarioInicial(codOrdenCompra, "", serie, preimpreso, "I", codPuntoVenta, "X");

        if (reg != null && reg.size() > 0) {
            ordenCompra = reg.get(0);

            txtSerieNumDocReferencia.setText(ordenCompra.getOcSerie());
            txtPreimpresoNumDocReferencia.setText(ordenCompra.getOcPreimpreso());
            cargarLocalidad(ordenCompra.getIdLocalidad());
            cargarPuntoVenta(ordenCompra.getIdPuntoventa());
            cargarAlmacen(ordenCompra.getIdAlmacen());
            txtTmpAnexo.setText(ordenCompra.getAnTmpanexo());
            txtTmpRuc.setText(ordenCompra.getAnTmpruc());
            txtDescuento.setText(String.valueOf(ordenCompra.getMDescuento()));
            txtAfecto.setValue(ordenCompra.getMAfecto());
            txtNoafecto.setValue(ordenCompra.getMNoafecto());
            txtIgv.setText(String.valueOf(ordenCompra.getMIgv()));
            txtTotal.setValue(ordenCompra.getTotal());
            txtMonto.setValue(ordenCompra.getMonto());
            cargarEmpresaTransportista(ordenCompra.getIdAnexoTransportista());
            txtCodCliente.setText(ordenCompra.getAnIdanexo());
            txtCodRegContaCab.setText(ordenCompra.getOcIdordencompra());
            cargarMoneda(ordenCompra.getIdMoneda());
            txtCodigodoc.setText(ordenCompra.getIdTipoDoc());
            txtTipocambio.setText(String.valueOf(ordenCompra.getMTipoCambio()));
            txtFlagdescuento.setText(ordenCompra.getFlagDescuento());
            txtFlagdetigv.setText(ordenCompra.getFlagigv());
            List<ContaItem> v = new ArrayList();
            v.addAll(regla.listar("", codOrdenCompra, "", "", "", "", serie, preimpreso, "", -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 0));
            mdlInventarioinicial.clearTable();
            chkSeleccionar.setSelected(false);
            mdlInventarioinicial.agregarVectorRegContaItem(v);
            chkSeleccionar.setSelected(true);
            tblInventarioinicial.setAllColumnPreferredWidth();
            chkSeleccionar.requestFocus();
        }
    }

    public void cargarOrdenCompra(
            String codOrdenCompra, String serie, String preimpreso, String codPuntoVenta) {
        RnRegContaCab regla = new RnRegContaCab(path);
        List<ContaCab> reg = regla.listarOrdenCompra(codOrdenCompra, "", serie, preimpreso, "", codPuntoVenta, "X", frm.getAnio());

        if (reg != null && reg.size() > 0) {
            ordenCompra = reg.get(0);

            txtSerieNumDocReferencia.setText(ordenCompra.getSerie());
            txtPreimpresoNumDocReferencia.setText(ordenCompra.getPreimpreso());
            cargarLocalidad(ordenCompra.getIdLocalidad());
            cargarPuntoVenta(ordenCompra.getIdPuntoventa());
            cargarAlmacen(ordenCompra.getIdAlmacen());
            txtTmpAnexo.setText(ordenCompra.getAnTmpanexo());
            txtTmpRuc.setText(ordenCompra.getAnTmpruc());
            txtDescuento.setText(String.valueOf(ordenCompra.getMDescuento()));
            txtAfecto.setValue(ordenCompra.getMAfecto());
            txtNoafecto.setValue(ordenCompra.getMNoafecto());
            txtIgv.setText(String.valueOf(ordenCompra.getMIgv()));
            txtMonto.setValue(ordenCompra.getMonto());
            cargarEmpresaTransportista(ordenCompra.getIdAnexoTransportista());
            txtCodCliente.setText(ordenCompra.getAnIdanexo());
            txtCodRegContaCab.setText(ordenCompra.getOcIdordencompra());
            cargarMoneda(ordenCompra.getIdMoneda());
            txtCodigodoc.setText(ordenCompra.getIdTipoDoc());
            txtTipocambio.setText(String.valueOf(ordenCompra.getMTipoCambio()));
            txtFlagdescuento.setText(ordenCompra.getFlagDescuento());

            mdlOrdencompra.clearTable();
            chkSeleccionar.setSelected(false);
            mdlOrdencompra.agregarVectorRegContaItem(regla.listar("", codOrdenCompra, "", "", "", "", serie, preimpreso, "", -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 0));
            chkSeleccionar.setSelected(true);
            tblOrdenCompra.setAllColumnPreferredWidth();
            chkSeleccionar.requestFocus();
            flagTransporte = ordenCompra.getFlagTransporte();
        }
    }
    String flagTransporte = "";

    public void cargarFacturaTransito(
            String codOrdenCompra, String serie, String preimpreso, String codPuntoVenta) {
        LogicTransitoCab regla = new LogicTransitoCab(path);
        List<ContaCab> reg = new ArrayList();
        try {
            reg = regla.listDocTransitoCab(codOrdenCompra, usuario.getCodempresa(), serie, preimpreso, codPuntoVenta);
        } catch (ClassNotFoundException ex) {
            Logger.getLogger(UiRegisterIngreso.class.getName()).log(Level.SEVERE, null, ex);
            JOptionPane.showMessageDialog(null, ex.getMessage());
        } catch (InstantiationException ex) {
            Logger.getLogger(UiRegisterIngreso.class.getName()).log(Level.SEVERE, null, ex);
            JOptionPane.showMessageDialog(null, ex.getMessage());
        } catch (IllegalAccessException ex) {
            Logger.getLogger(UiRegisterIngreso.class.getName()).log(Level.SEVERE, null, ex);
            JOptionPane.showMessageDialog(null, ex.getMessage());
        } catch (Exception ex) {
            Logger.getLogger(UiRegisterIngreso.class.getName()).log(Level.SEVERE, null, ex);
            JOptionPane.showMessageDialog(null, ex.getMessage());
        }

        if (reg != null && reg.size() > 0) {
            LogicTransitoDet reglaDet = new LogicTransitoDet(path);
            ordenCompra = reg.get(0);

            txtSerieNumDocReferencia.setText(ordenCompra.getSerie());
            txtPreimpresoNumDocReferencia.setText(ordenCompra.getPreimpreso());
            cargarLocalidad(ordenCompra.getIdLocalidad());
            cargarPuntoVenta(ordenCompra.getIdPuntoventa());
            cargarAlmacen(ordenCompra.getIdAlmacen());
            txtTmpAnexo.setText(ordenCompra.getAnTmpanexo());
            txtTmpRuc.setText(ordenCompra.getAnTmpruc());
            txtDescuento.setText(String.valueOf(ordenCompra.getMDescuento()));
            txtAfecto.setValue(ordenCompra.getMAfecto());
            txtNoafecto.setValue(ordenCompra.getMNoafecto());
            txtIgv.setText(String.valueOf(ordenCompra.getMIgv()));
            txtMonto.setValue(ordenCompra.getMonto());
            txtCodCliente.setText(ordenCompra.getAnIdanexo());
            txtCodRegContaCab.setText(ordenCompra.getOcIdordencompra());
            cargarMoneda(ordenCompra.getIdMoneda());
            txtCodigodoc.setText(ordenCompra.getIdTipoDoc());
            txtTipocambio.setText(String.valueOf(ordenCompra.getMTipoCambio()));
            txtFlagdescuento.setText(ordenCompra.getFlagDescuento());

            mdlOrdencompra.clearTable();
            chkSeleccionar.setSelected(false);
            try {
                mdlOrdencompra.agregarVectorRegContaItem(reglaDet.listDocTransitoDet("", codOrdenCompra, "", "", "", "", serie, preimpreso, "", -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, "A", 0));
            } catch (ClassNotFoundException ex) {
                Logger.getLogger(UiRegisterIngreso.class.getName()).log(Level.SEVERE, null, ex);
                JOptionPane.showMessageDialog(null, ex.getMessage());
            } catch (InstantiationException ex) {
                Logger.getLogger(UiRegisterIngreso.class.getName()).log(Level.SEVERE, null, ex);
                JOptionPane.showMessageDialog(null, ex.getMessage());
            } catch (IllegalAccessException ex) {
                Logger.getLogger(UiRegisterIngreso.class.getName()).log(Level.SEVERE, null, ex);
                JOptionPane.showMessageDialog(null, ex.getMessage());
            } catch (Exception ex) {
                Logger.getLogger(UiRegisterIngreso.class.getName()).log(Level.SEVERE, null, ex);
                JOptionPane.showMessageDialog(null, ex.getMessage());
            }
            chkSeleccionar.setSelected(true);
            tblOrdenCompra.setAllColumnPreferredWidth();
            chkSeleccionar.requestFocus();
        }
    }

    private void cargarGuiaRemision(String codMovInvCabOrigen, String serie, String preimpreso, String codPuntoVenta) {
        try {
            RnRegContaCab regla = new RnRegContaCab(path);
            RnRegContaCab reglaAux = new RnRegContaCab(path);

            ContaCab m = new ContaCab();
            m.setIdMovimiento(codMovInvCabOrigen);
            m.setTipo("S");
            m.setFInicial(DateTime.format(1901, 0, 1));
            m.setFFinal(DateTime.format(1901, 0, 1));

            List<ContaCab> vecAux = reglaAux.listarOrdenRecojo(m);
            @SuppressWarnings("deprecation")
            List<ContaCab> reg = regla.listar("", "", "09", vecAux.get(0).getSerieRef(), vecAux.get(0).getPreimpresoRef(), "", new Date(0, 0, 0), "", "", "", "", "", "", "", new Date(1901, 0, 1), "BXC", "006", codPuntoVenta, new Date(1901, 0, 1), new Date(1901, 0, 1));

            if (reg != null && reg.size() > 0) {
                ContaCab guia = reg.get(0);

                txtSerieNumDocReferencia.setText(guia.getSeriePreimpresoGuiaRef().substring(0, Constans.DIG_SERIE));
                txtPreimpresoNumDocReferencia.setText(guia.getSeriePreimpresoGuiaRef().substring(3, 13));
                cargarLocalidad(guia.getIdLocalidad());
                cargarPuntoVenta(guia.getIdPvDestino());
                cargarAlmacen(guia.getIdAlmacenDestino());
                txtTmpAnexo.setText(guia.getEmpresa());
                txtTmpRuc.setText(guia.getRucempresa());
                txtDescuento.setText(String.valueOf(0.0));
                txtAfecto.setValue(0);
                txtNoafecto.setValue(0);
                txtIgv.setText(String.valueOf(0.0));
                txtMonto.setValue(0);
                cargarEmpresaTransportista(guia.getIdAnexoEmpresaTransportista());
                txtCodCliente.setText(guia.getAnIdanexo());
                txtCodRegContaCab.setText(guia.getIdMovimiento());
                txtCodigodoc.setText(guia.getIdTipoDocRef());

                RnRegContaCab reglaDet = new RnRegContaCab(path);
                mdlGuiatransferencia.clearTable();
                mdlGuiatransferencia.agregarVectorRegContaItem(reglaDet.listarDetalleGuiaPorConfirmar(guia.getIdMovimiento(), "", "", "", "", 0));
                tblGuiatransferencia.setAllColumnPreferredWidth();
            }
        } catch (Exception e) {
            ExceptionHandler.handleException(e, logger);
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }

    @Override
    public void actionPerformed(ActionEvent e) {
        try {
            if (btnBuscarDocumento == e.getSource()) {
                String idTipoMov = this.getIdTipoMov();
                if (idTipoMov.equals("001")) {
                    BuscarIngresoOrdenCompra buscarOc = new BuscarIngresoOrdenCompra(frm, this, path);
                    buscarOc.cargarTabla(usuario.getCodempresa(), usuario.getCodlocalidad(), usuario.getCodpuntoventa(), btnBuscarDocumento, 0);
                } else if (idTipoMov.equals("003")) {
                    BuscarGuiaRemision buscarGr = new BuscarGuiaRemision(frm, this, path);
                    buscarGr.cargarTabla(usuario.getCodempresa(), usuario.getCodlocalidad(), usuario.getCodpuntoventa(), btnBuscarDocumento, 0);
                } else if (idTipoMov.equals("006")) {
                    BuscarNCEntregadoDetalleCliente a = new BuscarNCEntregadoDetalleCliente(frm, this, usuario, path);
                    a.cargarTabla(btnBuscarDocumento);
                } else if (idTipoMov.equals("007")) {
                    BuscarOrdenCompraIngresoAjuste buscarOrdenRecojo = new BuscarOrdenCompraIngresoAjuste(frm, this, usuario, path);
                    buscarOrdenRecojo.cargarTabla(btnBuscarDocumento);
                } else if (idTipoMov.equals("005")) {
                    BuscarIngresoInventarioInicial buscarOrdenRecojo = new BuscarIngresoInventarioInicial(frm, this, path);
                    buscarOrdenRecojo.cargarTabla(usuario.getCodempresa(), usuario.getCodlocalidad(), usuario.getCodpuntoventa(), btnBuscarDocumento, 0);
                } else if (idTipoMov.equals("016")) {
                    BuscarIngresoDocumentoTransito buscarTran = new BuscarIngresoDocumentoTransito(frm, this, path);
                    buscarTran.cargarTabla(usuario.getCodempresa(), usuario.getCodlocalidad(), usuario.getCodpuntoventa(), btnBuscarDocumento, 0);
                }
            }
        } catch (Exception ex) {
            ExceptionHandler.handleException(ex, logger);
            JOptionPane.showMessageDialog(this, ex.getMessage());
        }
    }

    @Override
    public void tableChanged(TableModelEvent e) {
        if (e.getSource() == mdlDevolucionClienteDespachado) {
            if (mdlDevolucionClienteDespachado.getRowCount() > 0) {
                calcularImportesDevolucionDespachado();
            }
        }
        if (e.getSource() == mdlOrdencompra) {
            if (mdlOrdencompra.getRowCount() > 0) {
                String idTipoMov = this.getIdTipoMov();
                if (idTipoMov.equals("001")) {
                    calcularImportesOrdenCompra();
                } else if (idTipoMov.equals("016")) {
                    calcularImportesTransito();
                }
            }
        }
    }

    public void calcularImportesDevolucionDespachado() {
        try {
            txtAfecto.setValue(0);
            txtPercepcion.setText("0.0");
            txtDescuento.setText("0.0");
            txtIgv.setText("0.0");
            txtNoafecto.setValue(0);
            txtMonto.setValue(0);
            txtTotal.setValue(0);

            double mPercepcion = 0.0;
            double monto = 0.0;
            double mNoafecto = 0.0;
            double mIgv = 0.0;
            double mDescuento = 0.0;
            for (int i = 0; i < mdlDevolucionClienteDespachado.getRowCount(); i++) {
                ContaItem obtab = mdlDevolucionClienteDespachado.getVentaDirecta(i);
                if (obtab.isSeleccionado()) {
                    String cantidadDevolver = obtab.getCant_a_devolver();
                    if (Util.isBlank(cantidadDevolver)) {
                        cantidadDevolver = "0";
                    }
                    mPercepcion += obtab.getM_percepcion();
                    monto += Double.parseDouble(cantidadDevolver) * obtab.getP_unit();
                    mNoafecto += obtab.getM_noafecto();
                    mIgv = monto - monto / (1 + obtab.getP_igv());
                    mDescuento += obtab.getM_descuento();
                }
            }

            txtDescuento.setText(String.valueOf(CFunciones.redondea(mDescuento, 2)));
            txtAfecto.setValue(CFunciones.redondea(monto - mIgv, 2));
            txtNoafecto.setValue(CFunciones.redondea(mNoafecto, 2));
            txtIgv.setText(String.valueOf(CFunciones.redondea(mIgv, 2)));
            txtMonto.setValue(CFunciones.redondea(monto, 2));
            txtPercepcion.setText(String.valueOf(CFunciones.redondea(mPercepcion, 2)));
            txtTotal.setValue(CFunciones.redondea(monto + mPercepcion, 2));
        } catch (Exception ex) {
            ExceptionHandler.handleException(ex, logger);
        }
    }

    public void calcularImportesOrdenCompra() {
        try {
            txtAfecto.setValue(0);
            txtPercepcion.setText("0.0");
            txtDescuento.setText("0.0");
            txtIgv.setText("0.0");
            txtNoafecto.setValue(0);
            txtMonto.setValue(0);
            txtTotal.setValue(0);
            BigDecimal mPercepcion = BigDecimal.ZERO;
            BigDecimal monto = BigDecimal.ZERO;
            BigDecimal mAfecto = BigDecimal.ZERO;
            BigDecimal mNoafecto = BigDecimal.ZERO;
            BigDecimal mIgv = BigDecimal.ZERO;
            BigDecimal mDescuento = BigDecimal.ZERO;
            BigDecimal valorCompra = BigDecimal.ZERO;
            BigDecimal total;

            BigDecimal pIgv = BigDecimal.valueOf(getPorcentajeIGV("IGV VENTA", usuario.getCodempresa()));
            pIgv = pIgv.divide(BigDecimal.valueOf(100), 4, RoundingMode.HALF_UP);
            String idTipoMov = this.getIdTipoMov();
            for (int i = 0; i < mdlOrdencompra.getRowCount(); i++) {
                ContaItem obtab = (idTipoMov.equals("001") ? mdlOrdencompra.getOrdenCompraDet(i) : mdlOrdencompra.getOrdenCompraDet(i));
                if (obtab.isSeleccionado()) {
                    if (obtab.getCant_string().trim().isEmpty() == false) {
                        if (obtab.getMontoPercepcion() == null) {
                            obtab.setMontoPercepcion(BigDecimal.ZERO);
                        }
                        if (ordenCompra.getFlagOperGrabada().equalsIgnoreCase("S")
                                && ordenCompra.getFlagIGV().equalsIgnoreCase("S")) {
                            mPercepcion = obtab.getMontoPercepcion().add(mPercepcion);
                            monto = BigDecimal.valueOf(Double.parseDouble(obtab.getCant_string())).multiply(BigDecimal.valueOf(obtab.getP_unit())).subtract(BigDecimal.valueOf(obtab.getM_descuento())).add(monto);
                            mAfecto = (monto.divide(BigDecimal.ONE.add(pIgv), 5, RoundingMode.HALF_UP));
                            mNoafecto = mNoafecto.add(mNoafecto);
                            valorCompra = monto.divide((BigDecimal.ONE.add(pIgv)), 5, RoundingMode.HALF_UP);
                            mIgv = valorCompra.multiply(pIgv);
                            mDescuento = mDescuento.add(BigDecimal.valueOf(obtab.getM_descuento()));
                        } else if (ordenCompra.getFlagOperGrabada().equalsIgnoreCase("S") && ordenCompra.getFlagIGV().equalsIgnoreCase("N")) {
                            mPercepcion = obtab.getMontoPercepcion().add(mPercepcion);
                            valorCompra = BigDecimal.valueOf(Double.parseDouble(obtab.getCant_string())).multiply(BigDecimal.valueOf(obtab.getP_unit())).subtract(BigDecimal.valueOf(obtab.getM_descuento())).add(valorCompra);
                            mIgv = valorCompra.multiply(pIgv);
                            monto = valorCompra.add(mIgv);
                            mAfecto = valorCompra;
                            mNoafecto = mNoafecto.add(mNoafecto);
                            mDescuento = mDescuento.add(BigDecimal.valueOf(obtab.getM_descuento()));
                        } else if (ordenCompra.getFlagOperGrabada().equalsIgnoreCase("N") && ordenCompra.getFlagIGV().equalsIgnoreCase("N")) {
                            mPercepcion = obtab.getMontoPercepcion().add(mPercepcion);
                            valorCompra = ((BigDecimal.valueOf(Double.parseDouble(obtab.getCant_string())).multiply(BigDecimal.valueOf(obtab.getP_unit()))).subtract(BigDecimal.valueOf(obtab.getM_descuento()))).add(valorCompra);
                            mAfecto = mAfecto.add(mAfecto);
                            mNoafecto = valorCompra;
                            mIgv = mIgv.add(mIgv);
                            mDescuento = mDescuento.add(BigDecimal.valueOf(obtab.getM_descuento()));
                        } else {
                            JOptionPane.showMessageDialog(null, "Llamar al Programador");
                        }
                    }
                }
            }
            total = monto.add(mPercepcion);
            txtDescuento.setText(mDescuento.toString());
            txtAfecto.setValue(mAfecto);
            txtNoafecto.setValue(mNoafecto);
            txtIgv.setText(mIgv.toString());
            txtMonto.setValue(monto);
            txtPercepcion.setText(mPercepcion.toString());
            txtTotal.setValue(total);

        } catch (NumberFormatException | HeadlessException ex) {
            ExceptionHandler.handleException(ex, logger);
            JOptionPane.showMessageDialog(this, ex.getMessage());
        }

    }

    public double getPorcentajeIGV(String descripcion, String id_empresa) {
        try {
            BeanParametro p = new BeanParametro();
            p.setNombre(descripcion);
            RnParametro regla = new RnParametro(path);
            return (regla.listarParametro(p).get(0).getValor().length() == 0) ? 0.0 : Double.valueOf(regla.listarParametro(p).get(0).getValor());
        } catch (SQLException | NumberFormatException e) {
            ExceptionHandler.handleException(e, logger);
            JOptionPane.showMessageDialog(this, e.getMessage());
            return 0;
        }
    }

    public void calcularImportesTransito() {
        try {
            txtAfecto.setValue(0);
            txtPercepcion.setText("0.0");
            txtDescuento.setText("0.0");
            txtIgv.setText("0.0");
            txtNoafecto.setValue(0);
            txtMonto.setValue(0);
            txtTotal.setValue(0);
            BigDecimal mPercepcion = BigDecimal.ZERO;
            BigDecimal monto = BigDecimal.ZERO;
            BigDecimal mAfecto = BigDecimal.ZERO;
            BigDecimal mNoafecto = BigDecimal.ZERO;
            BigDecimal mIgv = BigDecimal.ZERO;
            BigDecimal mDescuento = BigDecimal.ZERO;
            BigDecimal valorCompra = BigDecimal.ZERO;
            BigDecimal total;

            BigDecimal pIgv = BigDecimal.valueOf(getPorcentajeIGV("IGV VENTA", usuario.getCodempresa()));
            pIgv = pIgv.divide(BigDecimal.valueOf(100), 4, RoundingMode.HALF_UP);
            String idTipoMov = this.getIdTipoMov();
            for (int i = 0; i < mdlOrdencompra.getRowCount(); i++) {
                ContaItem obtab = (idTipoMov.equals("001") ? mdlOrdencompra.getOrdenCompraDet(i) : mdlOrdencompra.getOrdenCompraDet(i));
                if (obtab.isSeleccionado()) {
                    if (obtab.getCant_string().trim().isEmpty() == false) {
                        if (obtab.getMontoPercepcion() == null) {
                            obtab.setMontoPercepcion(BigDecimal.ZERO);
                        }
                        if (ordenCompra.getFlagOperGrabada().equalsIgnoreCase("S")
                                && ordenCompra.getFlagIGV().equalsIgnoreCase("S")) {
                            mPercepcion = obtab.getMontoPercepcion().add(mPercepcion);
                            monto = BigDecimal.valueOf(Double.parseDouble(obtab.getCant_string())).multiply(BigDecimal.valueOf(obtab.getP_unit())).subtract(BigDecimal.valueOf(obtab.getM_descuento())).add(monto);
                            mAfecto = (monto.divide(BigDecimal.ONE.add(pIgv), 5, RoundingMode.HALF_UP));
                            mNoafecto = mNoafecto.add(mNoafecto);
                            valorCompra = monto.divide((BigDecimal.ONE.add(pIgv)), 5, RoundingMode.HALF_UP);
                            mIgv = valorCompra.multiply(pIgv);
                            mDescuento = mDescuento.add(BigDecimal.valueOf(obtab.getM_descuento()));
                        } else if (ordenCompra.getFlagOperGrabada().equalsIgnoreCase("S") && ordenCompra.getFlagIGV().equalsIgnoreCase("N")) {
                            mPercepcion = obtab.getMontoPercepcion().add(mPercepcion);
                            valorCompra = BigDecimal.valueOf(Double.parseDouble(obtab.getCant_string())).multiply(BigDecimal.valueOf(obtab.getP_unit())).subtract(BigDecimal.valueOf(obtab.getM_descuento())).add(valorCompra);
                            mIgv = valorCompra.multiply(pIgv);
                            monto = valorCompra.add(mIgv);
                            mAfecto = valorCompra;
                            mNoafecto = mNoafecto.add(mNoafecto);
                            mDescuento = mDescuento.add(BigDecimal.valueOf(obtab.getM_descuento()));
                        } else if (ordenCompra.getFlagOperGrabada().equalsIgnoreCase("N") && ordenCompra.getFlagIGV().equalsIgnoreCase("N")) {
                            mPercepcion = obtab.getMontoPercepcion().add(mPercepcion);
                            valorCompra = ((BigDecimal.valueOf(Double.parseDouble(obtab.getCant_string())).multiply(BigDecimal.valueOf(obtab.getP_unit()))).subtract(BigDecimal.valueOf(obtab.getM_descuento()))).add(valorCompra);
                            mAfecto = mAfecto.add(mAfecto);
                            mNoafecto = valorCompra;
                            mIgv = mIgv.add(mIgv);
                            mDescuento = mDescuento.add(BigDecimal.valueOf(obtab.getM_descuento()));
                        } else {
                            JOptionPane.showMessageDialog(null, "Llamar al Programador");
                        }
                    }
                }
            }
            total = monto.add(mPercepcion);
            txtDescuento.setText(mDescuento.toString());
            txtAfecto.setValue(mAfecto);
            txtNoafecto.setValue(mNoafecto);
            txtIgv.setText(mIgv.toString());
            txtMonto.setValue(monto);
            txtPercepcion.setText(mPercepcion.toString());
            txtTotal.setValue(total);

        } catch (NumberFormatException | HeadlessException ex) {
            ExceptionHandler.handleException(ex, logger);
            JOptionPane.showMessageDialog(this, ex.getMessage());
        }
    }

    @Override
    public boolean executeSelect() {
        return true;
    }

    @Override
    public void onPressEsc() {
    }

    @Override
    public void keyTyped(KeyEvent e) {
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
    public void showMessageErrorDelete() {
    }

    @Override
    public void showMessageErrorUpdate() {
    }

    @Override
    public void showMessageErrorInsert() {
    }

}

