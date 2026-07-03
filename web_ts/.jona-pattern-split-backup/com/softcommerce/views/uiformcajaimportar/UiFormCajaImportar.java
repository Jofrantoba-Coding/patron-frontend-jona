package com.softcommerce.views.uiformcajaimportar;


import com.softcommerce.formularios.importar.*;
import com.softcommerce.formularios.*;
import com.softcommerce.beans.BeanAnexo;
import com.softcommerce.beans.BeanEmpresaCuenta;
import com.softcommerce.beans.BeanMedioPago;
import com.softcommerce.beans.BeanMoneda;
import com.softcommerce.beans.BeanRptaRcc;
import com.softcommerce.beans.BeanTipoOperacion;
import com.softcommerce.beans.Usuario;
import com.softcommerce.beans.UsuarioCorrelativo;
import com.softcommerce.beans.importar.BeanImpCaja;
import com.softcommerce.beans.importar.BeanImpOP;
import com.softcommerce.beans.importar.BeanImpTransBanc;
import com.softcommerce.beans.importar.BeanImportar;
import com.softcommerce.enums.AuxiliarEnum;
import com.softcommerce.enums.TipoAnexoEnum;
import com.softcommerce.enums.TipoDocVentaEnum;
import com.softcommerce.enums.TipoImpCajaEnum;
import com.softcommerce.formularios.Main;
import com.softcommerce.general.controles.ObjectItem;
import com.softcommerce.general.controles.UpperCaseNumberDocument;
import com.softcommerce.general.herramientas.CTableFx;
import com.softcommerce.general.tablas.importar.ImpAnticipoProvTableModel;
import com.softcommerce.general.tablas.importar.ImpCajaTableModel;
import com.softcommerce.general.tablas.importar.ImpTransfBancTableModel;
import com.softcommerce.iconos.Gif;
import com.softcommerce.reglasnegocio.RnCorrelativo;
import com.softcommerce.reglasnegocio.RnRegconta;
import com.softcommerce.util.ExceptionHandler;
import com.softcommerce.util.FxTipoDocVenta;
import com.softcommerce.util.LayoutUtil;
import com.softcommerce.util.UtilDate;
import com.softcommerce.util.UtilExcel;
import com.softcommerce.util.combo.LoadComboItem;
import java.awt.BorderLayout;
import java.awt.CardLayout;
import java.awt.Color;
import java.awt.Dimension;
import java.awt.FlowLayout;
import java.awt.Font;
import java.awt.GridBagConstraints;
import java.awt.GridBagLayout;
import java.awt.HeadlessException;
import java.awt.Insets;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.ItemEvent;
import java.awt.event.ItemListener;
import java.io.File;
import java.net.URL;
import java.text.ParseException;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import javax.swing.BorderFactory;
import javax.swing.JButton;
import javax.swing.JComboBox;
import javax.swing.JDialog;
import javax.swing.JFileChooser;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import javax.swing.JScrollPane;
import javax.swing.JTable;
import javax.swing.JTextField;
import javax.swing.ListSelectionModel;
import javax.swing.border.Border;
import javax.swing.border.TitledBorder;
import javax.swing.table.AbstractTableModel;
import jxl.Sheet;
import jxl.read.biff.BiffException;
import org.apache.log4j.Logger;

