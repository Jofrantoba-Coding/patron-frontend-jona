package com.softcommerce.views.uiregisteritemresumen;


import com.softcommerce.formularios.*;
import com.softcommerce.beans.BeanColor;
import com.softcommerce.beans.BeanFamilia;
import com.softcommerce.beans.BeanItem;
import com.softcommerce.beans.BeanMarca;
import com.softcommerce.beans.BeanPrecioItem;
import com.softcommerce.beans.BeanSubFamilia;
import com.softcommerce.beans.BeanUnidadMedida;
import com.softcommerce.beans.Usuario;
import com.softcommerce.entity.ClaseSunat;
import com.softcommerce.general.controles.JHDialog;
import com.softcommerce.general.controles.CCheckBox;
import com.softcommerce.general.controles.ComponentToolKit;
import com.softcommerce.general.controles.DoubleDocument;
import com.softcommerce.general.controles.ObjectItem;
import java.awt.Color;
import java.awt.Component;
import java.awt.Font;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.FocusEvent;
import java.awt.event.KeyEvent;
import java.awt.event.KeyListener;
import java.util.List;
import javax.swing.BorderFactory;
import javax.swing.JComboBox;
import javax.swing.JPanel;
import javax.swing.JTextField;
import javax.swing.border.Border;
import javax.swing.border.TitledBorder;
import com.softcommerce.general.controles.UpperCaseNumberDocument;
import java.awt.Dialog;
import java.awt.event.FocusListener;
import java.awt.event.ItemEvent;
import java.awt.event.ItemListener;
import java.util.ArrayList;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.JTabbedPane;
import javax.swing.border.LineBorder;
import com.softcommerce.reglasnegocio.RnItem;
import com.softcommerce.reglasnegocio.RnMarca;
import com.softcommerce.reglasnegocio.RnUnidadMedida;
import com.softcommerce.util.Constans;
import com.softcommerce.util.ExceptionHandler;
import com.softcommerce.util.LayoutUtil;
import com.softcommerce.util.combo.LoadCombo;
import com.softcommerce.util.LoadDataGenerica;
import com.softcommerce.util.Util;
import com.softcommerce.util.combo.LoadComboItem;
import java.awt.BorderLayout;
import java.awt.Dimension;
import java.awt.FlowLayout;
import java.awt.GridBagConstraints;
import java.awt.GridBagLayout;
import java.math.BigDecimal;
import javax.swing.JCheckBox;
import org.apache.log4j.Logger;

