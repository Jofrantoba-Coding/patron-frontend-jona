package com.softcommerce.views.uiformasientoimportar;


import com.softcommerce.formularios.importar.*;
import com.softcommerce.formularios.*;
import com.softcommerce.beans.BeanAnexo;
import com.softcommerce.beans.BeanCxC;
import com.softcommerce.beans.BeanCxP;
import com.softcommerce.beans.BeanMoneda;
import com.softcommerce.beans.BeanPeriodoMensual;
import com.softcommerce.beans.BeanRegcontaCab;
import com.softcommerce.beans.BeanRptaRcc;
import com.softcommerce.beans.BeanTipoCambio;
import com.softcommerce.beans.BeanTipoDocVenta;
import com.softcommerce.beans.BeanTipoOperacion;
import com.softcommerce.beans.importar.BeanImpCompra;
import com.softcommerce.beans.importar.BeanImpVenta;
import com.softcommerce.beans.Usuario;
import com.softcommerce.beans.UsuarioCorrelativo;
import com.softcommerce.beans.importar.BeanActVendedor;
import com.softcommerce.beans.importar.BeanCabAsiento;
import com.softcommerce.beans.importar.BeanImpAsiento;
import com.softcommerce.beans.importar.BeanImpLetra;
import com.softcommerce.beans.importar.BeanImpLetraGroup;
import com.softcommerce.beans.importar.BeanImpPlanilla;
import com.softcommerce.beans.importar.BeanImportar;
import com.softcommerce.enums.AuxiliarEnum;
import com.softcommerce.enums.MonedaEnum;
import com.softcommerce.enums.TipoAnexoEnum;
import com.softcommerce.enums.TipoDocVentaEnum;
import com.softcommerce.formularios.Main;
import com.softcommerce.general.controles.DoubleDocument;
import com.softcommerce.general.controles.ObjectItem;
import com.softcommerce.general.controles.UpperCaseNumberDocument;
import com.softcommerce.general.herramientas.CTableFx;
import com.softcommerce.general.herramientas.DateTime;
import com.softcommerce.general.tablas.importar.ImpActVendedorTableModel;
import com.softcommerce.general.tablas.importar.ImpAsientoService;
import com.softcommerce.general.tablas.importar.ImpComprasTableModel;
import com.softcommerce.general.tablas.importar.ImpVentasTableModel;
import com.softcommerce.general.tablas.importar.ImpAsientoTableModel;
import com.softcommerce.general.tablas.importar.ImpLetraTableModel;
import com.softcommerce.general.tablas.importar.ImpPlanillaTableModel;
import com.softcommerce.general.tablas.importar.ImpTableService;
import com.softcommerce.iconos.Gif;
import com.softcommerce.reglasnegocio.RnAnexo;
import com.softcommerce.reglasnegocio.RnCliente;
import com.softcommerce.reglasnegocio.RnConsultas;
import com.softcommerce.reglasnegocio.RnCorrelativo;
import com.softcommerce.reglasnegocio.RnPeriodoMensual;
import com.softcommerce.reglasnegocio.RnRegconta;
import com.softcommerce.reglasnegocio.RnTipoCambio;
import com.softcommerce.reglasnegocio.RnTipoOperacion;
import com.softcommerce.util.ExceptionHandler;
import com.softcommerce.util.FxTipoDocVenta;
import com.softcommerce.util.LayoutUtil;
import com.softcommerce.util.Util;
import com.softcommerce.util.UtilDate;
import com.softcommerce.util.UtilExcel;
import com.softcommerce.util.combo.LoadCombo;
import com.softcommerce.util.combo.LoadComboItem;
import com.softcommerce.util.render.CellRendererLabelAsiento;
import com.toedter.calendar.JDateChooser;
import com.toedter.calendar.JTextFieldDateEditor;
import java.awt.BorderLayout;
import java.awt.Color;
import java.awt.Dimension;
import java.awt.Font;
import java.awt.GridBagConstraints;
import java.awt.GridBagLayout;
import java.awt.HeadlessException;
import java.awt.Insets;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.FocusEvent;
import java.awt.event.FocusListener;
import java.awt.event.ItemEvent;
import java.awt.event.ItemListener;
import java.awt.event.KeyEvent;
import java.io.File;
import java.math.BigDecimal;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import javax.swing.JButton;
import javax.swing.JComboBox;
import javax.swing.JDialog;
import javax.swing.JFileChooser;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import javax.swing.JScrollPane;
import javax.swing.table.TableRowSorter;
import jxl.Sheet;
import jxl.read.biff.BiffException;
import org.jdesktop.swingx.HorizontalLayout;
import java.net.URL;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import javax.swing.BorderFactory;
import javax.swing.JComponent;
import javax.swing.JTable;
import javax.swing.JTextField;
import javax.swing.KeyStroke;
import javax.swing.SwingConstants;
import javax.swing.border.Border;
import javax.swing.border.TitledBorder;
import javax.swing.table.AbstractTableModel;
import org.apache.log4j.Logger;

