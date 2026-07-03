/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.softcommerce.views.uiformautorizar;


import com.softcommerce.formularios.*;
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
public class UiFormAutorizar extends JDialog implements InterUiFormAutorizar, ActionListener {

    protected boolean swAutorizar = false;
    protected JTextField txtLogin;
    protected CPasswordField txtPass;
    protected JButton btnAceptar;
    protected String id_correlativo;
    protected java.net.URL path;

    public UiFormAutorizar(Frame arg0, String widCorrelativo, java.net.URL path) {
        super(arg0);
        this.id_correlativo = widCorrelativo;
        this.path = path;
        initialize();
        initListener();
    }

    protected void initialize() {
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

    protected JPanel getPnlCenter() {
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

    protected void initListener() {
        btnAceptar.addActionListener(this);
    }

    public boolean isSwAutorizar() {
        return swAutorizar;
    }

    protected void validarLogin() {
    }

    @Override
    public void actionPerformed(ActionEvent e) {
        if (e.getSource().equals(btnAceptar)) {
            validarLogin();
        }
    }
}
