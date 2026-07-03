/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.softcommerce.views.uipaneltfcorrelativo;


import com.softcommerce.formularios.*;
import com.softcommerce.beans.BeanTipoDocVenta;
import com.softcommerce.beans.Localidad;
import com.softcommerce.beans.PuntoVenta;
import com.softcommerce.beans.Usuario;
import com.softcommerce.general.controles.CTable;
import com.softcommerce.general.controles.ControlView;
import com.softcommerce.general.controles.IntegerDocument;
import com.softcommerce.general.controles.JHInternalFrame;
import com.softcommerce.general.controles.PopupMenuView;
import com.softcommerce.general.controles.Register;
import com.softcommerce.general.controles.RowSelection;
import com.softcommerce.general.controles.View;
import com.softcommerce.general.tablas.CorrelativoTableModel;
import com.softcommerce.reglasnegocio.RnTipoDocVenta;
import com.softcommerce.reglasnegocio.RnCorrelativo;
import com.softcommerce.reglasnegocio.RnLocalidad;
import com.softcommerce.reglasnegocio.RnPuntoVenta;
import com.softcommerce.util.ExportExcel;
import com.softcommerce.util.FormatObject;
import java.awt.BorderLayout;
import java.awt.Color;
import java.awt.Component;
import java.awt.Cursor;
import java.awt.Dimension;
import java.awt.Font;
import java.awt.GridBagConstraints;
import java.awt.GridBagLayout;
import java.awt.Insets;
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
import java.util.ArrayList;
import java.util.Date;
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
 * @author TOSHIBA
 */
