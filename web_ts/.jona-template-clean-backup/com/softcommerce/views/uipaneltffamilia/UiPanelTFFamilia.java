package com.softcommerce.views.uipaneltffamilia;


import com.softcommerce.formularios.*;
import com.softcommerce.beans.Usuario;
import com.softcommerce.general.controles.Register;
import java.awt.event.KeyAdapter;
import java.awt.event.MouseAdapter;
import java.awt.event.MouseEvent;
import com.softcommerce.general.controles.IntegerDocument;
import com.softcommerce.general.controles.UpperCaseNumberDocument;
import java.awt.Color;
import java.awt.Font;
import java.util.ArrayList;
import java.util.List;
import javax.swing.JLabel;
import javax.swing.JPanel;
import javax.swing.JTextField;
import javax.swing.RowFilter;
import javax.swing.border.LineBorder;
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
import java.awt.event.FocusListener;
import java.awt.event.KeyListener;
import java.awt.event.FocusEvent;
import java.awt.event.KeyEvent;
import java.util.Date;
import javax.swing.JFrame;
import com.softcommerce.reglasnegocio.RnFamilia;
import com.softcommerce.general.tablas.FamiliaTableModel;
import com.softcommerce.util.ExceptionHandler;
import com.softcommerce.util.ExportExcel;
import java.awt.FlowLayout;
import java.util.HashMap;
import java.util.Map;
import javax.swing.JOptionPane;
import org.apache.log4j.Logger;

public class UiPanelTFFamilia
        extends JHInternalFrame
        implements InterUiPanelTFFamilia, ListSelectionListener, FocusListener, KeyListener {

    public CTable table;
    public FamiliaTableModel modeltable;
    public TableRowSorter modeloOrdenado;
    protected JTextField txt_idsubfamilia;
    protected JTextField txt_descripcionsubfamilia;
    protected final Usuario usuario;
    protected JScrollPane scroll;
    protected final JFrame frame;
    protected Date fechaInicio;
    protected Date fechaFin;
    protected final Logger logger = Logger.getLogger(UiPanelTFFamilia.class);

    public UiPanelTFFamilia(String title, JFrame frame, Usuario usuario) {
        super(title);
        this.usuario = usuario;
        this.frame = frame;
        inicialize();
    }

    public UiPanelTFFamilia(String title, JFrame frame, Usuario usuario, List<Boolean> vPermiso) {
        super(title, vPermiso.get(0), vPermiso.get(1), vPermiso.get(2), vPermiso.get(3), vPermiso.get(4), vPermiso.get(5), vPermiso.get(6), vPermiso.get(7), vPermiso.get(8), vPermiso.get(9), vPermiso.get(10), vPermiso.get(11), vPermiso.get(12));
        this.usuario = usuario;
        this.frame = frame;
        inicialize();
    }

    protected void inicialize() {
        modeltable = new FamiliaTableModel();
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

        txt_idsubfamilia = new JTextField();
        txt_idsubfamilia.addKeyListener(this);
        txt_idsubfamilia.setColumns(7);
        txt_idsubfamilia.setDocument(new IntegerDocument(6));
        txt_idsubfamilia.addFocusListener(this);
        txt_idsubfamilia.setFont(new Font("Garamond", 0, 14));
        pnlp.add(txt_idsubfamilia);

        JLabel lblItem = new JLabel("Desc.");
        lblItem.setFont(new Font("Verdana", 0, 11));
        pnlp.add(lblItem);

        txt_descripcionsubfamilia = new JTextField();
        txt_descripcionsubfamilia.addFocusListener(this);
        txt_descripcionsubfamilia.setColumns(7);
        txt_descripcionsubfamilia.setFont(new Font("Garamond", 0, 14));
        txt_descripcionsubfamilia.setDocument(new UpperCaseNumberDocument(255));
        txt_descripcionsubfamilia.addKeyListener(this);
        pnlp.add(txt_descripcionsubfamilia);

        return pnlp;
    }

    @Override
    public void controlReport(boolean export) {
    }

    public void filtrar() {
    }

    @Override
    public void setFecha(Date fechaInicio, Date fechaFin) {
        this.fechaInicio = fechaInicio;
        this.fechaFin = fechaFin;
    }

    @Override
    public void keyReleased(KeyEvent e) {
        if (e.getKeyChar() != '\n') {
            if ((e.getSource() == txt_descripcionsubfamilia)
                    || (e.getSource() == txt_idsubfamilia)) {
                filtrar();
            }
        }
    }

    public RowFilter getFilter() {
        return null;
    }


    @Override
    public void focusGained(FocusEvent e) {
        if (e.getSource() instanceof JTextField){
            ((JTextField)e.getSource()).selectAll();
        }
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
    public void focusLost(FocusEvent e) {
        if (e.getSource() == txt_idsubfamilia && txt_idsubfamilia.getText().trim().length() > 0) {
            String serie = "000" + txt_idsubfamilia.getText().trim();
            String nuevaserie = serie.substring(serie.length() - 3, serie.length());

            txt_idsubfamilia.setText(nuevaserie);

            filtrar();
        }
    }

    @Override
    public void keyPressed(KeyEvent e) {
        if (e.getKeyChar() == '\n') {
            if (e.getSource() == txt_idsubfamilia) {
                txt_descripcionsubfamilia.requestFocus();
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
