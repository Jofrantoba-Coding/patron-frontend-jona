package com.softcommerce.views.uiformitemimportar;


import com.softcommerce.formularios.importar.*;
import com.softcommerce.formularios.*;
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

public class UiFormItemImportar
        extends JDialog implements InterUiFormItemImportar, ActionListener {

    protected final URL path;
    protected final Usuario usuario;
    protected JButton btnImportar;
    static JFileChooser jChooser;
    protected JTable table;
    protected ImpItemTableModel modeltable;
    protected JScrollPane scrollTable;
    protected JButton btnGuardar;

    public UiFormItemImportar(JFrame frame, Usuario usuario, java.net.URL ruta) {
        super(frame, true);
        this.usuario = usuario;
        this.path = ruta;
        initComponents();
    }

    protected void initComponents() {
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

    protected void importarExcel() {
    }

    protected void llenarData() throws Exception {
    }

    protected void validateItemBd(BeanImpItem impItem,
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

    protected void loadDataFamilia(BeanImpItem impItem, List<BeanFamilia> listFamilia) {
    }

    protected void loadDataMarca(BeanImpItem impItem, List<BeanMarca> listMarca) {
    }

    protected void loadDataColor(BeanImpItem impItem, List<BeanColor> listColor) {
    }

    protected void loadDataTamano(BeanImpItem impItem, List<BeanTamano> listTamano) {
    }

    protected void loadDataUm(BeanImpItem impItem, List<BeanUnidadMedida> listUm) {
    }

    protected void loadDataSubFamilia(BeanImpItem impItem, List<BeanSubFamilia> listSubFamilia) {
    }

    protected BeanFamilia buscarFamilia(List<BeanFamilia> listFamilia, String descripcion) {
        return null;
    }

    protected BeanMarca buscarMarca(List<BeanMarca> listMarca, String descripcion) {
        return null;
    }

    protected BeanColor buscarColor(List<BeanColor> listColor, String descripcion) {
        return null;
    }

    protected BeanTamano buscarTamano(List<BeanTamano> listTamano, String descripcion) {
        return null;
    }

    protected BeanUnidadMedida buscarUnidadMedida(List<BeanUnidadMedida> listUm, String descripcion) {
        return null;
    }

    protected BeanSubFamilia buscarSubFamilia(List<BeanSubFamilia> listSubFamilia, BeanImpItem impItem) {
        return null;
    }

    protected BeanItem buscarItem(List<BeanItem> listItem, String idItem) {
        return null;
    }

    protected void loadDataAlmacen(BeanImpItem impItem, Map<String, Almacen> mapAlmacen) {
    }

    protected String getIdAlmacen(String almacen, Map<String, Almacen> mapAlmacen) {
        return null;
    }

    protected String getIdAlmacen(Almacen alm) {
        if (alm == null) {
            return "";
        }
        return alm.getIdAlmacen();
    }

    protected void setColorTable() {
        for (int i = 0; i < modeltable.getColumnCount(); i++) {
            table.getColumnModel().getColumn(i).setCellRenderer(new CellRendererLabelItem());
        }
    }

    protected void loadDataItem(BeanItem beanItem, BeanImpItem impItem) {
    }

    protected Workbook getWorkbook(File file, WorkbookSettings ws) throws Exception {
        try {
            return Workbook.getWorkbook(file, ws);
        } catch (IOException ex) {
            throw ex;
        }
    }

    protected void fillData(File file) throws ParseException, Exception {
    }

    protected Cell getCell(Sheet sheet, int x, int j) {
        return sheet.getCell(x, j);
    }

    protected void setValueBean(int x, BeanImpItem bean, Cell cell) {
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

    protected BigDecimal getValue(String content) {
        if (content.trim().isEmpty()) {
            return null;
        }
        return new BigDecimal(content.replace(",", "."));
    }

    protected void guardarItems() {
    }

    protected void guardarItemsBd() throws Exception {
    }

    protected List<BeanItem> getItems() throws Exception {
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

    protected BigDecimal getIgvVenta() {
        return null;
    }

    protected BeanItem getBeanItem(BeanImpItem beanImpItem, BigDecimal igvVenta) throws Exception {
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

    protected BeanPrecioItem getPrecioItem(BeanImpItem beanImpItem) {
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

    protected String getXmlAlmacen(SimpleDateFormat fe, BeanImpItem beanImpItem) {
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

    protected String getXmlAlmacen(SimpleDateFormat fe, String idAlmacen, String proceso) {
        String xmlAlmacen = "<ALMACEN>";
        xmlAlmacen += "<ID_ALMACEN>" + idAlmacen + "</ID_ALMACEN>";
        xmlAlmacen += "<PROCESO>" + proceso + "</PROCESO>";
        xmlAlmacen += "<F_INICIO>" + fe.format(Util.getDateNow()) + "</F_INICIO>";
        xmlAlmacen += "<ESTADO>A</ESTADO>";
        xmlAlmacen += "</ALMACEN>";
        return xmlAlmacen;
    }

    protected String getXmlConfig(SimpleDateFormat fe, BeanImpItem beanImpItem) {
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

    protected String getXmlCuenta(SimpleDateFormat fe) {
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

    protected String getXmlCuenta(SimpleDateFormat fe, ClaseOperacionEnum claseOperacionEnum,
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

    protected String getXmlConversion() {
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

    protected boolean verificarDatos() {
        return false;
    }

    protected boolean validarAlmacen(BeanImpItem beanImpItem, int i) {
        return false;
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
