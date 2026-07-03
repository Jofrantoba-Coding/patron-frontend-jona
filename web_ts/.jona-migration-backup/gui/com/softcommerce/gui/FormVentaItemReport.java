/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.softcommerce.gui;

import com.softcommerce.comboboxmodel.ComboModelFamilia;
import com.softcommerce.comboboxmodel.ComboModelItem;
import com.softcommerce.comboboxmodel.ComboModelMarca;
import com.softcommerce.entity.BeanVentaXItem;
import com.softcommerce.entity.Item;
import com.softcommerce.logic.LogicFamilia;
import com.softcommerce.logic.LogicItem;
import com.softcommerce.logic.LogicMarca;
import com.softcommerce.logic.LogicReporte;
import com.softcommerce.tablemodel.TableModelItem;
import com.softcommerce.util.ExportarToExcel;
import com.toedter.calendar.JDateChooser;
import java.awt.Dimension;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.ItemEvent;
import java.awt.event.ItemListener;
import java.awt.event.KeyEvent;
import java.awt.event.KeyListener;
import java.io.File;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.swing.JComboBox;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.JTable;
import javax.swing.RowFilter;
import javax.swing.table.DefaultTableModel;
import javax.swing.table.TableRowSorter;
import javax.swing.text.JTextComponent;

/**
 *
 * @author Administrador
 */
public class FormVentaItemReport extends javax.swing.JDialog {

    private JLabel lblFechaInicio;
    private JDateChooser dc_fechainicio;
    private JLabel lblFechaFin;
    private JDateChooser dc_fechafin;
    private JLabel lblFamilia;
    private JComboBox cboFamilia;
    private JLabel lblMarca;
    private JComboBox cboMarca;
    private ComboModelFamilia cboModelFamilia;
    private ComboModelMarca cboModelMarca;
    private java.net.URL path;
    private ComboModelItem cboModelItem;
    private TableModelItem modelItem;
    private String seleccionado = "N";

    /**
     * Creates new form FormVentaItemReport
     */
    public FormVentaItemReport(java.net.URL ruta) {
        try {
            path = ruta;
            initComponents();
            init();
        } catch (ClassNotFoundException ex) {
            Logger.getLogger(FormVentaItemReport.class.getName()).log(Level.SEVERE, null, ex);
            JOptionPane.showMessageDialog(null, ex.getMessage());

        } catch (InstantiationException ex) {
            Logger.getLogger(FormVentaItemReport.class.getName()).log(Level.SEVERE, null, ex);
            JOptionPane.showMessageDialog(null, ex.getMessage());
        } catch (IllegalAccessException ex) {
            Logger.getLogger(FormVentaItemReport.class.getName()).log(Level.SEVERE, null, ex);
            JOptionPane.showMessageDialog(null, ex.getMessage());
        } catch (Exception ex) {
            Logger.getLogger(FormVentaItemReport.class.getName()).log(Level.SEVERE, null, ex);
            JOptionPane.showMessageDialog(null, ex.getMessage());
        }
    }

