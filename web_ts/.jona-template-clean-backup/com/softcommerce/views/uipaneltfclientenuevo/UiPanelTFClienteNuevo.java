/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.softcommerce.views.uipaneltfclientenuevo;


import com.softcommerce.formularios.*;
import com.softcommerce.beans.Usuario;
import com.softcommerce.general.controles.CTable;
import com.softcommerce.general.controles.IntegerDocument;
import com.softcommerce.general.controles.JHInternalFrame;
import com.softcommerce.general.controles.Register;
import com.softcommerce.general.controles.UpperCaseDocument;
import com.softcommerce.general.tablas.ClienteSustitutoTableModel;
import com.softcommerce.general.tablas.ClienteTableModel;
import com.softcommerce.reglasnegocio.RnCliente;
import com.softcommerce.util.Constans;
import java.awt.BorderLayout;
import java.awt.Color;
import java.awt.Component;
import java.awt.Cursor;
import java.awt.Dimension;
import java.awt.event.FocusEvent;
import java.awt.event.FocusListener;
import java.awt.event.ItemEvent;
import java.awt.event.ItemListener;
import java.awt.event.KeyEvent;
import java.awt.event.KeyListener;
import java.awt.event.MouseEvent;
import java.awt.event.MouseListener;
import java.util.ArrayList;
import java.util.List;
import javax.swing.JCheckBox;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import javax.swing.JScrollPane;
import javax.swing.JTextField;
import javax.swing.RowFilter;
import javax.swing.SwingConstants;
import javax.swing.border.LineBorder;
import javax.swing.event.ListSelectionEvent;
import javax.swing.event.ListSelectionListener;
import javax.swing.table.TableRowSorter;
import com.softcommerce.util.ExportExcel;
import java.awt.GridBagConstraints;
import java.awt.GridBagLayout;
import java.awt.Insets;
import java.util.HashMap;
import java.util.Map;
import javax.swing.JComponent;
import javax.swing.JToolBar;

