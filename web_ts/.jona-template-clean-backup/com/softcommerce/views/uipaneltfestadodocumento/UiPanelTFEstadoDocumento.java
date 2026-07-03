/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.softcommerce.views.uipaneltfestadodocumento;


import com.softcommerce.formularios.*;
import com.softcommerce.beans.Usuario;
import com.softcommerce.general.controles.AbstractRegister;
import com.softcommerce.general.controles.CTable;
import com.softcommerce.general.controles.ControlView;
import com.softcommerce.general.controles.JHInternalFrame;
import com.softcommerce.general.controles.Register;
import com.softcommerce.general.controles.RowSelection;
import com.softcommerce.general.controles.View;
import com.softcommerce.general.tablas.EstadoDocumentoTableModel;
import com.softcommerce.iconos.Gif;
import com.softcommerce.reglasnegocio.RnEstadoDocumento;
import com.softcommerce.util.ExportExcel;
import java.awt.BorderLayout;
import java.awt.CardLayout;
import java.awt.Color;
import java.awt.Component;
import java.awt.Dimension;
import java.awt.FlowLayout;
import java.awt.Font;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.FocusEvent;
import java.awt.event.FocusListener;
import java.awt.event.KeyAdapter;
import java.awt.event.KeyEvent;
import java.awt.event.KeyListener;
import java.awt.event.MouseAdapter;
import java.awt.event.MouseEvent;
import java.awt.event.WindowEvent;
import java.awt.event.WindowListener;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import javax.swing.Icon;
import javax.swing.JButton;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JMenuItem;
import javax.swing.JPanel;
import javax.swing.JPopupMenu;
import javax.swing.JScrollPane;
import javax.swing.JTextField;
import javax.swing.SwingConstants;
import javax.swing.border.BevelBorder;
import javax.swing.border.EmptyBorder;
import javax.swing.event.ListSelectionEvent;
import javax.swing.event.ListSelectionListener;
import javax.swing.table.TableRowSorter;

/**
 *
 * @author TOSHIBA
 */
public class UiPanelTFEstadoDocumento extends JHInternalFrame implements InterUiPanelTFEstadoDocumento, View, ListSelectionListener, RowSelection, ControlView, WindowListener, FocusListener, KeyListener, ActionListener {

    public CTable table;
    public EstadoDocumentoTableModel modeltable;
    public TableRowSorter modeloOrdenado;
    public JScrollPane scroll;
    protected String titleJIF;
    protected JLabel lblTitle;
    protected AbstractRegister register;
    protected Usuario usuario;
    protected JLabel lblRegister;
    protected JLabel lblRowCount;
    protected JTextField txtRow;
    protected JButton cbFirst;
    protected JButton cbPrevius;
    protected JButton cbNext;
    protected JButton cbLast;
    protected JButton cbAdd;
    protected JButton cbModify;
    protected JButton cbEliminate;
    protected JButton cbDetails;
    protected JButton cbSearch;
    protected JButton cbPrint;
    protected JButton cbPrintFast;
    protected JButton cbClose;
    protected JButton cbRefresh;
    protected JButton cbNullify;
    protected JButton cbClone;
    protected JButton cbReport;
    protected JMenuItem miInsert;
    protected JMenuItem miUpdate;
    protected JMenuItem miDelete;
    protected JMenuItem miDetail;
    protected JMenuItem miPrint;
    protected JMenuItem miRefresh;

    public UiPanelTFEstadoDocumento(AbstractRegister areg, String title, JFrame frm, Usuario usuario) {
        super(title);
        register = areg;
        register.setTitleName(title);
        register.setView((View) this);
        register.setRowSelection((RowSelection) this);
        this.usuario = usuario;
        titleJIF = title;
        inicialize();
    }

    public UiPanelTFEstadoDocumento(AbstractRegister areg, String title, JFrame frm, Usuario usuario, List<Boolean> vPermiso) {
        super(title, vPermiso.get(0), vPermiso.get(1), vPermiso.get(2), vPermiso.get(3), vPermiso.get(4), vPermiso.get(5), vPermiso.get(6), vPermiso.get(7), vPermiso.get(8), vPermiso.get(9), vPermiso.get(10), vPermiso.get(11), vPermiso.get(12));
        register = areg;
        register.setTitleName(title);
        register.setView((View) this);
        register.setRowSelection((RowSelection) this);
        this.usuario = usuario;
        titleJIF = title;
        inicialize(vPermiso.get(0), vPermiso.get(1), vPermiso.get(2), vPermiso.get(3), vPermiso.get(4), vPermiso.get(5), vPermiso.get(6), vPermiso.get(7), vPermiso.get(8), vPermiso.get(9), vPermiso.get(10), vPermiso.get(11), vPermiso.get(12));
    }

