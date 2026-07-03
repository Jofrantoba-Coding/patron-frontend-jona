package com.softcommerce.formularios.importar;

import com.softcommerce.beans.Almacen;
import com.softcommerce.beans.BeanImpOc;
import com.softcommerce.beans.BeanItem;
import com.softcommerce.beans.Usuario;
import com.softcommerce.general.controles.CTable;
import com.softcommerce.general.tablas.ImpOcTableModel;
import com.softcommerce.reglasnegocio.RnOrdenCompra;
import com.softcommerce.reglasnegocio.RnAlmacen;
import com.softcommerce.reglasnegocio.RnItem;
import com.softcommerce.util.Constans;
import com.softcommerce.util.render.CellRendererImpOc;
import java.awt.BorderLayout;
import java.awt.Dimension;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.io.File;
import java.io.IOException;
import java.math.BigDecimal;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.HashMap;
import java.util.Map;
import javax.swing.JButton;
import javax.swing.JDialog;
import javax.swing.JFileChooser;
import javax.swing.JFrame;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import javax.swing.JScrollPane;
import jxl.Cell;
import jxl.Sheet;
import jxl.Workbook;
import jxl.read.biff.BiffException;
import org.apache.log4j.Logger;
import org.jdesktop.swingx.HorizontalLayout;

