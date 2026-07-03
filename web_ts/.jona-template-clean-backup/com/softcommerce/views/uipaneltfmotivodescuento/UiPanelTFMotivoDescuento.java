/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.softcommerce.views.uipaneltfmotivodescuento;


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
import com.softcommerce.general.controles.IntegerDocument;
import com.softcommerce.general.controles.Register;
import com.softcommerce.general.controles.UpperCaseNumberDocument;
import com.softcommerce.general.tablas.MotivoDescuentoTableModel;
import com.softcommerce.reglasnegocio.rn_MotivoDescuento;
import com.softcommerce.util.ExportExcel;
import java.awt.BorderLayout;
import java.awt.Color;
import java.awt.Cursor;
import java.awt.Dimension;
import java.awt.FlowLayout;
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
public class UiPanelTFMotivoDescuento extends JHInternalFrame implements InterUiPanelTFMotivoDescuento, ListSelectionListener, WindowListener, FocusListener, KeyListener, ActionListener, ItemListener {

    public CTable table;
    public MotivoDescuentoTableModel modeltable;
    public TableRowSorter modeloOrdenado;
    protected JFrame frame;
    protected Usuario usuario;
    protected JScrollPane scroll;
    protected JTextField txt_idMotiDescuento;
    protected JTextField txt_descripcionMotivoDescuento;

    public UiPanelTFMotivoDescuento(String title, JFrame frame, Usuario usuario) {
        super(title, true, true, true,false, false, true, true, false, false, false, false, true, true);
        this.usuario = usuario;
        this.frame = frame;
        inicialize();
    }
    public UiPanelTFMotivoDescuento(String title, JFrame frame, Usuario usuario, List<Boolean> vPermiso) {
        super(title, vPermiso.get(0), vPermiso.get(1), vPermiso.get(2), vPermiso.get(3), vPermiso.get(4), vPermiso.get(5), vPermiso.get(6), vPermiso.get(7), vPermiso.get(8), vPermiso.get(9), vPermiso.get(10), vPermiso.get(11), vPermiso.get(12));
        this.usuario = usuario;
        this.frame = frame;
        inicialize();
    }

    protected void inicialize() {
        modeltable = new MotivoDescuentoTableModel();
        modeloOrdenado = new TableRowSorter(modeltable);
        table = new CTable();
        table.setRowSorter(modeloOrdenado);
        table.setModel(modeltable);
        table.setAllTableNoEditable();
        table.setAllColumnNoResizable();
        table.setRendererColumnZero();
        table.setAllColumnPreferredWidth();
        table.setNoVisibleColumn(4);
        table.getSelectionModel().addListSelectionListener(this);
        scroll = new JScrollPane(table);
        JPanel pnlaux = new JPanel();
        pnlaux.setLayout(new BorderLayout(0, 0));
        JPanel panel = getPanelFilter();
        //panel.setPreferredSize(new Dimension(1200, 100));
        pnlaux.add(panel, BorderLayout.NORTH);

        scroll.setPreferredSize(new Dimension(1200, 380));
        pnlaux.add(scroll, BorderLayout.CENTER);

        setTable(pnlaux);
    }

    public JPanel getPanelFilter() {
        JPanel pnlp = new JPanel();
        pnlp.setBorder(new LineBorder(new Color(130, 135, 144)));
        pnlp.setLayout(new FlowLayout(FlowLayout.LEFT));

        JLabel lbl_idMotivoDescuento = new JLabel("Código");
        //lbl_idMotivoDescuento.setBounds(25, 25, 40, 20);
        lbl_idMotivoDescuento.setFont(new Font("Verdana", 0, 11));
        pnlp.add(lbl_idMotivoDescuento);

        txt_idMotiDescuento = new JTextField(); 
        txt_idMotiDescuento.setColumns(20);
        //txt_idMotiDescuento.setBounds(80, 25, 90, 20);
        txt_idMotiDescuento.addKeyListener(this);
        txt_idMotiDescuento.setDocument(new IntegerDocument(6));
        txt_idMotiDescuento.addFocusListener(this);
        txt_idMotiDescuento.setFont(new Font("Garamond", 0, 14));
        pnlp.add(txt_idMotiDescuento);

        JLabel lblDescripcion = new JLabel("Desc.");
        lblDescripcion.setFont(new Font("Verdana", 0, 11));
        lblDescripcion.setBounds(190, 25, 35, 20);
        pnlp.add(lblDescripcion);

        txt_descripcionMotivoDescuento = new JTextField();
        txt_descripcionMotivoDescuento.setColumns(20);
        //txt_descripcionMotivoDescuento.setBounds(225, 25, 360, 20);
        txt_descripcionMotivoDescuento.addFocusListener(this);
        txt_descripcionMotivoDescuento.setFont(new Font("Garamond", 0, 14));
        txt_descripcionMotivoDescuento.setDocument(new UpperCaseNumberDocument(255));
        txt_descripcionMotivoDescuento.addKeyListener(this);
        pnlp.add(txt_descripcionMotivoDescuento);

        return pnlp;
    }

    public void cargarTabla() {
    }

    public RowFilter getFilter() {
        return null;
    }
    
    public void filtrar() {
    }

    @Override
    public void setValueSearch(Object valor, Component comp) {
    }

    @Override
    public void controlAdd() {
    }

    @Override
    public void controlModify() {
    }

    @Override
    public void controlEliminate() {
    }

    @Override
    public void controlNullify() {
    }

    @Override
    public void controlClone() {
    }

    @Override
    public void controlDetails() {
    }

    @Override
    public void controlSearch() {
    }

    @Override
    public void controlReport(boolean export) {
    }

    @Override
    public void controlPrint(boolean view) {
    }

    @Override
    public void controlClose() {
    }

    @Override
    public void controlRefresh() {
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
        return null;
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
        if(e.getSource() == txt_descripcionMotivoDescuento)
            txt_descripcionMotivoDescuento.selectAll();

        if(e.getSource() == txt_idMotiDescuento)
            txt_idMotiDescuento.selectAll();
    }

    @Override
    public void focusLost(FocusEvent e) {
        
    }

    @Override
    public void keyTyped(KeyEvent e) {}

    @Override
    public void keyPressed(KeyEvent e) {
        if(e.getKeyChar() == '\n'){
            if(e.getSource() == txt_idMotiDescuento)
                txt_descripcionMotivoDescuento.requestFocus();
        }
    }

    @Override
    public void keyReleased(KeyEvent e) {
        if(e.getKeyChar()!='\n'){
            if((e.getSource() == txt_descripcionMotivoDescuento)||
                (e.getSource() == txt_idMotiDescuento))
                    filtrar();
        }
    }

    @Override
    public void actionPerformed(ActionEvent e) {}

    @Override
    public void itemStateChanged(ItemEvent e) {}
}
