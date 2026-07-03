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

    protected final URL path;
    protected Gif gif;
    protected JComboBox cboTipo;
    protected JButton btnImportar;
    static JFileChooser jChooser;
    protected JTable table;
    protected ImpAnticipoProvTableModel modeltableOP;
    protected ImpTransfBancTableModel modeltableTransBanc;
    protected ImpCajaTableModel modeltableCaja;
    protected JButton btnGuardar;
    protected final Main frmMain;
    protected final Usuario usuario;
    protected JPanel pnlData;
    protected CardLayout cardLayout;
    protected JComboBox cboSerie;
    protected JTextField txtTipoDoc;
    protected JTextField txtTipoDocDesc;
    protected final Logger logger = Logger.getLogger(UiFormCajaImportar.class);
    protected String tipoGral = "";

    public UiFormCajaImportar(Main frame, Usuario usuario, URL ruta) {
        super(frame, true);
        this.frmMain = frame;
        this.usuario = usuario;
        this.path = ruta;
        inicialize();
    }

    protected void inicialize() {
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

    protected void initListener() {
        btnImportar.addActionListener(this);
        btnGuardar.addActionListener(this);
        cboTipo.addItemListener(this);
    }

    protected void loadCombo() {
    }

    protected void loadComboTipo() {
    }

    protected void loadSerieCorrelativo(String idTipoDoc) throws Exception {
    }

    protected JPanel getPnlNorth() {
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

    protected JPanel getPnlDataOP() {
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

    protected JPanel getPnlTable() {
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

    protected JPanel getPnlOpciones() {
        JPanel pnlOpciones = new JPanel();
        btnGuardar = new JButton("Guardar", gif.SAVE16);
        pnlOpciones.add(btnGuardar);
        return pnlOpciones;
    }

    protected void importarExcel() throws Exception {
    }

    protected void llenarDataAsientoOP(AbstractTableModel modelTable) throws Exception {
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

    protected void llenarDataAsientoTransBanc(AbstractTableModel modelTable) throws Exception {
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

    protected void llenarDataAsientoIngresoEgreso(AbstractTableModel modelTable) throws Exception {
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

    protected void fillDataAnticipoProv(File file) throws ParseException, Exception {
    }

    protected void fillDataTransBanc(File file) throws ParseException, Exception {
    }

    protected void fillDataIngresoEgreso(File file) throws ParseException, Exception {
    }

    protected boolean verificarDatosCaja(List<BeanImportar> lstImportar) throws Exception {
        return false;
    }

    protected void guardarAnticipoProveedor() throws Exception {
    }

    protected void guardarCajaAsiento(String tipo) throws Exception {
    }

    protected void guardarTransBanc() throws Exception {
    }

    protected void changeTipo() throws Exception {
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

    protected void guardarDocumentos() throws Exception {
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