public class UiPanelTFClienteNuevo
        extends JHInternalFrame
        implements InterUiPanelTFClienteNuevo, ListSelectionListener, FocusListener, KeyListener, ItemListener, MouseListener {

    public CTable tableCliente;
    public ClienteTableModel modeltableCliente;
    public TableRowSorter modeloOrdenadoCliente;
    protected JScrollPane scrollCliente;
    protected CTable tableClienteSustituto;
    protected ClienteSustitutoTableModel modeltableClienteSustituto;
    protected TableRowSorter modeloOrdenadoClienteSustituto;
    protected final JFrame frame;
    protected final Usuario usuario;
    protected JTextField txt_codigo;
    protected JTextField txt_numero;
    protected JTextField txt_descripcion;
    protected JCheckBox chk_percepcion;
    protected JCheckBox chk_retencion;
    protected JCheckBox chk_exceptuado;
    protected int posGnral;

    public UiPanelTFClienteNuevo(String title, JFrame frame, Usuario usuario) {
        super(title + " - UiPanelTFClienteNuevo", true, true, true, false, false, true, true, false, true, false, false, true, true);
        this.usuario = usuario;
        this.frame = frame;
        inicialize();
        initListener();
    }

    public UiPanelTFClienteNuevo(String title, JFrame frame, Usuario usuario, List<Boolean> vPermiso) {
        super(title, vPermiso.get(0), vPermiso.get(1), vPermiso.get(2), vPermiso.get(3), vPermiso.get(4), vPermiso.get(5), vPermiso.get(6), vPermiso.get(7), vPermiso.get(8), vPermiso.get(9), vPermiso.get(10), vPermiso.get(11), vPermiso.get(12));
        this.usuario = usuario;
        this.frame = frame;
        inicialize();
        initListener();
    }

    public UiPanelTFClienteNuevo(String title, JFrame frame, Usuario usuario, boolean vendedor) {
        super(title + " - UiPanelTFClienteNuevo", false, false, false, false, false, true, true, false, true, false, false, true, true);
        this.usuario = usuario;
        this.frame = frame;
        inicialize();
        initListener();
    }

    protected void inicialize() {
        modeltableCliente = new ClienteTableModel();
        modeloOrdenadoCliente = new TableRowSorter(modeltableCliente);
        tableCliente = new CTable();
        tableCliente.setRowSorter(modeloOrdenadoCliente);
        tableCliente.setModel(modeltableCliente);
        tableCliente.setAllTableNoEditable();
        tableCliente.setAllColumnNoResizable();
        tableCliente.setRendererColumnZero();
        tableCliente.setAllColumnPreferredWidth();
        tableCliente.setNoVisibleColumn(2);
        tableCliente.setNoVisibleColumn(4);
        tableCliente.setNoVisibleColumn(5);
        tableCliente.setNoVisibleColumn(6);
        tableCliente.setNoVisibleColumn(7);
        tableCliente.setNoVisibleColumn(8);

        scrollCliente = new JScrollPane(tableCliente);

        JPanel pnlaux = new JPanel();
        pnlaux.setLayout(new BorderLayout(0, 0));
        JPanel panel = getPanelFilter();
        panel.setPreferredSize(new Dimension(1200, 100));
        pnlaux.add(panel, BorderLayout.NORTH);

        scrollCliente.setPreferredSize(new Dimension(1200, 200));
        pnlaux.add(scrollCliente, BorderLayout.CENTER);

        JScrollPane scrollClienteSustituto = this.getScrollClienteSustituto();
        if (Constans.IS_CLIENTE_SUSTITUTO) {
            pnlaux.add(scrollClienteSustituto, BorderLayout.SOUTH);
        } else {
            tableCliente.setNoVisibleColumn(14);
        }
        if (!Constans.IS_CLIENTE_CONDICION_PAGO) {
            tableCliente.setNoVisibleColumn(15);
            tableCliente.setNoVisibleColumn(16);
        }
        tableCliente.setColumnMinWidth(2, 350);
        tableCliente.setColumnMaxWidth(2, 350);
        tableCliente.setColumnMinWidth(4, 350);
        tableCliente.setColumnMaxWidth(4, 350);
        setTable(pnlaux);
    }

    protected JScrollPane getScrollClienteSustituto() {
        modeltableClienteSustituto = new ClienteSustitutoTableModel();
        modeloOrdenadoClienteSustituto = new TableRowSorter(modeltableClienteSustituto);
        tableClienteSustituto = new CTable();
        tableClienteSustituto.setRowSorter(modeloOrdenadoClienteSustituto);
        tableClienteSustituto.setModel(modeltableClienteSustituto);
        tableClienteSustituto.setAllTableNoEditable();
        tableClienteSustituto.setAllColumnNoResizable();
        tableClienteSustituto.setRendererColumnZero();
        tableClienteSustituto.setAllColumnPreferredWidth();
        tableClienteSustituto.setNoVisibleColumn(0);
        tableClienteSustituto.setNoVisibleColumn(1);
        tableClienteSustituto.setNoVisibleColumn(9);
        tableClienteSustituto.setNoVisibleColumn(10);
        tableClienteSustituto.setNoVisibleColumn(11);
        JScrollPane scroll = new JScrollPane(tableClienteSustituto);
        scroll.setPreferredSize(new Dimension(1200, 200));
        return scroll;
    }

    protected void initListener() {
        txt_codigo.addKeyListener(this);
        txt_codigo.addFocusListener(this);
        txt_numero.addKeyListener(this);
        txt_numero.addFocusListener(this);
        txt_descripcion.addKeyListener(this);
        txt_descripcion.addFocusListener(this);
        chk_percepcion.addItemListener(this);
        chk_percepcion.addKeyListener(this);
        chk_percepcion.addFocusListener(this);
        chk_retencion.addItemListener(this);
        chk_retencion.addKeyListener(this);
        chk_retencion.addFocusListener(this);
        chk_exceptuado.addItemListener(this);
        chk_exceptuado.addKeyListener(this);
        chk_exceptuado.addFocusListener(this);
        tableCliente.getSelectionModel().addListSelectionListener(this);
        tableCliente.addMouseListener(this);
        tableCliente.addKeyListener(this);
    }

    protected void addGrid(JPanel pnl, GridBagConstraints gbc, int x, int y, JComponent component) {
        gbc.gridx = x;
        gbc.gridy = y;
        gbc.fill = GridBagConstraints.HORIZONTAL;
        gbc.insets = new Insets(5, 5, 5, 5);
        pnl.add(component, gbc);
    }

    protected JPanel getPanelFilter() {
        JPanel pnlp = new JPanel();
        pnlp.setBorder(new LineBorder(new Color(130, 135, 144)));
        pnlp.setLayout(new GridBagLayout());

        GridBagConstraints gbc = new GridBagConstraints();
        gbc.weightx = 1.0;
        gbc.weighty = 1.0;

        JToolBar tool1 = new JToolBar();
        tool1.setFloatable(false);

        JToolBar tool2 = new JToolBar();
        tool2.setFloatable(false);

        JLabel lbl_codigo = new JLabel("   Código ");
        tool1.add(lbl_codigo);

        txt_codigo = new JTextField();
        txt_codigo.setDocument(new IntegerDocument(10));
        tool1.add(txt_codigo);

        JLabel lbl_numero = new JLabel("   DNI/RUC  ");
        tool1.add(lbl_numero);

        txt_numero = new JTextField();
        txt_numero.setDocument(new IntegerDocument(11));
        tool1.add(txt_numero);

        JLabel lbl_descripcion = new JLabel("   R. Social ");
        tool1.add(lbl_descripcion);

        txt_descripcion = new JTextField();
        txt_descripcion.setDocument(new UpperCaseDocument(100));
        tool1.add(txt_descripcion);
        addGrid(pnlp, gbc, 0, 0, tool1);

        chk_percepcion = new JCheckBox("Ag Percepcion");
        chk_percepcion.setHorizontalTextPosition(SwingConstants.RIGHT);
        chk_percepcion.setOpaque(false);
        tool2.add(chk_percepcion);

        chk_retencion = new JCheckBox("Ag Retencion");
        chk_retencion.setHorizontalTextPosition(SwingConstants.RIGHT);
        chk_retencion.setOpaque(false);
        tool2.add(chk_retencion);

        chk_exceptuado = new JCheckBox("Exceptuado");
        chk_exceptuado.setHorizontalTextPosition(SwingConstants.RIGHT);
        chk_exceptuado.setOpaque(false);
        tool2.add(chk_exceptuado);
        addGrid(pnlp, gbc, 0, 1, tool2);

        return pnlp;
    }

    @Override
    public void cargarTabla() {
    }

    protected RowFilter getFilter() {
        return null;
    }

    protected void setScrollValueView(int row) {
        scrollCliente.getVerticalScrollBar().setValue(tableCliente.getRowHeight() * row);
    }

    protected void filtrar() {
    }

    protected void cargarClienteSustitutos(int pos, String id_cliente, int cantSusti) {
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
        if (tableCliente.getRowCount() > 0) {
            tableCliente.setRowSelectionInterval(0, 0);
            setScrollValueView(0);
        }
    }

    @Override
    public void selectPreviusRow() {
        if (tableCliente.getRowCount() > 0) {
            if (tableCliente.getSelectedRow() > 0) {
                int row = tableCliente.getSelectedRow() - 1;
                tableCliente.setRowSelectionInterval(row, row);
                setScrollValueView(row);
            }
        }
    }

    @Override
    public void selectNextRow() {
        if (tableCliente.getRowCount() > 0) {
            if (tableCliente.getSelectedRow() < tableCliente.getRowCount() - 1) {
                int row = tableCliente.getSelectedRow() + 1;
                tableCliente.setRowSelectionInterval(row, row);
                setScrollValueView(row);
            }
        }
    }

    @Override
    public void selectLastRow() {
        if (tableCliente.getRowCount() > 0) {
            int rowCount = tableCliente.getRowCount() - 1;
            tableCliente.setRowSelectionInterval(rowCount, rowCount);
            setScrollValueView(rowCount);
        }
    }

    @Override
    public int getSelectedRow() {
        return tableCliente.getSelectedRow();
    }

    @Override
    public int getRowCount() {
        return tableCliente.getRowCount();
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
            tableCliente.setRowSelectionInterval(row, row);
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
    public void focusGained(FocusEvent e) {
        if (e.getSource() instanceof JTextField) {
            ((JTextField) e.getSource()).selectAll();
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
    }

    @Override
    public void keyReleased(KeyEvent e) {
        if ((e.getKeyCode() == KeyEvent.VK_DOWN) || (e.getKeyCode() == KeyEvent.VK_UP) || (e.getKeyCode() == KeyEvent.VK_PAGE_DOWN) || (e.getKeyCode() == KeyEvent.VK_PAGE_UP)) {
            if (e.getSource() == tableCliente) {
                cargarClienteSustitutos(Integer.parseInt(getSelectedValue(0).toString()), getSelectedValue(1).toString().trim(), Integer.parseInt(getSelectedValue(14).toString()));
            }
        }
        if (e.getKeyChar() != '\n') {
            if ((e.getSource() == txt_codigo)) {
                filtrar();
            }
            if ((e.getSource() == txt_numero)) {
                filtrar();
            }
            if ((e.getSource() == txt_descripcion)) {
                filtrar();
            }
        }
    }

    @Override
    public void itemStateChanged(ItemEvent e) {
        if (e.getItemSelectable() == chk_percepcion) {
            filtrar();
        }
        if (e.getItemSelectable() == chk_retencion) {
            filtrar();
        }
        if (e.getItemSelectable() == chk_exceptuado) {
            filtrar();
        }
    }

    @Override
    public void mouseClicked(MouseEvent e) {
        if (e.getClickCount() == 1) {
            if (e.getSource() == tableCliente) {
                if (tableCliente.getRowCount() > 0) {
                    cargarClienteSustitutos(Integer.parseInt(getSelectedValue(0).toString()), getSelectedValue(1).toString().trim(), Integer.parseInt(getSelectedValue(14).toString()));
                }
            }
        }
    }

    @Override
    public void mousePressed(MouseEvent e) {
    }

    @Override
    public void mouseReleased(MouseEvent e) {
    }

    @Override
    public void mouseEntered(MouseEvent e) {
    }

    @Override
    public void mouseExited(MouseEvent e) {
    }
}
