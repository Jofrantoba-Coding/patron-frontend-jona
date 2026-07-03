package com.softcommerce.formularios.importar;

import com.softcommerce.beans.Almacen;
import com.softcommerce.beans.BeanAnexo;
import com.softcommerce.beans.BeanImpCab;
import com.softcommerce.beans.BeanImpDet;
import com.softcommerce.beans.BeanImpGeneral;
import com.softcommerce.beans.BeanImpLote;
import com.softcommerce.beans.BeanImpOcLote;
import com.softcommerce.beans.BeanItem;
import com.softcommerce.beans.BeanLaboratorioClinico;
import com.softcommerce.beans.BeanTipoCambio;
import com.softcommerce.beans.BeanUbicacion;
import com.softcommerce.beans.Usuario;
import com.softcommerce.beans.UsuarioCorrelativo;
import com.softcommerce.enums.AuxiliarEnum;
import com.softcommerce.enums.MonedaEnum;
import com.softcommerce.enums.TipoAnexoEnum;
import com.softcommerce.enums.TipoDocVentaEnum;
import com.softcommerce.formularios.Main;
import com.softcommerce.general.herramientas.CTableFx;
import com.softcommerce.general.tablas.ImpOcLoteTableModel;
import com.softcommerce.logic.LogicStock;
import com.softcommerce.reglasnegocio.RnAlmacen;
import com.softcommerce.reglasnegocio.RnAnexo;
import com.softcommerce.reglasnegocio.RnCorrelativo;
import com.softcommerce.reglasnegocio.RnInventarioInicial;
import com.softcommerce.reglasnegocio.RnItem;
import com.softcommerce.reglasnegocio.RnLaboratorioClinico;
import com.softcommerce.reglasnegocio.RnTipoCambio;
import com.softcommerce.reglasnegocio.RnUbicacion;
import com.softcommerce.util.Constans;
import com.softcommerce.util.ExceptionHandler;
import com.softcommerce.util.Util;
import java.awt.BorderLayout;
import java.awt.Dimension;
import java.awt.Font;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.io.File;
import java.io.IOException;
import java.math.BigDecimal;
import java.net.URL;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
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
import jxl.read.biff.BiffException;
import org.apache.log4j.Logger;
import org.jdesktop.swingx.HorizontalLayout;

/**
 *
 * @author Team Develtrex
 */
