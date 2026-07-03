/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.softcommerce.views.uiformbuscarvehiculo;


import com.softcommerce.formularios.*;
import com.softcommerce.beans.BeanMarcaVehiculo;
import com.softcommerce.beans.BeanModeloVehiculo;
import com.softcommerce.beans.BeanVehiculo;
import com.softcommerce.beans.Usuario;
import com.softcommerce.general.controles.CTable;
import com.softcommerce.general.controles.ComponentToolKit;
import com.softcommerce.general.controles.IntegerDocument;
import com.softcommerce.general.controles.JHDialog;
import com.softcommerce.general.controles.JHInternal;
import com.softcommerce.general.controles.UpperCaseNumberDocument;
import com.softcommerce.general.tablas.VehiculoTableModel;
import com.softcommerce.iconos.Gif;
import com.softcommerce.reglasnegocio.RnMarcaVehiculo;
import com.softcommerce.reglasnegocio.RnModeloVehiculo;
import com.softcommerce.reglasnegocio.RnVehiculo;
import java.awt.BorderLayout;
import java.awt.Color;
import java.awt.Component;
import java.awt.Dimension;
import java.awt.Font;
import java.awt.Frame;
import java.awt.GridBagConstraints;
import java.awt.GridBagLayout;
import java.awt.Insets;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
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
import javax.swing.JButton;
import javax.swing.JComboBox;
import javax.swing.JComponent;
import javax.swing.JDialog;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import javax.swing.JScrollPane;
import javax.swing.JTextField;
import javax.swing.KeyStroke;
import javax.swing.RowFilter;
import javax.swing.SwingConstants;
import javax.swing.event.ListSelectionEvent;
import javax.swing.event.ListSelectionListener;
import javax.swing.table.TableRowSorter;

/**
 *
 * @author Team Develtrex
 */
public class UiFormBuscarVehiculo extends JDialog implements InterUiFormBuscarVehiculo, ListSelectionListener, KeyListener, ActionListener, MouseListener, ItemListener, FocusListener {

    private java.net.URL path;
    private JHDialog objDialog;
    private JHInternal objInternal;
    private JTextField txtCodigo;
    private JTextField txtPlaca;
    private JTextField txtRuc;
    private JTextField txtContancia;
    private JTextField txtDescripcion;
    private CTable tableVehiculo;
    private VehiculoTableModel modeltableVehiculo;
    private TableRowSorter modeloOrdenadoVehiculo;
    private JScrollPane scrollVehiculo;
    private Main frmMain;
    private JButton btnRefrescar;
    private JButton btnAgregar;
    private JButton btnCancelar;
    private Component comp;
    private Usuario usuario;
    private JComboBox cboMarca;
    private List<BeanMarcaVehiculo> xMarcaVehiculo;
    private JComboBox cboModelo;
    private List<BeanModeloVehiculo> xModeloVehiculo;

    public UiFormBuscarVehiculo(Frame arg0, JHDialog arg1, java.net.URL path, Component comp, Usuario usuario) {
        super(arg0);
        this.frmMain = (Main) arg0;
        this.path = path;
        this.objDialog = arg1;
        this.comp = comp;
        this.usuario = usuario;
        initialize();
        initListener();
    }

    public UiFormBuscarVehiculo(Frame arg0, JHInternal arg1, java.net.URL path, Component comp, Usuario usuario) {
        super(arg0);
        this.frmMain = (Main) arg0;
        this.path = path;
        this.objInternal = arg1;
        this.comp = comp;
        this.usuario = usuario;
        initialize();
        initListener();
    }

    private void initialize() {
        JPanel pnlPrincipal = new JPanel();
        pnlPrincipal.setLayout(new BorderLayout());
        pnlPrincipal.add(getPnlFiltros(), BorderLayout.NORTH);
        pnlPrincipal.add(getPnlTable(), BorderLayout.CENTER);
        pnlPrincipal.add(getPnlAcciones(), BorderLayout.SOUTH);
        setBackground(new Color(245, 245, 245));
        setContentPane(pnlPrincipal);
        setModal(true);
        setResizable(true);
        setMinimumSize(new Dimension(1000, 475));
        setSize(100, 475);
        setTitle("Buscar Vehiculo");
        cargarTabla();
        pack();
        ComponentToolKit.centerComponentPosicion(this);
    }

    private void loadMarca() throws Exception {
        try {
            if (xMarcaVehiculo == null) {
                xMarcaVehiculo = new ArrayList<BeanMarcaVehiculo>();
            } else {
                xMarcaVehiculo.clear();
            }
            RnMarcaVehiculo logic = new RnMarcaVehiculo(path);
            xMarcaVehiculo.addAll(logic.listarMarcaVehiculo("", "A"));
            cboMarca.removeAllItems();
            cboMarca.addItem("-- SELECCIONE --");
            for (int i = 0; i < xMarcaVehiculo.size(); i++) {
                cboMarca.addItem(xMarcaVehiculo.get(i).getDescripcion());
            }
            cboMarca.setSelectedIndex(0);
        } catch (Exception e) {
            throw e;
        }
    }

