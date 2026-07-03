/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.softcommerce.views.uipaneltftrabajador;


import com.softcommerce.formularios.*;
import com.softcommerce.beans.BeanTipoTrabajador;
import com.softcommerce.beans.Usuario;
import com.softcommerce.general.controles.Register;
import java.awt.event.ItemEvent;
import java.awt.event.KeyAdapter;
import java.awt.event.MouseAdapter;
import java.awt.event.MouseEvent;
import com.softcommerce.general.controles.IntegerDocument;
import java.awt.Color;
import java.awt.Font;
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
import com.softcommerce.conta.tablas.TrabajadorTableModel;
import com.softcommerce.general.controles.PopupMenuView;
import java.awt.event.WindowListener;
import javax.swing.event.ListSelectionListener;
import com.softcommerce.general.controles.JHInternalFrame;
import com.softcommerce.general.controles.UpperCaseDocument;
import java.awt.Component;
import java.awt.Cursor;
import java.awt.Dimension;
import java.awt.event.ActionListener;
import java.awt.event.FocusListener;
import java.awt.event.WindowEvent;
import java.awt.event.KeyListener;
import java.awt.event.ActionEvent;
import java.awt.event.FocusEvent;
import java.awt.event.ItemListener;
import java.awt.event.KeyEvent;
import java.util.Date;
import javax.swing.JFrame;
import com.softcommerce.reglasnegocio.RnTipoTrabajador;
import com.softcommerce.reglasnegocio.RnTrabajador;
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
public class UiPanelTFTrabajador extends JHInternalFrame implements InterUiPanelTFTrabajador, ListSelectionListener, WindowListener, FocusListener, KeyListener, ActionListener, ItemListener {

    public CTable table;
    public TrabajadorTableModel modeltable;
    public TableRowSorter modeloOrdenado;
    protected JTextField txt_nombretrabajador;
    protected JTextField txt_idtrabajador;
    protected JTextField txt_dniruc;
    protected JComboBox cboTipoTrabajador;
    protected List<BeanTipoTrabajador> xTipoTrabajador;
    protected Usuario usuario;
    protected JScrollPane scroll;
    protected JFrame frame;
    protected Date fechaInicio;
    protected Date fechaFin;

    public UiPanelTFTrabajador(String title, JFrame frame, Usuario usuario) {
        super(title);
        this.usuario = usuario;
        this.frame = frame;
        inicialize();
    }

    public UiPanelTFTrabajador(String title, JFrame frame, Usuario usuario, List<Boolean> vPermiso) {
        super(title, vPermiso.get(0), vPermiso.get(1), vPermiso.get(2), vPermiso.get(3), vPermiso.get(4), vPermiso.get(5), vPermiso.get(6), vPermiso.get(7), vPermiso.get(8), vPermiso.get(9), vPermiso.get(10), vPermiso.get(11), vPermiso.get(12));
        this.usuario = usuario;
        this.frame = frame;
        inicialize();
    }

