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

    protected final URL path;
    protected final Usuario usuario;
    protected JComboBox cboAuxiliar;
    protected JButton btnImportar;
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
    protected JButton btnGuardar;
    protected JButton btnEliminar;
    protected Gif gif;
    protected final Logger logger = Logger.getLogger(UiFormAsientoImportar.class);
    protected static final SimpleDateFormat SDF_DM = new SimpleDateFormat("dd/MM");
    protected static final SimpleDateFormat SDF_MY = new SimpleDateFormat("MM/yyyy");
    protected JPanel pnlPlanilla;
    protected JComboBox cboTipoCambio;
    protected JTextField txtTipoDoc;
    protected JTextField txtTipoDocDesc;
    protected JTextField txtPreimpreso;
    protected JComboBox cboSerie;
    protected JDateChooser dcFemision;
    protected JComboBox cboMoneda;
    protected JTextField txtTc;
    protected JTextField txtGlosa;
    protected final Main frmMain;
    protected String fecha = "";
    protected BeanTipoCambio beanTc;
    protected JComboBox cboPeriodo;

    public UiFormAsientoImportar(Main frame, Usuario usuario, URL ruta) {
        super(frame, true);
        this.usuario = usuario;
        this.path = ruta;
        this.frmMain = frame;
        initComponents();
    }

    protected void initComponents() {
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

    protected void initListener() {
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

    protected String getIdMoneda(JComboBox cbo) {
        ObjectItem itemMoneda = (ObjectItem) cbo.getSelectedItem();
        if (itemMoneda != null && itemMoneda.getObjItem() != null) {
            return itemMoneda.getObjItem().toString().trim();
        }
        return "";
    }

    protected void loadSerieCorrelativo(String idTipoDoc) throws Exception {
    }

    protected void cargarTipoCambio() {
    }

    protected String getValueTipoCambio() {
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

    protected void setfecha() {
        dcFemision.setSelectableDateRange(DateTime.format(100, 0, 1), frmMain.getFechaFin());
        dcFemision.setDate(frmMain.getFechaFin());
    }

    protected JPanel getPnlPlanilla() {
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

    protected void loadCombo() {
    }

    protected void loadPeriodo() throws Exception {
    }

    protected String getIdAuxiliar() {
        return null;
    }

    protected void importarExcel() {
    }

    protected void llenarDataLetraCliente(ImpLetraTableModel modelTableLetra) throws Exception {
    }

    protected void llenarDataLetraProveedor(ImpLetraTableModel modelTableLetra) throws Exception {
    }

    protected void validateDataCxc(BeanImpLetra beanLetra, List<BeanCxC> listCxC) {
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

    protected void validateDataCxp(BeanImpLetra beanLetra, List<BeanCxP> listCxP) {
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

    protected BeanCxC getCxC(BeanImpLetra beanLetra, List<BeanCxC> listCxC) {
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

    protected BeanCxP getCxP(BeanImpLetra beanLetra, List<BeanCxP> listCxP) {
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

    protected void llenarDataAsiento(AbstractTableModel modelTable) throws Exception {
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

    protected void llenarDataActVendedor(ImpActVendedorTableModel modelTable) throws Exception {
    }

    protected void llenarDataPlanilla(AbstractTableModel modelTable) throws Exception {
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

    protected void setColorTableAsiento(AbstractTableModel model) {
        for (int i = 1; i < model.getColumnCount(); i++) {
            table.getColumnModel().getColumn(i).setCellRenderer(new CellRendererLabelAsiento());
        }
    }

    protected void fillDataCompras(File file) throws ParseException, Exception {
    }

    protected void fillDataLetras(File file, ImpLetraTableModel modelTableLetra) throws ParseException, Exception {
    }

    protected void fillDataVentas(File file) throws ParseException, Exception {
    }

    protected void fillDataAsiento(File file) throws ParseException, Exception {
    }

    protected void fillDataActVendedor(File file) throws ParseException, Exception {
    }

    protected void fillDataPlanilla(File file) throws ParseException, Exception {
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

    protected void fillDataPlanilla(Sheet sheet, String nameSheet) throws ParseException, Exception {
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

    protected void validateMontosAsiento(BeanImportar beanImportar,
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

    protected void validateReferenciaAsiento(BeanImportar beanImportar, String idTipoDocRef,
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

    protected void validateFechaAsiento(BeanImportar beanImportar, boolean isAsientoApertura) {
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

    protected boolean validateFechaContableAsientoInicial(BeanImportar beanImportar) {
        if (!SDF_DM.format(beanImportar.getFechaContable()).equals("01/01")) {
            beanImportar.setSelected(false);
            beanImportar.setObservacion("FECHA DEBE CONTABLE DEBE SER 01 DE ENERO");
            return false;
        }
        return true;
    }

    protected boolean validateFechaEmisionAsiento(BeanImportar beanImportar) {
        if (beanImportar.getFechaEmision().compareTo(beanImportar.getFechaContable()) == 1) {
            beanImportar.setSelected(false);
            beanImportar.setObservacion("FECHA DE EMISION MAYOR QUE FECHA CONTABLE");
            return false;
        }
        return true;
    }

    protected void validateFechaVencimientoAsiento(BeanImportar beanImportar) {
        if (beanImportar.getFechaEmision().compareTo(beanImportar.getFechaVencimiento()) == 1) {
            beanImportar.setSelected(false);
            beanImportar.setObservacion("FECHA DE VENCIMIENTO MENOR QUE FECHA DE EMISION");
        }
    }

    protected void validateDataLetra(BeanImpLetra beanLetra) {
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

    protected void guardarAsiento() {
    }

    protected void guardarAsientoPlanilla() throws Exception {
    }

    protected BeanRegcontaCab getBeanRegcontaCabAsiento() {
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

    protected String getXmlPlanilla() {
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

    protected boolean verificarDatosPlanilla() throws Exception {
        return false;
    }

    protected void guardarAsientoContable(AbstractTableModel modelTable) throws Exception {
    }

    protected void guardarAsientoLetra(List<BeanImpLetra> lstLetra) throws Exception {
    }

    protected Map<String, BeanTipoOperacion> getMapOperacion(String idAuxiliar) throws Exception {
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

    protected BeanTipoOperacion getOperacionMoneda(String idMoneda, String idTipo) throws Exception {
        return null;
    }

    protected List<BeanImpLetraGroup> getListLetrasGroup(List<BeanImpLetra> lstLetra, String idAuxiliar) throws Exception {
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

    protected String getSerieLote(String idAuxiliar) {
        if (idAuxiliar.equals(AuxiliarEnum.LETRA_PAGAR.getValue())) {
            return "001";
        }
        return "002";
    }

    protected BeanImpLetraGroup getLetraGroup(BeanImpLetra beanLetra, List<BeanImpLetraGroup> lstLetraGroup,
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

    protected void updateVendedorVentas() throws Exception {
    }

    protected List<BeanActVendedor> getActVentas() {
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

    protected BeanCabAsiento getBeanCabAsiento(AbstractTableModel modelTable) {
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

    protected boolean verificarDatosAsiento(List<BeanImportar> lstImportar) throws Exception {
        return false;
    }

    protected boolean verificarDatosLetra(List<BeanImpLetra> lstLetra) throws Exception {
        return false;
    }

    protected String getIdPeriodoMensual(BeanImportar beanImportar, String idAuxiliar) {
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

    protected void eliminarAsiento() {
    }

    protected void changeAuxiliar() {
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

    protected void mostratPreimpreso() {
    }

    protected String getIdCorrelativo() {
        return this.getUsuarioCorrelativo().getIdCorrelativo();
    }

    protected UsuarioCorrelativo getUsuarioCorrelativo() {
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
