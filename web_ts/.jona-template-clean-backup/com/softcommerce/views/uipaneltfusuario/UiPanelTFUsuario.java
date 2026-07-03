/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.softcommerce.views.uipaneltfusuario;


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
import java.util.Vector;
import javax.swing.JComboBox;
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
import com.softcommerce.general.tablas.UsuarioTableModel;
import com.softcommerce.general.controles.PopupMenuView;
import java.awt.event.WindowListener;
import javax.swing.event.ListSelectionListener;
import com.softcommerce.general.controles.JHInternalFrame;
import com.softcommerce.formularios.RegisterUsuario;
import com.softcommerce.general.controles.UpperCaseNumberDocument;
import com.softcommerce.gui.FormPanelUA;
import com.softcommerce.iconos.Gif;

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
import javax.swing.JCheckBox;
import javax.swing.JFrame;
import javax.swing.SwingConstants;
import com.softcommerce.reglasnegocio.RnTipoTrabajador;
import com.softcommerce.reglasnegocio.RnUsuario;
import com.softcommerce.util.ExportExcel;
import com.softcommerce.util.Imagenes;
import java.util.HashMap;
import java.util.Map;
import javax.swing.JOptionPane;

/**
 *
 * @author TOSHIBA
 */
public class UiPanelTFUsuario extends JHInternalFrame implements InterUiPanelTFUsuario, ListSelectionListener, WindowListener, FocusListener, KeyListener, ActionListener, ItemListener {

    public CTable table;
    public UsuarioTableModel modeltable;
    public TableRowSorter modeloOrdenado;
    protected JTextField txt_nombreusuario;
    protected JTextField txt_idusuario;
    protected JTextField txt_nombretrabajador;
    protected JComboBox cbo_tipotrabajador;
    protected Vector vtr_tipotrabajador;
    protected Vector<BeanTipoTrabajador> x_tipotrabajador;
    protected JCheckBox chk_modificarsi;
    protected JCheckBox chk_modificarno;
    protected JCheckBox chk_eliminarsi;
    protected JCheckBox chk_eliminarno;
    protected JCheckBox chk_insertarsi;
    protected JCheckBox chk_insertarno;
    protected JCheckBox chk_habilitado;
    protected JCheckBox chk_deshabilitado;
    protected Usuario usuario;
    protected JScrollPane scroll;
    protected int registro_inicial = 1;
    protected int numero_registros = 99;
    protected int total_registros;
    protected int total_paginas;
    protected JFrame frame;
    protected Date fechaInicio;
    protected Date fechaFin;

    public UiPanelTFUsuario(String title, JFrame frame, Usuario usuario) {
        super(title);
        this.usuario = usuario;
        this.frame = frame;
        inicialize();
    }

    public UiPanelTFUsuario(String title, JFrame frame, Usuario usuario, List<Boolean> vPermiso) {
        super(title, vPermiso.get(0), vPermiso.get(1), vPermiso.get(2), vPermiso.get(3), vPermiso.get(4), vPermiso.get(5), vPermiso.get(6), vPermiso.get(7), vPermiso.get(8), vPermiso.get(9), vPermiso.get(10), vPermiso.get(11), vPermiso.get(12));
        this.usuario = usuario;
        this.frame = frame;
        inicialize();
    }

    protected void inicialize() {
        Gif gif = new Gif();
        modeltable = new UsuarioTableModel();
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

        table.setNoVisibleColumn(10);
        table.setNoVisibleColumn(11);
        table.setNoVisibleColumn(12);
        table.setNoVisibleColumn(13);
        table.setNoVisibleColumn(14);
        table.setNoVisibleColumn(15);
        table.setNoVisibleColumn(16);
        table.setNoVisibleColumn(17);

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
        panel.setPreferredSize(new Dimension(1200, 100));
        pnlaux.add(panel, BorderLayout.CENTER);

        scroll.setPreferredSize(new Dimension(1200, 380));
        pnlaux.add(scroll, BorderLayout.SOUTH);

        setTable(pnlaux);
        this.getPnlControl().getCbNullify().setText("Autorizar");
        this.getPnlControl().getCbNullify().setIcon(gif.autorizar);
    }

    public JPanel getPanelFilter() {
        return null;
    }

    protected String getParametro() {
        String parametro = "";

        return parametro;
    }

    public void controlReport(boolean export) {
    }

    public void filtrar() {
    }

    public void setFecha(Date fechaInicio, Date fechaFin) {
        this.fechaInicio = fechaInicio;
        this.fechaFin = fechaFin;
    }