public class UiFormCajaImportar
        extends JDialog
        implements InterUiFormCajaImportar, ActionListener, ItemListener {

    private final URL path;
    private Gif gif;
    private JComboBox cboTipo;
    private JButton btnImportar;
    static JFileChooser jChooser;
    private JTable table;
    private ImpAnticipoProvTableModel modeltableOP;
    private ImpTransfBancTableModel modeltableTransBanc;
    private ImpCajaTableModel modeltableCaja;
    private JButton btnGuardar;
    private final Main frmMain;
    private final Usuario usuario;
    private JPanel pnlData;
    private CardLayout cardLayout;
    private JComboBox cboSerie;
    private JTextField txtTipoDoc;
    private JTextField txtTipoDocDesc;
    private final Logger logger = Logger.getLogger(UiFormCajaImportar.class);
    private String tipoGral = "";

    public UiFormCajaImportar(Main frame, Usuario usuario, URL ruta) {
        super(frame, true);
        this.frmMain = frame;
        this.usuario = usuario;
        this.path = ruta;
        inicialize();
    }

    private void inicialize() {
        JPanel pnl = new JPanel();
        gif = new Gif();
        pnlData = new JPanel();
        cardLayout = new CardLayout();
        pnlData.setLayout(cardLayout);
        pnl.setLayout(new BorderLayout());
        pnl.add(getPnlNorth(), BorderLayout.NORTH);
        pnl.add(getPnlTable(), BorderLayout.CENTER);
        pnl.add(getPnlOpciones(), BorderLayout.SOUTH);
        this.getContentPane().add(pnl);
        jChooser = new JFileChooser();
        setMinimumSize(new Dimension(1000, 450));
        initListener();
        loadCombo();
        //this.initFecha();
        this.pack();
    }

    private void initListener() {
        btnImportar.addActionListener(this);
        btnGuardar.addActionListener(this);
        cboTipo.addItemListener(this);
    }

    private void loadCombo() {
        try {
            this.loadComboTipo();
            txtTipoDoc.setText(TipoDocVentaEnum.ORDEN_PAGO.getValue());
            //FxTipoDocVenta.buscarTipoDocVenta(txtTipoDoc, txtTipoDocDesc, false, frmMain, path, this);
            //loadSerieCorrelativo(TipoDocVentaEnum.ORDEN_PAGO.getValue());
        } catch (Exception ex) {
            ExceptionHandler.handleException(ex, logger);
            JOptionPane.showMessageDialog(this, ex.getMessage());
        }
    }

    private void loadComboTipo() {
        TipoImpCajaEnum[] listTipo = TipoImpCajaEnum.values();
        for (TipoImpCajaEnum tipoEnum : listTipo) {
            cboTipo.addItem(new ObjectItem(tipoEnum.name(), tipoEnum.getValue()));
        }
    }

    private void loadSerieCorrelativo(String idTipoDoc) throws Exception {
        RnCorrelativo reglaCorrelativo = new RnCorrelativo(path);
        List<UsuarioCorrelativo> list = reglaCorrelativo.listarCorrelativo(idTipoDoc);
        cboSerie.removeAllItems();
        for (UsuarioCorrelativo uc : list) {
            cboSerie.addItem(new ObjectItem(uc.getSerie(), uc));
        }
    }

    private JPanel getPnlNorth() {
        JPanel pnlPrinc = new JPanel();
        pnlPrinc.setLayout(new BorderLayout());
        JPanel pnl = new JPanel(new FlowLayout(FlowLayout.LEADING, 2, 5));
        pnlPrinc.add(pnl, BorderLayout.NORTH);
        JLabel lblTipo = new JLabel("Tipo");
        pnl.add(lblTipo);
        cboTipo = new JComboBox();
        pnl.add(cboTipo);
        btnImportar = new JButton("Importar", gif.EXCEL);
        pnl.add(btnImportar);
        pnlPrinc.add(pnlData, BorderLayout.CENTER);
        pnlData.add(this.getPnlDataOP(), "anticipoProv");
        return pnlPrinc;
    }

    private JPanel getPnlDataOP() {
        JPanel pnlPrinc = new JPanel();
        pnlPrinc.setLayout(new BorderLayout());
        Border border = BorderFactory.createTitledBorder(null, "Anticipo Proveedor", TitledBorder.LEFT,
                TitledBorder.DEFAULT_POSITION, new Font("Comic Sans MS", 0, 12), Color.BLACK);
        pnlPrinc.setBorder(border);
        JPanel pnl = new JPanel();
        pnlPrinc.add(pnl, BorderLayout.WEST);
        pnl.setLayout(new GridBagLayout());
        GridBagConstraints gbc = LayoutUtil.getGbc();
        JLabel lblTipoDoc = new JLabel("Tipo Doc");
        pnl.add(lblTipoDoc, gbc);
        gbc.gridx = 1;
        txtTipoDoc = new JTextField();
        txtTipoDoc.setDocument(new UpperCaseNumberDocument(2));
        txtTipoDoc.setEditable(false);
        txtTipoDoc.setColumns(2);
        gbc.insets = new Insets(2, 1, 2, 0);
        pnl.add(txtTipoDoc, gbc);

        txtTipoDocDesc = new JTextField();
        txtTipoDocDesc.setColumns(15);
        txtTipoDocDesc.setEnabled(false);
        gbc.insets = new Insets(2, 0, 2, 0);
        gbc.gridx = 2;
        gbc.gridwidth = 2;
        gbc.fill = GridBagConstraints.HORIZONTAL;
        pnl.add(txtTipoDocDesc, gbc);
        gbc.fill = GridBagConstraints.NONE;
        gbc.gridwidth = 1;
        gbc.insets = new Insets(2, 2, 2, 2);
        gbc.gridx = 4;
        JLabel lblDoc = new JLabel("Serie");
        pnl.add(lblDoc, gbc);

        gbc.gridx = 5;
        cboSerie = new JComboBox();
        gbc.fill = GridBagConstraints.HORIZONTAL;
        pnl.add(cboSerie, gbc);
        gbc.fill = GridBagConstraints.NONE;
        return pnlPrinc;
    }

    private JPanel getPnlTable() {
        JPanel pnl = new JPanel();
        pnl.setLayout(new BorderLayout());
        table = new JTable();
        table.setFont(new Font("Tahoma", Font.PLAIN, 11));
        table.setRowHeight(19);
        table.setAutoResizeMode(JTable.AUTO_RESIZE_OFF);
        modeltableOP = new ImpAnticipoProvTableModel();
        modeltableTransBanc = new ImpTransfBancTableModel();
        modeltableCaja = new ImpCajaTableModel();
        table.setModel(modeltableOP);
        /*table.getColumnModel().getColumn(1).setMinWidth(0);
        table.getColumnModel().getColumn(1).setMaxWidth(0);*/
        table.setSelectionMode(ListSelectionModel.SINGLE_SELECTION);
        table.getTableHeader().setFont(new Font("Tahoma", Font.BOLD, 11));
        JScrollPane scroll = new JScrollPane(table);
        CTableFx.setAllColumnPreferredWidth(table);
        scroll.setPreferredSize(new Dimension(800, 250));
        pnl.add(scroll, BorderLayout.CENTER);
        return pnl;
    }

    private JPanel getPnlOpciones() {
        JPanel pnlOpciones = new JPanel();
        btnGuardar = new JButton("Guardar", gif.SAVE16);
        pnlOpciones.add(btnGuardar);
        return pnlOpciones;
    }

    private void importarExcel() throws Exception {
        jChooser.showOpenDialog(null);
        File file = jChooser.getSelectedFile();
        if (file == null) {
            return;
        }
        if (!file.getName().endsWith("xls")) {
            JOptionPane.showMessageDialog(null, "Please select only Excel file.", "Error", JOptionPane.ERROR_MESSAGE);
            return;
        }
        String tipo = LoadComboItem.getIdCombo(cboTipo);
        if (tipo.equals(TipoImpCajaEnum.ANTICIPO_PROVEEDOR.getValue())) {
            fillDataAnticipoProv(file);
            llenarDataAsientoOP(modeltableOP);
        } else if (tipo.equals(TipoImpCajaEnum.TRANSFERENCIA.getValue())) {
            fillDataTransBanc(file);
            llenarDataAsientoTransBanc(modeltableTransBanc);
        } else {
            fillDataIngresoEgreso(file);
            llenarDataAsientoIngresoEgreso(modeltableCaja);
        }
    }

    private void llenarDataAsientoOP(AbstractTableModel modelTable) throws Exception {
        if (modelTable.getRowCount() == 0) {
            return;
        }
        Map<String, BeanAnexo> mapAnexo = new HashMap();
        Map<String, BeanEmpresaCuenta> mapEmpresaCuenta = new HashMap();
        Map<String, BeanTipoOperacion> mapOperacion = new HashMap();
        Map<String, BeanMoneda> mapMoneda = ValidateData.getMapMoneda(path);
        Map<String, BeanMedioPago> mapMedioPago = ValidateData.getMapMedioPago(path);
        for (int i = 0; i < modelTable.getRowCount(); i++) {
            BeanImpOP beanImpOP = ((ImpAnticipoProvTableModel) modelTable).getBeanImpOP(i);
            BeanImportar beanImportar = beanImpOP.getBeanImportar();
            if (!beanImportar.isSelected()) {
                continue;
            }
            if (!ValidateData.validateAnexoAsiento(beanImportar, mapAnexo, path)) {
                continue;
            }
            if (!ValidateData.validateMonedaAsiento(beanImportar, mapMoneda)) {
                continue;
            }
            BeanMedioPago beanMedioPago = ValidateData.validateMedioPagoAsiento(beanImportar, beanImpOP.getIdMedioPago(), mapMedioPago);
            if (beanMedioPago == null) {
                continue;
            }
            beanImpOP.setMedioPago(beanMedioPago.getDescripcion());
            BeanEmpresaCuenta beanEmpresaCuenta = ValidateData.validateEmpresaCuentaAsiento(beanImportar,
                    beanImpOP.getIdCuentaCaja(), mapEmpresaCuenta, path);
            if (beanEmpresaCuenta == null) {
                continue;
            }
            beanImpOP.setBeanEmpresaCuenta(beanEmpresaCuenta);
            BeanTipoOperacion beanOperacion = ValidateData.validateOperacionAsiento(beanImpOP,
                    beanImpOP.getBeanEmpresaCuenta().getBeanBanco().getBeanClasificacionBanco().getBeanOrigenOperacion().getIdOrigenOperacion(), mapOperacion, path);
            if (beanOperacion == null) {
                continue;
            }
            beanImpOP.setBeanTipoOperacion(beanOperacion);
            ValidateData.validateTipoCambioAsiento(beanImportar);
        }
        modelTable.fireTableDataChanged();
        CTableFx.setAllColumnPreferredWidth(table);
    }

    private void llenarDataAsientoTransBanc(AbstractTableModel modelTable) throws Exception {
        if (modelTable.getRowCount() == 0) {
            return;
        }
        Map<String, BeanAnexo> mapAnexo = new HashMap();
        Map<String, BeanEmpresaCuenta> mapEmpresaCuenta = new HashMap();
        Map<String, BeanTipoOperacion> mapOperacion = new HashMap();
        Map<String, BeanMoneda> mapMoneda = ValidateData.getMapMoneda(path);
        Map<String, BeanMedioPago> mapMedioPago = ValidateData.getMapMedioPago(path);
        for (int i = 0; i < modelTable.getRowCount(); i++) {
            BeanImpTransBanc beanTransBanc = ((ImpTransfBancTableModel) modelTable).getBeanImpTransBanc(i);
            BeanImportar beanImportar = beanTransBanc.getBeanImportar();
            if (!beanImportar.isSelected()) {
                continue;
            }
            if (!ValidateData.validateAnexoAsiento(beanImportar, mapAnexo, path)) {
                continue;
            }
            if (!ValidateData.validateMonedaAsiento(beanImportar, mapMoneda)) {
                continue;
            }
            BeanMedioPago beanMedioPago = ValidateData.validateMedioPagoAsiento(beanImportar, beanTransBanc.getIdMedioPago(), mapMedioPago);
            if (beanMedioPago == null) {
                continue;
            }
            beanTransBanc.setMedioPago(beanMedioPago.getDescripcion());
            BeanEmpresaCuenta beanCuentaCargo = ValidateData.validateEmpresaCuentaAsiento(beanImportar,
                    beanTransBanc.getIdCuentaCargo(), mapEmpresaCuenta, path);
            if (beanCuentaCargo == null) {
                continue;
            }
            beanTransBanc.setBeanCuentaCargo(beanCuentaCargo);
            BeanEmpresaCuenta beanCuentaAbono = ValidateData.validateEmpresaCuentaAsiento(beanImportar,
                    beanTransBanc.getIdCuentaAbono(), mapEmpresaCuenta, path);
            if (beanCuentaAbono == null) {
                continue;
            }
            beanTransBanc.setBeanCuentaAbono(beanCuentaAbono);
            BeanTipoOperacion beanOperacion = ValidateData.validateOperacionAsiento(beanTransBanc,
                    beanTransBanc.getBeanCuentaCargo().getBeanBanco().getBeanClasificacionBanco().getBeanOrigenOperacion().getIdOrigenOperacion(), mapOperacion, path);
            if (beanOperacion == null) {
                continue;
            }
            beanTransBanc.setBeanTipoOperacion(beanOperacion);
            ValidateData.validateTipoCambioAsiento(beanImportar);
        }
        modelTable.fireTableDataChanged();
        CTableFx.setAllColumnPreferredWidth(table);
    }

    private void llenarDataAsientoIngresoEgreso(AbstractTableModel modelTable) throws Exception {
        if (modelTable.getRowCount() == 0) {
            return;
        }
        Map<String, BeanAnexo> mapAnexo = new HashMap();
        Map<String, BeanEmpresaCuenta> mapEmpresaCuenta = new HashMap();
        Map<String, BeanMoneda> mapMoneda = ValidateData.getMapMoneda(path);
        Map<String, BeanMedioPago> mapMedioPago = ValidateData.getMapMedioPago(path);
        for (int i = 0; i < modelTable.getRowCount(); i++) {
            BeanImpCaja beanCaja = ((ImpCajaTableModel) modelTable).getBeanImpCaja(i);
            BeanImportar beanImportar = beanCaja.getBeanImportar();
            if (!beanImportar.isSelected()) {
                continue;
            }
            if (!ValidateData.validateAnexoAsiento(beanImportar, mapAnexo, path)) {
                continue;
            }
            if (!ValidateData.validateMonedaAsiento(beanImportar, mapMoneda)) {
                continue;
            }
            BeanMedioPago beanMedioPago = ValidateData.validateMedioPagoAsiento(beanImportar, beanCaja.getIdMedioPago(), mapMedioPago);
            if (beanMedioPago == null) {
                continue;
            }
            beanCaja.setMedioPago(beanMedioPago.getDescripcion());
            BeanEmpresaCuenta beanCuentaCargo = ValidateData.validateEmpresaCuentaAsiento(beanImportar,
                    beanCaja.getIdCuentaCaja(), mapEmpresaCuenta, path);
            if (beanCuentaCargo == null) {
                continue;
            }
            beanCaja.setBeanEmpresaCuenta(beanCuentaCargo);
            ValidateData.validateTipoCambioAsiento(beanImportar);
        }
        modelTable.fireTableDataChanged();
        CTableFx.setAllColumnPreferredWidth(table);
    }

    private void fillDataAnticipoProv(File file) throws ParseException, Exception {
        int j = -1;
        int x = -1;
        try {
            Sheet sheet = UtilExcel.getSheet(file, modeltableOP, logger);
            if (sheet == null) {
                JOptionPane.showMessageDialog(this, "Numero de Columnas: " + modeltableOP.getNumColExcel());
                return;
            }
            for (j = 1; j < sheet.getRows(); j++) {
                logger.info("j: " + j);
                BeanImpOP beanOP = new BeanImpOP();
                x = 0;
                beanOP.setIndex(j);
                beanOP.setSelected(true);
                beanOP.setFechaEmision(UtilExcel.getDateFromCell(sheet, x++, j));
                beanOP.setIdTipoAnexo(TipoAnexoEnum.PROVEEDOR.getValue());
                beanOP.setNumeroDocAnexo(sheet.getCell(x++, j).getContents().trim());
                beanOP.setIdMoneda(sheet.getCell(x++, j).getContents().trim());
                beanOP.setIdCuentaCaja(sheet.getCell(x++, j).getContents().trim());
                beanOP.setIdTipoDoc(sheet.getCell(x++, j).getContents().trim());
                beanOP.setSerie(sheet.getCell(x++, j).getContents().trim());
                beanOP.setPreimpreso(sheet.getCell(x++, j).getContents().trim());
                beanOP.setTipoCambio(UtilExcel.getNumberFromCell(sheet, x++, j));
                beanOP.setMonto(UtilExcel.getNumberFromCell(sheet, x++, j));
                beanOP.setIdMedioPago(sheet.getCell(x++, j).getContents().trim());
                beanOP.setGlosa(sheet.getCell(x++, j).getContents().trim());
                modeltableOP.setBeanImpOP(beanOP);
            }
            modeltableOP.fireTableDataChanged();
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

    private void fillDataTransBanc(File file) throws ParseException, Exception {
        int j = -1;
        int x = -1;
        try {
            Sheet sheet = UtilExcel.getSheet(file, modeltableTransBanc, logger);
            if (sheet == null) {
                JOptionPane.showMessageDialog(this, "Numero de Columnas: " + modeltableTransBanc.getNumColExcel());
                return;
            }
            for (j = 1; j < sheet.getRows(); j++) {
                logger.info("j: " + j);
                BeanImpTransBanc beanTrans = new BeanImpTransBanc();
                x = 0;
                beanTrans.setIndex(j);
                beanTrans.setSelected(true);
                beanTrans.setFechaEmision(UtilExcel.getDateFromCell(sheet, x++, j));
                beanTrans.setIdTipoAnexo(sheet.getCell(x++, j).getContents().trim());
                beanTrans.setNumeroDocAnexo(sheet.getCell(x++, j).getContents().trim());
                beanTrans.setIdMoneda(sheet.getCell(x++, j).getContents().trim());
                beanTrans.setIdCuentaCargo(sheet.getCell(x++, j).getContents().trim());
                beanTrans.setIdTipoDoc(sheet.getCell(x++, j).getContents().trim());
                beanTrans.setSerie(sheet.getCell(x++, j).getContents().trim());
                beanTrans.setPreimpreso(sheet.getCell(x++, j).getContents().trim());
                beanTrans.setIdCuentaAbono(sheet.getCell(x++, j).getContents().trim());
                beanTrans.setIdTipoDocAbono(sheet.getCell(x++, j).getContents().trim());
                beanTrans.setSerieAbono(sheet.getCell(x++, j).getContents().trim());
                beanTrans.setPreimpresoAbono(sheet.getCell(x++, j).getContents().trim());
                beanTrans.setTipoCambio(UtilExcel.getNumberFromCell(sheet, x++, j));
                beanTrans.setMonto(UtilExcel.getNumberFromCell(sheet, x++, j));
                beanTrans.setIdMedioPago(sheet.getCell(x++, j).getContents().trim());
                beanTrans.setGlosa(sheet.getCell(x++, j).getContents().trim());
                modeltableTransBanc.setBeanImpTransBanc(beanTrans);
            }
            modeltableOP.fireTableDataChanged();
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

    private void fillDataIngresoEgreso(File file) throws ParseException, Exception {
        int j = -1;
        int x = -1;
        try {
            Sheet sheet = UtilExcel.getSheet(file, modeltableCaja, logger);
            if (sheet == null) {
                JOptionPane.showMessageDialog(this, "Numero de Columnas: " + modeltableCaja.getNumColExcel());
                return;
            }
            for (j = 1; j < sheet.getRows(); j++) {
                logger.info("j: " + j);
                BeanImpCaja beanCaja = new BeanImpCaja();
                x = 0;
                beanCaja.setIndex(j);
                beanCaja.setSelected(true);
                beanCaja.setFechaEmision(UtilExcel.getDateFromCell(sheet, x++, j));
                beanCaja.setIdTipoAnexo(sheet.getCell(x++, j).getContents().trim());
                beanCaja.setNumeroDocAnexo(sheet.getCell(x++, j).getContents().trim());
                beanCaja.setIdMoneda(sheet.getCell(x++, j).getContents().trim());
                beanCaja.setIdCuenta(sheet.getCell(x++, j).getContents().trim());
                beanCaja.setIdTipoDoc(sheet.getCell(x++, j).getContents().trim());
                beanCaja.setSerie(sheet.getCell(x++, j).getContents().trim());
                beanCaja.setPreimpreso(sheet.getCell(x++, j).getContents().trim());
                beanCaja.setIdCuentaCaja(sheet.getCell(x++, j).getContents().trim());
                beanCaja.setIdTipoDocCaja(sheet.getCell(x++, j).getContents().trim());
                beanCaja.setSerieCaja(sheet.getCell(x++, j).getContents().trim());
                beanCaja.setPreimpresoCaja(sheet.getCell(x++, j).getContents().trim());
                beanCaja.setTipoCambio(UtilExcel.getNumberFromCell(sheet, x++, j));
                beanCaja.setMonto(UtilExcel.getNumberFromCell(sheet, x++, j));
                beanCaja.setIdMedioPago(sheet.getCell(x++, j).getContents().trim());
                beanCaja.setGlosa(sheet.getCell(x++, j).getContents().trim());
                modeltableCaja.setBeanImpCaja(beanCaja);
            }
            modeltableCaja.fireTableDataChanged();
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

    private boolean verificarDatosCaja(List<BeanImportar> lstImportar) throws Exception {
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
            setMes.add(UtilDate.getMes(beanImportar.getFechaEmision()));
        }
        if (setMes.size() > 1) {
            JOptionPane.showMessageDialog(this, "Los Documentos no se encuentran en el mismo mes");
            return false;
        }
        String idAuxiliar = AuxiliarEnum.CAJA.getValue();
        RnRegconta logic = new RnRegconta(path);
        BeanImportar beanImportar = lstImportar.get(0);
        String idPeriodoMensual = UtilDate.getIdPeriodoMensual(beanImportar.getFechaEmision());
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

    private void guardarAnticipoProveedor() throws Exception {
        UsuarioCorrelativo uc = (UsuarioCorrelativo) LoadComboItem.getObjectCombo(cboSerie);
        if (uc == null) {
            JOptionPane.showMessageDialog(this, "Seleccione Serie");
            return;
        }
        if (!verificarDatosCaja(modeltableOP.getListBeanImportar())) {
            return;
        }
        RnRegconta logic = new RnRegconta(path);
        List<BeanRptaRcc> listRpta = logic.insertAnticipoProvGroup(modeltableOP.getListImpOP(), uc, usuario);
        String vouchers = "";
        for (BeanRptaRcc beanRptaRcc : listRpta) {
            if (listRpta.indexOf(beanRptaRcc) % 5 == 0) {
                vouchers += "\n";
            }
            vouchers += beanRptaRcc.getVoucher();
        }
        JOptionPane.showMessageDialog(this, "REGISTRADO CORRECTAMENTE, \nVouchers: " + vouchers);
        modeltableOP.clearTable();
        CTableFx.setAllColumnPreferredWidth(table);
    }

    private void guardarCajaAsiento(String tipo) throws Exception {
        UsuarioCorrelativo uc = (UsuarioCorrelativo) LoadComboItem.getObjectCombo(cboSerie);
        if (uc == null) {
            JOptionPane.showMessageDialog(this, "Seleccione Serie");
            return;
        }
        if (!verificarDatosCaja(modeltableCaja.getListBeanImportar())) {
            return;
        }
        RnRegconta logic = new RnRegconta(path);
        List<BeanRptaRcc> listRpta = logic.insertCajaAsientoGroup(modeltableCaja.getListImpCaja(), usuario, tipo, uc.getSerie());
        String vouchers = "";
        for (BeanRptaRcc beanRptaRcc : listRpta) {
            if (listRpta.indexOf(beanRptaRcc) % 5 == 0) {
                vouchers += "\n";
            }
            vouchers += beanRptaRcc.getVoucher();
        }
        JOptionPane.showMessageDialog(this, "REGISTRADO CORRECTAMENTE, \nVouchers: " + vouchers);
        modeltableCaja.clearTable();
        CTableFx.setAllColumnPreferredWidth(table);
    }

    private void guardarTransBanc() throws Exception {
        if (!verificarDatosCaja(modeltableTransBanc.getListBeanImportar())) {
            return;
        }
        RnRegconta logic = new RnRegconta(path);
        List<BeanRptaRcc> listRpta = logic.insertTransBancariaGroup(modeltableTransBanc.getListImpTransBanc(), usuario);
        String vouchers = "";
        for (BeanRptaRcc beanRptaRcc : listRpta) {
            if (listRpta.indexOf(beanRptaRcc) % 5 == 0) {
                vouchers += "\n";
            }
            vouchers += beanRptaRcc.getVoucher();
        }
        JOptionPane.showMessageDialog(this, "REGISTRADO CORRECTAMENTE, \nVouchers: " + vouchers);
        modeltableTransBanc.clearTable();
        CTableFx.setAllColumnPreferredWidth(table);
    }

    private void changeTipo() throws Exception {
        String tipo = LoadComboItem.getIdCombo(cboTipo);
        if (tipo.equals(tipoGral)) {
            return;
        }
        tipoGral = tipo;
        if (tipo.equals(TipoImpCajaEnum.ANTICIPO_PROVEEDOR.getValue())) {
            txtTipoDoc.setText(TipoDocVentaEnum.ORDEN_PAGO.getValue());
            FxTipoDocVenta.buscarTipoDocVenta(txtTipoDoc, txtTipoDocDesc, false, frmMain, path, this);
            loadSerieCorrelativo(TipoDocVentaEnum.ORDEN_PAGO.getValue());
            table.setModel(modeltableOP);
            modeltableOP.clearTable();
            modeltableOP.fireTableDataChanged();
            CTableFx.setAllColumnPreferredWidth(table);
            pnlData.setVisible(true);
        } else if (tipo.equals(TipoImpCajaEnum.TRANSFERENCIA.getValue())) {
            table.setModel(modeltableTransBanc);
            modeltableTransBanc.clearTable();
            modeltableTransBanc.fireTableDataChanged();
            CTableFx.setAllColumnPreferredWidth(table);
            pnlData.setVisible(false);
        } else {
            txtTipoDoc.setText(TipoDocVentaEnum.BOUCHER_CONTABLE.getValue());
            FxTipoDocVenta.buscarTipoDocVenta(txtTipoDoc, txtTipoDocDesc, false, frmMain, path, this);
            loadSerieCorrelativo(TipoDocVentaEnum.BOUCHER_CONTABLE.getValue());
            table.setModel(modeltableCaja);
            modeltableCaja.clearTable();
            modeltableCaja.fireTableDataChanged();
            CTableFx.setAllColumnPreferredWidth(table);
            pnlData.setVisible(true);
        }
    }

    @Override
    public void actionPerformed(ActionEvent e) {
        try {
            if (e.getSource().equals(btnImportar)) {
                this.importarExcel();
            }
            if (e.getSource().equals(btnGuardar)) {
                this.guardarDocumentos();
            }
        } catch (Exception ex) {
            ExceptionHandler.handleException(ex, logger);
            JOptionPane.showMessageDialog(this, ex.getMessage());
        }
    }

    private void guardarDocumentos() throws Exception {
        String tipo = LoadComboItem.getIdCombo(cboTipo);
        if (tipo.equals(TipoImpCajaEnum.ANTICIPO_PROVEEDOR.getValue())) {
            this.guardarAnticipoProveedor();
        } else if (tipo.equals(TipoImpCajaEnum.TRANSFERENCIA.getValue())) {
            this.guardarTransBanc();
        } else {
            this.guardarCajaAsiento(tipo);
        }
    }

    @Override
    public void itemStateChanged(ItemEvent e) {
        try {
            if (e.getSource().equals(cboTipo)) {
                logger.info("itemStateChanged cboTipo");
                this.changeTipo();
            }
        } catch (Exception ex) {
            ExceptionHandler.handleException(ex, logger);
            JOptionPane.showMessageDialog(this, ex.getMessage());
        }
    }

}
