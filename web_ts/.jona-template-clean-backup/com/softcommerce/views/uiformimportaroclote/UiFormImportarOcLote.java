package com.softcommerce.views.uiformimportaroclote;


import com.softcommerce.formularios.importar.*;
import com.softcommerce.formularios.*;
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
public class UiFormImportarOcLote
        extends JDialog
        implements InterUiFormImportarOcLote, ActionListener {

    protected final URL path;
    protected final Usuario usuario;
    protected JButton btnImportar;
    static JFileChooser jChooser;
    protected JTable table;
    protected ImpOcLoteTableModel modeltable;
    protected JScrollPane scrollTable;
    protected JButton btnGuardar;
    protected BeanAnexo beanAnexoProv;
    protected BeanAnexo beanAnexoTrans;
    protected Date fechaRegistro;
    protected BeanTipoCambio beanTipoCambio;
    protected Almacen beanAlmacen;
    protected UsuarioCorrelativo userCorrelativoNi;
    protected final Logger logger = Logger.getLogger(UiFormImportarOcLote.class);

    public UiFormImportarOcLote(JFrame frame, Usuario usuario, URL ruta) {
        super(frame, true);
        this.usuario = usuario;
        this.path = ruta;
        initComponents();
    }

    protected void initComponents() {
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

    protected void importarExcel() {
    }

    protected void llenarData() throws Exception {
    }

    protected void validateItemBd(BeanImpOcLote impItem, List<Almacen> listAlmacen,
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

    protected void loadDataAlmacen(BeanImpOcLote impItem, List<Almacen> listAlmacen) {
    }

    protected void loadDataItem(BeanImpOcLote impItem, List<BeanItem> listItem) {
    }

    protected void loadDataLaboratorioClinico(BeanImpOcLote impItem, List<BeanLaboratorioClinico> listLaboratorio) {
    }

    protected void loadDataUbicacion(BeanImpOcLote impItem, List<BeanUbicacion> listUbicacion) {
    }

    protected Almacen buscarAlmacen(List<Almacen> listAlmacen, String idAlmacen) {
        return null;
    }

    protected BeanItem buscarItem(List<BeanItem> listItem, String idItem) {
        return null;
    }

    protected BeanLaboratorioClinico buscarLaboratorioClinico(List<BeanLaboratorioClinico> listLaboratorio, String laboratorio) {
        return null;
    }

    protected BeanUbicacion buscarUbicacion(List<BeanUbicacion> listUbicacion, String ubicacion) {
        return null;
    }

    protected Workbook getWorkbook(File file) throws Exception {
        try {
            return Workbook.getWorkbook(file);
        } catch (IOException ex) {
            throw ex;
        }
    }

    protected void fillData(File file) throws ParseException, Exception {
    }

    protected Cell getCell(Sheet sheet, int x, int j) {
        return sheet.getCell(x, j);
    }

    protected void setValueBean(int x, BeanImpOcLote bean, Cell cell)
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

    protected BigDecimal getValue(String content) {
        if (content.trim().isEmpty()) {
            return null;
        }
        return new BigDecimal(content.replace(",", "."));
    }

    protected java.sql.Date getFecha(String content)
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

    protected boolean validateDatos()
            throws Exception {
        return false;
    }

    protected boolean isEmptyNotaIngreso() throws Exception {
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

    protected List<UsuarioCorrelativo> getUsuarioCorrelativos(String idTipoDoc) throws Exception {
        return null;
    }

    protected boolean validateModelTable() {
        return false;
    }

    protected Set<String> getSetAlmacen() {
        Set<String> setAlmacen = new HashSet();
        for (int i = 0; i < modeltable.getRowCount(); i++) {
            BeanImpOcLote beanItem = modeltable.getItem(i);
            setAlmacen.add(beanItem.getIdAlmacen());
        }
        return setAlmacen;
    }

    protected void guardar() {
    }

    protected BeanImpGeneral getBeanGral(String preimpresoUltimateMic) throws Exception {
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

    protected Integer getNumeroCorrelativoNi() {
        return Integer.parseInt(userCorrelativoNi.getPreimpreso());
    }

    protected List<BeanImpCab> getGeneral() {
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

    protected String getPreimpresoCorrelativo(Integer numeroCorrelativo) {
        String preimpreso = "0000000000" + numeroCorrelativo;
        return preimpreso.substring(preimpreso.length() - 10, preimpreso.length());
    }

    protected List<BeanImpDet> getDetalles() {
        List<BeanImpDet> detalles = new ArrayList();
        for (int i = 0; i < modeltable.getRowCount(); i++) {
            BeanImpOcLote beanItem = modeltable.getItem(i);
            this.setDataDetalle(detalles, beanItem);
        }
        return detalles;
    }

    protected void setDataDetalle(List<BeanImpDet> detalles, BeanImpOcLote beanItem) {
    }

    protected BeanImpLote getBeanImpLote(BeanImpOcLote beanItem) {
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

    protected BeanImpDet getDetalle(List<BeanImpDet> detalles, String idItem) {
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
