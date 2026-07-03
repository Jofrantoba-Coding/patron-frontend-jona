/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.softcommerce.formularios;

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
public class PnlCierreProdDespachar extends JDialog implements ActionListener {

    private java.net.URL path;
    private JComboBox cboPeriodo;
    private JButton btnBuscar;
    private JButton btnAceptar;
    private JButton btnCancelar;
    private JButton btnExportar;
    private CTable tbl_detalle;
    private ItemDespacharTableModel mdl_detalle;
    private Usuario usuario;
    private JFrame frame;
    private Gif gif;

    public PnlCierreProdDespachar(JFrame frame, Usuario usuario, java.net.URL ruta, boolean modal) {
        super(frame, modal);
        this.usuario = usuario;
        this.path = ruta;
        this.frame = frame;
        initComponents();
        initListener();
    }

    private void initComponents() {
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

    private JPanel getPnlNorth() {
        JPanel pnl = new JPanel(new FlowLayout(FlowLayout.LEADING, 14, 5));
        JLabel lblPeriodo = new JLabel("Periodo");
        pnl.add(lblPeriodo);
        cboPeriodo = new JComboBox();
        pnl.add(cboPeriodo);
        btnBuscar = new JButton("Buscar");
        pnl.add(btnBuscar);
        return pnl;
    }

    private JPanel getPnlCenter() {
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

    private JPanel getPnlSouth() {
        JPanel pnl = new JPanel();
        btnAceptar = new JButton("Aceptar");
        pnl.add(btnAceptar);
        btnExportar = new JButton("Exportar", gif.EXCEL);
        pnl.add(btnExportar);
        btnCancelar = new JButton("Cancelar");
        pnl.add(btnCancelar);
        cargarDatos();
        return pnl;
    }

    private void cargarDatos() {
        try {
            loadPeriodo();
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }

    private void initListener() {
        btnBuscar.addActionListener(this);
        btnCancelar.addActionListener(this);
        btnExportar.addActionListener(this);
        btnAceptar.addActionListener(this);
        cboPeriodo.addActionListener(this);
    }

    private void loadPeriodo() throws Exception {
        try {
            RnPeriodoMensual logicPeriodo = new RnPeriodoMensual(path);
            List listPeriodo = logicPeriodo.listarPeriodoMensual(((Main) frame).getAnio(), -1);
            cboPeriodo.removeAllItems();
            //cboPeriodo.addItem("- Seleccione -");
            for (int i = 0; i < listPeriodo.size(); i++) {
                cboPeriodo.addItem(((BeanPeriodoMensual) listPeriodo.get(i)).getIdPeriodoMensual());
            }
            cboPeriodo.setSelectedIndex(0);
        } catch (Exception e) {
            throw e;
        }
    }

    private void buscarItemDespachar() {
        try {
            if (cboPeriodo.getSelectedIndex() < 0) {
                JOptionPane.showMessageDialog(this, "Seleccione Periodo");
                return;
            }
            RnItemDespachar logic = new RnItemDespachar(path);
            String periodo = cboPeriodo.getSelectedItem().toString();
            //System.out.println("anio = " + periodo.substring(0,4));
            //System.out.println("mes = " + periodo.substring(5,7));
            mdl_detalle.clearTable();
            mdl_detalle.agregarListDespachar(logic.listarItemDespachar(periodo.substring(0, 4), periodo.substring(5, 7)));
            tbl_detalle.setAllColumnPreferredWidthNvo(10);
        } catch (Exception e) {
            e.printStackTrace();
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }

    private void insertItemDespachar() {
        try {
            RnItemDespachar logic = new RnItemDespachar(path);
            String xmlItem = "";
            xmlItem = "<?xml version=\"1.0\" ?> ";
            xmlItem += "<ITEMS>";
            for (int i = 0; i < mdl_detalle.getRowCount(); i++) {
                BeanItemDespachar bean = mdl_detalle.getDespachar(i);
                if (bean.isSwSeleccionar()) {
                    xmlItem += "<ITEM>";
                    xmlItem += "<ID_DESPACHAR>" + bean.getId_item_despachar() + "</ID_DESPACHAR>";
                    xmlItem += "<ID_REGCONTA_REF>" + bean.getId_regconta_ref() + "</ID_REGCONTA_REF>";
                    xmlItem += "<ID_MOVIMIENTO>" + bean.getId_movimiento() + "</ID_MOVIMIENTO>";
                    xmlItem += "<ID_ITEM>" + bean.getBeanItem().getIdItem() + "</ID_ITEM>";
                    xmlItem += "<MONTO>" + bean.getMonto().toString().replace(".", ",") + "</MONTO>";
                    xmlItem += "<CANTIDAD>" + bean.getCantidad().toString().replace(".", ",") + "</CANTIDAD>";
                    xmlItem += "</ITEM>";
                }
            }
            xmlItem += "</ITEMS>";
            System.out.println("xmlItem = " + xmlItem);
            String periodo = cboPeriodo.getSelectedItem().toString();
            String anio = periodo.substring(0, 4);
            String mes = periodo.substring(5, 7);
            String dia = "31";
            if (Integer.parseInt(mes) == 2) {
                dia = "29";
                if (Integer.parseInt(anio) % 4 == 0) {
                    dia = "28";
                }
            } else if (Integer.parseInt(mes) == 4 || Integer.parseInt(mes) == 6 || Integer.parseInt(mes) == 9 || Integer.parseInt(mes) == 11) {
                dia = "30";
            }
            SimpleDateFormat formatter = new SimpleDateFormat("dd/MM/yyyy");
            Date fecha = formatter.parse(dia + "/" + mes + "/" + anio);
            //System.out.println("anio = " + anio);
            //System.out.println("mes = " + mes);
            //System.out.println("fecha = " + fecha);
            String rpta = logic.insertItemDespachar(anio, mes, fecha, usuario.getId_usuario(), xmlItem);
            JOptionPane.showMessageDialog(this, rpta);
            mdl_detalle.clearTable();
            tbl_detalle.setAllColumnPreferredWidthNvo(10);
        } catch (Exception e) {
            e.printStackTrace();
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }

    private void exportar() {
        try {
            File archivo = File.createTempFile("Reporte" + (new Date(Main.fechaActualServer.getTime())).getTime(), ".xlsx");
            archivo.deleteOnExit();
            Map parameters = new HashMap();
            parameters.put(0, usuario.getDescriempresa());
            parameters.put(1, "Ruc: " + usuario.getRuc());
            parameters.put(2, "Cierre de Mercaderia por Despachar");
            ExportarToExcel export = new ExportarToExcel(archivo, tbl_detalle, parameters);
            if (export.exportarJTableToExcelParam()) {
                JOptionPane.showMessageDialog(null, "Reporte Generado Correctamente");
            }
        } catch (IOException ex) {
            JOptionPane.showMessageDialog(null, ex.getMessage());
        }
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
