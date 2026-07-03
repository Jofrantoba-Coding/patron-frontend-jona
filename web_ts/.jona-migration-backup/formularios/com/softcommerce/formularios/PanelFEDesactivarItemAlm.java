/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.softcommerce.formularios;

import com.softcommerce.beans.ConfiguracionItemAlmacen;
import com.softcommerce.general.tablas.DesactivarItemTableModel;
import com.softcommerce.iconos.Gif;
import com.softcommerce.logic.LogicDesactivarItem;
import com.softcommerce.util.render.CellRendererImageEstado;

import javax.swing.JInternalFrame;
import javax.swing.JTable;
import javax.swing.JPanel;
import java.awt.Color;
import javax.swing.border.LineBorder;
import javax.swing.JTextField;
import javax.swing.table.DefaultTableModel;
import javax.swing.JScrollPane;
import javax.swing.JLabel;
import javax.swing.JComboBox;
import javax.swing.JButton;
import java.awt.Button;
import java.awt.Dimension;
import java.awt.event.ActionListener;
import java.awt.event.ActionEvent;
import java.awt.event.KeyAdapter;
import java.awt.event.KeyEvent;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.swing.DefaultComboBoxModel;
import javax.swing.ImageIcon;
import javax.swing.JOptionPane;
import javax.swing.RowFilter;
import javax.swing.table.TableRowSorter;

public class PanelFEDesactivarItemAlm extends JInternalFrame {

    private JTable table;
    private JScrollPane scrollPane;
    private JPanel panel;
    private JTextField txtCantidad;
    private JTextField txtBusqueda;
    private JTextField txtBusquedaId;
    JComboBox cboTipo;
    private JButton btnBuscar;
    private LogicDesactivarItem logica;
    private java.net.URL path;
    private ArrayList<ConfiguracionItemAlmacen> lista = new ArrayList<ConfiguracionItemAlmacen>();
    private Button btnSeleccionar;
    private JTextField txtTotal;
    private JLabel lblTotal;
    private DesactivarItemTableModel modelo;
    private TableRowSorter<DesactivarItemTableModel> modeloOrdenado;

