package com.softcommerce.views.uipnlcancclientegroup;


import com.softcommerce.formularios.*;
import com.softcommerce.beans.BeanAnexo;
import com.softcommerce.beans.BeanBanco;
import com.softcommerce.beans.BeanClasifBanco;
import com.softcommerce.beans.BeanCxPGroup;
import com.softcommerce.beans.BeanEmpresaCuenta;
import com.softcommerce.beans.BeanMedioPago;
import com.softcommerce.beans.BeanMoneda;
import com.softcommerce.beans.BeanTipoDocVenta;
import com.softcommerce.beans.Usuario;
import com.softcommerce.conta.formularios.FormBuscarAnexo;
import com.softcommerce.conta.formularios.FormBuscarTipoDocVenta;
import com.softcommerce.enums.TipoAnexoEnum;
import com.softcommerce.general.controles.CTableGui;
import com.softcommerce.general.controles.ComponentTitledBorder;
import com.softcommerce.general.controles.IntegerDocument;
import com.softcommerce.general.controles.UpperCaseNumberDocument;
import com.softcommerce.general.herramientas.DateTime;
import com.softcommerce.general.tablas.TableModelCxPGroup;
import com.softcommerce.iconos.Gif;
import com.softcommerce.reglasnegocio.RnBanco;
import com.softcommerce.reglasnegocio.RnClasifBanco;
import com.softcommerce.reglasnegocio.RnConsultas;
import com.softcommerce.reglasnegocio.RnEmpresaCuenta;
import com.softcommerce.reglasnegocio.RnMedioPago;
import com.softcommerce.reglasnegocio.RnMoneda;
import com.softcommerce.reglasnegocio.RnTipoDocVenta;
import com.softcommerce.reglasnegocio.RnAnexo;
import com.softcommerce.reglasnegocio.RnCliente;
import com.softcommerce.util.ExceptionHandler;
import com.softcommerce.util.FormatObject;
import com.toedter.calendar.JDateChooser;
import java.awt.BorderLayout;
import java.awt.Color;
import java.awt.Component;
import java.awt.Dimension;
import java.awt.FlowLayout;
import java.awt.Font;
import java.awt.GridBagConstraints;
import java.awt.GridBagLayout;
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
import java.sql.Date;
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
import java.net.URL;
import org.apache.log4j.Logger;

