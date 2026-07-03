package com.softcommerce.gui;

import com.softcommerce.beans.BeanConversion;
import com.softcommerce.beans.BeanItem;
import com.softcommerce.beans.ItemConversion;
import com.softcommerce.beans.ItemItem;
import com.softcommerce.beans.Usuario;
import com.softcommerce.beans.UsuarioCorrelativo;
import com.softcommerce.compras.formularios.FormBuscarItem;
import com.softcommerce.enums.TipoDocVentaEnum;
import com.softcommerce.enums.TipoMovInventarioEnum;
import com.softcommerce.formularios.Main;
import com.softcommerce.formularios.RegisterIngreso;
import com.softcommerce.general.controles.DoubleDocument;
import com.softcommerce.general.controles.ObjectItem;
import com.softcommerce.general.herramientas.CTableFx;
import com.softcommerce.general.tablas.ItemConversionTableModel;
import com.softcommerce.iconos.Gif;
import com.softcommerce.logic.LogicStock;
import com.softcommerce.reglasnegocio.RnAlmacen;
import com.softcommerce.reglasnegocio.RnConversion;
import com.softcommerce.reglasnegocio.RnCorrelativo;
import com.softcommerce.reglasnegocio.RnItem;
import com.softcommerce.reglasnegocio.RnStock;
import com.softcommerce.util.Constans;
import com.softcommerce.util.ExceptionHandler;
import com.softcommerce.util.LayoutUtil;
import com.softcommerce.util.Util;
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
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.ItemEvent;
import java.awt.event.ItemListener;
import java.math.BigDecimal;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;
import javax.swing.BorderFactory;
import javax.swing.JButton;
import javax.swing.JComboBox;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import javax.swing.JScrollPane;
import javax.swing.JTable;
import javax.swing.JTextField;
import javax.swing.ListSelectionModel;
import javax.swing.border.Border;
import javax.swing.border.TitledBorder;
import javax.swing.event.TableModelEvent;
import javax.swing.event.TableModelListener;
import javax.swing.table.JTableHeader;
import javax.swing.table.TableColumn;
import javax.swing.table.TableColumnModel;
import org.apache.log4j.Logger;

