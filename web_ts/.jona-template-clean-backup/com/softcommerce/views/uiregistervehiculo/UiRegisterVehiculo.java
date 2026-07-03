/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.softcommerce.views.uiregistervehiculo;


import com.softcommerce.formularios.*;
import com.softcommerce.beans.BeanAnexo;
import com.softcommerce.beans.BeanVehiculo;
import com.softcommerce.beans.BeanMarcaVehiculo;
import com.softcommerce.beans.BeanModeloVehiculo;
import com.softcommerce.beans.Usuario;
import com.softcommerce.conta.formularios.FormBuscarAnexo;
import com.softcommerce.general.controles.ComponentToolKit;
import com.softcommerce.general.controles.IntegerDocument;
import com.softcommerce.general.controles.JHDialog;
import com.softcommerce.general.controles.UpperCaseNumberDocument;
import com.softcommerce.reglasnegocio.RnVehiculo;
import com.softcommerce.reglasnegocio.RnMarcaVehiculo;
import com.softcommerce.reglasnegocio.RnModeloVehiculo;
import com.softcommerce.reglasnegocio.RnAnexo;
import java.awt.BorderLayout;
import java.awt.Color;
import java.awt.Component;
import java.awt.Dimension;
import java.awt.Font;
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
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import javax.swing.BorderFactory;
import javax.swing.JCheckBox;
import javax.swing.JComboBox;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import javax.swing.JTextField;
import javax.swing.border.Border;
import javax.swing.border.LineBorder;
import javax.swing.border.TitledBorder;

/**
 *
 * @author Team Develtrex
 */
public class UiRegisterVehiculo extends JHDialog implements InterUiRegisterVehiculo, ActionListener, ItemListener, KeyListener, FocusListener, MouseListener {

    protected Usuario usuario;
    protected JTextField txtCodigo;
    protected JTextField txtPlaca;
    protected JTextField txtConstacia;
    protected JTextField txtPeso;
    protected JTextField txtTransportista;
    protected JTextField txtTransportistaDesc;
    protected JComboBox cboMarca;
    protected List<BeanMarcaVehiculo> xMarcaVehiculo;
    protected JComboBox cboModelo;
    protected List<BeanModeloVehiculo> xModeloVehiculo;
    protected BeanVehiculo beanVehiculo;
    protected JCheckBox chkEstado;
    protected JFrame frame;

    public UiRegisterVehiculo(JFrame arg0, Usuario usuario, BeanVehiculo wVehiculo) {
        super(arg0, true);
        this.usuario = usuario;
        this.beanVehiculo = wVehiculo;
        this.frame = arg0;
        inicialize();
        initListener();
    }

    protected void inicialize() {
        JPanel pnl_dialog = new JPanel();
        pnl_dialog.setLayout(new BorderLayout());
        pnl_dialog.setBackground(new Color(245, 245, 245));
        Border border = BorderFactory.createTitledBorder(null, "Datos de Vehiculo", TitledBorder.LEFT, TitledBorder.DEFAULT_POSITION, new Font("Comic Sans MS", 0, 12), Color.BLACK);
        JPanel pnlPromocion = new JPanel();
        pnlPromocion.setLayout(new GridBagLayout());
        pnlPromocion.setBackground(new Color(245, 245, 245));
        pnlPromocion.setBorder(border);
        GridBagConstraints gbc = new GridBagConstraints();
        gbc.gridx = 0;
        gbc.gridy = 0;
        gbc.insets = new Insets(2, 2, 2, 2);
        gbc.anchor = GridBagConstraints.WEST;

        JLabel lbl_Codigo = new JLabel("Código");
        pnlPromocion.add(lbl_Codigo, gbc);

        txtCodigo = new JTextField();
        txtCodigo.setEditable(false);
        gbc.gridx = 1;
        txtCodigo.setColumns(5);
        pnlPromocion.add(txtCodigo, gbc);

        JLabel lbl_Abrev = new JLabel("Marca");
        gbc.gridx = 0;
        gbc.gridy = 1;
        pnlPromocion.add(lbl_Abrev, gbc);

        cboMarca = new JComboBox();
        gbc.gridx = 1;
        gbc.gridwidth = 2;
        pnlPromocion.add(cboMarca, gbc);
        gbc.gridwidth = 1;

        JLabel lbl_Modelo = new JLabel("Modelo");
        gbc.gridx = 0;
        gbc.gridy = 2;
        pnlPromocion.add(lbl_Modelo, gbc);

        cboModelo = new JComboBox();
        gbc.gridx = 1;
        gbc.gridwidth = 2;
        pnlPromocion.add(cboModelo, gbc);
        gbc.gridwidth = 1;

        JLabel lblVendedor = new JLabel("Propietario");
        gbc.gridx = 0;
        gbc.gridy = 3;
        pnlPromocion.add(lblVendedor, gbc);

        gbc.gridx = 1;
        txtTransportista = new JTextField();
        txtTransportista.setDocument(new IntegerDocument(11));
        txtTransportista.setColumns(7);
        gbc.insets = new Insets(2, 1, 2, 0);
        pnlPromocion.add(txtTransportista, gbc);

        txtTransportistaDesc = new JTextField();
        txtTransportistaDesc.setEnabled(false);
        gbc.insets = new Insets(2, 0, 2, 0);
        gbc.gridx = 2;
        txtTransportistaDesc.setColumns(25);
        pnlPromocion.add(txtTransportistaDesc, gbc);

        JLabel lbl_Descripcion = new JLabel("Placa");
        gbc.gridx = 0;
        gbc.gridy = 4;
        pnlPromocion.add(lbl_Descripcion, gbc);

        txtPlaca = new JTextField();
        gbc.gridx = 1;
        gbc.gridwidth = 2;
        txtPlaca.setDocument(new UpperCaseNumberDocument(30));
        txtPlaca.setColumns(15);
        pnlPromocion.add(txtPlaca, gbc);
        gbc.gridwidth = 1;

        JLabel lbl_Constancia = new JLabel("Const inscripcion");
        gbc.gridx = 0;
        gbc.gridy = 5;
        pnlPromocion.add(lbl_Constancia, gbc);

        txtConstacia = new JTextField();
        gbc.gridx = 1;
        gbc.gridwidth = 2;
        txtConstacia.setDocument(new UpperCaseNumberDocument(30));
        txtConstacia.setColumns(15);
        pnlPromocion.add(txtConstacia, gbc);
        gbc.gridwidth = 1;

        JLabel lbl_Peso = new JLabel("Peso(KG)");
        gbc.gridx = 0;
        gbc.gridy = 6;
        pnlPromocion.add(lbl_Peso, gbc);

        txtPeso = new JTextField();
        gbc.gridx = 1;
        txtPeso.setDocument(new IntegerDocument(10));
        txtPeso.setColumns(7);
        txtPeso.setText("0");
        pnlPromocion.add(txtPeso, gbc);

        gbc.insets = new Insets(2, 2, 2, 2);

        chkEstado = new JCheckBox("Activo");
        gbc.gridx = 1;
        gbc.gridy = 7;
        pnlPromocion.add(chkEstado, gbc);

        pnl_dialog.add(pnlPromocion, BorderLayout.CENTER);

        setTitleName("Vehiculo");
        getContentPane().add(pnl_dialog);
        setMinimumSize(new Dimension(600, 250));
        this.pack();
        ComponentToolKit.centerComponentPosicion(this);
    }

