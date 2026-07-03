/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.softcommerce.formularios;

import com.softcommerce.beans.BeanRegcontaCab;
import com.softcommerce.beans.BeanTipoDocVenta;
import com.softcommerce.beans.Usuario;
import com.softcommerce.beans.UsuarioCorrelativo;
import com.softcommerce.general.controles.CTable;
import com.softcommerce.general.controles.ComponentToolKit;
import com.softcommerce.general.controles.IntegerDocument;
import com.softcommerce.general.controles.UpperCaseNumberDocument;
import com.softcommerce.general.herramientas.DateTime;
import com.softcommerce.general.tablas.VentaTableModel;
import com.softcommerce.iconos.Gif;
import com.softcommerce.reglasnegocio.RnConsultas;
import com.softcommerce.reglasnegocio.RnCorrelativo;
import com.softcommerce.reglasnegocio.RnTipoDocVenta;
import com.toedter.calendar.JDateChooser;
import com.toedter.calendar.JTextFieldDateEditor;
import java.awt.BorderLayout;
import java.awt.Component;
import java.awt.Dimension;
import java.awt.Font;
import java.awt.Frame;
import java.awt.GridBagConstraints;
import java.awt.GridBagLayout;
import java.awt.Insets;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.ItemEvent;
import java.awt.event.ItemListener;
import java.awt.event.KeyEvent;
import java.awt.event.KeyListener;
import java.awt.event.MouseEvent;
import java.awt.event.MouseListener;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import javax.swing.JButton;
import javax.swing.JComboBox;
import javax.swing.JDialog;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import javax.swing.JScrollPane;
import javax.swing.JTextField;
import javax.swing.RowFilter;
import javax.swing.table.TableRowSorter;

/**
 *
 * @author Team Develtrex
 */
public class PnlVentaBuscar extends JDialog implements ActionListener, MouseListener, KeyListener, ItemListener {

    private Gif gif;
    private Usuario usuario;
    private Frame frame;
    private java.net.URL path;
    //private JTextField txt_codigo;
    private JComboBox cboTipoDoc;
    private JComboBox cboSerie;
    private JTextField txt_preimpreso;
    private JTextField txt_cliente;
    private JTextField txt_docCliente;
    private JDateChooser dc_fechainicio;
    private JDateChooser dc_fechafin;
    private CTable table;
    private VentaTableModel modeltable;
    private TableRowSorter modeloOrdenado;
    private JButton btnAceptar;
    private JButton btnCancelar;
    private JButton btnBuscar;
    private Date fechaInicio;
    private Date fechaFin;
    private Object pnlPadre;
    private Component comp;
    private List<BeanTipoDocVenta> xTipoDocVenta;

    public PnlVentaBuscar(Frame frame, Usuario usuario, java.net.URL ruta, Object wpnlPadre, Component comp) {
        super(frame, true);
        this.usuario = usuario;
        this.path = ruta;
        this.frame = frame;
        this.pnlPadre = wpnlPadre;
        this.comp = comp;
        initComponents();
        initListener();
        txt_preimpreso.requestFocus();
    }

    private void initComponents() {
        gif = new Gif();
        JPanel pnlPrinc = new JPanel();
        pnlPrinc.setLayout(new BorderLayout());
        pnlPrinc.add(getPnlNorth(), BorderLayout.NORTH);
        pnlPrinc.add(getPnlCenter(), BorderLayout.CENTER);
        pnlPrinc.add(getPnlSouth(), BorderLayout.SOUTH);
        this.getContentPane().add(pnlPrinc);
        setTitle("Listado de Ventas");
        pack();
        //this.setMinimumSize(new Dimension());
        ComponentToolKit.centerComponentPosicion(this);
    }

    private void initListener() {
        btnAceptar.addActionListener(this);
        btnCancelar.addActionListener(this);
        btnBuscar.addActionListener(this);
        table.addMouseListener(this);
        table.addKeyListener(this);
        txt_preimpreso.addKeyListener(this);
        cboTipoDoc.addItemListener(this);
    }

    public void setFecha(Date fechaInicio, Date fechaFin) {
        this.fechaInicio = fechaInicio;
        this.fechaFin = fechaFin;

        dc_fechainicio.setSelectableDateRange(fechaInicio, fechaFin);
        dc_fechafin.setSelectableDateRange(fechaInicio, fechaFin);
        dc_fechainicio.setDate(fechaInicio);
        dc_fechafin.setDate(fechaFin);
        this.cargarDatos();
        //cargarTabla();
    }

