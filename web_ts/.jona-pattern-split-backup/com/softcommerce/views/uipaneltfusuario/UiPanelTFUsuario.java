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
    private JTextField txt_nombreusuario;
    private JTextField txt_idusuario;
    private JTextField txt_nombretrabajador;
    private JComboBox cbo_tipotrabajador;
    private Vector vtr_tipotrabajador;
    private Vector<BeanTipoTrabajador> x_tipotrabajador;
    private JCheckBox chk_modificarsi;
    private JCheckBox chk_modificarno;
    private JCheckBox chk_eliminarsi;
    private JCheckBox chk_eliminarno;
    private JCheckBox chk_insertarsi;
    private JCheckBox chk_insertarno;
    private JCheckBox chk_habilitado;
    private JCheckBox chk_deshabilitado;
    private Usuario usuario;
    private JScrollPane scroll;
    private int registro_inicial = 1;
    private int numero_registros = 99;
    private int total_registros;
    private int total_paginas;
    private JFrame frame;
    private Date fechaInicio;
    private Date fechaFin;

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

    private void inicialize() {
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
        JPanel pnlp = new JPanel();
        pnlp.setBorder(new LineBorder(new Color(130, 135, 144)));
        pnlp.setLayout(null);

        JLabel lbl_CodigoItem = new JLabel("Código");
        lbl_CodigoItem.setBounds(25, 25, 40, 20);
        lbl_CodigoItem.setFont(new Font("Verdana", 0, 11));
        pnlp.add(lbl_CodigoItem);

        txt_idusuario = new JTextField();
        txt_idusuario.setBounds(70, 25, 150, 20);
        txt_idusuario.addKeyListener(this);
        txt_idusuario.addFocusListener(this);
        txt_idusuario.setDocument(new IntegerDocument(20));
        txt_idusuario.setFont(new Font("Verdana", 0, 10));
        pnlp.add(txt_idusuario);

        JLabel lbl_nombreusuario = new JLabel("Usuario");
        lbl_nombreusuario.setBounds(270, 25, 60, 20);
        lbl_nombreusuario.setFont(new Font("Verdana", 0, 11));
        pnlp.add(lbl_nombreusuario);

        txt_nombreusuario = new JTextField();
        txt_nombreusuario.setBounds(320, 25, 150, 20);
        txt_nombreusuario.addKeyListener(this);
        txt_nombreusuario.addFocusListener(this);
        txt_nombreusuario.setFont(new Font("Verdana", 0, 10));
        pnlp.add(txt_nombreusuario);

        JLabel lbl_nombretrabajador = new JLabel("Trabajador");
        lbl_nombretrabajador.setBounds(530, 25, 80, 20);
        lbl_nombretrabajador.setFont(new Font("Verdana", 0, 11));
        pnlp.add(lbl_nombretrabajador);

        txt_nombretrabajador = new JTextField();
        txt_nombretrabajador.setBounds(600, 25, 250, 20);
        txt_nombretrabajador.addKeyListener(this);
        txt_nombretrabajador.addFocusListener(this);
        txt_nombretrabajador.setDocument(new UpperCaseNumberDocument(30));
        txt_nombretrabajador.setFont(new Font("Verdana", 0, 10));
        pnlp.add(txt_nombretrabajador);

        JLabel lbl_tipotrabajador = new JLabel("Area");
        lbl_tipotrabajador.setBounds(25, 55, 50, 20);
        pnlp.add(lbl_tipotrabajador);

        vtr_tipotrabajador = new Vector();
        cbo_tipotrabajador = new JComboBox(vtr_tipotrabajador);
        cbo_tipotrabajador.setBounds(70, 55, 205, 20);
        cbo_tipotrabajador.addActionListener(this);
        cbo_tipotrabajador.addKeyListener(this);
        pnlp.add(cbo_tipotrabajador);

        JLabel lbl_modificar = new JLabel("Modificar");
        lbl_modificar.setBounds(370, 55, 55, 20);
        pnlp.add(lbl_modificar);

        chk_modificarsi = new JCheckBox("S");
        chk_modificarsi.setBounds(425, 55, 40, 20);
        chk_modificarsi.addItemListener(this);
        chk_modificarsi.setFont(new Font("Verdana", 1, 10));
        chk_modificarsi.addKeyListener(this);
        chk_modificarsi.setHorizontalTextPosition(SwingConstants.RIGHT);
        chk_modificarsi.addFocusListener(this);
        chk_modificarsi.setOpaque(false);
        pnlp.add(chk_modificarsi);

        chk_modificarno = new JCheckBox("N");
        chk_modificarno.setBounds(465, 55, 40, 20);
        chk_modificarno.addItemListener(this);
        chk_modificarno.setFont(new Font("Verdana", 1, 10));
        chk_modificarno.addKeyListener(this);
        chk_modificarno.setHorizontalTextPosition(SwingConstants.RIGHT);
        chk_modificarno.addFocusListener(this);
        chk_modificarno.setOpaque(false);
        pnlp.add(chk_modificarno);

        JLabel lbl_eliminar = new JLabel("Eliminar");
        lbl_eliminar.setBounds(540, 55, 55, 20);
        pnlp.add(lbl_eliminar);

        chk_eliminarsi = new JCheckBox("S");
        chk_eliminarsi.setBounds(595, 55, 40, 20);
        chk_eliminarsi.addItemListener(this);
        chk_eliminarsi.setFont(new Font("Verdana", 1, 10));
        chk_eliminarsi.addKeyListener(this);
        chk_eliminarsi.setHorizontalTextPosition(SwingConstants.RIGHT);
        chk_eliminarsi.addFocusListener(this);
        chk_eliminarsi.setOpaque(false);
        pnlp.add(chk_eliminarsi);

        chk_eliminarno = new JCheckBox("N");
        chk_eliminarno.setBounds(635, 55, 40, 20);
        chk_eliminarno.addItemListener(this);
        chk_eliminarno.setFont(new Font("Verdana", 1, 10));
        chk_eliminarno.addKeyListener(this);
        chk_eliminarno.setHorizontalTextPosition(SwingConstants.RIGHT);
        chk_eliminarno.addFocusListener(this);
        chk_eliminarno.setOpaque(false);
        pnlp.add(chk_eliminarno);

        JLabel lbl_insertar = new JLabel("Insertar");
        lbl_insertar.setBounds(710, 55, 55, 20);
        pnlp.add(lbl_insertar);

        chk_insertarsi = new JCheckBox("S");
        chk_insertarsi.setBounds(765, 55, 40, 20);
        chk_insertarsi.addItemListener(this);
        chk_insertarsi.setFont(new Font("Verdana", 1, 10));
        chk_insertarsi.addKeyListener(this);
        chk_insertarsi.setHorizontalTextPosition(SwingConstants.RIGHT);
        chk_insertarsi.addFocusListener(this);
        chk_insertarsi.setOpaque(false);
        pnlp.add(chk_insertarsi);

        chk_insertarno = new JCheckBox("N");
        chk_insertarno.setBounds(805, 55, 40, 20);
        chk_insertarno.addItemListener(this);
        chk_insertarno.setFont(new Font("Verdana", 1, 10));
        chk_insertarno.addKeyListener(this);
        chk_insertarno.setHorizontalTextPosition(SwingConstants.RIGHT);
        chk_insertarno.addFocusListener(this);
        chk_insertarno.setOpaque(false);
        pnlp.add(chk_insertarno);

        JLabel lbl_habilitado = new JLabel("Habilitado");
        lbl_habilitado.setBounds(880, 55, 60, 20);
        pnlp.add(lbl_habilitado);

        chk_habilitado = new JCheckBox("H");
        chk_habilitado.setBounds(940, 55, 40, 20);
        chk_habilitado.addItemListener(this);
        chk_habilitado.setFont(new Font("Verdana", 1, 10));
        chk_habilitado.addKeyListener(this);
        chk_habilitado.setHorizontalTextPosition(SwingConstants.RIGHT);
        chk_habilitado.addFocusListener(this);
        chk_habilitado.setOpaque(false);
        pnlp.add(chk_habilitado);

        chk_deshabilitado = new JCheckBox("D");
        chk_deshabilitado.setBounds(980, 55, 40, 20);
        chk_deshabilitado.addItemListener(this);
        chk_deshabilitado.setFont(new Font("Verdana", 1, 10));
        chk_deshabilitado.addKeyListener(this);
        chk_deshabilitado.setHorizontalTextPosition(SwingConstants.RIGHT);
        chk_deshabilitado.addFocusListener(this);
        chk_deshabilitado.setOpaque(false);
        pnlp.add(chk_deshabilitado);

        return pnlp;
    }

    private String getParametro() {
        String parametro = "";

        return parametro;
    }

    public void controlReport(boolean export) {
        if (table.getRowCount() == 0) {
            return;
        }

        Map parameters = new HashMap();
        parameters.put(0, usuario.getDescriempresa());
        parameters.put(1, "Ruc: " + usuario.getRuc());
        parameters.put(2, "Usuario");
        ExportExcel.exportar(table, parameters);
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
        List filters = new ArrayList();

        if (txt_idusuario.getText().trim().length() > 0) {
            filters.add(RowFilter.regexFilter(".*" + txt_idusuario.getText().trim() + ".*", 1));
        }

        if (txt_nombreusuario.getText().trim().length() > 0) {
            filters.add(RowFilter.regexFilter(".*" + txt_nombreusuario.getText().trim() + ".*", 2));
        }

        if (txt_nombretrabajador.getText().trim().length() > 0) {
            filters.add(RowFilter.regexFilter(".*" + txt_nombretrabajador.getText().trim() + ".*", 3));
        }

        if (cbo_tipotrabajador.getSelectedIndex() > 0) {
            filters.add(RowFilter.regexFilter(".*" + x_tipotrabajador.get(cbo_tipotrabajador.getSelectedIndex() - 1).getId_tipo_trabajador()+ ".*", 17));
        }

        if (chk_habilitado.isSelected()) {
            filters.add(RowFilter.regexFilter(".*" + "H" + ".*", 8));
        }

        if (chk_deshabilitado.isSelected()) {
            filters.add(RowFilter.regexFilter(".*" + "D" + ".*", 8));
        }

        if (chk_eliminarsi.isSelected()) {
            filters.add(RowFilter.regexFilter(".*" + "S" + ".*", 7));
        }

        if (chk_eliminarno.isSelected()) {
            filters.add(RowFilter.regexFilter(".*" + "N" + ".*", 7));
        }

        if (chk_modificarsi.isSelected()) {
            filters.add(RowFilter.regexFilter(".*" + "S" + ".*", 6));
        }

        if (chk_modificarno.isSelected()) {
            filters.add(RowFilter.regexFilter(".*" + "N" + ".*", 6));
        }

        if (chk_insertarsi.isSelected()) {
            filters.add(RowFilter.regexFilter(".*" + "S" + ".*", 8));
        }

        if (chk_insertarno.isSelected()) {
            filters.add(RowFilter.regexFilter(".*" + "N" + ".*", 8));
        }

        RowFilter fooBarFilter = RowFilter.andFilter(filters);

        return fooBarFilter;
    }

    public void cargarFiltro() {
        loadTipoTrabajador();
    }

    public void loadTipoTrabajador() {
        try {
            RnTipoTrabajador regla_TipoTrabajador = new RnTipoTrabajador(path);

            if (x_tipotrabajador != null) {
                x_tipotrabajador.clear();
            } else {
                x_tipotrabajador = new Vector<BeanTipoTrabajador>();
            }

            x_tipotrabajador.addAll(regla_TipoTrabajador.listarTipoTrabajador("", "A"));

            cbo_tipotrabajador.removeAllItems();
            vtr_tipotrabajador.removeAllElements();
            vtr_tipotrabajador.addElement("--- TODOS ---");

            for (int i = 0; i < x_tipotrabajador.size(); i++) {
                vtr_tipotrabajador.addElement(x_tipotrabajador.get(i).getDescripcion());
            }

            cbo_tipotrabajador.setSelectedIndex(0);
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
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
        if (table.getRowCount() == 0 || table.getSelectedRow() < 0) {
            return;
        }

        try {
        } catch (Exception ex) {
            ex.printStackTrace();
            JOptionPane.showMessageDialog(this,"Error "+ex.toString()+" "+ex.getCause());
        }
    }

    public void controlAdd() {
        setCursor(new Cursor(Cursor.WAIT_CURSOR));
        RegisterUsuario register = new RegisterUsuario(frame, usuario);
        register.setPath(path);
        register.setRowSelection(this);
        register.setView(this);
        register.setFecha(fechaInicio, fechaFin);
        register.setModeRegister(Register.INSERT);
        register.setVisible(true);

        setCursor(new Cursor(Cursor.DEFAULT_CURSOR));
    }

    public void controlModify() {
        if (table.getRowCount() == 0 || table.getSelectedRow() < 0) {
            return;
        }

        setCursor(new Cursor(Cursor.WAIT_CURSOR));

        RegisterUsuario register = new RegisterUsuario(frame, usuario);
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

    public void controlNullify() {
        int fila = table.getSelectedRow();
        if (fila != -1) {
            int modelrow = table.convertRowIndexToModel(fila);
            Usuario bean = ((UsuarioTableModel) table.getModel()).getValue(modelrow);
            FormPanelUA formAutorizar = new FormPanelUA(frame, true, path, bean);
            formAutorizar.setTitle("Autorizar Series");
            formAutorizar.pack();
            formAutorizar.setLocationRelativeTo(null);
            formAutorizar.setVisible(true);
        } else {
            JOptionPane.showMessageDialog(null, "Seleccione un registro de la tabla", "Aviso", JOptionPane.INFORMATION_MESSAGE);
            table.requestFocus();
        }

    }

    public void controlEliminate() {
        if (table.getRowCount() == 0 || table.getSelectedRow() < 0) {
            return;
        }

        setCursor(new Cursor(Cursor.WAIT_CURSOR));

        RegisterUsuario register = new RegisterUsuario(frame, usuario);
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

    public void controlClone() {
        if (table.getRowCount() == 0 || table.getSelectedRow() < 0) {
            return;
        }

        setCursor(new Cursor(Cursor.WAIT_CURSOR));

        RegisterUsuario register = new RegisterUsuario(frame, usuario);
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

    public void controlDetails() {
        if (table.getRowCount() == 0 || table.getSelectedRow() < 0) {
            return;
        }

        setCursor(new Cursor(Cursor.WAIT_CURSOR));

        RegisterUsuario register = new RegisterUsuario(frame, usuario);
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

    public void controlClose() {
        dispose();
        doDefaultCloseAction();
    }

    public void controlRefresh() {
        cargarTabla();
    }

    public Object getSelectedValue(int column) {
        int visibleRowIndex = table.getSelectedRow();
        int realRowIndex = table.convertRowIndexToModel(visibleRowIndex);

        return modeltable.getValueAt(realRowIndex, column);
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
        try {
            RnUsuario regla = new RnUsuario(path);
            modeloOrdenado.setRowFilter(null);
            modeltable.clearTable();
            List<Usuario> lista=regla.listarGeneral();
            modeltable.agregarVectorusuario(lista);
            modeloOrdenado.setRowFilter(getFilter());
            table.setAllColumnPreferredWidth();
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
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
