/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.softcommerce.formularios;

import com.softcommerce.beans.DocumentoCosteo;
import com.softcommerce.beans.Usuario;
import com.softcommerce.general.controles.CuadroMensaje;
import com.softcommerce.reglasnegocio.rn_DocumentoCosteo;
import java.awt.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.MouseAdapter;
import java.awt.event.MouseEvent;
import java.util.List;
import javax.swing.*;
import javax.swing.border.TitledBorder;
import javax.swing.table.DefaultTableModel;
import org.jdesktop.swingx.JXTable;
import org.jdesktop.swingx.decorator.HighlighterFactory;

public class PnlMostrarTipoMovimientosFormula extends JDialog {

    private static final long serialVersionUID = 1L;
    private JScrollPane scrollPane;
    private JXTable table;
    private DefaultTableModel modelo;
    private JButton btnExportar;
    private CuadroMensaje cuadro;
    private java.net.URL path;
    private Usuario usuario;
    private JPanel panel;
    private JButton btnEliminar;

    public PnlMostrarTipoMovimientosFormula(java.net.URL path, Usuario user,Frame arg0) {

        this.path = path;
        usuario = user;
        cuadro = new CuadroMensaje(usuario);
        GridBagLayout gridBagLayout = new GridBagLayout();
        gridBagLayout.columnWidths = new int[]{330, 100, 0};
        gridBagLayout.rowHeights = new int[]{234, 22, 0};
        gridBagLayout.columnWeights = new double[]{0.0, 0.0, Double.MIN_VALUE};
        gridBagLayout.rowWeights = new double[]{0.0, 0.0, Double.MIN_VALUE};
        getContentPane().setLayout(gridBagLayout);
        GridBagConstraints gbc_panel = new GridBagConstraints();
        gbc_panel.fill = GridBagConstraints.BOTH;
        gbc_panel.insets = new Insets(0, 0, 5, 0);
        gbc_panel.gridwidth = 2;
        gbc_panel.gridx = 0;
        gbc_panel.gridy = 0;
        getContentPane().add(getPanel(), gbc_panel);
        GridBagConstraints gbc_btnEliminar = new GridBagConstraints();
        gbc_btnEliminar.weighty = 0.5;
        gbc_btnEliminar.anchor = GridBagConstraints.SOUTHEAST;
        gbc_btnEliminar.gridx = 0;
        gbc_btnEliminar.gridy = 1;
        getContentPane().add(getBtnEliminar(), gbc_btnEliminar);
        GridBagConstraints gbc_btnExportar = new GridBagConstraints();
        gbc_btnExportar.weightx = 0.5;
        gbc_btnExportar.anchor = GridBagConstraints.SOUTHEAST;
        gbc_btnExportar.gridx = 1;
        gbc_btnExportar.gridy = 1;        
        getContentPane().add(getBtnExportar(), gbc_btnExportar);

    }

    private JPanel getPanel() {
        if (panel == null) {
            panel = new JPanel();
            panel.setBorder(new TitledBorder(null, "Tipo Movimientos Formula", TitledBorder.LEADING, TitledBorder.TOP, null, null));
            GridBagLayout gbl_panel = new GridBagLayout();
            gbl_panel.columnWidths = new int[]{0, 0};
            gbl_panel.rowHeights = new int[]{0, 0};
            gbl_panel.columnWeights = new double[]{1.0, Double.MIN_VALUE};
            gbl_panel.rowWeights = new double[]{1.0, Double.MIN_VALUE};
            panel.setLayout(gbl_panel);
            GridBagConstraints gbc_scrollPane = new GridBagConstraints();
            gbc_scrollPane.fill = GridBagConstraints.BOTH;
            gbc_scrollPane.gridx = 0;
            gbc_scrollPane.gridy = 0;
            panel.add(getScrollPane(), gbc_scrollPane);
        }
        return panel;
    }

    private JScrollPane getScrollPane() {
        if (scrollPane == null) {
            scrollPane = new JScrollPane();
            scrollPane.setViewportView(getTable());
        }
        return scrollPane;
    }