    private void cargarDatos() {
        try {
            loadTipoDocumento();
            //loadSerieCorrelativo();
        } catch (Exception e) {
            e.printStackTrace();
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }

    private void cargarTabla() {
        try {
            /*if (cboSerie.getSelectedIndex() < 0) {
                JOptionPane.showMessageDialog(this, "No tiene serie asignada de Cotizacion");
                return;
            }*/
            RnConsultas logic = new RnConsultas(path);
            modeloOrdenado.setRowFilter(null);
            modeltable.clearTable();
            List<BeanRegcontaCab> lista = logic.listarDocVenta(new java.sql.Date(fechaInicio.getTime()), new java.sql.Date(fechaFin.getTime()),
                    xTipoDocVenta.get(cboTipoDoc.getSelectedIndex()).getIdTipoDoc(), this.getSerie(), txt_preimpreso.getText());
            modeltable.agregarListVenta(lista);
            modeloOrdenado.setRowFilter(getFilter());
            table.setAllColumnPreferredWidth();
            if (lista.isEmpty()) {
                JOptionPane.showMessageDialog(this, "No se encontraron documentos");
            } else {
                table.requestFocus();
                table.setRowSelectionInterval(0, 0);
            }
        } catch (Exception e) {
            e.printStackTrace();
            JOptionPane.showMessageDialog(this, "Error: " + e.getMessage(), "", JOptionPane.OK_OPTION);
        }
    }

    private String getSerie() {
        if (cboSerie.getSelectedIndex() < 0) {
            return "";
        }
        return cboSerie.getSelectedItem().toString();
    }

    private void filtrar() {
        modeloOrdenado.setRowFilter(getFilter());
        table.setAllColumnPreferredWidth();

        if (table.getRowCount() > 0) {
            table.setRowSelectionInterval(0, 0);
        }
    }

    private RowFilter getFilter() {
        List filters = new ArrayList();
        /*if (txt_serie.getText().trim().length() > 0) {
         filters.add(RowFilter.regexFilter(".*" + txt_serie.getText().trim() + ".*", 3));
         }*/
        if (txt_preimpreso.getText().trim().length() > 0) {
            filters.add(RowFilter.regexFilter(".*" + txt_preimpreso.getText().trim() + ".*", 4));
        }
        if (txt_cliente.getText().trim().length() > 0) {
            filters.add(RowFilter.regexFilter(".*" + txt_cliente.getText().trim() + ".*", 6));
        }
        if (txt_docCliente.getText().trim().length() > 0) {
            filters.add(RowFilter.regexFilter(".*" + txt_docCliente.getText().trim() + ".*", 7));
        }
        if (!((JTextFieldDateEditor) dc_fechainicio.getDateEditor()).getText().equals("__/__/____")
                && !((JTextFieldDateEditor) dc_fechafin.getDateEditor()).getText().equals("__/__/____")) {
            if (DateTime.isValidDate(((JTextFieldDateEditor) dc_fechainicio.getDateEditor()).getText())
                    && DateTime.isValidDate(((JTextFieldDateEditor) dc_fechafin.getDateEditor()).getText())) {
                filters.add(RowFilter.dateFilter(RowFilter.ComparisonType.AFTER, DateTime.getDateMinusOrPlus(dc_fechainicio.getDate(), -1), 1));
                filters.add(RowFilter.dateFilter(RowFilter.ComparisonType.BEFORE, DateTime.getDateMinusOrPlus(dc_fechafin.getDate(), 1), 1));
            }
        }

        RowFilter fooBarFilter = RowFilter.andFilter(filters);

        return fooBarFilter;
    }

    private JPanel getPnlNorth() {
        JPanel pnlGral = new JPanel();
        pnlGral.setLayout(new BorderLayout());
        JPanel pnl = new JPanel();
        pnl.setLayout(new GridBagLayout());
        pnlGral.add(pnl, BorderLayout.WEST);
        GridBagConstraints gbc = new GridBagConstraints();
        gbc.gridx = 0;
        gbc.gridy = 0;
        gbc.insets = new Insets(2, 2, 2, 2);
        gbc.anchor = GridBagConstraints.WEST;

        JLabel lblTipoDoc = new JLabel("T Doc");
        lblTipoDoc.setFont(new Font("Verdana", 0, 11));
        pnl.add(lblTipoDoc, gbc);

        cboTipoDoc = new JComboBox();
        gbc.gridx = 1;
        pnl.add(cboTipoDoc, gbc);

        JLabel lblDocumento = new JLabel("Documento");
        lblDocumento.setFont(new Font("Verdana", 0, 11));
        gbc.gridx = 2;
        pnl.add(lblDocumento, gbc);

        cboSerie = new JComboBox();
        gbc.gridx = 3;
        pnl.add(cboSerie, gbc);
        txt_preimpreso = new JTextField();
        txt_preimpreso.setColumns(8);
        txt_preimpreso.setDocument(new IntegerDocument(10));
        txt_preimpreso.setFont(new Font("Garamond", 0, 14));
        gbc.gridx = 4;
        pnl.add(txt_preimpreso, gbc);

        gbc.gridx = 0;
        gbc.gridy = 1;
        JLabel lblCliente = new JLabel("Cliente");
        lblCliente.setFont(new Font("Verdana", 0, 11));
        pnl.add(lblCliente, gbc);

        txt_cliente = new JTextField();
        txt_cliente.setDocument(new UpperCaseNumberDocument(100));
        txt_cliente.setFont(new Font("Garamond", 0, 14));
        gbc.gridx = 1;
        gbc.gridwidth = 4;
        gbc.fill = GridBagConstraints.HORIZONTAL;
        pnl.add(txt_cliente, gbc);
        gbc.fill = GridBagConstraints.NONE;
        gbc.gridwidth = 1;

        JLabel lblNum = new JLabel("RUC/DNI");
        lblNum.setFont(new Font("Verdana", 0, 11));
        gbc.gridx = 5;
        pnl.add(lblNum, gbc);

        txt_docCliente = new JTextField();
        txt_docCliente.setColumns(11);
        txt_docCliente.setDocument(new IntegerDocument(11));
        txt_docCliente.setFont(new Font("Garamond", 0, 14));
        gbc.gridx = 6;
        pnl.add(txt_docCliente, gbc);

        gbc.gridx = 0;
        gbc.gridy = 2;

        JLabel lblInicio = new JLabel("F Inicio");
        lblInicio.setFont(new Font("Verdana", 0, 11));
        pnl.add(lblInicio, gbc);
        gbc.gridx = 1;
        dc_fechainicio = new JDateChooser("dd/MM/yyyy", "##/##/####", '_');
        pnl.add(dc_fechainicio, gbc);

        gbc.gridx = 2;
        JLabel lblFin = new JLabel("F Fin");
        lblFin.setFont(new Font("Verdana", 0, 11));
        pnl.add(lblFin, gbc);
        gbc.gridx = 3;
        gbc.gridwidth = 2;
        gbc.fill = GridBagConstraints.HORIZONTAL;
        dc_fechafin = new JDateChooser("dd/MM/yyyy", "##/##/####", '_');
        pnl.add(dc_fechafin, gbc);

        gbc.gridwidth = 1;
        gbc.fill = GridBagConstraints.NONE;
        gbc.gridx = 5;
        btnBuscar = new JButton("Buscar", gif.SEARCH16);
        pnl.add(btnBuscar, gbc);
        return pnlGral;
    }

    private JPanel getPnlCenter() {
        JPanel pnl = new JPanel();
        pnl.setLayout(new BorderLayout());
        modeltable = new VentaTableModel();
        modeloOrdenado = new TableRowSorter(modeltable);
        table = new CTable();
        table.setRowSorter(modeloOrdenado);
        table.setModel(modeltable);
        table.setAllTableNoEditable();
        table.setAllColumnNoResizable();
        table.setRendererColumnZero();
        table.setAllColumnPreferredWidth();
        JScrollPane scroll = new JScrollPane(table);
        table.setNoVisibleColumn(3);
        table.setNoVisibleColumn(4);
        table.setNoVisibleColumn(8);
        scroll.setPreferredSize(new Dimension(1200, 380));
        pnl.add(scroll, BorderLayout.CENTER);
        return pnl;
    }

    private JPanel getPnlSouth() {
        JPanel pnl = new JPanel();
        btnCancelar = new JButton("Cancelar", gif.CANCEL16);
        pnl.add(btnCancelar);
        btnAceptar = new JButton("Agregar", gif.ADD16);
        pnl.add(btnAceptar);
        return pnl;
    }

    private void obtenerDatos() {
        int row = table.getSelectedRow();
        if (row >= 0) {
            BeanRegcontaCab bean;
            bean = modeltable.getVenta(table.convertRowIndexToModel(row));
            if (pnlPadre != null) {
                ((RegisterVentaDirecta) pnlPadre).setValueSearch(bean, comp);
                dispose();
            }
        }
    }

    private void loadSerieCorrelativo(String ls_IdTipoDoc) throws Exception {
        try {
            RnCorrelativo regla_correlativo = new RnCorrelativo(path);

            List<UsuarioCorrelativo> list = regla_correlativo.listarCorrelativo(usuario.getId_usuario(), usuario.getCodpuntoventa(), ls_IdTipoDoc);
            cboSerie.removeAllItems();
            //Collections.sort(xCorrelativo, new OrdenarUsuarioCorrelativoAsc());
            for (int i = 0; i < list.size(); i++) {
                cboSerie.addItem(list.get(i).getSerie());
            }

            if (cboSerie.getItemCount() > 0) {
                cboSerie.setSelectedIndex(0);
            }
        } catch (Exception e) {
            throw e;
        }
    }

    private void loadTipoDocumento() throws Exception {
        try {
            RnTipoDocVenta regla_TipoDoc = new RnTipoDocVenta(path);
            if (xTipoDocVenta != null) {
                xTipoDocVenta.clear();
            } else {
                xTipoDocVenta = new ArrayList();
            }

            xTipoDocVenta.addAll(regla_TipoDoc.listarTipoDocVenta("", "", "", "A", "VE", "", ""));
            cboTipoDoc.removeAllItems();
            for (int i = 0; i < xTipoDocVenta.size(); i++) {
                if (xTipoDocVenta.get(i).getIdTipoDoc().equals("CO")) {
                    xTipoDocVenta.remove(i);
                }
                cboTipoDoc.addItem(xTipoDocVenta.get(i).getDescripcion());
            }

            if (xTipoDocVenta.size() > 0) {
                cboTipoDoc.setSelectedIndex(0);
                loadSerieCorrelativo(xTipoDocVenta.get(cboTipoDoc.getSelectedIndex()).getIdTipoDoc());
            }
        } catch (Exception e) {
            throw e;
        }
    }

    @Override
    public void actionPerformed(ActionEvent e) {
        try {
            if (e.getSource().equals(btnCancelar)) {
                dispose();
            }
            if (e.getSource().equals(btnBuscar)) {
                cargarTabla();
            }
            if (e.getSource().equals(btnAceptar)) {
                obtenerDatos();
            }
        } catch (Exception ex) {
            ex.printStackTrace();
            JOptionPane.showMessageDialog(this, ex.getMessage());
        }
    }

    @Override
    public void mouseClicked(MouseEvent e) {
        if (e.getSource() == table) {
            if (e.getClickCount() == 2) {
                obtenerDatos();
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

    @Override
    public void keyTyped(KeyEvent e) {
    }

    @Override
    public void keyPressed(KeyEvent e) {
    }

    @Override
    public void keyReleased(KeyEvent e) {
        if (e.getSource().equals(txt_preimpreso) && e.getKeyCode() == KeyEvent.VK_ENTER) {
            btnBuscar.doClick();
        } else if (e.getSource().equals(table) && e.getKeyCode() == KeyEvent.VK_ENTER) {
            btnAceptar.doClick();
        }
    }

    @Override
    public void itemStateChanged(ItemEvent e) {
        try {
            if (cboTipoDoc == e.getSource()) {
                if (cboTipoDoc.getItemCount() > 0) {
                    loadSerieCorrelativo(xTipoDocVenta.get(cboTipoDoc.getSelectedIndex()).getIdTipoDoc());
                }
            }
        } catch (Exception ex) {
            ex.printStackTrace();
            JOptionPane.showMessageDialog(this, ex.getMessage());
        }
    }
}
