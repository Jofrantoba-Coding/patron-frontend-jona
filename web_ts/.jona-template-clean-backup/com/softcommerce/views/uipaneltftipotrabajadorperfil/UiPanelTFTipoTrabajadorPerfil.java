/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.softcommerce.views.uipaneltftipotrabajadorperfil;


import com.softcommerce.formularios.*;
import com.izforge.izpack.gui.FlowLayout;
import com.softcommerce.beans.BeanTipoTrabajador;
import com.softcommerce.beans.Usuario;
import com.softcommerce.general.controles.CTable;
import com.softcommerce.general.controles.JHInternalFrame;
import com.softcommerce.general.controles.Register;
import com.softcommerce.general.controles.UpperCaseNumberDocument;
import com.softcommerce.general.tablas.TipoTrabajadorPerfilTableModel;
import com.softcommerce.reglasnegocio.RnTipoTrabajador;
import com.softcommerce.reglasnegocio.RnTipoTrabajadorPerfil;
import com.softcommerce.util.ExportExcel;
import java.awt.BorderLayout;
import java.awt.Color;
import java.awt.Component;
import java.awt.Cursor;
import java.awt.Dimension;
import java.awt.Font;
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
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import javax.swing.JComboBox;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import javax.swing.JScrollPane;
import javax.swing.JTextField;
import javax.swing.RowFilter;
import javax.swing.border.LineBorder;
import javax.swing.event.ListSelectionEvent;
import javax.swing.event.ListSelectionListener;
import javax.swing.table.TableRowSorter;

/**
 *
 * @author Team Develtrex
 */
public class UiPanelTFTipoTrabajadorPerfil extends JHInternalFrame implements InterUiPanelTFTipoTrabajadorPerfil, ListSelectionListener, WindowListener, FocusListener, KeyListener, ActionListener, ItemListener {

    public CTable table;
    public TipoTrabajadorPerfilTableModel modeltable;
    public TableRowSorter modeloOrdenado;
    protected JFrame frame;
    protected Usuario usuario;
    protected JScrollPane scroll;
    protected JTextField txt_descripcion;
    protected List<BeanTipoTrabajador> xTipotrabajador;
    protected JComboBox cbo_TipoTrabajador;

    public UiPanelTFTipoTrabajadorPerfil(String title, JFrame frame, Usuario usuario) {
        super(title, true, true, true, false, false, true, true, false, false, false, false, true, true);
        this.usuario = usuario;
        this.frame = frame;
        inicialize();
    }
    public UiPanelTFTipoTrabajadorPerfil(String title, JFrame frame, Usuario usuario, List<Boolean> vPermiso) {
        //super(title, true, true, true, false, false, true, true, false, false, false, false, true, true);
        super(title, vPermiso.get(0), vPermiso.get(1), vPermiso.get(2), vPermiso.get(3), vPermiso.get(4), vPermiso.get(5), vPermiso.get(6), vPermiso.get(7), vPermiso.get(8), vPermiso.get(9), vPermiso.get(10), vPermiso.get(11), vPermiso.get(12));
        this.usuario = usuario;
        this.frame = frame;
        inicialize();
    }

