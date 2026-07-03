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

    protected String almacenDevolucion = null;
    private static final long serialVersionUID = 1L;
    protected JComboBox cboMoneda;
    protected List<BeanMoneda> xmoneda;
    protected JComboBox cboPuntoVenta;
    protected JComboBox cboLocalidad;
    protected JComboBox cboAlmacen;
    protected JComboBox cboEmpresaTrans;
    protected List<Anexo> xEmpresaTransportista;
    protected JComboBox cboTipoDocRef;
    public JComboBox cboSerie;
    protected List<UsuarioCorrelativo> xserie;
    public JComboBox cboTipoMov;
    protected List<TipoMovInventario> xTipoMov;
    protected JDateChooser dcFechaEmision;
    //INGRESO POR INVENTARIO INICIAL
    protected JTabbedPane tabbInventarioinicial;
    protected OrdenCompraDetalleTableModel mdlInventarioinicial;
    protected CTable tblInventarioinicial;
    //INGRESO POR COMPRA DE MERCADERIA
    protected JTabbedPane tabbOrdencompra;
    protected OrdenCompraDetalleTableModel mdlOrdencompra;
    protected CTable tblOrdenCompra;
    protected JButton btnAgregar;
    protected JButton btnQuitar;
    //INGRESO POR TRANSFERENCIA
    protected JTabbedPane tabbGuiatransferencia;
    protected GuiaTransferenciaDetalleTableModel mdlGuiatransferencia;
    protected CTable tblGuiatransferencia;
    //INGRESO POR DEVOLUCION DE CLIENTES
    protected JTabbedPane tabbDevolucionclienteDespachado;
    protected IngresoDevolucionDespachadoTableModel mdlDevolucionClienteDespachado;
    protected CTable tblDevolucionclienteDespachado;
    protected JTabbedPane tabbNotaSalida;
    protected DocumentoVentaDetalleTableModel mdlNotaSalida;
    protected CTable tblNotaSalida;
    protected JButton btnBuscarDocumento;
    protected Gif gif;
    protected JLabel lblIdmovinventario;
    protected JLabel lblTmpanexo;
    protected JLabel lblTmpruc;
    protected JLabel lblNumguiatransportista;
    protected JLabel lblIdempresaTransportista;
    protected JLabel lblNumdocreferencia;
    protected JLabel lblNumguiareferencia;
    protected JLabel lblFechaemision;
    protected JTextField txtSerieNumDocReferencia;
    protected JTextField txtPreimpresoNumDocReferencia;
    protected JTextField txtSerieGuiaReferencia;
    protected JTextField txtPreimpresoGuiaReferencia;
    protected JTextField txtSerieGuiaTrans;
    protected JTextField txtPreimpresoGuiaTrans;
    protected JTextField txtIdestado;
    protected JTextField txtTipocambio;
    protected JTextField txtPreimpreso;
    protected JTextField txtIdMovimientoOrigen;
    protected JTextField txtIdmovimientodestino;
    protected JTextField txtTmpAnexo;
    protected JTextField txtCodCliente;
    protected JTextField txtTmpRuc;
    protected JTextField txtCodigodoc;
    protected JTextField txtIdauxiliar;
    protected JTextField txtCodRegContaCab;
    protected JTextField txtFlagdescuento;
    protected JFormattedTextField txtTotal;
    protected JTextField txtPercepcion;
    protected JFormattedTextField txtNoafecto;
    protected JTextField txtDescuento;
    protected JTextField txtIgv;
    protected JFormattedTextField txtAfecto;
    protected JFormattedTextField txtMonto;
    protected JTextField txtFlagdetigv;
    protected final Usuario usuario;
    protected final Main frm;
    protected JCheckBox chkSeleccionar;
    protected String idCondicionventa;
    protected ContaCab ordenCompra;
    protected JTextField txtGuiaRemision;
    public JLabel lblMovimiento;
    public static List<Lote> listaLotes = null;
    public static CellEditorBtnLote editorCompra;
    public static CellEditorBtnLote editorDevolucion;
    public static CellEditorBtnLote editorEntrada;
    public JLabel lblSerie = new JLabel("NÂ° INGRESO");
    public static JScrollPane contenidoScrollPane = new JScrollPane(JScrollPane.VERTICAL_SCROLLBAR_AS_NEEDED, JScrollPane.HORIZONTAL_SCROLLBAR_AS_NEEDED);
    public static final Font fuente = new Font(Font.SANS_SERIF, Font.PLAIN, 12);
    protected JScrollPane scrollTableguiaventa;
    protected JScrollPane scrollDevolucionclienteDespachado;
    protected JScrollPane scrollTableguiaventa6;
    protected JScrollPane scrollTableguiaventa7;
    protected JScrollPane scrollTableGuiaTraDetalle;
    protected final org.apache.log4j.Logger logger = org.apache.log4j.Logger.getLogger(UiRegisterIngreso.class);
    protected FormConversionVarios pnlConversionVarios;

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

    protected void inicialize() {
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
    }

    protected String getXmlLotes(ArrayList<Lote> arrayLotes) {
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

    protected void selectCheck(boolean isSelect) {
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

    protected void changeAlmacen() {
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
    }

    public void loadMovimiento() throws Exception {
    }

    public void loadEmpresaTransportista() throws Exception {
    }

    protected void loadMoneda() throws Exception {
    }

    public void loadSerieCorrelativo(String idtipoDoc) {
    }

    protected void mostrarPreimpreso() {
    }

    public void loadLocalidad(String xcodEmpres) throws Exception {
    }

    public void loadPuntoVenta() {
    }

    public void loadAlmacen() {
    }

    protected String registerIngresoCompraMercaderia() throws Exception {
        return null;
    }

    protected String getIdTipoMov() {
        if (cboTipoMov.getSelectedIndex() > -1) {
            return xTipoMov.get(cboTipoMov.getSelectedIndex()).getIdTipoMov();
        }
        return "";
    }

    protected String getIdLocalidad() {
        if (cboLocalidad.getSelectedIndex() > 0) {
            ItemObject itLocalidad = (ItemObject) cboLocalidad.getSelectedItem();
            return itLocalidad.getId();
        }
        return "";
    }

    protected String getIdPuntoVenta() {
        if (cboPuntoVenta.getSelectedIndex() > 0) {
            ItemObject itPuntoVenta = (ItemObject) cboPuntoVenta.getSelectedItem();
            return itPuntoVenta.getId();
        }
        return "";
    }

    protected String getIdAlmacen() {
        if (cboAlmacen.getSelectedIndex() > 0) {
            ItemObject itPuntoVenta = (ItemObject) cboAlmacen.getSelectedItem();
            return itPuntoVenta.getId();
        }
        return "";
    }

    @Override
    public void newRegister() {
    }

    protected String insertarIngresoAjusteInventario() throws Exception {
        return null;
    }

    protected String insertarIngresoMercaderiaTransito()
            throws Exception {
        return null;
    }

    protected String getPeriodoAnterior(int mes) {
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

    protected String insertarIngresoInventarioInicial() throws Exception {
        return null;
    }

    protected boolean validLotes(ContaItem beanItem) {
        return false;
    }

    protected String insertarIngresoDevolucionCliente() throws Exception {
        return null;
    }

    @Override
    public String executeInsert() {
        return null;
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
        return false;
    }

    @Override
    public boolean loadRegister() {
        return false;
    }

    public void cargarSerieCorrelativo(String lsSerie) {
    }

    public void cargarTipoMovimiento(String codTipoMov) {
    }

    public void cargarLocalidad(String xcodiLocalidad) {
    }

    public void cargarPuntoVenta(String codPuntoVenta) {
    }

    public void cargarAlmacen(String xcodiEmpresa) {
    }

    public void cargarEmpresaTransportista(String codEmpresaTransportista) {
    }

    public void cargarMoneda(String codMoneda) {
    }

    @Override
    public boolean executeDelete() {
        return false;
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
    }

    @Override
    public boolean executeAnular() {
        return false;
    }

    @Override
    public String executeUpdate() {
        return null;
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
    }

    public void cargarNotaSalida(List<ContaItem> m) {
    }

    public void cargarInventarioInicial(String codOrdenCompra, String serie, String preimpreso, String codPuntoVenta) {
    }

    public void cargarOrdenCompra(
            String codOrdenCompra, String serie, String preimpreso, String codPuntoVenta) {
    }
    String flagTransporte = "";

    public void cargarFacturaTransito(
            String codOrdenCompra, String serie, String preimpreso, String codPuntoVenta) {
    }

    protected void cargarGuiaRemision(String codMovInvCabOrigen, String serie, String preimpreso, String codPuntoVenta) {
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
    }

    public void calcularImportesOrdenCompra() {
    }

    public double getPorcentajeIGV(String descripcion, String id_empresa) {
        return 0.0d;
    }

    public void calcularImportesTransito() {
    }

    @Override
    public boolean executeSelect() {
        return false;
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