public class UiPnlCancClienteGroup
        extends JInternalFrame
        implements InterUiPnlCancClienteGroup, MouseListener, KeyListener, FocusListener, ActionListener, ItemListener, TableModelListener, DocumentListener {

    protected Usuario usuario;
    protected Main frmMain;
    protected URL path;
    protected Gif gif;
    protected JComboBox cboMoneda;
    protected JComboBox cboMonedaCanc;
    protected JComboBox cboClasif;
    protected JComboBox cboBanco;
    protected JComboBox cboEmpresaCuenta;
    protected JComboBox cboMedioPago;
    protected JTextField txtAnexo;
    protected JTextField txtAnexoDesc;
    protected JButton btnBuscar;
    protected List<BeanMoneda> xMoneda;
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
    protected JTextField txtTipoDocBusq;
    protected JTextField txtTipoDocBusqDesc;
    protected JTextField txtSerieBusq;
    protected JTextField txtPreimpresoBusq;
    protected JButton btnGuardar;
    protected JCheckBox chkFecha;
    protected JDateChooser dcFechaIni;
    protected JDateChooser dcFechaFin;
    protected final Logger logger = Logger.getLogger(UiPnlCancClienteGroup.class);

    public UiPnlCancClienteGroup(String title, java.net.URL path, Main frm, Usuario usuario) {
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
        initFechas();
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

    protected JPanel getPnlFecha() {
        JPanel pnlFecha = new JPanel();
        pnlFecha.setLayout(new FlowLayout());
        chkFecha = new JCheckBox("Fechas");
        ComponentTitledBorder componentBorder
                = new ComponentTitledBorder(chkFecha, pnlFecha, BorderFactory.createEtchedBorder());
        pnlFecha.setBorder(componentBorder);
        JLabel lbldesdeEmi = new JLabel("Desde");
        pnlFecha.add(lbldesdeEmi);
        dcFechaIni = new JDateChooser("dd/MM/yyyy", "##/##/####", '_');
        dcFechaIni.setEnabled(false);
        pnlFecha.add(dcFechaIni);
        JLabel lbldesdeHasta = new JLabel("Hasta");
        pnlFecha.add(lbldesdeHasta);
        dcFechaFin = new JDateChooser("dd/MM/yyyy", "##/##/####", '_');
        dcFechaFin.setEnabled(false);
        pnlFecha.add(dcFechaFin);
        return pnlFecha;
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
        JLabel lblAnexo = new JLabel("Cliente");
        pnl.add(lblAnexo, gbc);
        gbc.gridx = 1;
        gbc.gridwidth = 2;
        txtAnexo = new JTextField();
        txtAnexo.setDocument(new IntegerDocument(11));
        txtAnexo.setColumns(7);
        gbc.insets = new Insets(2, 1, 2, 0);
        pnl.add(txtAnexo, gbc);
        gbc.gridwidth = 1;

        txtAnexoDesc = new JTextField();
        txtAnexoDesc.setEnabled(false);
        txtAnexoDesc.setColumns(20);
        gbc.insets = new Insets(2, 0, 2, 0);
        gbc.gridx = 3;
        gbc.gridwidth = 4;
        pnl.add(txtAnexoDesc, gbc);
        gbc.gridwidth = 1;

        gbc.insets = new Insets(2, 2, 2, 2);
        gbc.gridx = 0;
        gbc.gridy = 1;
        JLabel lblMoneda = new JLabel("Moneda");
        pnl.add(lblMoneda, gbc);
        gbc.gridx = 1;
        cboMoneda = new JComboBox();
        gbc.gridwidth = 3;
        pnl.add(cboMoneda, gbc);
        gbc.gridwidth = 1;
        
        gbc.gridx = 4;
        gbc.gridwidth = 4;
        pnl.add(this.getPnlFecha(), gbc);
        gbc.gridwidth = 1;
        btnBuscar = new JButton("Buscar", gif.SEARCH16);
        gbc.gridx = 8;
        pnl.add(btnBuscar, gbc);
        
        gbc.gridx = 0;
        gbc.gridy = 2;
        JLabel lblTipoDoc = new JLabel("TipoDoc");
        pnl.add(lblTipoDoc, gbc);
        gbc.gridx = 1;
        txtTipoDocBusq = new JTextField();
        txtTipoDocBusq.setDocument(new UpperCaseNumberDocument(2));
        txtTipoDocBusq.setColumns(3);
        gbc.insets = new Insets(2, 1, 2, 0);
        pnl.add(txtTipoDocBusq, gbc);

        txtTipoDocBusqDesc = new JTextField();
        txtTipoDocBusqDesc.setColumns(15);
        txtTipoDocBusqDesc.setEnabled(false);
        gbc.insets = new Insets(2, 0, 2, 0);
        gbc.gridwidth = 3;
        gbc.gridx = 2;
        pnl.add(txtTipoDocBusqDesc, gbc);
        gbc.gridwidth = 1;
        gbc.insets = new Insets(2, 2, 2, 2);

        gbc.gridx = 5;
        JLabel lblDocumento = new JLabel("Documento");
        pnl.add(lblDocumento, gbc);
        gbc.gridx = 6;
        txtSerieBusq = new JTextField();
        FormatObject.formatJTextFieldSerie(txtSerieBusq);
        txtSerieBusq.setMinimumSize(txtSerieBusq.getPreferredSize());
        gbc.insets = new Insets(2, 1, 2, 0);
        pnl.add(txtSerieBusq, gbc);

        txtPreimpresoBusq = new JTextField();
        //txtPreimpresoBusq.setColumns(10);
        //txtPreimpresoBusq.setDocument(new UpperCaseNumberDocument(10));
        FormatObject.formatJTextFieldPreimpresoDig(txtPreimpresoBusq);
        txtPreimpresoBusq.setMinimumSize(txtPreimpresoBusq.getPreferredSize());
        gbc.insets = new Insets(2, 0, 2, 0);
        gbc.gridx = 7;
        pnl.add(txtPreimpresoBusq, gbc);
        gbc.insets = new Insets(2, 2, 2, 2);

        gbc.gridx = 1;
        gbc.gridy = 3;
        chkSeleccionar = new JCheckBox("Seleccionar");
        gbc.gridwidth = 2;
        pnl.add(chkSeleccionar, gbc);
        gbc.gridwidth = 1;
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
        Border border = BorderFactory.createTitledBorder(null, "Datos de Cancelacion", TitledBorder.LEFT, TitledBorder.DEFAULT_POSITION, new Font("Comic Sans MS", 0, 12), Color.BLACK);
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
        txtSerie.setMinimumSize(txtSerie.getPreferredSize());
        gbc.insets = new Insets(2, 1, 2, 0);
        pnl.add(txtSerie, gbc);

        txtPreimpreso = new JTextField();
        /*txtPreimpreso.setColumns(10);
        txtPreimpreso.setDocument(new UpperCaseNumberDocument(10));*/
        FormatObject.formatJTextFieldPreimpresoDig(txtPreimpreso);
        txtPreimpreso.setMinimumSize(txtPreimpreso.getPreferredSize());
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
        txtTipoDocBusq.addKeyListener(this);
        txtTipoDocBusq.addMouseListener(this);
        txtTipoDocBusq.addFocusListener(this);
        txtSerie.addFocusListener(this);
        txtSerieBusq.addFocusListener(this);
        txtPreimpreso.addFocusListener(this);
        txtPreimpresoBusq.addFocusListener(this);
        txtSerie.addKeyListener(this);
        txtPreimpreso.addKeyListener(this);
        btnGuardar.addActionListener(this);
        chkFecha.addItemListener(this);
    }

    protected void loadCombo() {
    }

    protected void initFechas() {
        dcFechaIni.setDate(DateTime.getDateFecha("01/01/" + this.frmMain.getAnio()));
        dcFechaFin.setDate(frmMain.getFechaFin());
    }

    protected void loadClasifBanco() throws Exception {
    }

    protected void loadMedioPago() throws Exception {
    }

    protected void loadBanco(String id_clasif) throws Exception {
    }

    protected void loadCuenta() throws Exception {
    }

    protected void loadMoneda() throws Exception {
    }

    protected void buscarAnexo(JTextField txtAnexo, JTextField txtAnexoDesc) {
    }

    public void setValueSearch(Object valor, Component comp) {
    }

    protected void buscarTipoDocVenta(JTextField txtTd, JTextField txtTdDesc) {
    }

    protected void buscarDocumentos() {
    }

    protected boolean verificarDatos() {
        return false;
    }

    protected void guardarDocumento() {
    }

    protected void guardarAsiento() throws Exception {
    }

    protected void cellEdit() {
        boolean sw = false;
        String id_moneda = cboMonedaCanc.getSelectedIndex() > 0 ? xMoneda.get(cboMonedaCanc.getSelectedIndex() - 1).getIdMoneda() : "";
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
        if (txtTipoDoc.getText().trim().equals("RI")) {
            if (txtPreimpreso.getText().trim().length() > 0) {
                int pre = Integer.parseInt(txtPreimpreso.getText());
                for (int i = 0; i < modelTable.getRowCount(); i++) {
                    if (modelTable.getCxP(i).isSwSelected()) {
                        pre += 1;
                        String preimpreso = "0000000000" + String.valueOf(pre);
                        modelTable.getCxP(i).setPreimpresoCanc(preimpreso.substring(preimpreso.length() - 10, preimpreso.length()));
                    }
                }
                modelTable.fireTableDataChanged();
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
            if (e.getSource() == txtTipoDocBusq) {
                buscarTipoDocVenta(txtTipoDocBusq, txtTipoDocBusqDesc);
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
            if (e.getSource() == txtTipoDocBusq) {
                buscarTipoDocVenta(txtTipoDocBusq, txtTipoDocBusqDesc);
            }
        }
        if (e.getKeyChar() == KeyEvent.VK_DELETE || e.getKeyChar() == KeyEvent.VK_BACK_SPACE) {
            if (e.getSource() == txtAnexo) {
                txtAnexoDesc.setText("");
            }
            if (e.getSource() == txtTipoDoc) {
                txtTipoDocDesc.setText("");
            }
            if (e.getSource() == txtTipoDocBusq) {
                txtTipoDocBusqDesc.setText("");
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
        if (e.getSource() instanceof JTextField) {
            ((JTextField) e.getSource()).selectAll();
        }
    }

    @Override
    public void focusLost(FocusEvent e) {
        if (e.getSource().equals(txtSerie)) {
            FormatObject.formatSerie(txtSerie);
            changeSerie();
        }
        if (e.getSource().equals(txtPreimpreso)) {
            FormatObject.formatPreimpreso(txtPreimpreso);
            changePreimpreso();
        }
        if (e.getSource().equals(txtSerieBusq)) {
            FormatObject.formatSerie(txtSerieBusq);
        }
        if (e.getSource().equals(txtPreimpresoBusq)) {
            FormatObject.formatPreimpreso(txtPreimpresoBusq);
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
                String id_moneda = cboMonedaCanc.getSelectedIndex() > 0 ? xMoneda.get(cboMonedaCanc.getSelectedIndex() - 1).getIdMoneda() : "";
                modelTable.setId_moneda_canc(id_moneda);
                loadCuenta();
            }
            if (chkFecha == e.getSource()) {
                dcFechaIni.setEnabled(chkFecha.isSelected());
                dcFechaFin.setEnabled(chkFecha.isSelected());
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