public class UiRegisterItemResumen
        extends JHDialog
        implements InterUiRegisterItemResumen, ActionListener, ItemListener, KeyListener, FocusListener {

    private static final long serialVersionUID = 1L;
    private List<BeanUnidadMedida> listUm;
    private JComboBox cboUnidadStock;
    private JTextField txtComposicion;
    private JTextField txtFuncion;
    private JComboBox cboFamilia;
    private JComboBox cboSubfamilia;
    private JComboBox cboColor;
    private List<BeanMarca> listMarca;
    private JComboBox cboMarca;
    private JTextField txtCodigoItem;
    private JTextField txtAlterno;
    private JTextField txtDescripcion;
    private JTextField txtPorIGV;
    private JTextField txtPorISC;
    private JTextField txtStockMin;
    private CCheckBox chkSujetoPercepcion;
    private CCheckBox chkFlagAfectoIgv;
    private JComboBox cb_tipoOperIgv;
    private final Usuario usuario;
    private JTabbedPane tabb;
    private JCheckBox chkFlagKardex;
    private JCheckBox chkServicioTransporte;
    private JComboBox cboTipo;
    private JComboBox cboMoneda;
    private JTextField txtPrecio1;
    private JTextField txtPrecio2;
    private JTextField txtPrecio3;
    private JTextField txtPrecio4;
    private JTextField txtPrecio5;
    private JTextField txtPrecio6;
    private JComboBox cboSunat;
    private final Logger logger = Logger.getLogger(UiRegisterItemResumen.class);

    public UiRegisterItemResumen(Main frm, Usuario usuario) {
        super(frm);
        this.usuario = usuario;
        inicialize();
        initListener();
    }

    public UiRegisterItemResumen(Dialog arg0, Usuario usuario) {
        super(arg0);
        this.usuario = usuario;
        inicialize();
        initListener();
    }

    private void inicialize() {
        JPanel pnlDialog = new JPanel();
        pnlDialog.setLayout(new BorderLayout());
        pnlDialog.setBackground(new Color(245, 245, 245));

        tabb = new JTabbedPane();

        tabb.addTab("Datos de Item", getPnlDatos());
        pnlDialog.add(tabb, BorderLayout.CENTER);
        setTitleName("Item");
        setRegister(pnlDialog);
        setMinimumSize(new Dimension(700, 400));
        this.pack();
        ComponentToolKit.centerComponentPosicion(this);
    }

    private void initListener() {
        cb_tipoOperIgv.addItemListener(this);
        txtFuncion.addFocusListener(this);
        if (txtPrecio1 != null) {
            txtPrecio1.addFocusListener(this);
            txtPrecio2.addFocusListener(this);
            txtPrecio3.addFocusListener(this);
            txtPrecio4.addFocusListener(this);
            txtPrecio5.addFocusListener(this);
            txtPrecio6.addFocusListener(this);
        }
    }

    private JPanel getPnlDatos() {
        JPanel pnlGeneral = new JPanel();
        pnlGeneral.setLayout(new BorderLayout());
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
        JLabel lblCodigo = new JLabel("Cod. Item");
        pnl.add(lblCodigo, gbc);

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
        txtAlterno.setEditable(Constans.IS_BUSQUEDA_ITEM_ALTERNO);
        txtAlterno.setColumns(5);
        pnl.add(txtAlterno, gbc);

        //
        gbc.gridx = 0;
        gbc.gridy = 1;
        JLabel lblFamilia = new JLabel("Familia");
        pnl.add(lblFamilia, gbc);

        gbc.gridx = 1;
        cboFamilia = new JComboBox();
        cboFamilia.addItemListener(this);
        pnl.add(cboFamilia, gbc);

        //
        gbc.gridx = 2;
        JLabel lbl_subfamilia = new JLabel("SubFamilia");
        pnl.add(lbl_subfamilia, gbc);

        gbc.gridx = 3;
        cboSubfamilia = new JComboBox();
        cboSubfamilia.setEnabled(false);
        cboSubfamilia.addItemListener(this);
        pnl.add(cboSubfamilia, gbc);

        gbc.gridx = 0;
        gbc.gridy = 2;
        JLabel lblMarca = new JLabel("Marca");
        pnl.add(lblMarca, gbc);

        gbc.gridx = 1;
        cboMarca = new JComboBox();
        cboMarca.addKeyListener(this);
        cboMarca.addActionListener(this);
        pnl.add(cboMarca, gbc);
        //
        gbc.gridx = 0;
        gbc.gridy = 3;
        JLabel lblDescripcion = new JLabel("Descripción");
        pnl.add(lblDescripcion, gbc);

        gbc.gridx = 1;
        txtDescripcion = new JTextField();
        txtDescripcion.addKeyListener(this);
        txtDescripcion.addFocusListener(this);
        txtDescripcion.setDocument(new UpperCaseNumberDocument(255));
        gbc.gridwidth = 3;
        gbc.fill = GridBagConstraints.HORIZONTAL;
        pnl.add(txtDescripcion, gbc);
        gbc.gridwidth = 1;
        gbc.fill = GridBagConstraints.NONE;

        gbc.gridx = 0;
        gbc.gridy = 4;
        JLabel lblTipo = new JLabel("Tipo");
        pnl.add(lblTipo, gbc);

        gbc.gridx = 1;
        cboTipo = new JComboBox();
        //Llenar
        cboTipo.addItem("Producto");
        cboTipo.addItem("Concepto");
        cboTipo.addItem("Transporte");
        pnl.add(cboTipo, gbc);

        gbc.gridx = 2;
        chkFlagKardex = new JCheckBox("Kardex");
        chkFlagKardex.setSelected(true);
        chkFlagKardex.setEnabled(false);
        pnl.add(chkFlagKardex, gbc);

        gbc.gridx = 3;
        chkServicioTransporte = new JCheckBox("Serv.Transporte");
        chkServicioTransporte.setSelected(false);
        chkServicioTransporte.setEnabled(false);
        pnl.add(chkServicioTransporte, gbc);
        cboTipo.addActionListener(this);

        gbc.gridx = 0;
        gbc.gridy = 5;
        JLabel lblSunat = new JLabel("Codigo Sunat");
        pnl.add(lblSunat, gbc);

        gbc.gridx = 1;
        gbc.gridwidth = 4;
        cboSunat = new JComboBox();
        pnl.add(cboSunat, gbc);
        gbc.gridwidth = 1;

        gbc.gridx = 0;
        gbc.gridy = 6;
        JLabel lblCliente = new JLabel("Cliente");
        if (Constans.IS_ITEM_BY_CLIENTE_COLOR) {
            pnl.add(lblCliente, gbc);
        }

        gbc.gridx = 1;
        gbc.gridwidth = 4;
        cboColor = new JComboBox();
        if (Constans.IS_ITEM_BY_CLIENTE_COLOR) {
            pnl.add(cboColor, gbc);
        }
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

        JLabel lblUnidadStock = new JLabel("Unidad Medida");
        pnl.add(lblUnidadStock, gbc);

        gbc.gridx = 1;
        cboUnidadStock = new JComboBox();
        cboUnidadStock.addActionListener(this);
        cboUnidadStock.addKeyListener(this);
        pnl.add(cboUnidadStock, gbc);

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
            gbc.gridy = 1;
            pnl.add(lblComposicion, gbc);
            gbc.gridx = 1;
            pnl.add(txtComposicion, gbc);
            gbc.gridx = 0;
            gbc.gridy = 2;
            pnl.add(lblFuncion, gbc);
            gbc.gridx = 1;
            pnl.add(txtFuncion, gbc);
            gbc.fill = GridBagConstraints.NONE;
        } else if (Constans.IS_ITEM_BY_CLIENTE) {
            gbc.fill = GridBagConstraints.HORIZONTAL;
            gbc.gridx = 0;
            gbc.gridy = 1;
            lblFuncion.setText("Cod Cliente");
            pnl.add(lblFuncion, gbc);
            gbc.gridx = 1;
            pnl.add(txtFuncion, gbc);
            gbc.fill = GridBagConstraints.NONE;
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

        JLabel lblSujetoPercepcion = new JLabel("Suj. Percepción");
        pnl.add(lblSujetoPercepcion, gbc);

        gbc.gridx = 1;
        chkSujetoPercepcion = new CCheckBox("");
        chkSujetoPercepcion.setEnabled(false);
        chkSujetoPercepcion.addKeyListener(this);
        pnl.add(chkSujetoPercepcion, gbc);

        gbc.gridx = 0;
        gbc.gridy = 1;
        JLabel lbl_flagAfectoIgv = new JLabel("Afecto a IGV");
        pnl.add(lbl_flagAfectoIgv, gbc);

        gbc.gridx = 1;
        cb_tipoOperIgv = new JComboBox();
        cb_tipoOperIgv.addItem("AFECTO");
        cb_tipoOperIgv.addItem("INAFECTO");
        cb_tipoOperIgv.addItem("EXONERADO");
        chkFlagAfectoIgv = new CCheckBox("");
        //chkFlagAfectoIgv.addKeyListener(this);
        pnl.add(cb_tipoOperIgv, gbc);

        gbc.gridx = 0;
        gbc.gridy = 2;
        JLabel lbl_porIGV = new JLabel("Porc. IGV");
        pnl.add(lbl_porIGV, gbc);

        gbc.gridx = 1;
        txtPorIGV = new JTextField();
        txtPorIGV.setHorizontalAlignment(4);
        txtPorIGV.setDocument(new DoubleDocument());
        txtPorIGV.addFocusListener(this);
        txtPorIGV.addKeyListener(this);
        txtPorIGV.setColumns(3);
        pnl.add(txtPorIGV, gbc);

        gbc.gridx = 0;
        gbc.gridy = 3;
        JLabel lbl_porISC = new JLabel("Porc. Perc");
        pnl.add(lbl_porISC, gbc);

        gbc.gridx = 1;
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
        JLabel lbl_StockMin = new JLabel("Stock Min");
        pnl.add(lbl_StockMin, gbc);

        gbc.gridx = 1;
        txtStockMin = new JTextField();
        txtStockMin.setEnabled(true);
        txtStockMin.setHorizontalAlignment(4);
        txtStockMin.addKeyListener(this);
        txtStockMin.setDocument(new DoubleDocument());
        txtStockMin.setText("0");
        txtStockMin.addFocusListener(this);
        txtStockMin.setColumns(3);
        pnl.add(txtStockMin, gbc);
        return pnlGral;
    }

    private void loadClaseSunat() throws Exception {
        try {
            logger.debug("loadClaseSunat()");
            BeanSubFamilia subFamilia = (BeanSubFamilia) LoadComboItem.getObjectCombo(cboSubfamilia);
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

    @Override
    public void loadCombo() {
        try {
            if (Constans.IS_ITEM_BY_CLIENTE_COLOR) {
                LoadComboItem.loadComboColor(path, cboColor, usuario);
            }
            loadMarca();
            LoadComboItem.loadComboFamilia(path, cboFamilia, usuario);
            loadUnidadMedida();
            this.pack();
            if (cboMoneda != null) {
                LoadCombo.loadMonedaItem(path, cboMoneda, Constans.ITEM_INIT, 0);
            }
        } catch (Exception e) {
            ExceptionHandler.handleException(e, logger);
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }

    private void loadSubFamilia() {
        try {
            cboSubfamilia.removeAllItems();
            String idFamilia = this.getIdFamilia();
            if (Util.isBlank(idFamilia)) {
                cboSubfamilia.setEnabled(false);
                return;
            }
            if (mode == UPDATE || mode == INSERT || mode == CLONE) {
                cboSubfamilia.setEnabled(true);
            }
            LoadComboItem.loadComboFamilia(path, cboSubfamilia, idFamilia);
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }

    private void loadMarca() {
        try {
            RnMarca regla_Marca = new RnMarca(path);

            if (listMarca != null) {
                listMarca.clear();
            } else {
                listMarca = new ArrayList<BeanMarca>();
            }

            listMarca.addAll(regla_Marca.listarGeneral(usuario.getCodempresa()));

            cboMarca.removeAllItems();
            cboMarca.addItem("--- Seleccione una Marca ---");

            for (int i = 0; i < listMarca.size(); i++) {
                cboMarca.addItem(listMarca.get(i).getDescripcion());
            }

            cboMarca.setSelectedIndex(0);
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }

    private void loadUnidadMedida() {
        try {
            RnUnidadMedida reglaUnidadMedida = new RnUnidadMedida(path);

            if (listUm != null) {
                listUm.clear();
            } else {
                listUm = new ArrayList();
            }

            listUm.addAll(reglaUnidadMedida.listar("", "", "", usuario.getCodempresa()));
            cboUnidadStock.removeAllItems();
            cboUnidadStock.removeAllItems();
            cboUnidadStock.addItem("--- Seleccione U.M. ---");

            for (Integer i = 0; i < listUm.size(); i++) {
                cboUnidadStock.addItem(listUm.get(i).getAbreviatura());
            }
            cboUnidadStock.setSelectedIndex(0);
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }

    private String getIdUm() {
        if (cboUnidadStock.getSelectedIndex() > 0) {
            return listUm.get(cboUnidadStock.getSelectedIndex() - 1).getIdUm();
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
        BeanSubFamilia beanSubFamilia = (BeanSubFamilia) LoadComboItem.getObjectCombo(cboSubfamilia);
        if (beanSubFamilia == null) {
            return "";
        }
        return beanSubFamilia.getIdSubFamilia();
    }

    private String getIdMarca() {
        if (cboMarca.getSelectedIndex() > 0) {
            return listMarca.get(cboMarca.getSelectedIndex() - 1).getIdMarca();
        }
        return "";
    }

    private BeanItem getBeanItem() throws Exception {
        try {
            BeanItem beanItem = new BeanItem();
            beanItem.setIdItem(txtCodigoItem.getText());
            beanItem.setIdAlterno(txtAlterno.getText());
            beanItem.setIdEmpresa(usuario.getCodempresa());
            beanItem.setDescripcion(txtDescripcion.getText());
            BeanUnidadMedida beanUm = new BeanUnidadMedida(this.getIdUm());
            beanItem.setBeanUmStock(beanUm);
            beanItem.setBeanFamilia(new BeanFamilia(this.getIdFamilia()));
            beanItem.setBeanColor(new BeanColor(LoadComboItem.getIdCombo(cboColor)));
            beanItem.setBeanSubFamilia(new BeanSubFamilia(this.getIdSubFamilia()));
            beanItem.setBeanMarca(new BeanMarca(this.getIdMarca()));
            beanItem.setFlagIgv(this.getSelected(chkFlagAfectoIgv.isSelected()));
            beanItem.setFlagPercepcion(this.getSelected(chkSujetoPercepcion.isSelected()));
            beanItem.setPigv(txtPorIGV.getText().trim().length() > 0 ? new BigDecimal(txtPorIGV.getText()) : BigDecimal.ZERO);
            beanItem.setpIsc(txtPorISC.getText().trim().length() > 0 ? new BigDecimal(txtPorISC.getText()) : BigDecimal.ZERO);
            beanItem.setFlagKardex(this.getSelected(chkFlagKardex.isSelected()));
            beanItem.setFlagTransporte(this.getSelected(chkServicioTransporte.isSelected()));
            beanItem.setTipoItem(cboTipo.getSelectedItem().toString().substring(0, 1));
            beanItem.setEstado(Constans.ESTADO_ACTIVO);
            beanItem.setIdUsuario(usuario.getId_usuario());
            beanItem.setTipoOperacionIgv(this.cb_tipoOperIgv.getSelectedItem().toString());
            if (Constans.ISBOTICA || Constans.IS_BOTICA_SIN_LOTE) {
                beanItem.setComposicion(txtComposicion.getText());
                beanItem.setFuncion(txtFuncion.getText());
                beanItem.setStockMin(this.getStockNumber());
            } else if (Constans.IS_ITEM_BY_CLIENTE) {
                beanItem.setComposicion(this.getIdMoneda());
                beanItem.setFuncion(txtFuncion.getText());
                beanItem.setStockMin(0);
            } else {
                beanItem.setComposicion("");
                beanItem.setFuncion("");
                beanItem.setStockMin(0);
            }
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

    private Double getStockNumber() {
        try {
            return Double.parseDouble(txtStockMin.getText());
        } catch (Exception e) {
            return Double.parseDouble("0");
        }
    }

    private String getSelected(boolean sel) {
        if (sel) {
            return "S";
        }
        return "N";
    }

    private void cargarMarca(String id_marca) throws Exception {
        try {
            for (int i = 0; i < listMarca.size(); i++) {
                if (listMarca.get(i).getIdMarca().equals(id_marca)) {
                    cboMarca.setSelectedIndex(i + 1);
                    return;
                }
            }
        } catch (Exception e) {
            throw e;
        }
    }

    private void cargarUnidadMedida(String id_um) throws Exception {
        try {
            for (int i = 0; i < listUm.size(); i++) {
                if (listUm.get(i).getIdUm().equals(id_um)) {
                    cboUnidadStock.setSelectedIndex(i + 1);
                    return;
                }
            }
        } catch (Exception e) {
            throw e;
        }
    }

    @Override
    public void newRegister() {
        //chkFlagAfectoIgv.setSelected(true);
        loadIgv();
        if (Constans.IS_ITEM_BY_CLIENTE || Constans.IS_ITEM_RESUMEN_PRECIO) {
            txtPrecio1.setText("0");
            txtPrecio2.setText("0");
            txtPrecio3.setText("0");
            txtPrecio4.setText("0");
            txtPrecio5.setText("0");
            txtPrecio6.setText("0");
        }
    }

    @Override
    public String executeInsert() {
        try {
            RnItem logicItem = new RnItem(path);
            return logicItem.insertItemResumen(this.getBeanItem(), this.getPrecioItem());
        } catch (Exception e) {
            ExceptionHandler.handleException(e, logger);
            JOptionPane.showMessageDialog(this, "Error: " + e.getMessage(), "Cliente", JOptionPane.OK_OPTION);
            return "";
        }
    }

    @Override
    public void focusGained(FocusEvent e) {
        if (e.getSource() instanceof JTextField) {
            ((JTextField) e.getSource()).selectAll();
        }
    }

    @Override
    public void keyPressed(KeyEvent e) {
        if (e.getKeyCode() == KeyEvent.VK_ESCAPE) {
            dispose();
        }

        if (e.getKeyChar() == '\n') {

            if (e.getSource() == cboFamilia) {
                if (cboSubfamilia.isEnabled()) {
                    cboSubfamilia.requestFocus();
                }
            }

            if (e.getSource() == txtDescripcion) {
                cboUnidadStock.requestFocus();
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
            cboMarca.setBorder(txt.getBorder());
            txtDescripcion.setBorder(txt.getBorder());
            cboUnidadStock.setBorder(txt.getBorder());
            if (cboFamilia.getSelectedIndex() == 0) {
                JOptionPane.showMessageDialog(this, "Para " + namemode + " un Item, debes "
                        + "especificar su Familia.", "Datos incompletos de Item", JOptionPane.CANCEL_OPTION);
                cboFamilia.setBorder(new LineBorder(Color.RED));
                cboFamilia.requestFocus();
                return false;
            }

            if (cboMarca.getSelectedIndex() == 0) {
                JOptionPane.showMessageDialog(this, "Para " + namemode + " un Item, debes "
                        + "especificar su Marca.", "Datos incompletos de Item", JOptionPane.CANCEL_OPTION);
                cboMarca.setBorder(new LineBorder(Color.RED));
                cboMarca.requestFocus();
                return false;
            }
            if (txtDescripcion.getText().trim().length() == 0) {
                JOptionPane.showMessageDialog(this, "Para " + namemode + " un Item, debes "
                        + "especificar su Descripcion.", "Datos incompletos de Item", JOptionPane.CANCEL_OPTION);
                txtDescripcion.setBorder(new LineBorder(Color.RED));
                txtDescripcion.requestFocus();
                return false;
            }
            if (txtAlterno.isEditable() && txtAlterno.getText().trim().length() == 0) {
                JOptionPane.showMessageDialog(this, "Para " + namemode + " un Item, debes "
                        + "especificar un codigo alterno.", "Datos incompletos de Item", JOptionPane.CANCEL_OPTION);
                txtAlterno.setBorder(new LineBorder(Color.RED));
                txtAlterno.requestFocus();
                return false;
            }
            if (cboUnidadStock.getSelectedIndex() == 0) {
                JOptionPane.showMessageDialog(this, "Para " + namemode + " un Item, debes "
                        + "especificar su U. Stock.", "Datos incompletos de Item", JOptionPane.CANCEL_OPTION);
                cboUnidadStock.setBorder(new LineBorder(Color.RED));
                cboUnidadStock.requestFocus();
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
            txtAlterno.setText(beanItem.getIdAlterno());
            txtDescripcion.setText(beanItem.getDescripcion());
            LoadComboItem.setComboFamiliaItem(beanItem.getBeanFamilia().getIdFamilia(), cboFamilia);
            cargarMarca(beanItem.getBeanMarca().getIdMarca());
            LoadComboItem.setComboSubFamiliaItem(beanItem.getBeanSubFamilia().getIdSubFamilia(), cboSubfamilia);
            cargarUnidadMedida(beanItem.getBeanUmCompra().getIdUm());
            cboTipo.setSelectedIndex(beanItem.getTipoItem().equals("T") ? 2 : (beanItem.getTipoItem().equals("C") ? 1 : 0));
            chkFlagAfectoIgv.setSelected(beanItem.getFlagIgv().equals("S"));
            cb_tipoOperIgv.setSelectedItem(beanItem.getTipoOperacionIgv());
            chkSujetoPercepcion.setSelected(beanItem.getFlagPercepcion().equals("S"));
            txtPorIGV.setText(beanItem.getPigv().toString());
            txtPorISC.setText(beanItem.getpIsc().toString());
            chkFlagKardex.setSelected(beanItem.getFlagKardex().equals("S"));
            chkServicioTransporte.setSelected(beanItem.getFlagTransporte().equals("S"));
            txtComposicion.setText(beanItem.getComposicion());
            txtFuncion.setText(beanItem.getFuncion());
            txtStockMin.setText(String.valueOf(beanItem.getStockMin()));
            setTitlePersonal();
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            JOptionPane.showMessageDialog(this, e.getMessage());
            return false;
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
            if (cb_tipoOperIgv.getSelectedItem().equals("AFECTO")) {
                txtPorIGV.setEditable(true);
                txtPorIGV.setText(LoadDataGenerica.getPorcIgv(path, usuario).toString());
                this.chkFlagAfectoIgv.setSelected(true);
            } else {
                txtPorIGV.setEditable(false);
                txtPorIGV.setText("0");
                this.chkFlagAfectoIgv.setSelected(false);
            }
        } catch (Exception e) {
            e.printStackTrace();
            txtPorIGV.setText("0");
        }
    }

    @Override
    public String executeUpdate() {
        return "";
    }

    @Override
    public boolean executeDelete() {
        return false;
    }

    @Override
    public void actionPerformed(ActionEvent e) {
        if (cboFamilia == e.getSource()) {
            loadSubFamilia();
        }

        if (e.getSource() == cboTipo) {
            if (cboTipo.getSelectedIndex() == 0) {
                chkFlagKardex.setSelected(true);
                chkServicioTransporte.setSelected(false);
            } else if (cboTipo.getSelectedIndex() == 1) {
                chkFlagKardex.setSelected(false);
                chkServicioTransporte.setSelected(false);
            } else {
                chkFlagKardex.setSelected(false);
                chkServicioTransporte.setSelected(true);
            }
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
    }

    @Override
    public boolean executeSelect() {
        return true;
    }

    @Override
    public void itemStateChanged(ItemEvent e) {
        try {
            if (e.getSource().equals(this.cb_tipoOperIgv)) {
                this.loadIgv();
            }
            if (e.getSource().equals(cboFamilia)) {
                loadSubFamilia();
            }
            if (e.getSource().equals(cboSubfamilia)) {
                this.loadClaseSunat();
            }
        } catch (Exception ex) {
            ExceptionHandler.handleException(ex, logger);
            JOptionPane.showMessageDialog(this, ex.getMessage());
        }
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
}