public class UiPanelTFCorrelativo
        extends JHInternalFrame
        implements InterUiPanelTFCorrelativo, View, ListSelectionListener, RowSelection, ControlView, WindowListener, FocusListener, KeyListener, ActionListener {

    private static final long serialVersionUID = 1L;
    public CTable table;
    public CorrelativoTableModel modeltable;
    public TableRowSorter<CorrelativoTableModel> modeloOrdenado;
    public JScrollPane scroll;
    protected JTextField txtCodigo;
    protected JTextField txt_serie;
    protected JComboBox cbLocali;
    protected List<Localidad> xlocali;
    protected JComboBox cbTipodoc;
    protected List<BeanTipoDocVenta> xtipodoc;
    protected JComboBox cb_PuntoVenta;
    protected List<PuntoVenta> xpuntoventa;
    protected Usuario usuario;
    protected JFrame frame;
    protected Date fechaInicio;
    protected Date fechaFin;

    public UiPanelTFCorrelativo(String title, JFrame frame, Usuario usuario) {
        super(title);
        this.usuario = usuario;
        this.frame = frame;
        inicialize();
    }

    public UiPanelTFCorrelativo(String title, JFrame frame, Usuario usuario, List<Boolean> vPermiso) {
        super(title, vPermiso.get(0), vPermiso.get(1), vPermiso.get(2), vPermiso.get(3), vPermiso.get(4), vPermiso.get(5), vPermiso.get(6), vPermiso.get(7), vPermiso.get(8), vPermiso.get(9), vPermiso.get(10), vPermiso.get(11), vPermiso.get(12));
        this.usuario = usuario;
        this.frame = frame;
        inicialize();
    }

    protected void inicialize() {
        modeltable = new CorrelativoTableModel();
        modeloOrdenado = new TableRowSorter<CorrelativoTableModel>(modeltable);
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
        table.setNoVisibleColumn(3);
        table.setNoVisibleColumn(4);
        table.setNoVisibleColumn(6);

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
        JPanel pnl = new JPanel();
        pnlPrinc.add(pnl, BorderLayout.WEST);
        pnl.setLayout(new GridBagLayout());
        pnlPrinc.setBorder(new LineBorder(new Color(130, 135, 144)));

        GridBagConstraints gbc = new GridBagConstraints();
        gbc.gridx = 0;
        gbc.gridy = 0;
        gbc.anchor = GridBagConstraints.WEST;
        gbc.insets = new Insets(10, 2, 5, 2);

        JLabel lblCodigo = new JLabel("Código");
        lblCodigo.setFont(new Font("Verdana", 0, 11));
        pnl.add(lblCodigo, gbc);

        gbc.gridx = 1;
        txtCodigo = new JTextField();
        txtCodigo.addKeyListener(this);
        txtCodigo.addFocusListener(this);
        txtCodigo.setDocument(new IntegerDocument(5));
        txtCodigo.setFont(new Font("Garamond", 0, 14));
        txtCodigo.setColumns(4);
        pnl.add(txtCodigo, gbc);

        gbc.gridx = 2;
        JLabel lblLocalidad = new JLabel("Localidad");
        pnl.add(lblLocalidad, gbc);

        gbc.gridx = 3;
        cbLocali = new JComboBox();
        cbLocali.addActionListener(this);
        cbLocali.addKeyListener(this);
        pnl.add(cbLocali, gbc);

        gbc.gridx = 4;
        JLabel lblPtoVenta = new JLabel("Punto de Venta");
        pnl.add(lblPtoVenta, gbc);

        gbc.gridx = 5;
        cb_PuntoVenta = new JComboBox();
        cb_PuntoVenta.addActionListener(this);
        cb_PuntoVenta.setEnabled(false);
        cb_PuntoVenta.addKeyListener(this);
        pnl.add(cb_PuntoVenta, gbc);

        gbc.gridx = 0;
        gbc.gridy = 1;
        gbc.insets = new Insets(5, 2, 10, 2);
        JLabel lbl_tipodoc = new JLabel("T Documento");
        pnl.add(lbl_tipodoc, gbc);

        gbc.gridx = 1;
        gbc.gridwidth = 3;
        cbTipodoc = new JComboBox();
        cbTipodoc.addActionListener(this);
        cbTipodoc.addKeyListener(this);
        pnl.add(cbTipodoc, gbc);
        gbc.gridwidth = 1;

        gbc.gridx = 4;
        JLabel lblSerie = new JLabel("Serie");
        lblSerie.setFont(new Font("Verdana", 0, 11));
        pnl.add(lblSerie, gbc);

        gbc.gridx = 5;
        txt_serie = new JTextField();
        txt_serie.addFocusListener(this);
        txt_serie.addKeyListener(this);
        FormatObject.formatJTextFieldSerie(txt_serie);
        txt_serie.setFont(new Font("Garamond", 0, 14));
        txt_serie.setColumns(3);
        pnl.add(txt_serie, gbc);

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
            if ((e.getSource() == txtCodigo)
                    || (e.getSource() == txt_serie)) {
                filtrar();
            }
        }
    }

    public RowFilter<Object, Object> getFilter() {
        return null;
    }

    public void cargarFiltro() {
    }

    protected void loadLocalidad(String xcodEmpres) {
    }

    public void loadTipoDocumento() {
    }

    protected void loadPuntoVenta(String xcodLocalidad) {
    }

    @Override
    public void focusGained(FocusEvent e) {
        if (e.getSource() == txt_serie) {
            txt_serie.selectAll();
        }

        if (e.getSource() == txtCodigo) {
            txtCodigo.selectAll();
        }
    }

    @Override
    public void actionPerformed(ActionEvent e) {
        if (cbLocali == e.getSource()) {
            if (cbLocali.getItemCount() > 0) {
                if (cbLocali.getSelectedIndex() >= 0) {
                    if (cbLocali.getSelectedIndex() == 0) {
                        cb_PuntoVenta.removeAllItems();
                        cb_PuntoVenta.setEnabled(false);
                    } else {
                        cb_PuntoVenta.setEnabled(true);
                        loadPuntoVenta(xlocali.get(cbLocali.getSelectedIndex() - 1).getId_localidad());
                    }

                    filtrar();
                }
            }
        }

        if (e.getSource() == cb_PuntoVenta) {
            if (cb_PuntoVenta.getItemCount() > 0) {
                if (cb_PuntoVenta.getSelectedIndex() >= 0) {
                    filtrar();
                }
            }
        }

        if (e.getSource() == cbTipodoc) {
            if (cbTipodoc.getItemCount() > 0) {
                if (cbTipodoc.getSelectedIndex() >= 0) {
                    filtrar();
                }
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
        if (e.getSource() == txtCodigo && txtCodigo.getText().trim().length() > 0) {
            String serie = "00000" + txtCodigo.getText().trim();
            String nuevaserie = serie.substring(serie.length() - 5, serie.length());
            txtCodigo.setText(nuevaserie);
            filtrar();
        }
        if (e.getSource().equals(txt_serie)) {
            FormatObject.formatSerie((JTextField) e.getSource());
            filtrar();
        }
    }

    @Override
    public void keyPressed(KeyEvent e) {
        if (e.getKeyChar() == '\n') {
            if (e.getSource() == txtCodigo) {
                cbLocali.requestFocus();
            }

            if (e.getSource() == cbLocali) {
                if (cb_PuntoVenta.isEnabled()) {
                    cb_PuntoVenta.requestFocus();
                } else {
                    cbTipodoc.requestFocus();
                }
            }

            if (e.getSource() == cb_PuntoVenta) {
                cbTipodoc.requestFocus();
            }

            if (e.getSource() == cbTipodoc) {
                txt_serie.requestFocus();
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
