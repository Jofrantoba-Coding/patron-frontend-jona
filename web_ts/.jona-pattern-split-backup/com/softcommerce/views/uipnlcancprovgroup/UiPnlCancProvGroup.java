package com.softcommerce.views.uipnlcancprovgroup;


import com.softcommerce.formularios.*;
import com.softcommerce.beans.BeanAnexo;
import com.softcommerce.beans.BeanBanco;
import com.softcommerce.beans.BeanClasifBanco;
import com.softcommerce.beans.BeanCxPGroup;
import com.softcommerce.beans.BeanEmpresaCuenta;
import com.softcommerce.beans.BeanMedioPago;
import com.softcommerce.beans.BeanMoneda;
import com.softcommerce.beans.BeanRegcontaCab;
import com.softcommerce.beans.BeanTipoAnexo;
import com.softcommerce.beans.BeanTipoDocVenta;
import com.softcommerce.beans.BeanTipoOperacion;
import com.softcommerce.beans.Usuario;
import com.softcommerce.conta.formularios.FormBuscarAnexo;
import com.softcommerce.conta.formularios.FormBuscarTipoDocVenta;
import com.softcommerce.enums.AuxiliarEnum;
import com.softcommerce.enums.MesEnum;
import com.softcommerce.enums.MonedaEnum;
import com.softcommerce.general.controles.CTableGui;
import com.softcommerce.general.controles.IntegerDocument;
import com.softcommerce.general.controles.ObjectItem;
import com.softcommerce.general.controles.UpperCaseNumberDocument;
import com.softcommerce.general.tablas.TableModelCxPGroup;
import com.softcommerce.iconos.Gif;
import com.softcommerce.reglasnegocio.RnBanco;
import com.softcommerce.reglasnegocio.RnClasifBanco;
import com.softcommerce.reglasnegocio.RnConsultas;
import com.softcommerce.reglasnegocio.RnEmpresaCuenta;
import com.softcommerce.reglasnegocio.RnMedioPago;
import com.softcommerce.reglasnegocio.RnTipoDocVenta;
import com.softcommerce.reglasnegocio.RnAnexo;
import com.softcommerce.reglasnegocio.RnCliente;
import com.softcommerce.reglasnegocio.RnRegconta;
import com.softcommerce.reglasnegocio.RnTipoOperacion;
import com.softcommerce.reglasnegocio.RnTipoAnexo;
import com.softcommerce.util.ExceptionHandler;
import com.softcommerce.util.FormatObject;
import com.softcommerce.util.UtilDate;
import com.softcommerce.util.combo.LoadComboItem;
import java.awt.BorderLayout;
import java.awt.Color;
import java.awt.Component;
import java.awt.Dimension;
import java.awt.Font;
import java.awt.GridBagConstraints;
import java.awt.GridBagLayout;
import java.awt.HeadlessException;
import java.awt.Insets;
import java.awt.Toolkit;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.FocusEvent;
import java.awt.event.FocusListener;
import java.awt.event.ItemEvent;
import java.awt.event.ItemListener;
import java.awt.event.KeyEvent;
import java.awt.event.KeyListener;
import java.awt.event.MouseEvent;
import java.awt.event.MouseListener;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.List;
import javax.swing.BorderFactory;
import javax.swing.JButton;
import javax.swing.JCheckBox;
import javax.swing.JComboBox;
import javax.swing.JInternalFrame;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import javax.swing.JScrollPane;
import javax.swing.JTextField;
import javax.swing.border.Border;
import javax.swing.border.TitledBorder;
import javax.swing.event.DocumentEvent;
import javax.swing.event.DocumentListener;
import javax.swing.event.TableModelEvent;
import javax.swing.event.TableModelListener;
import org.apache.log4j.Logger;
import java.net.URL;
import java.sql.SQLException;

