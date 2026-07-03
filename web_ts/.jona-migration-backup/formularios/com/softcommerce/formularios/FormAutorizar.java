/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.softcommerce.formularios;

import com.softcommerce.general.controles.CPasswordField;
import com.softcommerce.general.controles.ComponentToolKit;
import com.softcommerce.reglasnegocio.RnUsuario;
import java.awt.BorderLayout;
import java.awt.Color;
import java.awt.Font;
import java.awt.Frame;
import java.awt.GridBagConstraints;
import java.awt.GridBagLayout;
import java.awt.Insets;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import javax.swing.JButton;
import javax.swing.JDialog;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import javax.swing.JTextField;

/**
 *
 * @author Team Develtrex
 */
public class FormAutorizar extends JDialog implements ActionListener {

    private boolean swAutorizar = false;
    private JTextField txtLogin;
    private CPasswordField txtPass;
    private JButton btnAceptar;
    private String id_correlativo;
    private java.net.URL path;

    public FormAutorizar(Frame arg0, String widCorrelativo, java.net.URL path) {
        super(arg0);
        this.id_correlativo = widCorrelativo;
        this.path = path;
        initialize();
        initListener();
    }

    private void initialize() {
        JPanel pnlPrincipal = new JPanel();
        pnlPrincipal.setLayout(new BorderLayout());
        setBackground(new Color(245, 245, 245));
        pnlPrincipal.add(getPnlCenter(), BorderLayout.CENTER);
        setContentPane(pnlPrincipal);
        setModal(true);
        setResizable(true);
        setTitle("Autorizar");
        pack();
        ComponentToolKit.centerComponentPosicion(this);
    }

    private JPanel getPnlCenter() {
        JPanel pnl = new JPanel();
        pnl.setLayout(new GridBagLayout());
        GridBagConstraints gbc = new GridBagConstraints();
        gbc.gridx = 0;
        gbc.gridy = 0;
        gbc.insets = new Insets(2, 2, 2, 2);
        gbc.anchor = GridBagConstraints.WEST;
        gbc.fill = GridBagConstraints.HORIZONTAL;
        JLabel lblLogin = new JLabel("Login");
        pnl.add(lblLogin, gbc);
        gbc.gridx = 1;
        txtLogin = new JTextField();
        txtLogin.setColumns(10);
        pnl.add(txtLogin, gbc);

        gbc.gridx = 0;
        gbc.gridy = 1;

        JLabel lblClave = new JLabel("Clave");
        pnl.add(lblClave, gbc);

        gbc.gridx = 1;
        txtPass = new CPasswordField(10);
        txtPass.setFont(new Font("Verdana", 0, 12));
        txtPass.setEchoChar('•');
        pnl.add(txtPass, gbc);

        gbc.gridx = 0;
        gbc.gridy = 2;
        gbc.gridwidth = 2;
        btnAceptar = new JButton("Aceptar");
        pnl.add(btnAceptar, gbc);

        return pnl;
    }

    private void initListener() {
        btnAceptar.addActionListener(this);
    }

    public boolean isSwAutorizar() {
        return swAutorizar;
    }

    private void validarLogin() {
        try {
            RnUsuario logic = new RnUsuario(path);
            String rpta = logic.validarUsuarioCorrelativo(txtLogin.getText().trim(), txtPass.getText().trim(), id_correlativo);
            System.out.println("corrr = " + id_correlativo);
            System.out.println("nombre= " + txtLogin.getText().trim());
            System.out.println("clave= " + txtPass.getText().trim());
            if (rpta.equals("S")) {
                swAutorizar = true;
                dispose();
            } else if (rpta.equals("N")) {
                JOptionPane.showMessageDialog(this, "NO TIENE PERMISO PARA ESTA OPERACION");
            } else {
                JOptionPane.showMessageDialog(this, rpta);
            }
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }

    @Override
    public void actionPerformed(ActionEvent e) {
        if (e.getSource().equals(btnAceptar)) {
            validarLogin();
        }
    }
}
