package com.softcommerce.views.uiregisteritem;


import com.softcommerce.formularios.*;
import com.softcommerce.beans.BeanColor;
import com.softcommerce.beans.CaracteristicaItemDetalle;
import com.softcommerce.beans.ConfigItem;
import com.softcommerce.beans.ConfigItemAlmacen;
import com.softcommerce.beans.ConfigItemCuenta;
import com.softcommerce.beans.ConfigItemDscto;
import com.softcommerce.beans.BeanFamilia;
import com.softcommerce.beans.BeanItem;
import com.softcommerce.beans.ItemItem;
import com.softcommerce.beans.ItemPercepcion;
import com.softcommerce.beans.ItemPromocion;
import com.softcommerce.beans.BeanMarca;
import com.softcommerce.beans.BeanPrecioItem;
import com.softcommerce.beans.Promocion;
import com.softcommerce.beans.BeanSubFamilia;
import com.softcommerce.beans.BeanTamano;
import com.softcommerce.beans.BeanUnidadMedida;
import com.softcommerce.beans.Usuario;
import com.softcommerce.entity.ClaseSunat;
import com.softcommerce.enums.OperacionBDEnum;
import com.softcommerce.general.controles.JHDialog;
import com.softcommerce.general.controles.CCheckBox;
import com.softcommerce.general.controles.CTable;
import com.softcommerce.general.controles.ComponentToolKit;
import com.softcommerce.general.controles.DigitTextFieldCellEditor;
import com.softcommerce.general.controles.DoubleDocument;
import com.softcommerce.general.controles.EnumClass;
import com.softcommerce.general.controles.IntegerDocument;
import com.softcommerce.general.controles.ObjectItem;
import com.softcommerce.iconos.Gif;
import java.awt.Color;
import java.awt.Component;
import java.awt.Dimension;
import java.awt.Font;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.FocusEvent;
import java.awt.event.KeyEvent;
import java.awt.event.KeyListener;
import java.util.List;
import javax.swing.BorderFactory;
import javax.swing.JButton;
import javax.swing.JComboBox;
import javax.swing.JPanel;
import javax.swing.JTextField;
import javax.swing.border.Border;
import javax.swing.border.TitledBorder;
import com.softcommerce.general.controles.UpperCaseNumberDocument;
import java.awt.BorderLayout;
import java.awt.Dialog;
import java.awt.FlowLayout;
import java.awt.event.FocusListener;
import java.util.ArrayList;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.JScrollPane;
import javax.swing.JTabbedPane;
import javax.swing.JToolBar;
import javax.swing.SwingConstants;
import javax.swing.border.LineBorder;
import com.softcommerce.reglasnegocio.RnItem;
import com.softcommerce.reglasnegocio.RnMarca;
import com.softcommerce.reglasnegocio.RnTamano;
import com.softcommerce.reglasnegocio.RnUnidadMedida;
import com.softcommerce.general.tablas.ItemItemTableModel;
import com.softcommerce.general.tablas.CaracteristicaItemDetalleTableModel;
import com.softcommerce.general.tablas.ConfigItemAlmacenTableModel;
import com.softcommerce.general.tablas.ConfigItemCuentaTableModel;
import com.softcommerce.general.tablas.ConfigItemDsctoTableModel;
import com.softcommerce.general.tablas.ConfigItemTableModel;
import com.softcommerce.general.tablas.ItemPercepcionTableModel;
import com.softcommerce.general.tablas.ItemPromocionTableModel;
import com.softcommerce.logic.LogicParametro;
import com.softcommerce.reglasnegocio.RnPreciosCab;
import com.softcommerce.reglasnegocio.RnPromocion;
import com.softcommerce.util.render.CellRendererImageEstado;
import com.softcommerce.util.Constans;
import com.softcommerce.util.ExceptionHandler;
import com.softcommerce.util.LayoutUtil;
import com.softcommerce.util.combo.LoadCombo;
import com.softcommerce.util.LoadDataGenerica;
import com.softcommerce.util.Util;
import com.softcommerce.util.combo.LoadComboItem;
import java.awt.GridBagConstraints;
import java.awt.GridBagLayout;
import java.awt.Insets;
import java.awt.event.ItemEvent;
import java.awt.event.ItemListener;
import java.math.BigDecimal;
import java.text.SimpleDateFormat;
import javax.swing.ButtonGroup;
import javax.swing.JCheckBox;
import javax.swing.JRadioButton;
import javax.swing.event.ChangeEvent;
import javax.swing.event.ChangeListener;
import org.apache.log4j.Logger;

