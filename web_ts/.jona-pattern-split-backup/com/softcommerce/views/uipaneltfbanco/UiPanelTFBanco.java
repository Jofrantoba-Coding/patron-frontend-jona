/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.softcommerce.views.uipaneltfbanco;


import com.softcommerce.formularios.*;
import com.softcommerce.beans.Anexo;
import com.softcommerce.beans.Usuario;
import com.softcommerce.general.controles.JHInternalFrame;
import com.softcommerce.general.controles.UpperCaseNumberDocument;
import java.util.ArrayList;
import java.util.List;
import javax.swing.JComboBox;
import javax.swing.JLabel;
import javax.swing.JPanel;
import javax.swing.JTextField;
import javax.swing.RowFilter;
import javax.swing.event.ListSelectionEvent;
import com.softcommerce.general.controles.CTable;
import java.awt.BorderLayout;
import javax.swing.JScrollPane;
import javax.swing.table.TableRowSorter;
import com.softcommerce.reglasnegocio.RnAnexo;
import com.softcommerce.general.controles.ControlView;
import com.softcommerce.general.controles.PopupMenuView;
import com.softcommerce.general.controles.RowSelection;
import com.softcommerce.general.controles.View;
import java.awt.event.WindowListener;
import javax.swing.event.ListSelectionListener;
import java.awt.event.ActionListener;
import java.awt.event.FocusListener;
import java.awt.event.WindowEvent;
import java.awt.event.KeyListener;
import java.awt.event.ActionEvent;
import java.awt.event.FocusEvent;
import java.awt.event.KeyEvent;
import javax.swing.JFrame;
import com.softcommerce.general.controles.Register;
import java.awt.Color;
import java.awt.Component;
import java.awt.Cursor;
import java.awt.Dimension;
import java.awt.Font;
import java.awt.event.KeyAdapter;
import java.awt.event.MouseAdapter;
import java.awt.event.MouseEvent;
import java.util.Date;
import com.softcommerce.general.tablas.AnexoTableModel;
import java.awt.GridBagConstraints;
import java.awt.GridBagLayout;
import java.awt.Insets;
import javax.swing.BorderFactory;
import javax.swing.JOptionPane;
import javax.swing.border.Border;
import javax.swing.border.TitledBorder;

/**
 *
 * @author TOSHIBA
 */
