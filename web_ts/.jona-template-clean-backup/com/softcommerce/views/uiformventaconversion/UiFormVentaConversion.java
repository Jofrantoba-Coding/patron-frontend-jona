/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.softcommerce.views.uiformventaconversion;

import com.softcommerce.views.uiregisterventadirecta.UiRegisterVentaDirecta;


import com.softcommerce.formularios.*;
import com.softcommerce.beans.BeanVentaConversion;
import com.softcommerce.conta.tablas.TableModelVentaConversion;
import com.softcommerce.general.controles.ComponentToolKit;
import com.softcommerce.general.herramientas.CTableFx;
import com.softcommerce.iconos.Gif;
import com.softcommerce.reglasnegocio.RnConsultas;
import com.softcommerce.reglasnegocio.RnRegconta;
import java.awt.BorderLayout;
import java.awt.Dimension;
import java.awt.FlowLayout;
import java.awt.Font;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.net.URL;
import java.util.List;
import javax.swing.JButton;
import javax.swing.JDialog;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import javax.swing.JScrollPane;
import javax.swing.JTable;
import javax.swing.JTextField;
import javax.swing.JToolBar;
import javax.swing.ListSelectionModel;
import javax.swing.SwingConstants;
import javax.swing.event.TableModelEvent;
import javax.swing.event.TableModelListener;

/**
 *
 * @author Sergio
 */
