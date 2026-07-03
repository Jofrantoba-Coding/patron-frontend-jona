/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.softcommerce.views.uiformanexopadron;


import com.softcommerce.formularios.*;
import com.softcommerce.beans.AnexoPadron;
import com.softcommerce.comboboxmodel.ComboModelPadron;
import com.softcommerce.entity.Padrones;
import com.softcommerce.general.controles.CLabel;
import com.softcommerce.general.controles.ComponentToolKit;
import com.softcommerce.general.controles.JHDialog;
import com.softcommerce.general.tablas.AnexoPadronTableModel;
import com.softcommerce.logic.LogicPadrones;
import com.softcommerce.util.Propiedad;
import com.toedter.calendar.JDateChooser;
import java.awt.Color;
import java.awt.Component;
import java.awt.GridBagConstraints;
import java.awt.GridBagLayout;
import java.awt.Insets;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.util.ArrayList;
import javax.swing.JButton;
import javax.swing.JComboBox;
import javax.swing.JDialog;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import javax.swing.border.LineBorder;

/**
 *
 * @author Team Develtrex
 */
public class UiFormAnexoPadron extends JDialog implements InterUiFormAnexoPadron, ActionListener {

    private java.net.URL path;
    private JButton btnProcess;
    public Boolean swRegistro;
    private JComboBox cbo_Padron;
    //private List<Padron> xPadron;
    private ComboModelPadron cboModelPadron;
    //private JLabel lblFechaInicio;
    private JDateChooser dc_fechainicio;
    private JHDialog dialog;
    private Component comp;
    private int id_tipo_anexo;
    private AnexoPadronTableModel modelAnexoPadron;

    public UiFormAnexoPadron(JHDialog arg0, java.net.URL path, Component comp, int id_tipo_anexo, AnexoPadronTableModel modelAnexoPadron) {
        super(arg0);
        this.dialog = arg0;
        this.path = path;
        this.comp = comp;
        this.id_tipo_anexo = id_tipo_anexo;
        this.modelAnexoPadron = modelAnexoPadron;
        initialize();
    }

    private void initialize() {
        swRegistro = false;
        JPanel pnl = new JPanel();
        pnl.setBackground(new Color(243, 248, 252));
        pnl.setOpaque(false);
        pnl.setLayout(null);
        setTitle("Agregar Padron");
        setBackground(new Color(245, 245, 245));
        setContentPane(pnl);
        setModal(true);
        loadPadron();
        GridBagConstraints gbc = new GridBagConstraints();
        pnl.setLayout(new GridBagLayout());
        CLabel lbl_Departamento = new CLabel("Padron");
        gbc.gridx = 0;
        gbc.gridy = 0;
        gbc.fill = GridBagConstraints.BOTH;
        gbc.insets = new Insets(5, 5, 5, 5);
        pnl.add(lbl_Departamento, gbc);

        cbo_Padron = new JComboBox();
        cbo_Padron.addActionListener(this);
        cbo_Padron.setModel(cboModelPadron);
        gbc.gridx = 1;
        gbc.gridy = 0;
        gbc.fill = GridBagConstraints.BOTH;
        gbc.insets = new Insets(5, 5, 5, 5);
        pnl.add(cbo_Padron, gbc);

        CLabel lbl_Fecha = new CLabel("Fecha Inicio");
        gbc.gridx = 0;
        gbc.gridy = 1;
        gbc.fill = GridBagConstraints.BOTH;
        gbc.insets = new Insets(5, 5, 5, 5);
        pnl.add(lbl_Fecha, gbc);
        dc_fechainicio = new JDateChooser(new java.util.Date());
        gbc.gridx = 1;
        gbc.gridy = 1;
        gbc.fill = GridBagConstraints.BOTH;
        gbc.insets = new Insets(5, 5, 5, 5);
        pnl.add(dc_fechainicio, gbc);

        btnProcess = new JButton("Activar");
        btnProcess.addActionListener(this);
        gbc.gridx = 1;
        gbc.gridy = 2;
        gbc.fill = GridBagConstraints.BOTH;
        gbc.insets = new Insets(5, 5, 5, 5);
        pnl.add(btnProcess, gbc);

        setSize(350, 200);
        ComponentToolKit.centerComponentPosicion(this);
        setVisible(true);

    }