    protected void inicialize() {
    }

    protected void inicialize(boolean swAdd, boolean swModify, boolean swEliminate, boolean swNullify, boolean swClone, boolean swDetails, boolean swSearch, boolean swReport, boolean swExport, boolean swPrint, boolean swPrintFast, boolean swClose, boolean swRefresh) {
    }

    public void setTitle(String title, Icon icon) {
        lblTitle.setText(" " + title);
        lblTitle.setIcon(icon);
    }

    public void cargarFiltro() {
    }

    public void cargarTabla() {
    }

    public void refresh() {
    }

    public Object getSelectedValue(int column) {
        return null;
    }

    public void controlPrint(boolean view) {
    }

    public void refreshTitleName() {
    }

    public void valueChanged(ListSelectionEvent e) {
    }

    public void selectFirstRow() {
    }

    public void selectPreviusRow() {
    }

    public void selectNextRow() {
    }

    public void selectLastRow() {
    }

    public int getSelectedRow() {
        return -1;
    }

    public int getRowCount() {
        return -1;
    }

    public void setSelectedRow(int row) {
    }

    public void setSelectedRow(String clave, int column) {
    }

    public Object getSelectedValue(String column) {
        return null;
    }

    public void controlReport(boolean export) {
    }

    public void controlAdd() {
    }

    public void controlModify() {
    }

    public void controlEliminate() {
    }

    public void controlDetails() {
    }

    public void controlSearch() {
    }

    public void controlClose() {
    }

    public void controlRefresh() {
    }

    public void controlNullify() {
    }

    public void controlClone() {
    }

    public void windowOpened(WindowEvent e) {
    }

    public void windowClosing(WindowEvent e) {
    }

    public void windowClosed(WindowEvent e) {
    }

    public void windowIconified(WindowEvent e) {
    }

    public void windowDeiconified(WindowEvent e) {
    }

    public void windowActivated(WindowEvent e) {
    }

    public void windowDeactivated(WindowEvent e) {
    }

    public void focusGained(FocusEvent e) {
    }

    public void focusLost(FocusEvent e) {
    }

    public void keyTyped(KeyEvent e) {
    }

    public void keyPressed(KeyEvent e) {
    }

    public void keyReleased(KeyEvent e) {
    }

    public void actionPerformed(ActionEvent e) {
        if (cbFirst == e.getSource()) {
            selectFirstRow();
        }

        if (cbPrevius == e.getSource()) {
            selectPreviusRow();
        }

        if (cbNext == e.getSource()) {
            selectNextRow();
        }

        if (cbLast == e.getSource()) {
            selectLastRow();
        }

        if (cbAdd == e.getSource()) {
            controlAdd();
        }

        if (cbModify == e.getSource()) {
            controlModify();
        }

        if (cbEliminate == e.getSource()) {
            controlEliminate();
        }

        if (cbDetails == e.getSource()) {
            controlDetails();
        }

        if (cbSearch == e.getSource()) {
            controlSearch();
        }

        if (cbPrint == e.getSource()) {
            controlPrint(true);
        }

        if (cbClose == e.getSource()) {
            controlClose();
        }

        if (cbRefresh == e.getSource()) {
            controlRefresh();
        }

        if (cbPrintFast == e.getSource()) {
            controlPrint(false);
        }

        if (cbNullify == e.getSource()) {
            controlNullify();
        }

        if (cbClone == e.getSource()) {
            controlClone();
        }

        if (cbReport == e.getSource()) {
            controlReport(false);
        }

        if (e.getSource() == miInsert) {
            controlAdd();
        }

        if (e.getSource() == miUpdate) {
            controlModify();
        }

        if (e.getSource() == miDelete) {
            controlEliminate();
        }

        if (e.getSource() == miDetail) {
            controlDetails();
        }

        if (e.getSource() == miPrint) {
            controlPrint(true);
        }

        if (e.getSource() == miRefresh) {
            controlRefresh();
        }
    }

    public void setValueSearch(Object valor, Component comp) {
    }

    public void selectFirstPage() {
    }

    public void selectPreviusPage() {
    }

    public void selectNextPage() {
    }

    public void selectLastPage() {
    }

    public int getSelectedPage() {
        return 0;
    }

    public int getPageCount() {
        return 0;
    }
}