public class UiPnlCancProvGroup
        extends JInternalFrame
        implements InterUiPnlCancProvGroup, MouseListener, KeyListener, FocusListener, ActionListener, ItemListener, TableModelListener, DocumentListener {

    private final Usuario usuario;
    private final Main frmMain;
    private final URL path;
    private Gif gif;
    private JComboBox cboTipoAnexo;
    private JComboBox cboMoneda;
    private JComboBox cboMonedaCanc;
    private JComboBox cboClasif;
    private JComboBox cboBanco;
    private JComboBox cboEmpresaCuenta;
    private JComboBox cboMedioPago;
    private JComboBox cboMes;
    private JTextField txtAnexo;
    private JTextField txtAnexoDesc;
    private JButton btnBuscar;
    private List<BeanTipoAnexo> xTipoAnexo;
    private List<BeanClasifBanco> xClasif;
    private List<BeanMedioPago> xMedioPago;
    private List<BeanBanco> xBanco;
    private List<BeanEmpresaCuenta> xEmpresaCuenta;
    private CTableGui table;
    private TableModelCxPGroup modelTable;
    private JCheckBox chkSeleccionar;
    private JTextField txtTipoDoc;
    private JTextField txtTipoDocDesc;
    private JTextField txtSerie;
    private JTextField txtPreimpreso;
    private JButton btnGuardar;
    private List<BeanTipoOperacion> xOperacion;
    private JComboBox cboTipoOp;
    private final Logger logger = Logger.getLogger(UiPnlCancProvGroup.class);

    public UiPnlCancProvGroup(String title, URL path, Main frm, Usuario usuario) {
        super(title);
        this.path = path;
        this.usuario = usuario;
        this.frmMain = frm;
        initComponents();
    }

    private void initComponents() {
        gif = new Gif();
        JPanel pnl = new JPanel();
        pnl.setLayout(new BorderLayout());
        this.getContentPane().add(pnl);

        pnl.setLayout(new BorderLayout());
        pnl.add(getPnlNorth(), BorderLayout.NORTH);

        modelTable = new TableModelCxPGroup();
        table = new CTableGui();
        table.setFont(new Font(Font.SANS_SERIF, 0, 11));
        table.getTableHeader().setFont(new Font(Font.SANS_SERIF, 1, 11));
        table.setModel(modelTable);
        table.setAllTableNoEditable();
        table.setAllColumnNoResizable();
        table.setAllColumnPreferredWidth(15);
        table.setColumnEditable(0);
        table.setColumnEditable(13);
        table.setColumnEditable(14);
        table.setColumnEditable(15);
        table.setColumnEditable(16);
        table.setColumnEditable(17);
        table.setColumnEditable(18);
        table.setColumnEditable(19);
        table.setColumnEditable(20);
        JScrollPane scroll = new JScrollPane(table);
        scroll.setPreferredSize(new Dimension(750, 150));
        pnl.add(scroll, BorderLayout.CENTER);
        pnl.add(getPnlSouth(), BorderLayout.SOUTH);
        initListener();
        loadCombo();
        configurarInternal();
        pack();
    }

    private JPanel getPnlSouth() {
        JPanel pnl = new JPanel();
        btnGuardar = new JButton("Guardar", gif.SAVE16);
        pnl.add(btnGuardar);
        return pnl;
    }

    private void configurarInternal() {
        pack();
        setMaximizable(true);
        setResizable(true);
        setClosable(true);
        setMinimumSize(new Dimension(800, 400));
        setMaximumSize(new Dimension(1355, 592));
        setIconifiable(true);
        setLocation(((Toolkit.getDefaultToolkit().getScreenSize().width - getSize().width) / 2), (Toolkit.getDefaultToolkit().getScreenSize().height - getSize().height) / 20);
    }

    private JPanel getPnlNorth() {
        JPanel pnlPrinc = new JPanel();
        pnlPrinc.setLayout(new BorderLayout());
        JPanel pnl = new JPanel();
        pnl.setLayout(new GridBagLayout());
        pnlPrinc.add(pnl, BorderLayout.WEST);
        GridBagConstraints gbc = new GridBagConstraints();
        gbc.gridx = 0;
        gbc.gridy = 0;
        gbc.anchor = GridBagConstraints.WEST;
        gbc.insets = new Insets(2, 2, 2, 2);
        JLabel lblTipo = new JLabel("Tipo");
        pnl.add(lblTipo, gbc);
        gbc.gridx = 1;
        cboTipoAnexo = new JComboBox();
        pnl.add(cboTipoAnexo, gbc);
        gbc.gridx = 2;
        JLabel lblAnexo = new JLabel("Anexo");
        pnl.add(lblAnexo, gbc);
        gbc.gridx = 3;
        txtAnexo = new JTextField();
        txtAnexo.setDocument(new IntegerDocument(11));
        txtAnexo.setColumns(7);
        gbc.fill = GridBagConstraints.HORIZONTAL;
        gbc.insets = new Insets(2, 1, 2, 0);
        pnl.add(txtAnexo, gbc);
        gbc.fill = GridBagConstraints.NONE;

        txtAnexoDesc = new JTextField();
        txtAnexoDesc.setEnabled(false);
        txtAnexoDesc.setColumns(20);
        gbc.insets = new Insets(2, 0, 2, 0);
        gbc.gridx = 4;
        pnl.add(txtAnexoDesc, gbc);
        gbc.insets = new Insets(2, 2, 2, 2);
        gbc.gridx = 0;
        gbc.gridy = 1;
        JLabel lblMoneda = new JLabel("Moneda");
        pnl.add(lblMoneda, gbc);
        gbc.gridx = 1;
        cboMoneda = new JComboBox();
        pnl.add(cboMoneda, gbc);
        gbc.gridx = 2;
        JLabel lblMes = new JLabel("Mes");
        pnl.add(lblMes, gbc);
        gbc.gridx = 3;
        cboMes = new JComboBox();
        pnl.add(cboMes, gbc);
        btnBuscar = new JButton("Buscar", gif.SEARCH16);
        gbc.gridx = 4;
        pnl.add(btnBuscar, gbc);
        gbc.gridx = 1;
        gbc.gridy = 2;
        chkSeleccionar = new JCheckBox("Seleccionar");
        pnl.add(chkSeleccionar, gbc);
        pnlPrinc.add(getPnlCanc(), BorderLayout.CENTER);
        return pnlPrinc;
    }

    private JPanel getPnlCanc() {
        JPanel pnlPrinc = new JPanel();
        pnlPrinc.setLayout(new BorderLayout());
        JPanel pnl = new JPanel();
        pnlPrinc.add(pnl, BorderLayout.WEST);
        pnl.setLayout(new GridBagLayout());
        GridBagConstraints gbc = new GridBagConstraints();
        gbc.gridx = 0;
        gbc.gridy = 0;
        gbc.anchor = GridBagConstraints.WEST;
        gbc.insets = new Insets(2, 2, 2, 2);
        Border border = BorderFactory.createTitledBorder(null, "", TitledBorder.LEFT, TitledBorder.DEFAULT_POSITION, new Font("Comic Sans MS", 0, 12), Color.BLACK);
        pnl.setBorder(border);
        JLabel lblMoneda = new JLabel("Mon Canc");
        pnl.add(lblMoneda);
        gbc.gridx = 1;
        cboMonedaCanc = new JComboBox();
        pnl.add(cboMonedaCanc, gbc);
        gbc.gridx = 2;
        JLabel lblTipoDoc = new JLabel("TipoDoc");
        pnl.add(lblTipoDoc, gbc);
        gbc.gridx = 3;
        txtTipoDoc = new JTextField();
        txtTipoDoc.setDocument(new UpperCaseNumberDocument(2));
        txtTipoDoc.setColumns(3);
        gbc.insets = new Insets(2, 1, 2, 0);
        pnl.add(txtTipoDoc, gbc);

        txtTipoDocDesc = new JTextField();
        txtTipoDocDesc.setColumns(15);
        txtTipoDocDesc.setEnabled(false);
        gbc.insets = new Insets(2, 0, 2, 0);
        gbc.gridx = 4;
        pnl.add(txtTipoDocDesc, gbc);
        gbc.insets = new Insets(2, 2, 2, 2);

        gbc.gridx = 0;
        gbc.gridy = 1;
        JLabel lblClasif = new JLabel("Clasif");
        pnl.add(lblClasif, gbc);
        cboClasif = new JComboBox();
        gbc.gridx = 1;
        pnl.add(cboClasif, gbc);

        gbc.gridx = 2;
        JLabel lblDocumento = new JLabel("Documento");
        pnl.add(lblDocumento, gbc);
        gbc.gridx = 3;
        txtSerie = new JTextField();
        FormatObject.formatJTextFieldSerie(txtSerie);
        gbc.insets = new Insets(2, 1, 2, 0);
        pnl.add(txtSerie, gbc);

        txtPreimpreso = new JTextField();
        txtPreimpreso.setColumns(10);
        txtPreimpreso.setDocument(new UpperCaseNumberDocument(10));
        gbc.insets = new Insets(2, 0, 2, 0);
        gbc.gridx = 4;
        pnl.add(txtPreimpreso, gbc);
        gbc.insets = new Insets(2, 2, 2, 2);

        gbc.gridx = 0;
        gbc.gridy = 2;
        JLabel lblBanco = new JLabel("Banco");
        pnl.add(lblBanco, gbc);
        cboBanco = new JComboBox();
        gbc.gridx = 1;
        pnl.add(cboBanco, gbc);
        gbc.gridx = 2;
        JLabel lblCuenta = new JLabel("Cta banc");
        pnl.add(lblCuenta, gbc);
        gbc.gridx = 3;
        gbc.gridwidth = 2;
        cboEmpresaCuenta = new JComboBox();
        pnl.add(cboEmpresaCuenta, gbc);
        gbc.gridwidth = 1;

        gbc.gridx = 0;
        gbc.gridy = 3;
        JLabel lblMedio = new JLabel("Medio Pago");
        pnl.add(lblMedio, gbc);
        cboMedioPago = new JComboBox();
        gbc.gridx = 1;
        gbc.gridwidth = 4;
        pnl.add(cboMedioPago, gbc);
        gbc.gridwidth = 1;

        gbc.gridx = 0;
        gbc.gridy = 4;
        JLabel lblOperacion = new JLabel("Operacion");
        pnl.add(lblOperacion, gbc);
        gbc.gridx = 1;
        cboTipoOp = new JComboBox();
        gbc.gridwidth = 4;
        pnl.add(cboTipoOp, gbc);
        gbc.gridwidth = 1;

        return pnlPrinc;
    }

    private void initListener() {
        txtAnexo.addKeyListener(this);
        txtAnexo.addMouseListener(this);
        txtAnexo.addFocusListener(this);
        btnBuscar.addActionListener(this);
        chkSeleccionar.addItemListener(this);
        cboClasif.addItemListener(this);
        cboMonedaCanc.addItemListener(this);
        cboBanco.addItemListener(this);
        txtTipoDoc.addKeyListener(this);
        txtTipoDoc.addMouseListener(this);
        txtTipoDoc.addFocusListener(this);
        txtTipoDocDesc.getDocument().addDocumentListener(this);
        txtTipoDoc.addFocusListener(this);
        txtSerie.addFocusListener(this);
        txtPreimpreso.addFocusListener(this);
        txtSerie.addKeyListener(this);
        txtPreimpreso.addKeyListener(this);
        btnGuardar.addActionListener(this);
    }

    private void loadCombo() {
        try {
            modelTable.setPath(this.path);
            this.loadComboMes();
            loadMoneda();
            loadTipoAnexo();
            loadClasifBanco();
            loadMedioPago();
        } catch (Exception e) {
            ExceptionHandler.handleException(e, logger);
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }

    private void loadComboMes() {
        String mes = UtilDate.getMes(frmMain.getFechaFin());
        MesEnum[] listMes = MesEnum.values();
        for (MesEnum estMes : listMes) {
            if (Integer.parseInt(estMes.getValue()) <= Integer.parseInt(mes)) {
                cboMes.addItem(new ObjectItem(estMes.name(), estMes.getValue()));
            }
        }
    }

    private void loadClasifBanco() throws Exception {
        try {
            RnClasifBanco logic = new RnClasifBanco(path);
            if (xClasif != null) {
                xClasif.clear();
            } else {
                xClasif = new ArrayList();
            }
            xClasif.addAll(logic.listarClasifBanco("", "", "A"));
            cboClasif.removeAllItems();
            cboClasif.addItem("--- Seleccione ---");
            for (int i = 0; i < xClasif.size(); i++) {
                cboClasif.addItem(xClasif.get(i).getDescripcion());
            }
            cboClasif.setSelectedIndex(0);
        } catch (Exception e) {
            throw e;
        }
    }

    private void loadMedioPago() throws Exception {
        try {
            RnMedioPago logic = new RnMedioPago(path);
            if (xMedioPago != null) {
                xMedioPago.clear();
            } else {
                xMedioPago = new ArrayList();
            }
            xMedioPago.addAll(logic.listarMedioPago("", "A"));
            cboMedioPago.removeAllItems();
            cboMedioPago.addItem("--- Seleccione ---");
            for (int i = 0; i < xMedioPago.size(); i++) {
                cboMedioPago.addItem(xMedioPago.get(i).getDescripcion());
            }
            cboMedioPago.setSelectedIndex(0);
        } catch (Exception e) {
            throw e;
        }
    }

    private void loadBanco(String idClasif) throws Exception {
        try {
            RnBanco logic = new RnBanco(path);
            if (xBanco != null) {
                xBanco.clear();
            } else {
                xBanco = new ArrayList();
            }
            xBanco.addAll(logic.listarBanco(idClasif));
            cboBanco.removeAllItems();
            cboBanco.addItem("--- Seleccione ---");

            for (int i = 0; i < xBanco.size(); i++) {
                cboBanco.addItem(xBanco.get(i).getDescripcion());
            }

            cboBanco.setSelectedIndex(0);
        } catch (Exception e) {
            throw e;
        }
    }

    private void loadCuenta() throws Exception {
        try {
            if (xEmpresaCuenta != null) {
                xEmpresaCuenta.clear();
            } else {
                xEmpresaCuenta = new ArrayList();
            }
            RnEmpresaCuenta logic = new RnEmpresaCuenta(path);
            String idBanco = cboBanco.getSelectedIndex() > 0 ? xBanco.get(cboBanco.getSelectedIndex() - 1).getIdBanco() : "";
            String idMoneda = LoadComboItem.getIdCombo(cboMonedaCanc);
            if (idMoneda.length() > 0 & idBanco.length() > 0) {
                xEmpresaCuenta.addAll(logic.listarEmpresaCuenta("", idMoneda, idBanco, ""));
            }
            cboEmpresaCuenta.removeAllItems();
            for (int i = 0; i < xEmpresaCuenta.size(); i++) {
                cboEmpresaCuenta.addItem(xEmpresaCuenta.get(i).getNumeroCuenta());
            }
            if (cboEmpresaCuenta.getItemCount() > 0) {
                cboEmpresaCuenta.setSelectedIndex(0);
            }
        } catch (Exception e) {
            throw e;
        }
    }

    private void loadMoneda() throws Exception {
        try {
            cboMoneda.addItem(new ObjectItem(MonedaEnum.SOLES.name(), MonedaEnum.SOLES.getValue()));
            cboMonedaCanc.addItem(new ObjectItem(MonedaEnum.SOLES.name(), MonedaEnum.SOLES.getValue()));
        } catch (Exception e) {
            throw e;
        }
    }

    private void loadTipoAnexo() throws Exception {
        try {
            if (xTipoAnexo != null) {
                xTipoAnexo.clear();
            } else {
                xTipoAnexo = new ArrayList();
            }
            RnTipoAnexo logic = new RnTipoAnexo(path);
            List<BeanTipoAnexo> list = logic.listar("");
            cboTipoAnexo.removeAllItems();
            cboTipoAnexo.addItem("-- Seleccione --");
            for (int i = 0; i < list.size(); i++) {
                BeanTipoAnexo bean = list.get(i);
                if (bean.getIdTipoAnexo().equals("1") || bean.getIdTipoAnexo().equals("6")) {
                    cboTipoAnexo.addItem(bean.getDescripcion());
                    xTipoAnexo.add(bean);
                }
            }
            cboTipoAnexo.setSelectedIndex(0);
        } catch (Exception e) {
            throw e;
        }
    }

    private void buscarAnexo(JTextField txtAnexo, JTextField txtAnexoDesc) {
        try {
            String id_tipo_anexo = cboTipoAnexo.getSelectedIndex() > 0 ? xTipoAnexo.get(cboTipoAnexo.getSelectedIndex() - 1).getIdTipoAnexo() : "";
            if (id_tipo_anexo.trim().length() == 0) {
                JOptionPane.showMessageDialog(this, "Seleccione Tipo de Anexo");
                cboTipoAnexo.requestFocus();
                return;
            }
            String idAnexo;
            RnAnexo logicAnexo = new RnAnexo(path);
            if (txtAnexo.getText().trim().length() > 0) {
                BeanAnexo beanAnexo;
                if (txtAnexo.getText().trim().length() < 10 && txtAnexo.getText().trim().length() != 8) {
                    String id_anexoAnt = "0000000000" + txtAnexo.getText().trim();
                    idAnexo = id_anexoAnt.substring(id_anexoAnt.length() - 10, id_anexoAnt.length());
                } else {
                    idAnexo = txtAnexo.getText();
                }
                beanAnexo = logicAnexo.beanAnexoImp(id_tipo_anexo, "", "A", idAnexo.trim(), "");
                if (beanAnexo != null) {
                    txtAnexoDesc.setText(beanAnexo.getDescripcion());
                    txtAnexo.setText(beanAnexo.getIdAnexo());
                    return;
                }
            }
            FormBuscarAnexo objBuscarAnexo = new FormBuscarAnexo(frmMain, this, path, txtAnexo, txtAnexoDesc, usuario, id_tipo_anexo);
            objBuscarAnexo.setVisible(true);
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }

    public void setValueSearch(Object valor, Component comp) {
        if (comp == txtTipoDoc) {
            BeanTipoDocVenta beanTipoDocVenta = (BeanTipoDocVenta) valor;
            txtTipoDoc.setText(beanTipoDocVenta.getIdTipoDoc());
            txtTipoDocDesc.setText(beanTipoDocVenta.getDescripcion());
        }
    }

    private void buscarTipoDocVenta(JTextField txtTd, JTextField txtTdDesc) {
        try {
            RnTipoDocVenta logicTipoDocVenta = new RnTipoDocVenta(path);
            if (txtTd.getText().trim().length() > 0) {
                BeanTipoDocVenta beanTipoDocVenta = logicTipoDocVenta.getTipoDocVenta(txtTd.getText().trim(), "", "", "");
                if (beanTipoDocVenta != null) {
                    txtTdDesc.setText(beanTipoDocVenta.getDescripcion());
                    return;
                }
            }
            FormBuscarTipoDocVenta objBuscarTipoDocVenta = new FormBuscarTipoDocVenta(frmMain, this, path, txtTd, txtTdDesc, "", "", "");
            objBuscarTipoDocVenta.setVisible(true);
        } catch (Exception e) {
            ExceptionHandler.handleException(e, logger);
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }

    private String getIdMoneda() {
        return LoadComboItem.getIdCombo(cboMoneda);
    }

    private void buscarDocumentos() {
        try {
            RnConsultas logic = new RnConsultas(path);
            String mes = UtilDate.getMes(frmMain.getFechaFin());
            modelTable.clearTable();
            chkSeleccionar.setSelected(false);
            List<BeanCxPGroup> lista = logic.listarCancProvGroup(frmMain.getAnio(), mes, txtAnexo.getText(), this.getIdMoneda(), "", "", "");
            String mesFilter = LoadComboItem.getIdCombo(cboMes);
            List<BeanCxPGroup> listMes = new ArrayList();
            for (BeanCxPGroup beanCxPGroup : lista) {
                if (beanCxPGroup.getMes().equals(mesFilter)) {
                    listMes.add(beanCxPGroup);
                }
            }
            modelTable.agregarListCxP(listMes);
            modelTable.fireTableDataChanged();
            chkSeleccionar.setSelected(true);
            table.setAllColumnPreferredWidth(15);
        } catch (Exception e) {
            ExceptionHandler.handleException(e, logger);
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }

    private void loadTipoOperacion() throws Exception {
        RnTipoOperacion logic = new RnTipoOperacion(path);
        if (xOperacion != null) {
            xOperacion.clear();
        } else {
            xOperacion = new ArrayList();
        }
        String idMoneda = LoadComboItem.getIdCombo(cboMonedaCanc);
        String idTipo = "135,136,137,138";
        if (idMoneda.trim().length() > 0 && idTipo.trim().length() > 0) {
            xOperacion.addAll(logic.listarOperacionForm(idMoneda, idTipo));
        }
        cboTipoOp.removeAllItems();
        for (int i = 0; i < xOperacion.size(); i++) {
            cboTipoOp.addItem(xOperacion.get(i).getDescripcion());
        }
        cboTipoOp.setSelectedIndex(-1);
    }

    private boolean verificarDatos() throws Exception {
        if (modelTable.getRowCount() == 0) {
            JOptionPane.showMessageDialog(this, "No hay datos que registrar");
            return false;
        }
        if (cboMonedaCanc.getSelectedIndex() < 0) {
            JOptionPane.showMessageDialog(this, "Seleccione Moneda de Cancelacion");
            return false;
        }
        if (cboMedioPago.getSelectedIndex() <= 0) {
            JOptionPane.showMessageDialog(this, "Seleccione Medio Pago");
            return false;
        }
        if (cboEmpresaCuenta.getSelectedIndex() < 0) {
            JOptionPane.showMessageDialog(this, "Seleccione cuenta Bancaria");
            return false;
        }
        if (cboTipoOp.getSelectedIndex() < 0) {
            JOptionPane.showMessageDialog(this, "Seleccione Operacion");
            cboTipoOp.requestFocus();
            return false;
        }
        SimpleDateFormat fe = new SimpleDateFormat("MM");
        String mes = "";
        int cont = 0;
        for (int i = 0; i < modelTable.getRowCount(); i++) {
            if (modelTable.getCxP(i).isSwSelected()) {
                if (cont == 0) {
                    cont += 1;
                    mes = fe.format(modelTable.getCxP(i).getFechaCanc());
                } else if (!mes.equals(fe.format(modelTable.getCxP(i).getFechaCanc()))) {
                    JOptionPane.showMessageDialog(this, "Los Documentos no se encuentran en el mismo mes de Cancelacion");
                    return false;
                }
            }
        }
        for (int i = 0; i < modelTable.getRowCount(); i++) {
            if (modelTable.getCxP(i).isSwSelected()) {
                if (!(modelTable.getCxP(i).getTipoCambioCanc().compareTo(BigDecimal.ONE) == 1)) {
                    JOptionPane.showMessageDialog(this, "Fila " + (i + 1) + "; tiene tipo de cambio 0");
                    return false;
                }
                if (modelTable.getCxP(i).getIdTipoDocCanc().trim().length() == 0) {
                    JOptionPane.showMessageDialog(this, "Fila " + (i + 1) + "; Ingrese TipoDoc Canc");
                    return false;
                }
                if (modelTable.getCxP(i).getSerieCanc().trim().length() == 0) {
                    JOptionPane.showMessageDialog(this, "Fila " + (i + 1) + "; Ingrese Serie Canc");
                    return false;
                }
                if (modelTable.getCxP(i).getPreimpresoCanc().trim().length() == 0) {
                    JOptionPane.showMessageDialog(this, "Fila " + (i + 1) + "; Ingrese Preimpreso Canc");
                    return false;
                }
            }
        }
        RnRegconta logic = new RnRegconta(path);
        String rpta = logic.estadoPeriodoAuxiliar(frmMain.getAnio() + "-" + mes, AuxiliarEnum.CAJA.getValue());
        if (rpta.trim().substring(0, 1).equals("*")) {
            JOptionPane.showMessageDialog(this, rpta);
            return false;
        }
        return true;
    }

    private void guardarDocumento() {
        try {
            if (!verificarDatos()) {
                return;
            }
            this.guardarAsientoGrupal();
        } catch (Exception e) {
            ExceptionHandler.handleException(e, logger);
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }

    private void guardarAsientoGrupal() throws Exception {
        //int xres = JOptionPane.showConfirmDialog(this, "La operacion se grabara en \nPeriodo: " + formatoAnio.format(dc_femision.getDate()) + "-" + formatoMes.format(dc_femision.getDate()) + "\nAuxiliar: 00010", "Sistema", JOptionPane.OK_CANCEL_OPTION, JOptionPane.QUESTION_MESSAGE);
        int xres = JOptionPane.showConfirmDialog(this, "Se guardara las cancelaciones" + "\nAuxiliar: 00010", "Sistema", JOptionPane.OK_CANCEL_OPTION, JOptionPane.QUESTION_MESSAGE);
        if (xres != JOptionPane.OK_OPTION) {
            return;
        }
        RnRegconta logic = new RnRegconta(path);
        logic.insertCancGroupProv(this.getListRcc());
        JOptionPane.showMessageDialog(this, "REGISTRADO CORRECTAMENTE");
        modelTable.clearTable();
        table.setAllColumnPreferredWidth();
    }

    private List<BeanRegcontaCab> getListRcc() {
        List<BeanRegcontaCab> listRcc = new ArrayList();
        String idMoneda = LoadComboItem.getIdCombo(cboMonedaCanc);
        BeanMoneda moneda = new BeanMoneda(idMoneda);
        BeanMedioPago beanMedioPago = xMedioPago.get(cboMedioPago.getSelectedIndex() - 1);
        BeanEmpresaCuenta beanCuenta = xEmpresaCuenta.get(cboEmpresaCuenta.getSelectedIndex());
        String idTipoOperacion = xOperacion.get(cboTipoOp.getSelectedIndex()).getIdTipoOperacion();
        for (int i = 0; i < modelTable.getRowCount(); i++) {
            if (!modelTable.getCxP(i).isSwSelected()) {
                continue;
            }
            BeanCxPGroup beanCxp = modelTable.getCxP(i);
            listRcc.add(this.getBeanRegcontaCab(beanCxp, moneda, beanMedioPago, beanCuenta, idTipoOperacion));
        }
        return listRcc;
    }

    private BeanRegcontaCab getBeanRegcontaCab(BeanCxPGroup beanCxp, BeanMoneda beanMoneda,
            BeanMedioPago beanMedioPago, BeanEmpresaCuenta beanCuenta, String idTipoOperacion) {
        BeanRegcontaCab bean = new BeanRegcontaCab();
        bean.setIdEmpresa(usuario.getCodempresa());
        bean.setIdLocalidad(usuario.getCodlocalidad());
        BeanAnexo beanAnexo = new BeanAnexo();
        beanAnexo.setIdAnexo(beanCxp.getIdAnexo());
        bean.setBeanAnexo(beanAnexo);
        bean.setBeanMoneda(beanMoneda);
        BeanTipoDocVenta beanTipoDoc = new BeanTipoDocVenta();
        beanTipoDoc.setIdTipoDoc(beanCxp.getIdTipoDocCanc());
        bean.setBeanTipoDocVenta(beanTipoDoc);
        bean.setSerie(beanCxp.getSerieCanc());
        bean.setPreimpreso(beanCxp.getPreimpresoCanc());
        bean.setTipoCambio(beanCxp.getTipoCambioCanc());
        bean.setMonto(beanCxp.getAsoles());
        bean.setFEmision(beanCxp.getFechaCanc());
        bean.setFVencimiento(beanCxp.getFechaCanc());
        bean.setIdAuxiliar(AuxiliarEnum.CAJA.getValue());
        bean.setAnio(UtilDate.getAnio(beanCxp.getFechaCanc()));
        bean.setMes(UtilDate.getMes(beanCxp.getFechaCanc()));
        bean.setGlosa(beanCxp.getGlosa());
        bean.setBeanMedioPago(beanMedioPago);
        bean.setIdTipoOperacion(idTipoOperacion);
        bean.setIdUsuario(usuario.getId_usuario());
        bean.setBeanEmpresaCuenta(beanCuenta);
        bean.setXmlCancelacion(this.xmlDoc(beanCxp));
        return bean;
    }

    private String xmlDoc(BeanCxPGroup beanCxp) {
        String xmlVenta;
        xmlVenta = "<?xml version=\"1.0\" ?> ";
        xmlVenta += "<VENTAS>";
        xmlVenta += "<VENTA>";
        xmlVenta += "<ID_MONEDA>" + beanCxp.getIdMoneda() + "</ID_MONEDA>";
        xmlVenta += "<CTA>" + beanCxp.getIdCuenta() + "</CTA>";
        xmlVenta += "<TD>" + beanCxp.getIdTipoDoc() + "</TD>";
        xmlVenta += "<SERIE>" + beanCxp.getSerie() + "</SERIE>";
        xmlVenta += "<PREIMPRESO>" + beanCxp.getPreimpreso() + "</PREIMPRESO>";
        xmlVenta += "<ID_REF>" + beanCxp.getIdRegconta() + "</ID_REF>";
        xmlVenta += "<TC>" + beanCxp.getTipoCambio().toString().replace(".", ",") + "</TC>";
        xmlVenta += "<MONTO>" + beanCxp.getAsoles().toString().replace(".", ",") + "</MONTO>";
        xmlVenta += "<MONTODOL>" + beanCxp.getAdolares().toString().replace(".", ",") + "</MONTODOL>";
        xmlVenta += "</VENTA>";
        xmlVenta += "</VENTAS>";
        logger.info("xml_Ventas: " + xmlVenta);
        xmlVenta = xmlVenta.replace("&", " ");
        return xmlVenta;
    }

    private void guardarAsiento() throws Exception {
        try {
            SimpleDateFormat fe = new SimpleDateFormat("dd/MM/yyyy");
            String xmlVenta;
            xmlVenta = "<?xml version=\"1.0\" ?> ";
            xmlVenta += "<VENTAS>";
            SimpleDateFormat formatMes = new SimpleDateFormat("MM");
            SimpleDateFormat formatAnio = new SimpleDateFormat("yyyy");
            int cont = 0;
            String mes = "";
            String anio = "";
            String idMoneda = LoadComboItem.getIdCombo(cboMonedaCanc);
            String idMedioPago = cboMedioPago.getSelectedIndex() > 0 ? xMedioPago.get(cboMedioPago.getSelectedIndex() - 1).getIdMedioPago() : "";
            BeanEmpresaCuenta beanCuenta = xEmpresaCuenta.get(cboEmpresaCuenta.getSelectedIndex());
            String idCuenta = beanCuenta.getCuentaContable().trim();
            for (int i = 0; i < modelTable.getRowCount(); i++) {
                if (modelTable.getCxP(i).isSwSelected()) {
                    BeanCxPGroup beanCxp = modelTable.getCxP(i);
                    if (cont == 0) {
                        anio = formatAnio.format(beanCxp.getFechaCanc());
                        mes = formatMes.format(beanCxp.getFechaCanc());
                        cont += 1;
                    }
                    xmlVenta += "<VENTA>";
                    xmlVenta += "<FECHA_CANC>" + fe.format(beanCxp.getFechaCanc()) + "</FECHA_CANC>";
                    xmlVenta += "<ID_ANEXO>" + beanCxp.getIdAnexo() + "</ID_ANEXO>";
                    xmlVenta += "<ID_MONEDA>" + beanCxp.getIdMoneda() + "</ID_MONEDA>";
                    xmlVenta += "<ID_MONEDA_CANC>" + idMoneda + "</ID_MONEDA_CANC>";
                    xmlVenta += "<ID_MEDIO>" + idMedioPago + "</ID_MEDIO>";
                    xmlVenta += "<CTA>" + beanCxp.getIdCuenta() + "</CTA>";
                    xmlVenta += "<CTACANC>" + idCuenta + "</CTACANC>";
                    xmlVenta += "<TD_CANC>" + beanCxp.getIdTipoDocCanc() + "</TD_CANC>";
                    xmlVenta += "<SERIE_CANC>" + beanCxp.getSerieCanc() + "</SERIE_CANC>";
                    xmlVenta += "<PREIMPRESO_CANC>" + beanCxp.getPreimpresoCanc() + "</PREIMPRESO_CANC>";
                    xmlVenta += "<TD>" + beanCxp.getIdTipoDoc() + "</TD>";
                    xmlVenta += "<SERIE>" + beanCxp.getSerie() + "</SERIE>";
                    xmlVenta += "<PREIMPRESO>" + beanCxp.getPreimpreso() + "</PREIMPRESO>";
                    xmlVenta += "<ID_REF>" + beanCxp.getIdRegconta() + "</ID_REF>";
                    xmlVenta += "<GLOSA>" + beanCxp.getGlosa() + "</GLOSA>";
                    xmlVenta += "<TC>" + beanCxp.getTipoCambio().toString().replace(".", ",") + "</TC>";
                    xmlVenta += "<TC_CANC>" + beanCxp.getTipoCambioCanc().toString().replace(".", ",") + "</TC_CANC>";
                    xmlVenta += "<MONTO>" + beanCxp.getAsoles().toString().replace(".", ",") + "</MONTO>";
                    xmlVenta += "<MONTODOL>" + beanCxp.getAdolares().toString().replace(".", ",") + "</MONTODOL>";
                    xmlVenta += "</VENTA>";
                }
            }
            xmlVenta += "</VENTAS>";
            logger.info("xml_Ventas: " + xmlVenta);
            xmlVenta = xmlVenta.replace("&", " ");
            String rpta;
            RnCliente logicCliente = new RnCliente(path);
            rpta = logicCliente.importarCancelacion(anio, mes, usuario.getId_usuario(), xmlVenta);
            if (rpta.trim().equals("CORRECTO")) {
                JOptionPane.showMessageDialog(this, "REGISTRADO CORRECTAMENTE");
                modelTable.clearTable();
                table.setAllColumnPreferredWidth();
            }
        } catch (SQLException | HeadlessException e) {
            throw e;
        }
    }

    private void cellEdit() {
        boolean sw = false;
        //String id_moneda = cboMonedaCanc.getSelectedIndex() > 0 ? xMoneda.get(cboMonedaCanc.getSelectedIndex() - 1).getId_moneda() : "";
        String id_moneda = "";
        for (int i = 0; i < modelTable.getRowCount(); i++) {
            sw = modelTable.getCxP(i).isSwSelected();
            if (sw) {
                table.setCellEditable(i, 15);
                table.setCellEditable(i, 16);
                table.setCellEditable(i, 17);
                table.setCellEditable(i, 18);
                table.setCellEditable(i, 19);
                table.setCellEditable(i, 20);
                if (id_moneda.equals("00001")) {
                    table.setCellEditable(i, 13);
                } else if (id_moneda.equals("00004")) {
                    table.setCellEditable(i, 14);
                }
            } else {
                table.setCellNoEditable(i, 13);
                table.setCellNoEditable(i, 14);
                table.setCellNoEditable(i, 15);
                table.setCellNoEditable(i, 16);
                table.setCellNoEditable(i, 17);
                table.setCellNoEditable(i, 18);
                table.setCellNoEditable(i, 19);
                table.setCellNoEditable(i, 20);
            }
        }
    }

    private void changeDoc() {
        for (int i = 0; i < modelTable.getRowCount(); i++) {
            if (modelTable.getCxP(i).isSwSelected()) {
                modelTable.getCxP(i).setIdTipoDocCanc(txtTipoDoc.getText().trim());
            }
        }
        modelTable.fireTableDataChanged();
    }

    private void changeSerie() {
        for (int i = 0; i < modelTable.getRowCount(); i++) {
            if (modelTable.getCxP(i).isSwSelected()) {
                modelTable.getCxP(i).setSerieCanc(txtSerie.getText().trim());
            }
        }
        modelTable.fireTableDataChanged();
    }

    private void changePreimpreso() {
        if (txtPreimpreso.getText().trim().length() == 0) {
            return;
        }

        if (txtTipoDoc.getText().trim().equals("RE")) {
            int pre = Integer.parseInt(txtPreimpreso.getText());
            for (int i = 0; i < modelTable.getRowCount(); i++) {
                if (modelTable.getCxP(i).isSwSelected()) {
                    pre += 1;
                    String preimpreso = "0000000000" + String.valueOf(pre);
                    modelTable.getCxP(i).setPreimpresoCanc(preimpreso.substring(preimpreso.length() - 10, preimpreso.length()));
                }
            }
            modelTable.fireTableDataChanged();
        } else {
            for (int i = 0; i < modelTable.getRowCount(); i++) {
                if (modelTable.getCxP(i).isSwSelected()) {
                    modelTable.getCxP(i).setPreimpresoCanc(txtPreimpreso.getText());
                }
            }
        }
    }

    @Override
    public void mouseClicked(MouseEvent e) {
        if (e.getClickCount() == 2) {
            if (e.getSource() == txtAnexo) {
                buscarAnexo(txtAnexo, txtAnexoDesc);
            }
            if (e.getSource() == txtTipoDoc) {
                buscarTipoDocVenta(txtTipoDoc, txtTipoDocDesc);
            }
        }
    }

    @Override
    public void mousePressed(MouseEvent e) {
    }

    @Override
    public void mouseReleased(MouseEvent e) {
    }

    @Override
    public void mouseEntered(MouseEvent e) {
    }

    @Override
    public void mouseExited(MouseEvent e) {
    }

    @Override
    public void keyTyped(KeyEvent e) {
    }

    @Override
    public void keyPressed(KeyEvent e) {
        if (e.getKeyChar() == '\n') {
            if (e.getSource() == txtAnexo) {
                buscarAnexo(txtAnexo, txtAnexoDesc);
            }
            if (e.getSource() == txtTipoDoc) {
                buscarTipoDocVenta(txtTipoDoc, txtTipoDocDesc);
            }
        }
        if (e.getKeyChar() == KeyEvent.VK_DELETE || e.getKeyChar() == KeyEvent.VK_BACK_SPACE) {
            if (e.getSource() == txtAnexo) {
                txtAnexoDesc.setText("");
            }
            if (e.getSource() == txtTipoDoc) {
                txtTipoDocDesc.setText("");
            }
        }
    }

    @Override
    public void keyReleased(KeyEvent e) {
        if (e.getKeyChar() == '\n') {
            if (e.getSource().equals(txtSerie)) {
                txtPreimpreso.requestFocus();
            }
            if (e.getSource().equals(txtPreimpreso)) {
                cboMedioPago.requestFocus();
            }
        }
    }

    @Override
    public void focusGained(FocusEvent e) {
        if (txtAnexo == e.getSource()) {
            txtAnexo.selectAll();
        }
        if (txtTipoDoc == e.getSource()) {
            txtTipoDoc.selectAll();
        }
        if (txtSerie == e.getSource()) {
            txtSerie.selectAll();
        }
        if (txtPreimpreso == e.getSource()) {
            txtPreimpreso.selectAll();
        }
    }

    @Override
    public void focusLost(FocusEvent e) {
        if (e.getSource().equals(txtSerie)) {
            FormatObject.formatSerie((JTextField) e.getSource());
            changeSerie();
        }
        if (e.getSource().equals(txtPreimpreso)) {
            if (txtPreimpreso.getText().trim().length() > 0) {
                String cod = "";
                for (int i = 0; i < 10 - txtPreimpreso.getText().trim().length(); i++) {
                    cod += "0";
                }
                txtPreimpreso.setText(cod + txtPreimpreso.getText().trim());
            }
            changePreimpreso();
        }
    }

    @Override
    public void actionPerformed(ActionEvent e) {
        if (e.getSource().equals(btnBuscar)) {
            buscarDocumentos();
        }
        if (e.getSource().equals(btnGuardar)) {
            guardarDocumento();
        }
    }

    @Override
    public void itemStateChanged(ItemEvent e) {
        try {
            if (e.getSource().equals(chkSeleccionar)) {
                boolean sw = chkSeleccionar.isSelected();
                for (int i = 0; i < modelTable.getRowCount(); i++) {
                    modelTable.getCxP(i).setSwSelected(sw);
                    if (sw) {
                        if (modelTable.getCxP(i).getIdMoneda().equals("00001")) {
                            modelTable.getCxP(i).setAsoles(modelTable.getCxP(i).getSaldo());
                            if (modelTable.getCxP(i).getTipoCambioCanc().compareTo(BigDecimal.ZERO) == 1) {
                                modelTable.getCxP(i).setAdolares(modelTable.getCxP(i).getSaldo().divide(modelTable.getCxP(i).getTipoCambioCanc(), 4, RoundingMode.CEILING));
                            } else {
                                modelTable.getCxP(i).setAdolares(BigDecimal.ZERO);
                            }
                        } else {
                            modelTable.getCxP(i).setAdolares(modelTable.getCxP(i).getSaldo());
                            modelTable.getCxP(i).setAsoles(modelTable.getCxP(i).getSaldo().multiply(modelTable.getCxP(i).getTipoCambioCanc()).setScale(4, RoundingMode.CEILING));
                        }
                    } else {
                        modelTable.getCxP(i).setAsoles(BigDecimal.ZERO);
                        modelTable.getCxP(i).setAdolares(BigDecimal.ZERO);
                    }
                }
                table.setAllColumnPreferredWidth(15);
            }
            if (cboClasif == e.getSource()) {
                if (cboClasif.getItemCount() > 0) {
                    if (cboClasif.getSelectedIndex() == 0) {
                        cboBanco.removeAllItems();
                        cboBanco.setEnabled(false);
                    } else {
                        cboBanco.setEnabled(true);
                        loadBanco(xClasif.get(cboClasif.getSelectedIndex() - 1).getIdClasifBanco());
                    }
                }
            }
            if (e.getSource().equals(cboBanco)) {
                loadCuenta();
            }
            if (e.getSource().equals(cboMonedaCanc)) {
                loadTipoOperacion();
                String idMoneda = LoadComboItem.getIdCombo(cboMonedaCanc);
                modelTable.setId_moneda_canc(idMoneda);
                loadCuenta();
            }
        } catch (Exception ex) {
            ExceptionHandler.handleException(ex, logger);
            JOptionPane.showMessageDialog(this, ex.getMessage());
        }
    }

    @Override
    public void tableChanged(TableModelEvent e) {
    }

    @Override
    public void insertUpdate(DocumentEvent e) {
        if (e.getDocument().equals(txtTipoDocDesc.getDocument())) {
            changeDoc();
        }
    }

    @Override
    public void removeUpdate(DocumentEvent e) {
        if (e.getDocument().equals(txtTipoDocDesc.getDocument())) {
            changeDoc();
        }
    }

    @Override
    public void changedUpdate(DocumentEvent e) {
        if (e.getDocument().equals(txtTipoDocDesc.getDocument())) {
            changeDoc();
        }
    }
}
