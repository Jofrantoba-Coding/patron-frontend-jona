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

    protected final Usuario usuario;
    protected final Main frmMain;
    protected final URL path;
    protected Gif gif;
    protected JComboBox cboTipoAnexo;
    protected JComboBox cboMoneda;
    protected JComboBox cboMonedaCanc;
    protected JComboBox cboClasif;
    protected JComboBox cboBanco;
    protected JComboBox cboEmpresaCuenta;
    protected JComboBox cboMedioPago;
    protected JComboBox cboMes;
    protected JTextField txtAnexo;
    protected JTextField txtAnexoDesc;
    protected JButton btnBuscar;
    protected List<BeanTipoAnexo> xTipoAnexo;
    protected List<BeanClasifBanco> xClasif;
    protected List<BeanMedioPago> xMedioPago;
    protected List<BeanBanco> xBanco;
    protected List<BeanEmpresaCuenta> xEmpresaCuenta;
    protected CTableGui table;
    protected TableModelCxPGroup modelTable;
    protected JCheckBox chkSeleccionar;
    protected JTextField txtTipoDoc;
    protected JTextField txtTipoDocDesc;
    protected JTextField txtSerie;
    protected JTextField txtPreimpreso;
    protected JButton btnGuardar;
    protected List<BeanTipoOperacion> xOperacion;
    protected JComboBox cboTipoOp;
    protected final Logger logger = Logger.getLogger(UiPnlCancProvGroup.class);

    public UiPnlCancProvGroup(String title, URL path, Main frm, Usuario usuario) {
        super(title);
        this.path = path;
        this.usuario = usuario;
        this.frmMain = frm;
        initComponents();
    }

    protected void initComponents() {
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

    protected JPanel getPnlSouth() {
        JPanel pnl = new JPanel();
        btnGuardar = new JButton("Guardar", gif.SAVE16);
        pnl.add(btnGuardar);
        return pnl;
    }

    protected void configurarInternal() {
        pack();
        setMaximizable(true);
        setResizable(true);
        setClosable(true);
        setMinimumSize(new Dimension(800, 400));
        setMaximumSize(new Dimension(1355, 592));
        setIconifiable(true);
        setLocation(((Toolkit.getDefaultToolkit().getScreenSize().width - getSize().width) / 2), (Toolkit.getDefaultToolkit().getScreenSize().height - getSize().height) / 20);
    }

    protected JPanel getPnlNorth() {
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

    protected JPanel getPnlCanc() {
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

    protected void initListener() {
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

    protected void loadCombo() {
    }

    protected void loadComboMes() {
    }

    protected void loadClasifBanco() throws Exception {
    }

    protected void loadMedioPago() throws Exception {
    }

    protected void loadBanco(String idClasif) throws Exception {
    }

    protected void loadCuenta() throws Exception {
    }

    protected void loadMoneda() throws Exception {
    }

    protected void loadTipoAnexo() throws Exception {
    }

    protected void buscarAnexo(JTextField txtAnexo, JTextField txtAnexoDesc) {
    }

    public void setValueSearch(Object valor, Component comp) {
    }

    protected void buscarTipoDocVenta(JTextField txtTd, JTextField txtTdDesc) {
    }

    protected String getIdMoneda() {
        return null;
    }

    protected void buscarDocumentos() {
    }

    protected void loadTipoOperacion() throws Exception {
    }

    protected boolean verificarDatos() throws Exception {
        return false;
    }

    protected void guardarDocumento() {
    }

    protected void guardarAsientoGrupal() throws Exception {
    }

    protected List<BeanRegcontaCab> getListRcc() {
        return null;
    }

    protected BeanRegcontaCab getBeanRegcontaCab(BeanCxPGroup beanCxp, BeanMoneda beanMoneda,
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

    protected String xmlDoc(BeanCxPGroup beanCxp) {
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

    protected void guardarAsiento() throws Exception {
    }

    protected void cellEdit() {
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

    protected void changeDoc() {
        for (int i = 0; i < modelTable.getRowCount(); i++) {
            if (modelTable.getCxP(i).isSwSelected()) {
                modelTable.getCxP(i).setIdTipoDocCanc(txtTipoDoc.getText().trim());
            }
        }
        modelTable.fireTableDataChanged();
    }

    protected void changeSerie() {
        for (int i = 0; i < modelTable.getRowCount(); i++) {
            if (modelTable.getCxP(i).isSwSelected()) {
                modelTable.getCxP(i).setSerieCanc(txtSerie.getText().trim());
            }
        }
        modelTable.fireTableDataChanged();
    }

    protected void changePreimpreso() {
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
