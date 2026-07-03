/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.softcommerce.views.uipaneltftipodescuento;


import com.softcommerce.formularios.*;
import com.softcommerce.beans.Usuario;
import com.softcommerce.general.controles.JHInternalFrame;
import javax.swing.JFrame;

import java.awt.Component;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.FocusEvent;
import java.awt.event.FocusListener;
import java.awt.event.ItemEvent;
import java.awt.event.ItemListener;
import java.awt.event.KeyEvent;
import java.awt.event.KeyListener;
import java.awt.event.WindowEvent;
import java.awt.event.WindowListener;
import javax.swing.event.ListSelectionEvent;
import javax.swing.event.ListSelectionListener;
import com.softcommerce.general.controles.CTable;
import com.softcommerce.general.controles.Register;
import com.softcommerce.general.controles.UpperCaseNumberDocument;
import com.softcommerce.general.tablas.TipoDescuentoTableModel;
import com.softcommerce.reglasnegocio.rn_TipoDescuento;
import com.softcommerce.util.ExportExcel;
import java.awt.BorderLayout;
import java.awt.Color;
import java.awt.Cursor;
import java.awt.Dimension;
import java.awt.Font;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import javax.swing.JScrollPane;
import javax.swing.JTextField;
import javax.swing.RowFilter;
import javax.swing.border.LineBorder;
import javax.swing.table.TableRowSorter;

/**
 *
 * @author Team Develtrex
 */
public class UiPanelTFTipoDescuento extends JHInternalFrame implements InterUiPanelTFTipoDescuento, ListSelectionListener, WindowListener, FocusListener, KeyListener, ActionListener, ItemListener{
    public CTable table;
    public TipoDescuentoTableModel modeltable;
    public TableRowSorter modeloOrdenado;
    private JFrame frame;
    private Usuario usuario;
    private JScrollPane scroll;
    private JTextField txt_descripcion;

    public UiPanelTFTipoDescuento(String title, JFrame frame, Usuario usuario) {
        super(title, true, true, true,false, false, true, true, false, false, false, false, true, true);
        this.usuario = usuario;
        this.frame = frame;
        inicialize();
    }
    public UiPanelTFTipoDescuento(String title, JFrame frame, Usuario usuario, List<Boolean> vPermiso) {
        super(title, vPermiso.get(0), vPermiso.get(1), vPermiso.get(2), vPermiso.get(3), vPermiso.get(4), vPermiso.get(5), vPermiso.get(6), vPermiso.get(7), vPermiso.get(8), vPermiso.get(9), vPermiso.get(10), vPermiso.get(11), vPermiso.get(12));
        this.usuario = usuario;
        this.frame = frame;
        inicialize();
    }

    private void inicialize() {
        modeltable = new TipoDescuentoTableModel();
        modeloOrdenado = new TableRowSorter(modeltable);
        table = new CTable();
        table.setRowSorter(modeloOrdenado);
        table.setModel(modeltable);
        table.setAllTableNoEditable();
        table.setAllColumnNoResizable();
        table.setRendererColumnZero();
        table.setAllColumnPreferredWidth();
        table.getSelectionModel().addListSelectionListener(this);
        scroll = new JScrollPane(table);
        JPanel pnlaux = new JPanel();
        pnlaux.setLayout(new BorderLayout(0, 0));
        JPanel panel = getPanelFilter();
        panel.setPreferredSize(new Dimension(1200, 100));
        pnlaux.add(panel, BorderLayout.CENTER);

        scroll.setPreferredSize(new Dimension(1200, 380));
        pnlaux.add(scroll, BorderLayout.SOUTH);

        setTable(pnlaux);
    }

