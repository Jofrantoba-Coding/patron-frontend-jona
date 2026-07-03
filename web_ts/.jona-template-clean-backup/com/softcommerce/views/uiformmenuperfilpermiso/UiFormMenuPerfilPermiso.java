/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.softcommerce.views.uiformmenuperfilpermiso;


import com.softcommerce.formularios.*;
import com.softcommerce.beans.MenuDinamico;
import com.softcommerce.beans.BeanTipoTrabajadorPerfil;
import com.softcommerce.general.controles.CTable;
import com.softcommerce.general.tablas.FormularioPerfilTableModel;
import com.softcommerce.reglasnegocio.RnUsuario;
import java.awt.BorderLayout;
import java.awt.Color;
import java.awt.Dialog;
import java.awt.Dimension;
import java.awt.Font;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.util.HashMap;
import java.util.Map;
import javax.swing.JButton;
import javax.swing.JDialog;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import javax.swing.JScrollPane;
import javax.swing.border.LineBorder;
import javax.swing.table.TableRowSorter;

/**
 *
 * @author Team Develtrex
 */
public class UiFormMenuPerfilPermiso extends JDialog implements InterUiFormMenuPerfilPermiso, ActionListener {

    protected java.net.URL path;
    protected JPanel pnlGral;
    protected BeanTipoTrabajadorPerfil beanPerfil;
    protected MenuDinamico beanMenu;
    protected JPanel pnlCabecera;
    protected CTable table;
    public TableRowSorter modeloOrdenado;
    protected FormularioPerfilTableModel modeltable;
    protected JScrollPane scrollTable;
    protected JButton btn_Guardar;
    protected Map<Integer, String> mapMenu;
    protected boolean swModo;//false por formulario; true por perfil

    public UiFormMenuPerfilPermiso(Dialog parent, boolean modal, java.net.URL ruta, BeanTipoTrabajadorPerfil beanPerfil, MenuDinamico beanMenu,boolean sw) {
        super(parent, modal);
        path = ruta;
        this.beanPerfil = beanPerfil;
        this.beanMenu = beanMenu;
        this.swModo=sw;
        initComponents();
    }
    public UiFormMenuPerfilPermiso(Dialog parent, boolean modal, java.net.URL ruta, BeanTipoTrabajadorPerfil beanPerfil,boolean sw) {
        super(parent, modal);
        path = ruta;
        this.beanPerfil = beanPerfil;
        this.swModo=sw;
        initComponents();
    }

    protected void initComponents() {
        pnlCabecera = new JPanel();
        pnlCabecera.setLayout(new BorderLayout(0, 1));
        pnlCabecera.setBorder(new LineBorder(new Color(130, 135, 144)));
        JLabel lblFormulario = new JLabel();
        lblFormulario.setFont(new Font("Helvetica", Font.BOLD, 16));
        if (swModo){
            lblFormulario.setText("");
        }else{
            lblFormulario.setText("OPCION: " + beanMenu.getDescripcion().toUpperCase());
        }
        pnlCabecera.add(lblFormulario);
        getContentPane().add(pnlCabecera, BorderLayout.PAGE_START);
        pnlGral = new JPanel();
        pnlGral.setLayout(new BorderLayout());
        //
        table = new CTable();
        modeltable = new FormularioPerfilTableModel();
        modeloOrdenado = new TableRowSorter(modeltable);
        table.setRowSorter(modeloOrdenado);
        table.setModel(modeltable);
        //modelo.addTableModelListener(this);
        table.setAllTableNoEditable();
        table.setAllColumnNoResizable();
        table.setAllColumnPreferredWidth();
        if (!swModo){
            table.setNoVisibleColumn(1);
        }
        table.setNoVisibleColumn(3);
        table.setColumnEditable(0);
        table.setColumnMaxWidth(0, 50);
        //table.getColumnModel().getColumn(0).setCellEditor(new com.softcommerce.general.controles.Celda_CheckBox());
        //table.getColumnModel().getColumn(0).setCellRenderer(new com.softcommerce.general.controles.Render_CheckBox());
        cargarData();
        scrollTable = new JScrollPane(table);
        if (swModo){
            scrollTable.setPreferredSize(new Dimension(400, 300));
        }else{
            scrollTable.setPreferredSize(new Dimension(300, 200));
        }
        pnlGral.add(scrollTable, BorderLayout.CENTER);
        getContentPane().add(pnlGral, java.awt.BorderLayout.CENTER);
        JPanel pnlOpt = new JPanel();
        pnlOpt.setBorder(new LineBorder(new Color(130, 135, 144)));
        btn_Guardar = new JButton("Guardar");
        btn_Guardar.setBounds(60, 10, 150, 20);
        btn_Guardar.addActionListener(this);
        pnlOpt.add(btn_Guardar);
        pnlOpt.setPreferredSize(new Dimension(300, 40));
        getContentPane().add(pnlOpt, java.awt.BorderLayout.SOUTH);
        pack();
    }

    protected void cargarData() {
    }

    protected String visibleListado(int id_menu) {
        return mapMenu.get(id_menu).toString();
    }

    protected void guardarPermisos() {
    }

    @Override
    public void actionPerformed(ActionEvent e) {
        if (e.getSource() == btn_Guardar) {
            table.setColumnSelectionAllowed(false);
            table.setRowSelectionAllowed(true);
            table.setRowSelectionInterval(0, 0);
            guardarPermisos();
        }
    }
}
