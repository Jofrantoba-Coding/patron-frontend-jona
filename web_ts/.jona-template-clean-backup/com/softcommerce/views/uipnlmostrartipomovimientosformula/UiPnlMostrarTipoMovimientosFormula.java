/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.softcommerce.views.uipnlmostrartipomovimientosformula;


import com.softcommerce.formularios.*;
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

public class UiPnlMostrarTipoMovimientosFormula extends JDialog  implements InterUiPnlMostrarTipoMovimientosFormula {

    private static final long serialVersionUID = 1L;
    protected JScrollPane scrollPane;
    protected JXTable table;
    protected DefaultTableModel modelo;
    protected JButton btnExportar;
    protected CuadroMensaje cuadro;
    protected java.net.URL path;
    protected Usuario usuario;
    protected JPanel panel;
    protected JButton btnEliminar;

    public UiPnlMostrarTipoMovimientosFormula(java.net.URL path, Usuario user,Frame arg0) {

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

    protected JPanel getPanel() {
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

    protected JScrollPane getScrollPane() {
        if (scrollPane == null) {
            scrollPane = new JScrollPane();
            scrollPane.setViewportView(getTable());
        }
        return scrollPane;
    }

    protected JXTable getTable() {
        return null;
    }

    protected void InicializaTabla() {
        String[] columnas = {"ID_TIPO_MOV", "TIPO DE MOVIMIENTO", "FÓRMULA"};

        modelo = new DefaultTableModel(null, columnas);
        getTable().setModel(modelo);

        getTable().getColumn(0).setMinWidth(300);
        getTable().getColumn(0).setMaxWidth(300);

        getTable().getColumn(1).setMinWidth(300);
        getTable().getColumn(1).setMaxWidth(300);        
    }

    protected JButton getBtnExportar() {
        return null;
    }
    
    protected void CargaDatos() {
    }
    protected JButton getBtnEliminar() {
        return null;
    }
    protected boolean EliminaTipoMovimiento(String id_tipo_doc){
        rn_DocumentoCosteo obj = new rn_DocumentoCosteo(this.path);
        return obj.EliminaDetalleCosteo(id_tipo_doc);        
    }
}
