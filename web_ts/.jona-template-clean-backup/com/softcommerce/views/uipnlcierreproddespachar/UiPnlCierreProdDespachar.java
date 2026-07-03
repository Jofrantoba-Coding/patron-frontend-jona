/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.softcommerce.views.uipnlcierreproddespachar;


import com.softcommerce.formularios.*;
import com.softcommerce.beans.BeanItemDespachar;
import com.softcommerce.beans.BeanPeriodoMensual;
import com.softcommerce.beans.Usuario;
import com.softcommerce.general.controles.CTable;
import com.softcommerce.general.controles.ComponentToolKit;
import com.softcommerce.general.tablas.ItemDespacharTableModel;
import com.softcommerce.iconos.Gif;
import com.softcommerce.reglasnegocio.RnItemDespachar;
import com.softcommerce.reglasnegocio.RnPeriodoMensual;
import com.softcommerce.util.ExportarToExcel;
import java.awt.BorderLayout;
import java.awt.Dimension;
import java.awt.FlowLayout;
import java.awt.Font;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.io.File;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import javax.swing.JButton;
import javax.swing.JComboBox;
import javax.swing.JDialog;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import javax.swing.JScrollPane;

/**
 *
 * @author Team Develtrex
 */
public class UiPnlCierreProdDespachar extends JDialog implements InterUiPnlCierreProdDespachar, ActionListener {

    protected java.net.URL path;
    protected JComboBox cboPeriodo;
    protected JButton btnBuscar;
    protected JButton btnAceptar;
    protected JButton btnCancelar;
    protected JButton btnExportar;
    protected CTable tbl_detalle;
    protected ItemDespacharTableModel mdl_detalle;
    protected Usuario usuario;
    protected JFrame frame;
    protected Gif gif;

    public UiPnlCierreProdDespachar(JFrame frame, Usuario usuario, java.net.URL ruta, boolean modal) {
        super(frame, modal);
        this.usuario = usuario;
        this.path = ruta;
        this.frame = frame;
        initComponents();
        initListener();
    }

    protected void initComponents() {
        gif = new Gif();
        JPanel pnlPrinc = new JPanel();
        pnlPrinc.setLayout(new BorderLayout());
        pnlPrinc.add(getPnlNorth(), BorderLayout.NORTH);
        pnlPrinc.add(getPnlCenter(), BorderLayout.CENTER);
        pnlPrinc.add(getPnlSouth(), BorderLayout.SOUTH);
        this.getContentPane().add(pnlPrinc);
        pack();
        //this.setMinimumSize(new Dimension());
        ComponentToolKit.centerComponentPosicion(this);
    }

    protected JPanel getPnlNorth() {
        JPanel pnl = new JPanel(new FlowLayout(FlowLayout.LEADING, 14, 5));
        JLabel lblPeriodo = new JLabel("Periodo");
        pnl.add(lblPeriodo);
        cboPeriodo = new JComboBox();
        pnl.add(cboPeriodo);
        btnBuscar = new JButton("Buscar");
        pnl.add(btnBuscar);
        return pnl;
    }

    protected JPanel getPnlCenter() {
        JPanel pnl = new JPanel();
        pnl.setLayout(new BorderLayout());
        mdl_detalle = new ItemDespacharTableModel();
        tbl_detalle = new CTable();
        tbl_detalle.setFont(new Font(Font.SANS_SERIF, 0, 11));
        tbl_detalle.getTableHeader().setFont(new Font(Font.SANS_SERIF, 1, 11));
        tbl_detalle.setModel(mdl_detalle);
        tbl_detalle.setAllColumnNoResizable();
        tbl_detalle.setAllTableNoEditable();
        tbl_detalle.setColumnEditable(0);
        JScrollPane scrollViewVenta = new JScrollPane(tbl_detalle);
        scrollViewVenta.setPreferredSize(new Dimension(800, 400));
        pnl.add(scrollViewVenta, BorderLayout.CENTER);
        return pnl;
    }

    protected JPanel getPnlSouth() {
        return null;
    }

    protected void cargarDatos() {
    }

    protected void initListener() {
    }

    protected void loadPeriodo() throws Exception {
    }

    protected void buscarItemDespachar() {
    }

    protected void insertItemDespachar() {
    }

    protected void exportar() {
    }

    @Override
    public void actionPerformed(ActionEvent e) {
        if (e.getSource().equals(btnBuscar)) {
            buscarItemDespachar();
        }
        if (e.getSource().equals(btnAceptar)) {
            insertItemDespachar();
        }
        if (e.getSource().equals(btnCancelar)) {
            this.dispose();
        }
        if (e.getSource().equals(btnExportar)) {
            exportar();
        }
        if (e.getSource().equals(cboPeriodo)) {
            mdl_detalle.clearTable();
            tbl_detalle.setAllColumnPreferredWidthNvo(10);
        }
    }
}