    public void keyReleased(KeyEvent e) {
        if (e.getKeyChar() != '\n') {
            if ((e.getSource() == txt_idusuario)
                    || (e.getSource() == txt_nombreusuario)
                    || (e.getSource() == txt_nombretrabajador)) {
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

    public void focusGained(FocusEvent e) {
        if (e.getSource() == txt_idusuario) {
            txt_idusuario.selectAll();
        }

        if (e.getSource() == txt_nombretrabajador) {
            txt_nombretrabajador.selectAll();
        }

        if (e.getSource() == txt_nombreusuario) {
            txt_nombreusuario.selectAll();
        }
    }

    public void actionPerformed(ActionEvent e) {
        if (e.getSource() == cbo_tipotrabajador) {
            if (vtr_tipotrabajador.size() > 0) {
                if (cbo_tipotrabajador.getSelectedIndex() >= 0) {
                    filtrar();
                }
            }
        }
    }

    public void controlPrint(boolean view) {
    }

    public void controlAdd() {
    }

    public void controlModify() {
    }

    public void controlNullify() {
    }

    public void controlEliminate() {
    }

    public void controlClone() {
    }

    public void controlDetails() {
    }

    public void controlClose() {
    }

    public void controlRefresh() {
    }

    public Object getSelectedValue(int column) {
        return null;
    }

    public void setSelectedRow(int row) {
        if (row >= 0) {
            table.setRowSelectionInterval(row, row);
            setScrollValueView(row);
        }
    }

    public void valueChanged(ListSelectionEvent e) {
        if (!e.getValueIsAdjusting()) {
            refresh();
        }
    }

    public int getSelectedRow() {
        return table.getSelectedRow();
    }

    public void selectNextRow() {
        if (table.getRowCount() > 0) {
            if (table.getSelectedRow() < table.getRowCount() - 1) {
                int row = table.getSelectedRow() + 1;
                table.setRowSelectionInterval(row, row);
                setScrollValueView(row);
            }
        }
    }

    public void selectPreviusRow() {
        if (table.getRowCount() > 0) {
            if (table.getSelectedRow() > 0) {
                int row = table.getSelectedRow() - 1;
                table.setRowSelectionInterval(row, row);
                setScrollValueView(row);
            }
        }
    }

    public void selectLastRow() {
        if (table.getRowCount() > 0) {
            int rowCount = table.getRowCount() - 1;
            table.setRowSelectionInterval(rowCount, rowCount);
            setScrollValueView(rowCount);
        }
    }

    public void selectFirstRow() {
        if (table.getRowCount() > 0) {
            table.setRowSelectionInterval(0, 0);
            setScrollValueView(0);
        }
    }

    public void setScrollValueView(int row) {
        scroll.getVerticalScrollBar().setValue(table.getRowHeight() * row);
    }

    public int getRowCount() {
        return table.getRowCount();
    }

    public void cargarTabla() {
    }

    public void focusLost(FocusEvent e) {
        if (e.getSource() == txt_idusuario && txt_idusuario.getText().trim().length() > 0) {
            String serie = "00000000000000000000" + txt_idusuario.getText().trim();
            String nuevaserie = serie.substring(serie.length() - 20, serie.length());

            txt_idusuario.setText(nuevaserie);

            filtrar();
        }
    }

    public void keyPressed(KeyEvent e) {
        if (e.getKeyChar() == '\n') {
            if (e.getSource() == txt_idusuario) {
                txt_nombreusuario.requestFocus();
            }

            if (e.getSource() == txt_nombreusuario) {
                txt_nombretrabajador.requestFocus();
            }

            if (e.getSource() == txt_nombretrabajador) {
                cbo_tipotrabajador.requestFocus();
            }

            if (e.getSource() == cbo_tipotrabajador) {
                chk_modificarsi.requestFocus();
            }

            if (e.getSource() == chk_modificarsi) {
                chk_modificarno.requestFocus();
            }

            if (e.getSource() == chk_modificarno) {
                chk_eliminarsi.requestFocus();
            }

            if (e.getSource() == chk_eliminarsi) {
                chk_eliminarno.requestFocus();
            }

            if (e.getSource() == chk_eliminarno) {
                chk_insertarsi.requestFocus();
            }

            if (e.getSource() == chk_insertarsi) {
                chk_insertarno.requestFocus();
            }

            if (e.getSource() == chk_insertarno) {
                chk_habilitado.requestFocus();
            }

            if (e.getSource() == chk_habilitado) {
                chk_deshabilitado.requestFocus();
            }
        }
    }

    public void itemStateChanged(ItemEvent e) {
        boolean is_Selected;

        is_Selected = (e.getStateChange() == ItemEvent.SELECTED);

        if (e.getItemSelectable() == chk_habilitado) {
            if (is_Selected) {
                chk_deshabilitado.setSelected(false);
            }

            filtrar();
        }

        if (e.getItemSelectable() == chk_deshabilitado) {
            if (is_Selected) {
                chk_habilitado.setSelected(false);
            }

            filtrar();
        }

        if (e.getItemSelectable() == chk_eliminarsi) {
            if (is_Selected) {
                chk_eliminarno.setSelected(false);
            }

            filtrar();
        }

        if (e.getItemSelectable() == chk_eliminarno) {
            if (is_Selected) {
                chk_eliminarsi.setSelected(false);
            }

            filtrar();
        }

        if (e.getItemSelectable() == chk_insertarsi) {
            if (is_Selected) {
                chk_insertarno.setSelected(false);
            }

            filtrar();
        }

        if (e.getItemSelectable() == chk_insertarno) {
            if (is_Selected) {
                chk_insertarsi.setSelected(false);
            }

            filtrar();
        }

        if (e.getItemSelectable() == chk_modificarsi) {
            if (is_Selected) {
                chk_modificarno.setSelected(false);
            }

            filtrar();
        }

        if (e.getItemSelectable() == chk_modificarno) {
            if (is_Selected) {
                chk_modificarsi.setSelected(false);
            }

            filtrar();
        }
    }

    public void selectLastPage() {
    }

    public void selectFirstPage() {
    }

    public int getPageCount() {
        return 0;
    }

    public int getSelectedPage() {
        return 0;
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

    public void keyTyped(KeyEvent e) {
    }

    public void setValueSearch(Object valor, Component comp) {
    }

    public void refreshTitleName() {
    }

    public void controlSearch() {
    }

    public void setSelectedRow(String clave, int column) {
    }

    public Object getSelectedValue(String column) {
        return null;
    }

    public void selectPreviusPage() {
    }

    public void selectNextPage() {
    }
}