    protected void inicialize() {
        modeltable = new TrabajadorTableModel();
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
        table.setNoVisibleColumn(3);
        /*table.setNoVisibleColumn(4);
        table.setNoVisibleColumn(5);
        table.setNoVisibleColumn(8);
        table.setNoVisibleColumn(11);
        table.setNoVisibleColumn(12);
        table.setNoVisibleColumn(14);
        table.setNoVisibleColumn(15);
        table.setNoVisibleColumn(16);
        table.setNoVisibleColumn(17);
        table.setNoVisibleColumn(18);
        table.setNoVisibleColumn(19);
        table.setNoVisibleColumn(20);
        table.setNoVisibleColumn(21);
        table.moveColumn(4, 3);
        table.moveColumn(7, 4);*/

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

        JLabel lbl_idtrabajador = new JLabel("Código");
        lbl_idtrabajador.setFont(new Font("Verdana", 0, 11));
        pnlp.add(lbl_idtrabajador, gbc);

        txt_idtrabajador = new JTextField();
        txt_idtrabajador.addKeyListener(this);
        txt_idtrabajador.setColumns(10);
        txt_idtrabajador.addFocusListener(this);
        txt_idtrabajador.setDocument(new IntegerDocument(5));
        txt_idtrabajador.setFont(new Font("Verdana", 0, 10));
        gbc.gridx = 1;
        pnlp.add(txt_idtrabajador, gbc);

        JLabel lbl_nombretrabajador = new JLabel("Trabajador");
        //lbl_nombretrabajador.setBounds(180, 25, 70, 20);
        gbc.gridx = 2;
        lbl_nombretrabajador.setFont(new Font("Verdana", 0, 11));
        pnlp.add(lbl_nombretrabajador, gbc);

        gbc.gridx = 3;
        txt_nombretrabajador = new JTextField();
        //txt_nombretrabajador.setBounds(250, 25, 350, 20);
        txt_nombretrabajador.setColumns(30);
        txt_nombretrabajador.addKeyListener(this);
        txt_nombretrabajador.addFocusListener(this);
        txt_nombretrabajador.setDocument(new UpperCaseDocument(200));
        txt_nombretrabajador.setFont(new Font("Verdana", 0, 10));
        pnlp.add(txt_nombretrabajador, gbc);

        gbc.gridx = 4;
        JLabel lbl_dniruc = new JLabel("DNI/RUC");
        //lbl_dniruc.setBounds(670, 25, 65, 20);
        lbl_dniruc.setFont(new Font("Verdana", 0, 11));
        pnlp.add(lbl_dniruc, gbc);

        gbc.gridx = 5;
        txt_dniruc = new JTextField();
        //txt_dniruc.setBounds(735, 25, 100, 20);
        txt_dniruc.setColumns(10);
        txt_dniruc.addKeyListener(this);
        txt_dniruc.addFocusListener(this);
        txt_dniruc.setDocument(new IntegerDocument(11));
        txt_dniruc.setFont(new Font("Verdana", 0, 10));
        pnlp.add(txt_dniruc, gbc);

        gbc.gridx = 6;
        JLabel lbl_tipotrabajador = new JLabel("Area");
        //lbl_tipotrabajador.setBounds(890, 25, 40, 20);
        pnlp.add(lbl_tipotrabajador, gbc);

        gbc.gridx = 7;
        cboTipoTrabajador = new JComboBox();
        cboTipoTrabajador.addActionListener(this);
        cboTipoTrabajador.addKeyListener(this);
        pnlp.add(cboTipoTrabajador);

        return pnlPrinc;
    }

    @Override
    public void controlReport(boolean export) {
    }

    public void filtrar() {
    }

    public void setFecha(Date fechaInicio, Date fechaFin) {
        this.fechaInicio = fechaInicio;
        this.fechaFin = fechaFin;
    }

    @Override
    public void keyReleased(KeyEvent e) {
        if (e.getKeyChar() != '\n') {
            if ((e.getSource() == txt_idtrabajador)
                    || (e.getSource() == txt_nombretrabajador)
                    || (e.getSource() == txt_dniruc)) {
                filtrar();
            }
        }
    }

    public RowFilter getFilter() {
        return null;
    }

    public void cargarFiltro() {
    }

    public void loadTipoTrabajador() {
    }

    @Override
    public void focusGained(FocusEvent e) {
        if (e.getSource() == txt_idtrabajador) {
            txt_idtrabajador.selectAll();
        }

        if (e.getSource() == txt_dniruc) {
            txt_dniruc.selectAll();
        }

        if (e.getSource() == txt_nombretrabajador) {
            txt_nombretrabajador.selectAll();
        }
    }

    @Override
    public void actionPerformed(ActionEvent e) {
        if (e.getSource() == cboTipoTrabajador) {
            if (cboTipoTrabajador.getSelectedIndex() >= 0) {
                filtrar();
            }

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

    public void cargarTabla() {
    }

    @Override
    public void focusLost(FocusEvent e) {
        if (e.getSource() == txt_idtrabajador && txt_idtrabajador.getText().trim().length() > 0) {
            String serie = "00000" + txt_idtrabajador.getText().trim();
            String nuevaserie = serie.substring(serie.length() - 5, serie.length());

            txt_idtrabajador.setText(nuevaserie);

            filtrar();
        }
    }

    @Override
    public void keyPressed(KeyEvent e) {
        if (e.getKeyChar() == '\n') {
            if (e.getSource() == txt_idtrabajador) {
                txt_nombretrabajador.requestFocus();
            }
            if (e.getSource() == txt_nombretrabajador) {
                txt_dniruc.requestFocus();
            }
            if (e.getSource() == txt_dniruc) {
                cboTipoTrabajador.requestFocus();
            }
        }
    }

    @Override
    public void itemStateChanged(ItemEvent e) {
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
