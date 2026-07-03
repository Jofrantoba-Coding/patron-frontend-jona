package com.softcommerce.formularios.importar;

import com.softcommerce.beans.Almacen;
import com.softcommerce.beans.BeanColor;
import com.softcommerce.beans.BeanFamilia;
import com.softcommerce.beans.BeanImpItem;
import com.softcommerce.beans.BeanItem;
import com.softcommerce.beans.BeanMarca;
import com.softcommerce.beans.BeanPrecioItem;
import com.softcommerce.beans.BeanSubFamilia;
import com.softcommerce.beans.BeanTamano;
import com.softcommerce.beans.BeanUnidadMedida;
import com.softcommerce.beans.Usuario;
import com.softcommerce.enums.ClaseOperacionEnum;
import com.softcommerce.enums.MonedaEnum;
import com.softcommerce.general.herramientas.CTableFx;
import com.softcommerce.general.tablas.ImpItemTableModel;
import com.softcommerce.logic.LogicParametro;
import com.softcommerce.reglasnegocio.RnColor;
import com.softcommerce.reglasnegocio.RnFamilia;
import com.softcommerce.reglasnegocio.RnAlmacen;
import com.softcommerce.reglasnegocio.RnItem;
import com.softcommerce.reglasnegocio.RnMarca;
import com.softcommerce.reglasnegocio.RnSubFamilia;
import com.softcommerce.reglasnegocio.RnTamano;
import com.softcommerce.reglasnegocio.RnUnidadMedida;
import com.softcommerce.util.Constans;
import com.softcommerce.util.render.CellRendererLabelItem;
import com.softcommerce.util.Util;
import java.awt.BorderLayout;
import java.awt.Dimension;
import java.awt.Font;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.io.File;
import java.io.IOException;
import java.math.BigDecimal;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import javax.swing.JButton;
import javax.swing.JDialog;
import javax.swing.JFileChooser;
import javax.swing.JFrame;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import javax.swing.JScrollPane;
import javax.swing.JTable;
import javax.swing.ListSelectionModel;
import jxl.Cell;
import jxl.Sheet;
import jxl.Workbook;
import jxl.WorkbookSettings;
import jxl.read.biff.BiffException;
import org.jdesktop.swingx.HorizontalLayout;
import java.net.URL;

