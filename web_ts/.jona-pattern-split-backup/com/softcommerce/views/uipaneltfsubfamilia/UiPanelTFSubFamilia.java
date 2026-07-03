package com.softcommerce.views.uipaneltfsubfamilia;


import com.softcommerce.formularios.*;
import com.softcommerce.beans.BeanFamilia;
import com.softcommerce.beans.BeanSubFamilia;
import com.softcommerce.beans.Usuario;
import com.softcommerce.general.controles.Register;
import java.awt.event.ItemEvent;
import java.awt.event.KeyAdapter;
import java.awt.event.MouseAdapter;
import java.awt.event.MouseEvent;
import com.softcommerce.general.controles.IntegerDocument;
import com.softcommerce.general.controles.UpperCaseNumberDocument;
import java.awt.Color;
import java.awt.Font;
import java.util.ArrayList;
import java.util.List;
import javax.swing.JComboBox;
import javax.swing.JLabel;
import javax.swing.JPanel;
import javax.swing.JTextField;
import javax.swing.RowFilter;
import javax.swing.border.LineBorder;
import javax.swing.event.ListSelectionEvent;
import com.softcommerce.reglasnegocio.RnSubFamilia;
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
import java.awt.event.FocusListener;
import java.awt.event.KeyListener;
import java.awt.event.FocusEvent;
import java.awt.event.ItemListener;
import java.awt.event.KeyEvent;
import javax.swing.JFrame;
import com.softcommerce.general.tablas.SubFamiliaTableModel;
import com.softcommerce.util.ExceptionHandler;
import com.softcommerce.util.ExportExcel;
import com.softcommerce.util.combo.LoadComboItem;
import java.awt.FlowLayout;
import java.util.HashMap;
import java.util.Map;
import javax.swing.JOptionPane;
import org.apache.log4j.Logger;