    private JXTable getTable() {
        if (table == null) {
            table = new JXTable() {
                /**
                 *
                 */
                private static final long serialVersionUID = 1L;

                public String getToolTipText(MouseEvent e) {
                    String tip = null;
                    java.awt.Point p = e.getPoint();
                    int rowIndex = rowAtPoint(p);
                    int colIndex = columnAtPoint(p);

                    try {
                        if (colIndex != 0) {
                            tip = getValueAt(rowIndex, colIndex).toString();
                        }
                    } catch (RuntimeException e1) {
                    }
                    return tip;
                }
            };
            table.addMouseListener(new MouseAdapter() {
                @Override
                public void mouseClicked(MouseEvent e) {
                    /*
                     int fila = -1;
                     fila = table.getSelectedRow();
                     if(fila != -1){
                     //AsignaDatos(fila);
                     }
                     */
                    if (e.getClickCount() == 2) {
                        //ReporteFormatoInforme();
                    }
                }
            });
            table.setHorizontalScrollEnabled(true);
            table.setEditable(false);
            table.getTableHeader().setReorderingAllowed(false);
            table.setFont(new Font("Tahoma", Font.PLAIN, 11));
            table.setHighlighters(HighlighterFactory.createAlternateStriping(new Color(240, 248, 255), new Color(255, 255, 240)));
            InicializaTabla();
            CargaDatos();
        }
        return table;
    }

    private void InicializaTabla() {
        String[] columnas = {"ID_TIPO_MOV", "TIPO DE MOVIMIENTO", "FÓRMULA"};

        modelo = new DefaultTableModel(null, columnas);
        getTable().setModel(modelo);

        getTable().getColumn(0).setMinWidth(300);
        getTable().getColumn(0).setMaxWidth(300);

        getTable().getColumn(1).setMinWidth(300);
        getTable().getColumn(1).setMaxWidth(300);        
    }

    private JButton getBtnExportar() {
        if (btnExportar == null) {
            btnExportar = new JButton("Exportar");            
            btnExportar.setMinimumSize(new Dimension(100,22));
            btnExportar.setPreferredSize(new Dimension(100,22));
            btnExportar.setMaximumSize(new Dimension(100,22));
        }
        return btnExportar;
    }
    
    private void CargaDatos(){
        try{
            rn_DocumentoCosteo obj = new rn_DocumentoCosteo(path);
            List<DocumentoCosteo> Lista = obj.ListaFormulas("");
            
            for(int i=0; i<Lista.size(); i++){
                Object[] data = new Object[3];
                data[0] = Lista.get(i).getID_TIPO_MOV();
                data[1] = Lista.get(i).getDESCRIPCION_MOV();
                data[2] = Lista.get(i).getDESCRIPCION();
                
                modelo.addRow(data);
            }
            
            getTable().setModel(modelo);            
        } catch(Exception ex){
            cuadro.CuadroAviso("Error al cargar datos", JOptionPane.ERROR_MESSAGE);
            ex.printStackTrace();            
        }
    }
    private JButton getBtnEliminar() {
        if (btnEliminar == null) {
            btnEliminar = new JButton("Eliminar");
            btnEliminar.addActionListener(new ActionListener() {
                public void actionPerformed(ActionEvent arg0) {
                    if(getTable().getRowCount() > 0){
                        int fila = getTable().getSelectedRow();
                        if(fila != -1){
                            if(EliminaTipoMovimiento(getTable().getValueAt(fila, 0).toString()) == true){
                                cuadro.CuadroAviso("Registro Eliminado", JOptionPane.INFORMATION_MESSAGE);    
                                CargaDatos();
                            } else{
                                cuadro.CuadroAviso("No se pudo eliminar los movimientos", JOptionPane.WARNING_MESSAGE);    
                            }
                        } else{
                            cuadro.CuadroAviso("Debe seleccionar un registro", JOptionPane.WARNING_MESSAGE);    
                        }
                    } else{
                        cuadro.CuadroAviso("No se encontraron registros", JOptionPane.WARNING_MESSAGE);
                    }
                }
            });
            btnEliminar.setMinimumSize(new Dimension(100, 22));
            btnEliminar.setPreferredSize(new Dimension(100, 22));
            btnEliminar.setMaximumSize(new Dimension(100, 22));
        }
        return btnEliminar;
    }
    private boolean EliminaTipoMovimiento(String id_tipo_doc){
        rn_DocumentoCosteo obj = new rn_DocumentoCosteo(this.path);
        return obj.EliminaDetalleCosteo(id_tipo_doc);        
    }
}