public class FormItemImportar
        extends JDialog implements ActionListener {

    private final URL path;
    private final Usuario usuario;
    private JButton btnImportar;
    static JFileChooser jChooser;
    private JTable table;
    private ImpItemTableModel modeltable;
    private JScrollPane scrollTable;
    private JButton btnGuardar;

    public FormItemImportar(JFrame frame, Usuario usuario, java.net.URL ruta) {
        super(frame, true);
        this.usuario = usuario;
        this.path = ruta;
        initComponents();
    }

    private void initComponents() {
        //
        modeltable = new ImpItemTableModel();
        table = new JTable();
        table.setFont(new Font("Tahoma", Font.PLAIN, 11));
        table.setRowHeight(19);
        table.setAutoResizeMode(JTable.AUTO_RESIZE_OFF);
        table.setModel(modeltable);
        table.getColumnModel().getColumn(29).setMinWidth(0);
        table.getColumnModel().getColumn(29).setMaxWidth(0);
        scrollTable = new JScrollPane(table);
        table.setSelectionMode(ListSelectionModel.SINGLE_SELECTION);
        table.getTableHeader().setFont(new Font("Tahoma", Font.BOLD, 11));
        CTableFx.setAllColumnPreferredWidth(table);
        scrollTable.setPreferredSize(new Dimension(1200, 450));
        getContentPane().add(scrollTable, BorderLayout.CENTER);
        JPanel pnlOpciones = new JPanel();
        btnGuardar = new JButton("Guardar");
        btnGuardar.addActionListener(this);
        pnlOpciones.add(btnGuardar);
        getContentPane().add(pnlOpciones, BorderLayout.SOUTH);

        //
        JPanel pnlCabecera = new JPanel();
        pnlCabecera.setLayout(new HorizontalLayout(10));
        btnImportar = new JButton("Importar");
        btnImportar.addActionListener(this);
        pnlCabecera.add(btnImportar);
        getContentPane().add(pnlCabecera, BorderLayout.PAGE_START);
        pack();
        jChooser = new JFileChooser();
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
            } else {
                this.fillData(file);
                this.llenarData();
                modeltable.fireTableDataChanged();
                CTableFx.setAllColumnPreferredWidth(table);
            }
        } catch (Exception e) {
            e.printStackTrace();
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }

    private void llenarData() throws Exception {
        try {
            if (modeltable.getRowCount() == 0) {
                return;
            }
            Map<String, Almacen> mapAlmacen = new HashMap();
            RnItem rnItem = new RnItem(this.path);
            List<BeanItem> listItem = rnItem.listItem(Constans.ESTADO_ACTIVO);
            RnFamilia rnFamilia = new RnFamilia(path);
            List<BeanFamilia> listFamilia = rnFamilia.listar("", "", usuario.getCodempresa());
            RnSubFamilia rnSubFamilia = new RnSubFamilia(path);
            BeanSubFamilia beanSubFamilia = new BeanSubFamilia();
            beanSubFamilia.setBeanFamilia(new BeanFamilia());
            List<BeanSubFamilia> listSubFamilia = rnSubFamilia.listar(beanSubFamilia);
            RnMarca rnMarca = new RnMarca(path);
            List<BeanMarca> listMarca = rnMarca.listarGeneral(usuario.getCodempresa());
            RnColor rnColor = new RnColor(path);
            List<BeanColor> listColor = rnColor.listar("", "", usuario.getCodempresa());
            RnTamano rnTamano = new RnTamano(path);
            List<BeanTamano> listTamano = rnTamano.listarGeneral(usuario.getCodempresa());
            RnUnidadMedida rnUnidadMedida = new RnUnidadMedida(path);
            List<BeanUnidadMedida> listUm = rnUnidadMedida.listarGeneral(usuario.getCodempresa());
            for (int i = 0; i < modeltable.getRowCount(); i++) {
                BeanImpItem impItem = modeltable.getItem(i);
                this.validateItemBd(impItem, mapAlmacen, listItem,
                        listFamilia, listSubFamilia, listMarca, listColor,
                        listTamano, listUm);
            }
            this.setColorTable();
        } catch (Exception e) {
            throw e;
        }
    }

    private void validateItemBd(BeanImpItem impItem,
            Map<String, Almacen> mapAlmacen, List<BeanItem> listItem,
            List<BeanFamilia> listFamilia, List<BeanSubFamilia> listSubFamilia,
            List<BeanMarca> listMarca, List<BeanColor> listColor,
            List<BeanTamano> listTamano, List<BeanUnidadMedida> listUm) throws Exception {
        try {
            BeanItem beanItem = this.buscarItem(listItem, impItem.getIdItem());
            if (beanItem == null) {
                this.loadDataAlmacen(impItem, mapAlmacen);
                this.loadDataFamilia(impItem, listFamilia);
                this.loadDataSubFamilia(impItem, listSubFamilia);
                this.loadDataMarca(impItem, listMarca);
                this.loadDataColor(impItem, listColor);
                this.loadDataTamano(impItem, listTamano);
                this.loadDataUm(impItem, listUm);
                return;
            }
            impItem.setExistsBd(true);
            this.loadDataItem(beanItem, impItem);
        } catch (Exception e) {
            throw e;
        }
    }

    private void loadDataFamilia(BeanImpItem impItem, List<BeanFamilia> listFamilia) {
        BeanFamilia beanFamilia = this.buscarFamilia(listFamilia, impItem.getFamilia());
        if (beanFamilia == null) {
            return;
        }
        impItem.setIdFamilia(beanFamilia.getIdFamilia());
    }

    private void loadDataMarca(BeanImpItem impItem, List<BeanMarca> listMarca) {
        BeanMarca beanMarca = this.buscarMarca(listMarca, impItem.getMarca());
        if (beanMarca == null) {
            return;
        }
        impItem.setIdMarca(beanMarca.getIdMarca());
    }

    private void loadDataColor(BeanImpItem impItem, List<BeanColor> listColor) {
        BeanColor beanColor = this.buscarColor(listColor, impItem.getModelo());
        if (beanColor == null) {
            return;
        }
        impItem.setIdModelo(beanColor.getIdColor());
    }

    private void loadDataTamano(BeanImpItem impItem, List<BeanTamano> listTamano) {
        BeanTamano beanTamano = this.buscarTamano(listTamano, impItem.getTamano());
        if (beanTamano == null) {
            return;
        }
        impItem.setIdTamano(beanTamano.getIdTamano());
    }

    private void loadDataUm(BeanImpItem impItem, List<BeanUnidadMedida> listUm) {
        BeanUnidadMedida beanUm = this.buscarUnidadMedida(listUm, impItem.getUnidad());
        if (beanUm == null) {
            return;
        }
        impItem.setIdUnidad(beanUm.getIdUm());
    }

    private void loadDataSubFamilia(BeanImpItem impItem, List<BeanSubFamilia> listSubFamilia) {
        BeanSubFamilia beanSubFamilia = this.buscarSubFamilia(listSubFamilia, impItem);
        if (beanSubFamilia == null) {
            return;
        }
        impItem.setIdSubFamilia(beanSubFamilia.getIdSubFamilia());
    }

    private BeanFamilia buscarFamilia(List<BeanFamilia> listFamilia, String descripcion) {
        for (int i = 0; i < listFamilia.size(); i++) {
            BeanFamilia beanFamilia = listFamilia.get(i);
            if (descripcion.equalsIgnoreCase(beanFamilia.getDescripcion())) {
                return beanFamilia;
            }
        }
        return null;
    }

    private BeanMarca buscarMarca(List<BeanMarca> listMarca, String descripcion) {
        for (int i = 0; i < listMarca.size(); i++) {
            BeanMarca beanMarca = listMarca.get(i);
            if (descripcion.equalsIgnoreCase(beanMarca.getDescripcion())) {
                return beanMarca;
            }
        }
        return null;
    }

    private BeanColor buscarColor(List<BeanColor> listColor, String descripcion) {
        for (int i = 0; i < listColor.size(); i++) {
            BeanColor beanColor = listColor.get(i);
            if (descripcion.equalsIgnoreCase(beanColor.getDescripcion())) {
                return beanColor;
            }
        }
        return null;
    }

    private BeanTamano buscarTamano(List<BeanTamano> listTamano, String descripcion) {
        for (int i = 0; i < listTamano.size(); i++) {
            BeanTamano beanTamano = listTamano.get(i);
            if (descripcion.equalsIgnoreCase(beanTamano.getDescripcion())) {
                return beanTamano;
            }
        }
        return null;
    }

    private BeanUnidadMedida buscarUnidadMedida(List<BeanUnidadMedida> listUm, String descripcion) {
        for (int i = 0; i < listUm.size(); i++) {
            BeanUnidadMedida beanUm = listUm.get(i);
            if (descripcion.equalsIgnoreCase(beanUm.getDescripcion())) {
                return beanUm;
            }
        }
        return null;
    }

    private BeanSubFamilia buscarSubFamilia(List<BeanSubFamilia> listSubFamilia, BeanImpItem impItem) {
        for (int i = 0; i < listSubFamilia.size(); i++) {
            BeanSubFamilia beanSubFamilia = listSubFamilia.get(i);
            if (impItem.getSubFamilia().equalsIgnoreCase(beanSubFamilia.getDescripcion())
                    && impItem.getFamilia().equalsIgnoreCase(beanSubFamilia.getBeanFamilia().getDescripcion())) {
                return beanSubFamilia;
            }
        }
        return null;
    }

    private BeanItem buscarItem(List<BeanItem> listItem, String idItem) {
        for (int i = 0; i < listItem.size(); i++) {
            BeanItem beanItem = listItem.get(i);
            if (idItem.equalsIgnoreCase(beanItem.getIdItem())) {
                return beanItem;
            }
        }
        return null;
    }

    private void loadDataAlmacen(BeanImpItem impItem, Map<String, Almacen> mapAlmacen) {
        impItem.setIdAlmacen01(this.getIdAlmacen(impItem.getAlmacen01(), mapAlmacen));
        impItem.setIdAlmacen02(this.getIdAlmacen(impItem.getAlmacen02(), mapAlmacen));
        impItem.setIdAlmacen03(this.getIdAlmacen(impItem.getAlmacen03(), mapAlmacen));
        impItem.setIdAlmacen04(this.getIdAlmacen(impItem.getAlmacen04(), mapAlmacen));
        impItem.setIdAlmacen05(this.getIdAlmacen(impItem.getAlmacen05(), mapAlmacen));
        impItem.setIdAlmacen06(this.getIdAlmacen(impItem.getAlmacen06(), mapAlmacen));
        impItem.setIdAlmacen07(this.getIdAlmacen(impItem.getAlmacen07(), mapAlmacen));
        impItem.setIdAlmacen08(this.getIdAlmacen(impItem.getAlmacen08(), mapAlmacen));
    }

    private String getIdAlmacen(String almacen, Map<String, Almacen> mapAlmacen) {
        try {
            if (almacen == null || almacen.isEmpty()) {
                return "";
            }
            if (mapAlmacen.containsKey(almacen)) {
                return this.getIdAlmacen(mapAlmacen.get(almacen));
            }
            RnAlmacen logicAlmacen = new RnAlmacen(this.path);
            Almacen alm = logicAlmacen.cargarAlmacen("", almacen);
            mapAlmacen.put(almacen, alm);
            return this.getIdAlmacen(alm);
        } catch (Exception e) {
            e.printStackTrace();
            return "";
        }
    }

    private String getIdAlmacen(Almacen alm) {
        if (alm == null) {
            return "";
        }
        return alm.getIdAlmacen();
    }

    private void setColorTable() {
        for (int i = 0; i < modeltable.getColumnCount(); i++) {
            table.getColumnModel().getColumn(i).setCellRenderer(new CellRendererLabelItem());
        }
    }

    private void loadDataItem(BeanItem beanItem, BeanImpItem impItem) {
        impItem.setIdItem(beanItem.getIdItem());
        impItem.setIdFamilia(beanItem.getBeanFamilia().getIdFamilia());
        impItem.setIdSubFamilia(beanItem.getBeanSubFamilia().getIdSubFamilia());
        impItem.setIdMarca(beanItem.getBeanMarca().getIdMarca());
        impItem.setIdModelo(beanItem.getBeanColor().getIdColor());
        impItem.setIdTamano(beanItem.getBeanTamano().getIdTamano());
        impItem.setIdUnidad(beanItem.getBeanUmCompra().getIdUm());
    }

    private Workbook getWorkbook(File file, WorkbookSettings ws) throws Exception {
        try {
            return Workbook.getWorkbook(file, ws);
        } catch (IOException ex) {
            throw ex;
        }
    }

    private void fillData(File file) throws ParseException, Exception {
        int j = -1;
        int x = -1;
        int numCols = 26;
        try {
            WorkbookSettings ws = new WorkbookSettings();
            ws.setEncoding("Cp1252");
            Workbook workbook = this.getWorkbook(file, ws);
            Sheet sheet = workbook.getSheet(0);
            if (sheet.getColumns() != numCols) {
                System.out.println("Cols:" + sheet.getColumns());
                JOptionPane.showMessageDialog(this, "Numero de Columnas: " + numCols);
                return;
            }
            System.out.println("Cols:" + sheet.getColumns());
            System.out.println("Rows:" + sheet.getRows());
            modeltable.clearTable();
            //Cell cell;
            for (j = 1; j < sheet.getRows(); j++) {
                BeanImpItem bean = new BeanImpItem();
                for (x = 0; x < numCols; x++) {
                    this.setValueBean(x, bean, this.getCell(sheet, x, j));
                }
                x = 0;
                modeltable.setItem(bean);
            }
            modeltable.fireTableDataChanged();
            CTableFx.setAllColumnPreferredWidth(table);
        } catch (BiffException e) {
            throw e;
            //e.printStackTrace();
        } catch (Exception e) {
            try {
                if (j > -1 && x > -1) {
                    throw new Exception(e.getMessage() + " *Fila: " + (j + 1) + ", Columna: " + (x + 1));
                } else {
                    throw new Exception(e.getMessage());
                }
            } catch (Exception ex) {
                throw ex;
            }
        }
    }

    private Cell getCell(Sheet sheet, int x, int j) {
        return sheet.getCell(x, j);
    }

    private void setValueBean(int x, BeanImpItem bean, Cell cell) {
        switch (x) {
            case 0:
                bean.setIdItem(cell.getContents().trim());
                break;
            case 1:
                bean.setCodigoAlterno(cell.getContents().trim());
                break;
            case 2:
                bean.setDescripcion(cell.getContents().trim());
                break;
            case 3:
                bean.setFamilia(cell.getContents().trim());
                break;
            case 4:
                bean.setSubFamilia(cell.getContents().trim());
                break;
            case 5:
                bean.setMarca(cell.getContents().trim());
                break;
            case 6:
                bean.setModelo(cell.getContents().trim());
                break;
            case 7:
                bean.setTamano(cell.getContents().trim());
                break;
            case 8:
                bean.setUnidad(cell.getContents().trim());
                break;
            case 9:
                bean.setIdItemDestino(cell.getContents().trim());
                break;
            case 10:
                bean.setFactorDestino(this.getValue(cell.getContents().trim()));
                break;
            case 11:
                bean.setFactorOrigen(this.getValue(cell.getContents().trim()));
                break;
            case 12:
                bean.setCompraVenta(cell.getContents().trim());
                break;
            case 13:
                bean.setComposicion(cell.getContents().trim());
                break;
            case 14:
                bean.setAccion(cell.getContents().trim());
                break;
            case 15:
                bean.setPrecioTarjeta(this.getValue(cell.getContents().trim()));
                break;
            case 16:
                bean.setPrecioPublico(this.getValue(cell.getContents().trim()));
                break;
            case 17:
                bean.setPrecioMayor(this.getValue(cell.getContents().trim()));
                break;
            case 18:
                bean.setAlmacen01(cell.getContents().trim());
                break;
            case 19:
                bean.setAlmacen02(cell.getContents().trim());
                break;
            case 20:
                bean.setAlmacen03(cell.getContents().trim());
                break;
            case 21:
                bean.setAlmacen04(cell.getContents().trim());
                break;
            case 22:
                bean.setAlmacen05(cell.getContents().trim());
                break;
            case 23:
                bean.setAlmacen06(cell.getContents().trim());
                break;
            case 24:
                bean.setAlmacen07(cell.getContents().trim());
                break;
            case 25:
                bean.setAlmacen08(cell.getContents().trim());
                break;
        }
    }

    private BigDecimal getValue(String content) {
        if (content.trim().isEmpty()) {
            return null;
        }
        return new BigDecimal(content.replace(",", "."));
    }

    private void guardarItems() {
        try {
            if (verificarDatos()) {
                guardarItemsBd();
            }
        } catch (Exception ex) {
            ex.printStackTrace();
            JOptionPane.showMessageDialog(this, ex.getMessage());
        }
    }

    private void guardarItemsBd() throws Exception {
        try {
            RnItem rnItem = new RnItem(path);
            rnItem.importarItemExcel(this.getItems(), this.getXmlConversion(), usuario.getId_usuario());
            JOptionPane.showMessageDialog(this, "Cargados Correctamente");
            modeltable.clearTable();
            CTableFx.setAllColumnPreferredWidth(table);
        } catch (Exception ex) {
            throw ex;
        }
    }

    private List<BeanItem> getItems() throws Exception {
        try {
            BigDecimal igv = this.getIgvVenta();
            List<BeanItem> listItem = new ArrayList();
            for (int i = 0; i < modeltable.getRowCount(); i++) {
                BeanImpItem beanImpItem = modeltable.getItem(i);
                if (beanImpItem.isExistsBd()) {
                    continue;
                }
                listItem.add(this.getBeanItem(beanImpItem, igv));
            }
            return listItem;
        } catch (Exception e) {
            throw e;
        }
    }

    private BigDecimal getIgvVenta() {
        try {
            String value = (new LogicParametro(path)).beanParametro("IGVV").getValor();
            return new BigDecimal(value);
        } catch (Exception e) {
            return BigDecimal.ZERO;
        }
    }

    private BeanItem getBeanItem(BeanImpItem beanImpItem, BigDecimal igvVenta) throws Exception {
        try {
            BeanItem beanItem = new BeanItem();
            SimpleDateFormat fe = new SimpleDateFormat("dd/MM/yyyy");
            beanItem.setIdItem(beanImpItem.getIdItem());
            beanItem.setIdEmpresa(usuario.getCodempresa());
            beanItem.setIdAlterno(beanImpItem.getCodigoAlterno());
            beanItem.setDescripcion(beanImpItem.getDescripcion());
            BeanUnidadMedida beanUm = new BeanUnidadMedida(beanImpItem.getIdUnidad());
            beanItem.setBeanUmCompra(beanUm);
            beanItem.setBeanUmVenta(beanUm);
            beanItem.setBeanUmStock(beanUm);
            beanItem.setBeanColor(new BeanColor(beanImpItem.getIdModelo()));
            beanItem.setBeanFamilia(new BeanFamilia(beanImpItem.getIdFamilia()));
            beanItem.setBeanSubFamilia(new BeanSubFamilia(beanImpItem.getIdSubFamilia()));
            beanItem.setBeanMarca(new BeanMarca(beanImpItem.getIdMarca()));
            beanItem.setBeanTamano(new BeanTamano(beanImpItem.getIdTamano()));
            beanItem.setFlagIgv("S");
            beanItem.setFlagPercepcion("N");
            beanItem.setPigv(igvVenta);
            beanItem.setpIsc(BigDecimal.ZERO);
            beanItem.setCtaCompra("60111");
            beanItem.setCtaTransito("60811");
            beanItem.setCtaVta("70111");
            beanItem.setCtaVtaDolar("70112");
            beanItem.setFlagKardex("S");
            beanItem.setFlagTransporte("N");
            beanItem.setTipoItem("P");
            beanItem.setEstado("A");
            beanItem.setIdUsuario(usuario.getId_usuario());
            if (com.softcommerce.util.Constans.ISBOTICA) {
                beanItem.setComposicion(beanImpItem.getComposicion());
                beanItem.setFuncion(beanImpItem.getAccion());
                beanItem.setStockMin(0);
            } else {
                beanItem.setComposicion("");
                beanItem.setFuncion("");
                beanItem.setStockMin(0);
            }
            //beanItem.setXmlConversion(this.getXmlConversion(beanImpItem));
            beanItem.setXmlConfig(this.getXmlConfig(fe, beanImpItem));
            beanItem.setXmlAlmacen(this.getXmlAlmacen(fe, beanImpItem));
            beanItem.setXmlCuenta(this.getXmlCuenta(fe));
            beanItem.setBeanPrecioItem(this.getPrecioItem(beanImpItem));
            return beanItem;
        } catch (Exception ex) {
            throw ex;
        }
    }

    private BeanPrecioItem getPrecioItem(BeanImpItem beanImpItem) {
        BeanPrecioItem precioItem = new BeanPrecioItem();
        precioItem.setIdItem(beanImpItem.getIdItem());
        precioItem.setPrecio1(beanImpItem.getPrecioTarjeta());
        precioItem.setPrecio2(beanImpItem.getPrecioPublico());
        precioItem.setPrecio3(beanImpItem.getPrecioMayor());
        precioItem.setPrecio4(BigDecimal.ZERO);
        precioItem.setPrecio5(BigDecimal.ZERO);
        precioItem.setPrecio6(BigDecimal.ZERO);
        return precioItem;
    }

    private String getXmlAlmacen(SimpleDateFormat fe, BeanImpItem beanImpItem) {
        String xmlAlmacen;
        xmlAlmacen = "<?xml version=\"1.0\" ?> ";
        xmlAlmacen += "<ALMACENES>";
        if (!beanImpItem.getIdAlmacen01().isEmpty()) {
            xmlAlmacen += this.getXmlAlmacen(fe, beanImpItem.getIdAlmacen01(), "VENTA");
            xmlAlmacen += this.getXmlAlmacen(fe, beanImpItem.getIdAlmacen01(), "DESPACHO");
        }
        if (!beanImpItem.getIdAlmacen02().isEmpty()) {
            xmlAlmacen += this.getXmlAlmacen(fe, beanImpItem.getIdAlmacen02(), "VENTA");
            xmlAlmacen += this.getXmlAlmacen(fe, beanImpItem.getIdAlmacen02(), "DESPACHO");
        }
        if (!beanImpItem.getIdAlmacen03().isEmpty()) {
            xmlAlmacen += this.getXmlAlmacen(fe, beanImpItem.getIdAlmacen03(), "VENTA");
            xmlAlmacen += this.getXmlAlmacen(fe, beanImpItem.getIdAlmacen03(), "DESPACHO");
        }
        if (!beanImpItem.getIdAlmacen04().isEmpty()) {
            xmlAlmacen += this.getXmlAlmacen(fe, beanImpItem.getIdAlmacen04(), "VENTA");
            xmlAlmacen += this.getXmlAlmacen(fe, beanImpItem.getIdAlmacen04(), "DESPACHO");
        }
        if (!beanImpItem.getIdAlmacen05().isEmpty()) {
            xmlAlmacen += this.getXmlAlmacen(fe, beanImpItem.getIdAlmacen05(), "VENTA");
            xmlAlmacen += this.getXmlAlmacen(fe, beanImpItem.getIdAlmacen05(), "DESPACHO");
        }
        if (!beanImpItem.getIdAlmacen06().isEmpty()) {
            xmlAlmacen += this.getXmlAlmacen(fe, beanImpItem.getIdAlmacen06(), "VENTA");
            xmlAlmacen += this.getXmlAlmacen(fe, beanImpItem.getIdAlmacen06(), "DESPACHO");
        }
        if (!beanImpItem.getIdAlmacen07().isEmpty()) {
            xmlAlmacen += this.getXmlAlmacen(fe, beanImpItem.getIdAlmacen07(), "VENTA");
            xmlAlmacen += this.getXmlAlmacen(fe, beanImpItem.getIdAlmacen07(), "DESPACHO");
        }
        if (!beanImpItem.getIdAlmacen08().isEmpty()) {
            xmlAlmacen += this.getXmlAlmacen(fe, beanImpItem.getIdAlmacen08(), "VENTA");
            xmlAlmacen += this.getXmlAlmacen(fe, beanImpItem.getIdAlmacen08(), "DESPACHO");
        }
        xmlAlmacen += "</ALMACENES>";
        System.out.println("xml_Almacen: " + xmlAlmacen);
        return xmlAlmacen;
    }

    private String getXmlAlmacen(SimpleDateFormat fe, String idAlmacen, String proceso) {
        String xmlAlmacen = "<ALMACEN>";
        xmlAlmacen += "<ID_ALMACEN>" + idAlmacen + "</ID_ALMACEN>";
        xmlAlmacen += "<PROCESO>" + proceso + "</PROCESO>";
        xmlAlmacen += "<F_INICIO>" + fe.format(Util.getDateNow()) + "</F_INICIO>";
        xmlAlmacen += "<ESTADO>A</ESTADO>";
        xmlAlmacen += "</ALMACEN>";
        return xmlAlmacen;
    }

    private String getXmlConfig(SimpleDateFormat fe, BeanImpItem beanImpItem) {
        String xmlConfig;
        xmlConfig = "<?xml version=\"1.0\" ?> ";
        xmlConfig += "<CONFIGS>";
        for (ClaseOperacionEnum claseOperacionEnum : beanImpItem.getSetClaseOperacion()) {
            xmlConfig += "<CONFIG>";
            xmlConfig += "<ID_CLASE_OPERACION>" + claseOperacionEnum.getValue() + "</ID_CLASE_OPERACION>";
            xmlConfig += "<F_INICIO>" + fe.format(Util.getDateNow()) + "</F_INICIO>";
            xmlConfig += "<ESTADO>A</ESTADO>";
            xmlConfig += "</CONFIG>";
        }
        xmlConfig += "</CONFIGS>";
        System.out.println("xml_Config: " + xmlConfig);
        return xmlConfig;
    }

    private String getXmlCuenta(SimpleDateFormat fe) {
        String xmlCuenta;
        xmlCuenta = "<?xml version=\"1.0\" ?> ";
        xmlCuenta += "<CUENTAS>";
        xmlCuenta += this.getXmlCuenta(fe, ClaseOperacionEnum.COMPRAS, "60111", MonedaEnum.SOLES, "N");
        xmlCuenta += this.getXmlCuenta(fe, ClaseOperacionEnum.COMPRAS, "60811", MonedaEnum.SOLES, "S");
        xmlCuenta += this.getXmlCuenta(fe, ClaseOperacionEnum.VENTAS, "70111", MonedaEnum.SOLES, "N");
        xmlCuenta += this.getXmlCuenta(fe, ClaseOperacionEnum.VENTAS, "70112", MonedaEnum.DOLARES, "N");
        xmlCuenta += "</CUENTAS>";
        System.out.println("xml_Cuenta: " + xmlCuenta);
        return xmlCuenta;
    }

    private String getXmlCuenta(SimpleDateFormat fe, ClaseOperacionEnum claseOperacionEnum,
            String idCuenta, MonedaEnum monedaEnum, String flagTransito) {
        String xmlCuenta = "<CUENTA>";
        xmlCuenta += "<F_INICIO>" + fe.format(Util.getDateNow()) + "</F_INICIO>";
        xmlCuenta += "<ID_CLASE_OPERACION>" + claseOperacionEnum.getValue() + "</ID_CLASE_OPERACION>";
        xmlCuenta += "<ID_CUENTA>" + idCuenta + "</ID_CUENTA>";
        xmlCuenta += "<ID_MONEDA>" + monedaEnum.getValue() + "</ID_MONEDA>";
        xmlCuenta += "<TRANSITO>" + flagTransito + "</TRANSITO>";
        xmlCuenta += "<ESTADO>A</ESTADO>";
        xmlCuenta += "</CUENTA>";
        return xmlCuenta;
    }

    private String getXmlConversion() {
        String xmlConversion;
        xmlConversion = "<?xml version=\"1.0\" ?> ";
        xmlConversion += "<CONVERSIONES>";
        for (int i = 0; i < modeltable.getRowCount(); i++) {
            BeanImpItem beanImpItem = modeltable.getItem(i);
            if (beanImpItem.isExistsBd()) {
                continue;
            }
            if (!Util.isBlank(beanImpItem.getIdItemDestino())) {
                xmlConversion += "<CONVERSION>";
                xmlConversion += "<ID_ITEM>" + beanImpItem.getIdItem() + "</ID_ITEM>";
                xmlConversion += "<ID_ITEM_DESTINO>" + beanImpItem.getIdItemDestino() + "</ID_ITEM_DESTINO>";
                xmlConversion += "<ESTADO>A</ESTADO>";
                xmlConversion += "<VALOR_DESTINO>" + beanImpItem.getFactorDestino().toString().replace(".", ",") + "</VALOR_DESTINO>";
                xmlConversion += "<VALOR_PAQUETE>" + beanImpItem.getFactorDestino().toString().replace(".", ",") + "</VALOR_PAQUETE>";
                xmlConversion += "<VALOR_ORIGEN>" + beanImpItem.getFactorOrigen().toString().replace(".", ",") + "</VALOR_ORIGEN>";
                xmlConversion += "</CONVERSION>";
            }
        }
        xmlConversion += "</CONVERSIONES>";
        return xmlConversion;
    }

    private boolean verificarDatos() {
        if (modeltable.getRowCount() == 0) {
            JOptionPane.showMessageDialog(this, "No hay datos que registrar");
            return false;
        }
        for (int i = 0; i < modeltable.getRowCount(); i++) {
            BeanImpItem beanImpItem = modeltable.getItem(i);
            if (beanImpItem.isExistsBd()) {
                continue;
            }
            if (Util.isBlank(beanImpItem.getIdItem())) {
                JOptionPane.showMessageDialog(this, " Ingrese Id_Item\nFila: " + (i + 1));
                return false;
            }
            if (Util.isBlank(beanImpItem.getDescripcion())) {
                JOptionPane.showMessageDialog(this, "Ingrese Descripcion\nFila: " + (i + 1));
                return false;
            }
            if (Util.isBlank(beanImpItem.getFamilia())) {
                JOptionPane.showMessageDialog(this, "Ingrese Familia\nFila: " + (i + 1));
                return false;
            }
            if (Util.isBlank(beanImpItem.getIdFamilia())) {
                JOptionPane.showMessageDialog(this, "Familia no se encuentra registrado\nFila: " + (i + 1));
                return false;
            }
            /*if (Util.isBlank(beanImpItem.getSubFamilia())) {
                JOptionPane.showMessageDialog(this, "Ingrese SubFamilia\nFila: " + (i + 1));
                return false;
            }
            if (Util.isBlank(beanImpItem.getIdSubFamilia())) {
                JOptionPane.showMessageDialog(this, "SubFamilia no se encuentra registrado\nFila: " + (i + 1));
                return false;
            }*/
            if (Util.isBlank(beanImpItem.getMarca())) {
                JOptionPane.showMessageDialog(this, "Ingrese Marca\nFila: " + (i + 1));
                return false;
            }
            if (Util.isBlank(beanImpItem.getIdMarca())) {
                JOptionPane.showMessageDialog(this, "Marca no se encuentra registrado\nFila: " + (i + 1));
                return false;
            }
            if (Util.isBlank(beanImpItem.getModelo())) {
                JOptionPane.showMessageDialog(this, "Ingrese Modelo\nFila: " + (i + 1));
                return false;
            }
            if (Util.isBlank(beanImpItem.getIdModelo())) {
                JOptionPane.showMessageDialog(this, "Modelo no se encuentra registrado\nFila: " + (i + 1));
                return false;
            }
            if (Util.isBlank(beanImpItem.getTamano())) {
                JOptionPane.showMessageDialog(this, "Ingrese Tamaño\nFila: " + (i + 1));
                return false;
            }
            if (Util.isBlank(beanImpItem.getIdTamano())) {
                JOptionPane.showMessageDialog(this, "Tamaño no se encuentra registrado\nFila: " + (i + 1));
                return false;
            }
            if (Util.isBlank(beanImpItem.getUnidad())) {
                JOptionPane.showMessageDialog(this, "Ingrese unidad de medida\nFila: " + (i + 1));
                return false;
            }
            if (Util.isBlank(beanImpItem.getIdUnidad())) {
                JOptionPane.showMessageDialog(this, "Unidad de medida no se encuentra registrado\nFila: " + (i + 1));
                return false;
            }
            if (!this.validarAlmacen(beanImpItem, i)) {
                return false;
            }
        }
        return true;
    }

    private boolean validarAlmacen(BeanImpItem beanImpItem, int i) {
        if (!Util.isBlank(beanImpItem.getAlmacen01())) {
            if (Util.isBlank(beanImpItem.getIdAlmacen01())) {
                JOptionPane.showMessageDialog(this, "Almacen 01 no se encuentra registrado\nFila: " + (i + 1));
                return false;
            }
        }
        if (!Util.isBlank(beanImpItem.getAlmacen02())) {
            if (Util.isBlank(beanImpItem.getIdAlmacen02())) {
                JOptionPane.showMessageDialog(this, "Almacen 02 no se encuentra registrado\nFila: " + (i + 1));
                return false;
            }
        }
        if (!Util.isBlank(beanImpItem.getAlmacen03())) {
            if (Util.isBlank(beanImpItem.getIdAlmacen03())) {
                JOptionPane.showMessageDialog(this, "Almacen 03 no se encuentra registrado\nFila: " + (i + 1));
                return false;
            }
        }
        if (!Util.isBlank(beanImpItem.getAlmacen04())) {
            if (Util.isBlank(beanImpItem.getIdAlmacen04())) {
                JOptionPane.showMessageDialog(this, "Almacen 04 no se encuentra registrado\nFila: " + (i + 1));
                return false;
            }
        }
        if (!Util.isBlank(beanImpItem.getAlmacen05())) {
            if (Util.isBlank(beanImpItem.getIdAlmacen05())) {
                JOptionPane.showMessageDialog(this, "Almacen 05 no se encuentra registrado\nFila: " + (i + 1));
                return false;
            }
        }
        if (!Util.isBlank(beanImpItem.getAlmacen06())) {
            if (Util.isBlank(beanImpItem.getIdAlmacen06())) {
                JOptionPane.showMessageDialog(this, "Almacen 06 no se encuentra registrado\nFila: " + (i + 1));
                return false;
            }
        }
        if (!Util.isBlank(beanImpItem.getAlmacen07())) {
            if (Util.isBlank(beanImpItem.getIdAlmacen07())) {
                JOptionPane.showMessageDialog(this, "Almacen 07 no se encuentra registrado\nFila: " + (i + 1));
                return false;
            }
        }
        if (!Util.isBlank(beanImpItem.getAlmacen08())) {
            if (Util.isBlank(beanImpItem.getIdAlmacen08())) {
                JOptionPane.showMessageDialog(this, "Almacen 08 no se encuentra registrado\nFila: " + (i + 1));
                return false;
            }
        }
        return true;
    }

    @Override
    public void actionPerformed(ActionEvent ae) {
        if (ae.getSource() == btnImportar) {
            this.importarExcel();
        }
        if (ae.getSource() == btnGuardar) {
            guardarItems();
        }
    }
}