    private void loadModelo() throws Exception {
        try {
            if (xModeloVehiculo == null) {
                xModeloVehiculo = new ArrayList<BeanModeloVehiculo>();
            } else {
                xModeloVehiculo.clear();
            }
            RnModeloVehiculo logic = new RnModeloVehiculo(path);
            xModeloVehiculo.addAll(logic.listarModeloVehiculo("", "A"));
            cboModelo.removeAllItems();
            cboModelo.addItem("-- SELECCIONE --");
            for (int i = 0; i < xModeloVehiculo.size(); i++) {
                cboModelo.addItem(xModeloVehiculo.get(i).getDescripcion());
            }
            cboModelo.setSelectedIndex(0);
        } catch (Exception e) {
            throw e;
        }
    }

    private void initListener() {
        txtCodigo.addKeyListener(this);
        txtCodigo.addFocusListener(this);
        txtDescripcion.addKeyListener(this);
        txtDescripcion.addFocusListener(this);
        txtPlaca.addKeyListener(this);
        txtPlaca.addFocusListener(this);
        txtContancia.addKeyListener(this);
        txtContancia.addFocusListener(this);
        txtRuc.addKeyListener(this);
        txtRuc.addFocusListener(this);
        btnAgregar.addActionListener(this);
        btnRefrescar.addActionListener(this);
        btnCancelar.addActionListener(this);
        tableVehiculo.addMouseListener(this);
        cboMarca.addItemListener(this);
        cboModelo.addItemListener(this);
    }

    private JPanel getPnlFiltros() {
        Gif gif = new Gif();
        JPanel pnlPrinc = new JPanel();
        pnlPrinc.setLayout(new BorderLayout());
        JPanel pnlFiltro = new JPanel();
        pnlPrinc.add(pnlFiltro, BorderLayout.WEST);
        pnlFiltro.setLayout(new GridBagLayout());
        pnlFiltro.setBackground(new Color(245, 245, 245));
        GridBagConstraints gbc = new GridBagConstraints();
        //
        JLabel lblCodigo = new JLabel("Codigo");
        gbc.gridx = 0;
        gbc.gridy = 0;
        gbc.insets = new Insets(5, 5, 5, 5);
        gbc.anchor = GridBagConstraints.WEST;
        pnlFiltro.add(lblCodigo, gbc);
        //
        txtCodigo = new JTextField();
        txtCodigo.setDocument(new IntegerDocument(10));
        txtCodigo.setColumns(7);
        gbc.gridx = 1;
        pnlFiltro.add(txtCodigo, gbc);
        //
        //
        JLabel lblDescripcion = new JLabel("Transportista");
        gbc.gridx = 2;
        pnlFiltro.add(lblDescripcion, gbc);
        //
        txtDescripcion = new JTextField();
        txtDescripcion.setDocument(new UpperCaseNumberDocument(50));
        txtDescripcion.setColumns(25);
        gbc.gridx = 3;
        gbc.gridwidth = 3;
        pnlFiltro.add(txtDescripcion, gbc);
        gbc.gridwidth = 1;

        JLabel lblMarca = new JLabel("Marca");
        gbc.gridx = 6;
        pnlFiltro.add(lblMarca, gbc);
        cboMarca = new JComboBox();
        gbc.gridx = 7;
        pnlFiltro.add(cboMarca, gbc);

        JLabel lblRuc = new JLabel("RUC/DNI");
        gbc.gridx = 0;
        gbc.gridy = 1;
        pnlFiltro.add(lblRuc, gbc);

        txtRuc = new JTextField();
        txtRuc.setDocument(new IntegerDocument(11));
        txtRuc.setColumns(7);
        gbc.gridx = 1;
        pnlFiltro.add(txtRuc, gbc);

        JLabel lblConstancia = new JLabel("Constancia Inscr");
        gbc.gridx = 2;
        pnlFiltro.add(lblConstancia, gbc);
        //
        txtContancia = new JTextField();
        txtContancia.setDocument(new UpperCaseNumberDocument(30));
        txtContancia.setColumns(7);
        gbc.gridx = 3;
        pnlFiltro.add(txtContancia, gbc);

        JLabel lblNumero = new JLabel("Placa");
        gbc.gridx = 4;
        pnlFiltro.add(lblNumero, gbc);
        //
        txtPlaca = new JTextField();
        txtPlaca.setDocument(new UpperCaseNumberDocument(30));
        txtPlaca.setColumns(7);
        gbc.gridx = 5;
        pnlFiltro.add(txtPlaca, gbc);

        JLabel lblModelo = new JLabel("Modelo");
        gbc.gridx = 6;
        pnlFiltro.add(lblModelo, gbc);

        cboModelo = new JComboBox();
        gbc.gridx = 7;
        pnlFiltro.add(cboModelo, gbc);

        return pnlPrinc;
    }