public class UiRegisterItem
        extends JHDialog
        implements InterUiRegisterItem, ActionListener, KeyListener, FocusListener, ItemListener, ChangeListener {

    private static final long serialVersionUID = 1L;
    protected List<BeanUnidadMedida> xunidadMedi;
    protected JComboBox cboUnidadStock;
    protected JComboBox cboUnidadCompra;
    protected JComboBox cboUnidadVenta;
    protected JTextField txtComposicion;
    protected JTextField txtFuncion;
    protected JComboBox cboFamilia;
    protected JComboBox cboSubFamilia;
    protected List<BeanMarca> xmarca;
    protected JComboBox cbMarca;
    protected JComboBox cboColor;
    protected List<BeanTamano> xtamano;
    protected JComboBox cbTamano;
    protected JTextField txtCodigoItem;
    protected JTextField txtDescripcion;
    protected JTextField txtCodigoBarras;
    protected JTextField txtPorIGV;
    protected JTextField txtPorISC;
    protected JTextField txtStockMin;
    protected JTextField txtAlterno;
    protected CCheckBox chkSujetoPercepcion;
    protected JComboBox cboTipoOperIgv;
    protected CCheckBox chkFlagAfectoIgv;
    protected JButton btnAgregarItem;
    protected JButton btnQuitarItem;
    protected JButton btnActivarCaracteristica;
    protected JButton btnDesactivarCaracteristica;
    protected JButton btnActivarConfigItem;
    protected JButton btnDesactivarConfigItem;
    protected JButton btnActivarItemPercepcion;
    protected JButton btnDesactivarItemPercepcion;
    protected JButton btnActivarItemPromocion;
    protected JButton btnDesactivarItemPromocion;
    protected JButton btnActivarDscto;
    protected JButton btnDesactivarDscto;
    protected JButton btnActivarAlmacen;
    protected JButton btnDesactivarAlmacen;
    protected JButton btnActivarCuenta;
    protected JButton btnDesactivarCuenta;
    protected ItemItemTableModel modeltable;
    protected CTable table;
    public CaracteristicaItemDetalleTableModel modeltableCaracteristica;
    protected CTable tableCaracteristica;
    public ConfigItemTableModel modeltableConfigItem;
    protected CTable tableConfigItem;
    public ItemPercepcionTableModel modeltableItemPercepcion;
    protected CTable tableItemPercepcion;
    protected ItemPromocionTableModel modeltableItemPromocion;
    protected CTable tableItemPromocion;
    protected ConfigItemDsctoTableModel modeltableConfigItemDscto;
    protected CTable tableConfigItemDscto;
    public ConfigItemAlmacenTableModel modeltableConfigItemAlmacen;
    protected CTable tableConfigItemAlmacen;
    public ConfigItemCuentaTableModel modeltableConfigItemCuenta;
    protected CTable tableConfigItemCuenta;
    protected final Usuario usuario;
    protected Gif gif;
    protected String idAlterno;
    protected Main frm;
    protected JTabbedPane tabb;
    protected JCheckBox chkFlagKardex;
    protected JCheckBox chkServicioTransporte;
    protected JCheckBox chkEstado;
    protected JComboBox cboTipo;
    protected JTextField txtCuentaCompra;
    protected JTextField txtCuentaTransito;
    protected JTextField txtCuentaVentaSol;
    protected JTextField txtCuentaVentaDol;
    protected List<Promocion> xPromocion;
    protected JComboBox cboPromocion;
    protected JButton btnAgregarProm;
    protected JComboBox cboMoneda;
    protected JTextField txtPrecio1;
    protected JTextField txtPrecio2;
    protected JTextField txtPrecio3;
    protected JTextField txtPrecio4;
    protected JTextField txtPrecio5;
    protected JTextField txtPrecio6;
    protected final Logger logger = Logger.getLogger(UiRegisterItem.class);
    protected JComboBox cboSunat;
    protected ButtonGroup bgPerecible;
    protected JRadioButton rbPerecible;
    protected JRadioButton rbNoPerecible;
    protected JTextField txtCantidadDiasPerecible;
    protected JPanel pnlProducto = new JPanel();
    protected JPanel pnlPerecible = new JPanel();

    public UiRegisterItem(Main frm, Usuario usuario) {
        super(frm);
        this.usuario = usuario;
        this.frm = frm;
        inicialize();
        initListener();
    }

    public UiRegisterItem(Dialog arg0, Usuario usuario) {
        super(arg0);
        this.usuario = usuario;
        inicialize();
        initListener();
    }

    protected void inicialize() {
        gif = new Gif();

        JPanel pnlDialog = new JPanel();
        pnlDialog.setLayout(null);
        pnlDialog.setBackground(new Color(245, 245, 245));

        tabb = new JTabbedPane();

        tabb.addTab("Datos de Item", getPnlDatos());
        tabb.addTab("Conversion a Item", getPnlConversion());
        tabb.addTab("Caracteristicas del Item", getPnlCaracteristica());
        tabb.addTab("Configuracion Item", getPnlConfigItem());
        tabb.addTab("Descuento Item", getPnlConfigItemDscto());
        tabb.addTab("Configuracion Almacen", getPnlConfigItemAlmacen());
        tabb.addTab("Configuracion Cuenta", getPnlConfigItemCuenta());
        tabb.addTab("Percepcion", getPnlItemPercepcion());
        tabb.addTab("Promociones", getPnlItemPromocion());
        tabb.setBounds(10, 10, 1050, 460);
        pnlDialog.add(tabb);

        setTitleName("Item");
        setRegister(pnlDialog);
        setSize(new Dimension(1100, 555));
        ComponentToolKit.centerComponentPosicion(this);
    }

    protected void initListener() {
        cboTipoOperIgv.addItemListener(this);
        rbNoPerecible.addChangeListener(this);
        rbPerecible.addChangeListener(this);
        txtFuncion.addFocusListener(this);
        if (txtPrecio1 != null) {
            txtPrecio1.addFocusListener(this);
            txtPrecio2.addFocusListener(this);
            txtPrecio3.addFocusListener(this);
            txtPrecio4.addFocusListener(this);
            txtPrecio5.addFocusListener(this);
            txtPrecio6.addFocusListener(this);
        }
        this.loadIgv();
    }

    protected JToolBar getToolBarConversion() {
        JToolBar toolbar = new JToolBar();
        toolbar.setBackground(new Color(245, 245, 245));
        toolbar.setPreferredSize(new Dimension(0, 30));

        btnAgregarItem = new JButton("Agregar", gif.ADD16);
        btnAgregarItem.setMnemonic('A');
        btnAgregarItem.setHorizontalAlignment(SwingConstants.LEFT);
        btnAgregarItem.setIconTextGap(10);
        btnAgregarItem.addActionListener(this);
        btnAgregarItem.setOpaque(false);
        btnAgregarItem.addKeyListener(this);
        btnAgregarItem.setFocusPainted(false);
        btnAgregarItem.setFont(new Font(Font.SANS_SERIF, 0, 11));
        toolbar.add(btnAgregarItem);

        toolbar.addSeparator();

        btnQuitarItem = new JButton("Quitar", gif.ELIMINATE16);
        btnQuitarItem.setMnemonic('Q');
        btnQuitarItem.setHorizontalAlignment(SwingConstants.LEFT);
        btnQuitarItem.setIconTextGap(10);
        btnQuitarItem.addActionListener(this);
        btnQuitarItem.setOpaque(false);
        btnQuitarItem.addKeyListener(this);
        btnQuitarItem.setFocusPainted(false);
        btnQuitarItem.setFont(new Font(Font.SANS_SERIF, 0, 11));
        toolbar.add(btnQuitarItem);

        return toolbar;
    }

    protected JToolBar getToolBarCaracteristica() {
        JToolBar toolbar = new JToolBar();
        toolbar.setBackground(new Color(245, 245, 245));
        toolbar.setPreferredSize(new Dimension(0, 30));

        btnActivarCaracteristica = new JButton("Activar", gif.ADD16);
        btnActivarCaracteristica = new JButton("Activar", gif.ADD16);
        btnActivarCaracteristica.setMnemonic('A');
        btnActivarCaracteristica.setHorizontalAlignment(SwingConstants.LEFT);
        btnActivarCaracteristica.setIconTextGap(10);
        btnActivarCaracteristica.addActionListener(this);
        btnActivarCaracteristica.setOpaque(false);
        btnActivarCaracteristica.addKeyListener(this);
        btnActivarCaracteristica.setFocusPainted(false);
        btnActivarCaracteristica.setFont(new Font(Font.SANS_SERIF, 0, 11));
        toolbar.add(btnActivarCaracteristica);

        toolbar.addSeparator();

        btnDesactivarCaracteristica = new JButton("Desactivar", gif.ELIMINATE16);
        btnDesactivarCaracteristica.setMnemonic('D');
        btnDesactivarCaracteristica.setHorizontalAlignment(SwingConstants.LEFT);
        btnDesactivarCaracteristica.setIconTextGap(10);
        btnDesactivarCaracteristica.addActionListener(this);
        btnDesactivarCaracteristica.setOpaque(false);
        btnDesactivarCaracteristica.addKeyListener(this);
        btnDesactivarCaracteristica.setFocusPainted(false);
        btnDesactivarCaracteristica.setFont(new Font(Font.SANS_SERIF, 0, 11));
        toolbar.add(btnDesactivarCaracteristica);

        return toolbar;
    }

    protected JToolBar getToolBarConfigItem() {
        JToolBar toolbar = new JToolBar();
        toolbar.setBackground(new Color(245, 245, 245));
        toolbar.setPreferredSize(new Dimension(0, 30));

        btnActivarConfigItem = new JButton("Activar", gif.ADD16);
        btnActivarConfigItem.setMnemonic('A');
        btnActivarConfigItem.setHorizontalAlignment(SwingConstants.LEFT);
        btnActivarConfigItem.setIconTextGap(10);
        btnActivarConfigItem.addActionListener(this);
        btnActivarConfigItem.setOpaque(false);
        btnActivarConfigItem.addKeyListener(this);
        btnActivarConfigItem.setFocusPainted(false);
        btnActivarConfigItem.setFont(new Font(Font.SANS_SERIF, 0, 11));
        toolbar.add(btnActivarConfigItem);

        toolbar.addSeparator();

        btnDesactivarConfigItem = new JButton("Desactivar", gif.ELIMINATE16);
        btnDesactivarConfigItem.setMnemonic('D');
        btnDesactivarConfigItem.setHorizontalAlignment(SwingConstants.LEFT);
        btnDesactivarConfigItem.setIconTextGap(10);
        btnDesactivarConfigItem.addActionListener(this);
        btnDesactivarConfigItem.setOpaque(false);
        btnDesactivarConfigItem.addKeyListener(this);
        btnDesactivarConfigItem.setFocusPainted(false);
        btnDesactivarConfigItem.setFont(new Font(Font.SANS_SERIF, 0, 11));
        toolbar.add(btnDesactivarConfigItem);

        return toolbar;
    }

    protected JToolBar getToolBarItemPercepcion() {
        JToolBar toolbar = new JToolBar();
        toolbar.setBackground(new Color(245, 245, 245));
        toolbar.setPreferredSize(new Dimension(0, 30));

        btnActivarItemPercepcion = new JButton("Activar", gif.ADD16);
        btnActivarItemPercepcion.setMnemonic('A');
        btnActivarItemPercepcion.setHorizontalAlignment(SwingConstants.LEFT);
        btnActivarItemPercepcion.setIconTextGap(10);
        btnActivarItemPercepcion.addActionListener(this);
        btnActivarItemPercepcion.setOpaque(false);
        btnActivarItemPercepcion.addKeyListener(this);
        btnActivarItemPercepcion.setFocusPainted(false);
        btnActivarItemPercepcion.setFont(new Font(Font.SANS_SERIF, 0, 11));
        toolbar.add(btnActivarItemPercepcion);

        toolbar.addSeparator();

        btnDesactivarItemPercepcion = new JButton("Desactivar", gif.ELIMINATE16);
        btnDesactivarItemPercepcion.setMnemonic('D');
        btnDesactivarItemPercepcion.setHorizontalAlignment(SwingConstants.LEFT);
        btnDesactivarItemPercepcion.setIconTextGap(10);
        btnDesactivarItemPercepcion.addActionListener(this);
        btnDesactivarItemPercepcion.setOpaque(false);
        btnDesactivarItemPercepcion.addKeyListener(this);
        btnDesactivarItemPercepcion.setFocusPainted(false);
        btnDesactivarItemPercepcion.setFont(new Font(Font.SANS_SERIF, 0, 11));
        toolbar.add(btnDesactivarItemPercepcion);

        return toolbar;
    }

    protected JToolBar getToolBarItemPromocion() {
        JToolBar toolbar = new JToolBar();
        toolbar.setBackground(new Color(245, 245, 245));
        toolbar.setPreferredSize(new Dimension(0, 30));

        btnActivarItemPromocion = new JButton("Activar", gif.ADD16);
        btnActivarItemPromocion.setMnemonic('A');
        btnActivarItemPromocion.setHorizontalAlignment(SwingConstants.LEFT);
        btnActivarItemPromocion.setIconTextGap(10);
        btnActivarItemPromocion.addActionListener(this);
        btnActivarItemPromocion.setOpaque(false);
        btnActivarItemPromocion.addKeyListener(this);
        btnActivarItemPromocion.setFocusPainted(false);
        btnActivarItemPromocion.setFont(new Font(Font.SANS_SERIF, 0, 11));
        toolbar.add(btnActivarItemPromocion);

        toolbar.addSeparator();

        btnDesactivarItemPromocion = new JButton("Desactivar", gif.ELIMINATE16);
        btnDesactivarItemPromocion.setMnemonic('D');
        btnDesactivarItemPromocion.setHorizontalAlignment(SwingConstants.LEFT);
        btnDesactivarItemPromocion.setIconTextGap(10);
        btnDesactivarItemPromocion.addActionListener(this);
        btnDesactivarItemPromocion.setOpaque(false);
        btnDesactivarItemPromocion.addKeyListener(this);
        btnDesactivarItemPromocion.setFocusPainted(false);
        btnDesactivarItemPromocion.setFont(new Font(Font.SANS_SERIF, 0, 11));
        toolbar.add(btnDesactivarItemPromocion);

        return toolbar;
    }

    protected JToolBar getToolBarConfigItemDscto() {
        JToolBar toolbar = new JToolBar();
        toolbar.setBackground(new Color(245, 245, 245));
        toolbar.setPreferredSize(new Dimension(0, 30));

        btnActivarDscto = new JButton("Activar", gif.ADD16);
        btnActivarDscto.setMnemonic('A');
        btnActivarDscto.setHorizontalAlignment(SwingConstants.LEFT);
        btnActivarDscto.setIconTextGap(10);
        btnActivarDscto.addActionListener(this);
        btnActivarDscto.setOpaque(false);
        btnActivarDscto.addKeyListener(this);
        btnActivarDscto.setFocusPainted(false);
        btnActivarDscto.setFont(new Font(Font.SANS_SERIF, 0, 11));
        toolbar.add(btnActivarDscto);

        toolbar.addSeparator();

        btnDesactivarDscto = new JButton("Desactivar", gif.ELIMINATE16);
        btnDesactivarDscto.setMnemonic('D');
        btnDesactivarDscto.setHorizontalAlignment(SwingConstants.LEFT);
        btnDesactivarDscto.setIconTextGap(10);
        btnDesactivarDscto.addActionListener(this);
        btnDesactivarDscto.setOpaque(false);
        btnDesactivarDscto.addKeyListener(this);
        btnDesactivarDscto.setFocusPainted(false);
        btnDesactivarDscto.setFont(new Font(Font.SANS_SERIF, 0, 11));
        toolbar.add(btnDesactivarDscto);

        return toolbar;
    }

    protected JToolBar getToolBarConfigItemAlmacen() {
        JToolBar toolbar = new JToolBar();
        toolbar.setBackground(new Color(245, 245, 245));
        toolbar.setPreferredSize(new Dimension(0, 30));

        btnActivarAlmacen = new JButton("Activar", gif.ADD16);
        btnActivarAlmacen.setMnemonic('A');
        btnActivarAlmacen.setHorizontalAlignment(SwingConstants.LEFT);
        btnActivarAlmacen.setIconTextGap(10);
        btnActivarAlmacen.addActionListener(this);
        btnActivarAlmacen.setOpaque(false);
        btnActivarAlmacen.addKeyListener(this);
        btnActivarAlmacen.setFocusPainted(false);
        btnActivarAlmacen.setFont(new Font(Font.SANS_SERIF, 0, 11));
        toolbar.add(btnActivarAlmacen);

        toolbar.addSeparator();

        btnDesactivarAlmacen = new JButton("Desactivar", gif.ELIMINATE16);
        btnDesactivarAlmacen.setMnemonic('D');
        btnDesactivarAlmacen.setHorizontalAlignment(SwingConstants.LEFT);
        btnDesactivarAlmacen.setIconTextGap(10);
        btnDesactivarAlmacen.addActionListener(this);
        btnDesactivarAlmacen.setOpaque(false);
        btnDesactivarAlmacen.addKeyListener(this);
        btnDesactivarAlmacen.setFocusPainted(false);
        btnDesactivarAlmacen.setFont(new Font(Font.SANS_SERIF, 0, 11));
        toolbar.add(btnDesactivarAlmacen);

        return toolbar;
    }

    protected JToolBar getToolBarConfigItemCuenta() {
        JToolBar toolbar = new JToolBar();
        toolbar.setBackground(new Color(245, 245, 245));
        toolbar.setPreferredSize(new Dimension(0, 30));

        btnActivarCuenta = new JButton("Activar", gif.ADD16);
        btnActivarCuenta.setMnemonic('A');
        btnActivarCuenta.setHorizontalAlignment(SwingConstants.LEFT);
        btnActivarCuenta.setIconTextGap(10);
        btnActivarCuenta.addActionListener(this);
        btnActivarCuenta.setOpaque(false);
        btnActivarCuenta.addKeyListener(this);
        btnActivarCuenta.setFocusPainted(false);
        btnActivarCuenta.setFont(new Font(Font.SANS_SERIF, 0, 11));
        toolbar.add(btnActivarCuenta);

        toolbar.addSeparator();

        btnDesactivarCuenta = new JButton("Desactivar", gif.ELIMINATE16);
        btnDesactivarCuenta.setMnemonic('D');
        btnDesactivarCuenta.setHorizontalAlignment(SwingConstants.LEFT);
        btnDesactivarCuenta.setIconTextGap(10);
        btnDesactivarCuenta.addActionListener(this);
        btnDesactivarCuenta.setOpaque(false);
        btnDesactivarCuenta.addKeyListener(this);
        btnDesactivarCuenta.setFocusPainted(false);
        btnDesactivarCuenta.setFont(new Font(Font.SANS_SERIF, 0, 11));
        toolbar.add(btnDesactivarCuenta);

        return toolbar;
    }

    protected JPanel getPnlConversion() {
        modeltable = new ItemItemTableModel();
        table = new CTable();
        table.setFont(new Font(Font.SANS_SERIF, 0, 11));
        table.getTableHeader().setFont(new Font(Font.SANS_SERIF, 1, 11));
        table.setModel(modeltable);
        table.setAllTableNoEditable();
        table.setAllColumnNoResizable();
        table.setRendererColumnZero();
        JScrollPane scroll = new JScrollPane(table);
        table.setEditingColumn(6);
        table.setEditingColumn(7);
        table.getColumnModel().getColumn(6).setCellEditor(new DigitTextFieldCellEditor(EnumClass.TipoDatoEditor.DOUBLE_EDITOR).cellEditor);
        table.getColumnModel().getColumn(7).setCellEditor(new DigitTextFieldCellEditor(EnumClass.TipoDatoEditor.DOUBLE_EDITOR).cellEditor);

        table.setAllColumnPreferredWidth();

        JPanel pnlItem = new JPanel(new BorderLayout());
        pnlItem.setLayout(new BorderLayout(0, 0));
        pnlItem.setBackground(new Color(245, 245, 245));
        pnlItem.add(scroll, BorderLayout.CENTER);

        pnlItem.add(getToolBarConversion(), BorderLayout.NORTH);

        return pnlItem;
    }

    protected JPanel getPnlCaracteristica() {
        modeltableCaracteristica = new CaracteristicaItemDetalleTableModel();
        tableCaracteristica = new CTable();
        tableCaracteristica.setFont(new Font(Font.SANS_SERIF, 0, 11));
        tableCaracteristica.getTableHeader().setFont(new Font(Font.SANS_SERIF, 1, 11));
        tableCaracteristica.setModel(modeltableCaracteristica);
        tableCaracteristica.setAllTableNoEditable();
        tableCaracteristica.setAllColumnNoResizable();
        tableCaracteristica.setRendererColumnZero();
        JScrollPane scroll = new JScrollPane(tableCaracteristica);
        tableCaracteristica.getColumnModel().getColumn(0).setCellRenderer(new CellRendererImageEstado());
        tableCaracteristica.setAllColumnPreferredWidth();

        JPanel pnlItem = new JPanel(new BorderLayout());
        pnlItem.setLayout(new BorderLayout(0, 0));
        pnlItem.setBackground(new Color(245, 245, 245));
        pnlItem.add(scroll, BorderLayout.CENTER);

        pnlItem.add(getToolBarCaracteristica(), BorderLayout.NORTH);

        return pnlItem;
    }

    protected JPanel getPnlConfigItem() {
        modeltableConfigItem = new ConfigItemTableModel();
        tableConfigItem = new CTable();
        tableConfigItem.setFont(new Font(Font.SANS_SERIF, 0, 11));
        tableConfigItem.getTableHeader().setFont(new Font(Font.SANS_SERIF, 1, 11));
        tableConfigItem.setModel(modeltableConfigItem);
        tableConfigItem.setAllTableNoEditable();
        tableConfigItem.setAllColumnNoResizable();
        tableConfigItem.setRendererColumnZero();
        JScrollPane scroll = new JScrollPane(tableConfigItem);
        tableConfigItem.getColumnModel().getColumn(0).setCellRenderer(new CellRendererImageEstado());
        tableConfigItem.setAllColumnPreferredWidth();

        JPanel pnlItem = new JPanel(new BorderLayout());
        pnlItem.setLayout(new BorderLayout(0, 0));
        pnlItem.setBackground(new Color(245, 245, 245));
        pnlItem.add(scroll, BorderLayout.CENTER);

        pnlItem.add(getToolBarConfigItem(), BorderLayout.NORTH);

        return pnlItem;
    }

    protected JPanel getPnlItemPercepcion() {
        modeltableItemPercepcion = new ItemPercepcionTableModel();
        tableItemPercepcion = new CTable();
        tableItemPercepcion.setFont(new Font(Font.SANS_SERIF, 0, 11));
        tableItemPercepcion.getTableHeader().setFont(new Font(Font.SANS_SERIF, 1, 11));
        tableItemPercepcion.setModel(modeltableItemPercepcion);
        tableItemPercepcion.setAllTableNoEditable();
        tableItemPercepcion.setAllColumnNoResizable();
        tableItemPercepcion.setRendererColumnZero();
        JScrollPane scroll = new JScrollPane(tableItemPercepcion);
        tableItemPercepcion.getColumnModel().getColumn(0).setCellRenderer(new CellRendererImageEstado());
        tableItemPercepcion.setAllColumnPreferredWidth();

        JPanel pnlItem = new JPanel(new BorderLayout());
        pnlItem.setLayout(new BorderLayout(0, 0));
        pnlItem.setBackground(new Color(245, 245, 245));
        pnlItem.add(scroll, BorderLayout.CENTER);

        pnlItem.add(getToolBarItemPercepcion(), BorderLayout.NORTH);

        return pnlItem;
    }

    protected JPanel getPnlItemPromocion() {
        modeltableItemPromocion = new ItemPromocionTableModel();
        tableItemPromocion = new CTable();
        tableItemPromocion.setFont(new Font(Font.SANS_SERIF, 0, 11));
        tableItemPromocion.getTableHeader().setFont(new Font(Font.SANS_SERIF, 1, 11));
        tableItemPromocion.setModel(modeltableItemPromocion);
        tableItemPromocion.setAllTableNoEditable();
        tableItemPromocion.setAllColumnNoResizable();
        tableItemPromocion.setRendererColumnZero();
        JScrollPane scroll = new JScrollPane(tableItemPromocion);
        tableItemPromocion.getColumnModel().getColumn(2).setCellRenderer(new CellRendererImageEstado());
        tableItemPromocion.setAllColumnPreferredWidth();

        JPanel pnlItem = new JPanel(new BorderLayout());
        pnlItem.setLayout(new BorderLayout(0, 0));
        pnlItem.setBackground(new Color(245, 245, 245));
        pnlItem.add(scroll, BorderLayout.CENTER);

        JPanel pnlSouth = new JPanel();
        pnlSouth.setLayout(new BorderLayout());
        JPanel pnl = new JPanel(new FlowLayout(FlowLayout.LEADING, 14, 5));
        JLabel lblPromocion = new JLabel("Promocion: ");
        pnl.add(lblPromocion);
        cboPromocion = new JComboBox();
        pnl.add(cboPromocion);
        btnAgregarProm = new JButton("Agregar", gif.ADDORANGE);
        btnAgregarProm.setMnemonic('A');
        btnAgregarProm.setHorizontalAlignment(SwingConstants.LEFT);
        btnAgregarProm.setIconTextGap(10);
        btnAgregarProm.addActionListener(this);
        btnAgregarProm.setOpaque(false);
        btnAgregarProm.setFocusPainted(false);
        btnAgregarProm.setFont(new Font(Font.SANS_SERIF, 0, 11));
        pnl.add(btnAgregarProm);
        pnlSouth.add(pnl, BorderLayout.CENTER);
        pnlSouth.add(getToolBarItemPromocion(), BorderLayout.SOUTH);
        pnlItem.add(pnlSouth, BorderLayout.NORTH);

        return pnlItem;
    }

    protected JPanel getPnlConfigItemDscto() {
        modeltableConfigItemDscto = new ConfigItemDsctoTableModel();
        tableConfigItemDscto = new CTable();
        tableConfigItemDscto.setFont(new Font(Font.SANS_SERIF, 0, 11));
        tableConfigItemDscto.getTableHeader().setFont(new Font(Font.SANS_SERIF, 1, 11));
        tableConfigItemDscto.setModel(modeltableConfigItemDscto);
        tableConfigItemDscto.setAllTableNoEditable();
        tableConfigItemDscto.setAllColumnNoResizable();
        tableConfigItemDscto.setRendererColumnZero();
        JScrollPane scroll = new JScrollPane(tableConfigItemDscto);
        tableConfigItemDscto.getColumnModel().getColumn(0).setCellRenderer(new CellRendererImageEstado());
        tableConfigItemDscto.setAllColumnPreferredWidth();

        JPanel pnlItem = new JPanel(new BorderLayout());
        pnlItem.setLayout(new BorderLayout(0, 0));
        pnlItem.setBackground(new Color(245, 245, 245));
        pnlItem.add(scroll, BorderLayout.CENTER);

        pnlItem.add(getToolBarConfigItemDscto(), BorderLayout.NORTH);

        return pnlItem;
    }

    protected JPanel getPnlConfigItemAlmacen() {
        modeltableConfigItemAlmacen = new ConfigItemAlmacenTableModel();
        tableConfigItemAlmacen = new CTable();
        tableConfigItemAlmacen.setFont(new Font(Font.SANS_SERIF, 0, 11));
        tableConfigItemAlmacen.getTableHeader().setFont(new Font(Font.SANS_SERIF, 1, 11));
        tableConfigItemAlmacen.setModel(modeltableConfigItemAlmacen);
        tableConfigItemAlmacen.setAllTableNoEditable();
        tableConfigItemAlmacen.setAllColumnNoResizable();
        tableConfigItemAlmacen.setRendererColumnZero();
        JScrollPane scroll = new JScrollPane(tableConfigItemAlmacen);
        tableConfigItemAlmacen.getColumnModel().getColumn(0).setCellRenderer(new CellRendererImageEstado());
        tableConfigItemAlmacen.setAllColumnPreferredWidth();

        JPanel pnlItem = new JPanel(new BorderLayout());
        pnlItem.setLayout(new BorderLayout(0, 0));
        pnlItem.setBackground(new Color(245, 245, 245));
        pnlItem.add(scroll, BorderLayout.CENTER);

        pnlItem.add(getToolBarConfigItemAlmacen(), BorderLayout.NORTH);

        return pnlItem;
    }

    protected JPanel getPnlConfigItemCuenta() {
        modeltableConfigItemCuenta = new ConfigItemCuentaTableModel();
        tableConfigItemCuenta = new CTable();
        tableConfigItemCuenta.setFont(new Font(Font.SANS_SERIF, 0, 11));
        tableConfigItemCuenta.getTableHeader().setFont(new Font(Font.SANS_SERIF, 1, 11));
        tableConfigItemCuenta.setModel(modeltableConfigItemCuenta);
        tableConfigItemCuenta.setAllTableNoEditable();
        tableConfigItemCuenta.setAllColumnNoResizable();
        tableConfigItemCuenta.setRendererColumnZero();
        JScrollPane scroll = new JScrollPane(tableConfigItemCuenta);
        tableConfigItemCuenta.getColumnModel().getColumn(0).setCellRenderer(new CellRendererImageEstado());
        tableConfigItemCuenta.setAllColumnPreferredWidth();

        JPanel pnlItem = new JPanel(new BorderLayout());
        pnlItem.setLayout(new BorderLayout(0, 0));
        pnlItem.setBackground(new Color(245, 245, 245));
        pnlItem.add(scroll, BorderLayout.CENTER);

        pnlItem.add(getToolBarConfigItemCuenta(), BorderLayout.NORTH);
        pnlItem.add(getPnlCuentas(), BorderLayout.SOUTH);

        return pnlItem;
    }

    protected JPanel getPnlDatos() {
        JPanel pnlGeneral = new JPanel(new BorderLayout());
        pnlGeneral.setBackground(new Color(245, 245, 245));
        pnlGeneral.add(this.getPnlNorth(), BorderLayout.NORTH);
        pnlGeneral.add(this.getPnlCenter(), BorderLayout.CENTER);
        return pnlGeneral;
    }

    protected JPanel getPnlCenter() {
        JPanel pnlGral = new JPanel();
        pnlGral.setLayout(new BorderLayout());
        pnlGral.add(this.getPnlUm(), BorderLayout.WEST);
        if (Constans.IS_ITEM_BY_CLIENTE || Constans.IS_ITEM_RESUMEN_PRECIO) {
            pnlGral.add(this.getPnlPrecioMoneda(), BorderLayout.CENTER);
        }
        pnlGral.add(this.getPnlOtros(), BorderLayout.EAST);
        return pnlGral;
    }

    protected JPanel getPnlPrecioMoneda() {
        JPanel pnlPrinc = new JPanel(new BorderLayout());
        Border border = BorderFactory.createTitledBorder(null, null, TitledBorder.LEFT, TitledBorder.DEFAULT_POSITION, new Font("Verdana", 1, 11), Color.BLACK);
        pnlPrinc.setBorder(border);
        JPanel pnl = new JPanel(new BorderLayout());
        pnlPrinc.add(pnl, BorderLayout.WEST);
        if (Constans.IS_ITEM_BY_CLIENTE) {
            pnl.add(getPnlMoneda(), BorderLayout.NORTH);
        }
        pnl.add(getPnlPrecioSol(), BorderLayout.WEST);
        pnl.add(getPnlPrecioDol(), BorderLayout.CENTER);
        return pnlPrinc;
    }

    protected JPanel getPnlMoneda() {
        JPanel pnl = new JPanel(new FlowLayout(FlowLayout.LEADING, 2, 5));
        JLabel lblMoneda = new JLabel("Moneda");
        pnl.add(lblMoneda);
        cboMoneda = new JComboBox();
        pnl.add(cboMoneda);
        return pnl;
    }

    protected JPanel getPnlPrecioSol() {
        JPanel pnl = new JPanel(new GridBagLayout());
        Border border = BorderFactory.createTitledBorder(null, "Precio Soles",
                TitledBorder.LEFT, TitledBorder.DEFAULT_POSITION, new Font("Verdana", 1, 11), Color.BLACK);
        pnl.setBorder(border);
        GridBagConstraints gbc = LayoutUtil.getGbc();
        gbc.insets = new Insets(5, 5, 5, 5);
        JLabel lblTarjeta = new JLabel("Tarjeta");
        pnl.add(lblTarjeta, gbc);
        gbc.gridx = 1;
        txtPrecio1 = new JTextField(4);
        txtPrecio1.setDocument(new DoubleDocument());
        pnl.add(txtPrecio1, gbc);
        gbc.gridy = 1;
        gbc.gridx = 0;
        JLabel lblPublico = new JLabel("Publico");
        pnl.add(lblPublico, gbc);
        gbc.gridx = 1;
        txtPrecio2 = new JTextField(4);
        txtPrecio2.setDocument(new DoubleDocument());
        pnl.add(txtPrecio2, gbc);
        gbc.gridy = 2;
        gbc.gridx = 0;
        JLabel lblMayor = new JLabel("Mayor");
        pnl.add(lblMayor, gbc);
        gbc.gridx = 1;
        txtPrecio3 = new JTextField(4);
        txtPrecio3.setDocument(new DoubleDocument());
        pnl.add(txtPrecio3, gbc);
        return pnl;
    }

    protected JPanel getPnlPrecioDol() {
        JPanel pnl = new JPanel(new GridBagLayout());
        Border border = BorderFactory.createTitledBorder(null, "Precio Dolares",
                TitledBorder.LEFT, TitledBorder.DEFAULT_POSITION, new Font("Verdana", 1, 11), Color.BLACK);
        pnl.setBorder(border);
        GridBagConstraints gbc = LayoutUtil.getGbc();
        gbc.insets = new Insets(5, 5, 5, 5);
        JLabel lblTarjeta = new JLabel("Tarjeta");
        pnl.add(lblTarjeta, gbc);
        gbc.gridx = 1;
        txtPrecio4 = new JTextField(4);
        txtPrecio4.setDocument(new DoubleDocument());
        pnl.add(txtPrecio4, gbc);
        gbc.gridy = 1;
        gbc.gridx = 0;
        JLabel lblPublico = new JLabel("Publico");
        pnl.add(lblPublico, gbc);
        gbc.gridx = 1;
        txtPrecio5 = new JTextField(4);
        txtPrecio5.setDocument(new DoubleDocument());
        pnl.add(txtPrecio5, gbc);
        gbc.gridy = 2;
        gbc.gridx = 0;
        JLabel lblMayor = new JLabel("Mayor");
        pnl.add(lblMayor, gbc);
        gbc.gridx = 1;
        txtPrecio6 = new JTextField(4);
        txtPrecio6.setDocument(new DoubleDocument());
        pnl.add(txtPrecio6, gbc);
        return pnl;
    }

    protected JPanel getPnlNorth() {
        JPanel pnlGral = new JPanel();
        Border border = BorderFactory.createTitledBorder(null, null, TitledBorder.LEFT, TitledBorder.DEFAULT_POSITION, new Font("Verdana", 1, 11), Color.BLACK);
        pnlGral.setBorder(border);
        pnlGral.setLayout(new BorderLayout());
        JPanel pnl = new JPanel();
        pnl.setLayout(new GridBagLayout());
        pnlGral.add(pnl, BorderLayout.WEST);
        GridBagConstraints gbc = LayoutUtil.getGbc();
        gbc.insets = new Insets(5, 5, 5, 5);

        JLabel lblCodigoItem = new JLabel("Cod. Item");
        pnl.add(lblCodigoItem, gbc);

        gbc.gridx = 1;
        txtCodigoItem = new JTextField();
        txtCodigoItem.setEditable(false);
        txtCodigoItem.setColumns(5);
        pnl.add(txtCodigoItem, gbc);

        gbc.gridx = 2;
        JLabel lblAlterno = new JLabel("Cod. Alterno");
        pnl.add(lblAlterno, gbc);

        gbc.gridx = 3;
        txtAlterno = new JTextField();
        txtAlterno.addFocusListener(this);
        txtAlterno.setDocument(new UpperCaseNumberDocument(30));
        txtAlterno.addKeyListener(this);
        txtAlterno.setColumns(5);
        pnl.add(txtAlterno, gbc);

        gbc.gridx = 0;
        gbc.gridy = 1;
        JLabel lblFamilia = new JLabel("Familia");
        pnl.add(lblFamilia, gbc);

        gbc.gridx = 1;
        cboFamilia = new JComboBox();
        cboFamilia.addItemListener(this);
        pnl.add(cboFamilia, gbc);

        gbc.gridx = 2;
        JLabel lblSubfamilia = new JLabel("SubFamilia");
        pnl.add(lblSubfamilia, gbc);

        gbc.gridx = 3;
        gbc.gridwidth = 2;
        cboSubFamilia = new JComboBox();
        cboSubFamilia.setEnabled(false);
        cboSubFamilia.addItemListener(this);
        pnl.add(cboSubFamilia, gbc);
        gbc.gridwidth = 1;

        gbc.gridx = 5;
        JLabel lblCodigoBarras = new JLabel("Cod. Barras");
        pnl.add(lblCodigoBarras, gbc);

        gbc.gridx = 6;
        txtCodigoBarras = new JTextField();
        txtCodigoBarras.addKeyListener(this);
        txtCodigoBarras.addFocusListener(this);
        txtCodigoBarras.setColumns(6);
        pnl.add(txtCodigoBarras, gbc);

        gbc.gridx = 0;
        gbc.gridy = 2;
        JLabel lblMarca = new JLabel("Marca");
        pnl.add(lblMarca, gbc);

        gbc.gridx = 1;
        cbMarca = new JComboBox();
        cbMarca.addKeyListener(this);
        cbMarca.addActionListener(this);
        pnl.add(cbMarca, gbc);

        gbc.gridx = 2;
        JLabel lblTamano = new JLabel("TamaÃ±o");
        pnl.add(lblTamano, gbc);

        gbc.gridx = 3;
        gbc.gridwidth = 2;
        cbTamano = new JComboBox();
        cbTamano.addKeyListener(this);
        pnl.add(cbTamano, gbc);
        gbc.gridwidth = 1;

        gbc.gridx = 0;
        gbc.gridy = 3;
        JLabel lblDescripcion = new JLabel("DescripciÃ³n");
        pnl.add(lblDescripcion, gbc);

        gbc.gridx = 1;
        gbc.gridwidth = 4;
        gbc.fill = GridBagConstraints.HORIZONTAL;
        txtDescripcion = new JTextField();
        txtDescripcion.addKeyListener(this);
        txtDescripcion.addFocusListener(this);
        txtDescripcion.setDocument(new UpperCaseNumberDocument(255));
        pnl.add(txtDescripcion, gbc);
        gbc.gridwidth = 1;
        gbc.fill = GridBagConstraints.NONE;

        gbc.gridx = 0;
        gbc.gridy = 4;
        JLabel lblTipo = new JLabel("Tipo");
        pnl.add(lblTipo, gbc);

        gbc.gridx = 1;
        cboTipo = new JComboBox();
        cboTipo.addItem("Producto");
        cboTipo.addItem("Concepto");
        cboTipo.addItem("Transporte");
        bgPerecible = new ButtonGroup();
        rbPerecible = new JRadioButton("Perecible");
        rbNoPerecible = new JRadioButton("No perecible");
        txtCantidadDiasPerecible = new JTextField();
        txtCantidadDiasPerecible.setColumns(3);
        txtCantidadDiasPerecible.setDocument(new IntegerDocument(10));
        txtCantidadDiasPerecible.setText("0");
        JLabel lbldias = new JLabel("dias |");
        bgPerecible.add(rbPerecible);
        bgPerecible.add(rbNoPerecible);
        pnlPerecible.add(rbPerecible);
        pnlPerecible.add(txtCantidadDiasPerecible);
        pnlPerecible.add(lbldias);
        pnlPerecible.add(rbNoPerecible);
        pnlProducto.add(cboTipo);
        pnlProducto.add(pnlPerecible);
        rbNoPerecible.setSelected(true);
        pnl.add(pnlProducto, gbc);

        gbc.gridx = 3;
        chkFlagKardex = new JCheckBox("Kardex");
        chkFlagKardex.setSelected(true);
        chkFlagKardex.setEnabled(false);
        pnl.add(chkFlagKardex, gbc);

        gbc.gridx = 4;
        chkServicioTransporte = new JCheckBox("Serv.Transporte");
        chkServicioTransporte.setSelected(false);
        chkServicioTransporte.setEnabled(false);
        pnl.add(chkServicioTransporte, gbc);
        cboTipo.addActionListener(this);
        gbc.gridx = 5;
        chkEstado = new JCheckBox("Item Activo");
        chkEstado.setSelected(true);
        pnl.add(chkEstado, gbc);
        cboTipo.addActionListener(this);

        gbc.gridx = 0;
        gbc.gridy = 5;
        JLabel lblSunat = new JLabel("Codigo Sunat");
        pnl.add(lblSunat, gbc);

        gbc.gridx = 1;
        gbc.gridwidth = 6;
        cboSunat = new JComboBox();
        pnl.add(cboSunat, gbc);
        gbc.gridwidth = 1;

        gbc.gridx = 0;
        gbc.gridy = 6;
        JLabel lblColor = new JLabel("Grupo");
        if (Constans.IS_ITEM_BY_CLIENTE_COLOR) {
            lblColor.setText("Cliente");
        }
        pnl.add(lblColor, gbc);

        gbc.gridx = 1;
        gbc.gridwidth = 5;
        cboColor = new JComboBox();
        cboColor.addKeyListener(this);
        pnl.add(cboColor, gbc);
        gbc.gridwidth = 1;

        return pnlGral;
    }

    protected JPanel getPnlUm() {
        Border border = BorderFactory.createTitledBorder(null, null, TitledBorder.LEFT, TitledBorder.DEFAULT_POSITION, new Font("Verdana", 1, 11), Color.BLACK);
        JPanel pnlGral = new JPanel();
        pnlGral.setBorder(border);
        pnlGral.setLayout(new BorderLayout());
        JPanel pnl = new JPanel();
        pnl.setLayout(new GridBagLayout());
        pnlGral.add(pnl, BorderLayout.WEST);
        GridBagConstraints gbc = LayoutUtil.getGbc();
        gbc.insets = new Insets(5, 5, 5, 5);

        JLabel lblUnidadStock = new JLabel("U. Stock");
        pnl.add(lblUnidadStock, gbc);

        gbc.gridx = 1;
        cboUnidadStock = new JComboBox();
        cboUnidadStock.addActionListener(this);
        cboUnidadStock.addKeyListener(this);
        pnl.add(cboUnidadStock, gbc);

        gbc.gridy = 1;
        gbc.gridx = 0;
        JLabel lblUnidadCompra = new JLabel("U. Compra");
        pnl.add(lblUnidadCompra, gbc);

        gbc.gridx = 1;
        cboUnidadCompra = new JComboBox();
        cboUnidadCompra.setEnabled(false);
        pnl.add(cboUnidadCompra, gbc);

        gbc.gridy = 2;
        gbc.gridx = 0;
        JLabel lblUnidadVenta = new JLabel("U. Venta");
        pnl.add(lblUnidadVenta, gbc);

        gbc.gridx = 1;
        cboUnidadVenta = new JComboBox();
        cboUnidadVenta.setEnabled(false);
        pnl.add(cboUnidadVenta, gbc);

        JLabel lblComposicion = new JLabel("Composicion");
        txtComposicion = new JTextField();
        txtComposicion.addActionListener(this);
        txtComposicion.addKeyListener(this);
        txtComposicion.setDocument(new UpperCaseNumberDocument(255));
        JLabel lblFuncion = new JLabel("Funcion");
        txtFuncion = new JTextField();
        txtFuncion.addActionListener(this);
        txtFuncion.addKeyListener(this);
        txtFuncion.setDocument(new UpperCaseNumberDocument(255));
        if (Constans.ISBOTICA || Constans.IS_BOTICA_SIN_LOTE) {
            gbc.fill = GridBagConstraints.HORIZONTAL;
            gbc.gridx = 0;
            gbc.gridy = 4;
            pnl.add(lblComposicion, gbc);
            gbc.gridx = 1;
            pnl.add(txtComposicion, gbc);
            gbc.gridx = 0;
            gbc.gridy = 5;
            pnl.add(lblFuncion, gbc);
            gbc.gridx = 1;
            pnl.add(txtFuncion, gbc);
        } else if (Constans.IS_ITEM_BY_CLIENTE) {
            gbc.fill = GridBagConstraints.HORIZONTAL;
            gbc.gridx = 0;
            gbc.gridy = 4;
            lblFuncion.setText("Cod. Cliente");
            pnl.add(lblFuncion, gbc);
            gbc.gridx = 1;
            pnl.add(txtFuncion, gbc);
        }
        return pnlGral;

    }

    protected JPanel getPnlOtros() {
        JPanel pnlGral = new JPanel();
        Border border = BorderFactory.createTitledBorder(null, null, TitledBorder.LEFT, TitledBorder.DEFAULT_POSITION, new Font("Verdana", 1, 11), Color.BLACK);
        pnlGral.setBorder(border);
        pnlGral.setLayout(new BorderLayout());
        JPanel pnl = new JPanel();
        pnl.setLayout(new GridBagLayout());
        pnlGral.add(pnl, BorderLayout.WEST);
        GridBagConstraints gbc = LayoutUtil.getGbc();
        gbc.insets = new Insets(5, 5, 5, 5);

        JLabel lblSujetoPercepcion = new JLabel("Suj. PercepciÃ³n");
        pnl.add(lblSujetoPercepcion, gbc);

        gbc.gridx = 1;
        chkSujetoPercepcion = new CCheckBox("");
        chkSujetoPercepcion.setEnabled(false);
        chkSujetoPercepcion.addKeyListener(this);
        pnl.add(chkSujetoPercepcion, gbc);
        gbc.gridx = 0;
        gbc.gridy = 1;
        JLabel lblFlagAfectoIgv = new JLabel("Afecto a IGV");
        pnl.add(lblFlagAfectoIgv, gbc);

        gbc.gridx = 1;
        cboTipoOperIgv = new JComboBox();
        cboTipoOperIgv.addItem("AFECTO");
        cboTipoOperIgv.addItem("INAFECTO");
        cboTipoOperIgv.addItem("EXONERADO");
        chkFlagAfectoIgv = new CCheckBox("");
        chkFlagAfectoIgv.addKeyListener(this);
        pnl.add(cboTipoOperIgv, gbc);

        gbc.gridx = 0;
        gbc.gridy = 2;
        JLabel lblPorIGV = new JLabel("Porc. IGV");
        pnl.add(lblPorIGV, gbc);

        gbc.gridx = 1;
        gbc.fill = GridBagConstraints.BOTH;
        txtPorIGV = new JTextField();
        txtPorIGV.setHorizontalAlignment(4);
        txtPorIGV.setDocument(new DoubleDocument());
        txtPorIGV.addFocusListener(this);
        txtPorIGV.addKeyListener(this);
        txtPorIGV.setColumns(3);
        pnl.add(txtPorIGV, gbc);

        gbc.gridx = 0;
        gbc.gridy = 3;
        JLabel lblPorISC = new JLabel("Porc. Perc");
        pnl.add(lblPorISC, gbc);

        gbc.gridx = 1;
        gbc.fill = GridBagConstraints.BOTH;
        txtPorISC = new JTextField();
        txtPorISC.setEnabled(false);
        txtPorISC.setHorizontalAlignment(4);
        txtPorISC.addKeyListener(this);
        txtPorISC.setDocument(new DoubleDocument());
        txtPorISC.addFocusListener(this);
        txtPorISC.setColumns(3);
        pnl.add(txtPorISC, gbc);

        gbc.gridx = 0;
        gbc.gridy = 4;
        gbc.fill = GridBagConstraints.BOTH;
        JLabel lblStockMin = new JLabel("Stock Min");
        pnl.add(lblStockMin, gbc);

        gbc.gridx = 1;
        txtStockMin = new JTextField();
        txtStockMin.setEnabled(true);
        txtStockMin.setHorizontalAlignment(4);
        txtStockMin.addKeyListener(this);
        txtStockMin.setDocument(new DoubleDocument());
        txtStockMin.addFocusListener(this);
        txtStockMin.setText("0");
        txtStockMin.setColumns(3);
        pnl.add(txtStockMin, gbc);
        return pnlGral;
    }

    protected JPanel getPnlCuentas() {
        Border border = BorderFactory.createTitledBorder(null, null, TitledBorder.LEFT, TitledBorder.DEFAULT_POSITION, new Font("Verdana", 1, 11), Color.BLACK);

        JPanel pnlCta = new JPanel();
        pnlCta.setLayout(new GridBagLayout());
        pnlCta.setBackground(new Color(245, 245, 245));
        pnlCta.setBorder(border);
        GridBagConstraints gbc = new GridBagConstraints();

        JLabel lblCuentaCompra = new JLabel("Cta Compras");
        gbc.gridx = 0;
        gbc.gridy = 0;
        gbc.fill = GridBagConstraints.BOTH;
        gbc.insets = new Insets(5, 5, 5, 5);
        pnlCta.add(lblCuentaCompra, gbc);

        txtCuentaCompra = new JTextField();
        txtCuentaCompra.setEnabled(false);
        txtCuentaCompra.setColumns(5);
        gbc.gridx = 1;
        gbc.gridy = 0;
        gbc.fill = GridBagConstraints.BOTH;
        gbc.insets = new Insets(5, 5, 5, 5);
        pnlCta.add(txtCuentaCompra, gbc);

        JLabel lblCuentaTransito = new JLabel("Cta Transito");
        gbc.gridx = 2;
        gbc.gridy = 0;
        gbc.fill = GridBagConstraints.BOTH;
        gbc.insets = new Insets(5, 5, 5, 5);
        pnlCta.add(lblCuentaTransito, gbc);

        txtCuentaTransito = new JTextField();
        txtCuentaTransito.setColumns(5);
        txtCuentaTransito.setEnabled(false);
        gbc.gridx = 3;
        gbc.gridy = 0;
        gbc.fill = GridBagConstraints.BOTH;
        gbc.insets = new Insets(5, 5, 5, 5);
        pnlCta.add(txtCuentaTransito, gbc);

        JLabel lblCuentaVentaSol = new JLabel("Cta Vta Sol");
        gbc.gridx = 0;
        gbc.gridy = 1;
        gbc.fill = GridBagConstraints.BOTH;
        gbc.insets = new Insets(5, 5, 5, 5);
        pnlCta.add(lblCuentaVentaSol, gbc);

        txtCuentaVentaSol = new JTextField();
        txtCuentaVentaSol.setEnabled(false);
        txtCuentaVentaSol.setColumns(5);
        gbc.gridx = 1;
        gbc.gridy = 1;
        gbc.fill = GridBagConstraints.BOTH;
        gbc.insets = new Insets(5, 5, 5, 5);
        pnlCta.add(txtCuentaVentaSol, gbc);

        JLabel lblCuentaVentaDol = new JLabel("Cta Vta Dol");
        gbc.gridx = 2;
        gbc.gridy = 1;
        gbc.fill = GridBagConstraints.BOTH;
        gbc.insets = new Insets(5, 5, 5, 5);
        pnlCta.add(lblCuentaVentaDol, gbc);

        txtCuentaVentaDol = new JTextField();
        txtCuentaVentaDol.setColumns(5);
        txtCuentaVentaDol.setEnabled(false);
        gbc.gridx = 3;
        gbc.gridy = 1;
        gbc.fill = GridBagConstraints.BOTH;
        gbc.insets = new Insets(5, 5, 5, 5);
        pnlCta.add(txtCuentaVentaDol, gbc);

        pnlCta.setBounds(100, 325, 635, 80);
        return pnlCta;
    }

    @Override
    public void loadCombo() {
    }

    protected void loadClaseSunat() throws Exception {
    }

    protected void loadSubFamilia() {
    }

    protected void loadMarca() {
    }

    protected void loadPromocion() {
    }

    protected void loadTamano() {
    }

    protected void loadUnidadMedida() {
    }

    protected String getIdUm() {
        if (cboUnidadCompra.getSelectedIndex() > 0) {
            return xunidadMedi.get(cboUnidadCompra.getSelectedIndex() - 1).getIdUm();
        }
        return "";
    }

    protected String getIdFamilia() {
        return null;
    }

    protected String getIdSubFamilia() {
        return null;
    }

    protected String getIdMarca() {
        if (cbMarca.getSelectedIndex() > 0) {
            return xmarca.get(cbMarca.getSelectedIndex() - 1).getIdMarca();
        }
        return "";
    }

    protected String getIdTamano() {
        if (cbTamano.getSelectedIndex() > 0) {
            return xtamano.get(cbTamano.getSelectedIndex() - 1).getIdTamano();
        }
        return "";
    }

    protected BeanItem getBeanItem() throws Exception {
        return null;
    }

    protected BeanPrecioItem getPrecioItem() {
        if (!(Constans.IS_ITEM_BY_CLIENTE || Constans.IS_ITEM_RESUMEN_PRECIO)) {
            return null;
        }
        BeanPrecioItem precioItem = new BeanPrecioItem();
        precioItem.setIdLocalidad(usuario.getCodlocalidad());
        precioItem.setPrecio1(Util.getNumberBigDecimal(txtPrecio1.getText().trim()));
        precioItem.setPrecio2(Util.getNumberBigDecimal(txtPrecio2.getText().trim()));
        precioItem.setPrecio3(Util.getNumberBigDecimal(txtPrecio3.getText().trim()));
        precioItem.setPrecio4(Util.getNumberBigDecimal(txtPrecio4.getText().trim()));
        precioItem.setPrecio5(Util.getNumberBigDecimal(txtPrecio5.getText().trim()));
        precioItem.setPrecio6(Util.getNumberBigDecimal(txtPrecio6.getText().trim()));
        return precioItem;
    }

    protected String getIdMoneda() {
        ObjectItem itemMoneda = (ObjectItem) cboMoneda.getSelectedItem();
        if (itemMoneda != null && itemMoneda.getObjItem() != null) {
            return itemMoneda.getObjItem().toString().trim();
        }
        return "";
    }

    protected String getXmlPromocion() {
        String xmlPromocion;
        xmlPromocion = "<?xml version=\"1.0\" ?> ";
        xmlPromocion += "<PROMOCIONES>";
        for (int i = 0; i < modeltableItemPromocion.getRowCount(); i++) {
            ItemPromocion beanItemPromocion = modeltableItemPromocion.getItemPromocion(i);
            if (!beanItemPromocion.getOperacion().equals("")) {
                xmlPromocion += "<PROMOCION>";
                xmlPromocion += "<ID_PROMOCION>" + beanItemPromocion.getBeanPromocion().getIdPromocion() + "</ID_PROMOCION>";
                xmlPromocion += "<ESTADO>" + beanItemPromocion.getEstado() + "</ESTADO>";
                xmlPromocion += "<OPERACION>" + beanItemPromocion.getOperacion() + "</OPERACION>";
                xmlPromocion += "</PROMOCION>";
            }
        }
        xmlPromocion += "</PROMOCIONES>";
        logger.info("xml_Promocion: " + xmlPromocion);
        return xmlPromocion;
    }

    protected String getXmlPercepcion(SimpleDateFormat fe) {
        String xmlPercepcion;
        xmlPercepcion = "<?xml version=\"1.0\" ?> ";
        xmlPercepcion += "<PERCEPCIONES>";
        for (int i = 0; i < modeltableItemPercepcion.getRowCount(); i++) {
            ItemPercepcion beanItemPercepcion = modeltableItemPercepcion.getItemPercepcion(i);
            if (!beanItemPercepcion.getOperacion().equals("")) {
                xmlPercepcion += "<PERCEPCION>";
                xmlPercepcion += "<ID_ITEM_PERCEPCION>" + beanItemPercepcion.getIdItemPercepcion() + "</ID_ITEM_PERCEPCION>";
                xmlPercepcion += "<F_INICIO>" + fe.format(beanItemPercepcion.getFechaIni()) + "</F_INICIO>";
                xmlPercepcion += "<F_FIN>" + ((beanItemPercepcion.getFechaFin() == null) ? beanItemPercepcion.getFechaFin() : fe.format(beanItemPercepcion.getFechaFin())) + "</F_FIN>";
                xmlPercepcion += "<ESTADO>" + beanItemPercepcion.getEstado() + "</ESTADO>";
                xmlPercepcion += "<OPERACION>" + beanItemPercepcion.getOperacion() + "</OPERACION>";
                xmlPercepcion += "</PERCEPCION>";
            }
        }
        xmlPercepcion += "</PERCEPCIONES>";
        logger.info("xml_Percepcion: " + xmlPercepcion);
        return xmlPercepcion;
    }

    protected String getXmlCuenta(SimpleDateFormat fe) {
        String xmlCuenta;
        xmlCuenta = "<?xml version=\"1.0\" ?> ";
        xmlCuenta += "<CUENTAS>";
        for (int i = 0; i < modeltableConfigItemCuenta.getRowCount(); i++) {
            ConfigItemCuenta beanConfigItemCuenta = modeltableConfigItemCuenta.getConfigItemCuenta(i);
            if (!beanConfigItemCuenta.getOperacion().equals("")) {
                xmlCuenta += "<CUENTA>";
                xmlCuenta += "<ID_CUENTA_ITEM>" + beanConfigItemCuenta.getIdCuentaItem() + "</ID_CUENTA_ITEM>";
                xmlCuenta += "<F_INICIO>" + fe.format(beanConfigItemCuenta.getFechaIni()) + "</F_INICIO>";
                xmlCuenta += "<F_FIN>" + ((beanConfigItemCuenta.getFechaFin() == null) ? beanConfigItemCuenta.getFechaFin() : fe.format(beanConfigItemCuenta.getFechaFin())) + "</F_FIN>";
                xmlCuenta += "<ID_CLASE_OPERACION>" + beanConfigItemCuenta.getIdClaseOperacion() + "</ID_CLASE_OPERACION>";
                xmlCuenta += "<ID_CUENTA>" + beanConfigItemCuenta.getCuenta() + "</ID_CUENTA>";
                xmlCuenta += "<ID_MONEDA>" + beanConfigItemCuenta.getIdMoneda() + "</ID_MONEDA>";
                xmlCuenta += "<TRANSITO>" + beanConfigItemCuenta.getFlagTransito() + "</TRANSITO>";
                xmlCuenta += "<ESTADO>" + beanConfigItemCuenta.getEstado() + "</ESTADO>";
                xmlCuenta += "<OPERACION>" + beanConfigItemCuenta.getOperacion() + "</OPERACION>";
                xmlCuenta += "</CUENTA>";
            }
        }
        xmlCuenta += "</CUENTAS>";
        logger.info("xml_Cuenta: " + xmlCuenta);
        return xmlCuenta;
    }

    protected String getXmlAlmacen(SimpleDateFormat fe) {
        String xmlAlmacen;
        xmlAlmacen = "<?xml version=\"1.0\" ?> ";
        xmlAlmacen += "<ALMACENES>";
        for (int i = 0; i < modeltableConfigItemAlmacen.getRowCount(); i++) {
            ConfigItemAlmacen beanConfigItemAlmacen = modeltableConfigItemAlmacen.getConfigItemAlmacen(i);
            if (!beanConfigItemAlmacen.getOperacion().equals("")) {
                xmlAlmacen += "<ALMACEN>";
                xmlAlmacen += "<ID_CONFIG>" + beanConfigItemAlmacen.getIdConfig() + "</ID_CONFIG>";
                xmlAlmacen += "<ID_ALMACEN>" + beanConfigItemAlmacen.getIdAlmacen() + "</ID_ALMACEN>";
                xmlAlmacen += "<PROCESO>" + beanConfigItemAlmacen.getProceso() + "</PROCESO>";
                xmlAlmacen += "<F_INICIO>" + fe.format(beanConfigItemAlmacen.getFechaIni()) + "</F_INICIO>";
                xmlAlmacen += "<F_FIN>" + ((beanConfigItemAlmacen.getFechaFin() == null) ? beanConfigItemAlmacen.getFechaFin() : fe.format(beanConfigItemAlmacen.getFechaFin())) + "</F_FIN>";
                xmlAlmacen += "<ESTADO>" + beanConfigItemAlmacen.getEstado() + "</ESTADO>";
                xmlAlmacen += "<OPERACION>" + beanConfigItemAlmacen.getOperacion() + "</OPERACION>";
                xmlAlmacen += "</ALMACEN>";
            }
        }
        xmlAlmacen += "</ALMACENES>";
        logger.info("xml_Almacen: " + xmlAlmacen);
        return xmlAlmacen;
    }

    protected String getXmlDescuento(SimpleDateFormat fe) {
        String xmlDescuento;
        xmlDescuento = "<?xml version=\"1.0\" ?> ";
        xmlDescuento += "<DESCUENTOS>";
        for (int i = 0; i < modeltableConfigItemDscto.getRowCount(); i++) {
            ConfigItemDscto beanConfigItemDscto = modeltableConfigItemDscto.getConfigItemDscto(i);
            if (!beanConfigItemDscto.getOperacion().equals("")) {
                xmlDescuento += "<DESCUENTO>";
                xmlDescuento += "<ID_DESCUENTO>" + beanConfigItemDscto.getIdConfigItemDscto() + "</ID_DESCUENTO>";
                xmlDescuento += "<F_INICIO>" + fe.format(beanConfigItemDscto.getFechaInicio()) + "</F_INICIO>";
                xmlDescuento += "<F_FIN>" + ((beanConfigItemDscto.getFechaFin() == null) ? beanConfigItemDscto.getFechaFin() : fe.format(beanConfigItemDscto.getFechaFin())) + "</F_FIN>";
                xmlDescuento += "<ESTADO>" + beanConfigItemDscto.getEstado() + "</ESTADO>";
                xmlDescuento += "<PORC>" + beanConfigItemDscto.getPorcentajeDscto().toString().replace(".", ",") + "</PORC>";
                xmlDescuento += "<OPERACION>" + beanConfigItemDscto.getOperacion() + "</OPERACION>";
                xmlDescuento += "</DESCUENTO>";
            }
        }
        xmlDescuento += "</DESCUENTOS>";
        logger.info("xml_Descuento: " + xmlDescuento);
        return xmlDescuento;
    }

    protected String getXmlConfig(SimpleDateFormat fe) {
        String xmlConfig;
        xmlConfig = "<?xml version=\"1.0\" ?> ";
        xmlConfig += "<CONFIGS>";
        for (int i = 0; i < modeltableConfigItem.getRowCount(); i++) {
            ConfigItem beanConfigItem = modeltableConfigItem.getConfigItem(i);
            if (!beanConfigItem.getOperacion().equals("")) {
                xmlConfig += "<CONFIG>";
                xmlConfig += "<ID_CONFIG_ITEM>" + beanConfigItem.getIdConfigItem() + "</ID_CONFIG_ITEM>";
                xmlConfig += "<ID_CLASE_OPERACION>" + beanConfigItem.getIdClaseOperacion() + "</ID_CLASE_OPERACION>";
                xmlConfig += "<F_INICIO>" + fe.format(beanConfigItem.getFechaIni()) + "</F_INICIO>";
                xmlConfig += "<F_FIN>" + ((beanConfigItem.getFechaFin() == null) ? beanConfigItem.getFechaFin() : fe.format(beanConfigItem.getFechaFin())) + "</F_FIN>";
                xmlConfig += "<ESTADO>" + beanConfigItem.getEstado() + "</ESTADO>";
                xmlConfig += "<OPERACION>" + beanConfigItem.getOperacion() + "</OPERACION>";
                xmlConfig += "</CONFIG>";
            }
        }
        xmlConfig += "</CONFIGS>";
        logger.info("xml_Config: " + xmlConfig);
        return xmlConfig;
    }

    protected String getXmlCaracteristica(SimpleDateFormat fe) {
        String xmlCaracteristica;
        xmlCaracteristica = "<?xml version=\"1.0\" ?> ";
        xmlCaracteristica += "<CARACTERISTICAS>";
        for (int i = 0; i < modeltableCaracteristica.getRowCount(); i++) {
            CaracteristicaItemDetalle beanCaracteristica = modeltableCaracteristica.getCaracteristicaItemDetalle(i);
            if (!beanCaracteristica.getOperacion().equals("")) {
                xmlCaracteristica += "<CARACTERISTICA>";
                xmlCaracteristica += "<ID_ITEM_CARACT>" + beanCaracteristica.getIdItemCaract() + "</ID_ITEM_CARACT>";
                xmlCaracteristica += "<ID_CARACTERISTICA>" + beanCaracteristica.getBeanCaracteristicaItem().getId_caracteristica() + "</ID_CARACTERISTICA>";
                xmlCaracteristica += "<F_INICIO>" + fe.format(beanCaracteristica.getFechaInicio()) + "</F_INICIO>";
                xmlCaracteristica += "<F_FIN>" + ((beanCaracteristica.getFechaFin() == null) ? beanCaracteristica.getFechaFin() : fe.format(beanCaracteristica.getFechaFin())) + "</F_FIN>";
                xmlCaracteristica += "<VALOR>" + beanCaracteristica.getValor().toString().replace(".", ",") + "</VALOR>";
                xmlCaracteristica += "<ESTADO>" + beanCaracteristica.getEstado() + "</ESTADO>";
                xmlCaracteristica += "<OPERACION>" + beanCaracteristica.getOperacion() + "</OPERACION>";
                xmlCaracteristica += "</CARACTERISTICA>";
            }
        }
        xmlCaracteristica += "</CARACTERISTICAS>";
        logger.info("xml_Caracteristica: " + xmlCaracteristica);
        return xmlCaracteristica;
    }

    protected String getXmlConversion() {
        String xmlConversion;
        xmlConversion = "<?xml version=\"1.0\" ?> ";
        xmlConversion += "<CONVERSIONES>";
        for (int i = 0; i < modeltable.getRowCount(); i++) {
            ItemItem beanItemItem = modeltable.getItem(i);
            if (!beanItemItem.getOperacion().equals("")) {
                xmlConversion += "<CONVERSION>";
                xmlConversion += "<ID_ITEM_ITEM>" + beanItemItem.getIdItemItem() + "</ID_ITEM_ITEM>";
                xmlConversion += "<ID_ITEM_DESTINO>" + beanItemItem.getBeanItemDestino().getIdItem() + "</ID_ITEM_DESTINO>";
                xmlConversion += "<ESTADO>" + beanItemItem.getEstado() + "</ESTADO>";
                xmlConversion += "<OPERACION>" + beanItemItem.getOperacion() + "</OPERACION>";
                xmlConversion += "<VALOR_DESTINO>" + beanItemItem.getValorDestino().toString().replace(".", ",") + "</VALOR_DESTINO>";
                xmlConversion += "<VALOR_ORIGEN>" + beanItemItem.getValorOrigen().toString().replace(".", ",") + "</VALOR_ORIGEN>";
                xmlConversion += "<VALOR_PAQUETE>" + beanItemItem.getValorPaquete().toString().replace(".", ",") + "</VALOR_PAQUETE>";
                xmlConversion += "</CONVERSION>";
            }
        }
        xmlConversion += "</CONVERSIONES>";
        logger.info("xml_Conversion: " + xmlConversion);
        return xmlConversion;
    }

    protected void cargarMarca(String idMarca) throws Exception {
    }

    protected void cargarTamano(String idTamano) throws Exception {
    }

    protected void cargarMoneda(String idMoneda) {
    }

    protected void cargarUnidadMedida(String idUm) throws Exception {
    }

    protected void cargarConversion() throws Exception {
    }

    @Override
    public void newRegister() {
    }

    @Override
    public String executeInsert() {
        return null;
    }

    @Override
    public void focusGained(FocusEvent e) {
        if (e.getComponent() == txtAlterno) {
            txtAlterno.selectAll();
        }

        if (e.getComponent() == txtCodigoBarras) {
            txtCodigoBarras.selectAll();
        }

        if (e.getComponent() == txtDescripcion) {
            txtDescripcion.selectAll();
        }

        if (e.getComponent() == txtPorIGV) {
            txtPorIGV.selectAll();
        }

        if (e.getComponent() == txtPorISC) {
            txtPorISC.selectAll();
        }
    }

    @Override
    public void keyPressed(KeyEvent e) {
        if (e.getKeyCode() == KeyEvent.VK_ESCAPE) {
            dispose();
        }

        if (e.getKeyChar() == '\n') {

            if (e.getSource() == cboFamilia) {
                if (cboSubFamilia.isEnabled()) {
                    cboSubFamilia.requestFocus();
                } else {
                    txtCodigoBarras.requestFocus();
                }
            }

            if (e.getSource() == cboSubFamilia) {
                txtCodigoBarras.requestFocus();
            }

            if (e.getSource() == txtCodigoBarras) {
                cbMarca.requestFocus();
            }

            if (e.getSource() == cbMarca) {
                cboColor.requestFocus();
            }

            if (e.getSource() == cboColor) {
                cbTamano.requestFocus();
            }

            if (e.getSource() == cbTamano) {
                txtDescripcion.requestFocus();
            }

            if (e.getSource() == txtDescripcion) {
                cboUnidadStock.requestFocus();
            }

            if (e.getSource() == cboUnidadStock) {
                cboUnidadCompra.requestFocus();
            }

            if (e.getSource() == cboUnidadCompra) {
                cboUnidadVenta.requestFocus();
            }

            if (e.getSource() == txtPorIGV) {
                txtPorISC.requestFocus();
            }

            if (e.getSource() == chkSujetoPercepcion) {
                chkFlagAfectoIgv.requestFocus();
            }
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

    protected void loadPrecio(String idItem) {
    }

    protected void setTitlePersonal() {
        String title = "";
        switch (this.mode) {
            case 1:
                title = "Agregar";
                break;
            case 2:
                title = "Modificar";
                break;
            case 3:
                title = "Eliminar";
                break;
            case 4:
                title = "Detalle de";
                break;
            case 6:
                title = "Anular";
                break;
        }
        this.setTitle(title + " Item :: " + txtCodigoItem.getText().trim() + " - " + txtDescripcion.getText().trim());
    }

    protected void loadIgv() {
    }

    @Override
    public String executeUpdate() {
        return null;
    }

    @Override
    public boolean executeDelete() {
        return false;
    }

    protected void agregarItemItem() {
    }

    protected boolean isAgregarItem() {
        if (Constans.ISBOTICA || Constans.IS_ITEM_DESTINO_MULTIPLE || Constans.IS_BOTICA_SIN_LOTE) {
            return true;
        }
        for (int i = 0; i < modeltable.getRowCount(); i++) {
            if (modeltable.getItem(i).getEstado().equals("A")) {
                return false;
            }
        }
        return true;
    }

    @Override
    public void actionPerformed(ActionEvent e) {

        if (btnQuitarItem == e.getSource()) {
            controlEliminate();
        }

        if (btnAgregarItem == e.getSource()) {
            this.agregarItemItem();
        }

        if (btnActivarCaracteristica == e.getSource()) {
            FormItemCaracteristica frmItemCaracteristica = new FormItemCaracteristica(this, path, btnActivarCaracteristica);
            frmItemCaracteristica = null;
        }
        if (btnDesactivarCaracteristica == e.getSource()) {
            desactivarCaracteristica();
        }
        if (btnActivarConfigItem == e.getSource()) {
            FormItemConfig frmItemConfig = new FormItemConfig(this, path, btnActivarConfigItem);
            frmItemConfig = null;
        }
        if (btnDesactivarConfigItem == e.getSource()) {
            desactivarConfigItem();
        }
        if (btnActivarItemPercepcion == e.getSource()) {
            activarPercepcion();
        }
        if (btnDesactivarItemPercepcion == e.getSource()) {
            desactivarPercepcion();
        }
        if (btnActivarDscto == e.getSource()) {
            Boolean sw = true;
            if (modeltableConfigItemDscto.getRowCount() == 0) {
                sw = true;
            } else {
                for (int i = 0; i < modeltableConfigItemDscto.getRowCount(); i++) {
                    if (modeltableConfigItemDscto.getConfigItemDscto(i).getEstado().equals("A")) {
                        JOptionPane.showMessageDialog(this, "No se Puede Agregar mas de un descuento");
                        sw = false;
                    }
                }
            }
            if (sw) {
                FormItemConfigDscto frmItemConfigDscto = new FormItemConfigDscto(this, path, btnActivarDscto);
                frmItemConfigDscto = null;
            }
        }
        if (btnDesactivarDscto == e.getSource()) {
            desactivarConfigItemDscto();
        }
        if (btnActivarAlmacen == e.getSource()) {
            FormItemAlmacen frmItemAlmacen = new FormItemAlmacen(this, path, btnActivarAlmacen, usuario);
            frmItemAlmacen = null;
        }
        if (btnDesactivarAlmacen == e.getSource()) {
            desactivarAlmacen();
        }
        if (btnActivarCuenta == e.getSource()) {
            FormItemConfigCuenta frmItemConfigCuenta = new FormItemConfigCuenta(this, path, btnActivarCuenta);
            frmItemConfigCuenta = null;
        }
        if (btnDesactivarCuenta == e.getSource()) {
            desactivarConfigItemCuenta();
        }

        if (e.getSource() == cboTipo) {
            rbNoPerecible.setSelected(true);
            txtCantidadDiasPerecible.setText("0");
            if (cboTipo.getSelectedIndex() == 0) {
                chkFlagKardex.setSelected(true);
                chkServicioTransporte.setSelected(false);
                pnlPerecible.setVisible(true);
            } else if (cboTipo.getSelectedIndex() == 1) {
                chkFlagKardex.setSelected(false);
                chkServicioTransporte.setSelected(false);
                pnlPerecible.setVisible(false);
            } else {
                chkFlagKardex.setSelected(false);
                chkServicioTransporte.setSelected(true);
                pnlPerecible.setVisible(false);
            }
        }

        if (e.getSource() == cboUnidadStock) {
            cboUnidadCompra.setSelectedIndex(cboUnidadStock.getSelectedIndex());
            cboUnidadVenta.setSelectedIndex(cboUnidadStock.getSelectedIndex());
        }

        if (e.getSource().equals(btnAgregarProm)) {
            agregarPromocion();
        }
        if (e.getSource().equals(btnActivarItemPromocion)) {
            activarPromocion();
        }
        if (e.getSource().equals(btnDesactivarItemPromocion)) {
            desactivarPromocion();
        }
    }

    protected void agregarPromocion() {
    }

    protected void activarPromocion() {
    }

    protected void desactivarPromocion() {
    }

    protected void desactivarCaracteristica() {
    }

    protected void desactivarAlmacen() {
    }

    protected void activarPercepcion() {
    }

    protected void desactivarPercepcion() {
    }

    protected void desactivarConfigItem() {
    }

    protected void desactivarConfigItemCuenta() {
    }

    protected void desactivarConfigItemDscto() {
    }

    @Override
    public void setRegisterEnabled(boolean e) {
    }

    @Override
    public void setRegisterEditable(boolean e) {
    }

    @Override
    public void focusLost(FocusEvent e) {
        if (e.getSource() == txtPorIGV && txtPorIGV.getText().trim().length() == 0) {
            txtPorIGV.setText("0.0");
        }

        if (e.getSource() == txtPorISC && txtPorISC.getText().trim().length() == 0) {
            txtPorISC.setText("0.0");
        }
    }

    @Override
    public void keyReleased(KeyEvent e) {
        if (e.getSource() == txtDescripcion) {
            setTitlePersonal();
        }
    }

    @Override
    public void showMessagePrint(String codigo) {
    }

    @Override
    public boolean executeAnular() {
        return false;
    }

    @Override
    public void setValueSearch(Object valor, Component comp) {
    }

    protected void cargarCaracteristica(CaracteristicaItemDetalle beanCaracteristicaItemDetalle) {
    }

    protected void cargarAlmacen(ConfigItemAlmacen beanConfigItemAlmacen) {
    }

    protected void cargarConfigItem(ConfigItem beanConfigItem) {
    }

    protected void cargarItemPercepcion(ItemPercepcion beanItemPercepcion) {
    }

    protected void calcularPercepcion() {
    }

    protected void cargarConfigItemDscto(ConfigItemDscto beanConfigItemDscto) {
    }

    protected void cargarConfigItemCuenta(ConfigItemCuenta beanConfigItemCuenta) {
    }

    protected void cargarItem(BeanItem item) {
    }

    protected void controlEliminate() {
    }

    @Override
    public boolean executeSelect() {
        return false;
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

    @Override
    public boolean loadRegister(Object o) {
        return false;
    }

    @Override
    public void itemStateChanged(ItemEvent e) {
        try {
            if (e.getSource().equals(this.cboTipoOperIgv)) {
                this.loadIgv();
            }
            if (cboFamilia == e.getSource()) {
                loadSubFamilia();
            }
            if (e.getSource().equals(cboSubFamilia)) {
                this.loadClaseSunat();
            }
        } catch (Exception ex) {
            ExceptionHandler.handleException(ex, logger);
            JOptionPane.showMessageDialog(this, ex.getMessage());
        }
    }

    @Override
    public void stateChanged(ChangeEvent e) {
        if (e.getSource().equals(rbPerecible) && rbPerecible.isSelected()) {
            this.txtCantidadDiasPerecible.setEditable(true);
        } else if (e.getSource().equals(rbNoPerecible) && rbNoPerecible.isSelected()) {
            this.txtCantidadDiasPerecible.setText("0");
            this.txtCantidadDiasPerecible.setEditable(false);
        }
    }
}