    protected void inicialize() {
        super.getPnlControl().getCbSearch().setText("Permisos");
        modeltable = new TipoTrabajadorPerfilTableModel();
        modeloOrdenado = new TableRowSorter(modeltable);
        table = new CTable();
        table.setRowSorter(modeloOrdenado);
        table.setModel(modeltable);
        table.setAllTableNoEditable();
        table.setAllColumnNoResizable();
        table.setRendererColumnZero();
        table.setAllColumnPreferredWidth();
        //table.setNoVisibleColumn(2);
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

    protected JPanel getPanelFilter() {
        JPanel pnlp = new JPanel();
        pnlp.setBorder(new LineBorder(new Color(130, 135, 144)));
        pnlp.setLayout(new FlowLayout(FlowLayout.LEFT));

        JLabel lblDescripcion = new JLabel("Desc.");
        lblDescripcion.setFont(new Font("Verdana", 0, 11));
        //lblDescripcion.setBounds(15, 25, 35, 20);
        pnlp.add(lblDescripcion);

        txt_descripcion = new JTextField();
        txt_descripcion.setColumns(20);
        //txt_descripcion.setBounds(100, 25, 200, 20);
        txt_descripcion.addFocusListener(this);
        txt_descripcion.setFont(new Font("Garamond", 0, 14));
        txt_descripcion.setDocument(new UpperCaseNumberDocument(255));
        txt_descripcion.addKeyListener(this);
        pnlp.add(txt_descripcion);

        JLabel lbl_tipoTrabajador = new JLabel("Tipo Trabajador");
        lbl_tipoTrabajador.setFont(new Font("Verdana", 0, 11));
        //lbl_tipoTrabajador.setBounds(320, 25, 100, 20);
        pnlp.add(lbl_tipoTrabajador);

        cbo_TipoTrabajador = new JComboBox();
        cbo_TipoTrabajador.addActionListener(this);
        //cbo_TipoTrabajador.setBounds(420, 25, 180, 20);
        cbo_TipoTrabajador.addKeyListener(this);
        pnlp.add(cbo_TipoTrabajador);

        return pnlp;
    }

    public void cargarTabla() {
    }

    protected RowFilter getFilter() {
        return null;
    }

    public void cargarFiltro() {
    }

    protected void loadTipoTrabajador() {
    }

    protected void filtrar() {
    }

    protected void setScrollValueView(int row) {
        scroll.getVerticalScrollBar().setValue(table.getRowHeight() * row);
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
    public void refreshTitleName() {
    }

    @Override
    public void selectFirstRow() {
        if (table.getRowCount() > 0) {
            table.setRowSelectionInterval(0, 0);
            setScrollValueView(0);
        }
    }

    @Override
    public void selectPreviusRow() {
    }

    @Override
    public void selectNextRow() {
    }

    @Override
    public void selectLastRow() {
        if (table.getRowCount() > 0) {
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
    public void selectFirstPage() {
    }

    @Override
    public void selectPreviusPage() {
    }

    @Override
    public void selectNextPage() {
    }

    @Override
    public void selectLastPage() {
    }

    @Override
    public int getSelectedPage() {
        return 0;
    }

    @Override
    public int getPageCount() {
        return 0;
    }

    @Override
    public void setSelectedRow(int row) {
        if (row >= 0) {
            table.setRowSelectionInterval(row, row);
            setScrollValueView(row);
        }
    }

    @Override
    public void setSelectedRow(String clave, int column) {
    }

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
        if (!e.getValueIsAdjusting()) {
            refresh();
        }
    }

    @Override
    public void windowOpened(WindowEvent e) {
    }

    @Override
    public void windowClosing(WindowEvent e) {
        //throw new UnsupportedOperationException("Not supported yet.");
    }

    @Override
    public void windowClosed(WindowEvent e) {
    }

    @Override
    public void windowIconified(WindowEvent e) {
    }

    @Override
    public void windowDeiconified(WindowEvent e) {
    }

    @Override
    public void windowActivated(WindowEvent e) {
    }

    @Override
    public void windowDeactivated(WindowEvent e) {
    }

    @Override
    public void focusGained(FocusEvent e) {
        if (e.getSource() == txt_descripcion) {
            txt_descripcion.selectAll();
        }

    }

    @Override
    public void focusLost(FocusEvent e) {
    }

    @Override
    public void keyTyped(KeyEvent e) {
    }

    @Override
    public void keyPressed(KeyEvent e) {
        if (e.getKeyChar() == '\n') {
            //if(e.getSource() == txt_codigo)
            //    txt_descripcion.requestFocus();
        }
    }

    @Override
    public void keyReleased(KeyEvent e) {
        if (e.getKeyChar() != '\n') {
            if ((e.getSource() == txt_descripcion) /*||
                     (e.getSource() == txt_codigo)*/) {
                filtrar();
            }
        }
    }

    @Override
    public void actionPerformed(ActionEvent e) {
        if (cbo_TipoTrabajador == e.getSource()) {
            if (cbo_TipoTrabajador.getItemCount() > 0) {
                filtrar();
            }
        }
    }

    @Override
    public void itemStateChanged(ItemEvent e) {
    }
}
