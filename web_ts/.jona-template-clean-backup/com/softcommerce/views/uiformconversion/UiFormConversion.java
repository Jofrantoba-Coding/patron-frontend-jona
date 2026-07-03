package com.softcommerce.views.uiformconversion;


import com.softcommerce.gui.*;
import com.softcommerce.beans.BeanAlmacen;
import com.softcommerce.beans.BeanConversion;
import com.softcommerce.beans.BeanItem;
import com.softcommerce.beans.Lote;
import com.softcommerce.beans.Usuario;
import com.softcommerce.beans.UsuarioCorrelativo;
import com.softcommerce.comboboxmodel.ComboModelAlmacen;
import com.softcommerce.comboboxmodel.ComboModelBeanItem;
import com.softcommerce.comboboxmodel.ComboModelCorrelativoUsuario;
import com.softcommerce.conta.tablas.TableModelLoteConversion;
import com.softcommerce.enums.TipoDocVentaEnum;
import com.softcommerce.enums.TipoMovInventarioEnum;
import com.softcommerce.formularios.Main;
import com.softcommerce.general.controles.DoubleDocument;
import com.softcommerce.logic.LogicLote;
import com.softcommerce.logic.LogicStock;
import com.softcommerce.reglasnegocio.RnAlmacen;
import com.softcommerce.reglasnegocio.RnConversion;
import com.softcommerce.reglasnegocio.RnCorrelativo;
import com.softcommerce.reglasnegocio.RnItem;
import com.softcommerce.util.Constans;
import com.softcommerce.util.ExceptionHandler;
import com.softcommerce.util.combo.JComboBoxAutocomplete;
import com.softcommerce.util.Util;
import com.toedter.calendar.JDateChooser;
import java.awt.BorderLayout;
import java.awt.Dimension;
import java.awt.FlowLayout;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.FocusEvent;
import java.awt.event.FocusListener;
import java.awt.event.ItemEvent;
import java.awt.event.ItemListener;
import java.awt.event.KeyEvent;
import java.awt.event.KeyListener;
import java.math.BigDecimal;
import java.math.MathContext;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import javax.swing.ButtonGroup;
import javax.swing.JButton;
import javax.swing.JComboBox;
import javax.swing.JDialog;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import javax.swing.JRadioButton;
import javax.swing.JScrollPane;
import javax.swing.JTable;
import javax.swing.JTextField;
import javax.swing.text.JTextComponent;
import org.apache.log4j.Logger;

