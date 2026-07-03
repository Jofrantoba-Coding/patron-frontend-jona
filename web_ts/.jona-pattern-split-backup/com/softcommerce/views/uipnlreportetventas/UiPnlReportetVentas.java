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

    private final Logger logger = Logger.getLogger(UiPnlReportetVentas.class);
    private final URL path;
    private JRadioButton rbReport1;
    private JRadioButton rbReport2;
    private JRadioButton rbReport3;
    private JRadioButton rbReport4;
    private JRadioButton rbReport5;
    private JRadioButton rbReport6;
    private JRadioButton rbReport7;
    private ButtonGroup bgReport;
    private JComboBox cboLocalidad;
    private JComboBox cboPuntoVenta;
    private JComboBox cboTipoDocVta;
    private JComboBox cboFamilia;
    private JComboBox cboSubFamilia;
    private JComboBox cboMarca;
    private JComboBox cboMoneda;
    private JCheckBox chkSoles;
    private JDateChooser dcFechaIni;
    private JDateChooser dcFechaFin;
    private JTextField txtProducto;
    private JTextField txtProductoDesc;
    private JTextField txtAnexo;
    private JTextField txtAnexoDesc;
    private JTextField txtSerie;
    private JButton btnExportar;
    private JButton btnView;
    private JButton btnPdf;
    private Gif gif;
    private JPanel pnlProducto;
    private final Usuario usuario;
    private final Main frmMain;
    private final boolean isVenta;
    private TipoAnexoEnum tipoAnexoEnum;

    public UiPnlReportetVentas(String title, URL path, Main frm, Usuario usuario, boolean isVenta) {
        super(title);
        this.path = path;
        this.usuario = usuario;
        this.frmMain = frm;
        this.isVenta = isVenta;
        initComponents();
    }

    private void initComponents() {
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

    private void initListener() {
        cboLocalidad.addItemListener(this);
        cboFamilia.addItemListener(this);
        cboMoneda.addItemListener(this);
        rbReport1.addItemListener(this);
        rbReport2.addItemListener(this);
        rbReport3.addItemListener(this);
        rbReport4.addItemListener(this);
        rbReport5.addItemListener(this);
        rbReport6.addItemListener(this);
        rbReport7.addItemListener(this);
        btnExportar.addActionListener(this);
        btnView.addActionListener(this);
        btnPdf.addActionListener(this);
        txtAnexo.addKeyListener(this);
        txtAnexo.addMouseListener(this);
        txtAnexo.addFocusListener(this);
        txtProducto.addFocusListener(this);
        txtSerie.addFocusListener(this);
    }

    private void loadCombo() {
        try {
            loadLocalidad();
            loadMarca();
            loadFamilia();
            loadTipoDocumento();
            LoadCombo.loadMonedaItem(path, cboMoneda, Constans.ITEM_INIT, 0);
        } catch (Exception e) {
            ExceptionHandler.handleException(e, logger);
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }

    private JPanel getPnlLeft() {
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

    private JPanel getPnlRigth() {
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

    private JPanel getPnlFecha() {
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

    private JPanel getPnlProducto() {
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

    private JPanel getPnlCliente() {
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

    private JPanel getPnlEmpresa() {
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

    private JPanel getPnlDocumento() {
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

    private JPanel getPnlOpciones() {
        JPanel pnlOpc = new JPanel();
        btnView = new JButton("Vista Previa", gif.VistaPrevia);
        pnlOpc.add(btnView);
        btnExportar = new JButton("Rep. Excel", gif.EXCEL);
        pnlOpc.add(btnExportar);
        btnPdf = new JButton("Rep. Pdf", gif.ExportPdf);
        pnlOpc.add(btnPdf);
        return pnlOpc;
    }

    private void loadLocalidad() throws Exception {
        try {
            RnLocalidad logic = new RnLocalidad(path);
            List<BeanLocalidad> list = logic.listarLocalidad("", "A");
            cboLocalidad.addItem(new ObjectItem(Constans.ITEM_INIT, null));
            for (BeanLocalidad localidad : list) {
                cboLocalidad.addItem(new ObjectItem(localidad.getDescripcion(), localidad.getId_localidad()));
            }
        } catch (Exception e) {
            throw e;
        }
    }

    private void loadPuntoVenta(String idLocalidad) throws Exception {
        try {
            RnPuntoVenta logic = new RnPuntoVenta(path);
            List<BeanPuntoVenta> list = logic.listPuntoVenta(idLocalidad);
            cboPuntoVenta.removeAllItems();
            cboPuntoVenta.addItem(new ObjectItem(Constans.ITEM_INIT, null));
            for (BeanPuntoVenta ptoVta : list) {
                cboPuntoVenta.addItem(new ObjectItem(ptoVta.getDescripcion(), ptoVta.getId_punto_venta()));
            }
        } catch (Exception e) {
            throw e;
        }
    }

    private void loadMarca() throws Exception {
        try {
            RnMarca logic = new RnMarca(path);
            List<BeanMarca> list = logic.listarGeneral(usuario.getCodempresa());
            cboMarca.addItem(new ObjectItem(Constans.ITEM_INIT, null));
            for (BeanMarca marca : list) {
                cboMarca.addItem(new ObjectItem(marca.getDescripcion(), marca.getIdMarca()));
            }
        } catch (Exception e) {
            throw e;
        }
    }

    private void loadFamilia() throws Exception {
        try {
            RnFamilia reglaFamilia = new RnFamilia(path);
            List<BeanFamilia> lista = reglaFamilia.listarFamiliaItem("S");
            cboFamilia.addItem(new ObjectItem(Constans.ITEM_INIT, null));
            for (BeanFamilia familia : lista) {
                cboFamilia.addItem(new ObjectItem(familia.getDescripcion(), familia.getIdFamilia()));
            }
        } catch (Exception e) {
            throw e;
        }
    }

    public void loadSubFamilia(String xcodfamilia) {
        try {
            BeanSubFamilia s = new BeanSubFamilia();
            BeanFamilia beanFamilia = new BeanFamilia();
            beanFamilia.setIdFamilia(xcodfamilia);
            s.setBeanFamilia(beanFamilia);

            RnSubFamilia reglaSubFamilia = new RnSubFamilia(path);
            List<BeanSubFamilia> list = reglaSubFamilia.listar(s);
            cboSubFamilia.removeAllItems();
            cboSubFamilia.addItem(new ObjectItem(Constans.ITEM_INIT, null));
            for (BeanSubFamilia bean : list) {
                cboSubFamilia.addItem(new ObjectItem(bean.getDescripcion(), bean.getIdSubFamilia()));
            }
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }

    private void loadTipoDocumento() throws Exception {
        try {
            RnTipoDocVenta reglaTipoDoc = new RnTipoDocVenta(path);
            List<BeanTipoDocVenta> lista = reglaTipoDoc.listarTipoDocVenta("", "", "", "A", "", "", "");
            cboTipoDocVta.addItem(new ObjectItem(Constans.ITEM_INIT, null));
            for (BeanTipoDocVenta docVta : lista) {
                if (this.isDocView(docVta.getIdTipoDoc())) {
                    cboTipoDocVta.addItem(new ObjectItem(docVta.getDescripcion(), docVta.getIdTipoDoc()));
                }
            }
        } catch (Exception e) {
            throw e;
        }
    }

    private boolean isDocView(String idTipoDoc) {
        return idTipoDoc.equals(TipoDocVentaEnum.FACTURA.getValue()) || idTipoDoc.equals(TipoDocVentaEnum.BOLETA.getValue())
                || idTipoDoc.equals(TipoDocVentaEnum.NOTA_DEBITO.getValue()) || idTipoDoc.equals(TipoDocVentaEnum.NOTA_CREDITO.getValue());
    }

    private void changeReport(JRadioButton rb) {
        if (rb == rbReport4 || rb == rbReport3) {
            actDesControles(true);
        } else {
            actDesControles(false);
        }
    }

    private void actDesControles(boolean sw) {
        pnlProducto.setEnabled(sw);
        txtProducto.setEnabled(sw);
        cboFamilia.setEnabled(sw);
        cboSubFamilia.setEnabled(sw);
        cboMarca.setEnabled(sw);
    }

    private void reporte(String button) throws Exception {
        try {
            String formato;
            if (button.equals("exportar")) {
                formato = "xlsx";
            } else {
                formato = "pdf";
            }
            Map parameters = new HashMap();
            BeanFilterRpt filterRpt = new BeanFilterRpt();
            filterRpt.setIdLocalidad(LoadComboItem.getIdCombo(cboLocalidad));
            filterRpt.setIdPtoVta(LoadComboItem.getIdCombo(cboPuntoVenta));
            filterRpt.setIdTipoDoc(LoadComboItem.getIdCombo(cboTipoDocVta));
            filterRpt.setIdMarca(LoadComboItem.getIdCombo(cboMarca));
            filterRpt.setIdFamilia(LoadComboItem.getIdCombo(cboFamilia));
            filterRpt.setIdSubFamilia(LoadComboItem.getIdCombo(cboSubFamilia));
            filterRpt.setIdMoneda(LoadComboItem.getIdCombo(cboMoneda));
            filterRpt.setMostratSoles(chkSoles.isSelected() ? "S" : "N");
            filterRpt.setSerie(txtSerie.getText());
            filterRpt.setIdAnexo(txtAnexo.getText());
            filterRpt.setIdItem(txtProducto.getText());
            filterRpt.setFchaIni(new java.sql.Date(dcFechaIni.getDate().getTime()));
            filterRpt.setFchaFin(new java.sql.Date(dcFechaFin.getDate().getTime()));
            parameters.put("NOMBRE_EMPRESA", usuario.getDescriempresa());
            parameters.put("RUC", usuario.getRuc());
            parameters.put("F_INI", UtilDate.getStrFecha(dcFechaIni.getDate()));
            parameters.put("F_FIN", UtilDate.getStrFecha(dcFechaFin.getDate()));
            parameters.put("TIPO_REPORTE", formato);
            parameters.put("PTO_VTA", filterRpt.getIdPtoVta().equals("") ? "" : cboPuntoVenta.getSelectedItem().toString());
            BeanRptJasper beanRpt = this.getRpt(filterRpt);
            File file = File.createTempFile(beanRpt.getNombreArchivo() + (new Date()).getTime(), "." + formato);
            file.deleteOnExit();
            if (beanRpt.getListaRpt().isEmpty()) {
                JOptionPane.showMessageDialog(this, "No hay Datos para este reporte");
                return;
            }
            JRBeanCollectionDataSource dataSource;
            dataSource = new JRBeanCollectionDataSource(beanRpt.getListaRpt());
            parameters.put(JRParameter.REPORT_LOCALE, Locale.US);
            Exportar exportar;
            if (button.equals("view")) {
                exportar = new Exportar(parameters, dataSource, beanRpt.getRutaJasper());
                exportar.vistaPrevia(true);
            } else {
                exportar = new Exportar(file, parameters, formato, dataSource, beanRpt.getRutaJasper());
                exportar.show();
            }
        } catch (Exception e) {
            throw e;
        }
    }

    private BeanRptJasper getRpt(BeanFilterRpt filterRpt) throws Exception {
        if (this.isVenta) {
            return this.getRptVenta(filterRpt);
        }
        return this.getRptCompra(filterRpt);
    }

    private BeanRptJasper getRptVenta(BeanFilterRpt filterRpt) throws Exception {
        BeanRptJasper rpt = new BeanRptJasper();
        RnConsultas logic = new RnConsultas(path);
        if (rbReport1.isSelected() || rbReport7.isSelected()) {
            String report;
            if (rbReport1.isSelected()) {
                report = "S";
                rpt.setRutaJasper(Constans.PATH_RPT_JASPER + "rptVentaDetallado.jasper");
                rpt.setNombreArchivo("DetalladoDocumento");
            } else {
                report = "N";
                rpt.setRutaJasper(Constans.PATH_RPT_JASPER + "rptVentaGral.jasper");
                rpt.setNombreArchivo("General");
            }
            rpt.setListaRpt(logic.listarVentaDetalladoRpt(filterRpt, report));
        } else if (rbReport2.isSelected()) {
            rpt.setRutaJasper(Constans.PATH_RPT_JASPER + "rptVentaConsolidado.jasper");
            rpt.setNombreArchivo("Total por Documento");
            rpt.setListaRpt(logic.listarVentaConsolidadoRpt(filterRpt));
        } else if (rbReport3.isSelected()) {
            rpt.setRutaJasper(Constans.PATH_RPT_JASPER + "rptVentaProdDetallado.jasper");
            rpt.setNombreArchivo("DetalladoProducto");
            rpt.setListaRpt(logic.listarVentaProdDetalladoRpt(filterRpt));
        } else if (rbReport4.isSelected()) {
            rpt.setRutaJasper(Constans.PATH_RPT_JASPER + "rptVentaProdConsolidado.jasper");
            rpt.setNombreArchivo("ConsolidadoProducto");
            rpt.setListaRpt(logic.listarVentaProdConsolidadoRpt(filterRpt));
        } else if (rbReport5.isSelected()) {
            rpt.setRutaJasper(Constans.PATH_RPT_JASPER + "rptVentaClienteDetallado.jasper");
            rpt.setNombreArchivo("ClienteDetallado");
            rpt.setListaRpt(logic.listarVentaClienteDetalladoRpt(filterRpt));
        } else if (rbReport6.isSelected()) {
            rpt.setRutaJasper(Constans.PATH_RPT_JASPER + "rptVentaClienteConsolidado.jasper");
            rpt.setNombreArchivo("ClienteConsolidado");
            rpt.setListaRpt(logic.listarVentaClienteConsolidadoRpt(filterRpt));
        }
        return rpt;
    }

    private BeanRptJasper getRptCompra(BeanFilterRpt filterRpt) throws Exception {
        BeanRptJasper rpt = new BeanRptJasper();
        RnConsultas logic = new RnConsultas(path);
        if (rbReport1.isSelected() || rbReport7.isSelected()) {
            if (rbReport1.isSelected()) {
                rpt.setRutaJasper(Constans.PATH_RPT_JASPER + "rptCompraDetallado.jasper");
                rpt.setNombreArchivo("DetalladoDocumento");
            } else {
                rpt.setRutaJasper(Constans.PATH_RPT_JASPER + "rptCompraGral.jasper");
                rpt.setNombreArchivo("General");
            }
            rpt.setListaRpt(logic.listarCompraDetalladoRpt(filterRpt));
        } else if (rbReport2.isSelected()) {
            rpt.setRutaJasper(Constans.PATH_RPT_JASPER + "rptCompraConsolidado.jasper");
            rpt.setNombreArchivo("Total por Documento");
            rpt.setListaRpt(logic.listarCompraConsolidadoRpt(filterRpt));
        } else if (rbReport3.isSelected()) {
            rpt.setRutaJasper(Constans.PATH_RPT_JASPER + "rptCompraProdDetallado.jasper");
            rpt.setNombreArchivo("DetalladoProducto");
            rpt.setListaRpt(logic.listarCompraProdDetalladoRpt(filterRpt));
        } else if (rbReport4.isSelected()) {
            rpt.setRutaJasper(Constans.PATH_RPT_JASPER + "rptCompraProdConsolidado.jasper");
            rpt.setNombreArchivo("ConsolidadoProducto");
            rpt.setListaRpt(logic.listarCompraProdConsolidadoRpt(filterRpt));
        } else if (rbReport5.isSelected()) {
            rpt.setRutaJasper(Constans.PATH_RPT_JASPER + "rptCompraProvDetallado.jasper");
            rpt.setNombreArchivo("ProveedorDetallado");
            rpt.setListaRpt(logic.listarCompraProvDetalladoRpt(filterRpt));
        } else if (rbReport6.isSelected()) {
            rpt.setRutaJasper(Constans.PATH_RPT_JASPER + "rptCompraProvConsolidado.jasper");
            rpt.setNombreArchivo("CompraProvConsolidado");
            rpt.setListaRpt(logic.listarCompraProvConsolidadoRpt(filterRpt));
        }
        return rpt;
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

    private void changeLocalidad() throws Exception {
        if (cboLocalidad.getItemCount() == 0) {
            return;
        }
        if (cboLocalidad.getSelectedIndex() == 0) {
            cboPuntoVenta.removeAllItems();
            cboPuntoVenta.setEnabled(false);
        } else {
            cboPuntoVenta.setEnabled(true);
            loadPuntoVenta(LoadComboItem.getIdCombo(cboLocalidad));
        }
    }

    private void changeFamilia() {
        if (cboFamilia.getItemCount() == 0) {
            return;
        }
        if (cboFamilia.getSelectedIndex() == 0) {
            cboSubFamilia.removeAllItems();
            cboSubFamilia.setEnabled(false);
        } else {
            cboSubFamilia.setEnabled(true);
            loadSubFamilia(LoadComboItem.getIdCombo(cboFamilia));
        }

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