    private void loadPadron() {
        try {
            Propiedad p = new Propiedad();
            LogicPadrones lp = new LogicPadrones(p.getDbSys());
            ArrayList<Padrones> padrones = lp.listPadrones();
            if (id_tipo_anexo == 2) {
                padrones.remove(3);
            } else if (id_tipo_anexo == 1) {
                padrones.remove(0);
            }
            cboModelPadron = new ComboModelPadron(padrones);

        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, "Error: " + e.getMessage(), "Sistema", JOptionPane.OK_OPTION);
        }
    }

    private boolean verificarPadron() {
        if (cbo_Padron.getSelectedIndex() < 0) {
            JOptionPane.showMessageDialog(this, "Seleccione Padron");
            cbo_Padron.setBorder(new LineBorder(Color.RED));
            cbo_Padron.requestFocus();
            return false;
        }
        //Verificar Si no hay Ningun Dato
        if (modelAnexoPadron.getRowCount() > 0) {
            String idPadron = ((ComboModelPadron) cbo_Padron.getModel()).getElement(cbo_Padron.getSelectedIndex()).getIdPadron();
            for (int i = 0; i < modelAnexoPadron.getRowCount(); i++) {
                AnexoPadron beanPadron = modelAnexoPadron.getAnexoPadron(i);
                if (beanPadron.getIdPadron().equals(idPadron) && beanPadron.getEstado().equals("A")) {
                    JOptionPane.showMessageDialog(this, "Padron ya se Encuentra Activado");
                    return false;
                }
                if (idPadron.equals("01")) {
                    if ((beanPadron.getIdPadron().equals("02") || beanPadron.getIdPadron().equals("02")) && beanPadron.getEstado().equals("A")) {
                        JOptionPane.showMessageDialog(this, "Configuracion incompatible, Desactive AG. Percepcion y/o AG. Retencion");
                        return false;
                    }
                } else {
                    if (beanPadron.getIdPadron().equals("01") && beanPadron.getEstado().equals("A")) {
                        JOptionPane.showMessageDialog(this, "Configuracion incompatible, Desactive Exceptuado");
                        return false;
                    }
                }
                if (beanPadron.getIdPadron().equals(idPadron) && beanPadron.getEstado().equals("D")) {
                    java.util.Date fechaini = dc_fechainicio.getDate();
                    java.sql.Date ini = new java.sql.Date(fechaini.getTime());
                    System.out.println(ini.compareTo(beanPadron.getFecfin()));
                }
            }
        }
        return true;
    }

    @Override
    public void actionPerformed(ActionEvent e) {
        if (e.getSource() == btnProcess) {
            if (!verificarPadron()) {
                return;
            }
            //
            AnexoPadron beanAnexoPadron = new AnexoPadron();
            beanAnexoPadron.setIdPadron(((ComboModelPadron) cbo_Padron.getModel()).getElement(cbo_Padron.getSelectedIndex()).getIdPadron());
            beanAnexoPadron.setDescPadron(((ComboModelPadron) cbo_Padron.getModel()).getElement(cbo_Padron.getSelectedIndex()).getDescripcion());
            java.util.Date fechaini = dc_fechainicio.getDate();
            java.sql.Date ini = new java.sql.Date(fechaini.getTime());
            beanAnexoPadron.setFecInicio(ini);
            beanAnexoPadron.setEstado("A");
            beanAnexoPadron.setOperacion("I");
            dialog.setValueSearch(beanAnexoPadron, comp);
            dispose();
        }
    }

}
