/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.softcommerce.views.uiformaccionsocio;


import com.softcommerce.formularios.*;
import com.softcommerce.beans.AccionPrecio;
import com.softcommerce.beans.AccionSocio;
import com.softcommerce.beans.Usuario;
import com.softcommerce.general.controles.CTable;
import com.softcommerce.general.tablas.AccionPrecioTableModel;
import com.softcommerce.general.tablas.AccionSocioTableModel;
import com.softcommerce.iconos.Gif;
import com.softcommerce.reglasnegocio.RnCliente;
import com.softcommerce.util.render.CellRendererImageEstado;
import java.awt.BorderLayout;
import java.awt.Component;
import java.awt.Dimension;
import java.awt.Font;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.math.BigDecimal;
import java.math.BigInteger;
import java.text.SimpleDateFormat;
import javax.swing.JButton;
import javax.swing.JDialog;
import javax.swing.JFrame;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import javax.swing.JScrollPane;
import javax.swing.JTabbedPane;
import javax.swing.JToolBar;
import javax.swing.SwingConstants;

/**
 *
 * @author Team Develtrex
 */
public class UiFormAccionSocio extends JDialog implements InterUiFormAccionSocio, ActionListener {

    private java.net.URL path;
    private Usuario usuario;
    private JButton btnActivarSocio;
    private JButton btnDesactivarSocio;
    private JButton btnActivarPrecio;
    private JButton btnDesactivarPrecio;
    private JButton btnAceptar;
    private JButton btnCancelar;
    public AccionSocioTableModel modeltableAccionSocio;
    private CTable tableAccionSocio;
    public AccionPrecioTableModel modeltableAccionPrecio;
    private CTable tableAccionPrecio;
    private Gif gif;

    public UiFormAccionSocio(JFrame frame, Usuario usuario, java.net.URL ruta, boolean modal) {
        super(frame, modal);
        this.usuario = usuario;
        this.path = ruta;
        initComponents();
        initListener();
        cargar();
    }

    private void initComponents() {
        gif = new Gif();
        JPanel pnlGral = new JPanel();
        pnlGral.setLayout(new BorderLayout());
        getContentPane().add(pnlGral, BorderLayout.CENTER);
        JTabbedPane tabb = new JTabbedPane();
        pnlGral.add(tabb, BorderLayout.CENTER);
        tabb.addTab("Socios", pnlAccionSocio());
        tabb.addTab("Precio", pnlAccionPrecio());
        btnAceptar = new JButton("Aceptar");
        btnCancelar = new JButton("Cancelar");
        JPanel pnlOpcion = new JPanel();
        pnlOpcion.add(btnAceptar);
        pnlOpcion.add(btnCancelar);
        pnlGral.add(pnlOpcion, BorderLayout.SOUTH);
        //setSize(new Dimension(700, 400));
        pack();
    }

    private JPanel pnlAccionSocio() {
        JPanel pnl = new JPanel();
        pnl.setLayout(new BorderLayout());
        JToolBar toolbar = new JToolBar();
        toolbar.setPreferredSize(new Dimension(0, 30));
        btnActivarSocio = new JButton("Activar", gif.ADD16);
        btnActivarSocio.setMnemonic('A');
        btnActivarSocio.setHorizontalAlignment(SwingConstants.LEFT);
        btnActivarSocio.setIconTextGap(10);
        btnActivarSocio.setOpaque(false);
        btnActivarSocio.setFont(new Font(Font.SANS_SERIF, 0, 11));
        toolbar.add(btnActivarSocio);

        toolbar.addSeparator();

        btnDesactivarSocio = new JButton("Desactivar", gif.ELIMINATE16);
        btnDesactivarSocio.setMnemonic('D');
        btnDesactivarSocio.setHorizontalAlignment(SwingConstants.LEFT);
        btnDesactivarSocio.setIconTextGap(10);
        btnDesactivarSocio.setOpaque(false);
        btnDesactivarSocio.setFont(new Font(Font.SANS_SERIF, 0, 11));
        toolbar.add(btnDesactivarSocio);
        pnl.add(toolbar, BorderLayout.PAGE_START);

        modeltableAccionSocio = new AccionSocioTableModel();
        //modeltableAccionSocio.addTableModelListener(this);
        tableAccionSocio = new CTable();
        tableAccionSocio.setFont(new Font(Font.SANS_SERIF, 0, 11));
        tableAccionSocio.getTableHeader().setFont(new Font(Font.SANS_SERIF, 1, 11));
        tableAccionSocio.setModel(modeltableAccionSocio);
        tableAccionSocio.setAllTableNoEditable();
        tableAccionSocio.setAllColumnNoResizable();
        tableAccionSocio.setRendererColumnZero();
        //tableAccionSocio.getSelectionModel().addListSelectionListener(this);
        JScrollPane scroll = new JScrollPane(tableAccionSocio);
        tableAccionSocio.getColumnModel().getColumn(0).setCellRenderer(new CellRendererImageEstado());
        tableAccionSocio.setAllColumnPreferredWidth();
        scroll.setPreferredSize(new Dimension(800, 400));
        pnl.add(scroll, BorderLayout.CENTER);

        return pnl;
    }

