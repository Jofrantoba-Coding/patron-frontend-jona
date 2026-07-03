/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.softcommerce.views.uipaneltfnacionalidad;


import com.softcommerce.formularios.*;
import com.softcommerce.beans.Usuario;
import com.softcommerce.general.controles.Register;
import java.awt.event.MouseAdapter;
import java.awt.event.MouseEvent;
import javax.swing.JPanel;
import javax.swing.event.ListSelectionEvent;
import com.softcommerce.general.controles.CTable;
import java.awt.BorderLayout;
import javax.swing.JScrollPane;
import javax.swing.table.TableRowSorter;
import com.softcommerce.general.controles.PopupMenuView;
import javax.swing.event.ListSelectionListener;
import com.softcommerce.general.controles.JHInternalFrame;
import java.awt.Component;
import java.awt.Cursor;
import java.awt.Dimension;
import java.util.Date;
import javax.swing.JFrame;
import com.softcommerce.reglasnegocio.RnNacionalidad;
import com.softcommerce.general.tablas.NacionalidadTableModel;
import com.softcommerce.util.ExceptionHandler;
import com.softcommerce.util.ExportExcel;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import javax.swing.JOptionPane;
import org.apache.log4j.Logger;

/**
 *
 * @author TOSHIBA
 */
public class UiPanelTFNacionalidad
        extends JHInternalFrame
        implements InterUiPanelTFNacionalidad, ListSelectionListener {

    public CTable table;
    public NacionalidadTableModel modeltable;
    public TableRowSorter modeloOrdenado;
    protected final Usuario usuario;
    protected JScrollPane scroll;
    protected final JFrame frame;
    protected final Logger logger = Logger.getLogger(RegisterProveedorNuevo.class);

    public UiPanelTFNacionalidad(String title, JFrame frame, Usuario usuario) {
        super(title);
        this.usuario = usuario;
        this.frame = frame;
        inicialize();
    }
    
    public UiPanelTFNacionalidad(String title, JFrame frame, Usuario usuario, List<Boolean> vPermiso) {
        super(title, vPermiso.get(0), vPermiso.get(1), vPermiso.get(2),
                vPermiso.get(3), vPermiso.get(4), vPermiso.get(5), vPermiso.get(6),
                vPermiso.get(7), vPermiso.get(8), vPermiso.get(9), vPermiso.get(10), vPermiso.get(11), vPermiso.get(12));
        this.usuario = usuario;
        this.frame = frame;
        inicialize();
    }

    protected void inicialize() {
        modeltable = new NacionalidadTableModel();
        modeloOrdenado = new TableRowSorter(modeltable);
        table = new CTable();
        table.setRowSorter(modeloOrdenado);
        table.setModel(modeltable);
        table.setAllTableNoEditable();
        table.setAllColumnNoResizable();
        table.setRendererColumnZero();
        table.setAllColumnPreferredWidth();
        PopupMenuView popupmenu = new PopupMenuView();
        popupmenu.setControl(this);
        table.setComponentPopupMenu(popupmenu);
        table.getSelectionModel().addListSelectionListener(this);
        scroll = new JScrollPane(table);

        table.addMouseListener(new MouseAdapter() {
            @Override
            public void mouseClicked(MouseEvent e) {
                if (e.getClickCount() == 2) {
                    controlDetails();
                }
            }
        });

        JPanel pnlaux = new JPanel();
        pnlaux.setLayout(new BorderLayout(0, 0));

        scroll.setPreferredSize(new Dimension(1200, 380));
        pnlaux.add(scroll, BorderLayout.CENTER);

        setTable(pnlaux);
    }

    @Override
    public void controlReport(boolean export) {
    }

    @Override
    public void setFecha(Date fechaInicio, Date fechaFin) {
    }

    @Override
    public void cargarFiltro() {
    }

    @Override
    public void controlPrint(boolean view) {
    }

    @Override
    public void controlAdd() {
    }

    @Override
    public void controlModify() {
    }

    @Override
    public void controlNullify() {
    }

    @Override
    public void controlEliminate() {
    }

    @Override
    public void controlClone() {
    }

    @Override
    public void controlDetails() {
    }

    @Override
    public void controlClose() {
    }

    @Override
    public void controlRefresh() {
    }

    @Override
    public Object getSelectedValue(int column) {
        return null;
    }

    @Override
    public void setSelectedRow(int row) {
        if (row >= 0) {
            table.setRowSelectionInterval(row, row);
            setScrollValueView(row);
        }
    }

    @Override
    public void valueChanged(ListSelectionEvent e) {
        if (!e.getValueIsAdjusting()) {
            refresh();
        }
    }

    @Override
    public int getSelectedRow() {
        return table.getSelectedRow();
    }

    @Override
    public void selectNextRow() {
        if (table.getRowCount() > 0) {
            if (table.getSelectedRow() < table.getRowCount() - 1) {
                int row = table.getSelectedRow() + 1;
                table.setRowSelectionInterval(row, row);
                setScrollValueView(row);
            }
        }
    }

    @Override
    public void selectPreviusRow() {
        if (table.getRowCount() > 0) {
            if (table.getSelectedRow() > 0) {
                int row = table.getSelectedRow() - 1;
                table.setRowSelectionInterval(row, row);
                setScrollValueView(row);
            }
        }
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
    public void selectFirstRow() {
        if (table.getRowCount() > 0) {
            table.setRowSelectionInterval(0, 0);
            setScrollValueView(0);
        }
    }

    public void setScrollValueView(int row) {
        scroll.getVerticalScrollBar().setValue(table.getRowHeight() * row);
    }

    @Override
    public int getRowCount() {
        return table.getRowCount();
    }

    @Override
    public void cargarTabla() {
    }

    @Override
    public void selectLastPage() {
    }

    @Override
    public void selectFirstPage() {
    }

    @Override
    public int getPageCount() {
        return 0;
    }

    @Override
    public int getSelectedPage() {
        return 0;
    }

    @Override
    public void setValueSearch(Object valor, Component comp) {
    }

    @Override
    public void refreshTitleName() {
    }

    @Override
    public void controlSearch() {
    }

    @Override
    public void setSelectedRow(String clave, int column) {
    }

    @Override
    public Object getSelectedValue(String column) {
        return null;
    }

    @Override
    public void selectPreviusPage() {
    }

    @Override
    public void selectNextPage() {
    }
}
