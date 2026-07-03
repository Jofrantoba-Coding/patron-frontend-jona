/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.softcommerce.views.uipaneltfclasifinventario;


import com.softcommerce.formularios.*;
import com.softcommerce.beans.Usuario;
import com.softcommerce.general.controles.AbstractRegister;
import java.awt.BorderLayout;
import com.softcommerce.general.controles.CTable;
import javax.swing.Icon;
import javax.swing.JPopupMenu;
import javax.swing.JScrollPane;
import javax.swing.event.ListSelectionEvent;
import javax.swing.table.TableRowSorter;
import com.softcommerce.reglasnegocio.rn_ClasifInventario;
import com.softcommerce.general.controles.ControlView;
import com.softcommerce.general.controles.RowSelection;
import com.softcommerce.general.controles.Register;
import com.softcommerce.general.controles.View;
import java.awt.event.WindowListener;
import javax.swing.event.ListSelectionListener;
import com.softcommerce.general.controles.JHInternalFrame;
import java.awt.event.ActionListener;
import java.awt.event.FocusListener;
import java.awt.event.WindowEvent;
import java.awt.event.KeyListener;
import java.awt.event.ActionEvent;
import java.awt.event.FocusEvent;
import java.awt.event.KeyEvent;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JPanel;
import javax.swing.border.BevelBorder;
import java.awt.CardLayout;
import java.awt.Color;
import java.awt.Component;
import com.softcommerce.iconos.Gif;
import java.awt.FlowLayout;
import javax.swing.SwingConstants;
import java.awt.Dimension;
import java.awt.Font;
import java.awt.event.KeyAdapter;
import java.awt.event.MouseAdapter;
import javax.swing.border.EmptyBorder;
import java.awt.event.MouseEvent;
import javax.swing.JButton;
import javax.swing.JMenuItem;
import javax.swing.JTextField;
import com.softcommerce.general.tablas.ClasifInventarioTableModel;
import com.softcommerce.util.ExportExcel;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 *
 * @author TOSHIBA
 */
public class UiPanelTFClasifInventario extends JHInternalFrame implements InterUiPanelTFClasifInventario, View, ListSelectionListener, RowSelection, ControlView, WindowListener, FocusListener, KeyListener, ActionListener {

    public CTable table;
    public ClasifInventarioTableModel modeltable;
    public TableRowSorter modeloOrdenado;
    public JScrollPane scroll;
    protected String titleJIF;
    protected JLabel lblTitle;
    protected AbstractRegister register;
    protected Usuario usuario;
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
    protected JButton cbExport;
    protected JMenuItem miInsert;
    protected JMenuItem miUpdate;
    protected JMenuItem miClone;
    protected JMenuItem miDelete;
    protected JMenuItem miReport;
    protected JMenuItem miClose;
    protected JMenuItem miSearch;
    protected JMenuItem miDetail;
    protected JMenuItem miNullify;
    protected JMenuItem miPrint;
    protected JMenuItem miPrintFast;
    protected JMenuItem miRefresh;
    protected JMenuItem miExport;
    protected Gif gif;

    public UiPanelTFClasifInventario(AbstractRegister areg, String title, JFrame frm, Usuario usuario) {
        super(title);
        register = areg;
        register.setTitleName(title);
        register.setView((View) this);
        register.setRowSelection((RowSelection) this);
        titleJIF = title;
        this.usuario = usuario;
        inicialize();
    }

    public UiPanelTFClasifInventario(AbstractRegister areg, String title, JFrame frm, Usuario usuario, List<Boolean> vPermiso) {
        super(title, vPermiso.get(0), vPermiso.get(1), vPermiso.get(2), vPermiso.get(3), vPermiso.get(4), vPermiso.get(5), vPermiso.get(6), vPermiso.get(7), vPermiso.get(8), vPermiso.get(9), vPermiso.get(10), vPermiso.get(11), vPermiso.get(12));
        register = areg;
        register.setTitleName(title);
        register.setView((View) this);
        register.setRowSelection((RowSelection) this);
        titleJIF = title;
        this.usuario = usuario;
        inicialize(vPermiso.get(0), vPermiso.get(1), vPermiso.get(2), vPermiso.get(3), vPermiso.get(4), vPermiso.get(5), vPermiso.get(6), vPermiso.get(7), vPermiso.get(8), vPermiso.get(9), vPermiso.get(10), vPermiso.get(11), vPermiso.get(12));
    }