    private JPanel pnlAccionPrecio() {
        JPanel pnl = new JPanel();
        pnl.setLayout(new BorderLayout());
        JToolBar toolbar = new JToolBar();
        toolbar.setPreferredSize(new Dimension(0, 30));
        btnActivarPrecio = new JButton("Activar", gif.ADD16);
        btnActivarPrecio.setMnemonic('A');
        btnActivarPrecio.setHorizontalAlignment(SwingConstants.LEFT);
        btnActivarPrecio.setIconTextGap(10);
        btnActivarPrecio.setOpaque(false);
        btnActivarPrecio.setFont(new Font(Font.SANS_SERIF, 0, 11));
        toolbar.add(btnActivarPrecio);

        toolbar.addSeparator();

        btnDesactivarPrecio = new JButton("Desactivar", gif.ELIMINATE16);
        btnDesactivarPrecio.setMnemonic('D');
        btnDesactivarPrecio.setHorizontalAlignment(SwingConstants.LEFT);
        btnDesactivarPrecio.setIconTextGap(10);
        btnDesactivarPrecio.setOpaque(false);
        btnDesactivarPrecio.setFont(new Font(Font.SANS_SERIF, 0, 11));
        toolbar.add(btnDesactivarPrecio);
        pnl.add(toolbar, BorderLayout.PAGE_START);

        modeltableAccionPrecio = new AccionPrecioTableModel();
        //modeltableAccionSocio.addTableModelListener(this);
        tableAccionPrecio = new CTable();
        tableAccionPrecio.setFont(new Font(Font.SANS_SERIF, 0, 11));
        tableAccionPrecio.getTableHeader().setFont(new Font(Font.SANS_SERIF, 1, 11));
        tableAccionPrecio.setModel(modeltableAccionPrecio);
        tableAccionPrecio.setAllTableNoEditable();
        tableAccionPrecio.setAllColumnNoResizable();
        tableAccionPrecio.setRendererColumnZero();
        //tableAccionSocio.getSelectionModel().addListSelectionListener(this);
        JScrollPane scroll = new JScrollPane(tableAccionPrecio);
        tableAccionPrecio.getColumnModel().getColumn(0).setCellRenderer(new CellRendererImageEstado());
        tableAccionPrecio.setAllColumnPreferredWidth();
        scroll.setPreferredSize(new Dimension(800, 400));
        pnl.add(scroll, BorderLayout.CENTER);

        return pnl;
    }

    private void initListener() {
        btnActivarSocio.addActionListener(this);
        btnDesactivarSocio.addActionListener(this);
        btnActivarPrecio.addActionListener(this);
        btnDesactivarPrecio.addActionListener(this);
        btnAceptar.addActionListener(this);
        btnCancelar.addActionListener(this);
    }