public class UiFormConversion
        extends JPanel
        implements InterUiFormConversion, ItemListener, KeyListener, ActionListener, FocusListener {

    protected final Usuario usuario;
    protected final Logger logger = Logger.getLogger(UiFormConversion.class);
    protected ComboModelAlmacen modelCbAlmacen;
    protected ComboModelCorrelativoUsuario modelCbCorrelativoUsuarioSalida;
    protected ComboModelCorrelativoUsuario modelCbCorrelativoUsuarioIngreso;
    protected ComboModelBeanItem modelCbItemOrigen;
    protected ComboModelBeanItem modelCbItemDestino;
    protected JDialog dialogContenerdor;
    protected TableModelLoteConversion modelConversion;
    protected BigDecimal factorConversion = BigDecimal.ZERO;

    public UiFormConversion(Usuario usuario) {
        this.usuario = usuario;
        initComponents();
        initLoadConversion();
        this.inicialize();
        initListener();
    }

    public UiFormConversion(Usuario usuario, JDialog dialogContenerdor) {
        this.usuario = usuario;
        this.dialogContenerdor = dialogContenerdor;
        initComponents();
        initLoadConversion();
        this.inicialize();
        initListener();
    }

    protected void inicialize() {
        loadSerieSalida();
        loadSerieIngreso();
    }

    protected void resetForm() {
        loadSerieSalida();
        loadSerieIngreso();
        loadItemsOrigen();
    }

    protected void initListener() {
        cbSerieSalida.addItemListener(this);
        cbSerieEntrada.addItemListener(this);
        cbItemOrigen.addItemListener(this);
        cbItemDestino.addItemListener(this);
        cbAlmacen.addItemListener(this);
        cbItemOrigen.getEditor().getEditorComponent().addKeyListener(this);
        cbItemDestino.getEditor().getEditorComponent().addKeyListener(this);
        txtCantidadOrigen.addKeyListener(this);
        txtCantidadOrigen.addFocusListener(this);
        btnConvertir.addActionListener(this);
        btnCalcularLoteDestino.addActionListener(this);
        optAutomatico.addActionListener(this);
        optManual.addActionListener(this);
        optFactorConversion.addActionListener(this);
    }

    public void loadSerieSalida() {
    }

    public void loadSerieIngreso() {
    }

    public void mostrarPreimpresoSalida() {
    }

    public void mostrarPreimpresoIngreso() {
    }

    public void mostraDataOrigen() {
        try {
            if (modelCbItemOrigen == null) {
                return;
            }
            BeanItem bean = modelCbItemOrigen.getElement(cbItemOrigen.getSelectedIndex());
            ((JTextComponent) cbItemOrigen.getEditor().getEditorComponent()).setText(bean.getDescripcion());
            this.txtStockOrigen.setText(bean.getStockActual().toString());
            this.txtItemOrigen.setText(bean.getIdItem());
            if (dialogContenerdor != null) {
                this.txtFactorDestino.setText(bean.getValorConversion().toString());
                this.txtFactorOrigen.setText(bean.getValorOrigen().toString());
            }
            this.modelConversion.setData(getLotesConversion());
            calcularFactorConversion();
            clearTextConversion();
        } catch (Exception ex) {
            ExceptionHandler.handleException(ex, logger);
            clearTextConversion();
        }
    }

    public void mostraDataDestino() {
        try {
            BeanItem bean = modelCbItemDestino.getElement(cbItemDestino.getSelectedIndex());
            ((JTextComponent) cbItemDestino.getEditor().getEditorComponent()).setText(bean.getDescripcion());
            this.txtItemDestino.setText(bean.getIdItem());
            this.txtStockDestino.setText(bean.getStockActual().toString());
            if (dialogContenerdor == null) {
                this.txtFactorDestino.setText(bean.getValorConversion().toString());
                this.txtFactorOrigen.setText(bean.getValorOrigen().toString());
            }
            clearTextConversion();
        } catch (Exception ex) {
            ExceptionHandler.handleException(ex, logger);
            clearTextConversion();
        }
    }

    public void clearTextConversion() {
        this.txtCantidadOrigen.setText(null);
        this.txtCantidadOrigen.setText("0.0");
        this.txtCantidadDestino.setText(null);
        this.txtCantidadDestino.setText("0.0");
    }

    protected void initLoadConversion() {
        mostrarInterfaceAutomatico();
        modelCbAlmacen = new ComboModelAlmacen();
        modelCbCorrelativoUsuarioSalida = new ComboModelCorrelativoUsuario();
        modelCbCorrelativoUsuarioIngreso = new ComboModelCorrelativoUsuario();
        modelCbItemOrigen = new ComboModelBeanItem();
        modelCbItemDestino = new ComboModelBeanItem();
    }

    public void setAlmacenItem(BeanAlmacen beanAlmacen) {
        ArrayList<BeanAlmacen> list = new ArrayList();
        list.add(beanAlmacen);
        modelCbAlmacen.setData(list);
        cbAlmacen.setModel(modelCbAlmacen);
        if (list.size() > 0) {
            cbAlmacen.setSelectedIndex(0);
        }
    }

    public void loadAlmacen() {
    }

    public void loadItemsOrigen() {
    }

    public void setLoadItemsOrigen(String idItemDestino) {
    }

    public void loadItemsDestino(String idItemOrigen) {
    }

    public void setLoadItemsDestino(BeanItem beanItemDestino) {
        try {
            ArrayList<BeanItem> lista = new ArrayList();
            lista.add(beanItemDestino);
            modelCbItemDestino.setData(lista);
            cbItemDestino.setModel(modelCbItemDestino);
            if (lista.size() > 0) {
                cbItemDestino.setSelectedIndex(0);
                cbItemDestino.getEditor().setItem(cbItemDestino.getSelectedItem());
                this.mostraDataOrigen();
            }
        } catch (Exception ex) {
            ExceptionHandler.handleException(ex, logger);
        }
    }

    @SuppressWarnings("unchecked")
    protected void initComponents() {
        java.awt.GridBagConstraints gridBagConstraints;

        btnGroupOption = new javax.swing.ButtonGroup();
        jPanel2 = new javax.swing.JPanel();
        jLabel1 = new javax.swing.JLabel();
        cbAlmacen = new javax.swing.JComboBox();
        jLabel20 = new javax.swing.JLabel();
        dcFechaIngreso = new com.toedter.calendar.JDateChooser();
        jPanel3 = new javax.swing.JPanel();
        jPanel1 = new javax.swing.JPanel();
        jLabel2 = new javax.swing.JLabel();
        jPanel5 = new javax.swing.JPanel();
        jPanel8 = new javax.swing.JPanel();
        jLabel4 = new javax.swing.JLabel();
        cbSerieSalida = new javax.swing.JComboBox();
        txtSerieSalida = new javax.swing.JTextField();
        jPanel10 = new javax.swing.JPanel();
        jLabel7 = new javax.swing.JLabel();
        jLabel8 = new javax.swing.JLabel();
        txtItemOrigen = new javax.swing.JTextField();
        cbItemOrigen = new JComboBoxAutocomplete();
        jLabel21 = new javax.swing.JLabel();
        txtStockOrigen = new javax.swing.JTextField();
        jPanel4 = new javax.swing.JPanel();
        jLabel3 = new javax.swing.JLabel();
        jPanel6 = new javax.swing.JPanel();
        jPanel7 = new javax.swing.JPanel();
        jLabel5 = new javax.swing.JLabel();
        cbSerieEntrada = new javax.swing.JComboBox();
        txtSerieIngreso = new javax.swing.JTextField();
        jPanel11 = new javax.swing.JPanel();
        jLabel9 = new javax.swing.JLabel();
        jLabel10 = new javax.swing.JLabel();
        txtItemDestino = new javax.swing.JTextField();
        cbItemDestino = new JComboBoxAutocomplete();
        jLabel22 = new javax.swing.JLabel();
        txtStockDestino = new javax.swing.JTextField();
        jPanel9 = new javax.swing.JPanel();
        jLabel6 = new javax.swing.JLabel();
        jPanel12 = new javax.swing.JPanel();
        jPanel13 = new javax.swing.JPanel();
        optAutomatico = new javax.swing.JRadioButton();
        optManual = new javax.swing.JRadioButton();
        optFactorConversion = new javax.swing.JRadioButton();
        jPanel14 = new javax.swing.JPanel();
        pnlFactorConversion = new javax.swing.JPanel();
        pnlFactorDestino = new javax.swing.JPanel();
        lblFactorDestino = new javax.swing.JLabel();
        txtFactorDestino = new javax.swing.JTextField();
        lblCierreFactorDestino = new javax.swing.JLabel();
        pnlFactorOrigen = new javax.swing.JPanel();
        jLabel13 = new javax.swing.JLabel();
        txtFactorOrigen = new javax.swing.JTextField();
        jLabel15 = new javax.swing.JLabel();
        lblLineaDivide = new javax.swing.JLabel();
        jPanel18 = new javax.swing.JPanel();
        jLabel17 = new javax.swing.JLabel();
        txtCantidadOrigen = new javax.swing.JTextField();
        txtCantidadOrigen.setDocument(new DoubleDocument());
        jLabel18 = new javax.swing.JLabel();
        pnlDestino = new javax.swing.JPanel();
        jLabel11 = new javax.swing.JLabel();
        jPanel20 = new javax.swing.JPanel();
        txtCantidadDestino = new javax.swing.JTextField();
        jLabel19 = new javax.swing.JLabel();
        jPanel21 = new javax.swing.JPanel();
        jPanel22 = new javax.swing.JPanel();
        btnConvertir = new javax.swing.JButton();
        pnlTablaLote = new javax.swing.JPanel();
        scrlLote = new javax.swing.JScrollPane();
        tblLotes = new JTable();

        this.setLayout(new javax.swing.BoxLayout(this, javax.swing.BoxLayout.Y_AXIS));

        jLabel1.setText("ALMACEN");
        jPanel2.add(jLabel1);

        cbAlmacen.setPreferredSize(new java.awt.Dimension(350, 28));
        jPanel2.add(cbAlmacen);

        jLabel20.setText("FECHA DE INGRESO");
        jPanel2.add(jLabel20);

        dcFechaIngreso.setDate(new java.util.Date());
        dcFechaIngreso.setDateFormatString("dd/MM/yyyy");
        dcFechaIngreso.setPreferredSize(new java.awt.Dimension(130, 28));
        jPanel2.add(dcFechaIngreso);

        this.add(jPanel2);

        jPanel3.setLayout(new java.awt.BorderLayout());

        jPanel1.setBorder(javax.swing.BorderFactory.createEtchedBorder());
        jPanel1.setLayout(new java.awt.BorderLayout());

        jLabel2.setHorizontalAlignment(javax.swing.SwingConstants.CENTER);
        jLabel2.setText("SALIDA");
        jLabel2.setBorder(null);
        jPanel1.add(jLabel2, java.awt.BorderLayout.NORTH);

        jPanel5.setBorder(null);
        jPanel5.setLayout(new javax.swing.BoxLayout(jPanel5, javax.swing.BoxLayout.Y_AXIS));

        jLabel4.setText("NS");
        jPanel8.add(jLabel4);

        cbSerieSalida.setPreferredSize(new java.awt.Dimension(100, 28));
        jPanel8.add(cbSerieSalida);

        txtSerieSalida.setEditable(false);
        txtSerieSalida.setColumns(12);
        txtSerieSalida.setEnabled(false);
        jPanel8.add(txtSerieSalida);

        jPanel5.add(jPanel8);

        jPanel10.setBorder(javax.swing.BorderFactory.createTitledBorder("ITEM ORIGEN"));
        jPanel10.setLayout(new java.awt.GridBagLayout());
        gridBagConstraints = new java.awt.GridBagConstraints();

        jLabel7.setText("ID ITEM");
        gridBagConstraints.gridx = 0;
        gridBagConstraints.gridy = 0;
        gridBagConstraints.fill = java.awt.GridBagConstraints.BOTH;
        gridBagConstraints.insets = new java.awt.Insets(5, 5, 5, 5);
        jPanel10.add(jLabel7, gridBagConstraints);

        jLabel8.setText("DESCRIPCION");
        gridBagConstraints.gridx = 1;
        gridBagConstraints.gridy = 0;
        gridBagConstraints.fill = java.awt.GridBagConstraints.BOTH;
        gridBagConstraints.insets = new java.awt.Insets(5, 5, 5, 5);
        jPanel10.add(jLabel8, gridBagConstraints);

        txtItemOrigen.setColumns(8);
        txtItemOrigen.setEditable(false);
        txtItemOrigen.setEnabled(false);
        gridBagConstraints.gridx = 0;
        gridBagConstraints.gridy = 1;
        gridBagConstraints.fill = java.awt.GridBagConstraints.BOTH;
        gridBagConstraints.insets = new java.awt.Insets(5, 5, 5, 5);
        jPanel10.add(txtItemOrigen, gridBagConstraints);

        cbItemOrigen.setPreferredSize(new java.awt.Dimension(300, 28));
        gridBagConstraints.gridx = 1;
        gridBagConstraints.gridy = 1;
        gridBagConstraints.fill = java.awt.GridBagConstraints.BOTH;
        gridBagConstraints.insets = new java.awt.Insets(5, 5, 5, 5);
        jPanel10.add(cbItemOrigen, gridBagConstraints);

        jLabel21.setText("STOCK");
        gridBagConstraints.gridx = 0;
        gridBagConstraints.gridy = 2;
        gridBagConstraints.fill = java.awt.GridBagConstraints.BOTH;
        gridBagConstraints.insets = new java.awt.Insets(5, 5, 5, 5);
        jPanel10.add(jLabel21, gridBagConstraints);

        txtStockOrigen.setEditable(false);
        txtStockOrigen.setEnabled(false);
        gridBagConstraints.gridx = 1;
        gridBagConstraints.gridy = 2;
        gridBagConstraints.fill = java.awt.GridBagConstraints.BOTH;
        gridBagConstraints.insets = new java.awt.Insets(5, 5, 5, 5);
        jPanel10.add(txtStockOrigen, gridBagConstraints);

        jPanel5.add(jPanel10);

        jPanel1.add(jPanel5, java.awt.BorderLayout.CENTER);

        jPanel3.add(jPanel1, java.awt.BorderLayout.WEST);

        jPanel4.setBorder(javax.swing.BorderFactory.createEtchedBorder());
        jPanel4.setLayout(new java.awt.BorderLayout());

        jLabel3.setHorizontalAlignment(javax.swing.SwingConstants.CENTER);
        jLabel3.setText("INGRESO");
        jPanel4.add(jLabel3, java.awt.BorderLayout.NORTH);

        jPanel6.setLayout(new javax.swing.BoxLayout(jPanel6, javax.swing.BoxLayout.Y_AXIS));

        jLabel5.setText("NI");
        jPanel7.add(jLabel5);

        cbSerieEntrada.setPreferredSize(new java.awt.Dimension(100, 28));
        jPanel7.add(cbSerieEntrada);

        txtSerieIngreso.setEditable(false);
        txtSerieIngreso.setColumns(12);
        txtSerieIngreso.setEnabled(false);
        jPanel7.add(txtSerieIngreso);

        jPanel6.add(jPanel7);

        jPanel11.setBorder(javax.swing.BorderFactory.createTitledBorder("ITEM DESTINO"));
        jPanel11.setLayout(new java.awt.GridBagLayout());

        jLabel9.setText("ID ITEM");
        gridBagConstraints = new java.awt.GridBagConstraints();
        gridBagConstraints.gridx = 0;
        gridBagConstraints.gridy = 0;
        gridBagConstraints.fill = java.awt.GridBagConstraints.BOTH;
        gridBagConstraints.insets = new java.awt.Insets(5, 5, 5, 5);
        jPanel11.add(jLabel9, gridBagConstraints);

        jLabel10.setText("DESCRIPCION");
        gridBagConstraints = new java.awt.GridBagConstraints();
        gridBagConstraints.gridx = 1;
        gridBagConstraints.gridy = 0;
        gridBagConstraints.fill = java.awt.GridBagConstraints.BOTH;
        gridBagConstraints.insets = new java.awt.Insets(5, 5, 5, 5);
        jPanel11.add(jLabel10, gridBagConstraints);

        txtItemDestino.setColumns(8);
        txtItemDestino.setEditable(false);
        txtItemDestino.setEnabled(false);
        gridBagConstraints = new java.awt.GridBagConstraints();
        gridBagConstraints.gridx = 0;
        gridBagConstraints.gridy = 1;
        gridBagConstraints.fill = java.awt.GridBagConstraints.BOTH;
        gridBagConstraints.insets = new java.awt.Insets(5, 5, 5, 5);
        jPanel11.add(txtItemDestino, gridBagConstraints);

        cbItemDestino.setPreferredSize(new java.awt.Dimension(300, 28));
        gridBagConstraints = new java.awt.GridBagConstraints();
        gridBagConstraints.gridx = 1;
        gridBagConstraints.gridy = 1;
        gridBagConstraints.fill = java.awt.GridBagConstraints.BOTH;
        gridBagConstraints.insets = new java.awt.Insets(5, 5, 5, 5);
        jPanel11.add(cbItemDestino, gridBagConstraints);

        jLabel22.setText("STOCK");
        gridBagConstraints = new java.awt.GridBagConstraints();
        gridBagConstraints.gridx = 0;
        gridBagConstraints.gridy = 2;
        gridBagConstraints.fill = java.awt.GridBagConstraints.BOTH;
        gridBagConstraints.insets = new java.awt.Insets(5, 5, 5, 5);
        jPanel11.add(jLabel22, gridBagConstraints);

        txtStockDestino.setEditable(false);
        txtStockDestino.setEnabled(false);
        gridBagConstraints = new java.awt.GridBagConstraints();
        gridBagConstraints.gridx = 1;
        gridBagConstraints.gridy = 2;
        gridBagConstraints.fill = java.awt.GridBagConstraints.BOTH;
        gridBagConstraints.insets = new java.awt.Insets(5, 5, 5, 5);
        jPanel11.add(txtStockDestino, gridBagConstraints);

        jPanel6.add(jPanel11);

        jPanel4.add(jPanel6, java.awt.BorderLayout.CENTER);

        jPanel3.add(jPanel4, java.awt.BorderLayout.EAST);

        jPanel9.setLayout(new java.awt.GridBagLayout());

        jLabel6.setText(">>>");
        jPanel9.add(jLabel6, new java.awt.GridBagConstraints());

        jPanel3.add(jPanel9, java.awt.BorderLayout.CENTER);
        this.add(jPanel3);

        jPanel12.setLayout(new javax.swing.BoxLayout(jPanel12, javax.swing.BoxLayout.Y_AXIS));

        btnGroupOption.add(optAutomatico);
        optAutomatico.setSelected(true);
        optAutomatico.setText("AUTOMATICO");
        this.optAutomatico.setVisible(true);
        jPanel13.add(optAutomatico);

        btnGroupOption.add(optFactorConversion);
        optFactorConversion.setText("POR FACTOR DE CONVERSION");
        this.optFactorConversion.setVisible(true);
        jPanel13.add(optFactorConversion);

        btnGroupOption.add(optManual);
        optManual.setText("POR RENDIMIENTO");
        this.optManual.setVisible(true);
        jPanel13.add(optManual);

        jPanel14.setBorder(javax.swing.BorderFactory.createTitledBorder("CONVERSION"));
        JPanel pnlFormula = new JPanel();
        pnlFormula.setLayout(new BorderLayout());
        jPanel14.setLayout(new javax.swing.BoxLayout(jPanel14, javax.swing.BoxLayout.Y_AXIS));

        pnlFactorConversion.setLayout(new java.awt.BorderLayout());

        pnlFactorDestino.setLayout(new java.awt.FlowLayout(java.awt.FlowLayout.CENTER));

        lblFactorDestino.setText("FACTOR DE DESTINO(");
        pnlFactorDestino.add(lblFactorDestino);

        txtFactorDestino.setEditable(!Constans.ISBOTICA);
        txtFactorDestino.setColumns(6);
        txtFactorDestino.setEnabled(!Constans.ISBOTICA);
        pnlFactorDestino.add(txtFactorDestino);

        lblCierreFactorDestino.setText(")");
        pnlFactorDestino.add(lblCierreFactorDestino);

        pnlFactorConversion.add(pnlFactorDestino, java.awt.BorderLayout.NORTH);

        pnlFactorOrigen.setLayout(new java.awt.FlowLayout(java.awt.FlowLayout.CENTER));

        jLabel13.setText("FACTOR DE ORIGEN(");
        pnlFactorOrigen.add(jLabel13);

        txtFactorOrigen.setEditable(false);
        txtFactorOrigen.setColumns(6);
        txtFactorOrigen.setEnabled(false);
        pnlFactorOrigen.add(txtFactorOrigen);

        jLabel15.setText(")");
        pnlFactorOrigen.add(jLabel15);

        pnlFactorConversion.add(pnlFactorOrigen, java.awt.BorderLayout.SOUTH);
        JPanel pnlAux = new JPanel();
        pnlAux.setLayout(new FlowLayout(FlowLayout.CENTER));
        lblLineaDivide.setText("----------------------------------------------------------------");
        lblFactorRendimiento = new JLabel();
        lblFactorRendimientoCierre = new JLabel();
        txtFactorRendimiento = new JTextField();
        txtFactorRendimiento.setColumns(6);
        lblFactorRendimiento.setText("FACTOR DE RENDIMIENTO(");
        lblFactorRendimientoCierre.setText(")");
        pnlAux.add(lblLineaDivide);
        pnlAux.add(lblFactorRendimiento);
        pnlAux.add(txtFactorRendimiento);
        pnlAux.add(lblFactorRendimientoCierre);
        pnlFactorConversion.add(pnlAux, java.awt.BorderLayout.CENTER);

        jLabel17.setText("CANTIDAD ORIGEN(");
        jPanel18.add(jLabel17);

        txtCantidadOrigen.setColumns(6);
        txtCantidadOrigen.setDocument(new DoubleDocument());
        jPanel18.add(txtCantidadOrigen);

        jLabel18.setText(") X");
        jPanel18.add(jLabel18);

        pnlFactorConversion.add(jPanel18, java.awt.BorderLayout.LINE_START);

        pnlFormula.add(pnlFactorConversion, java.awt.BorderLayout.CENTER);

        pnlDestino.setLayout(new java.awt.FlowLayout(FlowLayout.RIGHT));

        jLabel11.setText("= CANTIDAD DESTINO (");
        pnlDestino.add(jLabel11);

        txtCantidadDestino.setEditable(false);
        txtCantidadDestino.setColumns(6);
        txtCantidadDestino.setEnabled(false);

        pnlDestino.add(txtCantidadDestino);

        jLabel19.setText(")");
        pnlDestino.add(jLabel19);
        btnCalcularLoteDestino = new javax.swing.JButton("Calcular Lote Destino");
        pnlDestino.add(btnCalcularLoteDestino);

        pnlFactorConversion.add(pnlDestino, java.awt.BorderLayout.LINE_END);
        jPanel14.add(jPanel13);
        jPanel14.add(pnlFormula);
        jPanel14.add(this.pnlTablaLote);

        jPanel12.add(jPanel14);

        jPanel21.setLayout(new java.awt.FlowLayout(FlowLayout.CENTER));

        btnConvertir.setText("CONVERTIR");
        jPanel22.add(btnConvertir);

        jPanel21.add(jPanel22);
        pnlTablaLote.setLayout(new javax.swing.BoxLayout(pnlTablaLote, javax.swing.BoxLayout.Y_AXIS));
        scrlLote.setViewportView(tblLotes);
        scrlLote.setPreferredSize(new Dimension(0, 200));

        pnlTablaLote.add(scrlLote);

        this.add(jPanel12);
        this.add(jPanel21);
        modelConversion = new TableModelLoteConversion(tblLotes, txtCantidadOrigen, this);
    }

    protected javax.swing.JButton btnConvertir;
    protected javax.swing.ButtonGroup btnGroupOption;
    protected javax.swing.JComboBox cbAlmacen;
    protected JComboBoxAutocomplete cbItemDestino;
    protected JComboBoxAutocomplete cbItemOrigen;
    protected javax.swing.JComboBox cbSerieEntrada;
    protected javax.swing.JComboBox cbSerieSalida;
    protected com.toedter.calendar.JDateChooser dcFechaIngreso;
    protected javax.swing.JLabel jLabel1;
    protected javax.swing.JLabel jLabel10;
    protected javax.swing.JLabel jLabel11;
    protected javax.swing.JLabel lblFactorDestino;
    protected javax.swing.JLabel jLabel13;
    protected javax.swing.JLabel lblCierreFactorDestino;
    protected javax.swing.JLabel jLabel15;
    protected javax.swing.JLabel lblLineaDivide;
    protected javax.swing.JLabel jLabel17;
    protected javax.swing.JLabel jLabel18;
    protected javax.swing.JLabel jLabel19;
    protected javax.swing.JLabel jLabel2;
    protected javax.swing.JLabel jLabel20;
    protected javax.swing.JLabel jLabel21;
    protected javax.swing.JLabel jLabel22;
    protected javax.swing.JLabel jLabel3;
    protected javax.swing.JLabel jLabel4;
    protected javax.swing.JLabel jLabel5;
    protected javax.swing.JLabel jLabel6;
    protected javax.swing.JLabel jLabel7;
    protected javax.swing.JLabel jLabel8;
    protected javax.swing.JLabel jLabel9;
    protected javax.swing.JPanel jPanel1;
    protected javax.swing.JPanel jPanel10;
    protected javax.swing.JPanel jPanel11;
    protected javax.swing.JPanel jPanel12;
    protected javax.swing.JPanel jPanel13;
    protected javax.swing.JPanel jPanel14;
    protected javax.swing.JPanel pnlFactorConversion;
    protected javax.swing.JPanel pnlFactorDestino;
    protected javax.swing.JPanel pnlFactorOrigen;
    protected javax.swing.JPanel jPanel18;
    protected javax.swing.JPanel pnlDestino;
    protected javax.swing.JPanel jPanel2;
    protected javax.swing.JPanel jPanel20;
    protected javax.swing.JPanel jPanel21;
    protected javax.swing.JPanel jPanel22;
    protected javax.swing.JPanel jPanel3;
    protected javax.swing.JPanel jPanel4;
    protected javax.swing.JPanel jPanel5;
    protected javax.swing.JPanel jPanel6;
    protected javax.swing.JPanel jPanel7;
    protected javax.swing.JPanel jPanel8;
    protected javax.swing.JPanel jPanel9;
    protected javax.swing.JRadioButton optAutomatico;
    protected javax.swing.JRadioButton optFactorConversion;
    protected javax.swing.JRadioButton optManual;
    protected javax.swing.JPanel pnlTablaLote;
    protected javax.swing.JScrollPane scrlLote;
    protected JTable tblLotes;
    protected javax.swing.JTextField txtCantidadDestino;
    protected javax.swing.JButton btnCalcularLoteDestino;
    protected javax.swing.JTextField txtCantidadOrigen;
    protected javax.swing.JTextField txtFactorDestino;
    protected javax.swing.JTextField txtFactorOrigen;
    protected javax.swing.JTextField txtItemDestino;
    protected javax.swing.JTextField txtItemOrigen;
    protected javax.swing.JTextField txtSerieIngreso;
    protected javax.swing.JTextField txtSerieSalida;
    protected javax.swing.JTextField txtStockDestino;
    protected javax.swing.JTextField txtStockOrigen;
    protected javax.swing.JLabel lblFactorRendimiento;
    protected javax.swing.JLabel lblFactorRendimientoCierre;
    protected javax.swing.JTextField txtFactorRendimiento;

    public JButton getBtnConvertir() {
        return btnConvertir;
    }

    public void setBtnConvertir(JButton btnConvertir) {
        this.btnConvertir = btnConvertir;
    }

    public ButtonGroup getBtnGroupOption() {
        return btnGroupOption;
    }

    public void setBtnGroupOption(ButtonGroup btnGroupOption) {
        this.btnGroupOption = btnGroupOption;
    }

    public JComboBox getCbAlmacen() {
        return cbAlmacen;
    }

    public void setCbAlmacen(JComboBox cbAlmacen) {
        this.cbAlmacen = cbAlmacen;
    }

    public JComboBoxAutocomplete getCbItemDestino() {
        return cbItemDestino;
    }

    public void setCbItemDestino(JComboBoxAutocomplete cbItemDestino) {
        this.cbItemDestino = cbItemDestino;
    }

    public JComboBox getCbItemOrigen() {
        return cbItemOrigen;
    }

    public void setCbItemOrigen(JComboBoxAutocomplete cbItemOrigen) {
        this.cbItemOrigen = cbItemOrigen;
    }

    public JComboBox getCbSerieEntrada() {
        return cbSerieEntrada;
    }

    public void setCbSerieEntrada(JComboBox cbSerieEntrada) {
        this.cbSerieEntrada = cbSerieEntrada;
    }

    public JComboBox getCbSerieSalida() {
        return cbSerieSalida;
    }

    public void setCbSerieSalida(JComboBox cbSerieSalida) {
        this.cbSerieSalida = cbSerieSalida;
    }

    public JDateChooser getDcFechaIngreso() {
        return dcFechaIngreso;
    }

    public void setDcFechaIngreso(JDateChooser dcFechaIngreso) {
        this.dcFechaIngreso = dcFechaIngreso;
    }

    public JRadioButton getOptAutomatico() {
        return optAutomatico;
    }

    public void setOptAutomatico(JRadioButton optAutomatico) {
        this.optAutomatico = optAutomatico;
    }

    public JRadioButton getOptManual() {
        return optManual;
    }

    public void setOptManual(JRadioButton optManual) {
        this.optManual = optManual;
    }

    public JPanel getPnlTablaLote() {
        return pnlTablaLote;
    }

    public void setPnlTablaLote(JPanel pnlTablaLote) {
        this.pnlTablaLote = pnlTablaLote;
    }

    public JScrollPane getScrlLote() {
        return scrlLote;
    }

    public void setScrlLote(JScrollPane scrlLote) {
        this.scrlLote = scrlLote;
    }

    public JTable getTblLotes() {
        return tblLotes;
    }

    public void setTblLotes(JTable tblLotes) {
        this.tblLotes = tblLotes;
    }

    public JTextField getTxtCantidadDestino() {
        return txtCantidadDestino;
    }

    public void setTxtCantidadDestino(JTextField txtCantidadDestino) {
        this.txtCantidadDestino = txtCantidadDestino;
    }

    public JTextField getTxtCantidadOrigen() {
        return txtCantidadOrigen;
    }

    public void setTxtCantidadOrigen(JTextField txtCantidadOrigen) {
        this.txtCantidadOrigen = txtCantidadOrigen;
    }

    public JTextField getTxtFactorDestino() {
        return txtFactorDestino;
    }

    public void setTxtFactorDestino(JTextField txtFactorDestino) {
        this.txtFactorDestino = txtFactorDestino;
    }

    public JTextField getTxtFactorOrigen() {
        return txtFactorOrigen;
    }

    public void setTxtFactorOrigen(JTextField txtFactorOrigen) {
        this.txtFactorOrigen = txtFactorOrigen;
    }

    public JTextField getTxtItemDestino() {
        return txtItemDestino;
    }

    public void setTxtItemDestino(JTextField txtItemDestino) {
        this.txtItemDestino = txtItemDestino;
    }

    public JTextField getTxtItemOrigen() {
        return txtItemOrigen;
    }

    public void setTxtItemOrigen(JTextField txtItemOrigen) {
        this.txtItemOrigen = txtItemOrigen;
    }

    public JTextField getTxtSerieIngreso() {
        return txtSerieIngreso;
    }

    public void setTxtSerieIngreso(JTextField txtSerieIngreso) {
        this.txtSerieIngreso = txtSerieIngreso;
    }

    public JTextField getTxtSerieSalida() {
        return txtSerieSalida;
    }

    public void setTxtSerieSalida(JTextField txtSerieSalida) {
        this.txtSerieSalida = txtSerieSalida;
    }

    @Override
    public void itemStateChanged(ItemEvent e) {
        if (e.getSource().equals(cbSerieSalida)) {
            this.mostrarPreimpresoSalida();
        } else if (e.getSource().equals(cbSerieEntrada)) {
            this.mostrarPreimpresoIngreso();
        } else if (e.getSource().equals(cbItemOrigen)) {
            this.mostraDataOrigen();
            if (this.dialogContenerdor == null) {
                this.loadItemsDestino(modelCbItemOrigen.getElement(cbItemOrigen.getSelectedIndex()).getIdItem());
            }
        } else if (e.getSource().equals(cbAlmacen)) {
            loadItemsOrigen();
        } else if (e.getSource().equals(cbItemDestino)) {
            this.mostraDataDestino();
        }
    }

    public void calcularConversion() {
    }

    @Override
    public void keyTyped(KeyEvent e) {
    }

    @Override
    public void keyPressed(KeyEvent e) {
    }

    @Override
    public void keyReleased(KeyEvent e) {
        if (cbItemOrigen.getEditor().getEditorComponent().equals(e.getSource())) {
            if (e.getKeyCode() == KeyEvent.VK_ENTER) {
                cbItemOrigen.setSelectedItem(cbItemOrigen.getEditor().getItem());
            }
        } else if (cbItemDestino.getEditor().getEditorComponent().equals(e.getSource())) {
            if (e.getKeyCode() == KeyEvent.VK_ENTER) {
                cbItemDestino.setSelectedItem(cbItemDestino.getEditor().getItem());
            }
        } else if (txtCantidadOrigen.equals(e.getSource())) {
            this.calcularConversion();
        }
    }

    protected boolean validateDatos() {
        return false;
    }

    protected boolean validateStockOrigen() {
        BigDecimal stockOrigen = Util.getNumberBigDecimal(txtStockOrigen.getText().trim());
        return stockOrigen.compareTo(BigDecimal.ZERO) == 1;
    }

    protected boolean validateCantidadOrigen() {
        BigDecimal cantidadOrigen = Util.getNumberBigDecimal(txtCantidadOrigen.getText().trim());
        return cantidadOrigen.compareTo(BigDecimal.ZERO) == 1;
    }

    protected boolean validateCantidadStockOrigen() {
        BigDecimal stockOrigen = Util.getNumberBigDecimal(txtStockOrigen.getText().trim());
        BigDecimal cantidadConvertir = Util.getNumberBigDecimal(txtCantidadOrigen.getText().trim());
        return cantidadConvertir.compareTo(stockOrigen) != 1;
    }

    protected void guardarConversion() {
    }

    protected void guardarConversionBd() throws Exception {
    }

    protected Map<String, List<Lote>> getMapLotes() throws Exception {
        try {
            Map<String, List<Lote>> mapLotes = new HashMap();
            List<Lote> lotes;
            if (optAutomatico.isSelected()) {
                lotes = this.getLotesInsertar();
                for (Lote lote : lotes) {
                    List<Lote> lotesMic = mapLotes.get(lote.getIdMovimiento());
                    if (lotesMic == null) {
                        lotesMic = new ArrayList();
                    }
                    lotesMic.add(lote);
                    mapLotes.put(lote.getIdMovimiento(), lotesMic);
                }
                return mapLotes;
            } else if (optFactorConversion.isSelected()) {
                return modelConversion.getMapLotes();
            } else {
                this.recalcularLoteDestino();
                return modelConversion.getMapLotes();
            }
        } catch (Exception e) {
            throw e;
        }
    }

    protected String getIdAlmacen() {
        return modelCbAlmacen.getElement(this.cbAlmacen.getSelectedIndex()).getIdAlmacen();
    }

    protected BeanConversion getBeanConversion() throws Exception {
        return null;
    }

    protected List<Lote> getLotesInsertar() throws Exception {
        try {
            BigDecimal cantidadOrigen = Util.getNumberBigDecimal(txtCantidadOrigen.getText().trim());
            List<Lote> lotes = this.getLotesConversion();
            List<Lote> result = new ArrayList();
            for (Lote lote : lotes) {
                if (cantidadOrigen.compareTo(BigDecimal.ZERO) != 1) {
                    break;
                }
                if (cantidadOrigen.compareTo(lote.getSaldo()) == 1) {
                    cantidadOrigen = cantidadOrigen.subtract(lote.getSaldo());
                    lote.setCantidadOrigen(lote.getSaldo());
                } else {
                    lote.setCantidadOrigen(cantidadOrigen);
                    cantidadOrigen = BigDecimal.ZERO;
                }
                lote.setCantidadDestino(lote.getCantidadOrigen().multiply(this.factorConversion));
                result.add(lote);
            }
            return result;
        } catch (Exception e) {
            throw e;
        }
    }

    protected List<Lote> getLotesConversion() throws Exception {
        return null;
    }

    protected void recalcularLoteDestino() {
        this.calcularFactorConversion();
        this.modelConversion.recalcularLoteDestino();
    }

    @Override
    public void actionPerformed(ActionEvent e) {
        if (e.getSource().equals(btnConvertir)) {
            this.guardarConversion();
        } else if (e.getSource().equals(optAutomatico)) {
            mostrarInterfaceAutomatico();
        } else if (e.getSource().equals(optFactorConversion)) {
            mostrarInterfaceFactorConversion();
        } else if (e.getSource().equals(optManual)) {
            mostrarInterfaceRendimiento();
        } else if (e.getSource().equals(btnCalcularLoteDestino)) {
            recalcularLoteDestino();
        }
    }

    @Override
    public void focusGained(FocusEvent e) {
    }

    @Override
    public void focusLost(FocusEvent e) {
        if (e.getSource().equals(txtCantidadOrigen)) {
            this.calcularConversion();
        }
    }

    protected void calcularFactorConversion() {
    }

    protected void mostrarInterfaceAutomatico() {
    }

    protected void mostrarInterfaceFactorConversion() {
    }

    protected void mostrarInterfaceRendimiento() {
    }

    public BigDecimal getFactorConversion() {
        return factorConversion;
    }

    public void setFactorConversion(BigDecimal factorConversion) {
        this.factorConversion = factorConversion;
    }

}