public class UiPanelTFSubFamilia
        extends JHInternalFrame
        implements InterUiPanelTFSubFamilia, ListSelectionListener, FocusListener, KeyListener, ItemListener {

    public CTable table;
    public SubFamiliaTableModel modeltable;
    public TableRowSorter modeloOrdenado;
    private JTextField txtIdSubFamilia;
    private JTextField txtDescripcion;
    private JComboBox cboFamilia;
    private final Usuario usuario;
    private JScrollPane scroll;
    private final JFrame frame;
    private final Logger logger = Logger.getLogger(UiPanelTFSubFamilia.class);

    public UiPanelTFSubFamilia(String title, JFrame frame, Usuario usuario) {
        super(title);
        this.usuario = usuario;
        this.frame = frame;
        inicialize();
    }

    public UiPanelTFSubFamilia(String title, JFrame frame, Usuario usuario, List<Boolean> vPermiso) {
        super(title, vPermiso.get(0), vPermiso.get(1), vPermiso.get(2), vPermiso.get(3), vPermiso.get(4), vPermiso.get(5), vPermiso.get(6), vPermiso.get(7), vPermiso.get(8), vPermiso.get(9), vPermiso.get(10), vPermiso.get(11), vPermiso.get(12));
        this.usuario = usuario;
        this.frame = frame;
        inicialize();
    }

    private void inicialize() {
        modeltable = new SubFamiliaTableModel();
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

        table.setNoVisibleColumn(4);

        table.addKeyListener(new KeyAdapter() {
            @Override
            public void keyReleased(KeyEvent e) {
                if (e.getKeyCode() != 127) {
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
        pnlaux.add(panel, BorderLayout.NORTH);

        scroll.setPreferredSize(new Dimension(1200, 380));
        pnlaux.add(scroll, BorderLayout.CENTER);

        setTable(pnlaux);
    }

    public JPanel getPanelFilter() {
        JPanel pnlp = new JPanel();
        pnlp.setBorder(new LineBorder(new Color(130, 135, 144)));
        pnlp.setLayout(new FlowLayout(FlowLayout.LEFT));

        JLabel lbl_idsubfamilia = new JLabel("Código");
        lbl_idsubfamilia.setFont(new Font("Verdana", 0, 11));
        pnlp.add(lbl_idsubfamilia);

        txtIdSubFamilia = new JTextField();
        txtIdSubFamilia.setColumns(7);
        txtIdSubFamilia.addKeyListener(this);
        txtIdSubFamilia.setDocument(new IntegerDocument(6));
        txtIdSubFamilia.addFocusListener(this);
        txtIdSubFamilia.setFont(new Font("Garamond", 0, 14));
        pnlp.add(txtIdSubFamilia);

        JLabel lbl_idfamilia = new JLabel("Familia");
        lbl_idfamilia.setFont(new Font("Verdana", 0, 11));
        pnlp.add(lbl_idfamilia);

        cboFamilia = new JComboBox();
        cboFamilia.addItemListener(this);
        cboFamilia.addKeyListener(this);
        pnlp.add(cboFamilia);

        JLabel lblItem = new JLabel("Desc.");
        lblItem.setFont(new Font("Verdana", 0, 11));
        pnlp.add(lblItem);

        txtDescripcion = new JTextField();
        txtDescripcion.setColumns(7);
        txtDescripcion.addFocusListener(this);
        txtDescripcion.setFont(new Font("Garamond", 0, 14));
        txtDescripcion.setDocument(new UpperCaseNumberDocument(255));
        txtDescripcion.addKeyListener(this);
        pnlp.add(txtDescripcion);

        return pnlp;
    }

    @Override
    public void controlReport(boolean export) {
        if (table.getRowCount() == 0) {
            return;
        }

        Map parameters = new HashMap();
        parameters.put(0, usuario.getDescriempresa());
        parameters.put(1, "Ruc: " + usuario.getRuc());
        parameters.put(2, "Sub Familia");
        ExportExcel.exportar(table, parameters);
    }

    public void filtrar() {
        modeloOrdenado.setRowFilter(getFilter());
        table.setAllColumnPreferredWidth();

        if (table.getRowCount() > 0) {
            table.setRowSelectionInterval(0, 0);
        }
    }

    @Override
    public void keyReleased(KeyEvent e) {
        if (e.getKeyChar() != '\n') {
            if ((e.getSource() == txtDescripcion)
                    || (e.getSource() == txtIdSubFamilia)) {
                filtrar();
            }
        }
    }

    public RowFilter getFilter() {
        List filters = new ArrayList();

        if (txtIdSubFamilia.getText().trim().length() > 0) {
            filters.add(RowFilter.regexFilter(".*" + txtIdSubFamilia.getText().trim() + ".*", 1));
        }

        if (txtDescripcion.getText().trim().length() > 0) {
            filters.add(RowFilter.regexFilter(".*" + txtDescripcion.getText().trim() + ".*", 3));
        }

        if (cboFamilia.getSelectedIndex() > 0) {
            filters.add(RowFilter.regexFilter(".*" + LoadComboItem.getIdFamiliaCombo(cboFamilia) + ".*", 4));
        }

        RowFilter fooBarFilter = RowFilter.andFilter(filters);

        return fooBarFilter;
    }

    @Override
    public void cargarFiltro() {
        try {
            LoadComboItem.loadComboFamilia(path, cboFamilia, usuario);
        } catch (Exception e) {
            ExceptionHandler.handleException(e, logger);
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }

    @Override
    public void focusGained(FocusEvent e) {
        if (e.getSource() instanceof JTextField) {
            ((JTextField) e.getSource()).selectAll();
        }
    }

    @Override
    public void controlPrint(boolean view) {
    }

    @Override
    public void controlAdd() {
        setCursor(new Cursor(Cursor.WAIT_CURSOR));

        RegisterSubFamilia register = new RegisterSubFamilia(frame, usuario);
        register.setPath(path);
        register.setRowSelection(this);
        register.setView(this);
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

        RegisterSubFamilia register = new RegisterSubFamilia(frame, usuario);
        register.setPath(path);
        register.setRowSelection(this);
        register.setView(this);
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

        RegisterSubFamilia register = new RegisterSubFamilia(frame, usuario);
        register.setPath(path);
        register.setRowSelection(this);
        register.setView(this);

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

        RegisterSubFamilia register = new RegisterSubFamilia(frame, usuario);
        register.setPath(path);
        register.setRowSelection(this);
        register.setView(this);

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

        RegisterSubFamilia register = new RegisterSubFamilia(frame, usuario);
        register.setPath(path);
        register.setRowSelection(this);
        register.setView(this);
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

    @Override
    public void cargarTabla() {
        try {
            BeanSubFamilia a = new BeanSubFamilia();
            BeanFamilia fam = new BeanFamilia();
            a.setBeanFamilia(fam);
            RnSubFamilia regla = new RnSubFamilia(path);

            modeloOrdenado.setRowFilter(null);
            modeltable.clearTable();
            modeltable.agregarVectorSubFamilia(regla.listar(a));
            modeloOrdenado.setRowFilter(getFilter());
            table.setAllColumnPreferredWidth();
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }

    @Override
    public void focusLost(FocusEvent e) {
        if (e.getSource() == txtIdSubFamilia && txtIdSubFamilia.getText().trim().length() > 0) {
            String serie = "000" + txtIdSubFamilia.getText().trim();
            String nuevaserie = serie.substring(serie.length() - 3, serie.length());

            txtIdSubFamilia.setText(nuevaserie);

            filtrar();
        }
    }

    @Override
    public void keyPressed(KeyEvent e) {
        if (e.getKeyChar() == '\n') {
            if (e.getSource() == txtIdSubFamilia) {
                cboFamilia.requestFocus();
            }

            if (e.getSource() == cboFamilia) {
                txtDescripcion.requestFocus();
            }
        }
    }

    @Override
    public void itemStateChanged(ItemEvent e) {
        if (cboFamilia == e.getSource()) {
            if (cboFamilia.getSelectedIndex() >= 0) {
                filtrar();
            }
        }
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
    public void keyTyped(KeyEvent e) {
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