    private void cargar() {
        try {
            RnCliente logicCliente = new RnCliente(path);
            modeltableAccionPrecio.agregarListAccionPrecio(logicCliente.listarAccionPrecio());
            tableAccionPrecio.setAllColumnPreferredWidth();
            modeltableAccionSocio.agregarListAccionSocio(logicCliente.listarAccionSocio());
            tableAccionSocio.setAllColumnPreferredWidth();
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }

    public void setValueSearch(Object valor, Component comp) {
        if (comp == btnActivarPrecio) {
            BigDecimal precio = ((AccionPrecio) valor).getPrecio();
            for (int i = 0; i < modeltableAccionSocio.getRowCount(); i++) {
                if (modeltableAccionSocio.getAccionSocio(i).getEstado().equals("A")) {
                    modeltableAccionSocio.getAccionSocio(i).setPrecio(precio);
                    modeltableAccionSocio.getAccionSocio(i).setOperacion("A");
                }
            }
            modeltableAccionPrecio.setAccionPrecio((AccionPrecio) valor);
            modeltableAccionPrecio.fireTableDataChanged();
            tableAccionPrecio.setAllColumnPreferredWidth();
            modeltableAccionSocio.fireTableDataChanged();
            tableAccionSocio.setAllColumnPreferredWidth();
        }
        if (comp == btnActivarSocio) {
            BigDecimal precio = new BigDecimal(BigInteger.ZERO);
            AccionSocio beanAccionSocio = (AccionSocio) valor;
            if (modeltableAccionPrecio.getRowCount() > 0) {
                if (modeltableAccionPrecio.getAccionPrecio(modeltableAccionPrecio.getRowCount() - 1).getEstado().equals("A")) {
                    precio = modeltableAccionPrecio.getAccionPrecio(modeltableAccionPrecio.getRowCount() - 1).getPrecio();
                }
            }
            beanAccionSocio.setPrecio(precio);
            modeltableAccionSocio.setAccionSocio(beanAccionSocio);
            modeltableAccionSocio.fireTableDataChanged();
            tableAccionSocio.setAllColumnPreferredWidth();
        }
        if (comp == btnDesactivarPrecio) {
            modeltableAccionPrecio.getAccionPrecio(modeltableAccionPrecio.getRowCount() - 1).setEstado(((AccionPrecio) valor).getEstado());
            modeltableAccionPrecio.getAccionPrecio(modeltableAccionPrecio.getRowCount() - 1).setOperacion(((AccionPrecio) valor).getOperacion());
            modeltableAccionPrecio.getAccionPrecio(modeltableAccionPrecio.getRowCount() - 1).setFechaFin(((AccionPrecio) valor).getFechaFin());
            modeltableAccionPrecio.fireTableDataChanged();
            tableAccionPrecio.setAllColumnPreferredWidth();
        }
    }

    private boolean validar() {
        if (modeltableAccionPrecio.getRowCount() == 0) {
            JOptionPane.showMessageDialog(this, "Ingrese Precio");
            return false;
        } else {
            if (!modeltableAccionPrecio.getAccionPrecio(modeltableAccionPrecio.getRowCount() - 1).getEstado().equals("A")) {
                JOptionPane.showMessageDialog(this, "Ingrese Precio");
                return false;
            }
        }
        return true;
    }

    private void guardarAcciones() {
        try {
            if (!validar()) {
                return;
            }
            String rpta = "";
            RnCliente logicCliente = new RnCliente(path);
            SimpleDateFormat fe = new SimpleDateFormat("dd/MM/yyyy");
            String xmlPrecio = "";
            xmlPrecio = "<?xml version=\"1.0\" ?> ";
            xmlPrecio += "<PRECIOS>";
            for (int i = 0; i < modeltableAccionPrecio.getRowCount(); i++) {
                AccionPrecio beanAccionPrecio = modeltableAccionPrecio.getAccionPrecio(i);
                if (!beanAccionPrecio.getOperacion().equals("")) {
                    xmlPrecio += "<PRECIO>";
                    xmlPrecio += "<ID_ACCION_PRECIO>" + beanAccionPrecio.getIdAccionPrecio() + "</ID_ACCION_PRECIO>";
                    xmlPrecio += "<F_INICIO>" + fe.format(beanAccionPrecio.getFechaIni()) + "</F_INICIO>";
                    xmlPrecio += "<F_FIN>" + ((beanAccionPrecio.getFechaFin() == null) ? beanAccionPrecio.getFechaFin() : fe.format(beanAccionPrecio.getFechaFin())) + "</F_FIN>";
                    xmlPrecio += "<ESTADO>" + beanAccionPrecio.getEstado() + "</ESTADO>";
                    xmlPrecio += "<PRECIO>" + beanAccionPrecio.getPrecio().toString().replace(".", ",") + "</PRECIO>";
                    xmlPrecio += "<OPERACION>" + beanAccionPrecio.getOperacion() + "</OPERACION>";
                    xmlPrecio += "</PRECIO>";
                }
            }
            xmlPrecio += "</PRECIOS>";
            System.out.println("xml_PRECIO: " + xmlPrecio);
            String xmlSocio = "";
            xmlSocio = "<?xml version=\"1.0\" ?> ";
            xmlSocio += "<SOCIOS>";
            for (int i = 0; i < modeltableAccionSocio.getRowCount(); i++) {
                AccionSocio beanAccionSocio = modeltableAccionSocio.getAccionSocio(i);
                if (!beanAccionSocio.getOperacion().equals("")) {
                    xmlSocio += "<SOCIO>";
                    xmlSocio += "<ID_ACCION_SOCIO>" + beanAccionSocio.getIdAccionSocio() + "</ID_ACCION_SOCIO>";
                    xmlSocio += "<ID_SOCIO>" + beanAccionSocio.getBeanSocio().getId_socio() + "</ID_SOCIO>";
                    xmlSocio += "<F_INICIO>" + fe.format(beanAccionSocio.getFechaIni()) + "</F_INICIO>";
                    xmlSocio += "<F_FIN>" + ((beanAccionSocio.getFechaFin() == null) ? beanAccionSocio.getFechaFin() : fe.format(beanAccionSocio.getFechaFin())) + "</F_FIN>";
                    xmlSocio += "<ESTADO>" + beanAccionSocio.getEstado() + "</ESTADO>";
                    xmlSocio += "<PRECIO>" + beanAccionSocio.getPrecio().toString().replace(".", ",") + "</PRECIO>";
                    xmlSocio += "<CANTIDAD>" + beanAccionSocio.getCantidad().toString().replace(".", ",") + "</CANTIDAD>";
                    xmlSocio += "<OPERACION>" + beanAccionSocio.getOperacion() + "</OPERACION>";
                    xmlSocio += "</SOCIO>";
                }
            }
            xmlSocio += "</SOCIOS>";
            System.out.println("xml_SOCIOS: " + xmlSocio);
            rpta = logicCliente.mantAcciones(xmlSocio, xmlPrecio);
            JOptionPane.showMessageDialog(this, rpta);
            dispose();
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }

    private void desactivarPrecio() {
        if (tableAccionPrecio.getRowCount() == 0) {
            return;
        }
        if (tableAccionPrecio.getSelectedRow() >= 0) {
            AccionPrecio beanAccionPrecio = new AccionPrecio();
            beanAccionPrecio = modeltableAccionPrecio.getAccionPrecio(tableAccionPrecio.convertRowIndexToModel(tableAccionPrecio.getSelectedRow()));
            if (beanAccionPrecio.getEstado().equals("D")) {
                JOptionPane.showMessageDialog(this, "Precio Seleccionado ya esta desactivado", "Precio", JOptionPane.INFORMATION_MESSAGE);
                return;
            }
            int xres = JOptionPane.showConfirmDialog(this, "Desea Desactivar Precio?", "Precio", JOptionPane.OK_CANCEL_OPTION);
            if (xres == JOptionPane.OK_OPTION) {
                FormAccionPrecioAgregar frmSocioAgregar = new FormAccionPrecioAgregar(this, path, btnDesactivarPrecio, false, beanAccionPrecio);
                frmSocioAgregar = null;
                /*if (modeltableAccionPrecio.get(tableConfigItem.convertRowIndexToModel(tableConfigItem.getSelectedRow())).getOperacion().equals("I")) {
                 modeltableConfigItem.deleteConfigItem(tableConfigItem.convertRowIndexToModel(tableConfigItem.getSelectedRow()));
                 modeltableConfigItem.fireTableDataChanged();
                 } else {
                 modeltableConfigItem.getConfigItem(tableConfigItem.convertRowIndexToModel(tableConfigItem.getSelectedRow())).setFecha_fin(Main.fechaActualServer);
                 modeltableConfigItem.getConfigItem(tableConfigItem.convertRowIndexToModel(tableConfigItem.getSelectedRow())).setEstado("D");
                 modeltableConfigItem.getConfigItem(tableConfigItem.convertRowIndexToModel(tableConfigItem.getSelectedRow())).setOperacion("A");
                 modeltableConfigItem.fireTableDataChanged();
                 tableConfigItem.setAllColumnPreferredWidth();
                 }*/
            }
        } else {
            JOptionPane.showMessageDialog(this, "Seleccionar Fila", "Precio", JOptionPane.INFORMATION_MESSAGE);
        }
    }

    @Override
    public void actionPerformed(ActionEvent e) {
        if (e.getSource() == btnActivarSocio) {
            FormAccionSocioAgregar formAccionSocioAgregar = new FormAccionSocioAgregar(this, path, btnActivarSocio, true);
            formAccionSocioAgregar = null;
        }
        if (e.getSource() == btnActivarPrecio) {
            boolean sw = true;
            if (modeltableAccionPrecio.getRowCount() == 0) {
                sw = true;
            } else {
                for (int i = 0; i < modeltableAccionPrecio.getRowCount(); i++) {
                    if (modeltableAccionPrecio.getAccionPrecio(i).getEstado().equals("A")) {
                        JOptionPane.showMessageDialog(this, "No se Puede Agregar mas de un Precio");
                        sw = false;
                    }
                }
            }
            if (sw) {
                FormAccionPrecioAgregar frmSocioAgregar = new FormAccionPrecioAgregar(this, path, btnActivarPrecio, true);
                frmSocioAgregar = null;
            }
        }
        if (e.getSource() == btnDesactivarPrecio) {
            desactivarPrecio();
        }
        if (e.getSource() == btnDesactivarSocio) {
        }
        if (e.getSource() == btnCancelar) {
            dispose();
        }
        if (e.getSource() == btnAceptar) {
            guardarAcciones();
        }
    }
}