    protected void initListener() {
        txtPlaca.addKeyListener(this);
        txtPlaca.addFocusListener(this);
        txtConstacia.addKeyListener(this);
        txtConstacia.addFocusListener(this);
        txtPeso.addKeyListener(this);
        txtPeso.addFocusListener(this);
        txtTransportista.addKeyListener(this);
        txtTransportista.addMouseListener(this);
        txtTransportista.addFocusListener(this);
    }

    protected void cargarMarca(String id_marca) {
    }

    protected void cargarModelo(String id_modelo) {
    }

    protected void loadMarca() throws Exception {
    }

    protected void loadModelo() throws Exception {
    }

    protected void buscarTransportista(JTextField txtAnexo, JTextField txtAnexoDesc) {
    }

    @Override
    public boolean isRegisterValid() {
        return false;
    }

    @Override
    public void showMessagePrint(String codigo) {
    }

    @Override
    public void setRegisterEnabled(boolean flag) {
    }

    @Override
    public void setRegisterEditable(boolean flag) {
        txtConstacia.setEditable(flag);
        txtPeso.setEditable(flag);
        txtPlaca.setEditable(flag);
        txtTransportista.setEditable(flag);
        cboMarca.setEnabled(flag);
        cboModelo.setEnabled(flag);
    }

    @Override
    public void loadCombo() {
    }

    @Override
    public void newRegister() {
    }

    @Override
    public boolean loadRegister() {
        return false;
    }

    @Override
    public boolean loadRegister(Object o) {
        return false;
    }

    @Override
    public void setValueSearch(Object valor, Component comp) {
    }

    @Override
    public void showMessageSuccessfulInsert() {
    }

    @Override
    public void showMessageSuccessfulUpdate() {
    }

    @Override
    public void showMessageSuccessfulDelete() {
    }

    @Override
    public void showMessageErrorDelete() {
    }

    @Override
    public void showMessageErrorUpdate() {
    }

    @Override
    public void showMessageErrorInsert() {
    }

    @Override
    public String executeInsert() {
        return null;
    }

    @Override
    public String executeUpdate() {
        return null;
    }

    @Override
    public boolean executeDelete() {
        return false;
    }

    @Override
    public boolean executeAnular() {
        return false;
    }

    @Override
    public boolean executeSelect() {
        return false;
    }

    @Override
    public void actionPerformed(ActionEvent e) {
    }

    @Override
    public void itemStateChanged(ItemEvent e) {
    }

    @Override
    public void keyTyped(KeyEvent e) {
    }

    @Override
    public void keyPressed(KeyEvent e) {
        if (e.getKeyCode() == KeyEvent.VK_ESCAPE) {
            dispose();
        }
        if (e.getKeyChar() == '\n') {
            if (e.getSource() == txtPlaca) {
                setFocusAndClick();
            }
            if (e.getSource() == txtCodigo) {
                setFocusAndClick();
            }
            if (e.getSource() == txtTransportista) {
                buscarTransportista(txtTransportista, txtTransportistaDesc);
            }
        }
        if (e.getKeyChar() == KeyEvent.VK_DELETE || e.getKeyChar() == KeyEvent.VK_BACK_SPACE) {
            if (e.getSource() == txtTransportista) {
                txtTransportistaDesc.setText("");
            }
        }
    }

    @Override
    public void keyReleased(KeyEvent e) {
    }

    @Override
    public void focusGained(FocusEvent e) {
        if (txtPlaca == e.getSource()) {
            txtPlaca.selectAll();
        }
        if (txtConstacia == e.getSource()) {
            txtConstacia.selectAll();
        }
        if (txtPeso == e.getSource()) {
            txtPeso.selectAll();
        }
        if (txtTransportista == e.getSource()) {
            txtTransportista.selectAll();
        }
    }

    @Override
    public void focusLost(FocusEvent e) {
    }

    @Override
    public void mouseClicked(MouseEvent e) {
        if (e.getClickCount() == 2) {
            if (e.getSource() == txtTransportista) {
                buscarTransportista(txtTransportista, txtTransportistaDesc);
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
}