public class UiPanelTFBanco 
        extends JHInternalFrame implements InterUiPanelTFBanco, View, ListSelectionListener, RowSelection, ControlView, WindowListener, FocusListener, KeyListener, ActionListener {

    public CTable table;
    public AnexoTableModel modeltable;
    public TableRowSorter modeloOrdenado;
    public JScrollPane scroll;
    private JTextField txt_idanexo;
    private JTextField txt_descripcionanexo;
    private JTextField txt_tmpruc;
    private JComboBox cbo_tipopersona;
    private Usuario usuario;
    private JFrame frame;
    private Date fechaInicio;
    private Date fechaFin;

    public UiPanelTFBanco(String title, JFrame frame, Usuario usuario) {
        super(title);
        this.usuario = usuario;
        this.frame = frame;
        inicialize();
    }

    public UiPanelTFBanco(String title, JFrame frame, Usuario usuario, List<Boolean> vPermiso) {
        super(title, vPermiso.get(0), vPermiso.get(1), vPermiso.get(2), vPermiso.get(3), vPermiso.get(4), vPermiso.get(5), vPermiso.get(6), vPermiso.get(7), vPermiso.get(8), vPermiso.get(9), vPermiso.get(10), vPermiso.get(11), vPermiso.get(12));
        this.usuario = usuario;
        this.frame = frame;
        inicialize();
    }

    public UiPanelTFBanco(String title, JFrame frame, Usuario usuario, boolean vendedor) {
        super(title, true, true, false, false, false, true, false, true, true, true, false, true, true);
        this.usuario = usuario;
        this.frame = frame;
        inicialize();
    }

    private void inicialize() {
        modeltable = new AnexoTableModel();
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

        table.setNoVisibleColumn(2);
        table.setNoVisibleColumn(4);
        table.setNoVisibleColumn(5);
        table.setNoVisibleColumn(6);
        table.setNoVisibleColumn(7);
        table.setNoVisibleColumn(9);
        table.setNoVisibleColumn(10);
        table.setNoVisibleColumn(12);
        table.setNoVisibleColumn(13);
        table.setNoVisibleColumn(14);
        table.setNoVisibleColumn(15);
        table.setNoVisibleColumn(16);
        table.setNoVisibleColumn(17);
        table.setNoVisibleColumn(18);
        table.setNoVisibleColumn(19);
        table.setNoVisibleColumn(20);
        table.setNoVisibleColumn(21);
        table.setNoVisibleColumn(22);
        table.setNoVisibleColumn(23);
        table.setNoVisibleColumn(24);
        table.setNoVisibleColumn(25);
        table.setNoVisibleColumn(26);
        table.setNoVisibleColumn(27);
        table.setNoVisibleColumn(28);
        table.setNoVisibleColumn(29);
        table.setNoVisibleColumn(35);
        table.setNoVisibleColumn(34);
        table.setNoVisibleColumn(33);

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
        JPanel pnlPrinc = new JPanel();
        pnlPrinc.setLayout(new BorderLayout());
        Border border = BorderFactory.createTitledBorder(null, "", TitledBorder.LEFT, TitledBorder.DEFAULT_POSITION, new Font("Comic Sans MS", 0, 12), Color.BLACK);
        pnlPrinc.setBorder(border);
        JPanel pnlp = new JPanel();
        pnlPrinc.add(pnlp, BorderLayout.WEST);
        pnlp.setLayout(new GridBagLayout());
        GridBagConstraints gbc = new GridBagConstraints();
        gbc.gridx = 0;
        gbc.gridy = 0;
        gbc.anchor = GridBagConstraints.WEST;
        gbc.insets = new Insets(2, 2, 2, 2);

        JLabel lblCodigo = new JLabel("Código");
        lblCodigo.setFont(new Font("Verdana", 0, 11));
        pnlp.add(lblCodigo, gbc);

        txt_idanexo = new JTextField();
        //txt_idanexo.setBounds(80, 25, 90, 20);
        txt_idanexo.addKeyListener(this);
        txt_idanexo.addFocusListener(this);
        txt_idanexo.setDocument(new UpperCaseNumberDocument(255));
        txt_idanexo.setFont(new Font("Garamond", 0, 14));
        txt_idanexo.setColumns(10);
        gbc.gridx = 1;
        pnlp.add(txt_idanexo, gbc);

        JLabel lblNumero = new JLabel("DNI/RUC");
        //lbl_CodigoAlterno.setBounds(210, 25, 70, 20);
        lblNumero.setFont(new Font("Verdana", 0, 11));
        gbc.gridx = 2;
        pnlp.add(lblNumero, gbc);

        txt_tmpruc = new JTextField();
        //txt_tmpruc.setBounds(275, 25, 90, 20);
        txt_tmpruc.addFocusListener(this);
        txt_tmpruc.addKeyListener(this);
        txt_tmpruc.setColumns(10);
        txt_tmpruc.setDocument(new UpperCaseNumberDocument(255));
        txt_tmpruc.setFont(new Font("Garamond", 0, 14));
        gbc.gridx = 3;
        pnlp.add(txt_tmpruc, gbc);

        JLabel lblRazonSocial = new JLabel("R. Social");
        lblRazonSocial.setFont(new Font("Verdana", 0, 11));
        //lblItem.setBounds(425, 25, 50, 20);
        gbc.gridx = 4;
        pnlp.add(lblRazonSocial, gbc);

        gbc.gridx = 5;
        txt_descripcionanexo = new JTextField();
        txt_descripcionanexo.setColumns(25);
        //txt_descripcionanexo.setBounds(485, 25, 360, 20);
        txt_descripcionanexo.addFocusListener(this);
        txt_descripcionanexo.setDocument(new UpperCaseNumberDocument(255));
        txt_descripcionanexo.setFont(new Font("Garamond", 0, 14));
        txt_descripcionanexo.addKeyListener(this);
        pnlp.add(txt_descripcionanexo, gbc);

        gbc.gridx = 6;
        JLabel lblTipo = new JLabel("T. Persona");
        lblTipo.setFont(new Font("Verdana", 0, 11));
        pnlp.add(lblTipo, gbc);

        cbo_tipopersona = new JComboBox();
        gbc.gridx = 7;
        //cbo_tipopersona.setBounds(935, 25, 180, 20);
        cbo_tipopersona.addActionListener(this);
        cbo_tipopersona.addKeyListener(this);
        pnlp.add(cbo_tipopersona,gbc);

        return pnlPrinc;
    }

    @Override
    public void controlReport(boolean export) {
        try {
        } catch (Exception ex) {
            JOptionPane.showMessageDialog(this, ex.toString());
        }
    }

    public void filtrar() {
        modeloOrdenado.setRowFilter(getFilter());
        table.setAllColumnPreferredWidth();

        if (table.getRowCount() > 0) {
            table.setRowSelectionInterval(0, 0);
        }
    }

    public void setFecha(Date fechaInicio, Date fechaFin) {
        this.fechaInicio = fechaInicio;
        this.fechaFin = fechaFin;
    }

    @Override
    public void keyReleased(KeyEvent e) {
        if (e.getKeyChar() != '\n') {
            if ((e.getSource() == txt_descripcionanexo)
                    || (e.getSource() == txt_tmpruc)
                    || (e.getSource() == txt_idanexo)) {
                filtrar();
            }
        }
    }

    public RowFilter getFilter() {
        List filters = new ArrayList();

        if (txt_descripcionanexo.getText().trim().length() > 0) {
            filters.add(RowFilter.regexFilter(".*" + txt_descripcionanexo.getText().trim() + ".*", 3));
        }

        if (txt_idanexo.getText().trim().length() > 0) {
            filters.add(RowFilter.regexFilter(".*" + txt_idanexo.getText().trim() + ".*", 1));
        }

        if (txt_tmpruc.getText().trim().length() > 0) {
            filters.add(RowFilter.regexFilter(".*" + txt_tmpruc.getText().trim() + ".*", 8));
        }

        if (cbo_tipopersona.getSelectedIndex() > 0) {
            filters.add(RowFilter.regexFilter(".*" + (cbo_tipopersona.getSelectedItem().equals("NATURAL") ? "N" : "J") + ".*", 2));
        }

        RowFilter fooBarFilter = RowFilter.andFilter(filters);

        return fooBarFilter;
    }

    public void cargarFiltro() {
        loadCondPago();
    }

    public void loadCondPago() {
        cbo_tipopersona.addItem("--- SELECCIONE T. PERSONA ---");
        cbo_tipopersona.addItem("NATURAL");
        cbo_tipopersona.addItem("JURIDICA");
        cbo_tipopersona.setSelectedIndex(0);
    }

    @Override
    public void focusGained(FocusEvent e) {
        if (e.getSource() instanceof JTextField) {
            ((JTextField) e.getSource()).selectAll();
        }
    }

    @Override
    public void actionPerformed(ActionEvent e) {
        if (e.getSource() == cbo_tipopersona) {
            if (cbo_tipopersona.getItemCount() > 0) {
                if (cbo_tipopersona.getSelectedIndex() >= 0) {
                    filtrar();
                }
            }
        }
    }

    @Override
    public void controlPrint(boolean view) {
        if (table.getRowCount() == 0 || table.getSelectedRow() < 0) {
            return;
        }

        try {
        } catch (Exception ex) {
        }
    }

    @Override
    public void controlAdd() {
        setCursor(new Cursor(Cursor.WAIT_CURSOR));

        RegisterBancoAnexo register = new RegisterBancoAnexo(frame, usuario);
        register.setPath(path);
        register.setRowSelection(this);
        register.setView(this);
        register.setFecha(fechaInicio, fechaFin);
        register.setModeRegister(Register.INSERT);
        register.setVisible(true);

        setCursor(new Cursor(Cursor.DEFAULT_CURSOR));
    }

    @Override
    public void controlModify() {
        if (table.getRowCount() == 0 || table.getSelectedRow() < 0) {
            return;
        }

        setCursor(new Cursor(Cursor.WAIT_CURSOR));

        RegisterBancoAnexo register = new RegisterBancoAnexo(frame, usuario);
        register.setPath(path);
        register.setRowSelection(this);
        register.setView(this);
        register.setFecha(fechaInicio, fechaFin);

        if (register.setModeRegister(Register.UPDATE)) {
            register.setVisible(true);
        } else {
            controlRefresh();
            register.dispose();
        }

        setCursor(new Cursor(Cursor.DEFAULT_CURSOR));
    }

    @Override
    public void controlNullify() {
        if (table.getRowCount() == 0 || table.getSelectedRow() < 0) {
            return;
        }

        setCursor(new Cursor(Cursor.WAIT_CURSOR));

        setCursor(new Cursor(Cursor.DEFAULT_CURSOR));
    }

    @Override
    public void controlEliminate() {
        if (table.getRowCount() == 0 || table.getSelectedRow() < 0) {
            return;
        }

        setCursor(new Cursor(Cursor.WAIT_CURSOR));

        RegisterBancoAnexo register = new RegisterBancoAnexo(frame, usuario);
        register.setPath(path);
        register.setRowSelection(this);
        register.setView(this);
        register.setFecha(fechaInicio, fechaFin);

        if (register.setModeRegister(Register.DELETE)) {
            register.setVisible(true);
        } else {
            controlRefresh();
            register.dispose();
        }

        setCursor(new Cursor(Cursor.DEFAULT_CURSOR));
    }

    @Override
    public void controlClone() {
        if (table.getRowCount() == 0 || table.getSelectedRow() < 0) {
            return;
        }

        setCursor(new Cursor(Cursor.WAIT_CURSOR));

        RegisterBancoAnexo register = new RegisterBancoAnexo(frame, usuario);
        register.setPath(path);
        register.setRowSelection(this);
        register.setView(this);
        register.setFecha(fechaInicio, fechaFin);

        if (register.setModeRegister(Register.CLONE)) {
            register.setVisible(true);
        } else {
            controlRefresh();
            register.dispose();
        }

        setCursor(new Cursor(Cursor.DEFAULT_CURSOR));
    }

    @Override
    public void controlDetails() {
        if (table.getRowCount() == 0 || table.getSelectedRow() < 0) {
            return;
        }

        setCursor(new Cursor(Cursor.WAIT_CURSOR));

        RegisterBancoAnexo register = new RegisterBancoAnexo(frame, usuario);
        register.setPath(path);
        register.setRowSelection(this);
        register.setView(this);
        register.setFecha(fechaInicio, fechaFin);

        if (register.setModeRegister(Register.DETAIL)) {
            register.setVisible(true);
        } else {
            controlRefresh();
            register.dispose();
        }

        setCursor(new Cursor(Cursor.DEFAULT_CURSOR));
    }

    @Override
    public void controlClose() {
        dispose();
        doDefaultCloseAction();
    }

    @Override
    public void controlRefresh() {
        cargarTabla();
    }

    @Override
    public Object getSelectedValue(int column) {
        int visibleRowIndex = table.getSelectedRow();
        int realRowIndex = table.convertRowIndexToModel(visibleRowIndex);

        return modeltable.getValueAt(realRowIndex, column);
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

    public void cargarTabla() {
        try {
            RnAnexo regla = new RnAnexo(path);
            modeloOrdenado.setRowFilter(null);
            modeltable.clearTable();
            List<Anexo> listAnexo = regla.listAnexo("3", "", "", "", "");
            modeltable.agregarVectorAnexo(listAnexo);
            modeloOrdenado.setRowFilter(getFilter());
            table.setAllColumnPreferredWidth();
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }

    @Override
    public void focusLost(FocusEvent e) {
        if (e.getSource() == txt_idanexo && txt_idanexo.getText().trim().length() > 0) {
            String serie = "0000000000" + txt_idanexo.getText().trim();
            String nuevaserie = serie.substring(serie.length() - 10, serie.length());

            txt_idanexo.setText(nuevaserie);

            filtrar();
        }
    }

    @Override
    public void keyPressed(KeyEvent e) {
        if (e.getKeyChar() == '\n') {
            if (e.getSource() == txt_idanexo) {
                txt_tmpruc.requestFocus();
            }

            if (e.getSource() == txt_tmpruc) {
                txt_descripcionanexo.requestFocus();
            }

            if (e.getSource() == txt_descripcionanexo) {
                cbo_tipopersona.requestFocus();
            }
        }
    }

    @Override
    public void keyTyped(KeyEvent e) {
    }

    @Override
    public void refreshTitleName() {
    }

    @Override
    public void setSelectedRow(String clave, int column) {
    }

    @Override
    public Object getSelectedValue(String column) {
        return null;
    }

    @Override
    public void controlSearch() {
    }

    @Override
    public void windowOpened(WindowEvent e) {
    }

    @Override
    public void windowClosing(WindowEvent e) {
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
    public void setValueSearch(Object valor, Component comp) {
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
}