    private JPanel getPnlAcciones() {
        Gif gif = new Gif();
        JPanel pnlAccion = new JPanel();
        pnlAccion.setLayout(new GridBagLayout());
        //pnlAccion.setLayout(null);
        //pnlAccion.setSize(new Dimension(500,80));
        pnlAccion.setBackground(new Color(245, 245, 245));
        //
        btnCancelar = new JButton("Cancelar", gif.CANCEL16);
        btnCancelar.setMnemonic('C');
        btnCancelar.setHorizontalAlignment(SwingConstants.LEFT);
        btnCancelar.setIconTextGap(10);
        btnCancelar.setFont(new Font("Verdana", 1, 10));
        btnCancelar.setOpaque(false);
        btnCancelar.setFocusPainted(false);
        btnCancelar.setBounds(25, 0, 120, 25);
        pnlAccion.add(btnCancelar);
        //
        btnRefrescar = new JButton("Refrescar", gif.REFRESH16);
        btnRefrescar.setMnemonic('B');
        btnRefrescar.setHorizontalAlignment(SwingConstants.LEFT);
        btnRefrescar.setIconTextGap(10);
        btnRefrescar.setFont(new Font("Verdana", 1, 10));
        btnRefrescar.setOpaque(false);
        btnRefrescar.setFocusPainted(false);
        btnRefrescar.setBounds(600, 370, 120, 25);
        pnlAccion.add(btnRefrescar);
        //
        btnAgregar = new JButton("Agregar", gif.ADD16);
        btnAgregar.setMnemonic('B');
        btnAgregar.setHorizontalAlignment(SwingConstants.LEFT);
        btnAgregar.setIconTextGap(10);
        btnAgregar.setFont(new Font("Verdana", 1, 10));
        btnAgregar.setOpaque(false);
        btnAgregar.setFocusPainted(false);
        btnAgregar.setBounds(740, 370, 120, 25);
        pnlAccion.add(btnAgregar);
        return pnlAccion;


    }

