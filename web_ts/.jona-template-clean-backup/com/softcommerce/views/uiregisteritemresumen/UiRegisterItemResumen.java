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
    protected List<BeanUnidadMedida> listUm;
    protected JComboBox cboUnidadStock;
    protected JTextField txtComposicion;
    protected JTextField txtFuncion;
    protected JComboBox cboFamilia;
    protected JComboBox cboSubfamilia;
    protected JComboBox cboColor;
    protected List<BeanMarca> listMarca;
    protected JComboBox cboMarca;
    protected JTextField txtCodigoItem;
    protected JTextField txtAlterno;
    protected JTextField txtDescripcion;
    protected JTextField txtPorIGV;
    protected JTextField txtPorISC;
    protected JTextField txtStockMin;
    protected CCheckBox chkSujetoPercepcion;
    protected CCheckBox chkFlagAfectoIgv;
    protected JComboBox cb_tipoOperIgv;
    protected final Usuario usuario;
    protected JTabbedPane tabb;
    protected JCheckBox chkFlagKardex;
    protected JCheckBox chkServicioTransporte;
    protected JComboBox cboTipo;
    protected JComboBox cboMoneda;
    protected JTextField txtPrecio1;
    protected JTextField txtPrecio2;
    protected JTextField txtPrecio3;
    protected JTextField txtPrecio4;
    protected JTextField txtPrecio5;
    protected JTextField txtPrecio6;
    protected JComboBox cboSunat;
    protected final Logger logger = Logger.getLogger(UiRegisterItemResumen.class);

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

    protected void inicialize() {
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

    protected void initListener() {
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

    protected JPanel getPnlDatos() {
        JPanel pnlGeneral = new JPanel();
        pnlGeneral.setLayout(new BorderLayout());
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

    protected JPanel getPnlUm() {
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

    protected JPanel getPnlOtros() {
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

    protected void loadClaseSunat() throws Exception {
    }

    @Override
    public void loadCombo() {
    }

    protected void loadSubFamilia() {
    }

    protected void loadMarca() {
    }

    protected void loadUnidadMedida() {
    }

    protected String getIdUm() {
        if (cboUnidadStock.getSelectedIndex() > 0) {
            return listUm.get(cboUnidadStock.getSelectedIndex() - 1).getIdUm();
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
        if (cboMarca.getSelectedIndex() > 0) {
            return listMarca.get(cboMarca.getSelectedIndex() - 1).getIdMarca();
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

    protected Double getStockNumber() {
        try {
            return Double.parseDouble(txtStockMin.getText());
        } catch (Exception e) {
            return Double.parseDouble("0");
        }
    }

    protected String getSelected(boolean sel) {
        if (sel) {
            return "S";
        }
        return "N";
    }

    protected void cargarMarca(String id_marca) throws Exception {
    }

    protected void cargarUnidadMedida(String id_um) throws Exception {
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
        return false;
    }

    @Override
    public boolean loadRegister() {
        return false;
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
        return false;
    }

    @Override
    public void setValueSearch(Object valor, Component comp) {
    }

    @Override
    public boolean executeSelect() {
        return false;
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
        return false;
    }
}