public class UiFormVentaConversion 
        extends JDialog implements InterUiFormVentaConversion, ActionListener, TableModelListener {

    protected JButton btnAgregar;
    protected JButton btnQuitar;
    protected JButton btnAceptar;
    protected JButton btnCancelar;
    protected JTable table;
    protected TableModelVentaConversion modeltable;
    protected Gif gif;
    protected UiRegisterVentaDirecta formVenta;
    protected JTextField txtTotal;
    protected JTextField txtTotalC;
    protected BigDecimal total = BigDecimal.ZERO;
    protected String id_regconta;
    protected boolean swRegistro;
    public URL path;
    /*public static void main(String[] args) {
     UiFormVentaConversion theEntry = new UiFormVentaConversion();
     theEntry.setVisible(true);
     }*/

    public UiFormVentaConversion(Main frame, UiRegisterVentaDirecta formVenta, BigDecimal total) {
        super(frame, true);
        this.formVenta = formVenta;
        this.total = total;
        swRegistro = true;
        inicialize();
        initListener();
    }

    public UiFormVentaConversion(Main frame, String id_regconta, URL path) {
        super(frame, true);
        swRegistro = false;
        this.path = path;
        this.id_regconta = id_regconta;
        inicialize();
        initListener();
        cargarData();
    }

    protected void inicialize() {
        gif = new Gif();
        JPanel pnl = new JPanel();
        pnl.setLayout(new BorderLayout());
        pnl.add(getToolBarOpc(), BorderLayout.NORTH);
        pnl.add(getPnlCenter(), BorderLayout.CENTER);
        pnl.add(getPnlOpc(), BorderLayout.SOUTH);
        this.getContentPane().add(pnl);
        setMinimumSize(new Dimension(500, 250));
        this.pack();
        ComponentToolKit.centerComponentPosicion(this);
    }

    protected void initListener() {
        btnAceptar.addActionListener(this);
        btnCancelar.addActionListener(this);
        btnAgregar.addActionListener(this);
        btnQuitar.addActionListener(this);
        modeltable.addTableModelListener(this);
    }

    protected JToolBar getToolBarOpc() {
        JToolBar toolbar = new JToolBar();
        btnAgregar = new JButton("Agregar", gif.ADD16);
        toolbar.add(btnAgregar);
        toolbar.addSeparator();
        btnQuitar = new JButton("Quitar", gif.ELIMINATE16);
        toolbar.add(btnQuitar);
        toolbar.setVisible(swRegistro);
        return toolbar;
    }

    protected JPanel getPnlCenter() {
        JPanel pnl = new JPanel();
        pnl.setLayout(new BorderLayout());
        table = new JTable();
        table.setFont(new Font("Tahoma", Font.PLAIN, 11));
        table.setRowHeight(19);
        table.setAutoResizeMode(JTable.AUTO_RESIZE_OFF);
        modeltable = new TableModelVentaConversion();
        modeltable.setSwEditable(swRegistro);
        table.setModel(modeltable);
        table.setSelectionMode(ListSelectionModel.SINGLE_SELECTION);
        table.getTableHeader().setFont(new Font("Tahoma", Font.BOLD, 11));
        if (swRegistro) {
            table.getColumnModel().getColumn(3).setMinWidth(0);
            table.getColumnModel().getColumn(3).setMaxWidth(0);
        }
        JScrollPane scroll = new JScrollPane(table);
        CTableFx.setAllColumnPreferredWidth(table);
        scroll.setPreferredSize(new Dimension(600, 120));
        pnl.add(scroll, BorderLayout.CENTER);
        pnl.add(getPnlTotal(), BorderLayout.SOUTH);
        return pnl;
    }

    protected JPanel getPnlTotal() {
        JPanel pnl = new JPanel();
        pnl.setLayout(new BorderLayout());
        JPanel pnlRigth = new JPanel(new FlowLayout(FlowLayout.LEADING, 2, 5));
        pnl.add(pnlRigth, BorderLayout.EAST);
        JLabel lblTotal = new JLabel("Total Venta");
        lblTotal.setVisible(swRegistro);
        pnlRigth.add(lblTotal);
        txtTotal = new JTextField();
        //txtSolesPago.setDocument(new DoubleDocument());
        txtTotal.setText(total.toString());
        txtTotal.setColumns(8);
        txtTotal.setEditable(false);
        txtTotal.setFont(new Font("Helvetica", Font.BOLD, 11));
        txtTotal.setHorizontalAlignment(SwingConstants.RIGHT);
        txtTotal.setVisible(swRegistro);
        pnlRigth.add(txtTotal);

        JLabel lblTotalC = new JLabel("Total");
        pnlRigth.add(lblTotalC);
        txtTotalC = new JTextField();
        txtTotalC.setText("0");
        txtTotalC.setColumns(8);
        txtTotalC.setEditable(false);
        txtTotalC.setFont(new Font("Helvetica", Font.BOLD, 11));
        txtTotalC.setHorizontalAlignment(SwingConstants.RIGHT);
        pnlRigth.add(txtTotalC);
        return pnl;
    }

    protected JPanel getPnlOpc() {
        JPanel pnl = new JPanel();
        btnAceptar = new JButton("Aceptar", gif.SAVE16);
        btnAceptar.setVisible(swRegistro);
        pnl.add(btnAceptar);
        btnCancelar = new JButton("Cancelar", gif.CANCEL16);
        pnl.add(btnCancelar);
        return pnl;
    }

    protected void cargarData() {
    }

    protected void agregar() {
    }

    protected void quitar() {
    }

    protected void cargarConversion() {
    }

    protected void editarConversion() {
    }

    public JButton getBtnAceptar() {
        return btnAceptar;
    }

    @Override
    public void actionPerformed(ActionEvent e) {
        try {
            if (e.getSource().equals(btnAgregar)) {
                agregar();
            }
            if (e.getSource().equals(btnQuitar)) {
                quitar();
            }
            if (e.getSource().equals(btnCancelar)) {
                this.dispose();
            }
            if (e.getSource().equals(btnAceptar)) {
                if (swRegistro) {
                    cargarConversion();
                } else {
                    editarConversion();
                }
            }
        } catch (Exception ex) {
            ex.printStackTrace();
            JOptionPane.showMessageDialog(this, ex.getMessage());
        }
    }

    @Override
    public void tableChanged(TableModelEvent e) {
        BigDecimal totalC = BigDecimal.ZERO;
        for (int i = 0; i < modeltable.getRowCount(); i++) {
            totalC = totalC.add(modeltable.getVenta(i).getTotal());
        }
        txtTotalC.setText(totalC.setScale(2, RoundingMode.CEILING).toString());
    }
}