    private JPanel getPnlTable() {
        JPanel pnlTable = new JPanel(new BorderLayout());
        pnlTable.setLayout(new BorderLayout(0, 0));
        pnlTable.setBackground(new Color(245, 245, 245));

        modeltableVehiculo = new VehiculoTableModel();
        modeloOrdenadoVehiculo = new TableRowSorter(modeltableVehiculo);
        tableVehiculo = new CTable();
        tableVehiculo.setRowSorter(modeloOrdenadoVehiculo);
        tableVehiculo.setModel(modeltableVehiculo);
        tableVehiculo.setAllTableNoEditable();
        tableVehiculo.setAllColumnNoResizable();
        tableVehiculo.setRendererColumnZero();
        tableVehiculo.setAllColumnPreferredWidthNvo(10);
        tableVehiculo.getSelectionModel().addListSelectionListener(this);
        tableVehiculo.setNoVisibleColumn(1);
        tableVehiculo.setNoVisibleColumn(6);
        tableVehiculo.setNoVisibleColumn(8);
        tableVehiculo.setNoVisibleColumn(10);
        scrollVehiculo = new JScrollPane(tableVehiculo);
        scrollVehiculo.setPreferredSize(new Dimension(600, 380));
        pnlTable.add(scrollVehiculo, BorderLayout.CENTER);

        KeyStroke keystroke4 = KeyStroke.getKeyStroke(KeyEvent.VK_ENTER, 0, false);
        ActionListener action4 = new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                obtenerDatos();
            }
        };
        tableVehiculo.registerKeyboardAction(action4, keystroke4, JComponent.WHEN_ANCESTOR_OF_FOCUSED_COMPONENT);
        return pnlTable;
    }

    private void cargarTabla() {
        try {
            if (xMarcaVehiculo == null) {
                loadMarca();
                loadModelo();
            }
            RnVehiculo regla = new RnVehiculo(path);
            modeloOrdenadoVehiculo.setRowFilter(null);
            modeltableVehiculo.clearTable();
            modeltableVehiculo.agregarVectorVehiculo(regla.listarVehiculo("", "", "A"));
            modeloOrdenadoVehiculo.setRowFilter(getFilter());
            modeltableVehiculo.fireTableDataChanged();
            tableVehiculo.setAllColumnPreferredWidthNvo(10);
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }

    private void filtrar() {
        modeloOrdenadoVehiculo.setRowFilter(getFilter());
        tableVehiculo.setAllColumnPreferredWidthNvo(10);

        if (tableVehiculo.getRowCount() > 0) {
            tableVehiculo.setRowSelectionInterval(0, 0);
        }
    }

    private RowFilter getFilter() {
        List filters = new ArrayList();
        if (txtCodigo.getText().trim().length() > 0) {
            filters.add(RowFilter.regexFilter(".*" + txtCodigo.getText().trim() + ".*", 0));
        }
        if (txtPlaca.getText().trim().length() > 0) {
            filters.add(RowFilter.regexFilter(".*" + txtPlaca.getText().trim() + ".*", 4));
        }
        if (txtContancia.getText().trim().length() > 0) {
            filters.add(RowFilter.regexFilter(".*" + txtContancia.getText().trim() + ".*", 5));
        }
        if (txtDescripcion.getText().trim().length() > 0) {
            filters.add(RowFilter.regexFilter(".*" + txtDescripcion.getText().trim() + ".*", 2));
        }
        if (txtRuc.getText().trim().length() > 0) {
            filters.add(RowFilter.regexFilter(".*" + txtRuc.getText().trim() + ".*", 3));
        }
        if (cboMarca.getSelectedIndex() > 0) {
            filters.add(RowFilter.regexFilter(".*" + xMarcaVehiculo.get(cboMarca.getSelectedIndex() - 1).getId_marca() + ".*", 6));
        }
        if (cboModelo.getSelectedIndex() > 0) {
            filters.add(RowFilter.regexFilter(".*" + xModeloVehiculo.get(cboModelo.getSelectedIndex() - 1).getId_modelo() + ".*", 8));
        }
        RowFilter fooBarFilter = RowFilter.andFilter(filters);

        return fooBarFilter;
    }

    private void obtenerDatos() {
        int row = tableVehiculo.getSelectedRow();

        if (row >= 0) {
            BeanVehiculo beanVehiculo = new BeanVehiculo();
            beanVehiculo = modeltableVehiculo.getVehiculo(tableVehiculo.convertRowIndexToModel(row));
            if (objDialog != null) {
                objDialog.setValueSearch(beanVehiculo, comp);
            }
            if (objInternal != null) {
                objInternal.setValueSearch(beanVehiculo, comp);
            }

            dispose();
        }
    }

    public void setRucFiltro(String ruc) {
        txtRuc.setText(ruc);
        filtrar();
    }

    @Override
    public void valueChanged(ListSelectionEvent lse) {
        //throw new UnsupportedOperationException("Not supported yet.");
    }

    @Override
    public void keyTyped(KeyEvent ke) {
    }

    @Override
    public void keyPressed(KeyEvent ke) {
    }

    @Override
    public void keyReleased(KeyEvent ke) {
        if (ke.getKeyChar() != '\n') {
            if ((ke.getSource() == txtCodigo) || (ke.getSource() == txtPlaca) || (ke.getSource() == txtDescripcion) || (ke.getSource() == txtContancia) || (ke.getSource() == txtRuc)) {
                filtrar();
            }
        }
    }

    @Override
    public void actionPerformed(ActionEvent ae) {
        if (ae.getSource() == btnRefrescar) {
            cargarTabla();
        }
        if (btnCancelar == ae.getSource()) {
            dispose();
        }
        if (ae.getSource() == btnAgregar) {
            obtenerDatos();
        }
    }

    @Override
    public void mouseClicked(MouseEvent me) {
        if (me.getSource() == tableVehiculo) {
            if (me.getClickCount() == 2) {
                obtenerDatos();
            }
        }
    }

    @Override
    public void mousePressed(MouseEvent me) {
    }

    @Override
    public void mouseReleased(MouseEvent me) {
    }

    @Override
    public void mouseEntered(MouseEvent me) {
    }

    @Override
    public void mouseExited(MouseEvent me) {
    }

    @Override
    public void itemStateChanged(ItemEvent e) {
        if (e.getSource().equals(cboMarca)) {
            filtrar();
        }
        if (e.getSource().equals(cboModelo)) {
            filtrar();
        }
    }

    @Override
    public void focusGained(FocusEvent e) {
        if (e.getSource().equals(txtCodigo)) {
            txtCodigo.selectAll();
        }
        if (e.getSource().equals(txtDescripcion)) {
            txtDescripcion.selectAll();
        }
        if (e.getSource().equals(txtRuc)) {
            txtRuc.selectAll();
        }
        if (e.getSource().equals(txtContancia)) {
            txtContancia.selectAll();
        }
        if (e.getSource().equals(txtPlaca)) {
            txtPlaca.selectAll();
        }
    }

    @Override
    public void focusLost(FocusEvent e) {
    }
}
