package com.softcommerce.views.uipnlreportetventas;


import com.softcommerce.formularios.*;
import com.softcommerce.beans.BeanFamilia;
import com.softcommerce.beans.BeanFilterRpt;
import com.softcommerce.beans.BeanLocalidad;
import com.softcommerce.beans.BeanMarca;
import com.softcommerce.beans.BeanPuntoVenta;
import com.softcommerce.beans.BeanRptJasper;
import com.softcommerce.beans.BeanSubFamilia;
import com.softcommerce.beans.BeanTipoDocVenta;
import com.softcommerce.beans.Usuario;
import com.softcommerce.enums.MonedaEnum;
import com.softcommerce.enums.TipoAnexoEnum;
import com.softcommerce.enums.TipoDocVentaEnum;
import com.softcommerce.general.controles.IntegerDocument;
import com.softcommerce.general.controles.ObjectItem;
import com.softcommerce.iconos.Gif;
import com.softcommerce.reglasnegocio.RnTipoDocVenta;
import com.softcommerce.reglasnegocio.RnConsultas;
import com.softcommerce.reglasnegocio.RnFamilia;
import com.softcommerce.reglasnegocio.RnLocalidad;
import com.softcommerce.reglasnegocio.RnMarca;
import com.softcommerce.reglasnegocio.RnPuntoVenta;
import com.softcommerce.reglasnegocio.RnSubFamilia;
import com.softcommerce.util.Constans;
import com.softcommerce.util.ExceptionHandler;
import com.softcommerce.util.Exportar;
import com.softcommerce.util.FormatObject;
import com.softcommerce.util.FxAnexo;
import com.softcommerce.util.UtilDate;
import com.softcommerce.util.combo.LoadCombo;
import com.softcommerce.util.combo.LoadComboItem;
import com.toedter.calendar.JDateChooser;
import java.awt.BorderLayout;
import java.awt.Color;
import java.awt.Dimension;
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
import java.io.File;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import javax.swing.BorderFactory;
import javax.swing.BoxLayout;
import javax.swing.ButtonGroup;
import javax.swing.JButton;
import javax.swing.JComboBox;
import javax.swing.JInternalFrame;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import javax.swing.JRadioButton;
import javax.swing.JSplitPane;
import javax.swing.JTextField;
import javax.swing.border.Border;
import javax.swing.border.LineBorder;
import javax.swing.border.TitledBorder;
import net.sf.jasperreports.engine.JRParameter;
import net.sf.jasperreports.engine.data.JRBeanCollectionDataSource;
import java.net.URL;
import javax.swing.JCheckBox;
import org.apache.log4j.Logger;