    /**
     * Launch the application.
     */
    public PanelFEDesactivarItemAlm(final java.net.URL path) {
        setBounds(100, 100, 450, 300);
        getContentPane().setLayout(null);
        this.path = path;
        panel = new JPanel();
        panel.setBounds(10, 84, 680, 250);
        getContentPane().add(panel);
        panel.setLayout(null);
        setIconifiable(true);
        setMaximizable(true);
        setClosable(true);
        this.setSize(1200, 400);
        scrollPane = new JScrollPane();
        scrollPane.setBounds(10, 78, 394, 87);
        scrollPane.setSize(new Dimension(1050, 150));
        panel.add(scrollPane);
        panel.setSize(1180, 250);
        panel.setBorder(new LineBorder(new Color(0, 0, 0)));

        table = new JTable();
        scrollPane.setViewportView(table);
        table.setModel(new DefaultTableModel(
                new Object[][]{
            {null, null, null, null, null, null},},
                new String[]{
            "Cod.Item", "Descrip.Item", "Cod.Alamcen", "Descrip.Almacen", "Estado", "Seleccionar"
        }) {
            Class[] columnTypes = new Class[]{
                Object.class, Object.class, Object.class, Object.class, Object.class, Boolean.class
            };

            public Class getColumnClass(int columnIndex) {
                return columnTypes[columnIndex];
            }
        });
        table.setBorder(new LineBorder(new Color(0, 0, 0)));
        table.setSize(900, 100);
        // table.setPreferredSize(new Dimension(680, 250));
        Button btnActivar = new Button("Activar");
        btnActivar.addActionListener(new ActionListener() {
            public void actionPerformed(ActionEvent arg0) {
                try {
                    activarItemAlmacen();
                } catch (SQLException ex) {
                    Logger.getLogger(PanelFEDesactivarItemAlm.class.getName()).log(Level.SEVERE, null, ex);
                } catch (Exception ex) {
                    Logger.getLogger(PanelFEDesactivarItemAlm.class.getName()).log(Level.SEVERE, null, ex);
                }
            }
        });
        btnActivar.setBounds(10, 10, 96, 22);
        panel.add(btnActivar);

        Button btnDesactivar = new Button("Desactivar");
        btnDesactivar.addActionListener(new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                try {
                    desactivarItemAlmacen();

                } catch (SQLException ex) {
                    Logger.getLogger(PanelFEDesactivarItemAlm.class.getName()).log(Level.SEVERE, null, ex);
                } catch (Exception ex) {
                    Logger.getLogger(PanelFEDesactivarItemAlm.class.getName()).log(Level.SEVERE, null, ex);
                }
            }
        });
        btnDesactivar.setBounds(119, 10, 96, 22);
        panel.add(btnDesactivar);

        btnSeleccionar = new Button("Seleccionar Todos");
        btnSeleccionar.addActionListener(new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                seleccionarTodos();
            }
        });
        btnSeleccionar.setBounds(820, 51, 205, 22);
        panel.add(btnSeleccionar);

        JLabel lblInactivo = new JLabel("Inactivo hace:");
        lblInactivo.setBounds(20, 21, 89, 14);
        getContentPane().add(lblInactivo);

        txtCantidad = new JTextField();
        txtCantidad.setBounds(109, 18, 66, 20);
        getContentPane().add(txtCantidad);
        txtCantidad.setColumns(10);

        cboTipo = new JComboBox();
        cboTipo.setBounds(191, 18, 101, 20);
        cboTipo.setModel(new DefaultComboBoxModel(new String[]{"Mes", "Año"}));
        getContentPane().add(cboTipo);

        JLabel lblItem = new JLabel("Descripcion");

        lblItem.setBounds(20, 59, 50, 14);

        getContentPane().add(lblItem);

        JLabel lblItemId = new JLabel("Id Item");
        lblItemId.setBounds(280, 59, 46, 14);
        getContentPane().add(lblItemId);
        
        txtBusqueda = new JTextField();
        txtBusqueda.setColumns(10);
        txtBusqueda.setBounds(99, 56, 153, 20);
        
        txtBusquedaId = new JTextField();
        txtBusquedaId.setColumns(10);
        txtBusquedaId.setBounds(320, 56, 53, 20);

        txtBusqueda.addKeyListener(new KeyAdapter() {
            @Override
            public void keyReleased(KeyEvent e) {
                filtrar();
            }
        });
        txtBusquedaId.addKeyListener(new KeyAdapter() {
            @Override
            public void keyReleased(KeyEvent e) {
                filtrar();
            }
        });
        getContentPane().add(txtBusqueda);
        getContentPane().add(txtBusquedaId);

        txtTotal = new JTextField();
        txtTotal.setEditable(false);
        txtTotal.setEnabled(false);
        txtTotal.setBounds(53, 44, 54, 20);
        panel.add(txtTotal);
        txtTotal.setColumns(10);

        lblTotal = new JLabel("Total");
        lblTotal.setBounds(14, 47, 46, 14);
        panel.add(lblTotal);

        btnBuscar = new JButton("Buscar");
        btnBuscar.addActionListener(new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                try {
                    buscarItemSinMovimiento();
                } catch (SQLException ex) {
                    Logger.getLogger(PanelFEDesactivarItemAlm.class.getName()).log(Level.SEVERE, null, ex);
                } catch (Exception ex) {
                    Logger.getLogger(PanelFEDesactivarItemAlm.class.getName()).log(Level.SEVERE, null, ex);
                }

            }
        });        
        Gif gif=new Gif();
        btnBuscar.setIcon(gif.BUSCAR);
        btnBuscar.setBounds(308, 17, 93, 21);
        getContentPane().add(btnBuscar);
        this.setPreferredSize(new Dimension(700, 500));


   }

    public void filtrar() {
        modeloOrdenado.setRowFilter(getFilter());
        this.table.setModel(modelo);
        this.table.setRowSorter(modeloOrdenado);
        this.table.repaint();
        if (table.getRowCount() > 0) {
            table.setRowSelectionInterval(0, 0);
        }
    }

    public RowFilter<Object, Object> getFilter() {
        // this.table.setModel(this.modelo);
        List<RowFilter<Object, Object>> filters = new ArrayList<RowFilter<Object, Object>>();
        String val;
        if (this.txtBusqueda.getText().trim().length() > 0) {
            val = this.txtBusqueda.getText().trim().toUpperCase();
            filters.add(RowFilter.regexFilter(".*" + val + ".*", 1));
        }
        if (this.txtBusquedaId.getText().trim().length() > 0) {
            val = this.txtBusquedaId.getText().trim().toUpperCase();
            filters.add(RowFilter.regexFilter(".*" + val + ".*", 0));
        }


        RowFilter<Object, Object> fooBarFilter = RowFilter.andFilter(filters);

        return fooBarFilter;
    }

    public void buscarItemSinMovimiento() throws SQLException, Exception {
        logica = new LogicDesactivarItem(path);
        String tipo = this.cboTipo.getSelectedItem().toString();
        if (!this.txtCantidad.getText().equals("")) {
            lista = logica.listarItemSinMovimiento(this.txtCantidad.getText(), tipo);
            modelo = new DesactivarItemTableModel(lista);
        }

        modeloOrdenado = new TableRowSorter<DesactivarItemTableModel>(modelo);
        this.table.setModel(modelo);
        table.setRowSorter(modeloOrdenado);

        this.table.getColumnModel().getColumn(0).setPreferredWidth(50);
        this.table.getColumnModel().getColumn(1).setPreferredWidth(250);
        this.table.getColumnModel().getColumn(2).setPreferredWidth(100);
        this.table.getColumnModel().getColumn(3).setPreferredWidth(200);
        this.table.getColumnModel().getColumn(4).setPreferredWidth(50);
        this.table.getColumnModel().getColumn(5).setPreferredWidth(50);
        this.table.getColumnModel().getColumn(4).setCellRenderer(new CellRendererImageEstado());
        this.txtTotal.setText(String.valueOf(this.table.getRowCount()));
    }

    public void seleccionarTodos() {

        String a = this.btnSeleccionar.getLabel();
        DesactivarItemTableModel model = (DesactivarItemTableModel) this.table.getModel();
        if (this.btnSeleccionar.getLabel().equals("Quitar Selección")) {
            this.btnSeleccionar.setLabel("Seleccionar Todos");
            for (int i = 0; i < this.table.getRowCount(); i++) {
                model.setValueAt(Boolean.FALSE, i, 5);
            }
            this.table.setModel(model);
            this.repaint();
        } else {
            this.btnSeleccionar.setLabel("Quitar Selección");
            for (int i = 0; i < this.table.getRowCount(); i++) {
                model.setValueAt(Boolean.TRUE, i, 5);
            }
            this.table.setModel(model);
            this.repaint();
        }

    }

    public void activarItemAlmacen() throws SQLException, Exception {
        ArrayList codigoItem = new ArrayList();
        ArrayList codigoAlmacen = new ArrayList();
        DesactivarItemTableModel model = (DesactivarItemTableModel) this.table.getModel();
        for (int i = 0; i < this.table.getRowCount(); i++) {
            if (model.getValueAt(i, 5) == Boolean.TRUE) {
                codigoItem.add(model.getValueAt(i, 0));
                codigoAlmacen.add(model.getValueAt(i, 2));
            }
        }
        if (logica.activarItemAlmacen(codigoItem, codigoAlmacen)) {
            JOptionPane.showMessageDialog(this, "Se activaron todos los item seleccionados",
                    "Información del Sistema", JOptionPane.INFORMATION_MESSAGE);
        } else {
            JOptionPane.showMessageDialog(this, "Error no se pudieron activar",
                    "Información del Sistema", JOptionPane.INFORMATION_MESSAGE);
        }

        this.buscarItemSinMovimiento();

    }

    public void desactivarItemAlmacen() throws SQLException, Exception {
        ArrayList codigoItem = new ArrayList();
        ArrayList codigoAlmacen = new ArrayList();
        DesactivarItemTableModel model = (DesactivarItemTableModel) this.table.getModel();
        for (int i = 0; i < this.table.getRowCount(); i++) {
            if (model.getValueAt(i, 5) == Boolean.TRUE) {
                codigoItem.add(model.getValueAt(i, 0));
                codigoAlmacen.add(model.getValueAt(i, 2));
            }
        }
        if (logica.desactivarItemAlmacen(codigoItem, codigoAlmacen)) {
            JOptionPane.showMessageDialog(this, "Se desactivaron todos los item seleccionados",
                    "Información del Sistema", JOptionPane.INFORMATION_MESSAGE);
            this.buscarItemSinMovimiento();
        } else {
            JOptionPane.showMessageDialog(this, "Error no se pudieron desactivar",
                    "Información del Sistema", JOptionPane.INFORMATION_MESSAGE);
        }
        this.buscarItemSinMovimiento();

    }
}
