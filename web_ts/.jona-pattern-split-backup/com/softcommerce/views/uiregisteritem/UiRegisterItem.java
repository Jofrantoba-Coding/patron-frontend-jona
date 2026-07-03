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
    private List<BeanUnidadMedida> xunidadMedi;
    private JComboBox cboUnidadStock;
    private JComboBox cboUnidadCompra;
    private JComboBox cboUnidadVenta;
    private JTextField txtComposicion;
    private JTextField txtFuncion;
    private JComboBox cboFamilia;
    private JComboBox cboSubFamilia;
    private List<BeanMarca> xmarca;
    private JComboBox cbMarca;
    private JComboBox cboColor;
    private List<BeanTamano> xtamano;
    private JComboBox cbTamano;
    private JTextField txtCodigoItem;
    private JTextField txtDescripcion;
    private JTextField txtCodigoBarras;
    private JTextField txtPorIGV;
    private JTextField txtPorISC;
    private JTextField txtStockMin;
    private JTextField txtAlterno;
    private CCheckBox chkSujetoPercepcion;
    private JComboBox cboTipoOperIgv;
    private CCheckBox chkFlagAfectoIgv;
    private JButton btnAgregarItem;
    private JButton btnQuitarItem;
    private JButton btnActivarCaracteristica;
    private JButton btnDesactivarCaracteristica;
    private JButton btnActivarConfigItem;
    private JButton btnDesactivarConfigItem;
    private JButton btnActivarItemPercepcion;
    private JButton btnDesactivarItemPercepcion;
    private JButton btnActivarItemPromocion;
    private JButton btnDesactivarItemPromocion;
    private JButton btnActivarDscto;
    private JButton btnDesactivarDscto;
    private JButton btnActivarAlmacen;
    private JButton btnDesactivarAlmacen;
    private JButton btnActivarCuenta;
    private JButton btnDesactivarCuenta;
    private ItemItemTableModel modeltable;
    private CTable table;
    public CaracteristicaItemDetalleTableModel modeltableCaracteristica;
    private CTable tableCaracteristica;
    public ConfigItemTableModel modeltableConfigItem;
    private CTable tableConfigItem;
    public ItemPercepcionTableModel modeltableItemPercepcion;
    private CTable tableItemPercepcion;
    private ItemPromocionTableModel modeltableItemPromocion;
    private CTable tableItemPromocion;
    protected ConfigItemDsctoTableModel modeltableConfigItemDscto;
    private CTable tableConfigItemDscto;
    public ConfigItemAlmacenTableModel modeltableConfigItemAlmacen;
    private CTable tableConfigItemAlmacen;
    public ConfigItemCuentaTableModel modeltableConfigItemCuenta;
    private CTable tableConfigItemCuenta;
    private final Usuario usuario;
    private Gif gif;
    private String idAlterno;
    private Main frm;
    private JTabbedPane tabb;
    private JCheckBox chkFlagKardex;
    private JCheckBox chkServicioTransporte;
    private JCheckBox chkEstado;
    private JComboBox cboTipo;
    private JTextField txtCuentaCompra;
    private JTextField txtCuentaTransito;
    private JTextField txtCuentaVentaSol;
    private JTextField txtCuentaVentaDol;
    private List<Promocion> xPromocion;
    private JComboBox cboPromocion;
    private JButton btnAgregarProm;
    private JComboBox cboMoneda;
    private JTextField txtPrecio1;
    private JTextField txtPrecio2;
    private JTextField txtPrecio3;
    private JTextField txtPrecio4;
    private JTextField txtPrecio5;
    private JTextField txtPrecio6;
    private final Logger logger = Logger.getLogger(UiRegisterItem.class);
    private JComboBox cboSunat;
    private ButtonGroup bgPerecible;
    private JRadioButton rbPerecible;
    private JRadioButton rbNoPerecible;
    private JTextField txtCantidadDiasPerecible;
    private JPanel pnlProducto = new JPanel();
    private JPanel pnlPerecible = new JPanel();

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

    private void inicialize() {
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

    private void initListener() {
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

    private JToolBar getToolBarConversion() {
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

    private JToolBar getToolBarCaracteristica() {
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

    private JToolBar getToolBarConfigItem() {
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

    private JToolBar getToolBarItemPercepcion() {
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

    private JToolBar getToolBarItemPromocion() {
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

    private JToolBar getToolBarConfigItemDscto() {
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

    private JToolBar getToolBarConfigItemAlmacen() {
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

    private JToolBar getToolBarConfigItemCuenta() {
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

    private JPanel getPnlConversion() {
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

    private JPanel getPnlCaracteristica() {
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

    private JPanel getPnlConfigItem() {
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

    private JPanel getPnlItemPercepcion() {
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

    private JPanel getPnlItemPromocion() {
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

    private JPanel getPnlConfigItemDscto() {
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

    private JPanel getPnlConfigItemAlmacen() {
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

    private JPanel getPnlConfigItemCuenta() {
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

    private JPanel getPnlDatos() {
        JPanel pnlGeneral = new JPanel(new BorderLayout());
        pnlGeneral.setBackground(new Color(245, 245, 245));
        pnlGeneral.add(this.getPnlNorth(), BorderLayout.NORTH);
        pnlGeneral.add(this.getPnlCenter(), BorderLayout.CENTER);
        return pnlGeneral;
    }

    private JPanel getPnlCenter() {
        JPanel pnlGral = new JPanel();
        pnlGral.setLayout(new BorderLayout());
        pnlGral.add(this.getPnlUm(), BorderLayout.WEST);
        if (Constans.IS_ITEM_BY_CLIENTE || Constans.IS_ITEM_RESUMEN_PRECIO) {
            pnlGral.add(this.getPnlPrecioMoneda(), BorderLayout.CENTER);
        }
        pnlGral.add(this.getPnlOtros(), BorderLayout.EAST);
        return pnlGral;
    }

    private JPanel getPnlPrecioMoneda() {
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

    private JPanel getPnlMoneda() {
        JPanel pnl = new JPanel(new FlowLayout(FlowLayout.LEADING, 2, 5));
        JLabel lblMoneda = new JLabel("Moneda");
        pnl.add(lblMoneda);
        cboMoneda = new JComboBox();
        pnl.add(cboMoneda);
        return pnl;
    }

    private JPanel getPnlPrecioSol() {
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

    private JPanel getPnlPrecioDol() {
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

    private JPanel getPnlNorth() {
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

    private JPanel getPnlUm() {
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

    private JPanel getPnlOtros() {
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

    private JPanel getPnlCuentas() {
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
        try {
            LoadComboItem.loadComboColor(path, cboColor, usuario);
            loadMarca();
            loadPromocion();
            loadTamano();
            LoadComboItem.loadComboFamilia(path, cboFamilia, usuario);
            loadUnidadMedida();
            if (cboMoneda != null) {
                LoadCombo.loadMonedaItem(path, cboMoneda, Constans.ITEM_INIT, 0);
            }
        } catch (Exception e) {
            ExceptionHandler.handleException(e, logger);
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }

    private void loadClaseSunat() throws Exception {
        try {
            logger.debug("loadClaseSunat()");
            BeanSubFamilia subFamilia = (BeanSubFamilia) LoadComboItem.getObjectCombo(cboSubFamilia);
            cboSunat.removeAllItems();
            if (subFamilia == null) {
                return;
            }
            String codigoSubFamiliaSunat = subFamilia.getCodigoSubFamiliaSunat();
            if (codigoSubFamiliaSunat == null) {
                return;
            }
            LoadComboItem.loadComboClaseSunat(path, cboSunat, codigoSubFamiliaSunat);
        } catch (Exception e) {
            throw e;
        }
    }

    private void loadSubFamilia() {
        try {
            cboSubFamilia.removeAllItems();
            String idFamilia = this.getIdFamilia();
            if (Util.isBlank(idFamilia)) {
                cboSubFamilia.setEnabled(false);
                return;
            }
            if (mode == UPDATE || mode == INSERT || mode == CLONE) {
                cboSubFamilia.setEnabled(true);
            }
            LoadComboItem.loadComboFamilia(path, cboSubFamilia, idFamilia);
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }

    private void loadMarca() {
        try {
            RnMarca reglaMarca = new RnMarca(path);
            if (xmarca != null) {
                xmarca.clear();
            } else {
                xmarca = new ArrayList();
            }
            xmarca.addAll(reglaMarca.listarGeneral(usuario.getCodempresa()));

            cbMarca.removeAllItems();
            cbMarca.addItem("--- Seleccione una Marca ---");

            for (int i = 0; i < xmarca.size(); i++) {
                cbMarca.addItem(xmarca.get(i).getDescripcion());
            }

            cbMarca.setSelectedIndex(0);
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }

    private void loadPromocion() {
        try {
            RnPromocion regla = new RnPromocion(path);

            if (xPromocion != null) {
                xPromocion.clear();
            } else {
                xPromocion = new ArrayList();
            }

            xPromocion.addAll(regla.listar(0, "A"));

            cboPromocion.removeAllItems();
            cboPromocion.addItem("--- Seleccione ---");

            for (int i = 0; i < xPromocion.size(); i++) {
                cboPromocion.addItem(xPromocion.get(i).getDescripcion());
            }

            cboPromocion.setSelectedIndex(0);
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }

    private void loadTamano() {
        try {
            RnTamano reglaTamano = new RnTamano(path);

            if (xtamano != null) {
                xtamano.clear();
            } else {
                xtamano = new ArrayList();
            }

            xtamano.addAll(reglaTamano.listarGeneral(usuario.getCodempresa()));

            cbTamano.removeAllItems();
            cbTamano.addItem("--- Seleccione un TamaÃ±o ---");

            for (int i = 0; i < xtamano.size(); i++) {
                cbTamano.addItem(xtamano.get(i).getDescripcion());
            }

            cbTamano.setSelectedIndex(0);
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }

    private void loadUnidadMedida() {
        try {
            RnUnidadMedida reglaUnidadMedida = new RnUnidadMedida(path);

            if (xunidadMedi != null) {
                xunidadMedi.clear();
            } else {
                xunidadMedi = new ArrayList();
            }

            xunidadMedi.addAll(reglaUnidadMedida.listar("", "", "", usuario.getCodempresa()));

            cboUnidadCompra.removeAllItems();
            cboUnidadStock.removeAllItems();
            cboUnidadVenta.removeAllItems();

            cboUnidadCompra.removeAllItems();
            cboUnidadVenta.removeAllItems();
            cboUnidadStock.removeAllItems();

            cboUnidadCompra.addItem("--- Seleccione U.M. ---");
            cboUnidadVenta.addItem("--- Seleccione U.M. ---");
            cboUnidadStock.addItem("--- Seleccione U.M. ---");

            for (Integer i = 0; i < xunidadMedi.size(); i++) {
                cboUnidadCompra.addItem(xunidadMedi.get(i).getAbreviatura());
                cboUnidadVenta.addItem(xunidadMedi.get(i).getAbreviatura());
                cboUnidadStock.addItem(xunidadMedi.get(i).getAbreviatura());
            }

            cboUnidadCompra.setSelectedIndex(0);
            cboUnidadStock.setSelectedIndex(0);
            cboUnidadVenta.setSelectedIndex(0);
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }

    private String getIdUm() {
        if (cboUnidadCompra.getSelectedIndex() > 0) {
            return xunidadMedi.get(cboUnidadCompra.getSelectedIndex() - 1).getIdUm();
        }
        return "";
    }

    private String getIdFamilia() {
        BeanFamilia beanFamilia = (BeanFamilia) LoadComboItem.getObjectCombo(cboFamilia);
        if (beanFamilia == null) {
            return "";
        }
        return beanFamilia.getIdFamilia();
    }

    private String getIdSubFamilia() {
        BeanSubFamilia beanSubFamilia = (BeanSubFamilia) LoadComboItem.getObjectCombo(cboSubFamilia);
        if (beanSubFamilia == null) {
            return "";
        }
        return beanSubFamilia.getIdSubFamilia();
    }

    private String getIdMarca() {
        if (cbMarca.getSelectedIndex() > 0) {
            return xmarca.get(cbMarca.getSelectedIndex() - 1).getIdMarca();
        }
        return "";
    }

    private String getIdTamano() {
        if (cbTamano.getSelectedIndex() > 0) {
            return xtamano.get(cbTamano.getSelectedIndex() - 1).getIdTamano();
        }
        return "";
    }

    private BeanItem getBeanItem() throws Exception {
        try {
            BeanItem beanItem = new BeanItem();
            SimpleDateFormat fe = new SimpleDateFormat("dd/MM/yyyy");
            beanItem.setIdItem(txtCodigoItem.getText());
            beanItem.setIdEmpresa(usuario.getCodempresa());
            beanItem.setIdAlterno(txtAlterno.getText());
            beanItem.setDescripcion(txtDescripcion.getText());
            BeanUnidadMedida beanUm = new BeanUnidadMedida(this.getIdUm());
            beanItem.setBeanUmCompra(beanUm);
            beanItem.setBeanUmVenta(beanUm);
            beanItem.setBeanUmStock(beanUm);
            beanItem.setBeanColor(new BeanColor(LoadComboItem.getIdCombo(cboColor)));
            beanItem.setBeanFamilia(new BeanFamilia(this.getIdFamilia()));
            beanItem.setBeanSubFamilia(new BeanSubFamilia(this.getIdSubFamilia()));
            beanItem.setBeanMarca(new BeanMarca(this.getIdMarca()));
            beanItem.setBeanTamano(new BeanTamano(this.getIdTamano()));
            beanItem.setFlagIgv(chkFlagAfectoIgv.isSelected() ? "S" : "N");
            beanItem.setFlagPercepcion(chkSujetoPercepcion.isSelected() ? "S" : "N");
            beanItem.setPigv(txtPorIGV.getText().trim().length() > 0 ? new BigDecimal(txtPorIGV.getText()) : BigDecimal.ZERO);
            beanItem.setpIsc(txtPorISC.getText().trim().length() > 0 ? new BigDecimal(txtPorISC.getText()) : BigDecimal.ZERO);
            beanItem.setCtaCompra(txtCuentaCompra.getText());
            beanItem.setCtaTransito(txtCuentaTransito.getText());
            beanItem.setCtaVta(txtCuentaVentaSol.getText());
            beanItem.setCtaVtaDolar(txtCuentaVentaDol.getText());
            beanItem.setFlagKardex(chkFlagKardex.isSelected() ? "S" : "N");
            beanItem.setFlagTransporte(chkServicioTransporte.isSelected() ? "S" : "N");
            beanItem.setTipoItem(cboTipo.getSelectedItem().toString().substring(0, 1));
            beanItem.setIsPerecible(rbPerecible.isSelected() == true ? 1 : 0);
            beanItem.setNumDiasPerecible(rbPerecible.isSelected() == true && !txtCantidadDiasPerecible.getText().isEmpty() && Integer.parseInt(txtCantidadDiasPerecible.getText()) > 0 ? Integer.parseInt(txtCantidadDiasPerecible.getText()) : 0);
            beanItem.setEstado(chkEstado.isSelected() ? "A" : "D");
            beanItem.setIdUsuario(usuario.getId_usuario());
            beanItem.setTipoOperacionIgv(this.cboTipoOperIgv.getSelectedItem().toString());
            if (Constans.ISBOTICA || Constans.IS_BOTICA_SIN_LOTE) {
                beanItem.setComposicion(txtComposicion.getText());
                beanItem.setFuncion(txtFuncion.getText());
                beanItem.setStockMin(Double.parseDouble(txtStockMin.getText()));
            } else if (Constans.IS_ITEM_BY_CLIENTE) {
                beanItem.setComposicion(this.getIdMoneda());
                beanItem.setFuncion(txtFuncion.getText());
                beanItem.setStockMin(0);
            } else {
                beanItem.setComposicion("");
                beanItem.setFuncion("");
                beanItem.setStockMin(0);
            }
            beanItem.setXmlConversion(this.getXmlConversion());
            beanItem.setXmlCaracteristica(this.getXmlCaracteristica(fe));
            beanItem.setXmlConfig(this.getXmlConfig(fe));
            beanItem.setXmlDescuento(this.getXmlDescuento(fe));
            beanItem.setXmlAlmacen(this.getXmlAlmacen(fe));
            beanItem.setXmlCuenta(this.getXmlCuenta(fe));
            beanItem.setXmlPercepcion(this.getXmlPercepcion(fe));
            beanItem.setXmlPromocion(this.getXmlPromocion());
            beanItem.setClaseSunat(new ClaseSunat(LoadComboItem.getIdComboNull(cboSunat)));
            return beanItem;
        } catch (Exception ex) {
            throw ex;
        }
    }

    private BeanPrecioItem getPrecioItem() {
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

    private String getIdMoneda() {
        ObjectItem itemMoneda = (ObjectItem) cboMoneda.getSelectedItem();
        if (itemMoneda != null && itemMoneda.getObjItem() != null) {
            return itemMoneda.getObjItem().toString().trim();
        }
        return "";
    }

    private String getXmlPromocion() {
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

    private String getXmlPercepcion(SimpleDateFormat fe) {
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

    private String getXmlCuenta(SimpleDateFormat fe) {
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

    private String getXmlAlmacen(SimpleDateFormat fe) {
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

    private String getXmlDescuento(SimpleDateFormat fe) {
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

    private String getXmlConfig(SimpleDateFormat fe) {
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

    private String getXmlCaracteristica(SimpleDateFormat fe) {
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

    private String getXmlConversion() {
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

    private void cargarMarca(String idMarca) throws Exception {
        try {
            for (int i = 0; i < xmarca.size(); i++) {
                if (xmarca.get(i).getIdMarca().equals(idMarca)) {
                    cbMarca.setSelectedIndex(i + 1);
                    return;
                }
            }
        } catch (Exception e) {
            throw e;
        }
    }

    private void cargarTamano(String idTamano) throws Exception {
        try {
            for (int i = 0; i < xtamano.size(); i++) {
                if (xtamano.get(i).getIdTamano().equals(idTamano)) {
                    cbTamano.setSelectedIndex(i + 1);
                    return;
                }
            }
        } catch (Exception e) {
            throw e;
        }
    }

    private void cargarMoneda(String idMoneda) {
        if (idMoneda == null) {
            return;
        }
        int pos = 0;
        for (int i = 0; i < cboMoneda.getItemCount(); i++) {
            ObjectItem obj = (ObjectItem) cboMoneda.getItemAt(i);
            if (obj.getObjItem() == null) {
                continue;
            }
            if (obj.getObjItem().equals(idMoneda)) {
                pos = i;
                break;
            }
        }
        cboMoneda.setSelectedIndex(pos);
    }

    private void cargarUnidadMedida(String idUm) throws Exception {
        try {
            for (int i = 0; i < xunidadMedi.size(); i++) {
                if (xunidadMedi.get(i).getIdUm().equals(idUm)) {
                    cboUnidadStock.setSelectedIndex(i + 1);
                    return;
                }
            }
        } catch (Exception e) {
            throw e;
        }
    }

    private void cargarConversion() throws Exception {
        try {
            RnItem logicItem = new RnItem(path);
            modeltable.agregarVectorItem(logicItem.cargarItemItem(txtCodigoItem.getText().trim()));
            table.setAllColumnPreferredWidth();
            List listCaracteristica = logicItem.cargarItemCaracteristica(txtCodigoItem.getText().trim());
            modeltableCaracteristica.agregarVectorCaracteristicaItemDetalle(listCaracteristica);
            tableCaracteristica.setAllColumnNoResizable();
            List listConfigItem = logicItem.cargarconfigItem(txtCodigoItem.getText().trim());
            modeltableConfigItem.agregarVectorConfigItem(listConfigItem);
            tableConfigItem.setAllColumnNoResizable();
            List listConfigItemDscto = logicItem.cargarConfigItemDscto(txtCodigoItem.getText().trim());
            modeltableConfigItemDscto.agregarVectorConfigItemDscto(listConfigItemDscto);
            tableConfigItemDscto.setAllColumnNoResizable();
            List listConfigItemAlmacen = logicItem.cargarConfigItemAlmacen(txtCodigoItem.getText().trim());
            modeltableConfigItemAlmacen.agregarVectorConfigItemAlmacen(listConfigItemAlmacen);
            tableConfigItemAlmacen.setAllColumnNoResizable();
            List listConfigItemCuenta = logicItem.cargarConfigItemCuenta(txtCodigoItem.getText().trim());
            modeltableConfigItemCuenta.agregarVectorConfigItemCuenta(listConfigItemCuenta);
            tableConfigItemCuenta.setAllColumnNoResizable();
            List listItemPercepcion = logicItem.cargarItemPercepcion(txtCodigoItem.getText().trim());
            modeltableItemPercepcion.agregarVectorItemPercepcion(listItemPercepcion);
            tableItemPercepcion.setAllColumnNoResizable();
            List listItemPromocion = logicItem.cargarItemPromocion(txtCodigoItem.getText().trim());
            modeltableItemPromocion.agregarVectorItemPromocion(listItemPromocion);
            tableItemPromocion.setAllColumnNoResizable();
        } catch (Exception e) {
            throw e;
        }
    }

    @Override
    public void newRegister() {
    }

    @Override
    public String executeInsert() {
        try {
            RnItem logicItem = new RnItem(path);
            return logicItem.mantItem(this.getBeanItem(), this.getPrecioItem(), OperacionBDEnum.INSERTAR);
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, "Error: " + e.getMessage(), "Cliente", JOptionPane.OK_OPTION);
            ExceptionHandler.handleException(e, logger);
            return "";
        }
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
        try {
            JTextField txt = new JTextField();
            cboFamilia.setBorder(txt.getBorder());
            cbMarca.setBorder(txt.getBorder());
            txtDescripcion.setBorder(txt.getBorder());
            txtAlterno.setBorder(txt.getBorder());
            cboUnidadCompra.setBorder(txt.getBorder());
            cboUnidadStock.setBorder(txt.getBorder());
            cboUnidadVenta.setBorder(txt.getBorder());
            if (txtAlterno.getText().trim().length() == 0) {
                JOptionPane.showMessageDialog(this, "Para " + namemode + " un Item, debes "
                        + "especificar su Codigo Alternativo.", "Datos incompletos de Item", JOptionPane.CANCEL_OPTION);

                txtAlterno.setBorder(new LineBorder(Color.RED));
                txtAlterno.requestFocus();

                return false;
            }

            if (cboFamilia.getSelectedIndex() == 0) {
                JOptionPane.showMessageDialog(this, "Para " + namemode + " un Item, debes "
                        + "especificar su Familia.", "Datos incompletos de Item", JOptionPane.CANCEL_OPTION);

                cboFamilia.setBorder(new LineBorder(Color.RED));
                cboFamilia.requestFocus();

                return false;
            }

            if (cbMarca.getSelectedIndex() == 0) {
                JOptionPane.showMessageDialog(this, "Para " + namemode + " un Item, debes "
                        + "especificar su Marca.", "Datos incompletos de Item", JOptionPane.CANCEL_OPTION);

                cbMarca.setBorder(new LineBorder(Color.RED));
                cbMarca.requestFocus();

                return false;
            }

            if (txtDescripcion.getText().trim().length() == 0) {
                JOptionPane.showMessageDialog(this, "Para " + namemode + " un Item, debes "
                        + "especificar su Descripcion.", "Datos incompletos de Item", JOptionPane.CANCEL_OPTION);

                txtDescripcion.setBorder(new LineBorder(Color.RED));
                txtDescripcion.requestFocus();

                return false;
            }

            if (cboUnidadStock.getSelectedIndex() == 0) {
                JOptionPane.showMessageDialog(this, "Para " + namemode + " un Item, debes "
                        + "especificar su U. Stock.", "Datos incompletos de Item", JOptionPane.CANCEL_OPTION);

                cboUnidadStock.setBorder(new LineBorder(Color.RED));
                cboUnidadStock.requestFocus();

                return false;
            }

            if (cboUnidadCompra.getSelectedIndex() == 0) {
                JOptionPane.showMessageDialog(this, "Para " + namemode + " un Item, debes "
                        + "especificar su U. Compra.", "Datos incompletos de Item", JOptionPane.CANCEL_OPTION);

                cboUnidadCompra.setBorder(new LineBorder(Color.RED));
                cboUnidadCompra.requestFocus();

                return false;
            }

            if (cboUnidadVenta.getSelectedIndex() == 0) {
                JOptionPane.showMessageDialog(this, "Para " + namemode + " un Item, debes "
                        + "especificar su U. Venta.", "Datos incompletos de Item", JOptionPane.CANCEL_OPTION);

                cboUnidadVenta.setBorder(new LineBorder(Color.RED));
                cboUnidadVenta.requestFocus();

                return false;
            }
            return true;
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, e.getMessage());
            return false;
        }
    }

    @Override
    public boolean loadRegister() {
        try {
            BeanItem beanItem;
            RnItem logicItem = new RnItem(path);
            beanItem = logicItem.cargarItem(rowSelection.getSelectedValue(1).toString(), "", true, "");
            txtCodigoItem.setText(beanItem.getIdItem());
            txtDescripcion.setText(beanItem.getDescripcion());
            idAlterno = beanItem.getIdAlterno();
            txtAlterno.setText(idAlterno);
            LoadComboItem.setComboFamiliaItem(beanItem.getBeanFamilia().getIdFamilia(), cboFamilia);
            cargarMarca(beanItem.getBeanMarca().getIdMarca());
            LoadComboItem.setComboItem(beanItem.getBeanColor().getIdColor(), cboColor);
            LoadComboItem.setComboSubFamiliaItem(beanItem.getBeanSubFamilia().getIdSubFamilia(), cboSubFamilia);
            cargarTamano(beanItem.getBeanTamano().getIdTamano());
            cargarUnidadMedida(beanItem.getBeanUmCompra().getIdUm());
            if (Constans.IS_ITEM_BY_CLIENTE) {
                this.cargarMoneda(beanItem.getComposicion());
            }
            if (Constans.IS_ITEM_BY_CLIENTE || Constans.IS_ITEM_RESUMEN_PRECIO) {
                this.loadPrecio(beanItem.getIdItem());
            }
            cboTipo.setSelectedIndex(beanItem.getTipoItem().equals("T") ? 2 : (beanItem.getTipoItem().equals("C") ? 1 : 0));
            chkFlagAfectoIgv.setSelected(beanItem.getFlagIgv().equals("S"));
            cboTipoOperIgv.setSelectedItem(beanItem.getTipoOperacionIgv());
            chkSujetoPercepcion.setSelected(beanItem.getFlagPercepcion().equals("S"));
            txtPorIGV.setText(beanItem.getPigv().toString());
            txtPorISC.setText(beanItem.getpIsc().toString());
            txtCuentaCompra.setText(beanItem.getCtaCompra());
            txtCuentaTransito.setText(beanItem.getCtaTransito());
            txtCuentaVentaSol.setText(beanItem.getCtaVta());
            txtCuentaVentaDol.setText(beanItem.getCtaVtaDolar());
            chkFlagKardex.setSelected(beanItem.getFlagKardex().equals("S"));
            chkServicioTransporte.setSelected(beanItem.getFlagTransporte().equals("S"));
            chkEstado.setSelected(beanItem.getEstado().equals("A"));
            txtComposicion.setText(beanItem.getComposicion());
            txtFuncion.setText(beanItem.getFuncion());
            txtStockMin.setText(String.valueOf(beanItem.getStockMin()));
            txtCantidadDiasPerecible.setText(String.valueOf(beanItem.getNumDiasPerecible()));
            rbPerecible.setSelected(beanItem.getIsPerecible() == 1);
            LoadComboItem.setComboItem(beanItem.getCodigoClaseSunat(), cboSunat);
            setTitlePersonal();
            cargarConversion();
            return true;
        } catch (Exception e) {
            ExceptionHandler.handleException(e, logger);
            JOptionPane.showMessageDialog(this, e.getMessage());
            return false;
        }
    }

    private void loadPrecio(String idItem) {
        try {
            RnPreciosCab logicPrecio = new RnPreciosCab(path);
            BeanPrecioItem precioItem = logicPrecio.getPrecioItem(usuario.getCodempresa(), usuario.getCodlocalidad(), idItem);
            if (precioItem == null) {
                return;
            }
            txtPrecio1.setText(precioItem.getPrecio1().toString());
            txtPrecio2.setText(precioItem.getPrecio2().toString());
            txtPrecio3.setText(precioItem.getPrecio3().toString());
            txtPrecio4.setText(precioItem.getPrecio4().toString());
            txtPrecio5.setText(precioItem.getPrecio5().toString());
            txtPrecio6.setText(precioItem.getPrecio6().toString());
        } catch (Exception e) {
        }
    }

    private void setTitlePersonal() {
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

    private void loadIgv() {
        try {
            //if (chkFlagAfectoIgv.isSelected()) {
            if (cboTipoOperIgv.getSelectedItem().equals("AFECTO")) {
                txtPorIGV.setEditable(true);
                txtPorIGV.setText(LoadDataGenerica.getPorcIgv(path, usuario).toString());
                this.chkFlagAfectoIgv.setSelected(true);
            } else {
                txtPorIGV.setEditable(false);
                txtPorIGV.setText("0");
                this.chkFlagAfectoIgv.setSelected(false);
            }
        } catch (Exception e) {
            ExceptionHandler.handleException(e, logger);
            txtPorIGV.setText("0");
        }
    }

    @Override
    public String executeUpdate() {
        try {
            RnItem logicItem = new RnItem(path);
            return logicItem.mantItem(this.getBeanItem(), this.getPrecioItem(), OperacionBDEnum.ACTUALIZAR);
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, "Error: " + e.getMessage(), "Cliente", JOptionPane.OK_OPTION);
            ExceptionHandler.handleException(e, logger);
            return "";
        }
    }

    @Override
    public boolean executeDelete() {
        try {
            RnItem logicItem = new RnItem(path);
            logicItem.deleteItem(txtCodigoItem.getText().trim());
            return true;
        } catch (Exception e) {
            ExceptionHandler.handleException(e, logger);
            JOptionPane.showMessageDialog(this, e.getMessage());
            return false;
        }
    }

    private void agregarItemItem() {
        if (!this.isAgregarItem()) {
            JOptionPane.showMessageDialog(this, "No se Puede Agregar mas un producto");
            return;
        }
        BuscarItemConversion buscarItem;
        buscarItem = new BuscarItemConversion(frm, this, path);
        buscarItem.cargarTabla(usuario.getCodempresa(), btnAgregarItem, 0);
    }

    private boolean isAgregarItem() {
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

    private void agregarPromocion() {
        try {
            if (cboPromocion.getSelectedIndex() <= 0) {
                JOptionPane.showMessageDialog(this, "Seleccione Promocion");
                return;
            }
            boolean sw = false;
            for (int i = 0; i < modeltableItemPromocion.getRowCount(); i++) {
                if (xPromocion.get(cboPromocion.getSelectedIndex() - 1).getIdPromocion() == modeltableItemPromocion.getItemPromocion(i).getBeanPromocion().getIdPromocion()) {
                    sw = true;
                    break;
                }
            }
            if (sw) {
                JOptionPane.showMessageDialog(this, "Promocion ya esta agregado");
                return;
            }
            ItemPromocion bean = new ItemPromocion();
            bean.setBeanPromocion(xPromocion.get(cboPromocion.getSelectedIndex() - 1));
            bean.setEstado("A");
            bean.setOperacion("I");
            modeltableItemPromocion.setItemPromocion(bean);
            modeltableItemPromocion.fireTableDataChanged();
            tableItemPromocion.setAllColumnPreferredWidth();
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }

    private void activarPromocion() {
        if (tableItemPromocion.getRowCount() == 0) {
            return;
        }
        if (tableItemPromocion.getSelectedRow() >= 0) {
            if (modeltableItemPromocion.getItemPromocion(tableItemPromocion.convertRowIndexToModel(tableItemPromocion.getSelectedRow())).getEstado().equals("A")) {
                JOptionPane.showMessageDialog(this, "Promocion ya esta activado", "Promociones", JOptionPane.INFORMATION_MESSAGE);
                return;
            }
            modeltableItemPromocion.getItemPromocion(tableItemPromocion.convertRowIndexToModel(tableItemPromocion.getSelectedRow())).setEstado("A");
            if (modeltableItemPromocion.getItemPromocion(tableItemPromocion.convertRowIndexToModel(tableItemPromocion.getSelectedRow())).getOperacion().equals("")) {
                modeltableItemPromocion.getItemPromocion(tableItemPromocion.convertRowIndexToModel(tableItemPromocion.getSelectedRow())).setOperacion("A");
            }
            modeltableItemPromocion.fireTableDataChanged();
            tableItemPromocion.setAllColumnPreferredWidth();
        } else {
            JOptionPane.showMessageDialog(this, "Seleccionar Fila", "Promociones", JOptionPane.INFORMATION_MESSAGE);
        }
    }

    private void desactivarPromocion() {
        if (tableItemPromocion.getRowCount() == 0) {
            return;
        }
        if (tableItemPromocion.getSelectedRow() >= 0) {
            if (modeltableItemPromocion.getItemPromocion(tableItemPromocion.convertRowIndexToModel(tableItemPromocion.getSelectedRow())).getEstado().equals("D")) {
                JOptionPane.showMessageDialog(this, "Promocion ya esta desactivado", "Promociones", JOptionPane.INFORMATION_MESSAGE);
                return;
            }
            modeltableItemPromocion.getItemPromocion(tableItemPromocion.convertRowIndexToModel(tableItemPromocion.getSelectedRow())).setEstado("D");
            if (modeltableItemPromocion.getItemPromocion(tableItemPromocion.convertRowIndexToModel(tableItemPromocion.getSelectedRow())).getOperacion().equals("")) {
                modeltableItemPromocion.getItemPromocion(tableItemPromocion.convertRowIndexToModel(tableItemPromocion.getSelectedRow())).setOperacion("A");
            }
            modeltableItemPromocion.fireTableDataChanged();
            tableItemPromocion.setAllColumnPreferredWidth();
        } else {
            JOptionPane.showMessageDialog(this, "Seleccionar Fila", "Promociones", JOptionPane.INFORMATION_MESSAGE);
        }
    }

    private void desactivarCaracteristica() {
        if (tableCaracteristica.getRowCount() == 0) {
            return;
        }
        if (tableCaracteristica.getSelectedRow() >= 0) {
            if (modeltableCaracteristica.getCaracteristicaItemDetalle(tableCaracteristica.convertRowIndexToModel(tableCaracteristica.getSelectedRow())).getEstado().equals("D")) {
                JOptionPane.showMessageDialog(this, "Caracteristica Seleccionado ya esta desactivado", "Padrones", JOptionPane.INFORMATION_MESSAGE);
                return;
            }
            int xres = JOptionPane.showConfirmDialog(this, "Desea Desactivar Caracteristica?", "Item", JOptionPane.OK_CANCEL_OPTION);
            if (xres == JOptionPane.OK_OPTION) {
                if (modeltableCaracteristica.getCaracteristicaItemDetalle(tableCaracteristica.convertRowIndexToModel(tableCaracteristica.getSelectedRow())).getOperacion().equals("I")) {
                    modeltableCaracteristica.deleteCaracteristicaItemDetalle(tableCaracteristica.convertRowIndexToModel(tableCaracteristica.getSelectedRow()));
                } else {
                    modeltableCaracteristica.getCaracteristicaItemDetalle(tableCaracteristica.convertRowIndexToModel(tableCaracteristica.getSelectedRow())).setFechaFin(Main.fechaActualServer);
                    modeltableCaracteristica.getCaracteristicaItemDetalle(tableCaracteristica.convertRowIndexToModel(tableCaracteristica.getSelectedRow())).setEstado("D");
                    modeltableCaracteristica.getCaracteristicaItemDetalle(tableCaracteristica.convertRowIndexToModel(tableCaracteristica.getSelectedRow())).setOperacion("A");
                    tableCaracteristica.setAllColumnPreferredWidth();
                }
            }
        } else {
            JOptionPane.showMessageDialog(this, "Seleccionar Fila", "Padrones", JOptionPane.INFORMATION_MESSAGE);
        }
    }

    private void desactivarAlmacen() {
        if (tableConfigItemAlmacen.getRowCount() == 0) {
            return;
        }
        if (tableConfigItemAlmacen.getSelectedRow() >= 0) {
            if (modeltableConfigItemAlmacen.getConfigItemAlmacen(tableConfigItemAlmacen.convertRowIndexToModel(tableConfigItemAlmacen.getSelectedRow())).getEstado().equals("D")) {
                JOptionPane.showMessageDialog(this, "Almacen Seleccionado ya esta desactivado", "Padrones", JOptionPane.INFORMATION_MESSAGE);
                return;
            }
            int xres = JOptionPane.showConfirmDialog(this, "Desea Desactivar Almacen?", "Item", JOptionPane.OK_CANCEL_OPTION);
            if (xres == JOptionPane.OK_OPTION) {
                if (modeltableConfigItemAlmacen.getConfigItemAlmacen(tableConfigItemAlmacen.convertRowIndexToModel(tableConfigItemAlmacen.getSelectedRow())).getOperacion().equals("I")) {
                    modeltableConfigItemAlmacen.deleteConfigItemAlmacen(tableConfigItemAlmacen.convertRowIndexToModel(tableConfigItemAlmacen.getSelectedRow()));
                } else {
                    modeltableConfigItemAlmacen.getConfigItemAlmacen(tableConfigItemAlmacen.convertRowIndexToModel(tableConfigItemAlmacen.getSelectedRow())).setFechaFin(Main.fechaActualServer);
                    modeltableConfigItemAlmacen.getConfigItemAlmacen(tableConfigItemAlmacen.convertRowIndexToModel(tableConfigItemAlmacen.getSelectedRow())).setEstado("D");
                    modeltableConfigItemAlmacen.getConfigItemAlmacen(tableConfigItemAlmacen.convertRowIndexToModel(tableConfigItemAlmacen.getSelectedRow())).setOperacion("A");
                    tableConfigItemAlmacen.setAllColumnPreferredWidth();
                }
            }
        } else {
            JOptionPane.showMessageDialog(this, "Seleccionar Fila", "Almacen", JOptionPane.INFORMATION_MESSAGE);
        }
    }

    private void activarPercepcion() {
        if (tableItemPercepcion.getRowCount() > 0) {
            if (modeltableItemPercepcion.getItemPercepcion(modeltableItemPercepcion.getRowCount() - 1).getEstado().equals("A")) {
                JOptionPane.showMessageDialog(this, "Percepcion ya esta Activada");
                return;
            }
        }
        FormItemPercepcion frmItemPercepcion = new FormItemPercepcion(this, path, btnActivarItemPercepcion, true, 0);
        frmItemPercepcion = null;
    }

    private void desactivarPercepcion() {
        if (tableItemPercepcion.getRowCount() == 0) {
            return;
        }
        if (tableItemPercepcion.getRowCount() > 0) {
            if (modeltableItemPercepcion.getItemPercepcion(modeltableItemPercepcion.getRowCount() - 1).getEstado().equals("D")) {
                JOptionPane.showMessageDialog(this, "Percepcion ya esta Desactivada");
                return;
            }
            if (modeltableItemPercepcion.getItemPercepcion(modeltableItemPercepcion.getRowCount() - 1).getOperacion().equals("I")) {
                modeltableItemPercepcion.deleteItemPercepcion(modeltableItemPercepcion.getRowCount() - 1);
                chkSujetoPercepcion.setSelected(false);
                calcularPercepcion();
                modeltableItemPercepcion.fireTableDataChanged();
                tableItemPercepcion.setAllColumnPreferredWidth();
                return;
            }
        }
        FormItemPercepcion frmItemPercepcion = new FormItemPercepcion(this, path, btnDesactivarItemPercepcion, false, modeltableItemPercepcion.getItemPercepcion(modeltableItemPercepcion.getRowCount() - 1).getIdItemPercepcion());
        frmItemPercepcion = null;
    }

    private void desactivarConfigItem() {
        if (tableConfigItem.getRowCount() == 0) {
            return;
        }
        if (tableConfigItem.getSelectedRow() >= 0) {
            if (modeltableConfigItem.getConfigItem(tableConfigItem.convertRowIndexToModel(tableConfigItem.getSelectedRow())).getEstado().equals("D")) {
                JOptionPane.showMessageDialog(this, "Configuracion Seleccionado ya esta desactivado", "Padrones", JOptionPane.INFORMATION_MESSAGE);
                return;
            }
            int xres = JOptionPane.showConfirmDialog(this, "Desea Desactivar Configuracion?", "Item", JOptionPane.OK_CANCEL_OPTION);
            if (xres == JOptionPane.OK_OPTION) {
                if (modeltableConfigItem.getConfigItem(tableConfigItem.convertRowIndexToModel(tableConfigItem.getSelectedRow())).getOperacion().equals("I")) {
                    modeltableConfigItem.deleteConfigItem(tableConfigItem.convertRowIndexToModel(tableConfigItem.getSelectedRow()));
                    modeltableConfigItem.fireTableDataChanged();
                } else {
                    modeltableConfigItem.getConfigItem(tableConfigItem.convertRowIndexToModel(tableConfigItem.getSelectedRow())).setFechaFin(Main.fechaActualServer);
                    modeltableConfigItem.getConfigItem(tableConfigItem.convertRowIndexToModel(tableConfigItem.getSelectedRow())).setEstado("D");
                    modeltableConfigItem.getConfigItem(tableConfigItem.convertRowIndexToModel(tableConfigItem.getSelectedRow())).setOperacion("A");
                    modeltableConfigItem.fireTableDataChanged();
                    tableConfigItem.setAllColumnPreferredWidth();
                }
            }
        } else {
            JOptionPane.showMessageDialog(this, "Seleccionar Fila", "Padrones", JOptionPane.INFORMATION_MESSAGE);
        }
    }

    private void desactivarConfigItemCuenta() {
        if (tableConfigItemCuenta.getRowCount() == 0) {
            return;
        }
        if (tableConfigItemCuenta.getSelectedRow() >= 0) {
            if (modeltableConfigItemCuenta.getConfigItemCuenta(tableConfigItemCuenta.convertRowIndexToModel(tableConfigItemCuenta.getSelectedRow())).getEstado().equals("D")) {
                JOptionPane.showMessageDialog(this, "Configuracion Seleccionado ya esta desactivado", "Cuenta", JOptionPane.INFORMATION_MESSAGE);
                return;
            }
            int xres = JOptionPane.showConfirmDialog(this, "Desea Desactivar Cuenta?", "Item", JOptionPane.OK_CANCEL_OPTION);
            if (xres == JOptionPane.OK_OPTION) {
                if (modeltableConfigItemCuenta.getConfigItemCuenta(tableConfigItemCuenta.convertRowIndexToModel(tableConfigItemCuenta.getSelectedRow())).getIdClaseOperacion().equals("001")) {
                    if (modeltableConfigItemCuenta.getConfigItemCuenta(tableConfigItemCuenta.convertRowIndexToModel(tableConfigItemCuenta.getSelectedRow())).getFlagTransito().equals("S")) {
                        txtCuentaTransito.setText("");
                    } else {
                        txtCuentaCompra.setText("");
                    }
                } else if (modeltableConfigItemCuenta.getConfigItemCuenta(tableConfigItemCuenta.convertRowIndexToModel(tableConfigItemCuenta.getSelectedRow())).getIdMoneda().equals("00001")) {
                    txtCuentaVentaSol.setText("");
                } else {
                    txtCuentaVentaDol.setText("");
                }
                if (modeltableConfigItemCuenta.getConfigItemCuenta(tableConfigItemCuenta.convertRowIndexToModel(tableConfigItemCuenta.getSelectedRow())).getOperacion().equals("I")) {
                    modeltableConfigItemCuenta.deleteConfigItemCuenta(tableConfigItemCuenta.convertRowIndexToModel(tableConfigItemCuenta.getSelectedRow()));
                    modeltableConfigItemCuenta.fireTableDataChanged();
                } else {
                    modeltableConfigItemCuenta.getConfigItemCuenta(tableConfigItemCuenta.convertRowIndexToModel(tableConfigItemCuenta.getSelectedRow())).setFechaFin(Main.fechaActualServer);
                    modeltableConfigItemCuenta.getConfigItemCuenta(tableConfigItemCuenta.convertRowIndexToModel(tableConfigItemCuenta.getSelectedRow())).setEstado("D");
                    modeltableConfigItemCuenta.getConfigItemCuenta(tableConfigItemCuenta.convertRowIndexToModel(tableConfigItemCuenta.getSelectedRow())).setOperacion("A");
                    modeltableConfigItemCuenta.fireTableDataChanged();
                    tableConfigItemCuenta.setAllColumnPreferredWidth();
                }
            }
        } else {
            JOptionPane.showMessageDialog(this, "Seleccionar Fila", "Padrones", JOptionPane.INFORMATION_MESSAGE);
        }
    }

    private void desactivarConfigItemDscto() {
        if (tableConfigItemDscto.getRowCount() == 0) {
            return;
        }
        if (tableConfigItemDscto.getSelectedRow() >= 0) {
            if (modeltableConfigItemDscto.getConfigItemDscto(tableConfigItemDscto.convertRowIndexToModel(tableConfigItemDscto.getSelectedRow())).getEstado().equals("D")) {
                JOptionPane.showMessageDialog(this, "Configuracion Seleccionado ya esta desactivado", "Padrones", JOptionPane.INFORMATION_MESSAGE);
                return;
            }
            int xres = JOptionPane.showConfirmDialog(this, "Desea Desactivar Configuracion?", "Item", JOptionPane.OK_CANCEL_OPTION);
            if (xres == JOptionPane.OK_OPTION) {
                if (modeltableConfigItemDscto.getConfigItemDscto(tableConfigItemDscto.convertRowIndexToModel(tableConfigItemDscto.getSelectedRow())).getOperacion().equals("I")) {
                    modeltableConfigItemDscto.deleteConfigItemDscto(tableConfigItemDscto.convertRowIndexToModel(tableConfigItemDscto.getSelectedRow()));
                    modeltableConfigItemDscto.fireTableDataChanged();
                } else {
                    modeltableConfigItemDscto.getConfigItemDscto(tableConfigItemDscto.convertRowIndexToModel(tableConfigItemDscto.getSelectedRow())).setFechaFin(Main.fechaActualServer);
                    modeltableConfigItemDscto.getConfigItemDscto(tableConfigItemDscto.convertRowIndexToModel(tableConfigItemDscto.getSelectedRow())).setEstado("D");
                    modeltableConfigItemDscto.getConfigItemDscto(tableConfigItemDscto.convertRowIndexToModel(tableConfigItemDscto.getSelectedRow())).setOperacion("A");
                    modeltableConfigItemDscto.fireTableDataChanged();
                    tableConfigItemDscto.setAllColumnPreferredWidth();
                }
            }
        } else {
            JOptionPane.showMessageDialog(this, "Seleccionar Fila", "Padrones", JOptionPane.INFORMATION_MESSAGE);
        }
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
        return true;
    }

    @Override
    public void setValueSearch(Object valor, Component comp) {
        if (comp == btnAgregarItem) {
            cargarItem((BeanItem) valor);
        }
        if (comp == btnActivarCaracteristica) {
            cargarCaracteristica((CaracteristicaItemDetalle) valor);
        }
        if (comp == btnActivarConfigItem) {
            cargarConfigItem((ConfigItem) valor);
        }
        if (comp == btnActivarItemPercepcion || comp == btnDesactivarItemPercepcion) {
            cargarItemPercepcion((ItemPercepcion) valor);
        }
        if (comp == btnActivarDscto) {
            cargarConfigItemDscto((ConfigItemDscto) valor);
        }
        if (comp == btnActivarAlmacen) {
            cargarAlmacen((ConfigItemAlmacen) valor);
        }
        if (comp == btnActivarCuenta) {
            cargarConfigItemCuenta((ConfigItemCuenta) valor);
        }
    }

    private void cargarCaracteristica(CaracteristicaItemDetalle beanCaracteristicaItemDetalle) {
        modeltableCaracteristica.setCaracteristicaItemDetalle(beanCaracteristicaItemDetalle);
        modeltableCaracteristica.fireTableDataChanged();
        tableCaracteristica.setAllColumnPreferredWidth();
    }

    private void cargarAlmacen(ConfigItemAlmacen beanConfigItemAlmacen) {
        modeltableConfigItemAlmacen.setConfigItemAlmacen(beanConfigItemAlmacen);
        modeltableConfigItemAlmacen.fireTableDataChanged();
        tableConfigItemAlmacen.setAllColumnPreferredWidth();
    }

    private void cargarConfigItem(ConfigItem beanConfigItem) {
        modeltableConfigItem.setConfigItem(beanConfigItem);
        modeltableConfigItem.fireTableDataChanged();
        tableConfigItem.setAllColumnPreferredWidth();
    }

    private void cargarItemPercepcion(ItemPercepcion beanItemPercepcion) {
        if (beanItemPercepcion.getIdItemPercepcion() > 0) {
            modeltableItemPercepcion.getItemPercepcion(modeltableItemPercepcion.getRowCount() - 1).setEstado(beanItemPercepcion.getEstado());
            modeltableItemPercepcion.getItemPercepcion(modeltableItemPercepcion.getRowCount() - 1).setFechaFin(beanItemPercepcion.getFechaFin());
            modeltableItemPercepcion.getItemPercepcion(modeltableItemPercepcion.getRowCount() - 1).setOperacion(beanItemPercepcion.getOperacion());
            chkSujetoPercepcion.setSelected(false);
        } else {
            modeltableItemPercepcion.setItemPercepcion(beanItemPercepcion);
            chkSujetoPercepcion.setSelected(true);
        }
        calcularPercepcion();
        modeltableItemPercepcion.fireTableDataChanged();
        tableItemPercepcion.setAllColumnPreferredWidth();
    }

    private void calcularPercepcion() {
        if (chkSujetoPercepcion.isSelected()) {
            try {
                txtPorISC.setText((new LogicParametro(path)).beanParametro("PPP").getValor());
            } catch (ClassNotFoundException ex) {
                ExceptionHandler.handleException(ex, logger);
            } catch (InstantiationException ex) {
                ExceptionHandler.handleException(ex, logger);
            } catch (IllegalAccessException ex) {
                ExceptionHandler.handleException(ex, logger);
            } catch (Exception ex) {
                ExceptionHandler.handleException(ex, logger);
            }
        } else {
            txtPorISC.setText("0.0");
        }
    }

    private void cargarConfigItemDscto(ConfigItemDscto beanConfigItemDscto) {
        modeltableConfigItemDscto.setConfigItemDscto(beanConfigItemDscto);
        modeltableConfigItemDscto.fireTableDataChanged();
        tableConfigItemDscto.setAllColumnPreferredWidth();
    }

    private void cargarConfigItemCuenta(ConfigItemCuenta beanConfigItemCuenta) {
        modeltableConfigItemCuenta.setConfigItemCuenta(beanConfigItemCuenta);
        modeltableConfigItemCuenta.fireTableDataChanged();
        tableConfigItemCuenta.setAllColumnPreferredWidth();
        if (beanConfigItemCuenta.getIdClaseOperacion().equals("001")) {
            if (beanConfigItemCuenta.getFlagTransito().equals("S")) {
                txtCuentaTransito.setText(beanConfigItemCuenta.getCuenta());
            } else {
                txtCuentaCompra.setText(beanConfigItemCuenta.getCuenta());
            }
        } else if (beanConfigItemCuenta.getIdMoneda().equals("00001")) {
            txtCuentaVentaSol.setText(beanConfigItemCuenta.getCuenta());
        } else {
            txtCuentaVentaDol.setText(beanConfigItemCuenta.getCuenta());
        }
    }

    private void cargarItem(BeanItem item) {
        try {
            ItemItem beanItemItem = new ItemItem();
            beanItemItem.setBeanItemDestino(item);
            beanItemItem.setValorDestino(item.getValorConversion());
            beanItemItem.setValorPaquete(item.getValorPaquete());
            beanItemItem.setValorOrigen(item.getValorOrigen());
            beanItemItem.setEstado("A");
            beanItemItem.setOperacion("I");
            modeltable.agregarItem(beanItemItem);
            modeltable.fireTableDataChanged();
            table.setAllColumnPreferredWidth();
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }

    private void controlEliminate() {
        if (table.getSelectedRow() >= 0) {
            int xres = JOptionPane.showConfirmDialog(this, "Desea eliminar el item?", "Eliminar Item", JOptionPane.OK_CANCEL_OPTION);

            if (xres == JOptionPane.OK_OPTION) {
                if (modeltable.getItem(table.convertRowIndexToModel(table.getSelectedRow())).getOperacion().equals("I")) {
                    modeltable.eliminarItem(table.convertRowIndexToModel(table.getSelectedRow()));
                    table.setAllColumnPreferredWidth();
                } else if (modeltable.getItem(table.convertRowIndexToModel(table.getSelectedRow())).getEstado().equals("D")) {
                    JOptionPane.showMessageDialog(this, "Producto ya esta desactivado");
                } else {
                    //Verificar si no tiene conversiones
                    modeltable.getItem(table.convertRowIndexToModel(table.getSelectedRow())).setEstado("D");
                    modeltable.getItem(table.convertRowIndexToModel(table.getSelectedRow())).setOperacion("A");
                    table.setAllColumnPreferredWidth();
                }
            }
        } else {
            JOptionPane.showMessageDialog(this, "Para eliminar un item primero debe seleccionar la fila.", "Eliminar Item", JOptionPane.INFORMATION_MESSAGE);
        }
    }

    @Override
    public boolean executeSelect() {
        return true;
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
        return true;
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