    private void init() throws ClassNotFoundException, InstantiationException, InstantiationException, IllegalAccessException, Exception {
        cboModelMarca = new ComboModelMarca((new LogicMarca(path)).listarMarca());
        cboModelFamilia = new ComboModelFamilia((new LogicFamilia(path)).listarFamilia());
        cboModelItem = new ComboModelItem((new LogicItem(path)).listarItemRSA());
        lblFechaInicio = new JLabel("Fecha Inicio");
        dc_fechainicio = new JDateChooser("dd/MM/yyyy", "##/##/####", '_');
        dc_fechainicio.setDate(new Date());
        dc_fechainicio.setPreferredSize(new Dimension(125, 25));
        lblFechaFin = new JLabel("Fecha Fin");
        dc_fechafin = new JDateChooser("dd/MM/yyyy", "##/##/####", '_');
        dc_fechafin.setDate(new Date());
        dc_fechafin.setPreferredSize(new Dimension(125, 25));
        lblFamilia = new JLabel("Familia");
        cboFamilia = new JComboBox();
        lblMarca = new JLabel("Marca");
        cboMarca = new JComboBox();

        tlbFechas.add(lblFechaInicio);
        tlbFechas.add(dc_fechainicio);
        tlbFechas.addSeparator();
        tlbFechas.add(lblFechaFin);
        tlbFechas.add(dc_fechafin);
        tlbFechas.addSeparator();
        tlbFechas.add(lblFamilia);
        tlbFechas.add(cboFamilia);
        tlbFechas.addSeparator();
        cboFamilia.setModel(cboModelFamilia);
        cboFamilia.setEditable(true);
        tlbFechas.add(lblMarca);
        tlbFechas.add(cboMarca);
        cboMarca.setModel(cboModelMarca);
        cboMarca.setEditable(true);
        cboProducto.setModel(cboModelItem);
        modelItem = new TableModelItem((new LogicItem(path)).listarItem());
        tableData.setModel(modelItem);
        ((JTextComponent) cboFamilia.getEditor().getEditorComponent()).addKeyListener(keyListener);
        ((JTextComponent) cboMarca.getEditor().getEditorComponent()).addKeyListener(keyListener);
        ((JTextComponent) cboProducto.getEditor().getEditorComponent()).addKeyListener(keyListener);
        cboFamilia.addItemListener(itemListener);
        cboMarca.addItemListener(itemListener);
        cboProducto.addItemListener(itemListener);
        chkSeleccionar.addActionListener(actionListener);
        tableData.setAutoCreateRowSorter(true);
        tableData.getColumnModel().getColumn(0).setPreferredWidth(10);
        tableData.getColumnModel().getColumn(1).setPreferredWidth(70);
        tableData.getColumnModel().getColumn(2).setPreferredWidth(70);
        tableData.getColumnModel().getColumn(3).setPreferredWidth(70);
        tableData.getColumnModel().getColumn(4).setPreferredWidth(350);
    }
    ActionListener actionListener = new ActionListener() {
        @Override
        public void actionPerformed(ActionEvent e) {
            if (chkSeleccionar.equals(e.getSource())) {
                if (chkSeleccionar.isSelected()) {
                    ArrayList<Item> array = modelItem.getData();
                    int numeroFilas = tableData.getRowCount();
                    for (int rownum = 0; rownum < numeroFilas; rownum++) {
                        int modelrow = tableData.convertRowIndexToModel(rownum);
                        array.get(modelrow).setIsSelected(true);
                    }

                    modelItem.setEditable(false);
                    modelItem.fireTableDataChanged();

                    for (int i = 0; i < array.size(); i++) {
                        if (array.get(i).isIsSelected()) {
                            seleccionado = "T";
                        } else {
                            seleccionado = "N";
                            break;
                        }
                    }

                } else {
                    ArrayList<Item> array = modelItem.getData();
                    for (int i = 0; i < array.size(); i++) {
                        array.get(i).setIsSelected(false);
                    }
                    modelItem.setEditable(true);
                    modelItem.fireTableDataChanged();
                    seleccionado = "N";
                }
            }
        }
    };