public class FormImportarOc
        extends JDialog
        implements ActionListener {

    private java.net.URL path;
    private Usuario usuario;
    private JButton btnImportar;
    static JFileChooser jChooser;
    public CTable table;
    public ImpOcTableModel modeltable;
    private JButton btnGuardar;
    private boolean swAlmacen = true;
    private boolean swItem = true;
    private final Logger logger = Logger.getLogger(FormImportarOc.class);

    public FormImportarOc(JFrame frame, Usuario usuario, java.net.URL ruta) {
        super(frame, true);
        this.usuario = usuario;
        this.path = ruta;
        initComponents();
    }

    private void initComponents() {
        modeltable = new ImpOcTableModel();
        table = new CTable();
        table.setModel(modeltable);
        for (int i = 0; i < modeltable.getColumnCount(); i++) {
            table.getColumnModel().getColumn(i).setCellRenderer(new CellRendererImpOc(modeltable));
        }
        table.setAllTableNoEditable();
        table.setAllColumnNoResizable();
        table.setAllColumnPreferredWidth();
        JScrollPane scrollTable = new JScrollPane(table);
        scrollTable.setPreferredSize(new Dimension(800, 450));
        getContentPane().add(scrollTable, BorderLayout.CENTER);
        JPanel pnlOpciones = new JPanel();
        btnGuardar = new JButton("Guardar");
        btnGuardar.addActionListener(this);
        pnlOpciones.add(btnGuardar);
        getContentPane().add(pnlOpciones, BorderLayout.SOUTH);

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
            if (!file.getName().endsWith("xls")) {
                JOptionPane.showMessageDialog(null, "Seleccione Excel solo con extension .xls", "Error", JOptionPane.ERROR_MESSAGE);
            } else {
                fillData(file);
                llenarData();
                modeltable.fireTableDataChanged();
                table.setAllColumnPreferredWidth();
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
            Map<String, BeanItem> mapItem = new HashMap();
            Almacen beanAlmacen;
            BeanItem beanItem;
            RnItem logicItem = new RnItem(path);
            RnAlmacen logicAlmacen = new RnAlmacen(path);
            RnOrdenCompra logicOc = new RnOrdenCompra(path);
            SimpleDateFormat formatoAnio = new SimpleDateFormat("yyyy");
            for (int i = 0; i < modeltable.getRowCount(); i++) {
                BeanImpOc beanOc = modeltable.getBeanImpOc(i);
                beanAlmacen = (Almacen) mapAlmacen.get(beanOc.getIdAlmacen());
                if (beanAlmacen != null) {
                    beanOc.setAlmacen(beanAlmacen.getDescripcion());
                } else {
                    beanAlmacen = logicAlmacen.cargarAlmacen(beanOc.getIdAlmacen(), "");
                    if (beanAlmacen != null) {
                        beanOc.setAlmacen(beanAlmacen.getDescripcion());
                        mapAlmacen.put(beanAlmacen.getIdAlmacen(), beanAlmacen);
                    }
                }
                beanItem = (BeanItem) mapItem.get(beanOc.getIdItem());
                if (beanItem != null) {
                    beanOc.setItem(beanItem.getDescripcion());
                } else {
                    beanItem = logicItem.cargarItem(beanOc.getIdItem(), "", false, Constans.ESTADO_ACTIVO);
                    if (beanItem != null) {
                        beanOc.setItem(beanItem.getDescripcion());
                        mapItem.put(beanItem.getIdItem(), beanItem);
                    }
                }
                if (beanOc.getAlmacen().trim().length() > 0 && beanOc.getItem().trim().length() > 0) {
                    beanOc.setSwCarga(logicOc.swExisteOcInvInicial(formatoAnio.format(beanOc.getFecha()),
                            beanOc.getIdAlmacen(), beanOc.getIdItem()));
                }
            }
            swItem = true;
            swAlmacen = true;
            if (modeltable.getRowCount() > 0) {
                if (mapAlmacen.size() > 1) {
                    JOptionPane.showMessageDialog(this, "solo se debe importar mercaderia de un solo almacen");
                    swAlmacen = false;
                } else {
                    swAlmacen = true;
                }
                if (swAlmacen) {
                    logger.info("mapItem.size(): " + mapItem.size());
                    logger.info("modeltable.getRowCount(): " + modeltable.getRowCount());
                    if (mapItem.size() != modeltable.getRowCount()) {
                        JOptionPane.showMessageDialog(this, "solo se debe importar un producto en un solo almacen");
                        swItem = false;
                    } else {
                        swItem = true;
                    }
                }
            }
        } catch (Exception e) {
            throw e;
        }
    }

    private void fillData(File file) throws ParseException, Exception {
        Workbook workbook = null;
        int j = -1;
        int x = -1;
        try {
            try {
                workbook = Workbook.getWorkbook(file);
            } catch (IOException ex) {
                ex.printStackTrace();
                throw ex;
            }
            Sheet sheet = workbook.getSheet(0);
            if (sheet.getColumns() != 5) {
                JOptionPane.showMessageDialog(this, "Numero de Columnas: 5");
                return;
            }
            System.out.println("Cols:" + sheet.getColumns());
            System.out.println("Rows:" + sheet.getRows());
            SimpleDateFormat fe = new SimpleDateFormat("dd/MM/yyyy");
            modeltable.clearTable();
            Cell cell;
            java.util.Date parsed;
            for (j = 1; j < sheet.getRows(); j++) {
                BeanImpOc beanOc = new BeanImpOc();
                x = 0;
                beanOc.setIdAlmacen(sheet.getCell(0, j).getContents().trim());
                beanOc.setAlmacen("");
                x = 1;
                cell = sheet.getCell(1, j);
                parsed = fe.parse(cell.getContents());
                beanOc.setFecha(new java.sql.Date(parsed.getTime()));
                x = 2;
                beanOc.setIdItem(sheet.getCell(2, j).getContents().trim());
                beanOc.setItem("");
                x = 3;
                beanOc.setCantidad(new BigDecimal(sheet.getCell(3, j).getContents().replace(",", ".")));
                x = 4;
                beanOc.setPrecio(new BigDecimal(sheet.getCell(4, j).getContents().replace(",", ".")));
                modeltable.setBeanImpOc(beanOc);
            }
            modeltable.fireTableDataChanged();
            table.setAllColumnPreferredWidth();
        } catch (BiffException e) {
            e.printStackTrace();
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

    private void guardarAsiento() {
        try {
            if (verificarDatos()) {
                guardarOc();
            }
        } catch (Exception ex) {
            ex.printStackTrace();
            JOptionPane.showMessageDialog(this, ex.getMessage());
        }
    }

    private void guardarOc() throws Exception {
        try {
            RnOrdenCompra logicOc = new RnOrdenCompra(path);
            String xmlOc;
            xmlOc = "<?xml version=\"1.0\" ?> ";
            xmlOc += "<OCS>";
            for (int i = 0; i < modeltable.getRowCount(); i++) {
                BeanImpOc beanOc = modeltable.getBeanImpOc(i);
                if (!beanOc.isSwCarga()) {
                    xmlOc += "<OC>";
                    xmlOc += "<ID_ITEM>" + beanOc.getIdItem() + "</ID_ITEM>";
                    xmlOc += "<CANTIDAD>" + beanOc.getCantidad().toString().replace(".", ",") + "</CANTIDAD>";
                    xmlOc += "<PRECIO>" + beanOc.getPrecio().toString().replace(".", ",") + "</PRECIO>";
                    xmlOc += "</OC>";
                }
            }
            xmlOc += "</OCS>";
            System.out.println("xml_Oc: " + xmlOc);
            xmlOc = xmlOc.replace("&", " ");
            SimpleDateFormat formatoAnio = new SimpleDateFormat("yyyy");
            String rpta = logicOc.insertOcInvInicial(formatoAnio.format(modeltable.getBeanImpOc(0).getFecha()),
                    modeltable.getBeanImpOc(0).getIdAlmacen(), usuario.getRuc(),
                    usuario.getId_usuario(), modeltable.getBeanImpOc(0).getFecha(), xmlOc);
            JOptionPane.showMessageDialog(this, rpta);
            modeltable.clearTable();
            table.setAllColumnPreferredWidth();

        } catch (Exception ex) {
            throw ex;
        }
    }

    private boolean verificarDatos() {
        if (modeltable.getRowCount() == 0) {
            JOptionPane.showMessageDialog(this, "No hay datos que registrar");
            return false;
        }
        if (!swAlmacen) {
            JOptionPane.showMessageDialog(this, "solo se debe importar mercaderia de un solo almacen");
            return false;
        }
        if (!swItem) {
            JOptionPane.showMessageDialog(this, "solo se debe importar un producto en un solo almacen");
            return false;
        }
        String fecha = "";
        SimpleDateFormat formato = new SimpleDateFormat("dd/MM/yyyy");
        for (int i = 0; i < modeltable.getRowCount(); i++) {
            BeanImpOc beanOc = modeltable.getBeanImpOc(i);
            if (beanOc.getAlmacen().trim().length() == 0) {
                JOptionPane.showMessageDialog(this, "Almacen no se encuntra registrado, Fila: " + (i + 1));
                return false;
            }
            if (beanOc.getItem().trim().length() == 0) {
                JOptionPane.showMessageDialog(this, "Item no se encuntra registrado, Fila: " + (i + 1));
                return false;
            }
            if (i > 0) {
                if (!fecha.equals(formato.format(beanOc.getFecha()))) {
                    JOptionPane.showMessageDialog(this, "Todas la filas deben tener la misma fecha");
                    return false;
                }
            } else {
                fecha = formato.format(beanOc.getFecha());
            }
        }
        return true;
    }

    @Override
    public void actionPerformed(ActionEvent ae) {
        if (ae.getSource() == btnImportar) {
            importarExcel();
        }
        if (ae.getSource() == btnGuardar) {
            guardarAsiento();
        }
    }

}