public class UiPnlReportetVentas
        extends JInternalFrame
        implements InterUiPnlReportetVentas, ActionListener, KeyListener, MouseListener, FocusListener, ItemListener {

    protected final Logger logger = Logger.getLogger(UiPnlReportetVentas.class);
    protected final URL path;
    protected JRadioButton rbReport1;
    protected JRadioButton rbReport2;
    protected JRadioButton rbReport3;
    protected JRadioButton rbReport4;
    protected JRadioButton rbReport5;
    protected JRadioButton rbReport6;
    protected JRadioButton rbReport7;
    protected ButtonGroup bgReport;
    protected JComboBox cboLocalidad;
    protected JComboBox cboPuntoVenta;
    protected JComboBox cboTipoDocVta;
    protected JComboBox cboFamilia;
    protected JComboBox cboSubFamilia;
    protected JComboBox cboMarca;
    protected JComboBox cboMoneda;
    protected JCheckBox chkSoles;
    protected JDateChooser dcFechaIni;
    protected JDateChooser dcFechaFin;
    protected JTextField txtProducto;
    protected JTextField txtProductoDesc;
    protected JTextField txtAnexo;
    protected JTextField txtAnexoDesc;
    protected JTextField txtSerie;
    protected JButton btnExportar;
    protected JButton btnView;
    protected JButton btnPdf;
    protected Gif gif;
    protected JPanel pnlProducto;
    protected final Usuario usuario;
    protected final Main frmMain;
    protected final boolean isVenta;
    protected TipoAnexoEnum tipoAnexoEnum;

    public UiPnlReportetVentas(String title, URL path, Main frm, Usuario usuario, boolean isVenta) {
        super(title);
        this.path = path;
        this.usuario = usuario;
        this.frmMain = frm;
        this.isVenta = isVenta;
        initComponents();
    }

    protected void initComponents() {
        gif = new Gif();
        tipoAnexoEnum = TipoAnexoEnum.PROVEEDOR;
        if (this.isVenta) {
            tipoAnexoEnum = TipoAnexoEnum.CLIENTE;
        }
        JPanel pnlPrincipal = new JPanel();
        pnlPrincipal.setLayout(new BorderLayout());
        this.getContentPane().add(pnlPrincipal);
        JSplitPane contenido = new JSplitPane(JSplitPane.HORIZONTAL_SPLIT, true, getPnlLeft(), getPnlRigth());
        contenido.setContinuousLayout(true);
        contenido.setOneTouchExpandable(true);
        pnlPrincipal.add(contenido, BorderLayout.CENTER);
        initListener();
        loadCombo();
        changeReport(rbReport1);
        configurarInternal();
        pack();
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

    protected void initListener() {
    }

    protected void loadCombo() {
    }

    protected JPanel getPnlLeft() {
        JPanel pnl = new JPanel();
        pnl.setBorder(new LineBorder(new Color(130, 135, 144)));
        pnl.setLayout(new BoxLayout(pnl, BoxLayout.Y_AXIS));
        rbReport1 = new JRadioButton("Detallado por Documento");
        rbReport1.setSelected(true);
        String detallado = "Detallado por Proveedor";
        String total = "Total por Proveedor";
        if (this.isVenta) {
            detallado = "Detallado por Cliente";
            total = "Total por Cliente";
        }
        rbReport2 = new JRadioButton("Total por Documento");
        rbReport3 = new JRadioButton("Detallado por Producto");
        rbReport4 = new JRadioButton("Total por Producto");
        rbReport5 = new JRadioButton(detallado);
        rbReport6 = new JRadioButton(total);
        rbReport7 = new JRadioButton("General");
        pnl.add(rbReport1);
        pnl.add(rbReport2);
        pnl.add(rbReport3);
        pnl.add(rbReport4);
        pnl.add(rbReport5);
        pnl.add(rbReport6);
        pnl.add(rbReport7);
        bgReport = new ButtonGroup();
        bgReport.add(rbReport1);
        bgReport.add(rbReport2);
        bgReport.add(rbReport3);
        bgReport.add(rbReport4);
        bgReport.add(rbReport5);
        bgReport.add(rbReport6);
        bgReport.add(rbReport7);
        return pnl;
    }

    protected JPanel getPnlRigth() {
        JPanel pnl = new JPanel();
        pnl.setBorder(new LineBorder(new Color(130, 135, 144)));
        pnl.setLayout(new BorderLayout());
        JPanel pnlNorth = new JPanel();
        pnlNorth.setLayout(new BorderLayout());
        pnl.add(pnlNorth, BorderLayout.NORTH);
        JPanel pnlWest = new JPanel();
        pnlNorth.add(pnlWest, BorderLayout.WEST);
        pnlWest.setLayout(new GridBagLayout());
        GridBagConstraints gbc = new GridBagConstraints();
        gbc.gridx = 0;
        gbc.gridy = 0;
        gbc.insets = new Insets(1, 1, 1, 1);
        gbc.anchor = GridBagConstraints.WEST;
        gbc.fill = GridBagConstraints.BOTH;
        pnlWest.add(getPnlEmpresa(), gbc);
        gbc.gridx = 1;
        pnlWest.add(getPnlFecha(), gbc);
        gbc.gridx = 0;
        gbc.gridy = 1;
        pnlProducto = getPnlProducto();
        pnlWest.add(pnlProducto, gbc);
        gbc.gridx = 1;
        pnlWest.add(getPnlDocumento(), gbc);
        gbc.gridx = 0;
        gbc.gridy = 2;
        gbc.gridwidth = 2;
        pnlWest.add(getPnlCliente(), gbc);
        gbc.gridy = 3;
        pnlWest.add(getPnlOpciones(), gbc);
        return pnl;
    }

    protected JPanel getPnlFecha() {
        JPanel pnl = new JPanel();
        pnl.setLayout(new BorderLayout());
        JPanel pnlNorth = new JPanel();
        pnlNorth.setLayout(new BorderLayout());
        pnl.add(pnlNorth, BorderLayout.NORTH);
        Border border;
        JPanel pnlWest = new JPanel();
        pnlNorth.add(pnlWest, BorderLayout.WEST);
        pnlWest.setLayout(new GridBagLayout());
        border = BorderFactory.createTitledBorder(null, "DE LA FECHA", TitledBorder.LEFT, TitledBorder.DEFAULT_POSITION, new Font("Verdana", 1, 11), Color.BLACK);
        pnl.setBorder(border);
        GridBagConstraints gbc = new GridBagConstraints();
        gbc.gridx = 0;
        gbc.gridy = 0;
        gbc.insets = new Insets(2, 2, 2, 2);
        gbc.anchor = GridBagConstraints.WEST;
        gbc.fill = GridBagConstraints.HORIZONTAL;
        JLabel lblDesde = new JLabel("Desde");
        pnlWest.add(lblDesde, gbc);
        dcFechaIni = new JDateChooser("dd/MM/yyyy", "##/##/####", '_');
        dcFechaIni.setDate(new Date());
        gbc.gridx = 1;
        pnlWest.add(dcFechaIni, gbc);
        gbc.gridx = 0;
        gbc.gridy = 1;
        JLabel lblHasta = new JLabel("Hasta");
        pnlWest.add(lblHasta, gbc);
        dcFechaFin = new JDateChooser("dd/MM/yyyy", "##/##/####", '_');
        dcFechaFin.setDate(new Date());
        gbc.gridx = 1;
        pnlWest.add(dcFechaFin, gbc);
        return pnl;
    }

    protected JPanel getPnlProducto() {
        JPanel pnl = new JPanel();
        pnl.setLayout(new BorderLayout());
        JPanel pnlNorth = new JPanel();
        pnlNorth.setLayout(new BorderLayout());
        pnl.add(pnlNorth, BorderLayout.NORTH);
        Border border;
        JPanel pnlWest = new JPanel();
        pnlNorth.add(pnlWest, BorderLayout.WEST);
        pnlWest.setLayout(new GridBagLayout());
        border = BorderFactory.createTitledBorder(null, "DEL PRODUCTO", TitledBorder.LEFT, TitledBorder.DEFAULT_POSITION, new Font("Verdana", 1, 11), Color.BLACK);
        pnl.setBorder(border);
        GridBagConstraints gbc = new GridBagConstraints();
        gbc.gridx = 0;
        gbc.gridy = 0;
        gbc.insets = new Insets(2, 2, 2, 2);
        gbc.anchor = GridBagConstraints.WEST;
        gbc.fill = GridBagConstraints.HORIZONTAL;
        JLabel lblProducto = new JLabel("Producto");
        gbc.gridx = 0;
        gbc.gridy = 0;
        pnlWest.add(lblProducto, gbc);

        gbc.gridx = 1;
        txtProducto = new JTextField();
        txtProducto.setDocument(new IntegerDocument(6));
        txtProducto.setColumns(7);
        gbc.insets = new Insets(2, 1, 2, 0);
        pnlWest.add(txtProducto, gbc);

        txtProductoDesc = new JTextField();
        txtProductoDesc.setEnabled(false);
        txtProductoDesc.setColumns(21);
        gbc.insets = new Insets(2, 0, 2, 0);
        gbc.gridx = 2;
        pnlWest.add(txtProductoDesc, gbc);
        gbc.insets = new Insets(2, 2, 2, 2);
        gbc.fill = GridBagConstraints.NONE;
        JLabel lblFamilia = new JLabel("Familia");
        gbc.gridx = 0;
        gbc.gridy = 1;
        pnlWest.add(lblFamilia, gbc);
        gbc.gridx = 1;
        cboFamilia = new JComboBox();
        gbc.gridwidth = 2;
        pnlWest.add(cboFamilia, gbc);
        gbc.gridwidth = 1;
        JLabel lblSubFamilia = new JLabel("Sub Familia");
        gbc.gridx = 0;
        gbc.gridy = 2;
        pnlWest.add(lblSubFamilia, gbc);
        gbc.gridx = 1;
        cboSubFamilia = new JComboBox();
        gbc.gridwidth = 2;
        pnlWest.add(cboSubFamilia, gbc);
        gbc.gridwidth = 1;
        JLabel lblMarca = new JLabel("Marca");
        gbc.gridx = 0;
        gbc.gridy = 3;
        pnlWest.add(lblMarca, gbc);
        gbc.gridx = 1;
        cboMarca = new JComboBox();
        gbc.gridwidth = 2;
        pnlWest.add(cboMarca, gbc);
        gbc.gridwidth = 1;
        return pnl;
    }

    protected JPanel getPnlCliente() {
        JPanel pnl = new JPanel();
        pnl.setLayout(new BorderLayout());
        JPanel pnlNorth = new JPanel();
        pnlNorth.setLayout(new BorderLayout());
        pnl.add(pnlNorth, BorderLayout.NORTH);
        Border border;
        JPanel pnlWest = new JPanel();
        pnlNorth.add(pnlWest, BorderLayout.WEST);
        pnlWest.setLayout(new GridBagLayout());
        String titulo = "DEL PROVEEDOR";
        String nameAnexo = "Proveedor";
        if (this.isVenta) {
            titulo = "DEL CLIENTE";
            nameAnexo = "Cliente";
        }
        border = BorderFactory.createTitledBorder(null, titulo, TitledBorder.LEFT, TitledBorder.DEFAULT_POSITION, new Font("Verdana", 1, 11), Color.BLACK);
        pnl.setBorder(border);
        GridBagConstraints gbc = new GridBagConstraints();
        gbc.gridx = 0;
        gbc.gridy = 0;
        gbc.insets = new Insets(2, 2, 2, 2);
        gbc.anchor = GridBagConstraints.WEST;
        gbc.fill = GridBagConstraints.HORIZONTAL;
        JLabel lblCliente = new JLabel(nameAnexo);
        gbc.gridx = 0;
        gbc.gridy = 0;
        pnlWest.add(lblCliente, gbc);

        gbc.gridx = 1;
        txtAnexo = new JTextField();
        txtAnexo.setDocument(new IntegerDocument(11));
        txtAnexo.setColumns(7);
        gbc.insets = new Insets(2, 1, 2, 0);
        pnlWest.add(txtAnexo, gbc);

        txtAnexoDesc = new JTextField();
        txtAnexoDesc.setEnabled(false);
        txtAnexoDesc.setColumns(30);
        gbc.insets = new Insets(2, 0, 2, 0);
        gbc.gridx = 2;
        pnlWest.add(txtAnexoDesc, gbc);
        gbc.insets = new Insets(2, 2, 2, 2);
        gbc.fill = GridBagConstraints.NONE;
        return pnl;
    }

    protected JPanel getPnlEmpresa() {
        JPanel pnl = new JPanel();
        pnl.setLayout(new BorderLayout());
        JPanel pnlNorth = new JPanel();
        pnlNorth.setLayout(new BorderLayout());
        pnl.add(pnlNorth, BorderLayout.NORTH);
        Border border;
        JPanel pnlWest = new JPanel();
        pnlNorth.add(pnlWest, BorderLayout.WEST);
        pnlWest.setLayout(new GridBagLayout());
        border = BorderFactory.createTitledBorder(null, "DE LA EMPRESA", TitledBorder.LEFT, TitledBorder.DEFAULT_POSITION, new Font("Verdana", 1, 11), Color.BLACK);
        pnl.setBorder(border);
        GridBagConstraints gbc = new GridBagConstraints();
        gbc.gridx = 0;
        gbc.gridy = 0;
        gbc.insets = new Insets(2, 2, 2, 2);
        gbc.anchor = GridBagConstraints.WEST;
        gbc.fill = GridBagConstraints.HORIZONTAL;
        JLabel lblLocalidad = new JLabel("Localidad");
        pnlWest.add(lblLocalidad, gbc);
        cboLocalidad = new JComboBox();
        gbc.gridx = 1;
        pnlWest.add(cboLocalidad, gbc);
        gbc.gridx = 0;
        gbc.gridy = 1;
        JLabel lblPtoVta = new JLabel("Punto de Venta");
        pnlWest.add(lblPtoVta, gbc);
        cboPuntoVenta = new JComboBox();
        gbc.gridx = 1;
        pnlWest.add(cboPuntoVenta, gbc);
        return pnl;
    }

    protected JPanel getPnlDocumento() {
        JPanel pnl = new JPanel();
        pnl.setLayout(new BorderLayout());
        JPanel pnlNorth = new JPanel();
        pnlNorth.setLayout(new BorderLayout());
        pnl.add(pnlNorth, BorderLayout.NORTH);
        Border border;
        JPanel pnlWest = new JPanel();
        pnlNorth.add(pnlWest, BorderLayout.WEST);
        pnlWest.setLayout(new GridBagLayout());
        border = BorderFactory.createTitledBorder(null, "DEL DOCUMENTO", TitledBorder.LEFT, TitledBorder.DEFAULT_POSITION, new Font("Verdana", 1, 11), Color.BLACK);
        pnl.setBorder(border);
        GridBagConstraints gbc = new GridBagConstraints();
        gbc.gridx = 0;
        gbc.gridy = 0;
        gbc.insets = new Insets(2, 2, 2, 2);
        gbc.anchor = GridBagConstraints.WEST;
        gbc.fill = GridBagConstraints.HORIZONTAL;
        JLabel lblDoc = new JLabel("Tipo Doc");
        pnlWest.add(lblDoc, gbc);
        cboTipoDocVta = new JComboBox();
        gbc.gridx = 1;
        pnlWest.add(cboTipoDocVta, gbc);
        gbc.gridx = 0;
        gbc.gridy = 1;
        JLabel lblSerie = new JLabel("Serie");
        pnlWest.add(lblSerie, gbc);
        txtSerie = new JTextField();
        FormatObject.formatJTextFieldSerie(txtSerie);
        gbc.gridx = 1;
        gbc.fill = GridBagConstraints.NONE;
        pnlWest.add(txtSerie, gbc);
        gbc.gridx = 0;
        gbc.gridy = 2;
        JLabel lblMoneda = new JLabel("Moneda");
        cboMoneda = new JComboBox();
        chkSoles = new JCheckBox("Mostrar Soles");
        if (!this.isVenta) {
            pnlWest.add(lblMoneda, gbc);
            gbc.gridx = 1;
            pnlWest.add(cboMoneda, gbc);
            gbc.gridy = 3;
            pnlWest.add(chkSoles, gbc);
        }
        return pnl;
    }

    protected JPanel getPnlOpciones() {
        return null;
    }

    protected void loadLocalidad() throws Exception {
    }

    protected void loadPuntoVenta(String idLocalidad) throws Exception {
    }

    protected void loadMarca() throws Exception {
    }

    protected void loadFamilia() throws Exception {
    }

    public void loadSubFamilia(String xcodfamilia) {
    }

    protected void loadTipoDocumento() throws Exception {
    }

    protected boolean isDocView(String idTipoDoc) {
        return idTipoDoc.equals(TipoDocVentaEnum.FACTURA.getValue()) || idTipoDoc.equals(TipoDocVentaEnum.BOLETA.getValue())
                || idTipoDoc.equals(TipoDocVentaEnum.NOTA_DEBITO.getValue()) || idTipoDoc.equals(TipoDocVentaEnum.NOTA_CREDITO.getValue());
    }

    protected void changeReport(JRadioButton rb) {
        if (rb == rbReport4 || rb == rbReport3) {
            actDesControles(true);
        } else {
            actDesControles(false);
        }
    }

    protected void actDesControles(boolean sw) {
        pnlProducto.setEnabled(sw);
        txtProducto.setEnabled(sw);
        cboFamilia.setEnabled(sw);
        cboSubFamilia.setEnabled(sw);
        cboMarca.setEnabled(sw);
    }

    protected void reporte(String button) throws Exception {
    }

    protected BeanRptJasper getRpt(BeanFilterRpt filterRpt) throws Exception {
        if (this.isVenta) {
            return this.getRptVenta(filterRpt);
        }
        return this.getRptCompra(filterRpt);
    }

    protected BeanRptJasper getRptVenta(BeanFilterRpt filterRpt) throws Exception {
        return null;
    }

    protected BeanRptJasper getRptCompra(BeanFilterRpt filterRpt) throws Exception {
        return null;
    }

    @Override
    public void actionPerformed(ActionEvent e) {
        try {
            if (btnExportar == e.getSource() || btnPdf == e.getSource() || btnView == e.getSource()) {
                reporte((btnExportar == e.getSource() ? "exportar" : (btnView == e.getSource() ? "view" : "pdf")));
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
    public void keyPressed(KeyEvent e) {
        if (e.getKeyChar() == '\n') {
            if (e.getSource() == txtAnexo) {
                FxAnexo.buscarAnexo(txtAnexo, txtAnexoDesc, tipoAnexoEnum.getValue(), frmMain, path, usuario, this);
            }
        }
        if (e.getKeyChar() == KeyEvent.VK_DELETE || e.getKeyChar() == KeyEvent.VK_BACK_SPACE) {
            if (e.getSource() == txtAnexo) {
                txtAnexoDesc.setText("");
            }
        }
    }

    @Override
    public void keyReleased(KeyEvent e) {
    }

    @Override
    public void mouseClicked(MouseEvent e) {
        if (e.getClickCount() == 2) {
            if (e.getSource() == txtAnexo) {
                FxAnexo.buscarAnexo(txtAnexo, txtAnexoDesc, tipoAnexoEnum.getValue(), frmMain, path, usuario, this);
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
    public void focusGained(FocusEvent e) {
        if (e.getSource() instanceof JTextField) {
            ((JTextField) e.getSource()).selectAll();
        }
    }

    @Override
    public void focusLost(FocusEvent e) {
        if (e.getSource() == txtSerie) {
            FormatObject.formatSerie((JTextField) e.getSource());
        }
        if (e.getSource() == txtProducto) {
            if (txtProducto.getText().trim().length() > 0) {
                String cod = "";
                for (int i = 0; i < 6 - txtProducto.getText().trim().length(); i++) {
                    cod += "0";
                }
                txtProducto.setText(cod + txtProducto.getText().trim());
            }
        }
    }

    protected void changeLocalidad() throws Exception {
    }

    protected void changeFamilia() {
    }

    @Override
    public void itemStateChanged(ItemEvent e) {
        try {
            if (rbReport1 == e.getSource() || rbReport2 == e.getSource() || rbReport3 == e.getSource() || rbReport4 == e.getSource() || rbReport5 == e.getSource() || rbReport6 == e.getSource() || rbReport7 == e.getSource()) {
                changeReport((JRadioButton) e.getSource());
            }
            if (cboLocalidad == e.getSource()) {
                this.changeLocalidad();
            }
            if (cboFamilia == e.getSource()) {
                this.changeFamilia();
            }
            if (e.getSource().equals(cboMoneda)) {
                chkSoles.setEnabled(LoadComboItem.getIdCombo(cboMoneda).equals(MonedaEnum.DOLARES.getValue()));
                chkSoles.setSelected(false);
            }
        } catch (Exception ex) {
            ExceptionHandler.handleException(ex, logger);
            JOptionPane.showMessageDialog(this, ex.getMessage());
        }
    }
}
