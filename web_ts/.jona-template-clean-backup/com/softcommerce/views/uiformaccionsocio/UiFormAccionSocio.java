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

    protected java.net.URL path;
    protected Usuario usuario;
    protected JButton btnActivarSocio;
    protected JButton btnDesactivarSocio;
    protected JButton btnActivarPrecio;
    protected JButton btnDesactivarPrecio;
    protected JButton btnAceptar;
    protected JButton btnCancelar;
    public AccionSocioTableModel modeltableAccionSocio;
    protected CTable tableAccionSocio;
    public AccionPrecioTableModel modeltableAccionPrecio;
    protected CTable tableAccionPrecio;
    protected Gif gif;

    public UiFormAccionSocio(JFrame frame, Usuario usuario, java.net.URL ruta, boolean modal) {
        super(frame, modal);
        this.usuario = usuario;
        this.path = ruta;
        initComponents();
        initListener();
        cargar();
    }

    protected void initComponents() {
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

    protected JPanel pnlAccionSocio() {
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

    protected JPanel pnlAccionPrecio() {
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

    protected void initListener() {
        btnActivarSocio.addActionListener(this);
        btnDesactivarSocio.addActionListener(this);
        btnActivarPrecio.addActionListener(this);
        btnDesactivarPrecio.addActionListener(this);
        btnAceptar.addActionListener(this);
        btnCancelar.addActionListener(this);
    }

    protected void cargar() {
    }

    public void setValueSearch(Object valor, Component comp) {
    }

    protected boolean validar() {
        return false;
    }

    protected void guardarAcciones() {
    }

    protected void desactivarPrecio() {
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