public class UiFormAsientoImportar
        extends JDialog
        implements InterUiFormAsientoImportar, ActionListener, ItemListener, FocusListener {

    private final URL path;
    private final Usuario usuario;
    private JComboBox cboAuxiliar;
    private JButton btnImportar;
    static JFileChooser jChooser;
    public JTable table;
    public ImpVentasTableModel modeltableVentas;
    public ImpActVendedorTableModel modeltableActVendedor;
    public ImpLetraTableModel modeltableLetraVenta;
    public ImpLetraTableModel modeltableLetraCompra;
    public ImpComprasTableModel modeltableCompras;
    public ImpAsientoTableModel modeltableAsiento;
    public ImpPlanillaTableModel modeltablePlanilla;
    public TableRowSorter modeloOrdenado;
    private JButton btnGuardar;
    private JButton btnEliminar;
    private Gif gif;
    private final Logger logger = Logger.getLogger(UiFormAsientoImportar.class);
    private static final SimpleDateFormat SDF_DM = new SimpleDateFormat("dd/MM");
    private static final SimpleDateFormat SDF_MY = new SimpleDateFormat("MM/yyyy");
    private JPanel pnlPlanilla;
    private JComboBox cboTipoCambio;
    private JTextField txtTipoDoc;
    private JTextField txtTipoDocDesc;
    private JTextField txtPreimpreso;
    private JComboBox cboSerie;
    private JDateChooser dcFemision;
    private JComboBox cboMoneda;
    private JTextField txtTc;
    private JTextField txtGlosa;
    private final Main frmMain;
    private String fecha = "";
    private BeanTipoCambio beanTc;
    private JComboBox cboPeriodo;

    public UiFormAsientoImportar(Main frame, Usuario usuario, URL ruta) {
        super(frame, true);
        this.usuario = usuario;
        this.path = ruta;
        this.frmMain = frame;
        initComponents();
    }

    private void initComponents() {
        gif = new Gif();
        modeltableVentas = new ImpVentasTableModel();
        modeltableActVendedor = new ImpActVendedorTableModel();
        modeltableLetraVenta = new ImpLetraTableModel();
        modeltableLetraCompra = new ImpLetraTableModel();
        modeltableCompras = new ImpComprasTableModel();
        modeltableAsiento = new ImpAsientoTableModel();
        modeltablePlanilla = new ImpPlanillaTableModel();
        modeloOrdenado = new TableRowSorter(modeltableVentas);
        table = new JTable();
        table.setRowSorter(modeloOrdenado);
        table.setModel(modeltableVentas);
        table.setFont(new Font("Tahoma", Font.PLAIN, 11));
        table.setRowHeight(19);
        table.setAutoResizeMode(JTable.AUTO_RESIZE_OFF);
        JPanel pnlCenter = new JPanel();
        pnlCenter.setLayout(new BorderLayout());
        JScrollPane scrollTable = new JScrollPane(table);
        scrollTable.setPreferredSize(new Dimension(1000, 450));
        pnlPlanilla = this.getPnlPlanilla();
        pnlCenter.add(pnlPlanilla, BorderLayout.NORTH);
        pnlCenter.add(scrollTable, BorderLayout.CENTER);
        getContentPane().add(pnlCenter, BorderLayout.CENTER);
        JPanel pnlOpciones = new JPanel();
        pnlOpciones.setLayout(new HorizontalLayout(10));
        btnGuardar = new JButton("Guardar", gif.SAVE16);
        btnGuardar.addActionListener(this);
        pnlOpciones.add(btnGuardar);
        btnEliminar = new JButton("Eliminar", gif.ELIMINATE16);
        btnEliminar.addActionListener(this);
        pnlOpciones.add(btnEliminar);
        getContentPane().add(pnlOpciones, BorderLayout.SOUTH);

        JPanel pnlCabecera = new JPanel();
        pnlCabecera.setLayout(new HorizontalLayout(10));
        JLabel lblTipo = new JLabel("Tipo: ");
        pnlCabecera.add(lblTipo);
        cboAuxiliar = new JComboBox();
        cboAuxiliar.addItemListener(this);
        pnlCabecera.add(cboAuxiliar);
        btnImportar = new JButton("Importar", gif.EXCEL);
        btnImportar.addActionListener(this);
        pnlCabecera.add(btnImportar);
        JLabel lblPeriodo = new JLabel("Periodo Eliminar");
        pnlCabecera.add(lblPeriodo);
        cboPeriodo = new JComboBox();
        pnlCabecera.add(cboPeriodo);
        getContentPane().add(pnlCabecera, BorderLayout.PAGE_START);
        this.initListener();
        this.setfecha();
        this.loadCombo();
        pack();
        jChooser = new JFileChooser();
    }

    private void initListener() {
        txtGlosa.addFocusListener(this);
        txtTc.addFocusListener(this);
        cboSerie.addItemListener(this);
        cboMoneda.addItemListener(this);
        cboTipoCambio.addItemListener(this);
        ((JTextFieldDateEditor) dcFemision.getDateEditor()).addFocusListener(this);
        dcFemision.getCalendarButton().addActionListener(this);
        ((JTextField) dcFemision.getDateEditor()).registerKeyboardAction(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                cargarTipoCambio();
            }
        }, KeyStroke.getKeyStroke(KeyEvent.VK_ENTER, 0, false), JComponent.WHEN_FOCUSED);
        ((JTextField) dcFemision.getDateEditor()).registerKeyboardAction(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                dcFemision.getCalendarButton().doClick();
            }
        }, KeyStroke.getKeyStroke(KeyEvent.VK_SPACE, 0, false), JComponent.WHEN_FOCUSED);
    }

    private String getIdMoneda(JComboBox cbo) {
        ObjectItem itemMoneda = (ObjectItem) cbo.getSelectedItem();
        if (itemMoneda != null && itemMoneda.getObjItem() != null) {
            return itemMoneda.getObjItem().toString().trim();
        }
        return "";
    }

    private void loadSerieCorrelativo(String idTipoDoc) throws Exception {
        try {
            RnCorrelativo logic = new RnCorrelativo(this.path);
            List<UsuarioCorrelativo> list = logic.listarCorrelativo(usuario.getId_usuario(), usuario.getCodpuntoventa(), idTipoDoc);
            for (UsuarioCorrelativo uc : list) {
                cboSerie.addItem(new ObjectItem(uc.getSerie(), uc));
            }
        } catch (Exception e) {
            throw e;
        }
    }

    private void cargarTipoCambio() {
        try {
            String format = UtilDate.getStrFecha(dcFemision.getDate());
            if (!fecha.equals(format)) {
                fecha = format;
                RnTipoCambio logic = new RnTipoCambio(path);
                beanTc = logic.getBeanTipoCambio(new java.sql.Date(dcFemision.getDate().getTime()), this.getIdMoneda(cboMoneda));
            }
            if (beanTc != null) {
                txtTc.setText(this.getValueTipoCambio());
            } else {
                txtTc.setText("0.00");
            }
        } catch (Exception e) {
            txtTc.setText("0.00");
            ExceptionHandler.handleException(e, logger);
        }
    }

    private String getValueTipoCambio() {
        switch (cboTipoCambio.getSelectedIndex()) {
            case 0:
                return beanTc.getMontocompra().toString();
            case 1:
                return beanTc.getMontoventa().toString();
            case 2:
                return beanTc.getMontocomercial().toString();
            default:
                return beanTc.getMontoespecial().toString();
        }
    }

    private void setfecha() {
        dcFemision.setSelectableDateRange(DateTime.format(100, 0, 1), frmMain.getFechaFin());
        dcFemision.setDate(frmMain.getFechaFin());
    }

    private JPanel getPnlPlanilla() {
        JPanel pnlPrinc = new JPanel();
        pnlPrinc.setLayout(new BorderLayout());
        JPanel pnl = new JPanel();
        pnlPrinc.add(pnl, BorderLayout.WEST);
        pnl.setLayout(new GridBagLayout());
        GridBagConstraints gbc = LayoutUtil.getGbc();
        Border border = BorderFactory.createTitledBorder(null, "Datos Planilla", TitledBorder.LEFT, TitledBorder.DEFAULT_POSITION, new Font("Comic Sans MS", 0, 12), Color.BLACK);
        pnlPrinc.setBorder(border);

        JLabel lblTipoDoc = new JLabel("Tipo Doc");
        pnl.add(lblTipoDoc, gbc);

        gbc.gridx = 1;
        txtTipoDoc = new JTextField();
        txtTipoDoc.setDocument(new UpperCaseNumberDocument(2));
        txtTipoDoc.setEditable(false);
        txtTipoDoc.setColumns(2);
        txtTipoDoc.setMinimumSize(txtTipoDoc.getPreferredSize());
        gbc.insets = new Insets(2, 1, 2, 0);
        pnl.add(txtTipoDoc, gbc);

        txtTipoDocDesc = new JTextField();
        txtTipoDocDesc.setColumns(15);
        txtTipoDocDesc.setEnabled(false);
        gbc.insets = new Insets(2, 0, 2, 0);
        gbc.gridx = 2;
        pnl.add(txtTipoDocDesc, gbc);
        gbc.insets = new Insets(2, 2, 2, 2);

        gbc.gridx = 3;
        JLabel lblDoc = new JLabel("N° Documento");
        pnl.add(lblDoc, gbc);

        gbc.gridx = 4;
        cboSerie = new JComboBox();
        pnl.add(cboSerie, gbc);

        gbc.gridx = 5;
        txtPreimpreso = new JTextField();
        txtPreimpreso.setEditable(false);
        txtPreimpreso.setColumns(8);
        pnl.add(txtPreimpreso, gbc);

        gbc.gridx = 0;
        gbc.gridy = 1;
        JLabel lblFechaEmision = new JLabel("F. Emisión");
        pnl.add(lblFechaEmision, gbc);

        gbc.gridx = 1;
        dcFemision = new JDateChooser("dd/MM/yyyy", "##/##/####", '_');
        gbc.gridwidth = 2;
        pnl.add(dcFemision, gbc);
        gbc.gridwidth = 1;

        gbc.gridx = 3;
        JLabel lblMoneda = new JLabel("Moneda");
        pnl.add(lblMoneda, gbc);

        gbc.gridx = 4;
        cboMoneda = new JComboBox();
        gbc.gridwidth = 2;
        pnl.add(cboMoneda, gbc);
        gbc.gridwidth = 1;

        gbc.gridx = 0;
        gbc.gridy = 2;
        JLabel lblTipo = new JLabel("Tipo");
        pnl.add(lblTipo, gbc);

        gbc.gridx = 1;
        cboTipoCambio = new JComboBox();
        gbc.gridwidth = 2;
        pnl.add(cboTipoCambio, gbc);
        gbc.gridwidth = 1;

        gbc.gridx = 3;
        JLabel lblTc = new JLabel("T.C.");
        pnl.add(lblTc, gbc);
        gbc.gridx = 4;
        gbc.gridwidth = 2;
        txtTc = new JTextField();
        txtTc.setColumns(5);
        txtTc.setHorizontalAlignment(SwingConstants.RIGHT);
        txtTc.setDocument(new DoubleDocument());
        pnl.add(txtTc, gbc);
        gbc.gridwidth = 1;

        gbc.gridx = 0;
        gbc.gridy = 3;
        JLabel lblGlosa = new JLabel("Glosa");
        pnl.add(lblGlosa, gbc);

        gbc.gridx = 1;
        txtGlosa = new JTextField();
        gbc.gridwidth = 5;
        gbc.fill = GridBagConstraints.HORIZONTAL;
        pnl.add(txtGlosa, gbc);
        gbc.gridwidth = 1;
        gbc.fill = GridBagConstraints.NONE;
        return pnlPrinc;
    }

    private void loadCombo() {
        try {
            String idAuxiliares = AuxiliarEnum.APERTURA.getValue() + ",";
            idAuxiliares += AuxiliarEnum.COMPRA.getValue() + ",";
            idAuxiliares += AuxiliarEnum.VENTA.getValue() + ",";
            idAuxiliares += AuxiliarEnum.PROVISION.getValue() + ",";
            idAuxiliares += AuxiliarEnum.PLANILLA.getValue() + ",";
            idAuxiliares += AuxiliarEnum.LETRA_PAGAR.getValue() + ",";
            idAuxiliares += AuxiliarEnum.LETRA_COBRAR.getValue() + ",";
            LoadCombo.loadAuxiliar(path, cboAuxiliar, idAuxiliares);
            cboAuxiliar.addItem(new ObjectItem("ACTUALIZAR VENDEDOR", "12345"));
            cboAuxiliar.addItem(new ObjectItem("CAJA Y BANCOS - SOLO ELIMINAR", AuxiliarEnum.CAJA.getValue()));
            LoadCombo.loadComboTipoCambio(cboTipoCambio);
            txtTipoDoc.setText(TipoDocVentaEnum.PLANILLA.getValue());
            FxTipoDocVenta.buscarTipoDocVenta(txtTipoDoc, txtTipoDocDesc, "", "", "",
                    false, frmMain, path, this);
            this.loadSerieCorrelativo(TipoDocVentaEnum.PLANILLA.getValue());
            LoadCombo.loadMonedaItem(this.path, cboMoneda, "", 0);
            this.loadPeriodo();
        } catch (Exception ex) {
            ExceptionHandler.handleException(ex, logger);
            JOptionPane.showMessageDialog(this, ex.getMessage());
        }
    }

    private void loadPeriodo() throws Exception {
        RnPeriodoMensual logic = new RnPeriodoMensual(path);
        List<BeanPeriodoMensual> lstPeriodo = logic.listarPeriodoMensual(frmMain.getAnio(), -1);
        for (BeanPeriodoMensual beanPeriodo : lstPeriodo) {
            cboPeriodo.addItem(new ObjectItem(beanPeriodo.getIdPeriodoMensual(), beanPeriodo.getIdPeriodoMensual()));
        }
    }

    private String getIdAuxiliar() {
        return LoadComboItem.getIdCombo(cboAuxiliar);
    }

    private void importarExcel() {
        try {
            jChooser.showOpenDialog(null);
            File file = jChooser.getSelectedFile();
            if (file == null) {
                return;
            }
            if (!file.getName().endsWith("xls")) {
                JOptionPane.showMessageDialog(null, "Please select only Excel file.", "Error", JOptionPane.ERROR_MESSAGE);
                return;
            }
            String idAuxiliar = this.getIdAuxiliar();
            if (idAuxiliar.equals(AuxiliarEnum.VENTA.getValue())) {
                fillDataVentas(file);
                llenarDataAsiento(modeltableVentas);
            } else if (idAuxiliar.equals(AuxiliarEnum.COMPRA.getValue())) {
                fillDataCompras(file);
                llenarDataAsiento(modeltableCompras);
            } else if (idAuxiliar.equals(AuxiliarEnum.APERTURA.getValue()) || idAuxiliar.equals(AuxiliarEnum.PROVISION.getValue())) {
                fillDataAsiento(file);
                llenarDataAsiento(modeltableAsiento);
            } else if (idAuxiliar.equals(AuxiliarEnum.PLANILLA.getValue())) {
                fillDataPlanilla(file);
                llenarDataPlanilla(modeltablePlanilla);
            } else if (idAuxiliar.equals(AuxiliarEnum.LETRA_COBRAR.getValue())) {
                fillDataLetras(file, modeltableLetraVenta);
                llenarDataLetraCliente(modeltableLetraVenta);
            } else if (idAuxiliar.equals(AuxiliarEnum.LETRA_PAGAR.getValue())) {
                fillDataLetras(file, modeltableLetraCompra);
                llenarDataLetraProveedor(modeltableLetraCompra);
            } else {
                fillDataActVendedor(file);
                llenarDataActVendedor(modeltableActVendedor);
            }
        } catch (Exception e) {
            ExceptionHandler.handleException(e, logger);
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }

    private void llenarDataLetraCliente(ImpLetraTableModel modelTableLetra) throws Exception {
        try {
            if (modelTableLetra.getRowCount() == 0) {
                return;
            }
            Map<String, BeanMoneda> mapMoneda = ValidateData.getMapMoneda(path);
            RnConsultas logicConsulta = new RnConsultas(path);
            List<BeanCxC> listCxC = logicConsulta.listCxCDiario(frmMain.getAnio(), new java.sql.Date(frmMain.getFechaFin().getTime()));
            for (int i = 0; i < modelTableLetra.getRowCount(); i++) {
                BeanImpLetra beanLetra = modelTableLetra.getBeanImpLetra(i);
                if (!beanLetra.isSelected()) {
                    continue;
                }
                if (!ValidateData.validateMonedaLetra(beanLetra, mapMoneda)) {
                    continue;
                }
                this.validateDataCxc(beanLetra, listCxC);
            }
            this.setColorTableAsiento(modelTableLetra);
            modelTableLetra.fireTableDataChanged();
            CTableFx.setAllColumnPreferredWidth(table);
        } catch (Exception e) {
            throw e;
        }
    }

    private void llenarDataLetraProveedor(ImpLetraTableModel modelTableLetra) throws Exception {
        try {
            if (modelTableLetra.getRowCount() == 0) {
                return;
            }
            Map<String, BeanMoneda> mapMoneda = ValidateData.getMapMoneda(path);
            RnConsultas logicConsulta = new RnConsultas(path);
            List<BeanCxP> listCxP = logicConsulta.listCxPDiario(frmMain.getAnio(), new java.sql.Date(frmMain.getFechaFin().getTime()));
            for (int i = 0; i < modelTableLetra.getRowCount(); i++) {
                BeanImpLetra beanLetra = modelTableLetra.getBeanImpLetra(i);
                if (!beanLetra.isSelected()) {
                    continue;
                }
                if (!ValidateData.validateMonedaLetra(beanLetra, mapMoneda)) {
                    continue;
                }
                this.validateDataCxp(beanLetra, listCxP);
            }
            this.setColorTableAsiento(modelTableLetra);
            modelTableLetra.fireTableDataChanged();
            CTableFx.setAllColumnPreferredWidth(table);
        } catch (Exception e) {
            throw e;
        }
    }

    private void validateDataCxc(BeanImpLetra beanLetra, List<BeanCxC> listCxC) {
        BeanCxC beanCxC = this.getCxC(beanLetra, listCxC);
        if (beanCxC == null) {
            beanLetra.setSelected(false);
            beanLetra.setObservacion("NO SE ENCUENTRA DOCUMENTO EN CUENTAS POR COBRAR");
            return;
        }
        beanLetra.setIdAnexo(beanCxC.getBeanFact().getIdCliente());
        beanLetra.setNombreAnexo(beanCxC.getBeanFact().getDescripcion());
        beanLetra.setIdCuenta(beanCxC.getIdCuenta());
        beanLetra.setIdRegconta(beanCxC.getIdRegconta());
        beanLetra.setFechaDocumento(beanCxC.getFecha());
        beanLetra.setTc(beanCxC.getTipoCambio());
        if (beanLetra.getIdMoneda().equals(MonedaEnum.SOLES.getValue())) {
            beanLetra.setImporte(beanCxC.getImporte());
            beanLetra.setAcuenta(beanCxC.getAcuenta());
            beanLetra.setSaldo(beanCxC.getSaldo());
        } else {
            beanLetra.setImporte(beanCxC.getImporteUsd());
            beanLetra.setAcuenta(beanCxC.getAcuentaUsd());
            beanLetra.setSaldo(beanCxC.getSaldoUsd());
        }
        if (beanLetra.getMontoLetra().compareTo(beanLetra.getSaldo()) == 1) {
            beanLetra.setSelected(false);
            beanLetra.setObservacion("MONTO DE LETRA ES MAYOR A SALDO CXC");
        }
    }

    private void validateDataCxp(BeanImpLetra beanLetra, List<BeanCxP> listCxP) {
        BeanCxP beanCxP = this.getCxP(beanLetra, listCxP);
        if (beanCxP == null) {
            beanLetra.setSelected(false);
            beanLetra.setObservacion("NO SE ENCUENTRA DOCUMENTO EN CUENTAS POR PAGAR");
            return;
        }
        beanLetra.setIdAnexo(beanCxP.getBeanAnexo().getIdAnexo());
        beanLetra.setNombreAnexo(beanCxP.getBeanAnexo().getDescripcion());
        beanLetra.setIdCuenta(beanCxP.getIdCuenta());
        beanLetra.setIdRegconta(beanCxP.getIdRegconta());
        beanLetra.setFechaDocumento(beanCxP.getFecha());
        beanLetra.setTc(beanCxP.getTipoCambio());
        if (beanLetra.getIdMoneda().equals(MonedaEnum.SOLES.getValue())) {
            beanLetra.setImporte(beanCxP.getImporte());
            beanLetra.setAcuenta(beanCxP.getAcuenta());
            beanLetra.setSaldo(beanCxP.getSaldo());
        } else {
            beanLetra.setImporte(beanCxP.getImporteUsd());
            beanLetra.setAcuenta(beanCxP.getAcuentaUsd());
            beanLetra.setSaldo(beanCxP.getSaldoUsd());
        }
        if (beanLetra.getMontoLetra().compareTo(beanLetra.getSaldo()) == 1) {
            beanLetra.setSelected(false);
            beanLetra.setObservacion("MONTO DE LETRA ES MAYOR A SALDO CXP");
        }
    }

    private BeanCxC getCxC(BeanImpLetra beanLetra, List<BeanCxC> listCxC) {
        for (BeanCxC beanCxC : listCxC) {
            if (beanLetra.getNumeroDocAnexo().equals(beanCxC.getBeanFact().getNumero())
                    && beanLetra.getIdTipoDoc().equals(beanCxC.getIdTipoDoc())
                    && beanLetra.getSerie().equals(beanCxC.getSerie())
                    && beanLetra.getPreimpreso().equals(beanCxC.getPreimpreso())
                    && beanLetra.getIdMoneda().equals(beanCxC.getBeanMoneda().getIdMoneda())) {
                return beanCxC;
            }
        }
        return null;
    }

    private BeanCxP getCxP(BeanImpLetra beanLetra, List<BeanCxP> listCxP) {
        for (BeanCxP beanCxP : listCxP) {
            if (beanLetra.getNumeroDocAnexo().equals(beanCxP.getBeanAnexo().getNumero())
                    && beanLetra.getIdTipoDoc().equals(beanCxP.getIdTipoDoc())
                    && beanLetra.getSerie().equals(beanCxP.getSerie())
                    && beanLetra.getPreimpreso().equals(beanCxP.getPreimpreso())
                    && beanLetra.getIdMoneda().equals(beanCxP.getBeanMoneda().getIdMoneda())) {
                return beanCxP;
            }
        }
        return null;
    }

    private void llenarDataAsiento(AbstractTableModel modelTable) throws Exception {
        try {
            if (modelTable.getRowCount() == 0) {
                return;
            }
            Map<String, BeanAnexo> mapAnexo = new HashMap();
            Map<String, BeanMoneda> mapMoneda = ValidateData.getMapMoneda(path);
            for (int i = 0; i < modelTable.getRowCount(); i++) {
                BeanImportar beanImportar = ((ImpAsientoService) modelTable).getBeanImportar(i);
                if (!beanImportar.isSelected()) {
                    continue;
                }
                if (!ValidateData.validateAnexoAsiento(beanImportar, mapAnexo, path)) {
                    continue;
                }
                ValidateData.validateMonedaAsiento(beanImportar, mapMoneda);
            }
            this.setColorTableAsiento(modelTable);
            modelTable.fireTableDataChanged();
            CTableFx.setAllColumnPreferredWidth(table);
        } catch (Exception e) {
            throw e;
        }
    }

    private void llenarDataActVendedor(ImpActVendedorTableModel modelTable) throws Exception {
        try {
            if (modelTable.getRowCount() == 0) {
                return;
            }
            RnAnexo logicAnexo = new RnAnexo(path);
            List<BeanAnexo> lstVendedor = logicAnexo.listarAnexo(TipoAnexoEnum.VENDEDOR.getValue(), "", "A", "", "");
            for (int i = 0; i < modelTable.getRowCount(); i++) {
                BeanActVendedor beanActVendedor = modelTable.getBeanActVendedor(i);
                if (!beanActVendedor.isSelected()) {
                    continue;
                }
                if (!ValidateData.validateVentaActVendedor(this.frmMain.getAnio(), beanActVendedor, path)) {
                    continue;
                }
                ValidateData.validateActVendedor(beanActVendedor, lstVendedor);
            }
            modelTable.fireTableDataChanged();
            CTableFx.setAllColumnPreferredWidth(table);
        } catch (Exception e) {
            throw e;
        }
    }

    private void llenarDataPlanilla(AbstractTableModel modelTable) throws Exception {
        try {
            if (modelTable.getRowCount() == 0) {
                return;
            }
            Map<String, BeanAnexo> mapAnexo = new HashMap();
            for (int i = 0; i < modelTable.getRowCount(); i++) {
                BeanImportar beanImportar = ((ImpAsientoService) modelTable).getBeanImportar(i);
                if (!beanImportar.isSelected()) {
                    continue;
                }
                if (!ValidateData.validateAnexoAsiento(beanImportar, mapAnexo, path)) {
                    continue;
                }
                ValidateData.validatePosCuentaPlanilla((BeanImpPlanilla) beanImportar);
            }
            this.setColorTableAsiento(modelTable);
            modelTable.fireTableDataChanged();
            CTableFx.setAllColumnPreferredWidth(table);
        } catch (Exception e) {
            throw e;
        }
    }

    private void setColorTableAsiento(AbstractTableModel model) {
        for (int i = 1; i < model.getColumnCount(); i++) {
            table.getColumnModel().getColumn(i).setCellRenderer(new CellRendererLabelAsiento());
        }
    }

    private void fillDataCompras(File file) throws ParseException, Exception {
        int j = -1;
        int x = -1;
        try {
            Sheet sheet = UtilExcel.getSheet(file, modeltableCompras, logger);
            if (sheet == null) {
                JOptionPane.showMessageDialog(this, "Numero de Columnas: " + modeltableCompras.getNumColExcel());
                return;
            }
            for (j = 1; j < sheet.getRows(); j++) {
                logger.info("j: " + j);
                BeanImpCompra beanCompra = new BeanImpCompra();
                x = 0;
                beanCompra.setSelected(true);
                beanCompra.setIndex(j);
                beanCompra.setFechaContable(UtilExcel.getDateFromCell(sheet, x++, j));
                beanCompra.setFechaEmision(UtilExcel.getDateFromCell(sheet, x++, j));
                beanCompra.setFechaVencimiento(UtilExcel.getDateFromCell(sheet, x++, j));
                if (beanCompra.getFechaContable() == null && beanCompra.getFechaEmision() == null && beanCompra.getFechaVencimiento() == null) {
                    break;
                }
                beanCompra.setIdTipoAnexo(sheet.getCell(x++, j).getContents());
                beanCompra.setNumeroDocAnexo(sheet.getCell(x++, j).getContents().trim());
                beanCompra.setTipoCambio(UtilExcel.getNumberFromCell(sheet, x++, j));
                beanCompra.setIdMoneda(sheet.getCell(x++, j).getContents().trim());
                beanCompra.setIdTipoDoc(sheet.getCell(x++, j).getContents().trim());
                beanCompra.setSerie(sheet.getCell(x++, j).getContents().trim());
                beanCompra.setPreimpreso(sheet.getCell(x++, j).getContents().trim());
                beanCompra.setGlosa(sheet.getCell(x++, j).getContents().trim());
                beanCompra.setCta60(sheet.getCell(x++, j).getContents().trim());
                beanCompra.setCtaIgv(sheet.getCell(x++, j).getContents().trim());
                beanCompra.setCta42(sheet.getCell(x++, j).getContents().trim());
                beanCompra.setCtaPerc(sheet.getCell(x++, j).getContents().trim());
                beanCompra.setCtaRevPerc(sheet.getCell(x++, j).getContents().trim());
                beanCompra.setAfecto(UtilExcel.getNumberFromCell(sheet, x++, j));
                beanCompra.setIgv(UtilExcel.getNumberFromCell(sheet, x++, j));
                beanCompra.setNoafecto(UtilExcel.getNumberFromCell(sheet, x++, j));
                beanCompra.setTotal(UtilExcel.getNumberFromCell(sheet, x++, j));
                beanCompra.setPercepcion(UtilExcel.getNumberFromCell(sheet, x++, j));
                beanCompra.setIdTipoDocRef(sheet.getCell(x++, j).getContents().trim());
                beanCompra.setSerieRef(sheet.getCell(x++, j).getContents().trim());
                beanCompra.setPreimpresoRef(sheet.getCell(x++, j).getContents().trim());
                beanCompra.setFechaRef(UtilExcel.getDateFromCell(sheet, x++, j));
                this.validateFechaAsiento(beanCompra, false);
                this.validateMontosAsiento(beanCompra, beanCompra.getAfecto(), beanCompra.getNoafecto(), beanCompra.getIgv(), beanCompra.getTotal());
                this.validateReferenciaAsiento(beanCompra, beanCompra.getIdTipoDocRef(), beanCompra.getSerieRef(),
                        beanCompra.getPreimpresoRef(), beanCompra.getFechaRef());
                modeltableCompras.setBeanImpCompra(beanCompra);
            }
            modeltableCompras.fireTableDataChanged();
            CTableFx.setAllColumnPreferredWidth(table);
        } catch (BiffException e) {
            throw e;
        } catch (IndexOutOfBoundsException | HeadlessException | ParseException | NumberFormatException e) {
            try {
                if (j > -1 && x > -1) {
                    throw new Exception(e.getMessage() + " *Fila: " + (j + 1) + ", Columna: " + x);
                } else {
                    throw new Exception(e.getMessage());
                }
            } catch (Exception ex) {
                throw ex;
            }
        }
    }

    private void fillDataLetras(File file, ImpLetraTableModel modelTableLetra) throws ParseException, Exception {
        int j = -1;
        int x = -1;
        try {
            Sheet sheet = UtilExcel.getSheetLetra(file, modelTableLetra, logger);
            if (sheet == null) {
                JOptionPane.showMessageDialog(this, "Numero de Columnas: " + modelTableLetra.getNumColExcel());
                return;
            }
            for (j = 1; j < sheet.getRows(); j++) {
                logger.info("j: " + j);
                BeanImpLetra beanLetra = new BeanImpLetra();
                x = 0;
                beanLetra.setSelected(true);
                beanLetra.setIndex(j);
                beanLetra.setFechaEmisionLetra(UtilExcel.getDateFromCell(sheet, x++, j));
                beanLetra.setFechaVenceLetra(UtilExcel.getDateFromCell(sheet, x++, j));
                if (beanLetra.getFechaEmisionLetra() == null && beanLetra.getFechaVenceLetra() == null) {
                    break;
                }
                beanLetra.setNumeroDocAnexo(sheet.getCell(x++, j).getContents().trim());
                beanLetra.setIdMoneda(sheet.getCell(x++, j).getContents().trim());
                beanLetra.setIdTipoDoc(sheet.getCell(x++, j).getContents().trim());
                beanLetra.setSerie(sheet.getCell(x++, j).getContents().trim());
                beanLetra.setPreimpreso(sheet.getCell(x++, j).getContents().trim());
                beanLetra.setIdTipoDocLetra(TipoDocVentaEnum.LETRAS.getValue());
                beanLetra.setSerieLetra(sheet.getCell(x++, j).getContents().trim());
                beanLetra.setPreimpresoLetra(sheet.getCell(x++, j).getContents().trim());
                beanLetra.setTcLetra(UtilExcel.getNumberFromCell(sheet, x++, j));
                beanLetra.setMontoLetra(UtilExcel.getNumberFromCell(sheet, x++, j));
                beanLetra.setGlosa(sheet.getCell(x++, j).getContents().trim());
                this.validateDataLetra(beanLetra);
                modelTableLetra.setBeanImpLetra(beanLetra);
            }
            modelTableLetra.fireTableDataChanged();
            CTableFx.setAllColumnPreferredWidth(table);
        } catch (BiffException e) {
            throw e;
        } catch (IndexOutOfBoundsException | HeadlessException | ParseException | NumberFormatException e) {
            try {
                if (j > -1 && x > -1) {
                    throw new Exception(e.getMessage() + " *Fila: " + (j + 1) + ", Columna: " + x);
                } else {
                    throw new Exception(e.getMessage());
                }
            } catch (Exception ex) {
                throw ex;
            }
        }
    }

    private void fillDataVentas(File file) throws ParseException, Exception {
        int j = -1;
        int x = -1;
        try {
            Sheet sheet = UtilExcel.getSheet(file, modeltableVentas, logger);
            if (sheet == null) {
                JOptionPane.showMessageDialog(this, "Numero de Columnas: " + modeltableVentas.getNumColExcel());
                return;
            }
            for (j = 1; j < sheet.getRows(); j++) {
                logger.info("j: " + j);
                BeanImpVenta beanVenta = new BeanImpVenta();
                x = 0;
                beanVenta.setSelected(true);
                beanVenta.setIndex(j);
                beanVenta.setFechaEmision(UtilExcel.getDateFromCell(sheet, x++, j));
                beanVenta.setFechaContable(beanVenta.getFechaEmision());
                beanVenta.setFechaVencimiento(UtilExcel.getDateFromCell(sheet, x++, j));
                beanVenta.setIdTipoAnexo(TipoAnexoEnum.CLIENTE.getValue());
                beanVenta.setNumeroDocAnexo(sheet.getCell(x++, j).getContents().trim());
                beanVenta.setTipoCambio(UtilExcel.getNumberFromCell(sheet, x++, j));
                beanVenta.setIdMoneda(sheet.getCell(x++, j).getContents().trim());
                beanVenta.setIdTipoDoc(sheet.getCell(x++, j).getContents().trim());
                beanVenta.setSerie(sheet.getCell(x++, j).getContents().trim());
                beanVenta.setPreimpreso(sheet.getCell(x++, j).getContents().trim());
                beanVenta.setGlosa(sheet.getCell(x++, j).getContents().trim());
                beanVenta.setCta70(sheet.getCell(x++, j).getContents().trim());
                beanVenta.setCtaIgv(sheet.getCell(x++, j).getContents().trim());
                beanVenta.setCta12(sheet.getCell(x++, j).getContents().trim());
                beanVenta.setCtaPerc(sheet.getCell(x++, j).getContents().trim());
                beanVenta.setCtaRevPerc(sheet.getCell(x++, j).getContents().trim());
                beanVenta.setAfecto(UtilExcel.getNumberFromCell(sheet, x++, j));
                beanVenta.setNoAfecto(UtilExcel.getNumberFromCell(sheet, x++, j));
                beanVenta.setIgv(UtilExcel.getNumberFromCell(sheet, x++, j));
                beanVenta.setTotal(UtilExcel.getNumberFromCell(sheet, x++, j));
                beanVenta.setPercepcion(UtilExcel.getNumberFromCell(sheet, x++, j));
                beanVenta.setIdTipoDocRef(sheet.getCell(x++, j).getContents().trim());
                beanVenta.setSerieRef(sheet.getCell(x++, j).getContents().trim());
                beanVenta.setPreimpresoRef(sheet.getCell(x++, j).getContents().trim());
                beanVenta.setFechaRef(UtilExcel.getDateFromCell(sheet, x++, j));
                this.validateFechaAsiento(beanVenta, false);
                this.validateMontosAsiento(beanVenta, beanVenta.getAfecto(), beanVenta.getNoAfecto(), beanVenta.getIgv(), beanVenta.getTotal());
                this.validateReferenciaAsiento(beanVenta, beanVenta.getIdTipoDocRef(), beanVenta.getSerieRef(),
                        beanVenta.getPreimpresoRef(), beanVenta.getFechaRef());
                modeltableVentas.setBeanImpVenta(beanVenta);
            }
            modeltableVentas.fireTableDataChanged();
            CTableFx.setAllColumnPreferredWidth(table);
        } catch (BiffException e) {
            throw e;
        } catch (IndexOutOfBoundsException | HeadlessException | ParseException | NumberFormatException e) {
            try {
                if (j > -1 && x > -1) {
                    throw new Exception(e.getMessage() + " *Fila: " + (j + 1) + ", Columna: " + x);
                } else {
                    throw new Exception(e.getMessage());
                }
            } catch (Exception ex) {
                throw ex;
            }
        }
    }

    private void fillDataAsiento(File file) throws ParseException, Exception {
        int j = -1;
        int x = -1;
        try {
            Sheet sheet = UtilExcel.getSheet(file, modeltableAsiento, logger);
            if (sheet == null) {
                JOptionPane.showMessageDialog(this, "Numero de Columnas: " + modeltableAsiento.getNumColExcel());
                return;
            }
            boolean isAsientoApertura = this.getIdAuxiliar().equals(AuxiliarEnum.APERTURA.getValue());
            for (j = 1; j < sheet.getRows(); j++) {
                logger.info("j: " + j);
                BeanImpAsiento beanAsiento = new BeanImpAsiento();
                beanAsiento.setSelected(true);
                x = 0;
                beanAsiento.setIndex(j);
                beanAsiento.setFechaContable(UtilExcel.getDateFromCell(sheet, x++, j));
                beanAsiento.setFechaEmision(UtilExcel.getDateFromCell(sheet, x++, j));
                beanAsiento.setFechaVencimiento(UtilExcel.getDateFromCell(sheet, x++, j));
                beanAsiento.setIdTipoAnexo(sheet.getCell(x++, j).getContents());
                beanAsiento.setNumeroDocAnexo(sheet.getCell(x++, j).getContents().trim());
                beanAsiento.setTipoCambio(UtilExcel.getNumberFromCell(sheet, x++, j));
                beanAsiento.setIdMoneda(sheet.getCell(x++, j).getContents().trim());
                beanAsiento.setIdTipoDoc(sheet.getCell(x++, j).getContents().trim());
                beanAsiento.setSerie(sheet.getCell(x++, j).getContents().trim());
                beanAsiento.setPreimpreso(sheet.getCell(x++, j).getContents().trim());
                beanAsiento.setIdCuentaDebe(sheet.getCell(x++, j).getContents().trim());
                beanAsiento.setIdCuentaHaber(sheet.getCell(x++, j).getContents().trim());
                beanAsiento.setImporte(UtilExcel.getNumberFromCell(sheet, x++, j));
                beanAsiento.setGlosa(sheet.getCell(x++, j).getContents().trim());
                this.validateFechaAsiento(beanAsiento, isAsientoApertura);
                modeltableAsiento.setBeanImpAsiento(beanAsiento);
            }
            modeltableAsiento.fireTableDataChanged();
            CTableFx.setAllColumnPreferredWidth(table);
        } catch (BiffException e) {
            throw e;
        } catch (IndexOutOfBoundsException | HeadlessException | ParseException | NumberFormatException e) {
            try {
                if (j > -1 && x > -1) {
                    throw new Exception(e.getMessage() + " *Fila: " + (j + 1) + ", Columna: " + x);
                } else {
                    throw new Exception(e.getMessage());
                }
            } catch (Exception ex) {
                throw ex;
            }
        }
    }

    private void fillDataActVendedor(File file) throws ParseException, Exception {
        int j = -1;
        int x = -1;
        try {
            Sheet sheet = UtilExcel.getSheetActVendedor(file, modeltableActVendedor, logger);
            if (sheet == null) {
                JOptionPane.showMessageDialog(this, "Numero de Columnas: " + modeltableActVendedor.getNumColExcel());
                return;
            }
            for (j = 1; j < sheet.getRows(); j++) {
                logger.info("j: " + j);
                BeanActVendedor beanActVendedor = new BeanActVendedor();
                beanActVendedor.setSelected(true);
                x = 0;
                beanActVendedor.setIndex(j);
                beanActVendedor.setIdTipoDoc(sheet.getCell(x++, j).getContents());
                beanActVendedor.setSerie(sheet.getCell(x++, j).getContents().trim());
                beanActVendedor.setPreimpreso(sheet.getCell(x++, j).getContents().trim());
                beanActVendedor.setDocumentoVendedor(sheet.getCell(x++, j).getContents().trim());
                modeltableActVendedor.setBeanActVendedor(beanActVendedor);
            }
            modeltableAsiento.fireTableDataChanged();
            CTableFx.setAllColumnPreferredWidth(table);
        } catch (BiffException e) {
            throw e;
        } catch (IndexOutOfBoundsException | HeadlessException | NumberFormatException e) {
            try {
                if (j > -1 && x > -1) {
                    throw new Exception(e.getMessage() + " *Fila: " + (j + 1) + ", Columna: " + x);
                } else {
                    throw new Exception(e.getMessage());
                }
            } catch (Exception ex) {
                throw ex;
            }
        }
    }

    private void fillDataPlanilla(File file) throws ParseException, Exception {
        Sheet sheet;
        modeltablePlanilla.clearTable();
        for (int posSheet = 0; posSheet < 5; posSheet++) {
            sheet = UtilExcel.getSheet(file, modeltablePlanilla, logger, posSheet, false);
            String nameSheet = sheet.getName();
            logger.info("hoja: " + sheet.getName());
            if (sheet == null) {
                throw new Exception("Numero de Columnas: " + modeltablePlanilla.getNumColExcel());
            }
            this.fillDataPlanilla(sheet, nameSheet);
        }
        modeltablePlanilla.fireTableDataChanged();
        CTableFx.setAllColumnPreferredWidth(table);
    }

    private void fillDataPlanilla(Sheet sheet, String nameSheet) throws ParseException, Exception {
        int j = -1;
        int x = -1;
        try {
            for (j = 1; j < sheet.getRows(); j++) {
                logger.info("j: " + j);
                BeanImpPlanilla beanPlanilla = new BeanImpPlanilla();
                beanPlanilla.setSelected(true);
                x = 0;
                beanPlanilla.setIndex(j);
                beanPlanilla.setIdTipoAnexo(TipoAnexoEnum.EMPLEADO.getValue());
                beanPlanilla.setNumeroDocAnexo(sheet.getCell(x++, j).getContents().trim());
                beanPlanilla.setPosDebeHaber(sheet.getCell(x++, j).getContents().trim());
                beanPlanilla.setIdCuenta(sheet.getCell(x++, j).getContents().trim());
                beanPlanilla.setImporte(UtilExcel.getNumberFromCell(sheet, x++, j));
                beanPlanilla.setNameSheet(nameSheet);
                modeltablePlanilla.setBeanImpPlanilla(beanPlanilla);
            }
        } catch (IndexOutOfBoundsException | HeadlessException | NumberFormatException e) {
            try {
                if (j > -1 && x > -1) {
                    throw new Exception(e.getMessage() + " *Fila: " + (j + 1) + ", Columna: " + x);
                } else {
                    throw new Exception(e.getMessage());
                }
            } catch (Exception ex) {
                throw ex;
            }
        }
    }

    private void validateMontosAsiento(BeanImportar beanImportar,
            BigDecimal afecto, BigDecimal noAfecto, BigDecimal igv, BigDecimal total) {
        if (!beanImportar.isSelected()) {
            return;
        }
        BigDecimal monto = afecto.add(noAfecto).add(igv);
        if (monto.subtract(total).compareTo(BigDecimal.ZERO) != 0) {
            beanImportar.setSelected(false);
            beanImportar.setObservacion("MONTOS NO CUADRAN");
        }
    }

    private void validateReferenciaAsiento(BeanImportar beanImportar, String idTipoDocRef,
            String serieRef, String preimpresoRef, java.sql.Date fechaRef) {
        if (!beanImportar.isSelected()) {
            return;
        }
        if (!(idTipoDocRef.equals(TipoDocVentaEnum.NOTA_CREDITO.getValue())
                || idTipoDocRef.equals(TipoDocVentaEnum.NOTA_DEBITO.getValue()))) {
            return;
        }
        if (Util.isBlank(idTipoDocRef)) {
            beanImportar.setSelected(false);
            beanImportar.setObservacion("TD_REF NO SE ENCUENTRA INGRESADO");
            return;
        }
        if (Util.isBlank(serieRef)) {
            beanImportar.setSelected(false);
            beanImportar.setObservacion("SERIE_REF NO SE ENCUENTRA INGRESADO");
            return;
        }
        if (Util.isBlank(preimpresoRef)) {
            beanImportar.setSelected(false);
            beanImportar.setObservacion("PREIMPRESO_REF NO SE ENCUENTRA INGRESADO");
            return;
        }
        if (fechaRef == null) {
            beanImportar.setSelected(false);
            beanImportar.setObservacion("FECHA_REF NO SE ENCUENTRA INGRESADO");
        }
    }

    private void validateFechaAsiento(BeanImportar beanImportar, boolean isAsientoApertura) {
        if (isAsientoApertura) {
            if (!this.validateFechaContableAsientoInicial(beanImportar)) {
                return;
            }
        }
        if (!this.validateFechaEmisionAsiento(beanImportar)) {
            return;
        }
        this.validateFechaVencimientoAsiento(beanImportar);
    }

    private boolean validateFechaContableAsientoInicial(BeanImportar beanImportar) {
        if (!SDF_DM.format(beanImportar.getFechaContable()).equals("01/01")) {
            beanImportar.setSelected(false);
            beanImportar.setObservacion("FECHA DEBE CONTABLE DEBE SER 01 DE ENERO");
            return false;
        }
        return true;
    }

    private boolean validateFechaEmisionAsiento(BeanImportar beanImportar) {
        if (beanImportar.getFechaEmision().compareTo(beanImportar.getFechaContable()) == 1) {
            beanImportar.setSelected(false);
            beanImportar.setObservacion("FECHA DE EMISION MAYOR QUE FECHA CONTABLE");
            return false;
        }
        return true;
    }

    private void validateFechaVencimientoAsiento(BeanImportar beanImportar) {
        if (beanImportar.getFechaEmision().compareTo(beanImportar.getFechaVencimiento()) == 1) {
            beanImportar.setSelected(false);
            beanImportar.setObservacion("FECHA DE VENCIMIENTO MENOR QUE FECHA DE EMISION");
        }
    }

    private void validateDataLetra(BeanImpLetra beanLetra) {
        if (beanLetra.getFechaEmisionLetra().compareTo(beanLetra.getFechaVenceLetra()) == 1) {
            beanLetra.setSelected(false);
            beanLetra.setObservacion("FECHA DE VENCIMIENTO MENOR QUE FECHA DE EMISION");
            return;
        }
        if (Util.isBlank(beanLetra.getNumeroDocAnexo())) {
            beanLetra.setSelected(false);
            beanLetra.setObservacion("Ingrese numero de Documento Anexo");
            return;
        }
        if (Util.isBlank(beanLetra.getIdMoneda())) {
            beanLetra.setSelected(false);
            beanLetra.setObservacion("Ingrese Codigo de Moneda");
            return;
        }
        if (Util.isBlank(beanLetra.getIdTipoDoc())) {
            beanLetra.setSelected(false);
            beanLetra.setObservacion("Ingrese Tipo de Documento");
            return;
        }
        if (Util.isBlank(beanLetra.getSerie())) {
            beanLetra.setSelected(false);
            beanLetra.setObservacion("Ingrese Serie");
            return;
        }
        if (Util.isBlank(beanLetra.getPreimpreso())) {
            beanLetra.setSelected(false);
            beanLetra.setObservacion("Ingrese Preimpreso");
            return;
        }
        if (Util.isBlank(beanLetra.getSerieLetra())) {
            beanLetra.setSelected(false);
            beanLetra.setObservacion("Ingrese Serie Letra");
            return;
        }
        if (Util.isBlank(beanLetra.getPreimpresoLetra())) {
            beanLetra.setSelected(false);
            beanLetra.setObservacion("Ingrese Preimpreso Letra");
            return;
        }
        if (Util.isBlank(beanLetra.getGlosa())) {
            beanLetra.setSelected(false);
            beanLetra.setObservacion("Ingrese Glosa");
            return;
        }
        if (beanLetra.getTcLetra().compareTo(BigDecimal.ZERO) != 1) {
            beanLetra.setSelected(false);
            beanLetra.setObservacion("Ingrese TC mayor a 0");
            return;
        }
        if (beanLetra.getMontoLetra().compareTo(BigDecimal.ZERO) != 1) {
            beanLetra.setSelected(false);
            beanLetra.setObservacion("Ingrese Monto Letra mayor a 0");
        }
    }

    private void guardarAsiento() {
        try {
            String idAuxiliar = this.getIdAuxiliar();
            if (idAuxiliar.equals(AuxiliarEnum.VENTA.getValue())) {
                guardarAsientoContable(modeltableVentas);
            } else if (idAuxiliar.equals(AuxiliarEnum.COMPRA.getValue())) {
                guardarAsientoContable(modeltableCompras);
            } else if (idAuxiliar.equals(AuxiliarEnum.APERTURA.getValue()) || idAuxiliar.equals(AuxiliarEnum.PROVISION.getValue())) {
                guardarAsientoContable(modeltableAsiento);
            } else if (idAuxiliar.equals(AuxiliarEnum.PLANILLA.getValue())) {
                this.guardarAsientoPlanilla();
            } else if (idAuxiliar.equals(AuxiliarEnum.LETRA_COBRAR.getValue())) {
                this.guardarAsientoLetra(modeltableLetraVenta.getListImpLetra());
            } else if (idAuxiliar.equals(AuxiliarEnum.LETRA_PAGAR.getValue())) {
                this.guardarAsientoLetra(modeltableLetraCompra.getListImpLetra());
            } else {
                updateVendedorVentas();
            }
        } catch (Exception ex) {
            ExceptionHandler.handleException(ex, logger);
            JOptionPane.showMessageDialog(this, ex.getMessage());
        }
    }

    private void guardarAsientoPlanilla() throws Exception {
        if (!verificarDatosPlanilla()) {
            return;
        }
        RnRegconta logic = new RnRegconta(path);
        BeanRegcontaCab beanRcc = getBeanRegcontaCabAsiento();
        BeanRptaRcc beanRpta = logic.importarAsientoPlanilla(beanRcc, this.getXmlPlanilla());
        JOptionPane.showMessageDialog(this, "Registro de Voucher: " + beanRpta.getVoucher());
        modeltablePlanilla.clearTable();
        CTableFx.setAllColumnPreferredWidth(table);
        txtGlosa.setText("");
        this.mostratPreimpreso();
    }

    private BeanRegcontaCab getBeanRegcontaCabAsiento() {
        BeanRegcontaCab bean = new BeanRegcontaCab();
        bean.setIdEmpresa(usuario.getCodempresa());
        bean.setAnio(Util.getAnio(dcFemision.getDate()));
        bean.setMes(Util.getMes(dcFemision.getDate()));
        bean.setIdAuxiliar(this.getIdAuxiliar());
        bean.setIdPeriodoMensual(Util.getIdPeriodoMensual(bean.getAnio(), bean.getMes(), bean.getIdAuxiliar()));
        BeanTipoDocVenta beanTd = new BeanTipoDocVenta();
        beanTd.setIdTipoDoc(txtTipoDoc.getText().trim());
        bean.setBeanTipoDocVenta(beanTd);
        bean.setSerie(cboSerie.getSelectedItem().toString());
        bean.setPreimpreso(txtPreimpreso.getText().trim());
        bean.setIdLocalidad(usuario.getCodlocalidad());
        BeanAnexo beanAnexo = new BeanAnexo();
        BigDecimal total = BigDecimal.ZERO;
        beanAnexo.setIdAnexo(modeltablePlanilla.getBeanImpPlanilla(0).getIdAnexo());
        bean.setBeanAnexo(beanAnexo);
        bean.setIdLocalidad(usuario.getCodlocalidad());
        bean.setBeanMoneda(new BeanMoneda(this.getIdMoneda(cboMoneda)));
        bean.setTipoCambio(new BigDecimal(txtTc.getText().trim()));
        bean.setMonto(total);
        bean.setFEmision(dcFemision.getDate());
        bean.setFContable(dcFemision.getDate());
        bean.setGlosa(txtGlosa.getText().trim());
        bean.setIdTipoOperacion("");
        bean.setIdUsuario(usuario.getId_usuario());
        bean.setIdCorrelativo(this.getIdCorrelativo());
        return bean;
    }

    private String getXmlPlanilla() {
        String xmlVenta;
        xmlVenta = "<?xml version=\"1.0\" ?> ";
        xmlVenta += "<VENTAS>";
        String glosa = txtGlosa.getText().trim();
        String tc = txtTc.getText().trim().replace(".", ",");
        String fechaPlanilla = UtilDate.getStrFecha(dcFemision.getDate());
        String idTipoDoc = txtTipoDoc.getText().trim();
        UsuarioCorrelativo uc = this.getUsuarioCorrelativo();
        String serie = uc.getSerie();
        String preimpreso = txtPreimpreso.getText().trim();
        for (int i = 0; i < modeltablePlanilla.getRowCount(); i++) {
            BeanImpPlanilla beanPlanilla = modeltablePlanilla.getBeanImpPlanilla(i);
            xmlVenta += "<VENTA>";
            xmlVenta += "<ID_ANEXO>" + beanPlanilla.getIdAnexo() + "</ID_ANEXO>";
            xmlVenta += "<CTA>" + beanPlanilla.getIdCuenta() + "</CTA>";
            xmlVenta += "<TD>" + idTipoDoc + "</TD>";
            xmlVenta += "<SERIE>" + serie + "</SERIE>";
            xmlVenta += "<PREIMPRESO>" + preimpreso + "</PREIMPRESO>";
            xmlVenta += "<TD_REF></TD_REF>";
            xmlVenta += "<SERIE_REF></SERIE_REF>";
            xmlVenta += "<PREIMPRESO_REF></PREIMPRESO_REF>";
            xmlVenta += "<ID_REF></ID_REF>";
            xmlVenta += "<GLOSA>" + glosa + "</GLOSA>";
            xmlVenta += "<TC>" + tc + "</TC>";
            if (beanPlanilla.getPosDebeHaber().equals("D")) {
                xmlVenta += "<DEBE>" + beanPlanilla.getImporte().toString().replace(".", ",") + "</DEBE>";
                xmlVenta += "<HABER>0</HABER>";
            } else {
                xmlVenta += "<DEBE>0</DEBE>";
                xmlVenta += "<HABER>" + beanPlanilla.getImporte().toString().replace(".", ",") + "</HABER>";
            }
            xmlVenta += "<FECHA>" + fechaPlanilla + "</FECHA>";
            xmlVenta += "</VENTA>";
        }
        xmlVenta += "</VENTAS>";
        xmlVenta = xmlVenta.replace("&", " ");
        logger.info("xmlVenta: " + xmlVenta);
        return xmlVenta;
    }

    private boolean verificarDatosPlanilla() throws Exception {
        if (cboSerie.getSelectedIndex() < 0) {
            JOptionPane.showMessageDialog(this, "Seleccione serie");
            return false;
        }
        String tcStr = txtTc.getText().trim();
        if (tcStr.length() == 0) {
            JOptionPane.showMessageDialog(this, "Ingrese TC");
            return false;
        }
        BigDecimal tc = new BigDecimal(tcStr);
        if (tc.compareTo(BigDecimal.ZERO) != 1) {
            JOptionPane.showMessageDialog(this, "TC mayor a 0");
            return false;
        }
        if (txtTc.getText().trim().length() == 0) {
            JOptionPane.showMessageDialog(this, "Ingrese Glosa");
            return false;
        }
        if (modeltablePlanilla.getListBeanImportar().isEmpty()) {
            JOptionPane.showMessageDialog(this, "No hay datos que registrar");
            return false;
        }
        BigDecimal debe = BigDecimal.ZERO;
        BigDecimal haber = BigDecimal.ZERO;
        for (BeanImpPlanilla beanPlanilla : modeltablePlanilla.getListBeanPlanilla()) {
            if (!beanPlanilla.isSelected()) {
                JOptionPane.showMessageDialog(this, "Registro " + beanPlanilla.getIndex() + ": " + beanPlanilla.getObservacion());
                return false;
            }
            if (beanPlanilla.getPosDebeHaber().equals("D")) {
                debe = debe.add(beanPlanilla.getImporte());
            } else {
                haber = haber.add(beanPlanilla.getImporte());
            }
        }
        if (debe.compareTo(haber) != 0) {
            JOptionPane.showMessageDialog(this, "Suma Debe y Haber no coinciden");
            return false;
        }
        String idAuxiliar = this.getIdAuxiliar();
        RnRegconta logic = new RnRegconta(path);
        String idPeriodoMensual = UtilDate.getIdPeriodoMensual(dcFemision.getDate());
        String rpta = logic.estadoPeriodoAuxiliar(idPeriodoMensual, idAuxiliar);
        if (rpta.trim().substring(0, 1).equals("*")) {
            JOptionPane.showMessageDialog(this, rpta);
            return false;
        }
        int xres = JOptionPane.showConfirmDialog(this,
                "La operacion se grabara en \nPeriodo: " + idPeriodoMensual + "\nAuxiliar: " + idAuxiliar,
                "Sistema", JOptionPane.OK_CANCEL_OPTION, JOptionPane.QUESTION_MESSAGE);
        return xres == JOptionPane.OK_OPTION;
    }

    private void guardarAsientoContable(AbstractTableModel modelTable) throws Exception {
        try {
            if (!verificarDatosAsiento(((ImpTableService) modelTable).getListBeanImportar())) {
                return;
            }
            RnCliente logicCliente = new RnCliente(path);
            String xmlAsiento = ((ImpAsientoService) modelTable).getXmlObjects();
            BeanCabAsiento beanCabAsiento = this.getBeanCabAsiento(modelTable);
            logger.info("idAuxiliar: " + beanCabAsiento.getIdAuxiliar());
            logger.info("xmlAsiento: " + xmlAsiento);
            String rpta = logicCliente.importarAsientoContable(beanCabAsiento, xmlAsiento);
            logger.info(rpta);
            if (rpta.trim().equals("CORRECTO")) {
                JOptionPane.showMessageDialog(this, "REGISTRADO CORRECTAMENTE");
                ((ImpTableService) modelTable).clearTable();
                CTableFx.setAllColumnPreferredWidth(table);
            }
        } catch (SQLException | HeadlessException ex) {
            throw ex;
        }
    }

    private void guardarAsientoLetra(List<BeanImpLetra> lstLetra) throws Exception {
        try {
            if (!verificarDatosLetra(lstLetra)) {
                return;
            }
            String idAuxiliar = this.getIdAuxiliar();
            List<BeanImpLetraGroup> lstLetraGroup = this.getListLetrasGroup(lstLetra, idAuxiliar);
            for (BeanImpLetraGroup beanGroup : lstLetraGroup) {
                String xml = beanGroup.xmlDocLetra();
                logger.info("xmlLetra: " + xml);
                beanGroup.setXmlDoc(xml);
            }
            RnRegconta logic = new RnRegconta(path);
            logic.insertLetraGroup(lstLetraGroup, idAuxiliar);
            JOptionPane.showMessageDialog(this, "REGISTRADO CORRECTAMENTE");
            if (idAuxiliar.equals(AuxiliarEnum.LETRA_COBRAR.getValue())) {
                modeltableLetraVenta.clearTable();
            } else {
                modeltableLetraCompra.clearTable();
            }
            CTableFx.setAllColumnPreferredWidth(table);
        } catch (SQLException | HeadlessException ex) {
            throw ex;
        }
    }

    private Map<String, BeanTipoOperacion> getMapOperacion(String idAuxiliar) throws Exception {
        String idTipo;
        if (idAuxiliar.equals(AuxiliarEnum.LETRA_PAGAR.getValue())) {
            idTipo = "167,168";
        } else {
            idTipo = "179,180";
        }
        Map<String, BeanTipoOperacion> mapOper = new HashMap();
        mapOper.put(MonedaEnum.SOLES.getValue(), this.getOperacionMoneda(MonedaEnum.SOLES.getValue(), idTipo));
        mapOper.put(MonedaEnum.DOLARES.getValue(), this.getOperacionMoneda(MonedaEnum.DOLARES.getValue(), idTipo));
        return mapOper;
    }

    private BeanTipoOperacion getOperacionMoneda(String idMoneda, String idTipo) throws Exception {
        RnTipoOperacion logic = new RnTipoOperacion(path);
        List<BeanTipoOperacion> lstOper = logic.listarOperacionForm(idMoneda, idTipo);
        if (lstOper.isEmpty()) {
            return null;
        }
        return lstOper.get(0);
    }

    private List<BeanImpLetraGroup> getListLetrasGroup(List<BeanImpLetra> lstLetra, String idAuxiliar) throws Exception {
        String serieLote = this.getSerieLote(idAuxiliar);
        List<BeanImpLetraGroup> lstLetraGroup = new ArrayList();
        Map<String, BeanTipoOperacion> mapOper = this.getMapOperacion(idAuxiliar);
        for (BeanImpLetra beanLetra : lstLetra) {
            BeanImpLetraGroup beanGroup = this.getLetraGroup(beanLetra, lstLetraGroup, idAuxiliar, serieLote, mapOper);
            if (beanGroup.getBeanRcc().getTipoCambio().compareTo(beanLetra.getTcLetra()) != 0) {
                throw new Exception("Letra " + beanLetra.getSerie() + "-" + beanLetra.getPreimpresoLetra() + " tienen distinto tipo de cambio");
            }
            beanGroup.getLstLetra().add(beanLetra);
        }
        logger.info("lstLetraGroup.size: " + lstLetraGroup.size());
        return lstLetraGroup;
    }

    private String getSerieLote(String idAuxiliar) {
        if (idAuxiliar.equals(AuxiliarEnum.LETRA_PAGAR.getValue())) {
            return "001";
        }
        return "002";
    }

    private BeanImpLetraGroup getLetraGroup(BeanImpLetra beanLetra, List<BeanImpLetraGroup> lstLetraGroup,
            String idAuxiliar, String serieLote, Map<String, BeanTipoOperacion> mapOper) throws Exception {
        for (BeanImpLetraGroup beanLetraGroup : lstLetraGroup) {
            if (beanLetraGroup.getSerieLetra().equals(beanLetra.getSerieLetra())
                    && beanLetraGroup.getPreimpresoLetra().equals(beanLetra.getPreimpresoLetra())
                    && beanLetraGroup.getBeanRcc().getBeanMoneda().getIdMoneda().equals(beanLetra.getIdMoneda())
                    && beanLetraGroup.getBeanRcc().getBeanAnexo().getIdAnexo().equals(beanLetra.getIdAnexo())) {
                return beanLetraGroup;
            }
        }
        BeanImpLetraGroup beanGroup = new BeanImpLetraGroup();
        beanGroup.setSerieLetra(beanLetra.getSerieLetra());
        beanGroup.setPreimpresoLetra(beanLetra.getPreimpresoLetra());
        beanGroup.setIdtipoAnexo(idAuxiliar.equals(AuxiliarEnum.LETRA_COBRAR.getValue()) ? TipoAnexoEnum.CLIENTE.getValue() : TipoAnexoEnum.PROVEEDOR.getValue());
        BeanRegcontaCab beanRcc = new BeanRegcontaCab();
        BeanAnexo beanAnexo = new BeanAnexo();
        beanAnexo.setIdAnexo(beanLetra.getIdAnexo());
        beanRcc.setBeanAnexo(beanAnexo);
        beanRcc.setIdEmpresa(usuario.getCodempresa());
        beanRcc.setIdLocalidad(usuario.getCodlocalidad());
        beanRcc.setBeanMoneda(new BeanMoneda(beanLetra.getIdMoneda()));
        BeanTipoDocVenta beanTipoDoc = new BeanTipoDocVenta();
        beanTipoDoc.setIdTipoDoc(TipoDocVentaEnum.LOTE_LETRAS.getValue());
        beanRcc.setBeanTipoDocVenta(beanTipoDoc);
        beanRcc.setSerie(serieLote);
        beanRcc.setTipoCambio(beanLetra.getTcLetra());
        beanRcc.setFEmision(beanLetra.getFechaEmisionLetra());
        beanRcc.setIdAuxiliar(idAuxiliar);
        beanRcc.setAnio(UtilDate.getAnio(beanRcc.getFEmision()));
        beanRcc.setMes(UtilDate.getMes(beanRcc.getFEmision()));
        beanRcc.setGlosa(beanLetra.getGlosa());
        BeanTipoOperacion tipoOp = mapOper.get(beanLetra.getIdMoneda());
        if (tipoOp == null) {
            throw new Exception("No existe operacion configurada para la moneda: " + beanLetra.getIdMoneda());
        }
        beanRcc.setIdTipoOperacion(tipoOp.getIdTipoOperacion());
        beanRcc.setIdCuenta(tipoOp.getCuenta());
        beanRcc.setIdUsuario(usuario.getId_usuario());
        beanGroup.setBeanRcc(beanRcc);
        lstLetraGroup.add(beanGroup);
        return beanGroup;
    }

    private void updateVendedorVentas() throws Exception {
        if (modeltableActVendedor.getListActVendedor().isEmpty()) {
            return;
        }
        List<BeanActVendedor> lstVentas = this.getActVentas();
        if (lstVentas.isEmpty()) {
            JOptionPane.showMessageDialog(this, "No hay documentos por actualizar");
            return;
        }
        RnRegconta logig = new RnRegconta(path);
        logig.actualizarVendedorVenta(lstVentas);
        JOptionPane.showMessageDialog(this, "ACTUALIZADO CORRECTAMENTE");
        modeltableActVendedor.clearTable();
        CTableFx.setAllColumnPreferredWidth(table);
    }

    private List<BeanActVendedor> getActVentas() {
        List<BeanActVendedor> result = new ArrayList();
        for (BeanActVendedor actVendedor : modeltableActVendedor.getListActVendedor()) {
            logger.info(actVendedor.toString());
            if (!actVendedor.isSelected()) {
                continue;
            }
            if (actVendedor.getIdVendedor().equals(actVendedor.getIdVendedorActual())) {
                continue;
            }
            result.add(actVendedor);
        }
        return result;
    }

    private BeanCabAsiento getBeanCabAsiento(AbstractTableModel modelTable) {
        BeanCabAsiento beanCabAsiento = new BeanCabAsiento();
        String idAuxiliar = this.getIdAuxiliar();
        BeanImportar beanImportar = ((ImpAsientoService) modelTable).getBeanImportar(0);
        beanCabAsiento.setAnio(Util.getAnio(beanImportar.getFechaContable()));
        beanCabAsiento.setMes(Util.getMes(beanImportar.getFechaContable()));
        beanCabAsiento.setIdUsuario(usuario.getId_usuario());
        beanCabAsiento.setIdEmpresa(usuario.getCodempresa());
        beanCabAsiento.setIdAuxiliar(idAuxiliar);
        beanCabAsiento.setIdPeriodoMensual(this.getIdPeriodoMensual(beanImportar, idAuxiliar));
        return beanCabAsiento;
    }

    private boolean verificarDatosAsiento(List<BeanImportar> lstImportar) throws Exception {
        if (lstImportar.isEmpty()) {
            JOptionPane.showMessageDialog(this, "No hay datos que registrar");
            return false;
        }
        Set<String> setMes = new HashSet();
        for (BeanImportar beanImportar : lstImportar) {
            if (!beanImportar.isSelected()) {
                JOptionPane.showMessageDialog(this, "Registro " + beanImportar.getIndex() + ": " + beanImportar.getObservacion());
                return false;
            }
            setMes.add(SDF_MY.format(beanImportar.getFechaContable()));
        }
        if (setMes.size() > 1) {
            JOptionPane.showMessageDialog(this, "Los Documentos no se encuentran en el mismo mes");
            return false;
        }
        String idAuxiliar = this.getIdAuxiliar();
        RnRegconta logic = new RnRegconta(path);
        BeanImportar beanImportar = lstImportar.get(0);
        String idPeriodoMensual = this.getIdPeriodoMensual(beanImportar, idAuxiliar);
        String rpta = logic.estadoPeriodoAuxiliar(idPeriodoMensual, idAuxiliar);
        if (rpta.trim().substring(0, 1).equals("*")) {
            JOptionPane.showMessageDialog(this, rpta);
            return false;
        }
        int xres = JOptionPane.showConfirmDialog(this,
                "La operacion se grabara en \nPeriodo: " + idPeriodoMensual + "\nAuxiliar: " + idAuxiliar,
                "Sistema", JOptionPane.OK_CANCEL_OPTION, JOptionPane.QUESTION_MESSAGE);
        return xres == JOptionPane.OK_OPTION;
    }

    private boolean verificarDatosLetra(List<BeanImpLetra> lstLetra) throws Exception {
        if (lstLetra.isEmpty()) {
            JOptionPane.showMessageDialog(this, "No hay datos que registrar");
            return false;
        }
        Set<String> setMes = new HashSet();
        for (BeanImpLetra beanLetra : lstLetra) {
            if (!beanLetra.isSelected()) {
                JOptionPane.showMessageDialog(this, "Registro " + beanLetra.getIndex() + ": " + beanLetra.getObservacion());
                return false;
            }
            setMes.add(SDF_MY.format(beanLetra.getFechaEmisionLetra()));
        }
        if (setMes.size() > 1) {
            JOptionPane.showMessageDialog(this, "Los Documentos no se encuentran en el mismo mes");
            return false;
        }
        String idAuxiliar = this.getIdAuxiliar();
        RnRegconta logic = new RnRegconta(path);
        BeanImpLetra beanLetra = lstLetra.get(0);
        String idPeriodoMensual = UtilDate.getIdPeriodoMensual(beanLetra.getFechaEmisionLetra());
        String rpta = logic.estadoPeriodoAuxiliar(idPeriodoMensual, idAuxiliar);
        if (rpta.trim().substring(0, 1).equals("*")) {
            JOptionPane.showMessageDialog(this, rpta);
            return false;
        }
        int xres = JOptionPane.showConfirmDialog(this,
                "La operacion se grabara en \nPeriodo: " + idPeriodoMensual + "\nAuxiliar: " + idAuxiliar,
                "Sistema", JOptionPane.OK_CANCEL_OPTION, JOptionPane.QUESTION_MESSAGE);
        return xres == JOptionPane.OK_OPTION;
    }

    private String getIdPeriodoMensual(BeanImportar beanImportar, String idAuxiliar) {
        String mes = Util.getMes(beanImportar.getFechaContable());
        return Util.getIdPeriodoMensual(Util.getAnio(beanImportar.getFechaContable()), mes, idAuxiliar);
    }

    @Override
    public void actionPerformed(ActionEvent ae) {
        if (ae.getSource() == btnImportar) {
            importarExcel();
        }
        if (ae.getSource() == btnGuardar) {
            guardarAsiento();
        }
        if (dcFemision.getCalendarButton() == ae.getSource()) {
            cargarTipoCambio();
            ((JTextFieldDateEditor) dcFemision.getDateEditor()).requestFocus();
        }
        if (ae.getSource().equals(btnEliminar)) {
            this.eliminarAsiento();
        }
    }

    private void eliminarAsiento() {
        try {
            String idAuxiliar = this.getIdAuxiliar();
            String idPeriodo = LoadComboItem.getIdCombo(cboPeriodo);
            if (Util.isBlank(idAuxiliar)) {
                JOptionPane.showMessageDialog(this, "Seleccione Auxiliar");
                return;
            }
            int xres = JOptionPane.showConfirmDialog(this,
                    "Seguro que desea eliminar los asientos en \nPeriodo: " + idPeriodo
                    + "\nAuxiliar: " + idAuxiliar + "\nSe eliminaran todos los asientos del sistema",
                    "Sistema", JOptionPane.OK_CANCEL_OPTION, JOptionPane.QUESTION_MESSAGE);
            if (xres != JOptionPane.OK_OPTION) {
                return;
            }
            RnRegconta logic = new RnRegconta(path);
            logic.eliminarAsientos(idPeriodo, idAuxiliar);
            JOptionPane.showMessageDialog(this, "Eliminados correctamente");
        } catch (Exception e) {
            ExceptionHandler.handleException(e, logger);
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }

    private void changeAuxiliar() {
        String idAuxiliar = this.getIdAuxiliar();
        pnlPlanilla.setVisible(false);
        if (idAuxiliar.equals(AuxiliarEnum.VENTA.getValue())) {
            modeloOrdenado = new TableRowSorter(modeltableVentas);
            table.setRowSorter(modeloOrdenado);
            table.setModel(modeltableVentas);
            modeltableVentas.clearTable();
            modeltableVentas.fireTableDataChanged();
            CTableFx.setAllColumnPreferredWidth(table);
        } else if (idAuxiliar.equals(AuxiliarEnum.COMPRA.getValue())) {
            modeloOrdenado = new TableRowSorter(modeltableCompras);
            table.setRowSorter(modeloOrdenado);
            table.setModel(modeltableCompras);
            modeltableCompras.clearTable();
            modeltableCompras.fireTableDataChanged();
            CTableFx.setAllColumnPreferredWidth(table);
        } else if (idAuxiliar.equals(AuxiliarEnum.APERTURA.getValue()) || idAuxiliar.equals(AuxiliarEnum.PROVISION.getValue())) {
            modeloOrdenado = new TableRowSorter(modeltableAsiento);
            table.setRowSorter(modeloOrdenado);
            table.setModel(modeltableAsiento);
            modeltableAsiento.clearTable();
            modeltableAsiento.fireTableDataChanged();
            CTableFx.setAllColumnPreferredWidth(table);
        } else if (idAuxiliar.equals(AuxiliarEnum.PLANILLA.getValue())) {
            modeloOrdenado = new TableRowSorter(modeltablePlanilla);
            table.setRowSorter(modeloOrdenado);
            table.setModel(modeltablePlanilla);
            modeltablePlanilla.clearTable();
            modeltablePlanilla.fireTableDataChanged();
            CTableFx.setAllColumnPreferredWidth(table);
            pnlPlanilla.setVisible(true);
        } else if (idAuxiliar.equals(AuxiliarEnum.LETRA_COBRAR.getValue())) {
            modeloOrdenado = new TableRowSorter(modeltableLetraVenta);
            table.setRowSorter(modeloOrdenado);
            table.setModel(modeltableLetraVenta);
            modeltableLetraVenta.clearTable();
            modeltableLetraVenta.fireTableDataChanged();
            CTableFx.setAllColumnPreferredWidth(table);
        } else if (idAuxiliar.equals(AuxiliarEnum.LETRA_PAGAR.getValue())) {
            modeloOrdenado = new TableRowSorter(modeltableLetraCompra);
            table.setRowSorter(modeloOrdenado);
            table.setModel(modeltableLetraCompra);
            modeltableLetraCompra.clearTable();
            modeltableLetraCompra.fireTableDataChanged();
            CTableFx.setAllColumnPreferredWidth(table);
        } else {
            modeloOrdenado = new TableRowSorter(modeltableActVendedor);
            table.setRowSorter(modeloOrdenado);
            table.setModel(modeltableActVendedor);
            modeltableActVendedor.clearTable();
            modeltableActVendedor.fireTableDataChanged();
            CTableFx.setAllColumnPreferredWidth(table);
        }
    }

    private void mostratPreimpreso() {
        try {
            RnCorrelativo reglaCorrelativo = new RnCorrelativo(Main.path);
            String lsSeriePreimpreso;
            lsSeriePreimpreso = reglaCorrelativo.listarPreimpreso(this.getIdCorrelativo());
            this.txtPreimpreso.setText(lsSeriePreimpreso);
        } catch (Exception e) {
            ExceptionHandler.handleException(e, logger);
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }

    private String getIdCorrelativo() {
        return this.getUsuarioCorrelativo().getIdCorrelativo();
    }

    private UsuarioCorrelativo getUsuarioCorrelativo() {
        ObjectItem obj = (ObjectItem) cboSerie.getSelectedItem();
        if (obj == null) {
            return null;
        }
        return (UsuarioCorrelativo) obj.getObjItem();
    }

    @Override
    public void itemStateChanged(ItemEvent e) {
        if (e.getSource().equals(cboAuxiliar)) {
            this.changeAuxiliar();
        }
        if (e.getSource().equals(cboSerie)) {
            this.mostratPreimpreso();
        }
        if (e.getSource().equals(cboMoneda)) {
            cargarTipoCambio();
        }
        if (e.getSource().equals(cboTipoCambio)) {
            cargarTipoCambio();
            txtTc.setEditable(cboTipoCambio.getSelectedIndex() == 3);
        }
    }

    @Override
    public void focusGained(FocusEvent e) {
    }

    @Override
    public void focusLost(FocusEvent e) {
        if (((JTextFieldDateEditor) dcFemision.getDateEditor()) == e.getSource()) {
            cargarTipoCambio();
        }
    }

}