    /**
     * This method is called from within the constructor to initialize the form.
     * WARNING: Do NOT modify this code. The content of this method is always
     * regenerated by the Form Editor.
     */
    @SuppressWarnings("unchecked")
    // <editor-fold defaultstate="collapsed" desc="Generated Code">//GEN-BEGIN:initComponents
    private void initComponents() {

        jPanel1 = new javax.swing.JPanel();
        jScrollPane1 = new javax.swing.JScrollPane();
        tableData = new javax.swing.JTable();
        jPanel2 = new javax.swing.JPanel();
        tlbFechas = new javax.swing.JToolBar();
        tlbProducto = new javax.swing.JToolBar();
        jLabel1 = new javax.swing.JLabel();
        cboProducto = new javax.swing.JComboBox();
        jToolBar1 = new javax.swing.JToolBar();
        chkSeleccionar = new javax.swing.JCheckBox();
        jPanel3 = new javax.swing.JPanel();
        btnGenerarReporte = new javax.swing.JButton();

        setDefaultCloseOperation(javax.swing.WindowConstants.DISPOSE_ON_CLOSE);

        jPanel1.setBorder(javax.swing.BorderFactory.createEtchedBorder());
        jPanel1.setLayout(new java.awt.BorderLayout());

        tableData.setModel(new javax.swing.table.DefaultTableModel(
            new Object [][] {

            },
            new String [] {

            }
        ));
        jScrollPane1.setViewportView(tableData);

        jPanel1.add(jScrollPane1, java.awt.BorderLayout.CENTER);

        getContentPane().add(jPanel1, java.awt.BorderLayout.CENTER);

        jPanel2.setBorder(javax.swing.BorderFactory.createEtchedBorder());
        jPanel2.setLayout(new java.awt.BorderLayout());

        tlbFechas.setRollover(true);
        jPanel2.add(tlbFechas, java.awt.BorderLayout.PAGE_START);

        tlbProducto.setRollover(true);

        jLabel1.setText("PRODUCTO");
        tlbProducto.add(jLabel1);

        cboProducto.setEditable(true);
        tlbProducto.add(cboProducto);

        jPanel2.add(tlbProducto, java.awt.BorderLayout.CENTER);

        jToolBar1.setRollover(true);

        chkSeleccionar.setText("Seleccionar Todo");
        chkSeleccionar.setFocusable(false);
        chkSeleccionar.setHorizontalTextPosition(javax.swing.SwingConstants.CENTER);
        chkSeleccionar.setVerticalTextPosition(javax.swing.SwingConstants.BOTTOM);
        jToolBar1.add(chkSeleccionar);

        jPanel2.add(jToolBar1, java.awt.BorderLayout.PAGE_END);

        getContentPane().add(jPanel2, java.awt.BorderLayout.PAGE_START);

        jPanel3.setBorder(javax.swing.BorderFactory.createEtchedBorder());
        jPanel3.setLayout(new java.awt.BorderLayout());

        btnGenerarReporte.setText("Generar Reporte");
        btnGenerarReporte.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                btnGenerarReporteActionPerformed(evt);
            }
        });
        jPanel3.add(btnGenerarReporte, java.awt.BorderLayout.CENTER);

        getContentPane().add(jPanel3, java.awt.BorderLayout.PAGE_END);

        pack();
    }// </editor-fold>//GEN-END:initComponents

    private String retornaListaSeleccionados() {
        String dataItem = "";
        ArrayList<Item> array = modelItem.getData();
        for (int i = 0; i < array.size(); i++) {
            if (array.get(i).isIsSelected()) {
                dataItem = dataItem + array.get(i).getIdItem() + ",";
            }
        }
        dataItem = dataItem.substring(0, dataItem.length() - 1);
        System.out.println(dataItem);
        return dataItem;
    }

    private void btnGenerarReporteActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_btnGenerarReporteActionPerformed
        try {
            LogicReporte obj = new LogicReporte(path);
            List<BeanVentaXItem> Lista = obj.ListaVentaItem_v2(dc_fechainicio.getDate(), dc_fechafin.getDate(), retornaListaSeleccionados());

            Object[] columnas = {"F. Emision", "Abrev.", "Serie", "PreImpreso", "IdAnexo", "Numero", "Cliente", "Id_item", "Item", "Marca", "Unidad", "Cantidad", "PrecioItem", "Monto", "Almacen", "Percepcion", "M_Percecion"};
            DefaultTableModel modelo = new DefaultTableModel(null, columnas);
            for (int i = 0; i < Lista.size(); i++) {
                Object[] data = new Object[17];
                data[0] = Lista.get(i).getF_emision();
                data[1] = Lista.get(i).getAbrev();
                data[2] = Lista.get(i).getSerie();
                data[3] = Lista.get(i).getPreimpreso();
                data[4] = Lista.get(i).getId_anexo();
                data[5] = Lista.get(i).getNumero();
                data[6] = Lista.get(i).getCliente();
                data[7] = Lista.get(i).getId_item();
                data[8] = Lista.get(i).getItem();
                data[9] = Lista.get(i).getMarca();
                data[10] = Lista.get(i).getUnidad();
                data[11] = Lista.get(i).getCantidad();
                data[12] = Lista.get(i).getPrecio_item();
                data[13] = Lista.get(i).getMonto();
                data[14] = Lista.get(i).getAlmacen();
                data[15] = Lista.get(i).getPercepcion();
                data[16] = Lista.get(i).getM_percepcion();

                modelo.addRow(data);
            }

            JTable table = new JTable(modelo);

            File archivo = File.createTempFile("report" + (new Date()).getTime(), ".xlsx");
            archivo.deleteOnExit();
            System.out.println("Exportar");
            ExportarToExcel export = new ExportarToExcel(archivo, table);
            if (export.exportarJTableToExcel()) {
                JOptionPane.showMessageDialog(null, "Reporte Generado Correctamente");
            } else {
                JOptionPane.showMessageDialog(null, "Error al generar");
            }
        } catch (Exception ex) {
            JOptionPane.showMessageDialog(null, ex.getMessage());
        }
    }//GEN-LAST:event_btnGenerarReporteActionPerformed
    /**
     * @param args the command line arguments
     */
    // Variables declaration - do not modify//GEN-BEGIN:variables
    private javax.swing.JButton btnGenerarReporte;
    private javax.swing.JComboBox cboProducto;
    private javax.swing.JCheckBox chkSeleccionar;
    private javax.swing.JLabel jLabel1;
    private javax.swing.JPanel jPanel1;
    private javax.swing.JPanel jPanel2;
    private javax.swing.JPanel jPanel3;
    private javax.swing.JScrollPane jScrollPane1;
    private javax.swing.JToolBar jToolBar1;
    private javax.swing.JTable tableData;
    private javax.swing.JToolBar tlbFechas;
    private javax.swing.JToolBar tlbProducto;
    // End of variables declaration//GEN-END:variables

    private void filtrarTabla(JTable tabla, TableModelItem model) {
        TableRowSorter<TableModelItem> sorter = new TableRowSorter<TableModelItem>(model);
        RowFilter<TableModelItem, Object> rf1 = null;
        RowFilter<TableModelItem, Object> rf2 = null;
        RowFilter<TableModelItem, Object> rf3 = null;
        List<RowFilter<TableModelItem, Object>> rfs = new ArrayList<RowFilter<TableModelItem, Object>>(3);
        try {
            rf1 = RowFilter.regexFilter(".*" + ((JTextComponent) cboProducto.getEditor().getEditorComponent()).getText() + ".*", 4);
            rf2 = RowFilter.regexFilter(".*" + ((JTextComponent) cboFamilia.getEditor().getEditorComponent()).getText() + ".*", 2);
            rf3 = RowFilter.regexFilter(".*" + ((JTextComponent) cboMarca.getEditor().getEditorComponent()).getText() + ".*", 3);
            rfs.add(rf1);
            rfs.add(rf2);
            rfs.add(rf3);
            RowFilter<TableModelItem, Object> af = RowFilter.andFilter(rfs);
            sorter.setRowFilter(af);
            tabla.setRowSorter(sorter);
        } catch (Exception ex) {
            return;
        }
    }
    KeyListener keyListener = new KeyListener() {
        @Override
        public void keyTyped(KeyEvent e) {
        }

        @Override
        public void keyPressed(KeyEvent e) {
        }

        @Override
        public void keyReleased(KeyEvent e) {
            if (e.getSource().equals((JTextComponent) cboFamilia.getEditor().getEditorComponent())) {
                filtrarTabla(tableData, modelItem);
            } else if (e.getSource().equals((JTextComponent) cboMarca.getEditor().getEditorComponent())) {
                filtrarTabla(tableData, modelItem);
            } else if (e.getSource().equals((JTextComponent) cboProducto.getEditor().getEditorComponent())) {
                filtrarTabla(tableData, modelItem);
            }
        }
    };
    ItemListener itemListener = new ItemListener() {
        public void itemStateChanged(ItemEvent e) {
            if (e.getSource().equals(cboFamilia)) {
                cboFamilia.getEditor().setItem(cboFamilia.getSelectedItem());
                filtrarTabla(tableData, modelItem);
            } else if (e.getSource().equals(cboMarca)) {
                cboMarca.getEditor().setItem(cboMarca.getSelectedItem());
                filtrarTabla(tableData, modelItem);
            } else if (e.getSource().equals(cboProducto)) {
                cboProducto.getEditor().setItem(cboProducto.getSelectedItem());
                filtrarTabla(tableData, modelItem);
            }
        }
    };
}