    protected void inicialize() {
        gif = new Gif();

        CardLayout cardView = new CardLayout();
        JPanel pnlCardView = new JPanel(cardView);
        pnlCardView.setBorder(new BevelBorder(1));
        pnlCardView.setOpaque(false);

        JPanel pnl = new JPanel();
        pnl.setLayout(new BorderLayout());

        pnl.add(getPanelRow(), BorderLayout.SOUTH);
        pnl.add(getPanelControl(), BorderLayout.WEST);
        pnl.add(getPanelTable(), BorderLayout.CENTER);

        lblTitle = new JLabel();
        lblTitle.setOpaque(true);
        lblTitle.setFont(new Font(lblTitle.getFont().getFontName(), 1, 14));
        lblTitle.setForeground(new Color(214, 223, 245));
        lblTitle.setBackground(new Color(117, 140, 220));
        lblTitle.setPreferredSize(new Dimension(0, 25));
        lblTitle.setBorder(new EmptyBorder(0, 10, 0, 0));
        pnl.add(lblTitle, BorderLayout.NORTH);

        pnlCardView.add("pnlPrincipal", pnl);
        setPanel(pnlCardView);
    }

    protected void inicialize(boolean swAdd, boolean swModify, boolean swEliminate, boolean swNullify, boolean swClone, boolean swDetails, boolean swSearch, boolean swReport, boolean swExport, boolean swPrint, boolean swPrintFast, boolean swClose, boolean swRefresh) {
    }

    public JPanel getPanelControl() {
        return null;
    }

    public JPanel getPanelControl(boolean swAdd, boolean swModify, boolean swEliminate, boolean swNullify, boolean swClone, boolean swDetails, boolean swSearch, boolean swReport, boolean swExport, boolean swPrint, boolean swPrintFast, boolean swClose, boolean swRefresh) {
        return null;
    }

    public JPanel getPanelRow() {
        JPanel pnlRow = new JPanel();
        pnlRow.setOpaque(false);
        pnlRow.setLayout(new FlowLayout(FlowLayout.LEFT));
        pnlRow.setBackground(new Color(236, 233, 216));
        pnlRow.setBorder(new EmptyBorder(0, 145, 0, 0));

        int a = 25, h = 20;

        JLabel lblRegister = new JLabel("Registro: ");
        lblRegister.setOpaque(false);
        pnlRow.add(lblRegister);

        cbFirst = new JButton(gif.FIRST);
        cbFirst.setPreferredSize(new Dimension(a, h));
        cbFirst.setToolTipText("Primer registro");
        cbFirst.addActionListener(this);
        cbFirst.setOpaque(false);
        pnlRow.add(cbFirst);

        cbPrevius = new JButton(gif.PREVIUS);
        cbPrevius.setPreferredSize(new Dimension(a, h));
        cbPrevius.setToolTipText("Registro anterior");
        cbPrevius.addActionListener(this);
        cbPrevius.setOpaque(false);
        pnlRow.add(cbPrevius);

        txtRow = new JTextField();
        txtRow.setPreferredSize(new Dimension(80, h - 2));
        txtRow.setHorizontalAlignment(SwingConstants.RIGHT);
        pnlRow.add(txtRow);

        cbNext = new JButton(gif.NEXT);
        cbNext.setPreferredSize(new Dimension(a, h));
        cbNext.setToolTipText("Registro siguiente");
        cbNext.addActionListener(this);
        cbNext.setOpaque(false);
        pnlRow.add(cbNext);

        cbLast = new JButton(gif.LAST);
        cbLast.setPreferredSize(new Dimension(a, h));
        cbLast.setToolTipText("Último registro");
        cbLast.addActionListener(this);
        cbLast.setOpaque(false);
        pnlRow.add(cbLast);

        JLabel lblRowCount = new JLabel("de ");
        lblRowCount.setOpaque(false);
        pnlRow.add(lblRowCount);

        return pnlRow;
    }

    public JPopupMenu getMenuTabla() {
        return null;
    }

    public JPanel getPanelTable() {

        modeltable = new ClasifInventarioTableModel();
        modeloOrdenado = new TableRowSorter(modeltable);
        table = new CTable();
        table.setRowSorter(modeloOrdenado);
        table.setModel(modeltable);
        table.setAllTableNoEditable();
        table.setAllColumnNoResizable();
        table.setRendererColumnZero();
        table.setAllColumnPreferredWidth();
        table.setComponentPopupMenu(getMenuTabla());
        table.getSelectionModel().addListSelectionListener(this);
        scroll = new JScrollPane(table);

        table.addKeyListener(new KeyAdapter() {
            @Override
            public void keyReleased(KeyEvent e) {
                if (e.getKeyCode() == 127) {
                    //controlEliminate();
                } else {
                    e.getKeyCode();
                }
            }
        });

        table.addMouseListener(new MouseAdapter() {
            @Override
            public void mouseClicked(MouseEvent e) {
                if (e.getClickCount() == 2) {
                    controlDetails();
                }
            }
        });

        JPanel pnlaux = new JPanel(new BorderLayout());
        pnlaux.setLayout(new BorderLayout(0, 0));
        pnlaux.add(scroll, BorderLayout.CENTER);

        return pnlaux;
    }

    public void cargarTabla() {
    }

    public void refresh() {
    }

    public void cargarFiltro() {
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

    public void setTitle(String title, Icon icon) {
        lblTitle.setText(" " + title);
        lblTitle.setIcon(icon);
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
