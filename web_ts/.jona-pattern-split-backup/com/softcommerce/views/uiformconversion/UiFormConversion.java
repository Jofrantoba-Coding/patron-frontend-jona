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

    private final Usuario usuario;
    private final Logger logger = Logger.getLogger(UiFormConversion.class);
    private ComboModelAlmacen modelCbAlmacen;
    private ComboModelCorrelativoUsuario modelCbCorrelativoUsuarioSalida;
    private ComboModelCorrelativoUsuario modelCbCorrelativoUsuarioIngreso;
    private ComboModelBeanItem modelCbItemOrigen;
    private ComboModelBeanItem modelCbItemDestino;
    private JDialog dialogContenerdor;
    private TableModelLoteConversion modelConversion;
    private BigDecimal factorConversion = BigDecimal.ZERO;

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

    private void inicialize() {
        loadSerieSalida();
        loadSerieIngreso();
    }

    private void resetForm() {
        loadSerieSalida();
        loadSerieIngreso();
        loadItemsOrigen();
    }

    private void initListener() {
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
        try {
            RnCorrelativo regla_correlativo = new RnCorrelativo(Main.path);
            ArrayList<UsuarioCorrelativo> lst_serie = new ArrayList();
            lst_serie.addAll(regla_correlativo.listarCorrelativo(Main.usuario.getId_usuario(), Main.usuario.getCodpuntoventa(), "NS"));
            modelCbCorrelativoUsuarioSalida.setData(lst_serie);
            this.cbSerieSalida.setModel(modelCbCorrelativoUsuarioSalida);
            if (lst_serie.size() > 0) {
                cbSerieSalida.setSelectedIndex(0);
                mostrarPreimpresoSalida();
            }
        } catch (Exception e) {
            ExceptionHandler.handleException(e, logger);
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }

    public void loadSerieIngreso() {
        try {
            RnCorrelativo regla_correlativo = new RnCorrelativo(Main.path);
            ArrayList<UsuarioCorrelativo> lst_serie = new ArrayList();
            lst_serie.addAll(regla_correlativo.listarCorrelativo(Main.usuario.getId_usuario(), Main.usuario.getCodpuntoventa(), "NI"));
            modelCbCorrelativoUsuarioIngreso.setData(lst_serie);
            this.cbSerieEntrada.setModel(modelCbCorrelativoUsuarioIngreso);
            if (lst_serie.size() > 0) {
                cbSerieEntrada.setSelectedIndex(0);
                mostrarPreimpresoIngreso();
            }
        } catch (Exception e) {
            ExceptionHandler.handleException(e, logger);
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }

    public void mostrarPreimpresoSalida() {
        try {
            RnCorrelativo regla_correlativo = new RnCorrelativo(Main.path);
            String lsSeriePreimpreso;
            UsuarioCorrelativo bean = (UsuarioCorrelativo) modelCbCorrelativoUsuarioSalida.getElement(cbSerieSalida.getSelectedIndex());
            lsSeriePreimpreso = regla_correlativo.listarPreimpreso(bean.getIdCorrelativo());
            this.txtSerieSalida.setText(Util.getPreimpresoValue(lsSeriePreimpreso));
        } catch (Exception e) {
            ExceptionHandler.handleException(e, logger);
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }

    public void mostrarPreimpresoIngreso() {
        try {
            RnCorrelativo regla_correlativo = new RnCorrelativo(Main.path);
            String lsSeriePreimpreso;
            UsuarioCorrelativo bean = (UsuarioCorrelativo) modelCbCorrelativoUsuarioIngreso.getElement(cbSerieEntrada.getSelectedIndex());
            lsSeriePreimpreso = regla_correlativo.listarPreimpreso(bean.getIdCorrelativo());
            String preim = lsSeriePreimpreso;
            String pre = "0000000000" + preim;
            this.txtSerieIngreso.setText(pre.substring(pre.length() - 10, pre.length()));
        } catch (Exception e) {
            ExceptionHandler.handleException(e, logger);
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
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

    private void initLoadConversion() {
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
        RnAlmacen logicAlmacen = new RnAlmacen(Main.path);
        try {
            ArrayList<BeanAlmacen> list = (ArrayList) logicAlmacen.listarAlmacen(null, Main.usuario.getCodempresa(), Main.usuario.getCodpuntoventa());
            modelCbAlmacen.setData(list);
            cbAlmacen.setModel(modelCbAlmacen);
            if (list.size() > 0) {
                cbAlmacen.setSelectedIndex(0);
                loadItemsOrigen();
            }
        } catch (Exception ex) {
            ExceptionHandler.handleException(ex, logger);
        }
    }

    public void loadItemsOrigen() {
        try {
            RnItem logic = new RnItem(Main.path);
            ArrayList<BeanItem> lista;
            lista = logic.listarProductoPorAlmacen(Main.usuario.getCodlocalidad(), modelCbAlmacen.getElement(this.cbAlmacen.getSelectedIndex()).getIdAlmacen());
            modelCbItemOrigen.setData(lista);
            cbItemOrigen.setModel(modelCbItemOrigen);
            if (lista.size() > 0) {
                cbItemOrigen.setSelectedIndex(0);
                cbItemOrigen.getEditor().setItem(cbItemOrigen.getSelectedItem());
                this.mostraDataOrigen();
                this.loadItemsDestino(modelCbItemOrigen.getElement(cbItemOrigen.getSelectedIndex()).getIdItem());
            }
        } catch (Exception ex) {
            ExceptionHandler.handleException(ex, logger);
        }
    }

    public void setLoadItemsOrigen(String idItemDestino) {
        try {
            RnItem logic = new RnItem(Main.path);
            ArrayList<BeanItem> lista;
            lista = logic.listarProductoPorDestino(Main.usuario.getCodlocalidad(), modelCbAlmacen.getElement(this.cbAlmacen.getSelectedIndex()).getIdAlmacen(), idItemDestino);
            modelCbItemOrigen.setData(lista);
            cbItemOrigen.setModel(modelCbItemOrigen);
            if (lista.size() > 0) {
                cbItemOrigen.setSelectedIndex(0);
                cbItemOrigen.getEditor().setItem(cbItemOrigen.getSelectedItem());
                this.mostraDataOrigen();
            }
        } catch (Exception ex) {
            ExceptionHandler.handleException(ex, logger);
        }
    }

    public void loadItemsDestino(String idItemOrigen) {
        try {
            RnItem logic = new RnItem(Main.path);
            ArrayList<BeanItem> lista;
            lista = logic.listarProductoPorOrigen(Main.usuario.getCodlocalidad(), modelCbAlmacen.getElement(this.cbAlmacen.getSelectedIndex()).getIdAlmacen(), idItemOrigen);
            modelCbItemDestino.setData(lista);
            cbItemDestino.setModel(modelCbItemDestino);
            if (lista.size() > 0) {
                cbItemDestino.setSelectedIndex(0);
                cbItemDestino.getEditor().setItem(cbItemDestino.getSelectedItem());
                this.mostraDataDestino();
            }
        } catch (Exception ex) {
            ExceptionHandler.handleException(ex, logger);
        }
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
    private void initComponents() {
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

    private javax.swing.JButton btnConvertir;
    private javax.swing.ButtonGroup btnGroupOption;
    private javax.swing.JComboBox cbAlmacen;
    private JComboBoxAutocomplete cbItemDestino;
    private JComboBoxAutocomplete cbItemOrigen;
    private javax.swing.JComboBox cbSerieEntrada;
    private javax.swing.JComboBox cbSerieSalida;
    private com.toedter.calendar.JDateChooser dcFechaIngreso;
    private javax.swing.JLabel jLabel1;
    private javax.swing.JLabel jLabel10;
    private javax.swing.JLabel jLabel11;
    private javax.swing.JLabel lblFactorDestino;
    private javax.swing.JLabel jLabel13;
    private javax.swing.JLabel lblCierreFactorDestino;
    private javax.swing.JLabel jLabel15;
    private javax.swing.JLabel lblLineaDivide;
    private javax.swing.JLabel jLabel17;
    private javax.swing.JLabel jLabel18;
    private javax.swing.JLabel jLabel19;
    private javax.swing.JLabel jLabel2;
    private javax.swing.JLabel jLabel20;
    private javax.swing.JLabel jLabel21;
    private javax.swing.JLabel jLabel22;
    private javax.swing.JLabel jLabel3;
    private javax.swing.JLabel jLabel4;
    private javax.swing.JLabel jLabel5;
    private javax.swing.JLabel jLabel6;
    private javax.swing.JLabel jLabel7;
    private javax.swing.JLabel jLabel8;
    private javax.swing.JLabel jLabel9;
    private javax.swing.JPanel jPanel1;
    private javax.swing.JPanel jPanel10;
    private javax.swing.JPanel jPanel11;
    private javax.swing.JPanel jPanel12;
    private javax.swing.JPanel jPanel13;
    private javax.swing.JPanel jPanel14;
    private javax.swing.JPanel pnlFactorConversion;
    private javax.swing.JPanel pnlFactorDestino;
    private javax.swing.JPanel pnlFactorOrigen;
    private javax.swing.JPanel jPanel18;
    private javax.swing.JPanel pnlDestino;
    private javax.swing.JPanel jPanel2;
    private javax.swing.JPanel jPanel20;
    private javax.swing.JPanel jPanel21;
    private javax.swing.JPanel jPanel22;
    private javax.swing.JPanel jPanel3;
    private javax.swing.JPanel jPanel4;
    private javax.swing.JPanel jPanel5;
    private javax.swing.JPanel jPanel6;
    private javax.swing.JPanel jPanel7;
    private javax.swing.JPanel jPanel8;
    private javax.swing.JPanel jPanel9;
    private javax.swing.JRadioButton optAutomatico;
    private javax.swing.JRadioButton optFactorConversion;
    private javax.swing.JRadioButton optManual;
    private javax.swing.JPanel pnlTablaLote;
    private javax.swing.JScrollPane scrlLote;
    private JTable tblLotes;
    private javax.swing.JTextField txtCantidadDestino;
    private javax.swing.JButton btnCalcularLoteDestino;
    private javax.swing.JTextField txtCantidadOrigen;
    private javax.swing.JTextField txtFactorDestino;
    private javax.swing.JTextField txtFactorOrigen;
    private javax.swing.JTextField txtItemDestino;
    private javax.swing.JTextField txtItemOrigen;
    private javax.swing.JTextField txtSerieIngreso;
    private javax.swing.JTextField txtSerieSalida;
    private javax.swing.JTextField txtStockDestino;
    private javax.swing.JTextField txtStockOrigen;
    private javax.swing.JLabel lblFactorRendimiento;
    private javax.swing.JLabel lblFactorRendimientoCierre;
    private javax.swing.JTextField txtFactorRendimiento;

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
        if (optAutomatico.isSelected() || optFactorConversion.isSelected()) {
            if (this.txtFactorDestino.getText() != null && !this.txtFactorDestino.getText().isEmpty()
                    && this.txtFactorOrigen.getText() != null && !this.txtFactorOrigen.getText().isEmpty()
                    && BigDecimal.valueOf(Double.parseDouble(this.txtFactorOrigen.getText())).compareTo(BigDecimal.ZERO) == 1) {
                BigDecimal valorDestino = BigDecimal.valueOf(Double.parseDouble(this.txtFactorDestino.getText()));
                BigDecimal valorOrigen = BigDecimal.valueOf(Double.parseDouble(this.txtFactorOrigen.getText()));
                BigDecimal cantidadOrigen = BigDecimal.valueOf(Double.parseDouble(this.txtCantidadOrigen.getText().isEmpty() ? "0" : this.txtCantidadOrigen.getText()));
                BigDecimal cantidadDestino = cantidadOrigen.multiply(valorDestino).divide(valorOrigen);
                this.txtCantidadDestino.setText(cantidadDestino.toString());
            }
        }
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

    private boolean validateDatos() {
        if (Util.isBlank(txtSerieSalida.getText().trim())) {
            JOptionPane.showMessageDialog(this, "No tiene asignado serie de nota de salida");
            return false;
        }
        if (Util.isBlank(txtSerieIngreso.getText().trim())) {
            JOptionPane.showMessageDialog(this, "No tiene asignado serie de nota de Ingreso");
            return false;
        }
        if (Util.isBlank(txtItemOrigen.getText().trim())) {
            JOptionPane.showMessageDialog(this, "Seleccione Item Origen");
            return false;
        }
        if (!this.validateStockOrigen()) {
            JOptionPane.showMessageDialog(this, "No hay stock de Origen");
            return false;
        }
        if (!this.validateCantidadOrigen()) {
            JOptionPane.showMessageDialog(this, "Ingrese Cantidad de Origen mayor que cero");
            return false;
        }
        if (!this.validateCantidadStockOrigen()) {
            JOptionPane.showMessageDialog(this, "Cantidad de Origen debe ser menor al Stock de origen");
            return false;
        }
        return true;
    }

    private boolean validateStockOrigen() {
        BigDecimal stockOrigen = Util.getNumberBigDecimal(txtStockOrigen.getText().trim());
        return stockOrigen.compareTo(BigDecimal.ZERO) == 1;
    }

    private boolean validateCantidadOrigen() {
        BigDecimal cantidadOrigen = Util.getNumberBigDecimal(txtCantidadOrigen.getText().trim());
        return cantidadOrigen.compareTo(BigDecimal.ZERO) == 1;
    }

    private boolean validateCantidadStockOrigen() {
        BigDecimal stockOrigen = Util.getNumberBigDecimal(txtStockOrigen.getText().trim());
        BigDecimal cantidadConvertir = Util.getNumberBigDecimal(txtCantidadOrigen.getText().trim());
        return cantidadConvertir.compareTo(stockOrigen) != 1;
    }

    private void guardarConversion() {
        try {
            if (!this.validateDatos()) {
                return;
            }
            this.guardarConversionBd();
            if (this.dialogContenerdor != null) {
                this.dialogContenerdor.dispose();
            } else {
                resetForm();
            }
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, e.getMessage());
            ExceptionHandler.handleException(e, logger);
        }
    }

    private void guardarConversionBd() throws Exception {
        try {
            BeanConversion beanConversion = this.getBeanConversion();
            RnConversion rnConversion = new RnConversion(Main.path);
            if (Constans.ISBOTICA) {
                beanConversion.setMapLotes(this.getMapLotes());
                rnConversion.insertarConversionLote(beanConversion);
            } else {
                rnConversion.insertarConversion(beanConversion);
            }
            LogicStock logicStock = new LogicStock(Main.path);
            logicStock.regularizarStock(Main.anio);
            JOptionPane.showMessageDialog(this, "Registrado Correctamente");
        } catch (Exception e) {
            throw e;
        }
    }

    private Map<String, List<Lote>> getMapLotes() throws Exception {
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

    private String getIdAlmacen() {
        return modelCbAlmacen.getElement(this.cbAlmacen.getSelectedIndex()).getIdAlmacen();
    }

    private BeanConversion getBeanConversion() throws Exception {
        try {
            BeanConversion beanConversion = new BeanConversion();
            RnAlmacen rnAlmacen = new RnAlmacen(Main.path);
            beanConversion.setAlmacen(rnAlmacen.cargarAlmacen(this.getIdAlmacen(), ""));
            beanConversion.setFecha(dcFechaIngreso.getDate());
            beanConversion.setIdTipoDocOrigen(TipoDocVentaEnum.ORDEN_RECOJO.getValue());
            UsuarioCorrelativo userCorrelativoOrigen = modelCbCorrelativoUsuarioSalida.getElement(cbSerieSalida.getSelectedIndex());
            beanConversion.setIdCorrelativoOrigen(userCorrelativoOrigen.getIdCorrelativo());
            beanConversion.setSerieOrigen(userCorrelativoOrigen.getSerie());
            beanConversion.setPreimpresoOrigen(userCorrelativoOrigen.getPreimpreso());
            beanConversion.setIdTipoDocDestino(TipoDocVentaEnum.NOTA_INGRESO.getValue());
            UsuarioCorrelativo userCorrelativoDestino = modelCbCorrelativoUsuarioIngreso.getElement(cbSerieEntrada.getSelectedIndex());
            beanConversion.setIdCorrelativoDestino(userCorrelativoDestino.getIdCorrelativo());
            beanConversion.setSerieDestino(userCorrelativoDestino.getSerie());
            beanConversion.setPreimpresoDestino(userCorrelativoDestino.getPreimpreso());
            beanConversion.setIdTipoMovOrigen(TipoMovInventarioEnum.SALIDA_CONVERSION.getValue());
            beanConversion.setIdTipoMovDestino(TipoMovInventarioEnum.INGRESO_CONVERSION.getValue());
            RnItem rnItem = new RnItem(Main.path);
            beanConversion.setBeanItemOrigen(rnItem.cargarItem(txtItemOrigen.getText().trim(), "", false, Constans.ESTADO_ACTIVO));
            beanConversion.setBeanItemDestino(rnItem.cargarItem(txtItemDestino.getText().trim(), "", false, Constans.ESTADO_ACTIVO));
            beanConversion.setIdUsuario(usuario.getId_usuario());
            beanConversion.setIdPeriodoMensual(Util.getIdPeriodoMensual(beanConversion.getFecha()));
            beanConversion.setCantidadOrigen(Util.getNumberBigDecimal(txtCantidadOrigen.getText().trim()));
            beanConversion.setCantidadDestino(Util.getNumberBigDecimal(txtCantidadDestino.getText().trim()));
            return beanConversion;
        } catch (Exception e) {
            throw e;
        }
    }

    private List<Lote> getLotesInsertar() throws Exception {
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

    private List<Lote> getLotesConversion() throws Exception {
        try {
            LogicLote logicLote = new LogicLote(Main.path);
            List<Lote> lotes = logicLote.lotesConversion(txtItemOrigen.getText().trim(), this.getIdAlmacen());
            return lotes;
        } catch (Exception e) {
            throw e;
        }
    }

    private void recalcularLoteDestino() {
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

    private void calcularFactorConversion() {
        if (this.optAutomatico.isSelected() || this.optFactorConversion.isSelected()) {
            if (!Util.isBlank(this.txtFactorDestino.getText())) {
                BigDecimal valorDestino = BigDecimal.valueOf(Double.parseDouble(this.txtFactorDestino.getText()));
                BigDecimal valorOrigen = BigDecimal.valueOf(Double.parseDouble(this.txtFactorOrigen.getText()));
                factorConversion = valorDestino.divide(valorOrigen);
            }
        } else if (this.optManual.isSelected()) {
            if (!this.txtCantidadOrigen.getText().isEmpty()
                    && !this.txtCantidadDestino.getText().isEmpty()) {
                BigDecimal cantidadOrigen = new BigDecimal(this.txtCantidadOrigen.getText());
                BigDecimal cantidadDestino = new BigDecimal(this.txtCantidadDestino.getText());
                if (cantidadOrigen.compareTo(BigDecimal.ZERO) != 0 && cantidadDestino.compareTo(BigDecimal.ZERO) != 0) {
                    factorConversion = cantidadDestino.divide(cantidadOrigen, new MathContext(18, RoundingMode.HALF_UP)).setScale(5, RoundingMode.HALF_UP);
                } else {
                    factorConversion = BigDecimal.ZERO;
                }
            } else {
                factorConversion = BigDecimal.ZERO;
            }
        }
        this.txtFactorRendimiento.setText(factorConversion.toString());
    }

    private void mostrarInterfaceAutomatico() {
        mostraDataOrigen();
        this.pnlTablaLote.setVisible(false);
        this.txtCantidadDestino.setEditable(false);
        this.txtFactorDestino.setEditable(!Constans.ISBOTICA);
        this.txtFactorOrigen.setEditable(false);
        this.lblLineaDivide.setVisible(true);
        this.txtCantidadDestino.setVisible(true);
        this.pnlFactorDestino.setVisible(true);
        this.pnlFactorOrigen.setVisible(true);
        this.lblFactorRendimiento.setVisible(false);
        this.lblFactorRendimientoCierre.setVisible(false);
        this.txtFactorRendimiento.setVisible(true);
        this.txtFactorRendimiento.setEditable(false);
        this.txtCantidadOrigen.setEditable(true);
        this.btnCalcularLoteDestino.setVisible(false);
    }

    private void mostrarInterfaceFactorConversion() {
        mostraDataOrigen();
        this.pnlTablaLote.setVisible(true);
        this.txtCantidadDestino.setEditable(true);
        this.txtCantidadDestino.setEnabled(true);
        this.lblLineaDivide.setVisible(true);
        this.pnlFactorDestino.setVisible(true);
        this.pnlFactorOrigen.setVisible(true);
        this.lblFactorRendimiento.setVisible(false);
        this.lblFactorRendimientoCierre.setVisible(false);
        this.txtFactorRendimiento.setVisible(true);
        this.txtFactorRendimiento.setEditable(false);
        this.txtCantidadOrigen.setEditable(false);
        this.btnCalcularLoteDestino.setVisible(false);
    }

    private void mostrarInterfaceRendimiento() {
        mostraDataOrigen();
        this.pnlTablaLote.setVisible(true);
        this.txtCantidadDestino.setEditable(true);
        this.txtCantidadDestino.setEnabled(true);
        this.lblLineaDivide.setVisible(false);
        this.pnlFactorDestino.setVisible(false);
        this.pnlFactorOrigen.setVisible(false);
        this.lblFactorRendimiento.setVisible(true);
        this.lblFactorRendimientoCierre.setVisible(true);
        this.txtFactorRendimiento.setVisible(true);
        this.txtFactorRendimiento.setEditable(false);
        this.txtCantidadOrigen.setEditable(false);
        this.btnCalcularLoteDestino.setVisible(true);
    }

    public BigDecimal getFactorConversion() {
        return factorConversion;
    }

    public void setFactorConversion(BigDecimal factorConversion) {
        this.factorConversion = factorConversion;
    }

}