    public JPanel getPanelFilter() {
        JPanel pnlp = new JPanel();
        pnlp.setBorder(new LineBorder(new Color(130, 135, 144)));
        pnlp.setLayout(null);

        JLabel lblDescripcion = new JLabel("Desc.");
        lblDescripcion.setFont(new Font("Verdana", 0, 11));
        lblDescripcion.setBounds(25, 25, 35, 20);
        pnlp.add(lblDescripcion);

        txt_descripcion = new JTextField();
        txt_descripcion.setBounds(80, 25, 360, 20);
        txt_descripcion.addFocusListener(this);
        txt_descripcion.setFont(new Font("Garamond", 0, 14));
        txt_descripcion.setDocument(new UpperCaseNumberDocument(255));
        txt_descripcion.addKeyListener(this);
        pnlp.add(txt_descripcion);

        return pnlp;
    }

    public void cargarTabla() {
        try {
            rn_TipoDescuento regla = new rn_TipoDescuento(path);
            modeloOrdenado.setRowFilter(null);
            modeltable.clearTable();
            modeltable.agregarVectorTipoDescuento(regla.listar(0));
            modeloOrdenado.setRowFilter(getFilter());
            table.setAllColumnPreferredWidth();
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this,"Error: " + e.getMessage(),"Tipo Descuento",JOptionPane.OK_OPTION);
        }
    }

    public RowFilter getFilter() {
        List filters = new ArrayList();

        if (txt_descripcion.getText().trim().length() > 0) {
            filters.add(RowFilter.regexFilter(".*" + txt_descripcion.getText().trim() + ".*", 2));
        }

        RowFilter fooBarFilter = RowFilter.andFilter(filters);

        return fooBarFilter;
    }
    
    public void filtrar(){
        modeloOrdenado.setRowFilter(getFilter());
        table.setAllColumnPreferredWidth();

        if(table.getRowCount()>0)
            table.setRowSelectionInterval(0,0);
    }

    @Override
    public void setValueSearch(Object valor, Component comp) {}

    @Override
    public void controlAdd() {
        try {
            setCursor(new Cursor(Cursor.WAIT_CURSOR));
            RegisterTipoDescuento register = new RegisterTipoDescuento(frame, usuario);
            register.setPath(path);
            register.setRowSelection(this);
            register.setView(this);
            //register.setFecha(fechaInicio,fechaFin);
            register.setModeRegister(Register.INSERT);
            register.setVisible(true);
            setCursor(new Cursor(Cursor.DEFAULT_CURSOR));
        } catch (Exception ex) {
            JOptionPane.showMessageDialog(null, ex.getMessage());
        }
    }

    @Override
    public void controlModify() {
        if (table.getRowCount() == 0 || table.getSelectedRow() < 0)
            return;
        setCursor(new Cursor(Cursor.WAIT_CURSOR));

        RegisterTipoDescuento register = new RegisterTipoDescuento(frame,usuario);
        register.setPath(path);
        register.setRowSelection(this);
        register.setView(this);

        if(register.setModeRegister(Register.UPDATE))
            register.setVisible(true);
        else{
            controlRefresh();
            register.dispose();
        }

        setCursor(new Cursor(Cursor.DEFAULT_CURSOR));
    }

    @Override
    public void controlEliminate() {
        //throw new UnsupportedOperationException("Not supported yet.");
        if (table.getRowCount() == 0 || table.getSelectedRow() < 0)
            return;
        setCursor(new Cursor(Cursor.WAIT_CURSOR));
        RegisterTipoDescuento register = new RegisterTipoDescuento(frame,usuario);
        register.setPath(path);
        register.setRowSelection(this);
        register.setView(this);
        if(register.setModeRegister(Register.DELETE))
            register.setVisible(true);
        else{
            controlRefresh();
            register.dispose();
        }
        setCursor(new Cursor(Cursor.DEFAULT_CURSOR));
    }

    @Override
    public void controlNullify() {
        
    }

    @Override
    public void controlClone() {}

    @Override
    public void controlDetails() {
        if (table.getRowCount() == 0 || table.getSelectedRow() < 0)
            return;
        setCursor(new Cursor(Cursor.WAIT_CURSOR));
        RegisterTipoDescuento register = new RegisterTipoDescuento(frame,usuario);
        register.setPath(path);
        register.setRowSelection(this);
        register.setView(this);
        if(register.setModeRegister(Register.DETAIL))
            register.setVisible(true);
        else{
            controlRefresh();
            register.dispose();
        }
        setCursor(new Cursor(Cursor.DEFAULT_CURSOR));
    }

    @Override
    public void controlSearch() {}

    @Override
    public void controlReport(boolean export) {
        Map parameters = new HashMap();
        parameters.put(0, usuario.getDescriempresa());
        parameters.put(1, "Ruc: " + usuario.getRuc());
        parameters.put(2, "Tipo Descuento");
        ExportExcel.exportar(table, parameters);
    }

    @Override
    public void controlPrint(boolean view) {}

    @Override
    public void controlClose() {
        dispose();
        doDefaultCloseAction();
    }

    @Override
    public void controlRefresh() {
        //throw new UnsupportedOperationException("Not supported yet.");
        cargarTabla();
    }

    @Override
    public void refreshTitleName() {}

    @Override
    public void selectFirstRow() {
        if (table.getRowCount() > 0){
            table.setRowSelectionInterval(0,0);
            setScrollValueView(0);
        }
    }

    @Override
    public void selectPreviusRow() {}

    @Override
    public void selectNextRow() {}

    @Override
    public void selectLastRow() {
        if (table.getRowCount() > 0){
            int rowCount = table.getRowCount() - 1;
            table.setRowSelectionInterval(rowCount, rowCount);
            setScrollValueView(rowCount);
        }
    }

    @Override
    public int getSelectedRow() {
        return table.getSelectedRow();
    }

    @Override
    public int getRowCount() {
        return table.getRowCount();
    }

    @Override
    public void selectFirstPage() {}

    @Override
    public void selectPreviusPage() {}

    @Override
    public void selectNextPage() {}

    @Override
    public void selectLastPage() {}

    @Override
    public int getSelectedPage() {return 0;}

    @Override
    public int getPageCount() {return 0;}

    @Override
    public void setSelectedRow(int row) {
        if (row >= 0){
            table.setRowSelectionInterval(row, row);
            setScrollValueView(row);
	}
    }
    public void setScrollValueView(int row){
        scroll.getVerticalScrollBar().setValue(table.getRowHeight() * row);
    }

    @Override
    public void setSelectedRow(String clave, int column) {}

    @Override
    public Object getSelectedValue(int column) {
        int visibleRowIndex = table.getSelectedRow();
        int realRowIndex = table.convertRowIndexToModel(visibleRowIndex);

        return  modeltable.getValueAt(realRowIndex, column);
    }

    @Override
    public Object getSelectedValue(String column) {
        return null;
    }

    @Override
    public void valueChanged(ListSelectionEvent e) {
        if(!e.getValueIsAdjusting())
            refresh();
    }

    @Override
    public void windowOpened(WindowEvent e) {}

    @Override
    public void windowClosing(WindowEvent e) {}

    @Override
    public void windowClosed(WindowEvent e) {}

    @Override
    public void windowIconified(WindowEvent e) {}

    @Override
    public void windowDeiconified(WindowEvent e) {}

    @Override
    public void windowActivated(WindowEvent e) {}

    @Override
    public void windowDeactivated(WindowEvent e) {}

    @Override
    public void focusGained(FocusEvent e) {
        if(e.getSource() == txt_descripcion)
            txt_descripcion.selectAll();
    }

    @Override
    public void focusLost(FocusEvent e) {
        
    }

    @Override
    public void keyTyped(KeyEvent e) {}

    @Override
    public void keyPressed(KeyEvent e) {
        if(e.getKeyChar() == '\n'){
            //if(e.getSource() == txt_idMotiDescuento)
            //    txt_descripcionMotivoDescuento.requestFocus();
        }
    }

    @Override
    public void keyReleased(KeyEvent e) {
        if(e.getKeyChar()!='\n'){
            if((e.getSource() == txt_descripcion)
                    /*||
                (e.getSource() == txt_idMotiDescuento)*/
                    )
                    filtrar();
        }
    }

    @Override
    public void actionPerformed(ActionEvent e) {}

    @Override
    public void itemStateChanged(ItemEvent e) {}
}
