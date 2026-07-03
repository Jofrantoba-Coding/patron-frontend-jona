/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.softcommerce.formularios;

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
public class FormMenuPerfilPermiso extends JDialog implements ActionListener {

    private java.net.URL path;
    private JPanel pnlGral;
    private BeanTipoTrabajadorPerfil beanPerfil;
    private MenuDinamico beanMenu;
    private JPanel pnlCabecera;
    private CTable table;
    public TableRowSorter modeloOrdenado;
    private FormularioPerfilTableModel modeltable;
    private JScrollPane scrollTable;
    private JButton btn_Guardar;
    private Map<Integer, String> mapMenu;
    private boolean swModo;//false por formulario; true por perfil

    public FormMenuPerfilPermiso(Dialog parent, boolean modal, java.net.URL ruta, BeanTipoTrabajadorPerfil beanPerfil, MenuDinamico beanMenu,boolean sw) {
        super(parent, modal);
        path = ruta;
        this.beanPerfil = beanPerfil;
        this.beanMenu = beanMenu;
        this.swModo=sw;
        initComponents();
    }
    public FormMenuPerfilPermiso(Dialog parent, boolean modal, java.net.URL ruta, BeanTipoTrabajadorPerfil beanPerfil,boolean sw) {
        super(parent, modal);
        path = ruta;
        this.beanPerfil = beanPerfil;
        this.swModo=sw;
        initComponents();
    }

    private void initComponents() {
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

    private void cargarData() {
        try {
            RnUsuario logic_usuario = new RnUsuario(path);
            modeloOrdenado.setRowFilter(null);
            modeltable.clearTable();
            if (swModo){
                modeltable.agregarVectorFormulario(logic_usuario.cargaFormularioPerfilGral(beanPerfil.getId_tipo_perfil()));
            }else{
                modeltable.agregarVectorFormulario(logic_usuario.cargaFormularioPerfilOpc(beanPerfil.getId_tipo_perfil(), beanMenu.getId_formulario()));
            }
            mapMenu = new HashMap<Integer, String>();
            for (int i = 0; i < modeltable.getRowCount(); i++) {
                mapMenu.put(modeltable.getFormulario(i).getId_form_boton(), modeltable.getFormulario(i).getVisible());
            }
            table.setAllColumnPreferredWidth();
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, "Error: " + e.getMessage(), "Perfiles", JOptionPane.OK_OPTION);
        }
    }

    private String visibleListado(int id_menu) {
        return mapMenu.get(id_menu).toString();
    }

    private void guardarPermisos() {
        try {
            String xmlPerfil = "";
            xmlPerfil = "<?xml version=\"1.0\" ?> ";
            xmlPerfil += "<PERFILES>";
            for (int i = 0; i < modeltable.getRowCount(); i++) {
                if (!visibleListado(modeltable.getFormulario(i).getId_form_boton()).equalsIgnoreCase(modeltable.getFormulario(i).getVisible())) {
                    xmlPerfil += "<PERFIL>";
                    xmlPerfil += "<ID_FORM_BOTON>" + modeltable.getFormulario(i).getId_form_boton() + "</ID_FORM_BOTON>";
                    xmlPerfil += "<VISIBLE>" + modeltable.getFormulario(i).getVisible() + "</VISIBLE>";
                    xmlPerfil += "</PERFIL>";
                }
            }
            xmlPerfil += "</PERFILES>";
            System.out.println("xml_Perfil: " + xmlPerfil);
            RnUsuario regla = new RnUsuario(path);
            String rpta = "";
            rpta = regla.mantPerfilOpciones(xmlPerfil, beanPerfil.getId_tipo_perfil());
            if (rpta.trim().equals("CORRECTO")) {
                JOptionPane.showMessageDialog(this, "Permisos actualizados correctamente");
            }
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
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