public class FormImportarOcLote
        extends JDialog
        implements ActionListener {

    private final URL path;
    private final Usuario usuario;
    private JButton btnImportar;
    static JFileChooser jChooser;
    private JTable table;
    private ImpOcLoteTableModel modeltable;
    private JScrollPane scrollTable;
    private JButton btnGuardar;
    private BeanAnexo beanAnexoProv;
    private BeanAnexo beanAnexoTrans;
    private Date fechaRegistro;
    private BeanTipoCambio beanTipoCambio;
    private Almacen beanAlmacen;
    private UsuarioCorrelativo userCorrelativoNi;
    private final Logger logger = Logger.getLogger(FormImportarOcLote.class);

    public FormImportarOcLote(JFrame frame, Usuario usuario, URL ruta) {
        super(frame, true);
        this.usuario = usuario;
        this.path = ruta;
        initComponents();
    }

    private void initComponents() {
        modeltable = new ImpOcLoteTableModel();
        table = new JTable();
        table.setFont(new Font("Tahoma", Font.PLAIN, 11));
        table.setRowHeight(19);
        table.setAutoResizeMode(JTable.AUTO_RESIZE_OFF);
        table.setModel(modeltable);
        //table.getColumnModel().getColumn(29).setMinWidth(0);
        //table.getColumnModel().getColumn(29).setMaxWidth(0);
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
                return;
            }
            this.fillData(file);
            this.llenarData();
            modeltable.fireTableDataChanged();
            CTableFx.setAllColumnPreferredWidth(table);
        } catch (Exception e) {
            ExceptionHandler.handleException(e, logger);
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }

    private void llenarData() throws Exception {
        try {
            if (modeltable.getRowCount() == 0) {
                return;
            }
            RnAlmacen rnAlmacen = new RnAlmacen(path);
            List<Almacen> listAlmacen = rnAlmacen.listar("", usuario.getCodempresa(), "");
            RnItem rnItem = new RnItem(path);
            RnUbicacion rnUbicacion = new RnUbicacion(path);
            String idAlmacen = modeltable.getItem(0).getIdAlmacen();
            List<BeanUbicacion> listUbicacion = rnUbicacion.listarUbicacion(0, idAlmacen);
            List<BeanItem> listItem = rnItem.listItem(Constans.ESTADO_ACTIVO);
            RnLaboratorioClinico rnLaboratorioClinico = new RnLaboratorioClinico(path);
            List<BeanLaboratorioClinico> listLaboratorio = rnLaboratorioClinico.listarGeneral();
            for (int i = 0; i < modeltable.getRowCount(); i++) {
                BeanImpOcLote impItem = modeltable.getItem(i);
                this.validateItemBd(impItem, listAlmacen, listItem,
                        listLaboratorio, listUbicacion);
            }
        } catch (Exception e) {
            throw e;
        }
    }

    private void validateItemBd(BeanImpOcLote impItem, List<Almacen> listAlmacen,
            List<BeanItem> listItem, List<BeanLaboratorioClinico> listLaboratorio,
            List<BeanUbicacion> listUbicacion) throws Exception {
        try {
            this.loadDataAlmacen(impItem, listAlmacen);
            this.loadDataItem(impItem, listItem);
            this.loadDataLaboratorioClinico(impItem, listLaboratorio);
            this.loadDataUbicacion(impItem, listUbicacion);
        } catch (Exception e) {
            throw e;
        }
    }

    private void loadDataAlmacen(BeanImpOcLote impItem, List<Almacen> listAlmacen) {
        Almacen almacen = this.buscarAlmacen(listAlmacen, impItem.getIdAlmacen());
        if (almacen == null) {
            return;
        }
        impItem.setAlmacen(almacen.getDescripcion());
    }

    private void loadDataItem(BeanImpOcLote impItem, List<BeanItem> listItem) {
        BeanItem item = this.buscarItem(listItem, impItem.getIdItem());
        if (item == null) {
            return;
        }
        impItem.setItem(item.getDescripcion());
        impItem.setIdUm(item.getBeanUmStock().getIdUm());
    }

    private void loadDataLaboratorioClinico(BeanImpOcLote impItem, List<BeanLaboratorioClinico> listLaboratorio) {
        BeanLaboratorioClinico lc = this.buscarLaboratorioClinico(listLaboratorio, impItem.getLaboratorio());
        if (lc == null) {
            return;
        }
        impItem.setIdLaboratorio(lc.getIdLaboratorio());
    }

    private void loadDataUbicacion(BeanImpOcLote impItem, List<BeanUbicacion> listUbicacion) {
        BeanUbicacion ubic = this.buscarUbicacion(listUbicacion, impItem.getUbicacion());
        if (ubic == null) {
            return;
        }
        impItem.setIdUbicacion(ubic.getIdUbicacion());
    }

    private Almacen buscarAlmacen(List<Almacen> listAlmacen, String idAlmacen) {
        for (int i = 0; i < listAlmacen.size(); i++) {
            Almacen almacen = listAlmacen.get(i);
            if (almacen.getIdAlmacen().equalsIgnoreCase(idAlmacen)) {
                return almacen;
            }
        }
        return null;
    }

    private BeanItem buscarItem(List<BeanItem> listItem, String idItem) {
        for (int i = 0; i < listItem.size(); i++) {
            BeanItem item = listItem.get(i);
            if (item.getIdItem().equalsIgnoreCase(idItem)) {
                return item;
            }
        }
        return null;
    }

    private BeanLaboratorioClinico buscarLaboratorioClinico(List<BeanLaboratorioClinico> listLaboratorio, String laboratorio) {
        for (int i = 0; i < listLaboratorio.size(); i++) {
            BeanLaboratorioClinico lc = listLaboratorio.get(i);
            if (lc.getNombre().equalsIgnoreCase(laboratorio)) {
                return lc;
            }
        }
        return null;
    }

    private BeanUbicacion buscarUbicacion(List<BeanUbicacion> listUbicacion, String ubicacion) {
        for (BeanUbicacion ubic : listUbicacion) {
            if (ubic.getDescripcion().equalsIgnoreCase(ubicacion)) {
                return ubic;
            }
        }
        return null;
    }

    private Workbook getWorkbook(File file) throws Exception {
        try {
            return Workbook.getWorkbook(file);
        } catch (IOException ex) {
            throw ex;
        }
    }

    private void fillData(File file) throws ParseException, Exception {
        int j = -1;
        int x = -1;
        int numCols = 11;
        try {
            Workbook workbook = this.getWorkbook(file);
            Sheet sheet = workbook.getSheet(0);
            if (sheet.getColumns() != numCols) {
                System.out.println("Cols:" + sheet.getColumns());
                JOptionPane.showMessageDialog(this, "Numero de Columnas: " + numCols);
                return;
            }
            logger.info("Cols:" + sheet.getColumns());
            logger.info("Rows:" + sheet.getRows());
            modeltable.clearTable();
            for (j = 1; j < sheet.getRows(); j++) {
                BeanImpOcLote bean = new BeanImpOcLote();
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

    private void setValueBean(int x, BeanImpOcLote bean, Cell cell)
            throws Exception {
        try {
            switch (x) {
                case 0:
                    bean.setIdAlmacen(cell.getContents().trim());
                    break;
                case 1:
                    bean.setUbicacion(cell.getContents().trim());
                    break;
                case 2:
                    bean.setFecha(this.getFecha(cell.getContents()));
                    break;
                case 3:
                    bean.setIdItem(cell.getContents().trim());
                    break;
                case 4:
                    bean.setCantidad(this.getValue(cell.getContents().trim()));
                    break;
                case 5:
                    bean.setPrecio(this.getValue(cell.getContents().trim()));
                    break;
                case 6:
                    bean.setFechaCaducidad(this.getFecha(cell.getContents().trim()));
                    break;
                case 7:
                    bean.setFechafabricacion(this.getFecha(cell.getContents().trim()));
                    break;
                case 8:
                    bean.setLaboratorio(cell.getContents().trim());
                    break;
                case 9:
                    bean.setNumeroLote(cell.getContents().trim());
                    break;
                case 10:
                    bean.setSerieLote(cell.getContents().trim());
                    break;
            }
        } catch (Exception e) {
            throw e;
        }
    }

    private BigDecimal getValue(String content) {
        if (content.trim().isEmpty()) {
            return null;
        }
        return new BigDecimal(content.replace(",", "."));
    }

    private java.sql.Date getFecha(String content)
            throws Exception {
        try {
            if (Util.isBlank(content)) {
                return null;
            }
            SimpleDateFormat fe = new SimpleDateFormat("dd/MM/yyyy");
            Date parsed = fe.parse(content);
            return new java.sql.Date(parsed.getTime());
        } catch (Exception e) {
            throw e;
        }
    }

    private boolean validateDatos()
            throws Exception {
        try {
            if (modeltable.getRowCount() == 0) {
                JOptionPane.showMessageDialog(this, "No hay datos que registrar");
                return false;
            }
            Set<String> setAlmacen = this.getSetAlmacen();
            if (setAlmacen.size() > 1) {
                JOptionPane.showMessageDialog(this, "solo se debe importar mercaderia de un solo almacen");
                return false;
            }
            if (!this.validateModelTable()) {
                return false;
            }
            RnAnexo rnAnexo = new RnAnexo(path);
            beanAnexoProv = rnAnexo.beanAnexoImp(TipoAnexoEnum.PROVEEDOR.getValue(), "", "A", usuario.getRuc(), "");
            if (beanAnexoProv == null) {
                JOptionPane.showMessageDialog(this, "Empresa no se encuentra registrado como proveedor");
                return false;
            }
            beanAnexoTrans = rnAnexo.beanAnexoImp(TipoAnexoEnum.TRANSPORTISTA.getValue(), "", "A", usuario.getRuc(), "");
            if (beanAnexoTrans == null) {
                JOptionPane.showMessageDialog(this, "Empresa no se encuentra registrado como transportista");
                return false;
            }
            BeanImpOcLote beanItem = modeltable.getItem(0);
            this.fechaRegistro = beanItem.getFecha();
            RnTipoCambio rnTipoCambio = new RnTipoCambio(path);
            this.beanTipoCambio = rnTipoCambio.getBeanTipoCambio(new java.sql.Date(this.fechaRegistro.getTime()),
                    MonedaEnum.SOLES.getValue());
            if (beanTipoCambio == null) {
                JOptionPane.showMessageDialog(this, "Tipo de Cambio no se encuentra registrado");
                return false;
            }
            RnAlmacen rnAlmacen = new RnAlmacen(path);
            String idAlmacen = modeltable.getItem(0).getIdAlmacen();
            beanAlmacen = rnAlmacen.cargarAlmacen(idAlmacen, "");
            if (this.isEmptyNotaIngreso()) {
                JOptionPane.showMessageDialog(this, "No tiene asignado serie de ingreso");
                return false;
            }
            return true;
        } catch (Exception e) {
            throw e;
        }
    }

    private boolean isEmptyNotaIngreso() throws Exception {
        try {
            List<UsuarioCorrelativo> listCorrelativo = this.getUsuarioCorrelativos(TipoDocVentaEnum.NOTA_INGRESO.getValue());
            boolean isEmpty = listCorrelativo.isEmpty();
            if (!isEmpty) {
                userCorrelativoNi = listCorrelativo.get(0);
            }
            return isEmpty;
        } catch (Exception e) {
            throw e;
        }
    }

    private List<UsuarioCorrelativo> getUsuarioCorrelativos(String idTipoDoc) throws Exception {
        try {
            RnCorrelativo regla_correlativo = new RnCorrelativo(path);
            return regla_correlativo.listarCorrelativo(usuario.getId_usuario(), beanAlmacen.getIdPuntoVenta(), idTipoDoc);
        } catch (Exception e) {
            throw e;
        }
    }

    private boolean validateModelTable() {
        for (int i = 0; i < modeltable.getRowCount(); i++) {
            BeanImpOcLote beanItem = modeltable.getItem(i);
            if (Util.isBlank(beanItem.getIdAlmacen())) {
                JOptionPane.showMessageDialog(this, "Ingrese IdAlmacen\nFila: " + (i + 1));
                return false;
            }
            if (Util.isBlank(beanItem.getAlmacen())) {
                JOptionPane.showMessageDialog(this, "Almacen no se encuentra registrado\nFila: " + (i + 1));
                return false;
            }
            if (Util.isBlank(beanItem.getIdItem())) {
                JOptionPane.showMessageDialog(this, "Ingrese IdItem\nFila: " + (i + 1));
                return false;
            }
            if (Util.isBlank(beanItem.getItem())) {
                JOptionPane.showMessageDialog(this, "Item no se encuentra registrado\nFila: " + (i + 1));
                return false;
            }
            if (beanItem.getCantidad() == null) {
                JOptionPane.showMessageDialog(this, "Ingrese Cantidad\nFila: " + (i + 1));
                return false;
            }
            if (beanItem.getPrecio() == null) {
                JOptionPane.showMessageDialog(this, "Ingrese Precio\nFila: " + (i + 1));
                return false;
            }
            if (!Util.isBlank(beanItem.getUbicacion()) && beanItem.getIdUbicacion() == null) {
                JOptionPane.showMessageDialog(this, "Ubicacion no se encuentra registrado\nFila: " + (i + 1));
                return false;
            }
            if (!Util.isBlank(beanItem.getLaboratorio()) && beanItem.getIdLaboratorio() == null) {
                JOptionPane.showMessageDialog(this, "Laboratorio no se encuentra registrado\nFila: " + (i + 1));
                return false;
            }
            if (Util.isBlank(beanItem.getNumeroLote())) {
                JOptionPane.showMessageDialog(this, "Ingrese numero de Lote\nFila: " + (i + 1));
                return false;
            }
        }
        return true;
    }

    private Set<String> getSetAlmacen() {
        Set<String> setAlmacen = new HashSet();
        for (int i = 0; i < modeltable.getRowCount(); i++) {
            BeanImpOcLote beanItem = modeltable.getItem(i);
            setAlmacen.add(beanItem.getIdAlmacen());
        }
        return setAlmacen;
    }

    private void guardar() {
        try {
            if (!this.validateDatos()) {
                return;
            }
            List<BeanImpCab> general = this.getGeneral();
            RnInventarioInicial logic = new RnInventarioInicial(path);
            String preimpresoUltimateMic = general.get(general.size() - 1).getPreimpresoMic();
            logic.importInventarioInicial(general, this.getBeanGral(preimpresoUltimateMic));
            JOptionPane.showMessageDialog(this, "Cargados Correctamente");
            modeltable.clearTable();
            CTableFx.setAllColumnPreferredWidth(table);
            LogicStock logicStock = new LogicStock(path);
            logicStock.regularizarStock(Main.anio);
        } catch (Exception e) {
            ExceptionHandler.handleException(e, logger);
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }

    private BeanImpGeneral getBeanGral(String preimpresoUltimateMic) throws Exception {
        try {
            BeanImpGeneral beanGral = new BeanImpGeneral();
            String anio = Util.getAnio(fechaRegistro);
            String mes = Util.getMes(fechaRegistro);
            beanGral.setIdPeriodoAnual(anio);
            beanGral.setIdPeriodoMensual(Util.getIdPeriodoMensual(anio, mes, AuxiliarEnum.APERTURA.getValue()));
            beanGral.setMes(mes);
            beanGral.setSerieOcc("001");
            beanGral.setIdEmpresa(usuario.getCodempresa());
            beanGral.setIdLocalidad(beanAlmacen.getIdLocalidad());
            beanGral.setIdPuntoVenta(beanAlmacen.getIdPuntoVenta());
            beanGral.setIdAlmacen(beanAlmacen.getIdAlmacen());
            beanGral.setIdProveedor(beanAnexoProv.getIdAnexo());
            beanGral.setDescripcionProveedor(beanAnexoProv.getDescripcion());
            beanGral.setRucProveedor(beanAnexoProv.getNumero());
            beanGral.setIdTransportista(beanAnexoTrans.getIdAnexo());
            beanGral.setIdMoneda(MonedaEnum.SOLES.getValue());
            beanGral.setTipoCambio(beanTipoCambio.getMontocompra());
            beanGral.setIdUsuario(usuario.getId_usuario());
            beanGral.setFecha(fechaRegistro);
            beanGral.setSerieMic(userCorrelativoNi.getSerie());
            beanGral.setIdCorrelativoMic(userCorrelativoNi.getIdCorrelativo());
            beanGral.setPreimpresoUltimateMic(preimpresoUltimateMic);
            return beanGral;
        } catch (Exception e) {
            throw e;
        }
    }

    private Integer getNumeroCorrelativoNi() {
        return Integer.parseInt(userCorrelativoNi.getPreimpreso());
    }

    private List<BeanImpCab> getGeneral() {
        List<BeanImpCab> result = new ArrayList();
        List<BeanImpDet> detalles = this.getDetalles();
        BeanImpCab beanCab = new BeanImpCab();
        Integer numeroCorrelativoNi = this.getNumeroCorrelativoNi();
        for (int i = 0; i < detalles.size(); i++) {
            BeanImpDet detalle = detalles.get(i);
            if (i % 13 == 0) {
                beanCab = new BeanImpCab();
                numeroCorrelativoNi++;
                beanCab.setPreimpresoMic(this.getPreimpresoCorrelativo(numeroCorrelativoNi));
                result.add(beanCab);
            }
            beanCab.agregarDetalle(detalle);
        }
        return result;
    }

    private String getPreimpresoCorrelativo(Integer numeroCorrelativo) {
        String preimpreso = "0000000000" + numeroCorrelativo;
        return preimpreso.substring(preimpreso.length() - 10, preimpreso.length());
    }

    private List<BeanImpDet> getDetalles() {
        List<BeanImpDet> detalles = new ArrayList();
        for (int i = 0; i < modeltable.getRowCount(); i++) {
            BeanImpOcLote beanItem = modeltable.getItem(i);
            this.setDataDetalle(detalles, beanItem);
        }
        return detalles;
    }

    private void setDataDetalle(List<BeanImpDet> detalles, BeanImpOcLote beanItem) {
        BeanImpDet detalle = this.getDetalle(detalles, beanItem.getIdItem());
        if (detalle == null) {
            detalle = new BeanImpDet();
            detalle.setIdItem(beanItem.getIdItem());
            detalle.setIdUm(beanItem.getIdUm());
            detalle.setPrecio(beanItem.getPrecio());
            detalles.add(detalle);
        }
        detalle.agregarLote(this.getBeanImpLote(beanItem));
    }

    private BeanImpLote getBeanImpLote(BeanImpOcLote beanItem) {
        BeanImpLote beanImpLote = new BeanImpLote();
        beanImpLote.setCantidad(beanItem.getCantidad());
        beanImpLote.setFechaCaducidad(beanItem.getFechaCaducidad());
        beanImpLote.setFechaFabricacion(beanItem.getFechafabricacion());
        beanImpLote.setIdLaboratorio(beanItem.getIdLaboratorio());
        beanImpLote.setIdUbicacion(beanItem.getIdUbicacion());
        beanImpLote.setNumeroLote(beanItem.getNumeroLote());
        beanImpLote.setSerieLote(beanItem.getSerieLote());
        beanImpLote.setExpira(beanItem.getFechaCaducidad() == null ? "N" : "S");
        return beanImpLote;
    }

    private BeanImpDet getDetalle(List<BeanImpDet> detalles, String idItem) {
        for (BeanImpDet detalle : detalles) {
            if (detalle.getIdItem().equalsIgnoreCase(idItem)) {
                return detalle;
            }
        }
        return null;
    }

    @Override
    public void actionPerformed(ActionEvent ae) {
        if (ae.getSource() == btnImportar) {
            this.importarExcel();
        }
        if (ae.getSource() == btnGuardar) {
            this.guardar();
        }
    }
}