public class FormConversionVarios
        extends JPanel
        implements ActionListener, ItemListener, TableModelListener {

    private final Logger logger = Logger.getLogger(FormConversionVarios.class);
    private final URL path;
    private Gif gif;
    private JComboBox cboAlmacen;
    private JComboBox cboSerieNi;
    private JComboBox cboSerieNs;
    private JDateChooser dcFechaEmision;
    private JTextField txtPreimpresoNi;
    private JTextField txtPreimpresoNs;
    private JTextField txtItem;
    private JTextField txtItemDesc;
    private JTextField txtStock;
    private JTextField txtUm;
    private JTextField txtCantidad;
    private JButton btnConvertir;
    private JButton btnBuscarItem;
    private JTable table;
    private ItemConversionTableModel modeltable;
    private final Main frmMain;
    private final Usuario usuario;
    private final RegisterIngreso registerIngreso;
    private boolean isChangeHeader = false;

    public FormConversionVarios(URL path, Main frm, Usuario usuario, RegisterIngreso registerIngreso) {
        super();
        this.path = path;
        this.frmMain = frm;
        this.usuario = usuario;
        this.registerIngreso = registerIngreso;
        inicialize();
    }

    private void inicialize() {
        gif = new Gif();
        JPanel pnl = new JPanel();
        pnl.setLayout(new BorderLayout());
        pnl.add(this.getPnlNorth(), BorderLayout.NORTH);
        pnl.add(this.getPnlCenter(), BorderLayout.CENTER);
        pnl.add(this.getPnlSouth(), BorderLayout.SOUTH);
        this.add(pnl);
        setMinimumSize(new Dimension(600, 250));
        initListener();
    }

    private JPanel getPnlNorth() {
        JPanel pnlPrinc = new JPanel();
        pnlPrinc.setLayout(new BorderLayout());
        Border border = BorderFactory.createTitledBorder(null, "", TitledBorder.LEFT, TitledBorder.DEFAULT_POSITION, new Font("Comic Sans MS", 0, 12), Color.BLACK);
        pnlPrinc.setBorder(border);
        JPanel pnl = new JPanel();
        pnl.setLayout(new GridBagLayout());
        pnlPrinc.add(pnl, BorderLayout.WEST);
        GridBagConstraints gbc = LayoutUtil.getGbc();
        JLabel lblAlmacen = new JLabel("Almacen");
        pnl.add(lblAlmacen, gbc);
        gbc.gridx = 1;
        gbc.gridwidth = 2;
        cboAlmacen = new JComboBox();
        pnl.add(cboAlmacen, gbc);
        gbc.gridwidth = 1;
        gbc.gridx = 3;
        JLabel lblFecha = new JLabel("Fecha de Ingreso");
        pnl.add(lblFecha, gbc);
        gbc.gridx = 4;
        gbc.gridwidth = 2;
        dcFechaEmision = new JDateChooser("dd/MM/yyyy", "##/##/####", '_');
        pnl.add(dcFechaEmision, gbc);
        gbc.gridwidth = 1;

        gbc.gridy = 1;
        gbc.gridx = 0;
        JLabel lblIngreso = new JLabel("Doc Ingreso");
        pnl.add(lblIngreso, gbc);

        gbc.gridx = 1;
        cboSerieNi = new JComboBox();
        gbc.insets = new Insets(2, 1, 2, 0);
        pnl.add(cboSerieNi, gbc);

        gbc.gridx = 2;
        gbc.insets = new Insets(2, 0, 2, 0);
        txtPreimpresoNi = new JTextField();
        txtPreimpresoNi.setColumns(10);
        pnl.add(txtPreimpresoNi, gbc);
        txtPreimpresoNi.setEnabled(false);
        gbc.insets = new Insets(2, 2, 2, 2);

        gbc.gridx = 3;
        JLabel lblSalida = new JLabel("Doc Salida");
        pnl.add(lblSalida, gbc);

        gbc.gridx = 4;
        cboSerieNs = new JComboBox();
        gbc.insets = new Insets(2, 1, 2, 0);
        pnl.add(cboSerieNs, gbc);

        gbc.gridx = 5;
        gbc.insets = new Insets(2, 0, 2, 0);
        txtPreimpresoNs = new JTextField();
        txtPreimpresoNs.setColumns(10);
        txtPreimpresoNs.setEnabled(false);
        pnl.add(txtPreimpresoNs, gbc);
        gbc.insets = new Insets(2, 2, 2, 2);
        return pnlPrinc;
    }

    private JPanel getPnlCenter() {
        JPanel pnlPrinc = new JPanel();
        pnlPrinc.setLayout(new BorderLayout());
        pnlPrinc.add(this.getPnlItemOrigen(), BorderLayout.NORTH);

        table = new JTable();
        table.setFont(new Font("Tahoma", Font.PLAIN, 11));
        modeltable = new ItemConversionTableModel();
        table.setModel(modeltable);
        table.setAutoResizeMode(JTable.AUTO_RESIZE_OFF);
        table.setSelectionMode(ListSelectionModel.SINGLE_SELECTION);
        table.getTableHeader().setFont(new Font("Tahoma", Font.BOLD, 10));
        JScrollPane scroll = new JScrollPane(table);
        scroll.setPreferredSize(new Dimension(1000, 240));
        pnlPrinc.add(scroll, BorderLayout.CENTER);
        return pnlPrinc;
    }

    private JPanel getPnlItemOrigen() {
        JPanel pnlPrinc = new JPanel();
        pnlPrinc.setLayout(new BorderLayout());
        Border border = BorderFactory.createTitledBorder(null, "Item Origen",
                TitledBorder.LEFT, TitledBorder.DEFAULT_POSITION, new Font("Comic Sans MS", 0, 12), Color.BLACK);
        pnlPrinc.setBorder(border);
        JPanel pnl = new JPanel();
        pnl.setLayout(new GridBagLayout());
        pnlPrinc.add(pnl, BorderLayout.WEST);
        GridBagConstraints gbc = LayoutUtil.getGbc();
        JLabel lblItem = new JLabel("Item");
        pnl.add(lblItem, gbc);

        gbc.gridx = 1;
        txtItem = new JTextField();
        txtItem.setColumns(6);
        txtItem.setEnabled(false);
        gbc.insets = new Insets(2, 1, 2, 0);
        pnl.add(txtItem, gbc);

        gbc.gridx = 2;
        gbc.insets = new Insets(2, 0, 2, 0);
        txtItemDesc = new JTextField();
        txtItemDesc.setColumns(30);
        txtItemDesc.setEnabled(false);
        gbc.gridwidth = 2;
        pnl.add(txtItemDesc, gbc);
        gbc.gridwidth = 1;
        gbc.insets = new Insets(2, 2, 2, 2);
        gbc.gridx = 4;
        btnBuscarItem = new JButton(gif.SEARCH16);
        pnl.add(btnBuscarItem, gbc);

        gbc.gridx = 0;
        gbc.gridy = 1;
        JLabel lblUm = new JLabel("UM");
        pnl.add(lblUm, gbc);
        gbc.gridx = 1;
        txtUm = new JTextField();
        txtUm.setEnabled(false);
        gbc.gridwidth = 2;
        gbc.fill = GridBagConstraints.HORIZONTAL;
        pnl.add(txtUm, gbc);
        gbc.gridwidth = 1;
        gbc.fill = GridBagConstraints.NONE;

        gbc.gridx = 0;
        gbc.gridy = 2;
        JLabel lblStock = new JLabel("Stock");
        pnl.add(lblStock, gbc);

        gbc.gridx = 1;
        txtStock = new JTextField();
        txtStock.setColumns(6);
        txtStock.setEnabled(false);
        pnl.add(txtStock, gbc);

        gbc.gridx = 2;
        JLabel lblCantidad = new JLabel("Cantidad");
        pnl.add(lblCantidad, gbc);

        gbc.gridx = 3;
        txtCantidad = new JTextField();
        txtCantidad.setColumns(6);
        txtCantidad.setDocument(new DoubleDocument());
        pnl.add(txtCantidad, gbc);
        return pnlPrinc;
    }

    private JPanel getPnlSouth() {
        JPanel pnlPrinc = new JPanel();
        btnConvertir = new JButton("Convertir", gif.SAVE16);
        pnlPrinc.add(btnConvertir, BorderLayout.SOUTH);
        return pnlPrinc;
    }

    private void initListener() {
        btnConvertir.addActionListener(this);
        btnBuscarItem.addActionListener(this);
        cboSerieNi.addItemListener(this);
        cboSerieNs.addItemListener(this);
        cboAlmacen.addItemListener(this);
        modeltable.addTableModelListener(this);
    }

    public void loadDatos() {
        try {
            dcFechaEmision.setDate(this.frmMain.getFechaFin());
            LoadCombo.loadAlmacen(usuario.getCodpuntoventa(), cboAlmacen, path, usuario);
            this.loadSerie(cboSerieNi, TipoDocVentaEnum.NOTA_INGRESO.getValue());
            this.loadSerie(cboSerieNs, TipoDocVentaEnum.ORDEN_RECOJO.getValue());
        } catch (Exception e) {
            ExceptionHandler.handleException(e, logger);
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }

    private String getPreimpresoSerie(JComboBox cboSerie) {
        Object userCorr = LoadComboItem.getObjectCombo(cboSerie);
        if (userCorr == null) {
            return "";
        }
        UsuarioCorrelativo uc = (UsuarioCorrelativo) userCorr;
        return Util.getPreimpresoCorrelativo(uc.getPreimpreso());
    }

    private void loadSerie(JComboBox cboSerie, String idTipoDoc) throws Exception {
        RnCorrelativo logic = new RnCorrelativo(this.path);
        List<UsuarioCorrelativo> list = logic.listarCorrelativo(usuario.getId_usuario(), usuario.getCodpuntoventa(), idTipoDoc);
        for (UsuarioCorrelativo uc : list) {
            cboSerie.addItem(new ObjectItem(uc.getSerie(), uc));
        }
    }

    private boolean isRegisterValid() {
        if (Util.isBlank(txtItem.getText().trim())) {
            JOptionPane.showMessageDialog(this, "Seleccione Item");
            return false;
        }
        String idAlmacen = LoadComboItem.getIdCombo(cboAlmacen);
        if (Util.isBlank(idAlmacen)) {
            JOptionPane.showMessageDialog(this, "Seleccione Almacen");
            return false;
        }
        if (cboSerieNi.getSelectedIndex() < 0) {
            JOptionPane.showMessageDialog(this, "Seleccione serie NI");
            return false;
        }
        if (cboSerieNs.getSelectedIndex() < 0) {
            JOptionPane.showMessageDialog(this, "Seleccione serie NS");
            return false;
        }
        if (Util.isBlank(txtPreimpresoNi.getText().trim())) {
            JOptionPane.showMessageDialog(this, "Preimpreso NI no esta cargado");
            return false;
        }
        if (Util.isBlank(txtPreimpresoNs.getText().trim())) {
            JOptionPane.showMessageDialog(this, "Preimpreso NS no esta cargado");
            return false;
        }
        if (Util.isBlank(txtCantidad.getText().trim())) {
            JOptionPane.showMessageDialog(this, "Ingrese Cantidad Origen");
            return false;
        }
        BigDecimal cantidad = new BigDecimal(txtCantidad.getText().trim());
        BigDecimal stock = new BigDecimal(txtStock.getText().trim());
        if (cantidad.compareTo(stock) == 1) {
            JOptionPane.showMessageDialog(this, "Cantidad Origen mayor que Stock");
            return false;
        }
        if (modeltable.getRowCount() == 0) {
            JOptionPane.showMessageDialog(this, "No Hay Items Destino");
            return false;
        }
        int cont = 0;
        for (int i = 0; i < modeltable.getRowCount(); i++) {
            ItemConversion itemConversion = modeltable.getItemConversion(i);
            if (itemConversion.isSelected()) {
                cont++;
                if (itemConversion.getCantidadDestino().compareTo(BigDecimal.ZERO) != 1) {
                    JOptionPane.showMessageDialog(this, "Ingrese Cantidad Destino Mayor a Cero, Item: " + itemConversion.getItemItem().getBeanItemDestino().getIdAlterno());
                    return false;
                }
            }
        }
        if (cont == 0) {
            JOptionPane.showMessageDialog(this, "Seleccione al menos un producto");
            return false;
        }
        BigDecimal origenTable = modeltable.getTotalOrigen();
        if (cantidad.compareTo(origenTable) != 0) {
            JOptionPane.showMessageDialog(this, "Cantidad Origen no es igual al total de la tabla");
            return false;
        }
        return true;
    }

    private void guardarConversion() throws Exception {
        if (!this.isRegisterValid()) {
            return;
        }
        BeanConversion beanConversion = this.getBeanConversion();
        RnConversion rnConversion = new RnConversion(Main.path);
        rnConversion.insertarConversion(beanConversion, this.getItemDestino());
        LogicStock logicStock = new LogicStock(Main.path);
        logicStock.regularizarStock(Main.anio);
        JOptionPane.showMessageDialog(this, "Registrado Correctamente");
        this.registerIngreso.dispose();
    }

    private BeanConversion getBeanConversion() throws Exception {
        BeanConversion beanConversion = new BeanConversion();
        RnAlmacen rnAlmacen = new RnAlmacen(Main.path);
        beanConversion.setAlmacen(rnAlmacen.cargarAlmacen(LoadComboItem.getIdCombo(cboAlmacen), ""));
        beanConversion.setFecha(dcFechaEmision.getDate());
        beanConversion.setIdTipoDocOrigen(TipoDocVentaEnum.ORDEN_RECOJO.getValue());
        Object userCorrNs = LoadComboItem.getObjectCombo(cboSerieNs);
        UsuarioCorrelativo userCorrelativoOrigen = (UsuarioCorrelativo) userCorrNs;
        beanConversion.setIdCorrelativoOrigen(userCorrelativoOrigen.getIdCorrelativo());
        beanConversion.setSerieOrigen(userCorrelativoOrigen.getSerie());
        beanConversion.setPreimpresoOrigen(txtPreimpresoNs.getText().trim());
        beanConversion.setIdTipoDocDestino(TipoDocVentaEnum.NOTA_INGRESO.getValue());
        Object userCorrNi = LoadComboItem.getObjectCombo(cboSerieNi);
        UsuarioCorrelativo userCorrelativoDestino = (UsuarioCorrelativo) userCorrNi;
        beanConversion.setIdCorrelativoDestino(userCorrelativoDestino.getIdCorrelativo());
        beanConversion.setSerieDestino(userCorrelativoDestino.getSerie());
        beanConversion.setPreimpresoDestino(txtPreimpresoNi.getText().trim());
        beanConversion.setIdTipoMovOrigen(TipoMovInventarioEnum.SALIDA_CONVERSION.getValue());
        beanConversion.setIdTipoMovDestino(TipoMovInventarioEnum.INGRESO_CONVERSION.getValue());
        RnItem rnItem = new RnItem(Main.path);
        beanConversion.setBeanItemOrigen(rnItem.cargarItem(txtItem.getText().trim(), "", false, Constans.ESTADO_ACTIVO));
        //beanConversion.setBeanItemDestino(rnItem.cargarItem(txtItemDestino.getText().trim(), "", false, Constans.ESTADO_ACTIVO));
        beanConversion.setIdUsuario(usuario.getId_usuario());
        beanConversion.setIdPeriodoMensual(Util.getIdPeriodoMensual(beanConversion.getFecha()));
        beanConversion.setCantidadOrigen(Util.getNumberBigDecimal(txtCantidad.getText().trim()));
        //beanConversion.setCantidadDestino(Util.getNumberBigDecimal(txtCantidadDestino.getText().trim()));
        return beanConversion;
    }

    private List<BeanItem> getItemDestino() throws Exception {
        List<BeanItem> result = new ArrayList();
        RnItem rnItem = new RnItem(this.path);
        for (int i = 0; i < modeltable.getRowCount(); i++) {
            ItemConversion itemConversion = modeltable.getItemConversion(i);
            if (itemConversion.isSelected()) {
                BeanItem beanItem = rnItem.cargarItem(itemConversion.getItemItem().getBeanItemDestino().getIdAlterno(), "", false, Constans.ESTADO_ACTIVO);
                beanItem.setValorOrigen(itemConversion.getCantidadDestino());
                beanItem.setValorConversion(itemConversion.getCantidadOrigen());
                result.add(beanItem);
            }
        }
        return result;
    }

    @Override
    public void actionPerformed(ActionEvent e) {
        try {
            if (e.getSource().equals(btnBuscarItem)) {
                FormBuscarItem objBuscarItem = new FormBuscarItem(this.frmMain, this.registerIngreso, path, btnBuscarItem,
                        usuario, true);
                objBuscarItem.setVisible(true);
            }
            if (e.getSource().equals(btnConvertir)) {
                this.guardarConversion();
            }
        } catch (Exception ex) {
            ExceptionHandler.handleException(ex, logger);
            JOptionPane.showMessageDialog(this, ex.getMessage());
        }
    }

    @Override
    public void itemStateChanged(ItemEvent e) {
        if (e.getSource().equals(cboSerieNi)) {
            txtPreimpresoNi.setText(this.getPreimpresoSerie(cboSerieNi));
        }
        if (e.getSource().equals(cboSerieNs)) {
            txtPreimpresoNs.setText(this.getPreimpresoSerie(cboSerieNs));
        }
        if (e.getSource().equals(cboAlmacen)) {
            this.loadStock();
        }
    }

    public JButton getBtnBuscarItem() {
        return btnBuscarItem;
    }

    public void loadItemSearch(BeanItem beanItem) {
        txtItem.setText(beanItem.getIdItem());
        txtItemDesc.setText(beanItem.getDescripcion());
        txtUm.setText(beanItem.getBeanUmStock().getAbreviatura());
        modeltable.setUm(beanItem.getBeanUmStock().getAbreviatura());
        this.loadStock();
        this.loadItemDestino();
    }

    private void changeColumnHeader() {
        if (!isChangeHeader) {
            return;
        }
        this.changeColumnHeader("Total: " + modeltable.getTotalOrigen() + " " + modeltable.getUm());
    }

    private void changeColumnHeader(String value) {
        JTableHeader th = table.getTableHeader();
        TableColumnModel tcm = th.getColumnModel();
        TableColumn tc = tcm.getColumn(9);
        tc.setHeaderValue(value);
        th.repaint();
    }

    private void loadItemDestino() {
        try {
            isChangeHeader = false;
            String idItem = txtItem.getText().trim();
            if (Util.isBlank(idItem)) {
                return;
            }
            RnItem logicItem = new RnItem(path);
            List<ItemItem> lstItemItem = logicItem.cargarItemItem(idItem);
            List<ItemConversion> lstConversion = new ArrayList();
            for (ItemItem itemItem : lstItemItem) {
                if (itemItem.getEstado().equals(Constans.ESTADO_ACTIVO)) {
                    ItemConversion itemConversion = new ItemConversion();
                    itemConversion.setSelected(true);
                    itemConversion.setCantidadDestino(BigDecimal.ZERO);
                    itemConversion.setCantidadOrigen(BigDecimal.ZERO);
                    itemConversion.setItemItem(itemItem);
                    lstConversion.add(itemConversion);
                }
            }
            modeltable.clearTable();
            modeltable.agregarListItem(lstConversion);
            modeltable.fireTableDataChanged();
            this.changeColumnHeader("ORIGEN");
            CTableFx.setAllColumnPreferredWidth(table);
            isChangeHeader = true;
        } catch (Exception e) {
            ExceptionHandler.handleException(e, logger);
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }

    private void loadStock() {
        try {
            String idItem = txtItem.getText().trim();
            if (Util.isBlank(idItem)) {
                txtStock.setText("0");
                return;
            }
            String idAlmacen = LoadComboItem.getIdCombo(cboAlmacen);
            if (Util.isBlank(idAlmacen)) {
                txtStock.setText("0");
                return;
            }
            RnStock rnStock = new RnStock(path);
            BigDecimal stock = rnStock.getStockByItemAlmacen(idItem, idAlmacen);
            txtStock.setText(stock.toString());
        } catch (Exception e) {
            ExceptionHandler.handleException(e, logger);
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }

    @Override
    public void tableChanged(TableModelEvent e) {
        if (e.getSource().equals(modeltable)) {
            this.changeColumnHeader();
        }
    }

}
